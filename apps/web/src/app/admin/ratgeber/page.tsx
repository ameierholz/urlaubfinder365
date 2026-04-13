"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Check, AlertCircle, Loader2 } from "lucide-react";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface DbRow {
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  lead: string | null;
  sections: unknown[] | null;
  faqs: unknown[] | null;
  updated_at: string | null;
}

export default function AdminRatgeberPage() {
  const [dbData, setDbData] = useState<Record<string, DbRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createSupabaseBrowser();
    sb.from("ratgeber_seo_texts" as never)
      .select("slug, seo_title, seo_description, lead, sections, faqs, updated_at")
      .then(({ data: raw, error }) => {
        if (error) { console.error("[ratgeber] query error:", error); setLoading(false); return; }
        const map: Record<string, DbRow> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const row of (raw ?? []) as any[]) map[row.slug as string] = row as DbRow;
        setDbData(map);
        setLoading(false);
      });
  }, []);

  const articles = RATGEBER_ARTICLES.map((a) => {
    const db = dbData[a.slug];
    const hasSeo = !!db?.seo_title && !!db?.seo_description;
    const hasSections = Array.isArray(db?.sections) && db.sections.length > 0;
    const hasFaqs = Array.isArray(db?.faqs) && db.faqs.length > 0;
    const score = [hasSeo, hasSections, hasFaqs].filter(Boolean).length;
    return { ...a, db, hasSeo, hasSections, hasFaqs, score };
  });

  const total = articles.length;
  const complete = articles.filter((a) => a.score === 3).length;
  const partial = articles.filter((a) => a.score > 0 && a.score < 3).length;
  const empty = articles.filter((a) => a.score === 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Ratgeber-Artikel
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            SEO-Texte und Inhalte für {total} Ratgeber-Artikel verwalten
          </p>
        </div>
      </div>

      {/* Score-Übersicht */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-green-600">{complete}</p>
          <p className="text-xs text-green-700 font-semibold">Vollständig</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-amber-600">{partial}</p>
          <p className="text-xs text-amber-700 font-semibold">Teilweise</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-red-600">{empty}</p>
          <p className="text-xs text-red-700 font-semibold">Ohne KI-Content</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Artikel</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Kategorie</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">SEO</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Sections</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">FAQs</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.slug} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/ratgeber/${a.slug}/`} className="font-semibold text-gray-800 hover:text-teal-600 transition-colors">
                      {a.title}
                    </Link>
                    {a.db?.updated_at && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Zuletzt: {new Date(a.db.updated_at).toLocaleDateString("de-DE")}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                      {a.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.hasSeo
                      ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                      : <AlertCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.hasSections
                      ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                      : <AlertCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.hasFaqs
                      ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                      : <AlertCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/ratgeber/${a.slug}/`}
                      className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
