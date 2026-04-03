import { getTranslations } from "next-intl/server";
import { ShieldCheck, RefreshCcw, BookOpen, HeartHandshake } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck,    titleKey: "cheapestPrice", textKey: "cheapestPriceText", color: "#6CC4BA" },
  { icon: RefreshCcw,     titleKey: "dailyUpdated",  textKey: "dailyUpdatedText",  color: "#c49038" },
  { icon: BookOpen,       titleKey: "freeGuides",    textKey: "freeGuidesText",    color: "#a78bfa" },
  { icon: HeartHandshake, titleKey: "safeAndEasy",   textKey: "safeAndEasyText",   color: "#34d399" },
] as const;

export default async function TrustBar() {
  const t = await getTranslations("trust");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {ITEMS.map(({ icon: Icon, titleKey, textKey, color }) => (
        <div key={titleKey} className="flex flex-col items-center text-center gap-3 group">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:-translate-y-1 duration-300"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <h3 className="font-bold text-gray-900 text-xl">{t(titleKey)}</h3>
          <p className="text-base text-gray-500 leading-relaxed">{t(textKey)}</p>
        </div>
      ))}
    </div>
  );
}
