import type { Metadata } from "next";
import Link from "next/link";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Megaphone, MapPin, TrendingUp, Users, BadgeCheck, Star,
  Monitor, Globe, ChevronRight,
  CheckCircle2, Zap, BarChart3, Shield,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("werbepartnerPage");
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "https://www.urlaubfinder365.de/werbepartner/" },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
      url: "https://www.urlaubfinder365.de/werbepartner/",
      type: "website",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Werbepartner werden – Urlaubfinder365",
  description: "Werbeplätze für lokale Unternehmen und Aktivitäts-Anbieter auf Urlaubfinder365.",
  url: "https://www.urlaubfinder365.de/werbepartner/",
};

export default async function WerbepartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("werbepartnerPage");

  // ── Werbepakete Lokale Partner ──────────────────────────────────────────
  const PAKETE_LOKAL = [
    {
      id: "sidebar",
      name: t("packages.starter.name"),
      price: 49,
      badge: null as string | null,
      accentBg: "bg-gray-50",
      accentBorder: "border-gray-200",
      icon: "📌",
      placement: t("packages.starter.position"),
      desc: t("packages.starter.desc"),
      features: [
        t("packages.starter.feature1"),
        t("packages.starter.feature2"),
        t("packages.starter.feature3"),
        t("packages.starter.feature4"),
        t("packages.starter.feature5"),
      ],
      cta: t("packages.starter.cta"),
      size: t("packages.starter.format"),
    },
    {
      id: "city",
      name: t("packages.spotlight.name"),
      price: 79,
      badge: t("packages.spotlight.badge"),
      accentBg: "bg-[#1db682]/5",
      accentBorder: "border-[#1db682]",
      icon: "🏙️",
      placement: t("packages.spotlight.position"),
      desc: t("packages.spotlight.desc"),
      features: [
        t("packages.spotlight.feature1"),
        t("packages.spotlight.feature2"),
        t("packages.spotlight.feature3"),
        t("packages.spotlight.feature4"),
        t("packages.spotlight.feature5"),
      ],
      cta: t("packages.spotlight.cta"),
      size: t("packages.spotlight.format"),
    },
    {
      id: "regional",
      name: t("packages.regional.name"),
      price: 149,
      badge: null as string | null,
      accentBg: "bg-blue-50/50",
      accentBorder: "border-blue-200",
      icon: "🌍",
      placement: t("packages.regional.position"),
      desc: t("packages.regional.desc"),
      features: [
        t("packages.regional.feature1"),
        t("packages.regional.feature2"),
        t("packages.regional.feature3"),
        t("packages.regional.feature4"),
        t("packages.regional.feature5"),
      ],
      cta: t("packages.regional.cta"),
      size: t("packages.regional.format"),
    },
    {
      id: "premium",
      name: t("packages.premium.name"),
      price: 299,
      badge: t("packages.premium.badge"),
      accentBg: "bg-purple-50/50",
      accentBorder: "border-purple-300",
      icon: "🚀",
      placement: t("packages.premium.position"),
      desc: t("packages.premium.desc"),
      features: [
        t("packages.premium.feature1"),
        t("packages.premium.feature2"),
        t("packages.premium.feature3"),
        t("packages.premium.feature4"),
        t("packages.premium.feature5"),
      ],
      cta: t("packages.premium.cta"),
      size: t("packages.premium.format"),
    },
  ];

  // ── Stats ───────────────────────────────────────────────────────────────
  const STATS = [
    { zahl: "250.000+", label: t("stats.visitors"),     icon: Users },
    { zahl: "200+",     label: t("stats.destinations"), icon: MapPin },
    { zahl: "85 %",     label: t("stats.planning"),     icon: TrendingUp },
    { zahl: "ab 49 €",  label: t("stats.startPrice"),   icon: BarChart3 },
  ];

  // ── FAQ ─────────────────────────────────────────────────────────────────
  const FAQ = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
  ];

  // ── Preview Benefits ────────────────────────────────────────────────────
  const PREVIEW_BENEFITS = [
    { icon: BadgeCheck,  title: t("previewAuthentic"),    desc: t("previewAuthenticDesc") },
    { icon: MapPin,      title: t("previewTargeted"),     desc: t("previewTargetedDesc") },
    { icon: Shield,      title: t("previewGdpr"),         desc: t("previewGdprDesc") },
    { icon: TrendingUp,  title: t("previewPerformance"),  desc: t("previewPerformanceDesc") },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "420px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format"
          alt={t("heroBadge")}
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0f2027]/95 via-[#1a3a4a]/85 to-[#1db682]/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Megaphone className="w-4 h-4 text-[#1db682]" /> {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            {t("heroLine1")}<br />
            <span className="text-[#a8f0d8]">{t("heroLine2")}</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            {t("heroDesc")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {STATS.map(({ zahl, label, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-4 h-4 mx-auto mb-1 text-[#1db682]" />
                <p className="text-xl font-black">{zahl}</p>
                <p className="text-xs text-white/65 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#pakete"
              className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#18a270] text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-colors"
            >
              <Zap className="w-5 h-5" /> {t("heroCtaBook")}
            </a>
            <Link
              href="/marktplatz/anbieter-werden/"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
            >
              {t("heroCtaProvider")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Zwei Wege ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("twoModelsTitle")}</p>
            <h2 className="text-2xl font-extrabold text-gray-900">{t("twoModelsSubtitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Lokaler Werbepartner */}
            <div className="group rounded-3xl border-2 border-[#1db682]/40 hover:border-[#1db682] bg-gradient-to-br from-[#1db682]/5 to-transparent p-8 transition-all cursor-pointer">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{t("localPartner")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {t("localPartnerDesc")}
              </p>
              <ul className="space-y-2 mb-6">
                {[t("localFeature1"), t("localFeature2"), t("localFeature3"), t("localFeature4")].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1db682] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#pakete" className="inline-flex items-center gap-1.5 text-[#1db682] font-bold text-sm group-hover:underline">
                {t("localCta")} <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Marktplatz-Anbieter */}
            <div className="group rounded-3xl border-2 border-[#6991d8]/40 hover:border-[#6991d8] bg-gradient-to-br from-[#6991d8]/5 to-transparent p-8 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{t("marketplacePartner")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {t("marketplacePartnerDesc")}
              </p>
              <ul className="space-y-2 mb-6">
                {[t("marketplaceFeature1"), t("marketplaceFeature2"), t("marketplaceFeature3"), t("marketplaceFeature4")].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#6991d8] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/marktplatz/anbieter-werden/" className="inline-flex items-center gap-1.5 text-[#6991d8] font-bold text-sm group-hover:underline">
                {t("marketplaceCta")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Werbepakete ─────────────────────────────────────────────────── */}
      <section id="pakete" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("packagesTitle")}</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{t("packagesSubtitle")}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t("packagesNote")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {PAKETE_LOKAL.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-3xl border-2 ${p.accentBorder} ${p.accentBg} p-6 flex flex-col`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#1db682] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{p.name}</h3>
                <p className="text-[11px] text-gray-400 mb-3 font-semibold">{p.placement}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{p.desc}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1db682] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Format Badge */}
                <div className="bg-white/70 rounded-xl px-3 py-2 mb-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("formatLabel")}</p>
                  <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{p.size}</p>
                </div>

                {/* Preis */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900">{p.price} €</span>
                  <span className="text-gray-400 text-sm">{t("perMonth")}</span>
                </div>

                <a
                  href={`mailto:werbung@urlaubfinder365.de?subject=${encodeURIComponent(`${t("inquiryPrefix")}${p.name}`)}`}
                  className="block text-center bg-[#1db682] hover:bg-[#18a270] text-white font-bold px-4 py-3 rounded-2xl transition-colors text-sm"
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            {t("pricesNote")}
          </p>
        </div>
      </section>

      {/* ── Live Vorschau ────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="xl:flex xl:gap-16 xl:items-start">

            {/* Text */}
            <div className="xl:w-1/2 mb-10 xl:mb-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("previewTitle")}</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                {t("previewSubtitle")}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {t("previewDesc")}
              </p>

              <div className="space-y-4">
                {PREVIEW_BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#1db682]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#1db682]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup: So sieht die Sidebar aus */}
            <div className="xl:w-1/2">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 max-w-sm mx-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t("sidebarPreview")}</p>

                {/* AdBanner Placeholder */}
                <div className="bg-gray-100 rounded-xl border border-gray-200 mb-4 overflow-hidden">
                  <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-200">{t("adLabel")}</p>
                  <div className="h-40 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <p className="text-2xl mb-1">📢</p>
                      <p className="text-xs text-gray-500 font-semibold">{t("adBanner")}</p>
                      <p className="text-[10px] text-gray-400">{t("adPlaceholder")}</p>
                    </div>
                  </div>
                </div>

                {/* Gesponserte Angebote Mockup */}
                <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden mb-4">
                  <div className="relative h-24 bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=100&q=60&fit=crop&auto=format"
                      alt="Demo"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">{t("adLabel")}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-900 mb-1">{t("adOfferPlaceholder")}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{t("adLocationPlaceholder")}</span>
                      <span className="text-sm font-black text-[#00838F]">49 €</span>
                    </div>
                    <div className="mt-2 w-full text-center bg-[#00838F] text-white text-[11px] font-bold py-1.5 rounded-xl">
                      {t("adBookNow")}
                    </div>
                  </div>
                </div>

                {/* Lokale Partner Mockup */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t("localPartners")}</p>
                    <Megaphone className="w-3.5 h-3.5 text-[#1db682]" />
                  </div>
                  {[t("yourCompany"), t("morePartners")].map((name, i) => (
                    <div key={name} className={`flex items-center gap-2.5 px-3 py-2 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                      <div className="w-8 h-8 rounded-full bg-[#1db682]/20 flex items-center justify-center text-xs font-black text-[#1db682] shrink-0">
                        {i === 0 ? "D" : "W"}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900">{name}</p>
                        <p className="text-[10px] text-gray-400">{t("companyDesc")}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-3 py-2 border-t border-gray-100 flex justify-between">
                    <span className="text-[10px] text-gray-400">{t("adSpaceFree")}</span>
                    <span className="text-[10px] text-[#1db682] font-bold">{t("advertiseHere")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ + Sidebar ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="xl:flex xl:gap-12 xl:items-start">

          {/* FAQ */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("faqTitle")}</p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">{t("faqSubtitle")}</h2>

            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            {/* Kontakt-CTA */}
            <div className="mt-10 bg-linear-to-br from-[#1db682] to-[#00838F] rounded-3xl p-8 text-white text-center">
              <p className="text-2xl mb-2">💬</p>
              <h3 className="text-xl font-black mb-2">{t("contactTitle")}</h3>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                {t("contactDesc")}
              </p>
              <a
                href="mailto:werbung@urlaubfinder365.de"
                className="inline-flex items-center gap-2 bg-white text-[#1db682] font-black px-8 py-3 rounded-2xl hover:bg-green-50 transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                werbung@urlaubfinder365.de
              </a>
              <p className="text-white/60 text-xs mt-3">{t("contactPhone")}</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&q=70&auto=format&fit=crop",
                  eyebrow: t("sidebarEyebrow"),
                  title: t("sidebarTitle"),
                  description: t("sidebarDesc"),
                  href: "/marktplatz/anbieter-werden/",
                  ctaLabel: t("sidebarCta"),
                  accentColor: "bg-[#6991d8]",
                }}
                seoLinksTitle={`📢 ${t("sidebarInfoTitle")}`}
                seoLinks={[
                  { href: "/marktplatz/anbieter-werden/", label: t("sidebarLinkProviders") },
                  { href: "/marktplatz/",                 label: t("sidebarLinkMarketplace") },
                  { href: "/extras/",                     label: t("sidebarLinkTools") },
                  { href: "/urlaubsziele/",               label: t("sidebarLinkDestinations") },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
