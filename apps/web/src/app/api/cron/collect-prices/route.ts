/**
 * Vercel Cron Job – täglich in 3 Läufen:
 *   03:00  ?profile=pauschal  – Pauschalreisen (min. 3★, ≥50 % Empfehlung)
 *   04:00  ?profile=hotel     – Nur Hotel exkl. All-Inclusive
 *   05:00  ?profile=ai        – All-Inclusive
 *
 * Manueller Aufruf:
 *   GET /api/cron/collect-prices?profile=pauschal
 *   Header: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog-regions";
import { upsertPriceTrendProfile, checkAndUpdateAlerts } from "@/lib/supabase-db-admin";
import { sendPushToUsers } from "@/lib/web-push";
import type { PriceSnapshot, PriceProfileId } from "@/types";

// Vercel Hobby: 60 s, Pro: 300 s
export const maxDuration = 60;

const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";
const BASE_URL = "https://api.specials.de/package/teaser.json";
const DURATION = "6-8";
const LIMIT    = "30"; // mehr Angebote wegen Board-Filterung

// ── Profil-Konfiguration ─────────────────────────────────────────────────────

const AI_BOARDS    = ["AI", "UAI", "ALL INCLUSIVE", "ALL-INCLUSIVE"];
const HOTEL_BOARDS = ["RO", "BB", "HB", "FB", "HP", "VP"]; // alles außer AI

const PROFILES = {
  pauschal: {
    label:         "Pauschalreise",
    boardFilter:   null as string[] | null,
    excludeBoards: null as string[] | null,
    minCat:        "3",
    minRecommrate: "50",
    fromDays:      null as string | null,
    toDays:        null as string | null,
  },
  hotel: {
    label:         "Nur Hotel",
    boardFilter:   HOTEL_BOARDS,
    excludeBoards: null as string[] | null,
    minCat:        "3",
    minRecommrate: "50",
    fromDays:      null as string | null,
    toDays:        null as string | null,
  },
  ai: {
    label:         "All-Inclusive",
    boardFilter:   AI_BOARDS,
    excludeBoards: null as string[] | null,
    minCat:        "3",
    minRecommrate: "50",
    fromDays:      null as string | null,
    toDays:        null as string | null,
  },
  last_minute: {
    label:         "Last Minute",
    boardFilter:   null as string[] | null,
    excludeBoards: null as string[] | null,
    minCat:        "3",
    minRecommrate: "40",
    fromDays:      "3",
    toDays:        "21",
  },
} satisfies Record<PriceProfileId, {
  label: string;
  boardFilter: string[] | null;
  excludeBoards: string[] | null;
  minCat: string;
  minRecommrate: string;
  fromDays: string | null;
  toDays: string | null;
}>;

// ── API-Fetch ─────────────────────────────────────────────────────────────────

interface RawOffer {
  offer_price_adult: number;
  board_code: string;
  hotel_category: number;
  rating: { recommendation: number };
}

async function fetchMinPriceForProfile(
  ibeRegionId: string,
  profile: typeof PROFILES[PriceProfileId]
): Promise<{ minPrice: number; avgPrice: number; dealCount: number } | null> {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("agent",        AGENT_ID);
    url.searchParams.set("duration",     DURATION);
    url.searchParams.set("regionId",     ibeRegionId);
    url.searchParams.set("limit",        LIMIT);
    url.searchParams.set("minCat",       profile.minCat);
    url.searchParams.set("minRecommrate",profile.minRecommrate);
    if (profile.fromDays) url.searchParams.set("from", profile.fromDays);
    if (profile.toDays)   url.searchParams.set("to",   profile.toDays);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    if (json.error || !Array.isArray(json.data) || json.data.length === 0) return null;

    let offers: RawOffer[] = json.data as RawOffer[];

    // Board-Code-Filterung (case-insensitive Präfix-Match)
    if (profile.boardFilter) {
      const filter = profile.boardFilter.map((b) => b.toUpperCase());
      offers = offers.filter((o) => {
        const bc = (o.board_code ?? "").toUpperCase();
        return filter.some((f) => bc === f || bc.startsWith(f));
      });
    }

    const prices = offers
      .map((o) => Number(o.offer_price_adult))
      .filter((p) => p > 50);

    if (prices.length === 0) return null;

    return {
      minPrice:  Math.min(...prices),
      avgPrice:  Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      dealCount: prices.length,
    };
  } catch {
    return null;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Auth
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 2. Profil aus Query-Param (default: pauschal)
  const profileParam = req.nextUrl.searchParams.get("profile") ?? "pauschal";
  if (!(profileParam in PROFILES)) {
    return NextResponse.json(
      { error: `Ungültiges Profil: ${profileParam}. Erlaubt: pauschal, hotel, ai, last_minute` },
      { status: 400 }
    );
  }
  const profileId = profileParam as PriceProfileId;
  const profile   = PROFILES[profileId];

  const today = new Date().toISOString().split("T")[0];

  // 3. Destinationen mit gültiger Region-ID
  const destinations = CATALOG.filter(
    (e) => e.ibeRegionId && Number(e.ibeRegionId) > 0
  );

  const results = {
    date:          today,
    profile:       profileId,
    profileLabel:  profile.label,
    total:         destinations.length,
    success:       0,
    failed:        0,
    skipped:       0,
    alertsMatched: 0,
  };

  // 4. In 5er-Batches verarbeiten
  for (let i = 0; i < destinations.length; i += 5) {
    const batch = destinations.slice(i, i + 5);

    await Promise.all(
      batch.map(async (dest) => {
        const priceData = await fetchMinPriceForProfile(dest.ibeRegionId, profile);

        if (!priceData) {
          results.skipped++;
          return;
        }

        const snapshot: PriceSnapshot = {
          date:      today,
          minPrice:  priceData.minPrice,
          avgPrice:  priceData.avgPrice,
          dealCount: priceData.dealCount,
        };

        try {
          await upsertPriceTrendProfile(dest.slug, dest.name, profileId, snapshot);

          // Preisalarme nur beim Pauschalreise-Profil prüfen (generischster Preis)
          if (profileId === "pauschal") {
            const { count, userIds } = await checkAndUpdateAlerts(
              dest.slug,
              priceData.minPrice,
              priceData.dealCount
            );
            results.alertsMatched += count;

            // Web Push an betroffene User senden (fire & forget)
            if (userIds.length > 0) {
              sendPushToUsers(userIds, {
                title: `Preisalarm: ${dest.name}`,
                body:  `Ab ${priceData.minPrice} €/Person – dein Wunschpreis ist erreicht!`,
                url:   `/dashboard?tab=pricealerts`,
              }).catch(() => {});
            }
          }

          results.success++;
        } catch (err) {
          console.error(`[collect-prices/${profileId}] Fehler bei ${dest.slug}:`, err);
          results.failed++;
        }
      })
    );

    if (i + 5 < destinations.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  console.log(`[collect-prices/${profileId}] Ergebnis:`, results);
  return NextResponse.json({ ok: true, ...results });
}
