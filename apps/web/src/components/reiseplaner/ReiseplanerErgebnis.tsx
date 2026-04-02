"use client";

import { useState } from "react";
import {
  Sun, MapPin, Euro, Lightbulb, ChevronDown, ChevronUp,
  RefreshCw, Download, Star,
} from "lucide-react";

interface Aktivitaet {
  zeit: string;
  titel: string;
  beschreibung: string;
  kosten?: string;
  tipp?: string;
}

interface Tag {
  tag: number;
  titel: string;
  aktivitaeten: Aktivitaet[];
}

interface PraktischerTipp {
  kategorie: string;
  tipp: string;
}

interface Reiseplan {
  zusammenfassung: string;
  highlights: string[];
  tage: Tag[];
  praktische_tipps: PraktischerTipp[];
  beste_reisezeit: string;
  gesamtbudget_schaetzung: string;
}

const ZEIT_FARBEN: Record<string, string> = {
  "Vormittag": "bg-amber-100 text-amber-700",
  "Mittag":    "bg-orange-100 text-orange-700",
  "Nachmittag":"bg-blue-100 text-blue-700",
  "Abend":     "bg-purple-100 text-purple-700",
  "Nacht":     "bg-indigo-100 text-indigo-700",
};

interface Props {
  plan: Reiseplan;
  ziel: string;
  onNeu: () => void;
}

export default function ReiseplanerErgebnis({ plan, ziel, onNeu }: Props) {
  const [offeneTag, setOffeneTag] = useState<number>(1);

  const drucken = () => window.print();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-linear-to-br from-[#00838F] to-[#006d78] rounded-3xl p-7 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span className="text-sm font-semibold text-white/80">KI-Reiseplan erstellt</span>
            </div>
            <h2 className="text-3xl font-black mb-2">{ziel}</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">{plan.zusammenfassung}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={drucken}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={onNeu}
              className="flex items-center gap-1.5 bg-white text-[#00838F] hover:bg-blue-50 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Neu planen
            </button>
          </div>
        </div>

        {/* Highlights */}
        {plan.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {plan.highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold">
                ✨ {h}
              </span>
            ))}
          </div>
        )}

        {/* Budget & Reisezeit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {plan.gesamtbudget_schaetzung && (
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-start gap-2">
              <Euro className="w-4 h-4 shrink-0 mt-0.5 text-white/70" />
              <div>
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Budgetschätzung</p>
                <p className="text-sm font-bold mt-0.5">{plan.gesamtbudget_schaetzung}</p>
              </div>
            </div>
          )}
          {plan.beste_reisezeit && (
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-start gap-2">
              <Sun className="w-4 h-4 shrink-0 mt-0.5 text-white/70" />
              <div>
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Beste Reisezeit</p>
                <p className="text-sm font-bold mt-0.5">{plan.beste_reisezeit}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tagespläne */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#00838F]" /> Dein Tagesplan
        </h3>

        {plan.tage?.map((tag) => (
          <div key={tag.tag} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOffeneTag(offeneTag === tag.tag ? 0 : tag.tag)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00838F] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {tag.tag}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Tag {tag.tag}</p>
                  <p className="text-xs text-gray-500">{tag.titel}</p>
                </div>
              </div>
              {offeneTag === tag.tag
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </button>

            {offeneTag === tag.tag && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {tag.aktivitaeten?.map((a, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${ZEIT_FARBEN[a.zeit] ?? "bg-gray-100 text-gray-600"}`}>
                        {a.zeit}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{a.titel}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{a.beschreibung}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {a.kosten && (
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                              💰 {a.kosten}
                            </span>
                          )}
                          {a.tipp && (
                            <span className="text-[11px] text-amber-700 font-medium">
                              💡 {a.tipp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Praktische Tipps */}
      {plan.praktische_tipps?.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#00838F]" /> Praktische Tipps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.praktische_tipps.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-[10px] font-bold text-[#00838F] uppercase tracking-wider mb-1">{t.kategorie}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{t.tipp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neu planen CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onNeu}
          className="inline-flex items-center gap-2 bg-[#00838F] hover:bg-[#006d78] text-white font-bold px-8 py-3.5 rounded-2xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Neue Reise planen
        </button>
      </div>
    </div>
  );
}
