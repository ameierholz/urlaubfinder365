import type { Metadata } from "next";
import HurghadaGuide from "@/components/guides/HurghadaGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-hurghada/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🤿 Hurghada Urlaubsführer ${YEAR} – Rotes Meer & Tipps`,
  description: `Hurghada Urlaubsführer ${YEAR}: Schnorcheln, Tauchen, Wüstensafari & Geheimtipps ✓ Dein kompletter Ägypten-Urlaubs-Guide am Roten Meer.`,
  keywords: ["Hurghada Urlaubsführer", "Hurghada Tipps", "Hurghada Tauchen", "Hurghada Sehenswürdigkeiten", "Ägypten Urlaub", "Rotes Meer", "Hurghada Geheimtipps", "Hurghada Guide"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🤿 Hurghada Urlaubsführer ${YEAR} – Ägypten Guide | Urlaubfinder365`,
    description: `Hurghada Urlaubsführer ${YEAR}: Schnorcheln, Tauchen, Wüstensafari & Geheimtipps ✓ Dein kompletter Ägypten-Urlaubs-Guide am Roten Meer.`,
    url: CANONICAL,
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: `Hurghada Ägypten – Urlaubsführer ${YEAR}`,
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
        { "@type": "ListItem", position: 3, name: "Hurghada Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Hurghada Urlaubsführer – Tipps, Strände & praktische Infos",
      description: "Dein umfassender Hurghada Urlaubsführer: Rotes Meer, Schnorcheln, Wüstensafaris, Hotels und praktische Infos.",
      url: CANONICAL,
      datePublished: "2026-04-01",
      dateModified: "2026-04-02",
      author: { "@type": "Organization", name: "Urlaubfinder365" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/header_logo.webp` },
      },
      image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop&q=80&auto=format",
      about: {
        "@type": "TouristDestination",
        name: "Hurghada",
        description: "Beliebter Badeort am Roten Meer mit erstklassigen Tauch- und Schnorchelrevieren und ganzjährigem Sonnenschein.",
        containedInPlace: { "@type": "Country", name: "Ägypten" },
      },
    },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <HurghadaGuide />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub buchen",
                title: "Hurghada – Günstig nach Ägypten",
                description: "Pauschalreisen & All-Inclusive nach Hurghada zum Bestpreis vergleichen.",
                href: "/urlaubsziele/hurghada/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-dubai/",     label: "Dubai Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-kreta/",     label: "Kreta Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-antalya/",   label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-santorini/", label: "Santorini Urlaubsführer" },
                { href: "/urlaubsguides/",                        label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
