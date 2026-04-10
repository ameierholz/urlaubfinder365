/**
 * Marker-Typen für die Master-Map.
 *
 * Jede Marker-Sorte hat eigene Felder, die im polymorphen Side-Panel
 * unterschiedlich gerendert werden. Discriminator: `kind`.
 */

export type MarkerKind =
  | "destination"
  | "tip"
  | "report"
  | "media"
  | "anbieter"
  | "hotel";

export interface BaseMarker {
  id:    string;       // unique über alle Layer
  kind:  MarkerKind;
  lat:   number;
  lng:   number;
  title: string;
}

export interface DestinationMarker extends BaseMarker {
  kind:        "destination";
  slug:        string;
  country:     string;
  climateZone: string;
  superRegion: string;
  type:        "super" | "region";
  imageUrl?:   string;
  iataCode?:   string;
  /** "Mai bis Oktober" — aus CLIMATE_NARRATIVES */
  bestMonths?: string;
  /** "26 bis 32 °C" — Sommertemperaturen aus CLIMATE_NARRATIVES */
  summerTemp?: string;
  /** "rund 300 Sonnentagen im Jahr" */
  sunDays?:    string;
  /** "rund 3 bis 3,5 Stunden ab Frankfurt" — aus COUNTRY_PROFILES */
  flightTime?: string;
  /** Konkrete Sehenswürdigkeiten/Highlights als 1 Satz */
  highlights?: string;
  /** Typische Küche-Stichworte */
  cuisine?:    string;
  /** Aktueller Pauschalpreis ab X €/Person aus price_history */
  priceFrom?:  number;
  /** True wenn Tiqets-Aktivitäten für diesen Slug verfügbar sind */
  hasTiqets?:  boolean;
}

export interface TipMarker extends BaseMarker {
  kind:        "tip";
  description: string;
  category:    string;   // aus travel_tips.category
  authorName:  string;
  imageUrl?:   string;
  locationName?: string;
  createdAt:   string;
}

export interface ReportMarker extends BaseMarker {
  kind:        "report";
  id:          string;
  reportId:    string;
  destination: string;
  country:     string;
  authorName:  string;
  rating:      number;        // 1-5
  recommendation: boolean;
  coverImage?: string;
  visitedAt?:  string;
}

export interface MediaMarker extends BaseMarker {
  kind:        "media";
  destinationSlug: string;
  destination: string;
  authorName:  string;
  caption:     string;
  mediaUrl:    string;
  mediaType:   "image" | "video";
  likesCount:  number;
}

export interface HotelMarker extends BaseMarker {
  kind:           "hotel";
  productCode:    string;
  hotelName:      string;
  category:       number;        // Sterne 1-5
  destination:    string;        // city/region
  country:        string;
  imageUrl?:      string;
  priceFrom:      number;        // EUR pro Person
  rating?:        number;        // overall_percentage
  recommendation?: number;       // 0-100
  bookingUrl:     string;        // direct affiliate link
  /** Catalog-Slug, dem dieses Hotel zugeordnet ist (für Cache) */
  destinationSlug: string;
}

export interface AnbieterMarker extends BaseMarker {
  kind:        "anbieter";
  anbieterId:  string;
  name:        string;
  kategorie:   string;
  bio?:        string;
  avatarUrl?:  string;
  stadt?:      string;
  landName?:   string;
  verifiziert: boolean;
  /** Günstigstes aktives Angebot des Anbieters in € */
  priceFrom?:  number;
  /** Anzahl aktiver Angebote */
  offerCount?: number;
}

export type MapMarker =
  | DestinationMarker
  | TipMarker
  | ReportMarker
  | MediaMarker
  | AnbieterMarker
  | HotelMarker;

// ─── Layer-Konfiguration ────────────────────────────────────────────────────

export interface LayerConfig {
  key:    MarkerKind;
  label:  string;
  emoji:  string;
  color:  string;
  description: string;
}

export const LAYER_CONFIG: Record<MarkerKind, LayerConfig> = {
  destination: {
    key:    "destination",
    label:  "Reiseziele",
    emoji:  "📍",
    color:  "#1db682",
    description: "273 Urlaubsziele weltweit",
  },
  tip: {
    key:    "tip",
    label:  "Insider-Tipps",
    emoji:  "💡",
    color:  "#00838F",
    description: "Tipps von der Community",
  },
  report: {
    key:    "report",
    label:  "Reiseberichte",
    emoji:  "📖",
    color:  "#6991d8",
    description: "Erfahrungsberichte echter Reisender",
  },
  media: {
    key:    "media",
    label:  "Reisefotos & Videos",
    emoji:  "📸",
    color:  "#F97316",
    description: "Community Reels & Fotos",
  },
  anbieter: {
    key:    "anbieter",
    label:  "Anbieter & Aktivitäten",
    emoji:  "🎯",
    color:  "#A855F7",
    description: "Lokale Anbieter & Touren",
  },
  hotel: {
    key:    "hotel",
    label:  "Hotels",
    emoji:  "🏨",
    color:  "#0EA5E9",
    description: "Live-Hotelpreise mit Direktbuchung",
  },
};

export const LAYER_ORDER: MarkerKind[] = [
  "destination",
  "hotel",
  "tip",
  "report",
  "media",
  "anbieter",
];
