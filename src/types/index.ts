// ---- Reise-API Typen (api.specials.de) ----

export interface TravelOffer {
  hotel_name: string;
  product_code: string;
  hotel_category: number;
  board_name: string;
  board_code: string;
  lodging_name: string;
  lodging_code: string;
  offer_price_adult: number;
  offer_price_total: number;
  offer_duration: number;
  offer_from: string;
  offer_to: string;
  city_code: string;
  city_name: string;
  region_name: string;
  country_name: string;
  destination_name: string;
  destination_airport_code: string;
  geo_codes: {
    longitude: string;
    latitude: string;
  };
  rating: {
    count: number;
    overall: number;
    overall_percentage: number;
    recommendation: number;
  };
  giata_id: string;
  giata_object_code: string;
  keywordList: string[];
  keywords: string;
  tourOperatorCodeList: string[];
  inclusiveList: string[];
  images: {
    small: string;
    medium: string;
    large: string;
  };
  preview_text: string;
  href: string;
}

export interface ApiResponse {
  error: boolean;
  params: Record<string, unknown>;
  data: TravelOffer[];
}

// ---- Region/Destination Konfiguration ----

export interface EntryInfo {
  visa: string;
  currency: string;
  language: string;
  timezone: string;
  voltage: string;
  health: string;
}

export interface ClimateMonth {
  month: string;   // z.B. "Jan"
  tempHigh: number; // Tageshöchsttemperatur in °C
  tempLow: number;  // Nachttemperatur in °C
  rain: number;     // Niederschlag in mm
}

export interface DestinationConfig {
  slug: string;
  name: string;
  regionIds: number[];
  country: string;
  heroImage: string;               // lokaler Pfad /images/destinations/...
  heroImageFallback?: string;      // Unsplash-Fallback bis eigene Bilder da sind
  cardImage?: string;              // Kachel-Bild (kleineres Format)
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  iataCode?: string;        // IATA Flughafen-Code, z.B. "AYT"
  ibeBpRegion?: string;     // IBE Boarding-Pass Region: "turkey" | "eu" | "uae" etc.
  ibeRegionId?: string;     // IBE API regionId (api.specials.de), z.B. "149"
  ibeCityId?: string;       // IBE API cityId, z.B. "930"
  tiqetsCityId?: string;    // Tiqets API city_id für Aktivitäten-Carousel
  tiqetsNiches?: TiqetsNiche[];   // Nischen-Kategorieseiten für SEO
  faqs?: { question: string; answer: string }[];
  guideSlug?: string;              // Zugehöriger Guide-Slug
  entryInfo?: EntryInfo;           // Einreise-Informationen
  climate?: ClimateMonth[];        // Klimadaten (12 Monate)
  carLocationKey?: string;         // Mietwagen IBE Standort-Key, z.B. "AS.TR.07.AYT.AYT"
  coordinates?: { lat: number; lng: number }; // Für Karte
}

export interface TiqetsNiche {
  slug: string;            // URL-slug z.B. "museen-kunst"
  label: string;           // Anzeigename z.B. "Museen & Kunst"
  keywords: string;        // Regex für Titel-Filterung
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  tiqetsCategoryPath?: string; // z.B. "/sehenswuerdigkeiten-t435/"
}

// ---- Firebase User Typen ----

export interface TravelPreferences {
  budget: "budget" | "mittel" | "premium" | "luxus" | "";
  adults: number;
  children: number;
  preferredMonths: string[];      // ["Jun", "Jul", "Aug"]
  preferredTypes: string[];       // ["strand", "stadt", "natur", "kultur", "abenteuer"]
  preferredRegions: string[];     // Destination slugs
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: "dokumente" | "kleidung" | "toilette" | "elektronik" | "gesundheit" | "sonstiges";
  custom?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  savedTrips: string[];              // product_codes
  favoriteDestinations: string[];
  preferences?: TravelPreferences;
  checklist?: ChecklistItem[];
  notes?: string;                    // Persönliche Reisenotizen
}

