import type { Metadata } from "next";
import CommunityPageClient from "./CommunityPageClient";

export const metadata: Metadata = {
  title: "Reise-Community – Berichte, Gruppen & Reisetipps | Urlaubfinder365",
  description:
    "Lies echte Reiseberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden. Kostenlos mitmachen – Urlaubfinder365 Community.",
  alternates: { canonical: "https://www.urlaubfinder365.de/community/" },
  openGraph: {
    title: "Reise-Community – Berichte, Gruppen & Reisetipps | Urlaubfinder365",
    description:
      "Lies echte Reiseberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden.",
    url: "https://www.urlaubfinder365.de/community/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Urlaubfinder365 Reise-Community",
      },
    ],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Reise-Community – Berichte, Gruppen & Reisetipps",
    description:
      "Lies echte Reiseberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden.",
    url: "https://www.urlaubfinder365.de/community/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Community",  item: "https://www.urlaubfinder365.de/community/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Urlaubfinder365 Community",
    url: "https://www.urlaubfinder365.de/community/",
    description: "Reise-Community für Reiseberichte, Gruppen und Reisetipps",
    sameAs: ["https://www.urlaubfinder365.de/"],
  },
];

export default function CommunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CommunityPageClient />
    </>
  );
}
