import type { Metadata } from "next";
import MarktplatzHome from "@/components/marktplatz/MarktplatzHome";

export const metadata: Metadata = {
  title: "Touren, Aktivitäten & Erlebnisse buchen | Urlaubfinder365 Marktplatz",
  description:
    "Touren, Stadtführungen, Wassersport & Erlebnisse direkt bei lokalen Anbietern buchen. Gratis stornierbar, sofortige Bestätigung, faire Preise.",
  alternates: { canonical: "https://www.urlaubfinder365.de/marktplatz/" },
  openGraph: {
    title: "Touren, Aktivitäten & Erlebnisse | Urlaubfinder365 Marktplatz",
    description: "Unvergessliche Erlebnisse direkt bei lokalen Guides & Anbietern buchen.",
    url: "https://www.urlaubfinder365.de/marktplatz/",
    type: "website",
  },
};

export default function MarktplatzPage() {
  return <MarktplatzHome />;
}
