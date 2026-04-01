import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATALOG, CatalogEntry } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import CountryHoverCard from "@/components/destinations/CountryHoverCard";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import DestinationCarousel from "@/components/ui/DestinationCarousel";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Alle Urlaubsziele – Pauschalreisen & Angebote weltweit",
  description:
    "Alle Urlaubsziele auf einen Blick: Pauschalreisen, All-Inclusive & Last-Minute nach Spanien, Türkei, Griechenland, Ägypten, Thailand & mehr. Jetzt günstig vergleichen & buchen.",
  alternates: { canonical: `${BASE_URL}/urlaubsziele/` },
};

// ─── TOP 10 Urlaubsziele (Hero-Grid) ─────────────────────────────────────────

interface TopDest {
  name: string;
  subtitle: string;
  slug: string;
  flagCode?: string;
  unsplashKeyword: string;
  countryId?: string;   // for /api/country-top (countryId param)
  ibeRegionId?: string; // fallback regionId (e.g. Ägypten)
  bookingUrl: string;   // IBE deep-link for "Alle anzeigen" CTA
}

const TOP_DESTINATIONS: TopDest[] = [
  {
    name: "Türkei",
    subtitle: "Antalya · Türkische Riviera",
    slug: "tuerkei",
    flagCode: "tr",
    unsplashKeyword: "turkey turquoise coast sailing",
    countryId: "TR",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=TR&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Spanien",
    subtitle: "Mallorca · Kanaren · Festland",
    slug: "balearen",
    flagCode: "es",
    unsplashKeyword: "balearic islands turquoise cove",
    countryId: "ES",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=ES&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Griechenland",
    subtitle: "Inselhopping · Kreta · Santorin",
    slug: "griechische-inseln",
    flagCode: "gr",
    unsplashKeyword: "santorini blue dome sunset",
    countryId: "GR",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=GR&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Ägypten",
    subtitle: "Hurghada · Marsa Alam",
    slug: "aegypten",
    flagCode: "eg",
    unsplashKeyword: "hurghada egypt red sea",
    ibeRegionId: "651",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&regionId=651&duration=7-7&adults=2&minRecommrate=0&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Italien",
    subtitle: "Bibione · Rimini · Gardasee",
    slug: "italien",
    flagCode: "it",
    unsplashKeyword: "amalfi coast italy cliffs",
    countryId: "IT",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=IT&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Deutschland",
    subtitle: "Bayern · Mecklenburg · Ostsee",
    slug: "deutschland-nord",
    flagCode: "de",
    unsplashKeyword: "bavaria germany alps",
    countryId: "DE",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=DE&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Portugal",
    subtitle: "Algarve · Lissabon · Madeira",
    slug: "portugal",
    flagCode: "pt",
    unsplashKeyword: "algarve portugal beach",
    countryId: "PT",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=PT&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Tunesien",
    subtitle: "Djerba · Hammamet · Monastir",
    slug: "tunesien",
    flagCode: "tn",
    unsplashKeyword: "djerba tunisia beach",
    countryId: "TN",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=TN&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "USA",
    subtitle: "New York · Florida · Westküste",
    slug: "usa-ostkueste",
    flagCode: "us",
    unsplashKeyword: "new york city skyline manhattan",
    countryId: "US",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=US&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
  {
    name: "Malediven",
    subtitle: "Atolle · Overwater Bungalows",
    slug: "indischer-ozean",
    flagCode: "mv",
    unsplashKeyword: "maldives overwater bungalow turquoise lagoon",
    countryId: "MV",
    bookingUrl: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&countryId=MV&duration=7-7&adults=2&minRecommrate=50&minRating=0&minPrice=0&hSort=recomrate&sortType=down",
  },
];

// ─── Kontinent-Gruppen ────────────────────────────────────────────────────────

interface ContinentGroup {
  label: string;
  emoji: string;
  flagCode?: string;
  color: string;
  slugs: string[];
  desc: string;
  ibeRegionId?: string;
}

const CONTINENT_GROUPS: ContinentGroup[] = [
  // ── 1. Türkei ── beliebtestes Urlaubsland der Deutschen
  {
    label: "Türkei",
    emoji: "🇹🇷",
    flagCode: "tr",
    color: "bg-red-100 text-red-700",
    slugs: ["tuerkei"],
    desc: "Antalya, Bodrum, Side und Alanya – die Türkei punktet mit modernen 5-Sterne-Resorts, türkisfarbenem Meer und preiswerten All-Inclusive-Angeboten.",
    ibeRegionId: "724",
  },
  // ── 2. Spanien & Inseln ── Kanaren-ID für maximale Ortsvielfalt
  {
    label: "Spanien & Inseln",
    emoji: "🇪🇸",
    flagCode: "es",
    color: "bg-sand-100 text-sand-700",
    slugs: ["balearen", "kanaren", "spanien"],
    desc: "Mallorca, Teneriffa, Gran Canaria & das spanische Festland – traumhafte Strände, sonniges Klima und exzellente All-Inclusive-Hotels machen Spanien zum Klassiker für Pauschalreisen.",
    ibeRegionId: "851",   // Kanaren → 7 Inseln = maximale Ortsvielfalt
  },
  // ── 3. Griechenland ──
  {
    label: "Griechenland",
    emoji: "🇬🇷",
    flagCode: "gr",
    color: "bg-blue-100 text-blue-700",
    slugs: ["griechische-inseln", "griechenland"],
    desc: "Santorin, Kreta, Rhodos, Korfu – Griechenland begeistert mit kristallklarem Wasser, weißgetünchten Häusern und jahrtausendealter Geschichte.",
    ibeRegionId: "100002",  // Griechische Inseln
  },
  // ── 4. Ägypten & Nordafrika ──
  {
    label: "Ägypten & Nordafrika",
    emoji: "🏺",
    color: "bg-amber-100 text-amber-700",
    slugs: ["aegypten", "tunesien", "marokko"],
    desc: "Hurghada und Sharm el-Sheikh für Taucher und Schnorchler. Marokko fasziniert mit bunten Souks und der Sahara, Tunesien bietet günstigen Badeurlaub.",
    ibeRegionId: "651",   // Ägypten
  },
  // ── 5. Italien ──
  {
    label: "Italien",
    emoji: "🇮🇹",
    flagCode: "it",
    color: "bg-green-100 text-green-700",
    slugs: ["italien"],
    desc: "Bibione, Rimini, Gardasee – Italiens vielfältige Küsten und Seen bieten für jeden das Richtige: Entspannung am Meer, Kultur in den Städten und Bergluft in den Alpen.",
    ibeRegionId: "100007",
  },
  // ── 6. Portugal & Atlantik ──
  {
    label: "Portugal & Atlantik",
    emoji: "🇵🇹",
    flagCode: "pt",
    color: "bg-green-100 text-green-700",
    slugs: ["portugal"],
    desc: "Die Algarve mit ihren Felsklippen, Lissabon als Städteziel und Madeira als Blumeninsel – Portugal bietet Vielfalt für jeden Geschmack.",
    ibeRegionId: "725",
  },
  // ── 7. Kroatien & Mittelmeer ──
  {
    label: "Kroatien & Mittelmeer",
    emoji: "🌊",
    color: "bg-teal-100 text-teal-700",
    slugs: ["kroatien", "zypern", "malta", "frankreich"],
    desc: "Von der kroatischen Adria über Zypern bis zur Côte d'Azur – traumhafte Buchten, antike Städte und Mittelmeerküche. Kroatien zählt zu den am schnellsten wachsenden Urlaubszielen.",
    ibeRegionId: "100023",  // Kroatien
  },
  // ── 8. Deutschland ──
  {
    label: "Deutschland",
    emoji: "🇩🇪",
    flagCode: "de",
    color: "bg-yellow-100 text-yellow-700",
    slugs: ["deutschland-nord", "deutschland-ost", "deutschland-sued", "deutschland-west"],
    desc: "Nordsee, Ostsee, Bayern, der Schwarzwald – Deutschland bietet Urlaubsqualität auf Weltklasseniveau. Ideal für Kurztrips, Wanderurlaube und Familienreisen.",
    ibeRegionId: "100003",
  },
  // ── 9. Asien & Indischer Ozean ──
  {
    label: "Asien & Indischer Ozean",
    emoji: "🌏",
    color: "bg-pink-100 text-pink-700",
    slugs: ["thailand", "asien", "indien", "indischer-ozean"],
    desc: "Thailand, Bali, Vietnam, Malediven – exotisches Flair, buddhistische Tempel und traumhafte Strände. Pauschalreisen in den Indischen Ozean für besondere Anlässe.",
    ibeRegionId: "100220",  // Thailand
  },
  // ── 10. Amerika & Karibik ──
  {
    label: "Amerika & Karibik",
    emoji: "🌴",
    color: "bg-cyan-100 text-cyan-700",
    slugs: ["dominikanische-republik", "kuba", "mexiko", "karibik", "usa-ostkueste"],
    desc: "Punta Cana, Cancún, New York, Havanna – All-Inclusive-Strandresorts bis Ostküsten-Städtereise. Mexikos Riviera Maya als beliebtestes Fernziel der Deutschen.",
    ibeRegionId: "100017",  // Karibik
  },
  // ── 11. Afrika & Naher Osten ──
  {
    label: "Afrika & Naher Osten",
    emoji: "🌍",
    color: "bg-sand-100 text-sand-700",
    slugs: ["vae", "vorderer-orient", "afrika", "afrika-sued", "afrika-west"],
    desc: "Dubai und die VAE für Luxusreisende. Südafrika mit Safari und Kapstadt. Kapverdische Inseln mit atlantischem Karibik-Feeling das ganze Jahr.",
    ibeRegionId: "650",     // VAE / Dubai
  },
  // ── 12. Mittel- & Westeuropa ──
  {
    label: "Mittel- & Westeuropa",
    emoji: "🏰",
    color: "bg-purple-100 text-purple-700",
    slugs: ["oesterreich", "schweiz", "benelux", "grossbritannien"],
    desc: "Wien, Amsterdam, London, Genf – Europas kulturelle Metropolen und die Alpen locken das ganze Jahr. Österreich und die Schweiz bieten Sommer- und Wintersport.",
    ibeRegionId: "572",     // Österreich
  },
  // ── 13. Nord- & Osteuropa ──
  {
    label: "Nord- & Osteuropa",
    emoji: "🌲",
    color: "bg-emerald-100 text-emerald-700",
    slugs: ["skandinavien", "daenemark", "baltikum", "europa-ost", "island-nordatlantik"],
    desc: "Nordlichter über Island, Fjorde in Norwegen, historische Altstädte in Tallinn und Prag – Nord- und Osteuropa mit Naturwundern und günstigen Preisen.",
    ibeRegionId: "100116",  // Skandinavien
  },
  // ── 14. Osteuropa & Balkan ──
  {
    label: "Osteuropa & Balkan",
    emoji: "🏔️",
    color: "bg-slate-100 text-slate-700",
    slugs: ["bulgarien", "europa-sued-ost", "europaeische-zwergstaaten"],
    desc: "Bulgariens Schwarzmeerküste für günstigen Badeurlaub, der Balkan mit Naturparks und authentischer Kulinarik. Monaco als exklusives Städtereiseziel.",
    ibeRegionId: "743",     // Bulgarien
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSuperRegions(): CatalogEntry[] {
  return CATALOG.filter((e) => e.type === "super");
}

function getEntriesBySlugs(slugs: string[]): CatalogEntry[] {
  return slugs
    .map((s) => CATALOG.find((e) => e.slug === s))
    .filter((e): e is CatalogEntry => !!e);
}

// TopDestCard → ersetzt durch CountryHoverCard (Client Component mit Tooltip)

// ─── Destination Card (Kontinent-Sektionen) ───────────────────────────────────

function DestCard({ entry }: { entry: CatalogEntry }) {
  return (
    <Link
      href={`/urlaubsziele/${entry.slug}/`}
      className="group relative rounded-2xl overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={generateHeroFallback(entry.unsplashKeyword)}
          alt={`${entry.name} Urlaub – Pauschalreisen & Angebote`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      {/* Subtiler Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

      {/* Zielname – oben links */}
      <div className="absolute top-3 left-3">
        <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md leading-none">
          {entry.name}
        </span>
      </div>

      {/* Angebote-Badge – unten links beim Hover */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <span className="bg-sand-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow flex items-center gap-0.5">
          Angebote <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UrlaubszielePage() {
  const superRegions = getSuperRegions();
  const shownSlugs = new Set<string>();

  const topItems = [
    ...TOP_DESTINATIONS.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: `${BASE_URL}/urlaubsziele/${d.slug}/`,
    })),
    ...CATALOG.filter((e) => e.type === "super" && e.tiqetsCityId)
      .slice(0, 20)
      .map((e, i) => ({
        "@type": "ListItem",
        position: TOP_DESTINATIONS.length + i + 1,
        name: e.name,
        url: `${BASE_URL}/urlaubsziele/${e.slug}/`,
      })),
  ];

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Alle Urlaubsziele – Pauschalreisen & Angebote weltweit",
    description: "Übersicht aller Urlaubsziele mit günstigen Pauschalreisen, All-Inclusive-Angeboten und Last-Minute-Deals. Über 200 Urlaubsziele weltweit vergleichen.",
    url: `${BASE_URL}/urlaubsziele/`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Urlaubsziele", item: `${BASE_URL}/urlaubsziele/` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Beliebteste Urlaubsziele",
      numberOfItems: topItems.length,
      itemListElement: topItems,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
          <Link
            href="/guenstig-urlaub-buchen/"
            className="inline-flex items-center gap-2 bg-sand-500 hover:bg-sand-400 text-white font-bold px-8 py-3 rounded-full text-base shadow-lg transition-all hover:-translate-y-0.5"
          >
            Jetzt Urlaub suchen →
          </Link>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* ── SEO Intro ───────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            Urlaubsziele weltweit – günstig vergleichen &amp; buchen
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Ob Badeurlaub an der <strong className="text-gray-700">Türkischen Riviera</strong>, Städtereise nach{" "}
            <strong className="text-gray-700">Barcelona</strong> oder Fernreise auf die{" "}
            <strong className="text-gray-700">Malediven</strong> – täglich aktualisierte{" "}
            <strong className="text-gray-700">Pauschalreisen, All-Inclusive</strong> und{" "}
            <strong className="text-gray-700">Last-Minute-Deals</strong> von führenden Veranstaltern.
          </p>
        </section>

        {/* ── TOP 10 Urlaubsziele ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌍</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Top-Urlaubsziele</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6 ml-8">
            Die beliebtesten Urlaubsziele der Deutschen – mit aktuellen Pauschalreisen &amp; Angeboten
          </p>

          {/* Dynamisches Grid: TR/ES groß (col-span-2), GR/EG mittel, Rest kleiner */}
          {/* Hover → Tooltip mit TOP 5 meistbewerteten Angeboten pro Land */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TOP_DESTINATIONS.map((dest, i) => (
              <CountryHoverCard
                key={dest.slug}
                dest={{
                  name:       dest.name,
                  subtitle:   dest.subtitle,
                  slug:       dest.slug,
                  flagCode:   dest.flagCode,
                  imgUrl:     generateHeroFallback(dest.unsplashKeyword),
                  countryId:  dest.countryId,
                  regionId:   dest.ibeRegionId,
                  bookingUrl: dest.bookingUrl,
                }}
                className={
                  i < 2
                    ? "lg:col-span-2 h-44 md:h-52 lg:h-60"   // TR, ES – breit & groß
                    : i < 4
                    ? "h-44 md:h-52 lg:h-60"                   // GR, EG – gleich hoch
                    : "h-36 md:h-40"                            // IT, DE, PT, TN, USA, MV – kompakt
                }
              />
            ))}
          </div>
        </section>

        {/* ── Kontinent-Sektionen ──────────────────────────────────────────── */}
        {CONTINENT_GROUPS.map((group) => {
          const entries = getEntriesBySlugs(group.slugs).filter((e) => {
            if (shownSlugs.has(e.slug)) return false;
            shownSlugs.add(e.slug);
            return true;
          });
          if (entries.length === 0) return null;

          return (
            <section key={group.label}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                {group.flagCode ? (
                  <img
                    src={`https://flagcdn.com/w40/${group.flagCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${group.flagCode}.png 2x`}
                    width={28}
                    height={20}
                    alt={`${group.label}`}
                    className="rounded shadow-sm object-cover shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl leading-none">{group.emoji}</span>
                )}
                <h2 className="text-2xl font-extrabold text-gray-900">{group.label}</h2>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${group.color} hidden sm:inline-block`}>
                  {entries.length} {entries.length === 1 ? "Reisegebiet" : "Reisegebiete"}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-3xl">
                {group.desc}
              </p>

              {/* Destination Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {entries.map((entry) => (
                  <DestCard key={entry.slug} entry={entry} />
                ))}
              </div>

              {/* IBE Angebote – neue IbeTeaser Cards */}
              {group.ibeRegionId && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Aktuelle Angebote –{" "}
                      <span className="text-sand-500">{group.label}</span>
                    </h3>
                    <Link
                      href={`/urlaubsziele/${group.slugs[0]}/`}
                      className="text-sm text-[#00838F] font-semibold hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      Alle ansehen <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <IbeTeaser
                    regionId={group.ibeRegionId}
                    headline={group.label}
                    hideHeading
                    from="14"
                    to="42"
                    duration="7-7"
                    adults="2"
                    category="3"
                    minRecommrate="30"
                    diverseResults
                  />
                </div>
              )}

              <div className="border-b border-gray-100 mt-12" />
            </section>
          );
        })}

        {/* ── Weitere Urlaubsziele ─────────────────────────────────────────── */}
        {(() => {
          const remaining = superRegions.filter((e) => !shownSlugs.has(e.slug));
          if (remaining.length === 0) return null;
          return (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌐</span>
                <h2 className="text-2xl font-extrabold text-gray-900">Weitere Urlaubsziele</h2>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hidden sm:inline-block">
                  {remaining.length} Reisegebiete
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-3xl">
                Noch mehr Urlaubsziele weltweit – von Mittelamerika über Kanada bis zur Golf-von-Mexiko-Küste.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {remaining.map((entry) => (
                  <DestCard key={entry.slug} entry={entry} />
                ))}
              </div>
              <div className="border-b border-gray-100 mt-12" />
            </section>
          );
        })()}

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
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
              <div
                key={q}
                className="bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-gray-100"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-[#00838F] font-black mt-0.5 shrink-0">Q</span>
                  {q}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
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

      </div>

      {/* Beliebte Reiseziele – Carousel */}
      <DestinationCarousel title="Beliebte Reiseziele auf einen Blick" />

    </div>
  );
}
