"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Loader2, Save, Sparkles, ScanSearch, Check, X } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface Category { id: string; name: string; slug: string }

export interface ExistingArticle {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  author_name: string;
  excerpt: string;
  cover_image: string;
  content: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  status: string;
}

interface Props {
  article?: ExistingArticle;
  categories: Category[];
}

interface AnalysisCheck { label: string; pass: boolean; detail: string }

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function errorToText(err: unknown): string {
  if (!err) return "Unbekannter Fehler";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof e.message === "string") parts.push(e.message);
    if (typeof e.error === "string") parts.push(e.error);
    if (parts.length > 0) return parts.join(" ");
  }
  return String(err);
}

const inputClass = "w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 placeholder-gray-600";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1";

/* ── Component ────────────────────────────────────────────────────────────── */

export default function ArtikelForm({ article, categories }: Props) {
  const isEdit = !!article;
  const router = useRouter();
  const sb = createSupabaseBrowser();

  // Grunddaten
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? (categories[0]?.id ?? ""));
  const [authorName, setAuthorName] = useState(article?.author_name ?? "Redaktion");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [content, setContent] = useState(article?.content ?? "");

  // SEO-Metadaten
  const [metaTitle, setMetaTitle] = useState(article?.meta_title ?? "");
  const [metaDesc, setMetaDesc] = useState(article?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(article?.focus_keyword ?? "");
  const [keywords, setKeywords] = useState(article?.keywords ?? "");

  // Open Graph
  const [ogTitle, setOgTitle] = useState(article?.og_title ?? "");
  const [ogDesc, setOgDesc] = useState(article?.og_description ?? "");
  const [ogImage, setOgImage] = useState(article?.og_image ?? "");

  // UI state
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ score: number; checks: AnalysisCheck[]; headings: { level: number; text: string }[]; wordCount?: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDesc.length;
  const pagePath = `/magazin/${slug}`;

  useEffect(() => { if (!isEdit) setSlug(slugify(title)); }, [title, isEdit]);

  /* ── Analyse ─────────────────────────────────────────────────────────────── */
  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/analyze-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePath, focusKeyword: focusKeyword || title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data.error ?? data));
      setAnalysis(data);
    } catch (err) {
      setMessage({ type: "error", text: `Analyse fehlgeschlagen: ${errorToText(err)}` });
    } finally {
      setAnalyzing(false);
    }
  }

  /* ── KI-Generierung ──────────────────────────────────────────────────────── */
  async function handleGenerate() {
    setGenerating(true);
    setMessage({ type: "info", text: "Claude Opus generiert SEO-Texte …" });
    try {
      const catName = categories.find((c) => c.id === categoryId)?.name ?? "";
      const res = await fetch("/api/admin/generate-magazin-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: catName, excerpt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data.error ?? data));

      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.meta_description) setMetaDesc(data.meta_description);
      if (data.focus_keyword) setFocusKeyword(data.focus_keyword);
      if (data.keywords) setKeywords(data.keywords);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.og_title) setOgTitle(data.og_title);
      if (data.og_description) setOgDesc(data.og_description);
      if (data.content_outline && !content.trim()) setContent(data.content_outline);
      setMessage({ type: "success", text: "KI-Texte & Meta-Daten übernommen. Prüfen und speichern." });
    } catch (err) {
      setMessage({ type: "error", text: errorToText(err) });
    } finally {
      setGenerating(false);
    }
  }

  /* ── Save ─────────────────────────────────────────────────────────────────── */
  async function handleSave() {
    setMessage(null);
    if (!title.trim()) { setMessage({ type: "error", text: "Titel ist erforderlich." }); return; }
    if (!slug.trim()) { setMessage({ type: "error", text: "Slug ist erforderlich." }); return; }
    if (!categoryId) { setMessage({ type: "error", text: "Bitte eine Kategorie wählen." }); return; }

    setSaving(true);
    const payload = {
      title: title.trim(), slug: slug.trim(), category_id: categoryId,
      author_name: authorName.trim() || "Redaktion",
      excerpt: excerpt.trim(), cover_image: coverImage.trim(), content,
      meta_title: metaTitle.trim(), meta_description: metaDesc.trim(),
      focus_keyword: focusKeyword.trim(), keywords: keywords.trim(),
      og_title: ogTitle.trim(), og_description: ogDesc.trim(), og_image: ogImage.trim(),
      updated_at: new Date().toISOString(),
    };

    let err: { message: string } | null = null;
    if (isEdit) {
      const res = await sb.from("magazin_articles" as never).update(payload as never).eq("id", article!.id);
      err = res.error as { message: string } | null;
    } else {
      const res = await sb.from("magazin_articles" as never).insert({ ...payload, status: "entwurf" } as never);
      err = res.error as { message: string } | null;
    }
    setSaving(false);

    if (err) {
      setMessage({ type: "error", text: err.message });
    } else {
      setMessage({ type: "success", text: isEdit ? "Artikel gespeichert." : "Artikel angelegt." });
      if (!isEdit) { router.push("/admin/magazin/"); router.refresh(); }
    }
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* ── Analyse + KI Buttons ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-bold text-blue-300">Live-Analyse</p>
            </div>
            <button onClick={handleAnalyze} disabled={analyzing || !slug}
              className="shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <ScanSearch className="w-3.5 h-3.5" />
              {analyzing ? "…" : "Seite analysieren"}
            </button>
          </div>
        </div>
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-bold text-purple-300">KI-Optimierung</p>
            </div>
            <button onClick={handleGenerate} disabled={generating || !title}
              className="shrink-0 flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              {generating ? "Generiert …" : "Mit KI generieren"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Analyse-Ergebnis ──────────────────────────────────────────────── */}
      {analysis && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-3xl font-black ${analysis.score >= 80 ? "text-green-400" : analysis.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {analysis.score}%
            </span>
            <div>
              <span className="text-xs text-gray-500">SEO-Score</span>
              {analysis.wordCount != null && <span className="text-xs text-gray-500 ml-3">{analysis.wordCount.toLocaleString("de-DE")} Wörter</span>}
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
        </div>
      )}

      {/* ── SEO-Metadaten ─────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">🔍 SEO-Metadaten</h3>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Meta Title</label>
            <span className={`text-xs font-mono ${metaTitleLen > 60 ? "text-red-400" : metaTitleLen > 50 ? "text-yellow-400" : "text-gray-500"}`}>{metaTitleLen}/60</span>
          </div>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={80} placeholder="SEO-Titel für Google" className={inputClass} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Meta Description</label>
            <span className={`text-xs font-mono ${metaDescLen > 160 ? "text-red-400" : metaDescLen > 140 ? "text-yellow-400" : "text-gray-500"}`}>{metaDescLen}/160</span>
          </div>
          <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} maxLength={200} placeholder="Beschreibung für Google-Suchergebnisse" className={inputClass + " resize-none"} />
        </div>

        {/* Google SERP Vorschau */}
        {(metaTitleLen > 0 || metaDescLen > 0) && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-semibold">Google-Vorschau</p>
            <div className="space-y-0.5">
              <p className="text-[13px] text-blue-400 font-medium leading-tight truncate">{metaTitle || title}</p>
              <p className="text-[11px] text-green-500 leading-tight">urlaubfinder365.de/magazin/{slug}</p>
              <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 mt-0.5">{metaDesc || "Keine Beschreibung."}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800 flex flex-wrap gap-4 text-[10px]">
              <span className={metaTitleLen >= 30 && metaTitleLen <= 60 ? "text-green-400" : metaTitleLen > 0 ? "text-yellow-400" : "text-gray-600"}>
                Title: {metaTitleLen} Zeichen {metaTitleLen >= 30 && metaTitleLen <= 60 ? "✓" : ""}
              </span>
              <span className={metaDescLen >= 120 && metaDescLen <= 160 ? "text-green-400" : metaDescLen > 0 ? "text-yellow-400" : "text-gray-600"}>
                Description: {metaDescLen} Zeichen {metaDescLen >= 120 && metaDescLen <= 160 ? "✓" : ""}
              </span>
              {focusKeyword && (
                <>
                  <span className={metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? "text-green-400" : "text-red-400"}>
                    Keyword im Title {metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? "✓" : "✗"}
                  </span>
                  <span className={metaDesc.toLowerCase().includes(focusKeyword.toLowerCase()) ? "text-green-400" : "text-red-400"}>
                    in Description {metaDesc.toLowerCase().includes(focusKeyword.toLowerCase()) ? "✓" : "✗"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Focus Keyword + Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Focus Keyword</label>
            <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="Hauptbegriff" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weitere Keywords (kommagetrennt)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keyword 1, Keyword 2" className={inputClass} />
            {keywords && (
              <div className="flex flex-wrap gap-1 mt-2">
                {keywords.split(",").map((k) => k.trim()).filter(Boolean).map((k, i) => (
                  <span key={i} className="bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Open Graph ────────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📣 Open Graph (Social Media)</h3>
        <div>
          <label className={labelClass}>OG Title</label>
          <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={metaTitle || title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>OG Description</label>
          <textarea value={ogDesc} onChange={(e) => setOgDesc(e.target.value)} rows={2} placeholder="Social-Media Beschreibung" className={inputClass + " resize-none"} />
        </div>
        <div>
          <label className={labelClass}>OG Image URL</label>
          <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://… (1200×630 px empfohlen)" className={inputClass} />
        </div>
      </div>

      {/* ── Grunddaten ────────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">⚙️ Grunddaten</h3>

        <div>
          <label className={labelClass}>Titel *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Artikeltitel eingeben …" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug {isEdit ? "(schreibgeschützt)" : "(auto-generiert)"}</label>
          <input type="text" value={slug} onChange={(e) => !isEdit && setSlug(e.target.value)} readOnly={isEdit} className={`${inputClass} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kategorie *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Autor</label>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Redaktion" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Teaser / Excerpt</label>
          <textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Kurze Zusammenfassung des Artikels …" className={inputClass + " resize-y"} />
        </div>
        <div>
          <label className={labelClass}>Cover-Bild URL</label>
          <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://images.unsplash.com/…" className={inputClass} />
        </div>
      </div>

      {/* ── Markdown Content ──────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">📝 Inhalt (Markdown)</h3>
        <div data-color-mode="dark" className="rounded-xl overflow-hidden">
          <MDEditor value={content} onChange={(val) => setContent(val ?? "")} height={500} preview="live" />
        </div>
      </div>

      {/* ── Message ───────────────────────────────────────────────────────── */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          message.type === "success" ? "bg-teal-900/40 text-teal-300 border border-teal-700"
          : message.type === "info" ? "bg-blue-900/40 text-blue-300 border border-blue-700"
          : "bg-red-900/40 text-red-300 border border-red-700"
        }`}>{message.text}</div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Speichert…" : isEdit ? "Speichern" : "Artikel anlegen"}
        </button>
        <button onClick={() => { router.push("/admin/magazin/"); }} className="text-sm text-gray-400 hover:text-white transition-colors">
          Abbrechen
        </button>
        {isEdit && slug && (
          <a href={`/magazin/${slug}/`} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-400 hover:underline ml-auto">
            Im Frontend ansehen →
          </a>
        )}
      </div>
    </div>
  );
}
