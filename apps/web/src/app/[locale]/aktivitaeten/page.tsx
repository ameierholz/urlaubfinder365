import type { Metadata } from "next";
import { Suspense } from "react";
import MarktplatzHome from "@/components/marktplatz/MarktplatzHome";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import SponsoredAnbieter from "@/components/marktplatz/SponsoredAnbieter";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Aktivitäten, Touren & Erlebnisse buchen | Urlaubfinder365",
  description:
    "Touren, Stadtführungen, Wassersport & Erlebnisse direkt bei lokalen Anbietern buchen. Gratis stornierbar, sofortige Bestätigung, faire Preise.",
  alternates: { canonical: "https://www.urlaubfinder365.de/aktivitaeten/" },
  openGraph: {
    title: "Aktivitäten, Touren & Erlebnisse | Urlaubfinder365",
    description: "Unvergessliche Erlebnisse direkt bei lokalen Guides & Anbietern buchen.",
    url: "https://www.urlaubfinder365.de/aktivitaeten/",
    type: "website",
  },
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <MarktplatzHome
      sidebar={
        <div className="space-y-4">
          <Suspense fallback={null}>
            <SponsoredAngebote
              context={{ type: "homepage" }}
              variant="sidebar"
              maxItems={6}
            />
          </Suspense>
          <Suspense fallback={null}>
            <SponsoredAnbieter />
          </Suspense>
        </div>
      }
    />
  );
}
