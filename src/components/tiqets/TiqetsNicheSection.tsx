"use client";

import { useState, useEffect } from "react";
import ActivitySaveButton from "./ActivitySaveButton";

interface TiqetsProduct {
  title: string;
  images?: { medium?: string; large?: string; alt_text?: string }[];
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
  keywords: string;      // Regex-Pattern für Titelfilter
  maxItems?: number;
}

const PARTNER_ID = "urlaubfinder365-177622";

function formatDuration(raw: string) {
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
        <span key={s} className={`text-sm leading-none ${s <= full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

function NicheCard({ p }: { p: TiqetsProduct }) {
  const img        = p.images?.[0]?.large ?? p.images?.[0]?.medium ?? "";
  const alt        = p.images?.[0]?.alt_text ?? p.title;
  const link       = p.product_url ?? "#";
  const price      = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : "0,00";
  const oldPrice   = typeof p.prediscount_price === "number" ? p.prediscount_price.toFixed(2).replace(".", ",") : null;
  const discount   = typeof p.discount_percentage === "number" && p.discount_percentage > 0 ? p.discount_percentage : null;
  const isBestseller = p.promo_label === "bestseller";
  const rating     = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
  const cnt        = p.ratings?.total ?? 0;
  const freeC      = !!p.cancellation && p.cancellation.policy !== "never";

  const chips: { label: string; green?: boolean }[] = [];
  if (p.duration)                chips.push({ label: `⏱ ${formatDuration(p.duration)}` });
  if (freeC)                     chips.push({ label: "🛡️ Gratis Storno", green: true });
  if (p.instant_ticket_delivery) chips.push({ label: "⚡ Sofort" });
  if (p.smartphone_ticket)       chips.push({ label: "📱 Handy-Ticket" });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col no-underline"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
        {img && (
          <img
            src={img}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Herz top-left */}
        <div className="absolute top-2 left-2 z-10">
          <ActivitySaveButton activity={p} variant="dark" />
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {discount && (
            <div className="bg-sand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              -{discount}%
            </div>
          )}
          {!discount && isBestseller && (
            <div className="bg-sand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              🔥 Bestseller
            </div>
          )}
          {!discount && !isBestseller && rating && rating >= 4.5 && (
            <div className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              ⭐ Top
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {rating && (
          <div className="flex items-center gap-2 mb-2">
            <StarRow rating={rating} />
            <span className="text-sm font-bold text-gray-800">{rating}</span>
            {cnt > 0 && <span className="text-xs text-gray-400">({cnt.toLocaleString("de-DE")})</span>}
          </div>
        )}
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-[#00838F] transition-colors">
          {p.title}
        </h3>
        {p.tagline && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-grow">
            {p.tagline}
          </p>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {chips.map((c, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-0.5 rounded-full border ${
                  c.green
                    ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                    : "text-gray-500 border-gray-200 bg-gray-50"
                }`}
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex items-end justify-between gap-3 flex-shrink-0">
        <div className="leading-tight">
          {oldPrice && (
            <div className="text-xs text-gray-400 line-through">{oldPrice} €</div>
          )}
          <div className="text-xl font-extrabold text-sand-500">ab {price} €</div>
          <div className="text-[10px] text-gray-400 mt-0.5">pro Person</div>
        </div>
        <span className="bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 shadow-sm">
          Jetzt buchen →
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="flex gap-2 mt-5 items-center justify-between">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-10 bg-gray-200 rounded-full animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}

export default function TiqetsNicheSection({ cityId, cityName, citySlug, keywords, maxItems = 9 }: Props) {
  const [products, setProducts] = useState<TiqetsProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/api/tiqets?cityId=${cityId}&pageSize=50`)
      .then((r) => r.json())
      .then((d) => {
        const regex = new RegExp(keywords, "i");
        const filtered = (d.products ?? [])
          .filter((p: TiqetsProduct) => regex.test(p.title + " " + (p.tagline ?? "")))
          .sort((a: TiqetsProduct, b: TiqetsProduct) => {
            if (a.promo_label === "bestseller" && b.promo_label !== "bestseller") return -1;
            if (b.promo_label === "bestseller" && a.promo_label !== "bestseller") return 1;
            return 0;
          });
        setProducts(filtered.slice(0, maxItems));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityId, keywords, maxItems]);

  const affiliateLink = `https://www.tiqets.com/de/${citySlug}-sehenswuerdigkeiten-c${cityId}/?partner=${PARTNER_ID}`;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-4">🔍</div>
        <p className="font-semibold">Aktuell keine passenden Aktivitäten verfügbar.</p>
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[#6CC4BA] hover:underline text-sm"
        >
          Alle Aktivitäten in {cityName} auf Tiqets →
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => <NicheCard key={i} p={p} />)}
      </div>

      <div className="text-center mt-10">
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#6CC4BA] hover:bg-[#5ab0a6] text-white font-bold px-6 py-3.5 rounded-full text-sm shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Alle Aktivitäten in {cityName} auf Tiqets entdecken →
        </a>
      </div>
    </div>
  );
}
