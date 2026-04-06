"use client";

import { useTranslations } from "next-intl";
import { PackageSearch, CalendarCheck, TrendingUp, Euro, Plus, QrCode } from "lucide-react";
import Link from "next/link";

interface Buchung {
  buchungs_nummer: string;
  kunden_name: string;
  gesamtpreis: number;
  status: string;
  created_at: string;
}

interface DashboardContentProps {
  profilName: string;
  verifiziert: boolean;
  angeboteCount: number;
  buchungenCount: number;
  offeneBuchungen: number;
  gesamtEinnahmen: number;
  buchungenDaten: Buchung[];
}

export default function DashboardContent({
  profilName,
  verifiziert,
  angeboteCount,
  buchungenCount,
  offeneBuchungen,
  gesamtEinnahmen,
  buchungenDaten,
}: DashboardContentProps) {
  const t = useTranslations("anbieterPortalPage.dashboard");

  const STATS = [
    { icon: PackageSearch, label: t("statActiveOffers"), wert: angeboteCount, farbe: "text-[#00838F]", bg: "bg-[#00838F]/10" },
    { icon: CalendarCheck, label: t("statTotalBookings"), wert: buchungenCount, farbe: "text-blue-600", bg: "bg-blue-50" },
    { icon: TrendingUp, label: t("statOpenBookings"), wert: offeneBuchungen, farbe: "text-amber-600", bg: "bg-amber-50" },
    { icon: Euro, label: t("statMyShare"), wert: `${gesamtEinnahmen.toFixed(2)} €`, farbe: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t("welcome", { name: profilName.split(" ")[0] })}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
        </div>
        <Link
          href="/anbieter/angebote/neu/"
          className="flex items-center gap-2 bg-[#00838F] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#006d78] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> {t("newOffer")}
        </Link>
      </div>

      {/* Status-Banner wenn noch nicht verifiziert */}
      {!verifiziert && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
          <strong>{t("profilePending")}</strong> {t("profilePendingDesc")}
        </div>
      )}

      {/* Stat-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, wert, farbe, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${farbe}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{wert}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/anbieter/angebote/neu/", icon: Plus, label: t("actionCreateOffer"), desc: t("actionCreateOfferDesc") },
          { href: "/anbieter/buchungen/", icon: CalendarCheck, label: t("actionCheckBookings"), desc: t("actionCheckBookingsDesc") },
          { href: "/anbieter/scanner/", icon: QrCode, label: t("actionScanQr"), desc: t("actionScanQrDesc") },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#00838F] hover:shadow-md transition-all group">
            <Icon className="w-6 h-6 text-[#00838F] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Letzte Buchungen */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t("recentBookings")}</h2>
          <Link href="/anbieter/buchungen/" className="text-xs text-[#00838F] font-semibold hover:underline">
            {t("showAll")}
          </Link>
        </div>
        {buchungenDaten.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            {t("noBookings")}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {buchungenDaten.map((b) => (
              <div key={b.buchungs_nummer} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{b.kunden_name}</p>
                  <p className="text-xs text-gray-400">{b.buchungs_nummer} · {new Date(b.created_at).toLocaleDateString("de-DE")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{Number(b.gesamtpreis).toFixed(2)} €</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === "abgeschlossen" ? "bg-emerald-100 text-emerald-700" :
                    b.status === "bestaetigt"   ? "bg-blue-100 text-blue-700" :
                    b.status === "storniert"    ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {b.status === "abgeschlossen" ? t("statusCompleted") :
                     b.status === "bestaetigt"   ? t("statusConfirmed") :
                     b.status === "storniert"    ? t("statusCancelled") : t("statusPending")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
