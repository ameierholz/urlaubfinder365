import type { TravelApiParams, TravelApiOffer } from "../types";

const DEFAULT_BASE = "https://api.specials.de/package/teaser.json";

export interface TravelApiConfig {
  baseUrl?: string;
  agentId: string;
}

/** Client für die Specials.de Reise-API */
export function createTravelApiClient(config: TravelApiConfig) {
  const baseUrl = config.baseUrl || DEFAULT_BASE;

  async function searchOffers(
    params: TravelApiParams
  ): Promise<TravelApiOffer[]> {
    const url = new URL(baseUrl);
    url.searchParams.set("agid", config.agentId);

    if (params.giession) url.searchParams.set("giession", params.giession);
    if (params.departureAirport)
      url.searchParams.set("dep", params.departureAirport);
    if (params.travelDuration)
      url.searchParams.set("dur", params.travelDuration);
    if (params.adults)
      url.searchParams.set("adults", String(params.adults));
    if (params.children)
      url.searchParams.set("children", String(params.children));
    if (params.boardType)
      url.searchParams.set("board", params.boardType);
    if (params.hotelCategory)
      url.searchParams.set("cat", String(params.hotelCategory));
    if (params.priceMax)
      url.searchParams.set("pricemax", String(params.priceMax));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Travel API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    // Die API gibt ein Array von Angeboten zurück
    // Mapping auf unser internes Format
    return Array.isArray(data) ? data : [];
  }

  return { searchOffers };
}
