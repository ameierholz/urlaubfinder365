"use client";

import { useEffect, useRef, useState } from "react";

interface IbeHolidayWidgetProps {
  regionId: string;
  name: string;
}

/** Holiday-categories widget (Wellness, Strand, Familie, etc.)
 *  Initialized by ibe-engine.js on mount. */
export default function IbeHolidayWidget({ regionId, name }: IbeHolidayWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // _ibeScan muss NACH dem Rendern des Divs aufgerufen werden,
  // d.h. erst wenn mounted=true und der placeholder im DOM ist.
  useEffect(() => {
    if (!mounted) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._ibeScan?.();
  }, [mounted]);

  // Observer darf erst laufen wenn der Div im DOM ist (mounted=true)
  useEffect(() => {
    if (!mounted) return;
    const container = ref.current;
    if (!container) return;

    const injectPriceNote = () => {
      container.querySelectorAll<HTMLElement>(".hw-card").forEach((card) => {
        if (card.querySelector(".hw-price-note")) return; // already injected

        const priceContainer = card.querySelector(".hw-price-container");
        const titleEl = card.querySelector(".hw-title");
        if (!priceContainer || !titleEl) return;

        const isFamilie = titleEl.textContent?.toLowerCase().includes("familie") ?? false;

        const note = document.createElement("span");
        note.className = "hw-price-note";
        note.textContent = isFamilie ? "Für 2 Erw. & 2 Kinder" : "Für 2 Erwachsene";
        note.style.cssText =
          "display:block; font-size:0.68rem; color:#9ca3af; margin-top:-6px; margin-bottom:6px; line-height:1.2;";

        priceContainer.insertAdjacentElement("afterend", note);
      });
    };

    // Run immediately in case engine already rendered
    injectPriceNote();

    // Watch for IBE engine rendering the cards
    const observer = new MutationObserver(injectPriceNote);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className="holiday-widget-placeholder"
      data-region={regionId}
      data-name={name}
    />
  );
}
