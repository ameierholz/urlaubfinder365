import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, Flame, MapPin, ShieldCheck, RefreshCcw, BookOpen, HeartHandshake, Sparkles, Calendar, TrendingUp, ShieldAlert, Star, Compass } from "lucide-react";
import { TravelOffer } from "@/types";
import HomeSuchbox from "@/components/search/HomeSuchbox";
import HomeDealCard from "@/components/home/HomeDealCard";
import QuickCategories from "@/components/home/QuickCategories";
import { setRequestLocale, getTranslations } from "next-intl/server";
import SponsoredDealBanner from "@/components/home/SponsoredDealBanner";
import JsonLd from "@/components/seo/JsonLd";

// Below-Fold: Lazy-Load
const LifestyleSection = dynamic(() => import("@/components/home/LifestyleSection"));
const FruehbucherCards = dynamic(() => import("@/components/home/FruehbucherCards"));
const NewsletterSignup = dynamic(() => import("@/components/ui/NewsletterSignup"));
const TrustpilotWidget = dynamic(() => import("@/components/ui/TrustpilotWidget"));
const FeaturedAngebotsCarousel = dynamic(() => import("@/components/home/FeaturedAngebotsCarousel"));

// ─── SEO Metadata ────────────────────────────────────────────────────────────
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `✈ Pauschalreisen & Last Minute günstig buchen ${YEAR}`,
  description: `Pauschalreisen, All Inclusive & Last Minute ${YEAR} günstig buchen ✓ Über 50 Veranstalter ✓ Türkei ab 199€ ✓ Mallorca ab 249€ ✓ Täglich neue Deals.`,
  keywords: ["Pauschalreisen günstig buchen", "Urlaub günstig buchen", "Last Minute Urlaub", "All Inclusive Urlaub", "Pauschalreisen Türkei", "Pauschalreisen Mallorca", "Pauschalreisen Ägypten", "Billig Urlaub buchen", "Urlaubsschnäppchen", "Urlaub buchen online"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/",
    languages: {
      "de": "https://www.urlaubfinder365.de/",
      "en": "https://www.urlaubfinder365.de/en/",
      "tr": "https://www.urlaubfinder365.de/tr/",
      "es": "https://www.urlaubfinder365.de/es/",
      "fr": "https://www.urlaubfinder365.de/fr/",
      "it": "https://www.urlaubfinder365.de/it/",
      "pl": "https://www.urlaubfinder365.de/pl/",
      "ru": "https://www.urlaubfinder365.de/ru/",
      "ar": "https://www.urlaubfinder365.de/ar/",
      "x-default": "https://www.urlaubfinder365.de/",
    },
  },
  openGraph: {
    title: `✈ Pauschalreisen & Last Minute günstig buchen ${YEAR} | Urlaubfinder365`,
    description:
      "Täglich aktuelle Pauschalreisen, All Inclusive & Last Minute für Türkei, Mallorca, Griechenland & Ägypten. Jetzt Traumurlaub günstig buchen!",
    url: "https://www.urlaubfinder365.de/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: "Infinity Pool mit Meerblick – Pauschalreisen günstig buchen bei Urlaubfinder365",
      },
    ],
  },
};

// Stündlich revalidieren — Vercel CDN serviert gecachte Version sofort (TTFB ~50ms),
// Regeneration passiert im Hintergrund (stale-while-revalidate).
export const revalidate = 3600;

// ─── Täglicher Top-Deal-Fetch (bestes Angebot pro Region) ───────────────────
const API_BASE = "https://api.specials.de/package/teaser.json";
const AGENT    = "993243";

