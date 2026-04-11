"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveTrip } from "@/lib/supabase-db";
import SaveLoginModal from "@/components/ui/SaveLoginModal";
import type { TravelOffer } from "@/types";

interface Props {
  offer: TravelOffer;
  bookingUrl: string;
  hotelName: string;
  /** Übersetzungen werden vom Server vorbereitet, hier nur Strings */
  labels: {
    saveToProfile: string;
    savedInProfile: string;
  };
}

/**
 * Kleines Client-Island für die interaktiven Teile der HomeDealCard:
 * - Click → öffnet IBE-Modal
 * - Heart-Button → speichert Trip (mit Login-Modal-Fallback)
 *
 * Der Rest der Karte ist Server Component → spart ~300KB JS Bundle.
 */
export default function HomeDealCardActions({ offer, bookingUrl, hotelName, labels }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModal = (window as any).ibeOpenBooking;
    if (typeof openModal === "function") {
      openModal(bookingUrl, hotelName);
    } else {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowModal(true);
      return;
    }
    if (saved) return;
    setSaving(true);
    try {
      await saveTrip(user.uid, offer);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Vollflächiger transparenter Klick-Layer für Card */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${hotelName} – Angebote ansehen`}
        className="absolute inset-0 z-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sand-400/60 rounded-2xl"
      />

      {/* Herz-Button (über dem Klick-Layer) */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
          saved
            ? "bg-rose-500 text-white scale-110"
            : "bg-black/40 backdrop-blur-sm text-white/70 hover:bg-black/60 hover:text-rose-400"
        }`}
        title={saved ? labels.savedInProfile : labels.saveToProfile}
      >
        <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
      </button>

      {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
