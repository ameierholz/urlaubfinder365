import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, MapPin, ShieldCheck, RefreshCcw, BookOpen, HeartHandshake, Users, MessageCircle, Globe, Camera, Route, Trophy, Bell, Map } from "lucide-react";
import { TravelOffer } from "@/types";
import SearchBox from "@/components/widgets/SearchBox";
import HomeDealCard from "@/components/home/HomeDealCard";
import QuickCategories from "@/components/home/QuickCategories";
import LifestyleSection from "@/components/home/LifestyleSection";
import FruehbucherCards from "@/components/home/FruehbucherCards";
import HomeCruiseSection from "@/components/home/HomeCruiseSection";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import TrustpilotWidget from "@/components/ui/TrustpilotWidget";
import FeaturedAngebotsCarousel from "@/components/home/FeaturedAngebotsCarousel";
import { setRequestLocale } from "next-intl/server";

// ─── SEO Metadata ────────────────────────────────────────────────────────────
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `✈ Pauschalreisen & Last Minute günstig buchen ${YEAR}`,
  description: `Pauschalreisen, All Inclusive & Last Minute ${YEAR} günstig buchen ✓ Über 50 Veranstalter ✓ Türkei ab 199€ ✓ Mallorca ab 249€ ✓ Täglich neue Deals.`,
  keywords: ["Pauschalreisen günstig buchen", "Urlaub günstig buchen", "Last Minute Urlaub", "All Inclusive Urlaub", "Pauschalreisen Türkei", "Pauschalreisen Mallorca", "Pauschalreisen Ägypten", "Billig Urlaub buchen", "Urlaubsschnäppchen", "Reise buchen online"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/",
  },
  openGraph: {
    title: `✈ Pauschalreisen & Last Minute günstig buchen ${YEAR} | Urlaubfinder365`,
    description:
      "Täglich aktuelle Pauschalreisen, All Inclusive & Last Minute für Türkei, Mallorca, Griechenland & Ägypten. Jetzt Traumurlaub günstig buchen!",
    url: "https://www.urlaubfinder365.de/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Infinity Pool mit Meerblick – Pauschalreisen günstig buchen bei Urlaubfinder365",
      },
    ],
  },
};

// Täglich um Mitternacht neu generieren (86400 Sek = 24 h)
export const revalidate = 86400;

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
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
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
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
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

const HERO_BG =
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=80";

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
  img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1400&q=80",
};

