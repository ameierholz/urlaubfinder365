import type { Metadata } from "next";
import CommunityPageClient from "./CommunityPageClient";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import RightSidebar from "@/components/layout/RightSidebar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "🌍 Urlaubs-Community – Berichte, Gruppen & Tipps",
  description: "Urlaubfinder365 Urlaubs-Community: Echte Urlaubsberichte lesen, Urlaubsgruppen beitreten & Geheimtipps entdecken ✓ Kostenlos mitmachen.",
  keywords: ["Urlaubs-Community", "Urlaubsberichte", "Urlaubsgruppen", "Urlaubstipps", "Reiseforum", "Reisende vernetzen", "Urlaubserfahrungen", "Reise Austausch"],
  alternates: { canonical: "https://www.urlaubfinder365.de/community/" },
  openGraph: {
    title: "🌍 Urlaubs-Community – Berichte & Tipps | Urlaubfinder365",
    description: "Urlaubfinder365 Urlaubs-Community: Echte Urlaubsberichte lesen, Urlaubsgruppen beitreten & Geheimtipps entdecken ✓ Kostenlos mitmachen.",
    url: "https://www.urlaubfinder365.de/community/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Urlaubfinder365 Urlaubs-Community",
      },
    ],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Urlaubs-Community – Berichte, Gruppen & Urlaubstipps",
    description:
      "Lies echte Urlaubsberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden.",
    url: "https://www.urlaubfinder365.de/community/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Community",  item: "https://www.urlaubfinder365.de/community/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Urlaubfinder365 Community",
    url: "https://www.urlaubfinder365.de/community/",
    description: "Urlaubs-Community für Urlaubsberichte, Gruppen und Urlaubstipps",
    sameAs: ["https://www.urlaubfinder365.de/"],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero (full width) ── */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: "420px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/community_header.webp"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover object-center"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🌍 Community
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight drop-shadow-lg">
            Urlaubs-Community –<br /><span className="text-teal-300">Berichte, Gruppen & Tipps</span>
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto drop-shadow">
            Lies echte Urlaubsberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden wie dir.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/community/reiseberichte/" className="bg-white text-teal-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-teal-50 transition-colors shadow-lg">
              Urlaubsberichte entdecken
            </Link>
            <Link href="/community/gruppen/" className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30">
              Gruppen beitreten
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0">
            <CommunityPageClient />
          </div>
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 pt-8">
              <Suspense fallback={null}>
                <RightSidebar
                  extrasBox={{
                    image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=400&h=200&q=70",
                    eyebrow: "Community",
                    title: "Urlaubserfahrungen teilen",
                    description: "Schreibe einen Urlaubsbericht und hilf anderen Urlaubern bei ihrer Planung.",
                    href: "/community/reiseberichte/",
                    ctaLabel: "Bericht schreiben →",
                    accentColor: "bg-[#6991d8]",
                  }}
                  seoLinksTitle="🌍 Community"
                  seoLinks={[
                    { href: "/community/reiseberichte/", label: "Urlaubsberichte" },
                    { href: "/community/gruppen/",        label: "Urlaubs-Gruppen" },
                    { href: "/community/mitglieder/",     label: "Mitglieder" },
                    { href: "/travel-buddies/",           label: "Urlaubspartner finden" },
                  ]}
                />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
