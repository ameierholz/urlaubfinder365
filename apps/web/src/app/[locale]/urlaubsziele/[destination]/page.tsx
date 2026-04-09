import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Package, Umbrella, Zap, Ticket, PlaneTakeoff, HelpCircle, Thermometer, ExternalLink, Flame } from "lucide-react";
import { getDestinationBySlug, destinations, destImg } from "@/lib/destinations";
import { getCatalogEntry, getCatalogByParent, CATALOG } from "@/data/catalog-regions";
import { catalogToConfig, generateHeroFallback } from "@/lib/catalog-helpers";
import { getHubDataByCountry } from "@/lib/reise-hub-data";
import IbeHolidayWidget from "@/components/ibe/IbeHolidayWidget";
import UrlaubsartenGrid from "@/components/destination/UrlaubsartenGrid";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import RightSidebar from "@/components/layout/RightSidebar";
import { Suspense } from "react";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import IbeBoardingPass from "@/components/ibe/IbeBoardingPass";
import ReiseHub from "@/components/reise-hub/ReiseHub";
import TiqetsActivitiesSection from "@/components/tiqets/TiqetsActivitiesSection";
import DestinationCarousel, { type DestCarouselItem } from "@/components/ui/DestinationCarousel";
import RelatedDestinations from "@/components/destination/related-destinations";
import EntryInfoBox from "@/components/destination/EntryInfoBox";
import TravelWarningBadge from "@/components/destination/TravelWarningBadge";
import DestinationMap from "@/components/destination/DestinationMap";
import ClimateChart from "@/components/destination/ClimateChart";
import PriceChart from "@/components/destination/price-chart";
import BookingAdvisor from "@/components/destination/booking-advisor";
import PriceAlertWidget from "@/components/destination/price-alert-widget";
import HomeDealCard from "@/components/home/HomeDealCard";
import { fetchTopDeals } from "@/lib/travel-api";
import type { DestinationConfig } from "@/types";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@supabase/supabase-js";

interface SeoTexts {
  seo_intro: string | null;
  seo_middle: string | null;
  seo_bottom: string | null;
  seo_h2_middle: string | null;
  seo_h2_bottom: string | null;
}

async function fetchSeoTexts(slug: string): Promise<SeoTexts | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("destination_seo_texts")
      .select("seo_intro, seo_middle, seo_bottom, seo_h2_middle, seo_h2_bottom")
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
  const richSlugs    = destinations.map((d) => ({ destination: d.slug }));
  const catalogSlugs = CATALOG.map((e) => ({ destination: e.slug }));
  // Deduplicate (rich destinations take precedence, catalog may overlap)
  const seen = new Set(richSlugs.map((s) => s.destination));
  const uniqueCatalog = catalogSlugs.filter((s) => !seen.has(s.destination));
  return [...richSlugs, ...uniqueCatalog];
}

