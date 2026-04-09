"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BarChart3, AlertTriangle, CheckCircle, Clock, Target, TrendingUp, Zap, FileText, Link2, Search, Globe, Sparkles } from "lucide-react";

interface PageAnalysis {
  path: string;
  score: number;
  wordCount: number;
  checks: { label: string; pass: boolean; detail: string }[];
}

interface SeoMeta {
  page_path: string;
  meta_title: string | null;
  focus_keyword: string | null;
}

interface ActionItem {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  action: string;
  href?: string;
  automated?: boolean;
}

const PRIORITY_CONFIG = {
  critical: { color: "text-red-400", bg: "bg-red-900/30", border: "border-red-700", label: "Kritisch", icon: AlertTriangle },
  high: { color: "text-orange-400", bg: "bg-orange-900/30", border: "border-orange-700", label: "Hoch", icon: Zap },
  medium: { color: "text-yellow-400", bg: "bg-yellow-900/30", border: "border-yellow-700", label: "Mittel", icon: Clock },
  low: { color: "text-blue-400", bg: "bg-blue-900/30", border: "border-blue-700", label: "Niedrig", icon: Target },
};

const KEY_PAGES = [
  "/guenstig-urlaub-buchen", "/last-minute", "/hotelsuche", "/flugsuche",
  "/kreuzfahrten", "/urlaubsarten/all-inclusive-urlaub", "/urlaubsarten/pauschalreisen",
  "/urlaubsthemen/familienurlaub", "/urlaubsthemen/strandurlaub", "/urlaubsguides",
];

