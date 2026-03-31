import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy für api.specials.de/package/teaser.json
 * Umgeht CORS-Einschränkungen beim direkten Browser-Aufruf.
 * Genutzt von ibe-engine.js (client-side IBE Teaser).
 */

const AGENT    = "993243";
const API_BASE = "https://api.specials.de/package/teaser.json";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  // Alle Parameter durchreichen die api.specials.de versteht
  const params = new URLSearchParams({ agent: AGENT });
  for (const key of [
    "regionId", "cityId", "countryId",
    "from", "to", "duration", "adults", "children",
    "category", "boardCode", "minRecommrate",
    "keywords", "maxPrice",
    "hSort", "sortType", "limit",
  ]) {
    const val = sp.get(key);
    if (val) params.set(key, val);
  }

  // Defaults setzen falls nicht übergeben
  if (!params.has("from"))     params.set("from", "14");
  if (!params.has("to"))       params.set("to", "42");
  if (!params.has("duration")) params.set("duration", "7-7");
  if (!params.has("adults"))   params.set("adults", "2");
  if (!params.has("limit"))    params.set("limit", "200");

  try {
    const res = await fetch(`${API_BASE}?${params}`, {
      next: { revalidate: 600 }, // 10 min Cache
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ data: [] });
    }

    // api.specials.de liefert manchmal { contents: "..." } (doppelt-encoded)
    const raw = (json as Record<string, unknown>)?.contents
      ? JSON.parse(String((json as Record<string, unknown>).contents))
      : json;

    return NextResponse.json(raw, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
