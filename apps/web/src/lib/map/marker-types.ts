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
  | "anbieter";

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
  | AnbieterMarker;

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
    label:  "Anbieter",
    emoji:  "🏨",
    color:  "#A855F7",
    description: "Lokale Anbieter & Hotels",
  },
};

export const LAYER_ORDER: MarkerKind[] = [
  "destination",
  "tip",
  "report",
  "media",
  "anbieter",
];
