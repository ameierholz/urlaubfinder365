import type { Metadata } from "next";
import UrlaubsberichteClient from "./reiseberichteclient";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
export const metadata: Metadata = {
  title: "📝 Urlaubsberichte – echte Erfahrungen von Urlaubern",
  description: "Echte Urlaubsberichte & Urlaubserfahrungen lesen ✓ Bewertungen ✓ Hotelberichte ✓ Insidertipps von Reisenden ✓ Jetzt Community beitreten.",
  keywords: ["Urlaubsberichte", "Urlaubserfahrungen", "Hotelberichte", "Reisebewertungen", "Urlauber Erfahrungen", "Urlaubsblog", "Urlaub Erfahrungsbericht"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/reiseberichte/" },
  openGraph: {
    title: "📝 Urlaubsberichte – echte Erfahrungen | Urlaubfinder365",
    description: "Echte Urlaubsberichte & Urlaubserfahrungen lesen ✓ Bewertungen ✓ Hotelberichte ✓ Insidertipps von Reisenden ✓ Jetzt Community beitreten.",
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
    { "@type": "ListItem", position: 3, name: "Urlaubsberichte", item: "https://www.urlaubfinder365.de/community/reiseberichte/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={jsonLd} />
      <UrlaubsberichteClient />
    </>
  );
}