export interface SavedTrip {
  id: string;
  userId: string;
  offer: TravelOffer;
  savedAt: string;
  notes?: string;
}

// ---- Tiqets / Aktivitäten ----

export interface TiqetsProduct {
  title: string;
  city_name?: string;
  images?: { medium?: string; large?: string; extra_large?: string; alt_text?: string }[];
  product_url?: string;
  price?: number;
  prediscount_price?: number;
  discount_percentage?: number;
  promo_label?: string;
  ratings?: { average: number; total: number };
  duration?: string;
  instant_ticket_delivery?: boolean;
  smartphone_ticket?: boolean;
  tagline?: string;
  cancellation?: { policy: string; window: number | null };
  skip_line?: boolean;
}

export interface SavedActivity {
  id: string;
  userId: string;
  activity: TiqetsProduct;
  savedAt: string;
}

// ---- Preisverlauf ----

/** Ein Tages-Snapshot: günstigster Preis pro Person für 2 Erw. / 7 Nächte */
export interface PriceSnapshot {
  date: string;       // "YYYY-MM-DD"
  minPrice: number;   // EUR pro Person
  avgPrice: number;
  dealCount: number;
}

/** Preis-Profil-Daten (Pauschalreise / Nur Hotel / All-Inclusive) */
export interface PriceProfileData {
  currentMinPrice: number;
  currentDealCount: number;
  snapshots: PriceSnapshot[]; // bis zu 60 Tage, absteigend sortiert
}

export type PriceProfileId = "pauschal" | "hotel" | "ai";

/** Aggregiertes Dokument in Firestore: priceTrends/{slug} */
export interface PriceTrend {
  slug: string;
  destinationName: string;
  lastUpdated: unknown;       // Firestore Timestamp
  // Legacy single-profile (rückwärtskompatibel)
  currentMinPrice: number;
  currentDealCount: number;
  snapshots: PriceSnapshot[];
  // Multi-Profil (Pauschalreise / Nur Hotel / All-Inclusive)
  pauschal?: PriceProfileData;
  hotel?: PriceProfileData;
  ai?: PriceProfileData;
}

// ---- Preisalarm ----

export interface PriceAlert {
  id: string;
  userId: string;
  destination: string;        // slug aus CATALOG
  destinationName: string;    // Anzeigename
  maxPrice: number;           // max EUR pro Person
  adults: number;
  nights: number;
  enabled: boolean;
  createdAt: unknown;         // Firestore Timestamp
  // Alarm-Match (gesetzt vom Cron-Job)
  matchedPrice?: number;      // gefundener Preis
  matchedAt?: unknown;        // Firestore Timestamp
  matchedDealCount?: number;
}

// ---- Reiseplanung ----

export interface TripPlan {
  id: string;
  userId: string;
  title: string;
  destination: string;        // slug
  destinationName: string;
  startDate: string;          // ISO date "YYYY-MM-DD"
  endDate: string;
  adults: number;
  children: number;
  budget: number;             // EUR gesamt
  notes: string;
  status: "planning" | "confirmed" | "completed";
  linkedTripIds: string[];    // SavedTrip docIds
  linkedActivityIds: string[];// SavedActivity docIds
  createdAt: unknown;
  updatedAt: unknown;
}

// ---- Reisedokumente ----

export type TravelDocumentType = "passport" | "insurance" | "visa" | "vaccination" | "emergency";

