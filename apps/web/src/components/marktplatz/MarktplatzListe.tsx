"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Users, Star, Search, SlidersHorizontal, BadgeCheck, Sparkles } from "lucide-react";
import { AKTIVITAETEN, KATEGORIEN, type Kategorie } from "@/data/marktplatz-data";

const PREISFILTER = [
  { label: "Alle Preise", min: 0,   max: 9999 },
  { label: "bis 30 €",    min: 0,   max: 30   },
  { label: "30–60 €",     min: 30,  max: 60   },
  { label: "60–100 €",    min: 60,  max: 100  },
  { label: "ab 100 €",    min: 100, max: 9999 },
];

export default function MarktplatzListe() {
  const [suche, setSuche]           = useState("");
  const [kategorie, setKategorie]   = useState<Kategorie | "alle">("alle");
  const [preisIdx, setPreisIdx]     = useState(0);
  const [filterOffen, setFilterOffen] = useState(false);

  const gefiltert = useMemo(() => {
    const preis = PREISFILTER[preisIdx];
    return AKTIVITAETEN.filter((a) => {
      const matchSuche = suche === "" ||
        a.titel.toLowerCase().includes(suche.toLowerCase()) ||
        a.ziel.toLowerCase().includes(suche.toLowerCase());
      const matchKat   = kategorie === "alle" || a.kategorie === kategorie;
      const matchPreis = a.preis >= preis.min && a.preis <= preis.max;
      return matchSuche && matchKat && matchPreis;
    });
  }, [suche, kategorie, preisIdx]);

  return (
    <div className="space-y-6">
      {/* Suchleiste */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Aktivität oder Urlaubsziel suchen …"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] focus:ring-2 focus:ring-[#00838F]/10"
            />
          </div>
          <button
            onClick={() => setFilterOffen(!filterOffen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
              filterOffen ? "bg-[#00838F] text-white border-[#00838F]" : "border-gray-200 text-gray-600 hover:border-[#00838F]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Kategorie-Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setKategorie("alle")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              kategorie === "alle"
                ? "bg-[#00838F] text-white border-[#00838F]"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
            }`}
          >
            Alle
          </button>
          {(Object.entries(KATEGORIEN) as [Kategorie, { label: string; emoji: string }][]).map(([id, { label, emoji }]) => (
            <button
              key={id}
              onClick={() => setKategorie(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                kategorie === id
                  ? "bg-[#00838F] text-white border-[#00838F]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Preis-Filter */}
        {filterOffen && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 self-center">Preis p.P.:</span>
            {PREISFILTER.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPreisIdx(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  preisIdx === i
                    ? "bg-[#00838F] text-white border-[#00838F]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ergebnis-Anzahl */}
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{gefiltert.length}</span> Aktivitäten gefunden
      </p>

      {/* Grid */}
      {gefiltert.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Keine Aktivitäten gefunden</p>
          <p className="text-sm mt-1">Versuche andere Filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {gefiltert.map((a) => (
            <Link
              key={a.slug}
              href={`/marktplatz/${a.slug}/`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Foto */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={a.foto}
                  alt={a.titel}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {a.beliebt && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-900" /> Beliebt
                    </span>
                  )}
                  {a.neu && (
                    <span className="bg-[#00838F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Neu
                    </span>
                  )}
                </div>
                {/* Kategorie */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {KATEGORIEN[a.kategorie].emoji} {KATEGORIEN[a.kategorie].label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-[#00838F] transition-colors">
                  {a.titel}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{a.kurzbeschreibung}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.ziel}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.dauer}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />max. {a.maxTeilnehmer}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image src={a.anbieter.avatar} alt={a.anbieter.name} fill className="object-cover" unoptimized />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{a.anbieter.name}</span>
                    {a.anbieter.verifiziert && <BadgeCheck className="w-3.5 h-3.5 text-[#00838F]" />}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-gray-800">{a.bewertung}</span>
                      <span className="text-[10px] text-gray-400">({a.bewertungenAnzahl})</span>
                    </div>
                    <p className="font-black text-[#00838F] text-base">ab {a.preis} €<span className="text-xs font-normal text-gray-400"> / Person</span></p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
