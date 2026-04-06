import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import ProfilContent from "@/components/anbieter/ProfilContent";

export const metadata: Metadata = { title: "Mein Profil | Anbieter-Portal" };

export default async function AnbieterProfilPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profil = profilRaw as Record<string, any> | null;

  return (
    <ProfilContent
      profilId={profil?.id}
      initial={profil ?? undefined}
      verifiziert={profil?.verifiziert}
      status={profil?.status}
    />
  );
}
