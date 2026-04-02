import type { Metadata } from "next";
import HurghadaGuide from "@/components/guides/HurghadaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-hurghada/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🤿 Hurghada Reiseführer ${YEAR} – Rotes Meer & Tipps`,
  description: `Hurghada Reiseführer ${YEAR}: Schnorcheln, Tauchen, Wüstensafari & Geheimtipps ✓ Dein kompletter Ägypten-Urlaubs-Guide am Roten Meer.`,
  keywords: ["Hurghada Reiseführer", "Hurghada Tipps", "Hurghada Tauchen", "Hurghada Sehenswürdigkeiten", "Ägypten Urlaub", "Rotes Meer", "Hurghada Geheimtipps", "Hurghada Guide"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🤿 Hurghada Reiseführer ${YEAR} – Ägypten Guide | Urlaubfinder365`,
    description: `Hurghada Reiseführer ${YEAR}: Schnorcheln, Tauchen, Wüstensafari & Geheimtipps ✓ Dein kompletter Ägypten-Urlaubs-Guide am Roten Meer.`,
    url: CANONICAL,
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: `Hurghada Ägypten – Reiseführer ${YEAR}`,
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
      description: "Dein umfassender Hurghada Reiseführer: Rotes Meer, Schnorcheln, Wüstensafaris, Hotels und praktische Infos.",
      url: CANONICAL,
      datePublished: "2026-04-01",
      dateModified: "2026-04-02",
      author: { "@type": "Organization", name: "Urlaubfinder365" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/header_logo.webp` },
      },
      image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop&q=80",
      about: {
        "@type": "TouristDestination",
        name: "Hurghada",
        description: "Beliebter Badeort am Roten Meer mit erstklassigen Tauch- und Schnorchelrevieren und ganzjährigem Sonnenschein.",
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
