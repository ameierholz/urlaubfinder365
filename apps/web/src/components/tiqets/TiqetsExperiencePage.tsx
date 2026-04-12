"use client";

import { useState, useEffect, useMemo } from "react";
import TiqetsCarousel from "./TiqetsCarousel";
import { TIQETS_CATEGORIES, matchesCategory, getPrimaryCategory } from "@/lib/tiqets-categories";

interface TiqetsExperience {
  id: number;
  type: "venue" | "activity" | "service" | "poi";
  title: string;
  tagline?: string;
  images?: Array<{
    small?: string;
    medium?: string;
    large?: string;
    extra_large?: string;
    alt_text?: string;
  }>;
  experience_url?: string;
  from_price?: number;
  ratings?: { average: number; total: number };
  tag_ids?: number[];
  address?: { city_name?: string; lat?: number; lng?: number };
}

interface Props {
  cityId: string;
  cityName: string;
  citySlug: string;
  heroImage?: string;
}

type SortKey = "rating" | "price_asc" | "price_desc";

const PARTNER_ID = "urlaubfinder365-177622";

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

function ExperienceCard({ e }: { e: TiqetsExperience }) {
  const img   = e.images?.[0]?.large ?? e.images?.[0]?.medium ?? "";
  const alt   = e.images?.[0]?.alt_text ?? e.title;
  const link  = e.experience_url ?? "#";
  const price = typeof e.from_price === "number" ? e.from_price.toFixed(2).replace(".", ",") : null;
  const rating = e.ratings?.average ? Math.round(e.ratings.average * 10) / 10 : null;
  const cnt    = e.ratings?.total ?? 0;
  const cat = getPrimaryCategory(e.tag_ids);

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
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

        {/* Category badge */}
        {cat && (
          <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {cat.emoji} {cat.label}
          </div>
        )}

        {/* Top badge */}
        {rating && rating >= 4.7 && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            ⭐ Top
          </div>
        )}
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

        <h3 className="font-bold text-gray-900 text-[17px] leading-snug mb-2 line-clamp-2 group-hover:text-[#00838F] transition-colors">
          {e.title}
        </h3>

        {e.tagline && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2 leading-relaxed flex-grow">
            {e.tagline}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-end justify-between gap-3 shrink-0">
        <div className="leading-tight">
          {price ? (
            <>
              <div className="text-[10px] text-gray-400">ab</div>
              <div className="text-xl font-extrabold text-sand-500">{price} €</div>
            </>
          ) : <div className="text-sm text-gray-400">Preis auf Anfrage</div>}
        </div>
        <span className="bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 shadow-sm">
          Entdecken →
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
        <div className="flex gap-2 mt-5 items-center justify-between">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-10 bg-gray-200 rounded-full animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}

export default function TiqetsExperiencePage({ cityId, cityName, citySlug, heroImage }: Props) {
  const [experiences, setExperiences] = useState<TiqetsExperience[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCat, setActiveCat]     = useState<string>("all");
  const [sort, setSort]               = useState<SortKey>("rating");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tiqets-experiences?cityId=${cityId}&pageSize=100`)
      .then((r) => r.json())
      .then((d) => { setExperiences(d.experiences ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cityId]);

  // Which categories actually have data
  const availableCategories = useMemo(() => {
    return TIQETS_CATEGORIES.filter((cat) =>
      experiences.some((e) => matchesCategory(e.tag_ids, cat.id))
    );
  }, [experiences]);

  const filtered = useMemo(() => {
    const base = activeCat === "all"
      ? experiences
      : experiences.filter((e) => matchesCategory(e.tag_ids, activeCat));
    switch (sort) {
      case "price_asc":  return [...base].sort((a, b) => (a.from_price ?? 999) - (b.from_price ?? 999));
      case "price_desc": return [...base].sort((a, b) => (b.from_price ?? 0)   - (a.from_price ?? 0));
      default:           return [...base].sort((a, b) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0));
    }
  }, [experiences, activeCat, sort]);

  const minPrice = experiences.length > 0
    ? Math.min(...experiences.filter((e) => e.from_price).map((e) => e.from_price!))
    : 0;

  const affiliateLink = `https://www.tiqets.com/de/${citySlug}-sehenswuerdigkeiten-c${cityId}/?partner=${PARTNER_ID}`;
  const hasExperiences = !loading && experiences.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
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
            <a href="/erlebnisse/" className="hover:text-white transition-colors">Erlebnisse</a>
            <span>›</span>
            <span className="text-white font-medium">{cityName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-4">
                🎟️ Erlebnisse &amp; Tickets
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
                Erlebnisse in <span className="text-[#6CC4BA]">{cityName}</span>
              </h1>
              {!loading && (
                <p className="text-white/75 text-lg">
                  {experiences.length > 0
                    ? <>{experiences.length} Erlebnisse entdecken{minPrice > 0 && <> · ab <strong className="text-white">{minPrice.toFixed(2).replace(".", ",")} €</strong></>}</>
                    : "Tickets & Aktivitäten entdecken"
                  }
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

      {/* ── Sticky Filter (nur wenn Experiences vorhanden) ── */}
      {hasExperiences && (
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-3">
              <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 pr-2" style={{ scrollbarWidth: "none" }}>
                <button
                  onClick={() => setActiveCat("all")}
                  className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                    activeCat === "all" ? "bg-[#6CC4BA] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  🎟️ Alle ({experiences.length})
                </button>
                {availableCategories.map((cat) => {
                  const count = experiences.filter((e) => matchesCategory(e.tag_ids, cat.id)).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                        activeCat === cat.id ? "bg-[#6CC4BA] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat.emoji} {cat.label} ({count})
                    </button>
                  );
                })}
                <span className="shrink-0 w-6" aria-hidden="true" />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#6CC4BA] cursor-pointer"
              >
                <option value="rating">Beste Bewertung</option>
                <option value="price_asc">Preis ↑</option>
                <option value="price_desc">Preis ↓</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Experiences Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : hasExperiences ? (
          <>
            {activeCat !== "all" && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <span><strong className="text-gray-700">{filtered.length}</strong> Erlebnisse in „{TIQETS_CATEGORIES.find(c => c.id === activeCat)?.label}"</span>
                <button onClick={() => setActiveCat("all")} className="text-[#6CC4BA] hover:underline">× Alle anzeigen</button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((e) => <ExperienceCard key={e.id} e={e} />)}
            </div>
          </>
        ) : null}

        {/* ── Alle Tickets & Touren (Produkte) ── */}
        <div className={hasExperiences ? "mt-16" : "mt-0"}>
          {hasExperiences && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Alle Tickets &amp; Touren in <span className="text-sand-500">{cityName}</span>
            </h2>
          )}
          <TiqetsCarousel cityId={cityId} cityName={cityName} citySlug={citySlug} />
        </div>

        {/* ── Bottom CTA ── */}
        {hasExperiences && (
          <div className="mt-14 bg-linear-to-br from-[#00838F] to-[#004F5A] rounded-3xl p-10 text-white text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Noch mehr Erlebnisse entdecken</h2>
            <p className="text-white/75 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Das vollständige Angebot für {cityName} findest du direkt auf Tiqets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#00838F] font-bold px-8 py-3.5 rounded-full hover:bg-sand-50 transition-colors shadow-lg"
              >
                Alle Erlebnisse auf Tiqets →
              </a>
              <a
                href={`/urlaubsziele/${citySlug}/`}
                className="inline-block bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/25 transition-colors border border-white/30"
              >
                {cityName} Pauschalreisen →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
