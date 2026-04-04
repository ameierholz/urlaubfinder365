import type { Metadata } from "next";
import KretaGuide from "@/components/guides/KretaGuide";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

const BASE_URL = "https://www.urlaubfinder365.de";
const CANONICAL = `${BASE_URL}/urlaubsguides/reisefuehrer-kreta/`;
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🏛 Kreta Urlaubsführer ${YEAR} – Strände, Tipps & Kultur`,
  description: `Kreta Urlaubsführer ${YEAR}: Samaria-Schlucht, Knossos, Traumstrände & Geheimtipps ✓ Griechenlands größte Insel komplett erklärt.`,
  keywords: ["Kreta Urlaubsführer", "Kreta Tipps", "Kreta Strände", "Kreta Sehenswürdigkeiten", "Kreta Urlaub", "Griechenland Urlaubsführer", "Kreta Geheimtipps", "Samaria Schlucht"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `🏛 Kreta Urlaubsführer ${YEAR} – Griechenland Guide | Urlaubfinder365`,
    description: `Kreta Urlaubsführer ${YEAR}: Samaria-Schlucht, Knossos, Traumstrände & Geheimtipps ✓ Griechenlands größte Insel komplett erklärt.`,
    url: CANONICAL,
    type: "article",
    images: [{
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=630&fit=crop&q=80",
      width: 1200, height: 630, alt: `Kreta Griechenland – Urlaubsführer ${YEAR}`,
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
        { "@type": "ListItem", position: 3, name: "Kreta Urlaubsführer", item: CANONICAL },
      ],
    },
    {
      "@type": "Article",
      headline: "Kreta Urlaubsführer – Tipps, Sehenswürdigkeiten & praktische Infos",
      description: "Dein umfassender Kreta Urlaubsführer: Strände, Samaria-Schlucht, Chania, Essen & Trinken und praktische Infos.",
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

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="xl:flex xl:items-start xl:gap-6 max-w-400 mx-auto px-2 sm:px-4 my-8">
        <div className="flex-1 min-w-0">
          <KretaGuide />
        </div>
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub buchen",
                title: "Kreta – Günstig nach Griechenland",
                description: "Pauschalreisen & All-Inclusive nach Kreta zum Bestpreis vergleichen.",
                href: "/urlaubsziele/kreta/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📚 Weitere Guides"
              seoLinks={[
                { href: "/urlaubsguides/reisefuehrer-antalya/",   label: "Antalya Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-mallorca/",  label: "Mallorca Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-hurghada/",  label: "Hurghada Urlaubsführer" },
                { href: "/urlaubsguides/reisefuehrer-barcelona/", label: "Barcelona Urlaubsführer" },
                { href: "/urlaubsguides/",                        label: "Alle Guides →" },
              ]}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
