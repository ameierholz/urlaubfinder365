import type { Metadata } from "next";
import GenericGuide from "@/components/guides/GenericGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { guideData } from "@/lib/guide-data";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-gran-canaria/`;
const YEAR = new Date().getFullYear();
const OG_IMAGE = "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=1200&h=630&fit=crop&q=80";

export const metadata: Metadata = {
  title: `🏜 Gran Canaria Urlaubsführer ${YEAR} – Dünen, Strände & Tipps`,
  description: `Gran Canaria Urlaubsführer ${YEAR}: Maspalomas-Dünen, Las Palmas, Roque Nublo & Geheimtipps ✓ Der Kontinent im Kleinen komplett erklärt.`,
  keywords: ["Gran Canaria Urlaubsführer", "Gran Canaria Tipps", "Maspalomas Dünen", "Gran Canaria Strände", "Gran Canaria Urlaub", "Kanaren Guide", "Las Palmas", "Gran Canaria Geheimtipps"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏜 Gran Canaria Urlaubsführer ${YEAR} – Kanaren Guide | Urlaubfinder365`,
    description: `Gran Canaria Urlaubsführer ${YEAR}: Maspalomas-Dünen, Las Palmas & Geheimtipps ✓ Der Kontinent im Kleinen komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Gran Canaria Spanien – Urlaubsführer ${YEAR}` }],
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
        { "@type": "ListItem", position: 3, name: "Gran Canaria Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Gran Canaria Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Gran Canaria Urlaubsführer: Maspalomas, Las Palmas, Roque Nublo, Essen & Trinken und praktische Infos.",
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
        name: "Gran Canaria",
        description: "Kanarische Insel mit spektakulären Dünen, vielfältiger Landschaft und ganzjährigem Strandwetter.",
        containedInPlace: { "@type": "Country", name: "Spanien" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dest = getDestinationBySlug("gran-canaria")!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <GenericGuide dest={dest} content={guideData["gran-canaria"]} />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: OG_IMAGE,
                eyebrow: "Urlaub buchen",
                title: "Gran Canaria – Ganzjährig Sonne",
                description: "Pauschalreisen & All-Inclusive auf Gran Canaria zum Bestpreis vergleichen.",
                href: "/urlaubsziele/gran-canaria/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-teneriffa/",  label: "Teneriffa Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-ibiza/",      label: "Ibiza Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-mallorca/",   label: "Mallorca Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-barcelona/",  label: "Barcelona Urlaubsführer" },
                { href: "/urlaubsguides/",                         label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
