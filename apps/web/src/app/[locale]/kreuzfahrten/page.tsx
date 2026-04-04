import type { Metadata } from "next";
import KreuzfahrtenContent from "@/components/cruise/KreuzfahrtenContent";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear();
  const next = year + 1;
  return {
    title: `🚢 Kreuzfahrten günstig buchen ${year}/${next}`,
    description: `Kreuzfahrten ${year}/${next} günstig buchen ✓ AIDA, TUI Cruises & MSC ✓ Mittelmeer, Karibik & Nordeuropa ✓ 30+ Reedereien vergleichen.`,
    keywords: ["Kreuzfahrten günstig buchen", "Kreuzfahrt Mittelmeer", "AIDA Kreuzfahrt", "TUI Cruises", "MSC Kreuzfahrt", "Flusskreuzfahrt", "Kreuzfahrt Karibik", "Kreuzfahrt Angebote", "Billige Kreuzfahrten"],
    alternates: { canonical: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    openGraph: {
      title: `🚢 Kreuzfahrten günstig buchen ${year}/${next} | Urlaubfinder365`,
      description: `Kreuzfahrten ${year}/${next} günstig buchen ✓ AIDA, TUI Cruises & MSC ✓ Mittelmeer, Karibik & Nordeuropa ✓ 30+ Reedereien vergleichen.`,
      url: "https://www.urlaubfinder365.de/kreuzfahrten/",
      type: "website",
    },
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kreuzfahrten günstig buchen",
    description: "Kreuzfahrten günstig buchen – Hochsee & Flussfahrten, Karibik & Mittelmeer, 30+ Reedereien.",
    url: "https://www.urlaubfinder365.de/kreuzfahrten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Kreuzfahrten",  item: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KreuzfahrtenContent
        sidebar={
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=400&h=200&q=70",
              eyebrow: "Kreuzfahrt buchen",
              title: "30+ Reedereien vergleichen",
              description: "AIDA, TUI Cruises & MSC – jetzt günstige Kreuzfahrten finden.",
              href: "/kreuzfahrten/",
              ctaLabel: "Jetzt buchen →",
              accentColor: "bg-cyan-700",
            }}
            seoLinksTitle="🌊 Kreuzfahrt-Routen"
            seoLinks={[
              { href: "/urlaubsziele/griechenland/",    label: "Mittelmeer-Kreuzfahrt" },
              { href: "/urlaubsziele/kanaren/",         label: "Kanaren-Kreuzfahrt" },
              { href: "/urlaubsziele/skandinavien/",    label: "Norwegen & Fjorde" },
              { href: "/urlaubsziele/karibik/",         label: "Karibik-Kreuzfahrt" },
              { href: "/urlaubsarten/pauschalreisen/",  label: "Pauschalreisen" },
            ]}
          />
        }
      />
    </>
  );
}
