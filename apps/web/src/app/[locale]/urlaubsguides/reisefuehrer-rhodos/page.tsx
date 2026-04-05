import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-rhodos/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1664118145742-f2ad1c09c10b?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🏰 Rhodos Urlaubsführer ${YEAR} – Altstadt, Strände & Tipps`,
  description: `Rhodos Urlaubsführer ${YEAR}: Mittelalterliche Altstadt, Lindos, Traumstrände & Geheimtipps ✓ Die Sonneninsel Griechenlands komplett erklärt.`,
  keywords: ["Rhodos Urlaubsführer", "Rhodos Tipps", "Rhodos Strände", "Rhodos Altstadt", "Rhodos Urlaub", "Griechenland Guide", "Rhodos Geheimtipps", "Lindos"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏰 Rhodos Urlaubsführer ${YEAR} – Griechenland Guide | Urlaubfinder365`,
    description: `Rhodos Urlaubsführer ${YEAR}: Altstadt, Lindos, Strände & Geheimtipps ✓ Die Sonneninsel Griechenlands komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Rhodos Griechenland – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Rhodos Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Rhodos Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Rhodos Urlaubsführer: Altstadt, Lindos, Butterfly Valley, Essen & Trinken und praktische Infos.",
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
        name: "Rhodos",
        description: "Griechische Insel in der Ägäis mit mittelalterlicher Altstadt, Lindos und langen Sandstränden.",
        containedInPlace: { "@type": "Country", name: "Griechenland" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("rhodos")!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.rhodos} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Rhodos – Günstig nach Griechenland",
                description: "Pauschalreisen & All-Inclusive nach Rhodos zum Bestpreis vergleichen.",
                href: "/urlaubsziele/rhodos/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-kreta/",      label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-korfu/",      label: "Korfu Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-santorini/",  label: "Santorini Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-antalya/",    label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/",                         label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
