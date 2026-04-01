"use client";

import { useState, useEffect, useMemo } from "react";
import ActivitySaveButton from "./ActivitySaveButton";

interface TiqetsProduct {
  title: string;
  city_name?: string;
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
  heroImage?: string;
}

const PARTNER_ID = "urlaubfinder365-177622";
type SortKey = "recommended" | "price_asc" | "price_desc" | "rating";

// Keyword-based categorisation (API has no category field)
function getCategory(title: string, tagline = ""): string {
  const t = (title + " " + tagline).toLowerCase();
  if (/canyon|zipline|canyoning|rafting|klettern|paragliding|abenteuer/i.test(t)) return "Outdoor & Abenteuer";
  if (/tagesausflug|jeep.?safari|city.?tour|bootsfahrt|safari|ausflug/i.test(t))  return "Touren & Ausflüge";
  if (/aquarium|museum|wachsmuseum|park|zoo|dinopark|legenden|eintrittskarte/i.test(t)) return "Attraktionen";
  if (/bad|hamam|wellness|spa|massage/i.test(t))                                  return "Wellness";
  if (/show|theater|tanzshow|konzert|festival/i.test(t))                          return "Shows & Events";
  return "Erlebnisse";
}

function isFreeCancel(p: TiqetsProduct): boolean {
  return !!p.cancellation && p.cancellation.policy !== "never";
}

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

