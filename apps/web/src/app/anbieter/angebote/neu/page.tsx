import { createSupabaseServer } from "@/lib/supabase-server";
import AngebotForm from "@/components/anbieter/AngebotForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Neues Angebot | Anbieter-Portal" };

export default async function NeuesAngebotPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = await supabase
    .from("anbieter_profile").select("id").eq("user_id", user!.id).maybeSingle();

  const anbieter_id = (profil as { id: string } | null)?.id ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Neues Angebot anlegen</h1>
        <p className="text-gray-500 text-sm mt-1">Erstelle eine neue Tour oder Aktivität für den Marktplatz.</p>
      </div>
      <AngebotForm anbieter_id={anbieter_id} />
    </div>
  );
}
