import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG, type CatalogEntry } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import CountryHoverCard from "@/components/destinations/CountryHoverCard";
import { setRequestLocale } from "next-intl/server";
import RightSidebar from "@/components/layout/RightSidebar";
import { getDealDesTages } from "@/data/deals-des-tages";

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
    images: [{ url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "Urlaubsziele weltweit" }],
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
}

const CONTINENTS: Continent[] = [
  {
    id: "europa",
    label: "Europa",
    emoji: "🏰",
    gradient: "from-blue-900 via-[#1b6ca8] to-[#00838F]",
    desc: `Von den Stränden Mallorcas bis zu den Fjorden Norwegens – Europa bietet für jeden Urlaubstyp das perfekte Reiseziel. Pauschalreisen ${YEAR} mit Flug & Hotel zum Bestpreis.`,
    slugs: [
      "balearen", "kanaren", "spanien",
      "griechische-inseln", "griechenland",
      "italien",
      "portugal",
      "kroatien", "zypern", "malta", "frankreich",
      "deutschland-nord", "deutschland-ost", "deutschland-sued", "deutschland-west",
      "oesterreich", "schweiz", "benelux", "grossbritannien",
      "skandinavien", "daenemark", "baltikum", "europa-ost", "island-nordatlantik",
      "bulgarien", "europa-sued-ost", "europaeische-zwergstaaten",
    ],
  },
  {
    id: "tuerkei-naher-osten",
    label: "Türkei & Naher Osten",
    emoji: "🕌",
    gradient: "from-red-900 via-red-700 to-orange-600",
    desc: "Die Türkei ist das Nummer-1-Urlaubsziel der Deutschen – Antalya, Bodrum, Side und Alanya mit modernen 5-Sterne-Resorts. Die VAE und Dubai für Luxusreisen das ganze Jahr.",
    slugs: ["tuerkei", "vae", "vorderer-orient"],
  },
  {
    id: "afrika",
    label: "Afrika & Nordafrika",
    emoji: "🌍",
    gradient: "from-amber-900 via-amber-700 to-yellow-600",
    desc: "Hurghada und Sharm el-Sheikh für Taucher und Schnorchler, Tunesien und Marokko für Kulturreisende – Nordafrika und Sub-Sahara als unvergessliche Reiseziele.",
    slugs: ["aegypten", "tunesien", "marokko", "afrika", "afrika-sued", "afrika-west"],
  },
  {
    id: "asien",
    label: "Asien & Ozeanien",
    emoji: "🌏",
    gradient: "from-pink-900 via-pink-700 to-rose-600",
    desc: "Thailand, Malediven, Bali und Vietnam – exotisches Flair, buddhistische Tempel und traumhafte Strände im Indischen Ozean. Fernreisen für besondere Anlässe.",
    slugs: ["thailand", "asien", "indien", "indischer-ozean"],
  },
  {
    id: "amerika",
    label: "Amerika & Karibik",
    emoji: "🌴",
    gradient: "from-cyan-900 via-cyan-700 to-teal-600",
    desc: "Punta Cana, Cancún, New York, Havanna – All-Inclusive-Strandresorts in der Karibik bis zur Ostküsten-Städtereise. Mexikos Riviera Maya als Top-Fernziel der Deutschen.",
    slugs: ["dominikanische-republik", "kuba", "mexiko", "karibik", "usa-ostkueste"],
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Wann buche ich eine Pauschalreise am günstigsten?",
    a: "Die günstigsten Pauschalreisen gibt es oft bei Frühbucher-Angeboten (8–12 Monate vor Reiseantritt) oder als Last-Minute-Deal (0–14 Tage vor Abflug). Reisen in der Nebensaison – z. B. Mai/Juni oder September/Oktober – sind meist deutlich günstiger als im Hochsommer.",
  },
  {
    q: "Was ist der Unterschied zwischen Pauschalreise und All-Inclusive?",
    a: "Eine Pauschalreise kombiniert Flug und Hotel zu einem Gesamtpreis. All-Inclusive ist eine Verpflegungsform, bei der Mahlzeiten und Getränke inklusive sind. Man kann eine Pauschalreise also mit verschiedenen Verpflegungsarten buchen: Nur Übernachtung, Frühstück, Halbpension oder All-Inclusive.",
  },
  {
    q: "Welche Urlaubsziele eignen sich für Familien mit Kindern?",
    a: "Für Familien besonders beliebt sind die Türkei (Antalya, Side), die Balearen (Mallorca), Ägypten (Hurghada) und Griechenland (Kreta, Korfu). Diese Ziele bieten flache Strände, kinderfreundliche Hotels mit Animation und kurze Flugzeiten.",
  },
  {
    q: "Wie finde ich die günstigsten Last-Minute-Deals?",
    a: "Last-Minute-Angebote entstehen, wenn Reiseveranstalter kurzfristig freie Kapazitäten günstig anbieten. Auf Urlaubfinder365 findest du täglich aktualisierte Deals. Die besten Angebote gibt es oft 1–3 Wochen vor Abflug – Flexibilität beim Ziel und Abflughafen erhöht die Auswahl.",
  },
  {
    q: "Welche Urlaubsziele sind ganzjährig empfehlenswert?",
    a: "Ganzjährig bereisbar sind die Kanarischen Inseln, Dubai/VAE, Thailand (außerhalb Regenzeit) und die Kapverdischen Inseln. Für Kulturreisen eignen sich Städte wie Rom, Barcelona oder Istanbul zu jeder Jahreszeit.",
  },
  {
    q: "Für welche Ziele brauche ich als Deutscher ein Visum?",
    a: "Für Reisen in die EU sowie Türkei, Ägypten, Tunesien und Thailand benötigen Deutsche in der Regel kein Visum. Für USA/Kanada/Australien ist eine elektronische Reisegenehmigung (ESTA/ETA) nötig. Für Indien und Vietnam ist ein Visum erforderlich.",
  },
];

