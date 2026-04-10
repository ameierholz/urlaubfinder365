"use client";

/**
 * MapFilterBar — Filter-UI für die UrlaubsfinderMap.
 *
 * Modi:
 *   - "sidebar"  → Vollbreite Sidebar links (Vollbild-Map)
 *   - "compact"  → Schmaler horizontaler Streifen oben (eingebettet)
 *   - "hidden"   → wird vom Parent ausgeblendet
 */

import { useEffect, useRef, useState } from "react";
import { Search, X, Layers, Filter as FilterIcon, ChevronDown } from "lucide-react";
import { CATALOG } from "@/data/catalog-regions";
import type { MapFilters } from "./UrlaubsfinderMap";
import type { MarkerKind } from "@/lib/map/marker-types";
import { LAYER_CONFIG, LAYER_ORDER } from "@/lib/map/marker-types";

interface Props {
  filters: MapFilters;
  onFiltersChange: (f: MapFilters) => void;
  enabledLayers: MarkerKind[];
  markerCount: number;
  totalCount: number;
  mode: "sidebar" | "compact";
  showSearch: boolean;
  onSearch: (q: string) => void;
  searchHits: Array<{ display_name: string; lat: string; lon: string }>;
  onSearchHitClick: (hit: { display_name: string; lat: string; lon: string }) => void;
  compact?: boolean;
}

const CLIMATE_LABELS: Record<string, string> = {
  mediterranean: "🌊 Mittelmeer",
  tropical:      "🌴 Tropisch",
  tropical_dry:  "🏝️ Trocken-tropisch",
  desert:        "🏜️ Wüste",
  atlantic:      "🌊 Atlantik",
  continental:   "🌳 Kontinental",
  alpine:        "🏔️ Alpin",
  arctic:        "❄️ Arktisch",
};

export default function MapFilterBar({
  filters,
  onFiltersChange,
  enabledLayers,
  markerCount,
  totalCount,
  mode,
  showSearch,
  onSearch,
  searchHits,
  onSearchHitClick,
}: Props) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [isOpen, setIsOpen]           = useState(mode === "sidebar");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Country-Optionen aus Catalog ableiten
  const countries = Array.from(new Set(CATALOG.map((e) => e.country))).sort();

  // Suche debouncen
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
      if (showSearch && searchInput.length >= 3) {
        onSearch(searchInput);
      }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function toggleLayer(kind: MarkerKind) {
    const next = new Set(filters.layers);
    if (next.has(kind)) next.delete(kind);
    else next.add(kind);
    onFiltersChange({ ...filters, layers: next });
  }

  function resetFilters() {
    setSearchInput("");
    onFiltersChange({
      layers:  new Set(enabledLayers),
      search:  "",
      country: null,
      climateZone: null,
      maxPrice: null,
    });
  }

  // ── Compact Mode (oben schmal) ─────────────────────────────────────────────
  if (mode === "compact") {
    return (
      <div className="absolute top-3 left-3 right-3 z-10 flex gap-2 flex-wrap">
        {/* Layer-Toggles als kleine Chips */}
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1 px-1.5 py-1.5">
          {enabledLayers.map((kind) => {
            const cfg = LAYER_CONFIG[kind];
            const active = filters.layers.has(kind);
            return (
              <button
                key={kind}
                onClick={() => toggleLayer(kind)}
                title={cfg.label}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all ${
                  active
                    ? "shadow-md scale-105"
                    : "opacity-40 hover:opacity-70"
                }`}
                style={{ background: active ? cfg.color : "#f3f4f6" }}
              >
                <span className={active ? "filter brightness-0 invert" : ""}>{cfg.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Suche */}
        {showSearch && (
          <div className="flex-1 min-w-[200px] relative">
            <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ort suchen…"
                className="flex-1 bg-transparent outline-none text-sm px-2"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchHits.length > 0 && (
              <SearchDropdown hits={searchHits} onClick={onSearchHitClick} />
            )}
          </div>
        )}

        {/* Counter */}
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg px-4 py-1.5 text-xs font-semibold text-gray-600 flex items-center">
          {markerCount} / {totalCount}
        </div>
      </div>
    );
  }

  // ── Sidebar Mode (Vollbild) ────────────────────────────────────────────────
  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-20 sm:hidden bg-white shadow-lg rounded-full p-3"
      >
        {isOpen ? <X className="w-5 h-5" /> : <FilterIcon className="w-5 h-5" />}
      </button>

      <aside
        className={`absolute top-0 bottom-0 left-0 z-10 w-80 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } overflow-y-auto`}
      >
        {/* Header — gradient background (gut sichtbar, nicht ueberlagerbar) */}
        <div className="sticky top-0 z-10 px-5 py-5 text-white shadow-md" style={{ background: "linear-gradient(135deg, #1db682, #00838F)" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <h2 className="text-base font-extrabold">Karte filtern</h2>
            </div>
            <span className="text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full">
              {markerCount} / {totalCount}
            </span>
          </div>
          <p className="text-[11px] text-white/80">
            Reiseziele, Hotels, Tipps & mehr auswählen
          </p>
          {showSearch && (
            <div className="mt-3 relative">
              <div className="flex items-center gap-2 bg-white border border-white/40 rounded-xl px-3 py-2.5 focus-within:border-white">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ort, Land oder Tipp suchen…"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchHits.length > 0 && (
                <SearchDropdown hits={searchHits} onClick={onSearchHitClick} />
              )}
            </div>
          )}
        </div>

        {/* Layer Toggles */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Was anzeigen</h3>
          </div>
          <div className="space-y-2">
            {LAYER_ORDER.filter((k) => enabledLayers.includes(k)).map((kind) => {
              const cfg = LAYER_CONFIG[kind];
              const active = filters.layers.has(kind);
              return (
                <button
                  key={kind}
                  onClick={() => toggleLayer(kind)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    active
                      ? "bg-gray-50 border-2 border-gray-200"
                      : "bg-gray-50/50 border-2 border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cfg.color }}
                  >
                    <span className="text-base">{cfg.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{cfg.label}</p>
                    <p className="text-[11px] text-gray-500 truncate">{cfg.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {}}
                    className="shrink-0 w-4 h-4 accent-[#1db682]"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Country */}
        <FilterSection title="Land">
          <select
            value={filters.country ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, country: e.target.value || null })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1db682]"
          >
            <option value="">Alle Länder</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FilterSection>

        {/* Klimazone */}
        <FilterSection title="Klimazone">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CLIMATE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    climateZone: filters.climateZone === key ? null : key,
                  })
                }
                className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  filters.climateZone === key
                    ? "bg-[#1db682] text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Max Preis */}
        <FilterSection title="Max. Preis (€/Person)">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={filters.maxPrice ?? 3000}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: Number(e.target.value),
                })
              }
              className="flex-1 accent-[#1db682]"
            />
            <span className="text-xs font-bold text-gray-700 w-16 text-right">
              {filters.maxPrice ? `${filters.maxPrice} €` : "alle"}
            </span>
          </div>
        </FilterSection>

        {/* Reset */}
        <div className="p-5">
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function SearchDropdown({
  hits,
  onClick,
}: {
  hits: Array<{ display_name: string; lat: string; lon: string }>;
  onClick: (hit: { display_name: string; lat: string; lon: string }) => void;
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-30 max-h-64 overflow-y-auto">
      {hits.map((hit, i) => (
        <button
          key={i}
          onClick={() => onClick(hit)}
          className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0 truncate"
        >
          📍 {hit.display_name}
        </button>
      ))}
    </div>
  );
}
