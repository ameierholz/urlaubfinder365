import type { Metadata } from "next";
import GruppenClient from "./gruppenclient";

export const metadata: Metadata = {
  title: "👥 Reisegruppen – Gleichgesinnte finden & vernetzen",
  description: "Reisegruppen bei Urlaubfinder365: Gleichgesinnte Reisende finden ✓ Nach Interessen filtern ✓ Gemeinsam planen ✓ Kostenlos beitreten.",
  keywords: ["Reisegruppen", "Reisende finden", "Gemeinsam verreisen", "Reisegruppe beitreten", "Reisepartner finden", "Gruppenreise"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/gruppen/" },
  openGraph: {
    title: "👥 Reisegruppen – vernetzen & reisen | Urlaubfinder365",
    description: "Reisegruppen bei Urlaubfinder365: Gleichgesinnte Reisende finden ✓ Nach Interessen filtern ✓ Gemeinsam planen ✓ Kostenlos beitreten.",
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
    { "@type": "ListItem", position: 3, name: "Reisegruppen", item: "https://www.urlaubfinder365.de/community/gruppen/" },
  ],
};

export default function GruppenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GruppenClient />
    </>
  );
}
