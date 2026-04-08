import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Search, Globe } from "lucide-react";

const KNOWN_PATHS = [
  "/guenstig-urlaub-buchen",
  "/last-minute",
  "/hotelsuche",
  "/flugsuche",
  "/kreuzfahrten",
  "/mietwagen",
  "/aktivitaeten",
  "/urlaubsarten/strand-badeurlaub",
  "/urlaubsarten/familienurlaub",
  "/urlaubsarten/pauschalreisen",
  "/urlaubsarten/all-inclusive",
  "/urlaubsarten/cluburlaub",
  "/urlaubsarten/wanderurlaub",
  "/urlaubsarten/skiurlaub",
  "/urlaubsarten/staedte-und-kurzreisen",
  "/urlaubsthemen/romantik",
  "/urlaubsthemen/abenteuer",
  "/urlaubsthemen/wellness",
  "/urlaubsthemen/kultur",
  "/urlaubsthemen/natur",
  "/extras/reisewarnungen",
  "/extras/visum-checker",
  "/extras/preisentwicklung",
  "/extras/reiseversicherung",
  "/extras/ki-reiseplaner",
  "/reisewarnungen",
  "/visum-checker",
  "/preisentwicklung",
  "/reiseversicherung",
  "/ki-reiseplaner",
  "/community",
  "/feed",
  "/urlaubsguides",
];

export default async function SeoAdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: existingMeta } = await supabase
    .from("page_seo_meta")
    .select("page_path");

  const existingPaths = new Set(
    ((existingMeta ?? []) as { page_path: string }[]).map((r) => r.page_path)
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <Globe className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">SEO-Verwaltung</h1>
          <p className="text-sm text-gray-500">Meta-Daten für alle Seiten pflegen</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{KNOWN_PATHS.length}</p>
          <p className="text-xs text-gray-500 mt-1">Seiten gesamt</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-teal-400">{existingPaths.size}</p>
          <p className="text-xs text-gray-500 mt-1">Mit SEO-Daten</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-gray-500">
            {KNOWN_PATHS.length - existingPaths.size}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ohne SEO-Daten</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-300">Alle Seitenpfade</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pfad</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_PATHS.map((path) => {
              const hasData = existingPaths.has(path);
              const encoded = encodeURIComponent(path);
              return (
                <tr key={path} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-gray-300 text-xs">{path}</td>
                  <td className="px-5 py-3">
                    {hasData ? (
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
                      href={`/admin/seo/${encoded}`}
                      className="text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors"
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
