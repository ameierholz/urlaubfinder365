import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ReisezeitFinderClient from "@/components/tools/reisezeit-finder-client";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Reisezeit-Finder ${YEAR} – Wann wohin reisen?`,
  description: `Kostenloser Reisezeit-Finder ${YEAR}: Finde die beste Reisezeit für dein Wunschziel. Wann wohin reisen? Mit Klimadaten für 15 Top-Reiseziele.`,
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/reisezeit-finder/" },
  openGraph: {
    title: `Reisezeit-Finder ${YEAR} – Wann wohin reisen?`,
    description: `Welche Reiseziele passen zu deinem Wunschmonat und deinen Interessen? Kostenloser Reisezeit-Finder mit Klimadaten & Budget-Filter.`,
    url: "https://www.urlaubfinder365.de/extras/reisezeit-finder/",
    type: "website",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Reisezeit-Finder ${YEAR}`,
  url: "https://www.urlaubfinder365.de/extras/reisezeit-finder/",
  description: `Finde die beste Reisezeit für dein Wunschziel ${YEAR}. Wann wohin reisen? Kostenloser Reisezeit-Finder mit Klimadaten für 15 Top-Destinationen.`,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default async function ReisezeitFinderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <main className="min-h-screen bg-gray-950 text-white">
        {/* Hero */}
        <section className="bg-linear-to-b from-gray-900 to-gray-950 border-b border-gray-800 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#1db682]/10 text-[#1db682] border border-[#1db682]/30 rounded-full px-4 py-1.5 text-sm mb-4">
              Kostenloser Urlaubs-Tool
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              Reisezeit-Finder <span className="text-[#1db682]">{YEAR}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Wann wohin reisen? Finde die perfekten Reiseziele für deinen Wunschmonat und deine Interessen.
            </p>
          </div>
        </section>

        <ReisezeitFinderClient />
      </main>
    </>
  );
}
