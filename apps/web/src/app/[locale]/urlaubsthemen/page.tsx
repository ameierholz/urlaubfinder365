import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RightSidebar from "@/components/layout/RightSidebar";
import { URLAUBSTHEMEN, themeImage } from "@/lib/urlaubsthemen-config";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🌴 Urlaubsthemen ${YEAR} – Reiseideen für jeden Geschmack`,
  description: `Alle Urlaubsthemen ${YEAR}: Adults Only, Familienurlaub, Strandurlaub, Wellness, Städtereisen, Luxus & mehr ✓ Täglich aktuelle Pauschalreisen.`,
  keywords: ["Urlaubsthemen", "Reiseideen", "Urlaubsarten", "Familienurlaub", "Strandurlaub", "Wellnessurlaub", "Luxusurlaub", "Städtereisen", "Aktivurlaub"],
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsthemen/" },
  openGraph: {
    title: `🌴 Urlaubsthemen ${YEAR} – alle Reiseideen | Urlaubfinder365`,
    description: `Alle Urlaubsthemen ${YEAR}: Adults Only, Familienurlaub, Strandurlaub, Wellness, Städtereisen, Luxus & mehr ✓ Täglich aktuelle Pauschalreisen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Reisende mit Koffer am Flughafen – Urlaubsthemen und Reiseideen bei Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("urlaubsthemenPage");

  // Themen-Grid aus zentraler Config – Bild ist identisch mit Detail-Seiten-Hero
  const THEMEN = URLAUBSTHEMEN.map((th, i) => ({
    href: `/urlaubsthemen/${th.slug}/`,
    emoji: th.emoji,
    label: t(`thema${i + 1}Label`),
    desc: t(`thema${i + 1}Desc`),
    color: th.cardGradient,
    img: themeImage(th.imageId, 600, 75),
  }));

  const BUDGET = [
    {
      href: "/urlaubsthemen/budget-bis-500/",
      badge: "🤑",
      label: t("budget1Label"),
      desc: t("budget1Desc"),
      color: "bg-green-50 border-green-200 hover:border-green-400",
      textColor: "text-green-800",
    },
    {
      href: "/urlaubsthemen/budget-bis-1000/",
      badge: "💰",
      label: t("budget2Label"),
      desc: t("budget2Desc"),
      color: "bg-sky-50 border-sky-200 hover:border-sky-400",
      textColor: "text-sky-800",
    },
    {
      href: "/urlaubsthemen/budget-bis-1500/",
      badge: "💳",
      label: t("budget3Label"),
      desc: t("budget3Desc"),
      color: "bg-amber-50 border-amber-200 hover:border-amber-400",
      textColor: "text-amber-800",
    },
    {
      href: "/urlaubsthemen/budget-bis-2000/",
      badge: "✨",
      label: t("budget4Label"),
      desc: t("budget4Desc"),
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      textColor: "text-purple-800",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Urlaubsthemen – Alle Reiseideen auf einen Blick",
      description: "Alle Urlaubsthemen entdecken: Adults Only, Familienurlaub, Strandurlaub, Wellness, Städtereisen, Hochzeitsreise, Luxusurlaub und mehr.",
      url: "https://www.urlaubfinder365.de/urlaubsthemen/",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite",     item: "https://www.urlaubfinder365.de/" },
        { "@type": "ListItem", position: 2, name: "Urlaubsthemen",  item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Urlaubsthemen",
      itemListElement: THEMEN.map((th, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: th.label,
        description: th.desc,
        url: `https://www.urlaubfinder365.de${th.href}`,
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
          alt="Urlaubsthemen – Reiseideen für jeden Geschmack"
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
            <span className="text-white/90">Urlaubsthemen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-[#00838F]/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🌴 {t("heroBadge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {t("heroTitle")}<br />
            <span className="text-[#6CC4BA]">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0">

      {/* Themen Grid */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t("themenGridTitle")} <span className="text-[#00838F]">{t("themenGridTitleHighlight")}</span>
        </h2>
        <p className="text-gray-500 mb-8">
          {t("themenGridSubtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {THEMEN.map((th) => (
            <Link
              key={th.href}
              href={th.href}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-44">
                <img
                  src={th.img}
                  alt={th.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-linear-to-t ${th.color}`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{th.emoji}</span>
                  <span className="text-white font-bold text-base leading-tight">{th.label}</span>
                </div>
                <p className="text-white/80 text-xs leading-snug">{th.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="pb-12 pt-4">
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("budgetTitle")} <span className="text-[#00838F]">{t("budgetTitleHighlight")}</span>
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            {t("budgetSubtitle")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {BUDGET.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className={`flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl border-2 transition-all ${b.color}`}
              >
                <span className="text-4xl mb-3">{b.badge}</span>
                <span className={`font-bold text-base ${b.textColor}`}>{b.label}</span>
                <span className="text-xs text-gray-500 mt-1.5 leading-snug">{b.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("seoTitle")}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {t("seoText1")}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {t("seoText2")}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t("seoText3")}
        </p>
      </div>

      {/* Internal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-t border-gray-100 pt-8">
        <p className="text-sm font-semibold text-gray-500 mb-4">{t("internalLinksTitle")}</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/urlaubsarten/pauschalreisen/",       label: t("internalLinkPauschalreisen") },
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: t("internalLinkAllInclusive") },
            { href: "/urlaubsarten/last-minute-urlaub/",   label: t("internalLinkLastMinute") },
            { href: "/urlaubsarten/fruhbucher-urlaub/",    label: t("internalLinkFruhbucher") },
            { href: "/urlaubsziele/",                      label: t("internalLinkAlleZiele") },
            { href: "/last-minute/",                       label: t("internalLinkHeutigeDeals") },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-[#00838F] hover:bg-[#00838F]/5 text-gray-700 hover:text-[#00838F] text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
          </div>{/* end main column */}

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=200&q=70",
                  eyebrow: t("sidebarEyebrow"),
                  title: t("sidebarTitle"),
                  description: t("sidebarDescription"),
                  href: "/urlaubsziele/",
                  ctaLabel: t("sidebarCta"),
                }}
                seoLinksTitle={t("sidebarLinksTitle")}
                seoLinks={[
                  { href: "/urlaubsthemen/strandurlaub/",    label: t("sidebarLinkStrandurlaub") },
                  { href: "/urlaubsthemen/familienurlaub/",  label: t("sidebarLinkFamilienurlaub") },
                  { href: "/urlaubsthemen/wellnessurlaub/",  label: t("sidebarLinkWellnessurlaub") },
                  { href: "/urlaubsthemen/adults-only/",     label: t("sidebarLinkAdultsOnly") },
                  { href: "/urlaubsthemen/luxusurlaub/",     label: t("sidebarLinkLuxusurlaub") },
                  { href: "/urlaubsthemen/abenteuerurlaub/", label: t("sidebarLinkAbenteuerurlaub") },
                ]}
              />
            </div>
          </aside>
        </div>{/* end xl:flex */}
      </div>{/* end max-w-7xl */}
    </div>
  );
}
