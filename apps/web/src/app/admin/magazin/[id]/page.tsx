import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelForm, { type ExistingArticle, type Category } from "@/components/admin/artikel-form";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Artikel bearbeiten | Admin Magazin" };

export default async function AdminMagazinEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase
      .from("magazin_articles" as never)
      .select("id, title, slug, category_id, author_name, excerpt, cover_image, content, meta_title, meta_description, focus_keyword, status")
      .eq("id", id)
      .single() as Promise<{ data: ExistingArticle | null }>,
    supabase
      .from("magazin_categories" as never)
      .select("id, name, slug")
      .order("name") as Promise<{ data: Category[] | null }>,
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Artikel bearbeiten</h1>
      <ArtikelForm article={article} categories={categories ?? []} />
    </div>
  );
}
