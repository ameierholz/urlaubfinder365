import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import AngeboteContent from "@/components/anbieter/AngeboteContent";

export const metadata: Metadata = { title: "Meine Angebote | Anbieter-Portal" };

export default async function AnbieterAngebotePage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile").select("id").eq("user_id", user!.id).maybeSingle();
  const profil = profilRaw as { id: string } | null;

  const { data: angeboteRaw } = await supabase
    .from("angebote")
    .select("id, titel, slug, ziel, preis, status, created_at")
    .eq("anbieter_id", profil?.id ?? "")
    .order("created_at", { ascending: false });
  const angebote = (angeboteRaw ?? []) as Array<{ id: string; titel: string; slug: string; ziel: string; preis: number; status: string; created_at: string }>;

  return <AngeboteContent angebote={angebote} />;
}
