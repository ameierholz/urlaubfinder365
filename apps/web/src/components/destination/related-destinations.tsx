import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { destinations, destImg } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import type { DestinationConfig } from "@/types";

interface Props {
  currentSlug: string;
  country: string;
}

function getRelated(currentSlug: string, country: string): DestinationConfig[] {
  const all = destinations.filter((d) => d.slug !== currentSlug);

  // 1. Gleiche Country
  const sameCountry = all.filter((d) => d.country === country);

  // 2. Gleicher Kontinent / superRegion über CATALOG
  const currentEntry = CATALOG.find((c) => c.slug === currentSlug);
  const sameRegion = currentEntry
    ? all.filter((d) => {
        const entry = CATALOG.find((c) => c.slug === d.slug);
        return (
          entry &&
          entry.superRegionSlug === currentEntry.superRegionSlug &&
          d.country !== country
        );
      })
    : [];

  // 3. Beliebt = erste Einträge in destinations (top-sorted)
  const popular = all.filter(
    (d) =>
      d.country !== country &&
      !sameRegion.some((r) => r.slug === d.slug)
  );

  const combined = [...sameCountry, ...sameRegion, ...popular];
  // Deduplizieren & auf max. 6 begrenzen
  const seen = new Set<string>();
  const result: DestinationConfig[] = [];
  for (const d of combined) {
    if (!seen.has(d.slug)) {
      seen.add(d.slug);
      result.push(d);
    }
    if (result.length >= 6) break;
  }
  return result;
}

export default function RelatedDestinations({ currentSlug, country }: Props) {
  const related = getRelated(currentSlug, country);

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Ähnliche Urlaubsziele entdecken
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((dest) => (
          <Link
            key={dest.slug}
            href={`/urlaubsziele/${dest.slug}/`}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative w-full h-40 sm:h-48">
              <Image
                src={destImg(dest)}
                alt={`${dest.name} Urlaub buchen`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-1 text-white">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold text-sm leading-tight truncate">{dest.name}</span>
              </div>
              <p className="text-white/75 text-xs mt-0.5 truncate">{dest.country}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-[#1db682] bg-white/90 rounded-full px-2 py-0.5">
                Entdecken →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
