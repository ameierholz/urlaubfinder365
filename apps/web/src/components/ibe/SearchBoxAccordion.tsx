"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import YpsnetSearchBox from "./YpsnetSearchBox";

/**
 * Ausklappbare Suchbox – das Ypsilon-Widget wird beim ersten Öffnen
 * gemountet (Script lädt einmalig) und danach nur noch ein-/ausgeblendet.
 */
export default function SearchBoxAccordion() {
  const [open,      setOpen]      = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const toggle = () => {
    if (!hasOpened) setHasOpened(true);
    setOpen((v) => !v);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* ── Header / Toggle ──────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-sand-50 transition-colors text-left group"
      >
        {/* Icon */}
        <span className="shrink-0 w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center group-hover:bg-sand-200 transition-colors">
          <Search className="w-5 h-5 text-sand-500" />
        </span>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-900 text-base leading-tight">
            Pauschalreise suchen
          </p>
          <p className="text-sm text-gray-400 mt-0.5 leading-tight">
            Flug &amp; Hotel kombiniert – täglich aktualisierte Angebote vergleichen
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Collapsible Body ─────────────────────────────────────────── */}
      {/* Mount once (hasOpened), then show/hide via CSS to keep script alive */}
      {hasOpened && (
        <div
          style={{ display: open ? "block" : "none" }}
          className="border-t border-gray-100 px-6 py-5"
        >
          <YpsnetSearchBox />
        </div>
      )}
    </div>
  );
}
