"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Search, Loader2, ExternalLink, AlertTriangle,
  CheckCircle2, Copy, Check, Mail, Globe, Link2Off, ArrowRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BrokenLink {
  sourceUrl: string;
  sourcePage: string;
  brokenUrl: string;
  anchorText: string;
  statusCode: number;
  suggestedReplacement: string | null;
  suggestedReplacementTitle: string | null;
}

interface ScanResult {
  target: string;
  scannedPages: number;
  brokenLinks: BrokenLink[];
  scanTime: string;
}

// ─── Ziel-Vorschläge ─────────────────────────────────────────────────────────
const SUGGESTED_TARGETS = [
  { name: "Reisereporter", url: "https://www.reisereporter.de", focus: "Nachrichten, Deals" },
  { name: "Travelbook", url: "https://www.travelbook.de", focus: "Inspirationen, Tipps" },
  { name: "Urlaubsguru Blog", url: "https://www.urlaubsguru.de/reisemagazin", focus: "Deals, Reiseziele" },
  { name: "Travelcircus Blog", url: "https://www.travelcircus.de/reiseblog", focus: "St\u00e4dtereisen" },
  { name: "Reise-Liebe", url: "https://www.reise-liebe.de", focus: "Familienurlaub" },
  { name: "Reisehappen", url: "https://www.reisehappen.de", focus: "Kurztrips" },
  { name: "Weltreisender.net", url: "https://www.weltreisender.net", focus: "Fernreisen" },
  { name: "Clever-auf-Reisen", url: "https://www.clever-auf-reisen.de", focus: "Spartipps" },
  { name: "Wikipedia Reise", url: "https://de.wikipedia.org/wiki/Tourismus", focus: "Referenz-Links" },
  { name: "GEO Reisen", url: "https://www.geo.de/reisen", focus: "Magazin-Artikel" },
];

