/**
 * Builds a b2b.specials.de URL with search parameters from URL search params.
 * Base URL format: https://b2b.specials.de/index/jump/{product}/{sub}/{partner}/
 */
export function buildB2bUrl(
  baseUrl: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  const url = new URL(baseUrl);

  // Datum & Dauer
  if (searchParams.from) url.searchParams.set("from", String(searchParams.from));
  if (searchParams.to) url.searchParams.set("to", String(searchParams.to));
  if (searchParams.duration) url.searchParams.set("duration", String(searchParams.duration));

  // Reisende
  if (searchParams.adults) url.searchParams.set("adults", String(searchParams.adults));
  if (searchParams.children) url.searchParams.set("children", String(searchParams.children));

  // Abflughafen (IATA-Code → direkt als dep)
  if (searchParams.airport) url.searchParams.set("dep", String(searchParams.airport));

  // Reiseziel: numerische Region-ID hat Vorrang, Freitext als Fallback
  if (searchParams.regionId) {
    url.searchParams.set("region", String(searchParams.regionId));
  } else if (searchParams.destination) {
    const regionId = DESTINATION_REGION_MAP[String(searchParams.destination)];
    if (regionId) url.searchParams.set("region", regionId);
  }

  // Hotel params
  if (searchParams.checkin) url.searchParams.set("checkin", String(searchParams.checkin));
  if (searchParams.checkout) url.searchParams.set("checkout", String(searchParams.checkout));
  if (searchParams.rooms) url.searchParams.set("rooms", String(searchParams.rooms));

  // Flug params
  if (searchParams.date) url.searchParams.set("date", String(searchParams.date));
  if (searchParams.returnDate) url.searchParams.set("returndate", String(searchParams.returnDate));
  if (searchParams.tripType) url.searchParams.set("triptype", String(searchParams.tripType));

  return url.toString();
}

/**
 * Mapping von Reiseziel-Namen zu specials.de ibeRegionId.
 * Entspricht den ibeRegionId-Werten in lib/destinations.ts.
 */
export const DESTINATION_REGION_MAP: Record<string, string> = {
  "Antalya & Belek": "149",
  "Mallorca":        "133",
  "Kreta":           "46",
  "Hurghada":        "310",
  "Teneriffa":       "141",
  "Rhodos":          "55",
  "Ibiza":           "135",
  "Dubai":           "500",
  "Side & Alanya":   "130",
  "Gran Canaria":    "128",
  "Fuerteventura":   "127",
  "Lanzarote":       "132",
  "Zypern":          "57",
  "Türkei":          "149",
  "Griechenland":    "44",
  "Ägypten":         "310",
  "Balearen":        "133",
  "Kanarische Inseln": "141",
  "Malediven":       "700",
  "Thailand":        "600",
  "Kroatien":        "45",
  "Portugal":        "561",
  "Tunesien":        "144",
  "Marokko":         "800",
};