export default function SeoDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<PageAnalysis[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");

  const runAudit = async () => {
    setPhase("analyzing");
    setLoading(true);
    setAnalyses([]);
    setActions([]);

    const results: PageAnalysis[] = [];

    for (let i = 0; i < KEY_PAGES.length; i++) {
      setProgress(Math.round(((i + 1) / KEY_PAGES.length) * 100));
      try {
        const res = await fetch("/api/admin/analyze-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pagePath: KEY_PAGES[i], focusKeyword: undefined }),
        });
        if (res.ok) {
          const data = await res.json();
          results.push({
            path: KEY_PAGES[i],
            score: data.score ?? 0,
            wordCount: data.wordCount ?? 0,
            checks: data.checks ?? [],
          });
        }
      } catch { /* skip */ }
    }

    setAnalyses(results);

    // Generiere Action Items basierend auf Analyse
    const items: ActionItem[] = [];

    // 1. Seiten mit niedrigem Score
    const lowScorePages = results.filter((r) => r.score < 60);
    if (lowScorePages.length > 0) {
      items.push({
        priority: "critical",
        category: "On-Page SEO",
        title: `${lowScorePages.length} Seiten unter 60% SEO-Score`,
        description: `Seiten: ${lowScorePages.map((p) => p.path).join(", ")}`,
        action: "Seiten analysieren und optimieren",
        href: "/admin/seo/",
      });
    }

    // 2. Thin Content
    const thinPages = results.filter((r) => r.wordCount < 500);
    if (thinPages.length > 0) {
      items.push({
        priority: "critical",
        category: "Content",
        title: `${thinPages.length} Seiten mit zu wenig Text (<500 Wörter)`,
        description: `Google bevorzugt 1.000+ Wörter. Betroffene: ${thinPages.map((p) => `${p.path} (${p.wordCount}W)`).join(", ")}`,
        action: "SEO-Texte ergänzen oder ausbauen",
        href: "/admin/seo/",
      });
    }

    // 3. Fehlende H1 oder Keyword in H1
    const noKwInH1 = results.filter((r) => r.checks.some((c) => c.label.includes("Keyword in H1") && !c.pass));
    if (noKwInH1.length > 0) {
      items.push({
        priority: "high",
        category: "On-Page SEO",
        title: `${noKwInH1.length} Seiten: Focus Keyword fehlt in H1`,
        description: "Das Fokus-Keyword muss in der H1-Überschrift vorkommen — wichtigster On-Page-Faktor.",
        action: "H1-Überschriften anpassen",
      });
    }

    // 4. Meta Description
    const badDesc = results.filter((r) => r.checks.some((c) => c.label.includes("Description-Länge") && !c.pass));
    if (badDesc.length > 0) {
      items.push({
        priority: "medium",
        category: "Meta-Tags",
        title: `${badDesc.length} Seiten: Meta Description nicht optimal`,
        description: "120-160 Zeichen, mit Keyword und Call-to-Action.",
        action: "Meta Descriptions optimieren",
        href: "/admin/seo/",
      });
    }

    // 5. Interne Links
    const fewLinks = results.filter((r) => r.checks.some((c) => c.label.includes("Interne") && !c.pass));
    if (fewLinks.length > 0) {
      items.push({
        priority: "high",
        category: "Verlinkung",
        title: `${fewLinks.length} Seiten mit zu wenig internen Links`,
        description: "Jede Seite sollte mindestens 5 interne Links haben — verbessert Crawling und Autorität.",
        action: "Link-Audit durchführen",
        href: "/admin/seo/links/",
      });
    }

    // 6. JSON-LD
    const noSchema = results.filter((r) => r.checks.some((c) => c.label.includes("JSON-LD") && !c.pass));
    if (noSchema.length > 0) {
      items.push({
        priority: "medium",
        category: "Structured Data",
        title: `${noSchema.length} Seiten ohne JSON-LD Schema`,
        description: "Strukturierte Daten erhöhen die Chance auf Rich Snippets in Google.",
        action: "JSON-LD Schema hinzufügen",
      });
    }

    // 7. Statische Empfehlungen
    items.push({
      priority: "high",
      category: "Content",
      title: "Magazin-Artikel regelmäßig veröffentlichen",
      description: "Google belohnt frischen Content. Ziel: 2-3 Artikel pro Woche zu Money-Keywords.",
      action: "Neue Artikel erstellen",
      href: "/admin/magazin/neu/",
    });

    items.push({
      priority: "medium",
      category: "Backlinks",
      title: "Backlink-Strategie aufbauen",
      description: "Gastbeiträge auf Reiseblogs, Kooperationen mit Reise-Influencern, Pressemitteilungen zu neuen Features.",
      action: "Outreach starten",
    });

    items.push({
      priority: "medium",
      category: "Technik",
      title: "Core Web Vitals prüfen",
      description: "LCP, FID, CLS müssen im grünen Bereich sein. Google PageSpeed Insights nutzen.",
      action: "PageSpeed prüfen",
      href: "https://pagespeed.web.dev/analysis?url=https://www.urlaubfinder365.de/",
    });

    items.push({
      priority: "low",
      category: "KI-Suchmaschinen",
      title: "Für KI-Suchmaschinen optimieren",
      description: "Klare Fakten, Zahlen, Tabellen — KIs wie ChatGPT, Perplexity und Claude zitieren strukturierte Inhalte.",
      action: "Faktenboxen und Tabellen auf Hauptseiten",
    });

    items.push({
      priority: "high",
      category: "Konkurrenz",
      title: "Konkurrenz-Keywords analysieren",
      description: "Finde Keywords wo Check24/TUI ranken aber wir nicht — diese gezielt angreifen.",
      action: "Konkurrenz-Analyse starten",
      href: "/admin/seo/konkurrenz/",
    });

    items.push({
      priority: "medium",
      category: "Local SEO",
      title: "Google Business Profile einrichten",
      description: "Falls noch nicht vorhanden — erhöht Sichtbarkeit für 'Reisebüro online' Suchen.",
      action: "Google Business erstellen",
      href: "https://business.google.com/",
    });

    // Sortieren nach Priorität
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    items.sort((a, b) => order[a.priority] - order[b.priority]);

    setActions(items);
    setPhase("done");
    setLoading(false);
  };

  useEffect(() => { runAudit(); }, []);

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
    : 0;
  const avgWords = analyses.length > 0
    ? Math.round(analyses.reduce((s, a) => s + a.wordCount, 0) / analyses.length)
    : 0;

  const criticalCount = actions.filter((a) => a.priority === "critical").length;
  const highCount = actions.filter((a) => a.priority === "high").length;

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
          <p className="text-sm text-gray-500">Dein Weg in die Google Top 5 — priorisierte Aufgabenliste</p>
        </div>
      </div>

      {/* Progress Bar beim Analysieren */}
      {phase === "analyzing" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Analysiere {KEY_PAGES.length} Seiten...</span>
            <span className="text-sm text-teal-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* KPIs */}
      {phase === "done" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span className="text-xs text-gray-500 uppercase">Ø SEO-Score</span>
              </div>
              <p className={`text-2xl font-black ${avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>{avgScore}%</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-500 uppercase">Ø Wörter</span>
              </div>
              <p className={`text-2xl font-black ${avgWords >= 1000 ? "text-green-400" : avgWords >= 500 ? "text-yellow-400" : "text-red-400"}`}>{avgWords.toLocaleString("de-DE")}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-500 uppercase">Kritisch</span>
              </div>
              <p className="text-2xl font-black text-red-400">{criticalCount}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-500 uppercase">Hoch</span>
              </div>
              <p className="text-2xl font-black text-orange-400">{highCount}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-500 uppercase">Seiten geprüft</span>
              </div>
              <p className="text-2xl font-black text-white">{analyses.length}</p>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/admin/seo/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-teal-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <Search className="w-4 h-4" /> Meta-Daten
            </Link>
            <Link href="/admin/seo/links/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-teal-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <Link2 className="w-4 h-4" /> Link-Audit
            </Link>
            <Link href="/admin/seo/konkurrenz/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-purple-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" /> Konkurrenz
            </Link>
            <Link href="/admin/seo/performance/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" /> Performance
            </Link>
            <Link href="/admin/destinations/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <Globe className="w-4 h-4" /> Destinations
            </Link>
            <Link href="/admin/magazin/neu/" className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-orange-600 rounded-xl px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" /> Neuer Artikel
            </Link>
          </div>

          {/* Action Items */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white mb-1">Aufgaben für Top 5</h2>
            <p className="text-xs text-gray-500">Priorisiert nach Wirkung auf Google-Ranking</p>
          </div>

          <div className="space-y-3">
            {actions.map((item, i) => {
              const cfg = PRIORITY_CONFIG[item.priority];
              const Icon = cfg.icon;
              return (
                <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{item.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                    {item.href && (
                      <Link
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        className={`shrink-0 text-xs font-semibold ${cfg.color} hover:text-white transition-colors whitespace-nowrap`}
                      >
                        {item.action} →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seiten-Scores */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-3">Seiten-Scores im Detail</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Seite</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Score</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Wörter</th>
                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Checks</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.sort((a, b) => a.score - b.score).map((a) => (
                    <tr key={a.path} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                      <td className="px-4 py-2.5 font-mono text-gray-300 text-xs">{a.path}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`font-bold ${a.score >= 70 ? "text-green-400" : a.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                          {a.score}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`${a.wordCount >= 800 ? "text-green-400" : a.wordCount >= 400 ? "text-yellow-400" : "text-red-400"}`}>
                          {a.wordCount.toLocaleString("de-DE")}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-400">
                        {a.checks.filter((c) => c.pass).length}/{a.checks.length}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link href={`/admin/seo/${encodeURIComponent(a.path)}`} className="text-teal-400 hover:text-teal-300 text-xs font-semibold">
                          Optimieren →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
