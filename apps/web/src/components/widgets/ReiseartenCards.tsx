"use client";

import { CheckCircle2 } from "lucide-react";

const REISEARTEN = [
  {
    emoji: "✈️",
    label: "Pauschalreise",
    desc: "Flug + Hotel – bequem, sicher und oft günstiger als Einzelbuchung.",
    badge: "Bestseller",
    badgeColor: "bg-[#6CC4BA] text-white",
    highlights: ["Flug inklusive", "Transfer inklusive", "Direktbuchung"],
    bg: "from-[#00838F] to-[#005F6B]",
  },
  {
    emoji: "🍹",
    label: "All-Inclusive",
    desc: "Essen, Trinken & Snacks rund um die Uhr – entspannt ohne Preisschock.",
    badge: "Beliebt",
    badgeColor: "bg-amber-500 text-white",
    highlights: ["Vollpension inklusive", "Softdrinks & Bar", "Keine Überraschungen"],
    bg: "from-amber-600 to-orange-700",
  },
  {
    emoji: "⚡",
    label: "Last-Minute",
    desc: "Spontan reisen & bis zu 60 % sparen – Abflug innerhalb der nächsten 14 Tage.",
    badge: "Bis −60 %",
    badgeColor: "bg-red-500 text-white",
    highlights: ["Abflug in <14 Tagen", "Bestpreise", "Sofortbuchung"],
    bg: "from-red-600 to-rose-700",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    label: "Familienurlaub",
    desc: "Familienfreundliche Resorts & Clubs – Kinder willkommen, Eltern entspannen.",
    badge: "Familien-Tipp",
    badgeColor: "bg-violet-500 text-white",
    highlights: ["Kinderermäßigung", "Familienzimmer", "Wasserspaß"],
    bg: "from-violet-600 to-purple-700",
  },
];

/** Klick auf eine Karte: scrollt zum CollapsibleIbeWidget und öffnet es via Custom Event. */
function openSearch() {
  const target = document.getElementById("ibe-suche");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.dispatchEvent(new CustomEvent("ibe:open"));
}

export default function ReiseartenCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-10">
      {REISEARTEN.map((art) => (
        <button
          key={art.label}
          onClick={openSearch}
          className="rounded-2xl overflow-hidden shadow-lg text-left hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer group"
        >
          {/* Gradient Header */}
          <div className={`bg-linear-to-br ${art.bg} px-4 py-3.5 text-white relative`}>
            <div className="absolute top-2.5 right-2.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${art.badgeColor}`}>
                {art.badge}
              </span>
            </div>
            <div className="flex items-center gap-2.5 pr-14">
              <span className="text-2xl leading-none">{art.emoji}</span>
              <h3 className="font-extrabold text-base leading-tight">{art.label}</h3>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white p-3.5 flex flex-col h-full">
            <p className="text-xs text-gray-500 leading-relaxed mb-2.5">{art.desc}</p>
            <ul className="space-y-1.5">
              {art.highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-[#6CC4BA] shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <span className="text-xs font-bold text-[#00838F] flex items-center gap-1 group-hover:gap-2 transition-all">
                Suche öffnen
                <span className="text-[10px]">→</span>
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
