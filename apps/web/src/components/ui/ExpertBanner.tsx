"use client";

import { useTranslations } from "next-intl";
import type { Expert } from "@/lib/experts";

interface Props {
  expert: Expert;
  quote: string;
  accentColor?: string;
  /** Optionaler persönlicher Tipp z. B. "Mein Lieblingshotel: ..." */
  tip?: string;
  /** Deeplink zur Buchungsseite – öffnet IBE-Modal oder neuen Tab */
  deeplink?: string;
  /** Beschriftung des Buttons, Standard: "Jetzt Angebote ansehen" */
  deeplinkLabel?: string;
}

export default function ExpertBanner({
  expert,
  quote,
  accentColor = "#00838F",
  tip,
  deeplink,
  deeplinkLabel,
}: Props) {
  const t = useTranslations("ui");
  const handleClick = () => {
    if (!deeplink) return;
    const ibe = (window as any).ibeOpenBooking;
    if (typeof ibe === "function") {
      ibe(deeplink, `${expert.name} empfiehlt`);
    } else {
      window.open(deeplink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden border"
      style={{ borderColor: accentColor + "33" }}
    >
      {/* Farbstreifen oben */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      <div className="bg-white px-6 py-6 md:px-8 md:py-7">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">💬</span>
          <span
            className="text-[11px] font-extrabold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {t("expertBanner.badge")}
          </span>
        </div>

        <div className="flex items-start gap-4 md:gap-6">
          {/* Foto */}
          <div className="shrink-0">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-[3px] shadow-md"
              style={{ borderColor: accentColor }}
            >
              <img
                src={expert.image}
                alt={expert.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-[15px] leading-tight">
              {expert.name}
            </p>
            <p className="text-xs text-gray-400 mb-3">{expert.role}</p>

            {/* Zitat */}
            <blockquote
              className="text-gray-700 text-sm leading-relaxed pl-3 italic"
              style={{ borderLeft: `3px solid ${accentColor}` }}
            >
              „{quote}"
            </blockquote>

            {/* Tipp + CTA */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {tip && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-xl px-3 py-1.5"
                  style={{ backgroundColor: accentColor + "15", color: accentColor }}
                >
                  ⭐ {tip}
                </span>
              )}
              {deeplink && (
                <button
                  onClick={handleClick}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold py-2 px-4 rounded-full text-white shadow-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  {deeplinkLabel ?? t("expertBanner.defaultDeeplinkLabel")} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
