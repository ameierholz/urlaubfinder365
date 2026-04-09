import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import UrlaubskostenRechnerClient from "@/components/tools/urlaubskosten-rechner-client";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Urlaubskosten-Rechner ${YEAR} – Was kostet dein Urlaub?`,
  description: `Kostenloser Urlaubskosten-Rechner ${YEAR}: Berechne Flug, Hotel, Verpflegung und Nebenkosten für deinen Traumurlaub. Jetzt Urlaubsbudget planen!`,
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/urlaubskosten-rechner/" },
  openGraph: {
    title: `Urlaubskosten-Rechner ${YEAR} – Was kostet dein Urlaub wirklich?`,
    description: `Flug + Hotel + Verpflegung + Nebenkosten – alles auf einen Blick. Kostenloser Urlaubskosten-Rechner von Urlaubfinder365.`,
    url: "https://www.urlaubfinder365.de/extras/urlaubskosten-rechner/",
    type: "website",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `Urlaubskosten-Rechner ${YEAR}`,
  url: "https://www.urlaubfinder365.de/extras/urlaubskosten-rechner/",
  description: `Kostenloser Urlaubskosten-Rechner: Berechne Flug, Hotel, Verpflegung und Nebenkosten für deinen Urlaub ${YEAR}.`,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default async function UrlaubskostenRechnerPage({
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
            <div className="inline-flex items-center gap-2 bg-teal-900/30 text-teal-400 border border-teal-800/50 rounded-full px-4 py-1.5 text-sm mb-4">
              Kostenloser Urlaubs-Tool
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              Urlaubskosten-Rechner <span className="text-[#1db682]">{YEAR}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Was kostet dein Traumurlaub wirklich? Flug, Hotel, Verpflegung und Nebenkosten auf einen Blick.
            </p>
          </div>
        </section>

        <UrlaubskostenRechnerClient />
      </main>
    </>
  );
}
