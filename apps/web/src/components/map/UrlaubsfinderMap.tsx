"use client";

/**
 * UrlaubsfinderMap — Master-Karten-Component für die ganze Seite.
 *
 * Wird verwendet auf:
 *   - /weltkarte/                       (Vollbild, alle Layer + Tipp-Editor)
 *   - /urlaubsziele/[slug]/             (eingebettet, fokussiert auf Destination)
 *
 * Architektur:
 *   - Vanilla-Leaflet (kein react-leaflet wegen React 19 Strict-Mode-Issues)
 *   - useLayoutEffect + manuelles Cleanup
 *   - leaflet.markercluster für 400+ Marker
 *   - Custom Icons pro Layer
 *   - Polymorphes Side-Panel via MapSidePanel
 *   - Filter-State im Component, optional in URL via useSearchParams
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, MarkerClusterGroup } from "leaflet";
import type { MapMarker, MarkerKind } from "@/lib/map/marker-types";
import { LAYER_CONFIG, LAYER_ORDER } from "@/lib/map/marker-types";
import MapSidePanel from "./MapSidePanel";
import MapFilterBar from "./MapFilterBar";

// ─── Leaflet + Cluster CSS lazy laden ──────────────────────────────────────

function LeafletAssets() {
  useEffect(() => {
    if (!document.querySelector('link[data-leaflet-css]')) {
      const link = document.createElement("link");
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet-css", "true");
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[data-cluster-css]')) {
      const link = document.createElement("link");
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
      link.setAttribute("data-cluster-css", "true");
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[data-cluster-default-css]')) {
      const link = document.createElement("link");
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
      link.setAttribute("data-cluster-default-css", "true");
      document.head.appendChild(link);
    }
    // Marker-Stile: Pill + Community-Pin mit Hover-Effekten
    if (!document.querySelector('style[data-uf-marker-css]')) {
      const style = document.createElement("style");
      style.setAttribute("data-uf-marker-css", "true");
      style.textContent = `
        .uf-marker { cursor: pointer !important; }

        /* Booking-Style Preis-Pille (Destinations & Anbieter) */
        .uf-marker-pill .uf-pill-wrap > div:first-of-type {
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          transform-origin: 50% 100%;
        }
        .uf-marker-pill:hover .uf-pill-wrap > div:first-of-type {
          transform: translateX(-50%) scale(1.10);
          background: #1a202c !important;
          color: #ffffff !important;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.15) !important;
          z-index: 10;
        }
        .uf-marker-pill:hover .uf-pill-wrap > div:first-of-type > span:last-child {
          color: #ffffff !important;
        }

        /* Community-Pin (Tipps, Reports, Media) — kreisrund */
        .uf-marker-drop .uf-pill-wrap > div:first-of-type {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .uf-marker-drop:hover .uf-pill-wrap > div:first-of-type {
          transform: translate(-50%, 0) scale(1.20);
          box-shadow: 0 4px 12px rgba(0,0,0,0.32) !important;
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  return null;
}

// ─── Custom Marker Icons (per Layer) ────────────────────────────────────────

// HTML escape helper — null/undefined-safe
function esc(s: string | undefined | null): string {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Marker-Icon-Bauer.
 *
 * Zwei Stile:
 *   1. PRICE PILL — wenn der Marker einen Preis hat (Destination, Anbieter)
 *      Pillenform mit "ab X €" + Emoji links. Direkt sichtbar wie bei Booking.com.
 *   2. ICON DROP — runder Pin mit Emoji für Marker ohne Preis
 *      (Tipps, Reports, Media)
 */
function buildIcon(L: typeof import("leaflet"), m: MapMarker) {
  const cfg = LAYER_CONFIG[m.kind];

  // Hat dieser Marker einen Preis? → Pill-Style
  const hasPrice =
    (m.kind === "destination" && typeof m.priceFrom === "number") ||
    (m.kind === "anbieter"    && typeof m.priceFrom === "number") ||
    (m.kind === "hotel"       && typeof m.priceFrom === "number");

  if (hasPrice) {
    const price =
      m.kind === "destination" || m.kind === "anbieter" || m.kind === "hotel"
        ? Math.round(m.priceFrom!)
        : 0;
    // Booking-Style Pille: weiß, schwarzer fetter Text, dünner Schatten,
    // kleiner farbiger Layer-Indikator links. Anker = exakt lat/lng (Endpunkt).
    const html = `
      <div class="uf-pill-wrap" style="
        position: relative;
        width: 0;
        height: 0;
      ">
        <div style="
          position: absolute;
          left: 0;
          bottom: 8px;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border-radius: 999px;
          padding: 5px 11px 5px 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 800;
          font-size: 12px;
          color: #1a202c;
          white-space: nowrap;
          line-height: 1;
        ">
          <span style="
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: ${cfg.color};
          "></span>
          <span>ab ${price} €</span>
        </div>
        <!-- Verbindungslinie + Endpunkt direkt am lat/lng -->
        <div style="
          position: absolute;
          left: 0;
          top: -8px;
          width: 2px;
          height: 8px;
          background: ${cfg.color};
          transform: translateX(-50%);
        "></div>
        <div style="
          position: absolute;
          left: 0;
          top: -2px;
          width: 8px;
          height: 8px;
          background: #ffffff;
          border: 2px solid ${cfg.color};
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        "></div>
      </div>
    `;
    return L.divIcon({
      html,
      className:  `uf-marker uf-marker-pill uf-marker-${m.kind}`,
      iconSize:   [0, 0],
      iconAnchor: [0, 0],
    });
  }

  // Community-Pin für Tipps/Reports/Media — kompakter runder Pin mit Avatar-Look
  const html = `
    <div class="uf-pill-wrap" style="
      position: relative;
      width: 0;
      height: 0;
    ">
      <div style="
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(-50%, 0);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid ${cfg.color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 1;
        box-shadow: 0 2px 6px rgba(0,0,0,0.22);
      ">
        ${cfg.emoji}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className:  `uf-marker uf-marker-drop uf-marker-${m.kind}`,
    iconSize:   [0, 0],
    iconAnchor: [0, 0],
  });
}

void esc; // string-escape utility, currently unused since icons use sanitized data

// ─── Filter State ────────────────────────────────────────────────────────────

export interface MapFilters {
  layers:      Set<MarkerKind>;
  search:      string;
  country?:    string | null;
  climateZone?: string | null;
  maxPrice?:   number | null;
}

const DEFAULT_FILTERS: MapFilters = {
  layers:  new Set<MarkerKind>(LAYER_ORDER),
  search:  "",
  country: null,
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface UrlaubsfinderMapProps {
  /** Vorgeladene Marker (Server-side) */
  markers: MapMarker[];

  /** Karten-Center (default: Welt) */
  center?: [number, number];

  /** Initial Zoom (default: 2) */
  zoom?: number;

  /** Höhe (CSS-Wert, default: "100vh") */
  height?: string;

  /** Welche Layer dürfen aktiviert werden? Default: alle */
  enabledLayers?: MarkerKind[];

  /** Welche Layer sind initial aktiv? Default: alle enabledLayers */
  defaultActiveLayers?: MarkerKind[];

  /** Filter-UI: 'sidebar' | 'compact' | 'hidden' */
  filterUI?: "sidebar" | "compact" | "hidden";

  /** Suchleiste anzeigen (Nominatim) */
  showSearch?: boolean;

  /** Eigene Marker dieser Slug ausschließen (z. B. Destination-Self) */
  excludeSlug?: string;

  /** Editable: erlaubt User-Tipps zu setzen (Click-to-pick) */
  editable?: boolean;
  onPickLocation?: (lat: number, lng: number) => void;

  /** Compact-Mode: kleinere UI für eingebettete Karten */
  compact?: boolean;

  /** Callback wenn sich die sichtbaren Bounds ändern (zoom/pan) */
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;

  /** Callback wenn sich die sichtbaren Marker (nach Filter) ändern */
  onVisibleMarkersChange?: (markers: MapMarker[]) => void;

  /** Externer "selected"-State (für Sync mit Sidebar-Liste) */
  externalSelected?: MapMarker | null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function UrlaubsfinderMap({
  markers,
  center  = [30, 10],
  zoom    = 3,
  height  = "100vh",
  enabledLayers = LAYER_ORDER,
  defaultActiveLayers,
  filterUI = "sidebar",
  showSearch = true,
  excludeSlug,
  editable = false,
  onPickLocation,
  compact = false,
  onBoundsChange,
  onVisibleMarkersChange,
  externalSelected,
}: UrlaubsfinderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<LeafletMap | null>(null);
  const clusterRef   = useRef<MarkerClusterGroup | null>(null);
  const markersRef   = useRef<Marker[]>([]);

  const [filters, setFilters] = useState<MapFilters>(() => ({
    ...DEFAULT_FILTERS,
    layers: new Set(defaultActiveLayers ?? enabledLayers),
  }));

  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [searchHits, setSearchHits] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);

  // Stabile Refs für Event-Handler
  const onPickRef = useRef(onPickLocation);
  const editableRef = useRef(editable);
  const setSelectedRef = useRef(setSelected);
  const onBoundsRef = useRef(onBoundsChange);
  onPickRef.current = onPickLocation;
  editableRef.current = editable;
  setSelectedRef.current = setSelected;
  onBoundsRef.current = onBoundsChange;

  // Sync externalSelected → internal
  useEffect(() => {
    if (externalSelected !== undefined) {
      setSelected(externalSelected);
    }
  }, [externalSelected]);

  // ── Marker filtern ────────────────────────────────────────────────────────
  const visibleMarkers = useMemo(() => {
    return markers.filter((m) => {
      if (!filters.layers.has(m.kind)) return false;
      if (excludeSlug && m.kind === "destination" && m.slug === excludeSlug) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!m.title.toLowerCase().includes(q)) {
          // Bei Destinations auch country durchsuchen
          if (m.kind === "destination" && !m.country.toLowerCase().includes(q)) return false;
          if (m.kind !== "destination") return false;
        }
      }

      if (filters.country && m.kind === "destination" && m.country !== filters.country) return false;
      if (filters.climateZone && m.kind === "destination" && m.climateZone !== filters.climateZone) return false;
      if (filters.maxPrice && m.kind === "destination" && m.priceFrom && m.priceFrom > filters.maxPrice) return false;

      return true;
    });
  }, [markers, filters, excludeSlug]);

  // Visible Markers nach außen pushen (für Sidebar-Liste)
  useEffect(() => {
    onVisibleMarkersChange?.(visibleMarkers);
  }, [visibleMarkers, onVisibleMarkersChange]);

  // ── Karte initialisieren ───────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("leaflet.markercluster");

    const map = L.map(containerRef.current, {
      center,
      zoom,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: !compact,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Cluster-Group anlegen
    const cluster: MarkerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      iconCreateFunction: (c: { getChildCount: () => number }) => {
        const count = c.getChildCount();
        const size = count < 10 ? 36 : count < 100 ? 44 : 52;
        return L.divIcon({
          html: `<div style="
            width:${size}px;height:${size}px;
            background:linear-gradient(135deg,#1db682,#00838F);
            color:white;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-weight:800;font-size:13px;
            box-shadow:0 2px 12px rgba(0,131,143,0.4);
            border:3px solid white;
          ">${count}</div>`,
          className: "uf-cluster",
          iconSize: [size, size],
        });
      },
    });
    map.addLayer(cluster);

    // Click-Handler für Edit-Modus
    map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
      if (editableRef.current && onPickRef.current) {
        onPickRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    // Bounds-Change-Handler — debounced fürs Hotels-Lazy-Loading
    let boundsTimer: ReturnType<typeof setTimeout> | null = null;
    const emitBounds = () => {
      if (!onBoundsRef.current) return;
      if (boundsTimer) clearTimeout(boundsTimer);
      boundsTimer = setTimeout(() => {
        const b = map.getBounds();
        onBoundsRef.current?.({
          north: b.getNorth(),
          south: b.getSouth(),
          east:  b.getEast(),
          west:  b.getWest(),
        });
      }, 250);
    };
    map.on("moveend", emitBounds);
    map.on("zoomend", emitBounds);
    // Initial bounds emitten
    emitBounds();

    mapRef.current = map;
    clusterRef.current = cluster;

    // Cleanup
    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Marker rendern (bei Filter-Change) ─────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    // Alte Marker entfernen
    cluster.clearLayers();
    markersRef.current = [];

    // Neue Marker bauen — defensive: ein einzelner Fehler darf den Loop nicht killen
    for (const m of visibleMarkers) {
      try {
        if (typeof m.lat !== "number" || typeof m.lng !== "number" || isNaN(m.lat) || isNaN(m.lng)) {
          continue;
        }
        const icon = buildIcon(L, m);
        const marker = L.marker([m.lat, m.lng], { icon, title: m.title ?? "" });
        marker.on("click", () => setSelectedRef.current(m));
        cluster.addLayer(marker);
        markersRef.current.push(marker);
      } catch (err) {
        console.warn("[UrlaubsfinderMap] Marker konnte nicht erstellt werden:", m.id, err);
      }
    }
  }, [visibleMarkers]);

  // ── Wenn `center` oder `zoom` sich ändert (z.B. durch Suche) ──────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(center, zoom, { animate: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  // ── Wenn externalSelected sich ändert: zum Marker fliegen ─────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !externalSelected) return;
    map.flyTo([externalSelected.lat, externalSelected.lng], Math.max(map.getZoom(), 9), {
      duration: 0.6,
    });
  }, [externalSelected]);

  // ── Nominatim-Suche ────────────────────────────────────────────────────────
  async function handleSearch(query: string) {
    if (!query.trim()) {
      setSearchHits([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=0`,
        { headers: { "Accept-Language": "de" } }
      );
      const data = await res.json();
      setSearchHits(data ?? []);
    } catch {
      setSearchHits([]);
    }
  }

  function flyTo(lat: number, lng: number, z = 10) {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([lat, lng], z, { duration: 0.8 });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full" style={{ height }}>
      <LeafletAssets />

      {/* Karte */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: "#cad4e0" }}
      />

      {/* Filter UI */}
      {filterUI !== "hidden" && (
        <MapFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          enabledLayers={enabledLayers}
          markerCount={visibleMarkers.length}
          totalCount={markers.length}
          mode={filterUI}
          showSearch={showSearch}
          onSearch={handleSearch}
          searchHits={searchHits}
          onSearchHitClick={(hit) => {
            flyTo(parseFloat(hit.lat), parseFloat(hit.lon), 10);
            setSearchHits([]);
            setFilters((f) => ({ ...f, search: hit.display_name.split(",")[0] }));
          }}
          compact={compact}
        />
      )}

      {/* Side Panel */}
      {selected && (
        <MapSidePanel
          marker={selected}
          onClose={() => setSelected(null)}
          compact={compact}
        />
      )}

      {/* Edit-Hinweis */}
      {editable && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-[#1db682] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
          📍 Klicke auf die Karte, um einen Tipp zu setzen
        </div>
      )}
    </div>
  );
}
