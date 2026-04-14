import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

export interface PageSeoMeta {
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  additional_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  seo_intro: string | null;
  seo_h2_middle: string | null;
  seo_middle: string | null;
  seo_h2_bottom: string | null;
  seo_bottom: string | null;
}

async function _fetchPageSeoMeta(pagePath: string): Promise<PageSeoMeta | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("page_seo_meta")
      .select("meta_title, meta_description, focus_keyword, additional_keywords, og_title, og_description, og_image, seo_intro, seo_h2_middle, seo_middle, seo_h2_bottom, seo_bottom")
      .eq("page_path", pagePath)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export const fetchPageSeoMeta = unstable_cache(
  _fetchPageSeoMeta,
  ["page-seo-meta"],
  { revalidate: 1800 }
);
