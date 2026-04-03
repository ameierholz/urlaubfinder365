"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Plane, UtensilsCrossed, Clock, Users } from "lucide-react";

const BASE = "https://b2b.specials.de/index/jump/119/2780/993243/";

const REISEARTEN_CONFIG = [
  {
    emoji: "✈️",
    badgeColor: "bg-[#6CC4BA] text-white",
    bg: "from-[#00838F] to-[#005F6B]",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2`,
    Icon: Plane,
    key: "pauschal" as const,
  },
  {
    emoji: "🍹",
    badgeColor: "bg-amber-500 text-white",
    bg: "from-amber-600 to-orange-700",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2&boardCode=AI`,
    Icon: UtensilsCrossed,
    key: "allInclusive" as const,
  },
  {
    emoji: "📅",
    badgeColor: "bg-sky-500 text-white",
    bg: "from-sky-600 to-blue-700",
    url: `${BASE}?from=120&to=365&duration=7-14&adults=2`,
    Icon: Clock,
    key: "fruehbucher" as const,
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    badgeColor: "bg-violet-500 text-white",
    bg: "from-violet-600 to-purple-700",
    url: `${BASE}?from=14&to=180&duration=7-14&adults=2&children=1`,
    Icon: Users,
    key: "familie" as const,
  },
];

export default function ReiseartenCards() {
  const t = useTranslations("ui");

  function openModal(url: string, title: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (window as any).ibeOpenBooking;
    if (typeof fn === "function") {
      fn(url, title);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-1">{t("reisearten.sectionLabel")}</p>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {t("reisearten.sectionTitle")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {t("reisearten.sectionSubtitle")}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REISEARTEN_CONFIG.map(({ emoji, badgeColor, bg, url, Icon, key }) => {
            const label = t(`reisearten.${key}Label`);
            const tagline = t(`reisearten.${key}Tagline`);
            const desc = t(`reisearten.${key}Desc`);
            const badge = t(`reisearten.${key}Badge`);
            const highlights = [
              t(`reisearten.${key}H1`),
              t(`reisearten.${key}H2`),
              t(`reisearten.${key}H3`),
            ];
            return (
              <button
                key={key}
                onClick={() => openModal(url, label)}
                className="group rounded-2xl overflow-hidden shadow-md text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col border border-gray-100"
              >
                {/* Gradient Header */}
                <div className={`bg-linear-to-br ${bg} px-5 py-5 text-white relative`}>
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                    {badge}
                  </span>
                  <div className="flex items-center gap-3 pr-16 mb-2">
                    <span className="text-4xl leading-none drop-shadow">{emoji}</span>
                    <h3 className="font-extrabold text-xl leading-tight">{label}</h3>
                  </div>
                  <p className="text-white/80 text-xs leading-snug">{tagline}</p>
                </div>

                {/* Body */}
                <div className="bg-white p-4 flex flex-col flex-1">
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>

                  <ul className="space-y-1.5 mb-4">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#00838F] group-hover:gap-3 transition-all duration-150">
                      <Icon className="w-4 h-4 shrink-0" />
                      {t("reisearten.searchCta")}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