async function fetchTopDeal(regionIds: number[]): Promise<TravelOffer | null> {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    agent:         AGENT,
    regionId:      regionIds.join(","),
    duration:      "7-7",
    adults:        "2",
    from:          "14",
    to:            "42",
    minRecommrate: "90",
    hSort:         "recomrate",
    sortType:      "down",
    limit:         "30",
    _d:            today,
  });
  try {
    const res = await fetch(`${API_BASE}?${params}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const json = JSON.parse(text);
    const raw = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: TravelOffer[] = raw?.data ?? raw?.packages ?? raw?.items ?? [];
    if (!data.length) return null;
    // Filter: ≥90% Empfehlung · ≥70 Bewertungen (etablierte Hotels) · gültige giataId · günstigstes gewinnt
    const qualified = data.filter((o) => {
      const rec   = Number(o.rating?.recommendation ?? 0);
      const count = Number(o.rating?.count ?? 0);
      return rec >= 90 && count >= 70 && !!o.giata_id && o.giata_id.trim().length > 0;
    });
    const pool = qualified.length > 0
      ? qualified
      : data.filter((o) => !!o.giata_id && o.giata_id.trim().length > 0);
    pool.sort((a, b) => (a.offer_price_adult ?? 0) - (b.offer_price_adult ?? 0));
    return pool[0] ?? null;
  } catch {
    return null;
  }
}

// Frühbucher: All Inclusive, 4+ Sterne, max. 1.200 €/Person, täglich rotierend
async function fetchFruehbucherDeal(regionIds: number[]): Promise<TravelOffer | null> {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const params = new URLSearchParams({
    agent:     AGENT,
    regionId:  regionIds.join(","),
    duration:  "7-14",
    adults:    "2",
    from:      "365",
    to:        "548",
    hSort:     "recomrate",
    sortType:  "down",
    limit:     "30",
    _d:        todayStr,
  });
  try {
    const res = await fetch(`${API_BASE}?${params}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const json = JSON.parse(text);
    const raw = json?.contents ? JSON.parse(String(json.contents)) : json;
    const data: TravelOffer[] = raw?.data ?? raw?.packages ?? raw?.items ?? [];
    if (!data.length) return null;

    // Nur All Inclusive, mindestens 4 Sterne, max. 1.200 €/Person, gültiges Abreisedatum
    const filtered = data.filter((o) => {
      const board = (o.board_code ?? "") + " " + (o.board_name ?? "");
      const isAI = /all.?incl/i.test(board) || /\bai\b/i.test(board);
      const stars = parseFloat(String(o.hotel_category ?? 0));
      const hasDate  = !!o.offer_from && !isNaN(new Date(o.offer_from).getTime());
      const hasGiata = !!o.giata_id && o.giata_id.trim().length > 0;
      return isAI && stars >= 4 && o.offer_price_adult <= 1200 && hasDate && hasGiata;
    });

    const pool = filtered.length > 0 ? filtered : data;
    // Täglich rotieren: Wochentag als Offset (0–6)
    const offset = today.getDay();
    return pool[offset % pool.length] ?? null;
  } catch {
    return null;
  }
}

// ─── Statische Daten ─────────────────────────────────────────────────────────

// Hero-Bild wird via next/image <Image priority> ausgeliefert (automatisches Preload + AVIF/WebP)

// Günstigsten Preis pro Person aus einem Deal-Objekt extrahieren
function minPrice(deal: TravelOffer | null, fallback: string): string {
  if (!deal?.offer_price_adult) return fallback;
  const p = Math.floor(Number(deal.offer_price_adult));
  return `ab ${p.toLocaleString("de-DE")} €`;
}

/** TOP 10 Urlaubsziele – statische Basis (Bild, Flagge, Slug, Sub) */
// Tier 1 – #1: Volle Hero-Breite
const REISEZIEL_HERO_S = {
  name: "Türkei",
  sub: "Antalya · Side · Alanya",
  slug: "tuerkei",
  flag: "tr",
  img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80&auto=format",
};

