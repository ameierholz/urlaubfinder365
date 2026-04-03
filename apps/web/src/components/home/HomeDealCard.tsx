"use client";

import Image from "next/image";
import { useState } from "react";
import { Clock, Flame, Plane, Utensils, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { TravelOffer } from "@/types";
import { formatPrice } from "@/lib/travel-api";
import { useAuth } from "@/context/AuthContext";
import { saveTrip } from "@/lib/supabase-db";
import SaveLoginModal from "@/components/ui/SaveLoginModal";

interface Props {
  offer: TravelOffer;
  priority?: boolean;
}

const COUNTRY_FALLBACK: Record<string, string> = {
  türkei:       "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  spanien:      "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80",
  griechenland: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
  ägypten:      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80",
  italien:      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
};

function getImg(offer: { images?: { large?: string; medium?: string }; country_name?: string }): string {
  const api = offer.images?.large || offer.images?.medium || "";
  if (api) return api;
  const c = (offer.country_name ?? "").toLowerCase();
  for (const [key, url] of Object.entries(COUNTRY_FALLBACK)) {
    if (c.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
}

const EDITORIAL_KEYS: Record<string, string> = {
  türkei:       "tuerkei",
  spanien:      "spanien",
  griechenland: "griechenland",
  ägypten:      "aegypten",
  italien:      "italien",
  kroatien:     "kroatien",
};

/** Saubere Ortsangabe: "Sardinien · Italien" statt "Olbia, Sardinien, Italien" */
function getLocation(offer: TravelOffer): string {
  const dest    = (offer.destination_name ?? "").trim();
  const country = (offer.country_name ?? "").trim();
  // Wenn destination_name eine Stadt+Region enthält (z.B. "Olbia, Sardinien"),
  // nur die Region (letzter Teil nach dem Komma) anzeigen
  const parts  = dest.split(",").map((p) => p.trim()).filter(Boolean);
  const region = parts.length > 1 ? parts[parts.length - 1] : dest;
  if (!country) return region;
  if (region.toLowerCase() === country.toLowerCase()) return country;
  return `${region} · ${country}`;
}

export default function HomeDealCard({ offer, priority = false }: Props) {
  const t = useTranslations("dealCard");
  const { user } = useAuth();
  const [saved, setSaved]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const rec = Number(offer.rating?.recommendation ?? 0);

  function getHeadline(o: TravelOffer): string {
    const c = (o.country_name ?? "").toLowerCase();
    for (const [key, editKey] of Object.entries(EDITORIAL_KEYS)) {
      if (c.includes(key)) return t(`editorial.${editKey}`);
    }
    return t("editorial.fallback", { country: o.country_name ?? "Europa" });
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setShowModal(true); return; }
    if (saved) return;
    setSaving(true);
    try { await saveTrip(user.uid, offer); setSaved(true); }
    finally { setSaving(false); }
  };

  const bookingUrl = (() => {
    const p = new URLSearchParams({
      giataId:       offer.giata_id ?? "",
      from:          "14",
      to:            "42",
      duration:      "7-7",
      adults:        "2",
      category:      "5",
      minRecommrate: "80",
    });
    return `https://b2b.specials.de/index/jump/119/2780/993243/?${p}`;
  })();

  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModal = (window as any).ibeOpenBooking;
    if (typeof openModal === "function") {
      openModal(bookingUrl, offer.hotel_name);
    } else {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-white text-left w-full cursor-pointer ring-0 hover:ring-2 hover:ring-sand-400/60"
    >
      {/* ── Bild ── */}
      <div className="relative overflow-hidden" style={{ height: "185px" }}>
        <Image
          src={getImg(offer)}
          alt={`${offer.hotel_name} – ${offer.region_name}, ${offer.country_name}`}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

        {/* TOP DEAL – oben links */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-linear-to-r from-red-700 to-sand-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md uppercase tracking-wider leading-none">
          <Flame className="w-2.5 h-2.5" />
          {t("topDeal")}
        </div>

        {/* Herz-Button oben rechts */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`absolute top-2 right-2 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            saved ? "bg-rose-500 text-white scale-110" : "bg-white/90 text-gray-400 hover:bg-white hover:text-rose-500"
          }`}
          title={saved ? t("savedInProfile") : t("saveToProfile")}
        >
          <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        </button>

        {/* Weiterempfehlung oben rechts */}
        {rec >= 90 && (
          <span className={`absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md leading-none ${rec >= 95 ? "bg-green-500/90" : "bg-emerald-500/90"}`}>
            ✓ {t("recommended", { pct: rec })}
          </span>
        )}

        {/* Editoriale Headline unten */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs font-semibold text-sand-300 uppercase tracking-wider mb-1">
            {getLocation(offer)}
          </p>
          <h3 className="font-black text-lg leading-tight drop-shadow-md group-hover:text-sand-200 transition-colors">
            {getHeadline(offer)}
          </h3>
          <p className="text-white/65 text-xs mt-1 line-clamp-1">{offer.hotel_name}</p>
        </div>
      </div>

      {/* ── Card-Body (dunkel & premium) ── */}
      <div className="flex flex-col flex-1 bg-gray-900">

        {/* Info-Zeile */}
        <div className="px-4 pt-3 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-white/10">
          <span className="flex items-center gap-1.5 text-gray-300 text-xs whitespace-nowrap">
            <Clock className="w-4 h-4 text-gray-500 shrink-0" />{t("nights", { count: offer.offer_duration })}
          </span>
          <span className="flex items-center gap-1.5 text-gray-300 text-xs whitespace-nowrap">
            <Plane className="w-4 h-4 text-sky-400 shrink-0" />{t("inclFlight")}
          </span>
          <span className="flex items-center gap-1.5 text-gray-300 text-xs whitespace-nowrap">
            <Utensils className="w-4 h-4 text-sand-400 shrink-0" />{offer.board_name}
          </span>
        </div>

        {/* Preis + CTA */}
        <div className="px-4 pt-3 pb-4 mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">{t("perPerson")}</p>
            <p className="text-3xl font-black text-sand-400 leading-none">{formatPrice(offer.offer_price_adult)}</p>
            <p className="text-[10px] text-gray-500 mt-1">{t("total")} {formatPrice(offer.offer_price_total)}</p>
          </div>
          <span className="shrink-0 bg-linear-to-r from-sand-500 to-sand-600 group-hover:from-sand-400 group-hover:to-sand-500 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-sand-900/40 text-center leading-snug">
            {t("checkOfferLine1")}<br />{t("checkOfferLine2")}
          </span>
        </div>

      </div>
    </div>
    {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
