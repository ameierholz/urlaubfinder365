"use client";

import { useState, useMemo } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  Calculator, Plane, BedDouble, Utensils, ShoppingBag,
  ChevronRight, ArrowRight,
} from "lucide-react";
import RightSidebar from "@/components/layout/RightSidebar";

// ---------------------------------------------------------------------------
// Static metadata (exported separately; component is 'use client')
// ---------------------------------------------------------------------------
// Note: metadata must be in a server component; see generateMetadata below.

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Destination {
  name: string;
  slug: string;
  countryCode: string;
  flugMin: number; // € p.P. Hinflug
  hotel3: number;  // € pro Nacht Doppelzimmer 3*
  hotel4: number;
  hotel5: number;
  nebenkosten: number; // Ausflüge + Transport + Sonstiges pro Tag p.P.
}

const DESTINATIONS: Destination[] = [
  { name: "Mallorca, Spanien",       slug: "mallorca",        countryCode: "es", flugMin: 80,  hotel3: 60,  hotel4: 110, hotel5: 220, nebenkosten: 30 },
  { name: "Antalya, Türkei",         slug: "antalya",         countryCode: "tr", flugMin: 90,  hotel3: 50,  hotel4: 90,  hotel5: 180, nebenkosten: 20 },
  { name: "Kreta, Griechenland",     slug: "kreta",           countryCode: "gr", flugMin: 85,  hotel3: 65,  hotel4: 115, hotel5: 230, nebenkosten: 35 },
  { name: "Hurghada, Ägypten",       slug: "hurghada",        countryCode: "eg", flugMin: 100, hotel3: 40,  hotel4: 70,  hotel5: 140, nebenkosten: 15 },
  { name: "Dubai, VAE",              slug: "dubai",           countryCode: "ae", flugMin: 280, hotel3: 90,  hotel4: 160, hotel5: 380, nebenkosten: 60 },
  { name: "Malediven",               slug: "malediven",       countryCode: "mv", flugMin: 520, hotel3: 150, hotel4: 280, hotel5: 600, nebenkosten: 50 },
  { name: "Teneriffa, Spanien",      slug: "teneriffa",       countryCode: "es", flugMin: 90,  hotel3: 55,  hotel4: 100, hotel5: 200, nebenkosten: 28 },
  { name: "Bali, Indonesien",        slug: "bali",            countryCode: "id", flugMin: 450, hotel3: 35,  hotel4: 70,  hotel5: 180, nebenkosten: 25 },
  { name: "Thailand (Phuket)",       slug: "phuket",          countryCode: "th", flugMin: 480, hotel3: 40,  hotel4: 80,  hotel5: 200, nebenkosten: 30 },
  { name: "Lanzarote, Spanien",      slug: "lanzarote",       countryCode: "es", flugMin: 95,  hotel3: 58,  hotel4: 105, hotel5: 210, nebenkosten: 28 },
  { name: "Kroatien (Dubrovnik)",    slug: "dubrovnik",       countryCode: "hr", flugMin: 70,  hotel3: 70,  hotel4: 120, hotel5: 250, nebenkosten: 40 },
  { name: "Portugal (Algarve)",      slug: "algarve",         countryCode: "pt", flugMin: 75,  hotel3: 65,  hotel4: 115, hotel5: 230, nebenkosten: 35 },
  { name: "Marokko (Agadir)",        slug: "agadir",          countryCode: "ma", flugMin: 110, hotel3: 45,  hotel4: 80,  hotel5: 160, nebenkosten: 20 },
  { name: "Zypern",                  slug: "zypern",          countryCode: "cy", flugMin: 100, hotel3: 60,  hotel4: 110, hotel5: 220, nebenkosten: 30 },
  { name: "Dominikanische Republik", slug: "dominikanische-republik", countryCode: "do", flugMin: 480, hotel3: 80, hotel4: 140, hotel5: 300, nebenkosten: 25 },
];

type HotelKat = "3" | "4" | "5";
type Verpflegung = "uebernachtung" | "halbpension" | "allinclusive";

const VERPFLEGUNG_AUFSCHLAG: Record<Verpflegung, number> = {
  uebernachtung: 0,
  halbpension: 20,   // € p.P. pro Tag
  allinclusive: 45,
};

