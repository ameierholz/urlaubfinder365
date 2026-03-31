/** Deutsche Flughäfen für die Reisesuche */
export const DEPARTURE_AIRPORTS = [
  { code: "FRA", name: "Frankfurt" },
  { code: "MUC", name: "München" },
  { code: "DUS", name: "Düsseldorf" },
  { code: "HAM", name: "Hamburg" },
  { code: "BER", name: "Berlin" },
  { code: "STR", name: "Stuttgart" },
  { code: "CGN", name: "Köln/Bonn" },
  { code: "HAJ", name: "Hannover" },
  { code: "NUE", name: "Nürnberg" },
  { code: "LEJ", name: "Leipzig" },
] as const;

/** Verpflegungstypen */
export const BOARD_TYPES = [
  { code: "AI", label: "All Inclusive" },
  { code: "VP", label: "Vollpension" },
  { code: "HP", label: "Halbpension" },
  { code: "UF", label: "Übernachtung & Frühstück" },
  { code: "OV", label: "Nur Übernachtung" },
] as const;

/** Angebotstypen */
export const OFFER_TYPES = [
  { code: "pauschal", label: "Pauschalreise" },
  { code: "hotel", label: "Nur Hotel" },
  { code: "flug", label: "Nur Flug" },
  { code: "lastminute", label: "Last Minute" },
  { code: "kreuzfahrt", label: "Kreuzfahrt" },
] as const;

/** Kontinente für die Filterung */
export const CONTINENTS = [
  "Europa",
  "Asien",
  "Afrika",
  "Nordamerika",
  "Südamerika",
  "Ozeanien",
] as const;

/** Hotelkategorien */
export const HOTEL_STARS = [3, 4, 5] as const;
