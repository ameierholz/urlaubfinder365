import type { Metadata } from "next";
import TravelBuddiesClient from "./TravelBuddiesClient";

export const metadata: Metadata = {
  title: "Travel Buddies – Reisepartner finden | Urlaubfinder365",
  description: "Finde Gleichgesinnte für deine nächste Reise. Verbinde dich mit anderen Reisenden, die ähnliche Ziele und Reisestile haben.",
  alternates: { canonical: "https://www.urlaubfinder365.de/travel-buddies/" },
  openGraph: {
    title: "Travel Buddies – Reisepartner finden | Urlaubfinder365",
    description: "Finde Gleichgesinnte für deine nächste Reise. Verbinde dich mit anderen Reisenden, die ähnliche Ziele und Reisestile haben.",
    url: "https://www.urlaubfinder365.de/travel-buddies/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Travel Buddies – Reisepartner finden",
    description: "Finde Gleichgesinnte für deine nächste Reise.",
    url: "https://www.urlaubfinder365.de/travel-buddies/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",      item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Community",        item: "https://www.urlaubfinder365.de/community/" },
      { "@type": "ListItem", position: 3, name: "Travel Buddies",   item: "https://www.urlaubfinder365.de/travel-buddies/" },
    ],
  },
];

export default function TravelBuddiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TravelBuddiesClient />
    </>
  );
}
