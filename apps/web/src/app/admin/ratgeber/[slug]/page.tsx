"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ScanSearch, Save, Loader2, ArrowLeft, Plus, Trash2, Check, X } from "lucide-react";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function errorToText(err: unknown): string {
  if (!err) return "Unbekannter Fehler";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof e.message === "string") parts.push(e.message);
    if (typeof e.error === "string") parts.push(e.error);
    if (typeof e.code === "string") parts.push(`(${e.code})`);
    if (parts.length > 0) return parts.join(" ");
    try { return JSON.stringify(err); } catch { return "Unbekannter Fehler"; }
  }
  return String(err);
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

interface Section { heading: string; body: string }
interface Faq { question: string; answer: string }
interface AnalysisCheck { label: string; pass: boolean; detail: string }

const CATEGORIES = ["Buchung", "Verpflegung", "Preise", "Planung", "Sicherheit", "Familie", "Trends", "Reisemittel", "Nachhaltigkeit"];
const inputClass = "w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 placeholder-gray-600";
const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1";

/* ── Component ────────────────────────────────────────────────────────────── */

export default function AdminRatgeberEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const article = RATGEBER_ARTICLES.find((a) => a.slug === slug);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ score: number; checks: AnalysisCheck[]; headings: { level: number; text: string }[]; wordCount?: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // SEO-Metadaten
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [keywords, setKeywords] = useState("");

  // Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDesc, setOgDesc] = useState("");
  const [ogImage, setOgImage] = useState("");

  // Content
  const [lead, setLead] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [category, setCategory] = useState("");
  const [readingTime, setReadingTime] = useState(6);

  // SEO-Textblöcke
  const [seoIntro, setSeoIntro] = useState("");
  const [seoH2Middle, setSeoH2Middle] = useState("");
  const [seoMiddle, setSeoMiddle] = useState("");
  const [seoH2Bottom, setSeoH2Bottom] = useState("");
  const [seoBottom, setSeoBottom] = useState("");

  // Sections + FAQs
  const [sections, setSections] = useState<Section[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const pagePath = `/ratgeber/${slug}`;
  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDesc.length;
  const totalWords = [seoIntro, seoMiddle, seoBottom].join(" ").split(/\s+/).filter((w) => w.length > 1).length;

  /* ── Load ────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!article) return;
    const sb = createSupabaseBrowser();
    sb.from("ratgeber_seo_texts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data: raw }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = raw as Record<string, any> | null;
        if (data) {
          setMetaTitle((data.seo_title as string) ?? "");
          setMetaDesc((data.seo_description as string) ?? "");
          setFocusKeyword((data.focus_keyword as string) ?? "");
          setKeywords((data.keywords as string) ?? "");
          setOgTitle((data.og_title as string) ?? "");
          setOgDesc((data.og_description as string) ?? "");
          setOgImage((data.og_image as string) ?? "");
          setLead((data.lead as string) ?? "");
          setHeroImage((data.hero_image as string) ?? "");
          setCategory((data.category as string) ?? article.category);
          setReadingTime(Number(data.reading_time_min) || article.readingTimeMin);
          setSeoIntro((data.seo_intro as string) ?? "");
          setSeoH2Middle((data.seo_h2_middle as string) ?? "");
          setSeoMiddle((data.seo_middle as string) ?? "");
          setSeoH2Bottom((data.seo_h2_bottom as string) ?? "");
          setSeoBottom((data.seo_bottom as string) ?? "");
          setSections(Array.isArray(data.sections) ? data.sections as Section[] : []);
          setFaqs(Array.isArray(data.faqs) ? data.faqs as Faq[] : []);
        } else {
          setMetaTitle(article.seoTitle);
          setMetaDesc(article.seoDescription);
          setLead(article.lead);
          setHeroImage(article.heroImage);
          setCategory(article.category);
          setReadingTime(article.readingTimeMin);
          setSections(article.sections);
          setFaqs(article.faqs);
        }
        setLoading(false);
      });
  }, [slug, article]);

  /* ── Actions ─────────────────────────────────────────────────────────────── */

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/analyze-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePath, focusKeyword: focusKeyword || article?.title }),
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

  async function handleGenerate() {
    if (!article) return;
    setGenerating(true);
    setMessage({ type: "info", text: "Claude Opus generiert Ratgeber-Inhalte …" });
    try {
      const res = await fetch("/api/admin/generate-ratgeber-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title: article.title, category, existingLead: lead }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data.error ?? data));

      if (data.seo_title) setMetaTitle(data.seo_title);
      if (data.seo_description) setMetaDesc(data.seo_description);
      if (data.focus_keyword) setFocusKeyword(data.focus_keyword);
      if (data.keywords) setKeywords(data.keywords);
      if (data.lead) setLead(data.lead);
      if (data.reading_time_min) setReadingTime(Number(data.reading_time_min));
      if (data.seo_intro) setSeoIntro(data.seo_intro);
      if (data.seo_h2_middle) setSeoH2Middle(data.seo_h2_middle);
      if (data.seo_middle) setSeoMiddle(data.seo_middle);
      if (data.seo_h2_bottom) setSeoH2Bottom(data.seo_h2_bottom);
      if (data.seo_bottom) setSeoBottom(data.seo_bottom);
      if (Array.isArray(data.sections)) setSections(data.sections);
      if (Array.isArray(data.faqs)) setFaqs(data.faqs);
      setMessage({ type: "success", text: "KI-Inhalte generiert! Prüfen und speichern." });
    } catch (err) {
      setMessage({ type: "error", text: errorToText(err) });
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!article) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/save-ratgeber-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug, title: article.title,
          seo_title: metaTitle || null, seo_description: metaDesc || null,
          focus_keyword: focusKeyword || null, keywords: keywords || null,
          og_title: ogTitle || null, og_description: ogDesc || null, og_image: ogImage || null,
          lead: lead || null, hero_image: heroImage || null, category: category || null,
          reading_time_min: readingTime,
          seo_intro: seoIntro || null, seo_h2_middle: seoH2Middle || null,
          seo_middle: seoMiddle || null, seo_h2_bottom: seoH2Bottom || null,
          seo_bottom: seoBottom || null,
          sections, faqs,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(errorToText(data?.error ?? data) || `HTTP ${res.status}`);
      setMessage({ type: "success", text: `Ratgeber „${article.title}" gespeichert.` });
    } catch (err) {
      setMessage({ type: "error", text: "Fehler: " + errorToText(err) });
    } finally {
      setSaving(false);
    }
  }

  /* ── Section/FAQ helpers ─────────────────────────────────────────────────── */
  function updateSection(i: number, field: keyof Section, val: string) {
    setSections((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }
  function updateFaq(i: number, field: keyof Faq, val: string) {
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  }

  /* ── Guards ──────────────────────────────────────────────────────────────── */
  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Artikel nicht gefunden.</p>
        <Link href="/admin/ratgeber/" className="text-teal-400 hover:underline mt-2 inline-block">← Zurück</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/admin/ratgeber/")} className="text-gray-400 hover:text-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-white truncate">{article.title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{pagePath}/</p>
        </div>
      </div>

      {/* ── Analyse + KI Buttons (wie Destinations) ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-bold text-blue-300">Live-Analyse</p>
            </div>
            <button onClick={handleAnalyze} disabled={analyzing}
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
            <button onClick={handleGenerate} disabled={generating}
              className="shrink-0 flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              {generating ? "Generiert …" : "Mit KI generieren"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Analyse-Ergebnis ────────────────────────────────────────────── */}
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
        </div>
      )}

      {/* ── SEO-Metadaten ───────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          🔍 SEO-Metadaten
        </h3>

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
          <div className="mt-1 bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-semibold">Google-Vorschau</p>
            <div className="space-y-0.5">
              <p className="text-[13px] text-blue-400 font-medium leading-tight truncate">{metaTitle || article.title}</p>
              <p className="text-[11px] text-green-500 leading-tight">urlaubfinder365.de/ratgeber/{slug}</p>
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
            <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder={article.title.split("–")[0].trim()} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weitere Keywords (kommagetrennt)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keyword 1, Keyword 2, Keyword 3" className={inputClass} />
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

      {/* ── Open Graph ──────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          📣 Open Graph (Social Media)
        </h3>
        <div>
          <label className={labelClass}>OG Title</label>
          <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={metaTitle || article.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>OG Description</label>
          <textarea value={ogDesc} onChange={(e) => setOgDesc(e.target.value)} rows={2} placeholder={metaDesc || "Social-Media Beschreibung"} className={inputClass + " resize-none"} />
        </div>
        <div>
          <label className={labelClass}>OG Image URL</label>
          <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://… (1200×630 px empfohlen)" className={inputClass} />
        </div>
      </div>

      {/* ── SEO-Textblöcke ──────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-5 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            📝 SEO-Textblöcke
          </h3>
          <span className={`text-xs font-mono ${totalWords >= 850 ? "text-green-400" : totalWords >= 300 ? "text-yellow-400" : "text-gray-500"}`}>
            {totalWords} Wörter (mind. 850 empfohlen)
          </span>
        </div>

        <div>
          <label className={labelClass}>SEO-Intro (nach Hero, max. 80 Wörter)</label>
          <textarea value={seoIntro} onChange={(e) => setSeoIntro(e.target.value)} rows={3} placeholder="Emotionaler Einleitungstext direkt unter dem Hero-Bild..." className={inputClass + " resize-y"} />
          <TextPreview text={seoIntro} />
        </div>

        <div className="border-t border-gray-800 pt-4">
          <label className={labelClass}>H2-Überschrift (Mitte)</label>
          <input type="text" value={seoH2Middle} onChange={(e) => setSeoH2Middle(e.target.value)} placeholder="z. B. Alles zum Thema..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SEO-Text Mitte (150–200 Wörter)</label>
          <textarea value={seoMiddle} onChange={(e) => setSeoMiddle(e.target.value)} rows={4} placeholder="Informationsblock in der Seitenmitte, vor dem Hauptinhalt..." className={inputClass + " resize-y"} />
          <TextPreview text={seoMiddle} />
        </div>

        <div className="border-t border-gray-800 pt-4">
          <label className={labelClass}>H2-Überschrift (Unten)</label>
          <input type="text" value={seoH2Bottom} onChange={(e) => setSeoH2Bottom(e.target.value)} placeholder="z. B. Der große Ratgeber: Tipps & Hintergrundwissen" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SEO-Text Unten (500–600 Wörter — längster Block)</label>
          <textarea value={seoBottom} onChange={(e) => setSeoBottom(e.target.value)} rows={10} placeholder="Ausführlicher Ratgeber-Text ganz unten auf der Seite. Dieser muss der längste Textblock sein.  Absätze mit Leerzeile trennen." className={inputClass + " resize-y"} />
          <TextPreview text={seoBottom} />
        </div>
      </div>

      {/* ── Artikel-Einstellungen ────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 space-y-4 bg-gray-800/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          ⚙️ Artikel-Einstellungen
        </h3>
        <div>
          <label className={labelClass}>Lead / Einleitung</label>
          <textarea value={lead} onChange={(e) => setLead(e.target.value)} rows={2} placeholder="Packende Einleitung..." className={inputClass + " resize-y"} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Lesezeit (Min.)</label>
            <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} min={1} max={30} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Hero-Bild URL</label>
          <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://images.unsplash.com/..." className={inputClass} />
        </div>
      </div>

      {/* ── Sections ────────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 bg-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📄 Inhalt ({sections.length} Abschnitte)</h3>
          <button onClick={() => setSections((p) => [...p, { heading: "", body: "" }])} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold">
            <Plus className="w-3.5 h-3.5" /> Abschnitt
          </button>
        </div>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500">Abschnitt {i + 1}</span>
                <button onClick={() => setSections((p) => p.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input value={s.heading} onChange={(e) => updateSection(i, "heading", e.target.value)} placeholder="H2-Überschrift" className={inputClass + " font-semibold mb-2"} />
              <textarea value={s.body} onChange={(e) => updateSection(i, "body", e.target.value)} rows={5} placeholder="Inhalt..." className={inputClass + " resize-y"} />
              <p className="text-[10px] text-gray-600 mt-1 text-right">{s.body.split(/\s+/).filter(Boolean).length} Wörter</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQs ────────────────────────────────────────────────────────── */}
      <div className="border border-gray-700 rounded-xl p-5 bg-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">❓ FAQs ({faqs.length})</h3>
          <button onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold">
            <Plus className="w-3.5 h-3.5" /> FAQ
          </button>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500">FAQ {i + 1}</span>
                <button onClick={() => setFaqs((p) => p.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Frage" className={inputClass + " font-semibold mb-2"} />
              <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} placeholder="Antwort" className={inputClass + " resize-y"} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Message ─────────────────────────────────────────────────────── */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          message.type === "success" ? "bg-teal-900/40 text-teal-300 border border-teal-700"
          : message.type === "info" ? "bg-blue-900/40 text-blue-300 border border-blue-700"
          : "bg-red-900/40 text-red-300 border border-red-700"
        }`}>{message.text}</div>
      )}

      {/* ── Save Button ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Speichert…" : "Alles speichern"}
        </button>
        <a href={`/ratgeber/${slug}/`} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-400 hover:underline">
          Im Frontend ansehen →
        </a>
      </div>
    </div>
  );
}
