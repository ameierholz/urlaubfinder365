import type { Metadata } from "next";
import BarcelonaGuide from "@/components/guides/BarcelonaGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-barcelona/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🏙 Barcelona Urlaubsführer ${YEAR} – Gaudí, Strand & Tapas`,
  description: `Barcelona Urlaubsführer ${YEAR}: Sagrada Família, Park Güell, Tapas, Nightlife & Insidertipps ✓ Dein kompletter Barcelona-Stadtguide.`,
  keywords: ["Barcelona Urlaubsführer", "Barcelona Tipps", "Barcelona Sehenswürdigkeiten", "Sagrada Familia", "Barcelona Urlaub", "Barcelona Guide", "Barcelona Geheimtipps", "Park Güell"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏙 Barcelona Urlaubsführer ${YEAR} – Stadtguide | Urlaubfinder365`,
    description: `Barcelona Urlaubsführer ${YEAR}: Sagrada Família, Park Güell, Tapas, Nightlife & Insidertipps ✓ Dein kompletter Barcelona-Stadtguide.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: `Barcelona Spanien – Urlaubsführer ${YEAR}`,
    }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Startseite", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Urlaubsguides", "item": `${BASE_URL}/urlaubsguides/` },
        { "@type": "ListItem", "position": 3, "name": "Barcelona Urlaubsführer", "item": CANONICAL },
      ],
    },
    {
      "@type": "Article",
      "headline": "Barcelona Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      "description": "Dein umfassender Barcelona Urlaubsführer: Sagrada Família, Gaudí, Strände, Tapas, Nachtleben und praktische Infos.",
      "url": CANONICAL,
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-02",
      "author": { "@type": "Organization", "name": "Urlaubfinder365" },
      "publisher": {
        "@type": "Organization",
        "name": "Urlaubfinder365",
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}/images/header_logo.webp` },
      },
      "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=630&fit=crop&q=80",
      "about": {
        "@type": "TouristDestination",
        "name": "Barcelona",
        "description": "Katalanische Metropole am Mittelmeer mit Gaudís Meisterwerken, lebhaften Ramblas und goldenem Stadtstrand.",
        "containedInPlace": { "@type": "Country", "name": "Spanien" },
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
          <BarcelonaGuide />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub buchen",
                title: "Barcelona – Günstig nach Spanien",
                description: "Pauschalreisen & City-Trips nach Barcelona zum Bestpreis vergleichen.",
                href: "/urlaubsziele/barcelona/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-antalya/",   label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-mallorca/",  label: "Mallorca Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-kreta/",     label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-hurghada/",  label: "Hurghada Urlaubsführer" },
                { href: "/urlaubsguides/",                        label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
