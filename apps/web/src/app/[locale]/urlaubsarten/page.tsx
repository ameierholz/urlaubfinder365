import type { Metadata } from "next";
import Link from "next/link";
import PageNavBar from "@/components/ui/PageNavBar";
import LifestyleSection from "@/components/home/LifestyleSection";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RightSidebar from "@/components/layout/RightSidebar";

import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `✈ Urlaubsarten ${YEAR} – Pauschalreisen, All Inclusive & mehr`,
  description: `Alle Urlaubsarten ${YEAR} im Überblick: Pauschalreisen, All Inclusive, Last Minute, Frühbucher & mehr ✓ Täglich aktuelle Angebote vergleichen.`,
  keywords: ["Urlaubsarten", "Pauschalreisen", "All Inclusive Urlaub", "Last Minute Urlaub", "Frühbucher Urlaub", "Reisearten", "Urlaubstypen"],
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/" },
  openGraph: {
    title: `✈ Urlaubsarten ${YEAR} – alle Reisearten | Urlaubfinder365`,
    description: `Alle Urlaubsarten ${YEAR} im Überblick: Pauschalreisen, All Inclusive, Last Minute, Frühbucher & mehr ✓ Täglich aktuelle Angebote vergleichen.`,
    url: "https://www.urlaubfinder365.de/urlaubsarten/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
    description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
    url: "https://www.urlaubfinder365.de/urlaubsarten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Urlaubsarten", item: "https://www.urlaubfinder365.de/urlaubsarten/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("urlaubsartenPage");

  const NAV_ITEMS = [
    { id: "urlaubsarten-uebersicht", label: t("navUrlaubsarten"),  emoji: "✈️" },
    { id: "lifestyle",               label: t("navLifestyle"),     emoji: "💫" },
    { id: "reise-tipps",             label: t("navTipps"),         emoji: "💡" },
    { id: "faq",                     label: t("navFaq"),           emoji: "❓" },
  ];

  const arten = [
    {
      title: t("art1Title"),
      href: "/urlaubsarten/pauschalreisen/",
      desc: t("art1Desc"),
      emoji: "✈️",
      highlight: t("art1Highlight"),
      cardStyle: { backgroundColor: "#eef4fb", borderColor: "#1b6ca8" },
      badgeStyle: { backgroundColor: "#dbeafe", color: "#0f4c75" },
    },
    {
      title: t("art2Title"),
      href: "/urlaubsarten/fruhbucher-urlaub/",
      desc: t("art2Desc"),
      emoji: "🌅",
      highlight: t("art2Highlight"),
      cardStyle: { backgroundColor: "#fffbeb", borderColor: "#f59e0b" },
      badgeStyle: { backgroundColor: "#fef3c7", color: "#92400e" },
    },
    {
      title: t("art3Title"),
      href: "/urlaubsarten/all-inclusive-urlaub/",
      desc: t("art3Desc"),
      emoji: "🍹",
      highlight: t("art3Highlight"),
      cardStyle: { backgroundColor: "#fdf7ee", borderColor: "#c97d00" },
      badgeStyle: { backgroundColor: "#fef3c7", color: "#b06a00" },
    },
    {
      title: t("art4Title"),
      href: "/urlaubsarten/last-minute-urlaub/",
      desc: t("art4Desc"),
      emoji: "⚡",
      highlight: t("art4Highlight"),
      cardStyle: { backgroundColor: "#fef2f2", borderColor: "#e74c3c" },
      badgeStyle: { backgroundColor: "#fee2e2", color: "#c0392b" },
    },
    {
      title: t("art5Title"),
      href: "/urlaubsarten/super-last-minute-urlaub/",
      desc: t("art5Desc"),
      emoji: "🚀",
      highlight: t("art5Highlight"),
      cardStyle: { backgroundColor: "#fef2f2", borderColor: "#dc2626" },
      badgeStyle: { backgroundColor: "#fee2e2", color: "#991b1b" },
    },
  ];

  const TIPPS = [
    { num: "01", title: t("tipp1Title"), text: t("tipp1Text"), emoji: "📅" },
    { num: "02", title: t("tipp2Title"), text: t("tipp2Text"), emoji: "🔍" },
    { num: "03", title: t("tipp3Title"), text: t("tipp3Text"), emoji: "🗓️" },
    { num: "04", title: t("tipp4Title"), text: t("tipp4Text"), emoji: "🛡️" },
    { num: "05", title: t("tipp5Title"), text: t("tipp5Text"), emoji: "⚖️" },
    { num: "06", title: t("tipp6Title"), text: t("tipp6Text"), emoji: "🔔" },
  ];

  const FAQS = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
    { q: t("faq6q"), a: t("faq6a") },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/urlaubsarten_header.webp"
        alt={t("heroAlt")}
        className="w-full object-cover"
        style={{ maxHeight: "180px" }}
        loading="eager"
      />

      {/* ── Sticky NavBar ── */}
      <PageNavBar items={NAV_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="xl:flex xl:gap-8 xl:items-start">
      <div className="flex-1 min-w-0">

        {/* ═══════════════════════════════════════════════════════
            URLAUBSARTEN ÜBERSICHT
        ═══════════════════════════════════════════════════════ */}
        <section id="urlaubsarten-uebersicht" className="py-12">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">{t("overviewEyebrow")}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t("overviewTitle")}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t("overviewSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {arten.map((art) => (
              <Link
                key={art.href}
                href={art.href}
                className="relative rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 group"
                style={art.cardStyle}
              >
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4" style={art.badgeStyle}>
                  {art.highlight}
                </span>
                <div className="text-4xl mb-3">{art.emoji}</div>
                <h2 className="font-extrabold text-gray-900 text-xl mb-2 group-hover:text-[#00838F] transition-colors">
                  {art.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{art.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[#00838F] text-sm font-semibold">
                  <span>{t("discoverNow")}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            LIFESTYLE
        ═══════════════════════════════════════════════════════ */}
        <section id="lifestyle" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">{t("lifestyleEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t("lifestyleTitle")}</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              {t("lifestyleSubtitle")}
            </p>
          </div>
          <LifestyleSection />
        </section>

        {/* ═══════════════════════════════════════════════════════
            REISE-TIPPS
        ═══════════════════════════════════════════════════════ */}
        <section id="reise-tipps" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">{t("tippsEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t("tippsTitle")}</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              {t("tippsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIPPS.map((tipp) => (
              <div key={tipp.num} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{tipp.emoji}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">{tipp.num}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{tipp.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tipp.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FAQ
        ═══════════════════════════════════════════════════════ */}
        <section id="faq" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">{t("faqEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t("faqTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex gap-2">
                  <span className="text-[#00838F] shrink-0">Q</span>
                  {q}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed pl-5">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>{/* end flex-1 */}

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-24">
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
              eyebrow: t("sidebarEyebrow"),
              title: t("sidebarTitle"),
              description: t("sidebarDescription"),
              href: "/guenstig-urlaub-buchen/",
              ctaLabel: t("sidebarCta"),
            }}
            seoLinksTitle={t("sidebarLinksTitle")}
            seoLinks={[
              { href: "/urlaubsarten/pauschalreisen/",           label: t("sidebarLinkPauschalreisen") },
              { href: "/urlaubsarten/all-inclusive-urlaub/",     label: t("sidebarLinkAllInclusive") },
              { href: "/urlaubsarten/last-minute-urlaub/",       label: t("sidebarLinkLastMinute") },
              { href: "/urlaubsarten/fruhbucher-urlaub/",        label: t("sidebarLinkFruhbucher") },
              { href: "/urlaubsarten/super-last-minute-urlaub/", label: t("sidebarLinkSuperLastMinute") },
              { href: "/urlaubsziele/",                          label: t("sidebarLinkAlleZiele") },
            ]}
          />
        </div>
      </aside>
      </div>{/* end xl:flex */}
      </div>{/* end max-w-7xl */}

      <SeoTextBlocks pagePath="/urlaubsarten" />
    </>
  );
}
