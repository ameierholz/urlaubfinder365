import { NextRequest, NextResponse } from "next/server";

const IBE_SUGGEST_URL = "https://ibe.specials.de/";
const AGENT = "993243";

interface SuggestRegion { code: string; name: string; superRegion?: { code: string; name: string } }
interface SuggestLocation { code: string; name: string; region?: { code: string; name: string } }
interface SuggestCountry { code: string; name: string }
interface SuggestHotel {
  code: string; name: string; category?: string;
  location?: { code: string; name: string };
  region?: { code: string; name: string };
  ratings?: number | null; overall?: number | null; recommendation?: number | null;
}

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

    // Regionen
    const regions = (data.regionList ?? [] as SuggestRegion[]).slice(0, 10).map((r: SuggestRegion) => ({
      name: r.name,
      regionCode: r.code,
      parent: r.superRegion?.name ?? "",
      type: "region",
    }));

    // Orte/Städte
    const locations = (data.locationList ?? [] as SuggestLocation[])
      .filter((l: SuggestLocation) => !l.name.startsWith("Kreuzfahrt") && !l.name.startsWith("Rundreise"))
      .slice(0, 8)
      .map((l: SuggestLocation) => ({
        name: l.name,
        regionCode: l.region?.code ?? "",
        cityCode: l.code,
        parent: l.region?.name ?? "",
        type: "city",
      }));

    // Hotels (Top 8, nur mit Bewertungen oder ≥4 Sterne)
    const hotels = (data.giataHotelList ?? [] as SuggestHotel[])
      .slice(0, 8)
      .map((h: SuggestHotel) => ({
        name: h.name,
        regionCode: h.region?.code ?? "",
        giataId: h.code,
        parent: [h.location?.name, h.region?.name].filter(Boolean).join(", "),
        type: "hotel",
        stars: h.category ? Number(h.category) : null,
        rating: h.overall ? Math.round(Number(h.overall)) : null,
      }));

    // Länder
    const countries = (data.countryList ?? [] as SuggestCountry[]).slice(0, 3).map((c: SuggestCountry) => ({
      name: c.name,
      regionCode: c.code,
      parent: "",
      type: "country",
    }));

    // Zusammenführen: Regionen > Orte > Hotels > Länder
    const results = [...regions, ...locations, ...hotels, ...countries];

    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
