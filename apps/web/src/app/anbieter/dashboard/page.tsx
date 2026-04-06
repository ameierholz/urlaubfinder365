import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import DashboardContent from "@/components/anbieter/DashboardContent";

export const metadata: Metadata = { title: "Dashboard | Anbieter-Portal" };

export default async function AnbieterDashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, name, status, verifiziert")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; name: string; status: string; verifiziert: boolean } | null;

  const [{ count: angeboteCount }, { count: buchungenCount }, { data: buchungenDaten }] = await Promise.all([
    supabase.from("angebote").select("*", { count: "exact", head: true }).eq("anbieter_id", profil?.id ?? ""),
    supabase.from("buchungen").select("*", { count: "exact", head: true }).eq("anbieter_id", profil?.id ?? "").neq("status", "storniert"),
    supabase.from("buchungen").select("auszahlungs_betrag, status, created_at, kunden_name, gesamtpreis, buchungs_nummer")
      .eq("anbieter_id", profil?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const gesamtEinnahmen = (buchungenDaten ?? [])
    .filter((b: { status: string }) => b.status !== "storniert")
    .reduce((sum: number, b: { auszahlungs_betrag: number }) => sum + Number(b.auszahlungs_betrag), 0);

  const offeneBuchungen = (buchungenDaten ?? []).filter((b: { status: string }) => b.status === "ausstehend").length;

  return (
    <DashboardContent
      profilName={profil?.name ?? ""}
      verifiziert={profil?.verifiziert ?? false}
      angeboteCount={angeboteCount ?? 0}
      buchungenCount={buchungenCount ?? 0}
      offeneBuchungen={offeneBuchungen}
      gesamtEinnahmen={gesamtEinnahmen}
      buchungenDaten={(buchungenDaten ?? []).map((b: { buchungs_nummer: string; kunden_name: string; gesamtpreis: number; status: string; created_at: string }) => ({
        buchungs_nummer: b.buchungs_nummer,
        kunden_name: b.kunden_name,
        gesamtpreis: b.gesamtpreis,
        status: b.status,
        created_at: b.created_at,
      }))}
    />
  );
}
