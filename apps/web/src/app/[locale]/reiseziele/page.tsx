import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { SEASON_GUIDES } from "@/lib/season-guide-data";
import { getAlternateUrls } from "@/i18n/routing";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();
const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: `Beste Reiseziele nach Monat ${YEAR} – Saisonale Empfehlungen`,
  description: `Finde die besten Reiseziele für jeden Monat ${YEAR} ✓ Wetter ✓ Preise ✓ Tipps für Januar bis Dezember ✓ Optimale Reisezeit für dein Urlaubsziel.`,
  alternates: {
    canonical: `${BASE_URL}/reiseziele/`,
    languages: getAlternateUrls("/reiseziele/"),
  },
  openGraph: {
    title: `Beste Reiseziele nach Monat ${YEAR} – Saisonale Empfehlungen`,
    description: `Finde die besten Reiseziele für jeden Monat ${YEAR} ✓ Wetter ✓ Preise ✓ Tipps für Januar bis Dezember.`,
    url: `${BASE_URL}/reiseziele/`,
    type: "website",
  },
};

export const revalidate = 86400;

export default async function ReisezieleIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",  item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Reiseziele nach Monat", item: `${BASE_URL}/reiseziele/` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[420px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80&auto=format"
          alt="Beste Reiseziele für jeden Monat"
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
            <span className="text-white/90">Reiseziele nach Monat</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-[#1db682]/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🗓️ Saisonaler Reiseführer
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Beste Reiseziele {YEAR}<br />
            <span className="text-emerald-200">Monat für Monat</span>
          </h1>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            Wann ist die beste Reisezeit? Wo ist es warm? Unsere 12 saisonalen Guides verraten dir
            für jeden Monat die perfekten Ziele – inkl. Wetter, Preisen und Tipps.
          </p>
        </div>
      </div>

      {/* MONTHS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Alle 12 Monate im Überblick</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">
          Klicke auf einen Monat, um die Top-Reiseziele, Klimadaten und Buchungstipps zu entdecken.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SEASON_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/reiseziele/${g.slug}/`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-[#1db682] hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={g.heroImage}
                  alt={g.headline}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-2xl mb-1">{g.emoji}</span>
                  <h3 className="text-lg font-bold text-white leading-tight">{g.month}</h3>
                  <p className="text-white/75 text-xs mt-1 line-clamp-2">{g.lead}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">So findest du die perfekte Reisezeit</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die beste Reisezeit hängt von mehreren Faktoren ab: Wetter, Preise, Menschenmassen und deine persönlichen Vorlieben.
          Unsere saisonalen Reiseführer zeigen dir für jeden Monat die besten Ziele mit detaillierten Klimadaten,
          Preis-Einschätzungen und konkreten Empfehlungen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          <strong className="text-gray-800">Nebensaison-Tipp:</strong> Wer flexibel ist, spart bares Geld. Reisen außerhalb der
          Schulferien sind oft 30-50 % günstiger – bei vergleichbarem Wetter und deutlich weniger Touristen.
          Besonders empfehlenswert sind die Monate Mai, September und Oktober für Mittelmeer-Reisen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          <strong className="text-gray-800">Ganzjahres-Ziele:</strong> Die Kanarischen Inseln (Teneriffa, Gran Canaria, Fuerteventura)
          bieten das ganze Jahr über mildes Klima mit 20-25 °C – ideal für Winter-Sonnenhungrige und Sommer-Entflüchter.
        </p>
      </div>
    </div>
  );
}
