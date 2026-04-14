"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, Loader2, Zap } from "lucide-react";

interface TrendingData { keyword: string; impressions: number; prevImpressions: number; growth: number; position: number }
interface TrendingAction { keyword: string; matchedPage: string | null; action: string; priority: "hoch" | "mittel" | "niedrig" }

export default function TrendingTab({ trending, fmtNum, fmtPos }: {
  trending: TrendingData[];
  fmtNum: (n: number) => string;
  fmtPos: (n: number) => string;
}) {
  const [actions, setActions] = useState<TrendingAction[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeAll = async () => {
    if (trending.length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/trending-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: trending.map((t) => ({ keyword: t.keyword, position: t.position, impressions: t.impressions, growth: t.growth })) }),
      });
      const data = await res.json();
      if (data.actions) { setActions(data.actions); setAnalyzed(true); }
    } catch { /* ignore */ }
    setAnalyzing(false);
  };

  const actionMap = new Map(actions.map((a) => [a.keyword, a]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 font-semibold">Trending Keywords — stärkstes Wachstum (7 vs. 7 Tage)</p>
          <p className="text-xs text-gray-500 mt-1">Keywords mit steigenden Impressionen. Nutze sie aktiv, um Rankings zu verbessern.</p>
        </div>
        {trending.length > 0 && (
          <button onClick={analyzeAll} disabled={analyzing}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? "Analysiert..." : analyzed ? "Erneut analysieren" : "KI-Empfehlungen generieren"}
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Keyword</th>
              <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Impressionen</th>
              <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Vorher</th>
              <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Wachstum</th>
              <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Position</th>
              {analyzed && <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Passende Seite</th>}
              {analyzed && <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Empfehlung</th>}
              {analyzed && <th className="text-center px-4 py-3 text-xs text-gray-500 uppercase">Prio</th>}
            </tr>
          </thead>
          <tbody>
            {trending.map((t) => {
              const action = actionMap.get(t.keyword);
              return (
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
                  {analyzed && (
                    <td className="px-4 py-2.5 text-xs">
                      {action?.matchedPage ? (
                        <Link href={`/admin/seo/${encodeURIComponent(action.matchedPage)}`} className="text-teal-400 hover:text-teal-300 font-mono">
                          {action.matchedPage}
                        </Link>
                      ) : <span className="text-orange-400">Neue Seite nötig</span>}
                    </td>
                  )}
                  {analyzed && <td className="px-4 py-2.5 text-xs text-gray-400 max-w-xs">{action?.action || "—"}</td>}
                  {analyzed && (
                    <td className="px-4 py-2.5 text-center">
                      {action && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          action.priority === "hoch" ? "bg-red-900/40 text-red-400 border border-red-800" :
                          action.priority === "mittel" ? "bg-yellow-900/40 text-yellow-400 border border-yellow-800" :
                          "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}>{action.priority}</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {trending.length === 0 && (
              <tr><td colSpan={analyzed ? 8 : 5} className="px-4 py-8 text-center text-gray-500">
                Keine Trending-Daten. Daten erscheinen nach einigen Tagen Indexierung.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {analyzed && actions.length > 0 && (
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">Zusammenfassung</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-black text-red-400">{actions.filter((a) => a.priority === "hoch").length}</p>
              <p className="text-xs text-gray-500">Hohe Priorität</p>
            </div>
            <div>
              <p className="text-xl font-black text-yellow-400">{actions.filter((a) => a.priority === "mittel").length}</p>
              <p className="text-xs text-gray-500">Mittlere Priorität</p>
            </div>
            <div>
              <p className="text-xl font-black text-green-400">{actions.filter((a) => a.matchedPage).length}</p>
              <p className="text-xs text-gray-500">Bereits mit Seite</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
