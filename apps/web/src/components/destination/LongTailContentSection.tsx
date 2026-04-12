"use client";

import Link from "next/link";

const AGENT = "993243";
const IBE_BASE = "https://ibe.specials.de/";

interface Props {
  name: string;
  slug: string;
  regionId?: string;
  hasTiqets?: boolean;
}

const SEASONS = [
  { label: "Frühling", months: "März–Mai",  emoji: "🌸", query: "fruehling" },
  { label: "Sommer",   months: "Jun–Aug",   emoji: "☀️", query: "sommer"   },
  { label: "Herbst",   months: "Sep–Nov",   emoji: "🍂", query: "herbst"   },
  { label: "Winter",   months: "Dez–Feb",   emoji: "❄️", query: "winter"   },
];

interface QuickLink {
  label: string;
  /** Wenn gesetzt → normaler Link statt Modal */
  href?: string;
  /** IBE-Parameter für das Reisemodal */
  ibeParams?: Record<string, string>;
}

function openBooking(regionId: string, ibeParams: Record<string, string>, title: string) {
  const p = new URLSearchParams({ agent: AGENT, adults: "2", duration: "7-7", regionId, ...ibeParams });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ibeOpenBooking?.(`${IBE_BASE}?${p.toString()}`, title);
}

export default function LongTailContentSection({ name, slug, regionId, hasTiqets }: Props) {
  const quickLinks: QuickLink[] = [
    { label: `${name} günstig buchen`,    ibeParams: { from: "14", to: "42" } },
    { label: `${name} Last Minute Deals`, ibeParams: { from: "3", to: "21" } },
    { label: `${name} All Inclusive`,      ibeParams: { boardCode: "AI" } },
    { label: `${name} Familienurlaub`,     ibeParams: { from: "14", to: "42", children: "8,8" } },
    { label: `${name} Frühbucher`,         ibeParams: { from: "60", to: "365" } },
    ...(hasTiqets ? [{ label: `${name} Aktivitäten & Touren`, href: `/aktivitaeten/${slug}/` }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Wann ist die beste Reisezeit für {name}?
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Preisverläufe und Reisezeiten für {name} Urlaub im Überblick – klicken Sie auf eine Jahreszeit für aktuelle Angebote.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {SEASONS.map(({ label, months, emoji }) => (
          <Link
            key={label}
            href={`/preisentwicklung/?destination=${slug}`}
            className="flex flex-col items-center bg-gray-50 border border-gray-100 hover:border-[#1db682] hover:bg-[#1db682]/5 rounded-xl p-4 transition-all group"
          >
            <span className="text-2xl mb-2">{emoji}</span>
            <p className="font-semibold text-gray-800 text-sm group-hover:text-[#1db682] text-center">
              {name} im {label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{months}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {quickLinks.map(({ label, href, ibeParams }) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-3 rounded-lg transition-all group"
            >
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#1db682] text-xs ml-2 shrink-0">→</span>
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              onClick={() => regionId && ibeParams && openBooking(regionId, ibeParams, label)}
              disabled={!regionId}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-3 rounded-lg transition-all group text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#1db682] text-xs ml-2 shrink-0">→</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
