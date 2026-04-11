import { destinations, destImg } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import type { DestinationConfig } from "@/types";
import DestinationCarousel, { type DestCarouselItem } from "@/components/ui/DestinationCarousel";

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
  // Deduplizieren & auf max. 12 begrenzen (Carousel kann mehr zeigen als Grid)
  const seen = new Set<string>();
  const result: DestinationConfig[] = [];
  for (const d of combined) {
    if (!seen.has(d.slug)) {
      seen.add(d.slug);
      result.push(d);
    }
    if (result.length >= 12) break;
  }
  return result;
}

export default function RelatedDestinations({ currentSlug, country }: Props) {
  const related = getRelated(currentSlug, country);

  if (related.length === 0) return null;

  const items: DestCarouselItem[] = related.map((d) => ({
    slug: d.slug,
    name: d.name,
    country: d.country,
    image: destImg(d, "card"),
  }));

  return (
    <DestinationCarousel
      title="Ähnliche Urlaubsziele entdecken"
      items={items}
      allHref="/urlaubsziele/"
    />
  );
}
