import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Globe, Info } from "lucide-react";

import { PAUSCHAL_KOMBIS } from "@/lib/pauschalreisen-kombi-data";
import { SEASON_GUIDES } from "@/lib/season-guide-data";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";

const STATIC_PATHS = [
  "/guenstig-urlaub-buchen", "/last-minute", "/hotelsuche", "/flugsuche",
  "/kreuzfahrten", "/mietwagen", "/aktivitaeten",
  "/urlaubsarten/all-inclusive-urlaub", "/urlaubsarten/pauschalreisen",
  "/urlaubsarten/last-minute-urlaub", "/urlaubsarten/super-last-minute-urlaub",
  "/urlaubsarten/fruhbucher-urlaub",
  "/urlaubsthemen/familienurlaub", "/urlaubsthemen/strandurlaub",
  "/urlaubsthemen/wellnessurlaub", "/urlaubsthemen/singlereisen",
  "/urlaubsthemen/luxusurlaub", "/urlaubsthemen/abenteuerurlaub",
  "/urlaubsthemen/aktivurlaub", "/urlaubsthemen/staedtereisen",
  "/urlaubsthemen/hochzeitsreise", "/urlaubsthemen/seniorenreisen",
  "/urlaubsthemen/adults-only", "/urlaubsthemen/kurreisen",
  "/urlaubsthemen/budget-bis-500", "/urlaubsthemen/budget-bis-1000",
  "/urlaubsthemen/budget-bis-1500", "/urlaubsthemen/budget-bis-2000",
  "/reisewarnungen", "/visum-checker", "/preisentwicklung",
  "/reiseversicherung", "/ki-reiseplaner", "/community", "/feed",
  "/urlaubsguides", "/magazin",
  "/pauschalreisen", "/ratgeber", "/reiseziele",
];

const PAUSCHAL_PATHS = PAUSCHAL_KOMBIS.map((k) => `/pauschalreisen/${k.slug}`);
const RATGEBER_PATHS = RATGEBER_ARTICLES.map((a) => `/ratgeber/${a.slug}`);
const SEASON_PATHS   = SEASON_GUIDES.map((g) => `/reiseziele/${g.slug}`);

const KNOWN_PATHS = [
  ...STATIC_PATHS,
  ...PAUSCHAL_PATHS,
  ...RATGEBER_PATHS,
  ...SEASON_PATHS,
];

interface SeoRow {
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  additional_keywords: string[] | null;
  seo_intro: string | null;
  seo_middle: string | null;
  seo_bottom: string | null;
  updated_at: string | null;
}

function calcScore(row: SeoRow | undefined): number {
  if (!row) return 0;
  let score = 0;
  if (row.meta_title) {
    score += 10;
    if (row.meta_title.length >= 30 && row.meta_title.length <= 60) score += 15;
    else if (row.meta_title.length > 0) score += 5;
    if (row.focus_keyword && row.meta_title.toLowerCase().includes(row.focus_keyword.toLowerCase())) score += 5;
  }
  if (row.meta_description) {
    score += 10;
    if (row.meta_description.length >= 120 && row.meta_description.length <= 160) score += 15;
    else if (row.meta_description.length >= 80) score += 8;
    if (row.focus_keyword && row.meta_description.toLowerCase().includes(row.focus_keyword.toLowerCase())) score += 5;
  }
  if (row.focus_keyword) score += 20;
  if (row.additional_keywords && row.additional_keywords.length > 0) {
    score += Math.min(20, row.additional_keywords.length * 5);
  }
  return Math.min(100, score);
}

