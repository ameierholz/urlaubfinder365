/**
 * Server-side Marker-Loader für die Master-Map.
 *
 * Aggregiert alle Layer-Quellen in eine einheitliche `MapMarker[]`-Liste.
 * Wird einmal pro Render geladen — bei aktuell ~430 Markern unkritisch.
 * Cached via Next.js ISR (revalidate 600s).
 */

import { createClient } from "@supabase/supabase-js";
import { CATALOG } from "@/data/catalog-regions";
import {
  generateHeroFallback,
  isFakeIbeRegionId,
  getCountryProfile,
  CLIMATE_NARRATIVES,
} from "@/lib/catalog-helpers";
import { lookupGeo, jitter } from "./geo-lookup";
import type {
  MapMarker,
  DestinationMarker,
  TipMarker,
  ReportMarker,
  MediaMarker,
  AnbieterMarker,
} from "./marker-types";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// ─── Destinations (273 aus Catalog, statisch) ───────────────────────────────

async function loadDestinationMarkers(): Promise<DestinationMarker[]> {
  // Pauschal-Bestpreis pro Slug aus dem neuesten verfügbaren Datum laden
  const priceMap = new Map<string, number>();
  try {
    const supabase = db();
    // 1. Neuestes Datum für pauschal ermitteln
    const { data: latestRow } = await supabase
      .from("price_history")
      .select("date")
      .eq("profile", "pauschal")
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();
    const latestDate = latestRow?.date as string | undefined;

    if (latestDate) {
      // 2. Genau diesen einen Tag laden — eine Zeile pro Slug, max ~273 Zeilen
      const { data } = await supabase
        .from("price_history")
        .select("destination_slug, min_price")
        .eq("profile", "pauschal")
        .eq("date", latestDate);
      if (data) {
        for (const row of data) {
          const slug = row.destination_slug as string;
          priceMap.set(slug, Math.round(Number(row.min_price)));
        }
      }
    }
  } catch (err) {
    console.warn("[load-markers] Konnte Pauschalpreise nicht laden:", err);
  }
  console.log("[load-markers] Destination-Preise geladen:", priceMap.size, "von", CATALOG.filter((e) => e.coordinates).length);

  return CATALOG
    .filter((e) => e.coordinates)
    .map((e): DestinationMarker => {
      const profile = getCountryProfile(e.country);
      const climate = CLIMATE_NARRATIVES[e.climateZone];
      return {
        id:          `dest-${e.slug}`,
        kind:        "destination",
        lat:         e.coordinates!.lat,
        lng:         e.coordinates!.lng,
        title:       e.name,
        slug:        e.slug,
        country:     e.country,
        climateZone: e.climateZone,
        superRegion: e.superRegionName,
        type:        e.type,
        imageUrl:    generateHeroFallback(e.unsplashKeyword),
        iataCode:    e.iataCode,
        bestMonths:  climate?.bestMonths,
        summerTemp:  climate?.summerTemp,
        sunDays:     climate?.sunDays,
        flightTime:  profile.flightTime,
        highlights:  profile.highlights,
        cuisine:     profile.cuisine,
        priceFrom:   priceMap.get(e.slug),
        hasTiqets:   !!e.tiqetsCityId,
      };
    });
}

// ─── User-Tipps (49 echte aus travel_tips) ──────────────────────────────────

async function loadTipMarkers(): Promise<TipMarker[]> {
  const { data, error } = await db()
    .from("travel_tips")
    .select("id, display_name, title, description, category, location_name, lat, lng, image_url, created_at, status")
    .eq("status", "approved")
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error || !data) return [];

  return data.map((t): TipMarker => ({
    id:           `tip-${t.id}`,
    kind:         "tip",
    lat:          Number(t.lat),
    lng:          Number(t.lng),
    title:        t.title,
    description:  t.description ?? "",
    category:     t.category ?? "geheimtipp",
    authorName:   t.display_name ?? "Anonym",
    imageUrl:     t.image_url ?? undefined,
    locationName: t.location_name ?? undefined,
    createdAt:    t.created_at ?? "",
  }));
}

