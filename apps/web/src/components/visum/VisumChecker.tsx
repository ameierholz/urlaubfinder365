"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, CheckCircle, AlertCircle, Clock, Info } from "lucide-react";
import Image from "next/image";
import { VISUM_DATEN, VISUM_TYPEN, type VisumTyp } from "@/data/visum-data";

const FARBEN: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue:    "bg-blue-50 text-blue-700 border-blue-200",
  amber:   "bg-amber-50 text-amber-700 border-amber-200",
  red:     "bg-red-50 text-red-700 border-red-200",
  purple:  "bg-purple-50 text-purple-700 border-purple-200",
};

const BADGE_FARBEN: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue:    "bg-blue-100 text-blue-700",
  amber:   "bg-amber-100 text-amber-700",
  red:     "bg-red-100 text-red-700",
  purple:  "bg-purple-100 text-purple-700",
};

const ICONS: Record<VisumTyp, typeof CheckCircle> = {
  "visumfrei":         CheckCircle,
  "visa-on-arrival":   Clock,
  "e-visum":           Clock,
  "visum-erforderlich": AlertCircle,
  "esta":              Clock,
  "eta":               Clock,
  "tourist-card":      Info,
};

const FILTER_TYPEN: { value: VisumTyp | "alle"; label: string }[] = [
  { value: "alle",             label: "Alle" },
  { value: "visumfrei",        label: "Visumfrei" },
  { value: "visa-on-arrival",  label: "Visum bei Ankunft" },
  { value: "e-visum",          label: "E-Visum" },
  { value: "esta",             label: "ESTA / ETA" },
  { value: "tourist-card",     label: "Touristenkarte" },
  { value: "visum-erforderlich", label: "Visum erforderlich" },
];

export default function VisumChecker() {
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState<VisumTyp | "alle">("alle");

  const ergebnisse = useMemo(() => {
    return VISUM_DATEN.filter((v) => {
      const matchSuche = v.land.toLowerCase().includes(suche.toLowerCase());
      const matchFilter =
        filter === "alle" ||
        v.typ === filter ||
        (filter === "esta" && (v.typ === "esta" || v.typ === "eta"));
      return matchSuche && matchFilter;
    });
  }, [suche, filter]);

  return (
    <div className="space-y-6">
      {/* Suchfeld + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Urlaubsziel suchen, z. B. Thailand, USA, Ägypten …"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] focus:ring-2 focus:ring-[#00838F]/10 transition-colors"
          />
        </div>

        {/* Typ-Filter */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TYPEN.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === f.value
                  ? "bg-[#00838F] text-white border-[#00838F]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ergebnis-Hinweis */}
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{ergebnisse.length}</span> Urlaubsziele gefunden · für deutsche Reisepässe
      </p>

      {/* Ergebnisliste */}
      {ergebnisse.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Kein Urlaubsziel gefunden</p>
          <p className="text-sm mt-1">Versuche einen anderen Suchbegriff.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {ergebnisse.map((v) => {
            const meta   = VISUM_TYPEN[v.typ];
            const farbe  = meta.farbe;
            const Icon   = ICONS[v.typ];

            return (
              <div
                key={v.slug}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${FARBEN[farbe]}`}
              >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                  <Image
                    src={`https://flagcdn.com/48x36/${v.flagge}.png`}
                    alt={v.land}
                    width={32}
                    height={24}
                    className="rounded shadow-sm shrink-0"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{v.land}</h3>
                    <span className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${BADGE_FARBEN[farbe]}`}>
                      <Icon className="w-3 h-3 shrink-0" />
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 pb-4 space-y-2 border-t border-current/10 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Aufenthalt</span>
                    <span className="font-semibold text-gray-800">{v.aufenthalt}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Kosten</span>
                    <span className="font-semibold text-gray-800">{v.kosten}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Bearbeitung</span>
                    <span className="font-semibold text-gray-800">{v.bearbeitung}</span>
                  </div>

                  {v.hinweis && (
                    <p className="text-[11px] text-gray-500 leading-snug pt-1 border-t border-current/10">
                      {v.hinweis}
                    </p>
                  )}

                  {v.affiliateUrl && (
                    <a
                      href={v.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#00838F] hover:bg-[#006d78] text-white text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visum / Einreise beantragen
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
        <strong>Hinweis:</strong> Alle Angaben beziehen sich auf deutsche Reisepässe und sind ohne Gewähr.
        Einreisebestimmungen können sich kurzfristig ändern. Bitte informiere dich vor Reiseantritt zusätzlich
        bei der <a href="https://www.auswaertiges-amt.de/de/ReiseUndSicherheit" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Botschaft des Ziellandes oder beim Auswärtigen Amt</a>.
      </div>
    </div>
  );
}
