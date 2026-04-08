"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { PageSeoMeta } from "@/lib/seo-meta";

interface Props {
  pagePath: string;
  initial?: PageSeoMeta | null;
}

export default function SeoMetaForm({ pagePath, initial }: Props) {
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initial?.focus_keyword ?? "");
  const [additionalKeywords, setAdditionalKeywords] = useState(
    initial?.additional_keywords?.join(", ") ?? ""
  );
  const [ogTitle, setOgTitle] = useState(initial?.og_title ?? "");
  const [ogDescription, setOgDescription] = useState(initial?.og_description ?? "");
  const [ogImage, setOgImage] = useState(initial?.og_image ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
      const keywords = additionalKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const { error } = await supabase.from("page_seo_meta").upsert(
        {
          page_path: pagePath,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          focus_keyword: focusKeyword || null,
          additional_keywords: keywords.length > 0 ? keywords : null,
          og_title: ogTitle || null,
          og_description: ogDescription || null,
          og_image: ogImage || null,
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
      {/* Meta Title */}
      <div>
        <label className={labelClass}>
          Meta Title
          <span className={`ml-2 font-normal normal-case ${metaTitle.length > 60 ? "text-red-400" : "text-gray-500"}`}>
            {metaTitle.length}/60
          </span>
        </label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          maxLength={80}
          placeholder="Seitentitel für Suchmaschinen (max. 60 Zeichen)"
          className={inputClass}
        />
        {metaTitle.length > 60 && (
          <p className="mt-1 text-xs text-red-400">Empfehlung: max. 60 Zeichen</p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <label className={labelClass}>
          Meta Description
          <span className={`ml-2 font-normal normal-case ${metaDescription.length > 160 ? "text-red-400" : "text-gray-500"}`}>
            {metaDescription.length}/160
          </span>
        </label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          maxLength={200}
          placeholder="Kurzbeschreibung für Suchmaschinen (max. 160 Zeichen)"
          className={inputClass + " resize-none"}
        />
        {metaDescription.length > 160 && (
          <p className="mt-1 text-xs text-red-400">Empfehlung: max. 160 Zeichen</p>
        )}
      </div>

      {/* Focus Keyword */}
      <div>
        <label className={labelClass}>Focus Keyword</label>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => setFocusKeyword(e.target.value)}
          placeholder="z. B. Antalya Urlaub"
          className={inputClass}
        />
      </div>

      {/* Additional Keywords */}
      <div>
        <label className={labelClass}>Weitere Keywords (kommagetrennt)</label>
        <input
          type="text"
          value={additionalKeywords}
          onChange={(e) => setAdditionalKeywords(e.target.value)}
          placeholder="z. B. Türkei Urlaub, All Inclusive, Pauschalreise"
          className={inputClass}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Open Graph (Social Media)</p>

        {/* OG Title */}
        <div className="mb-4">
          <label className={labelClass}>OG Title</label>
          <input
            type="text"
            value={ogTitle}
            onChange={(e) => setOgTitle(e.target.value)}
            placeholder="Titel für Social-Media-Vorschau (Standard: Meta Title)"
            className={inputClass}
          />
        </div>

        {/* OG Description */}
        <div className="mb-4">
          <label className={labelClass}>OG Description</label>
          <textarea
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            rows={2}
            placeholder="Beschreibung für Social-Media-Vorschau"
            className={inputClass + " resize-none"}
          />
        </div>

        {/* OG Image */}
        <div>
          <label className={labelClass}>OG Image URL</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://... (empfohlen: 1200×630 px)"
            className={inputClass}
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-teal-900/40 text-teal-300 border border-teal-700"
              : "bg-red-900/40 text-red-300 border border-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
      >
        {saving ? "Speichern…" : "SEO-Daten speichern"}
      </button>
    </div>
  );
}
