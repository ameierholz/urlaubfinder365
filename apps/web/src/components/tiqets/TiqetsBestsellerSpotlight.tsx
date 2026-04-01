"use client";

import { useState, useEffect } from "react";

interface TiqetsProduct {
  title: string;
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

function fmtDuration(raw: string) {
  return raw
    .replace(/hours?/i, "Std.")
    .replace(/days?/i, "Tage")
    .replace(/min(utes?|s)?/i, "Min.");
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm leading-none ${s <= full ? "text-yellow-400" : "text-white/30"}`}>★</span>
      ))}
    </span>
  );
}

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
      className="group relative rounded-2xl overflow-hidden no-underline flex flex-col w-full h-full"
    >
      {/* Background image */}
      <img
        src={img}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

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

function SkeletonSpot({ large }: { large?: boolean }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-2xl ${large ? "min-h-[320px]" : "min-h-[220px]"}`} />
  );
}

export default function TiqetsBestsellerSpotlight({ cityId, cityName, citySlug }: Props) {
  const [products, setProducts] = useState<TiqetsProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/api/tiqets?cityId=${cityId}&pageSize=50`)
      .then((r) => r.json())
      .then((d) => {
        const all: TiqetsProduct[] = d.products ?? [];
        // Bestseller bevorzugen, sonst nach Rating sortiert auffüllen bis 2
        const bestsellers = all.filter((p) => p.promo_label === "bestseller");
        const rest = all
          .filter((p) => p.promo_label !== "bestseller")
          .sort((a, b) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0));
        const top2 = [...bestsellers, ...rest].slice(0, 2);
        setProducts(top2);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonSpot large />
        <SkeletonSpot large />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div>
      {/* Grid: 1 großes links + 1 kleineres rechts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: "320px" }}>
        <div className="min-h-[260px] md:min-h-[320px]">
          <SpotlightCard p={products[0]} />
        </div>
        {products.length > 1 && (
          <div className="min-h-[260px] md:min-h-[320px]">
            <SpotlightCard p={products[1]} />
          </div>
        )}
      </div>

    </div>
  );
}
