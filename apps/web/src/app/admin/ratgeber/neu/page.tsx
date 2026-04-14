"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Sparkles, Loader2, Save } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function AdminRatgeberNeuPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isKi = searchParams.get("ki") === "1";

  const [kiTopic, setKiTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [keywords, setKeywords] = useState("");
  const [lead, setLead] = useState("");
  const [sections, setSections] = useState<{ heading: string; body: string }[]>([
    { heading: "", body: "" },
  ]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: "", answer: "" },
  ]);

  const generateWithKi = async () => {
    if (!kiTopic.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/admin/generate-ratgeber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: kiTopic }),
      });
      const data = await res.json();
      if (data.error) { alert(`Fehler: ${data.error}`); setGenerating(false); return; }

      setSlug(data.slug || kiTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""));
      setTitle(data.title || "");
      setSeoTitle(data.seo_title || "");
      setSeoDescription(data.seo_description || "");
      setFocusKeyword(data.focus_keyword || "");
      setKeywords(data.keywords || "");
      setLead(data.lead || "");
      setSections(data.sections || [{ heading: "", body: "" }]);
      setFaqs(data.faqs || [{ question: "", answer: "" }]);
    } catch (err) {
      alert(`Netzwerkfehler: ${String(err)}`);
    }
    setGenerating(false);
  };

  const saveRatgeber = async () => {
    if (!slug || !title) { alert("Slug und Titel sind Pflicht"); return; }
    setSaving(true);

    const sb = createSupabaseBrowser();
    const { error } = await sb.from("ratgeber_seo_texts" as never).upsert({
      slug,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      focus_keyword: focusKeyword || null,
      keywords: keywords || null,
      lead: lead || null,
      sections: sections.filter((s) => s.heading || s.body),
      faqs: faqs.filter((f) => f.question || f.answer),
    } as never, { onConflict: "slug" } as never);

    if (error) { alert(`Fehler: ${error.message}`); setSaving(false); return; }

    router.push("/admin/ratgeber/");
  };

  const addSection = () => setSections([...sections, { heading: "", body: "" }]);
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/ratgeber" className="hover:text-gray-300 transition-colors">Ratgeber</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Neuer Ratgeber</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <BookOpen className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">
            {isKi ? "Ratgeber mit KI generieren" : "Neuer Ratgeber"}
          </h1>
          <p className="text-sm text-gray-500">
            {isKi ? "Gib ein Thema ein und die KI erstellt den kompletten Artikel" : "Manuell einen neuen Ratgeber-Artikel anlegen"}
          </p>
        </div>
      </div>

      {/* KI Generator */}
      {isKi && (
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">KI-Generierung</span>
          </div>
          <p className="text-xs text-purple-400/70 mb-4">
            Gib ein Thema ein (z.B. &quot;Reiseapotheke Checkliste&quot;, &quot;Jetlag vermeiden&quot;, &quot;Reisen mit Baby&quot;).
            Die KI erstellt Titel, SEO-Daten, Einleitung, Abschnitte und FAQs.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={kiTopic}
              onChange={(e) => setKiTopic(e.target.value)}
              placeholder="Thema eingeben..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && generateWithKi()}
            />
            <button
              onClick={generateWithKi}
              disabled={generating || !kiTopic.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "Generiert..." : "Generieren"}
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Basics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="z-b-reiseapotheke-checkliste"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Titel</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reiseapotheke Checkliste: Was muss mit?"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
          </div>
        </div>

        {/* SEO */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">SEO-Metadaten</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Meta Title</label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Focus Keyword</label>
              <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-gray-500 mb-1 block">Meta Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
          </div>
          <div className="mt-4">
            <label className="text-xs text-gray-500 mb-1 block">Weitere Keywords (kommagetrennt)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
          </div>
        </div>

        {/* Lead */}
        <div className="border-t border-gray-800 pt-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Einleitung</label>
          <textarea value={lead} onChange={(e) => setLead(e.target.value)} rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
        </div>

        {/* Sections */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Abschnitte</p>
            <button onClick={addSection} className="text-xs text-teal-400 hover:text-teal-300 font-semibold">+ Abschnitt</button>
          </div>
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <input type="text" value={s.heading} onChange={(e) => { const n = [...sections]; n[i].heading = e.target.value; setSections(n); }}
                  placeholder={`H2 Überschrift ${i + 1}`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
                <textarea value={s.body} onChange={(e) => { const n = [...sections]; n[i].body = e.target.value; setSections(n); }}
                  placeholder="Inhalt..." rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">FAQs</p>
            <button onClick={addFaq} className="text-xs text-teal-400 hover:text-teal-300 font-semibold">+ FAQ</button>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <input type="text" value={f.question} onChange={(e) => { const n = [...faqs]; n[i].question = e.target.value; setFaqs(n); }}
                  placeholder={`Frage ${i + 1}`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
                <textarea value={f.answer} onChange={(e) => { const n = [...faqs]; n[i].answer = e.target.value; setFaqs(n); }}
                  placeholder="Antwort..." rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="border-t border-gray-800 pt-6 flex justify-end">
          <button
            onClick={saveRatgeber}
            disabled={saving || !slug || !title}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Speichert..." : "Ratgeber speichern"}
          </button>
        </div>
      </div>

      {/* Back */}
      <div className="mt-6">
        <Link href="/admin/ratgeber" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Zurück zur Ratgeber-Übersicht
        </Link>
      </div>
    </div>
  );
}
