"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";

interface DestinationRow {
  slug: string;
  name: string;
  country: string;
  hasSeo: boolean;
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
        .select("slug");

      const existingSlugs = new Set(
        ((seoData ?? []) as { slug: string }[]).map((r) => r.slug)
      );

      // Merge destinations lib + catalog
      const seen = new Set<string>();
      const combined: DestinationRow[] = [];

      for (const d of destinations) {
        if (!seen.has(d.slug)) {
          seen.add(d.slug);
          combined.push({
            slug: d.slug,
            name: d.name,
            country: d.country,
            hasSeo: existingSlugs.has(d.slug),
          });
        }
      }

      for (const c of CATALOG) {
        if (!seen.has(c.slug)) {
          seen.add(c.slug);
          combined.push({
            slug: c.slug,
            name: c.name,
            country: c.country,
            hasSeo: existingSlugs.has(c.slug),
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <MapPin className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Destination SEO-Texte</h1>
          <p className="text-sm text-gray-500">SEO-Texte für alle Reiseziele pflegen</p>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-8">
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
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reiseziel, Land oder Slug suchen…"
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Lade Reiseziele…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Land</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                    Keine Reiseziele gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.slug} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-white font-semibold">{row.name}</span>
                      <span className="text-gray-600 text-xs ml-2 font-mono">/{row.slug}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-sm">{row.country}</td>
                    <td className="px-5 py-3">
                      {row.hasSeo ? (
                        <span className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                          Vorhanden
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />
                          Nicht gesetzt
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/destinations/${row.slug}`}
                        className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors"
                      >
                        Bearbeiten →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
