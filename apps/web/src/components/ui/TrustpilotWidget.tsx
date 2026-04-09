"use client";

import { useEffect, useState } from "react";

const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const isDark = theme === "dark";
  const [score, setScore] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/trustpilot")
      .then((r) => r.json())
      .then((d) => { setScore(d.score); setCount(d.count); })
      .catch(() => {});
  }, []);

  const displayScore = score ?? 5;
  const fullStars = Math.floor(displayScore);
  const hasHalf = displayScore - fullStars >= 0.3;

  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 no-underline ${className}`}
    >
      {/* Trustpilot Logo */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="3" fill="#00b67a" />
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
      </svg>

      {/* Sterne */}
      <span className="flex items-center gap-px">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFull = i <= fullStars;
          const isHalf = i === fullStars + 1 && hasHalf;
          const isEmpty = !isFull && !isHalf;
          return (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill={isEmpty ? "#dcdce6" : "#00b67a"} />
              {isHalf && <rect x="12" width="12" height="24" fill="#dcdce6" />}
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
            </svg>
          );
        })}
      </span>

      {/* Score + Count */}
      {score !== null && (
        <span className="flex items-center gap-1">
          <span className="text-xs font-bold" style={{ color: isDark ? "white" : "#1a1a1a" }}>
            {displayScore.toFixed(1)}
          </span>
          {count !== null && count > 0 && (
            <span className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
              ({count})
            </span>
          )}
        </span>
      )}

      {/* Label */}
      <span className="text-[10px] font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#999" }}>
        Trustpilot
      </span>
    </a>
  );
}
