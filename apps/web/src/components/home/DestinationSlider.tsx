"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface SliderDestination {
  name: string;
  slug: string;
  flagCode: string;
  img: string;
  priceFrom: string;
  label?: string;
}

const DESTINATIONS_STATIC = [
  { key: "tuerkei",       slug: "tuerkei",           flagCode: "tr", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", labelColor: "bg-sand-500" },
  { key: "mallorca",      slug: "balearen",          flagCode: "es", img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", labelColor: "bg-blue-500" },
  { key: "griechenland",  slug: "griechische-inseln", flagCode: "gr", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", labelColor: "" },
  { key: "aegypten",      slug: "aegypten",          flagCode: "eg", img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=80", labelColor: "bg-green-500" },
  { key: "kreta",         slug: "kreta",             flagCode: "gr", img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80", labelColor: "" },
  { key: "portugal",      slug: "portugal",          flagCode: "pt", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", labelColor: "" },
  { key: "italien",       slug: "italien",           flagCode: "it", img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80", labelColor: "" },
  { key: "tunesien",      slug: "tunesien",          flagCode: "tn", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80", labelColor: "bg-red-500" },
  { key: "usa",           slug: "usa-ostkueste",     flagCode: "us", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", labelColor: "" },
  { key: "malediven",     slug: "indischer-ozean",   flagCode: "mv", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", labelColor: "bg-purple-500" },
];

export default function DestinationSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("destinationSlider");

  const DESTINATIONS = DESTINATIONS_STATIC.map((d) => ({
    ...d,
    name: t(`${d.key}Name` as Parameters<typeof t>[0]),
    priceFrom: t(`${d.key}Price` as Parameters<typeof t>[0]),
    label: d.labelColor ? t(`${d.key}Label` as Parameters<typeof t>[0]) : undefined,
  }));

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("a");
    const cardW = card ? card.offsetWidth + 16 : 220;
    scrollRef.current.scrollBy({ left: dir === "right" ? cardW * 3 : -cardW * 3, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
          w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:bg-sand-50 hover:border-sand-200"
        aria-label={t("scrollLeft")}
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {DESTINATIONS.map((dest) => (
          <Link
            key={dest.slug}
            href={`/urlaubsziele/${dest.slug}/`}
            className="shrink-0 w-48 sm:w-52 group/card snap-start"
          >
            <div className="relative rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

              {/* Label Badge */}
              {dest.label && (
                <span
                  className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full ${dest.labelColor || "bg-sand-500"}`}
                >
                  {dest.label}
                </span>
              )}

              {/* Flag */}
              <img
                src={`https://flagcdn.com/24x18/${dest.flagCode}.png`}
                alt={dest.name}
                className="absolute top-3 right-3 rounded shadow-md"
                width={24}
                height={18}
              />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-base leading-tight">{dest.name}</p>
                <p className="text-xs text-white/80 mt-0.5">{t("packageHoliday")}</p>
                <p className="text-sm font-semibold text-sand-300 mt-1">{dest.priceFrom}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
          w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:bg-sand-50 hover:border-sand-200"
        aria-label={t("scrollRight")}
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
