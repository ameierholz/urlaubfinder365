// Standalone Embed-Seite – kein Layout, kein Header/Footer
// CORS-freundlich für iFrame-Einbettung auf externen Seiten

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    destination?: string;
    days?: string;
    theme?: string;
  }>;
}

interface PriceSeries {
  date: string;
  minPrice: number;
  avgPrice: number;
  dealCount: number;
}

interface EmbedData {
  destination: string;
  destinationName: string;
  days: number;
  series: PriceSeries[];
  stats: {
    currentPrice: number;
    lowestPrice: number;
    highestPrice: number;
    avgPrice: number;
    isGoodDeal: boolean;
    isDemo: boolean;
  };
  embed: {
    poweredBy: string;
    url: string;
  };
}

async function fetchData(destination: string, days: number): Promise<EmbedData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.urlaubfinder365.de";
    const res = await fetch(
      `${base}/api/embed/price-chart?destination=${destination}&days=${days}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function EmbedPriceChart({ searchParams }: Props) {
  const sp = await searchParams;
  const destination = sp.destination ?? "antalya";
  const days = Math.min(Number(sp.days ?? "30"), 365);
  const isDark = sp.theme === "dark";

  const data = await fetchData(destination, days);

  // ── Farben ──────────────────────────────────────────────────────────────────
  const bg         = isDark ? "#0f1923" : "#ffffff";
  const cardBg     = isDark ? "#1a2535" : "#f8fafc";
  const border     = isDark ? "#2d3f55" : "#e2e8f0";
  const textPrim   = isDark ? "#e2e8f0" : "#1a202c";
  const textMuted  = isDark ? "#94a3b8" : "#64748b";
  const textFaint  = isDark ? "#475569" : "#94a3b8";
  const accentGreen = "#1db682";
  const accentBlue  = "#6991d8";

  const series  = data?.series ?? [];
  const hasSeries = series.length >= 2;

  // ── Chart-Geometrie ─────────────────────────────────────────────────────────
  const W = 460;
  const H = 160;
  const padT = 10, padB = 28, padL = 48, padR = 16;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minPrices = series.map((s) => s.minPrice);
  const avgPrices = series.map((s) => s.avgPrice).filter((p) => p > 0);
  const allPrices = [...minPrices, ...avgPrices];
  const dataMin   = allPrices.length ? Math.min(...allPrices) : 0;
  const dataMax   = allPrices.length ? Math.max(...allPrices) : 1000;
  const pad       = (dataMax - dataMin) * 0.12 || 50;
  const yMin      = Math.max(0, dataMin - pad);
  const yMax      = dataMax + pad;
  const yRange    = yMax - yMin || 1;

  function xPos(i: number) {
    return padL + (i / Math.max(series.length - 1, 1)) * chartW;
  }
  function yPos(val: number) {
    return padT + (1 - (val - yMin) / yRange) * chartH;
  }

  // SVG-Pfade
  const minPath = hasSeries
    ? series.map((s, i) => `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)},${yPos(s.minPrice).toFixed(1)}`).join(" ")
    : "";
  const avgPath = hasSeries
    ? series.filter((s) => s.avgPrice > 0).map((s, i, arr) => {
        const idx = series.findIndex((x) => x === s);
        return `${i === 0 ? "M" : "L"} ${xPos(idx).toFixed(1)},${yPos(s.avgPrice).toFixed(1)}`;
      }).join(" ")
    : "";

  // Area unter min-Linie
  const areaPath = hasSeries
    ? `${minPath} L ${xPos(series.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)} L ${padL.toFixed(1)},${(padT + chartH).toFixed(1)} Z`
    : "";

  // Y-Achsen-Labels (4 Stufen)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = yMin + pct * yRange;
    return { y: padT + (1 - pct) * chartH, label: `${Math.round(val)}€` };
  });

  // X-Achsen-Labels: ca. 5 gleichmäßig verteilt
  const xTickCount = Math.min(5, series.length);
  const xTicks = xTickCount > 1
    ? Array.from({ length: xTickCount }, (_, i) => {
        const idx = Math.round((i / (xTickCount - 1)) * (series.length - 1));
        return { x: xPos(idx), label: formatDate(series[idx].date) };
      })
    : [];

  // Tiefstpreis-Marker
  const lowestIdx = minPrices.indexOf(Math.min(...minPrices));
  const lowestX   = hasSeries ? xPos(lowestIdx) : 0;
  const lowestY   = hasSeries ? yPos(minPrices[lowestIdx]) : 0;

  // Letzter Punkt
  const lastIdx = series.length - 1;
  const lastX   = hasSeries ? xPos(lastIdx) : 0;
  const lastY   = hasSeries ? yPos(minPrices[lastIdx]) : 0;

  // Trend
  const stats = data?.stats;
  const recent7  = minPrices.slice(-7);
  const older7   = minPrices.slice(-14, -7);
  const avgR = recent7.length ? recent7.reduce((a, b) => a + b, 0) / recent7.length : 0;
  const avgO = older7.length  ? older7.reduce((a, b)  => a + b, 0) / older7.length  : avgR;
  const trendPct = avgO > 0 ? Math.round(((avgR - avgO) / avgO) * 100) : 0;
  const trendLabel = trendPct >= 3 ? `↑ Steigend (${trendPct}%)` : trendPct <= -3 ? `↓ Fallend (${Math.abs(trendPct)}%)` : "→ Preise stabil";
  const trendColor = trendPct >= 3 ? "#ef4444" : trendPct <= -3 ? accentGreen : "#f59e0b";

  const destName = data?.destinationName ?? destination;

  return (
    <>
      <title>{`Preisverlauf ${destName} – urlaubfinder365.de`}</title>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${bg}; color: ${textPrim}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .wrap { padding: 14px 16px 12px; background: ${bg}; min-width: 280px; }
        .header { margin-bottom: 10px; }
        .eyebrow { font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: ${accentGreen}; margin-bottom: 3px; }
        .dest { font-size: 14px; font-weight: 800; color: ${textPrim}; }
        .dest-sub { font-size: 10px; color: ${textMuted}; margin-top: 1px; }
        .prices { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 8px; }
        .price-block { display: flex; flex-direction: column; }
        .price-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: ${textMuted}; margin-bottom: 2px; }
        .price-val { font-size: 22px; font-weight: 900; line-height: 1; }
        .price-val.current { color: ${textPrim}; }
        .price-val.low { color: ${accentGreen}; }
        .price-date { font-size: 9px; color: ${textFaint}; margin-top: 2px; }
        .trend-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700;
          padding: 3px 9px; border-radius: 99px; border: 1px solid; margin-left: 8px; }
        .chart-wrap { background: ${cardBg}; border: 1px solid ${border}; border-radius: 10px; padding: 6px 6px 0 0; margin-bottom: 8px; overflow: hidden; }
        .chart-svg { display: block; width: 100%; height: auto; }
        .legend { display: flex; align-items: center; gap: 14px; padding: 0 4px 2px; }
        .legend-item { display: flex; align-items: center; gap: 4px; font-size: 9px; color: ${textMuted}; }
        .legend-line { width: 18px; height: 2px; }
        .legend-line.dashed { background: repeating-linear-gradient(to right, ${accentBlue} 0, ${accentBlue} 4px, transparent 4px, transparent 7px); }
        .footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .powered { font-size: 10px; color: ${textMuted}; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .powered:hover { color: ${accentGreen}; }
        .powered-dot { width: 5px; height: 5px; border-radius: 50%; background: ${accentGreen}; display: inline-block; }
        .cta { font-size: 10px; font-weight: 700; color: white; background: ${accentGreen}; padding: 5px 12px; border-radius: 99px; text-decoration: none; white-space: nowrap; }
        .cta:hover { opacity: .9; }
        .demo-badge { font-size: 9px; color: ${textFaint}; font-style: italic; }
        .no-data { display: flex; align-items: center; justify-content: center; height: 140px; font-size: 12px; color: ${textMuted}; }
      `}</style>

      <div className="wrap">
        {/* ── Header ── */}
        <div className="header">
          <p className="eyebrow">Preisverlauf</p>
          <p className="dest">{destName}</p>
          <p className="dest-sub">7 Nächte · 2 Personen · Pauschalreise inkl. Flug</p>
        </div>

        {/* ── Preise + Trend ── */}
        {stats && (
          <div className="prices">
            <div className="price-block">
              <span className="price-label">Aktuell</span>
              <span className="price-val current">{formatPrice(stats.currentPrice)}</span>
              <span className="price-date">pro Person</span>
            </div>
            <div className="price-block">
              <span className="price-label">Tiefstpreis</span>
              <span className="price-val low">{formatPrice(stats.lowestPrice)}</span>
              {hasSeries && lowestIdx >= 0 && (
                <span className="price-date">{formatDate(series[lowestIdx].date)}</span>
              )}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <span
                className="trend-badge"
                style={{ color: trendColor, borderColor: trendColor, background: `${trendColor}18` }}
              >
                {trendLabel}
              </span>
            </div>
          </div>
        )}

        {/* ── Chart ── */}
        <div className="chart-wrap">
          {hasSeries ? (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="chart-svg"
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentGreen} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={accentGreen} stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y-Gitter + Labels */}
              {yTicks.map((t, i) => (
                <g key={i}>
                  <line
                    x1={padL} y1={t.y} x2={W - padR} y2={t.y}
                    stroke={border} strokeWidth="0.5" strokeDasharray="3,3"
                  />
                  <text
                    x={padL - 4} y={t.y + 3.5}
                    textAnchor="end" fontSize="8" fill={textFaint}
                    fontFamily="-apple-system,sans-serif"
                  >
                    {t.label}
                  </text>
                </g>
              ))}

              {/* X-Labels */}
              {xTicks.map((t, i) => (
                <text
                  key={i}
                  x={t.x} y={H - 6}
                  textAnchor="middle" fontSize="7.5" fill={textFaint}
                  fontFamily="-apple-system,sans-serif"
                >
                  {t.label}
                </text>
              ))}

              {/* Area */}
              <path d={areaPath} fill="url(#areaGrad)" />

              {/* Avg-Linie (gestrichelt, blau) */}
              {avgPath && (
                <path
                  d={avgPath}
                  fill="none"
                  stroke={accentBlue}
                  strokeWidth="1.2"
                  strokeDasharray="4,3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
              )}

              {/* Min-Linie (solid, grün) */}
              <path
                d={minPath}
                fill="none"
                stroke={accentGreen}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Tiefstpreis-Marker */}
              <circle cx={lowestX} cy={lowestY} r="4" fill={accentGreen} />
              <circle cx={lowestX} cy={lowestY} r="7" fill={accentGreen} fillOpacity="0.2" />
              <text
                x={lowestX} y={lowestY - 10}
                textAnchor="middle" fontSize="7.5" fill={accentGreen}
                fontFamily="-apple-system,sans-serif" fontWeight="700"
              >
                Tiefstpreis
              </text>

              {/* Letzter Punkt */}
              <circle cx={lastX} cy={lastY} r="4" fill={accentGreen} />
              <circle cx={lastX} cy={lastY} r="7" fill={accentGreen} fillOpacity="0.2" />
            </svg>
          ) : (
            <div className="no-data">Keine Daten verfügbar</div>
          )}
        </div>

        {/* ── Legende ── */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-line" style={{ background: accentGreen }} />
            Günstigster Preis
          </div>
          <div className="legend-item">
            <div className="legend-line dashed" />
            Durchschnitt
          </div>
          {stats?.isDemo && <span className="demo-badge">Demo-Daten</span>}
        </div>

        {/* ── Footer ── */}
        <div className="footer">
          <a
            href={data?.embed.url ?? "https://www.urlaubfinder365.de"}
            target="_blank"
            rel="noopener noreferrer"
            className="powered"
          >
            <span className="powered-dot" />
            urlaubfinder365.de
          </a>
          <a
            href={data?.embed.url ?? "https://www.urlaubfinder365.de"}
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            Jetzt Angebot finden ↗
          </a>
        </div>
      </div>
    </>
  );
}
