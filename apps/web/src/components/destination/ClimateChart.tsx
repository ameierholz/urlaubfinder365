"use client";

import { useState } from "react";
import type { ClimateMonth } from "@/types";

interface Props {
  data: ClimateMonth[];
  destination: string;
}

export default function ClimateChart({ data, destination }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxRain = Math.max(...data.map((m) => m.rain), 1);
  const maxTemp = Math.max(...data.map((m) => m.tempHigh), 1);

  const CHART_H = 150; // height of bar/line area in px
  const TOP_SPACE = 72; // reserved above bars: tooltip + temp labels
  const TOTAL_H = CHART_H + TOP_SPACE;

  // SVG viewBox – same numeric scale as pixels for easy mapping
  const VW = 1200;

  const svgX = (i: number) => ((i + 0.5) / data.length) * VW;
  const svgY = (temp: number) => TOP_SPACE + (1 - (temp / maxTemp) * 0.9) * CHART_H;

  const bestMonths = data.filter((m) => m.tempHigh >= 24 && m.rain <= 30);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Klima &amp; beste Reisezeit für {destination}
      </h2>
      {bestMonths.length > 0 && (
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-sand-500">Beste Reisemonate:</span>{" "}
          {bestMonths.map((m) => m.month).join(", ")} – warm und wenig Regen.
        </p>
      )}

      <div className="bg-white rounded-3xl border border-sand-100 shadow-sm p-6">
        {/* Scrollable wrapper – overflow-x-auto clips y, so tooltip lives inside TOTAL_H */}
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            {/* Chart area */}
            <div className="relative" style={{ height: `${TOTAL_H}px` }}>

              {/* SVG: grid lines, temperature lines, dots */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${VW} ${TOTAL_H}`}
                preserveAspectRatio="none"
                role="img"
                aria-label={`Klimadiagramm für ${destination}: Temperatur- und Niederschlagsverlauf über 12 Monate`}
              >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                  const y = TOP_SPACE + (1 - frac) * CHART_H;
                  return (
                    <line
                      key={frac}
                      x1={0} y1={y} x2={VW} y2={y}
                      stroke={frac === 0 ? "#e5e7eb" : "#f3f4f6"}
                      strokeWidth={frac === 0 ? 1.5 : 1}
                    />
                  );
                })}

                {/* Best-month column highlight */}
                {data.map((m, i) =>
                  m.tempHigh >= 24 && m.rain <= 30 ? (
                    <rect
                      key={i}
                      x={(i / data.length) * VW}
                      y={TOP_SPACE}
                      width={VW / data.length}
                      height={CHART_H}
                      fill="rgba(251,191,36,0.06)"
                    />
                  ) : null
                )}

                {/* Soft area fill under temp HIGH */}
                <polygon
                  fill="rgba(196,144,56,0.07)"
                  points={[
                    ...data.map((m, i) => `${svgX(i)},${svgY(m.tempHigh)}`),
                    `${svgX(data.length - 1)},${TOTAL_H}`,
                    `${svgX(0)},${TOTAL_H}`,
                  ].join(" ")}
                />

                {/* Temp HIGH line */}
                <polyline
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#c49038"
                  points={data.map((m, i) => `${svgX(i)},${svgY(m.tempHigh)}`).join(" ")}
                />

                {/* Temp LOW line */}
                <polyline
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 8"
                  stroke="#fbbf24"
                  points={data.map((m, i) => `${svgX(i)},${svgY(m.tempLow)}`).join(" ")}
                />

                {/* Dots on temp HIGH */}
                {data.map((m, i) => (
                  <circle
                    key={i}
                    cx={svgX(i)}
                    cy={svgY(m.tempHigh)}
                    r={hovered === i ? 5 : 3}
                    fill={hovered === i ? "#c49038" : "white"}
                    stroke="#c49038"
                    strokeWidth="2"
                  />
                ))}
              </svg>

              {/* Temperature HIGH labels – HTML (no SVG distortion) */}
              {data.map((m, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none select-none text-[10px] font-bold text-sand-500 -translate-x-1/2"
                  style={{
                    left: `${((i + 0.5) / data.length) * 100}%`,
                    top: `${svgY(m.tempHigh) - 18}px`,
                  }}
                >
                  {m.tempHigh}°
                </div>
              ))}

              {/* Tooltip – lives within TOP_SPACE, never clips */}
              {hovered !== null && (
                <div
                  className="absolute z-50 pointer-events-none -translate-x-1/2"
                  style={{
                    left: `clamp(60px, ${((hovered + 0.5) / data.length) * 100}%, calc(100% - 60px))`,
                    top: "2px",
                  }}
                >
                  <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-xl">
                    <p className="font-bold mb-1 text-center">{data[hovered].month}</p>
                    <p className="text-sand-300">☀ max {data[hovered].tempHigh} °C</p>
                    <p className="text-yellow-200">☀ min {data[hovered].tempLow} °C</p>
                    <p className="text-blue-300">💧 {data[hovered].rain} mm</p>
                  </div>
                  <div className="flex justify-center -mt-[1px]">
                    <div className="w-2.5 h-2.5 bg-gray-900 rotate-45" />
                  </div>
                </div>
              )}

              {/* Hover overlay (transparent columns) */}
              <div className="absolute inset-0 flex" style={{ top: `${TOP_SPACE}px` }}>
                {data.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </div>

              {/* Rain bars */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-end gap-1"
                style={{ height: `${CHART_H}px` }}
              >
                {data.map((m, i) => {
                  const rainPct = (m.rain / maxRain) * 85;
                  const isBest = m.tempHigh >= 24 && m.rain <= 30;
                  const barH = Math.max(rainPct, 2);

                  return (
                    <div
                      key={m.month}
                      className="flex-1 h-full flex flex-col justify-end"
                    >
                      <div
                        className={`w-full rounded-t relative transition-opacity ${
                          hovered === i ? "opacity-100" : isBest ? "opacity-80" : "opacity-45"
                        }`}
                        style={{
                          height: `${barH}%`,
                          background: isBest
                            ? "rgba(59,130,246,0.7)"
                            : "rgba(147,197,253,0.65)",
                        }}
                      >
                        {/* Rain mm label inside bar */}
                        {m.rain >= 50 && barH > 14 && (
                          <span className="absolute inset-x-0 top-1 text-center text-[9px] font-bold text-blue-800/75 leading-none select-none">
                            {m.rain}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Month labels */}
            <div className="flex gap-1 mt-1">
              {data.map((m) => {
                const isBest = m.tempHigh >= 24 && m.rain <= 30;
                return (
                  <div
                    key={m.month}
                    className={`flex-1 text-center text-xs font-semibold ${
                      isBest ? "text-sand-500" : "text-gray-400"
                    }`}
                  >
                    {m.month}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded bg-blue-300/60" />
            Niederschlag (mm)
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#c49038" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Tageshöchsttemp. (°C)
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
            </svg>
            Nachttemp. (°C)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sand-500 font-semibold">Beste Reisezeit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
