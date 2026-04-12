"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, Save, Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface Section { heading: string; body: string }
interface Faq { question: string; answer: string }

export default function AdminRatgeberEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const article = RATGEBER_ARTICLES.find((a) => a.slug === slug);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Form state
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [lead, setLead] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [category, setCategory] = useState("");
  const [readingTime, setReadingTime] = useState(6);
  const [sections, setSections] = useState<Section[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Load existing data from DB (or fallback to static)
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
          setSeoTitle((data.seo_title as string) ?? "");
          setSeoDescription((data.seo_description as string) ?? "");
          setLead((data.lead as string) ?? "");
          setHeroImage((data.hero_image as string) ?? "");
          setCategory((data.category as string) ?? article.category);
          setReadingTime(Number(data.reading_time_min) || article.readingTimeMin);
          setSections(Array.isArray(data.sections) ? data.sections as Section[] : []);
          setFaqs(Array.isArray(data.faqs) ? data.faqs as Faq[] : []);
        } else {
          // Fallback: statische Daten laden
          setSeoTitle(article.seoTitle);
          setSeoDescription(article.seoDescription);
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

  async function handleGenerate() {
    if (!article) return;
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/generate-ratgeber-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title: article.title, category, existingLead: lead }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      if (data.seo_title) setSeoTitle(data.seo_title);
      if (data.seo_description) setSeoDescription(data.seo_description);
      if (data.lead) setLead(data.lead);
      if (data.reading_time_min) setReadingTime(Number(data.reading_time_min));
      if (Array.isArray(data.sections)) setSections(data.sections);
      if (Array.isArray(data.faqs)) setFaqs(data.faqs);
      setMessage({ type: "ok", text: "KI-Inhalte generiert! Prüfen und speichern." });
    } catch (err) {
      setMessage({ type: "err", text: `Fehler: ${err}` });
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
          seo_title: seoTitle, seo_description: seoDescription,
          lead, hero_image: heroImage, category,
          reading_time_min: readingTime,
          sections, faqs,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage({ type: "ok", text: "Gespeichert!" });
    } catch (err) {
      setMessage({ type: "err", text: `Fehler: ${err}` });
    } finally {
      setSaving(false);
    }
  }

  function updateSection(i: number, field: keyof Section, val: string) {
    setSections((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  function removeSection(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", body: "" }]);
  }

  function updateFaq(i: number, field: keyof Faq, val: string) {
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  }

  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Artikel nicht gefunden.</p>
        <Link href="/admin/ratgeber/" className="text-teal-600 hover:underline mt-2 inline-block">← Zurück</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  const CATEGORIES = ["Buchung", "Verpflegung", "Preise", "Planung", "Sicherheit", "Familie", "Trends", "Reisemittel", "Nachhaltigkeit"];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/ratgeber/")} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            {article.title}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">/ratgeber/{slug}/</p>
        </div>
      </div>

      {/* Aktions-Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? "KI generiert..." : "Mit KI generieren"}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Speichert..." : "Speichern"}
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${message.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* SEO-Felder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">SEO-Metadaten</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">SEO-Titel ({seoTitle.length}/58)</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Meta-Description ({seoDescription.length}/155)</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Lead / Einleitung</label>
            <textarea value={lead} onChange={(e) => setLead(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Kategorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Lesezeit (Min.)</label>
              <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} min={1} max={30} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Hero-Bild URL</label>
            <input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Inhalt ({sections.length} Abschnitte)</h2>
          <button onClick={addSection} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold">
            <Plus className="w-3.5 h-3.5" /> Abschnitt
          </button>
        </div>
        <div className="space-y-5">
          {sections.map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">Abschnitt {i + 1}</span>
                <button onClick={() => removeSection(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input
                value={s.heading}
                onChange={(e) => updateSection(i, "heading", e.target.value)}
                placeholder="H2-Überschrift"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <textarea
                value={s.body}
                onChange={(e) => updateSection(i, "body", e.target.value)}
                rows={5}
                placeholder="Inhalt..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">{s.body.split(/\s+/).filter(Boolean).length} Wörter</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">FAQs ({faqs.length})</h2>
          <button onClick={addFaq} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold">
            <Plus className="w-3.5 h-3.5" /> FAQ
          </button>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">FAQ {i + 1}</span>
                <button onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input
                value={f.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
                placeholder="Frage"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <textarea
                value={f.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                rows={3}
                placeholder="Antwort"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Vorschau-Link */}
      <div className="text-center mb-10">
        <a
          href={`/ratgeber/${slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:underline font-semibold"
        >
          Artikel im Frontend ansehen →
        </a>
      </div>
    </div>
  );
}
