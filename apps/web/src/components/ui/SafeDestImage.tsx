"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Anzeigename für Fallback-Placeholder */
  name: string;
  /** Optionaler Gradient für den Placeholder */
  gradient?: [string, string];
  sizes?: string;
  className?: string;
}

/**
 * Next.js <Image> Wrapper mit automatischem Fallback auf einen Gradient-Placeholder,
 * wenn das externe Bild (z. B. Unsplash) nicht geladen werden kann.
 */
export default function SafeDestImage({
  src,
  alt,
  name,
  gradient = ["#6991d8", "#1db682"],
  sizes = "144px",
  className = "object-cover group-hover:scale-105 transition-transform duration-500",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        aria-label={alt}
        role="img"
      >
        <span className="text-white text-lg font-bold drop-shadow-lg px-3 text-center leading-tight">
          {name}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
      unoptimized={src.startsWith("https://images.unsplash.com")}
    />
  );
}
