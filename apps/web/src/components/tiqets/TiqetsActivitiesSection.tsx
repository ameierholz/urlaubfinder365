"use client";

import { useState, useEffect, useRef } from "react";
import ActivitySaveButton from "./ActivitySaveButton";

/* ─────────────────────────── Types ─────────────────────────── */

interface TiqetsProduct {
  title: string;
  city_name?: string;
  images?: { medium?: string; large?: string; extra_large?: string; alt_text?: string }[];
  product_url?: string;
  price?: number;
  prediscount_price?: number;
  discount_percentage?: number;
  promo_label?: string;
  ratings?: { average: number; total: number };
  duration?: string;
  instant_ticket_delivery?: boolean;
  smartphone_ticket?: boolean;
  tagline?: string;
  cancellation?: { policy: string; window: number | null };
  skip_line?: boolean;
}

interface Props {
  cityId: string;
  cityName: string;
  citySlug: string;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function fmtDuration(raw: string) {
  return raw
    .replace(/hours?/i, "Std.")
    .replace(/days?/i, "Tage")
    .replace(/min(utes?|s)?/i, "Min.");
}

/* ─────────────────────────── StarRow ─────────────────────────── */

function StarRow({ rating, small }: { rating: number; small?: boolean }) {
  const full = Math.round(rating);
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`leading-none ${small ? "text-[13px]" : "text-sm"} ${
            s <= full ? "text-yellow-400" : small ? "text-gray-200" : "text-white/30"
          }`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────── SpotlightCard ─────────────────────────── */

function SpotlightCard({ p }: { p: TiqetsProduct }) {
  const img      = p.images?.[0]?.extra_large ?? p.images?.[0]?.large ?? p.images?.[0]?.medium ?? "";
  const alt      = p.images?.[0]?.alt_text ?? p.title;
  const link     = p.product_url ?? "#";
  const price    = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : "0,00";
  const oldPrice = typeof p.prediscount_price === "number" ? p.prediscount_price.toFixed(2).replace(".", ",") : null;
  const discount = typeof p.discount_percentage === "number" && p.discount_percentage > 0 ? p.discount_percentage : null;
  const rating   = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
  const cnt      = p.ratings?.total ?? 0;
  const freeC    = !!p.cancellation && p.cancellation.policy !== "never";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden no-underline flex flex-col w-full h-full min-h-[280px] md:min-h-[320px]"
    >
      {/* Background image */}
      <img
        src={img}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Herz top-left */}
      <div className="absolute top-3 left-3 z-10">
        <ActivitySaveButton activity={p} variant="dark" />
      </div>

      {/* Badges top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
        {discount && (
          <span className="bg-sand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            -{discount}%
          </span>
        )}
        {!discount && p.promo_label === "bestseller" && (
          <span className="bg-sand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            🔥 Bestseller
          </span>
        )}
        {p.skip_line && (
          <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            ⚡ Skip-the-line
          </span>
        )}
      </div>

      {/* Content bottom */}
      <div className="relative mt-auto p-4 z-10">
        {rating && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRow rating={rating} />
            <span className="text-sm font-bold text-white">{rating}</span>
            {cnt > 0 && (
              <span className="text-xs text-white/60">({cnt.toLocaleString("de-DE")})</span>
            )}
          </div>
        )}
        <h3 className="font-extrabold text-white leading-snug mb-2 text-xl md:text-2xl">
          {p.title}
        </h3>
        {p.tagline && (
          <p className="text-sm text-white/75 mb-2 line-clamp-1 leading-relaxed">{p.tagline}</p>
        )}
        {/* Feature-Badges */}
        {(p.duration || p.instant_ticket_delivery || p.smartphone_ticket) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.duration && (
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                ⏱ {fmtDuration(p.duration)}
              </span>
            )}
            {p.instant_ticket_delivery && (
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                ⚡ Sofort
              </span>
            )}
            {p.smartphone_ticket && (
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                📱 Handy
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="leading-tight">
            {oldPrice && (
              <div className="text-xs text-white/50 line-through">{oldPrice} €</div>
            )}
            <div className="font-extrabold text-sand-400 text-lg">ab {price} €</div>
            {freeC && (
              <div className="text-[11px] text-emerald-400 font-medium">🛡️ Gratis Storno</div>
            )}
          </div>
          <span className="shrink-0 bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors shadow-md">
            Verfügbarkeit prüfen →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─────────────────────────── CarouselCard ─────────────────────────── */

function CarouselCard({ p }: { p: TiqetsProduct }) {
  const img        = p.images?.[0]?.large ?? p.images?.[0]?.medium ?? "";
  const link       = p.product_url ?? "#";
  const price      = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : "0,00";
  const oldPrice   = typeof p.prediscount_price === "number" ? p.prediscount_price.toFixed(2).replace(".", ",") : null;
  const discount   = typeof p.discount_percentage === "number" && p.discount_percentage > 0 ? p.discount_percentage : null;
  const isBestseller = p.promo_label === "bestseller";
  const isFreeC    = !!p.cancellation && p.cancellation.policy !== "never";
  const rating     = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
  const ratingCnt  = p.ratings?.total ?? 0;
  const isTop      = rating !== null && rating >= 4.5;

  const features: { label: string; green?: boolean }[] = [];
  if (p.duration)                features.push({ label: `⏱ ${fmtDuration(p.duration)}` });
  if (isFreeC)                   features.push({ label: "🛡️ Gratis Storno", green: true });
  if (p.instant_ticket_delivery) features.push({ label: "⚡ Sofort" });
  if (p.smartphone_ticket)       features.push({ label: "📱 Handy-Ticket" });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 w-[285px] snap-start rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col no-underline"
    >
      {/* Image */}
      <div className="h-[170px] bg-gray-100 relative shrink-0 overflow-hidden">
        {img && (
          <img
            src={img}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {/* Herz top-left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <ActivitySaveButton activity={p} variant="dark" />
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {discount && (
            <div className="bg-sand-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              -{discount}%
            </div>
          )}
          {!discount && isBestseller && (
            <div className="bg-sand-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              🔥 Bestseller
            </div>
          )}
          {!discount && !isBestseller && isTop && (
            <div className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              ⭐ Top
            </div>
          )}
        </div>
        {/* City label */}
        {p.city_name && (
          <div className="absolute bottom-2.5 left-3 text-white text-[12px] font-medium flex items-center gap-1">
            <span className="text-[10px]">📍</span> {p.city_name}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-grow">
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRow rating={rating} small />
            <span className="text-[13px] font-bold text-gray-800">{rating}</span>
            {ratingCnt > 0 && (
              <span className="text-[11px] text-gray-400">({ratingCnt.toLocaleString("de-DE")})</span>
            )}
          </div>
        )}
        <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#00838F] transition-colors">
          {p.title}
        </p>
        {p.tagline && (
          <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed flex-grow">
            {p.tagline}
          </p>
        )}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {features.map((f, fi) => (
              <span
                key={fi}
                className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                  f.green
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3.5 flex items-center justify-between gap-2 shrink-0">
        <div className="leading-none">
          {oldPrice && (
            <div className="text-[11px] text-gray-400 line-through">{oldPrice} €</div>
          )}
          {!oldPrice && <div className="text-[10px] text-gray-400 mb-0.5">ab</div>}
          <div className="text-[18px] font-extrabold text-sand-500">{price} €</div>
        </div>
        <span className="bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-[12px] font-bold px-3.5 py-2 rounded-full whitespace-nowrap shrink-0 transition-colors shadow-sm">
          Jetzt buchen →
        </span>
      </div>
    </a>
  );
}

/* ─────────────────────────── Skeletons ─────────────────────────── */

function SkeletonSpot() {
  return <div className="bg-gray-200 animate-pulse rounded-2xl min-h-[280px] md:min-h-[320px]" />;
}

function SkeletonCard() {
  return <div className="shrink-0 w-[285px] h-[390px] bg-gray-100 rounded-2xl animate-pulse" />;
}

/* ─────────────────────────── Main Component ─────────────────────────── */

export default function TiqetsActivitiesSection({ cityId, cityName, citySlug }: Props) {
  const [spotlight, setSpotlight] = useState<TiqetsProduct[]>([]);
  const [carousel,  setCarousel]  = useState<TiqetsProduct[]>([]);
  const [loading,   setLoading]   = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/tiqets?cityId=${cityId}&pageSize=50`)
      .then((r) => r.json())
      .then((d) => {
        const all: TiqetsProduct[] = d.products ?? [];

        // Sort: bestsellers first, then by rating descending
        const sorted = [...all].sort((a, b) => {
          const aBS = a.promo_label === "bestseller" ? 1 : 0;
          const bBS = b.promo_label === "bestseller" ? 1 : 0;
          if (bBS !== aBS) return bBS - aBS;
          return (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0);
        });

        // Top 2 go to spotlight, the REST go to the carousel — no duplicates
        setSpotlight(sorted.slice(0, 2));
        setCarousel(sorted.slice(2));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityId]);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  /* ── Loading ── */
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonSpot />
          <SkeletonSpot />
        </div>
        <div className="mt-10">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-64 mb-4" />
          <div className="flex gap-4 overflow-hidden py-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (spotlight.length === 0) return null;

  return (
    <div>
      {/* ── Spotlight grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spotlight.map((p, i) => (
          <SpotlightCard key={i} p={p} />
        ))}
      </div>

      {/* ── Carousel ── */}
      {carousel.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Weitere Aktivitäten &amp; Touren in{" "}
            <span className="text-sand-500">{cityName}</span>
          </h3>

          <div className="relative">
            {/* Scroll buttons */}
            <button
              onClick={() => scroll("left")}
              aria-label="Zurück"
              className="absolute left-[-16px] top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xl z-20 hover:bg-[#6CC4BA] hover:text-white hover:border-transparent transition-all shadow-md"
            >
              ‹
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Weiter"
              className="absolute right-[-16px] top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xl z-20 hover:bg-[#6CC4BA] hover:text-white hover:border-transparent transition-all shadow-md"
            >
              ›
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 px-0.5 snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
            >
              {carousel.map((p, i) => (
                <CarouselCard key={i} p={p} />
              ))}
            </div>
          </div>

          {/* View all */}
          <div className="text-center mt-5">
            <a
              href={`/erlebnisse/${citySlug}/`}
              className="inline-block bg-[#6CC4BA] hover:bg-[#5ab0a6] text-white font-bold px-6 py-3 rounded-full text-sm shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Alle Aktivitäten in {cityName} ansehen →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
