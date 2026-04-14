import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Package, Umbrella, Zap, Ticket, PlaneTakeoff, HelpCircle, Thermometer, ExternalLink, Flame, Info } from "lucide-react";
import { getDestinationBySlug, destinations, destImg } from "@/lib/destinations";
import { getCatalogEntry, getCatalogByParent, CATALOG } from "@/data/catalog-regions";
import { catalogToConfig, generateHeroFallback, getEffectiveIbeRegionIds, isFakeIbeRegionId } from "@/lib/catalog-helpers";
import { getHubDataByCountry } from "@/lib/reise-hub-data";
import IbeHolidayWidget from "@/components/ibe/IbeHolidayWidget";
import UrlaubsartenGrid from "@/components/destination/UrlaubsartenGrid";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import RightSidebar from "@/components/layout/RightSidebar";
import { Suspense } from "react";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import IbeAllOffersButton from "@/components/ibe/IbeAllOffersButton";
import IbeBoardingPass from "@/components/ibe/IbeBoardingPass";
import ReiseHub from "@/components/reise-hub/ReiseHub";
import TiqetsActivitiesSection from "@/components/tiqets/TiqetsActivitiesSection";
import DestinationCarousel, { type DestCarouselItem } from "@/components/ui/DestinationCarousel";
import RelatedDestinations from "@/components/destination/related-destinations";
import EntryInfoBox from "@/components/destination/EntryInfoBox";
import TravelWarningBadge from "@/components/destination/TravelWarningBadge";
import DestinationMapEmbed from "@/components/map/DestinationMapEmbed";
import ClimateChart from "@/components/destination/ClimateChart";
import PriceChart from "@/components/destination/price-chart";
import BookingAdvisor from "@/components/destination/booking-advisor";
import EmbedWidgetSection from "@/components/destination/embed-widget-section";
import PriceAlertWidget from "@/components/destination/price-alert-widget";
import HomeDealCard from "@/components/home/HomeDealCard";
import AdSlot from "@/components/ads/AdSlot";
import DestinationHubLinks from "@/components/destination/DestinationHubLinks";
import LongTailContentSection from "@/components/destination/LongTailContentSection";
import BudgetBreakdownSection from "@/components/destination/BudgetBreakdownSection";
import DestinationReviewsSection from "@/components/destination/DestinationReviewsSection";
import DestinationCommunityReports from "@/components/destination/DestinationCommunityReports";
import { fetchTopDeals } from "@/lib/travel-api";
import { fetchDestinationPriceStats } from "@/lib/destination-pricing";
import { fetchDestinationReviews } from "@/lib/destination-reviews";
import { fetchDestinationTravelReports } from "@/lib/destination-travel-reports";
import { getAlternateUrls } from "@/i18n/routing";
import type { DestinationConfig } from "@/types";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@supabase/supabase-js";

import JsonLd from "@/components/seo/JsonLd";
interface SeoTexts {
  seo_intro: string | null;
  seo_middle: string | null;
  seo_bottom: string | null;
  seo_h2_middle: string | null;
  seo_h2_bottom: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  keywords: string | null;
}

async function fetchSeoTexts(slug: string): Promise<SeoTexts | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("destination_seo_texts")
      .select("seo_intro, seo_middle, seo_bottom, seo_h2_middle, seo_h2_bottom, meta_title, meta_description, focus_keyword, keywords")
      .eq("slug", slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ destination: string; locale: string }>;
}

export async function generateStaticParams() {
  // Nur Top-20 Destinations statisch generieren (Build-Timeout-Schutz).
  // Alle anderen werden on-demand per ISR (revalidate=3600) generiert.
  const TOP_SLUGS = [
    "antalya", "mallorca", "kreta", "hurghada", "side", "alanya",
    "fuerteventura", "teneriffa", "gran-canaria", "lanzarote",
    "rhodos", "korfu", "kos", "bodrum", "ibiza", "menorca",
    "sharm-el-sheikh", "marsa-alam", "dubai", "tuerkische-riviera",
  ];
  return TOP_SLUGS.map((slug) => ({ locale: "de", destination: slug }));
}

export const dynamicParams = true;

