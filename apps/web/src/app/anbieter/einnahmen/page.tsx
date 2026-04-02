import { createSupabaseServer } from "@/lib/supabase-server";
import { Euro, TrendingUp, Clock } from "lucide-react";
import StripeConnectButton from "@/components/stripe/StripeConnectButton";
import type { Metadata } from "next";

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

  const gesamt       = (buchungen ?? []).reduce((s: number, b: { auszahlungs_betrag: number }) => s + Number(b.auszahlungs_betrag), 0);
  const ausgezahlt   = (auszahlungen ?? []).filter((a: { status: string }) => a.status === "ueberwiesen").reduce((s: number, a: { betrag: number }) => s + Number(a.betrag), 0);
  const ausstehend   = gesamt - ausgezahlt;

  const stripeVerbunden = !!(profil?.stripe_account_id && profil?.stripe_onboarding_complete);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">Meine Einnahmen</h1>

      {/* Stripe Connect Banner */}
      <div className={`rounded-2xl border p-5 flex items-start gap-4 flex-wrap ${
        stripeVerbunden
          ? "bg-violet-50 border-violet-200"
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 mb-0.5">
            {stripeVerbunden ? "⚡ Stripe Connect aktiv" : "💳 Stripe Connect einrichten"}
          </p>
          <p className="text-xs text-gray-600">
            {stripeVerbunden
              ? "Deine Auszahlungen werden automatisch via Stripe auf dein Konto überwiesen."
              : "Verbinde dein Stripe-Konto, damit wir deine Einnahmen automatisch auszahlen können. Dauert ca. 5 Minuten."}
          </p>
        </div>
        <StripeConnectButton complete={stripeVerbunden} />
      </div>

      {/* Übersicht */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "Gesamteinnahmen (85%)", wert: `${gesamt.toFixed(2)} €`, bg: "bg-emerald-50", c: "text-emerald-600" },
          { icon: Euro,       label: "Bereits ausgezahlt",    wert: `${ausgezahlt.toFixed(2)} €`, bg: "bg-blue-50", c: "text-blue-600" },
          { icon: Clock,      label: "Ausstehend",            wert: `${ausstehend.toFixed(2)} €`, bg: "bg-amber-50", c: "text-amber-600" },
        ].map(({ icon: Icon, label, wert, bg, c }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${c}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{wert}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Auszahlungen */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Auszahlungen</h2>
        </div>
        {!auszahlungen || auszahlungen.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">Noch keine Auszahlungen. Wir überweisen deinen Anteil nach Abschluss der Buchungen.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {auszahlungen.map((a: { id: string; betrag: number; status: string; created_at: string; ueberwiesen_at?: string; referenz?: string }) => (
              <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{Number(a.betrag).toFixed(2)} €</p>
                  <p className="text-xs text-gray-400">
                    {a.status === "ueberwiesen"
                      ? `Überwiesen am ${new Date(a.ueberwiesen_at!).toLocaleDateString("de-DE")}${a.referenz ? ` · Ref: ${a.referenz}` : ""}`
                      : `Erstellt am ${new Date(a.created_at).toLocaleDateString("de-DE")}`}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  a.status === "ueberwiesen" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {a.status === "ueberwiesen" ? "✅ Überwiesen" : "⏳ Ausstehend"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buchungs-Detail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Buchungsübersicht</h2>
        </div>
        {!buchungen || buchungen.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">Noch keine abgeschlossenen Buchungen.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {buchungen.map((b: { buchungs_nummer: string; datum: string; gesamtpreis: number; provision_betrag: number; auszahlungs_betrag: number; status: string }) => (
              <div key={b.buchungs_nummer} className="px-6 py-3.5 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{b.buchungs_nummer}</p>
                  <p className="text-xs text-gray-400">{new Date(b.datum).toLocaleDateString("de-DE")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Buchungspreis</p>
                  <p className="font-semibold">{Number(b.gesamtpreis).toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Provision (15%)</p>
                  <p className="font-semibold text-red-500">-{Number(b.provision_betrag).toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Dein Anteil</p>
                  <p className="font-bold text-emerald-600">{Number(b.auszahlungs_betrag).toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
