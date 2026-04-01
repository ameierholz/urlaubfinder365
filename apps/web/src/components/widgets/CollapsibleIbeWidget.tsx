"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import IbeWidget from "./IbeWidget";

interface Props {
  dataSrc: string;
  label?: string;
  hint?: string;
}

export default function CollapsibleIbeWidget({ dataSrc, label, hint }: Props) {
  const [open, setOpen] = useState(false);
  // Widget erst beim ersten Öffnen mounten → Script initialisiert korrekt
  const [mounted, setMounted] = useState(false);

  // Externe Karten (ReiseartenCards) können das Widget via Custom Event öffnen
  useEffect(() => {
    const handler = () => {
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener("ibe:open", handler);
    return () => window.removeEventListener("ibe:open", handler);
  }, []);

  function toggle() {
    if (!mounted) setMounted(true);
    setOpen((o) => !o);
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* ── Toggle-Header ─────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        aria-expanded={open}
      >
        <Search className="w-5 h-5 text-[#00838F] shrink-0" />

        <div className="flex-1 min-w-0">
          <span className="font-bold text-gray-900 text-sm">
            {label ?? "Reise suchen & buchen"}
          </span>
          {!open && (
            <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
              {hint ?? "Alle Abflughäfen · Flexibles Datum · 200+ Veranstalter"}
            </span>
          )}
        </div>

        {open ? (
          <span className="flex items-center gap-1.5 text-sm text-gray-500 shrink-0">
            <ChevronUp className="w-4 h-4" />
            Schließen
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-[#00838F] hover:bg-[#006B77] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shrink-0">
            Suche ausklappen
            <ChevronDown className="w-4 h-4" />
          </span>
        )}
      </button>

      {/* Widget erst beim ersten Öffnen in den DOM → korrekte Script-Initialisierung */}
      {mounted && (
        <div className={open ? "border-t border-gray-100" : "hidden"}>
          <IbeWidget dataSrc={dataSrc} />
        </div>
      )}
    </div>
  );
}
