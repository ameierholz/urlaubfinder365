import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG, type CatalogEntry } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import CountryHoverCard from "@/components/destinations/CountryHoverCard";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RightSidebar from "@/components/layout/RightSidebar";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🌍 Alle Urlaubsziele ${YEAR} – Pauschalreisen weltweit`,
  description: `50+ Urlaubsziele ${YEAR}: Pauschalreisen, All Inclusive & Last Minute nach Türkei, Mallorca, Griechenland, Ägypten, Thailand & mehr ✓ Jetzt vergleichen.`,
  keywords: ["Urlaubsziele", "Pauschalreisen Türkei", "Pauschalreisen Mallorca", "Urlaub Griechenland", "Urlaub Ägypten", "Urlaubsziele weltweit"],
  alternates: { canonical: `${BASE_URL}/urlaubsziele/` },
  openGraph: {
    title: `🌍 Alle Urlaubsziele ${YEAR} – Pauschalreisen weltweit | Urlaubfinder365`,
    description: `50+ Urlaubsziele ${YEAR}: Pauschalreisen, All Inclusive & Last Minute nach Türkei, Mallorca, Griechenland, Ägypten, Thailand & mehr ✓ Jetzt vergleichen.`,
    url: `${BASE_URL}/urlaubsziele/`,
    images: [{ url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop&q=80&auto=format", width: 1200, height: 630, alt: "Urlaubsziele weltweit" }],
  },
};

// ─── Kontinente ───────────────────────────────────────────────────────────────

interface Continent {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  desc: string;
  slugs: string[];
  top5: string[]; // Die 5 beliebtesten Ziele – 2 groß + 3 mittel
}

// ─── Helper: CatalogEntry → CountryHoverCard props ───────────────────────────

function entryToCardProps(entry: CatalogEntry, ibeLang = "de") {
  const bookingBase = `https://ibe.specials.de/?action=offer&agent=993243&product=package&language=${ibeLang}&duration=7-7&adults=2&minRecommrate=30&hSort=recomrate&sortType=down`;
  const bookingUrl = entry.ibeRegionId
    ? `${bookingBase}&regionId=${entry.ibeRegionId}`
    : `${bookingBase}&regionId=0`;
  return {
    name:       entry.name,
    subtitle:   entry.country ?? "Urlaubsziele",
    slug:       entry.slug,
    imgUrl:     generateHeroFallback(entry.unsplashKeyword),
    regionId:   entry.ibeRegionId,
    bookingUrl,
  };
}

