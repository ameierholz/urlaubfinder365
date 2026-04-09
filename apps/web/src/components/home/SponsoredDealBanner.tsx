"use client";

import { useState, useEffect, useRef } from "react";
import { Flame, Clock, Star } from "lucide-react";

interface SponsoredDeal {
  id: string;
  hotel_name: string;
  destination_name: string;
  destination_slug: string;
  image_url: string;
  booking_url: string;
  price_per_person: number;
  original_price: number | null;
  stars: number | null;
  board: string | null;
  nights: number | null;
  departure_date: string | null;
  sponsor_name: string | null;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export default function SponsoredDealBanner() {
  const [deal, setDeal] = useState<SponsoredDeal | null | "loading">("loading");
  const [secs, setSecs] = useState<number | null>(null);
  const impressionTracked = useRef(false);

  /* ── Countdown ── */
  useEffect(() => {
    setSecs(getSecondsUntilMidnight());
    const id = setInterval(() => setSecs((s) => (s !== null && s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Fetch aktiver Sponsored Deal ── */
  useEffect(() => {
    fetch("/api/sponsored-deal")
      .then((r) => r.json())
      .then((data: { deal: SponsoredDeal | null }) => setDeal(data.deal ?? null))
      .catch(() => setDeal(null));
  }, []);

  /* ── Impression tracken (einmalig) ── */
  useEffect(() => {
    if (deal && deal !== "loading" && !impressionTracked.current) {
      impressionTracked.current = true;
      fetch("/api/sponsored-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "impression", dealId: deal.id }),
      }).catch(() => {});
    }
  }, [deal]);

  const h = secs !== null ? Math.floor(secs / 3600) : null;
  const m = secs !== null ? Math.floor((secs % 3600) / 60) : null;
  const s = secs !== null ? secs % 60 : null;

  if (deal === "loading" || deal === null) return null;

  const discount =
    deal.original_price && deal.original_price > deal.price_per_person
      ? Math.round(((deal.original_price - deal.price_per_person) / deal.original_price) * 100)
      : null;

  function handleClick() {
    fetch("/api/sponsored-deal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "click", dealId: (deal as SponsoredDeal).id }),
    }).catch(() => {});
    window.open((deal as SponsoredDeal).booking_url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-orange-200/30 bg-white">
      {/* Header-Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-white animate-pulse" />
          <span className="text-white text-xs font-black uppercase tracking-widest">
            🔥 GESPONSERT · Deal des Tages
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white/80" />
          <span className="text-white/90 text-xs font-mono font-bold tabular-nums">
            {h !== null ? `${pad(h)}:${pad(m!)}:${pad(s!)}` : "--:--:--"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row">
        {/* Bild */}
        <div className="relative sm:w-64 h-48 sm:h-auto shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deal.image_url}
            alt={deal.hotel_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />

          {discount !== null && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow">
              −{discount}%
            </div>
          )}

          {/* Sterne */}
          {deal.stars && (
            <div className="absolute top-3 right-3 flex gap-0.5">
              {Array.from({ length: deal.stars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-0.5">
                  {deal.destination_name}
                </p>
                <h3 className="text-base font-black text-gray-900 leading-tight">
                  {deal.hotel_name}
                </h3>
              </div>
            </div>

            {/* Details-Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {deal.nights && (
                <span className="text-[11px] bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                  {deal.nights} Nächte
                </span>
              )}
              {deal.board && (
                <span className="text-[11px] bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                  {deal.board}
                </span>
              )}
              {deal.departure_date && (
                <span className="text-[11px] bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
                  ab{" "}
                  {new Intl.DateTimeFormat("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(deal.departure_date))}
                </span>
              )}
            </div>
          </div>

          {/* Preis + CTA */}
          <div className="flex items-end justify-between mt-4 gap-4">
            <div>
              {deal.original_price && deal.original_price > deal.price_per_person && (
                <p className="text-sm text-gray-400 line-through leading-none mb-0.5">
                  {deal.original_price.toLocaleString("de-DE")} €
                </p>
              )}
              <p className="text-2xl font-black text-gray-900 leading-none">
                {deal.price_per_person.toLocaleString("de-DE")} €
                <span className="text-sm font-semibold text-gray-500 ml-1">/Person</span>
              </p>
            </div>

            <button
              onClick={handleClick}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              Jetzt buchen →
            </button>
          </div>

          {/* Gesponsert-Label */}
          <p className="text-[10px] text-gray-400 mt-2">
            Gesponserte Anzeige
            {deal.sponsor_name ? ` · ${deal.sponsor_name}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
