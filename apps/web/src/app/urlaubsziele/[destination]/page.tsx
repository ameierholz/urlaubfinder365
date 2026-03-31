import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Package, Umbrella, Zap, Ticket } from "lucide-react";
import { getDestinationBySlug, destinations, destImg } from "@/lib/destinations";
import { getCatalogEntry, getCatalogByParent, CATALOG } from "@/data/catalog-regions";
import { catalogToConfig, generateHeroFallback } from "@/lib/catalog-helpers";
import { getHubDataByCountry } from "@/lib/reise-hub-data";
import IbeHolidayWidget from "@/components/ibe/IbeHolidayWidget";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import IbeBoardingPass from "@/components/ibe/IbeBoardingPass";
import ReiseHub from "@/components/reise-hub/ReiseHub";
import TiqetsActivitiesSection from "@/components/tiqets/TiqetsActivitiesSection";
import SimilarDestinations from "@/components/destination/SimilarDestinations";
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
      ...(dest.faqs && dest.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": dest.faqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      }] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/urlaubziel_header.jpg"
        alt="Urlaubsziele – Jetzt günstig buchen"
        className="w-full object-cover"
        style={{ maxHeight: "180px" }}
        loading="eager"
      />

      {/* HERO: H1 + Intro links, Destination-Bild rechts */}
      <section className="border-b border-sand-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-gray-500 mb-5">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <Link href="/urlaubsziele/" className="hover:text-sand-500 transition-colors">
              Urlaubsziele
            </Link>
            {catalogEntry && catalogEntry.type === "region" && catalogEntry.parentSlug && (
              <>
                <span className="mx-1 text-gray-300">›</span>
                <Link
                  href={`/urlaubsziele/${catalogEntry.parentSlug}/`}
                  className="hover:text-sand-500 transition-colors"
                >
                  {catalogEntry.superRegionName}
                </Link>
              </>
            )}
            <span className="mx-1 text-gray-300">›</span>
            <span className="text-gray-700 font-medium">{dest.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Links: H1 + Text */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {isSuperRegion
                  ? <>Urlaub <span className="text-sand-500">{dest.name}</span> – Alle Reiseziele auf einen Blick</>
                  : <>Dein nächster <span className="text-sand-500">{dest.name}</span> Urlaub?{" "}
                     Günstige Pauschalreisen, All Inclusive &amp; Last Minute.</>
                }
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {isSuperRegion
                  ? `Entdecke alle Reiseziele in ${dest.name} und vergleiche günstige Pauschalreisen, All Inclusive Urlaube und Last Minute Deals auf einen Blick.`
                  : <>Finde tagesaktuelle Reiseangebote für deinen Traumurlaub in {dest.name}. Wir vergleichen
                     für dich die besten Preise für günstige Pauschalreisen, komfortable All Inclusive Urlaube
                     sowie spontane Last Minute Deals.
                     {dest.iataCode && (
                       <> Fliege bequem zum Flughafen <strong>{dest.iataCode}</strong> und genieße entspannte
                       Tage in perfekt bewerteten Hotels.</>
                     )}
                  </>
                }
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="#pauschalreisen"
                  className="inline-flex items-center gap-2 bg-sand-50 border border-sand-200 text-sand-700 px-5 py-3 rounded-2xl hover:bg-sand-100 transition-colors"
                >
                  <Package className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Pauschalreisen</p>
                    <p className="text-xs text-sand-500">Flug + Hotel günstig</p>
                  </div>
                </Link>
                <Link
                  href="#all-inclusive"
                  className="inline-flex items-center gap-2 bg-sand-50 border border-sand-200 text-sand-700 px-5 py-3 rounded-2xl hover:bg-sand-100 transition-colors"
                >
                  <Umbrella className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">All Inclusive</p>
                    <p className="text-xs text-sand-500">Rundum sorglos</p>
                  </div>
                </Link>
                <Link
                  href="#last-minute"
                  className="inline-flex items-center gap-2 bg-sand-50 border border-sand-200 text-sand-700 px-5 py-3 rounded-2xl hover:bg-sand-100 transition-colors"
                >
                  <Zap className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Last Minute</p>
                    <p className="text-xs text-sand-500">Spontan &amp; günstig</p>
                  </div>
                </Link>
                {dest.tiqetsCityId && (
                  <Link
                    href="#aktivitaeten"
                    className="inline-flex items-center gap-2 bg-sand-50 border border-sand-200 text-sand-700 px-5 py-3 rounded-2xl hover:bg-sand-100 transition-colors"
                  >
                    <Ticket className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Aktivitäten</p>
                      <p className="text-xs text-sand-500">Touren &amp; Erlebnisse</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Rechts: Destination-Bild */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={richDest ? destImg(dest) : (dest.heroImageFallback ?? dest.heroImage)}
                alt={`${dest.name} Urlaub – Pauschalreisen & Angebote`}
                className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-lg"
                // @ts-ignore
                fetchPriority="high"
              />
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
            title={`Alle Reiseziele (Urlaubsziele) in ${dest.name}`}
            items={subItems}
            allHref={`/urlaubsziele/${dest.slug}/`}
          />
        );
      })()}

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
                  className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-[#00838F] hover:bg-[#6CC4BA] hover:text-white hover:border-[#6CC4BA] text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                >
                  🎟️ {niche.label}
                </Link>
              ))}
            </div>
          )}
          <TiqetsActivitiesSection cityId={dest.tiqetsCityId} cityName={dest.name} citySlug={dest.slug} />
        </div>
      )}

      {/* Boarding Pass / Fluginfo */}
      {dest.iataCode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mt-12 mb-0">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Deine Flugverbindungen nach <span className="text-sand-500">{dest.name}</span>
              </h2>
              <p className="text-gray-600 mt-1">
                Wähle deinen Abflughafen für günstige Flüge nach {dest.name}.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border-2 border-teal-200/60 shadow-md flex-shrink-0">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Häufige Fragen zu {dest.name}
          </h2>
          <div className="divide-y divide-gray-200">
            {dest.faqs.map((faq) => (
              <details key={faq.question} className="py-4 group">
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
        <ClimateChart data={dest.climate} destination={dest.name} />
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

      {/* Ähnliche Reiseziele */}
      <SimilarDestinations current={dest} />

      {/* Alle Reiseziele – Carousel */}
      <DestinationCarousel title="Weitere Reiseziele entdecken" />

      {/* Guide CTA unten – nur wenn Reiseführer vorhanden */}
      {dest.guideSlug && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
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
