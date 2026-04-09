"use client";

import { useEffect, useRef } from "react";

const BUSINESS_UNIT_ID = "69b05095e5b9211cdbf12068";
const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trustpilot TrustBox Script laden
    const script = document.createElement("script");
    script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    script.onload = () => {
      // TrustBox initialisieren
      if (ref.current && (window as unknown as Record<string, unknown>).Trustpilot) {
        (window as unknown as { Trustpilot: { loadFromElement: (el: HTMLElement) => void } }).Trustpilot.loadFromElement(ref.current);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: Script nicht entfernen (wird gecacht)
    };
  }, []);

  return (
    <div className={className}>
      {/* TrustBox Widget - Micro Review Count */}
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="de-DE"
        data-template-id="5419b6a8b0d04a076446a9ad"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="24px"
        data-style-width="100%"
        data-theme={theme}
        data-min-review-count="0"
        data-without-reviews-preferred-string-id="1"
      >
        <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </div>
  );
}
