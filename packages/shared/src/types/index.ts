export type { Database, Json } from "./database";
import type { Database } from "./database";

// ── Convenience-Types aus der Datenbank ──────────────────────────
export type Destination =
  Database["public"]["Tables"]["destinations"]["Row"];
export type DestinationInsert =
  Database["public"]["Tables"]["destinations"]["Insert"];

export type Offer = Database["public"]["Tables"]["offers"]["Row"];
export type OfferInsert = Database["public"]["Tables"]["offers"]["Insert"];
export type OfferType = Offer["type"];

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];

export type Achievement =
  Database["public"]["Tables"]["achievements"]["Row"];

export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type FavoriteInsert =
  Database["public"]["Tables"]["favorites"]["Insert"];

export type PriceAlert =
  Database["public"]["Tables"]["price_alerts"]["Row"];
export type PriceAlertInsert =
  Database["public"]["Tables"]["price_alerts"]["Insert"];

export type UserAchievement =
  Database["public"]["Tables"]["user_achievements"]["Row"];

// ── API-Response Typen ───────────────────────────────────────────
export interface TravelApiParams {
  giession?: string;
  departureAirport?: string;
  travelDuration?: string;
  adults?: number;
  children?: number;
  boardType?: string;
  hotelCategory?: number;
  priceMax?: number;
}

export interface TravelApiOffer {
  hotelName: string;
  hotelStars: number;
  region: string;
  country: string;
  price: number;
  originalPrice?: number;
  departureDate: string;
  returnDate: string;
  duration: number;
  boardType: string;
  departureAirport: string;
  imageUrl: string;
  offerUrl: string;
  provider: string;
}
