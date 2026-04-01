import type { Metadata } from "next";
import AntalyaGuide from "@/components/guides/AntalyaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-antalya/`;

export const metadata: Metadata = {
  title: "Antalya Reiseführer 2026 – Tipps, Sehenswürdigkeiten & praktische Infos",
  description:
    "Antalya Reiseführer 2026: Sehenswürdigkeiten, Strände, Geheimtipps, Essen & Trinken, Viertel-Guide und Notfallkontakte für deinen Türkei-Urlaub.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Antalya Reiseführer 2026 – Dein kompletter Türkei-Urlaubs-Guide",
    description: "Alles über Antalya: Top-Sehenswürdigkeiten, Strände, Viertel, Geheimtipps, Reisezeit & Buchung – der umfassendste Antalya-Guide.",
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: "Antalya Türkei – Reiseführer 2026",
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
      "about": { "@type": "TouristDestination", "name": "Antalya", "containedInPlace": { "@type": "Country", "name": "Türkei" } },
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
