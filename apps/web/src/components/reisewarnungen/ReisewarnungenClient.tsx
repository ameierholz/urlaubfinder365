"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Search, ExternalLink, RefreshCw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TravelWarning {
  iso3_country_code: string;
  iso2_country_code: string | null;
  country_name: string;
  warning_level: "warning" | "partial" | "note" | "none";
  situation_short: string | null;
  aa_last_updated: string | null;
  fetched_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  warning: {
    label: "Reisewarnung",
    short: "Warnung",
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700 border-red-200",
    icon_color: "text-red-500",
    dot: "bg-red-500",
    description: "Das Auswärtige Amt warnt ausdrücklich vor Reisen in dieses Land.",
  },
  partial: {
    label: "Teilreisewarnung",
    short: "Teilwarnung",
    icon: AlertCircle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    icon_color: "text-orange-500",
    dot: "bg-orange-500",
    description: "Warnung gilt nur für bestimmte Regionen des Landes.",
  },
  note: {
    label: "Sicherheitshinweis",
    short: "Hinweis",
    icon: Info,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon_color: "text-yellow-600",
    dot: "bg-yellow-500",
    description: "Erhöhte Vorsicht empfohlen. Kein offizielles Reiseverbot.",
  },
  none: {
    label: "Kein Hinweis",
    short: "Okay",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon_color: "text-emerald-500",
    dot: "bg-emerald-400",
    description: "Keine besonderen Sicherheitshinweise.",
  },
} as const;

function fmtDate(iso: string | null) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function LevelFilter({
  active,
  onChange,
  counts,
}: {
  active: string[];
  onChange: (v: string[]) => void;
  counts: Record<string, number>;
}) {
  const levels = ["warning", "partial", "note", "none"] as const;

  function toggle(l: string) {
    onChange(active.includes(l) ? active.filter((x) => x !== l) : [...active, l]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((l) => {
        const cfg = LEVEL_CONFIG[l];
        const Icon = cfg.icon;
        const on = active.includes(l);
        return (
          <button
            key={l}
            onClick={() => toggle(l)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              on ? `${cfg.badge} border` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
            <span className="text-xs opacity-70 ml-0.5">({counts[l] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}

function WarningCard({ w, expanded, onToggle }: { w: TravelWarning; expanded: boolean; onToggle: () => void }) {
  const cfg = LEVEL_CONFIG[w.warning_level];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:brightness-[0.98] transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-5 h-5 shrink-0 ${cfg.icon_color}`} />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm">{w.country_name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Aktualisiert: {fmtDate(w.aa_last_updated ?? w.fetched_at)}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ml-3 ${cfg.badge}`}>
          {cfg.short}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-current/10">
          <p className="text-xs font-semibold text-gray-500 mt-3 mb-1.5">{cfg.description}</p>
          {w.situation_short && (
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
              {w.situation_short}
            </p>
          )}
          <a
            href="https://www.auswaertiges-amt.de/de/service/laender-reisewarnungen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-3 h-3" />
            Vollständige Information beim Auswärtigen Amt
          </a>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReisewarnungenClient() {
  const [warnings, setWarnings]     = useState<TravelWarning[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchedAt, setFetchedAt]   = useState<string | null>(null);
  const [q, setQ]                   = useState("");
  const [levels, setLevels]         = useState<string[]>(["warning", "partial", "note"]);
  const [expanded, setExpanded]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/travel-warnings")
      .then((r) => r.json())
      .then((d) => {
        setWarnings(d.warnings ?? []);
        if (d.warnings?.length) setFetchedAt(d.warnings[0].fetched_at);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { warning: 0, partial: 0, note: 0, none: 0 };
    warnings.forEach((w) => { c[w.warning_level] = (c[w.warning_level] ?? 0) + 1; });
    return c;
  }, [warnings]);

  const filtered = useMemo(() => {
    return warnings.filter((w) => {
      if (!levels.includes(w.warning_level)) return false;
      if (q.length >= 2 && !w.country_name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [warnings, levels, q]);

  const activeWarnings = warnings.filter((w) => w.warning_level === "warning").length;
  const activePartial  = warnings.filter((w) => w.warning_level === "partial").length;

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["warning", "partial", "note", "none"] as const).map((l) => {
          const cfg = LEVEL_CONFIG[l];
          const Icon = cfg.icon;
          return (
            <div key={l} className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-4 text-center`}>
              <Icon className={`w-6 h-6 mx-auto mb-2 ${cfg.icon_color}`} />
              <p className="text-2xl font-black text-gray-900">{loading ? "…" : (counts[l] ?? 0)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alert banner if active warnings exist */}
      {!loading && (activeWarnings > 0 || activePartial > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-sm">
              Aktuelle Warnungen: {activeWarnings} Reisewarnung{activeWarnings !== 1 ? "en" : ""}, {activePartial} Teilwarnung{activePartial !== 1 ? "en" : ""}
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Bitte informiere dich vor deiner Buchung über die aktuelle Sicherheitslage.
            </p>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white border-2 border-gray-200 focus-within:border-[#1db682] rounded-2xl px-4 py-3 shadow-sm transition-colors">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Land suchen – z. B. Türkei, Ägypten, Israel …"
            className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm"
          />
          {q && <button onClick={() => setQ("")} className="text-gray-400 hover:text-gray-600">✕</button>}
        </div>
        <LevelFilter active={levels} onChange={setLevels} counts={counts} />
      </div>

      {/* List */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-[#1db682] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400">Keine Länder für deine Filter gefunden.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((w) => (
            <WarningCard
              key={w.iso3_country_code}
              w={w}
              expanded={expanded === w.iso3_country_code}
              onToggle={() => setExpanded((p) => (p === w.iso3_country_code ? null : w.iso3_country_code))}
            />
          ))}
        </div>
      )}

      {/* Source footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>
            Datenquelle: <strong>Auswärtiges Amt Deutschland</strong> · täglich automatisch aktualisiert
            {fetchedAt && ` · Letzte Aktualisierung: ${fmtDate(fetchedAt)}`}
          </span>
        </div>
        <a
          href="https://www.auswaertiges-amt.de/de/service/laender-reisewarnungen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ExternalLink className="w-3 h-3" />
          Zum Auswärtigen Amt
        </a>
      </div>
    </div>
  );
}
