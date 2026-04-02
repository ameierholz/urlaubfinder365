import type { Metadata } from "next";
import AntalyaGuide from "@/components/guides/AntalyaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-antalya/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `☀ Antalya Reiseführer ${YEAR} – Tipps & Sehenswürdigkeiten`,
  description: `Antalya Reiseführer ${YEAR}: Top-Sehenswürdigkeiten, Strände, Geheimtipps, Essen & Trinken, Viertel-Guide ✓ Dein kompletter Türkei-Urlaubs-Guide.`,
  keywords: ["Antalya Reiseführer", "Antalya Tipps", "Antalya Sehenswürdigkeiten", "Antalya Strände", "Antalya Urlaub", "Türkei Reiseführer", "Antalya Geheimtipps", "Antalya Guide"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `☀ Antalya Reiseführer ${YEAR} – Türkei Guide | Urlaubfinder365`,
    description: `Antalya Reiseführer ${YEAR}: Top-Sehenswürdigkeiten, Strände, Geheimtipps, Essen & Trinken, Viertel-Guide ✓ Dein kompletter Türkei-Urlaubs-Guide.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: `Antalya Türkei – Reiseführer ${YEAR}`,
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
        { "@type": "ListItem", "position": 3, "name": "Antalya Reiseführer", "item": CANONICAL },
      ],
    },
    {
      "@type": "Article",
      "headline": "Antalya Reiseführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      "description": "Dein umfassender Antalya Reiseführer: Sehenswürdigkeiten, Tagesplanung, Geheimtipps, Essen & Trinken, Sprachhilfe und Notfallkontakte.",
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
        "description": "Beliebtes Reiseziel an der türkischen Riviera mit antiken Ruinen, traumhaften Stränden und mediterranem Flair.",
        "containedInPlace": { "@type": "Country", "name": "Türkei" },
      },
    },
  ],
};

export default function AntalyaGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <AntalyaGuide />
        </div>
        <aside className="hidden xl:block w-46.5 shrink-0 sticky top-28">
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </aside>
      </div>
    </>
  );
}
