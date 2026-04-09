"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp, TrendingDown, Eye, MousePointerClick, Target, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

interface DailyData { date: string; clicks: number; impressions: number; ctr: number; position: number }
interface KeywordData { keyword: string; clicks: number; impressions: number; ctr: number; position: number }
interface PageData { page: string; clicks: number; impressions: number; ctr: number; position: number }
interface TrendingData { keyword: string; impressions: number; prevImpressions: number; growth: number; position: number }

export default function SeoPerformancePage() {
  const [days, setDays] = useState(28);
  const [tab, setTab] = useState<"overview" | "keywords" | "pages" | "trending">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<{ totals: { clicks: number; impressions: number; ctr: number; position: number }; prevTotals: { clicks: number; impressions: number }; daily: DailyData[] } | null>(null);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [trending, setTrending] = useState<TrendingData[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/search-console?type=${tab}&days=${days}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        if (tab === "overview") setOverview(data);
        if (tab === "keywords") setKeywords(data.keywords ?? []);
        if (tab === "pages") setPages(data.pages ?? []);
        if (tab === "trending") setTrending(data.trending ?? []);
      })
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
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("overview")} className={tabCls("overview")}>Übersicht</button>
        <button onClick={() => setTab("keywords")} className={tabCls("keywords")}>Keywords</button>
        <button onClick={() => setTab("pages")} className={tabCls("pages")}>Seiten</button>
        <button onClick={() => setTab("trending")} className={tabCls("trending")}>Trending</button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 mb-6 text-sm text-red-300">
          {error.includes("GOOGLE_SERVICE_ACCOUNT_KEY") ? (
            <div>
              <p className="font-bold mb-2">Google Search Console API nicht verbunden</p>
              <p className="text-red-400 text-xs">
                1. Gehe zu <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a><br/>
                2. Erstelle ein Projekt + aktiviere "Search Console API"<br/>
                3. Erstelle einen Service Account + lade JSON-Key herunter<br/>
                4. Füge die Service-Account-Email als Nutzer in der <a href="https://search.google.com/search-console" target="_blank" className="underline">Search Console</a> hinzu<br/>
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

          {/* Daily Chart (simple bar representation) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
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
                    <a href={`https://www.urlaubfinder365.de${p.page}`} target="_blank" className="text-teal-400 hover:text-teal-300 font-mono text-xs">{p.page}</a>
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
    </div>
  );
}
