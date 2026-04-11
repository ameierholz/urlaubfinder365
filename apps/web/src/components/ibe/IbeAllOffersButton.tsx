"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight } from "lucide-react";
import IbeTeaser from "./IbeTeaser";

interface Props {
  label: string;           // z.B. "Alle Pauschalreisen anzeigen"
  modalTitle: string;      // z.B. "Pauschalreisen nach Mallorca"
  regionId?: string;
  cityId?: string;
  boardCode?: string;
  from?: string;
  to?: string;
  duration?: string;
  adults?: string;
  category?: string;
  minRecommrate?: string;
  excludeAi?: boolean;
  accentColor?: string;    // Akzentfarbe des Buttons (passend zum Kategorie-Banner)
}

export default function IbeAllOffersButton({
  label,
  modalTitle,
  regionId,
  cityId,
  boardCode,
  from,
  to,
  duration,
  adults,
  category,
  minRecommrate,
  excludeAi,
  accentColor = "#1db682",
}: Props) {
  const [open, setOpen] = useState(false);

  // Body-Scroll sperren wenn Modal offen
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // IBE-Engine neu scannen damit der frisch gemountete Teaser initialisiert wird
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)._ibeScan?.();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // Escape-Taste schließt Modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm transition-all border-2"
        style={{
          borderColor: accentColor,
          color: accentColor,
          background: `${accentColor}0f`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}1a`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}0f`;
        }}
      >
        {label}
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div className="relative z-10 mt-auto sm:mt-0 sm:m-auto w-full sm:max-w-4xl sm:rounded-2xl bg-white flex flex-col max-h-[92dvh] sm:max-h-[88vh] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                  Alle Angebote
                </p>
                <h2 className="text-base font-black text-gray-900 leading-tight">{modalTitle}</h2>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* IBE-Content */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <IbeTeaser
                regionId={regionId}
                cityId={cityId}
                boardCode={boardCode}
                from={from}
                to={to}
                duration={duration}
                adults={adults}
                category={category}
                minRecommrate={minRecommrate}
                excludeAi={excludeAi}
                hideHeading
              />
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">Alle Preise inkl. Flug · 2 Personen · 7 Nächte</p>
              <button
                onClick={close}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
