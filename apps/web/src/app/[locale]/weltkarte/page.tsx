import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { loadAllMarkers } from "@/lib/map/load-markers";
import WeltkartePageClient from "@/components/map/WeltkartePageClient";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "🗺️ Weltkarte – 270+ Urlaubsziele entdecken | Urlaubfinder365",
  description: "Interaktive Weltkarte mit über 270 Urlaubszielen, Insider-Tipps der Community, Reiseberichten und Anbietern. Filter nach Land, Klima und Preis – jetzt entdecken.",
  keywords: ["Weltkarte Urlaubsziele", "Reise Karte", "Urlaubsziele weltweit", "interaktive Reisekarte"],
  alternates: { canonical: `${BASE_URL}/weltkarte/` },
  openGraph: {
    title: "🗺️ Weltkarte – Alle Urlaubsziele auf einen Blick",
    description: "Über 270 Urlaubsziele, Tipps der Community, Reiseberichte und Anbieter auf einer interaktiven Karte. Jetzt entdecken.",
    url: `${BASE_URL}/weltkarte/`,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Weltkarte – Alle Urlaubsziele",
  url: `${BASE_URL}/weltkarte/`,
  description: "Interaktive Weltkarte mit Urlaubszielen, Tipps und Reiseberichten",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Weltkarte",  item: `${BASE_URL}/weltkarte/` },
    ],
  },
};

export const revalidate = 600; // ISR alle 10 Min für die Marker-Daten

export default async function WeltkartePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const markers = await loadAllMarkers();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <WeltkartePageClient
        markers={markers}
        center={[30, 10]}
        zoom={3}
        height="calc(100vh - 64px)"
      />
    </>
  );
}