// Tier 2 – #2–4: Mittelgroße Kacheln (3 Spalten)
const REISEZIELE_MITTEL_S = [
  { name: "Spanien",     sub: "Mallorca · Teneriffa · Ibiza",     slug: "balearen",         flag: "es", img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=75&auto=format" },
  { name: "Griechenland",sub: "Kreta · Rhodos · Korfu",           slug: "griechische-inseln",flag: "gr", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=75&auto=format" },
  { name: "Ägypten",     sub: "Hurghada · Marsa Alam",            slug: "aegypten",          flag: "eg", img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=75&auto=format" },
];

// Tier 3 – #5–10: Kleinere Kacheln (6 Spalten) – Preis wird dynamisch ergänzt
const REISEZIELE_KLEIN_S = [
  { name: "Kroatien", sub: "Dubrovnik · Split · Istrien",    slug: "kroatien",       flag: "hr", img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=75&auto=format", fallback: "ab 379 €" },
  { name: "Italien",  sub: "Sizilien · Sardinien · Amalfi",  slug: "italien",        flag: "it", img: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=600&q=75&auto=format", fallback: "ab 429 €" },
  { name: "Portugal", sub: "Algarve · Madeira · Lissabon",   slug: "portugal",       flag: "pt", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=75&auto=format", fallback: "ab 399 €" },
  { name: "Dubai",    sub: "Emirate · Wüste · Skyline",      slug: "dubai",          flag: "ae", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=75&auto=format", fallback: "ab 699 €" },
  { name: "Malediven",sub: "Nord-Malé · Ari-Atoll",          slug: "indischer-ozean",flag: "mv", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=75&auto=format", fallback: "ab 1.299 €" },
  { name: "Thailand", sub: "Phuket · Koh Samui · Bangkok",   slug: "thailand",       flag: "th", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=75&auto=format", fallback: "ab 899 €" },
];


const GUIDES = [
  {
    slug: "reisefuehrer-antalya",
    dest: "Antalya",
    country: "Türkei",
    flag: "tr",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=75&auto=format",
    teaser: "Strände, Ruinen & Top-Hotels an der türkischen Riviera",
  },
  {
    slug: "reisefuehrer-mallorca",
    dest: "Mallorca",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=75&auto=format",
    teaser: "Traumstrände, Serra de Tramuntana & Palmas Altstadt",
  },
  {
    slug: "reisefuehrer-kreta",
    dest: "Kreta",
    country: "Griechenland",
    flag: "gr",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=75&auto=format",
    teaser: "Samaria-Schlucht, Knossos & griechische Gastfreundschaft",
  },
  {
    slug: "reisefuehrer-hurghada",
    dest: "Hurghada",
    country: "Ägypten",
    flag: "eg",
    img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=75&auto=format",
    teaser: "Rotes Meer, Tauchen & Wüstenabenteuer in Ägypten",
  },
  {
    slug: "reisefuehrer-barcelona",
    dest: "Barcelona",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=75&auto=format",
    teaser: "Gaudí, Tapas, Strände & katalanisches Nachtleben",
  },
];

const SEO_LINK_HREFS = [
  { key: "seoLinkTuerkei",       href: "/urlaubsziele/tuerkei/" },
  { key: "seoLinkMallorca",      href: "/urlaubsziele/balearen/" },
  { key: "seoLinkGriechenland",  href: "/urlaubsziele/griechische-inseln/" },
  { key: "seoLinkAegypten",      href: "/urlaubsziele/aegypten/" },
  { key: "seoLinkPortugal",      href: "/urlaubsziele/portugal/" },
  { key: "seoLinkKreta",         href: "/urlaubsziele/kreta/" },
  { key: "seoLinkPauschalreisen",href: "/pauschalreisen/" },
  { key: "seoLinkLastMinute",    href: "/last-minute/" },
  { key: "seoLinkAllInclusive",  href: "/urlaubsarten/all-inclusive-urlaub/" },
  { key: "seoLinkKreuzfahrten",  href: "/kreuzfahrten/" },
  { key: "seoLinkGuides",        href: "/ratgeber/" },
  { key: "seoLinkAlleZiele",     href: "/urlaubsziele/" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  // Nur 4 kritische API-Calls Server-Side (Above-Fold Preise)
  // Bulgarien/Zypern/Tunesien entfernt (nie angezeigt), Tier-3 + Frühbucher nutzen Fallback-Preise
  const [turkeyDeal, spainDeal, greeceDeal, egyptDeal] = await Promise.all([
    fetchTopDeal([149]),       // Türkei / Antalya → Hero
    fetchTopDeal([133]),       // Spanien / Mallorca → Tier-2
    fetchTopDeal([46]),        // Griechenland / Kreta → Tier-2
    fetchTopDeal([560]),       // Ägypten / Hurghada → Tier-2
  ]);

  const topDeals = [turkeyDeal, spainDeal, greeceDeal, egyptDeal].filter((o): o is TravelOffer => o !== null);

  // Frühbucher: Statische Fallback-Preise (kein API-Call mehr nötig)
  const fruehbucherDeals: (TravelOffer | null)[] = [null, null, null, null];

  // ── Destination-Kacheln ──────────────────────────────────────────────────
  const destHero   = { ...REISEZIEL_HERO_S,   priceFrom: minPrice(turkeyDeal,  "ab 299 €") };
  const destMittel = [
    { ...REISEZIELE_MITTEL_S[0], priceFrom: minPrice(spainDeal,  "ab 349 €") },
    { ...REISEZIELE_MITTEL_S[1], priceFrom: minPrice(greeceDeal, "ab 389 €") },
    { ...REISEZIELE_MITTEL_S[2], priceFrom: minPrice(egyptDeal,  "ab 449 €") },
  ];
  const destKlein  = [
    { ...REISEZIELE_KLEIN_S[0], priceFrom: REISEZIELE_KLEIN_S[0].fallback },
    { ...REISEZIELE_KLEIN_S[1], priceFrom: REISEZIELE_KLEIN_S[1].fallback },
    { ...REISEZIELE_KLEIN_S[2], priceFrom: REISEZIELE_KLEIN_S[2].fallback },
    { ...REISEZIELE_KLEIN_S[3], priceFrom: REISEZIELE_KLEIN_S[3].fallback },
    { ...REISEZIELE_KLEIN_S[4], priceFrom: REISEZIELE_KLEIN_S[4].fallback },
    { ...REISEZIELE_KLEIN_S[5], priceFrom: REISEZIELE_KLEIN_S[5].fallback },
  ];

  // ─── Strukturierte Daten (JSON-LD) – 4 Schemas für maximale Google/Bing/KI-Sichtbarkeit ───
  const BASE = "https://www.urlaubfinder365.de";

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Urlaubfinder365",
    url: `${BASE}/`,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/images/header_logo.webp`,
      width: 512,
      height: 512,
    },
    description:
      "Urlaubfinder365 vergleicht täglich tausende Urlaubsangebote führender Veranstalter – Pauschalreisen, All Inclusive und Last Minute günstig buchen.",
    areaServed: "DE",
    inLanguage: "de",
  };

  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: "Urlaubfinder365",
    url: `${BASE}/`,
    description:
      "Pauschalreisen, All-Inclusive und Last-Minute günstig buchen. Täglich aktualisierte Urlaubsangebote mit kostenlosen Urlaubsführern.",
    publisher: { "@id": `${BASE}/#organization` },
    inLanguage: "de",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/guenstig-urlaub-buchen/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wie funktioniert Urlaubfinder365?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Urlaubfinder365 vergleicht täglich tausende Urlaubsangebote von über 50 führenden Reiseveranstaltern wie TUI, Alltours, DERTOUR und ITS. Sie geben Ihr Wunschziel, Reisezeitraum und Budget ein – wir zeigen Ihnen die besten Pauschalreisen, All-Inclusive-Angebote und Last-Minute-Deals in Echtzeit.",
        },
      },
      {
        "@type": "Question",
        name: "Was ist der günstigste Zeitpunkt um eine Pauschalreise zu buchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frühbucher-Angebote (6–9 Monate vor Abreise) bieten oft die besten Preise und die größte Hotelauswahl. Last-Minute-Deals (1–3 Wochen vor Abreise) können ebenfalls sehr günstig sein, wenn noch Kapazitäten frei sind. Die günstigsten Pauschalreisen gibt es in der Nebensaison (Mai, Oktober) – oft 30–40 % günstiger als in der Hochsaison.",
        },
      },
      {
        "@type": "Question",
        name: "Was ist der Unterschied zwischen Pauschalreise und All-Inclusive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eine Pauschalreise kombiniert Flug und Hotel zu einem Gesamtpreis – die Verpflegung ist dabei frei wählbar (z. B. nur Frühstück oder Halbpension). All-Inclusive bedeutet, dass alle Mahlzeiten, Snacks, Softdrinks und meist auch alkoholische Getränke im Hotelpreis enthalten sind. All-Inclusive ist besonders für Familien und Paare empfehlenswert, die volle Kostenkontrolle möchten.",
        },
      },
      {
        "@type": "Question",
        name: "Welche Urlaubsziele sind 2026 am günstigsten?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die günstigsten Pauschalreise-Ziele 2026 sind die Türkei (ab 199 €/Person), Ägypten/Hurghada (ab 249 €/Person), Tunesien (ab 299 €/Person) und Bulgarien (ab 299 €/Person). Mallorca und die griechischen Inseln sind für den europäischen Sommerurlaub besonders beliebt und bereits ab 349 €/Person buchbar.",
        },
      },
      {
        "@type": "Question",
        name: "Gibt es Last-Minute Urlaub günstig zu buchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Last-Minute-Reisen sind 1 bis 21 Tage vor Abreise häufig deutlich günstiger als reguläre Buchungen. Auf Urlaubfinder365 werden täglich neue Last-Minute-Angebote aus über 50 Veranstalter-Katalogen aggregiert. Besonders günstige Last-Minute-Deals gibt es für die Türkei, Ägypten und die Kanarischen Inseln.",
        },
      },
    ],
  };

  const schemaItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Beliebte Urlaubsziele 2026",
    description: "Die günstigsten Pauschalreiseziele für deutsche Urlauber",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Türkei Urlaub günstig buchen",        url: `${BASE}/urlaubsziele/tuerkei/` },
      { "@type": "ListItem", position: 2, name: "Griechenland Urlaub günstig buchen",  url: `${BASE}/urlaubsziele/griechische-inseln/` },
      { "@type": "ListItem", position: 3, name: "Mallorca Urlaub günstig buchen",      url: `${BASE}/urlaubsziele/balearen/` },
      { "@type": "ListItem", position: 4, name: "Ägypten Urlaub günstig buchen",       url: `${BASE}/urlaubsziele/aegypten/` },
      { "@type": "ListItem", position: 5, name: "Portugal Urlaub günstig buchen",      url: `${BASE}/urlaubsziele/portugal/` },
      { "@type": "ListItem", position: 6, name: "Malediven Urlaub günstig buchen",     url: `${BASE}/urlaubsziele/indischer-ozean/` },
    ],
  };

  return (
    <>
      {/* JSON-LD – Organization, WebSite, ItemList, FAQPage */}
      <JsonLd data={schemaOrganization} />
      <JsonLd data={schemaWebSite} />
      <JsonLd data={schemaItemList} />
      <JsonLd data={schemaFaq} />

      {/* ══════════════════════════════════════════════════════════
          1 · HERO  –  Cinematic Full-Viewport
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative text-white flex flex-col -mt-20"
        style={{ overflowX: "clip", overflowY: "visible" }}
      >
        {/* Hero-Bild: Direkt von Unsplash (schneller als Vercel Image Optimization bei Cold Cache) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=60"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
          fetchPriority="high"
          decoding="async"
        />
        {/* ── Cinematic Overlays ── */}
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />

        {/* ── Haupt-Content ── */}
        <div className="relative flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32" style={{ overflow: "visible" }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-sand-500 rounded-full" />
            <span className="text-sand-400 text-xs font-bold uppercase tracking-[0.18em]">{t("heroEyebrow")}</span>
          </div>

          {/* H1 */}
          <h1
            className="font-black leading-tight mb-4 whitespace-normal sm:whitespace-nowrap"
            style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
          >
            {t("heroH1Line1")}<br />
            <span className="text-sand-400">{t("heroH1Line2")}</span>
          </h1>

          {/* ── Trust-Badges ── */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4">
            {[
              [t("heroTrust1Val"), t("heroTrust1Label")],
              ["100%",            t("heroTrust2Label")],
              [t("heroTrust3Val"), t("heroTrust3Label")],
            ].map(([val, label]) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-sand-400 font-black text-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>{val}</span>
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Trustpilot ── */}
          <div className="mb-3">
            <TrustpilotWidget theme="dark" />
          </div>

          {/* ── SearchBox – gleiche Kante wie Trustpilot ── */}
          <div className="-mx-4 sm:-mx-6 lg:-mx-8" style={{ overflow: "visible", position: "relative", zIndex: 20 }}>
            <div className="px-4 sm:px-6 lg:px-8">
              <HomeSuchbox />
            </div>
          </div>

          {/* ── QuickCategories – volle Breite ── */}
          <div className="-mx-4 sm:-mx-6 lg:-mx-8" style={{ zIndex: 1 }}>
            <QuickCategories transparent />
          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          3 · DEAL-KACHELN (Top Angebote – live aus der API)
      ══════════════════════════════════════════════════════════ */}
      <section id="angebote" className="py-0 overflow-hidden">

        {/* ── Header-Banner ── */}
        <div
          className="relative"
          style={{ background: "linear-gradient(135deg, #1a1200 0%, #7c5c12 50%, #c49038 100%)" }}
        >
          {/* Deko */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-sand-400/10" />
            <div className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full bg-amber-500/10" />
            <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-red-600/8" style={{ transform: "translateY(-50%)" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">

              {/* LEFT – Icon + Text */}
              <div className="flex items-center gap-5 shrink-0">
                <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-sand-500 shadow-2xl shadow-sand-500/40 relative">
                  <Flame className="w-9 h-9 text-white" />
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                    <span className="text-xs font-bold text-sand-300 uppercase tracking-widest">{t("dealsEyebrow")}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight whitespace-nowrap">
                    {t("dealsTitle")}
                  </h2>
                  <p className="text-sand-100/70 text-sm mt-1 hidden md:block">
                    {t("dealsSubtitle")}
                  </p>
                </div>
              </div>

              {/* MIDDLE – Länder-Flags */}
              <div className="flex-1 flex flex-wrap gap-2 justify-center">
                {[
                  ["tr", t("countryTurkei")],
                  ["es", t("countrySpanien")],
                  ["gr", t("countryGriechenland")],
                  ["eg", t("countryAegypten")],
                  ["it", t("countryItalien")],
                  ["hr", t("countryKroatien")],
                  ["pt", t("countryPortugal")],
                  ["bg", t("countryBulgarien")],
                  ["cy", t("countryZypern")],
                  ["tn", t("countryTunesien")],
                ].map(([code, name]) => (
                  <div key={code} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full px-3 py-1.5 transition-colors">
                    <img
                      src={`https://flagcdn.com/20x15/${code}.png`}
                      alt={name}
                      width={20}
                      height={15}
                      className="rounded-sm"
                    />
                    <span className="text-xs font-medium text-white/85">{name}</span>
                  </div>
                ))}
              </div>

              {/* RIGHT – CTA */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <Link
                  href="/urlaubsziele/"
                  className="inline-flex items-center gap-2 bg-sand-500 hover:bg-sand-400 text-white font-black px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-sand-500/40 hover:-translate-y-0.5 duration-200 whitespace-nowrap"
                >
                  {t("allDestinations")} <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-white/40 text-xs">{t("forTwoPax")}</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── Cards ── */}
        <div style={{ backgroundColor: "rgba(238,206,161,0.18)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Sponsored Deal Banner – oberhalb der regulären Deals */}
            <SponsoredDealBanner />

            {/* Label-Zeile über den Karten */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-linear-to-r from-red-700 to-sand-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md shadow-sand-500/20 uppercase tracking-wider">
                <Flame className="w-3 h-3" /> {t("topDealBadge")}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {t("dealsLabel")}
              </p>
            </div>

            {topDeals.length > 0 ? (
              <div>
                {/* Top 3 Deals (Carousel auf Mobil, Grid auf Desktop) */}
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:snap-none sm:pb-0">
                  {topDeals.slice(0, 3).map((offer, i) => (
                    <div key={offer.product_code} className="min-w-[80vw] snap-start sm:min-w-0">
                      <HomeDealCard offer={offer} priority={i === 0} featured />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>{t("dealsLoading")}</p>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          3b · FRÜHBUCHER-BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden">
        <div
          className="relative"
          style={{
            background: "linear-gradient(135deg, #0a1f35 0%, #0d4f6e 50%, #0f6e5c 100%)",
            minHeight: "220px",
          }}
        >
          {/* Dekoratives Bokeh-Muster */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-white/3" style={{ transform: "translateY(-50%)" }} />
            <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-sand-500/10" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex flex-col gap-8">

            {/* ZEILE 1 – Badge + Text + USPs */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* LEFT – Savings-Badge */}
              <div className="shrink-0 flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full bg-sand-500 shadow-2xl shadow-sand-500/40 relative">
                <div className="text-center text-white">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">{t("fbBadgeUpTo")}</div>
                  <div className="text-5xl md:text-6xl font-black leading-none">60%</div>
                  <div className="text-sm font-bold uppercase tracking-wide">{t("fbBadgeDiscount")}</div>
                </div>
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent" />
              </div>

              {/* CENTER – Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-4">
                  <span className="text-xs font-bold text-sand-300 uppercase tracking-widest">{t("fbEyebrow")}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                  {t("fbTitle")}
                </h2>
                <p className="text-blue-100/80 text-sm sm:text-base max-w-xl leading-relaxed mb-5">
                  {t("fbDesc")}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href="/urlaubsarten/fruhbucher-urlaub/"
                    className="inline-flex items-center gap-2 bg-sand-500 hover:bg-sand-600 text-white font-black px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-sand-500/40 hover:-translate-y-0.5 duration-200"
                  >
                    {t("fbCta1")} <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/last-minute/"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 duration-200"
                  >
                    {t("fbCta2")}
                  </a>
                </div>
              </div>

              {/* RIGHT – USP-Liste */}
              <div className="shrink-0 hidden lg:flex flex-col gap-3">
                {[
                  ["✓", t("fbUsp1")],
                  ["✓", t("fbUsp2")],
                  ["✓", t("fbUsp3")],
                  ["✓", t("fbUsp4")],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 text-white/90">
                    <span className="w-6 h-6 rounded-full bg-sand-500/30 border border-sand-400/50 text-sand-300 text-xs font-black flex items-center justify-center shrink-0">
                      {icon}
                    </span>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ZEILE 2 – 4 Frühbucher-Kacheln */}
            <FruehbucherCards deals={fruehbucherDeals} />
          </div>
        </div>
      </section>

      {/* Kreuzfahrt-Sektion entfernt für Mobile Performance */}

      {/* ══════════════════════════════════════════════════════════
          3d · VERTRAUEN & VORTEILE (Trust-Banner)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-0 overflow-hidden">
        <div
          className="relative"
          style={{ background: "linear-gradient(135deg, #1e1035 0%, #2d1b69 45%, #1e3a5f 100%)" }}
        >
          {/* Deko-Blasen */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full bg-violet-500/10" />
            <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-blue-600/8" style={{ transform: "translateY(-50%)" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* LEFT – Titel */}
              <div className="shrink-0 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">{t("whyEyebrow")}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {t("whyTitle").split("\n")[0]}<br className="hidden md:block" /> {t("whyTitle").split("\n")[1]}
                </h2>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-24 bg-white/15 shrink-0" />

              {/* RIGHT – 4 Trust-Items */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: ShieldCheck,    title: t("whyTrust1Title"), text: t("whyTrust1Text"), color: "bg-teal-500",    shadow: "shadow-teal-500/40" },
                  { icon: RefreshCcw,     title: t("whyTrust2Title"), text: t("whyTrust2Text"), color: "bg-sand-500",    shadow: "shadow-sand-500/40" },
                  { icon: BookOpen,       title: t("whyTrust3Title"), text: t("whyTrust3Text"), color: "bg-violet-500",  shadow: "shadow-violet-500/40" },
                  { icon: HeartHandshake, title: t("whyTrust4Title"), text: t("whyTrust4Text"), color: "bg-emerald-500", shadow: "shadow-emerald-500/40" },
                ].map(({ icon: Icon, title, text, color, shadow }) => (
                  <div key={title} className="flex flex-col items-center text-center gap-2.5">
                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg ${shadow}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-white text-base leading-snug">{title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Wave: Trust-Purple → Section 4 White ── */}
      <div className="relative h-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1035 0%, #2d1b69 45%, #1e3a5f 100%)" }}>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <path d="M0,0 C480,56 960,0 1440,40 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4 · BELIEBTE REISEZIELE
          Stil: Magazine-Cover · Heading overlaid auf Hero-Karte
          Erste Kachel als großes Titelbild, Rest als kleinere Reihe
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">

          {/* ── TIER 1: Hero-Karte #1 – Türkei (volle Breite) ── */}
          <Link
            href={`/urlaubsziele/${destHero.slug}/`}
            className="group relative block rounded-3xl overflow-hidden mb-3 shadow-2xl"
            style={{ height: "clamp(260px, 38vw, 420px)" }}
          >
            <Image src={destHero.img} alt={`${destHero.name} Urlaub günstig buchen`} fill priority loading="eager" className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="100vw" />
            {/* Links-oben → rechts-unten: kräftiger Schatten */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            {/* Heading – unten links */}
            <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-1 bg-sand-500 rounded-full" />
                <span className="text-sand-400 text-xs font-bold uppercase tracking-widest" style={{ textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>{t("destEyebrow")}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none whitespace-nowrap" style={{ textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
                {t("destTitle").replace(t("destTitleHighlight"), "").trim()} <span className="text-sand-400">{t("destTitleHighlight")}</span>
              </h2>
              <p className="text-white/75 text-sm mt-3 whitespace-nowrap" style={{ textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
                {t("destSubtitle")}
              </p>
            </div>
            {/* Preis + Flagge – oben rechts */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
              <span className="bg-sand-500 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg">{destHero.priceFrom}</span>
              <div className="flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-lg px-2.5 py-1">
                <img src={`https://flagcdn.com/16x12/${destHero.flag}.png`} alt={destHero.name} className="rounded-sm" width={16} height={12} />
                <span className="text-white text-xs font-bold">{destHero.name}</span>
              </div>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">#1</span>
            </div>
            {/* Kein <Link> hier – äußere Karte ist bereits ein <a> → span als CTA */}
            <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-white/15 hover:bg-sand-500 border border-white/30 text-white text-sm font-bold px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer">
              {t("destAllCta")} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* ── TIER 2: #2–4 – Mittelgroße Kacheln (3 Spalten) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {destMittel.map((r, i) => (
              <Link key={r.slug} href={`/urlaubsziele/${r.slug}/`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
                style={{ height: "clamp(180px, 20vw, 240px)" }}
              >
                <Image src={r.img} alt={`${r.name} Urlaub günstig buchen`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px)100vw,33vw" />
                {/* Doppelter Gradient: unten dunkel + links leicht */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full">#{i + 2}</div>
                <div className="absolute top-3 right-3 bg-sand-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">{r.priceFrom}</div>
                <div className="absolute bottom-0 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img src={`https://flagcdn.com/16x12/${r.flag}.png`} alt={r.name} className="rounded-sm" width={16} height={12} />
                  </div>
                  <h3 className="font-black text-xl text-white leading-tight" style={{ textShadow: "0 1px 6px rgba(0,0,0,.9)" }}>{r.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5 truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>{r.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ── TIER 3: #5–10 – Kleinere Kacheln (6 Spalten) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {destKlein.map((r, i) => (
              <Link key={r.slug} href={`/urlaubsziele/${r.slug}/`}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ height: "clamp(140px, 13vw, 170px)" }}
              >
                <Image src={r.img} alt={`${r.name} Urlaub günstig buchen`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width:640px)50vw,(max-width:1024px)33vw,17vw" />
                {/* Stärkerer Gradient für kleine Kacheln */}
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/5" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">#{i + 5}</div>
                <div className="absolute top-2 right-2 bg-sand-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">{r.priceFrom}</div>
                <div className="absolute bottom-0 p-2.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    <img src={`https://flagcdn.com/16x12/${r.flag}.png`} alt={r.name} className="rounded-sm" width={14} height={10} />
                  </div>
                  <h3 className="font-black text-sm text-white leading-tight truncate" style={{ textShadow: "0 1px 4px rgba(0,0,0,1)" }}>{r.name}</h3>
                  <p className="text-white/75 text-[10px] mt-0.5 truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,.9)" }}>{r.sub}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4b · AKTIVITÄTEN MARKTPLATZ BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch min-h-[340px]">

            {/* LEFT – Marktplatz Teaser (3/5) */}
            <div className="lg:col-span-3 relative rounded-3xl overflow-hidden">
              {/* Hintergrundbild */}
              <Image
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&h=500&q=75&auto=format"
                alt="Aktivitäten & Erlebnisse weltweit"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
              {/* Grünes Overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(15,110,92,0.88) 0%, rgba(29,182,130,0.80) 60%, rgba(22,160,105,0.85) 100%)" }}
              />

              <div className="relative px-8 py-9 flex flex-col h-full">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1 mb-4 w-fit">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{t("aktivEyebrow")}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  {t("aktivTitle")}
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                  {t("aktivDesc")}
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <a
                    href="/marktplatz/"
                    className="inline-flex items-center gap-2 bg-white text-teal-700 font-black px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all shadow-lg hover:-translate-y-0.5 duration-200 text-sm"
                  >
                    {t("aktivCta1")} <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/anbieter/"
                    className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5 duration-200 text-sm"
                  >
                    {t("aktivCta2")}
                  </a>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-6 pt-5 border-t border-white/20">
                  {[
                    ["250+", t("aktivStat1Label")],
                    ["100%", t("aktivStat2Label")],
                    [t("aktivStat3Val"), t("aktivStat3Label")],
                  ].map(([val, label]) => (
                    <div key={label} className="text-center">
                      <div className="text-xl font-black text-white">{val}</div>
                      <div className="text-xs text-white/70">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <FeaturedAngebotsCarousel />

          </div>
        </div>
      </section>

      {/* ── Wave: White Section 4 → Deep-Violet Section 5 ── */}
      <div className="relative h-14 overflow-hidden bg-white">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <path d="M0,56 C360,0 1080,56 1440,20 L1440,56 L0,56 Z" fill="#0d0627" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════
          5 · DEIN LIFESTYLE, DEINE WAHL
          Stil: Side-Column · Sticky Heading links · Cards rechts
          Tiefes Violett-Gradient, kein flaches Navy mehr
      ══════════════════════════════════════════════════════════ */}
      <section
        className="overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d0627 0%, #1a0845 40%, #0c1a38 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* ── LINKE SPALTE – Sticky Heading ── */}
            <div className="lg:w-80 shrink-0 lg:sticky lg:top-24 lg:self-start">

              {/* Eyebrow-Badge */}
              <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1.5 mb-5">
                <span className="text-violet-300 text-xs font-bold uppercase tracking-widest">{t("lifestyleEyebrow")}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                <span className="text-white">{t("lifestyleTitle1")}</span>{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)" }}
                >
                  {t("lifestyleTitle2")}
                </span>
              </h2>

              <p className="text-white/40 text-sm mt-4 leading-none">
                {t("lifestyleSub1")}
              </p>
              <p className="text-white/25 text-sm mt-1.5 leading-none">
                {t("lifestyleSub2")}
              </p>

              {/* Farbige Akzentpunkte */}
              <div className="flex gap-2 mt-8">
                <div className="h-1.5 w-10 rounded-full bg-violet-500" />
                <div className="h-1.5 w-6 rounded-full bg-pink-500" />
                <div className="h-1.5 w-3 rounded-full bg-blue-500" />
              </div>

              <Link
                href="/urlaubsarten/"
                className="mt-8 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-5 py-3.5 rounded-2xl transition-all duration-200 text-sm shadow-lg shadow-violet-900/50 hover:-translate-y-0.5"
              >
                {t("lifestyleCta")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── RECHTE SPALTE – Lifestyle-Kacheln ── */}
            <div className="flex-1 min-w-0">
              <LifestyleSection />
            </div>

          </div>
        </div>

        {/* ── Wave: Deep-Violet → White (Section 6) ── */}
        <div className="relative h-14 overflow-hidden" style={{ background: "linear-gradient(160deg, #0d0627 0%, #1a0845 40%, #0c1a38 100%)" }}>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
            <path d="M0,40 C400,0 1000,56 1440,16 L1440,56 L0,56 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6 · URLAUBSGUIDES – Kompaktes Karussell
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">

          {/* Header-Zeile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <div className="h-8 w-1.5 rounded-full bg-sand-500" />
                <div className="h-8 w-1.5 rounded-full bg-sky-500" />
                <div className="h-8 w-1.5 rounded-full bg-violet-500" />
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t("guidesEyebrow")}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{t("guidesTitle")}</h2>
              </div>
            </div>
            <Link
              href="/urlaubsguides/"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-sand-500 text-white font-black px-5 py-2.5 rounded-2xl transition-all duration-200 text-sm shrink-0"
            >
              {t("guidesAllCta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Guide-Kacheln als Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/urlaubsguides/${g.slug}/`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ height: "clamp(180px, 22vw, 220px)" }}
              >
                <Image
                  src={g.img}
                  alt={`Urlaubsguide ${g.dest}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width:640px)50vw,(max-width:1024px)33vw,20vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                {/* Flagge oben links */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                  <img src={`https://flagcdn.com/16x12/${g.flag}.png`} alt={g.country} className="rounded-sm" width={16} height={12} />
                  <span className="text-white text-[10px] font-bold">{g.country}</span>
                </div>
                {/* Text unten */}
                <div className="absolute bottom-0 p-3">
                  <h3 className="font-black text-lg text-white leading-tight" style={{ textShadow: "0 1px 6px rgba(0,0,0,.9)" }}>
                    {g.dest}
                  </h3>
                  <p className="text-white/70 text-[11px] mt-0.5 line-clamp-2 leading-snug" style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>
                    {g.teaser}
                  </p>
                  <span className="mt-1.5 text-sand-400 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("guidesReadCta")} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Community Banner, Extras, Magazin, Discovery Hub entfernt — Mobile Performance */}

      {/* ══════════════════════════════════════════════════════════
          7 · SEO-TEXTBLOCK (für Google sichtbarer Inhalt)
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-4 pb-12" style={{ backgroundColor: "rgba(238,206,161,0.15)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
            {t("seoTitle")}
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-3">
            <p>{t("seoPara1")}</p>
            <p>{t("seoPara2")}</p>
            <p>{t("seoPara3")}</p>
          </div>

          {/* SEO-Linksammlung */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t("seoMoreTopics")}</p>
            <div className="flex flex-wrap gap-2">
              {SEO_LINK_HREFS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-sand-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 hover:border-sand-200 transition-all"
                >
                  {t(l.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9 · NEWSLETTER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-linear-to-br from-[#00838F] to-[#005F6A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            {t("nlEyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            {t("nlTitle")}
          </h2>
          <p className="text-white/75 mb-8 text-sm sm:text-base">
            {t("nlDesc")}
          </p>
          <NewsletterSignup variant="hero" />
        </div>
      </section>

      {/* Final CTA entfernt — dupliziert Newsletter */}
    </>
  );
}
