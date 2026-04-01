import type { Metadata } from "next";
import KretaGuide from "@/components/guides/KretaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-kreta/`;

export const metadata: Metadata = {
  title: "Kreta Reiseführer 2026 – Tipps, Sehenswürdigkeiten & praktische Infos",
  description: "Kreta Reiseführer 2026: Strände, Sehenswürdigkeiten, Samaria-Schlucht, Essen & Trinken und praktische Infos für deinen Griechenland-Urlaub.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Kreta Reiseführer 2026 – Dein kompletter Griechenland-Guide",
    description: "Alles über Kreta: Strände, Schluchten, Chania, Geheimtipps, Reisezeit & Buchung.",
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop&q=80",
      width: 1200, height: 630, alt: "Kreta Griechenland – Reiseführer 2026",
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
        { "@type": "ListItem", position: 3, name: "Kreta Reiseführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Kreta Reiseführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Kreta Reiseführer.",
      url: CANONICAL,
      about: { "@type": "TouristDestination", name: "Kreta", containedInPlace: { "@type": "Country", name: "Griechenland" } },
    },
  ],
};

export default function KretaGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <KretaGuide />
        </div>
        <aside className="hidden xl:block w-46.5 shrink-0 sticky top-28">
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </aside>
      </div>
    </>
  );
}
