"use client";

import { useEffect, useRef, useState } from "react";

const BUSINESS_UNIT_ID = "69b05095e5b9211cdbf12068";
const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    script.onload = () => {
      if (ref.current && (window as Record<string, unknown>).Trustpilot) {
        (window as unknown as { Trustpilot: { loadFromElement: (el: HTMLElement) => void } }).Trustpilot.loadFromElement(ref.current);
      }
    };
    document.head.appendChild(script);
  }, []);

  // Server + initial client render: einfacher Platzhalter
  if (!mounted) {
    return (
      <div className={className}>
        <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs no-underline"
          style={{ color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="3" fill="#00b67a" />
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
          </svg>
          Trustpilot
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
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
