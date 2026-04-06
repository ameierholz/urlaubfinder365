"use client";

import { useTranslations } from "next-intl";
import ProfilEinrichtenForm from "@/components/anbieter/ProfilEinrichtenForm";

interface ProfilContentProps {
  profilId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initial?: Record<string, any>;
  verifiziert?: boolean;
  status?: string;
}

export default function ProfilContent({ profilId, initial, verifiziert, status }: ProfilContentProps) {
  const t = useTranslations("anbieterPortalPage.profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t("heading")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Status-Badge */}
      {initial && (
        <div className={`rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${
          verifiziert
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : status === "ausstehend"
            ? "bg-amber-50 border border-amber-200 text-amber-700"
            : status === "gesperrt"
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-gray-50 border border-gray-200 text-gray-600"
        }`}>
          {verifiziert
            ? t("statusActive")
            : status === "ausstehend"
            ? t("statusPending")
            : status === "gesperrt"
            ? t("statusBlocked")
            : t("statusIncomplete")}
        </div>
      )}

      <ProfilEinrichtenForm
        profilId={profilId}
        initial={initial}
      />
    </div>
  );
}
