import Link from "next/link";

interface Props {
  name: string;
  slug: string;
  hasTiqets?: boolean;
}

const SEASONS = [
  { label: "Frühling", months: "März–Mai",  emoji: "🌸", query: "fruehling" },
  { label: "Sommer",   months: "Jun–Aug",   emoji: "☀️", query: "sommer"   },
  { label: "Herbst",   months: "Sep–Nov",   emoji: "🍂", query: "herbst"   },
  { label: "Winter",   months: "Dez–Feb",   emoji: "❄️", query: "winter"   },
];

export default function LongTailContentSection({ name, slug, hasTiqets }: Props) {
  const quickLinks = [
    { label: `${name} günstig buchen`,    href: `/guenstig-urlaub-buchen/` },
    { label: `${name} Last Minute Deals`, href: `/last-minute/` },
    { label: `${name} All Inclusive`,     href: `/urlaubsarten/all-inclusive-urlaub/` },
    { label: `${name} Familienurlaub`,    href: `/urlaubsthemen/familienurlaub/` },
    { label: `${name} Frühbucher`,        href: `/urlaubsarten/fruhbucher-urlaub/` },
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
        {quickLinks.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-3 rounded-lg transition-all group"
          >
            <span>{label}</span>
            <span className="text-gray-300 group-hover:text-[#1db682] text-xs ml-2 shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
