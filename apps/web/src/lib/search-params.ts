/**
 * Builds a b2b.specials.de URL for Pauschalreise / Hotel / Mietwagen / Kreuzfahrt.
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
  if (searchParams.duration) {
    const dur = String(searchParams.duration);
    url.searchParams.set("duration", dur);
    const durMin = dur.split("-")[0];
    if (durMin) url.searchParams.set("dur", durMin);
  }

  // Reisende
  if (searchParams.adults) url.searchParams.set("adults", String(searchParams.adults));
  if (searchParams.children) url.searchParams.set("children", String(searchParams.children));

  // Abflughafen
  if (searchParams.airport) url.searchParams.set("departures", String(searchParams.airport));

  // Reiseziel
  if (searchParams.regionId) {
    url.searchParams.set("regionId", String(searchParams.regionId));
  } else if (searchParams.destination) {
    const regionId = DESTINATION_REGION_MAP[String(searchParams.destination)];
    if (regionId) url.searchParams.set("regionId", regionId);
  }

  // Stadt/Ort (z.B. Antalya = 930 innerhalb Türkische Riviera = 149)
  if (searchParams.cityId) url.searchParams.set("cityId", String(searchParams.cityId));

  // Hotel params
  if (searchParams.checkin) url.searchParams.set("checkin", String(searchParams.checkin));
  if (searchParams.checkout) url.searchParams.set("checkout", String(searchParams.checkout));
  if (searchParams.rooms) url.searchParams.set("rooms", String(searchParams.rooms));

  return url.toString();
}

/**
 * Builds a ypsilon.net flight search URL.
 * Correct params derived from actual IBE network requests.
 */
export function buildFlugUrl(
  baseUrl: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  const url = new URL(baseUrl);

  // Reisende (ypsilon.net verwendet adt)
  if (searchParams.adults) url.searchParams.set("adt", String(searchParams.adults));
  if (searchParams.children) url.searchParams.set("chd", String(searchParams.children));

  // Flughäfen
  if (searchParams.von) url.searchParams.set("depapt1", extractIata(String(searchParams.von)));
  if (searchParams.nach) url.searchParams.set("dstapt1", extractIata(String(searchParams.nach)));

  // Datum (DD.MM.YYYY → YYYY-MM-DD)
  if (searchParams.hin) url.searchParams.set("depdate1", toIsoDate(String(searchParams.hin)));
  if (searchParams.rueck) url.searchParams.set("retdate1", toIsoDate(String(searchParams.rueck)));

  // Reisetyp
  const type = searchParams.type ? String(searchParams.type) : "roundtrip";
  url.searchParams.set("type", type);

  return url.toString();
}

/** Extrahiert IATA-Code aus "Frankfurt (FRA)" → "FRA" */
function extractIata(val: string): string {
  const m = val.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : val;
}

/** Konvertiert DD.MM.YYYY → YYYY-MM-DD. Andere Formate unverändert. */
function toIsoDate(date: string): string {
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return date;
}

/**
 * Mapping von Reiseziel-Namen zu specials.de ibeRegionId.
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
