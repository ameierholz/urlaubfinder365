import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AktivitaetenDiscovery from "@/components/tiqets/AktivitaetenDiscovery";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Erlebnisse, Touren & Tickets weltweit buchen | Urlaubfinder365",
  description:
    "Entdecke die besten Aktivitäten, Sehenswürdigkeiten & Touren an 40+ Urlaubszielen weltweit. ✓ Sofortbuchung ✓ Gratis Storno ✓ Faire Preise. Jetzt Tickets sichern!",
  alternates: { canonical: `${BASE_URL}/erlebnisse/` },
  openGraph: {
    title: "Erlebnisse & Touren weltweit | Urlaubfinder365",
    description:
      "Top-bewertete Touren, Eintrittskarten & Aktivitäten an deinem Urlaubsziel buchen.",
    url: `${BASE_URL}/erlebnisse/`,
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Erlebnisse", item: `${BASE_URL}/erlebnisse/` },
  ],
};

export default async function ErlebnissePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <div className="bg-linear-to-br from-[#00838F] to-[#004F5A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-sm font-bold text-[#6CC4BA] uppercase tracking-widest mb-2">
            Erlebnisse & Touren
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            Unvergessliche Erlebnisse<br />
            <span className="text-[#6CC4BA]">an deinem Urlaubsziel</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Entdecke Top-bewertete Touren, Eintrittskarten und Aktivitäten in
            über 40 Städten weltweit. Sofort buchbar, gratis stornierbar.
          </p>
        </div>
      </div>

      {/* Discovery Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AktivitaetenDiscovery />
      </div>
    </>
  );
}
