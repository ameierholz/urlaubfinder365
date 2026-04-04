"use client";

import { useEffect, useRef, useState } from "react";

interface IbeTeaserProps {
  regionId?: string;
  cityId?: string;
  headline?: string;
  /** Versteckt die interne Überschrift – nützlich wenn die Seite eigene H2 hat */
  hideHeading?: boolean;
  boardCode?: string;   // "AI" for All-Inclusive
  from?: string;        // days from today (min departure)
  to?: string;          // days from today (max departure)
  duration?: string;    // e.g. "7-7"
  adults?: string;
  children?: string;   // e.g. "9,9" for 2 children aged 9
  category?: string;
  minRecommrate?: string;
  excludeAi?: boolean;
  /** "count" → sortiert nach Anzahl Bewertungen absteigend */
  sortBy?: string;
  /** true → max. 2 Hotels pro Ort/Region (Ortsvielfalt) */
  diverseResults?: boolean;
  /** Komma-getrennte Hotel-Feature-Keywords, z.B. "ado,bea" */
  keywords?: string;
  /** Max. Preis pro Person in EUR */
  maxPrice?: string;
}

/** Renders an IBE offer-carousel teaser.
 *  Initialized lazily by ibe-engine.js via IntersectionObserver. */
export default function IbeTeaser({
  regionId = "",
  cityId = "",
  headline = "",
  hideHeading = false,
  boardCode = "",
  from = "14",
  to = "42",
  duration = "7-7",
  adults = "2",
  children = "",
  category = "3",
  minRecommrate = "50",
  excludeAi = false,
  sortBy = "",
  diverseResults = false,
  keywords = "",
  maxPrice = "",
}: IbeTeaserProps) {
  // hideHeading wird als data-Attribut an ibe-engine.js übergeben
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Trigger scan so newly mounted elements are picked up
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._ibeScan?.();
  }, [mounted]);

  // Kein SSR – verhindert Hydration-Mismatch durch DOM-Mutation von ibe-engine.js
  if (!mounted) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="ibe-auto-teaser"
        data-region={regionId}
        data-city={cityId}
        data-headline={headline}
        data-board-code={boardCode}
        data-from={from}
        data-to={to}
        data-duration={duration}
        data-adults={adults}
        data-children={children || undefined}
        data-category={category}
        data-minrecommrate={minRecommrate}
        data-exclude-ai={excludeAi ? "true" : ""}
        data-sort-by={sortBy || undefined}
        data-diverse-results={diverseResults ? "true" : undefined}
        data-keywords={keywords || undefined}
        data-max-price={maxPrice || undefined}
        data-no-heading={hideHeading ? "true" : undefined}
      />

      {/* Scroll-Indikator */}
      <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 select-none">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-4 h-1.5 rounded-full bg-[#1db682]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
        <span className="text-[11px] font-medium text-gray-400">Weitere Angebote →</span>
      </div>
    </div>
  );
}
