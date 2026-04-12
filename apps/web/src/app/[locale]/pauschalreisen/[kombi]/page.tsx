import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { PAUSCHAL_KOMBIS, getPauschalKombi } from "@/lib/pauschalreisen-kombi-data";
import { getDestinationBySlug } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import { fetchDestinationPriceStats } from "@/lib/destination-pricing";
import { getAlternateUrls } from "@/i18n/routing";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import DestinationCarousel from "@/components/ui/DestinationCarousel";

import JsonLd from "@/components/seo/JsonLd";
import { FlagImage } from "@/components/ui/flag-image";
const BASE_URL = "https://www.urlaubfinder365.de";

interface Props {
  params: Promise<{ kombi: string; locale: string }>;
}

export function generateStaticParams() {
  return PAUSCHAL_KOMBIS.map((k) => ({ kombi: k.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kombi } = await params;
  const data = getPauschalKombi(kombi);
  if (!data) return {};
  const canonical = `${BASE_URL}/pauschalreisen/${data.slug}/`;
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    alternates: { canonical, languages: getAlternateUrls(`/pauschalreisen/${data.slug}/`) },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      url: canonical,
      type: "website",
      images: [{ url: data.heroImage, width: 1920, height: 1080, alt: data.h1 }],
    },
  };
}

export const revalidate = 3600;

function destExists(slug: string): { name: string; slug: string } | null {
  const d = getDestinationBySlug(slug);
  if (d) return { name: d.name, slug: d.slug };
  const c = CATALOG.find((e) => e.slug === slug);
  if (c) return { name: c.name, slug: c.slug };
  return null;
}

