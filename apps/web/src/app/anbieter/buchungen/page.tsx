import { createSupabaseServer } from "@/lib/supabase-server";
import BuchungStatusButton from "@/components/anbieter/BuchungStatusButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Buchungen | Anbieter-Portal" };

const STATUS_INFO: Record<string, { label: string; cls: string }> = {
  ausstehend:   { label: "⏳ Zahlung ausstehend",        cls: "bg-amber-100 text-amber-700" },
  bestaetigt:   { label: "✓ Buchung eingegangen & bezahlt", cls: "bg-emerald-100 text-emerald-700" },
  abgeschlossen:{ label: "✅ Abgeschlossen",              cls: "bg-blue-100 text-blue-700" },
  storniert:    { label: "✗ Storniert",                  cls: "bg-red-100 text-red-600" },
};

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
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Buchungen</h1>

      {!buchungen || buchungen.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <p className="font-medium">Noch keine Buchungen vorhanden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buchungen.map((b: {
            id: string; buchungs_nummer: string; kunden_name: string; kunden_email: string;
            kunden_telefon?: string; datum: string; personen: number; gesamtpreis: number;
            auszahlungs_betrag: number; status: string; created_at: string; notiz?: string; angebot_id?: string;
          }) => {
            const st = STATUS_INFO[b.status] ?? STATUS_INFO.ausstehend;
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm">{b.buchungs_nummer}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">{angebotMap[b.angebot_id ?? ""] ?? "Unbekanntes Angebot"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{Number(b.gesamtpreis).toFixed(2)} €</p>
                    <p className="text-xs text-emerald-600 font-semibold">Dein Anteil: {Number(b.auszahlungs_betrag).toFixed(2)} €</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 mb-4">
                  <div><span className="text-gray-400 block">Kunde</span>{b.kunden_name}</div>
                  <div><span className="text-gray-400 block">E-Mail</span><a href={`mailto:${b.kunden_email}`} className="text-[#00838F] hover:underline">{b.kunden_email}</a></div>
                  <div><span className="text-gray-400 block">Datum</span>{new Date(b.datum).toLocaleDateString("de-DE")}</div>
                  <div><span className="text-gray-400 block">Personen</span>{b.personen}</div>
                </div>

                {(b.status === "ausstehend" || b.status === "bestaetigt") && (
                  <BuchungStatusButton buchungId={b.id} status={b.status} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
