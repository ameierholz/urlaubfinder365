import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDestinationBySlug, destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import { getAlternateUrls } from "@/i18n/routing";
import TiqetsExperiencePage from "@/components/tiqets/TiqetsExperiencePage";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ city: string; locale: string }>;
}

// Einheitliche City-Config (für alte Destinations + neue Catalog-Super-Regionen)
interface CityConfig {
  slug: string;
  name: string;
  tiqetsCityId: string;
  heroImage?: string;
}

function getCityConfig(slug: string): CityConfig | undefined {
  // 1. Alte Destinations zuerst (antalya, mallorca, barcelona, kreta)
  const dest = getDestinationBySlug(slug);
  if (dest?.tiqetsCityId) {
    return {
      slug: dest.slug,
      name: dest.name,
      tiqetsCityId: dest.tiqetsCityId,
      heroImage: dest.heroImageFallback ?? dest.heroImage,
    };
  }
  // 2. Alle Catalog-Einträge mit tiqetsCityId (super UND region)
  const entry = CATALOG.find((e) => e.slug === slug && e.tiqetsCityId);
  if (entry) {
    return {
      slug: entry.slug,
      name: entry.name,
      tiqetsCityId: entry.tiqetsCityId!,
      heroImage: generateHeroFallback(entry.unsplashKeyword),
    };
  }
  return undefined;
}

export async function generateStaticParams() {
  // Alte Destinations mit tiqetsCityId
  const oldSlugs = destinations
    .filter((d) => d.tiqetsCityId)
    .map((d) => ({ city: d.slug }));

  // Alle Catalog-Einträge mit tiqetsCityId (super + region)
  const seen = new Set(oldSlugs.map((s) => s.city));
  for (const e of CATALOG) {
    if (e.tiqetsCityId && !seen.has(e.slug)) {
      oldSlugs.push({ city: e.slug });
      seen.add(e.slug);
    }
  }

  return oldSlugs;
}

const BASE_URL = "https://www.urlaubfinder365.de";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cfg = getCityConfig(city);
  if (!cfg) return {};

  const title       = `Aktivitäten & Erlebnisse in ${cfg.name} – Tickets & Touren buchen`;
  const description = `Die besten Sehenswürdigkeiten, Aktivitäten & Touren in ${cfg.name} günstig buchen. ✓ Sofortbuchung ✓ Gratis Storno ✓ Top-Bewertungen. Jetzt entdecken!`;
  const canonical   = `${BASE_URL}/aktivitaeten/${cfg.slug}/`;

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateUrls(`/aktivitaeten/${cfg.slug}/`) },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: cfg.heroImage ? [{ url: cfg.heroImage, alt: `Aktivitäten in ${cfg.name}` }] : [],
    },
  };
}

export const revalidate = 3600;

export default async function AktivitaetenCityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { city } = await params;
  const cfg = getCityConfig(city);
  if (!cfg) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",   item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Aktivitäten",  item: `${BASE_URL}/aktivitaeten/` },
      { "@type": "ListItem", position: 3, name: cfg.name,       item: `${BASE_URL}/aktivitaeten/${cfg.slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TiqetsExperiencePage
        cityId={cfg.tiqetsCityId}
        cityName={cfg.name}
        citySlug={cfg.slug}
        heroImage={cfg.heroImage}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href={`/aktivitaeten/${cfg.slug}/top-attraktionen/`}
          className="group flex items-center justify-between gap-4 bg-linear-to-r from-amber-50 to-white border border-amber-200 hover:border-amber-400 hover:shadow-lg rounded-2xl p-6 transition-all"
        >
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Ranking</p>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-700">
              Top 20 Attraktionen in {cfg.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Die beliebtesten Sehenswürdigkeiten sortiert nach echten Bewertungen →
            </p>
          </div>
          <span className="shrink-0 text-3xl">🏆</span>
        </Link>
      </div>
    </>
  );
}
