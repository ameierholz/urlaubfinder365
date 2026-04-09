"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sun, Palmtree, Mountain, Building2, Coins, ChevronRight,
  MapPin, ArrowRight,
} from "lucide-react";

type Typ = "strand" | "kultur" | "abenteuer" | "stadt";

interface DestinationData {
  name: string;
  slug: string;
  countryCode: string;
  besteMonateIdx: number[];
  typen: Typ[];
  budgetStufe: 1 | 2 | 3;
  highlight: string;
  temp: number[];
}

const DESTINATIONS: DestinationData[] = [
  { name: "Mallorca", slug: "mallorca", countryCode: "es", besteMonateIdx: [3,4,5,8,9], typen: ["strand","kultur","stadt"], budgetStufe: 2, highlight: "Traumstrände & Tramuntana-Gebirge", temp: [14,15,17,19,22,26,29,29,26,22,17,15] },
  { name: "Antalya", slug: "antalya", countryCode: "tr", besteMonateIdx: [3,4,5,6,7,8,9], typen: ["strand","kultur"], budgetStufe: 1, highlight: "Lykische Küste & All-Inclusive-Hotels", temp: [10,11,14,18,23,28,33,33,29,23,17,12] },
  { name: "Bali", slug: "bali", countryCode: "id", besteMonateIdx: [4,5,6,7,8,9], typen: ["strand","kultur","abenteuer"], budgetStufe: 1, highlight: "Reisterrassen, Tempel & Surfer-Strände", temp: [27,27,28,28,27,26,26,26,27,27,27,27] },
  { name: "Kreta", slug: "kreta", countryCode: "gr", besteMonateIdx: [4,5,6,7,8,9], typen: ["strand","kultur"], budgetStufe: 2, highlight: "Minoische Kultur & herrliche Strände", temp: [12,12,14,18,23,27,29,29,26,21,17,13] },
  { name: "Thailand (Phuket)", slug: "phuket", countryCode: "th", besteMonateIdx: [0,1,2,3,10,11], typen: ["strand","abenteuer","kultur"], budgetStufe: 1, highlight: "Smaragdgrüne Buchten & lebhaftes Nachtleben", temp: [27,28,28,29,28,27,27,27,27,27,27,27] },
  { name: "Dubai", slug: "dubai", countryCode: "ae", besteMonateIdx: [0,1,2,3,10,11], typen: ["strand","stadt","abenteuer"], budgetStufe: 3, highlight: "Futuristische Skyline & Wüsten-Abenteuer", temp: [19,20,23,27,32,34,36,37,34,31,26,21] },
  { name: "Malediven", slug: "malediven", countryCode: "mv", besteMonateIdx: [0,1,2,3,4], typen: ["strand"], budgetStufe: 3, highlight: "Überwasser-Bungalows & Korallenriffe", temp: [28,28,29,30,29,28,28,28,28,28,28,28] },
  { name: "Kroatien (Dubrovnik)", slug: "dubrovnik", countryCode: "hr", besteMonateIdx: [4,5,6,7,8,9], typen: ["strand","kultur","stadt"], budgetStufe: 2, highlight: "Mittelalterliche Altstadt & Adriatisches Meer", temp: [9,10,12,16,20,24,27,27,23,18,14,10] },
  { name: "Lanzarote", slug: "lanzarote", countryCode: "es", besteMonateIdx: [0,1,2,3,10,11], typen: ["strand","abenteuer"], budgetStufe: 2, highlight: "Vulkanlandschaften & ganzjährig Sonne", temp: [18,18,19,20,21,23,25,26,25,23,21,19] },
  { name: "Portugal (Algarve)", slug: "algarve", countryCode: "pt", besteMonateIdx: [4,5,6,7,8,9], typen: ["strand","kultur"], budgetStufe: 2, highlight: "Goldene Felsenküste & Surferwellen", temp: [13,14,16,17,19,22,25,26,23,20,16,13] },
  { name: "Marokko (Marrakesch)", slug: "marrakesch", countryCode: "ma", besteMonateIdx: [2,3,4,9,10], typen: ["kultur","abenteuer","stadt"], budgetStufe: 1, highlight: "Djemaa el-Fna & Saharawüste", temp: [12,14,17,20,23,27,33,32,27,22,16,13] },
  { name: "Japan (Tokio)", slug: "tokio", countryCode: "jp", besteMonateIdx: [2,3,4,9,10], typen: ["kultur","stadt","abenteuer"], budgetStufe: 3, highlight: "Kirschblüten, Anime-Kultur & Tradition", temp: [5,6,10,14,19,22,26,27,24,19,14,7] },
  { name: "Teneriffa", slug: "teneriffa", countryCode: "es", besteMonateIdx: [0,1,2,3,10,11], typen: ["strand","abenteuer"], budgetStufe: 2, highlight: "Teide-Nationalpark & ewiger Frühling", temp: [18,18,19,20,21,24,26,27,26,23,21,19] },
  { name: "Hurghada", slug: "hurghada", countryCode: "eg", besteMonateIdx: [0,1,2,3,9,10,11], typen: ["strand","kultur"], budgetStufe: 1, highlight: "Rotes Meer & Tauchen im Korallenriff", temp: [18,19,21,25,30,33,35,35,32,28,23,19] },
  { name: "Dominik. Republik", slug: "dominikanische-republik", countryCode: "do", besteMonateIdx: [0,1,2,3,4], typen: ["strand","abenteuer"], budgetStufe: 2, highlight: "Palmenstrände & Karibik-Flair", temp: [26,26,27,28,28,28,28,29,28,27,27,26] },
];

const MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

const TYP_CONFIG: Record<Typ, { label: string; icon: React.ReactNode; color: string }> = {
  strand:    { label: "Strand & Meer",  icon: <Palmtree className="w-4 h-4" />,  color: "bg-cyan-900/40 border-cyan-700 text-cyan-400" },
  kultur:    { label: "Kultur & Sehen", icon: <Mountain className="w-4 h-4" />,  color: "bg-amber-900/40 border-amber-700 text-amber-400" },
  abenteuer: { label: "Abenteuer",      icon: <Mountain className="w-4 h-4" />,  color: "bg-orange-900/40 border-orange-700 text-orange-400" },
  stadt:     { label: "Städtereise",    icon: <Building2 className="w-4 h-4" />, color: "bg-purple-900/40 border-purple-700 text-purple-400" },
};

const BUDGET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Günstig (< 500 €/P.)",
  2: "Mittel (500–1.200 €/P.)",
  3: "Premium (> 1.200 €/P.)",
};

export default function ReisezeitFinderClient() {
  const [monatIdx, setMonatIdx] = useState<number | null>(null);
  const [selectedTypen, setSelectedTypen] = useState<Typ[]>([]);
  const [budgetStufe, setBudgetStufe] = useState<1 | 2 | 3 | null>(null);

  function toggleTyp(typ: Typ) {
    setSelectedTypen((prev) =>
      prev.includes(typ) ? prev.filter((t) => t !== typ) : [...prev, typ]
    );
  }

  const results = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const monatOk = monatIdx === null || d.besteMonateIdx.includes(monatIdx);
      const typOk = selectedTypen.length === 0 || selectedTypen.some((t) => d.typen.includes(t));
      const budgetOk = budgetStufe === null || d.budgetStufe <= budgetStufe;
      return monatOk && typOk && budgetOk;
    });
  }, [monatIdx, selectedTypen, budgetStufe]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Filter-Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Deine Präferenzen</h2>

            {/* Monat */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Wann möchtest du verreisen?</label>
              <div className="grid grid-cols-3 gap-1.5">
                {MONATE.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setMonatIdx(monatIdx === i ? null : i)}
                    className={
                      "py-1.5 rounded-lg text-xs font-medium border transition-colors " +
                      (monatIdx === i
                        ? "bg-[#1db682]/20 border-[#1db682] text-[#1db682]"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600")
                    }
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
              {monatIdx !== null && (
                <p className="text-xs text-[#1db682] mt-1.5">Ausgewählt: {MONATE[monatIdx]}</p>
              )}
            </div>

            {/* Reisetyp */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Was ist dir wichtig?</label>
              <div className="space-y-2">
                {(Object.entries(TYP_CONFIG) as [Typ, typeof TYP_CONFIG[Typ]][]).map(([typ, cfg]) => (
                  <button
                    key={typ}
                    onClick={() => toggleTyp(typ)}
                    className={
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-colors " +
                      (selectedTypen.includes(typ)
                        ? cfg.color
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600")
                    }
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                <Coins className="w-4 h-4 inline mr-1.5 text-[#1db682]" />
                Maximalbudget p.P.
              </label>
              <div className="space-y-2">
                {([1, 2, 3] as (1 | 2 | 3)[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudgetStufe(budgetStufe === b ? null : b)}
                    className={
                      "w-full text-left px-3 py-2 rounded-xl border text-sm transition-colors " +
                      (budgetStufe === b
                        ? "bg-[#1db682]/20 border-[#1db682] text-[#1db682]"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600")
                    }
                  >
                    {BUDGET_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>

            {(monatIdx !== null || selectedTypen.length > 0 || budgetStufe !== null) && (
              <button
                onClick={() => { setMonatIdx(null); setSelectedTypen([]); setBudgetStufe(null); }}
                className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {results.length === DESTINATIONS.length
                ? "Alle 15 Top-Destinationen"
                : `${results.length} passende Reiseziele`}
            </h2>
            {monatIdx !== null && (
              <span className="text-sm text-gray-400">
                Beste Reisezeit: <strong className="text-white">{MONATE[monatIdx]}</strong>
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-gray-400">Keine Treffer für diese Kombination.</p>
              <button
                onClick={() => { setMonatIdx(null); setSelectedTypen([]); setBudgetStufe(null); }}
                className="mt-3 text-sm text-[#1db682] hover:underline"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((d) => {
                const tempAktuell = monatIdx !== null ? d.temp[monatIdx] : null;
                return (
                  <Link
                    key={d.slug}
                    href={`/urlaubsziele/${d.slug}/`}
                    className="bg-gray-900 border border-gray-800 hover:border-[#1db682]/40 rounded-2xl p-4 transition-all group block"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/24x18/${d.countryCode}.png`}
                          alt={d.countryCode}
                          className="rounded-sm"
                          width={24}
                          height={18}
                        />
                        <span className="font-bold text-white">{d.name}</span>
                      </div>
                      {tempAktuell !== null && (
                        <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                          <Sun className="w-3.5 h-3.5" />
                          {tempAktuell}°C
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mb-3">{d.highlight}</p>

                    {/* Reisezeit-Balken */}
                    <div className="mb-3">
                      <div className="flex gap-0.5">
                        {MONATE.map((_, i) => (
                          <div
                            key={i}
                            className={
                              "h-1.5 flex-1 rounded-full transition-colors " +
                              (d.besteMonateIdx.includes(i)
                                ? monatIdx === i ? "bg-[#1db682]" : "bg-[#1db682]/50"
                                : "bg-gray-800")
                            }
                            title={MONATE[i]}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">
                        Beste Reisezeit: {d.besteMonateIdx.map((i) => MONATE[i].slice(0, 3)).join(" · ")}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {d.typen.map((typ) => (
                        <span
                          key={typ}
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${TYP_CONFIG[typ].color}`}
                        >
                          {TYP_CONFIG[typ].label}
                        </span>
                      ))}
                      <span
                        className={
                          "text-[10px] px-2 py-0.5 rounded-full border " +
                          (d.budgetStufe === 1
                            ? "bg-emerald-900/40 border-emerald-700 text-emerald-400"
                            : d.budgetStufe === 2
                              ? "bg-blue-900/40 border-blue-700 text-blue-400"
                              : "bg-yellow-900/40 border-yellow-700 text-yellow-400")
                        }
                      >
                        {d.budgetStufe === 1 ? "Günstig" : d.budgetStufe === 2 ? "Mittelklasse" : "Premium"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#1db682] group-hover:gap-2 transition-all">
                      <MapPin className="w-3 h-3" />
                      Angebote ansehen
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Cross-Links */}
          <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm font-semibold text-white mb-3">Weitere hilfreiche Tools</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/extras/urlaubskosten-rechner/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#1db682]" />
                Urlaubskosten-Rechner
              </Link>
              <Link href="/ki-reiseplaner/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#1db682]" />
                KI-Reiseplaner
              </Link>
              <Link href="/visum-checker/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#1db682]" />
                Visum-Checker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
