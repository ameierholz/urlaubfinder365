/**
 * Lädt Hotels mit Coordinates für eine Liste von Catalog-Slugs.
 *
 *   GET /api/map/hotels?slugs=mallorca,ibiza,menorca&limit=20
 *
 * Pro Slug wird die Specials.de package/teaser.json API gerufen — die liefert
 * pro Offer ein Hotel mit lat/lng, Sterne, Preis, Image und Buchungs-URL.
 * Wir aggregieren über alle gewünschten Slugs und cachen pro Slug 1h.
 */

import { NextRequest, NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog-regions";
import { getEffectiveIbeRegionIds } from "@/lib/catalog-helpers";
import type { HotelMarker } from "@/lib/map/marker-types";
import type { TravelOffer } from "@/types";

export const runtime = "nodejs";
export const revalidate = 3600; // 1h Page-Level cache

const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";
const API_BASE = "https://api.specials.de/package/teaser.json";

interface HotelsResponse {
  hotels: HotelMarker[];
  count: number;
  errors: string[];
}

async function fetchHotelsForSlug(slug: string, limit: number): Promise<HotelMarker[]> {
  const entry = CATALOG.find((e) => e.slug === slug);
  if (!entry) return [];

  const regionIds = getEffectiveIbeRegionIds(slug);
  if (regionIds.length === 0) return [];

  const url = new URL(API_BASE);
  url.searchParams.set("agent",        AGENT_ID);
  url.searchParams.set("regionId",     regionIds.join(","));
  url.searchParams.set("duration",     "7-7");
  url.searchParams.set("adults",       "2");
  url.searchParams.set("from",         "14");
  url.searchParams.set("to",           "60");
  url.searchParams.set("minCat",       "3");
  url.searchParams.set("minRecommrate","60");
  url.searchParams.set("hSort",        "recomrate");
  url.searchParams.set("sortType",     "down");
  url.searchParams.set("limit",        String(limit));

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1h Cache pro slug
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const json = JSON.parse(text);
    const raw  = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: TravelOffer[] = raw?.data ?? [];
    if (!Array.isArray(data) || data.length === 0) return [];

    // Eindeutig pro Hotel (gleiches Hotel kann mehrmals mit unterschiedlichen Boards kommen)
    const seen = new Set<string>();
    const out: HotelMarker[] = [];

    for (const o of data) {
      const lat = parseFloat(o.geo_codes?.latitude ?? "");
      const lng = parseFloat(o.geo_codes?.longitude ?? "");
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) continue;

      const key = o.giata_id || o.product_code;
      if (seen.has(key)) continue;
      seen.add(key);

      const price = Number(o.offer_price_adult);
      if (!Number.isFinite(price) || price <= 0) continue;

      out.push({
        id:              `hotel-${key}`,
        kind:            "hotel",
        lat,
        lng,
        title:           o.hotel_name ?? "Hotel",
        productCode:     o.product_code,
        hotelName:       o.hotel_name ?? "Hotel",
        category:        Number(o.hotel_category ?? 0),
        destination:     o.city_name || o.region_name || entry.name,
        country:         o.country_name || entry.country,
        imageUrl:        o.images?.medium || o.images?.small || undefined,
        priceFrom:       Math.round(price),
        rating:          Number(o.rating?.overall ?? 0),
        recommendation:  Number(o.rating?.recommendation ?? 0),
        bookingUrl:      o.href,
        destinationSlug: slug,
      });
    }

    return out;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<HotelsResponse>> {
  const slugsParam = req.nextUrl.searchParams.get("slugs") ?? "";
  const limit      = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "20"), 30);

  const slugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10); // max 10 Slugs pro Request

  if (slugs.length === 0) {
    return NextResponse.json({ hotels: [], count: 0, errors: ["no slugs"] });
  }

  // Parallel fetch aller Slugs
  const results = await Promise.all(slugs.map((s) => fetchHotelsForSlug(s, limit)));
  const hotels  = results.flat();

  return NextResponse.json(
    { hotels, count: hotels.length, errors: [] },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
      },
    }
  );
}
