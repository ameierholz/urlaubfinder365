import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelStatusButton from "@/components/admin/artikel-status-button";
import Link from "next/link";
import { Newspaper, PlusCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Urlaubsmagazin | Admin" };

/* ── Scoring (same logic as SEO/Destinations/Ratgeber) ────────────────────── */

function calcScore(a: Article): number {
  let s = 0;
  if (a.meta_title && a.meta_title.length >= 20 && a.meta_title.length <= 65) s += 25; else if (a.meta_title) s += 12;
  if (a.meta_description && a.meta_description.length >= 100 && a.meta_description.length <= 165) s += 25; else if (a.meta_description) s += 12;
  if (a.focus_keyword) s += 20;
  if (a.keywords) s += 10;
  if (a.excerpt) s += 10;
  if (a.cover_image) s += 10;
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

const STATUS: Record<string, { label: string; cls: string }> = {
  entwurf:         { label: "Entwurf",          cls: "text-gray-500 bg-gray-800/30 border-gray-700" },
  veroeffentlicht: { label: "Veröffentlicht",   cls: "text-emerald-400 bg-emerald-900/30 border-emerald-800" },
};

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  keywords: string | null;
  excerpt: string | null;
  cover_image: string | null;
  magazin_categories: { name: string } | null;
}

export default async function AdminMagazinPage() {
  const supabase = await createSupabaseServer();

  const { data: articles } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, status, published_at, updated_at, meta_title, meta_description, focus_keyword, keywords, excerpt, cover_image, magazin_categories(name)")
    .order("updated_at", { ascending: false }) as { data: Article[] | null };

  const list = articles ?? [];
  const scores = list.map((a) => calcScore(a));
  const withSeo = scores.filter((s) => s >= 50).length;
  const withoutSeo = list.length - withSeo;
  const avgScore = list.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / list.length) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <Newspaper className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Magazin</h1>
            <p className="text-sm text-gray-500">SEO-Metadaten & Inhalte für alle Magazin-Artikel</p>
          </div>
        </div>
        <Link
          href="/admin/magazin/neu/"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Neuer Artikel
        </Link>
      </div>

      {/* Stats (4-col, dark, same as SEO/Destinations/Ratgeber) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{list.length}</p>
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

      {/* Table (same pattern as SEO Pages/Destinations/Ratgeber) */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[160px]">Pfad</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[55px]">Score</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Meta Title</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Meta Description</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[110px]">Focus KW</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[50px]">KWs</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[60px]">Update</th>
              <th className="w-[70px] px-2 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((a, i) => {
              const st = STATUS[a.status] ?? STATUS.entwurf;
              const titleLen = a.meta_title?.length ?? 0;
              const descLen = a.meta_description?.length ?? 0;
              const titleOk = titleLen >= 30 && titleLen <= 60;
              const descOk = descLen >= 120 && descLen <= 160;
              const titleHasKw = a.focus_keyword && a.meta_title?.toLowerCase().includes(a.focus_keyword.toLowerCase());
              const descHasKw = a.focus_keyword && a.meta_description?.toLowerCase().includes(a.focus_keyword.toLowerCase());
              const kwCount = a.keywords ? a.keywords.split(",").length : 0;
              const updated = new Date(a.updated_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
              return (
                <tr key={a.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-2 text-[11px]">
                    <span className="text-gray-300 line-clamp-1">{a.title}</span>
                    <p className="text-gray-600 text-[10px] flex items-center gap-1.5">
                      /magazin/{a.slug}/ <span className={`inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-bold border ${st.cls}`}>{st.label}</span>
                    </p>
                  </td>
                  <td className="px-2 py-2"><ScoreBadge score={scores[i]} /></td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">
                    {a.meta_title ? (
                      <div title={a.meta_title}>
                        <span className="line-clamp-2">{a.meta_title}</span>
                        <span className={`text-[10px] font-mono ${titleOk ? "text-green-500" : "text-red-400"}`}>{titleLen}Z</span>
                        {a.focus_keyword && <span className={`text-[10px] ml-1 ${titleHasKw ? "text-green-500" : "text-red-400"}`}>KW</span>}
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">
                    {a.meta_description ? (
                      <div title={a.meta_description}>
                        <span className="line-clamp-2">{a.meta_description}</span>
                        <span className={`text-[10px] font-mono ${descOk ? "text-green-500" : "text-red-400"}`}>{descLen}Z</span>
                        {a.focus_keyword && <span className={`text-[10px] ml-1 ${descHasKw ? "text-green-500" : "text-red-400"}`}>KW</span>}
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-400 truncate" title={a.focus_keyword || ""}>{a.focus_keyword || <span className="text-gray-600">—</span>}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-500 text-center">{kwCount > 0 ? kwCount : <span className="text-gray-600">—</span>}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-500">{updated}</td>
                  <td className="px-2 py-2">
                    <Link href={`/admin/magazin/${a.id}/`} className="text-teal-400 hover:text-teal-300 text-[11px] font-semibold transition-colors whitespace-nowrap">
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-sm">
                  Noch keine Artikel vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
