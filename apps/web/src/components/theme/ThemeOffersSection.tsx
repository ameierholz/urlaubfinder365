"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import type { TravelOffer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";

export interface ThemeOffersSectionProps {
  keywords?:      string;
  maxPrice?:      string;
  adults?:        string;
  children?:      string;
  from?:          string;
  to?:            string;
  duration?:      string;
  category?:      string;
  minRecommrate?: string;
  boardCode?:     string;
  limit?:         number;
  themeName:      string;
}

function SkeletonCard() {
  return (
    <div className="shrink-0 w-56 sm:w-60 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-7 bg-gray-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

const arrowBase =
  "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center " +
  "bg-white/70 backdrop-blur-md border border-white/50 shadow-md " +
  "hover:bg-white/90 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed";

export default function ThemeOffersSection({
  keywords      = "",
  maxPrice      = "",
  adults        = "2",
  children      = "",
  from          = "14",
  to            = "365",
  duration      = "7-7",
  category      = "3",
  minRecommrate = "50",
  boardCode     = "",
  limit         = 12,
  themeName,
}: ThemeOffersSectionProps) {
  const [offers,  setOffers]  = useState<TravelOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams({ from, to, duration, adults, category, minRecommrate, limit: String(limit) });
    if (keywords)  params.set("keywords",  keywords);
    if (maxPrice)  params.set("maxPrice",  maxPrice);
    if (children)  params.set("children",  children);
    if (boardCode) params.set("boardCode", boardCode);

    fetch(`/api/theme-offers?${params}`)
      .then((r) => r.json())
      .then((d) => { setOffers(d.offers ?? []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-offer-card]");
    const cardW = card ? card.offsetWidth + 16 : 250;
    scrollRef.current.scrollBy({ left: dir === "right" ? cardW : -cardW, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-2" />
        <p className="text-sm text-red-500">Angebote konnten nicht geladen werden. Bitte später erneut versuchen.</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
        <p className="text-sm">Aktuell keine Angebote für {themeName} verfügbar.</p>
        <p className="text-xs mt-1 text-gray-300">Tagesaktuelle Deals wechseln täglich – bitte morgen erneut prüfen.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`${arrowBase} -left-4 hidden sm:flex`}
        aria-label="Nach links scrollen"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {offers.map((offer) => (
          <div
            key={offer.product_code}
            data-offer-card
            className="shrink-0 w-56 sm:w-60 snap-start"
          >
            <OfferCard offer={offer} compact />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`${arrowBase} -right-4 hidden sm:flex`}
        aria-label="Nach rechts scrollen"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
