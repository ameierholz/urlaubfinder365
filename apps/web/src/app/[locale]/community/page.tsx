import type { Metadata } from "next";
import CommunityPageClient from "./CommunityPageClient";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import RightSidebar from "@/components/layout/RightSidebar";
import Link from "next/link";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

import JsonLd from "@/components/seo/JsonLd";

const FALLBACK_TITLE = "🌍 Urlaubs-Community – Berichte, Gruppen & Tipps";
const FALLBACK_DESC = "Urlaubfinder365 Urlaubs-Community: Echte Urlaubsberichte lesen, Urlaubsgruppen beitreten & Geheimtipps entdecken ✓ Kostenlos mitmachen.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/community");
  const title = seo?.meta_title || FALLBACK_TITLE;
  const description = seo?.meta_description || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: ["Urlaubs-Community", "Urlaubsberichte", "Urlaubsgruppen", "Urlaubstipps", "Reiseforum", "Reisende vernetzen", "Urlaubserfahrungen", "Reise Austausch"],
    alternates: { canonical: "https://www.urlaubfinder365.de/community/" },
    openGraph: {
      title: seo?.og_title || "🌍 Urlaubs-Community – Berichte & Tipps | Urlaubfinder365",
      description: seo?.og_description || description,
      url: "https://www.urlaubfinder365.de/community/",
      type: "website",
      images: [
        {
          url: seo?.og_image || "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&h=630&q=80&auto=format",
          width: 1200,
          height: 630,
          alt: "Urlaubfinder365 Urlaubs-Community",
        },
      ],
    },
  };
}

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
  const t = await getTranslations("communityPage");
  const seo = await fetchPageSeoMeta("/community");
  return (
    <>
      <JsonLd data={jsonLd} />

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
            🌍 {t("community")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight drop-shadow-lg">
            {t("heroTitle").split(" – ")[0]} –<br /><span className="text-teal-300">{t("heroTitle").split(" – ")[1]}</span>
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto drop-shadow">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/community/reiseberichte/" className="bg-white text-teal-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-teal-50 transition-colors shadow-lg">
              {t("discoverReports")}
            </Link>
            <Link href="/community/gruppen/" className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30">
              {t("joinGroups")}
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Intro */}
      {seo?.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {seo?.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

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
                    image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
                    eyebrow: t("sidebarEyebrow"),
                    title: t("sidebarTitle"),
                    description: t("sidebarDesc"),
                    href: "/community/reiseberichte/",
                    ctaLabel: t("sidebarCta"),
                    accentColor: "bg-[#6991d8]",
                  }}
                  seoLinksTitle={`🌍 ${t("sidebarSeoTitle")}`}
                  seoLinks={[
                    { href: "/community/reiseberichte/", label: t("sidebarReports") },
                    { href: "/community/gruppen/",        label: t("sidebarGroups") },
                    { href: "/community/mitglieder/",     label: t("sidebarMembers") },
                    { href: "/travel-buddies/",           label: t("sidebarBuddies") },
                  ]}
                />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>

      {/* SEO Bottom */}
      {seo?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl">
            {seo.seo_h2_bottom && (
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              {seo.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
