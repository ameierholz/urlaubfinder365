import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-teneriffa/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=630&fit=crop&q=80&auto=format";

export const metadata: Metadata = {
  title: `🌋 Teneriffa Urlaubsführer ${YEAR} – Teide, Strände & Tipps`,
  description: `Teneriffa Urlaubsführer ${YEAR}: Teide-Nationalpark, Playa de las Américas, Masca-Schlucht & Geheimtipps ✓ Die größte Kanarische Insel komplett erklärt.`,
  keywords: ["Teneriffa Urlaubsführer", "Teneriffa Tipps", "Teneriffa Strände", "Teneriffa Sehenswürdigkeiten", "Teneriffa Urlaub", "Kanaren Urlaubsführer", "Teneriffa Geheimtipps", "Teide Nationalpark"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🌋 Teneriffa Urlaubsführer ${YEAR} – Kanaren Guide | Urlaubfinder365`,
    description: `Teneriffa Urlaubsführer ${YEAR}: Teide-Nationalpark, Strände & Geheimtipps ✓ Die größte Kanarische Insel komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Teneriffa – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Teneriffa Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Teneriffa Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Teneriffa Urlaubsführer: Teide, Strände, Masca-Schlucht, Essen & Trinken und praktische Infos.",
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
        name: "Teneriffa",
        description: "Die größte Kanarische Insel mit dem Teide-Vulkan, Sandstränden und ganzjährigem Frühlingswetter.",
        containedInPlace: { "@type": "Country", name: "Spanien" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("teneriffa")!;
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.teneriffa} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Teneriffa – Günstig in die Kanaren",
                description: "Pauschalreisen & All-Inclusive nach Teneriffa zum Bestpreis vergleichen.",
                href: "/urlaubsziele/teneriffa/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-gran-canaria/", label: "Gran Canaria Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-ibiza/",        label: "Ibiza Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-mallorca/",     label: "Mallorca Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-barcelona/",    label: "Barcelona Urlaubsführer" },
                { href: "/urlaubsguides/",                           label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