function wordCount(row: SeoRow | undefined): number {
  if (!row) return 0;
  const text = [row.seo_intro, row.seo_middle, row.seo_bottom].filter(Boolean).join(" ");
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
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

function WordBadge({ count }: { count: number }) {
  const color = count >= 3000 ? "text-green-400" : count >= 1500 ? "text-yellow-400" : count > 0 ? "text-orange-400" : "text-gray-600";
  return <span className={`text-xs font-mono ${color}`}>{count > 0 ? count.toLocaleString("de-DE") : "—"}</span>;
}

export default async function SeoAdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: allMeta } = await supabase
    .from("page_seo_meta")
    .select("page_path, meta_title, meta_description, focus_keyword, additional_keywords, seo_intro, seo_middle, seo_bottom, updated_at");

  const metaMap = new Map<string, SeoRow>(
    ((allMeta ?? []) as SeoRow[]).map((r) => [r.page_path, r])
  );

  const avgScore = KNOWN_PATHS.length > 0
    ? Math.round(KNOWN_PATHS.reduce((sum, p) => sum + calcScore(metaMap.get(p)), 0) / KNOWN_PATHS.length)
    : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <Globe className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Pages</h1>
          <p className="text-sm text-gray-500">SEO-Metadaten & Textblöcke für alle Seiten</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{KNOWN_PATHS.length}</p>
          <p className="text-xs text-gray-500 mt-1">Seiten gesamt</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-teal-400">{metaMap.size}</p>
          <p className="text-xs text-gray-500 mt-1">Mit SEO-Daten</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-gray-500">{KNOWN_PATHS.length - metaMap.size}</p>
          <p className="text-xs text-gray-500 mt-1">Ohne SEO-Daten</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 group relative">
          <p className={`text-2xl font-black ${avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>{avgScore}%</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            Ø SEO-Score
            <Info className="w-3 h-3 text-gray-600" />
          </p>
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-800 border border-gray-700 rounded-xl p-4 text-xs text-gray-300 hidden group-hover:block z-50 shadow-xl">
            <p className="font-bold text-white mb-2">SEO-Score Berechnung:</p>
            <ul className="space-y-1">
              <li><span className="text-teal-400 font-mono">30P</span> — Meta Title (vorhanden, Länge 30-60, Keyword enthalten)</li>
              <li><span className="text-teal-400 font-mono">30P</span> — Meta Description (vorhanden, Länge 120-160, Keyword)</li>
              <li><span className="text-teal-400 font-mono">20P</span> — Focus Keyword gesetzt</li>
              <li><span className="text-teal-400 font-mono">20P</span> — Weitere Keywords (5P pro Keyword, max 20)</li>
            </ul>
          </div>
        </div>
      </div>

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
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[50px]">Wörter</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[60px]">Update</th>
              <th className="w-[70px] px-2 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_PATHS.map((path) => {
              const row = metaMap.get(path);
              const score = calcScore(row);
              const wc = wordCount(row);
              const updated = row?.updated_at ? new Date(row.updated_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }) : null;
              const titleLen = row?.meta_title?.length ?? 0;
              const descLen = row?.meta_description?.length ?? 0;
              const titleOk = titleLen >= 30 && titleLen <= 60;
              const descOk = descLen >= 120 && descLen <= 160;
              const titleHasKw = row?.focus_keyword && row?.meta_title?.toLowerCase().includes(row.focus_keyword.toLowerCase());
              const descHasKw = row?.focus_keyword && row?.meta_description?.toLowerCase().includes(row.focus_keyword.toLowerCase());
              return (
                <tr key={path} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-2 font-mono text-gray-300 text-[11px] truncate" title={path}>{path}</td>
                  <td className="px-2 py-2"><ScoreBadge score={score} /></td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">
                    {row?.meta_title ? (
                      <div title={row.meta_title}>
                        <span className="line-clamp-2">{row.meta_title}</span>
                        <span className={`text-[10px] font-mono ${titleOk ? "text-green-500" : "text-red-400"}`}>{titleLen}Z</span>
                        {row.focus_keyword && <span className={`text-[10px] ml-1 ${titleHasKw ? "text-green-500" : "text-red-400"}`}>KW</span>}
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">
                    {row?.meta_description ? (
                      <div title={row.meta_description}>
                        <span className="line-clamp-2">{row.meta_description}</span>
                        <span className={`text-[10px] font-mono ${descOk ? "text-green-500" : "text-red-400"}`}>{descLen}Z</span>
                        {row.focus_keyword && <span className={`text-[10px] ml-1 ${descHasKw ? "text-green-500" : "text-red-400"}`}>KW</span>}
                      </div>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-400 truncate" title={row?.focus_keyword || ""}>{row?.focus_keyword || <span className="text-gray-600">—</span>}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-500 text-center" title={row?.additional_keywords?.join(", ") || ""}>
                    {row?.additional_keywords?.length ? <span className="text-gray-400">{row.additional_keywords.length}</span> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-2 py-2"><WordBadge count={wc} /></td>
                  <td className="px-2 py-2 text-[11px] text-gray-500">{updated || <span className="text-gray-600">—</span>}</td>
                  <td className="px-2 py-2">
                    <Link href={`/admin/seo/${encodeURIComponent(path)}`}
                      className="text-teal-400 hover:text-teal-300 text-[11px] font-semibold transition-colors whitespace-nowrap">
                      Bearbeiten
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
