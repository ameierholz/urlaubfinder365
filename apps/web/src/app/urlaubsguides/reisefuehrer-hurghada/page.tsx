import type { Metadata } from "next";
import HurghadaGuide from "@/components/guides/HurghadaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-hurghada/`;

export const metadata: Metadata = {
  title: "Hurghada Reiseführer 2026 – Tipps, Strände & praktische Infos",
  description:
    "Hurghada Reiseführer 2026: Rotes Meer, Schnorcheln, Wüstensafaris, All-Inclusive-Hotels und praktische Infos für deinen Ägypten-Urlaub.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Hurghada Reiseführer 2026 – Dein kompletter Ägypten-Guide",
    description:
      "Alles über Hurghada: Strände, Tauchen, Wüste, Geheimtipps & Buchung.",
    url: CANONICAL,
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Hurghada Ägypten – Reiseführer 2026",
      },
    ],
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
        { "@type": "ListItem", position: 3, name: "Hurghada Reiseführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Hurghada Reiseführer – Tipps, Strände & praktische Infos",
      url: CANONICAL,
      about: {
        "@type": "TouristDestination",
        name: "Hurghada",
        containedInPlace: { "@type": "Country", name: "Ägypten" },
      },
    },
  ],
};

export default function HurghadaGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <HurghadaGuide />
        </div>
        <aside className="hidden xl:block w-46.5 shrink-0 sticky top-28">
          <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
        </aside>
      </div>
    </>
  );
}
