"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, MapPin, Plane, BedDouble, UtensilsCrossed, ThumbsUp, Clock } from "lucide-react";
import { TravelOffer } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { saveTrip, unsaveTrip } from "@/lib/supabase-db";
import Toast from "@/components/ui/Toast";
import SaveLoginModal from "@/components/ui/SaveLoginModal";
import clsx from "clsx";

interface Props {
  offer: TravelOffer;
  savedProductCodes?: string[];
  compact?: boolean;
}

export default function OfferCard({ offer, savedProductCodes = [], compact = false }: Props) {
  const { user } = useAuth();
  const [saved, setSaved]         = useState(savedProductCodes.includes(offer.product_code));
  const [saving, setSaving]       = useState(false);
  const [docId, setDocId]         = useState<string | null>(null);
  const [toast, setToast]         = useState<{ type: "save" | "unsave"; msg: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stars = Math.round(offer.hotel_category);

  const price = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(offer.offer_price_total);

  const bookingUrl = (() => {
    const p = new URLSearchParams({
      giataId:       offer.giata_id ?? "",
      from:          "14",
      to:            "42",
      duration:      "7-7",
      adults:        "2",
      category:      "3",
      minRecommrate: "40",
    });
    return `https://b2b.specials.de/index/jump/119/2780/993243/?${p}`;
  })();

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModal = (window as any).ibeOpenBooking;
    if (typeof openModal === "function") {
      openModal(bookingUrl, offer.hotel_name);
    } else {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowModal(true); return; }
    if (saving) return;
    setSaving(true);
    try {
      if (saved && docId) {
        await unsaveTrip(user.uid, docId, offer.product_code);
        setSaved(false);
        setDocId(null);
        setToast({ type: "unsave", msg: "Aus deinen gespeicherten Hotels entfernt." });
      } else {
        const id = await saveTrip(user.uid, offer);
        setSaved(true);
        setDocId(id);
        setToast({ type: "save", msg: "Gespeichert! Du findest es unter" });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">

      {/* Bild */}
      <div className={clsx("relative overflow-hidden shrink-0", compact ? "h-36" : "h-44")}>
        <Image
          src={offer.images?.medium || offer.images?.large || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"}
          alt={`${offer.hotel_name} – ${offer.region_name}, ${offer.country_name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Herz */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={clsx(
            "absolute top-2 right-2 z-10 rounded-full flex items-center justify-center shadow transition-all",
            compact ? "w-7 h-7" : "w-8 h-8",
            saved ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
          )}
          title={saved ? "Im Profil gespeichert ✓" : "Im Urlaubsprofil speichern"}
        >
          <Heart className={clsx(compact ? "w-3 h-3" : "w-4 h-4")} fill={saved ? "currentColor" : "none"} />
        </button>
        {/* Land + Stadt Badge oben links */}
        <div className="absolute top-2 left-2 flex items-start gap-1 bg-black/50 backdrop-blur-sm text-white rounded-xl px-2.5 py-1.5 max-w-[calc(100%-44px)] z-0">
          <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium leading-snug">
            {offer.destination_name}{offer.country_name ? (<><br />{offer.country_name}</>) : ""}
          </span>
        </div>
        {/* Hotelname am unteren Bildrand */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2.5">
          <h3 className={clsx(
            "font-bold text-white leading-snug line-clamp-2 drop-shadow",
            compact ? "text-xl" : "text-4xl"
          )}>
            {offer.hotel_name}
          </h3>
        </div>
      </div>

      {/* Inhalt */}
      <div className={clsx("flex flex-col flex-1", compact ? "p-3" : "p-4")}>

        {/* HolidayCheck Bewertungs-Box */}
        {Number(offer.rating.overall) > 0 && (
          <div className="flex items-center gap-2.5 bg-gray-100 rounded-xl px-3 py-2 mb-3">
            <ThumbsUp className="w-5 h-5 shrink-0 text-[#f39100]" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 leading-tight">
                {Number(offer.rating.overall).toFixed(1)}/6
                {offer.rating.recommendation > 0 && (
                  <span className="font-normal text-gray-500 ml-1">| {offer.rating.recommendation}% Empfehlung</span>
                )}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                <span className="font-semibold text-[#f39100]">HolidayCheck</span>: {offer.rating.count} Bewertungen
              </p>
            </div>
          </div>
        )}

        {/* Verpflegung + Zimmertyp */}
        <div className="flex flex-col gap-1 mb-3">
          {offer.board_name && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3 h-3 shrink-0 text-gray-400" />
              <span>{offer.board_name}</span>
            </p>
          )}
          {offer.lodging_name && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <BedDouble className="w-3 h-3 shrink-0 text-gray-400" />
              <span>{offer.lodging_name}</span>
            </p>
          )}
        </div>

        {/* Badges: Nächte | Flug */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span className={clsx(
            "inline-flex items-center gap-1 bg-gray-100 text-gray-700 font-medium rounded-full",
            compact ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
          )}>
            <Clock className="w-3 h-3 shrink-0" />
            {offer.offer_duration} Nächte
          </span>
          <span className={clsx(
            "inline-flex items-center gap-1 bg-sky-50 text-sky-700 font-medium rounded-full border border-sky-100",
            compact ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
          )}>
            <Plane className="w-3 h-3 shrink-0" />
            Flug inklusive
          </span>
        </div>

        {/* Preis-Block + CTA */}
        <div className="mt-auto rounded-xl bg-gray-50 border border-gray-100 p-3 flex items-center justify-between gap-3">
          {/* Preis */}
          <div>
            <p className={clsx("font-extrabold text-gray-900 leading-none", compact ? "text-sm" : "text-lg")}>
              ab {price},- €
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Preis für 2 Erwachsene</p>
          </div>
          {/* Button */}
          <button
            onClick={handleBook}
            className={clsx(
              "shrink-0 flex items-center gap-1.5 bg-sand-500 hover:bg-sand-600 text-white font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap",
              compact ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2.5"
            )}
          >
            Angebot prüfen
          </button>
        </div>

      </div>
    </div>

    {/* Toast */}
    {toast && (
      <Toast
        type={toast.type}
        message={toast.msg}
        link={toast.type === "save" ? { href: "/dashboard/", label: "Dashboard → Meine Hotels" } : undefined}
        onDismiss={() => setToast(null)}
      />
    )}
    {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