// ─── Helper: CatalogEntry → CountryHoverCard props ───────────────────────────

function entryToCardProps(entry: CatalogEntry) {
  const bookingBase = "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&duration=7-7&adults=2&minRecommrate=30&hSort=recomrate&sortType=down";
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
    .filter((e): e is CatalogEntry => !!e);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />

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
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <span className="text-white/90">Urlaubsziele</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
            Urlaubsziele weltweit – Pauschalreisen günstig buchen
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-7">
            Vergleiche günstige Pauschalreisen, All-Inclusive &amp; Last-Minute für über 200 Urlaubsziele weltweit.
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
              const entries = getEntriesBySlugs(continent.slugs);
              if (entries.length === 0) return null;

              return (
                <section key={continent.id} id={continent.id} className="scroll-mt-24">

                  {/* Kontinent-Header-Banner */}
                  <div className="relative rounded-2xl overflow-hidden mb-6">
                    <div className={`absolute inset-0 bg-linear-to-br ${continent.gradient}`} />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative z-10 px-6 py-5 flex items-center gap-5">
                      <span className="text-5xl shrink-0 drop-shadow">{continent.emoji}</span>
                      <div>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Urlaubsziele</p>
                        <h2 className="text-xl font-black text-white leading-tight">{continent.label}</h2>
                        <p className="text-sm text-white/70 mt-0.5 line-clamp-1">{continent.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Destination-Kacheln */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {entries.map((entry, i) => (
                      <CountryHoverCard
                        key={entry.slug}
                        dest={entryToCardProps(entry)}
                        className={i < 2 ? "h-48" : "h-40"}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ── FAQ ─────────────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">❓</span>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Häufige Fragen rund ums Reisen</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Tipps zum Buchen, Reisezeitplanung &amp; mehr</p>
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
                alt="Günstige Pauschalreisen buchen"
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#003d47]/90 to-[#00838F]/70" />
              <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between px-8 py-6 gap-4">
                <div className="text-white text-center sm:text-left">
                  <p className="text-sm text-white/70 mb-1">Dein Traumurlaub wartet</p>
                  <h3 className="text-2xl font-extrabold">Pauschalreisen günstig buchen &amp; sparen</h3>
                </div>
                <Link
                  href="/guenstig-urlaub-buchen/"
                  className="shrink-0 bg-sand-500 hover:bg-sand-400 text-white font-bold px-8 py-3 rounded-full text-sm shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Alle Angebote vergleichen →
                </Link>
              </div>
            </div>

          </div>{/* end main column */}

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                dealDesTages={getDealDesTages()}
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=200&q=70",
                  eyebrow: "Jetzt buchen",
                  title: "Günstige Pauschalreisen",
                  description: "Täglich tausende Angebote vergleichen – All-Inclusive, Last-Minute & mehr.",
                  href: "/guenstig-urlaub-buchen/",
                  ctaLabel: "Angebote vergleichen →",
                }}
                seoLinksTitle="🌍 Beliebte Ziele"
                seoLinks={[
                  { href: "/urlaubsziele/tuerkei/",            label: "Türkei" },
                  { href: "/urlaubsziele/balearen/",           label: "Mallorca & Balearen" },
                  { href: "/urlaubsziele/griechische-inseln/", label: "Griechenland" },
                  { href: "/urlaubsziele/aegypten/",           label: "Ägypten" },
                  { href: "/urlaubsziele/italien/",            label: "Italien" },
                  { href: "/urlaubsthemen/",                   label: "Urlaubsthemen" },
                  { href: "/urlaubsarten/last-minute-urlaub/", label: "Last-Minute Urlaub" },
                ]}
              />
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
}
