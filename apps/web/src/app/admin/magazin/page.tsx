import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelStatusButton from "@/components/admin/artikel-status-button";
import Link from "next/link";
import { ChevronRight, PlusCircle } from "lucide-react";
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
  magazin_categories: { name: string } | null;
}

export default async function AdminMagazinPage() {
  const supabase = await createSupabaseServer();

  const { data: articles } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, status, published_at, updated_at, magazin_categories(name)")
    .order("updated_at", { ascending: false }) as { data: Article[] | null };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Urlaubsmagazin</h1>
        <Link
          href="/admin/magazin/neu/"
          className="flex items-center gap-2 bg-[#00838F] hover:bg-[#006b75] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Neuer Artikel
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {(articles ?? []).map((a) => {
            const st = STATUS[a.status] ?? STATUS.entwurf;
            return (
              <div key={a.id} className="flex items-center gap-4 flex-wrap hover:bg-gray-800/50 transition-colors">
                <Link
                  href={`/admin/magazin/${a.id}/`}
                  className="flex-1 flex items-center gap-4 px-6 py-4 min-w-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{a.title}</p>
                    <p className="text-xs text-gray-500">
                      {a.magazin_categories?.name ?? "–"} ·{" "}
                      {a.published_at
                        ? new Date(a.published_at).toLocaleDateString("de-DE")
                        : "Noch nicht veröffentlicht"}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>
                    {st.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </Link>
                <div className="pr-6 shrink-0">
                  <ArtikelStatusButton articleId={a.id} currentStatus={a.status} />
                </div>
              </div>
            );
          })}
          {(articles ?? []).length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500 text-sm">
              Noch keine Artikel vorhanden. Erstelle deinen ersten Artikel!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
