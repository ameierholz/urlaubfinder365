import Link from "next/link";

interface Props {
  name: string;
}

const URLAUBSARTEN = [
  { href: "/urlaubsarten/pauschalreisen/",       emoji: "✈️",  suffix: "Pauschalreisen" },
  { href: "/urlaubsarten/all-inclusive-urlaub/", emoji: "🥂",  suffix: "All Inclusive" },
  { href: "/urlaubsarten/last-minute-urlaub/",   emoji: "⚡",  suffix: "Last Minute" },
  { href: "/urlaubsarten/fruhbucher-urlaub/",    emoji: "📅",  suffix: "Frühbucher" },
];

const URLAUBSTHEMEN = [
  { href: "/urlaubsthemen/strandurlaub/",   emoji: "🏖️", suffix: "Strandurlaub" },
  { href: "/urlaubsthemen/familienurlaub/", emoji: "👨‍👩‍👧",  suffix: "Familienurlaub" },
  { href: "/urlaubsthemen/wellnessurlaub/", emoji: "🧖",  suffix: "Wellness" },
  { href: "/urlaubsthemen/staedtereisen/",  emoji: "🏙️", suffix: "Städtereise" },
  { href: "/urlaubsthemen/adults-only/",    emoji: "💑",  suffix: "Adults Only" },
  { href: "/urlaubsthemen/luxusurlaub/",    emoji: "⭐",  suffix: "Luxus" },
  { href: "/urlaubsthemen/singlereisen/",   emoji: "🧳",  suffix: "Singles" },
  { href: "/urlaubsthemen/abenteuerurlaub/",emoji: "🏔️", suffix: "Abenteuer" },
];

export default function DestinationHubLinks({ name }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-5">
        {name} – alle Urlaubsarten &amp; Themen
      </h2>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Reisearten</p>
          <div className="flex flex-wrap gap-2">
            {URLAUBSARTEN.map(({ href, emoji, suffix }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-all"
              >
                <span>{emoji}</span>
                {suffix} {name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Urlaubsthemen</p>
          <div className="flex flex-wrap gap-2">
            {URLAUBSTHEMEN.map(({ href, emoji, suffix }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#6991d8] hover:text-[#6991d8] text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-all"
              >
                <span>{emoji}</span>
                {suffix} {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
