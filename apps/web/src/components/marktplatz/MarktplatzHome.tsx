"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Star, Clock, BadgeCheck, ChevronLeft, ChevronRight,
  Sparkles, Shield, ThumbsUp,
} from "lucide-react";
import { AKTIVITAETEN, KATEGORIEN, type Kategorie } from "@/data/marktplatz-data";

// ── Kategorie-Navigation ────────────────────────────────────────────────────
const KATEGORIE_NAV: { id: Kategorie | "alle"; emoji: string; label: string }[] = [
  { id: "alle",          emoji: "🌍", label: "Alles" },
  { id: "stadtfuehrung", emoji: "🏛️", label: "Stadtführungen" },
  { id: "tagesausflug",  emoji: "🚌", label: "Ausflüge" },
  { id: "wassersport",   emoji: "🤿", label: "Wassersport" },
  { id: "outdoor",       emoji: "🏔️", label: "Outdoor" },
  { id: "kulinarik",     emoji: "🍽️", label: "Kulinarik" },
  { id: "kultur",        emoji: "🎭", label: "Kultur" },
  { id: "fotoshooting",  emoji: "📸", label: "Fotoshooting" },
  { id: "transfer",      emoji: "🚗", label: "Transfer" },
];

// ── Reiseziele für Sektionen ────────────────────────────────────────────────
const ZIEL_SEKTIONEN = [
  { label: "Türkei",           filter: (a: typeof AKTIVITAETEN[0]) => a.land === "tr" },
  { label: "Mallorca",         filter: (a: typeof AKTIVITAETEN[0]) => a.land === "es" },
  { label: "Kreta & Griechenland", filter: (a: typeof AKTIVITAETEN[0]) => a.land === "gr" },
  { label: "Dubai & Bali",     filter: (a: typeof AKTIVITAETEN[0]) => a.land === "ae" || a.land === "id" },
];

