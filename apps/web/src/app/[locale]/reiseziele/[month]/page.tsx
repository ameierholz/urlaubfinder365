import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { SEASON_GUIDES, getSeasonGuide } from "@/lib/season-guide-data";
import { getDestinationBySlug } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import { getAlternateUrls } from "@/i18n/routing";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import DestinationCarousel from "@/components/ui/DestinationCarousel";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";

interface Props {
  params: Promise<{ month: string; locale: string }>;
}

export function generateStaticParams() {
  return SEASON_GUIDES.map((g) => ({ month: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const guide = getSeasonGuide(month);
  if (!guide) return {};
  const canonical = `${BASE_URL}/reiseziele/${guide.slug}/`;
  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    alternates: { canonical, languages: getAlternateUrls(`/reiseziele/${guide.slug}/`) },
    openGraph: {
      title: guide.seoTitle,
      description: guide.seoDescription,
      url: canonical,
      type: "article",
      images: [{ url: guide.heroImage, width: 1920, height: 1080, alt: guide.headline }],
    },
  };
}

export const revalidate = 86400;

function priceHintBadge(hint: "günstig" | "mittel" | "teuer") {
  const colors = {
    "günstig": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "mittel":  "bg-amber-50 text-amber-700 border-amber-200",
    "teuer":   "bg-rose-50 text-rose-700 border-rose-200",
  };
  return colors[hint];
}

function destHasPage(slug: string): boolean {
  return !!(getDestinationBySlug(slug) || CATALOG.find((e) => e.slug === slug));
}

export default async function MonthGuidePage({ params }: Props) {
  const { month, locale } = await params;
  setRequestLocale(locale);
  const guide = getSeasonGuide(month);
  if (!guide) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",  item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Reiseziele",  item: `${BASE_URL}/urlaubsziele/` },
      { "@type": "ListItem", position: 3, name: guide.headline, item: `${BASE_URL}/reiseziele/${guide.slug}/` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.headline,
    itemListElement: guide.destinations.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: destHasPage(d.slug) ? `${BASE_URL}/urlaubsziele/${d.slug}/` : undefined,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[460px] flex items-end">
        <Image
          src={guide.heroImage}
          alt={guide.headline}
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
            <Link href="/urlaubsziele/" className="hover:text-white">Reiseziele</Link>
            <span>/</span>
            <span className="text-white/90">{guide.month}</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-[#1db682]/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            {guide.emoji} {guide.month}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {guide.headline}
          </h1>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            {guide.lead}
          </p>
        </div>
      </div>

      {/* WETTER-INTRO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6">
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Wetter-Überblick</p>
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">Klima im {guide.month}</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{guide.weatherSummary}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Buchungs-Tipp</p>
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">Wann &amp; wie buchen?</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{guide.bookingTip}</p>
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <p className="text-sky-600 text-sm font-bold uppercase tracking-widest mb-2">Top-Auswahl</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Die {guide.destinations.length} besten Reiseziele im {guide.month}
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">
          Unsere handverlesenen Empfehlungen mit Wetterdaten und Preis-Einschätzung.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guide.destinations.map((d, i) => {
            const hasPage = destHasPage(d.slug);
            const Inner = (
              <div className="bg-white border border-gray-200 hover:border-[#1db682] rounded-2xl p-5 transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">#{i + 1} · {d.country}</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1db682] transition-colors">{d.name}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${priceHintBadge(d.priceHint)}`}>
                    {d.priceHint}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{d.reason}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1">🌡️ {d.tempAir}</span>
                  {d.tempWater && d.tempWater !== "—" && (
                    <span className="flex items-center gap-1">🌊 {d.tempWater}</span>
                  )}
                  {hasPage && (
                    <span className="ml-auto text-[#1db682] font-semibold group-hover:underline">Zum Reiseziel →</span>
                  )}
                </div>
              </div>
            );
            return hasPage ? (
              <Link key={d.slug + i} href={`/urlaubsziele/${d.slug}/`} className="group block">
                {Inner}
              </Link>
            ) : (
              <div key={d.slug + i}>{Inner}</div>
            );
          })}
        </div>
      </div>

      {/* MONTHS NAV */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Andere Monate entdecken</h2>
        <div className="flex flex-wrap gap-2">
          {SEASON_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/reiseziele/${g.slug}/`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                g.slug === guide.slug
                  ? "bg-[#1db682] text-white border-[#1db682]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#1db682] hover:text-[#1db682]"
              }`}
            >
              <span>{g.emoji}</span>
              Reiseziele im {g.month}
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen zum {guide.month}</h2>
          <ThemeFAQAccordion items={guide.faqs.map((f) => ({ q: f.question, a: f.answer }))} accentColor="#1db682" />
        </div>
      </div>

      {/* CTAs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linear-to-br from-[#1db682] to-[#16a070] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{guide.month}-Reise direkt vergleichen</h2>
            <p className="text-white/85 text-sm">Finde tagesaktuelle Angebote für alle {guide.destinations.length} Top-Ziele.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/guenstig-urlaub-buchen/" className="bg-white text-[#1db682] font-semibold px-6 py-3 rounded-full hover:bg-white/95 transition-colors">
              Angebote vergleichen →
            </Link>
            <Link href="/last-minute/" className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-full transition-colors border border-white/30">
              Last Minute
            </Link>
          </div>
        </div>
      </div>

      <DestinationCarousel title="Alle Urlaubsziele entdecken" />
    </div>
  );
}
