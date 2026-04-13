"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, TrendingUp, TrendingDown, Eye, MousePointerClick, Target,
  BarChart3, ArrowUp, ArrowDown, Monitor, Globe2, Trophy, Lightbulb,
  Smartphone, Tablet, Laptop, Sparkles, ExternalLink, Search,
  FileText, Loader2, Copy, Check, Zap, ShieldAlert,
} from "lucide-react";

interface DailyData { date: string; clicks: number; impressions: number; ctr: number; position: number }
interface KeywordData { keyword: string; clicks: number; impressions: number; ctr: number; position: number }
interface PageData { page: string; clicks: number; impressions: number; ctr: number; position: number }
interface TrendingData { keyword: string; impressions: number; prevImpressions: number; growth: number; position: number }
interface DeviceData { device: string; clicks: number; impressions: number; ctr: number; position: number; clickShare: number; impressionShare: number }
interface CountryData { country: string; clicks: number; impressions: number; ctr: number; position: number }
interface WinnerLoserData { keyword: string; clicks: number; impressions: number; position: number; prevPosition: number; change: number }
interface OpportunityData { page: string; clicks: number; impressions: number; ctr: number; position: number; potentialClicks: number }

export default function SeoPerformancePage() {
  const [days, setDays] = useState(28);
  const [tab, setTab] = useState<"overview" | "keywords" | "pages" | "trending" | "devices" | "countries" | "winners" | "opportunities">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<{ totals: { clicks: number; impressions: number; ctr: number; position: number }; prevTotals: { clicks: number; impressions: number }; daily: DailyData[] } | null>(null);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [trending, setTrending] = useState<TrendingData[]>([]);
  const [devices, setDevices] = useState<{ devices: DeviceData[]; totalClicks: number; totalImpressions: number } | null>(null);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [winners, setWinners] = useState<{ winners: WinnerLoserData[]; losers: WinnerLoserData[]; period?: { current: string; previous: string; days: number } } | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);

  // Keyword-Positions-Verteilung laden (für Overview)
  const [posDistribution, setPosDistribution] = useState<{ page1: number; page2: number; page3: number; rest: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetches: Promise<void>[] = [
      fetch(`/api/admin/search-console?type=${tab}&days=${days}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { setError(data.error); return; }
          if (tab === "overview") setOverview(data);
          if (tab === "keywords") setKeywords(data.keywords ?? []);
          if (tab === "pages") setPages(data.pages ?? []);
          if (tab === "trending") setTrending(data.trending ?? []);
          if (tab === "devices") setDevices(data);
          if (tab === "countries") setCountries(data.countries ?? []);
          if (tab === "winners") setWinners(data);
          if (tab === "opportunities") setOpportunities(data.opportunities ?? []);
        }),
    ];

    // Bei Overview zusätzlich Keywords laden für Positions-Verteilung
    if (tab === "overview") {
      fetches.push(
        fetch(`/api/admin/search-console?type=keywords&days=${days}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.error) return;
            const kws: KeywordData[] = data.keywords ?? [];
            let page1 = 0, page2 = 0, page3 = 0, rest = 0;
            for (const kw of kws) {
              if (kw.position <= 10) page1++;
              else if (kw.position <= 20) page2++;
              else if (kw.position <= 30) page3++;
              else rest++;
            }
            setPosDistribution({ page1, page2, page3, rest });
          })
      );
    }

    Promise.all(fetches)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [tab, days]);

  const fmtNum = (n: number) => n.toLocaleString("de-DE");
  const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const fmtPos = (n: number) => n.toFixed(1);

  const tabCls = (t: string) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo" className="hover:text-gray-300">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Performance</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">SEO-Performance</h1>
            <p className="text-sm text-gray-500">Google Search Console Daten</p>
          </div>
        </div>

        {/* Zeitraum */}
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}
          className="bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm">
          <option value={7}>Letzte 7 Tage</option>
          <option value={28}>Letzte 28 Tage</option>
          <option value={90}>Letzte 3 Monate</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setTab("overview")} className={tabCls("overview")}>Übersicht</button>
        <button onClick={() => setTab("keywords")} className={tabCls("keywords")}>Keywords</button>
        <button onClick={() => setTab("pages")} className={tabCls("pages")}>Seiten</button>
        <button onClick={() => setTab("trending")} className={tabCls("trending")}>Trending</button>
        <button onClick={() => setTab("devices")} className={tabCls("devices")}>
          <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" />Geräte</span>
        </button>
        <button onClick={() => setTab("countries")} className={tabCls("countries")}>
          <span className="flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5" />Länder</span>
        </button>
        <button onClick={() => setTab("winners")} className={tabCls("winners")}>
          <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" />Gewinner / Verlierer</span>
        </button>
        <button onClick={() => setTab("opportunities")} className={tabCls("opportunities")}>
          <span className="flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" />Opportunities</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 mb-6 text-sm text-red-300">
          {error.includes("GOOGLE_SERVICE_ACCOUNT_KEY") ? (
            <div>
              <p className="font-bold mb-2">Google Search Console API nicht verbunden</p>
              <p className="text-red-400 text-xs">
                1. Gehe zu <a href="https://console.cloud.google.com"  target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a><br/>
                2. Erstelle ein Projekt + aktiviere "Search Console API"<br/>
                3. Erstelle einen Service Account + lade JSON-Key herunter<br/>
                4. Füge die Service-Account-Email als Nutzer in der <a href="https://search.google.com/search-console"  target="_blank" rel="noopener noreferrer" className="underline">Search Console</a> hinzu<br/>
                5. Setze den JSON-Key als <code className="bg-red-800 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code> in Vercel
              </p>
            </div>
          ) : error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Overview Tab */}
      {!loading && !error && tab === "overview" && overview && (
        <div>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Klicks", value: fmtNum(overview.totals.clicks), icon: MousePointerClick,
                color: "text-blue-400", change: overview.prevTotals.clicks > 0
                  ? ((overview.totals.clicks - overview.prevTotals.clicks) / overview.prevTotals.clicks * 100).toFixed(0) : null,
              },
              {
                label: "Impressionen", value: fmtNum(overview.totals.impressions), icon: Eye,
                color: "text-purple-400", change: overview.prevTotals.impressions > 0
                  ? ((overview.totals.impressions - overview.prevTotals.impressions) / overview.prevTotals.impressions * 100).toFixed(0) : null,
              },
              { label: "Ø CTR", value: fmtPct(overview.totals.ctr), icon: Target, color: "text-teal-400", change: null },
              { label: "Ø Position", value: fmtPos(overview.totals.position), icon: TrendingUp, color: "text-orange-400", change: null },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
                {kpi.change && (
                  <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${Number(kpi.change) >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {Number(kpi.change) >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {kpi.change}% vs. Vorperiode
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Daily Clicks Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-300 mb-4">Klicks pro Tag</h3>
            <div className="flex items-end gap-px h-32">
              {overview.daily.map((d) => {
                const maxClicks = Math.max(...overview.daily.map((x) => x.clicks), 1);
                const height = (d.clicks / maxClicks) * 100;
                return (
                  <div key={d.date} className="flex-1 group relative" title={`${d.date}: ${d.clicks} Klicks`}>
                    <div className="bg-teal-500/60 hover:bg-teal-400 rounded-t transition-colors" style={{ height: `${Math.max(height, 2)}%` }} />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {d.date}: {d.clicks} Klicks
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Impressions Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-300 mb-4">Impressionen pro Tag</h3>
            <div className="flex items-end gap-px h-32">
              {overview.daily.map((d) => {
                const maxImpressions = Math.max(...overview.daily.map((x) => x.impressions), 1);
                const height = (d.impressions / maxImpressions) * 100;
                return (
                  <div key={d.date} className="flex-1 group relative" title={`${d.date}: ${fmtNum(d.impressions)} Impressionen`}>
                    <div className="bg-purple-500/60 hover:bg-purple-400 rounded-t transition-colors" style={{ height: `${Math.max(height, 2)}%` }} />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {d.date}: {fmtNum(d.impressions)} Impressionen
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Positions-Verteilung */}
          {posDistribution && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-4">Positions-Verteilung (Top 50 Keywords)</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Seite 1 (1-10)", count: posDistribution.page1, color: "bg-green-500", textColor: "text-green-400" },
                  { label: "Seite 2 (11-20)", count: posDistribution.page2, color: "bg-yellow-500", textColor: "text-yellow-400" },
                  { label: "Seite 3 (21-30)", count: posDistribution.page3, color: "bg-orange-500", textColor: "text-orange-400" },
                  { label: "Seite 4+ (31+)", count: posDistribution.rest, color: "bg-red-500", textColor: "text-red-400" },
                ].map((bucket) => {
                  const total = posDistribution.page1 + posDistribution.page2 + posDistribution.page3 + posDistribution.rest;
                  const pct = total > 0 ? (bucket.count / total) * 100 : 0;
                  return (
                    <div key={bucket.label} className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{bucket.label}</p>
                      <p className={`text-xl font-black ${bucket.textColor}`}>{bucket.count}</p>
                      <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${bucket.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">{pct.toFixed(0)}% der Keywords</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keywords Tab */}
      {!loading && !error && tab === "keywords" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Keyword</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Klicks</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Impressionen</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">CTR</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, i) => (
                <tr key={kw.keyword} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                  <td className="px-4 py-2.5 text-gray-600 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5 text-white font-medium">{kw.keyword}</td>
                  <td className="px-4 py-2.5 text-right text-blue-400">{fmtNum(kw.clicks)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-400">{fmtNum(kw.impressions)}</td>
                  <td className="px-4 py-2.5 text-right text-teal-400">{fmtPct(kw.ctr)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono ${kw.position <= 3 ? "text-green-400" : kw.position <= 10 ? "text-yellow-400" : kw.position <= 20 ? "text-orange-400" : "text-red-400"}`}>
                      {fmtPos(kw.position)}
                    </span>
                  </td>
                </tr>
              ))}
              {keywords.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Keine Keyword-Daten verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pages Tab */}
      {!loading && !error && tab === "pages" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Seite</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Klicks</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Impressionen</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">CTR</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Ø Position</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p, i) => (
                <tr key={p.page} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                  <td className="px-4 py-2.5 text-gray-600 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <a href={`https://www.urlaubfinder365.de${p.page}`}  target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 font-mono text-xs">{p.page}</a>
                  </td>
                  <td className="px-4 py-2.5 text-right text-blue-400">{fmtNum(p.clicks)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-400">{fmtNum(p.impressions)}</td>
                  <td className="px-4 py-2.5 text-right text-teal-400">{fmtPct(p.ctr)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono ${p.position <= 10 ? "text-green-400" : p.position <= 20 ? "text-yellow-400" : "text-red-400"}`}>
                      {fmtPos(p.position)}
                    </span>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Keine Seiten-Daten verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Trending Tab */}
      {!loading && !error && tab === "trending" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-sm text-gray-300 font-semibold">Stärkstes Wachstum (letzte 7 vs. vorherige 7 Tage)</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Keyword</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Impressionen</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Vorher</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Wachstum</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody>
              {trending.map((t) => (
                <tr key={t.keyword} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                  <td className="px-4 py-2.5 text-white font-medium">{t.keyword}</td>
                  <td className="px-4 py-2.5 text-right text-purple-400">{fmtNum(t.impressions)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{fmtNum(t.prevImpressions)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="flex items-center justify-end gap-1 text-green-400 font-bold">
                      <TrendingUp className="w-3 h-3" /> +{t.growth}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-gray-400">{fmtPos(t.position)}</td>
                </tr>
              ))}
              {trending.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Keine Trending-Daten verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Devices Tab */}
      {!loading && !error && tab === "devices" && devices && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Donut-artige Darstellung Klick-Anteil */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-300 mb-4">Klick-Verteilung nach Gerät</h3>
              <div className="flex items-center gap-6">
                {/* Donut Ring via SVG */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {(() => {
                      const colors = ["#2dd4bf", "#818cf8", "#fb923c"]; // teal, indigo, orange
                      let offset = 0;
                      return devices.devices.map((d, i) => {
                        const pct = d.clickShare * 100;
                        const el = (
                          <circle key={d.device} cx="18" cy="18" r="14" fill="none" strokeWidth="4"
                            stroke={colors[i % colors.length]}
                            strokeDasharray={`${pct} ${100 - pct}`}
                            strokeDashoffset={`${-offset}`}
                            className="transition-all duration-500" />
                        );
                        offset += pct;
                        return el;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-white">{fmtNum(devices.totalClicks)}</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="space-y-3 flex-1">
                  {devices.devices.map((d, i) => {
                    const colors = ["bg-teal-400", "bg-indigo-400", "bg-orange-400"];
                    const icons = [Laptop, Smartphone, Tablet];
                    const Icon = icons[i % icons.length];
                    const deviceLabels: Record<string, string> = { DESKTOP: "Desktop", MOBILE: "Mobil", TABLET: "Tablet" };
                    return (
                      <div key={d.device} className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`} />
                        <Icon className="w-4 h-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white font-semibold">{deviceLabels[d.device] ?? d.device}</p>
                          <p className="text-xs text-gray-500">{fmtNum(d.clicks)} Klicks ({fmtPct(d.clickShare)})</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* KPI-Karten pro Gerät */}
            <div className="space-y-3">
              {devices.devices.map((d) => {
                const deviceLabels: Record<string, string> = { DESKTOP: "Desktop", MOBILE: "Mobil", TABLET: "Tablet" };
                const deviceIcons: Record<string, typeof Laptop> = { DESKTOP: Laptop, MOBILE: Smartphone, TABLET: Tablet };
                const Icon = deviceIcons[d.device] ?? Monitor;
                return (
                  <div key={d.device} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-2 bg-teal-900/30 rounded-lg">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{deviceLabels[d.device] ?? d.device}</p>
                      <p className="text-xs text-gray-500">{fmtNum(d.impressions)} Impressionen</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-teal-400">{fmtPct(d.ctr)} CTR</p>
                      <p className="text-xs text-gray-500">Ø Pos. {fmtPos(d.position)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Countries Tab */}
      {!loading && !error && tab === "countries" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-sm text-gray-300 font-semibold">Top-Länder nach Klicks</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">#</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Land</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Klicks</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Impressionen</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">CTR</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Ø Position</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-widest w-32">Anteil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(() => {
                const maxClicks = Math.max(...countries.map((c) => c.clicks), 1);
                return countries.map((c, i) => (
                  <tr key={c.country} className="hover:bg-gray-800/30">
                    <td className="px-4 py-2.5 text-gray-600 text-xs">{i + 1}</td>
                    <td className="px-4 py-2.5 text-white font-semibold uppercase text-xs tracking-wide">{c.country}</td>
                    <td className="px-4 py-2.5 text-right text-blue-400 font-mono">{fmtNum(c.clicks)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400">{fmtNum(c.impressions)}</td>
                    <td className="px-4 py-2.5 text-right text-teal-400">{fmtPct(c.ctr)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-mono ${c.position <= 10 ? "text-green-400" : c.position <= 20 ? "text-yellow-400" : "text-red-400"}`}>
                        {fmtPos(c.position)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(c.clicks / maxClicks) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ));
              })()}
              {countries.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Keine Länder-Daten verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Winners / Losers Tab */}
      {!loading && !error && tab === "winners" && winners && (
        <WinnersLosersTab winners={winners.winners} losers={winners.losers} period={winners.period} />
      )}

      {/* Opportunities Tab */}
      {!loading && !error && tab === "opportunities" && (
        <div>
          <div className="bg-teal-900/20 border border-teal-800/40 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-teal-300 font-semibold">Optimierungspotenzial</p>
                <p className="text-xs text-teal-400/70 mt-1">
                  Diese Seiten haben viele Impressionen ({">"}100), aber eine CTR unter 2%. Durch bessere Titles und Meta-Descriptions
                  lassen sich hier signifikant mehr Klicks erzielen.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">#</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Seite</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Impressionen</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Klicks</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">CTR</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Ø Position</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase tracking-widest">Potenzial*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {opportunities.map((o, i) => (
                  <tr key={o.page} className="hover:bg-gray-800/30">
                    <td className="px-4 py-2.5 text-gray-600 text-xs">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <a href={`https://www.urlaubfinder365.de${o.page}`} target="_blank" rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 font-mono text-xs">{o.page}</a>
                    </td>
                    <td className="px-4 py-2.5 text-right text-purple-400 font-mono">{fmtNum(o.impressions)}</td>
                    <td className="px-4 py-2.5 text-right text-blue-400">{fmtNum(o.clicks)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-red-400 font-bold">{fmtPct(o.ctr)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-mono ${o.position <= 10 ? "text-green-400" : o.position <= 20 ? "text-yellow-400" : "text-red-400"}`}>
                        {fmtPos(o.position)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-green-400 font-bold">+{fmtNum(o.potentialClicks - o.clicks)}</span>
                      <span className="text-gray-600 text-xs ml-1">Klicks</span>
                    </td>
                  </tr>
                ))}
                {opportunities.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Keine Opportunities gefunden</td></tr>
                )}
              </tbody>
            </table>
            {opportunities.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-800">
                <p className="text-[10px] text-gray-600">* Potenzial = geschätzte zusätzliche Klicks bei 5% CTR</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Gewinner/Verlierer mit Maßnahmen ────────────────────────────────────────

function WinnersLosersTab({ winners, losers, period }: { winners: WinnerLoserData[]; losers: WinnerLoserData[]; period?: { current: string; previous: string; days: number } }) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fmtNum = (n: number) => n.toLocaleString("de-DE");
  const fmtPos = (n: number) => n.toFixed(1);

  const generateSuggestion = async (keyword: string, position: number, change: number, type: "winner" | "loser") => {
    setGenerating(keyword);
    try {
      const res = await fetch("/api/admin/keyword-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, position, change, type }),
      });
      const data = await res.json();
      if (data.suggestion) {
        setSuggestions((s) => ({ ...s, [keyword]: data.suggestion }));
        setExpandedRow(keyword);
      }
    } catch { /* ignore */ }
    setGenerating(null);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const KwRow = ({ item, type }: { item: WinnerLoserData; type: "winner" | "loser" }) => {
    const isWinner = type === "winner";
    const isExpanded = expandedRow === item.keyword;
    const hasSuggestion = !!suggestions[item.keyword];
    const isGenerating = generating === item.keyword;

    return (
      <>
        <tr className="hover:bg-gray-800/30 transition-colors">
          {/* Keyword + Aktions-Icons */}
          <td className="px-3 py-2.5">
            <p className="text-white font-medium text-xs truncate max-w-[140px]">{item.keyword}</p>
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() => isExpanded && hasSuggestion ? setExpandedRow(null) : generateSuggestion(item.keyword, item.position, item.change, type)}
                disabled={isGenerating}
                className={`p-1 rounded transition-colors ${
                  isExpanded ? "bg-teal-900/50 text-teal-400" : "hover:bg-gray-700 text-gray-500 hover:text-teal-400"
                }`}
                title="KI-Maßnahmen"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              </button>
              <a href={`https://www.google.de/search?q=${encodeURIComponent(item.keyword)}`} target="_blank" rel="noopener noreferrer"
                className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-white transition-colors" title="Google">
                <Search className="w-3 h-3" />
              </a>
              <Link href={`/admin/seo/konkurrenz/?q=${encodeURIComponent(item.keyword)}`}
                className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-amber-400 transition-colors" title="Konkurrenz">
                <Trophy className="w-3 h-3" />
              </Link>
            </div>
          </td>
          {/* Position: jetzt → vorher */}
          <td className="px-2 py-2.5 text-right">
            <span className={`font-mono text-xs ${item.position <= 10 ? "text-green-400" : item.position <= 20 ? "text-yellow-400" : "text-orange-400"}`}>
              {fmtPos(item.position)}
            </span>
            <span className="text-gray-600 text-[10px] mx-0.5">←</span>
            <span className="text-gray-500 font-mono text-[10px]">{fmtPos(item.prevPosition)}</span>
          </td>
          {/* Diff */}
          <td className="px-2 py-2.5 text-right">
            <span className={`flex items-center justify-end gap-0.5 ${isWinner ? "text-green-400" : "text-red-400"} font-bold text-xs`}>
              {isWinner ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {isWinner ? "+" : ""}{fmtPos(item.change)}
            </span>
          </td>
        </tr>

        {/* Expandierte Maßnahmen-Zeile */}
        {isExpanded && hasSuggestion && (
          <tr>
            <td colSpan={3} className="px-3 py-0">
              <div className="bg-gray-800/50 rounded-xl p-4 mb-2 border border-gray-700/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${isWinner ? "text-green-400" : "text-amber-400"}`} />
                    <p className="text-xs font-bold text-white">
                      {isWinner ? "Gewinner-Strategie" : "Rettungsmaßnahmen"} f&uuml;r &bdquo;{item.keyword}&ldquo;
                    </p>
                  </div>
                  <button
                    onClick={() => copyText(suggestions[item.keyword], item.keyword)}
                    className="p-1 rounded hover:bg-gray-700 transition-colors"
                    title="Kopieren"
                  >
                    {copied === item.keyword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                  </button>
                </div>
                <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {suggestions[item.keyword]}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-700/50">
                  {isWinner ? (
                    <>
                      <Link href={`/admin/seo/outreach/?keyword=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-green-900/30 hover:bg-green-900/50 text-green-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <ExternalLink className="w-3 h-3" /> Backlinks aufbauen
                      </Link>
                      <Link href={`/admin/seo/?q=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-teal-900/30 hover:bg-teal-900/50 text-teal-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <FileText className="w-3 h-3" /> Content ausbauen
                      </Link>
                      <a href={`https://www.google.de/search?q=site:urlaubfinder365.de+${encodeURIComponent(item.keyword)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <Search className="w-3 h-3" /> Unsere Seiten f&uuml;r dieses KW
                      </a>
                    </>
                  ) : (
                    <>
                      <Link href={`/admin/seo/?q=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <Sparkles className="w-3 h-3" /> SEO-Texte optimieren
                      </Link>
                      <Link href={`/admin/seo/konkurrenz/?q=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <ShieldAlert className="w-3 h-3" /> Konkurrenz pr&uuml;fen
                      </Link>
                      <Link href={`/admin/seo/links/?q=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <ExternalLink className="w-3 h-3" /> Interne Links pr&uuml;fen
                      </Link>
                      <Link href={`/admin/seo/outreach/?keyword=${encodeURIComponent(item.keyword)}`}
                        className="flex items-center gap-1.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors">
                        <ExternalLink className="w-3 h-3" /> Backlinks aufbauen
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Zeitraum-Info + Maßnahmen-Banner */}
      {period && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Aktuell:</span>
            <span className="text-white font-semibold">{period.current}</span>
            <span className="text-gray-600">({period.days} Tage)</span>
          </div>
          <span className="text-gray-700">vs.</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Vorher:</span>
            <span className="text-white font-semibold">{period.previous}</span>
            <span className="text-gray-600">({period.days} Tage)</span>
          </div>
        </div>
      )}

      <div className="bg-teal-900/20 border border-teal-800/40 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-teal-300 font-semibold">KI-gest&uuml;tzte Ma&szlig;nahmen</p>
          <p className="text-xs text-teal-400/70 mt-1">
            Klicke auf das &#10024;-Icon bei einem Keyword um konkrete Ma&szlig;nahmen zu generieren &mdash; f&uuml;r Gewinner (ausbauen, Backlinks) und Verlierer (retten, optimieren).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Winners */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-400 font-bold">Gewinner</p>
            </div>
            <span className="text-[10px] text-gray-500">{winners.length} Keywords</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-3 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Keyword</th>
                  <th className="text-right px-2 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Position</th>
                  <th className="text-right px-2 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {winners.map((w) => <KwRow key={w.keyword} item={w} type="winner" />)}
                {winners.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-8 text-center text-gray-500">Keine Gewinner</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Losers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400 font-bold">Verlierer</p>
            </div>
            <span className="text-[10px] text-gray-500">{losers.length} Keywords</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-3 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Keyword</th>
                  <th className="text-right px-2 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Position</th>
                  <th className="text-right px-2 py-3 text-[10px] text-gray-500 uppercase tracking-widest">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {losers.map((l) => <KwRow key={l.keyword} item={l} type="loser" />)}
                {losers.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-8 text-center text-gray-500">Keine Verlierer</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
