"use client";

import { Anchor, Ship, Waves, Plane, Zap, Compass, ExternalLink } from "lucide-react";

const PARTNER_ID = "30412";
const BASE = `https://kreuzfahrten.travelsystem.de/de?p=2&subid=${PARTNER_ID}`;

const TABS = [
  { id: "all",   label: "Alle Kreuzfahrten",  icon: Anchor,  extra: "",              desc: "Das komplette Angebot – alle Reedereien & Routen" },
  { id: "sea",   label: "Hochsee",            icon: Ship,    extra: "&type=NS",      desc: "Große Schiffe auf Weltmeeren – Mittelmeer, Karibik & mehr" },
  { id: "fly",   label: "Hochsee + Flug",     icon: Plane,   extra: "&type=S",       desc: "Rundum-sorglos: Flug, Schiff & Kabine aus einer Hand" },
  { id: "river", label: "Flusskreuzfahrten",  icon: Waves,   extra: "&type=R",       desc: "Rhein, Donau, Elbe, Nil – malerische Flussrouten" },
  { id: "kombi", label: "Kreuzfahrt + Hotel", icon: Compass, extra: "&type=KOMBI",   desc: "Kombiangebot: Schiff + Hotelaufenthalt kombiniert" },
  { id: "last",  label: "Last-Minute",        icon: Zap,     extra: "&sort=pauf",    desc: "Spontan auf große Fahrt – zu unschlagbaren Preisen" },
];

function openModal(url: string, title: string) {
  const w = window as typeof window & {
    ibeOpenBooking?: (u: string, t: string) => void;
  };
  if (w.ibeOpenBooking) {
    w.ibeOpenBooking(url, title);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function CruiseWidget() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const url = BASE + tab.extra;
        return (
          <button
            key={tab.id}
            onClick={() => openModal(url, tab.label)}
            className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-gray-200 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                <Icon className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-black text-gray-900 text-sm">{tab.label}</h3>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">{tab.desc}</p>
            <div className="flex items-center gap-1 text-cyan-600 text-xs font-bold mt-auto pt-1">
              Angebote ansehen <ExternalLink className="w-3 h-3" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