export interface TravelDocument {
  id: string;
  userId: string;
  documentType: TravelDocumentType;
  label?: string;
  // Reisepass
  passportNumber?: string;
  expiryDate?: string;        // ISO date "YYYY-MM-DD"
  issuedDate?: string;
  nationality?: string;
  // Versicherung
  insuranceProvider?: string;
  policyNumber?: string;
  insuranceExpiryDate?: string;
  emergencyPhone?: string;    // Notfallnummer des Versicherers
  // Visa
  visaCountry?: string;
  visaExpiryDate?: string;
  // Impfung
  vaccinationType?: string;
  vaccinationDate?: string;
  // Notfallkontakt
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactRelationship?: string;
  // Meta
  notes?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

// ---- Community Reisen-Tipps (Reisenden-Karte) ----

export type TravelTipCategory = "geheimtipp" | "sehenswuerdigkeit" | "gastronomie" | "negativ";

export interface TravelTip {
  id: string;
  userId: string;
  displayName: string;
  title: string;
  description: string;
  category: TravelTipCategory;
  locationName: string;   // z.B. "Antalya, Türkei"
  lat: number;
  lng: number;
  createdAt: unknown;     // Firestore Timestamp oder ISO-String (Demo)
}

// ---- Community: Reiseberichte ──────────────────────────────────────────────

export type PriceRange = "budget" | "mittel" | "premium" | "luxus";

export interface TravelReport {
  id: string;
  userId: string;
  displayName: string;
  destination: string;      // z.B. "Antalya, Türkei"
  country: string;          // z.B. "Türkei"
  title: string;
  highlights: string;
  lowlights: string;
  tips: string;
  priceRange: PriceRange;
  rating: number;           // 1–5
  recommendation: boolean;
  coverImageUrl?: string;
  visitedAt: string;        // "YYYY-MM"
  createdAt: unknown;
  likesCount: number;
  likedBy: string[];        // uid-Array
  commentsCount: number;
  isPublished: boolean;
}

export interface TravelReportComment {
  id: string;
  reportId: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt: unknown;
}

// ---- Community: Profile ─────────────────────────────────────────────────────

export type TravelFrequency = "selten" | "1-2x" | "3-5x" | "mehrmals";
export type TravelerType = "entdecker" | "strandliebhaber" | "staedtereisender" | "abenteurer" | "kulturfan" | "weltenbummler" | "familienreisender";

export interface CommunityProfile {
  uid: string;
  displayName: string;
  photoURL?: string;            // Avatar-URL (DiceBear oder Firebase Storage)
  bio?: string;
  location?: string;
  nationality?: string;         // Herkunftsland / Nationalität
  visitedCountries: string[];   // ISO-Ländercodes: ["DE", "TR", "ES", ...]
  followersCount: number;
  followingCount: number;
  reportsCount: number;
  tipsCount: number;
  groupsCount: number;
  createdAt?: unknown;
  // Erweiterte Profil-Felder
  travelInterests?: string[];   // ["strand", "stadt", "natur", "abenteuer", "kultur", "wellness", "luxus", "backpacking", "familie", "kreuzfahrt"]
  travelerType?: TravelerType;  // Reisetyp-Badge
  travelFrequency?: TravelFrequency; // Wie oft reist du?
  languages?: string[];         // Gesprochene Sprachen
  instagramUrl?: string;        // Instagram-Profil
  websiteUrl?: string;          // Persönliche Website
  isPublic?: boolean;           // Profil öffentlich sichtbar (default: true)
  bannerURL?: string;           // Profilbanner (Cover-Bild)
}

// ---- Community: Reise-Gruppen ───────────────────────────────────────────────

export type GroupCategory = "destination" | "style" | "date" | "interest";

export interface TravelGroup {
  id: string;
  creatorId: string;
  creatorName: string;
  name: string;
  description: string;
  destination?: string;
  country?: string;
  travelMonth?: string;       // "2026-05"
  category: GroupCategory;
  isPublic: boolean;
  membersCount: number;
  memberIds: string[];
  postsCount: number;
  coverImageUrl?: string;
  tags: string[];
  createdAt: unknown;
}

export interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt: unknown;
  likesCount: number;
}

// ---- Guide Typen ----

export interface GuideArticle {
  id: string;
  slug: string;
  destination: string;
  title: string;
  category: "vor-der-reise" | "waehrend-der-reise" | "nach-der-reise" | "allgemein";
  content: string;
  excerpt: string;
  coverImage: string;
  readingTime: number;
  publishedAt: string;
  tags: string[];
}
