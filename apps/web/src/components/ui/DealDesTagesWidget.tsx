"use client";

import { useState, useEffect } from "react";
import { Flame, Clock, Star, Utensils, Moon, Calendar, CheckCircle } from "lucide-react";
import type { LiveDeal } from "@/app/api/deals/deal-des-tages/route";

interface Props {
  regionIds: number[];
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

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "";
  }
}

export default function DealDesTagesWidget({ regionIds }: Props) {
  const [secs, setSecs]   = useState<number | null>(null);
  const [deal, setDeal]   = useState<LiveDeal | null | "loading">("loading");

  /* ── Countdown ── */
  useEffect(() => {
    setSecs(getSecondsUntilMidnight());
    const id = setInterval(() => setSecs((s) => (s !== null && s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Live-Verfügbarkeit ── */
  useEffect(() => {
    if (!regionIds.length) { setDeal(null); return; }
    const ids = regionIds.join(",");
    fetch(`/api/deals/deal-des-tages?regionId=${ids}`)
      .then((r) => r.json())
      .then((data) => setDeal((data as { deal: LiveDeal | null }).deal ?? null))
      .catch(() => setDeal(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionIds.join(",")]);

  const h = secs !== null ? Math.floor(secs / 3600) : null;
  const m = secs !== null ? Math.floor((secs % 3600) / 60) : null;
  const s = secs !== null ? secs % 60 : null;

  function handleBooking() {
    if (!deal || deal === "loading") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModal = (window as any).ibeOpenBooking;
    if (typeof openModal === "function") {
      openModal(deal.href, deal.hotelName);
    } else {
      window.open(deal.href, "_blank", "noopener,noreferrer");
    }
  }

  /* ── Skeleton während des Ladens ── */
  if (deal === "loading") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-9 bg-linear-to-r from-red-600 to-orange-500" />
        <div className="h-36 bg-gray-200" />
        <div className="p-3 space-y-2.5">
          <div className="flex gap-3">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ── Kein Deal verfügbar ── */
  if (!deal) return null;

  const depDate = formatDate(deal.departureDate);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-linear-to-r from-red-600 to-orange-500 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-black uppercase tracking-wide">Deal des Tages</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-white/80" />
          <span className="text-white/90 text-xs font-mono font-semibold tabular-nums">
            {h !== null ? `${pad(h)}:${pad(m!)}:${pad(s!)}` : "--:--:--"}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.imageUrl}
          alt={deal.hotelName}
          className="w-full h-36 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Recommendation badge */}
        {deal.recommendation > 0 && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-sm leading-tight">
            ★ {deal.recommendation}%
          </div>
        )}

        {/* Stars */}
        <div className="absolute top-2 left-2 flex gap-0.5">
          {Array.from({ length: deal.stars }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          ))}
        </div>

        {/* Hotel name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <p className="text-white text-xs font-black leading-tight drop-shadow line-clamp-2">
            {deal.hotelName}
          </p>
          <p className="text-white/75 text-[10px] leading-tight mt-0.5">{deal.location}</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-3 pt-2.5 pb-3 space-y-2">

        {/* Meta-Infos */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Moon className="w-3 h-3" />
            {deal.nights} Nächte
          </span>
          <span className="flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {deal.board}
          </span>
          {depDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              ab {depDate}
            </span>
          )}
        </div>

        {/* Preis + Verfügbarkeit */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#00838F] font-bold uppercase tracking-wider leading-none mb-0.5">
              Live-Preis
            </p>
            <p className="text-lg font-black text-gray-900 leading-tight">
              ab {deal.price} €
              <span className="text-[11px] font-semibold text-gray-500 ml-0.5">/Person</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <CheckCircle className="w-3 h-3" />
            Verfügbar
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleBooking}
          className="block w-full text-center bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          Jetzt buchen — nur heute!
        </button>

        <p className="text-[9px] text-gray-400 text-center leading-snug">
          Preis p. P. inkl. Flug & Hotel · Echtzeit-Verfügbarkeit
        </p>
      </div>

    </div>
  );
}
