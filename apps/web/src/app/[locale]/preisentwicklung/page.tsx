import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import PreisentwicklungClient from "@/components/preisentwicklung/PreisentwicklungClient";
import PriceComparisonTable from "@/components/preisentwicklung/PriceComparisonTable";
import SeasonCalendar from "@/components/preisentwicklung/SeasonCalendar";
import RightSidebar from "@/components/layout/RightSidebar";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

import JsonLd from "@/components/seo/JsonLd";
export const revalidate = 3600;

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Preisentwicklung Urlaub — Historische Preisverläufe & Prognose | Urlaubfinder365",
  description:
    "Verfolge die Preisentwicklung für über 250 Urlaubsziele. Historische Preisverläufe, Trendprognosen und Jahresvergleiche für Pauschalreisen, All Inclusive & Last Minute.",
  alternates: { canonical: `${BASE_URL}/preisentwicklung/` },
  openGraph: {
    title: "Preisentwicklung & Preisverlauf für Urlaubsziele | Urlaubfinder365",
    description: "Historische Reisepreise, Trends und Prognosen für über 250 Urlaubsziele.",
    url: `${BASE_URL}/preisentwicklung/`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite",        item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Preisentwicklung",  item: `${BASE_URL}/preisentwicklung/` },
      ],
    },
    {
      "@type": "WebPage",
      name: "Preisentwicklung Urlaub",
      description: "Historische Reisepreise, Trendprognosen und Jahresvergleiche für über 250 Urlaubsziele.",
      url: `${BASE_URL}/preisentwicklung/`,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Wie werden die Preise gesammelt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wir erfassen täglich automatisch die günstigsten verfügbaren Reisepreise für über 250 Urlaubsziele aus dem Traveltainment-System.",
          },
        },
        {
          "@type": "Question",
          name: "Wie zuverlässig ist die Preisprognose?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Die Prognose basiert auf linearer Regression der historischen Preisdaten. Sie gibt eine Tendenz an, ist jedoch keine Garantie für zukünftige Preise.",
          },
        },
        {
          "@type": "Question",
          name: "Ab wann ist der Jahresvergleich verfügbar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Der Jahresvergleich wird automatisch eingeblendet, sobald für ein Urlaubsziel Daten aus dem Vorjahreszeitraum vorliegen — frühestens nach 365 Tagen Datensammlung.",
          },
        },
      ],
    },
  ],
};

export default async function PreisentwicklungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section
        className="relative text-white py-20 px-4 overflow-hidden"
        style={{ minHeight: 420 }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&h=600&q=70"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          // @ts-ignore
          fetchPriority="high"
        />
        {/* Dark overlay with brand gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(8,22,14,0.93) 0%, rgba(12,35,22,0.90) 50%, rgba(16,55,35,0.87) 100%)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Täglich aktualisiert
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Preisentwicklung & <br className="hidden sm:block" />
            <span className="text-[#1db682]">Reisepreis-Verlauf</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Historische Preisverläufe, Trendprognosen und Jahresvergleiche
            für über 250 Urlaubsziele — damit du weißt, wann du am günstigsten buchst.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              { icon: "📈", label: "Preisverlauf bis 1 Jahr" },
              { icon: "🔮", label: "30-Tage-Prognose" },
              { icon: "📊", label: "Jahresvergleich" },
              { icon: "⚡", label: "Tagesaktuelle Daten" },
            ].map((f) => (
              <span key={f.label} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>
      </section> {/* end hero */}

      {/* Main content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="xl:flex xl:gap-8 xl:items-start">
          {/* Main */}
          <div className="flex-1 min-w-0">
            <PreisentwicklungClient />

            {/* Preisvergleich-Tabelle */}
            <Suspense fallback={null}>
              <PriceComparisonTable />
            </Suspense>

            {/* Saisonkalender */}
            <Suspense fallback={null}>
              <SeasonCalendar />
            </Suspense>

            {/* Info cards */}
            <div className="grid sm:grid-cols-3 gap-6 mt-10 pb-16">
              {[
                {
                  icon: "📅",
                  title: "Tägliche Datenerfassung",
                  text: "Jeden Tag um 3–6 Uhr erfassen unsere Systeme automatisch die günstigsten Preise für Pauschalreisen, All Inclusive und Last Minute für über 250 Urlaubsziele.",
                },
                {
                  icon: "📉",
                  title: "Lineare Trendprognose",
                  text: "Auf Basis der gesammelten Preishistorie berechnen wir täglich eine Prognose für die nächsten 30 Tage — so erkennst du, ob du jetzt oder später buchen solltest.",
                },
                {
                  icon: "🗓️",
                  title: "Jahresvergleich",
                  text: "Nach einem Jahr Datensammlung vergleichen wir aktuelle Preise mit dem Vorjahreszeitraum. So erkennst du, ob ein Urlaubsziel dauerhaft teurer oder günstiger geworden ist.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-3xl mb-3">{card.icon}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
            {/* Newsletter CTA */}
            <div className="mt-10 mb-6 rounded-2xl overflow-hidden shadow-md">
              <div className="bg-linear-to-r from-teal-500 to-blue-500 px-6 py-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Newsletter</p>
                <h2 className="text-xl font-black leading-tight mb-1">
                  Wöchentlich die besten Reisedeals
                </h2>
                <p className="text-white/80 text-sm">
                  Erhalte wöchentlich die besten Reisedeals und Preisanalysen — kostenlos direkt in dein Postfach.
                </p>
              </div>
              <div className="bg-white px-6 py-5">
                <NewsletterSignup variant="inline" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=200&q=70",
                  eyebrow: "Preisalarm",
                  title: "Nie wieder zu teuer buchen",
                  description: "Richte einen kostenlosen Preisalarm ein und werde benachrichtigt, wenn der Preis fällt.",
                  href: "/login/",
                  ctaLabel: "Preisalarm einrichten →",
                }}
                seoLinksTitle="📈 Beliebte Urlaubsziele"
                seoLinks={[
                  { href: "/urlaubsziele/tuerkei/",   label: "Preisverlauf Türkei" },
                  { href: "/urlaubsziele/mallorca/",  label: "Preisverlauf Mallorca" },
                  { href: "/urlaubsziele/kreta/",     label: "Preisverlauf Kreta" },
                  { href: "/urlaubsziele/aegypten/",  label: "Preisverlauf Ägypten" },
                  { href: "/urlaubsziele/antalya/",   label: "Preisverlauf Antalya" },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
