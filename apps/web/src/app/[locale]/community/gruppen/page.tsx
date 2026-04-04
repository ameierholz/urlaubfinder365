import type { Metadata } from "next";
import GruppenClient from "./gruppenclient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "👥 Urlaubsgruppen – Gleichgesinnte finden & vernetzen",
  description: "Urlaubsgruppen bei Urlaubfinder365: Gleichgesinnte Reisende finden ✓ Nach Interessen filtern ✓ Gemeinsam planen ✓ Kostenlos beitreten.",
  keywords: ["Urlaubsgruppen", "Reisende finden", "Gemeinsam verreisen", "Urlaubsgruppe beitreten", "Urlaubspartner finden", "Gruppenreise"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/gruppen/" },
  openGraph: {
    title: "👥 Urlaubsgruppen – vernetzen & reisen | Urlaubfinder365",
    description: "Urlaubsgruppen bei Urlaubfinder365: Gleichgesinnte Reisende finden ✓ Nach Interessen filtern ✓ Gemeinsam planen ✓ Kostenlos beitreten.",
    url: "https://www.urlaubfinder365.de/community/gruppen/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Community", item: "https://www.urlaubfinder365.de/community/" },
    { "@type": "ListItem", position: 3, name: "Urlaubsgruppen", item: "https://www.urlaubfinder365.de/community/gruppen/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GruppenClient />
    </>
  );
}
