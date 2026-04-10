/**
 * DestinationMapEmbed — Server Component, lädt alle Marker für die Region
 * (Country / Super-Region) plus Hotels server-side aus Specials.de API.
 *
 * Vorher: 80km-Radius-Filter → zu klein für ein Land, oft nur 5-7 Marker.
 * Jetzt: Country-basierter Filter → komplette Türkei statt nur Kappadokien.
 *
 * Hotels werden direkt server-side für den Slug + alle Sub-Regions geladen.
 */

import { loadAllMarkers } from "@/lib/map/load-markers";
import { CATALOG, type CatalogEntry } from "@/data/catalog-regions";
import { getEffectiveIbeRegionIds } from "@/lib/catalog-helpers";
import type { TravelOffer } from "@/types";
import type { HotelMarker, MapMarker } from "@/lib/map/marker-types";
import DestinationMapClient from "./DestinationMapClient";

interface Props {
  lat:  number;
  lng:  number;
  slug: string;
  name: string;
}

const AGENT_ID = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";
const SPECIALS_BASE = "https://api.specials.de/package/teaser.json";

/** Holt Hotels mit Coords für eine Region direkt aus Specials.de */
async function fetchHotelsForRegion(slug: string, name: string, country: string, limit = 30): Promise<HotelMarker[]> {
  const regionIds = getEffectiveIbeRegionIds(slug);
  if (regionIds.length === 0) return [];

  const url = new URL(SPECIALS_BASE);
  url.searchParams.set("agent",        AGENT_ID);
  url.searchParams.set("regionId",     regionIds.join(","));
  url.searchParams.set("duration",     "7-7");
  url.searchParams.set("adults",       "2");
  url.searchParams.set("from",         "14");
  url.searchParams.set("to",           "60");
  url.searchParams.set("minCat",       "3");
  url.searchParams.set("minRecommrate","60");
  url.searchParams.set("hSort",        "recomrate");
  url.searchParams.set("sortType",     "down");
  url.searchParams.set("limit",        String(limit));

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const json = JSON.parse(text);
    const raw  = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: TravelOffer[] = raw?.data ?? [];
    if (!Array.isArray(data) || data.length === 0) return [];

    const seen = new Set<string>();
    const out: HotelMarker[] = [];
    for (const o of data) {
      const lat = parseFloat(o.geo_codes?.latitude ?? "");
      const lng = parseFloat(o.geo_codes?.longitude ?? "");
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) continue;

      const key = o.giata_id || o.product_code;
      if (seen.has(key)) continue;
      seen.add(key);

      const price = Number(o.offer_price_adult);
      if (!Number.isFinite(price) || price <= 0) continue;

      out.push({
        id:              `hotel-${key}`,
        kind:            "hotel",
        lat,
        lng,
        title:           o.hotel_name ?? "Hotel",
        productCode:     o.product_code,
        hotelName:       o.hotel_name ?? "Hotel",
        category:        Number(o.hotel_category ?? 0),
        destination:     o.city_name || o.region_name || name,
        country:         o.country_name || country,
        imageUrl:        o.images?.medium || o.images?.small || undefined,
        priceFrom:       Math.round(price),
        rating:          Number(o.rating?.overall ?? 0),
        recommendation:  Number(o.rating?.recommendation ?? 0),
        bookingUrl:      o.href,
        destinationSlug: slug,
      });
    }
    return out;
  } catch {
    return [];
  }
}

export default async function DestinationMapEmbed({ lat, lng, slug, name }: Props) {
  // Catalog-Eintrag → Country / Sub-Slugs ermitteln
  const entry: CatalogEntry | undefined = CATALOG.find((e) => e.slug === slug);

  // Sammle alle relevanten Slugs: der Slug selbst + alle Children + Slugs im gleichen Country
  const candidateSlugs: string[] = [slug];
  if (entry) {
    // Children (z. B. tuerkei → antalya, side, alanya, …)
    CATALOG.forEach((e) => {
      if (e.parentSlug === slug && !candidateSlugs.includes(e.slug)) {
        candidateSlugs.push(e.slug);
      }
    });
  }

  // Marker (Destinations + Tipps + Reports + Media + Anbieter) für die Region
  const baseMarkers = await loadAllMarkers({ forSlug: slug });

  // Hotels für die Top-5 Sub-Slugs parallel laden (alle würde API überlasten)
  const topSlugs = candidateSlugs.slice(0, 5);
  const hotelArrays = await Promise.all(
    topSlugs.map((s) => {
      const ce = CATALOG.find((c) => c.slug === s);
      return fetchHotelsForRegion(s, ce?.name ?? name, ce?.country ?? "Land", 15);
    })
  );
  const hotels = hotelArrays.flat();

  // Dedup hotels (gleiches Hotel kann in Sub-Region und Region vorkommen)
  const seenHotels = new Set<string>();
  const uniqueHotels: HotelMarker[] = [];
  for (const h of hotels) {
    if (seenHotels.has(h.id)) continue;
    seenHotels.add(h.id);
    uniqueHotels.push(h);
  }

  const markers: MapMarker[] = [...baseMarkers, ...uniqueHotels];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Karte: {name} & Umgebung
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {markers.length} Pins · {uniqueHotels.length} Hotels · Klicke für Details
          </p>
        </div>
        <a
          href="/weltkarte/"
          className="text-xs font-semibold text-[#1db682] hover:underline"
        >
          ↗ Weltkarte öffnen
        </a>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
        <DestinationMapClient
          markers={markers}
          center={[lat, lng]}
          zoom={6}
          height="560px"
          excludeSlug={slug}
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Kartendaten ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </section>
  );
}
