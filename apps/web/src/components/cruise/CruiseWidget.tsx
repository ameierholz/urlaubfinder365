"use client";

import { useState } from "react";
import { Anchor, Ship, Waves, Plane, Zap, Compass } from "lucide-react";

const TRAVIA_URL = "https://www.travialinks.de/link/A-30412-0/A/cruisecompass";
const PARTNER_ID = "30412";
const DL = (params = "") =>
  `https://kreuzfahrten.travelsystem.de/de?p=2&subid=${PARTNER_ID}${params}`;

const TABS = [
  { id: "all",   label: "Alle Kreuzfahrten",  icon: Anchor,  extra: "" },
  { id: "sea",   label: "Hochsee",            icon: Ship,    extra: "&type=NS" },
  { id: "fly",   label: "Hochsee + Flug",     icon: Plane,   extra: "&type=S" },
  { id: "river", label: "Flusskreuzfahrten",  icon: Waves,   extra: "&type=R" },
  { id: "kombi", label: "Kreuzfahrt + Hotel", icon: Compass, extra: "&type=KOMBI" },
  { id: "last",  label: "Last-Minute",        icon: Zap,     extra: "&sort=pauf" },
];

export default function CruiseWidget() {
  const [active, setActive] = useState("all");

  function handleTab(id: string) {
    setActive(id);
    // Tab-Klick öffnet Typ-spezifische Suche im IBE-Modal
    const tab = TABS.find((t) => t.id === id);
    if (!tab) return;
    const url = DL(tab.extra);
    const label = tab.label;
    const w = window as typeof window & {
      ibeOpenBooking?: (u: string, t: string) => void;
    };
    if (w.ibeOpenBooking) {
      w.ibeOpenBooking(TRAVIA_URL, label);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div>
      {/* Filter-Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CruiseCompass IBE Widget */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        <iframe
          src={TRAVIA_URL}
          width="100%"
          height="1350"
          frameBorder="0"
          title="Kreuzfahrten buchen – CruiseCompass"
          className="w-full block"
          loading="lazy"
        />
      </div>
    </div>
  );
}
