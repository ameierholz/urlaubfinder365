import { NextRequest, NextResponse } from "next/server";

const IBE_SUGGEST_URL = "https://ibe.specials.de/";
const AGENT = "993243";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  try {
    const params = new URLSearchParams({
      action: "suggest",
      agent: AGENT,
      product: "package",
      language: "de",
      searchTerm: q,
      rd_type: "json",
    });

    const res = await fetch(`${IBE_SUGGEST_URL}?${params}`, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();

    // Regionen (Hauptergebnisse)
    const regions = (data.regionList ?? []).slice(0, 15).map((r: { code: string; name: string; superRegion?: { name: string } }) => ({
      name: r.name,
      regionCode: r.code,
      parent: r.superRegion?.name ?? "",
      type: "region" as const,
    }));

    // Orte/Städte
    const locations = (data.locationList ?? [])
      .filter((l: { name: string }) => !l.name.startsWith("Kreuzfahrt") && !l.name.startsWith("Rundreise"))
      .slice(0, 10)
      .map((l: { code: string; name: string; region?: { code: string; name: string } }) => ({
        name: l.name,
        regionCode: l.region?.code ?? "",
        parent: l.region?.name ?? "",
        type: "city" as const,
      }));

    // Länder
    const countries = (data.countryList ?? []).slice(0, 5).map((c: { code: string; name: string }) => ({
      name: c.name,
      regionCode: c.code,
      parent: "",
      type: "country" as const,
    }));

    // Zusammenführen: Regionen > Orte > Länder
    const results = [...regions, ...locations, ...countries].slice(0, 25);

    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