// ─── Unsere Seiten als Ersatz-Vorschl\u00e4ge ────────────────────────────────────
const OUR_PAGES = [
  { path: "/urlaubsziele/tuerkei/", keywords: ["t\u00fcrkei", "antalya", "bodrum", "side", "t\u00fcrkische riviera"] },
  { path: "/urlaubsziele/mallorca/", keywords: ["mallorca", "balearen", "palma"] },
  { path: "/urlaubsziele/griechenland/", keywords: ["griechenland", "kreta", "rhodos", "korfu", "santorini"] },
  { path: "/urlaubsziele/kanaren/", keywords: ["kanaren", "teneriffa", "gran canaria", "fuerteventura", "lanzarote"] },
  { path: "/urlaubsziele/dubai/", keywords: ["dubai", "abu dhabi", "vae", "emirate"] },
  { path: "/urlaubsarten/all-inclusive-urlaub/", keywords: ["all inclusive", "all-inclusive", "vollpension"] },
  { path: "/urlaubsarten/pauschalreisen/", keywords: ["pauschalreise", "pauschal", "paket"] },
  { path: "/last-minute/", keywords: ["last minute", "last-minute", "kurzfristig"] },
  { path: "/kreuzfahrten/", keywords: ["kreuzfahrt", "schiff", "mittelmeer kreuzfahrt"] },
  { path: "/ratgeber/", keywords: ["reise tipps", "ratgeber", "reiseplanung"] },
  { path: "/preisentwicklung/", keywords: ["preis", "preisentwicklung", "g\u00fcnstig", "billig"] },
  { path: "/reiseversicherung/", keywords: ["versicherung", "reiseversicherung", "auslandskranken"] },
  { path: "/visum-checker/", keywords: ["visum", "einreise", "pass"] },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function BrokenLinksPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const scan = async () => {
    if (!targetUrl.trim()) return;
    setScanning(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/admin/broken-link-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Scan fehlgeschlagen"); setScanning(false); return; }
      setResults(data);
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    }
    setScanning(false);
  };

  const copyOutreach = (bl: BrokenLink) => {
    const replacement = bl.suggestedReplacement
      ? `https://www.urlaubfinder365.de${bl.suggestedReplacement}`
      : "https://www.urlaubfinder365.de/";
    const text = `Hallo,

ich bin auf Ihrer Seite ${bl.sourcePage} auf einen Link gestoßen, der leider nicht mehr funktioniert:

→ ${bl.brokenUrl} (${bl.statusCode})

Als Betreiber von Urlaubfinder365.de haben wir einen aktuellen, passenden Artikel, der sich als Ersatz eignen würde:

→ ${replacement}

Würden Sie den Link eventuell aktualisieren? Das wäre sowohl für Ihre Leser als auch für uns hilfreich.

Beste Grüße
Urlaubfinder365-Team`;

    navigator.clipboard.writeText(text);
    setCopied(bl.brokenUrl);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <Link href="/admin/seo/" className="hover:text-white transition-colors">SEO</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-teal-400">Broken-Link-Builder</span>
        </div>
        <h1 className="text-2xl font-black text-white">Broken-Link-Builder</h1>
        <p className="text-gray-500 text-sm mt-1">Finde tote Links auf Reiseseiten und schlage unsere Inhalte als Ersatz vor</p>
      </div>

      {/* Scan-Formular */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Webseite scannen</p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://www.reisereporter.de/artikel/tuerkei-tipps"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500"
              onKeyDown={(e) => e.key === "Enter" && scan()}
            />
          </div>
          <button
            onClick={scan}
            disabled={scanning || !targetUrl.trim()}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanne...</> : <><Search className="w-4 h-4" /> Scannen</>}
          </button>
        </div>

        {error && <p className="text-sm text-red-400 bg-red-900/20 px-4 py-2 rounded-xl mt-3">{error}</p>}
      </div>

      {/* Vorgeschlagene Ziele */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold text-white">Vorgeschlagene Zielseiten zum Scannen</h2>
          <p className="text-xs text-gray-500 mt-0.5">Deutsche Reiseblogs &amp; Magazine mit hoher Wahrscheinlichkeit f&uuml;r tote Links</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-800">
          {SUGGESTED_TARGETS.map((t) => (
            <button
              key={t.url}
              onClick={() => { setTargetUrl(t.url); setResults(null); }}
              className="bg-gray-900 px-5 py-3 text-left hover:bg-gray-800/60 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                <p className="text-[10px] text-gray-500">{t.focus}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Ergebnisse */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Scan-Ergebnis</h2>
              <p className="text-xs text-gray-500">
                {results.scannedPages} Seiten gescannt &middot; {results.brokenLinks.length} tote Links gefunden &middot; {results.scanTime}
              </p>
            </div>
            {results.brokenLinks.length > 0 && (
              <span className="bg-amber-900/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                {results.brokenLinks.length} Chancen
              </span>
            )}
          </div>

          {results.brokenLinks.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Keine toten Links gefunden auf dieser Seite</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
              {results.brokenLinks.map((bl, i) => (
                <div key={i} className="px-5 py-4 space-y-2">
                  {/* Quellseite */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Gefunden auf:</p>
                      <a href={bl.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-teal-400 font-medium truncate flex items-center gap-1">
                        {bl.sourcePage} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <span className="bg-red-900/30 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {bl.statusCode}
                    </span>
                  </div>

                  {/* Toter Link */}
                  <div className="flex items-center gap-2 bg-red-900/10 rounded-xl px-3 py-2">
                    <Link2Off className="w-4 h-4 text-red-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-red-400 font-mono truncate">{bl.brokenUrl}</p>
                      {bl.anchorText && <p className="text-[10px] text-gray-500">Anchor: &ldquo;{bl.anchorText}&rdquo;</p>}
                    </div>
                  </div>

                  {/* Vorgeschlagener Ersatz */}
                  {bl.suggestedReplacement && (
                    <div className="flex items-center gap-2 bg-emerald-900/10 rounded-xl px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-emerald-400 font-medium">Unser Ersatz-Vorschlag:</p>
                        <p className="text-xs text-white font-mono truncate">urlaubfinder365.de{bl.suggestedReplacement}</p>
                        {bl.suggestedReplacementTitle && <p className="text-[10px] text-gray-500">{bl.suggestedReplacementTitle}</p>}
                      </div>
                    </div>
                  )}

                  {/* Aktionen */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => copyOutreach(bl)}
                      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {copied === bl.brokenUrl
                        ? <><Check className="w-3 h-3 text-emerald-400" /> Kopiert</>
                        : <><Mail className="w-3 h-3" /> Outreach-Mail kopieren</>}
                    </button>
                    <a
                      href={bl.brokenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" /> Link pr&uuml;fen
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Anleitung */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-3">So funktioniert Broken-Link-Building</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { nr: "1", title: "Zielseite scannen", desc: "Gib die URL einer Reiseseite ein. Wir crawlen die Seite und pr\u00fcfen alle ausgehenden Links." },
            { nr: "2", title: "Tote Links finden", desc: "Links die einen 404- oder 410-Fehler zur\u00fcckgeben werden markiert \u2014 inkl. Anchor-Text und Kontext." },
            { nr: "3", title: "Outreach senden", desc: "Kopiere die vorformulierte E-Mail und schlage unsere Seite als Ersatz vor. Win-Win f\u00fcr beide Seiten." },
          ].map((s) => (
            <div key={s.nr} className="text-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-2">{s.nr}</div>
              <p className="text-xs font-bold text-white mb-1">{s.title}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
