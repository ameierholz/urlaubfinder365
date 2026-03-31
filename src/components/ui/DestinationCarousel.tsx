"use client";

import { useRef } from "react";
import Link from "next/link";

interface DestItem {
  slug: string;
  name: string;
  country: string;
  flagCode: string; // ISO 3166-1 alpha-2 für flagcdn.com
  image: string;
}

/** Kuratierte Top-Reiseziele – alle Slugs haben eigene Seiten unter /urlaubsziele/ */
const DESTINATIONS: DestItem[] = [
  { slug: "antalya",   name: "Antalya",   country: "Türkei",       flagCode: "tr", image: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=400&q=75" },
  { slug: "mallorca",  name: "Mallorca",  country: "Spanien",      flagCode: "es", image: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=400&q=75" },
  { slug: "kreta",     name: "Kreta",     country: "Griechenland", flagCode: "gr", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=75" },
  { slug: "barcelona", name: "Barcelona", country: "Spanien",      flagCode: "es", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=75" },
  { slug: "hurghada",  name: "Hurghada",  country: "Ägypten",      flagCode: "eg", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75" },
  { slug: "teneriffa", name: "Teneriffa", country: "Spanien",      flagCode: "es", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=75" },
  { slug: "rhodos",    name: "Rhodos",    country: "Griechenland", flagCode: "gr", image: "https://images.unsplash.com/photo-1664118145742-f2ad1c09c10b?w=400&q=75" },
  { slug: "ibiza",     name: "Ibiza",     country: "Spanien",      flagCode: "es", image: "https://images.unsplash.com/photo-1689859870434-8248d5a113c1?w=400&q=75" },
  { slug: "dubai",     name: "Dubai",     country: "VAE",          flagCode: "ae", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=75" },
  { slug: "phuket",    name: "Phuket",    country: "Thailand",     flagCode: "th", image: "https://images.unsplash.com/photo-1704928517302-67b645c9b083?w=400&q=75" },
  { slug: "lissabon",  name: "Lissabon",  country: "Portugal",     flagCode: "pt", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=75" },
  { slug: "sardinien", name: "Sardinien", country: "Italien",      flagCode: "it", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=75" },
  { slug: "santorini", name: "Santorini", country: "Griechenland", flagCode: "gr", image: "https://images.unsplash.com/photo-1618478669118-1b3eb2b2bb95?w=400&q=75" },
  { slug: "side",      name: "Side",      country: "Türkei",       flagCode: "tr", image: "https://images.unsplash.com/photo-1561712815-883650f32f92?w=400&q=75" },
];

export interface DestCarouselItem {
  slug: string;
  name: string;
  country: string;
  flagCode?: string;
  image: string;
}

interface Props {
  title?: string;
  accentColor?: string;
  /** Wenn angegeben, werden diese Items statt der Standard-DESTINATIONS gezeigt */
  items?: DestCarouselItem[];
  /** Link hinter "Alle Ziele →" – default /urlaubsziele/. Wird ausgeblendet wenn items übergeben werden. */
  allHref?: string;
}

export default function DestinationCarousel({
  title = "Beliebte Reiseziele",
  accentColor = "#00838F",
  items,
  allHref = "/urlaubsziele/",
}: Props) {
  const list = items ?? DESTINATIONS;
  const showAllLink = !items; // Nur anzeigen wenn Standard-DESTINATIONS genutzt werden
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 480 : -480, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">Direkt zum Reiseziel – Angebote & Reisetipps</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Nav Arrows (Desktop) */}
          <button
            onClick={() => scroll("left")}
            aria-label="Zurück"
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors text-gray-500"
          >
            ‹
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Weiter"
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors text-gray-500"
          >
            ›
          </button>
          {showAllLink && (
            <Link
              href={allHref}
              className="text-xs font-semibold hover:underline ml-1"
              style={{ color: accentColor }}
            >
              Alle Ziele →
            </Link>
          )}
        </div>
      </div>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {list.map((d) => (
          <Link
            key={d.slug}
            href={`/urlaubsziele/${d.slug}/`}
            className="group flex-shrink-0 w-36 rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            {/* Bild */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
              <img
                src={d.image}
                alt={`${d.name} Urlaub`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Flagge oben rechts */}
              {d.flagCode && (
                <div className="absolute top-2 right-2">
                  <img
                    src={`https://flagcdn.com/24x18/${d.flagCode}.png`}
                    srcSet={`https://flagcdn.com/48x36/${d.flagCode}.png 2x`}
                    width={24}
                    height={18}
                    alt={d.country}
                    className="rounded-[2px] shadow-md"
                  />
                </div>
              )}

              {/* Name + Land unten */}
              <div className="absolute bottom-2.5 left-3 right-3">
                <p className="text-white font-bold text-sm leading-tight drop-shadow">{d.name}</p>
                <p className="text-white/70 text-[10px] leading-tight">{d.country}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
