"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { appendIbeLang } from "@/lib/ibe-locale";

const BASE_SRC =
  "https://api.specials.de/component/searchBoxMix.html?access=7bb55d1b6095e63fb7c09e46579c4120";

/**
 * SearchBox – Iframe des specials.de Suchwidgets.
 *
 * Höhe wird dynamisch per postMessage angepasst sobald der Widget eine
 * resize-Nachricht schickt (z.B. beim Öffnen eines Dropdowns).
 * Mobile: 480 px, Desktop: 500 px – groß genug damit alle Felder (inkl. Suchen-Button) sichtbar sind.
 */
export default function SearchBox() {
  const locale = useLocale();
  const WIDGET_SRC = appendIbeLang(BASE_SRC, locale);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(480);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lazy-load nach erstem Paint + Desktop-Höhe setzen
  useEffect(() => {
    if (window.innerWidth >= 640) setHeight(500);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // postMessage-Listener: specials.de signalisiert die benötigte Höhe
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        !e.origin.includes("specials.de") &&
        !e.origin.includes("ypsilon.net")
      )
        return;

      const data = e.data;
      let newH = 0;

      if (typeof data === "number") {
        newH = data;
      } else if (data && typeof data === "object") {
        newH = Number(data.height ?? data.h ?? data.size ?? data.value ?? 0);
      } else if (typeof data === "string") {
        const match = data.match(/(\d{2,4})/);
        if (match) newH = Number(match[1]);
      }

      if (newH >= 150 && newH <= 1200) {
        // Mindesthöhe 480: alle Felder bleiben sichtbar
        setHeight(Math.max(newH, 480));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: height,
        overflow: "visible",
        position: "relative",
      }}
    >
      {ready && (
        <iframe
          ref={iframeRef}
          src={WIDGET_SRC}
          title="Reisesuche"
          style={{
            width: "100%",
            border: "none",
            height: height,
            display: "block",
          }}
          scrolling="no"
          loading="lazy"
        />
      )}
    </div>
  );
}
