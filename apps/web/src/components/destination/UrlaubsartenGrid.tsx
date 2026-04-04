"use client";

import { useEffect, useRef, useState } from "react";

const AGENT = "993243";
const IBE_BASE = "https://ibe.specials.de/";
const MAX_HISTORY = 28; // days to keep

const AI_CODES = new Set(["AI", "UAI", "ALL INCLUSIVE", "ALL-INCLUSIVE"]);
function isAI(code: string) { return AI_CODES.has((code ?? "").toUpperCase()); }
function fmtPrice(val: unknown) {
  const n = Number(val);
  return isNaN(n) ? null : n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
}
function fmtNum(val: unknown): number | null {
  const n = Number(val);
  return isNaN(n) ? null : n;
}
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}.${m}.`;
}

interface KatDef {
  key: string;
  icon: string;
  label: string;
  desc: string;
  color: string;
  iconBg: string;
  apiParams: Record<string, string>;
  excludeAi?: boolean;
  ibeParams: Record<string, string>;
  anchor: string | null;
}

const KATEGORIEN: KatDef[] = [
  {
    key: "pauschal",
    icon: "✈️",
    label: "Pauschalreisen",
    desc: "Flug + Hotel perfekt kombiniert",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100 text-blue-700",
    apiParams: { from: "14", to: "42" },
    excludeAi: true,
    ibeParams: {},
    anchor: "#pauschalreisen",
  },
  {
    key: "ai",
    icon: "🍹",
    label: "All Inclusive",
    desc: "Rundum-sorglos ohne Kostenkontrolle",
    color: "bg-teal-50 border-teal-200 hover:border-teal-400",
    iconBg: "bg-teal-100 text-teal-700",
    apiParams: { from: "14", to: "42", boardCode: "AI" },
    ibeParams: { boardCode: "AI" },
    anchor: "#all-inclusive",
  },
  {
    key: "lastminute",
    icon: "⚡",
    label: "Last Minute",
    desc: "Spontan weg & kräftig sparen",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100 text-amber-700",
    apiParams: { from: "3", to: "21" },
    ibeParams: { from: "3", to: "21" },
    anchor: "#last-minute",
  },
  {
    key: "familie",
    icon: "👨‍👩‍👧",
    label: "Familienurlaub",
    desc: "Urlaub mit der ganzen Familie",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    iconBg: "bg-green-100 text-green-700",
    apiParams: { from: "14", to: "42", children: "8,8" },
    ibeParams: { from: "14", to: "42", duration: "7-7", category: "3", children: "8,8" },
    anchor: null,
  },
  {
    key: "strand",
    icon: "🏖️",
    label: "Strandurlaub",
    desc: "Direkt am Strand & strandnah",
    color: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",
    iconBg: "bg-cyan-100 text-cyan-700",
    apiParams: { from: "14", to: "42", keywords: "bea,ben" },
    ibeParams: { from: "14", to: "42", duration: "7-7", category: "3", keywords: "bea,ben" },
    anchor: null,
  },
  {
    key: "adults",
    icon: "🌴",
    label: "Adults Only",
    desc: "Exklusive Auszeit nur für Erwachsene",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100 text-purple-700",
    apiParams: { from: "14", to: "42", keywords: "ado" },
    ibeParams: { from: "14", to: "42", duration: "7-7", category: "3", keywords: "ado" },
    anchor: null,
  },
];

type Trend = "up" | "down" | "flat" | null;
type HistoryEntry = { date: string; price: number };

interface PriceEntry {
  loading: boolean;
  price: string | null;
  trend: Trend;
  trendPct: number | null;
  history: HistoryEntry[];
}
type PriceMap = Record<string, PriceEntry>;

function lsKey(regionId: string, key: string) { return `uf365_ph_${regionId}_${key}`; }

function loadHistory(regionId: string, key: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(lsKey(regionId, key));
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch { return []; }
}

function saveHistory(regionId: string, key: string, price: number, existing: HistoryEntry[]) {
  try {
    const todayStr = today();
    const updated = existing.filter((e) => e.date !== todayStr);
    updated.push({ date: todayStr, price });
    updated.sort((a, b) => a.date.localeCompare(b.date));
    const trimmed = updated.slice(-MAX_HISTORY);
    localStorage.setItem(lsKey(regionId, key), JSON.stringify(trimmed));
    return trimmed;
  } catch { return existing; }
}

function getTrend(history: HistoryEntry[], current: number): { trend: Trend; pct: number | null } {
  const prevEntries = history.filter((e) => e.date < today());
  const prev = prevEntries.length > 0 ? prevEntries[prevEntries.length - 1] : history[history.length - 2];
  if (!prev) return { trend: null, pct: null };
  const diff = (current - prev.price) / prev.price;
  const pct = Math.round(Math.abs(diff) * 100);
  if (diff > 0.03) return { trend: "up", pct };
  if (diff < -0.03) return { trend: "down", pct };
  return { trend: "flat", pct };
}

// ── Sparkline (inline mini chart) ────────────────────────────────────────────

function Sparkline({ history }: { history: HistoryEntry[] }) {
  if (history.length < 2) return null;
  const W = 80, H = 22;
  const prices = history.map((e) => e.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * W;
    const y = H - ((p - min) / range) * (H - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = prices[prices.length - 1];
  const first = prices[0];
  const color = last <= first ? "#10b981" : "#ef4444";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={pts.join(" ")} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2" fill={color} />
    </svg>
  );
}

// ── Full chart popup ──────────────────────────────────────────────────────────

interface PopupProps {
  kat: KatDef;
  history: HistoryEntry[];
  onClose: () => void;
}

function ChartPopup({ kat, history, onClose }: PopupProps) {
  const [hovered, setHovered] = useState<HistoryEntry | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (history.length < 2) return null;

  const W = 320, H = 160;
  const PAD = { top: 12, right: 16, bottom: 28, left: 48 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const prices = history.map((e) => e.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const padding = range * 0.15;
  const yMin = min - padding;
  const yMax = max + padding;
  const yRange = yMax - yMin;

  function xOf(i: number) { return PAD.left + (i / (history.length - 1)) * cW; }
  function yOf(p: number) { return PAD.top + cH - ((p - yMin) / yRange) * cH; }

  const points = history.map((e, i) => `${xOf(i).toFixed(1)},${yOf(e.price).toFixed(1)}`);
  const areaPoints = [
    `${xOf(0).toFixed(1)},${(PAD.top + cH).toFixed(1)}`,
    ...points,
    `${xOf(history.length - 1).toFixed(1)},${(PAD.top + cH).toFixed(1)}`,
  ];

  const last = prices[prices.length - 1];
  const first = prices[0];
  const lineColor = last <= first ? "#10b981" : "#ef4444";
  const areaColor = last <= first ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)";

  // Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const val = yMin + (yRange / (tickCount - 1)) * i;
    return val;
  });

  // X-axis: show max 5 labels
  const xStep = Math.ceil(history.length / 5);
  const xLabels = history.filter((_, i) => i % xStep === 0 || i === history.length - 1);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">{kat.icon}</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">{kat.label}</p>
              <p className="text-[11px] text-gray-400">Preisverlauf letzte {history.length} Tage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Hovered price display */}
        <div className="px-5 pt-3 h-8 flex items-center gap-2">
          {hovered ? (
            <>
              <span className="text-sm font-bold text-gray-900">
                {hovered.price.toLocaleString("de-DE")} €
              </span>
              <span className="text-xs text-gray-400">{fmtDate(hovered.date)}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Über den Graphen fahren für Details</span>
          )}
        </div>

        {/* SVG Chart */}
        <div className="px-3 pb-4">
          <svg
            width="100%"
            viewBox={`0 0 ${W} ${H}`}
            className="overflow-visible"
            onMouseLeave={() => setHovered(null)}
          >
            {/* Grid lines */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left} y1={yOf(tick)}
                  x2={PAD.left + cW} y2={yOf(tick)}
                  stroke="#f1f5f9" strokeWidth="1"
                />
                <text
                  x={PAD.left - 4} y={yOf(tick) + 4}
                  textAnchor="end" fontSize="9" fill="#94a3b8"
                >
                  {Math.round(tick).toLocaleString("de-DE")}
                </text>
              </g>
            ))}

            {/* Area fill */}
            <polygon points={areaPoints.join(" ")} fill={areaColor} />

            {/* Line */}
            <polyline
              points={points.join(" ")}
              stroke={lineColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />

            {/* X-axis labels */}
            {xLabels.map((e) => {
              const i = history.indexOf(e);
              return (
                <text
                  key={e.date}
                  x={xOf(i)} y={H - 4}
                  textAnchor="middle" fontSize="9" fill="#94a3b8"
                >
                  {fmtDate(e.date)}
                </text>
              );
            })}

            {/* Hover targets + dots */}
            {history.map((e, i) => (
              <g key={e.date}>
                <rect
                  x={xOf(i) - cW / (2 * history.length)}
                  y={PAD.top}
                  width={cW / history.length}
                  height={cH}
                  fill="transparent"
                  onMouseEnter={() => setHovered(e)}
                />
                {hovered?.date === e.date && (
                  <>
                    <line
                      x1={xOf(i)} y1={PAD.top}
                      x2={xOf(i)} y2={PAD.top + cH}
                      stroke={lineColor} strokeWidth="1" strokeDasharray="3,2"
                    />
                    <circle cx={xOf(i)} cy={yOf(e.price)} r="4" fill={lineColor} />
                    <circle cx={xOf(i)} cy={yOf(e.price)} r="6" fill={lineColor} fillOpacity="0.2" />
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Min / Max summary */}
        <div className="flex justify-between px-5 pb-4 text-[11px] text-gray-500">
          <span>↓ Min: <strong className="text-emerald-600">{Math.min(...prices).toLocaleString("de-DE")} €</strong></span>
          <span>↑ Max: <strong className="text-red-500">{Math.max(...prices).toLocaleString("de-DE")} €</strong></span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props { regionId: string; destName: string; }

export default function UrlaubsartenGrid({ regionId, destName }: Props) {
  const [prices, setPrices] = useState<PriceMap>(() =>
    Object.fromEntries(KATEGORIEN.map((k) => [
      k.key,
      { loading: true, price: null, trend: null, trendPct: null, history: [] },
    ]))
  );
  const [popup, setPopup] = useState<{ kat: KatDef; history: HistoryEntry[] } | null>(null);

  useEffect(() => {
    if (!regionId) return;
    KATEGORIEN.forEach((kat) => {
      const existing = loadHistory(regionId, kat.key);
      const p = new URLSearchParams({
        duration: "7-7", adults: "2", category: "3",
        minRecommrate: "30", limit: "5", regionId,
        ...kat.apiParams,
      });
      fetch(`/api/teaser?${p}`)
        .then((r) => r.json())
        .then((json) => {
          let offers: { offer_price_total?: unknown; board_code?: string }[] =
            Array.isArray(json.data) ? json.data : [];
          if (kat.excludeAi) offers = offers.filter((o) => !isAI(o.board_code ?? ""));
          if (!offers.length) throw new Error("empty");
          const cheapest = offers.reduce((min, o) =>
            (Number(o.offer_price_total) || Infinity) < (Number(min.offer_price_total) || Infinity) ? o : min
          );
          const numericPrice = fmtNum(cheapest.offer_price_total);
          if (numericPrice === null) throw new Error("no price");
          const history = saveHistory(regionId, kat.key, numericPrice, existing);
          const { trend, pct } = getTrend(history, numericPrice);
          setPrices((prev) => ({
            ...prev,
            [kat.key]: { loading: false, price: fmtPrice(numericPrice), trend, trendPct: pct, history },
          }));
        })
        .catch(() => {
          setPrices((prev) => ({
            ...prev,
            [kat.key]: { loading: false, price: null, trend: null, trendPct: null, history: existing },
          }));
        });
    });
  }, [regionId]);

  function buildIbeUrl(kat: KatDef) {
    const p = new URLSearchParams({ agent: AGENT, adults: "2", duration: "7-7", regionId, ...kat.ibeParams });
    return `${IBE_BASE}?${p.toString()}`;
  }

  function handleCardClick(e: React.MouseEvent<HTMLAnchorElement>, kat: KatDef) {
    if (kat.anchor) return;
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ibeOpenBooking?.(buildIbeUrl(kat), `${kat.label} in ${destName}`);
  }

  function handleChartClick(e: React.MouseEvent, kat: KatDef) {
    e.preventDefault();
    e.stopPropagation();
    const h = prices[kat.key].history;
    if (h.length >= 2) setPopup({ kat, history: h });
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KATEGORIEN.map((kat) => {
          const { loading, price, trend, trendPct, history } = prices[kat.key];
          const hasChart = history.length >= 2;

          return (
            <a
              key={kat.key}
              href={kat.anchor ?? buildIbeUrl(kat)}
              onClick={(e) => handleCardClick(e, kat)}
              className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all duration-200 cursor-pointer group no-underline ${kat.color}`}
            >
              <span className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kat.iconBg}`}>
                {kat.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm leading-tight">{kat.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{kat.desc}</p>

                {/* Price + trend badge */}
                <div className="flex items-center gap-1.5 mt-1.5 min-h-4">
                  {loading ? (
                    <span className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse" />
                  ) : price ? (
                    <>
                      <span className="text-xs font-semibold text-emerald-700">ab {price}</span>
                      {trend === "up" && trendPct !== null && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded" title="Preis gestiegen zum Vortag">
                          ↑ +{trendPct}% zum Vortag
                        </span>
                      )}
                      {trend === "down" && trendPct !== null && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded" title="Preis gesunken zum Vortag">
                          ↓ -{trendPct}% zum Vortag
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Preise auf Anfrage</span>
                  )}
                </div>

                {/* Sparkline */}
                {hasChart && (
                  <div
                    className="mt-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                    onClick={(e) => handleChartClick(e, kat)}
                    title="Preisverlauf anzeigen"
                  >
                    <Sparkline history={history} />
                  </div>
                )}
              </div>

              <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-lg shrink-0">›</span>
            </a>
          );
        })}
      </div>

      {/* Chart popup */}
      {popup && (
        <ChartPopup
          kat={popup.kat}
          history={popup.history}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
