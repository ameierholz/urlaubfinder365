import Link from "next/link";
import AdBanner from "@/components/ui/AdBanner";

const THEMEN_LINKS = [
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/familienurlaub/", label: "👨‍👩‍👧 Familienurlaub" },
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellness" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Themen" },
];

export default function ThemeSidebar() {
  return (
    <aside className="hidden xl:block w-[160px] shrink-0 pr-4">
      <div className="sticky top-24 pt-8 space-y-3">
        {/* Werbebanner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
            Anzeige
          </p>
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </div>

        {/* Last-Minute Promo */}
        <div className="bg-[#00838F]/8 rounded-2xl p-4 border border-[#00838F]/15 text-center">
          <p className="text-xs font-bold text-[#00838F] mb-1">🔥 Last-Minute</p>
          <p className="text-[11px] text-gray-500 mb-3 leading-snug">
            Günstige Reisen – Abreise in 7–14 Tagen
          </p>
          <Link
            href="/last-minute/"
            className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors"
          >
            Deals ansehen →
          </Link>
        </div>

        {/* Urlaubsthemen Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
            🗂️ Urlaubsthemen
          </p>
          <ul className="space-y-1.5">
            {THEMEN_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight"
                >
                  <span className="text-gray-300 shrink-0">›</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
