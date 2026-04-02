import type { Metadata } from "next";
import ReiseroutenClient from "./ReiseroutenClient";

export const metadata: Metadata = {
  title: "🗺 Reiserouten – Routen planen, teilen & klonen",
  description: "Reiserouten planen & teilen ✓ Beliebte Routen anderer Reisender klonen ✓ Tagesplanung & Sehenswürdigkeiten ✓ Kostenlos nutzen.",
  keywords: ["Reiserouten planen", "Reiseroute erstellen", "Route teilen", "Reiseplaner", "Urlaubsroute", "Routenplaner Urlaub"],
  alternates: { canonical: "https://www.urlaubfinder365.de/reiserouten/" },
  openGraph: {
    title: "🗺 Reiserouten planen & teilen | Urlaubfinder365",
    description: "Reiserouten planen & teilen ✓ Beliebte Routen anderer Reisender klonen ✓ Tagesplanung & Sehenswürdigkeiten ✓ Kostenlos nutzen.",
    url: "https://www.urlaubfinder365.de/reiserouten/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Reiserouten – Inspiration & Planung",
    description: "Entdecke Reiserouten anderer Urlauber und klone sie mit einem Klick für deine eigene Planung.",
    url: "https://www.urlaubfinder365.de/reiserouten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Community",      item: "https://www.urlaubfinder365.de/community/" },
      { "@type": "ListItem", position: 3, name: "Reiserouten",    item: "https://www.urlaubfinder365.de/reiserouten/" },
    ],
  },
];

export default function ReiseroutenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReiseroutenClient />
    </>
  );
}
