"use client";

import { useRef } from "react";

export interface DestinationCard {
  name: string;
  flag: string;
  image: string;
  teaser: string;
  deeplink: string;
}

interface Props {
  destinations: DestinationCard[];
  accentColor?: string;
  carouselLabel?: string;
}

/** Emoji-Flag → ISO 3166-1 alpha-2 für flagcdn.com (Windows zeigt keine Emoji-Flaggen) */
const FLAG_CODES: Record<string, string> = {
  "🇦🇪": "ae", "🇦🇹": "at", "🇧🇪": "be", "🇧🇬": "bg", "🇧🇷": "br",
  "🇨🇾": "cy", "🇨🇿": "cz", "🇩🇪": "de", "🇩🇰": "dk", "🇪🇬": "eg",
  "🇪🇸": "es", "🇫🇷": "fr", "🇬🇧": "gb", "🇬🇷": "gr", "🇭🇷": "hr",
  "🇭🇺": "hu", "🇮🇩": "id", "🇮🇳": "in", "🇮🇹": "it", "🇯🇵": "jp",
  "🇲🇦": "ma", "🇲🇹": "mt", "🇲🇻": "mv", "🇲🇽": "mx", "🇳🇱": "nl",
  "🇵🇹": "pt", "🇷🇴": "ro", "🇸🇬": "sg", "🇸🇮": "si", "🇸🇰": "sk",
  "🇹🇭": "th", "🇹🇳": "tn", "🇹🇷": "tr", "🇺🇸": "us", "🇻🇳": "vn",
  "🇿🇦": "za", "🇨🇺": "cu", "🇯🇲": "jm", "🇩🇴": "do", "🇧🇧": "bb",
};

function FlagImg({ emoji, name, size = "sm" }: { emoji: string; name: string; size?: "sm" | "lg" }) {
  const code = FLAG_CODES[emoji];
  if (!code) {
    return <span className={size === "lg" ? "text-2xl leading-none" : "text-base leading-none"}>{emoji}</span>;
  }
  // flagcdn.com only supports standard sizes: 20x15, 24x18, 32x24, 48x36, 64x48 …
  const w = size === "lg" ? 32 : 24;
  const h = size === "lg" ? 24 : 18;
  const w2 = size === "lg" ? 64 : 48;
  const h2 = size === "lg" ? 48 : 36;
  return (
    <img
      src={`https://flagcdn.com/${w}x${h}/${code}.png`}
      srcSet={`https://flagcdn.com/${w2}x${h2}/${code}.png 2x`}
      width={w}
      height={h}
      alt={name}
      className="rounded-[2px] shadow-sm flex-shrink-0"
    />
  );
}

export default function DestinationGrid({ destinations, accentColor = "#00838F", carouselLabel = "Weitere Reiseziele" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const open = (url: string, name: string) => {
    const ibe = (window as any).ibeOpenBooking;
    if (typeof ibe === "function") {
      ibe(url, `${name} – Urlaub buchen`);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 520 : -520, behavior: "smooth" });
  };

  const [featured, ...rest] = destinations;

  return (
    <div className="space-y-5">

      {/* ── Featured card (Redakteurstipp) ── */}
      {featured && (
        <button
          onClick={() => open(featured.deeplink, featured.name)}
          className="group w-full text-left rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 md:grid md:grid-cols-[3fr_2fr]"
        >
          {/* Bild */}
          <div className="relative h-56 md:h-full min-h-[14rem] overflow-hidden">
            <img
              src={featured.image}
              alt={`${featured.name} Urlaub`}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 md:hidden">
              <FlagImg emoji={featured.flag} name={featured.name} size="sm" />
              <span className="text-white font-bold text-lg drop-shadow">{featured.name}</span>
            </div>
          </div>

          {/* Redaktioneller Inhalt */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full mb-4 shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                ⭐ Redakteurstipp
              </span>
              <div className="hidden md:flex items-center gap-2.5 mb-3">
                <FlagImg emoji={featured.flag} name={featured.name} size="lg" />
                <h3 className="text-2xl font-extrabold text-gray-900">{featured.name}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{featured.teaser}</p>
            </div>
            <div className="mt-6">
              <span
                className="inline-flex items-center gap-2 text-sm font-bold py-2.5 px-5 rounded-full text-white transition-opacity group-hover:opacity-90 shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                Jetzt Angebote ansehen →
              </span>
            </div>
          </div>
        </button>
      )}

      {/* ── Restliche Ziele: Horizontal Carousel ── */}
      {rest.length > 0 && (
        <div>
          {/* Carousel-Header mit Arrows */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {carouselLabel}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Zurück"
                className="w-7 h-7 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center text-gray-500 text-sm font-bold"
              >
                ‹
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Weiter"
                className="w-7 h-7 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center text-gray-500 text-sm font-bold"
              >
                ›
              </button>
            </div>
          </div>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {rest.map((d) => (
              <button
                key={d.name}
                onClick={() => open(d.deeplink, d.name)}
                className="group flex-shrink-0 w-48 text-left rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white"
              >
                {/* Bild mit Gradient + Flag + Name */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name} Urlaub`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Accent-Stripe on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: accentColor }}
                  />

                  {/* Flag + Name unten links */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5">
                    <FlagImg emoji={d.flag} name={d.name} size="sm" />
                    <span className="text-white font-bold text-sm leading-tight drop-shadow truncate">
                      {d.name}
                    </span>
                  </div>
                </div>

                {/* Teaser + CTA */}
                <div className="p-3">
                  <p className="text-gray-500 text-[11px] leading-snug mb-2.5 line-clamp-2 min-h-[2rem]">
                    {d.teaser}
                  </p>
                  <span
                    className="inline-block text-[11px] font-bold py-1.5 px-3 rounded-full text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Angebote →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
