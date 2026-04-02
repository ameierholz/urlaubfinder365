import { createSupabaseServer } from "@/lib/supabase-server";
import AuszahlungErstellenButton from "@/components/admin/AuszahlungErstellenButton";
import AuszahlungAbhaken from "@/components/admin/AuszahlungAbhaken";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Auszahlungen | Admin" };

export default async function AdminAuszahlungenPage() {
  const supabase = await createSupabaseServer();

  // Anbieter mit offenen (noch nicht ausgezahlten) abgeschlossenen Buchungen
  const { data: offeneBuchungen } = await supabase
    .from("buchungen")
    .select("id, anbieter_id, auszahlungs_betrag, buchungs_nummer")
    .eq("status", "abgeschlossen");

  // Buchungen die bereits in einer Auszahlung enthalten sind
  const { data: alleAuszahlungen } = await supabase
    .from("auszahlungen")
    .select("id, anbieter_id, betrag, status, created_at, ueberwiesen_at, referenz, buchungs_ids, notiz")
    .order("created_at", { ascending: false });

  const bereitsAusgezahlt = new Set(
    (alleAuszahlungen ?? []).flatMap((a: { buchungs_ids: string[] }) => a.buchungs_ids ?? [])
  );

  // Anbieter-Namen
  const { data: anbieter } = await supabase.from("anbieter_profile").select("id, name, email");
  const anbieterMap = Object.fromEntries((anbieter ?? []).map((a: { id: string; name: string; email: string }) => [a.id, a]));

  // Gruppiere offene Buchungen nach Anbieter (nur nicht-ausgezahlte)
  type OffeneBuchung = { id: string; anbieter_id: string; auszahlungs_betrag: number; buchungs_nummer: string };
  const offeneGruppiert: Record<string, { betrag: number; buchungs: OffeneBuchung[] }> = {};
  for (const b of (offeneBuchungen ?? []) as OffeneBuchung[]) {
    if (bereitsAusgezahlt.has(b.id)) continue;
    if (!offeneGruppiert[b.anbieter_id]) offeneGruppiert[b.anbieter_id] = { betrag: 0, buchungs: [] };
    offeneGruppiert[b.anbieter_id].betrag += Number(b.auszahlungs_betrag);
    offeneGruppiert[b.anbieter_id].buchungs.push(b);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-white">Auszahlungen</h1>

      {/* Offene Auszahlungen je Anbieter */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bereit zur Auszahlung</h2>
        {Object.keys(offeneGruppiert).length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500 text-sm">
            Keine offenen Auszahlungen vorhanden.
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
            created_at: string; ueberwiesen_at?: string; referenz?: string; notiz?: string;
          }) => {
            const anb = anbieterMap[a.anbieter_id];
            return (
              <div key={a.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{anb?.name ?? a.anbieter_id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.created_at).toLocaleDateString("de-DE")}
                    {a.referenz && ` · Ref: ${a.referenz}`}
                    {a.ueberwiesen_at && ` · überwiesen: ${new Date(a.ueberwiesen_at).toLocaleDateString("de-DE")}`}
                  </p>
                </div>
                <p className="font-black text-emerald-400">{Number(a.betrag).toFixed(2)} €</p>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  a.status === "ueberwiesen" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"
                }`}>
                  {a.status === "ueberwiesen" ? "✅ Überwiesen" : "⏳ Offen"}
                </span>
                {a.status === "offen" && <AuszahlungAbhaken auszahlungId={a.id} />}
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
