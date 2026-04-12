import { NextRequest, NextResponse } from "next/server";

const AGENT = "993243";
const API_BASE = "https://api.specials.de/package/teaser.json";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=70&auto=format";

export const runtime = "nodejs";

/** Resolve hotel image URL from various API response shapes */
function resolveImage(o: Record<string, unknown>): string {
  const images = o.images;
  if (images && typeof images === "object" && !Array.isArray(images)) {
    const m = images as Record<string, string>;
    const img = m.large || m.medium || m.small;
    if (img) return img;
  }
  for (const k of ["image_url", "imageUrl", "picture", "hotelImage"]) {
    const v = String(o[k] ?? "");
    if (v.length > 20 && !/destination|region|map|default/i.test(v)) return v;
  }
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    const url = (first as Record<string, string>)?.url;
    if (url) return url;
  }
  return FALLBACK_IMG;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("countryId");
  const regionId  = searchParams.get("regionId");
  const from          = searchParams.get("from")          ?? "14";
  const to            = searchParams.get("to")            ?? "42";
  const duration      = searchParams.get("duration")      ?? "7-7";
  const adults        = searchParams.get("adults")        ?? "2";
  const minRecommrate = searchParams.get("minRecommrate") ?? "50";

  if (!countryId && !regionId) {
    return NextResponse.json({ offers: [] });
  }

  const params = new URLSearchParams({
    agent: AGENT, from, to, duration, adults,
    minRecommrate, hSort: "recomrate", sortType: "down",
    limit: "200",
  });
  if (countryId) params.set("countryId", countryId);
  if (regionId && !countryId) params.set("regionId", regionId);

  const url = `${API_BASE}?${params}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return NextResponse.json({ offers: [] });

    const text = await res.text();
    let raw: Record<string, unknown>[] = [];
    try {
      const json = JSON.parse(text);
      const unwrapped = json?.contents ? JSON.parse(String(json.contents)) : json;
      raw = unwrapped?.data ?? unwrapped?.packages ?? unwrapped?.items ?? unwrapped?.offers ?? [];
    } catch {
      return NextResponse.json({ offers: [] });
    }

    // Sort by recommendation rate descending (matches IBE hSort=recomrate&sortType=down)
    const sorted = [...raw].sort((a, b) => {
      const ra = parseFloat(String((a.rating as Record<string,string>)?.recommendation ?? a.recommendationRate ?? 0));
      const rb = parseFloat(String((b.rating as Record<string,string>)?.recommendation ?? b.recommendationRate ?? 0));
      return rb - ra;
    });

    // Deduplicate by hotel name, take top 10
    const seen = new Set<string>();
    const top10: Record<string, unknown>[] = [];

    for (const o of sorted) {
      const name = String(o.hotel_name ?? o.hotelName ?? o.title ?? "");
      if (!name || seen.has(name)) continue;
      seen.add(name);

      const rating = (o.rating as Record<string, string | number> | undefined) ?? {};
      top10.push({
        hotel_name:        name,
        hotel_category:    parseInt(String(o.hotel_category ?? o.stars ?? 0)),
        region_name:       String(o.region_name ?? o.city_name ?? ""),
        board_name:        String(o.board_name ?? o.board ?? ""),
        offer_price_total: Math.floor(Number(o.offer_price_total ?? o.priceTotal ?? o.price ?? 0)),
        offer_duration:    String(o.offer_duration ?? o.duration ?? "7"),
        image_url:         resolveImage(o),
        rating: {
          overall:        String(rating.overall ?? "5.0"),
          count:          String(rating.count ?? o.rating_count ?? "0"),
          recommendation: String(rating.recommendation ?? o.recommendationRate ?? "80"),
        },
      });

      if (top10.length >= 10) break;
    }

    return NextResponse.json({ offers: top10 }, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ offers: [] });
  }
}
