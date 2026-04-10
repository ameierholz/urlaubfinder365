import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp, ShieldAlert, BookOpen, Sparkles,
  Compass, ShieldCheck, Star, Calendar, Globe,
} from "lucide-react";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Extras & Tools ${YEAR} – Urlaubsplaner, Visum-Checker & mehr`,
  description: `Kostenlose Urlaubs-Tools: KI-Urlaubsplaner, Visum-Checker, Reisewarnungen, Preisentwicklung, Urlaubsguides & mehr – alles für deinen perfekten Urlaub.`,
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/" },
  openGraph: {
    title: `Extras & Tools – Urlaubsplaner, Visum-Checker & mehr | Urlaubfinder365`,
    description: `Kostenlose Tools für Urlauber: KI-Planer, Visum-Checker, Reisewarnungen, Preisentwicklung & mehr.`,
    url: "https://www.urlaubfinder365.de/extras/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Extras & Tools – Urlaubsplaner, Visum-Checker & mehr",
    description: "Kostenlose Urlaubs-Tools: KI-Urlaubsplaner, Visum-Checker, Reisewarnungen, Preisentwicklung & mehr.",
    url: "https://www.urlaubfinder365.de/extras/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Extras",     item: "https://www.urlaubfinder365.de/extras/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("extrasPage");

  const FEATURED = [
    {
      href: "/ki-reiseplaner/",
      img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
      icon: Sparkles,
      badge: t("featuredBadgeKI"),
      badgeColor: "bg-purple-500/80",
      title: t("featuredTitleKI"),
      desc: t("featuredDescKI"),
      cta: t("featuredCtaKI"),
      accent: "from-purple-900/80 via-purple-800/60",
    },
    {
      href: "/preisentwicklung/",
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      icon: TrendingUp,
      badge: t("featuredBadgePreise"),
      badgeColor: "bg-emerald-500/80",
      title: t("featuredTitlePreise"),
      desc: t("featuredDescPreise"),
      cta: t("featuredCtaPreise"),
      accent: "from-emerald-900/80 via-emerald-800/60",
    },
  ];

  const TOOLS = [
    {
      href: "/reisewarnungen/",
      icon: ShieldAlert,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=70",
      title: t("toolTitleWarnungen"),
      desc: t("toolDescWarnungen"),
      tag: t("toolTagWarnungen"),
      tagColor: "bg-red-50 text-red-600",
    },
    {
      href: "/urlaubsguides/",
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70",
      title: t("toolTitleGuides"),
      desc: t("toolDescGuides"),
      tag: t("toolTagGuides"),
      tagColor: "bg-blue-50 text-blue-600",
    },
    {
      href: "/visum-checker/",
      icon: ShieldCheck,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-500",
      img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=70",
      title: t("toolTitleVisum"),
      desc: t("toolDescVisum"),
      tag: t("toolTagVisum"),
      tagColor: "bg-teal-50 text-teal-600",
    },
    {
      href: "/reiseversicherung/",
      icon: Star,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70",
      title: t("toolTitleVersicherung"),
      desc: t("toolDescVersicherung"),
      tag: t("toolTagVersicherung"),
      tagColor: "bg-indigo-50 text-indigo-600",
    },
    {
      href: "/erlebnisse/",
      icon: Compass,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=70",
      title: t("toolTitleAktivitaeten"),
      desc: t("toolDescAktivitaeten"),
      tag: t("toolTagAktivitaeten"),
      tagColor: "bg-orange-50 text-orange-600",
    },
    {
      href: "/extras/urlaubskalender/",
      icon: Calendar,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70",
      title: t("toolTitleKalender"),
      desc: t("toolDescKalender"),
      tag: t("toolTagKalender"),
      tagColor: "bg-pink-50 text-pink-600",
    },
    {
      href: "/weltkarte/",
      icon: Globe,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-500",
      img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=70",
      title: t("toolTitleKarte"),
      desc: t("toolDescKarte"),
      tag: t("toolTagKarte"),
      tagColor: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "320px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
          alt="Extras & Tools"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#1a1a2e]/90 via-[#1db682]/60 to-[#6991d8]/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4 text-yellow-300" /> {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            {t("heroTitle")}<br />
            <span className="text-[#a8f0d8]">{t("heroSubtitle")}</span>
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            {t("heroDesc")}
          </p>
          {/* Quick-Links */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { href: "/ki-reiseplaner/", label: t("quickLinkKiPlaner") },
              { href: "/visum-checker/",  label: t("quickLinkVisum") },
              { href: "/reisewarnungen/", label: t("quickLinkWarnungen") },
              { href: "/preisentwicklung/", label: t("quickLinkPreise") },
              { href: "/urlaubsguides/",  label: t("quickLinkGuides") },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0 space-y-12">

            {/* ── Featured: KI-Planer + Preisentwicklung ── */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("featuredEyebrow")}</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{t("featuredTitle")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FEATURED.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Link
                      key={f.href}
                      href={f.href}
                      className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                      style={{ minHeight: "240px" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.img}
                        alt={f.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-linear-to-t ${f.accent} to-transparent`} />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full text-white mb-3 self-start ${f.badgeColor}`}>
                          <Icon className="w-3 h-3" /> {f.badge}
                        </span>
                        <h3 className="text-xl font-black text-white mb-1.5">{f.title}</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">{f.desc}</p>
                        <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-xl self-start group-hover:bg-gray-50 transition-colors">
                          {f.cta}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ── All Tools Grid ── */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">{t("toolsEyebrow")}</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{t("toolsTitle")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tool.img}
                          alt={tool.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                        <div className={`absolute top-3 left-3 w-8 h-8 rounded-lg ${tool.iconBg} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                        </div>
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                          {tool.tag}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#1db682] transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                        <span className="inline-flex items-center gap-1 text-[#1db682] text-sm font-semibold mt-3">
                          {t("toolOpenLabel")}
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70",
                  eyebrow: t("sidebarEyebrow"),
                  title: t("sidebarTitle"),
                  description: t("sidebarDesc"),
                  href: "/guenstig-urlaub-buchen/",
                  ctaLabel: t("sidebarCta"),
                }}
                seoLinksTitle={t("seoLinksTitle")}
                seoLinks={[
                  { href: "/ki-reiseplaner/",    label: t("seoLinkKiPlaner") },
                  { href: "/visum-checker/",     label: t("seoLinkVisum") },
                  { href: "/reisewarnungen/",    label: t("seoLinkWarnungen") },
                  { href: "/preisentwicklung/",  label: t("seoLinkPreise") },
                  { href: "/reiseversicherung/", label: t("seoLinkVersicherung") },
                  { href: "/urlaubsguides/",     label: t("seoLinkGuides") },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
