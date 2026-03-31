"use client";

import { useEffect } from "react";

const SCRIPT_SRC = "https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js";

interface IbeWidgetProps {
  dataSrc: string;
}

/**
 * Lädt ypsnet-ibe.js imperativ per useEffect, damit das Script IMMER
 * NACH dem Mount des #ypsnet-ibe Divs ausgeführt wird.
 *
 * Wichtig für CollapsibleIbeWidget: beim ersten Öffnen wird IbeWidget
 * lazy gemountet – ohne imperatives Laden würde das bereits gecachte
 * Script nicht erneut laufen und das Widget nicht initialisieren.
 */
export default function IbeWidget({ dataSrc }: IbeWidgetProps) {
  useEffect(() => {
    const clearIbe = () => {
      const d = document.getElementById("ypsnet-ibe");
      if (d) while (d.firstChild) d.removeChild(d.firstChild);
    };

    // Div sofort leeren (beide Strict-Mode-Durchläufe)
    clearIbe();

    // setTimeout(0) → der Cleanup-Schritt von React Strict Mode cancelt den
    // Timer, bevor das Script angefügt wird → nur ein Durchlauf legt das
    // Script an → kein doppeltes Widget
    const timer = setTimeout(() => {
      const prev = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      );
      if (prev) prev.remove();

      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }, 0);

    return () => {
      clearTimeout(timer);
      clearIbe();
    };
  }, [dataSrc]);

  return <div id="ypsnet-ibe" data-src={dataSrc} />;
}
