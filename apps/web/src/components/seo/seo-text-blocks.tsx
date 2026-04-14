"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface SeoData {
  seo_intro: string | null;
  seo_h2_middle: string | null;
  seo_middle: string | null;
  seo_h2_bottom: string | null;
  seo_bottom: string | null;
}

export function SeoTextBlocks({ pagePath }: { pagePath: string }) {
  const [seo, setSeo] = useState<SeoData | null>(null);

  useEffect(() => {
    createSupabaseBrowser()
      .from("page_seo_meta")
      .select("seo_intro, seo_h2_middle, seo_middle, seo_h2_bottom, seo_bottom")
      .eq("page_path", pagePath)
      .maybeSingle()
      .then(({ data }) => { if (data) setSeo(data as SeoData); });
  }, [pagePath]);

  if (!seo) return null;
  if (!seo.seo_intro && !seo.seo_middle && !seo.seo_bottom) return null;

  return (
    <>
      {seo.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 text-base leading-relaxed">{seo.seo_intro}</p>
        </div>
      )}
      {seo.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {seo.seo_h2_middle && <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_middle}</h2>}
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((b: string, i: number) => <p key={i}>{b}</p>)}
          </div>
        </div>
      )}
      {seo.seo_bottom && (
        <div className="bg-sand-50 border-t border-sand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {seo.seo_h2_bottom && <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{seo.seo_h2_bottom}</h2>}
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              {seo.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p: string, i: number) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
