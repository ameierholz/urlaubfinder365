import type { Metadata } from "next";
import KreuzfahrtenContent from "@/components/cruise/KreuzfahrtenContent";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
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
  const t = await getTranslations("kreuzfahrtenPage");
  return (
    <>
      <JsonLd data={jsonLd} />
      <KreuzfahrtenContent
        sidebar={
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=400&h=200&q=70",
              eyebrow: t("sidebarEyebrow"),
              title: t("sidebarTitle"),
              description: t("sidebarDesc"),
              href: "/kreuzfahrten/",
              ctaLabel: t("sidebarCta"),
              accentColor: "bg-cyan-700",
            }}
            seoLinksTitle={t("seoLinksTitle")}
            seoLinks={[
              { href: "/urlaubsziele/griechenland/",    label: t("seoLinkMittelmeer") },
              { href: "/urlaubsziele/kanaren/",         label: t("seoLinkKanaren") },
              { href: "/urlaubsziele/skandinavien/",    label: t("seoLinkNorwegen") },
              { href: "/urlaubsziele/karibik/",         label: t("seoLinkKaribik") },
              { href: "/urlaubsarten/pauschalreisen/",  label: t("seoLinkPauschal") },
            ]}
          />
        }
      />
    </>
  );
}
