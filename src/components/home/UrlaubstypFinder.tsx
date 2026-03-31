import Link from "next/link";

const TYPEN = [
  {
    emoji: "🏖️",
    title: "Strand & Meer",
    text: "Sonne, Sand und türkisfarbenes Wasser. Für alle, die einfach nur abschalten wollen.",
    href: "/urlaubsziele/tuerkei/",
    color: "#6CC4BA",
    bg: "rgba(108,196,186,0.1)",
  },
  {
    emoji: "🍹",
    title: "All Inclusive",
    text: "Rundum sorglos: Essen, Trinken & Entertainment ohne Zusatzkosten.",
    href: "/urlaubsarten/pauschalreisen/",
    color: "#c49038",
    bg: "rgba(196,144,56,0.1)",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Familienurlaub",
    text: "Unvergessliche Momente für Groß und Klein – kindgerechte Hotels & Clubs.",
    href: "/urlaubsziele/",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    emoji: "🏛️",
    title: "Kultur & Städte",
    text: "Geschichte, Architektur und lebendige Städte – für neugierige Entdecker.",
    href: "/urlaubsziele/",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    emoji: "⚡",
    title: "Last Minute",
    text: "Spontan und flexibel? Sichere dir top Schnäppchen für die nächsten Wochen.",
    href: "/last-minute/",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
  {
    emoji: "🌍",
    title: "Fernreisen",
    text: "Malediven, Thailand, Karibik – traumhafte Fernziele für das Abenteuer deines Lebens.",
    href: "/urlaubsziele/indischer-ozean/",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
];

export default function UrlaubstypFinder() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {TYPEN.map((t) => (
        <Link
          key={t.title}
          href={t.href}
          className="group flex flex-col items-center gap-3 rounded-2xl p-5 text-center
            bg-white border border-gray-100 shadow-sm
            hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          style={{ borderTopColor: t.color, borderTopWidth: 3 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-200"
            style={{ backgroundColor: t.bg }}
          >
            {t.emoji}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{t.title}</p>
            <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{t.text}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
