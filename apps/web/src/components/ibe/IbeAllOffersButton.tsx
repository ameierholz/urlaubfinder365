"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { getIbeLanguage } from "@/lib/ibe-locale";

interface Props {
  label: string;
  modalTitle: string;
  regionId?: string;
  cityId?: string;
  boardCode?: string;
  from?: string;
  to?: string;
  duration?: string;
  adults?: string;
  category?: string;
  minRecommrate?: string;
  excludeAi?: boolean;
  accentColor?: string;
}

const AGENT = process.env.NEXT_PUBLIC_TRAVEL_AGENT_ID || "993243";

export default function IbeAllOffersButton({
  label,
  modalTitle,
  regionId,
  cityId,
  boardCode,
  from = "14",
  to = "42",
  duration = "7-7",
  adults = "2",
  minRecommrate,
  excludeAi,
  accentColor = "#1db682",
}: Props) {
  const locale = useLocale();
  const ibeLang = getIbeLanguage(locale);

  const handleClick = useCallback(() => {
    const params = new URLSearchParams({
      agent: AGENT,
      product: "package",
      adults,
      duration,
      _language: ibeLang,
      hSort: "recomrate",
      sortType: "down",
    });
    if (regionId)                params.set("regionId",      regionId);
    if (cityId)                  params.set("cityId",        cityId);
    if (boardCode && !excludeAi) params.set("boardCode",     boardCode);
    if (minRecommrate)           params.set("minRecommrate", minRecommrate);
    params.set("from", from);
    params.set("to",   to);

    const url = `https://ibe.specials.de/?${params}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ibeOpenBooking?.(url, modalTitle);
  }, [ibeLang, regionId, cityId, boardCode, from, to, duration, adults, minRecommrate, excludeAi, modalTitle]);

  return (
    <button
      onClick={handleClick}
      className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm transition-all border-2"
      style={{
        borderColor: accentColor,
        color: accentColor,
        background: `${accentColor}0f`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}1a`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}0f`;
      }}
    >
      {label}
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
