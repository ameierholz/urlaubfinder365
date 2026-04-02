import { createSupabaseServer } from "@/lib/supabase-server";
import AuszahlungErstellenButton from "@/components/admin/AuszahlungErstellenButton";
import AuszahlungAbhaken from "@/components/admin/AuszahlungAbhaken";
import StripeAuszahlungButton from "@/components/admin/StripeAuszahlungButton";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Auszahlungen | Admin" };

export default async function AdminAuszahlungenPage() {
  const supabase = await createSupabaseServer();

  const { data: offeneBuchungen } = await supabase
    .from("buchungen")
    .select("id, anbieter_id, auszahlungs_betrag, buchungs_nummer")
    .eq("status", "abgeschlossen");

  const { data: alleAuszahlungen } = await supabase
    .from("auszahlungen")
    .select("id, anbieter_id, betrag, status, created_at, ueberwiesen_at, referenz, buchungs_ids, notiz, stripe_transfer_id")
    .order("created_at", { ascending: false });

  const bereitsAusgezahlt = new Set(
    (alleAuszahlungen ?? []).flatMap((a: { buchungs_ids: string[] }) => a.buchungs_ids ?? [])
  );

  const { data: anbieter } = await supabase
    .from("anbieter_profile")
    .select("id, name, email, stripe_account_id, stripe_onboarding_complete");
  const anbieterMap = Object.fromEntries((anbieter ?? []).map((a: {
    id: string; name: string; email: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean;
  }) => [a.id, a]));

  type OffeneBuchung = { id: string; anbieter_id: string; auszahlungs_betrag: number; buchungs_nummer: string };
  const offeneGruppiert: Record<string, { betrag: number; buchungs: OffeneBuchung[] }> = {};
  for (const b of (offeneBuchungen ?? []) as OffeneBuchung[]) {
    if (bereitsAusgezahlt.has(b.id)) continue;
    if (!offeneGruppiert[b.anbieter_id]) offeneGruppiert[b.anbieter_id] = { betrag: 0, buchungs: [] };
    offeneGruppiert[b.anbieter_id].betrag += Number(b.auszahlungs_betrag);
    offeneGruppiert[b.anbieter_id].buchungs.push(b);
  }

  // Offene Auszahlungen aus der Auszahlungs-Tabelle (manuell erstellt)
  const offeneAuszahlungen = (alleAuszahlungen ?? []).filter((a: { status: string }) => a.status === "offen");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-white">Auszahlungen</h1>

      {/* Neu: Offene Auszahlungen per Stripe übertragen */}
      {offeneAuszahlungen.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold text-violet-400 uppercase tracking-wider">Bereit für Stripe-Transfer</h2>
          </div>
          {offeneAuszahlungen.map((a: {
            id: string; anbieter_id: string; betrag: number; status: string;
            referenz?: string; notiz?: string; buchungs_ids: string[];
          }) => {
            const anb = anbieterMap[a.anbieter_id];
            const hatStripe = !!(anb?.stripe_account_id && anb?.stripe_onboarding_complete);
            return (
              <div key={a.id} className="bg-gray-900 border border-violet-800/40 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-white">{anb?.name ?? a.anbieter_id}</p>
                  <p className="text-xs text-gray-500">{anb?.email}</p>
                  {a.notiz && <p className="text-xs text-gray-600 mt-1">{a.notiz}</p>}
                  {!hatStripe && (
                    <p className="text-xs text-amber-400 mt-1">⚠️ Kein Stripe Connect — manuelle Überweisung nötig</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-400">{Number(a.betrag).toFixed(2)} €</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StripeAuszahlungButton
                      auszahlungId={a.id}
                      betrag={Number(a.betrag)}
                      hatStripeKonto={hatStripe}
                    />
                    {!hatStripe && <AuszahlungAbhaken auszahlungId={a.id} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Aus Buchungen: neue Auszahlungen erstellen */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Abgeschlossene Buchungen — Auszahlung erstellen</h2>
        {Object.keys(offeneGruppiert).length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500 text-sm">
            Keine ausstehenden Buchungs-Auszahlungen.
          </div>
        ) : (
          Object.entries(offeneGruppiert).map(([anbieterId, { betrag, buchungs }]) => {
            const a = anbieterMap[anbieterId];
            return (
              <div key={anbieterId} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-white">{a?.name ?? anbieterId}</p>
                  <p className="text-xs text-gray-500">{a?.email} · {buchungs.length} Buchung{buchungs.length !== 1 ? "en" : ""}</p>
                  <p className="text-xs text-gray-600 mt-1">{buchungs.map((b: OffeneBuchung) => b.buchungs_nummer).join(", ")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">{betrag.toFixed(2)} €</p>
                    <p className="text-xs text-gray-500">85% Anbieter-Anteil</p>
                  </div>
                  <AuszahlungErstellenButton
                    anbieterId={anbieterId}
                    betrag={betrag}
                    buchungsIds={buchungs.map((b: OffeneBuchung) => b.id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Auszahlungs-Historie */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-bold text-white">Auszahlungs-Historie</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {(alleAuszahlungen ?? []).map((a: {
            id: string; anbieter_id: string; betrag: number; status: string;
            created_at: string; ueberwiesen_at?: string; referenz?: string; stripe_transfer_id?: string;
          }) => {
            const anb = anbieterMap[a.anbieter_id];
            return (
              <div key={a.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{anb?.name ?? a.anbieter_id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.created_at).toLocaleDateString("de-DE")}
                    {a.referenz && ` · ${a.referenz}`}
                    {a.ueberwiesen_at && ` · ${new Date(a.ueberwiesen_at).toLocaleDateString("de-DE")}`}
                  </p>
                  {a.stripe_transfer_id && (
                    <p className="text-[10px] text-violet-400 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3" /> {a.stripe_transfer_id}
                    </p>
                  )}
                </div>
                <p className="font-black text-emerald-400">{Number(a.betrag).toFixed(2)} €</p>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  a.status === "ueberwiesen"
                    ? a.stripe_transfer_id ? "bg-violet-900/40 text-violet-400" : "bg-emerald-900/40 text-emerald-400"
                    : "bg-amber-900/40 text-amber-400"
                }`}>
                  {a.status === "ueberwiesen"
                    ? (a.stripe_transfer_id ? "⚡ Stripe" : "✅ Überwiesen")
                    : "⏳ Offen"}
                </span>
              </div>
            );
          })}
          {(alleAuszahlungen ?? []).length === 0 && (
            <p className="px-6 py-8 text-center text-gray-500 text-sm">Noch keine Auszahlungen erstellt.</p>
          )}
        </div>
      </div>
    </div>
  );
}
