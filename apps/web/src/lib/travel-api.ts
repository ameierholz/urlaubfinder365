import { ApiResponse, TravelOffer } from "@/types";

const BASE_URL = "https://api.specials.de/package/teaser.json";
const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";

export interface FetchOffersParams {
  regionIds: number[];
  duration?: string;  // z.B. "5-8"
  limit?: number;
}

export async function fetchOffers(params: FetchOffersParams): Promise<TravelOffer[]> {
  const { regionIds, duration = "5-8", limit = 6 } = params;

  const url = new URL(BASE_URL);
  url.searchParams.set("agent", AGENT_ID);
  url.searchParams.set("duration", duration);
  url.searchParams.set("regionId", regionIds.join(","));
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Stündlich neu laden (ISR)
  });

  if (!res.ok) {
    throw new Error(`API Fehler: ${res.status}`);
  }

  const json: ApiResponse = await res.json();

  if (json.error) {
    throw new Error("API hat einen Fehler zurückgegeben");
  }

  return json.data;
}

const TOP_DEAL_AGENT = "993243";

/** Bestes Angebot pro Regionen-Set – täglich gecacht (86400s) */
export async function fetchTopDeal(regionIds: number[]): Promise<TravelOffer | null> {
  const deals = await fetchTopDeals(regionIds, 1);
  return deals[0] ?? null;
}

/** Top-N Angebote aus einem Regionen-Set – nach Empfehlungsrate sortiert, dann günstigste */
export async function fetchTopDeals(regionIds: number[], maxResults = 8): Promise<TravelOffer[]> {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    agent:         TOP_DEAL_AGENT,
    regionId:      regionIds.join(","),
    duration:      "7-7",
    adults:        "2",
    from:          "14",
    to:            "42",
    minRecommrate: "80",
    hSort:         "recomrate",
    sortType:      "down",
    limit:         "50",
    _d:            today,
  });
  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const json = JSON.parse(text);
    const raw = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: TravelOffer[] = raw?.data ?? raw?.packages ?? raw?.items ?? [];
    if (!data.length) return [];
    const qualified = data.filter((o) => {
      const rec   = Number(o.rating?.recommendation ?? 0);
      const count = Number(o.rating?.count ?? 0);
      return rec >= 80 && count >= 30 && !!o.giata_id && o.giata_id.trim().length > 0;
    });
    const pool = qualified.length > 0
      ? qualified
      : data.filter((o) => !!o.giata_id && o.giata_id.trim().length > 0);
    // Erst nach Empfehlung absteigend, dann nach Preis aufsteigend
    pool.sort((a, b) => {
      const recDiff = Number(b.rating?.recommendation ?? 0) - Number(a.rating?.recommendation ?? 0);
      if (recDiff !== 0) return recDiff;
      return (a.offer_price_adult ?? 0) - (b.offer_price_adult ?? 0);
    });
    // Duplikate (gleicher Hotel-Name) entfernen
    const seen = new Set<string>();
    return pool.filter((o) => {
      const key = o.hotel_name?.toLowerCase().trim() ?? o.product_code;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, maxResults);
  } catch {
    return [];
  }
}

// Hilfsfunktionen für die UI
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "–";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function renderStars(category: number): number {
  return Math.min(5, Math.max(1, Math.round(category)));
}
