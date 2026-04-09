"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Search, ScanSearch } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";

interface SeoRow {
  slug: string;
  seo_intro: string | null;
  seo_middle: string | null;
  seo_bottom: string | null;
}

interface DestinationRow {
  slug: string;
  name: string;
  country: string;
  hasSeo: boolean;
  wordCount: number;
  score: number | null; // null = not yet analyzed
}

function calcSeoScore(seo: SeoRow | undefined): { wordCount: number; score: number } {
  if (!seo) return { wordCount: 0, score: 0 };

  const allText = [seo.seo_intro, seo.seo_middle, seo.seo_bottom].filter(Boolean).join(" ");
  const wordCount = allText.split(/\s+/).filter((w) => w.length > 1).length;

  let score = 0;

  // Intro vorhanden (10)
  if (seo.seo_intro && seo.seo_intro.length > 50) score += 10;

  // Middle vorhanden (15)
  if (seo.seo_middle && seo.seo_middle.length > 200) score += 15;

  // Bottom vorhanden (10)
  if (seo.seo_bottom && seo.seo_bottom.length > 100) score += 10;

  // Wortanzahl (40 Punkte)
  if (wordCount >= 2000) score += 40;
  else if (wordCount >= 1500) score += 30;
  else if (wordCount >= 1000) score += 20;
  else if (wordCount >= 500) score += 10;
  else if (wordCount >= 200) score += 5;

  // Absätze in Middle (10)
  const paragraphs = seo.seo_middle?.split("\n\n").length ?? 0;
  if (paragraphs >= 6) score += 10;
  else if (paragraphs >= 3) score += 5;

  // Middle-Länge Bonus (15)
  const middleWords = (seo.seo_middle ?? "").split(/\s+/).filter((w) => w.length > 1).length;
  if (middleWords >= 1200) score += 15;
  else if (middleWords >= 800) score += 10;
  else if (middleWords >= 400) score += 5;

  return { wordCount, score: Math.min(100, score) };
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-600 text-xs">—</span>;
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

export default function DestinationsAdminPage() {
  const [rows, setRows] = useState<DestinationRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: seoData } = await supabase
        .from("destination_seo_texts")
        .select("slug, seo_intro, seo_middle, seo_bottom");

      const seoMap = new Map<string, SeoRow>(
        ((seoData ?? []) as SeoRow[]).map((r) => [r.slug, r])
      );

      const seen = new Set<string>();
      const combined: DestinationRow[] = [];

      for (const d of destinations) {
        if (!seen.has(d.slug)) {
          seen.add(d.slug);
          const seo = seoMap.get(d.slug);
          const { wordCount, score } = calcSeoScore(seo);
          combined.push({
            slug: d.slug, name: d.name, country: d.country,
            hasSeo: !!seo, wordCount, score: seo ? score : null,
          });
        }
      }

      for (const c of CATALOG) {
        if (!seen.has(c.slug)) {
          seen.add(c.slug);
          const seo = seoMap.get(c.slug);
          const { wordCount, score } = calcSeoScore(seo);
          combined.push({
            slug: c.slug, name: c.name, country: c.country,
            hasSeo: !!seo, wordCount, score: seo ? score : null,
          });
        }
      }

      combined.sort((a, b) => a.name.localeCompare(b.name, "de"));
      setRows(combined);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase())
  );

  const withSeo = rows.filter((r) => r.hasSeo).length;
  const avgScore = rows.filter((r) => r.score !== null).length > 0
    ? Math.round(rows.filter((r) => r.score !== null).reduce((s, r) => s + (r.score ?? 0), 0) / rows.filter((r) => r.score !== null).length)
    : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <MapPin className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Destination SEO-Texte</h1>
          <p className="text-sm text-gray-500">SEO-Texte für alle Reiseziele pflegen</p>
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black text-white">{rows.length}</p>
            <p className="text-xs text-gray-500 mt-1">Reiseziele gesamt</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black text-teal-400">{withSeo}</p>
            <p className="text-xs text-gray-500 mt-1">Mit SEO-Texten</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black text-gray-500">{rows.length - withSeo}</p>
            <p className="text-xs text-gray-500 mt-1">Ohne SEO-Texte</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className={`text-2xl font-black ${avgScore >= 70 ? "text-green-400" : avgScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>{avgScore}%</p>
            <p className="text-xs text-gray-500 mt-1">Ø SEO-Score</p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Reiseziel, Land oder Slug suchen…"
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
          {search && <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Lade Reiseziele…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Land</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wörter</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-500">Keine Reiseziele gefunden.</td></tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.slug} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="text-white font-semibold">{row.name}</span>
                        <span className="text-gray-600 text-xs ml-2 font-mono">/{row.slug}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-sm">{row.country}</td>
                      <td className="px-4 py-2.5"><ScoreBadge score={row.score} /></td>
                      <td className="px-4 py-2.5 text-right">
                        {row.hasSeo ? (
                          <span className={`text-xs font-mono ${row.wordCount >= 1500 ? "text-green-400" : row.wordCount >= 500 ? "text-yellow-400" : "text-orange-400"}`}>
                            {row.wordCount.toLocaleString("de-DE")}
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {row.hasSeo ? (
                          <span className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                            Vorhanden
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />
                            Fehlt
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link href={`/admin/destinations/${row.slug}`}
                          className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors whitespace-nowrap">
                          Bearbeiten →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
