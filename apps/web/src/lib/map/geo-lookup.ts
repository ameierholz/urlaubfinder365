/**
 * Geo-Lookup-Helper für Map-Marker.
 *
 * Viele Datenquellen (travel_reports, anbieter_profile, media_feed) speichern
 * keine Koordinaten, sondern nur Text-Felder wie "destination", "stadt" oder
 * "destination_slug". Dieses Modul mappt diese Strings auf die Coordinates
 * aus dem Catalog (273 Einträge mit lat/lng).
 *
 * Strategie:
 *   1. Exact slug match
 *   2. Exact name match (case-insensitive)
 *   3. Substring/Contains match (z.B. "Antalya" findet "Antalya Stadt")
 *   4. Fallback: null
 */

import { CATALOG, type CatalogEntry } from "@/data/catalog-regions";

// ─── Index-Builder (einmal beim Modul-Load) ─────────────────────────────────

const SLUG_INDEX = new Map<string, CatalogEntry>();
const NAME_INDEX = new Map<string, CatalogEntry>();

for (const entry of CATALOG) {
  SLUG_INDEX.set(entry.slug, entry);
  NAME_INDEX.set(entry.name.toLowerCase(), entry);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
  matchedSlug: string;
  matchedName: string;
  matchType: "slug" | "name" | "substring" | "country";
}

/**
 * Versucht für eine Destination einen Catalog-Eintrag zu finden.
 * Gibt {lat,lng} + Match-Info zurück oder null.
 */
export function lookupGeo(
  destination?: string | null,
  country?: string | null,
  slug?: string | null
): GeoPoint | null {
  // 1. Direkter Slug-Match
  if (slug) {
    const hit = SLUG_INDEX.get(slug);
    if (hit?.coordinates) {
      return {
        lat: hit.coordinates.lat,
        lng: hit.coordinates.lng,
        matchedSlug: hit.slug,
        matchedName: hit.name,
        matchType: "slug",
      };
    }
  }

  // 2. Exakter Name-Match (case-insensitive)
  if (destination) {
    const lower = destination.toLowerCase().trim();
    const hit = NAME_INDEX.get(lower);
    if (hit?.coordinates) {
      return {
        lat: hit.coordinates.lat,
        lng: hit.coordinates.lng,
        matchedSlug: hit.slug,
        matchedName: hit.name,
        matchType: "name",
      };
    }
  }

  // 3. Substring-Match (z.B. "Antalya" → "Antalya Stadt")
  if (destination) {
    const lower = destination.toLowerCase().trim();
    for (const entry of CATALOG) {
      if (!entry.coordinates) continue;
      const entryLower = entry.name.toLowerCase();
      if (entryLower.includes(lower) || lower.includes(entryLower)) {
        return {
          lat: entry.coordinates.lat,
          lng: entry.coordinates.lng,
          matchedSlug: entry.slug,
          matchedName: entry.name,
          matchType: "substring",
        };
      }
    }
  }

  // 4. Country-Fallback (mittlerer Punkt eines Landes)
  if (country) {
    const lowerCountry = country.toLowerCase().trim();
    const hit = CATALOG.find(
      (e) => e.country.toLowerCase() === lowerCountry && e.coordinates
    );
    if (hit?.coordinates) {
      return {
        lat: hit.coordinates.lat,
        lng: hit.coordinates.lng,
        matchedSlug: hit.slug,
        matchedName: hit.country,
        matchType: "country",
      };
    }
  }

  return null;
}

/**
 * Streut mehrere Marker am gleichen Punkt um einen kleinen Radius,
 * damit sie nicht exakt übereinander liegen (z.B. wenn 5 Reiseberichte
 * alle "Mallorca" als destination haben).
 */
export function jitter(lat: number, lng: number, seed: string, radiusKm = 5): { lat: number; lng: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  // 1° lat ≈ 111 km
  const latOffset = ((h % 1000) / 1000 - 0.5) * (radiusKm / 111);
  const lngOffset = (((h >> 10) % 1000) / 1000 - 0.5) * (radiusKm / 111);
  return { lat: lat + latOffset, lng: lng + lngOffset };
}
