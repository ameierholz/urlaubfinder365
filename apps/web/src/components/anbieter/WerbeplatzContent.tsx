"use client";

import { useTranslations } from "next-intl";
import { Megaphone } from "lucide-react";
import WerbeplatzBuchungForm from "@/components/anbieter/WerbeplatzBuchungForm";

export default function WerbeplatzContent() {
  const t = useTranslations("anbieterPortalPage.adSpace");

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center shrink-0">
          <Megaphone className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t("heading")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Vorteile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "\u{1F4C8}", titel: t("benefitReach"), text: t("benefitReachDesc") },
          { icon: "\u26A1",    titel: t("benefitInstant"), text: t("benefitInstantDesc") },
          { icon: "\u{1F3AF}", titel: t("benefitTargeted"), text: t("benefitTargetedDesc") },
        ].map(({ icon, titel, text }) => (
          <div key={titel} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-bold text-gray-900 text-sm">{titel}</p>
            <p className="text-xs text-gray-500 mt-1">{text}</p>
          </div>
        ))}
      </div>

      {/* Buchungsformular */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <WerbeplatzBuchungForm />
      </div>
    </div>
  );
}