function getEntriesBySlugs(slugs: string[]): CatalogEntry[] {
  return slugs
    .map((s) => CATALOG.find((e) => e.slug === s))
    .filter((e): e is CatalogEntry => !!e)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("urlaubszielePage");
  const ibeLang = locale === "es" ? "sp" : locale === "ar" ? "en" : locale;

  const CONTINENTS: Continent[] = [
    {
      id: "europa",
      label: t("continentEuropa"),
      emoji: "🏰",
      gradient: "from-blue-900 via-[#1b6ca8] to-[#00838F]",
      desc: t("continentEuropaDesc", { year: YEAR }),
      top5: ["mallorca", "teneriffa", "kreta", "griechische-inseln", "costa-del-sol"],
      slugs: [
        "amalfikusste", "andalusien", "aragonien", "athen", "azoren",
        "balearen", "barcelona", "baltikum", "benelux", "benidorm", "bulgarien",
        "chalkidiki", "costa-blanca", "costa-brava", "costa-da-caparica", "costa-de-almeria",
        "costa-de-la-luz", "costa-de-prata", "costa-del-azahar", "costa-del-sol",
        "costa-do-estoril", "costa-dorada", "costa-verde-portugal", "cote-dazur",
        "daenemark", "deutschland-nord", "deutschland-sued", "dublin", "dubrovnik",
        "el-hierro", "europa-ost", "europa-sued-ost",
        "formentera", "frankreich", "fuerteventura",
        "gardasee", "goldstrand", "gozo", "gran-canaria", "granada", "griechenland",
        "griechische-inseln", "grossbritannien",
        "ibiza", "insel-hvar", "island-nordatlantik", "istrien", "italien",
        "kalabrien", "kanaren", "katalonien", "kefalonia", "korfu", "korsika",
        "kos", "kroatien", "kreta",
        "la-gomera", "la-palma", "lanzarote", "lefkas", "ligurien", "lissabon", "london",
        "madrid", "mallorca", "malta", "malta-insel", "marbella", "menorca", "mykonos",
        "navarra-la-rioja", "nord-portugal",
        "oesterreich",
        "paris", "porto", "porto-santo", "portugal", "provence", "pyrenäen",
        "rhodos", "rom",
        "santorin", "sardinien", "schweiz", "sevilla", "sizilien", "skandinavien",
        "sonnenstrand", "spanien", "spanische-atlantikkueste", "split",
        "teneriffa", "thassos", "toskana",
        "valencia", "venedig",
        "zakynthos", "zentral-portugal", "zentral-spanien", "zypern", "zypern-sued",
        "alentejo", "algarve", "apulien", "murcia",
      ],
    },
    {
      id: "asien",
      label: t("continentAsien"),
      emoji: "🌏",
      gradient: "from-pink-900 via-pink-700 to-rose-600",
      desc: t("continentAsienDesc"),
      top5: ["tuerkei", "dubai", "thailand", "malediven", "bali"],
      slugs: [
        "abu-dhabi", "alanya", "antalya-stadt", "asien",
        "bali", "bangkok", "belek",
        "cesme",
        "dalyan", "dubai",
        "fethiye",
        "goa",
        "halbinsel-bodrum",
        "indien", "indischer-ozean", "istanbul",
        "japan", "jordanien",
        "kappadokien", "katar", "khao-lak", "ko-samui", "krabi", "kusadasi",
        "malaysia", "malediven", "marmara-meer", "marmaris", "mauritius",
        "oman",
        "philippinen", "phuket",
        "ras-al-khaimah",
        "seychellen", "side", "singapur", "sri-lanka",
        "thailand", "tokyo", "tuerkei", "tuerkei-inland", "tuerkische-aegaeis",
        "tuerkische-riviera", "tuerkische-schwarzmeerkueste",
        "vae", "vietnam", "vorderer-orient",
      ],
    },
    {
      id: "afrika",
      label: t("continentAfrika"),
      emoji: "🌍",
      gradient: "from-amber-900 via-amber-700 to-yellow-600",
      desc: t("continentAfrikaDesc"),
      top5: ["aegypten", "hurghada", "tunesien", "marokko", "kapverden"],
      slugs: [
        "aegypten", "agadir", "afrika", "afrika-sued",
        "djerba",
        "el-gouna",
        "hammamet", "hurghada",
        "kapstadt", "kapverden", "kenia-kueste",
        "marokko", "marrakesch", "marsa-alam", "monastir",
        "sansibar", "sharm-el-sheikh",
        "tunesien",
      ],
    },
    {
      id: "amerika",
      label: t("continentAmerika"),
      emoji: "🌴",
      gradient: "from-cyan-900 via-cyan-700 to-teal-600",
      desc: t("continentAmerikaDesc"),
      top5: ["dominikanische-republik", "cancun", "kuba", "punta-cana", "new-york"],
      slugs: [
        "aruba",
        "barbados",
        "california", "cancun", "curacao",
        "dominikanische-republik",
        "florida-orlando", "florida-ostkueste",
        "havanna",
        "jamaika",
        "kalifornien", "kanada", "karibik", "kuba",
        "mexiko",
        "new-york",
        "puerto-plata", "punta-cana",
        "riviera-maya",
        "suedamerika",
        "usa-ostkueste", "usa-westkueste",
        "yucatan",
      ],
    },
    {
      id: "australien",
      label: t("continentAustralien"),
      emoji: "🦘",
      gradient: "from-emerald-900 via-emerald-700 to-teal-600",
      desc: t("continentAustralienDesc"),
      top5: ["australien", "neuseeland", "fiji", "hawaii", "sydney"],
      slugs: [
        "australien", "neuseeland", "sydney", "queensland", "fiji", "hawaii", "polynesien",
      ],
    },
  ];

  const FAQS = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
    { q: t("faq6q"), a: t("faq6a") },
  ];

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Alle Urlaubsziele – Pauschalreisen & Angebote weltweit",
    description: "Übersicht aller Urlaubsziele nach Kontinenten mit günstigen Pauschalreisen, All-Inclusive-Angeboten und Last-Minute-Deals.",
    url: `${BASE_URL}/urlaubsziele/`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Urlaubsziele", item: `${BASE_URL}/urlaubsziele/` },
      ],
    },
  };

  return (
    <div className="bg-white">
      <JsonLd data={collectionPageSchema} />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[#003d47]" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 flex">
          <img src={generateHeroFallback("mallorca cove beach")} className="w-1/3 h-full object-cover opacity-55" alt="" aria-hidden="true" />
          <img src={generateHeroFallback("santorini blue dome white buildings caldera")} className="w-1/3 h-full object-cover opacity-55" alt="" aria-hidden="true" />
          <img src={generateHeroFallback("antalya turkey turquoise coast")} className="w-1/3 h-full object-cover opacity-55" alt="" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-[#003d47]/65 via-[#003d47]/45 to-[#003d47]/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-14 text-center">
          <nav className="flex items-center justify-center gap-1.5 text-white/55 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">{t("breadcrumbHome")}</Link>
            <span>›</span>
            <span className="text-white/90">{t("breadcrumbCurrent")}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-7">
            {t("heroSubtitle")}
          </p>
          {/* Kontinent-Schnellnavigation */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CONTINENTS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
              >
                <span>{c.emoji}</span> {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:flex xl:gap-8 xl:items-start">

          {/* ── Main Column ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* ── Kontinent-Sektionen ─────────────────────────────────────── */}
            {CONTINENTS.map((continent) => {
              const allEntries = getEntriesBySlugs(continent.slugs);
              if (allEntries.length === 0) return null;

              // Top 5 in definierter Reihenfolge (nicht alphabetisch)
              const top5 = continent.top5
                .map((s) => allEntries.find((e) => e.slug === s))
                .filter((e): e is CatalogEntry => !!e);
              const top5Slugs = new Set(top5.map((e) => e.slug));
              const rest = allEntries.filter((e) => !top5Slugs.has(e.slug));

              return (
                <section key={continent.id} id={continent.id} className="scroll-mt-24">

                  {/* Kontinent-Header-Banner */}
                  <div className="relative rounded-2xl overflow-hidden mb-6">
                    <div className={`absolute inset-0 bg-linear-to-br ${continent.gradient}`} />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                      <span className="text-5xl shrink-0 drop-shadow">{continent.emoji}</span>
                      <div>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">{t("continentDestinationsLabel")}</p>
                        <h2 className="text-xl font-black text-white leading-tight">{continent.label}</h2>
                        <p className="text-sm text-white/70 mt-0.5 line-clamp-1">{continent.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top 5 Highlight: 2 groß + 3 mittel */}
                  {top5.length > 0 && (
                    <div className="mb-5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {t("topDestinations")}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {top5.slice(0, 2).map((entry) => (
                          <CountryHoverCard key={entry.slug} dest={entryToCardProps(entry, ibeLang)} className="h-56 sm:h-64" />
                        ))}
                      </div>
                      {top5.length > 2 && (
                        <div className="grid grid-cols-3 gap-3">
                          {top5.slice(2, 5).map((entry) => (
                            <CountryHoverCard key={entry.slug} dest={entryToCardProps(entry, ibeLang)} className="h-44 sm:h-48" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Restliche Destinations alphabetisch */}
                  {rest.length > 0 && (
                    <>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-6">
                        {t("allDestinationsLabel", { continent: continent.label })}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {rest.map((entry) => (
                          <CountryHoverCard key={entry.slug} dest={entryToCardProps(entry, ibeLang)} className="h-40" />
                        ))}
                      </div>
                    </>
                  )}
                </section>
              );
            })}

            {/* ── FAQ ─────────────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">❓</span>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">{t("faqTitle")}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{t("faqSubtitle")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-start gap-2">
                      <span className="text-[#00838F] font-black mt-0.5 shrink-0">Q</span>
                      {q}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA Banner ──────────────────────────────────────────────── */}
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={generateHeroFallback("tropical beach sunset golden hour paradise")}
                alt={t("ctaTitle")}
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#003d47]/90 to-[#00838F]/70" />
              <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-8 py-6 gap-4">
                <div className="text-white text-center sm:text-left">
                  <p className="text-sm text-white/70 mb-1">{t("ctaEyebrow")}</p>
                  <h3 className="text-2xl font-extrabold">{t("ctaTitle")}</h3>
                </div>
                <Link
                  href="/guenstig-urlaub-buchen/"
                  className="shrink-0 bg-sand-500 hover:bg-sand-400 text-white font-bold px-8 py-3 rounded-full text-sm shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {t("ctaButton")}
                </Link>
              </div>
            </div>

          </div>{/* end main column */}

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                dealRegionIds={[141, 149, 128, 171, 130, 4]}
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
                  eyebrow: t("sidebarEyebrow"),
                  title: t("sidebarTitle"),
                  description: t("sidebarDescription"),
                  href: "/guenstig-urlaub-buchen/",
                  ctaLabel: t("sidebarCta"),
                }}
                seoLinksTitle={t("sidebarLinksTitle")}
                seoLinks={[
                  { href: "/urlaubsziele/tuerkei/",            label: t("sidebarLinkTuerkei") },
                  { href: "/urlaubsziele/balearen/",           label: t("sidebarLinkBalearen") },
                  { href: "/urlaubsziele/griechische-inseln/", label: t("sidebarLinkGriechenland") },
                  { href: "/urlaubsziele/aegypten/",           label: t("sidebarLinkAegypten") },
                  { href: "/urlaubsziele/italien/",            label: t("sidebarLinkItalien") },
                  { href: "/urlaubsthemen/",                   label: t("sidebarLinkUrlaubsthemen") },
                  { href: "/urlaubsarten/last-minute-urlaub/", label: t("sidebarLinkLastMinute") },
                ]}
              />
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
}
