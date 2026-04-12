"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const CARDS = [
  {
    titleKey: "card1Title" as const,
    subtitleKey: "card1Subtitle" as const,
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format",
    color: "from-cyan-600/70",
  },
  {
    titleKey: "card2Title" as const,
    subtitleKey: "card2Subtitle" as const,
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format",
    color: "from-sand-600/70",
  },
  {
    titleKey: "card3Title" as const,
    subtitleKey: "card3Subtitle" as const,
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80&auto=format",
    color: "from-purple-700/70",
  },
  {
    titleKey: "card4Title" as const,
    subtitleKey: "card4Subtitle" as const,
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80&auto=format",
    color: "from-green-700/70",
  },
];

export default function LifestyleCards() {
  const t = useTranslations("lifestyleCards");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <Link
          key={card.titleKey}
          href={card.href}
          className="group relative rounded-2xl overflow-hidden h-52 sm:h-64 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.img}
            alt={t(card.titleKey)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div
            className={`absolute inset-0 bg-linear-to-t ${card.color} to-transparent`}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-xs font-medium text-white/75 uppercase tracking-widest mb-1">
              {t(card.subtitleKey)}
            </p>
            <h3 className="text-xl font-bold leading-tight drop-shadow-sm">
              {t(card.titleKey)}
            </h3>
            <div className="mt-2 h-0.5 w-0 bg-white group-hover:w-12 transition-all duration-300 rounded-full" />
          </div>
        </Link>
      ))}
    </div>
  );
}
