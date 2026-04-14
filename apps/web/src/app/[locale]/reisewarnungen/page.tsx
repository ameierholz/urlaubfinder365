import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ReisewarnungenClient from "@/components/reisewarnungen/ReisewarnungenClient";
import RightSidebar from "@/components/layout/RightSidebar";

import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";
export const revalidate = 3600;

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Reisewarnungen 2025 – Aktuelle Hinweise des Auswärtigen Amts | Urlaubfinder365",
  description:
    "Alle aktuellen Reisewarnungen und Sicherheitshinweise des Deutschen Auswärtigen Amts auf einen Blick – täglich aktualisiert für über 200 Länder.",
  alternates: { canonical: `${BASE_URL}/reisewarnungen/` },
  openGraph: {
    title: "Reisewarnungen & Sicherheitshinweise – Auswärtiges Amt | Urlaubfinder365",
    description: "Aktuelle Reisewarnungen, Teilreisewarnungen und Sicherheitshinweise für alle Urlaubsländer – täglich aktuell.",
    url: `${BASE_URL}/reisewarnungen/`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite",      item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Reisewarnungen",  item: `${BASE_URL}/reisewarnungen/` },
      ],
    },
    {
      "@type": "WebPage",
      name: "Aktuelle Reisewarnungen des Auswärtigen Amts",
      description: "Alle Reisewarnungen und Sicherheitshinweise für Urlaubsländer – täglich aktualisiert.",
      url: `${BASE_URL}/reisewarnungen/`,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was bedeutet eine Reisewarnung?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Eine Reisewarnung des Auswärtigen Amts bedeutet, dass dringende Gründe vorliegen, von Reisen in ein Land oder eine Region abzuraten. Sie wird ausgesprochen, wenn für Reisende eine ernste Gefahr für Leib und Leben besteht.",
          },
        },
        {
          "@type": "Question",
          name: "Kann ich bei einer Reisewarnung kostenfrei stornieren?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bei einer offiziellen Reisewarnung des Auswärtigen Amts besteht in der Regel ein außerordentliches Kündigungsrecht. Viele Reiseveranstalter ermöglichen eine kostenfreie Umbuchung oder Stornierung. Bitte kläre dies direkt mit deinem Anbieter und prüfe deine Reiserücktrittsversicherung.",
          },
        },
        {
          "@type": "Question",
          name: "Wie oft werden die Warnungen aktualisiert?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Urlaubfinder365 bezieht die Daten täglich automatisch direkt von der offiziellen Open-Data-Schnittstelle des Auswärtigen Amts. Bei akuten Krisen kann die Aktualisierung mehrmals täglich erfolgen.",
          },
        },
      ],
    },
  ],
};

export default async function ReisewarnungenPage({
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
      <section className="relative text-white py-16 px-4 overflow-hidden" style={{ minHeight: 360 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&h=500&q=70&auto=format"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          // @ts-ignore
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(30,10,10,0.92) 0%, rgba(60,20,15,0.88) 50%, rgba(100,30,15,0.85) 100%)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            Täglich automatisch aktualisiert
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Reisewarnungen &<br className="hidden sm:block" />
            <span className="text-orange-400"> Sicherheitshinweise</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Aktuelle Warnungen des Auswärtigen Amts für alle Urlaubsländer —
            damit du sicher planst und buchst.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              { icon: "🔴", label: "Reisewarnungen" },
              { icon: "🟠", label: "Teilreisewarnungen" },
              { icon: "🟡", label: "Sicherheitshinweise" },
              { icon: "🌍", label: "200+ Länder" },
            ].map((f) => (
              <span key={f.label} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0">
            <ReisewarnungenClient />
          </div>
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
                  eyebrow: "Absicherung",
                  title: "Reiseversicherung vergleichen",
                  description: "Bei einer Reisewarnung kann eine Reiserücktrittsversicherung Stornokosten erstatten.",
                  href: "/reiseversicherung/",
                  ctaLabel: "Jetzt absichern →",
                  accentColor: "bg-red-600",
                }}
                seoLinksTitle="🌍 Weitere Infos"
                seoLinks={[
                  { href: "/reiseversicherung/",   label: "Reiseversicherung" },
                  { href: "/visum-checker/",        label: "Visum-Checker" },
                  { href: "/urlaubsziele/",         label: "Urlaubsziele" },
                  { href: "/guenstig-urlaub-buchen/", label: "Günstig buchen" },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Info section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🔴",
              title: "Reisewarnung",
              text: "Dringende Empfehlung des Auswärtigen Amts, von einer Reise in das jeweilige Land oder eine Region abzusehen. Buchungen können häufig kostenfrei storniert werden.",
            },
            {
              icon: "🟠",
              title: "Teilreisewarnung",
              text: "Die Warnung gilt nur für bestimmte Regionen oder Gebiete eines Landes. Andere Teile des Landes können weiterhin sicher bereist werden.",
            },
            {
              icon: "🟡",
              title: "Sicherheitshinweis",
              text: "Erhöhte Aufmerksamkeit empfohlen. Kein offizielles Reiseverbot, aber konkrete Hinweise zu Risiken und Verhaltensempfehlungen.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-3xl mb-3">{card.icon}</p>
              <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