export default async function PauschalKombiPage({ params }: Props) {
  const { kombi, locale } = await params;
  setRequestLocale(locale);
  const data = getPauschalKombi(kombi);
  if (!data) notFound();

  const relatedDests = data.relatedDestinationSlugs
    .map(destExists)
    .filter((x): x is { name: string; slug: string } => x !== null);

  // Echte Preis-Range aus price_history aggregiert über alle relatedDestinationSlugs
  const priceStatsList = await Promise.all(
    data.relatedDestinationSlugs.map((s) => fetchDestinationPriceStats(s))
  );
  const lowPrices  = priceStatsList.map((p) => p.lowPrice).filter((n): n is number => n !== null);
  const highPrices = priceStatsList.map((p) => p.highPrice).filter((n): n is number => n !== null);
  const totalSamples = priceStatsList.reduce((sum, p) => sum + p.sampleSize, 0);
  const aggLowPrice  = lowPrices.length > 0 ? Math.min(...lowPrices) : null;
  const aggHighPrice = highPrices.length > 0 ? Math.max(...highPrices) : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Pauschalreisen", item: `${BASE_URL}/urlaubsarten/pauschalreisen/` },
      { "@type": "ListItem", position: 3, name: data.country,     item: `${BASE_URL}/pauschalreisen/${data.slug}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Product + Offer Schema für Rich Snippets (Preis in SERP)
  const productSchema = aggLowPrice ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${data.h1.replace(/ \d{4}.*/, "").trim()}`,
    "description": data.lead,
    "image": data.heroImage,
    "brand": { "@type": "Brand", "name": "Urlaubfinder365" },
    "category": "Travel > Package Holidays",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": aggLowPrice,
      ...(aggHighPrice && aggHighPrice > aggLowPrice ? { "highPrice": aggHighPrice } : {}),
      "offerCount": totalSamples > 0 ? totalSamples : data.relatedDestinationSlugs.length * 10,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Urlaubfinder365",
        "url": BASE_URL,
      },
    },
  } : null;

  // TouristTrip Schema für Travel Rich Results
  const tripSchema = aggLowPrice ? {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": data.h1.replace(/ \d{4}.*/, "").trim(),
    "description": data.longDescription,
    "url": `${BASE_URL}/pauschalreisen/${data.slug}/`,
    "image": data.heroImage,
    "touristType": [`Pauschalreise ${data.country}`, "Badeurlaub", data.board === "AI" ? "All Inclusive" : "Pauschalreise"],
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": relatedDests.map((d, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "TouristDestination",
          "name": d.name,
          "url": `${BASE_URL}/urlaubsziele/${d.slug}/`,
          "address": { "@type": "PostalAddress", "addressCountry": data.country },
        },
      })),
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": aggLowPrice,
      ...(aggHighPrice && aggHighPrice > aggLowPrice ? { "highPrice": aggHighPrice } : {}),
      "offerCount": totalSamples > 0 ? totalSamples : data.relatedDestinationSlugs.length * 10,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Urlaubfinder365" },
    },
    "provider": { "@type": "Organization", "name": "Urlaubfinder365", "url": BASE_URL },
  } : null;

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {productSchema && (
        <JsonLd data={productSchema} />
      )}
      {tripSchema && (
        <JsonLd data={tripSchema} />
      )}

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[440px] flex items-end">
        <Image
          src={data.heroImage}
          alt={data.h1}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/urlaubsarten/pauschalreisen/" className="hover:text-white">Pauschalreisen</Link>
            <span>/</span>
            <span className="text-white/90">{data.country}</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-sky-600/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            <FlagImage emoji={data.flag} name={data.country} size="sm" /> Pauschalreisen {data.country}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {data.h1}
          </h1>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            {data.lead}
          </p>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.highlights.map((h) => (
            <div key={h} className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-gray-800 leading-snug">✓ {h}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IBE TEASER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sky-600 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Aktuelle {data.country} Pauschalreisen
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xl">
          Täglich aktualisiert · Flug, Hotel &amp; Transfer inklusive · Sofortbuchung möglich
        </p>
        <IbeTeaser
          hideHeading
          regionId={data.regionId}
          cityId={data.cityId}
          boardCode={data.board}
          from={data.lastMinute ? "0" : "14"}
          to={data.lastMinute ? "35" : "180"}
          duration="7-7"
          adults="2"
          category={data.category}
          minRecommrate={data.minRecommrate}
          maxPrice={data.maxPrice}
        />
      </div>

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
          {data.country} Pauschalreisen – alles, was du wissen musst
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">{data.longDescription}</p>
      </div>

      {/* DESTINATIONS */}
      {relatedDests.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Beliebte Reiseziele
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            {data.country} – Top-Reiseziele
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedDests.map((d) => (
              <Link
                key={d.slug}
                href={`/urlaubsziele/${d.slug}/`}
                className="flex items-center justify-between bg-white border border-gray-200 hover:border-sky-400 hover:text-sky-600 text-gray-700 text-sm font-medium px-4 py-3 rounded-lg transition-all group"
              >
                <span>{d.name}</span>
                <span className="text-gray-300 group-hover:text-sky-500 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={data.faqs.map((f) => ({ q: f.question, a: f.answer }))} accentColor="#0284c7" />
        </div>
      </div>

      {/* RELATED KOMBIS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Weitere Pauschalreisen</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Andere Länder & Angebote</h2>
        <div className="flex flex-wrap gap-2">
          {PAUSCHAL_KOMBIS.filter((k) => k.slug !== data.slug).slice(0, 12).map((k) => (
            <Link
              key={k.slug}
              href={`/pauschalreisen/${k.slug}/`}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-sky-400 hover:text-sky-600 text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              <FlagImage emoji={k.flag} name={k.country} size="sm" />
              {k.h1.replace(/ \d{4}.*/, "").replace(/^(Pauschalreisen|All Inclusive|Last Minute) /, (m) => m)}
            </Link>
          ))}
        </div>
      </div>

      {/* CAROUSEL */}
      <DestinationCarousel title="Weitere Urlaubsziele entdecken" />
    </div>
  );
}
