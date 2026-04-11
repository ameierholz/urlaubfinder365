"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight, BarChart3, AlertTriangle, CheckCircle, Clock, Target,
  TrendingUp, Zap, FileText, Link2, Search, Globe, Sparkles, Play, Loader2,
  ChevronDown, ChevronUp,
} from "lucide-react";

interface PageItem { path: string; title: string | null; inDb: boolean }
interface PageAnalysis {
  path: string;
  score: number;
  wordCount: number;
  internalLinks: number;
  checks: { label: string; pass: boolean; detail: string }[];
  error?: string;
}
interface ActionItem {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  action: string;
  href?: string;
}

type ScanMode = "quick" | "full" | "destinations";

const CONCURRENCY = 5;
const PRIORITY_CONFIG = {
  critical: { color: "text-red-400",    bg: "bg-red-900/30",    border: "border-red-700",    label: "Kritisch", icon: AlertTriangle },
  high:     { color: "text-orange-400", bg: "bg-orange-900/30", border: "border-orange-700", label: "Hoch",     icon: Zap },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-900/30", border: "border-yellow-700", label: "Mittel",   icon: Clock },
  low:      { color: "text-blue-400",   bg: "bg-blue-900/30",   border: "border-blue-700",   label: "Niedrig",  icon: Target },
};

function getInternalLinks(checks: { label: string; detail: string }[]): number {
  const c = checks.find((c) => c.label === "Interne Verlinkung (mind. 3)");
  const m = c?.detail.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

async function analyzePage(path: string): Promise<PageAnalysis> {
  try {
    const res = await fetch("/api/admin/analyze-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: path }),
    });
    const data = await res.json();
    if (data.error) return { path, score: 0, wordCount: 0, internalLinks: 0, checks: [], error: data.error };
    return {
      path,
      score: data.score ?? 0,
      wordCount: data.wordCount ?? 0,
      internalLinks: getInternalLinks(data.checks ?? []),
      checks: data.checks ?? [],
    };
  } catch (err) {
    return { path, score: 0, wordCount: 0, internalLinks: 0, checks: [], error: String(err) };
  }
}

