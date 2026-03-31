import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";
import AktivitaetenDiscovery from "@/components/tiqets/AktivitaetenDiscovery";
import PageNavBar from "@/components/ui/PageNavBar";

const AKTIV_NAV_ITEMS = [
  { id: "aktivitaeten-entdecken",   label: "Entdecken",   emoji: "🗺️" },
  { id: "aktivitaeten-kategorien",  label: "Kategorien",  emoji: "🎯" },
  { id: "aktivitaeten-reiseziele",  label: "Reiseziele",  emoji: "🌍" },
  { id: "aktivitaeten-faq",         label: "FAQ",         emoji: "❓" },
];

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Aktivitäten & Tickets weltweit buchen",
  description:
    "Aktivitäten & Tickets in 30+ Reisezielen günstig buchen ✓ Sofortbuchung ✓ Gratis Storno ✓ Top-Bewertungen. Museen, Outdoor & Stadtführungen.",
  alternates: { canonical: `${BASE_URL}/aktivitaeten/` },
  openGraph: {
    title: "Aktivitäten & Tickets buchen – Touren, Erlebnisse & Eintrittskarten | Urlaubfinder365",
    description: "Aktivitäten, Tickets & Touren in 30+ Reisezielen weltweit günstig buchen. ✓ Sofortbuchung ✓ Gratis Storno ✓ Top-Bewertungen. Museen, Outdoor, Stadtführungen & mehr.",
    url: `${BASE_URL}/aktivitaeten/`,
    type: "website",
  },
};

// ── Datenlisten ────────────────────────────────────────────────────────────────

// Alle catalog-Einträge mit tiqetsCityId (für JSON-LD + Ziel-Grid)
const allTiqetsDests = CATALOG.filter((e) => e.tiqetsCityId);

// Kuratierte Top-Städte für das Destinations-Grid (12 ikonische Städte)
const TOP_CITY_SLUGS = [
  "rom", "barcelona", "paris", "amsterdam", "wien", "london",
  "florenz", "athen", "venedig", "santorin",
  "istanbul", "dubai",
  "bangkok", "bali",
  "new-york", "cancun",
  "kairo", "kapstadt",
  "dubrovnik", "mykonos",
  "neapel", "sevilla",
  "singapur", "phuket",
];

const featuredCities = (() => {
  const seen = new Set<string>();
  const result: typeof CATALOG = [];
  for (const slug of TOP_CITY_SLUGS) {
    const entry = CATALOG.find((e) => e.slug === slug && e.tiqetsCityId);
    if (entry && !seen.has(slug)) {
      seen.add(slug);
      result.push(entry);
    }
  }
  return result;
})();

// ── Statische Inhalte ──────────────────────────────────────────────────────────

const USP_ITEMS = [
  { emoji: "⚡", label: "Sofortbuchung",   sub: "Ticket aufs Handy" },
  { emoji: "🛡️", label: "Gratis Storno",   sub: "Bis 24h vorher" },
  { emoji: "⭐", label: "Top-Bewertungen", sub: "Geprüfte Qualität" },
  { emoji: "💶", label: "Bestpreis",       sub: "Kein Aufpreis" },
];

const QUICK_CATS = [
  { emoji: "🏛️", label: "Museen & Kultur"      },
  { emoji: "🌊", label: "Outdoor & Wassersport" },
  { emoji: "🎭", label: "Shows & Entertainment" },
  { emoji: "🍽️", label: "Food & Kulinarik"      },
  { emoji: "🏕️", label: "Abenteuer & Natur"     },
  { emoji: "🚌", label: "Stadtführungen"         },
];

const CATEGORIES = [
  {
    emoji: "🏛️",
    label: "Museen & Kultur",
    desc: "Eintrittskarten für Museen, antike Stätten, Galerien und historische Sehenswürdigkeiten – oft mit Skip-the-Line-Zugang und Audio-Guide.",
    examples: "Sagrada Família, Kolosseum, Akropolis, Louvre",
  },
  {
    emoji: "🚌",
    label: "Stadtführungen & Touren",
    desc: "Geführte Stadtrundfahrten, Hop-on-Hop-off Busse, Fahrradtouren und private City-Walks mit Expertenführung.",
    examples: "Barcelona Hop-on, Venedig Gondelfahrt, Wien Fiaker",
  },
  {
    emoji: "🌊",
    label: "Outdoor & Wassersport",
    desc: "Schnorcheln, Tauchen, Surfen, Kajak, Rafting und weitere Wassersportaktivitäten – buchbar mit Ausrüstung und Instruktor.",
    examples: "Kreta Bootssafari, Mallorca Kayak, Antalya Rafting",
  },
  {
    emoji: "🏕️",
    label: "Abenteuer & Natur",
    desc: "Wandertouren, Jeep-Safaris, Zipline, Klettern und Naturerlebnisse – für alle, die den Urlaub aktiv gestalten möchten.",
    examples: "Kenia Safari, Island Nordlichter, Alpen Wandertour",
  },
  {
    emoji: "🎭",
    label: "Shows & Entertainment",
    desc: "Dinner-Shows, Flamenco-Abende, Folklorevorführungen und Live-Konzerte – kulturelles Unterhaltungsprogramm für den Abend.",
    examples: "Barcelona Flamenco, Dubai Desert Show, Wien Operette",
  },
  {
    emoji: "🍽️",
    label: "Food & Kulinarik",
    desc: "Kochkurse, Weinverkostungen, Marktführungen und kulinarische Stadttouren – die Küche eines Landes wirklich kennenlernen.",
    examples: "Toskana Weinprobe, Marokko Kochkurs, Bangkok Street Food",
  },
];