const BASE_URL = "https://www.urlaubfinder365.de";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination } = await params;

  const richDest     = getDestinationBySlug(destination);
  const catalogEntry = !richDest ? getCatalogEntry(destination) : undefined;

  const dest: DestinationConfig | undefined =
    richDest ?? (catalogEntry ? catalogToConfig(catalogEntry) : undefined);

  if (!dest) return {};

  const title       = dest.metaTitle       ?? `${dest.name} Urlaub – Günstige Pauschalreisen`;
  const description = dest.metaDescription ?? dest.description;
  const canonical   = `${BASE_URL}/urlaubsziele/${dest.slug}/`;
  const ogImage     = dest.heroImageFallback ?? dest.heroImage;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
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

  const regionId = dest.ibeRegionId ?? dest.regionIds?.[0]?.toString() ?? "";
  const cityId   = dest.ibeCityId ?? "";
  const hubData  = getHubDataByCountry(dest.country);

  // Top-Deals: ibeRegionId hat Vorrang vor regionIds (Platzhalter-Werte vermeiden)
  const dealRegionIds = dest.ibeRegionId
    ? [Number(dest.ibeRegionId)]
    : dest.regionIds;
  const [topDeals, seoTexts] = await Promise.all([
    fetchTopDeals(dealRegionIds, 5),
    fetchSeoTexts(dest.slug),
  ]);

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
        ...(topDeals.length > 0 && topDeals[0].offer_price_adult ? {
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": Math.floor(Number(topDeals[0].offer_price_adult)),
            "priceCurrency": "EUR",
            "offerCount": topDeals.length,
          },
        } : {}),
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(360px, 52vh, 540px)" }}>
        {/* Background image – LCP candidate */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={richDest ? destImg(dest) : (dest.heroImageFallback ?? dest.heroImage)}
          alt={`${dest.name} Urlaub`}
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
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
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            {seoTexts.seo_intro}
          </p>
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

            {/* Urlaubsarten-Navigation */}
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

            {/* Pauschalreisen */}
            <div id="pauschalreisen" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#0f4c75] via-[#1b6ca8] to-[#00838F]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">✈️</span>
                  <div>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Pauschalreisen</p>
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
            </div>

            {/* Buchungsempfehlung + Preisalarm → in Sidebar verschoben */}

            {/* Preisverlauf */}
            <div id="preisverlauf" className="mt-8 scroll-mt-24">
              <PriceChart destinationSlug={dest.slug} destinationName={dest.name} />
            </div>

            {/* All-Inclusive */}
            <div id="all-inclusive" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#b06a00] via-[#c97d00] to-[#e8a000]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">🏖️</span>
                  <div>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">All Inclusive</p>
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
            </div>

            {/* Last Minute */}
            <div id="last-minute" className="mt-12 scroll-mt-24">
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-[#c0392b] via-[#e74c3c] to-[#e67e22]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                  <span className="text-5xl shrink-0 drop-shadow">⚡</span>
                  <div>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Last Minute</p>
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
            </div>

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
                        href={`/aktivitaeten/${dest.slug}/${niche.slug}/`}
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
                dealRegionIds={dest.regionIds}
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
              />

              {/* Buchungsempfehlung in Sidebar */}
              <Suspense fallback={null}>
                <BookingAdvisor destinationSlug={dest.slug} destinationName={dest.name} />
              </Suspense>

              {/* Preisalarm in Sidebar */}
              <PriceAlertWidget destinationSlug={dest.slug} destinationName={dest.name} />
            </div>
          </aside>

        </div>
      </div>{/* end two-column layout */}

      {/* Flugverbindungen – Vollbreite außerhalb Sidebar-Layout */}
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

      {/* Interaktive Karte */}
      {dest.coordinates && (
        <DestinationMap
          lat={dest.coordinates.lat}
          lng={dest.coordinates.lng}
          destination={dest.name}
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
            href="https://www.adac.de/reise-freizeit/reiseplanung/reisevorbereitung/"
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
            href="https://www.bzga.de/infomaterialien/reisemedizin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4 hover:border-green-300 transition-colors"
          >
            <span className="text-2xl shrink-0">💉</span>
            <div>
              <p className="font-semibold text-green-800 text-sm">BZgA Reisemedizin</p>
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

      {/* Ähnliche Urlaubsziele */}
      <RelatedDestinations currentSlug={dest.slug} country={dest.country} />

      {/* Alle Urlaubsziele – Carousel */}
      <DestinationCarousel title="Weitere Urlaubsziele entdecken" />

      {/* SEO Middle – Kompletter Reiseführer (ganz unten) */}
      {seoTexts?.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {seoTexts.seo_h2_middle ?? `${dest.name} – Der komplette Reiseführer`}
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              {seoTexts.seo_middle.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO Bottom – Buchungs-CTA */}
      {seoTexts?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-[#0d1f35] to-[#1a3a5c] rounded-2xl p-6 sm:p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {seoTexts.seo_h2_bottom ?? `${dest.name} Urlaub günstig buchen`}
            </h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              {seoTexts.seo_bottom.split("\n\n").map((p, i) => (
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
          </div>
        </div>
      )}

      {/* Guide CTA unten – nur wenn Urlaubsführer vorhanden */}
      {dest.guideSlug && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-8 bg-linear-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Dein digitaler Urlaubsbegleiter für {dest.name}</h2>
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
    </>
  );
}
