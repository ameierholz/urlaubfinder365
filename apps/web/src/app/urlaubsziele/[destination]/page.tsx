import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Package, Umbrella, Zap, Ticket, PlaneTakeoff, HelpCircle, Thermometer, ExternalLink } from "lucide-react";
import { getDestinationBySlug, destinations, destImg } from "@/lib/destinations";
import { getCatalogEntry, getCatalogByParent, CATALOG } from "@/data/catalog-regions";
import { catalogToConfig, generateHeroFallback } from "@/lib/catalog-helpers";
import { getHubDataByCountry } from "@/lib/reise-hub-data";
import IbeHolidayWidget from "@/components/ibe/IbeHolidayWidget";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import { Suspense } from "react";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import IbeBoardingPass from "@/components/ibe/IbeBoardingPass";
import ReiseHub from "@/components/reise-hub/ReiseHub";
import TiqetsActivitiesSection from "@/components/tiqets/TiqetsActivitiesSection";
import DestinationCarousel, { type DestCarouselItem } from "@/components/ui/DestinationCarousel";
import EntryInfoBox from "@/components/destination/EntryInfoBox";
import DestinationMap from "@/components/destination/DestinationMap";
import ClimateChart from "@/components/destination/ClimateChart";
import type { Metadata } from "next";
import type { DestinationConfig } from "@/types";

interface Props {
  params: Promise<{ destination: string }>;
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

  // Sub-Regionen (type "region": Städte/Resorts wie Side, Playa de Palma)
  // erhalten noindex: zu wenig Unique Content, kein Crawl-Budget verschwenden.
  // Interne Links bleiben erreichbar (follow: true).
  const isSubRegion = !richDest && catalogEntry?.type === "region";

  return {
    title,
    description,
    ...(isSubRegion ? { robots: { index: false, follow: true } } : {}),
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

  const regionId = dest.ibeRegionId ?? dest.regionIds[0].toString();
  const cityId   = dest.ibeCityId ?? "";
  const hubData  = getHubDataByCountry(dest.country);

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
      ...(dest.faqs && dest.faqs.length > 0 ? [{
        "@type": "Review",
        "itemReviewed": { "@type": "TouristDestination", "name": dest.name },
        "author": { "@type": "Organization", "name": "Urlaubfinder365 Community" },
        "reviewBody": `Reisebewertungen und Erfahrungsberichte zu ${dest.name}, ${dest.country} von der Urlaubfinder365 Community.`,
        "publisher": { "@type": "Organization", "name": "Urlaubfinder365" },
      }] : []),
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none drop-shadow-lg mb-1">
              {dest.name}
            </h1>
            <p className="text-base md:text-lg font-semibold text-white/85 drop-shadow mb-2">
              {isSuperRegion
                ? <>Alle Reiseziele &amp; günstige Angebote im Überblick – {YEAR}</>
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


      {/* Gesponserte Angebote — Stadtseite oben */}
      <Suspense fallback={null}>
        <SponsoredAngebote
          context={{ type: "destination", cityName: dest.name, countryName: dest.country }}
          position="oben"
          maxItems={4}
        />
      </Suspense>

      {/* Urlaubsarten-Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-1">
          Beliebte Urlaubsarten in <span className="text-sand-500">{dest.name}</span>
        </h2>
        <IbeHolidayWidget regionId={regionId} name={dest.name} />
      </div>

      {/* Pauschalreisen */}
      <div id="pauschalreisen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Entspannt &amp; perfekt organisiert: Pauschalreisen nach <span className="text-sand-500">{dest.name}</span>
        </h2>
        <p className="text-gray-500 border-l-4 border-sand-300 pl-3 mb-6">
          Entdecke perfekt geschnürte Pauschalangebote für {dest.name} inklusive Hotel und Flug zum Bestpreis!
        </p>
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

      {/* All-Inclusive */}
      <div id="all-inclusive" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Rundum sorglos &amp; Luxus pur: All Inclusive Urlaub in <span className="text-sand-500">{dest.name}</span>
        </h2>
        <p className="text-gray-500 border-l-4 border-sand-300 pl-3 mb-6">
          Genieße maximale Entspannung mit voller Kostenkontrolle bei deinem All Inclusive Urlaub in {dest.name}.
        </p>
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
      <div id="last-minute" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Spontan in den Urlaub verreisen: Last Minute Deals für <span className="text-sand-500">{dest.name}</span>
        </h2>
        <p className="text-gray-500 border-l-4 border-sand-300 pl-3 mb-6">
          Spontan weg und kräftig sparen! Entdecke unsere aktuellen Reiseschnäppchen für {dest.name} zum absoluten Vorteilspreis.
        </p>
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
        <div id="aktivitaeten" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
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

      {/* Gesponserte Angebote — Stadtseite unten + Region */}
      <Suspense fallback={null}>
        <SponsoredAngebote
          context={{ type: "destination", cityName: dest.name, countryName: dest.country }}
          position="unten"
          maxItems={4}
        />
      </Suspense>

      {/* Boarding Pass / Fluginfo */}
      {dest.iataCode && (
        <div id="fluginfo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex items-center justify-between gap-4 mt-12 mb-0">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Deine Flugverbindungen nach <span className="text-sand-500">{dest.name}</span>
              </h2>
              <p className="text-gray-600 mt-1">
                Wähle deinen Abflughafen für günstige Flüge nach {dest.name}.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border-2 border-teal-200/60 shadow-md shrink-0">
              <span className="text-teal-500 text-lg">✈</span>
              <span className="font-black text-gray-900 uppercase text-sm tracking-wide">
                {dest.name} wartet!
              </span>
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

      {/* Alle Reiseziele – Carousel */}
      <DestinationCarousel title="Weitere Urlaubsziele entdecken" />

      {/* Guide CTA unten – nur wenn Reiseführer vorhanden */}
      {dest.guideSlug && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-8 bg-linear-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Dein digitaler Reisebegleiter für {dest.name}</h2>
              <p className="text-blue-100 text-sm">
                Einreiseinfos, Klima, Sehenswürdigkeiten, Gesundheitstipps und mehr.
              </p>
            </div>
            <Link
              href={`/urlaubsguides/${dest.guideSlug}/`}
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Zum Reiseführer →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
