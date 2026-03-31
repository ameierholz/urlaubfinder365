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
