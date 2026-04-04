import type { Metadata } from "next";
import UrlaubsroutenClient from "./UrlaubsroutenClient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "🗺 Urlaubsrouten – Routen planen, teilen & klonen",
  description: "Urlaubsrouten planen & teilen ✓ Beliebte Routen anderer Reisender klonen ✓ Tagesplanung & Sehenswürdigkeiten ✓ Kostenlos nutzen.",
  keywords: ["Urlaubsrouten planen", "Urlaubsroute erstellen", "Route teilen", "Urlaubsplaner", "Urlaubsroute", "Routenplaner Urlaub"],
  alternates: { canonical: "https://www.urlaubfinder365.de/reiserouten/" },
  openGraph: {
    title: "🗺 Urlaubsrouten planen & teilen | Urlaubfinder365",
    description: "Urlaubsrouten planen & teilen ✓ Beliebte Routen anderer Reisender klonen ✓ Tagesplanung & Sehenswürdigkeiten ✓ Kostenlos nutzen.",
    url: "https://www.urlaubfinder365.de/reiserouten/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Urlaubsrouten – Inspiration & Planung",
    description: "Entdecke Urlaubsrouten anderer Urlauber und klone sie mit einem Klick für deine eigene Planung.",
    url: "https://www.urlaubfinder365.de/reiserouten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Community",      item: "https://www.urlaubfinder365.de/community/" },
      { "@type": "ListItem", position: 3, name: "Urlaubsrouten",    item: "https://www.urlaubfinder365.de/reiserouten/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UrlaubsroutenClient />
    </>
  );
}
