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
    const base =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://www.urlaubfinder365.de";
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

function buildSvgPath(series: PriceSeries[], w: number, h: number): string {
  if (series.length < 2) return "";
  const prices = series.map((s) => s.minPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = 8;
  const points = series.map((s, i) => {
    const x = pad + (i / (series.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (s.minPrice - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${points.join(" L ")}`;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function EmbedPriceChart({ searchParams }: Props) {
  const sp = await searchParams;
  const destination = sp.destination ?? "antalya";
  const days = Math.min(Number(sp.days ?? "30"), 365);
  const isDark = sp.theme === "dark";

  const data = await fetchData(destination, days);

  // Farben
  const bg = isDark ? "#0f1923" : "#ffffff";
  const cardBg = isDark ? "#1a2535" : "#f8fafc";
  const text = isDark ? "#e2e8f0" : "#1a202c";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const accent = "#1db682";
  const accentSecondary = "#6991d8";
  const borderColor = isDark ? "#2d3f55" : "#e2e8f0";

  const W = 460;
  const H = 120;
  const svgPath = data ? buildSvgPath(data.series, W, H) : "";
  const prices = data?.series.map((s) => s.minPrice) ?? [];
  const minP = prices.length ? Math.min(...prices) : 0;
  const maxP = prices.length ? Math.max(...prices) : 0;
  const range = maxP - minP || 1;
  const pad = 8;

  // Area-Pfad (geschlossen)
  let areaPath = "";
  if (data && data.series.length >= 2) {
    const last = data.series.length - 1;
    const firstX = pad.toFixed(1);
    const lastX = (pad + (W - pad * 2)).toFixed(1);
    areaPath = `${svgPath} L ${lastX},${(H - pad).toFixed(1)} L ${firstX},${(H - pad).toFixed(1)} Z`;
  }

  const isGoodDeal = data?.stats.isGoodDeal ?? false;
  const destName = data?.destinationName ?? destination;

  return (
    <>
      {/* React 19 erlaubt <title>/<style> direkt im body — Next.js hebt sie in den head */}
      <title>{`Preisverlauf ${destName} – urlaubfinder365.de`}</title>
      <style>{`
        html, body { background: ${bg}; color: ${text}; }
        .uf-embed-widget { padding: 16px; border-radius: 12px; background: ${bg}; min-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .uf-embed-widget * { box-sizing: border-box; margin: 0; padding: 0; }
        .uf-embed-widget .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .uf-embed-widget .title { font-size: 13px; font-weight: 700; color: ${text}; }
        .uf-embed-widget .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: ${isGoodDeal ? "#dcfce7" : cardBg}; color: ${isGoodDeal ? "#15803d" : textMuted}; border: 1px solid ${isGoodDeal ? "#86efac" : borderColor}; }
        .uf-embed-widget .chart-wrap { background: ${cardBg}; border-radius: 10px; border: 1px solid ${borderColor}; padding: 8px; margin-bottom: 12px; overflow: hidden; }
        .uf-embed-widget .chart-svg { width: 100%; height: auto; display: block; }
        .uf-embed-widget .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
        .uf-embed-widget .stat { background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 8px; padding: 8px; text-align: center; }
        .uf-embed-widget .stat-val { font-size: 14px; font-weight: 800; color: ${text}; }
        .uf-embed-widget .stat-label { font-size: 10px; color: ${textMuted}; margin-top: 2px; }
        .uf-embed-widget .footer { display: flex; align-items: center; justify-content: space-between; }
        .uf-embed-widget .demo-note { font-size: 10px; color: ${textMuted}; font-style: italic; }
        .uf-embed-widget .powered { font-size: 11px; color: ${textMuted}; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .uf-embed-widget .powered:hover { color: ${accent}; }
        .uf-embed-widget .powered-dot { width: 6px; height: 6px; border-radius: 50%; background: ${accent}; display: inline-block; }
      `}</style>
      <div className="uf-embed-widget">
          <div className="header">
            <span className="title">
              Preisverlauf {destName} · {days} Tage
            </span>
            <span className="badge">
              {isGoodDeal ? "Guter Zeitpunkt" : `${days}d Verlauf`}
            </span>
          </div>

          {data && data.series.length >= 2 ? (
            <div className="chart-wrap">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="chart-svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Gitternetz */}
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1={pad}
                    y1={pad + pct * (H - pad * 2)}
                    x2={W - pad}
                    y2={pad + pct * (H - pad * 2)}
                    stroke={borderColor}
                    strokeWidth="0.5"
                    strokeDasharray="3,3"
                  />
                ))}
                {/* Area */}
                <path d={areaPath} fill="url(#chartGrad)" />
                {/* Linie */}
                <path d={svgPath} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Letzter Punkt */}
                {data.series.length > 0 && (() => {
                  const last = data.series[data.series.length - 1];
                  const lp = last.minPrice;
                  const cx = pad + (W - pad * 2);
                  const cy = pad + (1 - (lp - minP) / range) * (H - pad * 2);
                  return (
                    <>
                      <circle cx={cx} cy={cy} r="4" fill={accent} />
                      <circle cx={cx} cy={cy} r="7" fill={accent} fillOpacity="0.2" />
                    </>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div className="chart-wrap" style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: textMuted, fontSize: "12px" }}>Keine Daten verfügbar</span>
            </div>
          )}

          {data && (
            <div className="stats">
              <div className="stat">
                <div className="stat-val" style={{ color: accent }}>{formatPrice(data.stats.currentPrice)}</div>
                <div className="stat-label">Aktuell</div>
              </div>
              <div className="stat">
                <div className="stat-val" style={{ color: "#15803d" }}>{formatPrice(data.stats.lowestPrice)}</div>
                <div className="stat-label">Tiefstwert</div>
              </div>
              <div className="stat">
                <div className="stat-val">{formatPrice(data.stats.avgPrice)}</div>
                <div className="stat-label">Durchschnitt</div>
              </div>
            </div>
          )}

          <div className="footer">
            {data?.stats.isDemo && (
              <span className="demo-note">Demo-Daten</span>
            )}
            {!data?.stats.isDemo && <span />}
            <a
              href={data?.embed.url ?? "https://www.urlaubfinder365.de"}
              target="_blank"
              rel="noopener noreferrer"
              className="powered"
            >
              <span className="powered-dot" />
              urlaubfinder365.de
            </a>
          </div>
        </div>
    </>
  );
}
