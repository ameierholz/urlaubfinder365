"use client";

import { useState, useEffect } from "react";
import { Link2, AlertTriangle, CheckCircle, XCircle, Play, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface PageItem { path: string; title: string | null; inDb: boolean }
interface PageResult {
  path: string; wordCount: number; internalLinks: number; score: number; error?: string;
}

const CONCURRENCY = 5;

function getInternalLinks(checks: { label: string; detail: string }[]): number {
  const c = checks.find((c) => c.label === "Interne Verlinkung (mind. 3)");
  const m = c?.detail.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function LinkStatus({ count }: { count: number }) {
  if (count >= 5) return <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3.5 h-3.5" /> {count}</span>;
  if (count >= 3) return <span className="flex items-center gap-1 text-yellow-400 text-xs"><AlertTriangle className="w-3.5 h-3.5" /> {count}</span>;
  return <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3.5 h-3.5" /> {count}</span>;
}

async function analyzePage(path: string): Promise<PageResult> {
  try {
    const res = await fetch("/api/admin/analyze-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: path }),
    });
    const data = await res.json();
    if (data.error) return { path, wordCount: 0, internalLinks: 0, score: 0, error: data.error };
    return { path, wordCount: data.wordCount ?? 0, internalLinks: getInternalLinks(data.checks ?? []), score: data.score ?? 0 };
  } catch (err) {
    return { path, wordCount: 0, internalLinks: 0, score: 0, error: String(err) };
  }
}

async function runConcurrent(
  items: string[],
  onResult: (r: PageResult, done: number) => void
): Promise<void> {
  let idx = 0;
  let done = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const result = await analyzePage(items[i]);
      done++;
      onResult(result, done);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

type ScanMode = "quick" | "full" | "destinations";

export default function LinkAudit() {
  const [allPages, setAllPages]     = useState<PageItem[]>([]);
  const [allDests, setAllDests]     = useState<PageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [results, setResults]       = useState<PageResult[]>([]);
  const [running, setRunning]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [total, setTotal]           = useState(0);
  const [mode, setMode]             = useState<ScanMode>("quick");
  const [showAll, setShowAll]       = useState(false);

  useEffect(() => {
    fetch("/api/admin/page-list?include=destinations")
      .then(r => r.json())
      .then(data => {
        setAllPages(data.pages ?? []);
        setAllDests(data.destinations ?? []);
      })
      .finally(() => setLoadingPages(false));
  }, []);

  const startAudit = async () => {
    let paths: string[];
    if (mode === "quick")        paths = allPages.slice(0, 25).map(p => p.path);
    else if (mode === "full")    paths = allPages.map(p => p.path);
    else                          paths = allDests.slice(0, 50).map(p => p.path);

    setRunning(true);
    setResults([]);
    setProgress(0);
    setTotal(paths.length);
    setShowAll(false);

    const collected: PageResult[] = [];
    await runConcurrent(paths, (result, done) => {
      collected.push(result);
      setProgress(done);
      setResults([...collected]);
    });

    setRunning(false);
  };

  const sorted = [...results].sort((a, b) => {
    if (a.error && !b.error) return 1;
    if (!a.error && b.error) return -1;
    return a.internalLinks - b.internalLinks;
  });

  const needsMore    = results.filter(r => !r.error && r.internalLinks < 5);
  const critical     = results.filter(r => !r.error && r.internalLinks < 3);
  const displayedRows = showAll ? sorted : sorted.slice(0, 30);

  const MODES: { id: ScanMode; label: string; count: string; desc: string }[] = [
    { id: "quick",        label: "Quick",        count: `${Math.min(25, allPages.length)} Seiten`,  desc: "Top-Seiten aus DB" },
    { id: "full",         label: "Alle Pages",   count: `${allPages.length} Seiten`,                desc: "Alle DB-Seiten" },
    { id: "destinations", label: "Destinations", count: `${Math.min(50, allDests.length)} Seiten`,  desc: "Top-50 Reiseziele" },
  ];

  return (
    <div className="space-y-6">
      {/* Modus-Auswahl */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scan-Umfang</p>
        <div className="flex flex-wrap gap-3">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              disabled={running || loadingPages}
              className={`px-4 py-3 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? "bg-[#00838F]/20 border-[#00838F] text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              } disabled:opacity-40`}>
              <p className="text-sm font-bold">{m.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{loadingPages ? "Lädt…" : m.count} · {m.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={startAudit} disabled={running || loadingPages || allPages.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00838F] hover:bg-[#006b75] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
            {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere…</> : <><Play className="w-4 h-4" /> Audit starten</>}
          </button>
          {running && (
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00838F] transition-all duration-200"
                  style={{ width: `${total > 0 ? Math.round((progress / total) * 100) : 0}%` }} />
              </div>
              <span className="text-sm text-gray-400 whitespace-nowrap">{progress}/{total}</span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-gray-600">
          {CONCURRENCY} parallele Verbindungen · Live-Ergebnisse während des Scans
        </p>
      </div>

      {/* Zusammenfassung */}
      {results.length > 0 && !running && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Analysiert",      value: results.length,                                                color: "text-white" },
            { label: "Kritisch (<3)",   value: critical.length,                                               color: critical.length > 0 ? "text-red-400" : "text-green-400" },
            { label: "Verbesserbar",    value: needsMore.length - critical.length,                            color: needsMore.length > critical.length ? "text-yellow-400" : "text-green-400" },
            { label: "OK (≥5 Links)",   value: results.filter(r => !r.error && r.internalLinks >= 5).length, color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Live-Tabelle */}
      {(results.length > 0 || running) && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4 text-teal-400" />
              Ergebnisse
              {running && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />}
            </h2>
            <span className="text-xs text-gray-500">{results.length} von {total}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Seite</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wörter</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Int. Links</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">SEO</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((r) => (
                  <tr key={r.path} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${r.internalLinks < 3 && !r.error ? "bg-red-900/10" : ""}`}>
                    <td className="px-4 py-2.5 font-mono text-gray-300 text-xs max-w-xs truncate">
                      {r.path}
                      {r.error && <span className="ml-2 text-red-400 text-[10px]">(Fehler)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-gray-400">
                      {r.error ? "—" : r.wordCount.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {r.error ? <span className="text-gray-600">—</span> : <LinkStatus count={r.internalLinks} />}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs">
                      {r.error ? <span className="text-gray-600">—</span> : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          r.score >= 70 ? "text-green-400 bg-green-900/30 border-green-800"
                          : r.score >= 40 ? "text-yellow-400 bg-yellow-900/30 border-yellow-800"
                          : "text-red-400 bg-red-900/30 border-red-800"
                        }`}>{r.score}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sorted.length > 30 && (
            <button onClick={() => setShowAll(v => !v)}
              className="w-full py-3 text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 border-t border-gray-800">
              {showAll
                ? <><ChevronUp className="w-3.5 h-3.5" /> Weniger anzeigen</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Alle {sorted.length} Ergebnisse anzeigen</>}
            </button>
          )}
        </div>
      )}

      {/* Empfehlungen */}
      {needsMore.length > 0 && !running && (
        <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" /> {needsMore.length} Seiten brauchen mehr interne Links
          </div>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto">
            {needsMore.slice(0, 20).map((r) => (
              <li key={r.path} className="text-xs text-gray-300 flex items-start gap-2">
                <span className={r.internalLinks < 3 ? "text-red-400 shrink-0" : "text-yellow-500 shrink-0"}>•</span>
                <span>
                  <span className="font-mono">{r.path}</span>
                  {" — "}{r.internalLinks < 3
                    ? `nur ${r.internalLinks} Links (kritisch, Ziel: ≥5)`
                    : `${r.internalLinks} Links (${5 - r.internalLinks} weitere empfohlen)`}
                </span>
              </li>
            ))}
            {needsMore.length > 20 && <li className="text-xs text-gray-500">… und {needsMore.length - 20} weitere</li>}
          </ul>
        </div>
      )}

      {needsMore.length === 0 && results.length > 0 && !running && (
        <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 flex items-center gap-2 text-green-400 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> Alle analysierten Seiten haben ausreichende interne Verlinkung (≥ 5 Links).
        </div>
      )}
    </div>
  );
}
