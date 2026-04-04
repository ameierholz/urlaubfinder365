/**
 * Server Component – zeigt Reisewarnung-Badge auf Urlaubsziel-Seiten.
 * Fragt die Datenbank direkt ab (kein Client-Fetch nötig).
 */

import Link from "next/link";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Props {
  /** Deutschsprachiger Landesname, z. B. "Türkei", "Ägypten" */
  countryName: string;
}

type WarningLevel = "warning" | "partial" | "note" | "none";

interface TravelWarning {
  country_name: string;
  warning_level: WarningLevel;
  situation_short: string | null;
  aa_last_updated: string | null;
}

async function fetchWarning(countryName: string): Promise<TravelWarning | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("travel_warnings")
      .select("country_name, warning_level, situation_short, aa_last_updated")
      .ilike("country_name", countryName.trim())
      .not("warning_level", "eq", "none")
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

const CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon_color: "text-red-500",
    badge_bg: "bg-red-500",
    label: "Reisewarnung",
    hint: "Das Auswärtige Amt warnt ausdrücklich vor Reisen in dieses Land.",
  },
  partial: {
    icon: AlertCircle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon_color: "text-orange-500",
    badge_bg: "bg-orange-500",
    label: "Teilreisewarnung",
    hint: "Warnung gilt für Teile des Landes – bitte genaue Region prüfen.",
  },
  note: {
    icon: Info,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    icon_color: "text-yellow-600",
    badge_bg: "bg-yellow-500",
    label: "Sicherheitshinweis",
    hint: "Das Auswärtige Amt empfiehlt erhöhte Vorsicht.",
  },
} as const;

export default async function TravelWarningBadge({ countryName }: Props) {
  const warning = await fetchWarning(countryName);
  if (!warning || warning.warning_level === "none") return null;

  const cfg = CONFIG[warning.warning_level as keyof typeof CONFIG];
  if (!cfg) return null;

  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${cfg.badge_bg}/10 shrink-0`}>
          <Icon className={`w-5 h-5 ${cfg.icon_color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${cfg.badge_bg}`}>
              {cfg.label}
            </span>
            <p className={`text-sm font-semibold ${cfg.text}`}>{cfg.hint}</p>
          </div>
          {warning.situation_short && (
            <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
              {warning.situation_short}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Link
              href="/reisewarnungen/"
              className={`text-xs font-semibold ${cfg.text} hover:underline`}
            >
              Alle Reisewarnungen →
            </Link>
            <a
              href="https://www.auswaertiges-amt.de/de/service/laender-reisewarnungen/-/231198"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Auswärtiges Amt ↗
            </a>
            {warning.aa_last_updated && (
              <span className="text-xs text-gray-400">
                Stand: {new Date(warning.aa_last_updated).toLocaleDateString("de-DE")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
