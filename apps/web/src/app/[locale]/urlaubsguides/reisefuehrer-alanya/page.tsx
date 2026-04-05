import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-alanya/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1589556264800-08ae9e129a8e?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🏰 Alanya Urlaubsführer ${YEAR} – Roter Turm, Strände & Tipps`,
  description: `Alanya Urlaubsführer ${YEAR}: Cleopatra Beach, Roter Turm, Damlataş-Höhle & Geheimtipps ✓ All-Inclusive-Perle der türkischen Riviera komplett erklärt.`,
  keywords: ["Alanya Urlaubsführer", "Alanya Tipps", "Alanya Strände", "Cleopatra Beach", "Alanya Urlaub", "Türkei Guide", "Alanya Geheimtipps", "Roter Turm Alanya"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏰 Alanya Urlaubsführer ${YEAR} – Türkei Guide | Urlaubfinder365`,
    description: `Alanya Urlaubsführer ${YEAR}: Cleopatra Beach, Roter Turm & Geheimtipps ✓ All-Inclusive-Perle der Riviera komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Alanya Türkei – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Alanya Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Alanya Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Alanya Urlaubsführer: Cleopatra Beach, Roter Turm, Damlataş-Höhle, Essen & Trinken und praktische Infos.",
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
        name: "Alanya",
        description: "Beliebtestes All-Inclusive-Ziel an der türkischen Riviera mit Cleopatra Beach und historischem Burgfelsen.",
        containedInPlace: { "@type": "Country", name: "Türkei" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("alanya")!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData.alanya} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Alanya – All Inclusive Türkei",
                description: "Pauschalreisen & All-Inclusive in Alanya zum Bestpreis vergleichen.",
                href: "/urlaubsziele/alanya/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-antalya/",  label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-side/",     label: "Side Urlaubsführer" },
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
