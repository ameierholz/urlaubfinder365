"use client";

import { useTranslations } from "next-intl";
import BuchungStatusButton from "@/components/anbieter/BuchungStatusButton";

interface Buchung {
  id: string;
  buchungs_nummer: string;
  kunden_name: string;
  kunden_email: string;
  kunden_telefon?: string;
  datum: string;
  personen: number;
  gesamtpreis: number;
  auszahlungs_betrag: number;
  status: string;
  created_at: string;
  notiz?: string;
  angebot_id?: string;
}

interface BuchungenContentProps {
  buchungen: Buchung[];
  angebotMap: Record<string, string>;
}

export default function BuchungenContent({ buchungen, angebotMap }: BuchungenContentProps) {
  const t = useTranslations("anbieterPortalPage.bookings");

  const STATUS_INFO: Record<string, { label: string; cls: string }> = {
    ausstehend:    { label: t("statusPending"),   cls: "bg-amber-100 text-amber-700" },
    bestaetigt:    { label: t("statusConfirmed"),  cls: "bg-emerald-100 text-emerald-700" },
    abgeschlossen: { label: t("statusCompleted"),  cls: "bg-blue-100 text-blue-700" },
    storniert:     { label: t("statusCancelled"),  cls: "bg-red-100 text-red-600" },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">{t("heading")}</h1>

      {buchungen.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <p className="font-medium">{t("noBookings")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buchungen.map((b) => {
            const st = STATUS_INFO[b.status] ?? STATUS_INFO.ausstehend;
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm">{b.buchungs_nummer}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">{angebotMap[b.angebot_id ?? ""] ?? t("unknownOffer")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{Number(b.gesamtpreis).toFixed(2)} €</p>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {t("yourShare", { amount: Number(b.auszahlungs_betrag).toFixed(2) })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 mb-4">
                  <div><span className="text-gray-400 block">{t("colCustomer")}</span>{b.kunden_name}</div>
                  <div><span className="text-gray-400 block">{t("colEmail")}</span><a href={`mailto:${b.kunden_email}`} className="text-[#00838F] hover:underline">{b.kunden_email}</a></div>
                  <div><span className="text-gray-400 block">{t("colDate")}</span>{new Date(b.datum).toLocaleDateString("de-DE")}</div>
                  <div><span className="text-gray-400 block">{t("colPersons")}</span>{b.personen}</div>
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
