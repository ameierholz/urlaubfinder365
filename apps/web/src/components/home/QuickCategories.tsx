"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plane, Zap, Building2, Anchor, BookOpen } from "lucide-react";

const CATS_META = [
  { icon: Plane,     color: "#c49038", glow: "rgba(196,144,56,0.25)" },
  { icon: Zap,       color: "#ef4444", glow: "rgba(239,68,68,0.25)" },
  { icon: Plane,     color: "#6CC4BA", glow: "rgba(108,196,186,0.25)" },
  { icon: Building2, color: "#3b82f6", glow: "rgba(59,130,246,0.25)" },
  { icon: Anchor,    color: "#8b5cf6", glow: "rgba(139,92,246,0.25)" },
  { icon: BookOpen,  color: "#10b981", glow: "rgba(16,185,129,0.25)" },
];

export default function QuickCategories({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("quickCats");

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6">
      {CATS_META.map(({ icon: Icon, color, glow }, i) => (
        <Link
          key={i}
          href={t(`cat${i}Href`)}
          className={`group relative flex flex-col items-center gap-2.5 py-4 px-3 text-center transition-all duration-200
            ${transparent
              ? "border-r border-white/10 last:border-r-0 hover:bg-white/10"
              : "border-r border-gray-100 last:border-r-0 hover:bg-gray-50"
            }`}
        >
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{ backgroundColor: transparent ? "rgba(255,255,255,0.12)" : glow }}
          >
            <Icon className="w-5 h-5 transition-all duration-200" style={{ color }} />
          </div>

          {/* Text */}
          <div>
            <p className={`font-bold text-sm leading-tight ${transparent ? "text-white/90" : "text-gray-800"}`}>
              {t(`cat${i}Label`)}
            </p>
            <p className={`text-xs mt-0.5 ${transparent ? "text-white/45" : "text-gray-400"}`}>
              {t(`cat${i}Sub`)}
            </p>
          </div>

          {/* Hover-Unterstrich */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-8 rounded-full transition-all duration-300"
            style={{ backgroundColor: color }}
          />
        </Link>
      ))}
    </div>
  );
}
