import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug, destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import { getAlternateUrls } from "@/i18n/routing";

interface Props {
  params: Promise<{ city: string; locale: string }>;
}

interface CityConfig {
  slug: string;
  name: string;
  tiqetsCityId: string;
  heroImage?: string;
}

function getCityConfig(slug: string): CityConfig | undefined {
  const dest = getDestinationBySlug(slug);
  if (dest?.tiqetsCityId) {
    return {
      slug: dest.slug,
      name: dest.name,
      tiqetsCityId: dest.tiqetsCityId,
      heroImage: dest.heroImageFallback ?? dest.heroImage,
    };
  }
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
  const slugs = new Set<string>();
  destinations.filter((d) => d.tiqetsCityId).forEach((d) => slugs.add(d.slug));
  CATALOG.filter((e) => e.tiqetsCityId).forEach((e) => slugs.add(e.slug));
  return Array.from(slugs).map((city) => ({ city }));
}

const BASE_URL = "https://www.urlaubfinder365.de";
const YEAR = new Date().getFullYear();
const TIQETS_API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";
const PARTNER_ID = "urlaubfinder365-177622";

interface TiqetsExperience {
  id: number;
  type: string;
  title: string;
  tagline?: string;
  description?: string;
  images?: Array<{ large?: string; medium?: string; small?: string; alt_text?: string }>;
  experience_url?: string;
  from_price?: number;
  ratings?: { average: number; total: number };
  address?: { city_name?: string };
}

