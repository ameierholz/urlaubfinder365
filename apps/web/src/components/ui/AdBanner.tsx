"use client";
import { useEffect, useRef } from "react";

interface Props {
  placementKey: string;
  height?: number;
}

declare global {
  interface Window {
    uAd?: { embed: (id: string, opts: Record<string, unknown>) => void };
    uAd_init?: () => void;
  }
}

const JSAPI = "https://s.d.adup-tech.com/jsapi";

/**
 * adup-tech Ad-Banner – robuste Einbindung für SPA-Navigation.
 * Setzt sowohl onload-Handler als auch window.uAd_init als Fallback.
 * Container wird beim Unmount geleert damit Re-Embed sauber funktioniert.
 */
export default function AdBanner({ placementKey, height = 200 }: Props) {
  // Deterministisch aus placementKey — identisch auf Server & Client
  const adId = `adup_${placementKey.slice(0, 12)}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!placementKey) return;

    const embed = () => {
      // Container leeren falls alter Inhalt vorhanden (SPA-Navigation)
      if (containerRef.current) containerRef.current.innerHTML = "";
      window.uAd?.embed(adId, { placementkey: placementKey, responsive: true });
    };

    // Immer uAd_init setzen – jsapi ruft es nach jedem Laden auf
    window.uAd_init = embed;

    if (typeof window.uAd === "object") {
      // jsapi bereits geladen → sofort einbetten
      embed();
    } else {
      // jsapi schon im DOM (lädt gerade) → onload lauschen
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${JSAPI}"]`
      );
      if (existing) {
        existing.addEventListener("load", embed, { once: true });
        return () => existing.removeEventListener("load", embed);
      }
      // jsapi noch nicht vorhanden → einfügen
      const script = document.createElement("script");
      script.src = JSAPI;
      script.async = true;
      script.addEventListener("load", embed, { once: true });
      const first = document.getElementsByTagName("script")[0];
      first.parentNode?.insertBefore(script, first);
      return () => script.removeEventListener("load", embed);
    }

    // Cleanup: Container beim Unmount leeren
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [adId, placementKey]);

  return (
    <div
      ref={containerRef}
      id={adId}
      style={{ width: "100%", minHeight: `${height}px`, height: `${height}px` }}
      aria-label="Werbeanzeige"
    />
  );
}
