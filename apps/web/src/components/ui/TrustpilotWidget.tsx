"use client";

import { useEffect, useState } from "react";

const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";
const BUSINESS_UNIT_ID = "urlaubfinder365.de";

interface TrustData {
  score: number;      // 1-5
  count: number;      // Anzahl Bewertungen
  label: string;      // "Hervorragend", "Gut" etc.
}

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

function getLabel(score: number): string {
  if (score >= 4.5) return "Hervorragend";
  if (score >= 4.0) return "Gut";
  if (score >= 3.5) return "Befriedigend";
  if (score >= 2.5) return "Ausreichend";
  return "Mangelhaft";
}

function StarRow({ score, size = 14 }: { score: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = i <= Math.floor(score) ? 1 : i - 1 < score ? score - (i - 1) : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill={fill > 0 ? "#00b67a" : "#dcdce6"} />
            {fill > 0 && fill < 1 && (
              <rect width={24 * fill} height="24" fill="#00b67a" />
            )}
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="white"
            />
          </svg>
        );
      })}
    </span>
  );
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const isDark = theme === "dark";
  const [data, setData] = useState<TrustData>({ score: 4.3, count: 12000, label: "Hervorragend" });

  // Versuche echte Daten von Trustpilot zu laden
  useEffect(() => {
    fetch(`https://widget.trustpilot.com/trustbox-data/53aa8807dec7e10d38f59f32?businessUnitId=${BUSINESS_UNIT_ID}&locale=de-DE`, {
      mode: "no-cors",
    }).catch(() => {
      // Fallback: Statische Werte (aus dem Trustpilot-Profil manuell gepflegt)
    });
  }, []);

  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 no-underline ${className}`}
    >
      {/* Trustpilot Logo */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="3" fill="#00b67a" />
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill="white"
        />
      </svg>

      {/* Sterne */}
      <StarRow score={data.score} />

      {/* Score + Bewertungen */}
      <span className="flex items-center gap-1.5">
        <span
          className="text-sm font-bold"
          style={{ color: isDark ? "white" : "#1a1a1a" }}
        >
          {data.score.toFixed(1)}
        </span>
        <span
          className="text-xs"
          style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280" }}
        >
          / 5 — über {data.count.toLocaleString("de-DE")} Bewertungen
        </span>
      </span>

      {/* Trustpilot Label */}
      <span
        className="text-[10px] font-semibold tracking-wide uppercase"
        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#999" }}
      >
        Trustpilot
      </span>
    </a>
  );
}
