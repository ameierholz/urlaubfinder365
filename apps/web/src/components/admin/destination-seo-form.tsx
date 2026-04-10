"use client";

import { useState } from "react";
import { Sparkles, ScanSearch, Check, X } from "lucide-react";

// Robuste Error-zu-String Konversion. Supabase-Errors sind oft Objekte
// ohne enumerable properties → JSON.stringify liefert "{}", String(err)
// liefert "[object Object]". Wir extrahieren message/code/details.
function errorToText(err: unknown): string {
  if (!err) return "Unbekannter Fehler";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof e.message === "string") parts.push(e.message);
    if (typeof e.error === "string")   parts.push(e.error);
    if (typeof e.code === "string")    parts.push(`(${e.code})`);
    if (typeof e.details === "string") parts.push(e.details);
    if (parts.length > 0) return parts.join(" ");
    try {
      return JSON.stringify(err);
    } catch {
      return "Unbekannter Fehler";
    }
  }
  return String(err);
}

interface DestinationSeoData {
  seo_intro?: string | null;
  seo_middle?: string | null;
  seo_bottom?: string | null;
  seo_h2_middle?: string | null;
  seo_h2_bottom?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  keywords?: string | null;
}

interface Props {
  slug: string;
  name: string;
  country?: string;
  initial?: DestinationSeoData | null;
}

interface AnalysisCheck { label: string; pass: boolean; detail: string }

