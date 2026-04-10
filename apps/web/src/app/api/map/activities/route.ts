/**
 * Lädt Tiqets-Aktivitäten für eine Destination per Slug + Koordinaten.
 *
 *   GET /api/map/activities?slug=belek&lat=36.8&lng=31.1&limit=4
 *
 * Lookup-Strategie (Priorität):
 *   1. Direktes tiqetsCityId am Catalog-Eintrag
 *   2. Geografisch nächster Catalog-Eintrag MIT tiqetsCityId (max. 200 km)
 *      → verhindert, dass Belek Istanbul-Aktivitäten zeigt
 *   3. Kein Ergebnis → leeres Array
 *
 * Parent-Fallback wurde entfernt, da Super-Regions wie "tuerkei" nicht
 * die richtige Stadt repräsentieren.
 */

import { NextRequest, NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog-regions";
import type { TiqetsProduct } from "@/types";

export const runtime = "nodejs";
export const revalidate = 3600;

const API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";

// Haversine-Distanz in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Alle Catalog-Einträge MIT gültiger tiqetsCityId (gecacht) */
const ENTRIES_WITH_CITY_ID = CATALOG.filter(
  (e) => e.tiqetsCityId && e.coordinates
);

/**
 * Findet die nächste Destination mit tiqetsCityId innerhalb von maxKm.
 * Bevorzugt gleichen Eintrag, dann Einträge gleichen Landes, dann alle.
 */
function findNearestCityId(
  lat: number,
  lng: number,
  maxKm = 200
): { cityId: string; distanceKm: number; slug: string } | null {
  let best: { cityId: string; distanceKm: number; slug: string } | null = null;

  for (const e of ENTRIES_WITH_CITY_ID) {
    const dist = haversineKm(lat, lng, e.coordinates!.lat, e.coordinates!.lng);
    if (dist <= maxKm && (!best || dist < best.distanceKm)) {
      best = { cityId: e.tiqetsCityId!, distanceKm: dist, slug: e.slug };
    }
  }

  return best;
}

interface ActivitiesResponse {
  products: TiqetsProduct[];
  count:    number;
  source?:  "direct" | "proximity";
  nearestSlug?: string;
  distanceKm?: number;
}

export async function GET(req: NextRequest): Promise<NextResponse<ActivitiesResponse>> {
  const slug  = req.nextUrl.searchParams.get("slug") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "4"), 12);
  const latParam = req.nextUrl.searchParams.get("lat");
  const lngParam = req.nextUrl.searchParams.get("lng");

  if (!slug) return NextResponse.json({ products: [], count: 0 });

  // 1. Catalog-Eintrag für Slug
  const entry = CATALOG.find((e) => e.slug === slug);
  if (!entry) return NextResponse.json({ products: [], count: 0 });

  let cityId: string | undefined;
  let source: "direct" | "proximity" = "direct";
  let nearestSlug: string | undefined;
  let distanceKm: number | undefined;

  // 2a. Direktes tiqetsCityId
  if (entry.tiqetsCityId) {
    cityId = entry.tiqetsCityId;
  }
  // 2b. Proximity-Fallback: nächste Stadt mit cityId (max. 200 km)
  else {
    const lat = latParam ? parseFloat(latParam) : entry.coordinates?.lat;
    const lng = lngParam ? parseFloat(lngParam) : entry.coordinates?.lng;

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      const nearest = findNearestCityId(lat, lng, 200);
      if (nearest) {
        cityId      = nearest.cityId;
        source      = "proximity";
        nearestSlug = nearest.slug;
        distanceKm  = Math.round(nearest.distanceKm);
      }
    }
  }

  if (!cityId) return NextResponse.json({ products: [], count: 0 });

  // 3. Tiqets API
  try {
    const url = `https://api.tiqets.com/v2/products?city_id=${cityId}&lang=de&page_size=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Token ${API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ products: [], count: 0 });

    const data = await res.json();
    const products: TiqetsProduct[] = data.products ?? [];
    return NextResponse.json(
      { products: products.slice(0, limit), count: products.length, source, nearestSlug, distanceKm },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ products: [], count: 0 });
  }
}
