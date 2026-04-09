"use client";

import { useState } from "react";
import { Link2, AlertTriangle, CheckCircle, XCircle, Play, Loader2 } from "lucide-react";

const AUDIT_PAGES = [
  "/",
  "/guenstig-urlaub-buchen",
  "/last-minute",
  "/hotelsuche",
  "/flugsuche",
  "/kreuzfahrten",
  "/urlaubsguides",
  "/reisewarnungen",
  "/magazin",
  "/aktivitaeten",
];

interface PageResult {
  path: string;
  wordCount: number;
  internalLinks: number;
  score: number;
  error?: string;
}

function getInternalLinks(checks: { label: string; detail: string }[]): number {
  const linkCheck = checks.find((c) => c.label === "Interne Verlinkung (mind. 3)");
  if (!linkCheck) return 0;
  const match = linkCheck.detail.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function LinkStatus({ count }: { count: number }) {
  if (count >= 5)
    return <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3.5 h-3.5" /> {count} Links</span>;
  if (count >= 3)
    return <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle className="w-3.5 h-3.5" /> {count} Links</span>;
  return <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3.5 h-3.5" /> {count} Links</span>;
}

export default function LinkAudit() {
  const [results, setResults] = useState<PageResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startAudit = async () => {
    setRunning(true);
    setResults([]);
    setProgress(0);

    const collected: PageResult[] = [];

    for (let i = 0; i < AUDIT_PAGES.length; i++) {
      const path = AUDIT_PAGES[i];
      try {
        const res = await fetch("/api/admin/analyze-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pagePath: path }),
        });
        const data = await res.json();
        if (data.error) {
          collected.push({ path, wordCount: 0, internalLinks: 0, score: 0, error: data.error });
        } else {
          const internalLinks = getInternalLinks(data.checks ?? []);
          collected.push({
            path,
            wordCount: data.wordCount ?? 0,
            internalLinks,
            score: data.score ?? 0,
          });
        }
      } catch (err) {
        collected.push({ path, wordCount: 0, internalLinks: 0, score: 0, error: String(err) });
      }
      setProgress(i + 1);
      setResults([...collected]);
    }

    setRunning(false);
  };

  const sorted = [...results].sort((a, b) => {
    if (a.error && !b.error) return 1;
    if (!a.error && b.error) return -1;
    return a.internalLinks - b.internalLinks;
  });

  const needsMore = results.filter((r) => !r.error && r.internalLinks < 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={startAudit}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00838F] hover:bg-[#006b75] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {running ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere...</>
          ) : (
            <><Play className="w-4 h-4" /> Link-Audit starten</>
          )}
        </button>
        {running && (
          <span className="text-sm text-gray-400">
            {progress}/{AUDIT_PAGES.length} analysiert...
          </span>
        )}
      </div>

      {running && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Fortschritt</span>
            <span>{Math.round((progress / AUDIT_PAGES.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00838F] transition-all duration-300"
              style={{ width: `${(progress / AUDIT_PAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Seite</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wörter</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Interne Links</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SEO-Score</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.path} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-300 text-xs">
                      {r.path}
                      {r.error && <span className="ml-2 text-red-400 text-[10px]">(Fehler: {r.error})</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {r.error ? <span className="text-gray-600">—</span> : r.wordCount.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.error ? <span className="text-gray-600">—</span> : <LinkStatus count={r.internalLinks} />}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.error ? (
                        <span className="text-gray-600">—</span>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          r.score >= 70 ? "text-green-400 bg-green-900/30 border-green-800"
                          : r.score >= 40 ? "text-yellow-400 bg-yellow-900/30 border-yellow-800"
                          : "text-red-400 bg-red-900/30 border-red-800"
                        }`}>
                          {r.score}/100
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {needsMore.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Empfehlungen
              </div>
              <ul className="space-y-1.5">
                {needsMore.map((r) => (
                  <li key={r.path} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>
                      <span className="font-mono text-yellow-300">{r.path}</span>
                      {r.internalLinks < 3
                        ? ` hat nur ${r.internalLinks} interne Links — dringend mehr interne Verlinkungen hinzufügen (Ziel: mind. 5)`
                        : ` hat ${r.internalLinks} interne Links — noch ${5 - r.internalLinks} weitere empfohlen`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {needsMore.length === 0 && results.filter((r) => !r.error).length > 0 && (
            <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 flex items-center gap-2 text-green-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Alle analysierten Seiten haben ausreichende interne Verlinkung (≥ 5 Links).
            </div>
          )}
        </>
      )}
    </div>
  );
}
