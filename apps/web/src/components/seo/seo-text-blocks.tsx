import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

interface SeoData {
  seo_intro: string | null;
  seo_h2_middle: string | null;
  seo_middle: string | null;
  seo_h2_bottom: string | null;
  seo_bottom: string | null;
}

// Lade ALLE SEO-Texte in einem einzigen Query und cache das Ergebnis.
// So macht der Build nur 1 Query statt 2.000+ individuelle.
const fetchAllSeoTexts = unstable_cache(
  async (): Promise<Map<string, SeoData>> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(10000) }) } }
      );
      const { data } = await supabase
        .from("page_seo_meta")
        .select("page_path, seo_intro, seo_h2_middle, seo_middle, seo_h2_bottom, seo_bottom");
      const map = new Map<string, SeoData>();
      for (const row of (data ?? []) as (SeoData & { page_path: string })[]) {
        map.set(row.page_path, row);
      }
      return map;
    } catch {
      return new Map();
    }
  },
  ["all-seo-texts"],
  { revalidate: 1800 }
);

export async function SeoTextBlocks({ pagePath }: { pagePath: string }) {
  const allSeo = await fetchAllSeoTexts();
  const seo = allSeo.get(pagePath);
  if (!seo) return null;

  const hasIntro = !!seo.seo_intro;
  const hasMiddle = !!seo.seo_middle;
  const hasBottom = !!seo.seo_bottom;

  if (!hasIntro && !hasMiddle && !hasBottom) return null;

  return (
    <>
      {hasIntro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 text-base leading-relaxed">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {hasMiddle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            {seo.seo_middle!.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block: string, i: number) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

      {hasBottom && (
        <div className="bg-sand-50 border-t border-sand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {seo.seo_h2_bottom && (
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              {seo.seo_bottom!.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
