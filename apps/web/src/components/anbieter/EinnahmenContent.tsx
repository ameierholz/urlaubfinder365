"use client";

import { useTranslations } from "next-intl";
import { Euro, TrendingUp, Clock } from "lucide-react";
import StripeConnectButton from "@/components/stripe/StripeConnectButton";

interface Auszahlung {
  id: string;
  betrag: number;
  status: string;
  created_at: string;
  ueberwiesen_at?: string;
  referenz?: string;
}

interface BuchungEinnahme {
  buchungs_nummer: string;
  auszahlungs_betrag: number;
  gesamtpreis: number;
  provision_betrag: number;
  status: string;
  datum: string;
  created_at: string;
}

interface EinnahmenContentProps {
  stripeVerbunden: boolean;
  gesamt: number;
  ausgezahlt: number;
  ausstehend: number;
  auszahlungen: Auszahlung[];
  buchungen: BuchungEinnahme[];
}

export default function EinnahmenContent({
  stripeVerbunden,
  gesamt,
  ausgezahlt,
  ausstehend,
  auszahlungen,
  buchungen,
}: EinnahmenContentProps) {
  const t = useTranslations("anbieterPortalPage.earnings");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">{t("heading")}</h1>

      {/* Stripe Connect Banner */}
      <div className={`rounded-2xl border p-5 flex items-start gap-4 flex-wrap ${
        stripeVerbunden
          ? "bg-violet-50 border-violet-200"
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 mb-0.5">
            {stripeVerbunden ? t("stripeActive") : t("stripeSetup")}
          </p>
          <p className="text-xs text-gray-600">
            {stripeVerbunden ? t("stripeActiveDesc") : t("stripeSetupDesc")}
          </p>
        </div>
        <StripeConnectButton complete={stripeVerbunden} />
      </div>

      {/* Uebersicht */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: t("statTotal"), wert: `${gesamt.toFixed(2)} €`, bg: "bg-emerald-50", c: "text-emerald-600" },
          { icon: Euro, label: t("statPaid"), wert: `${ausgezahlt.toFixed(2)} €`, bg: "bg-blue-50", c: "text-blue-600" },
          { icon: Clock, label: t("statPending"), wert: `${ausstehend.toFixed(2)} €`, bg: "bg-amber-50", c: "text-amber-600" },
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
          <h2 className="font-bold text-gray-900">{t("payouts")}</h2>
        </div>
        {auszahlungen.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">{t("noPayouts")}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {auszahlungen.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{Number(a.betrag).toFixed(2)} €</p>
                  <p className="text-xs text-gray-400">
                    {a.status === "ueberwiesen"
                      ? `${t("paidAt", { date: new Date(a.ueberwiesen_at!).toLocaleDateString("de-DE") })}${a.referenz ? ` · ${t("ref", { ref: a.referenz })}` : ""}`
                      : t("createdAt", { date: new Date(a.created_at).toLocaleDateString("de-DE") })}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  a.status === "ueberwiesen" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {a.status === "ueberwiesen" ? t("statusPaid") : t("statusPending")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buchungs-Detail */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t("bookingOverview")}</h2>
        </div>
        {buchungen.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">{t("noCompletedBookings")}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {buchungen.map((b) => (
              <div key={b.buchungs_nummer} className="px-6 py-3.5 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{b.buchungs_nummer}</p>
                  <p className="text-xs text-gray-400">{new Date(b.datum).toLocaleDateString("de-DE")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{t("colBookingPrice")}</p>
                  <p className="font-semibold">{Number(b.gesamtpreis).toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{t("colProvision")}</p>
                  <p className="font-semibold text-red-500">-{Number(b.provision_betrag).toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{t("colYourShare")}</p>
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