async function runConcurrent(
  items: string[],
  onResult: (r: PageAnalysis, done: number) => void
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

function buildActionItems(results: PageAnalysis[]): ActionItem[] {
  const items: ActionItem[] = [];
  const ok = results.filter(r => !r.error);

  const lowScore = ok.filter(r => r.score < 60);
  if (lowScore.length > 0)
    items.push({ priority: "critical", category: "On-Page SEO", title: `${lowScore.length} Seiten unter 60% SEO-Score`, description: `Seiten: ${lowScore.slice(0, 5).map(p => p.path).join(", ")}${lowScore.length > 5 ? ` …+${lowScore.length - 5}` : ""}`, action: "Seiten optimieren", href: "/admin/seo/" });

  const thin = ok.filter(r => r.wordCount < 500);
  if (thin.length > 0)
    items.push({ priority: "critical", category: "Content", title: `${thin.length} Seiten mit wenig Text (<500 Wörter)`, description: `Google bevorzugt 1.000+ Wörter. Top-Betroffene: ${thin.slice(0, 3).map(p => `${p.path} (${p.wordCount}W)`).join(", ")}`, action: "SEO-Texte ergänzen", href: "/admin/seo/" });

  const noKwH1 = ok.filter(r => r.checks.some(c => c.label.includes("Keyword in H1") && !c.pass));
  if (noKwH1.length > 0)
    items.push({ priority: "high", category: "On-Page SEO", title: `${noKwH1.length} Seiten: Focus Keyword fehlt in H1`, description: "Das Fokus-Keyword muss in der H1 stehen — wichtigster On-Page-Faktor.", action: "H1 anpassen", href: "/admin/seo/" });

  const fewLinks = ok.filter(r => r.internalLinks < 5);
  if (fewLinks.length > 0)
    items.push({ priority: "high", category: "Verlinkung", title: `${fewLinks.length} Seiten mit zu wenig internen Links (<5)`, description: "Interne Verlinkung verbessert Crawling und Autorität. Ziel: ≥5 Links pro Seite.", action: "Link-Audit", href: "/admin/seo/links/" });

  const badDesc = ok.filter(r => r.checks.some(c => c.label.includes("Description") && !c.pass));
  if (badDesc.length > 0)
    items.push({ priority: "medium", category: "Meta-Tags", title: `${badDesc.length} Seiten: Meta Description nicht optimal`, description: "120–160 Zeichen mit Keyword und Call-to-Action.", action: "Meta optimieren", href: "/admin/seo/" });

  const noSchema = ok.filter(r => r.checks.some(c => c.label.includes("JSON-LD") && !c.pass));
  if (noSchema.length > 0)
    items.push({ priority: "medium", category: "Structured Data", title: `${noSchema.length} Seiten ohne JSON-LD Schema`, description: "Strukturierte Daten erhöhen die Chance auf Rich Snippets.", action: "Schema hinzufügen" });

  items.push({ priority: "high", category: "Content", title: "Magazin-Artikel regelmäßig veröffentlichen", description: "Ziel: 2–3 Artikel/Woche zu Money-Keywords.", action: "Neuer Artikel", href: "/admin/magazin/neu/" });
  items.push({ priority: "high", category: "Konkurrenz", title: "Konkurrenz-Keywords analysieren", description: "Finde Keywords wo Check24/TUI ranken aber wir nicht.", action: "Analyse starten", href: "/admin/seo/konkurrenz/" });
  items.push({ priority: "medium", category: "Technik", title: "Core Web Vitals prüfen", description: "LCP, FID, CLS müssen im grünen Bereich sein.", action: "PageSpeed prüfen", href: "https://pagespeed.web.dev/analysis?url=https://www.urlaubfinder365.de/" });
  items.push({ priority: "medium", category: "Backlinks", title: "Backlink-Strategie aufbauen", description: "Gastbeiträge, Influencer-Koops, Pressemitteilungen zu neuen Features.", action: "Outreach starten" });
  items.push({ priority: "low", category: "KI-Suchmaschinen", title: "Für KI-Suchen optimieren", description: "Klare Fakten, Zahlen, Tabellen — ChatGPT, Perplexity, Claude zitieren strukturierte Inhalte.", action: "Faktenboxen ergänzen" });

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

export default function SeoDashboardPage() {
  const [allPages, setAllPages] = useState<PageItem[]>([]);
  const [allDests, setAllDests] = useState<PageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [mode, setMode] = useState<ScanMode>("quick");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [analyses, setAnalyses] = useState<PageAnalysis[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  useEffect(() => {
    fetch("/api/admin/page-list?include=destinations")
      .then(r => r.json())
      .then(data => {
        setAllPages(data.pages ?? []);
        setAllDests(data.destinations ?? []);
      })
      .finally(() => setLoadingPages(false));
  }, []);

  const runAudit = useCallback(async () => {
    let paths: string[];
    if (mode === "quick")        paths = allPages.slice(0, 25).map(p => p.path);
    else if (mode === "full")    paths = allPages.map(p => p.path);
    else                          paths = allDests.slice(0, 50).map(p => p.path);

    setRunning(true);
    setPhase("running");
    setAnalyses([]);
    setActions([]);
    setProgress(0);
    setTotal(paths.length);
    setShowAll(false);

    const collected: PageAnalysis[] = [];
    await runConcurrent(paths, (result, done) => {
      collected.push(result);
      setProgress(done);
      setAnalyses([...collected]);
    });

    setActions(buildActionItems(collected));
    setRunning(false);
    setPhase("done");
  }, [mode, allPages, allDests]);

  const MODES: { id: ScanMode; label: string; count: string; desc: string }[] = [
    { id: "quick",        label: "Quick",        count: `${Math.min(25, allPages.length)} Seiten`, desc: "Top-Seiten aus DB" },
    { id: "full",         label: "Alle Pages",   count: `${allPages.length} Seiten`,               desc: "Alle DB-Seiten" },
    { id: "destinations", label: "Destinations", count: `${Math.min(50, allDests.length)} Seiten`, desc: "Top-50 Reiseziele" },
  ];

  const ok = analyses.filter(r => !r.error);
  const avgScore = ok.length > 0 ? Math.round(ok.reduce((s, a) => s + a.score, 0) / ok.length) : 0;
  const avgWords = ok.length > 0 ? Math.round(ok.reduce((s, a) => s + a.wordCount, 0) / ok.length) : 0;
  const criticalCount = actions.filter(a => a.priority === "critical").length;
  const highCount     = actions.filter(a => a.priority === "high").length;

  const sorted = [...analyses].sort((a, b) => {
    if (a.error && !b.error) return 1;
    if (!a.error && b.error) return -1;
    return a.score - b.score;
  });
  const displayedRows = showAll ? sorted : sorted.slice(0, 30);

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo" className="hover:text-gray-300">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Command Center</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <Target className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">SEO Command Center</h1>
          <p className="text-sm text-gray-500">Priorisierte Aufgabenliste für Google Top 5</p>
        </div>
      </div>

      {/* Quick-Tools */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { href: "/admin/seo/",         icon: Search,    label: "Meta-Daten",   col: "hover:border-teal-600" },
          { href: "/admin/seo/links/",   icon: Link2,     label: "Link-Audit",   col: "hover:border-teal-600" },
          { href: "/admin/seo/konkurrenz/", icon: TrendingUp, label: "Konkurrenz", col: "hover:border-purple-600" },
          { href: "/admin/destinations/",icon: Globe,     label: "Destinations", col: "hover:border-green-600" },
          { href: "/admin/magazin/neu/", icon: Sparkles,  label: "Neuer Artikel",col: "hover:border-orange-600" },
        ].map(({ href, icon: Icon, label, col }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2 bg-gray-900 border border-gray-800 ${col} rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors`}>
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </div>

      {/* Scan-Konfiguration */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scan-Umfang</p>
        <div className="flex flex-wrap gap-3">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              disabled={running || loadingPages}
              className={`px-4 py-3 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? "bg-teal-900/20 border-teal-700 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              } disabled:opacity-40`}>
              <p className="text-sm font-bold">{m.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{loadingPages ? "Lädt…" : m.count} · {m.desc}</p>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={runAudit} disabled={running || loadingPages || allPages.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
            {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysiere…</> : <><Play className="w-4 h-4" /> Audit starten</>}
          </button>
          {running && (
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 transition-all duration-200"
                  style={{ width: `${total > 0 ? Math.round((progress / total) * 100) : 0}%` }} />
              </div>
              <span className="text-sm text-gray-400 whitespace-nowrap">{progress}/{total}</span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-gray-600">{CONCURRENCY} parallele Verbindungen · Live-Ergebnisse während des Scans</p>
      </div>

      {/* KPIs */}
      {(phase === "running" || phase === "done") && analyses.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { icon: BarChart3,    label: "Ø SEO-Score",    value: `${avgScore}%`,                color: avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400" },
            { icon: FileText,     label: "Ø Wörter",        value: avgWords.toLocaleString("de-DE"), color: avgWords >= 1000 ? "text-green-400" : avgWords >= 500 ? "text-yellow-400" : "text-red-400" },
            { icon: AlertTriangle,label: "Kritisch",        value: criticalCount,                  color: criticalCount > 0 ? "text-red-400" : "text-green-400" },
            { icon: Zap,          label: "Hoch",            value: highCount,                      color: highCount > 0 ? "text-orange-400" : "text-green-400" },
            { icon: CheckCircle,  label: "Seiten geprüft",  value: analyses.length,                color: "text-white" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Items */}
      {actions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Aufgaben für Top 5</h2>
          <p className="text-xs text-gray-500 mb-4">Priorisiert nach Wirkung auf Google-Ranking</p>
          <div className="space-y-3">
            {actions.map((item, i) => {
              const cfg = PRIORITY_CONFIG[item.priority];
              const Icon = cfg.icon;
              return (
                <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${cfg.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{item.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                    {item.href && (
                      <Link href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        className={`shrink-0 text-xs font-semibold ${cfg.color} hover:text-white transition-colors whitespace-nowrap`}>
                        {item.action} →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Seiten-Scores Tabelle */}
      {analyses.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">
            Seiten-Scores im Detail
            {running && <Loader2 className="inline w-4 h-4 ml-2 animate-spin text-teal-400" />}
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Seite</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Score</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Wörter</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Int. Links</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Checks</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((a) => (
                    <tr key={a.path} className={`border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors ${a.score < 40 && !a.error ? "bg-red-900/10" : ""}`}>
                      <td className="px-4 py-2.5 font-mono text-gray-300 text-xs max-w-xs truncate">
                        {a.path}
                        {a.error && <span className="ml-2 text-red-400 text-[10px]">(Fehler)</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {a.error ? <span className="text-gray-600">—</span> : (
                          <span className={`font-bold ${a.score >= 70 ? "text-green-400" : a.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>{a.score}%</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs">
                        {a.error ? <span className="text-gray-600">—</span> : (
                          <span className={a.wordCount >= 800 ? "text-green-400" : a.wordCount >= 400 ? "text-yellow-400" : "text-red-400"}>
                            {a.wordCount.toLocaleString("de-DE")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs">
                        {a.error ? <span className="text-gray-600">—</span> : (
                          <span className={a.internalLinks >= 5 ? "text-green-400" : a.internalLinks >= 3 ? "text-yellow-400" : "text-red-400"}>
                            {a.internalLinks}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs text-gray-400">
                        {a.error ? "—" : `${a.checks.filter(c => c.pass).length}/${a.checks.length}`}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link href={`/admin/seo/${encodeURIComponent(a.path)}`}
                          className="text-teal-400 hover:text-teal-300 text-xs font-semibold whitespace-nowrap">
                          Optimieren →
                        </Link>
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
        </div>
      )}

      {phase === "idle" && !loadingPages && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Target className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Wähle einen Scan-Modus und starte den Audit.</p>
        </div>
      )}
    </div>
  );
}
