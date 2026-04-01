import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CountryDestProp {
  name: string;
  subtitle: string;
  slug: string;
  flagCode?: string;
  imgUrl: string;
  countryId?: string;
  regionId?: string;
  bookingUrl: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CountryHoverCard({
  dest,
  className = "",
}: {
  dest: CountryDestProp;
  className?: string;
}) {
  return (
    <Link
      href={`/urlaubsziele/${dest.slug}/`}
      className={`relative block group ${className}`}
      aria-label={`${dest.name} Urlaub – Pauschalreisen & Angebote`}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 h-full">
        <div className="w-full h-full overflow-hidden">
          <img
            src={dest.imgUrl}
            alt={`${dest.name} Urlaub – Pauschalreisen & Angebote`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

        {/* Flag – top left */}
        {dest.flagCode && (
          <div className="absolute top-3 left-3">
            <img
              src={`https://flagcdn.com/w40/${dest.flagCode}.png`}
              srcSet={`https://flagcdn.com/w80/${dest.flagCode}.png 2x`}
              width={28}
              height={20}
              alt={dest.name}
              className="rounded shadow-md object-cover"
            />
          </div>
        )}

        {/* Name + Subtitle – bottom left */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-extrabold text-sm leading-tight drop-shadow">
            {dest.name}
          </p>
          <p className="text-white/75 text-[11px] mt-0.5 leading-tight">
            {dest.subtitle}
          </p>
        </div>

        {/* Angebote-Badge – top right on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-sand-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-0.5">
            Angebote <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
