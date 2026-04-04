import type { Metadata } from "next";
import AntalyaGuide from "@/components/guides/AntalyaGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-antalya/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `☀ Antalya Urlaubsführer ${YEAR} – Tipps & Sehenswürdigkeiten`,
  description: `Antalya Urlaubsführer ${YEAR}: Top-Sehenswürdigkeiten, Strände, Geheimtipps, Essen & Trinken, Viertel-Guide ✓ Dein kompletter Türkei-Urlaubs-Guide.`,
  keywords: ["Antalya Urlaubsführer", "Antalya Tipps", "Antalya Sehenswürdigkeiten", "Antalya Strände", "Antalya Urlaub", "Türkei Urlaubsführer", "Antalya Geheimtipps", "Antalya Guide"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `☀ Antalya Urlaubsführer ${YEAR} – Türkei Guide | Urlaubfinder365`,
    description: `Antalya Urlaubsführer ${YEAR}: Top-Sehenswürdigkeiten, Strände, Geheimtipps, Essen & Trinken, Viertel-Guide ✓ Dein kompletter Türkei-Urlaubs-Guide.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: `Antalya Türkei – Urlaubsführer ${YEAR}`,
    }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Startseite",    "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Urlaubsguides", "item": `${BASE_URL}/urlaubsguides/` },
        { "@type": "ListItem", "position": 3, "name": "Antalya Urlaubsführer", "item": CANONICAL },
      ],
    },
    {
      "@type": "Article",
      "headline": "Antalya Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      "description": "Dein umfassender Antalya Urlaubsführer: Sehenswürdigkeiten, Tagesplanung, Geheimtipps, Essen & Trinken, Sprachhilfe und Notfallkontakte.",
      "url": CANONICAL,
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-02",
      "author": { "@type": "Organization", "name": "Urlaubfinder365" },
      "publisher": {
        "@type": "Organization",
        "name": "Urlaubfinder365",
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}/images/header_logo.webp` },
      },
      "image": "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1200&h=630&fit=crop&q=80",
      "about": {
        "@type": "TouristDestination",
        "name": "Antalya",
        "description": "Beliebtes Urlaubsziel an der türkischen Riviera mit antiken Ruinen, traumhaften Stränden und mediterranem Flair.",
        "containedInPlace": { "@type": "Country", "name": "Türkei" },
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
          <AntalyaGuide />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub buchen",
                title: "Antalya – Günstig in die Türkei",
                description: "Pauschalreisen & All-Inclusive nach Antalya zum Bestpreis vergleichen.",
                href: "/urlaubsziele/antalya/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-mallorca/",  label: "Mallorca Urlaubsführer" },
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
