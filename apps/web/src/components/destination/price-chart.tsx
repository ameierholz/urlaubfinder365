"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

interface PricePoint {
  date: string;
  min_price: number;
  avg_price: number;
  deal_count?: number;
}

interface PriceData {
  prices: PricePoint[];
  trend: "rising" | "falling" | "stable";
  currentPrice: number | null;
  lowestPrice: number | null;
  lowestDate: string | null;
}

interface TooltipState {
  x: number;
  y: number;
  date: string;
  minPrice: number;
  avgPrice: number;
  visible: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

const TREND_CONFIG = {
  rising: {
    label: "Preise steigen",
    icon: TrendingUp,
    className: "text-red-600 bg-red-50 border-red-200",
    arrow: "↑",
  },
  falling: {
    label: "Preise fallen",
    icon: TrendingDown,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    arrow: "↓",
  },
  stable: {
    label: "Preise stabil",
    icon: Minus,
    className: "text-blue-600 bg-blue-50 border-blue-200",
    arrow: "→",
  },
};

export default function PriceChart({
  destinationSlug,
  destinationName,
}: {
  destinationSlug: string;
  destinationName: string;
}) {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(90);
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0, y: 0, date: "", minPrice: 0, avgPrice: 0, visible: false,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/price-history?slug=${destinationSlug}&days=${days}`)
      .then((r) => r.json())
      .then((d: PriceData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [destinationSlug, days]);

  const W = 800;
  const H = 260;
  const PAD = { top: 20, right: 20, bottom: 36, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const prices = data?.prices ?? [];
  const hasData = prices.length > 0;

  const allPrices = prices.flatMap((p) => [p.min_price, p.avg_price]);
  const minVal = hasData ? Math.floor(Math.min(...allPrices) * 0.95) : 0;
  const maxVal = hasData ? Math.ceil(Math.max(...allPrices) * 1.05) : 1000;

  function toX(i: number) {
    return PAD.left + (i / Math.max(prices.length - 1, 1)) * chartW;
  }
  function toY(val: number) {
    return PAD.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  }

  function buildPath(key: "min_price" | "avg_price") {
    if (!hasData) return "";
    return prices
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p[key]).toFixed(1)}`)
      .join(" ");
  }

  function buildAreaPath() {
    if (!hasData) return "";
    const line = prices
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p.min_price).toFixed(1)}`)
      .join(" ");
    const close = ` L ${toX(prices.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;
    return line + close;
  }

  // Find lowest price index
  const lowestIdx = hasData
    ? prices.reduce((best, p, i) => (p.min_price < prices[best].min_price ? i : best), 0)
    : -1;

  // Y-axis ticks
  const yTicks = 5;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(minVal + ((maxVal - minVal) * i) / yTicks)
  );

  // X-axis labels (every ~15 days)
  const xLabelStep = Math.max(1, Math.floor(prices.length / 6));
  const xLabels = prices.reduce<{ i: number; label: string }[]>((acc, p, i) => {
    if (i === 0 || i === prices.length - 1 || i % xLabelStep === 0) {
      acc.push({ i, label: formatDate(p.date) });
    }
    return acc;
  }, []);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || !hasData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const rawX = (e.clientX - rect.left) * scaleX - PAD.left;
    const idx = Math.round((rawX / chartW) * (prices.length - 1));
    const clamped = Math.max(0, Math.min(prices.length - 1, idx));
    const p = prices[clamped];
    setTooltip({
      x: toX(clamped),
      y: toY(p.min_price),
      date: p.date,
      minPrice: p.min_price,
      avgPrice: p.avg_price,
      visible: true,
    });
  }

  const trend = data?.trend ?? "stable";
  const trendCfg = TREND_CONFIG[trend];
  const TrendIcon = trendCfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Preisverlauf
            </p>
            <h2 className="text-lg font-black text-gray-900 leading-tight">
              Pauschalreisen {destinationName}
              <span className="text-sm font-normal text-gray-500 ml-2">· 7 Nächte, 2 Personen</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Period selector */}
            {([30, 60, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  days === d
                    ? "bg-[#1db682] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {d} Tage
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        {hasData && data && (
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Aktuell</span>
              <span className="text-2xl font-black text-gray-900">
                {data.currentPrice?.toLocaleString("de-DE")} €
              </span>
              <span className="text-[11px] text-gray-400">pro Person</span>
            </div>
            {data.lowestPrice && data.lowestDate && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tiefstpreis</span>
                <span className="text-2xl font-black text-[#1db682]">
                  {data.lowestPrice.toLocaleString("de-DE")} €
                </span>
                <span className="text-[11px] text-gray-400">{formatDateLong(data.lowestDate)}</span>
              </div>
            )}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold self-center ${trendCfg.className}`}>
              <TrendIcon className="w-4 h-4" />
              {trendCfg.arrow} {trendCfg.label}
            </div>
          </div>
        )}
      </div>

      {/* Chart area */}
      <div className="px-2 py-4 relative">
        {loading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-[#1db682] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Preise werden geladen…</span>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
            Keine Preisdaten verfügbar
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ height: "auto", maxHeight: 320 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
            >
              <defs>
                <linearGradient id={`area-grad-${destinationSlug}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1db682" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1db682" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id={`line-grad-${destinationSlug}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6991d8" />
                  <stop offset="100%" stopColor="#1db682" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {yTickVals.map((v) => (
                <line
                  key={v}
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={toY(v)}
                  y2={toY(v)}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {yTickVals.map((v) => (
                <text
                  key={v}
                  x={PAD.left - 8}
                  y={toY(v) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9ca3af"
                  fontFamily="sans-serif"
                >
                  {v}€
                </text>
              ))}

              {/* X-axis labels */}
              {xLabels.map(({ i, label }) => (
                <text
                  key={i}
                  x={toX(i)}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9ca3af"
                  fontFamily="sans-serif"
                >
                  {label}
                </text>
              ))}

              {/* Area fill */}
              <path
                d={buildAreaPath()}
                fill={`url(#area-grad-${destinationSlug})`}
              />

              {/* Avg price line (dashed, lighter) */}
              <path
                d={buildPath("avg_price")}
                fill="none"
                stroke="#6991d8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* Min price line (main) */}
              <path
                d={buildPath("min_price")}
                fill="none"
                stroke={`url(#line-grad-${destinationSlug})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Lowest price marker */}
              {lowestIdx >= 0 && (
                <g>
                  <circle
                    cx={toX(lowestIdx)}
                    cy={toY(prices[lowestIdx].min_price)}
                    r="6"
                    fill="#1db682"
                    stroke="white"
                    strokeWidth="2.5"
                  />
                  <text
                    x={toX(lowestIdx)}
                    y={toY(prices[lowestIdx].min_price) - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#1db682"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Tiefstpreis
                  </text>
                </g>
              )}

              {/* Current price marker */}
              {prices.length > 0 && (
                <circle
                  cx={toX(prices.length - 1)}
                  cy={toY(prices[prices.length - 1].min_price)}
                  r="5"
                  fill="#6991d8"
                  stroke="white"
                  strokeWidth="2.5"
                />
              )}

              {/* Tooltip crosshair */}
              {tooltip.visible && (
                <g>
                  <line
                    x1={tooltip.x}
                    x2={tooltip.x}
                    y1={PAD.top}
                    y2={PAD.top + chartH}
                    stroke="#6991d8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                  <circle
                    cx={tooltip.x}
                    cy={tooltip.y}
                    r="4"
                    fill="white"
                    stroke="#1db682"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-4 justify-end px-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 rounded bg-gradient-to-r from-[#6991d8] to-[#1db682]" />
                <span className="text-[11px] text-gray-500">Günstigster Preis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-px border-t-2 border-dashed border-[#6991d8] opacity-50" />
                <span className="text-[11px] text-gray-500">Durchschnitt</span>
              </div>
            </div>

            {/* Tooltip bubble */}
            {tooltip.visible && (
              <div
                className="pointer-events-none absolute z-10 bg-gray-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl"
                style={{
                  left: `calc(${(tooltip.x / W) * 100}% + 8px)`,
                  top: `calc(${(tooltip.y / H) * 100}% - 48px)`,
                  transform: tooltip.x > W * 0.75 ? "translateX(-110%)" : undefined,
                  minWidth: 140,
                }}
              >
                <p className="font-bold text-white/80 mb-1">{formatDateLong(tooltip.date)}</p>
                <p className="flex justify-between gap-3">
                  <span className="text-white/60">Ab:</span>
                  <span className="font-black text-[#1db682]">
                    {tooltip.minPrice.toLocaleString("de-DE")} €
                  </span>
                </p>
                <p className="flex justify-between gap-3">
                  <span className="text-white/60">Ø:</span>
                  <span className="font-semibold">
                    {tooltip.avgPrice.toLocaleString("de-DE")} €
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Preise pro Person · 7 Nächte · 2 Erwachsene · Pauschalreise inkl. Flug
        </p>
        <a
          href={`#pauschalreisen`}
          className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#18a474] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          Jetzt Angebot finden
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