function TextPreview({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <div className="mt-2 p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
      <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-2">Vorschau</p>
      {text.split(/\n\n+/).filter(Boolean).map((p, i) => (
        <p key={i} className="text-gray-400 text-xs leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

export default function DestinationSeoForm({ slug, name, country, initial }: Props) {
  const [metaTitle, setMetaTitle]           = useState(initial?.meta_title ?? "");
  const [metaDesc, setMetaDesc]             = useState(initial?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword]     = useState(initial?.focus_keyword ?? "");
  const [keywords, setKeywords]             = useState(initial?.keywords ?? "");
  const [seoIntro, setSeoIntro]             = useState(initial?.seo_intro ?? "");
  const [seoH2Middle, setSeoH2Middle]       = useState(initial?.seo_h2_middle ?? "");
  const [seoMiddle, setSeoMiddle]           = useState(initial?.seo_middle ?? "");
  const [seoH2Bottom, setSeoH2Bottom]       = useState(initial?.seo_h2_bottom ?? "");
  const [seoBottom, setSeoBottom]           = useState(initial?.seo_bottom ?? "");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ score: number; checks: AnalysisCheck[]; headings: { level: number; text: string }[]; wordCount?: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const pagePath = `/urlaubsziele/${slug}`;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/analyze-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePath, focusKeyword: `${name} Urlaub` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data.error ?? data));
      setAnalysis(data);
    } catch (err) {
      setMessage({ type: "error", text: `Analyse fehlgeschlagen: ${errorToText(err)}` });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage({ type: "info", text: "Claude Opus generiert SEO-Texte …" });
    try {
      const res = await fetch("/api/admin/generate-destination-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data.error ?? data));

      setSeoIntro(data.seo_intro ?? "");
      setSeoH2Middle(data.seo_h2_middle ?? "");
      setSeoMiddle(data.seo_middle ?? "");
      setSeoH2Bottom(data.seo_h2_bottom ?? "");
      setSeoBottom(data.seo_bottom ?? "");
      setMessage({ type: "success", text: "KI-Texte übernommen. Bitte prüfen und speichern." });
    } catch (err) {
      setMessage({ type: "error", text: errorToText(err) });
    } finally {
      setGenerating(false);
    }
  };

  // Speichern erfolgt jetzt server-side via /api/admin/save-destination-seo,
  // weil destination_seo_texts nur eine Public-Read-Policy hat — direktes
  // Schreiben aus dem Browser via anon-key wird von RLS blockiert.
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/save-destination-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          country:          country ?? null,
          meta_title:       metaTitle || null,
          meta_description: metaDesc || null,
          focus_keyword:    focusKeyword || null,
          keywords:         keywords || null,
          seo_intro:        seoIntro || null,
          seo_h2_middle:    seoH2Middle || null,
          seo_middle:       seoMiddle || null,
          seo_h2_bottom:    seoH2Bottom || null,
          seo_bottom:       seoBottom || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(errorToText(data?.error ?? data) || `HTTP ${res.status}`);
      }
      setMessage({ type: "success", text: `SEO-Texte für „${name}" gespeichert.` });
    } catch (err) {
      setMessage({ type: "error", text: "Fehler: " + errorToText(err) });
    } finally {
      setSaving(false);
    }
  };

  const totalWords       = [seoIntro, seoMiddle, seoBottom].join(" ").split(/\s+/).filter((w) => w.length > 1).length;
  const metaTitleLen     = metaTitle.length;
  const metaDescLen      = metaDesc.length;

  const inputClass = "w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 placeholder-gray-600";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1";

  return (
    <div className="space-y-6">
      {/* Analyse + KI Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Live-Analyse */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-bold text-blue-300">Live-Analyse</p>
            </div>
            <button onClick={handleAnalyze} disabled={analyzing}
              className="shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <ScanSearch className="w-3.5 h-3.5" />
              {analyzing ? "…" : "Analysieren"}
            </button>
          </div>
        </div>

        {/* KI-Generierung */}
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-bold text-purple-300">KI-Texte</p>
            </div>
            <button onClick={handleGenerate} disabled={generating}
              className="shrink-0 flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              {generating ? "Generiert …" : "Mit KI generieren"}
            </button>
          </div>
        </div>
      </div>

      {/* Analyse-Ergebnis */}
      {analysis && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-3xl font-black ${analysis.score >= 80 ? "text-green-400" : analysis.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {analysis.score}%
            </span>
            <div>
              <span className="text-xs text-gray-500">SEO-Score</span>
              {analysis.wordCount != null && (
                <span className="text-xs text-gray-500 ml-3">{analysis.wordCount.toLocaleString("de-DE")} Wörter</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            {analysis.checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {c.pass ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /> : <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                <span className={c.pass ? "text-green-300" : "text-red-300"}>{c.label}</span>
                <span className="text-gray-500">{c.detail}</span>
              </div>
            ))}
          </div>
          <details className="mt-3">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">H-Struktur ({analysis.headings.length})</summary>
            <div className="mt-2 space-y-0.5 max-h-40 overflow-y-auto">
              {analysis.headings.map((h, i) => (
                <div key={i} className="text-xs text-gray-400" style={{ paddingLeft: `${(h.level - 1) * 16}px` }}>
                  <span className="text-gray-600 font-mono mr-1">H{h.level}</span>
                  <span className={h.level === 1 ? "text-white font-semibold" : ""}>{h.text}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── SEO-Metadaten ─────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          🔍 SEO-Metadaten
        </h3>

        {/* Meta Titel */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Meta-Titel</label>
            <span className={`text-xs font-mono ${metaTitleLen > 60 ? "text-red-400" : metaTitleLen > 50 ? "text-yellow-400" : "text-gray-500"}`}>
              {metaTitleLen}/60
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={80}
            placeholder={`${name} Urlaub – Pauschalreisen, Preise & Tipps`}
            className={inputClass}
          />
          {metaTitleLen > 0 && (
            <div className="mt-1.5 bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-blue-300 font-medium truncate">
              {metaTitle}
            </div>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Meta-Description</label>
            <span className={`text-xs font-mono ${metaDescLen > 160 ? "text-red-400" : metaDescLen > 140 ? "text-yellow-400" : "text-gray-500"}`}>
              {metaDescLen}/160
            </span>
          </div>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder={`${name} Urlaub günstig buchen ✓ Pauschalreisen ab X € ✓ Preisverlauf & Buchungsempfehlung ✓ Jetzt vergleichen`}
            className={inputClass + " resize-none"}
          />
          {metaDescLen > 0 && (
            <div className="mt-1.5 bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-xs text-gray-400 leading-relaxed">
              {metaDesc}
            </div>
          )}
        </div>

        {/* Fokus-Keyword + weitere Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fokus-Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder={`${name} Urlaub`}
              className={inputClass}
            />
            <p className="text-[10px] text-gray-600 mt-1">Hauptbegriff, auf den die Seite optimiert ist</p>
          </div>
          <div>
            <label className={labelClass}>Weitere Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={`${name} All Inclusive, günstig ${name}, ${name} Pauschalreise`}
              className={inputClass}
            />
            <p className="text-[10px] text-gray-600 mt-1">Kommagetrennt</p>
          </div>
        </div>
      </div>

      {/* Wort-Counter */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-500">Eigene SEO-Texte:</span>
        <span className={`font-bold ${totalWords >= 300 ? "text-green-400" : totalWords >= 100 ? "text-yellow-400" : "text-gray-500"}`}>
          {totalWords} Wörter
        </span>
        {totalWords < 300 && <span className="text-gray-600">(mind. 300 empfohlen)</span>}
      </div>

      {/* Intro */}
      <div>
        <label className={labelClass}>SEO-Intro (nach Hero)</label>
        <textarea value={seoIntro} onChange={(e) => setSeoIntro(e.target.value)} rows={3}
          placeholder={`Emotionaler Einleitungstext für ${name}…`} className={inputClass + " resize-y"} />
        <TextPreview text={seoIntro} />
      </div>

      {/* Middle */}
      <div className="border-t border-gray-800 pt-5">
        <div className="mb-4">
          <label className={labelClass}>H2-Überschrift (Mitte)</label>
          <input type="text" value={seoH2Middle} onChange={(e) => setSeoH2Middle(e.target.value)}
            placeholder={`z. B. ${name} – Strände, Kultur & Reisetipps`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SEO-Text Mitte (kurz, vor Aktivitäten – max. 80 Wörter)</label>
          <textarea value={seoMiddle} onChange={(e) => setSeoMiddle(e.target.value)} rows={4}
            placeholder={`Kurze Highlights: Klima, beste Reisezeit, Top-Sehenswürdigkeit…`} className={inputClass + " resize-y"} />
          <TextPreview text={seoMiddle} />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 pt-5">
        <div className="mb-4">
          <label className={labelClass}>H2-Überschrift (unten)</label>
          <input type="text" value={seoH2Bottom} onChange={(e) => setSeoH2Bottom(e.target.value)}
            placeholder={`z. B. ${name}-Urlaub günstig buchen`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SEO-Text unten (langer Reiseführer + CTA, 250–350 Wörter)</label>
          <textarea value={seoBottom} onChange={(e) => setSeoBottom(e.target.value)} rows={10}
            placeholder={`Ausführlicher Reiseführer: Reisezeit, Strände, Aktivitäten, Kulinarik, Buchungstipp…\n\nAbsätze mit Leerzeile trennen.`} className={inputClass + " resize-y"} />
          <TextPreview text={seoBottom} />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          message.type === "success" ? "bg-teal-900/40 text-teal-300 border border-teal-700"
          : message.type === "info" ? "bg-blue-900/40 text-blue-300 border border-blue-700"
          : "bg-red-900/40 text-red-300 border border-red-700"
        }`}>{message.text}</div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
        {saving ? "Speichern…" : "SEO-Texte speichern"}
      </button>
    </div>
  );
}
