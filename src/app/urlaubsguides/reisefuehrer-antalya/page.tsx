import type { Metadata } from "next";
import AntalyaGuide from "@/components/guides/AntalyaGuide";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-antalya/`;

export const metadata: Metadata = {
  title: "Antalya Reiseführer – Tipps, Sehenswürdigkeiten & praktische Infos",
  description:
    "Antalya Reiseführer: Sehenswürdigkeiten, Tagesplanung, Geheimtipps, Essen & Trinken, Sprachhilfe und Notfallkontakte für deinen Türkei-Urlaub.",
  alternates: { canonical: CANONICAL },
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
      <AntalyaGuide />
    </>
  );
}
