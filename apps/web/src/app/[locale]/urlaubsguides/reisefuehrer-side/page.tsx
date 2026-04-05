import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-side/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1561712815-883650f32f92?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🏛 Side Urlaubsführer ${YEAR} – Apollon-Tempel, Strände & Tipps`,
  description: `Side Urlaubsführer ${YEAR}: Apollon-Tempel, antikes Theater, Sandstrände & Geheimtipps ✓ Türkische Riviera zwischen Antike und All-Inclusive komplett erklärt.`,
  keywords: ["Side Urlaubsführer", "Side Tipps", "Side Strände", "Apollon Tempel Side", "Side Urlaub", "Türkei Guide", "Side Geheimtipps", "Side Antike"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏛 Side Urlaubsführer ${YEAR} – Türkei Guide | Urlaubfinder365`,
    description: `Side Urlaubsführer ${YEAR}: Apollon-Tempel, Strände & Geheimtipps ✓ Türkische Riviera zwischen Antike und All-Inclusive.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Side Türkei – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Side Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Side Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Side Urlaubsführer: Apollon-Tempel, antikes Theater, Strände, Essen & Trinken und praktische Infos.",
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
        name: "Side",
        description: "Antike Hafenstadt an der türkischen Riviera mit Apollon-Tempel, römischem Theater und feinen Sandstränden.",
        containedInPlace: { "@type": "Country", name: "Türkei" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("side")!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.side} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Side – All Inclusive Türkei",
                description: "Pauschalreisen & All-Inclusive in Side zum Bestpreis vergleichen.",
                href: "/urlaubsziele/side/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-antalya/",  label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-alanya/",   label: "Alanya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-kreta/",    label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-rhodos/",   label: "Rhodos Urlaubsführer" },
                { href: "/urlaubsguides/",                       label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
