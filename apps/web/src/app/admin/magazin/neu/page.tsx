import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelForm from "@/components/admin/artikel-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Neuer Artikel | Admin Magazin" };

interface Category { id: string; name: string; slug: string; }

export default async function AdminMagazinNeuPage() {
  const supabase = await createSupabaseServer();

  const { data: categories } = await supabase
    .from("magazin_categories" as never)
    .select("id, name, slug")
    .order("name") as { data: Category[] | null };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Neuer Artikel</h1>
      <ArtikelForm categories={categories ?? []} />
    </div>
  );
}
