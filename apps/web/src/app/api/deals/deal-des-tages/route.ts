import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.specials.de/package/teaser.json";
const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";
const BOOK_BASE = "https://b2b.specials.de/index/jump/119/2780/993243";

/**
 * Live-Verfügbarkeitscheck für Deal des Tages.
 * Fragt api.specials.de in Echtzeit ab und liefert das beste verfügbare Angebot.
 *
 * GET /api/deals/deal-des-tages?regionId=141,149
 */

export interface LiveDeal {
  hotelName: string;
  location: string;
  imageUrl: string;
  price: number;
  nights: number;
  board: string;
  stars: number;
  recommendation: number;
  reviewCount: number;
  departureDate: string;
  href: string;
}

function mapOffer(o: Record<string, unknown>): LiveDeal {
  const price = Math.round(Number(o.offer_price_adult ?? 0));
  const images = (o.images ?? {}) as Record<string, string>;
  const rating  = (o.rating ?? {}) as Record<string, number>;
  const giataId = String(o.giata_id ?? "").trim();
  const nights  = Number(o.offer_duration ?? 7);

  const params = new URLSearchParams({
    giataId,
    from:          "7",
    to:            "180",
    duration:      `${nights}-${nights}`,
    adults:        "2",
    category:      "3",
    minRecommrate: "70",
  });

  return {
    hotelName:      String(o.hotel_name ?? ""),
    location:       [o.city_name, o.country_name].filter(Boolean).join(", "),
    imageUrl:       images.medium || images.large || images.small || "",
    price,
    nights,
    board:          String(o.board_name ?? ""),
    stars:          Math.min(5, Math.max(1, Math.round(Number(o.hotel_category ?? 4)))),
    recommendation: Math.round(Number(rating.recommendation ?? 0)),
    reviewCount:    Math.round(Number(rating.count ?? 0)),
    departureDate:  String(o.offer_from ?? ""),
    href:           `${BOOK_BASE}/?${params}`,
  };
}

export async function GET(req: NextRequest) {
  const sp       = req.nextUrl.searchParams;
  const regionId = sp.get("regionId") ?? "";

  if (!regionId) {
    return NextResponse.json({ deal: null }, { status: 400 });
  }

  const params = new URLSearchParams({
    agent:         AGENT_ID,
    regionId,
    from:          "7",
    to:            "180",
    duration:      "7-14",
    adults:        "2",
    minRecommrate: "75",
    hSort:         "recomrate",
    sortType:      "down",
    limit:         "30",
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 3600 },            // 1h Cache – frische Preise
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return NextResponse.json({ deal: null });

    const text = await res.text();
    const json = JSON.parse(text);
    const raw  = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: Record<string, unknown>[] = raw?.data ?? raw?.packages ?? raw?.items ?? [];

    // Nur Angebote mit GIATA-ID und Foto
    const valid = data.filter((o) => {
      const giata  = String(o.giata_id ?? "").trim();
      const images = (o.images ?? {}) as Record<string, string>;
      return giata.length > 0 && (images.medium || images.large || images.small);
    });

    if (!valid.length) return NextResponse.json({ deal: null });

    // Täglich deterministisch rotieren (stabiles SSR/SSG)
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
    );
    const offer = valid[dayOfYear % valid.length];

    return NextResponse.json(
      { deal: mapOffer(offer) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    return NextResponse.json({ deal: null });
  }
}
