"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Sparkles, ScanSearch, Check, X } from "lucide-react";
import type { PageSeoMeta } from "@/lib/seo-meta";

interface Props {
  pagePath: string;
  initial?: PageSeoMeta | null;
}

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

export default function SeoMetaForm({ pagePath, initial }: Props) {
  const [metaTitle, setMetaTitle]       = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initial?.focus_keyword ?? "");
  const [additionalKeywords, setAdditionalKeywords] = useState(
    initial?.additional_keywords?.join(", ") ?? ""
  );
  const [ogTitle, setOgTitle]           = useState(initial?.og_title ?? "");
  const [ogDescription, setOgDescription] = useState(initial?.og_description ?? "");
  const [ogImage, setOgImage]           = useState(initial?.og_image ?? "");

  // Textblöcke
  const [seoIntro, setSeoIntro]         = useState((initial as Record<string, unknown>)?.seo_intro as string ?? "");
  const [seoH2Middle, setSeoH2Middle]   = useState((initial as Record<string, unknown>)?.seo_h2_middle as string ?? "");
  const [seoMiddle, setSeoMiddle]       = useState((initial as Record<string, unknown>)?.seo_middle as string ?? "");
  const [seoH2Bottom, setSeoH2Bottom]   = useState((initial as Record<string, unknown>)?.seo_h2_bottom as string ?? "");
  const [seoBottom, setSeoBottom]       = useState((initial as Record<string, unknown>)?.seo_bottom as string ?? "");

  const [saving, setSaving]             = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [analyzing, setAnalyzing]       = useState(false);
  const [analysis, setAnalysis]         = useState<{ score: number; checks: { label: string; pass: boolean; detail: string }[]; headings: { level: number; text: string }[] } | null>(null);
  const [message, setMessage]           = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const totalWords = [seoIntro, seoMiddle, seoBottom].join(" ").split(/\s+/).filter((w) => w.length > 1).length;

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage({ type: "info", text: "KI recherchiert optimale SEO-Daten …" });
    try {
      const res = await fetch("/api/admin/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePath, pageTitle: metaTitle || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler bei KI-Generierung");

      setMetaTitle(data.meta_title ?? "");
      setMetaDescription(data.meta_description ?? "");
      setFocusKeyword(data.focus_keyword ?? "");
      setAdditionalKeywords((data.additional_keywords ?? []).join(", "));
      setOgTitle(data.og_title ?? "");
      setOgDescription(data.og_description ?? "");
      if (data.seo_intro)     setSeoIntro(data.seo_intro);
      if (data.seo_h2_middle) setSeoH2Middle(data.seo_h2_middle);
      if (data.seo_middle)    setSeoMiddle(data.seo_middle);
      if (data.seo_h2_bottom) setSeoH2Bottom(data.seo_h2_bottom);
      if (data.seo_bottom)    setSeoBottom(data.seo_bottom);

      if (data.og_image_suggestion) {
        setMessage({ type: "success", text: `KI-Vorschläge übernommen. Bild-Empfehlung: ${data.og_image_suggestion}` });
      } else {
        setMessage({ type: "success", text: "KI-Vorschläge erfolgreich übernommen. Bitte prüfen und speichern." });
      }
    } catch (err) {
      setMessage({ type: "error", text: String(err) });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const keywords = additionalKeywords.split(",").map((k) => k.trim()).filter(Boolean);

      const { error } = await supabase.from("page_seo_meta").upsert(
        {
          page_path:         pagePath,
          meta_title:        metaTitle || null,
          meta_description:  metaDescription || null,
          focus_keyword:     focusKeyword || null,
          additional_keywords: keywords.length > 0 ? keywords : null,
          og_title:          ogTitle || null,
          og_description:    ogDescription || null,
          og_image:          ogImage || null,
          seo_intro:         seoIntro || null,
          seo_h2_middle:     seoH2Middle || null,
          seo_middle:        seoMiddle || null,
          seo_h2_bottom:     seoH2Bottom || null,
          seo_bottom:        seoBottom || null,
        },
        { onConflict: "page_path" }
      );

      if (error) throw error;
      setMessage({ type: "success", text: "SEO-Daten erfolgreich gespeichert." });
    } catch (err) {
      setMessage({ type: "error", text: "Fehler beim Speichern: " + String(err) });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 placeholder-gray-600";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1";

  return (
    <div className="space-y-6">
      {/* KI-Generierung */}
      <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-bold text-purple-300">KI-Optimierung</p>
            </div>
            <p className="text-xs text-purple-400/70">
              Recherchiert auf Basis von SEO-Best-Practices und Konkurrenzanalyse die optimalen Meta-Daten + Textblöcke (850+ Wörter).
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="shrink-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? "Generiert …" : "Mit KI generieren"}
          </button>
        </div>
      </div>

      {/* Seiten-Analyse */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ScanSearch className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-bold text-blue-300">Live-Analyse</p>
          </div>
          <button
            onClick={async () => {
              setAnalyzing(true);
              try {
                const res = await fetch("/api/admin/analyze-page", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ pagePath, focusKeyword: focusKeyword || undefined }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setAnalysis(data);
              } catch (err) {
                setMessage({ type: "error", text: `Analyse fehlgeschlagen: ${err}` });
              } finally {
                setAnalyzing(false);
              }
            }}
            disabled={analyzing}
            className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            <ScanSearch className="w-3.5 h-3.5" />
            {analyzing ? "Analysiert …" : "Seite analysieren"}
          </button>
        </div>

        {analysis && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-3xl font-black ${analysis.score >= 80 ? "text-green-400" : analysis.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                {analysis.score}%
              </span>
              <span className="text-xs text-gray-500">SEO-Score (Live-Analyse)</span>
            </div>
            <div className="space-y-1.5">
              {analysis.checks.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {c.pass
                    ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                    : <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  }
                  <div>
                    <span className={c.pass ? "text-green-300" : "text-red-300"}>{c.label}</span>
                    <span className="text-gray-500 ml-1.5">{c.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            {analysis.headings.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                  Überschriften-Struktur ({analysis.headings.length} Headings)
                </summary>
                <div className="mt-2 space-y-0.5 max-h-48 overflow-y-auto">
                  {analysis.headings.map((h, i) => (
                    <div key={i} className="text-xs text-gray-400" style={{ paddingLeft: `${(h.level - 1) * 16}px` }}>
                      <span className="text-gray-600 font-mono mr-1.5">H{h.level}</span>
                      <span className={h.level === 1 ? "text-white font-semibold" : ""}>{h.text}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* ── SEO-Metadaten ─────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">🔍 SEO-Metadaten</h3>

        {/* Meta Title */}
        <div>
          <label className={labelClass}>
            Meta Title
            <span className={`ml-2 font-normal normal-case ${metaTitle.length > 60 ? "text-red-400" : metaTitle.length >= 30 ? "text-green-400" : "text-gray-500"}`}>
              {metaTitle.length}/60
            </span>
          </label>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={80} placeholder="Seitentitel für Suchmaschinen (30–60 Zeichen ideal)" className={inputClass} />
        </div>

        {/* Meta Description */}
        <div>
          <label className={labelClass}>
            Meta Description
            <span className={`ml-2 font-normal normal-case ${metaDescription.length > 160 ? "text-red-400" : metaDescription.length >= 120 ? "text-green-400" : "text-gray-500"}`}>
              {metaDescription.length}/160
            </span>
          </label>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
            rows={3} maxLength={200} placeholder="Kurzbeschreibung (120–160 Zeichen ideal)"
            className={inputClass + " resize-none"} />
        </div>

        {/* Google SERP Vorschau */}
        {(metaTitle.length > 0 || metaDescription.length > 0) && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-semibold">Google-Vorschau</p>
            <div className="space-y-0.5">
              <p className="text-[13px] text-blue-400 font-medium leading-tight truncate">
                {metaTitle || `urlaubfinder365.de${pagePath}`}
              </p>
              <p className="text-[11px] text-green-500 leading-tight">
                urlaubfinder365.de{pagePath}
              </p>
              <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 mt-0.5">
                {metaDescription || "Keine Beschreibung vorhanden."}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800 flex flex-wrap gap-4 text-[10px]">
              <span className={metaTitle.length >= 30 && metaTitle.length <= 60 ? "text-green-400" : metaTitle.length > 0 ? "text-yellow-400" : "text-gray-600"}>
                Title: {metaTitle.length} Zeichen {metaTitle.length >= 30 && metaTitle.length <= 60 ? "✓" : metaTitle.length > 60 ? "(zu lang)" : "(zu kurz)"}
              </span>
              <span className={metaDescription.length >= 120 && metaDescription.length <= 160 ? "text-green-400" : metaDescription.length > 0 ? "text-yellow-400" : "text-gray-600"}>
                Description: {metaDescription.length} Zeichen {metaDescription.length >= 120 && metaDescription.length <= 160 ? "✓" : metaDescription.length > 160 ? "(zu lang)" : metaDescription.length > 0 ? "(zu kurz)" : ""}
              </span>
              {focusKeyword && (
                <>
                  <span className={metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? "text-green-400" : "text-red-400"}>
                    Keyword im Title {metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? "✓" : "✗"}
                  </span>
                  <span className={metaDescription.toLowerCase().includes(focusKeyword.toLowerCase()) ? "text-green-400" : "text-red-400"}>
                    in Description {metaDescription.toLowerCase().includes(focusKeyword.toLowerCase()) ? "✓" : "✗"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Focus Keyword + Additional Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Focus Keyword</label>
            <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="z. B. Pauschalreise Türkei" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weitere Keywords (kommagetrennt)</label>
            <input type="text" value={additionalKeywords} onChange={(e) => setAdditionalKeywords(e.target.value)}
              placeholder="z. B. Türkei Urlaub, All Inclusive, günstig buchen" className={inputClass} />
            {additionalKeywords && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {additionalKeywords.split(",").map((k) => k.trim()).filter(Boolean).map((kw) => (
                  <span key={kw} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">{kw}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Open Graph ─────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📢 Open Graph (Social Media)</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>OG Title</label>
            <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Titel für Social-Media (Standard: Meta Title)" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>OG Description</label>
            <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)}
              rows={2} placeholder="Beschreibung für Social-Media"
              className={inputClass + " resize-none"} />
          </div>
          <div>
            <label className={labelClass}>OG Image URL</label>
            <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://... (1200×630 px empfohlen)" className={inputClass} />
            {ogImage && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ogImage} alt="OG Preview" className="rounded-lg border border-gray-700 max-h-32 object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SEO-Textblöcke ─────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-5 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📝 SEO-Textblöcke</h3>
          <span className={`text-xs font-bold ${totalWords >= 850 ? "text-green-400" : totalWords >= 400 ? "text-yellow-400" : "text-gray-500"}`}>
            {totalWords} Wörter {totalWords >= 850 ? "✓" : `(mind. 850 empfohlen)`}
          </span>
        </div>

        {/* SEO Intro */}
        <div>
          <label className={labelClass}>SEO-Intro (nach Hero, max. 80 Wörter)</label>
          <textarea value={seoIntro} onChange={(e) => setSeoIntro(e.target.value)} rows={3}
            placeholder="Emotionaler Einleitungstext direkt unter dem Hero-Bild…"
            className={inputClass + " resize-y"} />
          <TextPreview text={seoIntro} />
        </div>

        {/* H2 Mitte */}
        <div className="border-t border-gray-800 pt-4">
          <label className={labelClass}>H2-Überschrift (Mitte)</label>
          <input type="text" value={seoH2Middle} onChange={(e) => setSeoH2Middle(e.target.value)}
            placeholder="z. B. Alles zum Thema Pauschalreisen" className={inputClass} />
        </div>

        {/* SEO Middle */}
        <div>
          <label className={labelClass}>SEO-Text Mitte (150–200 Wörter)</label>
          <textarea value={seoMiddle} onChange={(e) => setSeoMiddle(e.target.value)} rows={5}
            placeholder="Informationsblock in der Seitenmitte, vor dem Hauptinhalt…"
            className={inputClass + " resize-y"} />
          <TextPreview text={seoMiddle} />
        </div>

        {/* H2 Unten */}
        <div className="border-t border-gray-800 pt-4">
          <label className={labelClass}>H2-Überschrift (unten)</label>
          <input type="text" value={seoH2Bottom} onChange={(e) => setSeoH2Bottom(e.target.value)}
            placeholder="z. B. Der große Ratgeber: Tipps & Hintergrundwissen" className={inputClass} />
        </div>

        {/* SEO Bottom */}
        <div>
          <label className={labelClass}>SEO-Text unten (500–600 Wörter — längster Block)</label>
          <textarea value={seoBottom} onChange={(e) => setSeoBottom(e.target.value)} rows={12}
            placeholder="Ausführlicher Ratgeber-Text ganz unten auf der Seite. Dieser muss der längste Textblock sein.&#10;&#10;Absätze mit Leerzeile trennen."
            className={inputClass + " resize-y"} />
          <TextPreview text={seoBottom} />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          message.type === "success" ? "bg-teal-900/40 text-teal-300 border border-teal-700"
          : message.type === "info" ? "bg-blue-900/40 text-blue-300 border border-blue-700"
          : "bg-red-900/40 text-red-300 border border-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
        {saving ? "Speichern…" : "SEO-Daten speichern"}
      </button>
    </div>
  );
}
