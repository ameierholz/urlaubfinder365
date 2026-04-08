"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface DestinationSeoData {
  seo_intro?: string | null;
  seo_middle?: string | null;
  seo_bottom?: string | null;
  seo_h2_middle?: string | null;
  seo_h2_bottom?: string | null;
}

interface Props {
  slug: string;
  name: string;
  initial?: DestinationSeoData | null;
}

function TextPreview({ text }: { text: string }) {
  if (!text.trim()) return null;
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="mt-2 p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
      <p className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold mb-2">Vorschau</p>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-400 text-xs leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function DestinationSeoForm({ slug, name, initial }: Props) {
  const [seoIntro, setSeoIntro] = useState(initial?.seo_intro ?? "");
  const [seoH2Middle, setSeoH2Middle] = useState(initial?.seo_h2_middle ?? "");
  const [seoMiddle, setSeoMiddle] = useState(initial?.seo_middle ?? "");
  const [seoH2Bottom, setSeoH2Bottom] = useState(initial?.seo_h2_bottom ?? "");
  const [seoBottom, setSeoBottom] = useState(initial?.seo_bottom ?? "");
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
      const { error } = await supabase.from("destination_seo_texts").upsert(
        {
          slug,
          seo_intro: seoIntro || null,
          seo_h2_middle: seoH2Middle || null,
          seo_middle: seoMiddle || null,
          seo_h2_bottom: seoH2Bottom || null,
          seo_bottom: seoBottom || null,
        },
        { onConflict: "slug" }
      );
      if (error) throw error;
      setMessage({ type: "success", text: `SEO-Texte für „${name}" erfolgreich gespeichert.` });
    } catch (err) {
      setMessage({ type: "error", text: "Fehler beim Speichern: " + String(err) });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 placeholder-gray-600";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1";
  const sectionClass = "border-t border-gray-800 pt-5";

  return (
    <div className="space-y-6">
      {/* Intro Text */}
      <div>
        <label className={labelClass}>SEO-Intro (oberhalb der Angebote)</label>
        <textarea
          value={seoIntro}
          onChange={(e) => setSeoIntro(e.target.value)}
          rows={3}
          placeholder={`Kurzer Einleitungstext für ${name} – erscheint oben auf der Seite…`}
          className={inputClass + " resize-y"}
        />
        <TextPreview text={seoIntro} />
      </div>

      {/* Middle Section */}
      <div className={sectionClass}>
        <div className="mb-4">
          <label className={labelClass}>H2-Überschrift (Mitte)</label>
          <input
            type="text"
            value={seoH2Middle}
            onChange={(e) => setSeoH2Middle(e.target.value)}
            placeholder={`z. B. Reiseziel ${name}: Alle Informationen auf einen Blick`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>SEO-Text Mitte</label>
          <textarea
            value={seoMiddle}
            onChange={(e) => setSeoMiddle(e.target.value)}
            rows={8}
            placeholder={`Ausführlicher Infotext über ${name}…\n\nAbsätze mit Leerzeile trennen.`}
            className={inputClass + " resize-y"}
          />
          <TextPreview text={seoMiddle} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className={sectionClass}>
        <div className="mb-4">
          <label className={labelClass}>H2-Überschrift (unten)</label>
          <input
            type="text"
            value={seoH2Bottom}
            onChange={(e) => setSeoH2Bottom(e.target.value)}
            placeholder={`z. B. Tipps & Wissenswertes für Ihren ${name}-Urlaub`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>SEO-Text unten</label>
          <textarea
            value={seoBottom}
            onChange={(e) => setSeoBottom(e.target.value)}
            rows={6}
            placeholder={`Abschließender SEO-Text für ${name}…\n\nAbsätze mit Leerzeile trennen.`}
            className={inputClass + " resize-y"}
          />
          <TextPreview text={seoBottom} />
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

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
      >
        {saving ? "Speichern…" : "SEO-Texte speichern"}
      </button>
    </div>
  );
}