function ProductCard({ p }: { p: TiqetsProduct }) {
  const img      = p.images?.[0]?.medium ?? "";
  const alt      = p.images?.[0]?.alt_text ?? p.title;
  const link     = p.product_url ?? "#";
  const price    = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : "0,00";
  const oldPrice = typeof p.prediscount_price === "number" ? p.prediscount_price.toFixed(2).replace(".", ",") : null;
  const discount = typeof p.discount_percentage === "number" && p.discount_percentage > 0 ? p.discount_percentage : null;
  const isBestseller = p.promo_label === "bestseller";
  const rating   = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
  const cnt      = p.ratings?.total ?? 0;
  const cat      = getCategory(p.title, p.tagline);
  const freeC    = isFreeCancel(p);

  const features: { label: string; green?: boolean }[] = [];
  if (p.duration)                features.push({ label: `⏱ ${formatDuration(p.duration)}` });
  if (freeC)                     features.push({ label: "🛡️ Gratis Storno", green: true });
  if (p.instant_ticket_delivery) features.push({ label: "⚡ Sofort buchbar" });
  if (p.smartphone_ticket)       features.push({ label: "📱 Handy-Ticket" });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col no-underline"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden shrink-0">
        {img && (
          <img
            src={img}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {cat}
        </div>
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

      {/* Body */}
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

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {features.map((f, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-0.5 rounded-full border ${
                  f.green
                    ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                    : "text-gray-500 border-gray-200 bg-gray-50"
                }`}
              >
                {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-end justify-between gap-3 shrink-0">
        <div className="leading-tight">
          {oldPrice && (
            <div className="text-xs text-gray-400 line-through">{oldPrice} €</div>
          )}
          <div className="text-xl font-extrabold text-sand-500">ab {price} €</div>
          <div className="text-[10px] text-gray-400 mt-0.5">pro Person</div>
        </div>
        <span className="bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 shadow-sm">
          Jetzt buchen →
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-52 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="flex gap-2 mt-5 items-center justify-between">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-10 bg-gray-200 rounded-full animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}

export default function TiqetsActivityPage({ cityId, cityName, citySlug, heroImage }: Props) {
  const [products, setProducts]             = useState<TiqetsProduct[]>([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort]                     = useState<SortKey>("recommended");

  useEffect(() => {
    fetch(`/api/tiqets?cityId=${cityId}&pageSize=50`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cityId]);

  // Derive categories from product titles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(getCategory(p.title, p.tagline)));
    return Array.from(cats).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const base = activeCategory === "all"
      ? products
      : products.filter((p) => getCategory(p.title, p.tagline) === activeCategory);
    switch (sort) {
      case "price_asc":  return [...base].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "price_desc": return [...base].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "rating":     return [...base].sort((a, b) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0));
      default:           return [...base].sort((a, b) => {
        // Bestseller zuerst, dann nach Rating
        if (a.promo_label === "bestseller" && b.promo_label !== "bestseller") return -1;
        if (b.promo_label === "bestseller" && a.promo_label !== "bestseller") return 1;
        return 0;
      });
    }
  }, [products, activeCategory, sort]);

  const minPrice = products.length > 0
    ? Math.min(...products.filter((p) => p.price).map((p) => p.price!))
    : 0;

  const affiliateLink = `https://www.tiqets.com/de/${citySlug}-sehenswuerdigkeiten-c${cityId}/?partner=${PARTNER_ID}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-br from-[#00838F] to-[#004F5A] text-white overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt={cityName}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-white/65 mb-7">
            <a href="/" className="hover:text-white transition-colors">Startseite</a>
            <span>›</span>
            <a href="/urlaubsziele/" className="hover:text-white transition-colors">Urlaubsziele</a>
            <span>›</span>
            <a href={`/urlaubsziele/${citySlug}/`} className="hover:text-white transition-colors">{cityName}</a>
            <span>›</span>
            <span className="text-white font-medium">Aktivitäten</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-4">
                🎟️ Aktivitäten &amp; Tickets
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
                Aktivitäten in{" "}
                <span className="text-[#6CC4BA]">{cityName}</span>
              </h1>
              {!loading && (
                <p className="text-white/75 text-lg">
                  {products.length} Erlebnisse entdecken
                  {minPrice > 0 && (
                    <> · ab <strong className="text-white">{minPrice.toFixed(2).replace(".", ",")} €</strong></>
                  )}
                </p>
              )}
            </div>
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-white text-[#00838F] font-semibold px-6 py-3 rounded-full hover:bg-sand-50 transition-colors text-sm shadow-lg whitespace-nowrap"
            >
              Alle auf Tiqets.com →
            </a>
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Bar ─────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3">
            <div
              className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => setActiveCategory("all")}
                className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                  activeCategory === "all"
                    ? "bg-[#6CC4BA] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Alle {!loading && `(${products.length})`}
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => getCategory(p.title, p.tagline) === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                      activeCategory === cat
                        ? "bg-[#6CC4BA] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#6CC4BA] cursor-pointer"
            >
              <option value="recommended">Empfohlen</option>
              <option value="rating">Beste Bewertung</option>
              <option value="price_asc">Preis ↑</option>
              <option value="price_desc">Preis ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg">Keine Aktivitäten in dieser Kategorie.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-4 text-[#6CC4BA] hover:underline text-sm"
            >
              Alle Kategorien anzeigen
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              <span className="font-medium text-gray-700">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "Aktivität" : "Aktivitäten"} gefunden
              {activeCategory !== "all" && (
                <>
                  {" "}in <strong className="text-gray-600">„{activeCategory}"</strong>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="ml-2 text-[#6CC4BA] hover:underline"
                  >
                    × aufheben
                  </button>
                </>
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProductCard key={i} p={p} />)}
            </div>

            {/* Bottom CTA */}
            <div className="mt-14 bg-linear-to-br from-[#00838F] to-[#004F5A] rounded-3xl p-10 text-white text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h2 className="text-2xl font-bold mb-2">Noch mehr Erlebnisse entdecken</h2>
              <p className="text-white/75 mb-7 max-w-md mx-auto text-sm leading-relaxed">
                Das vollständige Angebot mit {products.length} Aktivitäten, Touren und
                Tickets in {cityName} findest du direkt auf Tiqets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-[#00838F] font-bold px-8 py-3.5 rounded-full hover:bg-sand-50 transition-colors shadow-lg"
                >
                  Alle Aktivitäten auf Tiqets →
                </a>
                <a
                  href={`/urlaubsziele/${citySlug}/`}
                  className="inline-block bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/25 transition-colors border border-white/30"
                >
                  {cityName} Pauschalreisen →
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
