import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelStatusButton from "@/components/admin/artikel-status-button";
import Link from "next/link";
import { ChevronRight, PlusCircle, Check, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Urlaubsmagazin | Admin" };

const STATUS: Record<string, { label: string; cls: string }> = {
  entwurf:         { label: "Entwurf",        cls: "bg-gray-800 text-gray-400" },
  veroeffentlicht: { label: "✓ Veröffentlicht", cls: "bg-emerald-900/40 text-emerald-400" },
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
  magazin_categories: { name: string } | null;
}

export default async function AdminMagazinPage() {
  const supabase = await createSupabaseServer();

  const { data: articles } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, status, published_at, updated_at, meta_title, meta_description, focus_keyword, magazin_categories(name)")
    .order("updated_at", { ascending: false }) as { data: Article[] | null };

  const list = articles ?? [];
  const withSeo = list.filter((a) => a.meta_title && a.meta_description && a.focus_keyword).length;
  const withoutSeo = list.length - withSeo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Urlaubsmagazin</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} Artikel · {withSeo} mit SEO · {withoutSeo} ohne SEO</p>
        </div>
        <Link
          href="/admin/magazin/neu/"
          className="flex items-center gap-2 bg-[#00838F] hover:bg-[#006b75] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Neuer Artikel
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px_80px_100px_40px] gap-2 px-6 py-3 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>Artikel</span>
          <span className="text-center">Title</span>
          <span className="text-center">Desc</span>
          <span className="text-center">Keyword</span>
          <span className="text-center">Status</span>
          <span />
        </div>

        <div className="divide-y divide-gray-800">
          {list.map((a) => {
            const st = STATUS[a.status] ?? STATUS.entwurf;
            const hasTitle = !!a.meta_title;
            const hasDesc = !!a.meta_description;
            const hasKw = !!a.focus_keyword;

            return (
              <div key={a.id} className="grid grid-cols-[1fr_80px_80px_80px_100px_40px] gap-2 items-center hover:bg-gray-800/50 transition-colors">
                <Link href={`/admin/magazin/${a.id}/`} className="flex items-center gap-4 px-6 py-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{a.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {a.magazin_categories?.name ?? "–"} · {a.published_at ? new Date(a.published_at).toLocaleDateString("de-DE") : "Entwurf"}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-center">
                  {hasTitle ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex justify-center">
                  {hasDesc ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex justify-center">
                  {hasKw ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex justify-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                </div>
                <div className="pr-4">
                  <ArtikelStatusButton articleId={a.id} currentStatus={a.status} />
                </div>
              </div>
            );
          })}
          {list.length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500 text-sm">
              Noch keine Artikel vorhanden. Erstelle deinen ersten Artikel!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