// Tier 2 – #2–4: Mittelgroße Kacheln (3 Spalten)
const REISEZIELE_MITTEL_S = [
  { name: "Spanien",     sub: "Mallorca · Teneriffa · Ibiza",     slug: "balearen",         flag: "es", img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=75" },
  { name: "Griechenland",sub: "Kreta · Rhodos · Korfu",           slug: "griechische-inseln",flag: "gr", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=75" },
  { name: "Ägypten",     sub: "Hurghada · Marsa Alam",            slug: "aegypten",          flag: "eg", img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=75" },
];

// Tier 3 – #5–10: Kleinere Kacheln (6 Spalten) – Preis wird dynamisch ergänzt
const REISEZIELE_KLEIN_S = [
  { name: "Kroatien", sub: "Dubrovnik · Split · Istrien",    slug: "kroatien",       flag: "hr", img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=75", fallback: "ab 379 €" },
  { name: "Italien",  sub: "Sizilien · Sardinien · Amalfi",  slug: "italien",        flag: "it", img: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=600&q=75", fallback: "ab 429 €" },
  { name: "Portugal", sub: "Algarve · Madeira · Lissabon",   slug: "portugal",       flag: "pt", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=75", fallback: "ab 399 €" },
  { name: "Dubai",    sub: "Emirate · Wüste · Skyline",      slug: "dubai",          flag: "ae", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=75", fallback: "ab 699 €" },
  { name: "Malediven",sub: "Nord-Malé · Ari-Atoll",          slug: "indischer-ozean",flag: "mv", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=75", fallback: "ab 1.299 €" },
  { name: "Thailand", sub: "Phuket · Koh Samui · Bangkok",   slug: "thailand",       flag: "th", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=75", fallback: "ab 899 €" },
];


const GUIDES = [
  {
    slug: "reisefuehrer-antalya",
    dest: "Antalya",
    country: "Türkei",
    flag: "tr",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=75",
    teaser: "Strände, Ruinen & Top-Hotels an der türkischen Riviera",
  },
  {
    slug: "reisefuehrer-mallorca",
    dest: "Mallorca",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=75",
    teaser: "Traumstrände, Serra de Tramuntana & Palmas Altstadt",
  },
  {
    slug: "reisefuehrer-kreta",
    dest: "Kreta",
    country: "Griechenland",
    flag: "gr",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=75",
    teaser: "Samaria-Schlucht, Knossos & griechische Gastfreundschaft",
  },
  {
    slug: "reisefuehrer-hurghada",
    dest: "Hurghada",
    country: "Ägypten",
    flag: "eg",
    img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=75",
    teaser: "Rotes Meer, Tauchen & Wüstenabenteuer in Ägypten",
  },
  {
    slug: "reisefuehrer-barcelona",
    dest: "Barcelona",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=75",
    teaser: "Gaudí, Tapas, Strände & katalanisches Nachtleben",
  },
];

const SEO_LINKS = [
  { label: "Türkei Urlaub", href: "/urlaubsziele/tuerkei/" },
  { label: "Mallorca Urlaub", href: "/urlaubsziele/balearen/" },
  { label: "Griechenland Urlaub", href: "/urlaubsziele/griechische-inseln/" },
  { label: "Ägypten Urlaub", href: "/urlaubsziele/aegypten/" },
  { label: "Portugal Urlaub", href: "/urlaubsziele/portugal/" },
  { label: "Kreta Urlaub", href: "/urlaubsziele/kreta/" },
  { label: "Pauschalreisen", href: "/guenstig-urlaub-buchen/" },
  { label: "Last Minute", href: "/last-minute/" },
  { label: "All Inclusive", href: "/urlaubsarten/pauschalreisen/" },
  { label: "Kreuzfahrten", href: "/kreuzfahrten/" },
  { label: "Urlaubsguides", href: "/urlaubsguides/" },
  { label: "Alle Reiseziele", href: "/urlaubsziele/" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Je 1 Top-Deal pro Land – täglich um Mitternacht frisch (ibeRegionIds)
  // Türkei=149 | Spanien=133 | Griechenland=46 | Ägypten=560 | Italien=83+84
  const [
    turkeyDeal, spainDeal, greeceDeal, egyptDeal, italyDeal,
    croatDeal, portDeal,
    fbTurkey, fbEgypt, fbGreece, fbSpain,
  ] = await Promise.all([
    fetchTopDeal([149]),       // Türkei / Antalya
    fetchTopDeal([133]),       // Spanien / Mallorca
    fetchTopDeal([46]),        // Griechenland / Kreta
    fetchTopDeal([560]),       // Ägypten / Hurghada
    fetchTopDeal([83, 84]),    // Italien / Sardinien + Sizilien
    fetchTopDeal([122, 123]),  // Kroatien (Dalmatien + Istrien)
    fetchTopDeal([92]),        // Portugal / Algarve
    // Frühbucher: All Inclusive, 4+ Sterne, max. 1.200 €/Person, täglich rotierend
    fetchFruehbucherDeal([149]),  // Frühbucher Türkei
    fetchFruehbucherDeal([560]),  // Frühbucher Ägypten
    fetchFruehbucherDeal([46]),   // Frühbucher Griechenland
    fetchFruehbucherDeal([133]),  // Frühbucher Spanien
  ]);

  const topDeals = [turkeyDeal, spainDeal, greeceDeal, egyptDeal, italyDeal]
    .filter((o): o is TravelOffer => o !== null);

  const fruehbucherDeals = [fbTurkey, fbEgypt, fbGreece, fbSpain];

  // ── Destination-Kacheln mit echten API-Preisen ──────────────────────────
  const destHero   = { ...REISEZIEL_HERO_S,   priceFrom: minPrice(turkeyDeal,  "ab 299 €") };
  const destMittel = [
    { ...REISEZIELE_MITTEL_S[0], priceFrom: minPrice(spainDeal,  "ab 349 €") },
    { ...REISEZIELE_MITTEL_S[1], priceFrom: minPrice(greeceDeal, "ab 389 €") },
    { ...REISEZIELE_MITTEL_S[2], priceFrom: minPrice(egyptDeal,  "ab 449 €") },
  ];
  const destKlein  = [
    { ...REISEZIELE_KLEIN_S[0], priceFrom: minPrice(croatDeal,  REISEZIELE_KLEIN_S[0].fallback) },
    { ...REISEZIELE_KLEIN_S[1], priceFrom: minPrice(italyDeal,  REISEZIELE_KLEIN_S[1].fallback) },
    { ...REISEZIELE_KLEIN_S[2], priceFrom: minPrice(portDeal,   REISEZIELE_KLEIN_S[2].fallback) },
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
      "Urlaubfinder365 vergleicht täglich tausende Reiseangebote führender Veranstalter – Pauschalreisen, All Inclusive und Last Minute günstig buchen.",
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
      "Pauschalreisen, All-Inclusive und Last-Minute günstig buchen. Täglich aktualisierte Reiseangebote mit kostenlosen Reiseführern.",
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
      {/* JSON-LD – Organization, WebSite, ItemList */}
      {[schemaOrganization, schemaWebSite, schemaItemList].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ══════════════════════════════════════════════════════════
          1 · HERO  –  Cinematic Full-Viewport
      ══════════════════════════════════════════════════════════ */}
      <section className="relative text-white flex flex-col -mt-20" style={{ minHeight: "min(90vh, 820px)", overflow: "visible" }}>

        {/* ── Hintergrundbild ── */}
        <Image
          src={HERO_BG}
          alt="Infinity Pool mit Meerblick – Pauschalreisen günstig buchen"
          fill
          className="object-cover object-[center_40%]"
          priority
          fetchPriority="high"
          sizes="100vw"
        />

        {/* ── Cinematic Overlays ── */}
        {/* Links abdunkeln für Text-Lesbarkeit */}
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/10" />
        {/* Unten abdunkeln für SearchBox-Übergang */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/30" />
        {/* Nahtloser Übergang zum Deals-Banner */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-[#1a1200]" />

        {/* ── Haupt-Content – vertikal zentriert ── */}
        {/* overflow-visible damit SearchBox-Dropdown nicht abgeschnitten wird */}
        <div className="relative flex-1 flex flex-col justify-start max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-4" style={{ overflow: "visible" }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-sand-500 rounded-full" />
            <span className="text-sand-400 text-xs font-bold uppercase tracking-[0.18em]">Täglich neue Reiseangebote</span>
          </div>

          {/* H1 – auf Mobile umbrechen, ab sm eine Zeile */}
          <h1
            className="font-black leading-tight mb-4 whitespace-normal sm:whitespace-nowrap"
            style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
          >
            Pauschalreisen & Urlaub günstig buchen –<br />
            <span className="text-sand-400">Wir finden deinen Traumurlaub!</span>
          </h1>

          {/* ── Trust-Badges ── */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4">
            {[
              ["50+", "Veranstalter"],
              ["100%", "Direkt buchen"],
              ["täglich", "Aktualisiert"],
            ].map(([val, label]) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-sand-400 font-black text-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>{val}</span>
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Trustpilot ── */}
          <div className="mb-4 max-w-xs">
            <TrustpilotWidget theme="dark" templateId="5419b637fa0340045cd0c936" height="24px" />
          </div>

          {/* ── SearchBox – overflow-visible damit Dropdown nicht clippt ── */}
          <div style={{ overflow: "visible", position: "relative", zIndex: 20 }} className="-ml-4">
            <SearchBox />
          </div>
        </div>

      </section>

      {/* ── QuickCategories – weißer Streifen unter dem Hero ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <QuickCategories />
        </div>
      </div>

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
                    <span className="text-xs font-bold text-sand-300 uppercase tracking-widest">🔥 TOP DEALS – Täglich um Mitternacht neu</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight whitespace-nowrap">
                    Top Reiseangebote – täglich aktuell
                  </h2>
                  <p className="text-sand-100/70 text-sm mt-1 hidden md:block">
                    ≥ 90 % Weiterempfehlung · ≥ 70 Bewertungen · günstigstes Angebot pro Land
                  </p>
                </div>
              </div>

              {/* MIDDLE – Länder-Flags */}
              <div className="flex-1 flex flex-wrap gap-2 justify-center">
                {[
                  ["tr", "Türkei"],
                  ["es", "Spanien"],
                  ["gr", "Griechenland"],
                  ["eg", "Ägypten"],
                  ["it", "Italien"],
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
                  Alle Urlaubsziele <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-white/40 text-xs">Pauschalreisen für 2 Personen</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── Cards ── */}
        <div style={{ backgroundColor: "rgba(238,206,161,0.18)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Label-Zeile über den Karten */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-linear-to-r from-red-700 to-sand-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md shadow-sand-500/20 uppercase tracking-wider">
                <Flame className="w-3 h-3" /> Top Deal
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Von der Redaktion täglich kuratiert · 1 Topangebot pro Land
              </p>
            </div>

            {topDeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {topDeals.map((offer, i) => (
                  <HomeDealCard key={offer.product_code} offer={offer} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>Angebote werden geladen…</p>
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
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">bis zu</div>
                  <div className="text-5xl md:text-6xl font-black leading-none">60%</div>
                  <div className="text-sm font-bold uppercase tracking-wide">Rabatt</div>
                </div>
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent" />
              </div>

              {/* CENTER – Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-4">
                  <span className="text-xs font-bold text-sand-300 uppercase tracking-widest">🌅 Frühbucher-Vorteil</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                  Jetzt früh buchen &amp; richtig sparen!
                </h2>
                <p className="text-blue-100/80 text-sm sm:text-base max-w-xl leading-relaxed mb-5">
                  Wer früh plant, zahlt weniger. Sichere dir jetzt die besten Zimmer und günstigsten Preise für den Sommer 2027 – Frühbucher-Rabatte bis zu 60% gegenüber Last-Minute.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href="/urlaubsarten/fruhbucher-urlaub/"
                    className="inline-flex items-center gap-2 bg-sand-500 hover:bg-sand-600 text-white font-black px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-sand-500/40 hover:-translate-y-0.5 duration-200"
                  >
                    Frühbucher-Deals entdecken <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/last-minute/"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 duration-200"
                  >
                    Last-Minute Deals
                  </a>
                </div>
              </div>

              {/* RIGHT – USP-Liste */}
              <div className="shrink-0 hidden lg:flex flex-col gap-3">
                {[
                  ["✓", "Beste Hotelzimmer sichern"],
                  ["✓", "Bis zu 12 Monate im Voraus"],
                  ["✓", "Flexible Stornierung"],
                  ["✓", "Preisgarantie beim Veranstalter"],
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

      {/* ══════════════════════════════════════════════════════════
          3c · KREUZFAHRTEN
      ══════════════════════════════════════════════════════════ */}
      <HomeCruiseSection />

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
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">✓ Warum Urlaubfinder365?</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Dein Vorteil<br className="hidden md:block" /> bei uns
                </h2>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-24 bg-white/15 shrink-0" />

              {/* RIGHT – 4 Trust-Items */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: ShieldCheck,    title: "Günstigster Preis",      text: "Täglich tausende Angebote verglichen – immer der beste Preis.",          color: "bg-teal-500",    shadow: "shadow-teal-500/40" },
                  { icon: RefreshCcw,     title: "Täglich aktuell",        text: "Laufend von offiziellen Veranstaltern aktualisiert.",                    color: "bg-sand-500",  shadow: "shadow-sand-500/40" },
                  { icon: BookOpen,       title: "Kostenlose Guides",      text: "Einreise, Klima & Tipps für dein Traumziel – gratis.",                   color: "bg-violet-500",  shadow: "shadow-violet-500/40" },
                  { icon: HeartHandshake, title: "Sicher & direkt",        text: "Du buchst direkt beim Veranstalter – vertrauenswürdig ohne Umwege.",     color: "bg-emerald-500", shadow: "shadow-emerald-500/40" },
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
                <span className="text-sand-400 text-xs font-bold uppercase tracking-widest" style={{ textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>🌍 Top 10 – Deutschland · Österreich · Schweiz</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none whitespace-nowrap" style={{ textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
                Beliebte <span className="text-sand-400">Urlaubsziele</span>
              </h2>
              <p className="text-white/75 text-sm mt-3 whitespace-nowrap" style={{ textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
                Top-Destinationen der Deutschen · Preise für 7 Nächte / 2 Personen inkl. Flug
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
              Alle Ziele <ArrowRight className="w-3.5 h-3.5" />
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
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&h=500&q=75"
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
                  <span className="text-xs font-bold text-white uppercase tracking-widest">🎯 Neu auf Urlaubfinder365</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                  Aktivitäten &amp; Erlebnisse<br className="hidden sm:block" /> direkt buchen
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                  Entdecke hunderte Touren, Ausflüge und Erlebnisse an deinem Urlaubsziel – von lokalen Anbietern, direkt buchbar, ohne Umweg.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <a
                    href="/marktplatz/"
                    className="inline-flex items-center gap-2 bg-white text-teal-700 font-black px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all shadow-lg hover:-translate-y-0.5 duration-200 text-sm"
                  >
                    Marktplatz entdecken <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/anbieter/"
                    className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5 duration-200 text-sm"
                  >
                    Anbieter werden
                  </a>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-6 pt-5 border-t border-white/20">
                  {[
                    ["250+", "Reiseziele"],
                    ["100%", "Lokal & direkt"],
                    ["Gratis", "Registrierung"],
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
                <span className="text-violet-300 text-xs font-bold uppercase tracking-widest">✨ Für jeden das Richtige</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                <span className="text-white">Dein Lifestyle,</span>{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)" }}
                >
                  deine Wahl!
                </span>
              </h2>

              <p className="text-white/40 text-sm mt-4 leading-none">
                Familie · Strand · Abenteuer · Städte uvm.
              </p>
              <p className="text-white/25 text-sm mt-1.5 leading-none">
                Urlaub nach deinen Vorstellungen
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
                Alle Urlaubsarten <ArrowRight className="w-4 h-4" />
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
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">📚 Kostenloses Reisewissen</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Urlaubsguides</h2>
              </div>
            </div>
            <Link
              href="/urlaubsguides/"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-sand-500 text-white font-black px-5 py-2.5 rounded-2xl transition-all duration-200 text-sm shrink-0"
            >
              Alle Guides <ArrowRight className="w-4 h-4" />
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
                    Guide lesen <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6b · COMMUNITY BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f3d2e 0%, #1a6b4a 40%, #0d8b6e 70%, #1db682 100%)" }}
          >
            {/* Deko */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
              <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full bg-white/5" />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-emerald-400/10" style={{ transform: "translateY(-50%)" }} />
              {/* SVG Weltkarte dezent */}
              <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04]" viewBox="0 0 800 600" fill="currentColor">
                <circle cx="200" cy="200" r="4" /><circle cx="250" cy="180" r="3" /><circle cx="300" cy="190" r="5" />
                <circle cx="350" cy="220" r="4" /><circle cx="400" cy="200" r="3" /><circle cx="450" cy="250" r="5" />
                <circle cx="500" cy="230" r="4" /><circle cx="550" cy="280" r="3" /><circle cx="600" cy="260" r="4" />
                <circle cx="300" cy="300" r="5" /><circle cx="350" cy="320" r="3" /><circle cx="400" cy="350" r="4" />
                <circle cx="500" cy="350" r="5" /><circle cx="550" cy="380" r="3" /><circle cx="250" cy="350" r="4" />
                <circle cx="650" cy="300" r="4" /><circle cx="700" cy="250" r="3" /><circle cx="150" cy="250" r="5" />
              </svg>
            </div>

            <div className="relative px-6 sm:px-10 lg:px-12 py-8 lg:py-10">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

                {/* LEFT – Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
                    <Users className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Reise-Community</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                    Teile deine Reise.<br />
                    <span className="text-emerald-300">Inspiriere andere.</span>
                  </h2>

                  <p className="text-emerald-100/80 text-sm max-w-md leading-relaxed mb-6 mx-auto lg:mx-0">
                    Reiseberichte, Gruppen-Chats, Geheimtipps und neue Reisefreunde – werde Teil der Urlaubfinder365 Community.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <Link
                      href="/community/"
                      className="inline-flex items-center gap-2 bg-white text-emerald-800 font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/30 hover:-translate-y-0.5 duration-200 text-sm"
                    >
                      Community entdecken <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/community/reiseberichte/"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all hover:-translate-y-0.5 duration-200 text-sm"
                    >
                      Reiseberichte lesen
                    </Link>
                  </div>
                </div>

                {/* RIGHT – Feature-Grid */}
                <div className="grid grid-cols-4 lg:grid-cols-4 gap-2.5 shrink-0 w-full lg:max-w-md">
                  {[
                    { icon: Camera,         title: "Reiseberichte",   color: "bg-emerald-500" },
                    { icon: Users,          title: "Reisegruppen",    color: "bg-teal-500" },
                    { icon: MessageCircle,  title: "Diskussionen",    color: "bg-cyan-500" },
                    { icon: Globe,          title: "250+ Ziele",      color: "bg-blue-500" },
                    { icon: Route,          title: "Reiserouten",     color: "bg-violet-500" },
                    { icon: Trophy,         title: "Badges & Level",  color: "bg-amber-500" },
                    { icon: Bell,           title: "Preisalarme",     color: "bg-rose-500" },
                    { icon: Map,            title: "Reisenden-Karte", color: "bg-indigo-500" },
                  ].map(({ icon: Icon, title, color }) => (
                    <div
                      key={title}
                      className="bg-white/10 border border-white/15 rounded-xl p-2.5 text-center hover:bg-white/15 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mx-auto mb-1.5 shadow-md`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-white leading-tight">{title}</h3>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: Community/Guides Weiß → SEO Sand */}
      <div className="relative h-10 overflow-hidden bg-white">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <path d="M0,40 L0,20 C360,0 1080,40 1440,15 L1440,40 Z" fill="rgba(238,206,161,0.3)" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════
          7 · SEO-TEXTBLOCK (für Google sichtbarer Inhalt)
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-4 pb-12" style={{ backgroundColor: "rgba(238,206,161,0.15)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
            Pauschalreisen &amp; Urlaub günstig buchen – Urlaubfinder365
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-3">
            <p>
              <strong>Urlaubfinder365</strong> ist dein persönlicher Reiseberater für günstige Pauschalreisen,
              All-Inclusive-Urlaub und Last-Minute-Angebote. Wir vergleichen täglich tausende Reiseangebote
              namhafter Veranstalter – damit du immer den besten Preis für deinen Traumurlaub findest.
            </p>
            <p>
              Ob Strandurlaub in der Türkei, Kulturreise nach Barcelona, Entspannung auf Mallorca oder
              Tauchen in Ägypten – unsere Angebote decken die beliebtesten Reiseziele Deutschlands ab.
              Alle Preise verstehen sich inklusive Flug und Unterkunft für 2 Personen, sofern nicht anders angegeben.
            </p>
            <p>
              Zusätzlich zu den Reiseangeboten findest du bei uns kostenlose <strong>Reiseführer</strong> für
              die Top-Destinationen: Einreisebestimmungen, Klimatabellen, Packlisten und lokale Insidertipps –
              alles, was du für einen perfekten Urlaub brauchst.
            </p>
          </div>

          {/* SEO-Linksammlung */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Weitere Themen</p>
            <div className="flex flex-wrap gap-2">
              {SEO_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-sand-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 hover:border-sand-200 transition-all"
                >
                  {l.label}
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
            ✉️ Kostenloser Newsletter
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Die besten Deals direkt ins Postfach
          </h2>
          <p className="text-white/75 mb-8 text-sm sm:text-base">
            Wöchentlich die günstigsten Last-Minute-Angebote, Frühbucher-Deals und Reise-Inspiration – kostenlos und jederzeit abmeldbar.
          </p>
          <NewsletterSignup variant="hero" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10 · FINALER CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-6 pb-16" style={{ backgroundColor: "rgba(238,206,161,0.15)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden text-white text-center py-14 px-8"
            style={{ background: "linear-gradient(135deg, #0f2d4a 0%, #0d6e8c 60%, #1a9f8f 100%)" }}
          >
            {/* Deko-Elemente */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-16 translate-y-16" />

            <div className="relative z-10">
              <span className="inline-block bg-sand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                Kostenlos & unverbindlich
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mb-3">Wunschliste &amp; persönliche Deals</h2>
              <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Erstelle ein kostenloses Konto – speichere Lieblingsangebote, merke dir Reiseziele und
                erhalte personalisierte Empfehlungen.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/register/"
                  className="bg-sand-500 hover:bg-sand-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-sand-500/40 hover:-translate-y-0.5 duration-200 text-base"
                >
                  Jetzt kostenlos registrieren
                </Link>
                <Link
                  href="/urlaubsziele/"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5 duration-200 text-base"
                >
                  Reiseziele entdecken
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
