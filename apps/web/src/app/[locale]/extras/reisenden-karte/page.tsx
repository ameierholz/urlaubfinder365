import type { Metadata } from "next";
import TravelMapClient from "@/components/reisenden-karte/TravelMapClient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "🗺 Reisenden-Karte – wo unsere Community unterwegs ist",
  description: "Interaktive Reisenden-Karte: Entdecke wo die Urlaubfinder365 Community gerade unterwegs ist ✓ Erlebnisse ansehen ✓ Urlaubsziele entdecken.",
  keywords: ["Reisenden-Karte", "Reise Weltkarte", "Interaktive Karte", "Community Karte", "Urlaubsziele Karte"],
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/reisenden-karte/" },
  openGraph: {
    title: "🗺 Reisenden-Karte | Urlaubfinder365",
    description: "Interaktive Reisenden-Karte: Entdecke wo die Urlaubfinder365 Community gerade unterwegs ist ✓ Erlebnisse ansehen ✓ Urlaubsziele entdecken.",
    url: "https://www.urlaubfinder365.de/extras/reisenden-karte/",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Extras", item: "https://www.urlaubfinder365.de/extras/" },
    { "@type": "ListItem", position: 3, name: "Reisenden-Karte", item: "https://www.urlaubfinder365.de/extras/reisenden-karte/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TravelMapClient />
    </>
  );
}
