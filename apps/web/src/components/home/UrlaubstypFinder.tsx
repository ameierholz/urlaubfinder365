"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const TYPEN = [
  { emoji: "🏖️", color: "#6CC4BA", bg: "rgba(108,196,186,0.1)", labelKey: "strand",      href: "/urlaubsthemen/strandurlaub/" },
  { emoji: "🍹", color: "#c97d00", bg: "rgba(201,125,0,0.1)",   labelKey: "allInclusive", href: "/urlaubsarten/all-inclusive-urlaub/" },
  { emoji: "👨‍👩‍👧‍👦", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  labelKey: "familie",      href: "/urlaubsthemen/familienurlaub/" },
  { emoji: "🏛️", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  labelKey: "kultur",       href: "/urlaubsthemen/staedtereisen/" },
  { emoji: "⚡", color: "#e74c3c", bg: "rgba(231,76,60,0.1)",   labelKey: "lastMinute",   href: "/last-minute/" },
  { emoji: "🌍", color: "#10b981", bg: "rgba(16,185,129,0.1)",  labelKey: "fernreisen",   href: "/urlaubsziele/" },
] as const;

export default function UrlaubstypFinder() {
  const t = useTranslations("urlaubstypen");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {TYPEN.map(({ emoji, color, bg, labelKey, href }) => (
        <Link
          key={labelKey}
          href={href}
          className="group flex flex-col items-center gap-3 rounded-2xl p-5 text-center
            bg-white border border-gray-100 shadow-sm
            hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          style={{ borderTopColor: color, borderTopWidth: 3 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-200"
            style={{ backgroundColor: bg }}
          >
            {emoji}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{t(labelKey)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
