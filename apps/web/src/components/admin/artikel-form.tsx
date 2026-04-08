"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Loader2, Save } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export interface Category {
  id: string;
  name: string;
  slug: string;
}

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
  status: string;
}

interface Props {
  article?: ExistingArticle;
  categories: Category[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const INPUT = "w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F] transition-colors text-sm";
const LABEL = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide";

export default function ArtikelForm({ article, categories }: Props) {
  const isEdit = !!article;
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? (categories[0]?.id ?? ""));
  const [authorName, setAuthorName] = useState(article?.author_name ?? "Redaktion");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [metaTitle, setMetaTitle] = useState(article?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(article?.focus_keyword ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      setSlug(slugify(title));
    }
  }, [title, isEdit]);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) { setError("Titel ist erforderlich."); return; }
    if (!slug.trim()) { setError("Slug ist erforderlich."); return; }
    if (!categoryId) { setError("Bitte eine Kategorie wählen."); return; }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category_id: categoryId,
      author_name: authorName.trim() || "Redaktion",
      excerpt: excerpt.trim(),
      cover_image: coverImage.trim(),
      content,
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
      focus_keyword: focusKeyword.trim(),
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
      setError(err.message);
    } else {
      router.push("/admin/magazin/");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Titel & Slug */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Grunddaten</h2>

        <div>
          <label className={LABEL}>Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Artikeltitel eingeben …"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Slug {isEdit ? "(schreibgeschützt)" : "(auto-generiert)"}</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => !isEdit && setSlug(e.target.value)}
            readOnly={isEdit}
            className={`${INPUT} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Kategorie *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={INPUT}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Autor</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Redaktion"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Teaser / Excerpt</label>
          <textarea
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Kurze Zusammenfassung des Artikels …"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Cover-Bild URL</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className={INPUT}
          />
        </div>
      </div>

      {/* Markdown Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Inhalt (Markdown)</h2>
        <div data-color-mode="dark" className="rounded-xl overflow-hidden">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? "")}
            height={500}
            preview="live"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">SEO</h2>

        <div>
          <label className={LABEL}>
            Meta-Titel{" "}
            <span className={`ml-1 ${metaTitle.length > 60 ? "text-red-400" : "text-gray-500"}`}>
              {metaTitle.length}/60
            </span>
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={80}
            placeholder="SEO-optimierter Titel …"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>
            Meta-Description{" "}
            <span className={`ml-1 ${metaDescription.length > 160 ? "text-red-400" : "text-gray-500"}`}>
              {metaDescription.length}/160
            </span>
          </label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={200}
            placeholder="SEO-Beschreibung für Suchmaschinen …"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Focus-Keyword</label>
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="z. B. Mallorca Reisetipps"
            className={INPUT}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => router.push("/admin/magazin/")}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00838F] hover:bg-[#006b75] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Speichern" : "Artikel anlegen"}
        </button>
      </div>
    </div>
  );
}
