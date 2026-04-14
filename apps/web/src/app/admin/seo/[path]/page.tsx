import Link from "next/link";
import { ChevronRight, Globe } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import SeoMetaForm from "@/components/admin/seo-meta-form";
import type { PageSeoMeta } from "@/lib/seo-meta";

interface Props {
  params: Promise<{ path: string }>;
}

export default async function SeoEditPage({ params }: Props) {
  const { path: encodedPath } = await params;
  const pagePath = decodeURIComponent(encodedPath);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("page_seo_meta")
    .select("meta_title, meta_description, focus_keyword, additional_keywords, og_title, og_description, og_image, seo_intro, seo_h2_middle, seo_middle, seo_h2_bottom, seo_bottom")
    .eq("page_path", pagePath)
    .maybeSingle();

  const initial = data as PageSeoMeta | null;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo" className="hover:text-gray-300 transition-colors">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300 font-mono">{pagePath}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <Globe className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">SEO bearbeiten</h1>
          <p className="text-sm text-gray-500 font-mono">{pagePath}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <SeoMetaForm pagePath={pagePath} initial={initial} />
      </div>

      {/* Back */}
      <div className="mt-6">
        <Link
          href="/admin/seo"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Zurück zur SEO-Übersicht
        </Link>
      </div>
    </div>
  );
}
