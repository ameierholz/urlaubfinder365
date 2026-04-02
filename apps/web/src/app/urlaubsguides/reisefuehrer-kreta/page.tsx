import type { Metadata } from "next";
import KretaGuide from "@/components/guides/KretaGuide";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-kreta/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🏛 Kreta Reiseführer ${YEAR} – Strände, Tipps & Kultur`,
  description: `Kreta Reiseführer ${YEAR}: Samaria-Schlucht, Knossos, Traumstrände & Geheimtipps ✓ Griechenlands größte Insel komplett erklärt.`,
  keywords: ["Kreta Reiseführer", "Kreta Tipps", "Kreta Strände", "Kreta Sehenswürdigkeiten", "Kreta Urlaub", "Griechenland Reiseführer", "Kreta Geheimtipps", "Samaria Schlucht"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏛 Kreta Reiseführer ${YEAR} – Griechenland Guide | Urlaubfinder365`,
    description: `Kreta Reiseführer ${YEAR}: Samaria-Schlucht, Knossos, Traumstrände & Geheimtipps ✓ Griechenlands größte Insel komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop&q=80",
      width: 1200, height: 630, alt: `Kreta Griechenland – Reiseführer ${YEAR}`,
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
      description: "Dein umfassender Kreta Reiseführer: Strände, Samaria-Schlucht, Chania, Essen & Trinken und praktische Infos.",
      url: CANONICAL,
      datePublished: "2026-04-01",
      dateModified: "2026-04-02",
      author: { "@type": "Organization", name: "Urlaubfinder365" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/header_logo.webp` },
      },
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop&q=80",
      about: {
        "@type": "TouristDestination",
        name: "Kreta",
        description: "Größte griechische Insel mit der Samaria-Schlucht, venezianischen Häfen und kilometerlangen Sandstränden.",
        containedInPlace: { "@type": "Country", name: "Griechenland" },
      },
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
