"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { TravelOffer } from "@/types";
import { formatPrice } from "@/lib/travel-api";
import { useAuth } from "@/context/AuthContext";
import { saveTrip } from "@/lib/supabase-db";
import SaveLoginModal from "@/components/ui/SaveLoginModal";

interface Props {
  deals: (TravelOffer | null)[];
}

// Ab 6 Monate in der Zukunft (Frühbucher-Zeitraum)
function getNextSummerRange() {
  const today = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const fromDate = new Date(today.getTime() + 180 * msPerDay); // 6 Monate
  const toDate   = new Date(today.getTime() + 365 * msPerDay); // 12 Monate
  return { fromDays: 180, toDays: 365, fromDate, toDate };
}

const LABELS: Record<string, { dest: string; flag: string }> = {
  türkei:       { dest: "Türkei",       flag: "tr" },
  turkey:       { dest: "Türkei",       flag: "tr" },
  spanien:      { dest: "Spanien",      flag: "es" },
  spain:        { dest: "Spanien",      flag: "es" },
  griechenland: { dest: "Griechenland", flag: "gr" },
  greece:       { dest: "Griechenland", flag: "gr" },
  ägypten:      { dest: "Ägypten",      flag: "eg" },
  egypt:        { dest: "Ägypten",      flag: "eg" },
};

const FALLBACKS = [
  { dest: "Türkei",       flag: "tr", regionId: "149", img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=75&auto=format" },
  { dest: "Ägypten",      flag: "eg", regionId: "560", img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=75&auto=format" },
  { dest: "Griechenland", flag: "gr", regionId: "46",  img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=75&auto=format" },
  { dest: "Spanien",      flag: "es", regionId: "133", img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=75&auto=format" },
];

function getLabel(offer: TravelOffer) {
  const c = (offer.country_name ?? "").toLowerCase();
  for (const [key, val] of Object.entries(LABELS)) {
    if (c.includes(key)) return val;
  }
  return { dest: offer.country_name ?? "Europa", flag: "eu" };
}

function buildRegionUrl(regionId: string, fromDays: number, toDays: number) {
  const p = new URLSearchParams({
    agent:    "993243",
    regionId,
    product:  "package",
    from:     String(fromDays),
    to:       String(toDays),
    duration: "7-14",
    adults:   "2",
  });
  return `https://b2b.specials.de/index/jump/119/2780/993243/?${p}`;
}

function buildHotelUrl(offer: TravelOffer, fromDays: number, toDays: number) {
  const p = new URLSearchParams({
    agent:     "993243",
    giataId:   offer.giata_id ?? "",
    hotelCode: offer.product_code ?? "",
    product:   "package",
    from:      String(fromDays),
    to:        String(toDays),
    duration:  "7-14",
    adults:    "2",
  });
  return `https://b2b.specials.de/index/jump/119/2780/993243/?${p}`;
}

function fmtMonth(d: Date) {
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

function openModal(url: string, title: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fn = (window as any).ibeOpenBooking;
  if (typeof fn === "function") fn(url, title);
  else window.open(url, "_blank", "noopener,noreferrer");
}

// Einzelne Offer-Karte mit eigenem Save-State
function FruehbucherCard({
  offer,
  fb,
  fromDays,
  toDays,
}: {
  offer: TravelOffer;
  fb: (typeof FALLBACKS)[0];
  fromDays: number;
  toDays: number;
}) {
  const t = useTranslations("fruehbucher");
  const tDeal = useTranslations("dealCard");
  const { user } = useAuth();
  const [saved, setSaved]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { dest, flag } = getLabel(offer);
  const url = buildHotelUrl(offer, fromDays, toDays);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setShowModal(true); return; }
    if (saved) return;
    setSaving(true);
    try { await saveTrip(user.uid, offer); setSaved(true); }
    finally { setSaving(false); }
  };

  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={() => openModal(url, offer.hotel_name)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModal(url, offer.hotel_name); }}
      className="group relative rounded-2xl overflow-hidden text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white"
    >
      {/* Bild */}
      <div className="relative overflow-hidden" style={{ height: "160px" }}>
        <Image
          src={offer.images?.large || offer.images?.medium || fb.img}
          alt={offer.hotel_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
        {/* Frühbucher Badge */}
        <span className="absolute top-2 right-2 bg-sand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {t("badge")}
        </span>
        {/* Herz */}
        <button
          onClick={handleSave}
          disabled={saving}
          title={saved ? tDeal("savedInProfile") : tDeal("saveToProfile")}
          className="absolute top-1.5 left-1.5 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? "fill-rose-500 text-rose-500" : "fill-transparent text-white"
            }`}
          />
        </button>
        {/* Destination */}
        <div className="absolute bottom-2 left-3">
          <span className="text-white text-xs font-bold uppercase tracking-wide">{dest}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 mb-0.5">
          {offer.hotel_name}
        </p>
        <p className="text-xs text-sand-600 font-semibold mb-1">
          {offer.destination_name || offer.city_name}, {dest}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {t("nightsInclFlight", { nights: offer.offer_duration, board: offer.board_name })}
        </p>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-xs text-gray-500">{t("perPerson")}</span>
            <p className="text-lg font-black text-sand-600 leading-none">
              {t("from")} {formatPrice(offer.offer_price_adult)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("total")} {formatPrice(offer.offer_price_total)}
            </p>
          </div>
          <span className="shrink-0 bg-sand-500 group-hover:bg-sand-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
            {t("checkOffer")}
          </span>
        </div>
      </div>
    </div>
    {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default function FruehbucherCards({ deals }: Props) {
  const t = useTranslations("fruehbucher");
  const { fromDays, toDays, fromDate, toDate } = getNextSummerRange();
  const fromLabel = fmtMonth(fromDate);
  const toLabel   = fmtMonth(toDate);

  return (
    <div>
      {/* Reisezeitraum-Anzeige außerhalb der Kacheln */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-white/50 text-xs font-semibold">{t("editorialLabel")}</span>
        <span className="text-sand-300 text-xs font-bold bg-white/10 border border-white/15 rounded-full px-3 py-0.5">
          {fromLabel} – {toLabel}
        </span>
      </div>

      {/* 4 Kacheln */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {deals.map((offer, i) => {
          const fb = FALLBACKS[i];

          if (!offer) {
            const deeplink = buildRegionUrl(fb.regionId, fromDays, toDays);
            return (
              <button
                key={fb.dest}
                onClick={() => openModal(deeplink, `${t("badge")} ${fb.dest}`)}
                className="group relative rounded-2xl overflow-hidden text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{ minHeight: "200px" }}
              >
                <Image
                  src={fb.img}
                  alt={`${fb.dest} Urlaub – günstige Pauschalreisen & Frühbucher`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative h-full min-h-[200px] flex flex-col justify-end p-4 text-white">
                  <span className="text-xs text-sand-300 font-bold uppercase tracking-wide mb-1">{t("badge")}</span>
                  <p className="font-black text-lg leading-tight">{fb.dest}</p>
                  <span className="mt-2 inline-block text-xs bg-sand-500 text-white font-bold px-3 py-1 rounded-full w-fit group-hover:bg-sand-400 transition-colors">
                    {t("checkOffer")}
                  </span>
                </div>
              </button>
            );
          }

          return (
            <FruehbucherCard
              key={offer.product_code}
              offer={offer}
              fb={fb}
              fromDays={fromDays}
              toDays={toDays}
            />
          );
        })}
      </div>
    </div>
  );
}