// ─── Reiseberichte (44 aus travel_reports) ──────────────────────────────────

async function loadReportMarkers(): Promise<ReportMarker[]> {
  const { data, error } = await db()
    .from("travel_reports")
    .select("id, display_name, destination, country, title, rating, recommendation, cover_image_url, visited_at, is_published")
    .eq("is_published", true);

  if (error || !data) return [];

  const out: ReportMarker[] = [];
  for (const r of data) {
    const geo = lookupGeo(r.destination, r.country);
    if (!geo) continue;

    // Mehrere Reports am gleichen Ort → leichter Jitter
    const j = jitter(geo.lat, geo.lng, r.id, 4);

    out.push({
      id:             `report-${r.id}`,
      reportId:       r.id,
      kind:           "report",
      lat:            j.lat,
      lng:            j.lng,
      title:          r.title,
      destination:    r.destination ?? "",
      country:        r.country ?? "",
      authorName:     r.display_name ?? "Anonym",
      rating:         Number(r.rating ?? 0),
      recommendation: !!r.recommendation,
      coverImage:     r.cover_image_url ?? undefined,
      visitedAt:      r.visited_at ?? undefined,
    });
  }
  return out;
}

// ─── Media-Feed (47 aus media_feed) ─────────────────────────────────────────

async function loadMediaMarkers(): Promise<MediaMarker[]> {
  const { data, error } = await db()
    .from("media_feed")
    .select("id, display_name, destination, destination_slug, media_url, media_type, caption, likes_count, is_published")
    .eq("is_published", true);

  if (error || !data) return [];

  const out: MediaMarker[] = [];
  for (const m of data) {
    const geo = lookupGeo(m.destination, null, m.destination_slug);
    if (!geo) continue;
    const j = jitter(geo.lat, geo.lng, m.id, 3);

    out.push({
      id:              `media-${m.id}`,
      kind:            "media",
      lat:             j.lat,
      lng:             j.lng,
      title:           m.caption?.substring(0, 60) ?? m.destination ?? "Reisefoto",
      destinationSlug: m.destination_slug ?? "",
      destination:     m.destination ?? "",
      authorName:      m.display_name ?? "Anonym",
      caption:         m.caption ?? "",
      mediaUrl:        m.media_url ?? "",
      mediaType:       (m.media_type === "video" ? "video" : "image") as "image" | "video",
      likesCount:      Number(m.likes_count ?? 0),
    });
  }
  return out;
}

// ─── Anbieter (65 aus anbieter_profile) ─────────────────────────────────────

