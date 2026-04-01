"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { TiqetsProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { saveActivity } from "@/lib/supabase-db";
import SaveLoginModal from "@/components/ui/SaveLoginModal";

interface Props {
  activity: TiqetsProduct;
  /** "dark"  → weißes Herz auf dunklem Bild-Hintergrund (SpotlightCard)
   *  "light" → getöntes Herz auf weißer Karte (CarouselCard / ProductCard) */
  variant?: "dark" | "light";
  className?: string;
}

export default function ActivitySaveButton({ activity, variant = "light", className = "" }: Props) {
  const { user } = useAuth();
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowModal(true); return; }
    if (saved || saving) return;
    setSaving(true);
    try {
      await saveActivity(user.uid, activity);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const tooltip = saved ? "Im Profil gespeichert ✓" : "Im Reiseprofil speichern";

  if (variant === "dark") {
    return (
      <>
        <button
          onClick={handleSave}
          disabled={saving}
          title={tooltip}
          className={`w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center hover:bg-black/55 transition-colors ${className}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? "fill-rose-500 text-rose-500" : "fill-transparent text-white"
            }`}
          />
        </button>
        {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={saving}
        title={tooltip}
        className={`w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-rose-300 transition-colors shadow-sm ${className}`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            saved ? "fill-rose-500 text-rose-500" : "fill-transparent text-gray-400"
          }`}
        />
      </button>
      {showModal && <SaveLoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
