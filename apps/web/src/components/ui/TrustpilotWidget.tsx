"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  templateId?: string;
  height?: string;
  theme?: "light" | "dark";
  className?: string;
}

const BUSINESS_UNIT_ID = "69b05095e5b9211cdbf12068";
const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

// Template-IDs
// Review Collector (Sterne-Leiste): 56278e9abfbbba0bdcd568bc
// Mini (kompakt):                   53aa8807dec7e10d38f59f32
// Micro Star (nur Sterne):          5419b637fa0340045cd0c936
// Horizontal (mit Reviews):         539ad0ffdec7e10e686debd7

export default function TrustpilotWidget({
  templateId = "56278e9abfbbba0bdcd568bc",
  height = "52px",
  theme = "light",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if ((window as { Trustpilot?: { loadFromElement: (el: HTMLElement) => void } }).Trustpilot) {
      (window as { Trustpilot?: { loadFromElement: (el: HTMLElement) => void } }).Trustpilot!.loadFromElement(ref.current!);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className}`}
      data-locale="de-DE"
      data-template-id={templateId}
      data-businessunit-id={BUSINESS_UNIT_ID}
      data-style-height={height}
      data-style-width="100%"
      data-theme={theme}
    >
      <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
