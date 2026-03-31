import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.specials.de/package/teaser.json";
const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";

/**
 * GET /api/theme-offers
 *
 * Themen-basierte Angebote – kein regionId erforderlich.
 * Params:
 *   keywords       – z.B. "ado" / "bea,ben" / "wel"
 *   maxPrice       – max. Preis pro Person in EUR
 *   adults         – Anzahl Erwachsene (default "2")
 *   children       – Anzahl Kinder (default "")
 *   from           – Abflug frühestens in X Tagen (default "14")
 *   to             – Abflug spätestens in X Tagen (default "365")
 *   duration       – z.B. "7-7" (default "7-7")
 *   category       – Mindest-Sternekategorie (default "3")
 *   minRecommrate  – Mindest-Empfehlungsrate 0–100 (default "50")
 *   boardCode      – z.B. "AI" für All Inclusive
 *   limit          – Anzahl Ergebnisse (default "12")
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const keywords     = sp.get("keywords")     ?? "";
  const maxPrice     = sp.get("maxPrice")     ?? "";
  const adults       = sp.get("adults")       || "2";
  const children     = sp.get("children")     ?? "";
  const from         = sp.get("from")         || "14";
  const to           = sp.get("to")           || "365";
  const duration     = sp.get("duration")     || "7-7";
  const category     = sp.get("category")     || "3";
  const minRecommrate = sp.get("minRecommrate") || "50";
  const boardCode    = sp.get("boardCode")    ?? "";
  const limit        = Number(sp.get("limit") || "12");

  const url = new URL(BASE_URL);
  url.searchParams.set("agent",         AGENT_ID);
  url.searchParams.set("from",          from);
  url.searchParams.set("to",            to);
  url.searchParams.set("duration",      duration);
  url.searchParams.set("adults",        adults);
  url.searchParams.set("category",      category);
  url.searchParams.set("minRecommrate", minRecommrate);
  url.searchParams.set("limit",         String(limit + 20)); // mehr laden für Qualitätsfilter

  if (keywords)  url.searchParams.set("keywords",  keywords);
  if (maxPrice)  url.searchParams.set("maxPrice",  maxPrice);
  if (children)  url.searchParams.set("children",  children);
  if (boardCode) url.searchParams.set("boardCode", boardCode);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // 30 min Cache
    });

    if (!res.ok) {
      return NextResponse.json({ offers: [] }, { status: 200 });
    }

    const json = await res.json();
    let offers = (json.data ?? json.packages ?? json.items ?? []) as Record<string, unknown>[];

    // Duplikat-Filter nach hotel_name
    const seen = new Set<string>();
    offers = offers.filter((o) => {
      const name = String(o.hotel_name ?? o.hotelName ?? "");
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    return NextResponse.json(
      { offers: offers.slice(0, limit) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return NextResponse.json({ offers: [] });
  }
}