async function loadAnbieterMarkers(): Promise<AnbieterMarker[]> {
  const supabase = db();

  // Aktive Anbieter laden
  const { data: anbieter, error } = await supabase
    .from("anbieter_profile")
    .select("id, name, kategorie, bio, avatar_url, stadt, land_name, verifiziert, status")
    .eq("status", "aktiv");

  if (error || !anbieter) return [];

  // Min-Preis + Anzahl aktiver Angebote pro Anbieter laden
  const offerStats = new Map<string, { priceFrom: number; offerCount: number }>();
  try {
    const { data: angebote } = await supabase
      .from("angebote")
      .select("anbieter_id, preis, status")
      .eq("status", "aktiv")
      .not("preis", "is", null);
    if (angebote) {
      for (const o of angebote) {
        const aid = o.anbieter_id as string;
        const preis = Number(o.preis);
        if (!Number.isFinite(preis) || preis <= 0) continue;
        const cur = offerStats.get(aid);
        if (!cur) {
          offerStats.set(aid, { priceFrom: preis, offerCount: 1 });
        } else {
          cur.offerCount += 1;
          if (preis < cur.priceFrom) cur.priceFrom = preis;
        }
      }
    }
  } catch {
    // Keine Angebots-Daten verfügbar → priceFrom bleibt undefined
  }

  const out: AnbieterMarker[] = [];
  for (const a of anbieter) {
    const geo = lookupGeo(a.stadt, a.land_name);
    if (!geo) continue;
    const j = jitter(geo.lat, geo.lng, a.id, 6);
    const stats = offerStats.get(a.id);

    out.push({
      id:          `anbieter-${a.id}`,
      anbieterId:  a.id,
      kind:        "anbieter",
      lat:         j.lat,
      lng:         j.lng,
      title:       a.name,
      name:        a.name,
      kategorie:   a.kategorie ?? "Anbieter",
      bio:         a.bio ?? undefined,
      avatarUrl:   a.avatar_url ?? undefined,
      stadt:       a.stadt ?? undefined,
      landName:    a.land_name ?? undefined,
      verifiziert: !!a.verifiziert,
      priceFrom:   stats?.priceFrom,
      offerCount:  stats?.offerCount,
    });
  }
  return out;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface LoadMarkersOptions {
  layers?: ("destination" | "tip" | "report" | "media" | "anbieter")[];
  /** Wenn gesetzt, nur Marker im Umkreis (km) um diesen Punkt */
  near?: { lat: number; lng: number; radiusKm: number };
  /** Wenn gesetzt, nur Marker mit destinationSlug, country oder superRegionName, der zur Region passt */
  forSlug?: string;
}

export async function loadAllMarkers(opts: LoadMarkersOptions = {}): Promise<MapMarker[]> {
  const layers = opts.layers ?? ["destination", "tip", "report", "media", "anbieter"];

  const tasks: Promise<MapMarker[]>[] = [];
  if (layers.includes("destination")) tasks.push(loadDestinationMarkers());
  if (layers.includes("tip"))         tasks.push(loadTipMarkers());
  if (layers.includes("report"))      tasks.push(loadReportMarkers());
  if (layers.includes("media"))       tasks.push(loadMediaMarkers());
  if (layers.includes("anbieter"))    tasks.push(loadAnbieterMarkers());

  const results = await Promise.all(tasks);
  let markers = results.flat();

  // Optionaler Geo-Filter (Umkreis)
  if (opts.near) {
    const { lat, lng, radiusKm } = opts.near;
    markers = markers.filter((m) => haversineKm(lat, lng, m.lat, m.lng) <= radiusKm);
  }

  // Filter auf Catalog-Slug: alle Marker, die geographisch oder per slug
  // zur Region/dem Land gehören. Sinnvoll fuer eingebettete Destination-Maps
  // (z. B. /urlaubsziele/tuerkei/ → alle Tuerkei-Marker statt nur 80km Radius).
  if (opts.forSlug) {
    const entry = CATALOG.find((e) => e.slug === opts.forSlug);
    if (entry) {
      // Alle Catalog-Slugs des gleichen Country oder Super-Region
      const relatedSlugs = new Set(
        CATALOG
          .filter((e) =>
            e.country === entry.country ||
            e.superRegionSlug === entry.superRegionSlug ||
            e.parentSlug === entry.slug ||
            e.slug === entry.slug
          )
          .map((e) => e.slug)
      );
      markers = markers.filter((m) => {
        if (m.kind === "destination") return relatedSlugs.has(m.slug);
        if (m.kind === "tip")         return true; // Tipps haben keinen slug; lassen wir alle durch
        if (m.kind === "media")       return relatedSlugs.has(m.destinationSlug);
        if (m.kind === "report")      return true; // gleiches Problem wie tip
        if (m.kind === "anbieter")    return m.landName === entry.country || m.landName === entry.superRegionName;
        return true;
      });
    }
  }

  return markers;
}

// Haversine in km — für Umkreis-Filter
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

void isFakeIbeRegionId; // re-export keep