// ── Aktivitäts-Karte ────────────────────────────────────────────────────────
function AktivitaetKarte({ a }: { a: typeof AKTIVITAETEN[0] }) {
  return (
    <Link
      href={`/marktplatz/${a.slug}/`}
      className="group flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Foto */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={a.foto}
          alt={a.titel}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {/* Badges oben links */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {a.beliebt && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Meistgebucht
            </span>
          )}
          {a.neu && (
            <span className="bg-[#00838F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Neu
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-[10px] font-semibold text-gray-400 mb-1">
          {KATEGORIEN[a.kategorie].emoji} {KATEGORIEN[a.kategorie].label}
        </p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#00838F] transition-colors">
          {a.titel}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{a.dauer}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-600 font-medium">Gratis stornierbar</span>
          </span>
        </div>

        {/* Bewertung + Preis */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-800">{a.bewertung}</span>
            <span className="text-[10px] text-gray-400">({a.bewertungenAnzahl})</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400">ab </span>
            <span className="text-base font-black text-gray-900">{a.preis} €</span>
            <span className="text-[10px] text-gray-400"> / Person</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Horizontaler Scroll-Bereich ─────────────────────────────────────────────
function ScrollSection({ titel, items }: { titel: string; items: typeof AKTIVITAETEN }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "l" | "r") => {
    if (ref.current) ref.current.scrollBy({ left: dir === "l" ? -320 : 320, behavior: "smooth" });
  };
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{titel}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("l")} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#00838F] transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={() => scroll("r")} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#00838F] transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        {items.map((a) => <AktivitaetKarte key={a.slug} a={a} />)}
      </div>
    </section>
  );
}

// ── Hauptkomponente ─────────────────────────────────────────────────────────
export default function MarktplatzHome() {
  const [suche, setSuche]         = useState("");
  const [kategorie, setKategorie] = useState<Kategorie | "alle">("alle");
  const katRef = useRef<HTMLDivElement>(null);

  // Gefilterte Ergebnisse (nur wenn aktiv gesucht/gefiltert)
  const istGefiltert = suche.trim() !== "" || kategorie !== "alle";

  const gefiltert = AKTIVITAETEN.filter((a) => {
    const matchSuche = suche === "" ||
      a.titel.toLowerCase().includes(suche.toLowerCase()) ||
      a.ziel.toLowerCase().includes(suche.toLowerCase());
    const matchKat = kategorie === "alle" || a.kategorie === kategorie;
    return matchSuche && matchKat;
  });

  const beliebt = AKTIVITAETEN.filter((a) => a.beliebt);
  const neu     = AKTIVITAETEN.filter((a) => a.neu);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero mit Suchfeld ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
          alt="Aktivitäten & Erlebnisse"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/20" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3 drop-shadow-lg">
            Erlebnisse, die du nie vergisst
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Touren, Stadtführungen & Aktivitäten — direkt bei lokalen Anbietern buchen
          </p>

          {/* Suchfeld */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder="Aktivität oder Reiseziel suchen …"
                className="w-full pl-11 pr-4 py-3.5 text-gray-900 text-sm focus:outline-none rounded-xl"
              />
            </div>
            <button className="bg-[#00838F] hover:bg-[#006d78] text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shrink-0">
              Suchen
            </button>
          </div>

          {/* Trust-Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Gratis stornierbar</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-blue-400" /> Verifizierte Anbieter</span>
            <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4 text-amber-400" /> Bestpreisgarantie</span>
          </div>
        </div>
      </section>

      {/* ── Kategorie-Navigation ───────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div ref={katRef} className="flex gap-1 overflow-x-auto py-3 scrollbar-hide flex-1">
              {KATEGORIE_NAV.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setKategorie(k.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    kategorie === k.id
                      ? "bg-[#00838F] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg leading-none">{k.emoji}</span>
                  <span>{k.label}</span>
                </button>
              ))}
            </div>
            {/* Anbieter-Button in Nav */}
            <Link
              href="/marktplatz/anbieter-werden/"
              className="flex-shrink-0 flex items-center gap-1.5 border-2 border-[#00838F] text-[#00838F] hover:bg-[#00838F] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Anbieter werden
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hauptinhalt ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Gefilterte Ergebnisse */}
        {istGefiltert ? (
          <section>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-semibold text-gray-900">{gefiltert.length}</span> Erlebnisse gefunden
            </p>
            {gefiltert.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Keine Erlebnisse gefunden</p>
                <button onClick={() => { setSuche(""); setKategorie("alle"); }}
                  className="mt-3 text-sm text-[#00838F] font-semibold hover:underline">
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {gefiltert.map((a) => (
                  <Link key={a.slug} href={`/marktplatz/${a.slug}/`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={a.foto} alt={a.titel} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                      {a.beliebt && <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Meistgebucht</span>}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold text-gray-400 mb-1">{KATEGORIEN[a.kategorie].emoji} {KATEGORIEN[a.kategorie].label}</p>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-3 group-hover:text-[#00838F] transition-colors">{a.titel}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold">{a.bewertung}</span>
                          <span className="text-[10px] text-gray-400">({a.bewertungenAnzahl})</span>
                        </div>
                        <span className="font-black text-gray-900">ab {a.preis} €</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Beliebte Erlebnisse */}
            <ScrollSection titel="🔥 Beliebte Erlebnisse" items={beliebt} />

            {/* Neue Erlebnisse */}
            <ScrollSection titel="✨ Neu auf dem Marktplatz" items={neu} />

            {/* Anbieter-Banner */}
            <section className="relative overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80"
                alt="Anbieter werden"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#00838F]/95 via-[#00838F]/85 to-transparent" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10">
                <div className="text-white max-w-lg">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Für lokale Guides & Anbieter
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3">
                    Deine Touren. Tausende deutsche Urlauber.
                  </h2>
                  <p className="text-white/80 leading-relaxed text-sm mb-2">
                    Liste deine Aktivitäten kostenlos auf unserem Marktplatz.
                    Kein Abo, keine Fixkosten — <strong className="text-white">nur 15% Provision</strong> bei erfolgreicher Buchung.
                  </p>
                  <ul className="text-white/75 text-sm space-y-1 mt-3">
                    <li>✅ Kostenlose Registrierung & Listing</li>
                    <li>✅ Verifiziertes Anbieter-Badge</li>
                    <li>✅ Buchungsanfragen direkt per E-Mail</li>
                  </ul>
                </div>
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <Link
                    href="/marktplatz/anbieter-werden/"
                    className="bg-white text-[#00838F] font-black px-8 py-4 rounded-2xl hover:bg-amber-50 transition-colors text-base shadow-xl whitespace-nowrap"
                  >
                    Jetzt kostenlos registrieren →
                  </Link>
                  <p className="text-white/60 text-xs">Freischaltung innerhalb von 48 Stunden</p>
                </div>
              </div>
            </section>

            {/* Alle Aktivitäten */}
            <ScrollSection titel="🌍 Alle Erlebnisse entdecken" items={AKTIVITAETEN} />

            {/* Nach Reiseziel */}
            {ZIEL_SEKTIONEN.map(({ label, filter }) => {
              const items = AKTIVITAETEN.filter(filter);
              return items.length > 0 ? (
                <ScrollSection key={label} titel={`📍 ${label}`} items={items} />
              ) : null;
            })}

            {/* Anbieter-CTA */}
            <section className="bg-linear-to-r from-[#00838F] to-[#006d78] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-white/80 text-sm">Für Guides & Anbieter</span>
                </div>
                <h2 className="text-2xl font-black mb-2">Du bietest Touren oder Aktivitäten an?</h2>
                <p className="text-white/75 max-w-md leading-relaxed text-sm">
                  Kostenlos listen, nur 15% Provision bei Buchung. Erreiche tausende deutsche Urlauber — ohne Fixkosten.
                </p>
              </div>
              <Link
                href="/marktplatz/anbieter-werden/"
                className="shrink-0 bg-white text-[#00838F] font-black px-7 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
              >
                Kostenlos registrieren →
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
