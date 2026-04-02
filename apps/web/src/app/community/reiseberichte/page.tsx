import type { Metadata } from "next";
import ReiseberichteClient from "./reiseberichteclient";

export const metadata: Metadata = {
  title: "📝 Reiseberichte – echte Erfahrungen von Urlaubern",
  description: "Echte Reiseberichte & Urlaubserfahrungen lesen ✓ Bewertungen ✓ Hotelberichte ✓ Insidertipps von Reisenden ✓ Jetzt Community beitreten.",
  keywords: ["Reiseberichte", "Urlaubserfahrungen", "Hotelberichte", "Reisebewertungen", "Urlauber Erfahrungen", "Reiseblog", "Urlaub Erfahrungsbericht"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/reiseberichte/" },
  openGraph: {
    title: "📝 Reiseberichte – echte Erfahrungen | Urlaubfinder365",
    description: "Echte Reiseberichte & Urlaubserfahrungen lesen ✓ Bewertungen ✓ Hotelberichte ✓ Insidertipps von Reisenden ✓ Jetzt Community beitreten.",
    url: "https://www.urlaubfinder365.de/community/reiseberichte/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Community", item: "https://www.urlaubfinder365.de/community/" },
    { "@type": "ListItem", position: 3, name: "Reiseberichte", item: "https://www.urlaubfinder365.de/community/reiseberichte/" },
  ],
};

export default function ReiseberichtePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReiseberichteClient />
    </>
  );
}
