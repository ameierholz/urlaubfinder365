import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Globe } from "lucide-react";

const KNOWN_PATHS = [
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
];

interface SeoRow {
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  additional_keywords: string[] | null;
}

function calcScore(row: SeoRow | undefined): number {
  if (!row) return 0;
  let score = 0;
  // Meta Title (30 Punkte)
  if (row.meta_title) {
    score += 10;
    if (row.meta_title.length >= 30 && row.meta_title.length <= 60) score += 15;
    else if (row.meta_title.length > 0) score += 5;
    if (row.focus_keyword && row.meta_title.toLowerCase().includes(row.focus_keyword.toLowerCase())) score += 5;
  }
  // Meta Description (30 Punkte)
  if (row.meta_description) {
    score += 10;
    if (row.meta_description.length >= 120 && row.meta_description.length <= 160) score += 15;
    else if (row.meta_description.length >= 80) score += 8;
    if (row.focus_keyword && row.meta_description.toLowerCase().includes(row.focus_keyword.toLowerCase())) score += 5;
  }
  // Focus Keyword (20 Punkte)
  if (row.focus_keyword) score += 20;
  // Weitere Keywords (20 Punkte)
  if (row.additional_keywords && row.additional_keywords.length > 0) {
    score += Math.min(20, row.additional_keywords.length * 5);
  }
  return Math.min(100, score);
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

export default async function SeoAdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: allMeta } = await supabase
    .from("page_seo_meta")
    .select("page_path, meta_title, meta_description, focus_keyword, additional_keywords");

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
          <h1 className="text-2xl font-black text-white">SEO-Verwaltung</h1>
          <p className="text-sm text-gray-500">Meta-Daten für alle Seiten pflegen</p>
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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className={`text-2xl font-black ${avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>{avgScore}%</p>
          <p className="text-xs text-gray-500 mt-1">Ø SEO-Score</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pfad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide max-w-48">Meta Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide max-w-56">Meta Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Focus Keyword</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Keywords</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_PATHS.map((path) => {
              const row = metaMap.get(path);
              const score = calcScore(row);
              return (
                <tr key={path} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-gray-300 text-xs whitespace-nowrap">{path}</td>
                  <td className="px-4 py-2.5"><ScoreBadge score={score} /></td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 max-w-48 truncate">{row?.meta_title || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 max-w-56 truncate">{row?.meta_description || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">{row?.focus_keyword || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-500 max-w-32 truncate">{row?.additional_keywords?.join(", ") || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/admin/seo/${encodeURIComponent(path)}`}
                      className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors whitespace-nowrap"
                    >
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
