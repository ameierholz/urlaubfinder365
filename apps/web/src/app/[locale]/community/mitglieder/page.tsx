import type { Metadata } from "next";
import MitgliederClient from "./mitgliederclient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "👤 Community-Mitglieder – Reisende entdecken",
  description: "Entdecke aktive Mitglieder der Urlaubfinder365 Community ✓ Profile ansehen ✓ Reiseerfahrung teilen ✓ Neue Kontakte knüpfen.",
  keywords: ["Community Mitglieder", "Reisende entdecken", "Reise Community", "Reisende Profile", "Urlaubfinder Community"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/mitglieder/" },
  openGraph: {
    title: "👤 Community-Mitglieder | Urlaubfinder365",
    description: "Entdecke aktive Mitglieder der Urlaubfinder365 Community ✓ Profile ansehen ✓ Reiseerfahrung teilen ✓ Neue Kontakte knüpfen.",
    url: "https://www.urlaubfinder365.de/community/mitglieder/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Community", item: "https://www.urlaubfinder365.de/community/" },
    { "@type": "ListItem", position: 3, name: "Mitglieder", item: "https://www.urlaubfinder365.de/community/mitglieder/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MitgliederClient />
    </>
  );
}
