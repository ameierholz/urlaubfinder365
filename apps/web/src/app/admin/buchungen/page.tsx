import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import AdminTicketModal from "@/components/admin/AdminTicketModal";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("adminPage.bookings");
  return { title: t("title") };
}

export default async function AdminBuchungenPage() {
  const t = await getTranslations("adminPage.bookings");
  const supabase = await createSupabaseServer();

  const STATUS_INFO: Record<string, { label: string; cls: string }> = {
    ausstehend:    { label: t("statusPending"),   cls: "bg-amber-900/40 text-amber-400" },
    bestaetigt:    { label: t("statusConfirmed"),  cls: "bg-blue-900/40 text-blue-400" },
    abgeschlossen: { label: t("statusCompleted"),  cls: "bg-emerald-900/40 text-emerald-400" },
    storniert:     { label: t("statusCancelled"),  cls: "bg-red-900/40 text-red-400" },
  };

  const { data: buchungen } = await supabase
    .from("buchungen")
    .select("id, buchungs_nummer, kunden_name, kunden_email, datum, personen, gesamtpreis, provision_betrag, auszahlungs_betrag, status, created_at, anbieter_id")
    .order("created_at", { ascending: false });

  // Anbieter-Namen nachladen
  const anbieterIds = [...new Set((buchungen ?? []).map((b: { anbieter_id: string }) => b.anbieter_id).filter(Boolean))];
  const { data: anbieter } = anbieterIds.length
    ? await supabase.from("anbieter_profile").select("id, name").in("id", anbieterIds)
    : { data: [] };
  const anbieterMap = Object.fromEntries((anbieter ?? []).map((a: { id: string; name: string }) => [a.id, a.name]));

  const gesamt      = (buchungen ?? []).filter((b: { status: string }) => b.status !== "storniert").reduce((s: number, b: { gesamtpreis: number }) => s + Number(b.gesamtpreis), 0);
  const provision   = (buchungen ?? []).filter((b: { status: string }) => b.status !== "storniert").reduce((s: number, b: { provision_betrag: number }) => s + Number(b.provision_betrag), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-white">{t("heading")}</h1>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-500 text-xs">{t("statRevenue")}</p>
            <p className="font-black text-white">{gesamt.toFixed(2)} €</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">{t("statProvision")}</p>
            <p className="font-black text-[#00838F]">{provision.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 text-left">{t("colBooking")}</th>
                <th className="px-4 py-3 text-left">{t("colCustomer")}</th>
                <th className="px-4 py-3 text-left">{t("colProvider")}</th>
                <th className="px-4 py-3 text-left">{t("colDate")}</th>
                <th className="px-4 py-3 text-right">{t("colAmount")}</th>
                <th className="px-4 py-3 text-right">{t("colProvision")}</th>
                <th className="px-4 py-3 text-right">{t("colToProvider")}</th>
                <th className="px-4 py-3 text-center">{t("colStatus")}</th>
                <th className="px-4 py-3 text-center">{t("colTicket")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(buchungen ?? []).map((b: {
                id: string; buchungs_nummer: string; kunden_name: string; kunden_email: string;
                datum: string; personen: number; gesamtpreis: number; provision_betrag: number;
                auszahlungs_betrag: number; status: string; created_at: string; anbieter_id?: string;
              }) => {
                const st = STATUS_INFO[b.status] ?? STATUS_INFO.ausstehend;
                return (
                  <tr key={b.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{b.buchungs_nummer}</p>
                      <p className="text-[10px] text-gray-500">{new Date(b.created_at).toLocaleDateString("de-DE")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{b.kunden_name}</p>
                      <p className="text-[10px] text-gray-500">{b.kunden_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{anbieterMap[b.anbieter_id ?? ""] ?? "–"}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(b.datum).toLocaleDateString("de-DE")}</td>
                    <td className="px-4 py-3 text-right font-bold text-white">{Number(b.gesamtpreis).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-right text-[#00838F] font-semibold">{Number(b.provision_betrag).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-right text-gray-400">{Number(b.auszahlungs_betrag).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {b.status === "bestaetigt" || b.status === "abgeschlossen" ? (
                        <AdminTicketModal buchungsNummer={b.buchungs_nummer} />
                      ) : (
                        <span className="text-gray-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(buchungen ?? []).length === 0 && (
            <p className="py-10 text-center text-gray-500 text-sm">{t("noBookings")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