const HOTEL_KEY: Record<HotelKat, "hotel3" | "hotel4" | "hotel5"> = {
  "3": "hotel3",
  "4": "hotel4",
  "5": "hotel5",
};

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Urlaubskosten-Rechner 2026",
  url: "https://www.urlaubfinder365.de/extras/urlaubskosten-rechner/",
  description: "Kostenloser Urlaubskosten-Rechner: Berechne Flug, Hotel, Verpflegung und Nebenkosten für deinen Urlaub 2026.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UrlaubskostenRechnerPage({ params }: { params: { locale: string } }) {
  // setRequestLocale must be called — but this is a 'use client' component.
  // For client components, locale is available via params; no server call needed.

  const [destIndex, setDestIndex] = useState(0);
  const [tage, setTage] = useState(10);
  const [personen, setPersonen] = useState(2);
  const [hotelKat, setHotelKat] = useState<HotelKat>("4");
  const [verpflegung, setVerpflegung] = useState<Verpflegung>("halbpension");

  const dest = DESTINATIONS[destIndex];

  const kosten = useMemo(() => {
    const flug = dest.flugMin * 2 * personen; // Hin + Rück
    const hotelNacht = dest[HOTEL_KEY[hotelKat]];
    const hotel = hotelNacht * tage * Math.ceil(personen / 2); // Doppelzimmer
    const mahlzeiten = VERPFLEGUNG_AUFSCHLAG[verpflegung] * tage * personen;
    const neben = dest.nebenkosten * tage * personen;
    const summe = flug + hotel + mahlzeiten + neben;
    return { flug, hotel, mahlzeiten, neben, summe, proPerson: Math.round(summe / personen) };
  }, [dest, tage, personen, hotelKat, verpflegung]);

  const pct = (val: number) => Math.round((val / kosten.summe) * 100);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <main className="min-h-screen bg-gray-950 text-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-900/30 text-teal-400 border border-teal-800/50 rounded-full px-4 py-1.5 text-sm mb-4">
              <Calculator className="w-4 h-4" />
              Kostenloser Urlaubs-Tool
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              Urlaubskosten-Rechner <span className="text-[#1db682]">2026</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Was kostet dein Traumurlaub wirklich? Flug, Hotel, Verpflegung und Nebenkosten auf einen Blick.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Deine Reise</h2>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Reiseziel</label>
                  <select
                    value={destIndex}
                    onChange={(e) => setDestIndex(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#1db682]"
                  >
                    {DESTINATIONS.map((d, i) => (
                      <option key={d.slug} value={i}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Dauer */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Reisedauer: <span className="text-[#1db682] font-bold">{tage} Tage</span>
                  </label>
                  <input
                    type="range" min={3} max={21} value={tage}
                    onChange={(e) => setTage(Number(e.target.value))}
                    className="w-full accent-[#1db682]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 Tage</span><span>21 Tage</span>
                  </div>
                </div>

                {/* Personen */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Personen</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPersonen(n)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${
                          personen === n
                            ? "bg-[#1db682]/20 border-[#1db682] text-[#1db682]"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hotelkategorie */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Hotelkategorie</label>
                  <div className="flex gap-2">
                    {(["3", "4", "5"] as HotelKat[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => setHotelKat(k)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${
                          hotelKat === k
                            ? "bg-[#1db682]/20 border-[#1db682] text-[#1db682]"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {"★".repeat(Number(k))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verpflegung */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Verpflegung</label>
                  <div className="space-y-2">
                    {([
                      { val: "uebernachtung", label: "Nur Übernachtung (ÜF)", desc: "Frühstück inklusive" },
                      { val: "halbpension",   label: "Halbpension (HP)",      desc: "+20 € p.P./Tag" },
                      { val: "allinclusive",  label: "All-Inclusive (AI)",     desc: "+45 € p.P./Tag" },
                    ] as { val: Verpflegung; label: string; desc: string }[]).map(({ val, label, desc }) => (
                      <button
                        key={val}
                        onClick={() => setVerpflegung(val)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-colors ${
                          verpflegung === val
                            ? "bg-[#1db682]/20 border-[#1db682]"
                            : "bg-gray-800 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <span className={`text-sm font-medium ${verpflegung === val ? "text-[#1db682]" : "text-white"}`}>{label}</span>
                        <span className="text-xs text-gray-500">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="lg:col-span-3 space-y-5">

              {/* Total */}
              <div className="bg-gradient-to-br from-[#1db682]/20 to-[#6991d8]/10 border border-[#1db682]/40 rounded-2xl p-6">
                <p className="text-sm text-gray-400 mb-1">Geschätzte Gesamtkosten für {personen} Person{personen > 1 ? "en" : ""}</p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-black text-white">
                    {kosten.summe.toLocaleString("de-DE")} €
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  ca. <strong className="text-white">{kosten.proPerson.toLocaleString("de-DE")} € pro Person</strong> · {tage} Tage · {dest.name}
                </p>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kostenaufschlüsselung</h2>

                {[
                  { icon: <Plane className="w-4 h-4" />, label: "Flug (Hin + Rück)", val: kosten.flug, color: "bg-[#6991d8]" },
                  { icon: <BedDouble className="w-4 h-4" />, label: `Hotel (${hotelKat}★, ${tage} Nächte)`, val: kosten.hotel, color: "bg-[#1db682]" },
                  { icon: <Utensils className="w-4 h-4" />, label: "Verpflegung", val: kosten.mahlzeiten, color: "bg-amber-500" },
                  { icon: <ShoppingBag className="w-4 h-4" />, label: "Ausflüge & Nebenkosten", val: kosten.neben, color: "bg-purple-500" },
                ].map(({ icon, label, val, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-gray-500">{icon}</span>
                        {label}
                      </div>
                      <span className="text-sm font-bold text-white">{val.toLocaleString("de-DE")} €</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct(val)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 text-right">{pct(val)}% der Gesamtkosten</p>
                  </div>
                ))}
              </div>

              {/* Hinweis */}
              <p className="text-xs text-gray-600 px-1">
                * Schätzwerte basierend auf Durchschnittspreisen. Tatsächliche Kosten variieren je nach Buchungszeitpunkt, Saison und Anbieter. Flugkosten = Hin- und Rückflug ab Deutschland.
              </p>

              {/* CTA */}
              <Link
                href={`/urlaubsziele/${dest.slug}/`}
                className="flex items-center justify-between bg-[#1db682] hover:bg-[#18a472] text-white rounded-2xl px-6 py-4 font-bold transition-colors group"
              >
                <span>Jetzt günstige {dest.name}-Angebote finden</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Cross Links */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-3">Weitere nützliche Tools</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/extras/reisezeit-finder/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-[#1db682]" />
                    Reisezeit-Finder
                  </Link>
                  <Link href="/ki-reiseplaner/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-[#1db682]" />
                    KI-Reiseplaner
                  </Link>
                  <Link href="/preisentwicklung/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-[#1db682]" />
                    Preisentwicklung
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
