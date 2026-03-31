"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "flugsuche-widget",      label: "Flug suchen",  emoji: "✈️" },
  { id: "top-flugziele",         label: "Top Ziele",    emoji: "🌍" },
  { id: "gepaeck-vergleich",     label: "Gepäck",       emoji: "🧳" },
  { id: "einreise-schnellcheck", label: "Einreise",     emoji: "🛂" },
  { id: "spar-tipps",            label: "Spar-Tipps",   emoji: "💰" },
  { id: "faq",                   label: "FAQ",          emoji: "❓" },
];

export default function FlugNavBar() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    function onScroll() {
      const navH = window.innerWidth >= 1024 ? 96 : 64; // lg: info-bar(32)+nav(64) | sm: nav(64)
      const scrollY = window.scrollY + navH + 44 + 8; // header + navBar + breathing room
      let current = "";
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActive(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = window.innerWidth >= 1024 ? 96 : 64; // lg: info-bar(32)+nav(64) | sm: nav(64)
    const offset = navH + 44 + 8; // header + navBar + breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="sticky top-16 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-3 py-2.5 px-4 sm:px-6 lg:px-8 min-w-max max-w-7xl mx-auto">
          {/* Label */}
          <span className="shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider pr-3 border-r border-gray-200">
            Schnellnavigation
          </span>
          {/* Buttons */}
          {NAV_ITEMS.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                active === id
                  ? "bg-[#00838F] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-[#00838F]/10 hover:text-[#00838F]"
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
