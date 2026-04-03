"use client";

const REVIEW_URL = "https://de.trustpilot.com/review/urlaubfinder365.de";

interface Props {
  theme?: "light" | "dark";
  className?: string;
}

export default function TrustpilotWidget({ theme = "light", className = "" }: Props) {
  const isDark = theme === "dark";

  return (
    <a
      href={REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 no-underline ${className}`}
    >
      {/* Trustpilot Stern-Icon (Markenfarbe #00b67a) */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#00b67a" />
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill="white"
        />
      </svg>

      {/* Sterne-Reihe */}
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="#00b67a" />
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="white"
            />
          </svg>
        ))}
      </span>

      {/* Label */}
      <span
        className="text-xs font-semibold tracking-wide"
        style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#1a1a1a", fontFamily: "sans-serif" }}
      >
        Trustpilot
      </span>
    </a>
  );
}
