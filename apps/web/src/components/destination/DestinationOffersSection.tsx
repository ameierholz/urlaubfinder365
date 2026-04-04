"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TravelOffer } from "@/types";
import OfferCard from "@/components/offers/OfferCard";

interface Props {
  regionId:       string;
  cityId?:        string;
  duration?:      string;
  from?:          string;
  to?:            string;
  adults?:        string;
  category?:      string;
  minRecommrate?: string;
  boardCode?:     string;
  excludeAi?:     boolean;
  limit?:         number;
  destinationName: string;
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
  "hover:bg-white/90 transition-colors duration-150";

export default function DestinationOffersSection({
  regionId,
  cityId        = "",
  duration      = "7-7",
  from          = "14",
  to            = "42",
  adults        = "2",
  category      = "3",
  minRecommrate = "40",
  boardCode     = "",
  excludeAi     = false,
  limit         = 9,
  destinationName,
}: Props) {
  const [offers,  setOffers]  = useState<TravelOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      regionId, duration, from, to, adults, category, minRecommrate,
      limit: String(limit),
    });
    if (cityId)    params.set("cityId",    cityId);
    if (boardCode) params.set("boardCode", boardCode);
    if (excludeAi) params.set("excludeAi", "true");

    fetch(`/api/destination-offers?${params}`)
      .then((r) => r.json())
      .then((d) => { setOffers(d.offers ?? []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [regionId, cityId, duration, from, to, adults, category, minRecommrate, boardCode, excludeAi, limit]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-offer-card]");
    const cardW = card ? card.offsetWidth + 24 : 260;
    scrollRef.current.scrollBy({ left: dir === "right" ? cardW : -cardW, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error || offers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
        <p className="text-sm">
          {error
            ? "Angebote konnten nicht geladen werden. Bitte später erneut versuchen."
            : `Aktuell keine Angebote für ${destinationName} verfügbar.`}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow – immer sichtbar, glasig */}
      <button
        onClick={() => scroll("left")}
        className={`${arrowBase} -left-4`}
        aria-label="Nach links scrollen"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 snap-x snap-mandatory"
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

      {/* Right Arrow – immer sichtbar, glasig */}
      <button
        onClick={() => scroll("right")}
        className={`${arrowBase} -right-4`}
        aria-label="Nach rechts scrollen"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
