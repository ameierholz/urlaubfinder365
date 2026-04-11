"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BarChart2, ChevronRight, Search, Loader2, ExternalLink,
  Lightbulb, FileSearch, Target, TrendingUp, Zap, RefreshCw,
  ChevronDown, ChevronUp, Shield, Globe, Link2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Competitor { name: string; url: string; strengths: string[] }
interface KeywordResult {
  competitors: Competitor[];
  recommendations: string[];
  contentGaps: string[];
  suggestedTitle: string;
  suggestedH1: string;
}
interface UrlResult {
  mode: "url";
  domain: string;
  kategorie: string;
  staerken: string[];
  schwaechen: string[];
  seoTaktiken: string[];
  contentBereiche: string[];
  zielgruppe: string;
  monetarisierung: string[];
  chancenFuerUns: string[];
  empfehlungen: string[];
}

interface OverviewResult {
  mode: "overview";
  marktposition: string;
  hauptkonkurrenten: Array<{ name: string; url: string; staerken: string[]; schwaeche: string }>;
  topKeywords: Array<{ keyword: string; schwierigkeit: "hoch" | "mittel" | "niedrig"; potenzial: "hoch" | "mittel" | "niedrig"; monatlicheSuchen: string }>;
  sofortmassnahmen: string[];
  contentLuecken: string[];
  wettbewerbsvorteile: string[];
}

// ── Quick-Keyword Chips ────────────────────────────────────────────────────
const QUICK_KEYWORDS = [
  "günstig Urlaub buchen", "Last Minute Urlaub", "All Inclusive Urlaub",
  "Pauschalreisen", "Urlaub Türkei", "Urlaub Mallorca", "Familienurlaub",
  "Last Minute Ägypten", "Strandurlaub", "Städtereisen günstig",
  "Kreuzfahrten", "Mietwagen Urlaub",
];

// ── Helpers ────────────────────────────────────────────────────────────────
const DIFF_COLOR = { hoch: "text-red-400 bg-red-900/30 border-red-800", mittel: "text-yellow-400 bg-yellow-900/30 border-yellow-800", niedrig: "text-green-400 bg-green-900/30 border-green-800" };
const POT_COLOR  = { hoch: "text-emerald-400", mittel: "text-yellow-400", niedrig: "text-gray-400" };

