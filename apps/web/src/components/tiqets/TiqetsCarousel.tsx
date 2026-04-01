"use client";

import { useState, useEffect, useRef } from "react";
import ActivitySaveButton from "./ActivitySaveButton";

interface TiqetsProduct {
  title: string;
  city_name?: string;
  images?: { medium?: string; large?: string }[];
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
}

interface Props {
  cityId: string;
  cityName: string;
  citySlug: string;
  hideBestsellers?: boolean;
}

const PARTNER_ID = "urlaubfinder365-177622";

function formatDuration(raw: string) {
  return raw
    .replace(/hours?/i, "Std.")
    .replace(/days?/i, "Tage")
    .replace(/min(utes?|s)?/i, "Min.");
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <>
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`text-[13px] leading-none ${s <= full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </>
  );
}

export default function TiqetsCarousel({ cityId, cityName, citySlug, hideBestsellers }: Props) {
  const [products, setProducts] = useState<TiqetsProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/tiqets?cityId=${cityId}`)
      .then((r) => r.json())
      .then((d) => {
        // Bestseller zuerst, optional ausblenden wenn Spotlight daneben
        let sorted = (d.products ?? []).sort((a: TiqetsProduct, b: TiqetsProduct) => {
          if (a.promo_label === "bestseller" && b.promo_label !== "bestseller") return -1;
          if (b.promo_label === "bestseller" && a.promo_label !== "bestseller") return 1;
          return 0;
        });
        if (hideBestsellers) {
          sorted = sorted.filter((p: TiqetsProduct) => p.promo_label !== "bestseller");
        }
        setProducts(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityId]);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shrink-0 w-[285px] h-[390px] bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!products.length) return null;

  return (
    <div>
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          aria-label="Zurück"
          className="absolute left-[-16px] top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xl z-20 hover:bg-[#6CC4BA] hover:text-white hover:border-transparent transition-all shadow-md"
        >‹</button>
        <button
          onClick={() => scroll("right")}
          aria-label="Weiter"
          className="absolute right-[-16px] top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-xl z-20 hover:bg-[#6CC4BA] hover:text-white hover:border-transparent transition-all shadow-md"
        >›</button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 px-0.5"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
        >
          {products.map((p, i) => {
            const img      = p.images?.[0]?.large ?? p.images?.[0]?.medium ?? "";
            const link     = p.product_url ?? "#";
            const price    = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : "0,00";
            const oldPrice = typeof p.prediscount_price === "number" ? p.prediscount_price.toFixed(2).replace(".", ",") : null;
            const discount = typeof p.discount_percentage === "number" && p.discount_percentage > 0 ? p.discount_percentage : null;
            const isBestseller = p.promo_label === "bestseller";
            const isFreeC  = !!p.cancellation && p.cancellation.policy !== "never";
            const rating   = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
            const ratingCnt = p.ratings?.total ?? 0;
            const isTop    = rating !== null && rating >= 4.5;

            const features: { label: string; green?: boolean }[] = [];
            if (p.duration)                features.push({ label: `⏱ ${formatDuration(p.duration)}` });
            if (isFreeC)                   features.push({ label: "🛡️ Gratis Storno", green: true });
            if (p.instant_ticket_delivery) features.push({ label: "⚡ Sofort" });
            if (p.smartphone_ticket)       features.push({ label: "📱 Handy-Ticket" });

            return (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 w-[285px] rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col no-underline"
              >
                {/* ── Image ── */}
                <div className="h-[170px] bg-gray-100 relative shrink-0 overflow-hidden">
                  {img && (
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* dark gradient for readability */}
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

                  {/* City label on image */}
                  {p.city_name && (
                    <div className="absolute bottom-2.5 left-3 text-white text-[12px] font-medium flex items-center gap-1">
                      <span className="text-[10px]">📍</span> {p.city_name}
                    </div>
                  )}
                </div>

                {/* ── Body ── */}
                <div className="p-3.5 flex flex-col flex-grow">
                  {/* Rating row */}
                  {rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={rating} />
                      <span className="text-[13px] font-bold text-gray-800">{rating}</span>
                      {ratingCnt > 0 && (
                        <span className="text-[11px] text-gray-400">({ratingCnt.toLocaleString("de-DE")})</span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#00838F] transition-colors">
                    {p.title}
                  </p>

                  {/* Tagline */}
                  {p.tagline && (
                    <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                      {p.tagline}
                    </p>
                  )}

                  {/* Feature chips */}
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

                {/* ── Footer ── */}
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
          })}
        </div>
      </div>

      {/* View all */}
      <div className="text-center mt-5">
        <a
          href={`/aktivitaeten/${citySlug}/`}
          className="inline-block bg-[#6CC4BA] hover:bg-[#5ab0a6] text-white font-bold px-6 py-3 rounded-full text-sm shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Alle Aktivitäten in {cityName} ansehen →
        </a>
      </div>
    </div>
  );
}
