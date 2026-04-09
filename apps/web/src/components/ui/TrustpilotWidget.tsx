"use client";

import { useEffect, useState } from "react";

const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

function StarIcon({ filled, half }: { filled: boolean; half: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill={filled || half ? "#00b67a" : "#dcdce6"} />
      {half && <rect x="12" width="12" height="24" fill="#dcdce6" />}
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
    </svg>
  );
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const isDark = theme === "dark";
  const [score, setScore] = useState(5);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/trustpilot")
      .then((r) => r.json())
      .then((d) => { setScore(d.score ?? 5); setCount(d.count ?? 0); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.3;

  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 no-underline${className ? ` ${className}` : ""}`}
      suppressHydrationWarning
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="3" fill="#00b67a" />
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
      </svg>

      <span className="flex items-center gap-px">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} filled={i <= fullStars} half={i === fullStars + 1 && hasHalf} />
        ))}
      </span>

      {loaded && (
        <span className="flex items-center gap-1">
          <span className="text-xs font-bold" style={{ color: isDark ? "white" : "#1a1a1a" }}>
            {score.toFixed(1)}
          </span>
          {count > 0 && (
            <span className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
              ({count})
            </span>
          )}
        </span>
      )}

      <span className="text-[10px] font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#999" }}>
        Trustpilot
      </span>
    </a>
  );
}
