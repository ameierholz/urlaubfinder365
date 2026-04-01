import type { Metadata } from "next";
import MallorcaGuide from "@/components/guides/MallorcaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-mallorca/`;

export const metadata: Metadata = {
  title: "Mallorca Reiseführer 2026 – Tipps, Sehenswürdigkeiten & praktische Infos",
  description:
    "Mallorca Reiseführer 2026: Strände, Sehenswürdigkeiten, Serra de Tramuntana, Essen & Trinken, Viertel-Guide und praktische Infos für deinen Balearen-Urlaub.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Mallorca Reiseführer 2026 – Dein kompletter Balearen-Guide",
    description: "Alles über Mallorca: Strände, Tramuntana, Palma, Geheimtipps, Reisezeit & Buchung – der umfassendste Mallorca-Guide.",
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&h=630&fit=crop&q=80",
      width: 1200,
      height: 630,
      alt: "Mallorca Spanien – Reiseführer 2026",
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
        { "@type": "ListItem", position: 3, name: "Mallorca Reiseführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Mallorca Reiseführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Mallorca Reiseführer.",
      url: CANONICAL,
      about: { "@type": "TouristDestination", name: "Mallorca", containedInPlace: { "@type": "Country", name: "Spanien" } },
    },
  ],
};

export default function MallorcaGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <MallorcaGuide />
        </div>
        <aside className="hidden xl:block w-46.5 shrink-0 sticky top-28">
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </aside>
      </div>
    </>
  );
}
