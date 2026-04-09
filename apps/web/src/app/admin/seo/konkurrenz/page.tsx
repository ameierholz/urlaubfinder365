"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart2, ChevronRight, Search, Loader2, ExternalLink, Lightbulb, FileSearch, Target } from "lucide-react";

interface Competitor {
  name: string;
  url: string;
  strengths: string[];
}

interface AnalysisResult {
  competitors: Competitor[];
  recommendations: string[];
  contentGaps: string[];
  suggestedTitle: string;
  suggestedH1: string;
}

export default function KonkurrenzPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Unbekannter Fehler");
      } else {
        setResult(data as AnalysisResult);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard/" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo/" className="hover:text-gray-300 transition-colors">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Konkurrenz-Analyse</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <BarChart2 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Konkurrenz-Analyse</h1>
            <p className="text-sm text-gray-500">KI-gestützte Wettbewerbsanalyse für beliebige Keywords</p>
          </div>
        </div>
        <Link href="/admin/seo/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Zurück zu SEO
        </Link>
      </div>

      {/* Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Keyword eingeben
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && analyze()}
              placeholder="z.B. günstig Urlaub buchen, Last Minute Türkei..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>
          <button
            onClick={analyze}
            disabled={loading || !keyword.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00838F] hover:bg-[#006b75] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere...</>
            ) : (
              <><BarChart2 className="w-4 h-4" /> Analysieren</>
            )}
          </button>
        </div>
        <p className="text-[11px] text-gray-600 mt-2">
          Claude Haiku analysiert den deutschen Suchmarkt und gibt Empfehlungen für urlaubfinder365.de.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 text-sm mb-6">
          Fehler: {error}
        </div>
      )}

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
          <span className="text-sm">KI analysiert den Wettbewerb für „{keyword}"...</span>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Suggested Title & H1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-teal-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Vorgeschlagener Meta-Title</p>
              <p className="text-sm text-white">{result.suggestedTitle}</p>
            </div>
            <div className="bg-gray-900 border border-teal-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Vorgeschlagene H1</p>
              <p className="text-sm text-white">{result.suggestedH1}</p>
            </div>
          </div>

          {/* Competitors */}
          {result.competitors.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" />
                Top-Wettbewerber
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.competitors.map((c, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-white">{c.name}</p>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 mt-0.5"
                        >
                          {c.url.replace(/^https?:\/\//, "").split("/")[0]}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <span className="text-xs font-bold text-gray-600 bg-gray-800 rounded-lg px-2 py-0.5">#{i + 1}</span>
                    </div>
                    <ul className="space-y-1">
                      {c.strengths.map((s, j) => (
                        <li key={j} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                          <span className="text-teal-500 mt-0.5 shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Empfehlungen für urlaubfinder365.de
              </h2>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400 font-bold shrink-0">{i + 1}.</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Gaps */}
          {result.contentGaps.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-orange-400" />
                Content-Lücken
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.contentGaps.map((g, i) => (
                  <span key={i} className="px-3 py-1.5 bg-orange-900/20 border border-orange-800/50 rounded-lg text-xs text-orange-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
