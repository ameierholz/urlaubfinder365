"use client";

/**
 * useHotelsInBounds — lädt Hotels für Catalog-Destinations im sichtbaren
 * Karten-Bereich. Wird beim Pannen/Zoomen automatisch refresht.
 *
 * Strategie:
 *   1. Aus den Destinations-Markern die Slugs extrahieren, die in der Bbox liegen.
 *   2. Pro Slug max. 8 Slugs (API-Limit) → /api/map/hotels?slugs=...
 *   3. Cache pro Slug-Set, damit wiederholtes Pannen nicht refetcht.
 *   4. Nur aktiv wenn enabled === true (User toggled Hotels-Layer an).
 */

import { useEffect, useRef, useState } from "react";
import type { HotelMarker, MapMarker } from "@/lib/map/marker-types";

const cache = new Map<string, HotelMarker[]>();

export interface MapBounds {
  north: number;
  south: number;
  east:  number;
  west:  number;
}

interface Options {
  enabled:      boolean;
  bounds:       MapBounds | null;
  destinations: MapMarker[];
}

export function useHotelsInBounds({ enabled, bounds, destinations }: Options) {
  const [hotels, setHotels]   = useState<HotelMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !bounds) {
      setHotels([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Slugs der Destinations in der aktuellen Bbox bestimmen
      const slugsInView: string[] = [];
      for (const m of destinations) {
        if (m.kind !== "destination") continue;
        if (m.lat < bounds.south || m.lat > bounds.north) continue;
        if (m.lng < bounds.west  || m.lng > bounds.east)  continue;
        slugsInView.push(m.slug);
        if (slugsInView.length >= 8) break;
      }

      if (slugsInView.length === 0) {
        setHotels([]);
        return;
      }

      const cacheKey = slugsInView.sort().join(",");
      const cached = cache.get(cacheKey);
      if (cached) {
        setHotels(cached);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/map/hotels?slugs=${encodeURIComponent(cacheKey)}&limit=15`);
        if (!res.ok) {
          setHotels([]);
          return;
        }
        const json = await res.json();
        const data: HotelMarker[] = json?.hotels ?? [];
        cache.set(cacheKey, data);
        setHotels(data);
      } catch {
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }, 400); // Debounce: erst wenn der User mit Pannen aufhört

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [enabled, bounds?.north, bounds?.south, bounds?.east, bounds?.west, destinations]);

  return { hotels, loading };
}
