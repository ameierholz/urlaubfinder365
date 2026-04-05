"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  dataSrc: string;
  fullHeight?: number;
}

/**
 * Zeigt die IBE als 100px-Vorschau (Felder oben sichtbar).
 * Beim Klick irgendwo in die Vorschau oder auf den Button öffnet sich der volle Widget.
 * Nutzt postMessage um dynamische Höhenänderungen zu übernehmen.
 */
export default function InlineExpandIbeWidget({ dataSrc, fullHeight = 3750 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(fullHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamische Höhe nach dem Ausklappen via postMessage
  useEffect(() => {
    if (!expanded) return;
    function handleMessage(e: MessageEvent) {
      const data = e.data;
      let newH: number | null = null;
      if (typeof data === "number" && data > 100) {
        newH = data;
      } else if (typeof data === "object" && data !== null) {
        newH = data.height ?? data.ibeHeight ?? data.frameHeight ?? data.contentHeight ?? null;
        if (!newH && data.type === "resize") newH = data.value ?? data.height ?? null;
      } else if (typeof data === "string") {
        const match = data.match(/height[=:\s]+(\d+)/i);
        if (match) newH = parseInt(match[1]);
      }
      if (newH && newH > iframeHeight) setIframeHeight(newH);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [expanded, iframeHeight]);

  function expand() {
    setExpanded(true);
    // Kurz warten, dann zum Widget scrollen
    setTimeout(() => {
      iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* IBE iframe – immer im DOM, Container clippt auf 100px wenn eingeklappt */}
      <div
        className="relative transition-all duration-500 ease-in-out"
        style={{ height: expanded ? iframeHeight : 120, overflow: "hidden" }}
      >
        <iframe
          ref={iframeRef}
          src={dataSrc}
          title="Reisesuche & Buchung"
          className="w-full border-0 block"
          style={{ width: "100%", height: fullHeight, border: "none" }}
          loading="eager"
        />

        {/* Transparente Klick-Fläche über der Vorschau – öffnet den Widget */}
        {!expanded && (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={expand}
            role="button"
            aria-label="Reisesuche öffnen"
          />
        )}

        {/* Einklapp-Button oben rechts – nur wenn ausgeklappt */}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white hover:text-[#00838F] shadow-sm transition-colors"
            aria-label="Reisesuche einklappen"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Einklappen
          </button>
        )}
      </div>

      {/* Ausklapp-Button unterhalb der 120px-Vorschau */}
      {!expanded && (
        <button
          onClick={expand}
          className="w-full flex items-center justify-center gap-2 py-3 border-t border-gray-100 text-sm font-bold text-[#00838F] hover:bg-teal-50 transition-colors"
        >
          Vollständige Suche öffnen
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
