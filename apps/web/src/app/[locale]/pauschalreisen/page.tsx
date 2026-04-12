import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { PAUSCHAL_KOMBIS } from "@/lib/pauschalreisen-kombi-data";
import { getAlternateUrls } from "@/i18n/routing";
import { FlagImage } from "@/components/ui/flag-image";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();
const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: `Pauschalreisen ${YEAR} nach Ländern & Budget – alle Angebote`,
  description: `Pauschalreisen ${YEAR} nach Land, Preis oder Verpflegung ✓ Türkei, Ägypten, Spanien ✓ All Inclusive ✓ Unter 500€ ✓ Last Minute ✓ Alle Kombinationen.`,
  alternates: {
    canonical: `${BASE_URL}/pauschalreisen/`,
    languages: getAlternateUrls("/pauschalreisen/"),
  },
  openGraph: {
    title: `Pauschalreisen ${YEAR} nach Ländern & Budget – alle Angebote`,
    description: `Pauschalreisen ${YEAR} nach Land, Preis oder Verpflegung ✓ Türkei, Ägypten, Spanien ✓ All Inclusive ✓ Unter 500€.`,
    url: `${BASE_URL}/pauschalreisen/`,
    type: "website",
  },
};

export const revalidate = 3600;

export default async function PauschalreisenIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Pauschalreisen", item: `${BASE_URL}/pauschalreisen/` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[400px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format"
          alt="Pauschalreisen nach Ländern"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/90">Pauschalreisen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-sky-600/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            ✈️ Pauschalreisen Übersicht
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Pauschalreisen {YEAR}<br />
            <span className="text-sky-200">nach Ländern, Budget &amp; Stil</span>
          </h1>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            Finde die passende Pauschalreise – sortiert nach Land, Budget, All-Inclusive oder Last Minute.
            Alle Angebote tagesaktuell und direkt buchbar.
          </p>
        </div>
      </div>

      {/* KOMBI GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Alle Pauschalreisen-Kategorien</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">
          Klicke auf ein Land oder eine Kategorie, um tagesaktuelle Angebote, Klimadaten und Tipps zu entdecken.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAUSCHAL_KOMBIS.map((k) => (
            <Link
              key={k.slug}
              href={`/pauschalreisen/${k.slug}/`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[5/3]">
                <Image
                  src={k.heroImage}
                  alt={k.h1}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <FlagImage emoji={k.flag} name={k.country} size="lg" />
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {k.h1.replace(/ \d{4}.*/, "").replace(/ – .*/, "")}
                  </h3>
                  <p className="text-white/80 text-xs mt-1 line-clamp-2">{k.lead}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Pauschalreisen – Vorteile auf einen Blick</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Pauschalreisen sind seit Jahrzehnten die beliebteste Urlaubsform der Deutschen – und das aus gutem Grund:
          Flug, Hotel und Transfer in einem Preis, umfassender EU-Verbraucherschutz und oft deutlich günstiger als
          Einzelbuchungen. Besonders bei beliebten Reisezielen wie der Türkei, Ägypten und Spanien profitieren Pauschalurlauber
          von exklusiven Konditionen der großen Veranstalter.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Kombinationsseiten zeigen dir die besten Angebote für jede Kategorie:
          länderspezifische Pauschalreisen, All-Inclusive-Deals, Budget-Reisen unter 500 € und Last-Minute-Schnäppchen.
          Alle Angebote werden tagesaktuell aktualisiert und sind direkt online buchbar.
        </p>
      </div>
    </div>
  );
}