async function fetchTopAttractions(cityId: string): Promise<TiqetsExperience[]> {
  try {
    const url = new URL("https://api.tiqets.com/v2/experiences");
    url.searchParams.append("city_id", cityId);
    url.searchParams.set("lang", "de");
    url.searchParams.set("page_size", "100");
    url.searchParams.set("currency", "EUR");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Token ${TIQETS_API_KEY}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const all: TiqetsExperience[] = data.experiences ?? [];

    // Sortieren nach Rating * log(count) für qualitative & stabile Top-20
    return all
      .filter((e) => e.ratings && e.ratings.total > 10)
      .sort((a, b) => {
        const aScore = (a.ratings!.average ?? 0) * Math.log(1 + (a.ratings!.total ?? 0));
        const bScore = (b.ratings!.average ?? 0) * Math.log(1 + (b.ratings!.total ?? 0));
        return bScore - aScore;
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cfg = getCityConfig(city);
  if (!cfg) return {};

  const title = `Top 20 Attraktionen ${cfg.name} ${YEAR} – Tickets online buchen`;
  const description = `Die 20 beliebtesten Attraktionen, Sehenswürdigkeiten & Touren in ${cfg.name} ✓ Echte Bewertungen ✓ Tickets sofort buchbar ✓ Beste Auswahl ${YEAR}.`;
  const canonical = `${BASE_URL}/aktivitaeten/${cfg.slug}/top-attraktionen/`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateUrls(`/aktivitaeten/${cfg.slug}/top-attraktionen/`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: cfg.heroImage ? [{ url: cfg.heroImage, alt: `Top Attraktionen ${cfg.name}` }] : [],
    },
  };
}

export const revalidate = 86400;

function withAffiliate(url?: string): string {
  if (!url) return "#";
  return url.includes("?") ? `${url}&partner=${PARTNER_ID}` : `${url}?partner=${PARTNER_ID}`;
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm leading-none ${s <= full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

export default async function TopAttraktionenPage({ params }: Props) {
  const { city, locale } = await params;
  setRequestLocale(locale);
  const cfg = getCityConfig(city);
  if (!cfg) notFound();

  const attractions = await fetchTopAttractions(cfg.tiqetsCityId);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",  item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Aktivitäten", item: `${BASE_URL}/aktivitaeten/` },
      { "@type": "ListItem", position: 3, name: cfg.name,       item: `${BASE_URL}/aktivitaeten/${cfg.slug}/` },
      { "@type": "ListItem", position: 4, name: "Top 20",       item: `${BASE_URL}/aktivitaeten/${cfg.slug}/top-attraktionen/` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top 20 Attraktionen ${cfg.name}`,
    numberOfItems: attractions.length,
    itemListElement: attractions.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.title,
      url: e.experience_url,
      ...(e.ratings && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: e.ratings.average,
          reviewCount: e.ratings.total,
        },
      }),
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[380px] flex items-end">
        {cfg.heroImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cfg.heroImage} alt={cfg.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.9) 100%)" }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/aktivitaeten/" className="hover:text-white">Aktivitäten</Link>
            <span>/</span>
            <Link href={`/aktivitaeten/${cfg.slug}/`} className="hover:text-white">{cfg.name}</Link>
            <span>/</span>
            <span className="text-white/90">Top 20</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-amber-500/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🏆 Top 20 Ranking
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Top 20 Attraktionen {cfg.name}<br />
            <span className="text-amber-200">Tickets online buchen</span>
          </h1>
          <p className="text-white/85 text-lg max-w-2xl">
            Die beliebtesten Sehenswürdigkeiten, Touren und Aktivitäten in {cfg.name} – sortiert nach echten Bewertungen tausender Besucher.
          </p>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Du planst einen Urlaub in <strong>{cfg.name}</strong> und fragst dich, welche Attraktionen du auf keinen Fall verpassen solltest?
          Unsere <strong>Top 20</strong> basiert auf echten Bewertungen von tausenden Besuchern und wird täglich aktualisiert.
          Alle Tickets sind online sofort buchbar, oft mit Skip-the-Line-Service und kostenloser Stornierung.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Die Plätze sind nach einem gewichteten Score aus durchschnittlicher Sternebewertung und Anzahl der Reviews sortiert –
          so landen Attraktionen mit vielen begeisterten Rezensionen ganz oben. Tipp: Buche beliebte Tickets 1-2 Tage vorher,
          um lange Warteschlangen zu umgehen.
        </p>
      </div>

      {/* TOP 20 LIST */}
      {attractions.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-500">Aktuell sind keine Attraktionen für {cfg.name} verfügbar.</p>
          <Link href={`/aktivitaeten/${cfg.slug}/`} className="inline-block mt-4 text-[#1db682] font-semibold hover:underline">
            Alle Aktivitäten in {cfg.name} ansehen →
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ol className="space-y-4">
            {attractions.map((e, i) => {
              const img = e.images?.[0]?.large ?? e.images?.[0]?.medium ?? "";
              const alt = e.images?.[0]?.alt_text ?? e.title;
              const link = withAffiliate(e.experience_url);
              const price = typeof e.from_price === "number" ? e.from_price.toFixed(2).replace(".", ",") : null;
              const rating = e.ratings?.average ? Math.round(e.ratings.average * 10) / 10 : null;
              const cnt = e.ratings?.total ?? 0;

              return (
                <li key={e.id} className="relative">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group flex flex-col sm:flex-row gap-5 bg-white border border-gray-200 hover:border-amber-400 hover:shadow-lg rounded-2xl p-5 transition-all no-underline"
                  >
                    <div className="sm:w-64 shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                      {img && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={img} alt={alt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute top-3 left-3 bg-amber-500 text-white font-black text-lg w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-1 leading-tight">
                        #{i + 1} {e.title}
                      </h2>
                      {e.tagline && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{e.tagline}</p>}
                      <div className="flex items-center gap-3 mb-3">
                        {rating && (
                          <span className="flex items-center gap-1.5">
                            <StarRow rating={rating} />
                            <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({cnt.toLocaleString("de-DE")})</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                        {price ? (
                          <span className="text-sm text-gray-500">
                            ab <strong className="text-lg text-gray-900">{price} €</strong>
                          </span>
                        ) : <span />}
                        <span className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                          Tickets buchen →
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* BACK-LINK */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Noch mehr in {cfg.name} entdecken</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={`/aktivitaeten/${cfg.slug}/`} className="inline-flex items-center bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
            Alle Aktivitäten
          </Link>
          <Link href={`/urlaubsziele/${cfg.slug}/`} className="inline-flex items-center bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
            {cfg.name} Reiseziel
          </Link>
          <Link href="/aktivitaeten/" className="inline-flex items-center bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
            Alle Städte
          </Link>
        </div>
      </div>
    </div>
  );
}
