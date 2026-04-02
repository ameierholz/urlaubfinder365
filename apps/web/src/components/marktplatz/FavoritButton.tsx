"use client";

import { Heart } from "lucide-react";
import { useFavorit } from "@/hooks/useMarktplatz";
import { useState } from "react";

interface Props {
  slug: string;
  /** small = 32px, default = 40px */
  size?: "sm" | "default";
}

export default function FavoritButton({ slug, size = "default" }: Props) {
  const { isFavorit, loading, isLoggedIn, toggle } = useFavorit(slug);
  const [bounce, setBounce] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      // redirect to login — simple anchor navigation
      window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }
    const ok = await toggle();
    if (ok) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
    }
  };

  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconDim = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={isFavorit ? "Aus Favoriten entfernen" : "Als Favorit speichern"}
      className={`
        ${dim} rounded-full flex items-center justify-center
        bg-white/90 backdrop-blur-sm shadow
        hover:scale-110 active:scale-95 transition-transform duration-150
        disabled:opacity-40
        ${bounce ? "scale-125" : ""}
      `}
    >
      <Heart
        className={`${iconDim} transition-colors duration-150 ${
          isFavorit ? "fill-rose-500 stroke-rose-500" : "stroke-gray-500 fill-none"
        }`}
      />
    </button>
  );
}
