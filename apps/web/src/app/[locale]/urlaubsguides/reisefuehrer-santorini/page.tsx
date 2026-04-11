import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-santorini/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1618478669118-1b3eb2b2bb95?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🌅 Santorini Urlaubsführer ${YEAR} – Oia, Vulkan & Tipps`,
  description: `Santorini Urlaubsführer ${YEAR}: Oia Sonnenuntergang, Caldera, Vulkanstrände & Geheimtipps ✓ Die romantischste Insel Griechenlands komplett erklärt.`,
  keywords: ["Santorini Urlaubsführer", "Santorini Tipps", "Santorini Sehenswürdigkeiten", "Oia", "Santorini Urlaub", "Kykladen Guide", "Santorini Geheimtipps", "Caldera"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🌅 Santorini Urlaubsführer ${YEAR} – Kykladen Guide | Urlaubfinder365`,
    description: `Santorini Urlaubsführer ${YEAR}: Oia, Caldera & Geheimtipps ✓ Die romantischste Insel Griechenlands komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Santorini Griechenland – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Santorini Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Santorini Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Santorini Urlaubsführer: Oia, Fira, Caldera, Vulkanstrände, Wein & praktische Infos.",
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
        name: "Santorini",
        description: "Vulkanische Kykladeninsel in der Ägäis mit ikonischen blau-weißen Häusern und spektakulärem Caldera-Blick.",
        containedInPlace: { "@type": "Country", name: "Griechenland" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("santorini")!;
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.santorini} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Santorini – Romantik in Griechenland",
                description: "Pauschalreisen & Romantikurlaub auf Santorini zum Bestpreis vergleichen.",
                href: "/urlaubsziele/santorini/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-rhodos/",    label: "Rhodos Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-kreta/",     label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-korfu/",     label: "Korfu Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-dubai/",     label: "Dubai Urlaubsführer" },
                { href: "/urlaubsguides/",                        label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
