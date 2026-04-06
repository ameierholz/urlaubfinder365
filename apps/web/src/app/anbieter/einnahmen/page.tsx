import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import EinnahmenContent from "@/components/anbieter/EinnahmenContent";

export const metadata: Metadata = { title: "Einnahmen | Anbieter-Portal" };

export default async function AnbieterEinnahmenPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, stripe_account_id, stripe_onboarding_complete")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean } | null;

  const [{ data: buchungen }, { data: auszahlungen }] = await Promise.all([
    supabase.from("buchungen")
      .select("buchungs_nummer, auszahlungs_betrag, gesamtpreis, provision_betrag, status, datum, created_at")
      .eq("anbieter_id", profil?.id ?? "")
      .neq("status", "storniert")
      .order("created_at", { ascending: false }),
    supabase.from("auszahlungen")
      .select("id, betrag, status, created_at, ueberwiesen_at, referenz")
      .eq("anbieter_id", profil?.id ?? "")
      .order("created_at", { ascending: false }),
  ]);

  const gesamt = (buchungen ?? []).reduce((s: number, b: { auszahlungs_betrag: number }) => s + Number(b.auszahlungs_betrag), 0);
  const ausgezahlt = (auszahlungen ?? []).filter((a: { status: string }) => a.status === "ueberwiesen").reduce((s: number, a: { betrag: number }) => s + Number(a.betrag), 0);
  const ausstehend = gesamt - ausgezahlt;
  const stripeVerbunden = !!(profil?.stripe_account_id && profil?.stripe_onboarding_complete);

  return (
    <EinnahmenContent
      stripeVerbunden={stripeVerbunden}
      gesamt={gesamt}
      ausgezahlt={ausgezahlt}
      ausstehend={ausstehend}
      auszahlungen={(auszahlungen ?? []) as Array<{ id: string; betrag: number; status: string; created_at: string; ueberwiesen_at?: string; referenz?: string }>}
      buchungen={(buchungen ?? []) as Array<{ buchungs_nummer: string; auszahlungs_betrag: number; gesamtpreis: number; provision_betrag: number; status: string; datum: string; created_at: string }>}
    />
  );
}
