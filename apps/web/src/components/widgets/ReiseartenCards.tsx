"use client";

import { CheckCircle2, Plane, UtensilsCrossed, Clock, Users } from "lucide-react";

const BASE = "https://b2b.specials.de/index/jump/119/2780/993243/";

const REISEARTEN = [
  {
    emoji: "✈️",
    label: "Pauschalreise",
    tagline: "Flug + Hotel – bequem, sicher & günstig",
    desc: "Veranstalter buchen Kontingente zu Großhandelspreisen – das Paket ist fast immer günstiger als Einzelbuchung.",
    badge: "Bestseller",
    badgeColor: "bg-[#6CC4BA] text-white",
    highlights: ["Flug inklusive", "Transfer inklusive", "Gesetzl. Insolvenzschutz"],
    bg: "from-[#00838F] to-[#005F6B]",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2`,
    Icon: Plane,
  },
  {
    emoji: "🍹",
    label: "All-Inclusive",
    tagline: "Essen & Trinken rund um die Uhr",
    desc: "Mahlzeiten, Snacks und Getränke sind alles inklusive – keine Überraschungskosten am Ende des Urlaubs.",
    badge: "Beliebt",
    badgeColor: "bg-amber-500 text-white",
    highlights: ["Vollverpflegung inklusive", "Softdrinks & Bar", "Keine Nebenkosten"],
    bg: "from-amber-600 to-orange-700",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2`,
    Icon: UtensilsCrossed,
  },
  {
    emoji: "⚡",
    label: "Last-Minute",
    tagline: "Spontan reisen – bis zu 60 % sparen",
    desc: "Abflug in den nächsten 14 Tagen: Veranstalter verkaufen freie Plätze stark rabattiert.",
    badge: "Bis −60 %",
    badgeColor: "bg-red-500 text-white",
    highlights: ["Abflug in <14 Tagen", "Stark reduzierte Preise", "Sofortbuchung"],
    bg: "from-red-600 to-rose-700",
    url: `${BASE}?from=0&to=14&duration=7-14&adults=2`,
    Icon: Clock,
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    label: "Familienurlaub",
    tagline: "Kinder willkommen – Eltern entspannen",
    desc: "Familienfreundliche Resorts mit Kinderermäßigungen, Animation und Wasserspaß für die ganze Familie.",
    badge: "Familien-Tipp",
    badgeColor: "bg-violet-500 text-white",
    highlights: ["Kinderermäßigung", "Familienzimmer", "Kids-Club & Wasserspaß"],
    bg: "from-violet-600 to-purple-700",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2&children=1`,
    Icon: Users,
  },
];

export default function ReiseartenCards() {
  function openModal(url: string, title: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (window as any).ibeOpenBooking;
    if (typeof fn === "function") {
      fn(url, title);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-1">Urlaubsarten</p>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              Welche Art Urlaub suchst du?
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Wähle deine Urlaubsart – wir öffnen sofort die passende Buchungsmaske.
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Preise täglich aktualisiert
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REISEARTEN.map(({ emoji, label, tagline, desc, badge, badgeColor, highlights, bg, url, Icon }) => (
            <button
              key={label}
              onClick={() => openModal(url, label)}
              className="group rounded-2xl overflow-hidden shadow-md text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col border border-gray-100"
            >
              {/* Gradient Header */}
              <div className={`bg-linear-to-br ${bg} px-5 py-5 text-white relative`}>
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                  {badge}
                </span>
                <div className="flex items-center gap-3 pr-16 mb-2">
                  <span className="text-4xl leading-none drop-shadow">{emoji}</span>
                  <h3 className="font-extrabold text-xl leading-tight">{label}</h3>
                </div>
                <p className="text-white/80 text-xs leading-snug">{tagline}</p>
              </div>

              {/* Body */}
              <div className="bg-white p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>

                <ul className="space-y-1.5 mb-4">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#00838F] group-hover:gap-3 transition-all duration-150">
                    <Icon className="w-4 h-4 shrink-0" />
                    Jetzt suchen →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
