"use client";

import { useState, useRef, useEffect } from "react";

interface IbeWidgetProps {
  dataSrc: string;
  height?: number;
}

export default function IbeWidget({ dataSrc, height = 1200 }: IbeWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(height);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = e.data;
      let newHeight: number | null = null;

      if (typeof data === "number" && data > 100) {
        newHeight = data;
      } else if (typeof data === "object" && data !== null) {
        // Common IBE postMessage formats
        newHeight =
          data.height ??
          data.ibeHeight ??
          data.frameHeight ??
          data.contentHeight ??
          null;
        // ypsilon/specials.de specific
        if (!newHeight && data.type === "resize") newHeight = data.value ?? data.height ?? null;
      } else if (typeof data === "string") {
        const match = data.match(/height[=:\s]+(\d+)/i);
        if (match) newHeight = parseInt(match[1]);
      }

      if (newHeight && newHeight > height) {
        setIframeHeight(newHeight);
      }
    }

    // Also watch iframe style attribute changes (set by parent-side scripts)
    const iframe = iframeRef.current;
    let mo: MutationObserver | null = null;
    if (iframe) {
      mo = new MutationObserver(() => {
        const h =
          parseFloat(iframe.style.height) ||
          parseFloat(iframe.getAttribute("height") ?? "0");
        if (h > height) setIframeHeight(h);
      });
      mo.observe(iframe, { attributes: true, attributeFilter: ["style", "height"] });
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      mo?.disconnect();
    };
  }, [height]);

  return (
    <div className="relative w-full" style={{ minHeight: iframeHeight }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <span className="text-sm text-gray-400">Suchmaske wird geladen…</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={dataSrc}
        title="Reisesuche & Buchung"
        className="w-full border-0 block"
        style={{ height: iframeHeight }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
