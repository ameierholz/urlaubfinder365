"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const TYPEN_META = [
  { emoji: "🏖️", color: "#6CC4BA", bg: "rgba(108,196,186,0.1)" },
  { emoji: "🍹", color: "#c49038", bg: "rgba(196,144,56,0.1)" },
  { emoji: "👨‍👩‍👧‍👦", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { emoji: "🏛️", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { emoji: "⚡", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  { emoji: "🌍", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
];

export default function UrlaubstypFinder() {
  const t = useTranslations("urlaubstypen");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {TYPEN_META.map(({ emoji, color, bg }, i) => (
        <Link
          key={i}
          href={t(`type${i}Href`)}
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
            <p className="font-bold text-gray-900 text-sm leading-tight">{t(`type${i}Label`)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
