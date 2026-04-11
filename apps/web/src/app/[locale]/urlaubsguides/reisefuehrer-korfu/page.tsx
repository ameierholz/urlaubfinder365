import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-korfu/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🌿 Korfu Urlaubsführer ${YEAR} – Altstadt, Strände & Tipps`,
  description: `Korfu Urlaubsführer ${YEAR}: UNESCO-Altstadt, Paleokastritsa, Achilleion & Geheimtipps ✓ Das grüne Juwel der Ionischen Inseln komplett erklärt.`,
  keywords: ["Korfu Urlaubsführer", "Korfu Tipps", "Korfu Strände", "Korfu Altstadt", "Korfu Urlaub", "Ionische Inseln Guide", "Korfu Geheimtipps", "Paleokastritsa"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🌿 Korfu Urlaubsführer ${YEAR} – Ionische Inseln Guide | Urlaubfinder365`,
    description: `Korfu Urlaubsführer ${YEAR}: UNESCO-Altstadt, Strände & Geheimtipps ✓ Das grüne Juwel der Ionischen Inseln komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Korfu Griechenland – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Korfu Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Korfu Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Korfu Urlaubsführer: UNESCO-Altstadt, Paleokastritsa, Achilleion, Essen & Trinken und praktische Infos.",
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
        name: "Korfu",
        description: "Grüne Ionische Insel mit venezianischem Erbe, UNESCO-geschützter Altstadt und kristallklaren Buchten.",
        containedInPlace: { "@type": "Country", name: "Griechenland" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("korfu")!;
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.korfu} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Korfu – Grüne Ionische Insel",
                description: "Pauschalreisen & All-Inclusive auf Korfu zum Bestpreis vergleichen.",
                href: "/urlaubsziele/korfu/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-kreta/",      label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-rhodos/",     label: "Rhodos Urlaubsführer" },
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
