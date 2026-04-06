import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import BuchungenContent from "@/components/anbieter/BuchungenContent";

export const metadata: Metadata = { title: "Buchungen | Anbieter-Portal" };

export default async function AnbieterBuchungenPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profilRaw } = await supabase
    .from("anbieter_profile").select("id").eq("user_id", user!.id).maybeSingle();
  const profil = profilRaw as { id: string } | null;

  const { data: buchungen } = await supabase
    .from("buchungen")
    .select("id, buchungs_nummer, kunden_name, kunden_email, kunden_telefon, datum, personen, gesamtpreis, auszahlungs_betrag, status, created_at, notiz, angebot_id")
    .eq("anbieter_id", profil?.id ?? "")
    .order("created_at", { ascending: false });

  // Angebots-Titel nachladen
  const angebotIds = [...new Set((buchungen ?? []).map((b: { angebot_id: string }) => b.angebot_id).filter(Boolean))];
  const { data: angebote } = angebotIds.length
    ? await supabase.from("angebote").select("id, titel").in("id", angebotIds)
    : { data: [] };
  const angebotMap = Object.fromEntries((angebote ?? []).map((a: { id: string; titel: string }) => [a.id, a.titel]));

  return (
    <BuchungenContent
      buchungen={(buchungen ?? []) as Array<{
        id: string; buchungs_nummer: string; kunden_name: string; kunden_email: string;
        kunden_telefon?: string; datum: string; personen: number; gesamtpreis: number;
        auszahlungs_betrag: number; status: string; created_at: string; notiz?: string; angebot_id?: string;
      }>}
      angebotMap={angebotMap}
    />
  );
}
