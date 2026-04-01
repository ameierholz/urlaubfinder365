import type { Metadata } from "next";
import BarcelonaGuide from "@/components/guides/BarcelonaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-barcelona/`;

export const metadata: Metadata = {
  title: "Barcelona Reiseführer 2026 – Tipps, Sehenswürdigkeiten & praktische Infos",
  description: "Barcelona Reiseführer 2026: Sagrada Família, Strände, Gaudí, Tapas & Nachtleben – dein kompletter Barcelona-Guide.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Barcelona Reiseführer 2026 – Dein kompletter Städtereise-Guide",
    description: "Alles über Barcelona: Gaudí, Ramblas, Strände, Geheimtipps & Buchung.",
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: "Barcelona Spanien – Reiseführer 2026",
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
        { "@type": "ListItem", "position": 3, "name": "Barcelona Reiseführer", "item": CANONICAL },
      ],
    },
    {
      "@type": "Article",
      "headline": "Barcelona Reiseführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      "url": CANONICAL,
      "about": { "@type": "TouristDestination", "name": "Barcelona", "containedInPlace": { "@type": "Country", "name": "Spanien" } },
    },
  ],
};

export default function BarcelonaGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <BarcelonaGuide />
        </div>
        <aside className="hidden xl:block w-46.5 shrink-0 sticky top-28">
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </aside>
      </div>
    </>
  );
}
