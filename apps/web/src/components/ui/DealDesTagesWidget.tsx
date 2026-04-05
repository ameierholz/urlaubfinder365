"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Clock, Star, Utensils, Moon } from "lucide-react";
import type { DealDesTages } from "@/data/deals-des-tages";

interface Props {
  deal: DealDesTages;
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

export default function DealDesTagesWidget({ deal }: Props) {
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    setSecs(getSecondsUntilMidnight());
    const id = setInterval(() => {
      setSecs((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = secs !== null ? Math.floor(secs / 3600) : null;
  const m = secs !== null ? Math.floor((secs % 3600) / 60) : null;
  const s = secs !== null ? secs % 60 : null;

  const savings = deal.originalPrice - deal.price;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-black uppercase tracking-wide">Deal des Tages</span>
        </div>
        {/* Countdown */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-sm">
          -{deal.discount}%
        </div>

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

        {/* Infos */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Moon className="w-3 h-3" />
            {deal.nights} Nächte
          </span>
          <span className="flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {deal.board}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-400 line-through leading-none">
              ab {deal.originalPrice} €
            </p>
            <p className="text-lg font-black text-gray-900 leading-tight">
              ab {deal.price} €
              <span className="text-[11px] font-semibold text-gray-500 ml-0.5">/Person</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-green-600 font-bold">
              Du sparst {savings} €
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={deal.href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Jetzt buchen — nur heute!
        </Link>

        <p className="text-[9px] text-gray-400 text-center leading-snug">
          Preis p. P. inkl. Flug & Hotel · Angebot endet um Mitternacht
        </p>
      </div>
    </div>
  );
}
