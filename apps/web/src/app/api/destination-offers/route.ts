import { NextRequest, NextResponse } from "next/server";

const BASE_URL  = "https://api.specials.de/package/teaser.json";
const AGENT_ID  = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";

/**
 * GET /api/destination-offers
 *
 * Params (all optional except regionId):
 *   regionId       – specials.de regionId, z.B. "149"
 *   cityId         – specials.de cityId, z.B. "930"
 *   duration       – z.B. "7-7"  (default "7-7")
 *   from           – Abflug frühestens in X Tagen (default "14")
 *   to             – Abflug spätestens in X Tagen (default "42")
 *   adults         – Anzahl Erwachsene (default "2")
 *   category       – Mindest-Sternekategorie (default "3")
 *   minRecommrate  – Mindest-Empfehlungsrate 0–100 (default "40")
 *   boardCode      – Verpflegung: "AI" = All Inclusive (client-side filter)
 *   excludeAi      – "true" = All-Inclusive ausschließen (client-side filter)
 *   limit          – Anzahl Ergebnisse (default "9")
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const regionId      = sp.get("regionId")      ?? "";
  const cityId        = sp.get("cityId")        ?? "";
  const duration      = sp.get("duration")      || "7-7";
  const from          = sp.get("from")          || "14";
  const to            = sp.get("to")            || "42";
  const adults        = sp.get("adults")        || "2";
  const category      = sp.get("category")      || "3";
  const minRecommrate = sp.get("minRecommrate") || "40";
  const boardCode     = sp.get("boardCode")     || "";   // für client-side filter
  const excludeAi     = sp.get("excludeAi")     === "true";
  const limit         = sp.get("limit")         || "9";

  if (!regionId) {
    return NextResponse.json({ error: "regionId fehlt" }, { status: 400 });
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("agent",         AGENT_ID);
  url.searchParams.set("regionId",      regionId);
  url.searchParams.set("duration",      duration);
  url.searchParams.set("limit",         String(Number(limit) + 10)); // etwas mehr laden, client filtert
  if (cityId)   url.searchParams.set("cityId",   cityId);
  if (adults)   url.searchParams.set("adults",   adults);
  if (category) url.searchParams.set("category", category);
  if (from)     url.searchParams.set("from",     from);
  if (to)       url.searchParams.set("to",       to);
  if (minRecommrate) url.searchParams.set("minRecommrate", minRecommrate);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `API Fehler: ${res.status}` }, { status: 502 });
    }

    const json = await res.json();
    let offers = (json.data ?? []) as Record<string, unknown>[];

    // Client-side Board-Filter
    if (boardCode) {
      offers = offers.filter((o) => o.board_code === boardCode);
    }
    if (excludeAi) {
      offers = offers.filter((o) => o.board_code !== "AI");
    }

    return NextResponse.json(
      { offers: offers.slice(0, Number(limit)) },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    console.error("destination-offers API error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
