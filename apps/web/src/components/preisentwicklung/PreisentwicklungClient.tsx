"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PriceHistoryChart, { type PricePoint } from "./PriceHistoryChart";
import type { PriceProfileId } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchResult {
  slug: string;
  name: string;
  minPrice: number;
  date: string;
}

interface ChartData {
  slug: string;
  destinationName: string;
  profile: PriceProfileId;
  days: number;
  series: PricePoint[];
  stats: {
    currentMinPrice: number;
    lowestEver: number;
    highestEver: number;
    averagePrice: number;
    trendSlope: number;
    trendDirection: "up" | "down" | "flat";
    forecastNext30: number | null;
    rSquared: number;
    yoyComparison: { currentAvg: number; lastYearAvg: number; changePercent: number } | null;
  };
  hasEnoughData: boolean;
  dataFreshness: string;
}

const PROFILES: { id: PriceProfileId; label: string }[] = [
  { id: "pauschal",    label: "Pauschalreisen" },
  { id: "ai",         label: "All Inclusive"  },
  { id: "last_minute",label: "Last Minute"    },
];

const DAY_OPTIONS = [30, 90, 365];

// ── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({ onSelect }: { onSelect: (slug: string, name: string) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/price-history/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results ?? []);
      setOpen(true);
    }, 280);
  }, [q]);

  function select(r: SearchResult) {
    setQ(r.name);
    setOpen(false);
    onSelect(r.slug, r.name);
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 bg-white border-2 border-gray-200 focus-within:border-[#1db682] rounded-2xl px-4 py-3 shadow-sm transition-colors">
        <span className="text-xl">🔍</span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Urlaubsziel suchen — z. B. Antalya, Mallorca, Kreta …"
          className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm"
        />
        {q && (
          <button onClick={() => { setQ(""); setResults([]); }} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {results.map((r) => (
            <li key={r.slug}>
              <button
                onClick={() => select(r)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm">{r.name}</span>
                {r.minPrice > 0 && (
                  <span className="text-xs text-emerald-600 font-semibold">
                    ab {r.minPrice.toLocaleString("de-DE")} €
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && q.length >= 2 && (
        <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl px-4 py-4 text-sm text-gray-400 text-center">
          Noch keine Preisdaten für „{q}" — <br />
          Daten werden täglich gesammelt.
        </div>
      )}
    </div>
  );
}

// ── YoY comparison card ───────────────────────────────────────────────────────

function YoyCard({ yoy }: { yoy: NonNullable<ChartData["stats"]["yoyComparison"]> }) {
  const cheaper = yoy.changePercent < 0;
  return (
    <div className={`rounded-2xl border-2 p-4 ${cheaper ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
      <p className="text-xs font-semibold text-gray-500 mb-2">Vergleich zum Vorjahr</p>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-gray-400">Dieses Jahr</p>
          <p className="text-lg font-black text-gray-900">{yoy.currentAvg.toLocaleString("de-DE")} €</p>
        </div>
        <div className={`text-2xl font-black ${cheaper ? "text-emerald-600" : "text-red-500"}`}>
          {cheaper ? "↓" : "↑"} {Math.abs(yoy.changePercent)} %
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Vorjahr</p>
          <p className="text-lg font-black text-gray-900">{yoy.lastYearAvg.toLocaleString("de-DE")} €</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {cheaper
          ? `Preise sind derzeit ${Math.abs(yoy.changePercent)} % günstiger als im Vorjahr.`
          : `Preise sind derzeit ${yoy.changePercent} % teurer als im Vorjahr.`}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialSlug?: string;
  initialData?: ChartData;
}

export default function PreisentwicklungClient({ initialSlug, initialData }: Props) {
  const [chartData, setChartData]   = useState<ChartData | null>(initialData ?? null);
  const [profile, setProfile]       = useState<PriceProfileId>("pauschal");
  const [days, setDays]             = useState(90);
  const [loading, setLoading]       = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? "");

  const fetchData = useCallback(async (slug: string, p: PriceProfileId, d: number) => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/price-history/${slug}?profile=${p}&days=${d}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setChartData(json);
    } catch {
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch when profile or days change
  useEffect(() => {
    if (selectedSlug) fetchData(selectedSlug, profile, days);
  }, [selectedSlug, profile, days, fetchData]);

  function handleSelect(slug: string) {
    setSelectedSlug(slug);
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <SearchBar onSelect={handleSelect} />

      {/* Chart area */}
      {loading && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1db682] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Preisdaten werden geladen …</p>
          </div>
        </div>
      )}

      {!loading && chartData && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{chartData.destinationName}</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Preishistorie · {chartData.series.length} Datenpunkte · zuletzt {new Date(chartData.dataFreshness).toLocaleDateString("de-DE")}
                </p>
              </div>
              {/* Stats pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                  Aktuell ab {chartData.stats.currentMinPrice.toLocaleString("de-DE")} €
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                  Tief {chartData.stats.lowestEver.toLocaleString("de-DE")} €
                </span>
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">
                  Hoch {chartData.stats.highestEver.toLocaleString("de-DE")} €
                </span>
              </div>
            </div>

            {/* Profile + days tabs */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      profile === p.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      days === d ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {d === 365 ? "1 Jahr" : `${d} Tage`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="px-6 py-6">
            {chartData.hasEnoughData ? (
              <PriceHistoryChart
                series={chartData.series}
                forecastNext30={chartData.stats.forecastNext30}
                trendDirection={chartData.stats.trendDirection}
                trendSlope={chartData.stats.trendSlope}
                destinationName={chartData.destinationName}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
                <span className="text-4xl">📊</span>
                <p className="text-gray-500 text-sm max-w-xs">
                  Wir sammeln noch Preisdaten für {chartData.destinationName}.<br />
                  Schau in {14 - chartData.series.length} Tagen wieder vorbei.
                </p>
              </div>
            )}
          </div>

          {/* YoY */}
          {chartData.stats.yoyComparison && (
            <div className="px-6 pb-6">
              <YoyCard yoy={chartData.stats.yoyComparison} />
            </div>
          )}

          {/* Prognose-Hinweis */}
          {chartData.stats.forecastNext30 && chartData.stats.rSquared >= 0.2 && (
            <div className="mx-6 mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-xs text-blue-700">
              <strong>Prognose:</strong> Basierend auf dem aktuellen Preistrend (R² = {chartData.stats.rSquared})
              erwarten wir in 30 Tagen einen Mindestpreis von ca.{" "}
              <strong>{chartData.stats.forecastNext30.toLocaleString("de-DE")} €</strong>.
              Dies ist eine Schätzung, keine Garantie.
            </div>
          )}
        </div>
      )}

      {!loading && !chartData && selectedSlug && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400">Keine Preisdaten für dieses Urlaubsziel vorhanden.</p>
        </div>
      )}

      {/* Empty state */}
      {!selectedSlug && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-5xl mb-4">📈</p>
          <p className="text-gray-600 font-semibold">Urlaubsziel suchen und Preisverlauf entdecken</p>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Täglich gesammelte Preisdaten für über 250 Urlaubsziele weltweit —
            mit Trendanalyse, Prognose und Jahresvergleich.
          </p>
        </div>
      )}
    </div>
  );
}
