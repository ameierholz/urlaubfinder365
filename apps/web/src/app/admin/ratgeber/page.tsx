"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, PlusCircle, Sparkles } from "lucide-react";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

function calcScore(db: DbRow | undefined, article: typeof RATGEBER_ARTICLES[0]): number {
  let s = 0;
  const title = db?.seo_title || article.seoTitle;
  const desc = db?.seo_description || article.seoDescription;
  const kw = db?.focus_keyword;
  const sections = db?.sections;
  const faqs = db?.faqs;

  if (title && title.length >= 20 && title.length <= 65) s += 20; else if (title) s += 10;
  if (desc && desc.length >= 100 && desc.length <= 165) s += 20; else if (desc) s += 10;
  if (kw) s += 15;
  if (db?.keywords) s += 10;
  if (Array.isArray(sections) && sections.length >= 3) s += 20; else if (Array.isArray(sections) && sections.length > 0) s += 10;
  if (Array.isArray(faqs) && faqs.length >= 3) s += 15; else if (Array.isArray(faqs) && faqs.length > 0) s += 8;
  return Math.min(s, 100);
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-400 bg-green-900/30 border-green-800"
    : score >= 50 ? "text-yellow-400 bg-yellow-900/30 border-yellow-800"
    : score > 0 ? "text-orange-400 bg-orange-900/30 border-orange-800"
    : "text-gray-500 bg-gray-800/30 border-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${color}`}>
      {score}/100
    </span>
  );
}

interface DbRow {
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  keywords: string | null;
  lead: string | null;
  sections: unknown[] | null;
  faqs: unknown[] | null;
  updated_at: string | null;
}

function countWords(db: DbRow | undefined): number {
  if (!db) return 0;
  let text = db.lead || "";
  if (Array.isArray(db.sections)) {
    for (const s of db.sections) {
      const sec = s as { heading?: string; body?: string };
      if (sec.heading) text += " " + sec.heading;
      if (sec.body) text += " " + sec.body;
    }
  }
  if (Array.isArray(db.faqs)) {
    for (const f of db.faqs) {
      const faq = f as { question?: string; answer?: string };
      if (faq.question) text += " " + faq.question;
      if (faq.answer) text += " " + faq.answer;
    }
  }
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function AdminRatgeberPage() {
  const [dbData, setDbData] = useState<Record<string, DbRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createSupabaseBrowser();
    sb.from("ratgeber_seo_texts" as never)
      .select("slug, seo_title, seo_description, focus_keyword, keywords, lead, sections, faqs, updated_at")
      .then(({ data: raw, error }) => {
        if (error) { console.error("[ratgeber] query error:", error); setLoading(false); return; }
        const map: Record<string, DbRow> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const row of (raw ?? []) as any[]) map[row.slug as string] = row as DbRow;
        setDbData(map);
        setLoading(false);
      });
  }, []);

  const rows = RATGEBER_ARTICLES.map((a) => {
    const db = dbData[a.slug];
    const score = calcScore(db, a);
    const wc = countWords(db);
    return { ...a, db, score, wc };
  });

  const withSeo = rows.filter((r) => r.score >= 50).length;
  const withoutSeo = rows.length - withSeo;
  const avgScore = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-400" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <BookOpen className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Ratgeber</h1>
            <p className="text-sm text-gray-500">SEO-Metadaten & Inhalte für alle Ratgeber-Artikel</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/ratgeber/neu/"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Neuer Ratgeber
          </Link>
          <Link
            href="/admin/ratgeber/neu/?ki=1"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Mit KI generieren
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{rows.length}</p>
          <p className="text-xs text-gray-500 mt-1">Artikel gesamt</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-teal-400">{withSeo}</p>
          <p className="text-xs text-gray-500 mt-1">Mit SEO-Daten</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-gray-500">{withoutSeo}</p>
          <p className="text-xs text-gray-500 mt-1">Ohne SEO-Daten</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className={`text-2xl font-black ${avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>{avgScore}%</p>
          <p className="text-xs text-gray-500 mt-1">Ø SEO-Score</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pfad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Meta Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Meta Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Focus Keyword</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Weitere Keywords</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wörter</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Update</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const title = r.db?.seo_title || r.seoTitle;
              const desc = r.db?.seo_description || r.seoDescription;
              const kw = r.db?.focus_keyword;
              const updated = r.db?.updated_at ? new Date(r.db.updated_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }) : null;
              return (
                <tr key={r.slug} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-gray-300 text-xs whitespace-nowrap">/ratgeber/{r.slug}/</td>
                  <td className="px-4 py-2.5"><ScoreBadge score={r.score} /></td>
                  <td className="px-4 py-2.5 text-xs text-gray-400">
                    {title ? (
                      <div>
                        <span>{title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-mono ${title.length >= 30 && title.length <= 60 ? "text-green-500" : "text-red-400"}`}>
                            {title.length} Z.
                          </span>
                          {kw && (
                            title.toLowerCase().includes(kw.toLowerCase())
                              ? <span className="text-[10px] text-green-500">KW</span>
                              : <span className="text-[10px] text-red-400">KW</span>
                          )}
                        </div>
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 max-w-xs">
                    {desc ? (
                      <div>
                        <span>{desc}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-mono ${desc.length >= 120 && desc.length <= 160 ? "text-green-500" : "text-red-400"}`}>
                            {desc.length} Z.
                          </span>
                          {kw && (
                            desc.toLowerCase().includes(kw.toLowerCase())
                              ? <span className="text-[10px] text-green-500">KW</span>
                              : <span className="text-[10px] text-red-400">KW</span>
                          )}
                        </div>
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">{kw || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{r.db?.keywords || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{r.wc > 0 ? r.wc.toLocaleString("de-DE") : <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">{updated || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/ratgeber/${r.slug}/`} className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors whitespace-nowrap">
                      Bearbeiten →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