const FAQS = [
  {
    q: "Wie buche ich Aktivitäten und Touren im Urlaub?",
    a: "Über Urlaubfinder365 kannst du Touren, Eintrittskarten und Aktivitäten direkt online buchen. Nach der Buchung erhältst du dein Ticket sofort per E-Mail – ideal als Mobile Ticket direkt aufs Handy. Eine Vorausbuchung ist besonders für beliebte Sehenswürdigkeiten wie die Sagrada Família oder das Kolosseum empfehlenswert, da diese oft Wochen im Voraus ausgebucht sind.",
  },
  {
    q: "Was bedeutet 'Skip-the-Line' bei Eintrittskarten?",
    a: "Skip-the-Line-Tickets ermöglichen dir den Zugang zu einer Sehenswürdigkeit ohne langes Warten in der regulären Schlange. Du nutzt einen separaten, schnelleren Eingang. Besonders an stark frequentierten Attraktionen wie dem Eiffelturm, dem Kolosseum oder dem Alhambra-Palast kann dies Stunden Wartezeit ersparen.",
  },
  {
    q: "Kann ich Aktivitäten auch kurzfristig buchen?",
    a: "Viele Aktivitäten sind bis kurz vor dem Termin buchbar – manche sogar noch am selben Tag. Für besonders beliebte Touren oder Sehenswürdigkeiten mit begrenzten Plätzen empfiehlt sich jedoch eine frühzeitige Buchung. Mit unserem Sofortbuchungs-System erhältst du die Buchungsbestätigung in Echtzeit.",
  },
  {
    q: "Was passiert, wenn ich eine Aktivität stornieren muss?",
    a: "Die meisten Aktivitäten bieten kostenlose Stornierung bis 24 Stunden vor Beginn. Das genaue Stornierungsrecht ist bei jedem Angebot angegeben. Im Krankheitsfall oder bei Wetterbedingungen gelten häufig besondere Regelungen. Buchungen mit dem Label 'Gratis Storno' sind immer ohne Kosten bis zum angegebenen Zeitpunkt stornierbar.",
  },
  {
    q: "Welche Aktivitäten eignen sich für Familien mit Kindern?",
    a: "Für Familien besonders beliebt sind Aquaparks, Schiffstouren, Tierparks, Hop-on-Hop-off Bustouren sowie leichte Natur- und Wandertouren. Auf Mallorca, Teneriffa und in Antalya gibt es zahlreiche speziell auf Familien zugeschnittene Aktivitätenpakete.",
  },
  {
    q: "Sind Aktivitäten auch als Kombi-Ticket buchbar?",
    a: "Ja, viele Städte bieten City-Pässe oder Kombi-Tickets an, die mehrere Attraktionen oder Touren zu einem vergünstigten Gesamtpreis kombinieren – z. B. Barcelona Card, Paris Museum Pass oder Vienna City Card. Diese eignen sich besonders für Städtereisen mit vielen geplanten Besichtigungen.",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────────
export default function AktivitaetenPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",          item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Aktivitäten & Tickets", item: `${BASE_URL}/aktivitaeten/` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Aktivitäten & Tickets buchen – Touren, Erlebnisse & Eintrittskarten weltweit",
    description:
      "Aktivitäten, Tickets und Touren in 30+ Reisezielen weltweit günstig buchen. Sofortbuchung, Gratis Storno, Top-Bewertungen.",
    url: `${BASE_URL}/aktivitaeten/`,
    mainEntity: {
      "@type": "ItemList",
      name: "Aktivitäten nach Reiseziel",
      numberOfItems: allTiqetsDests.length,
      itemListElement: allTiqetsDests.slice(0, 50).map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Aktivitäten in ${e.name}`,
        url: `${BASE_URL}/aktivitaeten/${e.slug}/`,
      })),
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
    <div className="min-h-screen bg-gray-50">

      {/* ── JSON-LD ─────────────────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px] md:h-[440px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&q=80')" }}
      >
        {/* Gradient-Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(0,83,95,0.68) 0%, rgba(0,131,143,0.50) 50%, rgba(0,79,90,0.75) 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🎟️ Aktivitäten &amp; Erlebnisse weltweit
          </div>

          <div className="lg:flex lg:items-start lg:gap-12">
            {/* Left column: headline + text */}
            <div className="flex-1 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Aktivitäten &amp; Tickets<br />
                <span className="text-[#6CC4BA]">weltweit buchen</span>
              </h1>
              <p className="text-white/75 text-lg max-w-xl leading-relaxed mb-6">
                Touren, Eintrittskarten &amp; Erlebnisse in über{" "}
                <strong className="text-white">30 Reisezielen</strong> –
                von Europa bis Asien, Karibik und Afrika.{" "}
                Sofort buchbar, mit Gratis-Storno.
              </p>

              {/* Category quick-picks */}
              <div className="flex flex-wrap gap-2">
                {QUICK_CATS.map((cat) => (
                  <a
                    key={cat.label}
                    href="#aktivitaeten-entdecken"
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-2 rounded-full transition-colors"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right column: USPs – vertikal gestapelt */}
            <div className="flex flex-col gap-2 lg:w-64 shrink-0">
              {USP_ITEMS.map((u) => (
                <div
                  key={u.label}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                >
                  <span className="text-xl flex-shrink-0">{u.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">{u.label}</p>
                    <p className="text-xs text-white/65 leading-tight">{u.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-8" />
      </div>

      {/* ── Sticky Schnellnavigation ── */}
      <PageNavBar items={AKTIV_NAV_ITEMS} />

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── SEO intro ─────────────────────────────────────────────────── */}
        <section className="py-10 max-w-4xl">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Aktivitäten &amp; Touren weltweit günstig buchen
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Ob <strong>Eintrittskarten für Museen</strong> in Barcelona, eine{" "}
            <strong>geführte Tour durch die Akropolis</strong> in Athen oder ein{" "}
            <strong>Schnorchelausflug</strong> vor Mallorcas Küste – auf Urlaubfinder365 findest
            du täglich aktualisierte Aktivitäten, Touren und Tickets für über{" "}
            <strong>30 Reiseziele</strong> weltweit. Alle Buchungen mit{" "}
            <strong>Sofortbestätigung</strong>, mobilem Ticket und kostenloser Stornierung.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Spare Wartezeit mit <strong>Skip-the-Line-Tickets</strong> für die begehrtesten
            Sehenswürdigkeiten. Buche Tagestouren, Halbtagesausflüge oder mehrtägige Abenteuer –
            einzeln oder als praktisches Kombi-Ticket. Die Auswahl umfasst Kultur, Outdoor,
            Food-Touren, Shows und vieles mehr.
          </p>
        </section>

        {/* ── World Discovery (continent selector + live widget) ────────── */}
        <section id="aktivitaeten-entdecken" className="pb-10 border-t border-gray-100 pt-10">
          <AktivitaetenDiscovery />
        </section>

        {/* ── Aktivitäten nach Kategorie ────────────────────────────────── */}
        <section id="aktivitaeten-kategorien" className="py-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Aktivitäten nach Kategorie
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Von Kultururlaub bis Outdoor-Abenteuer – entdecke alle Aktivitäts-Typen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className="font-bold text-gray-900">{cat.label}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">{cat.desc}</p>
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-gray-500">Beispiele:</span>{" "}
                  {cat.examples}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP REISEZIELE GRID (full-width bg)
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="aktivitaeten-reiseziele" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Reiseziele für Aktivitäten
            </h2>
            <Link
              href="/urlaubsziele/"
              className="text-sm font-semibold text-[#00838F] hover:text-[#6CC4BA] transition-colors"
            >
              Alle Reiseziele →
            </Link>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Wähle dein Urlaubsziel und entdecke die besten Touren, Tickets &amp; Sehenswürdigkeiten vor Ort.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredCities.map((dest) => (
              <Link
                key={dest.slug}
                href={`/aktivitaeten/${dest.slug}/`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 aspect-[3/4] block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generateHeroFallback(dest.unsplashKeyword)}
                  alt={`Aktivitäten & Touren in ${dest.name} buchen`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-[10px] text-white/65 font-medium uppercase tracking-wide mb-0.5 leading-none">
                    {dest.country}
                  </p>
                  <h3 className="text-sm font-bold leading-tight mb-2">{dest.name}</h3>
                  <span className="inline-flex items-center gap-1 bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-colors">
                    🎟️ Entdecken
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="aktivitaeten-faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Häufige Fragen zu Aktivitäten &amp; Tickets
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Alles rund um Buchung, Stornierung, Skip-the-Line &amp; mehr.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map(({ q, a }) => (
            <div
              key={q}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-start gap-2">
                <span className="text-[#00838F] font-extrabold shrink-0 mt-0.5">Q</span>
                {q}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-br from-[#00838F] to-[#004F5A] rounded-3xl p-10 text-white text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-4xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Urlaub + Aktivitäten kombinieren</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Finde zuerst die perfekte Pauschalreise – und buche dann die besten
              Aktivitäten passend zu deinem Urlaubsziel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/urlaubsziele/"
                className="inline-block bg-white text-[#00838F] font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
              >
                Pauschalreisen entdecken →
              </Link>
              <Link
                href="/last-minute/"
                className="inline-block bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/25 transition-colors border border-white/30"
              >
                Last-Minute Deals →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
