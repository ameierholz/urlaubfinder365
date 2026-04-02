import type { Metadata } from "next";
import { Suspense } from "react";
import MarktplatzHome from "@/components/marktplatz/MarktplatzHome";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";

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
  return (
    <>
      {/* Gesponserte Angebote — Homepage-Plätze (oben, vor dem organischen Feed) */}
      <Suspense fallback={null}>
        <SponsoredAngebote context={{ type: "homepage" }} position="oben" maxItems={4} />
      </Suspense>

      <MarktplatzHome />
    </>
  );
}
