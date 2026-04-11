interface Props {
  name: string;
  gradient: [string, string];
  size?: number;
  borderColor?: string;
  /** Kleines dekoratives Icon unten rechts (z.B. "✈" "⛵" "🏝") */
  icon?: string;
}

/**
 * SVG-Profilbild mit Initialen + Gradient.
 * 100 % einzigartig, nicht per Reverse-Image-Search findbar.
 */
export default function ExpertAvatar({
  name,
  gradient,
  size = 80,
  borderColor,
  icon,
}: Props) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  const gradId = `avatar-grad-${name.replace(/\s+/g, "-").toLowerCase()}`;
  const r = size / 2;

  return (
    <div
      className="shrink-0 rounded-full overflow-hidden shadow-md"
      style={{
        width: size,
        height: size,
        border: borderColor ? `3px solid ${borderColor}` : undefined,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Profilbild ${name}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />
        {/* Dezentes Licht-Highlight */}
        <circle cx={r * 0.75} cy={r * 0.65} r={r * 0.55} fill="rgba(255,255,255,0.12)" />
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={r * 0.78}
          fontWeight="700"
          fill="white"
          style={{ letterSpacing: "-0.02em" }}
        >
          {initials}
        </text>
        {icon && (
          <text
            x={size - r * 0.42}
            y={size - r * 0.38}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={r * 0.4}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {icon}
          </text>
        )}
      </svg>
    </div>
  );
}
