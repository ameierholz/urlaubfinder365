"use client";

import { useState } from "react";

export interface PricePoint {
  date: string;
  minPrice: number;
  avgPrice: number;
  dealCount: number;
}

interface Props {
  series: PricePoint[];
  forecastNext30: number | null;
  trendDirection: "up" | "down" | "flat";
  trendSlope: number;
  destinationName: string;
}

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}.${m}.`;
}
function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

// 7-day moving average
function movingAvg(series: PricePoint[], w = 7): number[] {
  return series.map((_, i) => {
    const slice = series.slice(Math.max(0, i - w + 1), i + 1);
    return Math.round(slice.reduce((s, p) => s + p.minPrice, 0) / slice.length);
  });
}

export default function PriceHistoryChart({ series, forecastNext30, trendDirection, trendSlope, destinationName }: Props) {
  const [hovered, setHovered] = useState<PricePoint | null>(null);

  if (series.length < 2) return null;

  const W = 600, H = 220;
  const PAD = { top: 16, right: 24, bottom: 32, left: 52 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const prices = series.map((p) => p.minPrice);
  const ma     = movingAvg(series);
  const allPrices = [...prices, ...ma, ...(forecastNext30 ? [forecastNext30] : [])];
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const pad    = (rawMax - rawMin) * 0.15 || 20;
  const yMin   = rawMin - pad;
  const yMax   = rawMax + pad;
  const yRange = yMax - yMin;

  function xOf(i: number, total = series.length) {
    return PAD.left + (i / (total - 1)) * cW;
  }
  function yOf(p: number) {
    return PAD.top + cH - ((p - yMin) / yRange) * cH;
  }

  const rawPts  = series.map((p, i) => `${xOf(i).toFixed(1)},${yOf(p.minPrice).toFixed(1)}`);
  const maPts   = ma.map((v, i)     => `${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`);

  // Area under moving average line
  const areaPath = [
    `M ${xOf(0).toFixed(1)} ${(PAD.top + cH).toFixed(1)}`,
    ...maPts.map((pt, i) => `L ${pt}`),
    `L ${xOf(series.length - 1).toFixed(1)} ${(PAD.top + cH).toFixed(1)}`,
    "Z",
  ].join(" ");

  // Forecast segment (last MA point → forecast dot)
  const lastX = xOf(series.length - 1);
  const lastY = yOf(ma[ma.length - 1]);
  const forecastX = forecastNext30 ? PAD.left + cW + 20 : null;
  const forecastY = forecastNext30 ? yOf(forecastNext30) : null;

  const lineColor = trendDirection === "down" ? "#10b981" : trendDirection === "up" ? "#ef4444" : "#6991d8";
  const areaColor = trendDirection === "down"
    ? "rgba(16,185,129,0.07)"
    : trendDirection === "up"
    ? "rgba(239,68,68,0.07)"
    : "rgba(105,145,216,0.07)";

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) =>
    yMin + (yRange / (tickCount - 1)) * i
  );

  // X-axis: show up to 6 labels
  const step = Math.max(1, Math.ceil(series.length / 6));
  const xLabels = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  const trendLabel =
    trendDirection === "down"
      ? `↓ Preise fallen (−${Math.abs(trendSlope).toFixed(1)} €/Tag)`
      : trendDirection === "up"
      ? `↑ Preise steigen (+${trendSlope.toFixed(1)} €/Tag)`
      : "→ Preise stabil";
  const trendColor =
    trendDirection === "down" ? "text-emerald-600" : trendDirection === "up" ? "text-red-500" : "text-gray-500";

  return (
    <div>
      {/* Trend label */}
      <p className={`text-sm font-semibold mb-2 ${trendColor}`}>{trendLabel}</p>

      {/* Hover info */}
      <div className="h-6 mb-1 flex items-center gap-3 text-sm">
        {hovered ? (
          <>
            <span className="font-bold text-gray-900">{hovered.minPrice.toLocaleString("de-DE")} € Mindestpreis</span>
            <span className="text-gray-400">Ø {hovered.avgPrice.toLocaleString("de-DE")} €</span>
            <span className="text-gray-400">{fmtDateLong(hovered.date)}</span>
            <span className="text-gray-400">{hovered.dealCount} Angebote</span>
          </>
        ) : (
          <span className="text-xs text-gray-400">Über den Graphen fahren für Details</span>
        )}
      </div>

      {/* SVG */}
      <div className="overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${forecastNext30 ? W + 60 : W} ${H}`}
          className="overflow-visible"
          onMouseLeave={() => setHovered(null)}
          style={{ minWidth: 320 }}
        >
          {/* Grid lines + Y labels */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} y1={yOf(tick)} x2={PAD.left + cW} y2={yOf(tick)}
                stroke="#f1f5f9" strokeWidth="1" />
              <text x={PAD.left - 6} y={yOf(tick) + 4}
                textAnchor="end" fontSize="10" fill="#94a3b8">
                {Math.round(tick).toLocaleString("de-DE")}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={areaColor} />

          {/* Raw price line (thin, muted) */}
          <polyline points={rawPts.join(" ")}
            stroke={lineColor} strokeWidth="1" strokeOpacity="0.25"
            strokeLinejoin="round" fill="none" />

          {/* Moving average line */}
          <polyline points={maPts.join(" ")}
            stroke={lineColor} strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" fill="none" />

          {/* Forecast dashed segment */}
          {forecastNext30 && forecastX && forecastY && (
            <>
              <line
                x1={lastX} y1={lastY} x2={forecastX} y2={forecastY}
                stroke={lineColor} strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7"
              />
              <circle cx={forecastX} cy={forecastY} r="5" fill={lineColor} fillOpacity="0.3" />
              <circle cx={forecastX} cy={forecastY} r="3" fill={lineColor} />
              <text x={forecastX + 8} y={forecastY + 4}
                fontSize="10" fill={lineColor} fontWeight="700">
                ~{forecastNext30.toLocaleString("de-DE")} €
              </text>
              <text x={forecastX + 8} y={forecastY + 15}
                fontSize="9" fill="#94a3b8">
                in 30 Tagen
              </text>
            </>
          )}

          {/* X-axis labels */}
          {xLabels.map((p) => {
            const i = series.indexOf(p);
            return (
              <text key={p.date} x={xOf(i)} y={H - 4}
                textAnchor="middle" fontSize="10" fill="#94a3b8">
                {fmtDate(p.date)}
              </text>
            );
          })}

          {/* Hover columns */}
          {series.map((p, i) => {
            const x = xOf(i);
            const colW = cW / series.length;
            return (
              <g key={p.date}>
                <rect
                  x={x - colW / 2} y={PAD.top}
                  width={colW} height={cH}
                  fill="transparent"
                  onMouseEnter={() => setHovered(p)}
                />
                {hovered?.date === p.date && (
                  <>
                    <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + cH}
                      stroke={lineColor} strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.5" />
                    <circle cx={x} cy={yOf(p.minPrice)} r="4" fill={lineColor} />
                    <circle cx={x} cy={yOf(p.minPrice)} r="7" fill={lineColor} fillOpacity="0.15" />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 h-0.5" style={{ background: lineColor }} /> 7-Tage-Durchschnitt
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 h-0.5 opacity-30" style={{ background: lineColor }} /> Tagespreis
        </span>
        {forecastNext30 && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-5 border-t-2 border-dashed" style={{ borderColor: lineColor }} /> Prognose
          </span>
        )}
      </div>

      {/* Min/Max bar */}
      <div className="flex justify-between mt-3 text-xs text-gray-500 border-t pt-3">
        <span>↓ Tiefstpreis: <strong className="text-emerald-600">{Math.min(...prices).toLocaleString("de-DE")} €</strong></span>
        <span>Ø Durchschnitt: <strong className="text-gray-700">{Math.round(prices.reduce((a, b) => a + b, 0) / prices.length).toLocaleString("de-DE")} €</strong></span>
        <span>↑ Höchstpreis: <strong className="text-red-500">{Math.max(...prices).toLocaleString("de-DE")} €</strong></span>
      </div>
    </div>
  );
}
