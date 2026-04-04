import type { Metadata } from "next";
import MallorcaGuide from "@/components/guides/MallorcaGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-mallorca/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🏖 Mallorca Urlaubsführer ${YEAR} – Strände, Tipps & mehr`,
  description: `Mallorca Urlaubsführer ${YEAR}: Traumstrände, Serra de Tramuntana, Palma, Nightlife & Geheimtipps ✓ Dein kompletter Mallorca-Guide.`,
  keywords: ["Mallorca Urlaubsführer", "Mallorca Tipps", "Mallorca Strände", "Mallorca Sehenswürdigkeiten", "Mallorca Urlaub", "Palma de Mallorca", "Mallorca Geheimtipps", "Mallorca Guide"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏖 Mallorca Urlaubsführer ${YEAR} – Balearen Guide | Urlaubfinder365`,
    description: `Mallorca Urlaubsführer ${YEAR}: Traumstrände, Serra de Tramuntana, Palma, Nightlife & Geheimtipps ✓ Dein kompletter Mallorca-Guide.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: `Mallorca Spanien – Urlaubsführer ${YEAR}`,
    }],
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
        { "@type": "ListItem", position: 3, name: "Mallorca Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Mallorca Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Mallorca Urlaubsführer: Strände, Serra de Tramuntana, Palma, Essen & Trinken und praktische Infos.",
      url: CANONICAL,
      datePublished: "2026-04-01",
      dateModified: "2026-04-02",
      author: { "@type": "Organization", name: "Urlaubfinder365" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/header_logo.webp` },
      },
      image: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&h=630&fit=crop&q=80",
      about: {
        "@type": "TouristDestination",
        name: "Mallorca",
        description: "Größte Baleareninsel mit traumhaften Buchten, dem Tramuntana-Gebirge und der lebendigen Hauptstadt Palma.",
        containedInPlace: { "@type": "Country", name: "Spanien" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <MallorcaGuide />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub buchen",
                title: "Mallorca – Günstig auf die Insel",
                description: "Pauschalreisen & All-Inclusive nach Mallorca zum Bestpreis vergleichen.",
                href: "/urlaubsziele/mallorca/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-antalya/",   label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-kreta/",     label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-hurghada/",  label: "Hurghada Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-barcelona/", label: "Barcelona Urlaubsführer" },
                { href: "/urlaubsguides/",                        label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
