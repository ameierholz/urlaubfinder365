/**
 * Vercel Cron – täglich 07:00 UTC
 * Holt alle Reisewarnungen vom Auswärtigen Amt (Open Data API)
 * und schreibt sie in die travel_warnings-Tabelle.
 *
 * Manueller Aufruf:
 *   GET /api/cron/sync-travel-warnings
 *   Header: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime    = "nodejs";
export const maxDuration = 300;

const AA_API = "https://www.auswaertiges-amt.de/opendata/travelwarning";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface AaItem {
  iso3CountryCode?: string;
  countryCode?: string;
  countryName?: string;
  warning?: boolean;
  partialWarning?: boolean;
  situationDescription?: string;
  lastUpdated?: string;
}

function warningLevel(item: AaItem): "warning" | "partial" | "note" | "none" {
  if (item.warning)        return "warning";
  if (item.partialWarning) return "partial";
  if (item.situationDescription && item.situationDescription.trim().length > 50) return "note";
  return "none";
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    const res = await fetch(AA_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    raw = await res.json();
  } catch (err) {
    return NextResponse.json({ error: "AA API unreachable", detail: String(err) }, { status: 502 });
  }

  // Flexibles Parsing – API gibt entweder response.items oder direkt ein Array
  let items: AaItem[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj["response"])) items = obj["response"] as AaItem[];
    else if (obj["response"] && typeof obj["response"] === "object") {
      const resp = obj["response"] as Record<string, unknown>;
      if (Array.isArray(resp["items"])) items = resp["items"] as AaItem[];
    } else if (Array.isArray(obj["items"])) {
      items = obj["items"] as AaItem[];
    }
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Leere AA-Antwort", raw: JSON.stringify(raw).slice(0, 500) }, { status: 502 });
  }

  const supabase = db();
  let upserted = 0;
  let skipped  = 0;

  for (const item of items) {
    if (!item.iso3CountryCode || !item.countryName) { skipped++; continue; }

    const level = warningLevel(item);
    const sourceUrl = `https://www.auswaertiges-amt.de/de/service/laender-reisewarnungen/-/231198`;

    const { error } = await supabase.from("travel_warnings").upsert(
      {
        iso3_country_code: item.iso3CountryCode,
        iso2_country_code: item.countryCode ?? null,
        country_name:      item.countryName,
        warning_level:     level,
        situation_short:   item.situationDescription?.slice(0, 600) ?? null,
        source_url:        sourceUrl,
        aa_last_updated:   item.lastUpdated ?? null,
        fetched_at:        new Date().toISOString(),
      },
      { onConflict: "iso3_country_code" }
    );

    if (error) { skipped++; console.error("upsert error", item.iso3CountryCode, error); }
    else upserted++;
  }

  return NextResponse.json({
    ok: true,
    total: items.length,
    upserted,
    skipped,
    ts: new Date().toISOString(),
  });
}
