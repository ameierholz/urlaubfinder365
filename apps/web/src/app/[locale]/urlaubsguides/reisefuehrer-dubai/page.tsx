import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-dubai/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🏙 Dubai Urlaubsführer ${YEAR} – Burj Khalifa, Wüste & Tipps`,
  description: `Dubai Urlaubsführer ${YEAR}: Burj Khalifa, Palm Jumeirah, Wüstensafari & Geheimtipps ✓ Die futuristische Metropole am Golf komplett erklärt.`,
  keywords: ["Dubai Urlaubsführer", "Dubai Tipps", "Dubai Sehenswürdigkeiten", "Burj Khalifa", "Dubai Urlaub", "VAE Guide", "Dubai Geheimtipps", "Wüstensafari Dubai"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏙 Dubai Urlaubsführer ${YEAR} – VAE Guide | Urlaubfinder365`,
    description: `Dubai Urlaubsführer ${YEAR}: Burj Khalifa, Wüstensafari & Geheimtipps ✓ Die futuristische Metropole am Golf komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Dubai VAE – Urlaubsführer ${YEAR}` }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Urlaubsguides", item: `${BASE_URL}/urlaubsguides/` },
        { "@type": "ListItem", position: 3, name: "Dubai Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Dubai Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Dubai Urlaubsführer: Burj Khalifa, Palm Jumeirah, Wüstensafari, Shopping & praktische Infos.",
      url: CANONICAL,
      datePublished: "2026-04-05",
      dateModified: "2026-04-05",
      author: { "@type": "Organization", name: "Urlaubfinder365" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/header_logo.webp` },
      },
      image: OG_IMAGE,
      about: {
        "@type": "TouristDestination",
        name: "Dubai",
        description: "Futuristische Metropole in den Vereinigten Arabischen Emiraten mit Wolkenkratzern, Wüste und Luxushotels.",
        containedInPlace: { "@type": "Country", name: "Vereinigte Arabische Emirate" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("dubai")!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.dubai} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Dubai – Luxus am Persischen Golf",
                description: "Pauschalreisen & Luxushotels in Dubai zum Bestpreis vergleichen.",
                href: "/urlaubsziele/dubai/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-hurghada/",   label: "Hurghada Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-antalya/",    label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-santorini/",  label: "Santorini Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-lissabon/",   label: "Lissabon Urlaubsführer" },
                { href: "/urlaubsguides/",                         label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
