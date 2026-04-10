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
    // Marker-Stile: Pill mit Hover-Effekt + Click-Hint
    if (!document.querySelector('style[data-uf-marker-css]')) {
      const style = document.createElement("style");
      style.setAttribute("data-uf-marker-css", "true");
      style.textContent = `
        .uf-marker { cursor: pointer !important; }
        .uf-marker-pill > div { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .uf-marker-pill:hover > div { transform: scale(1.08); box-shadow: 0 4px 14px rgba(0,0,0,0.28) !important; }
        .uf-marker-drop:hover > div { transform: rotate(-45deg) scale(1.12); }
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
    (m.kind === "anbieter"    && typeof m.priceFrom === "number");

  if (hasPrice) {
    const price = m.kind === "destination" || m.kind === "anbieter"
      ? Math.round(m.priceFrom!)
      : 0;
    const html = `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: white;
        border: 2px solid ${cfg.color};
        border-radius: 999px;
        padding: 4px 10px 4px 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 700;
        font-size: 12px;
        color: ${cfg.color};
        white-space: nowrap;
        line-height: 1;
      ">
        <span style="font-size: 13px;">${cfg.emoji}</span>
        <span>ab ${price} €</span>
      </div>
    `;
    return L.divIcon({
      html,
      className:  `uf-marker uf-marker-pill uf-marker-${m.kind}`,
      iconSize:   undefined,    // auto-size by content
      iconAnchor: [40, 14],     // ungefähr Mitte unten
    });
  }

  // Klassischer Drop-Pin für Tipps/Reports/Media
  const html = `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      background: ${cfg.color};
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">
      <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">${cfg.emoji}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className:  `uf-marker uf-marker-drop uf-marker-${m.kind}`,
    iconSize:   [32, 32],
    iconAnchor: [16, 32],
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
  onPickRef.current = onPickLocation;
  editableRef.current = editable;
  setSelectedRef.current = setSelected;

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
