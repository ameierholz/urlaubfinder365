"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, PackageSearch } from "lucide-react";

interface Angebot {
  id: string;
  titel: string;
  slug: string;
  ziel: string;
  preis: number;
  status: string;
  created_at: string;
}

interface AngeboteContentProps {
  angebote: Angebot[];
}

export default function AngeboteContent({ angebote }: AngeboteContentProps) {
  const t = useTranslations("anbieterPortalPage.offers");
  const tDashboard = useTranslations("anbieterPortalPage.dashboard");

  const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
    entwurf:    { label: t("statusDraft"),    cls: "bg-gray-100 text-gray-600" },
    aktiv:      { label: t("statusActive"),   cls: "bg-emerald-100 text-emerald-700" },
    pausiert:   { label: t("statusPaused"),   cls: "bg-amber-100 text-amber-700" },
    archiviert: { label: t("statusArchived"), cls: "bg-red-50 text-red-500" },
  };

  const count = angebote.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t("heading")}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("count", { count, plural: count !== 1 ? "e" : "" })}
          </p>
        </div>
        <Link href="/anbieter/angebote/neu/"
          className="flex items-center gap-2 bg-[#00838F] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#006d78] transition-colors text-sm">
          <Plus className="w-4 h-4" /> {tDashboard("newOffer")}
        </Link>
      </div>

      {angebote.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <PackageSearch className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-gray-900 mb-2">{t("empty")}</h2>
          <p className="text-gray-500 text-sm mb-5">{t("emptyDesc")}</p>
          <Link href="/anbieter/angebote/neu/"
            className="inline-flex items-center gap-2 bg-[#00838F] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#006d78] transition-colors text-sm">
            <Plus className="w-4 h-4" /> {t("createNow")}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {angebote.map((a) => {
              const st = STATUS_LABEL[a.status] ?? STATUS_LABEL.entwurf;
              return (
                <div key={a.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{a.titel}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.ziel} · {t("priceFrom", { price: Number(a.preis).toFixed(2) })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/marktplatz/${a.slug}/`} target="_blank"
                      className="p-2 text-gray-400 hover:text-[#00838F] hover:bg-gray-50 rounded-lg transition-colors" title={t("preview")}>
                      {a.status === "aktiv" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Link>
                    <Link href={`/anbieter/angebote/${a.id}/bearbeiten/`}
                      className="p-2 text-gray-400 hover:text-[#00838F] hover:bg-gray-50 rounded-lg transition-colors" title={t("edit")}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