const BASE_URL = "https://www.urlaubfinder365.de";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination } = await params;

  const richDest     = getDestinationBySlug(destination);
  const catalogEntry = !richDest ? getCatalogEntry(destination) : undefined;

  const dest: DestinationConfig | undefined =
    richDest ?? (catalogEntry ? catalogToConfig(catalogEntry) : undefined);

  if (!dest) return {};

  // DB-Werte haben Vorrang vor den hardcodierten Config-Fallbacks
  const seoTexts = await fetchSeoTexts(dest.slug);
  const YEAR = new Date().getFullYear();

  // Jahr dynamisch anhängen – KI-generierte Titel enthalten kein hartkodiertes Jahr
  const rawTitle = seoTexts?.meta_title || dest.metaTitle || `${dest.name} Urlaub – Günstige Pauschalreisen`;
  const title = rawTitle.includes(String(YEAR)) ? rawTitle : `${rawTitle} ${YEAR}`;

  const description = seoTexts?.meta_description || dest.metaDescription || dest.description;
  const canonical   = `${BASE_URL}/urlaubsziele/${dest.slug}/`;
  const ogImage     = dest.heroImageFallback ?? dest.heroImage;

  // Weitere Keywords für <meta name="keywords"> (optional, schwacher SEO-Faktor)
  const keywordsMeta = seoTexts?.keywords ?? undefined;

  return {
    title,
    description,
    ...(keywordsMeta ? { keywords: keywordsMeta } : {}),
    robots: { index: true, follow: true },
    alternates: { canonical, languages: getAlternateUrls(`/urlaubsziele/${destination}/`) },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1600, height: 900, alt: dest.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export const revalidate = 3600;

export default async function DestinationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { destination } = await params;

  // 1. Rich destination (Antalya, Mallorca, Barcelona, Kreta)
  const richDest = getDestinationBySlug(destination);

  // 2. Catalog entry (all ~200 other destinations)
  const catalogEntry = !richDest ? getCatalogEntry(destination) : undefined;
  if (!richDest && !catalogEntry) notFound();

  const dest: DestinationConfig = richDest ?? catalogToConfig(catalogEntry!);
  const isSuperRegion = !richDest && catalogEntry?.type === "super";
  const subDestinations = isSuperRegion ? getCatalogByParent(catalogEntry!.slug) : [];
  const YEAR = new Date().getFullYear();

  // Effektive IBE-Region-IDs ermitteln (mit Recovery für Platzhalter-IDs aus Catalog).
  // Rich destinations (antalya, mallorca, …) haben echte IDs und werden 1:1 verwendet.
  // Catalog-Einträge mit Fake-IDs (1xxxxx) → fallback auf Children/Parent/Geschwister.
  const richIsFake = !!richDest && isFakeIbeRegionId(richDest.ibeRegionId);
  const effectiveIbeIds: number[] =
    richDest && !richIsFake
      ? (richDest.ibeRegionId
          ? [Number(richDest.ibeRegionId)]
          : (richDest.regionIds ?? []))
      : getEffectiveIbeRegionIds(dest.slug);

  const hasIbeData = effectiveIbeIds.length > 0;

  // String-Form für IBE-Teaser (komma-getrennt, Specials.de unterstützt das)
  const regionId = hasIbeData ? effectiveIbeIds.join(",") : "";
  const cityId   = dest.ibeCityId ?? "";
  const hubData  = getHubDataByCountry(dest.country);

  const [topDeals, seoTexts, priceStats, reviewStats, communityReports] = await Promise.all([
    hasIbeData ? fetchTopDeals(effectiveIbeIds, 5) : Promise.resolve([]),
    fetchSeoTexts(dest.slug),
    fetchDestinationPriceStats(dest.slug),
    fetchDestinationReviews(dest.slug),
    fetchDestinationTravelReports(dest.name, 4),
  ]);

  // Offer-Preis-Range: bevorzugt echte Daten aus price_history, sonst aus Top-Deals
  const offerLowPrice =
    priceStats.lowPrice ??
    (topDeals[0]?.offer_price_adult ? Math.floor(Number(topDeals[0].offer_price_adult)) : null);
  const offerHighPrice = priceStats.highPrice;
  const offerCount = priceStats.sampleSize > 0 ? priceStats.sampleSize : topDeals.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite",    "item": BASE_URL + "/" },
          { "@type": "ListItem", "position": 2, "name": "Urlaubsziele",  "item": BASE_URL + "/urlaubsziele/" },
          { "@type": "ListItem", "position": 3, "name": dest.name,       "item": BASE_URL + `/urlaubsziele/${dest.slug}/` },
        ],
      },
      {
        "@type": "TouristDestination",
        "name": dest.name,
        "description": dest.metaDescription ?? dest.description,
        "url": BASE_URL + `/urlaubsziele/${dest.slug}/`,
        "image": dest.heroImageFallback ?? dest.heroImage,
        "touristType": ["Strandurlaub", "Pauschalreise", "All-Inclusive"],
        "containedInPlace": { "@type": "Country", "name": dest.country },
        ...(dest.iataCode ? {
          "nearbyAmenity": [{
            "@type": "Airport",
            "name": `Flughafen ${dest.name}`,
            "iataCode": dest.iataCode,
          }],
        } : {}),
        ...(dest.climate && dest.climate.length > 0 ? {
          "amenityFeature": dest.climate.slice(0, 4).map((m) => ({
            "@type": "LocationFeatureSpecification",
            "name": `Durchschnittstemperatur ${m.month}`,
            "value": `${m.tempHigh}°C`,
          })),
        } : {}),
        ...(offerLowPrice ? {
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": offerLowPrice,
            ...(offerHighPrice && offerHighPrice > offerLowPrice ? { "highPrice": offerHighPrice } : {}),
            "offerCount": offerCount,
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "Urlaubfinder365" },
          },
        } : {}),
        // AggregateRating/Review entfernt: Google unterstützt Review-Snippets
        // NICHT auf TouristDestination (nur Product, LocalBusiness, CreativeWork etc.).
        // Bewertungen werden weiterhin visuell auf der Seite angezeigt.
      },
      ...(offerLowPrice ? [
        {
          "@type": "TouristTrip",
          "name": `Pauschalreise ${dest.name} – Flug, Hotel & Transfer`,
          "description": `Pauschalreise nach ${dest.name} (${dest.country}) mit Flug, Hotel und Transfer. 7 Nächte, 2 Personen. Preise basieren auf tagesaktuellen Angeboten der letzten 90 Tage.`,
          "url": BASE_URL + `/urlaubsziele/${dest.slug}/`,
          "image": dest.heroImageFallback ?? dest.heroImage,
          "itinerary": {
            "@type": "ItemList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "TouristDestination",
                "name": dest.name,
                "address": { "@type": "PostalAddress", "addressCountry": dest.country },
              },
            }],
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": offerLowPrice,
            ...(offerHighPrice && offerHighPrice > offerLowPrice ? { "highPrice": offerHighPrice } : {}),
            "offerCount": offerCount,
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "Urlaubfinder365" },
            ...(priceStats.lastUpdated ? { "priceValidUntil": priceStats.lastUpdated } : {}),
          },
          "provider": { "@type": "Organization", "name": "Urlaubfinder365", "url": BASE_URL },
        },
      ] : []),
      {
        "@type": "TravelAction",
        "name": `Urlaub in ${dest.name} buchen`,
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/urlaubsziele/${dest.slug}/`,
          "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
        },
        "object": {
          "@type": "TouristDestination",
          "name": dest.name,
          "address": { "@type": "PostalAddress", "addressCountry": dest.country },
        },
        "agent": { "@type": "Organization", "name": "Urlaubfinder365" },
      },
      ...(dest.faqs && dest.faqs.length > 0 ? [
        {
          "@type": "FAQPage",
          "mainEntity": dest.faqs.map((f: { question: string; answer: string }) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer },
          })),
        },
      ] : []),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(360px, 52vh, 540px)" }}>
        {/* Background image – LCP candidate, Next.js optimiert (avif/webp) */}
        <Image
          src={richDest ? destImg(dest) : (dest.heroImageFallback ?? dest.heroImage)}
          alt={`${dest.name} Urlaub`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Gradient: leichter oben, stärker zur Mitte, dann konstant für Pills-Bereich */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-black/15" />

        {/* Content: Breadcrumb oben, H1+Pills vertikal zentriert */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top: Breadcrumb */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
            <nav className="inline-flex items-center gap-1 text-sm text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <Link href="/urlaubsziele/" className="hover:text-white/70 transition-colors">
                Urlaubsziele
              </Link>
              {catalogEntry && catalogEntry.type === "region" && catalogEntry.parentSlug && (
                <>
                  <span className="mx-0.5 text-white/50">›</span>
                  <Link
                    href={`/urlaubsziele/${catalogEntry.parentSlug}/`}
                    className="hover:text-white/70 transition-colors"
                  >
                    {catalogEntry.superRegionName}
                  </Link>
                </>
              )}
              <span className="mx-0.5 text-white/50">›</span>
              <span className="font-semibold">{dest.name}</span>
            </nav>
          </div>

          {/* H1 + Beschreibung + Pills — vertikal zentriert im verbleibenden Platz */}
          <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg mb-1">
              {isSuperRegion
                ? <>{dest.name} Urlaub <span className="text-white/70 font-extrabold">{YEAR}</span></>
                : <>{dest.name} Urlaub – <span className="opacity-80">Pauschalreisen &amp; Angebote</span></>
              }
            </h1>
            <p className="text-base md:text-lg font-semibold text-white/80 drop-shadow mb-2">
              {isSuperRegion
                ? <>Alle Urlaubsziele &amp; günstige Angebote im Überblick – {YEAR}</>
                : <>Günstige Pauschalreisen, All Inclusive &amp; Last Minute – {YEAR}</>
              }
            </p>

            {dest.description && (
              <p className="text-white/75 text-sm leading-relaxed max-w-2xl mb-4 drop-shadow line-clamp-2">
                {dest.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Link href="#pauschalreisen" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                <Package className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Pauschalreisen
              </Link>
              <Link href="#all-inclusive" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                <Umbrella className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> All Inclusive
              </Link>
              <Link href="#last-minute" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Last Minute
              </Link>
              <Link href="#top-deals" className="inline-flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                <Flame className="w-3.5 h-3.5 shrink-0" /> Top-Deals
              </Link>
              {dest.tiqetsCityId && (
                <Link href="#aktivitaeten" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                  <Ticket className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Aktivitäten
                </Link>
              )}
              {dest.iataCode && (
                <Link href="#fluginfo" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                  <PlaneTakeoff className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Flugverbindungen
                </Link>
              )}
              {dest.faqs && dest.faqs.length > 0 && (
                <Link href="#faq" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> FAQ
                </Link>
              )}
              {dest.climate && dest.climate.length > 0 && (
                <Link href="#klima" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                  <Thermometer className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Klima
                </Link>
              )}
              <Link href="#externe-links" className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-all backdrop-blur-sm">
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#00838F]" /> Infos &amp; Links
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Superregion: Sub-Destinations Carousel */}
      {isSuperRegion && subDestinations.length > 0 && (() => {
        const subItems: DestCarouselItem[] = subDestinations.map((sub) => ({
          slug: sub.slug,
          name: sub.name,
          country: dest.name,
          image: generateHeroFallback(sub.unsplashKeyword),
        }));
        return (
          <DestinationCarousel
            title={`Alle Urlaubsziele in ${dest.name}`}
            items={subItems}
            allHref={`/urlaubsziele/${dest.slug}/`}
          />
        );
      })()}


      {/* ── GEO Faktenblock – für KI-Suchmaschinen & Featured Snippets ──── */}
      <section
        aria-label={`Reisefakten ${dest.name}`}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
      >
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
            {dest.name} – Fakten auf einen Blick
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-medium">Land</span>
              <span className="font-semibold text-gray-800">{dest.country}</span>
            </li>
            {topDeals.length > 0 && topDeals[0].offer_price_adult && (
              <li className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-medium">Pauschalreise ab</span>
                <span className="font-semibold text-[#1db682]">
                  ab {Math.floor(Number(topDeals[0].offer_price_adult)).toLocaleString("de-DE")} € / Person
                </span>
              </li>
            )}
            {dest.iataCode && (
              <li className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-medium">Flughafen</span>
                <span className="font-semibold text-gray-800">{dest.name} ({dest.iataCode})</span>
              </li>
            )}
            {dest.climate && dest.climate.length > 0 && (() => {
              const peak = dest.climate.reduce((best, m) => m.tempHigh > best.tempHigh ? m : best, dest.climate[0]);
              return (
                <li className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 font-medium">Wärmster Monat</span>
                  <span className="font-semibold text-gray-800">{peak.month} ({peak.tempHigh}°C)</span>
                </li>
              );
            })()}
            {dest.climate && dest.climate.length > 0 && (() => {
              const cheap = dest.climate.reduce((best, m) => m.tempHigh < best.tempHigh ? m : best, dest.climate[0]);
              return (
                <li className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 font-medium">Günstigste Saison</span>
                  <span className="font-semibold text-gray-800">{cheap.month} (Nebensaison)</span>
                </li>
              );
            })()}
            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-medium">Urlaubsarten</span>
              <span className="font-semibold text-gray-800">Pauschalreise, All-Inclusive, Last-Minute</span>
            </li>
            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-medium">Reisedauer</span>
              <span className="font-semibold text-gray-800">7–14 Tage empfohlen</span>
            </li>
            <li className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-medium">Buchung</span>
              <span className="font-semibold text-gray-800">Frühbucher & Last-Minute verfügbar</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Reisewarnung-Badge (nur wenn aktive Warnung vorliegt) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Suspense fallback={null}>
          <TravelWarningBadge countryName={dest.country} />
        </Suspense>
      </div>

      {/* SEO Intro */}
      {seoTexts?.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative rounded-2xl p-6 sm:p-8 bg-linear-to-br from-[#1e2d3d] to-[#243b52]">
            <Info className="absolute top-4 right-4 w-4 h-4 text-white/20" />
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              {seoTexts.seo_intro}
            </p>
          </div>
        </div>
      )}

      {/* Two-Column Layout: Main Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="xl:flex xl:gap-8 xl:items-start">

          {/* ── Main Column ──────────────────────────────────────────────── */}
          <div className="xl:flex-1 xl:min-w-0">

            {/* Gesponserte Angebote oben — mobile only */}
            <div className="xl:hidden">
              <Suspense fallback={null}>
                <SponsoredAngebote
                  context={{ type: "destination", cityName: dest.name, countryName: dest.country }}
                  position="oben"
                  maxItems={4}
                />
              </Suspense>
            </div>

            {/* Werbeslot — Content oben (über den Top-Deals) */}
            <div className="mt-8">
              <AdSlot slotKey="destination_content_top" />
            </div>

            {/* TOP-DEALS */}
            {topDeals.length > 0 && (
              <div id="top-deals" className="mt-12 scroll-mt-24">
                <div className="relative rounded-2xl overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-linear-to-br from-red-800 via-red-600 to-orange-500" />
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                    <span className="text-5xl shrink-0 drop-shadow">🔥</span>
                    <div>
                      <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Täglich aktuell</p>
                      <h2 className="text-xl font-black text-white leading-tight">
                        Top-Deals: {dest.name} zum Bestpreis
                      </h2>
                      <p className="text-sm text-white/70 mt-0.5">Bestbewertete Hotels · günstigstes Angebot heute</p>
                    </div>
                  </div>
                </div>
                {/* Reihe 1: 2 große Featured-Kacheln */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {topDeals.slice(0, 2).map((offer, i) => (
                    <HomeDealCard key={offer.product_code} offer={offer} priority={i === 0} featured />
                  ))}
                </div>
                {/* Reihe 2: 3 kleinere Kacheln */}
                {topDeals.length > 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {topDeals.slice(2, 5).map((offer) => (
                      <HomeDealCard key={offer.product_code} offer={offer} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Urlaubsarten-Navigation – nur wenn echte IBE-ID vorhanden */}
            {hasIbeData && (
              <div className="mt-12">
                <div className="relative rounded-2xl overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-linear-to-br from-[#1db682] via-[#00838F] to-[#006d78]" />
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                    <span className="text-5xl shrink-0 drop-shadow">⭐</span>
                    <div>
                      <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Für jeden Geschmack</p>
                      <h2 className="text-xl font-black text-white leading-tight">
                        Beliebte Urlaubsarten in {dest.name}
                      </h2>
                      <p className="text-sm text-white/70 mt-0.5">Tagesaktuelle Preise · direkt buchbar</p>
                    </div>
                  </div>
                </div>
                <UrlaubsartenGrid regionId={regionId} destName={dest.name} />
              </div>
            )}

            {/* Pauschalreisen / All-Inclusive / Last Minute – nur wenn echte IBE-ID vorhanden */}
            {hasIbeData && <>

            {/* Pauschalreisen */}
            <div id="pauschalreisen" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#0f4c75] via-[#1b6ca8] to-[#00838F]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">✈️</span>
                  <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white text-[#0f4c75] rounded-full px-2.5 py-0.5 mb-2">✈️ Pauschalreisen</span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      Entspannt &amp; perfekt organisiert nach {dest.name}
                    </h2>
                    <p className="text-sm text-white/70 mt-0.5">Hotel + Flug zum Bestpreis – perfekt geschnürt</p>
                  </div>
                </div>
              </div>
              <IbeTeaser
                regionId={regionId}
                cityId={cityId}
                from="14"
                to="42"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                excludeAi
                hideHeading
              />
              <IbeAllOffersButton
                label={`Alle Pauschalreisen nach ${dest.name} anzeigen`}
                modalTitle={`Pauschalreisen nach ${dest.name}`}
                regionId={regionId}
                cityId={cityId}
                from="14"
                to="42"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                excludeAi
                accentColor="#1b6ca8"
              />
            </div>

            {/* Buchungsempfehlung + Preisalarm → in Sidebar verschoben */}

            {/* Preisverlauf → nach unten verschoben (über Flugverbindungen) */}

            {/* Werbeslot — Content Mitte (zwischen Pauschal und All-Inclusive) */}
            <div className="mt-8">
              <AdSlot slotKey="destination_content_mid" />
            </div>

            {/* All-Inclusive */}
            <div id="all-inclusive" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#b06a00] via-[#c97d00] to-[#e8a000]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">🏖️</span>
                  <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white text-[#b06a00] rounded-full px-2.5 py-0.5 mb-2">🏖️ All Inclusive</span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      Rundum sorglos &amp; Luxus pur in {dest.name}
                    </h2>
                    <p className="text-sm text-white/70 mt-0.5">Maximale Entspannung mit voller Kostenkontrolle</p>
                  </div>
                </div>
              </div>
              <IbeTeaser
                regionId={regionId}
                cityId={cityId}
                boardCode="AI"
                from="14"
                to="42"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                hideHeading
              />
              <IbeAllOffersButton
                label={`Alle All Inclusive Angebote in ${dest.name} anzeigen`}
                modalTitle={`All Inclusive in ${dest.name}`}
                regionId={regionId}
                cityId={cityId}
                boardCode="AI"
                from="14"
                to="42"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                accentColor="#c97d00"
              />
            </div>

            {/* Last Minute */}
            <div id="last-minute" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#c0392b] via-[#e74c3c] to-[#e67e22]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">⚡</span>
                  <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white text-[#c0392b] rounded-full px-2.5 py-0.5 mb-2">⚡ Last Minute</span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      Spontan in den Urlaub: Last Minute Deals für {dest.name}
                    </h2>
                    <p className="text-sm text-white/70 mt-0.5">Spontan weg &amp; kräftig sparen – aktuelle Schnäppchen</p>
                  </div>
                </div>
              </div>
              <IbeTeaser
                regionId={regionId}
                cityId={cityId}
                from="3"
                to="17"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                hideHeading
              />
              <IbeAllOffersButton
                label={`Alle Last Minute Deals für ${dest.name} anzeigen`}
                modalTitle={`Last Minute nach ${dest.name}`}
                regionId={regionId}
                cityId={cityId}
                from="3"
                to="17"
                duration="7-7"
                adults="2"
                category="3"
                minRecommrate="40"
                accentColor="#e74c3c"
              />
            </div>

            </>}

            {/* Buchungsempfehlung – mobil sichtbar (Desktop in Sidebar) */}
            <div className="mt-8 xl:hidden">
              <Suspense fallback={null}>
                <BookingAdvisor destinationSlug={dest.slug} destinationName={dest.name} />
              </Suspense>
            </div>

            {/* SEO Middle – vor Aktivitäten */}
            {seoTexts?.seo_middle && (
              <div className="mt-10">
                <div className="relative rounded-2xl p-6 sm:p-8 bg-linear-to-br from-[#1e2d3d] to-[#243b52]">
                  <Info className="absolute top-4 right-4 w-4 h-4 text-white/20" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                    {seoTexts.seo_h2_middle ?? `${dest.name} – Der komplette Reiseführer`}
                  </h2>
                  <div className="leading-relaxed space-y-4">
                    {seoTexts.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => {
                      const trimmed = block.trim();
                      const isHeading = trimmed.length < 80 && !trimmed.endsWith(".") && !trimmed.endsWith("!") && !trimmed.endsWith("?") && !trimmed.endsWith(",") && i > 0;
                      if (isHeading) return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">{trimmed}</h3>;
                      return <p key={i} className="text-[15px] text-white/80 leading-[1.8]">{trimmed}</p>;
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tiqets Aktivitäten */}
            {dest.tiqetsCityId && (
              <div id="aktivitaeten" className="mt-12 scroll-mt-24">
                <div className="mb-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    Aktivitäten &amp; Tickets in <span className="text-sand-500">{dest.name}</span>
                  </h2>
                </div>
                {dest.tiqetsNiches && dest.tiqetsNiches.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dest.tiqetsNiches.map((niche) => (
                      <Link
                        key={niche.slug}
                        href={`/erlebnisse/${dest.slug}/${niche.slug}/`}
                        className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-[#00838F] hover:bg-brand-teal hover:text-white hover:border-brand-teal text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      >
                        🎟️ {niche.label}
                      </Link>
                    ))}
                  </div>
                )}
                <TiqetsActivitiesSection cityId={dest.tiqetsCityId} cityName={dest.name} citySlug={dest.slug} />
              </div>
            )}

            {/* Gesponserte Angebote unten — mobile only */}
            <div className="xl:hidden">
              <Suspense fallback={null}>
                <SponsoredAngebote
                  context={{ type: "destination", cityName: dest.name, countryName: dest.country }}
                  position="unten"
                  maxItems={4}
                />
              </Suspense>
            </div>

          </div>{/* end main column */}

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="hidden xl:block w-72 shrink-0 mt-12">
            <div className="sticky top-24 space-y-5">
              <RightSidebar
                dealRegionIds={hasIbeData ? effectiveIbeIds : []}
                adSlotTop="destination_sidebar_top"
                adSlotBottom="destination_sidebar_bottom"
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&q=70&auto=format&fit=crop",
                  eyebrow: "Jetzt buchen",
                  title: `${dest.name} – Günstig in den Urlaub`,
                  description: `Pauschalreisen, All-Inclusive & Last-Minute nach ${dest.name} zum Bestpreis.`,
                  href: `/urlaubsziele/${dest.slug}/`,
                  ctaLabel: "Angebote vergleichen →",
                }}
                seoLinksTitle="✈️ Beliebte Urlaubsziele"
                seoLinks={[
                  { href: "/urlaubsziele/tuerkei/",       label: "Türkei" },
                  { href: "/urlaubsziele/mallorca/",       label: "Mallorca" },
                  { href: "/urlaubsziele/griechenland/",   label: "Griechenland" },
                  { href: "/urlaubsziele/kanaren/",        label: "Kanaren" },
                  { href: "/urlaubsziele/dubai/",          label: "Dubai" },
                  { href: "/urlaubsziele/",                label: "Alle Urlaubsziele →" },
                ]}
                afterLinks={
                  <Suspense fallback={null}>
                    <BookingAdvisor destinationSlug={dest.slug} destinationName={dest.name} />
                  </Suspense>
                }
                beforeLocalPartners={
                  <PriceAlertWidget destinationSlug={dest.slug} destinationName={dest.name} />
                }
              />

            </div>
          </aside>

        </div>
      </div>{/* end two-column layout */}

      {/* Flugverbindungen */}
      {dest.iataCode && (
        <div id="fluginfo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="absolute inset-0 bg-linear-to-br from-[#0f2027] via-[#1b3a4b] to-[#00838F]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10 px-6 py-5 flex items-center gap-5">
              <span className="text-5xl shrink-0 drop-shadow">✈️</span>
              <div>
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Flugverbindungen</p>
                <h2 className="text-xl font-black text-white leading-tight">
                  Deine Flüge nach {dest.name}
                </h2>
                <p className="text-sm text-white/70 mt-0.5">Wähle deinen Abflughafen für günstige Direktflüge</p>
              </div>
            </div>
          </div>
          <IbeBoardingPass
            city={dest.name}
            code={dest.iataCode}
            region={dest.ibeBpRegion ?? ""}
          />
        </div>
      )}

      {/* Reise-Hub */}
      {hubData && (
        <ReiseHub destination={dest.name} country={dest.country} data={hubData} />
      )}

      {/* FAQ-Bereich */}
      {dest.faqs && dest.faqs.length > 0 && (
        <div id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Häufige Fragen zu {dest.name}
          </h2>
          <div className="divide-y divide-gray-200">
            {dest.faqs.map((faq, i) => (
              <details key={faq.question} className="py-4 group" open={i === 0 || undefined}>
                <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-gray-800 hover:text-sand-600 transition-colors">
                  {faq.question}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Klimadiagramm */}
      {dest.climate && dest.climate.length > 0 && (
        <div id="klima" className="scroll-mt-24">
          <ClimateChart data={dest.climate} destination={dest.name} />
        </div>
      )}

      {/* Einreise-Infobox – nur wenn kein ReiseHub vorhanden */}
      {dest.entryInfo && !hubData && (
        <EntryInfoBox info={dest.entryInfo} destination={dest.name} />
      )}

      {/* Interaktive Karte mit POIs im Umkreis */}
      {dest.coordinates && (
        <DestinationMapEmbed
          lat={dest.coordinates.lat}
          lng={dest.coordinates.lng}
          slug={dest.slug}
          name={dest.name}
        />
      )}

      {/* Weiterführende externe Links */}
      <div id="externe-links" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Offizielle Informationen für deinen {dest.name} Urlaub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href={`https://www.auswaertiges-amt.de/de/ReiseUndSicherheit/reise-und-sicherheitshinweise`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 hover:border-blue-300 transition-colors"
          >
            <span className="text-2xl shrink-0">🏛️</span>
            <div>
              <p className="font-semibold text-blue-800 text-sm">Auswärtiges Amt</p>
              <p className="text-xs text-gray-500 mt-0.5">Reise- & Sicherheitshinweise für {dest.country}</p>
            </div>
          </a>
          <a
            href="https://www.adac.de/reise-freizeit/reiseplanung/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4 hover:border-yellow-300 transition-colors"
          >
            <span className="text-2xl shrink-0">🚗</span>
            <div>
              <p className="font-semibold text-yellow-800 text-sm">ADAC Reisevorbereitung</p>
              <p className="text-xs text-gray-500 mt-0.5">Checklisten, Packtipps & Reiserecht</p>
            </div>
          </a>
          <a
            href="https://crm.de/reiselaender/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4 hover:border-green-300 transition-colors"
          >
            <span className="text-2xl shrink-0">💉</span>
            <div>
              <p className="font-semibold text-green-800 text-sm">CRM Reisemedizin</p>
              <p className="text-xs text-gray-500 mt-0.5">Impfempfehlungen & Gesundheitstipps</p>
            </div>
          </a>
          <Link
            href="/tipps/reise-packliste/"
            className="flex items-start gap-3 bg-sand-50 border border-sand-100 rounded-xl p-4 hover:border-sand-300 transition-colors"
          >
            <span className="text-2xl shrink-0">🧳</span>
            <div>
              <p className="font-semibold text-sand-800 text-sm">Reise-Packliste</p>
              <p className="text-xs text-gray-500 mt-0.5">Checkliste für deinen {dest.name} Urlaub</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Urlauber-Bewertungen */}
      <DestinationReviewsSection
        stats={reviewStats}
        destinationName={dest.name}
        destinationSlug={dest.slug}
      />

      {/* Community-Reiseberichte */}
      <DestinationCommunityReports
        reports={communityReports}
        destinationName={dest.name}
        destinationSlug={dest.slug}
      />

      {/* Kosten & Preisverlauf – gehören thematisch zusammen */}
      <BudgetBreakdownSection dest={dest} />

      <div id="preisverlauf" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 scroll-mt-24">
        <PriceChart destinationSlug={dest.slug} destinationName={dest.name} />
        <EmbedWidgetSection destinationSlug={dest.slug} destinationName={dest.name} />
      </div>

      {/* Long-tail Suchbegriffe + Reisezeiten */}
      <LongTailContentSection name={dest.name} slug={dest.slug} regionId={regionId} hasTiqets={!!dest.tiqetsCityId} />

      {/* Hub-and-Spoke interne Links */}
      <DestinationHubLinks name={dest.name} regionId={regionId} />

      {/* Ähnliche Urlaubsziele */}
      <RelatedDestinations currentSlug={dest.slug} country={dest.country} />

      {/* SEO Bottom – langer Reiseführer + CTA */}
      {seoTexts?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative rounded-2xl p-6 sm:p-8 bg-linear-to-br from-[#1e2d3d] to-[#243b52]">
            <Info className="absolute top-4 right-4 w-4 h-4 text-white/20" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {seoTexts.seo_h2_bottom ?? `${dest.name} Urlaub günstig buchen`}
            </h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              {seoTexts.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/guenstig-urlaub-buchen/" className="bg-[#1db682] hover:bg-[#18a070] text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Jetzt Angebote vergleichen →
              </Link>
              <Link href="/last-minute/" className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Last-Minute Deals
              </Link>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <AdSlot slotKey="destination_content_bottom" minHeight={120} />
            </div>
          </div>
        </div>
      )}

      {/* Guide CTA unten – nur wenn Urlaubsführer vorhanden */}
      {dest.guideSlug && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-8 bg-linear-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Dein informativer Urlaubsführer für {dest.name}</h2>
              <p className="text-blue-100 text-sm">
                Einreiseinfos, Klima, Sehenswürdigkeiten, Gesundheitstipps und mehr.
              </p>
            </div>
            <Link
              href={`/urlaubsguides/${dest.guideSlug}/`}
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Zum Urlaubsführer →
            </Link>
          </div>
        </div>
      )}

      {/* Alle Urlaubsziele – Carousel */}
      <DestinationCarousel title="Weitere Urlaubsziele entdecken" />
    </>
  );
}
