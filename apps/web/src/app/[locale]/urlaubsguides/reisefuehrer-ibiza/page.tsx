import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-ibiza/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1689859870434-8248d5a113c1?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🌅 Ibiza Urlaubsführer ${YEAR} – Strände, Kultur & Tipps`,
  description: `Ibiza Urlaubsführer ${YEAR}: Strände, Altstadt Dalt Vila, Cala d'Hort & Geheimtipps ✓ Die Balearenhochburg Spaniens komplett erklärt.`,
  keywords: ["Ibiza Urlaubsführer", "Ibiza Tipps", "Ibiza Strände", "Ibiza Sehenswürdigkeiten", "Ibiza Urlaub", "Balearen Guide", "Ibiza Geheimtipps", "Dalt Vila"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🌅 Ibiza Urlaubsführer ${YEAR} – Balearen Guide | Urlaubfinder365`,
    description: `Ibiza Urlaubsführer ${YEAR}: Strände, Dalt Vila & Geheimtipps ✓ Die Balearenhochburg Spaniens komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Ibiza Spanien – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Ibiza Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Ibiza Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Ibiza Urlaubsführer: Strände, Dalt Vila, Hippie-Märkte, Essen & Trinken und praktische Infos.",
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
        name: "Ibiza",
        description: "Baleareninsel im Mittelmeer mit türkisfarbenen Buchten, UNESCO-Altstadt und lebhaftem Nachtleben.",
        containedInPlace: { "@type": "Country", name: "Spanien" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("ibiza")!;
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.ibiza} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Ibiza – Günstig in die Balearen",
                description: "Pauschalreisen & Strandurlaub auf Ibiza zum Bestpreis vergleichen.",
                href: "/urlaubsziele/ibiza/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-mallorca/",   label: "Mallorca Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-teneriffa/",  label: "Teneriffa Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-barcelona/",  label: "Barcelona Urlaubsführer" },
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