// ── Component ──────────────────────────────────────────────────────────────
export default function KonkurrenzPage() {
  const [keyword, setKeyword]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [overviewLoading, setOvLoad]    = useState(true);
  const [kwResult, setKwResult]         = useState<KeywordResult | null>(null);
  const [overview, setOverview]         = useState<OverviewResult | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [ovError, setOvError]           = useState<string | null>(null);
  const [showAllKw, setShowAllKw]       = useState(false);
  const [expandedComp, setExpandedComp] = useState<number | null>(null);
  // URL analysis state
  const [urlInput, setUrlInput]         = useState("");
  const [urlLoading, setUrlLoading]     = useState(false);
  const [urlResult, setUrlResult]       = useState<UrlResult | null>(null);
  const [urlError, setUrlError]         = useState<string | null>(null);

  // Auto-load overview on mount
  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setOvLoad(true);
    setOvError(null);
    try {
      const res  = await fetch("/api/admin/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "overview" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setOvError(data.error ?? "Fehler"); return; }
      setOverview(data as OverviewResult);
    } catch (e) { setOvError(String(e)); }
    finally { setOvLoad(false); }
  }

  async function analyzeKeyword(kw?: string) {
    const q = (kw ?? keyword).trim();
    if (!q) return;
    if (kw) setKeyword(kw);
    setLoading(true);
    setError(null);
    setKwResult(null);
    try {
      const res  = await fetch("/api/admin/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: q }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error ?? "Unbekannter Fehler"); return; }
      setKwResult(data as KeywordResult);
      // Scroll to results
      setTimeout(() => document.getElementById("kw-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }

  async function analyzeUrl() {
    const u = urlInput.trim();
    if (!u) return;
    setUrlLoading(true);
    setUrlError(null);
    setUrlResult(null);
    try {
      const res = await fetch("/api/admin/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "url", url: u }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setUrlError(data.error ?? "Unbekannter Fehler"); return; }
      setUrlResult(data as UrlResult);
      setTimeout(() => document.getElementById("url-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) { setUrlError(String(e)); }
    finally { setUrlLoading(false); }
  }

  const displayedKw = showAllKw ? overview?.topKeywords : overview?.topKeywords?.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/admin/dashboard/" className="hover:text-gray-300">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo/" className="hover:text-gray-300">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Konkurrenz-Analyse</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <BarChart2 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Konkurrenz-Analyse</h1>
            <p className="text-sm text-gray-500">KI-Marktübersicht + Keyword-Analyse für urlaubfinder365.de</p>
          </div>
        </div>
      </div>

      {/* ── MARKT-ÜBERSICHT (auto-loaded) ──────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Markt-Übersicht
          </h2>
          <button onClick={loadOverview} disabled={overviewLoading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw className={`w-3.5 h-3.5 ${overviewLoading ? "animate-spin" : ""}`} />
            Neu laden
          </button>
        </div>

        {overviewLoading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            <span className="text-sm">KI analysiert den deutschen Reisemarkt…</span>
          </div>
        )}

        {ovError && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 text-sm">
            Fehler: {ovError}
          </div>
        )}

        {overview && !overviewLoading && (
          <div className="space-y-5">

            {/* Marktposition */}
            <div className="bg-gray-900 border border-teal-800/40 rounded-2xl p-5">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Aktuelle Marktposition</p>
              <p className="text-sm text-gray-300 leading-relaxed">{overview.marktposition}</p>
            </div>

            {/* 3 Karten: Sofortmaßnahmen / Content-Lücken / Wettbewerbsvorteile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-orange-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Sofort-Maßnahmen
                </p>
                <ol className="space-y-2">
                  {overview.sofortmassnahmen.map((m, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-orange-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>{m}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-gray-900 border border-purple-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5" /> Content-Lücken
                </p>
                <ul className="space-y-2">
                  {overview.contentLuecken.map((l, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 shrink-0 mt-0.5">•</span>{l}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-900 border border-green-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Unsere Stärken
                </p>
                <ul className="space-y-2">
                  {overview.wettbewerbsvorteile.map((v, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 shrink-0 mt-0.5">✓</span>{v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top-Keywords */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  Top-Keywords für den deutschen Reisemarkt
                </h3>
                <span className="text-xs text-gray-500">{overview.topKeywords.length} Keywords</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Keyword</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Schwierigkeit</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Potenzial</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suchanfragen/Mo</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(displayedKw ?? []).map((kw, i) => (
                      <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-2.5 font-medium text-white text-sm">{kw.keyword}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFF_COLOR[kw.schwierigkeit]}`}>
                            {kw.schwierigkeit}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-bold ${POT_COLOR[kw.potenzial]}`}>
                            {kw.potenzial === "hoch" ? "▲ hoch" : kw.potenzial === "mittel" ? "→ mittel" : "▽ niedrig"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-400">{kw.monatlicheSuchen}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button onClick={() => analyzeKeyword(kw.keyword)}
                            className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors whitespace-nowrap">
                            Analysieren →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(overview.topKeywords.length > 8) && (
                <button onClick={() => setShowAllKw(v => !v)}
                  className="w-full py-3 text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 border-t border-gray-800">
                  {showAllKw ? <><ChevronUp className="w-3.5 h-3.5" /> Weniger anzeigen</> : <><ChevronDown className="w-3.5 h-3.5" /> Alle {overview.topKeywords.length} Keywords anzeigen</>}
                </button>
              )}
            </div>

            {/* Hauptkonkurrenten */}
            <div>
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-red-400" /> Hauptkonkurrenten
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {overview.hauptkonkurrenten.map((c, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedComp(expandedComp === i ? null : i)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-white">{c.name}</p>
                        <a href={c.url} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-0.5"
                          onClick={e => e.stopPropagation()}>
                          {c.url.replace(/^https?:\/\//, "").split("/")[0]}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      {expandedComp === i ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                    </button>
                    {expandedComp === i && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-800">
                        <div className="pt-3">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stärken</p>
                          <ul className="space-y-1">
                            {c.staerken.map((s, j) => (
                              <li key={j} className="text-xs text-gray-300 flex items-start gap-1.5">
                                <span className="text-red-400 shrink-0">•</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2">
                          <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Unsere Chance</p>
                          <p className="text-xs text-green-300">{c.schwaeche}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── URL-ANALYSE ────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          Konkurrenz-URL analysieren
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            URL eines Wettbewerbers eingeben
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="url" value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !urlLoading && analyzeUrl()}
                placeholder="z.B. https://www.check24.de oder https://www.tui.com/de"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>
            <button onClick={analyzeUrl} disabled={urlLoading || !urlInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              {urlLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere…</> : <><Globe className="w-4 h-4" /> Analysieren</>}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["https://www.check24.de", "https://www.tui.com/de", "https://www.holidaycheck.de", "https://www.ab-in-den-urlaub.de", "https://www.lastminute.de"].map(u => (
              <button key={u} onClick={() => setUrlInput(u)}
                className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-[11px] text-gray-400 hover:text-white transition-all">
                {u.replace(/^https?:\/\/www\./, "")}
              </button>
            ))}
          </div>
        </div>

        {urlError && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 text-sm">
            Fehler: {urlError}
          </div>
        )}

        {urlLoading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="text-sm">KI analysiert {urlInput}…</span>
          </div>
        )}

        {urlResult && !urlLoading && (
          <div id="url-result" className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-white text-lg">{urlResult.domain}</h3>
              <span className="text-xs text-purple-300 bg-purple-900/30 border border-purple-800/50 px-2.5 py-1 rounded-full">{urlResult.kategorie}</span>
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-gray-500">Zielgruppe:</span> {urlResult.zielgruppe}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stärken */}
              <div className="bg-gray-900 border border-red-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Stärken
                </p>
                <ul className="space-y-1.5">
                  {urlResult.staerken.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schwächen */}
              <div className="bg-gray-900 border border-green-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Schwächen (unsere Chancen)
                </p>
                <ul className="space-y-1.5">
                  {urlResult.schwaechen.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-green-400 shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* SEO-Taktiken */}
              <div className="bg-gray-900 border border-teal-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> SEO-Taktiken
                </p>
                <ul className="space-y-1.5">
                  {urlResult.seoTaktiken.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-teal-400 shrink-0">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content-Bereiche */}
              <div className="bg-gray-900 border border-blue-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5" /> Content-Bereiche
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {urlResult.contentBereiche.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-900/20 border border-blue-800/40 rounded-lg text-[11px] text-blue-300">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Monetarisierung */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Monetarisierung</p>
              <div className="flex flex-wrap gap-2">
                {urlResult.monetarisierung.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-900/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">{m}</span>
                ))}
              </div>
            </div>

            {/* Empfehlungen */}
            <div className="bg-gray-900 border border-yellow-800/30 rounded-xl p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Was wir von {urlResult.domain} lernen können
              </h4>
              <ol className="space-y-2">
                {urlResult.empfehlungen.map((r, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>{r}
                  </li>
                ))}
              </ol>
            </div>

            {/* Direkte Chancen */}
            <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-5">
              <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Konkrete Chancen für urlaubfinder365.de
              </h4>
              <ul className="space-y-2">
                {urlResult.chancenFuerUns.map((c, i) => (
                  <li key={i} className="text-sm text-green-300 flex items-start gap-2">
                    <span className="text-green-500 shrink-0 mt-0.5">▲</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ── KEYWORD-ANALYSE ────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-400" />
          Keyword-Analyse
        </h2>

        {/* Quick Keywords */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Schnellauswahl:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_KEYWORDS.map((kw) => (
              <button key={kw} onClick={() => analyzeKeyword(kw)}
                disabled={loading}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-teal-600 rounded-lg text-xs text-gray-300 hover:text-white transition-all disabled:opacity-40">
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Eigenes Keyword analysieren
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && analyzeKeyword()}
                placeholder="z.B. Last Minute Türkei günstig, Familienurlaub Spanien…"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
            <button onClick={() => analyzeKeyword()} disabled={loading || !keyword.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00838F] hover:bg-[#006b75] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere…</> : <><BarChart2 className="w-4 h-4" /> Analysieren</>}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 text-sm">
            Fehler: {error}
          </div>
        )}

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            <span className="text-sm">KI analysiert Wettbewerb für „{keyword}"…</span>
          </div>
        )}

        {/* Keyword Result */}
        {kwResult && !loading && (
          <div id="kw-result" className="space-y-5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">Ergebnis für „{keyword}"</h3>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">Keyword-Analyse</span>
            </div>

            {/* Title + H1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-teal-800/50 rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Vorgeschlagener Meta-Title</p>
                <p className="text-sm text-white">{kwResult.suggestedTitle}</p>
                <p className="text-[10px] text-gray-500 mt-1">{kwResult.suggestedTitle.length} Zeichen</p>
              </div>
              <div className="bg-gray-900 border border-teal-800/50 rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Vorgeschlagene H1</p>
                <p className="text-sm text-white">{kwResult.suggestedH1}</p>
              </div>
            </div>

            {/* Competitors */}
            {kwResult.competitors.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" /> Top-Wettbewerber für dieses Keyword
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {kwResult.competitors.map((c, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white">{c.name}</p>
                          <a href={c.url} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-0.5">
                            {c.url.replace(/^https?:\/\//, "").split("/")[0]}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <span className="text-xs font-bold text-gray-600 bg-gray-800 rounded-lg px-2 py-0.5">#{i + 1}</span>
                      </div>
                      <ul className="space-y-1">
                        {c.strengths.map((s, j) => (
                          <li key={j} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                            <span className="text-teal-500 mt-0.5 shrink-0">•</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {kwResult.recommendations.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> Empfehlungen für urlaubfinder365.de
                </h4>
                <ol className="space-y-2">
                  {kwResult.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-400 font-bold shrink-0">{i + 1}.</span>{r}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Content Gaps */}
            {kwResult.contentGaps.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-orange-400" /> Content-Lücken
                </h4>
                <div className="flex flex-wrap gap-2">
                  {kwResult.contentGaps.map((g, i) => (
                    <span key={i} className="px-3 py-1.5 bg-orange-900/20 border border-orange-800/50 rounded-lg text-xs text-orange-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
