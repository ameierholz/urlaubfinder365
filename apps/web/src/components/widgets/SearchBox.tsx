"use client";

import { useState, useEffect, useRef } from "react";

const WIDGET_SRC =
  "https://api.specials.de/component/searchBoxMix.html?access=7bb55d1b6095e63fb7c09e46579c4120";

/**
 * SearchBox – Iframe des specials.de Suchwidgets.
 *
 * Höhe wird dynamisch per postMessage angepasst sobald der Widget eine
 * resize-Nachricht schickt (z.B. beim Öffnen eines Dropdowns).
 * Startwert 450 px ist auf Mobile groß genug damit alle Felder sichtbar sind.
 */
export default function SearchBox() {
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(220);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lazy-load nach erstem Paint
  useEffect(() => {
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

      // Sinnvolle Werte: 150–1200 px, und nie kleiner als 450 px (Mobilschutz)
      if (newH >= 150 && newH <= 1200) {
        setHeight(newH);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Beim Klick in den Widget-Bereich Höhe expandieren damit Dropdowns sichtbar sind
  function handleInteract() {
    setHeight((prev) => Math.max(prev, 500));
  }

  return (
    <div
      style={{
        width: "100%",
        height: height,
        overflow: "visible",
        position: "relative",
      }}
      onClick={handleInteract}
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
