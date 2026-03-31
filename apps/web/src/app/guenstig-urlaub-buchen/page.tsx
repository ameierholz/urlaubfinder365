import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, RefreshCcw, BookOpen, HeartHandshake } from "lucide-react";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import CollapsibleIbeWidget from "@/components/widgets/CollapsibleIbeWidget";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Günstig Urlaub buchen – aktuelle Deals 2026",
  description:
    "Günstig Urlaub buchen: Pauschalreisen, All-Inclusive & Last-Minute täglich aktuell ✓ Direktbuchung beim Veranstalter ✓ Bestpreis ohne versteckte Aufpreise.",
  alternates: { canonical: `${BASE_URL}/guenstig-urlaub-buchen/` },
  openGraph: {
    title: "Günstig Urlaub buchen 2026 – aktuelle Deals | Urlaubfinder365",
    description:
      "Pauschalreisen, All-Inclusive & Last-Minute täglich aktualisiert ✓ Direktbuchung ✓ Bestpreis-Garantie – jetzt vergleichen auf Urlaubfinder365.",
    url: `${BASE_URL}/guenstig-urlaub-buchen/`,
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Günstig Urlaub buchen – Strandurlaub Deals auf Urlaubfinder365",
      },
    ],
  },
};

// ── Statische Inhalte ───────────────────────────────────────────────────────────

const REISEARTEN = [
  {
    emoji: "✈️",
    label: "Pauschalreise",
    desc: "Flug + Hotel – bequem, sicher und oft günstiger als Einzelbuchung.",
    badge: "Bestseller",
    badgeColor: "bg-[#6CC4BA] text-white",
    href: "/urlaubsarten/pauschalreisen/",
    highlights: ["Flug inklusive", "Transfer inklusive", "Direktbuchung"],
    bg: "from-[#00838F] to-[#005F6B]",
  },
  {
    emoji: "🍹",
    label: "All-Inclusive",
    desc: "Essen, Trinken & Snacks rund um die Uhr – entspannt ohne Preisschock.",
    badge: "Beliebt",
    badgeColor: "bg-amber-500 text-white",
    href: "/urlaubsziele/",
    highlights: ["Vollpension inklusive", "Softdrinks & Bar", "Keine Überraschungen"],
    bg: "from-amber-600 to-orange-700",
  },
  {
    emoji: "⚡",
    label: "Last-Minute",
    desc: "Spontan reisen & bis zu 60 % sparen – Abflug innerhalb der nächsten 14 Tage.",
    badge: "Bis −60 %",
    badgeColor: "bg-red-500 text-white",
    href: "/last-minute/",
    highlights: ["Abflug in <14 Tagen", "Bestpreise", "Sofortbuchung"],
    bg: "from-red-600 to-rose-700",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    label: "Familienurlaub",
    desc: "Familienfreundliche Resorts & Clubs – Kinder willkommen, Eltern entspannen.",
    badge: "Familien-Tipp",
    badgeColor: "bg-violet-500 text-white",
    href: "/urlaubsziele/",
    highlights: ["Kinderermäßigung", "Familienzimmer", "Wasserspaß"],
    bg: "from-violet-600 to-purple-700",
  },
];

const SPAR_TIPPS = [
  {
    num: "01",
    title: "Flexibel beim Abflughafen",
    text: "Mehrere Abflughäfen vergleichen zahlt sich aus – oft ist ein nahegelegener Airport deutlich günstiger.",
  },
  {
    num: "02",
    title: "Außerhalb der Schulferien reisen",
    text: "Wer nicht an Ferienzeiten gebunden ist, spart regelmäßig 30–50 % gegenüber dem Ferienpreis.",
  },
  {
    num: "03",
    title: "Frühbucher-Rabatte mitnehmen",
    text: "Beliebte Ziele wie Mallorca, Kreta oder Antalya sind 6–12 Monate im Voraus oft 20–30 % günstiger.",
  },
  {
    num: "04",
    title: "Last-Minute für Spontane",
    text: "Kurzfristig gebuchte Reisen (7–14 Tage vorher) werden oft stark rabattiert, da Veranstalter Plätze füllen müssen.",
  },
  {
    num: "05",
    title: "All-Inclusive rechnet sich oft",
    text: "Beim Rechnen mit Speisen, Snacks und Getränken ist All-Inclusive häufig günstiger als Halbpension + Extras.",
  },
  {
    num: "06",
    title: "Pauschal statt Einzelbuchung",
    text: "Veranstalter haben bessere Einkaufspreise als du als Einzelreisender – Pauschal ist daher oft günstiger.",
  },
];

const FAQS = [
  {
    q: "Warum sind Pauschalreisen oft günstiger als Einzelbuchungen?",
    a: "Reiseveranstalter buchen Flugplätze und Hotelzimmer in großen Kontingenten zu Großhandelspreisen ein. Diese Ersparnis geben sie an Kunden weiter – das Ergebnis ist ein Paket, das günstiger ist als Flug + Hotel einzeln gebucht. Hinzu kommt der gesetzliche Reiseschutz (Insolvenzschutz), den du bei Einzelbuchungen nicht automatisch hast.",
  },
  {
    q: "Wann sind Last-Minute Reisen am günstigsten?",
    a: "Die besten Last-Minute Preise findest du typischerweise 7 bis 14 Tage vor Abflug, wenn Veranstalter noch freie Plätze füllen müssen. Besonders attraktiv sind dabei Reisen ab Donnerstag bis Samstag. Wichtig: Du brauchst Flexibilität beim Ziel, Abflughafen und Hotelkategorie.",
  },
  {
    q: "Wie finde ich den günstigsten Preis für meine Reise?",
    a: "Unser Vergleichsrechner oben durchsucht täglich Tausende Angebote von über 200 Reiseveranstaltern. Einfach Abflughafen, Reisezeitraum, Reisedauer und Reiseteilnehmer eingeben – die Ergebnisse sind sofort nach Preis sortiert. Es fallen keine Buchungsgebühren an, du buchst direkt beim Veranstalter.",
  },
  {
    q: "Wann sollte ich eine Frühbucher-Reise buchen?",
    a: "Frühbucher-Angebote gibt es typischerweise 8 bis 12 Monate vor Abflug. Die besten Preise für den Sommer findest du demnach ab Oktober/November des Vorjahres. Besonders lohnt sich Frühbuchen bei beliebten Zielen (Mallorca, Kreta, Türkei) und in der Hauptreisezeit Juli/August.",
  },
  {
    q: "Gibt es versteckte Kosten bei Pauschalreisen?",
    a: "Bei seriösen Veranstaltern sind keine versteckten Kosten vorgesehen. Der angezeigte Preis enthält Flug, Transfer und Hotel. Optionale Extras wie Mietwagen, Ausflüge oder Strandliegen werden transparent ausgewiesen. Beim Buchungsprozess siehst du alle Kosten zusammengefasst, bevor du zahlst.",
  },
  {
    q: "Was ist der Unterschied zwischen All-Inclusive und Halbpension?",
    a: "Bei Halbpension (HP) sind Frühstück und Abendessen im Hotelpreis enthalten. All-Inclusive (AI) umfasst zusätzlich Mittagessen, Snacks, Softdrinks und je nach Hotel auch Alkohol rund um die Uhr. Für Familien oder Strandurlaubs-Typen, die wenig außerhalb essen, lohnt sich AI fast immer.",
  },
];

// ── JSON-LD ────────────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite",             item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Günstig Urlaub buchen",  item: `${BASE_URL}/guenstig-urlaub-buchen/` },
  ],
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

// ── Page ────────────────────────────────────────────────────────────────────────
export default function GuenstigUrlaubBuchen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO + SUCHE
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-20 pt-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80')" }}
      >
        {/* Gradient-Overlay für Lesbarkeit */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(0,131,143,0.82) 0%, rgba(0,107,119,0.76) 50%, rgba(0,79,90,0.86) 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🔍 Reisevergleich &amp; Direktbuchung
          </div>

          {/* Headline + Trust-Chips nebeneinander */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-6">

            {/* Links: Headline, Beschreibung, Bullet-USPs */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Günstig Urlaub buchen –<br />
                <span className="text-[#6CC4BA]">Bestpreis-Vergleich</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-5">
                Täglich aktualisierte Pauschalreisen, All-Inclusive &amp; Last-Minute Deals –
                direkt beim Veranstalter, ohne Aufpreise.
              </p>
            </div>

            {/* Rechts: Trust-Chips vertikal */}
            <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:shrink-0">
              {([
                { Icon: ShieldCheck,    label: "Günstigster Preis",       color: "#6CC4BA" },
                { Icon: RefreshCcw,     label: "Täglich aktuell",          color: "#f59e0b" },
                { Icon: BookOpen,       label: "Kostenlose Reiseführer",   color: "#a78bfa" },
                { Icon: HeartHandshake, label: "Sicher & einfach",         color: "#34d399" },
              ] as const).map(({ Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2.5 rounded-xl">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-10">
            {REISEARTEN.map((art) => (
              <div
                key={art.label}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Gradient Header – Emoji + Titel in einer Zeile */}
                <div className={`bg-gradient-to-br ${art.bg} px-4 py-3.5 text-white relative`}>
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${art.badgeColor}`}>
                      {art.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 pr-14">
                    <span className="text-2xl leading-none">{art.emoji}</span>
                    <h3 className="font-extrabold text-base leading-tight">{art.label}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white p-3.5">
                  <p className="text-xs text-gray-500 leading-relaxed mb-2.5">{art.desc}</p>
                  <ul className="space-y-1.5">
                    {art.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 text-[#6CC4BA] shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── IBE aufklappbar (unterhalb Hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10">
        <CollapsibleIbeWidget dataSrc="https://b2b.specials.de/index/jump/119/2780/993243/?from=0&to=180&duration=7-14&adults=2" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          AKTUELLE DEALS – IbeTeaser Carousels
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Aktuelle Angebote – täglich aktualisiert
            </h2>
            <p className="text-gray-500 text-sm">
              Live-Preise direkt von über 200 Reiseveranstaltern – klick auf ein Angebot zur Sofortbuchung.
            </p>
          </div>

          {/* Türkei */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇹🇷</span>
              <h3 className="text-lg font-bold text-gray-900">Türkei – Günstig Urlaub buchen</h3>
              <Link href="/urlaubsziele/tuerkei/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Türkei-Angebote →
              </Link>
            </div>
            <IbeTeaser
              regionId="149"
              headline=""
              diverseResults={true}
              sortBy="count"
              minRecommrate="20"
              from="7"
              to="120"
              duration="7-14"
            />
          </section>

          {/* Spanien */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇪🇸</span>
              <h3 className="text-lg font-bold text-gray-900">Spanien &amp; Balearen – Günstig buchen</h3>
              <Link href="/urlaubsziele/spanien/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Spanien-Angebote →
              </Link>
            </div>
            <IbeTeaser
              regionId="133"
              headline=""
              diverseResults={true}
              sortBy="count"
              minRecommrate="20"
              from="7"
              to="120"
              duration="7-14"
            />
          </section>

          {/* Griechenland */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇬🇷</span>
              <h3 className="text-lg font-bold text-gray-900">Griechenland &amp; Inseln – Günstig buchen</h3>
              <Link href="/urlaubsziele/griechenland/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Griechenland-Angebote →
              </Link>
            </div>
            <IbeTeaser
              regionId="46"
              headline=""
              diverseResults={true}
              sortBy="count"
              minRecommrate="20"
              from="7"
              to="120"
              duration="7-14"
            />
          </section>

          {/* Ägypten */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇪🇬</span>
              <h3 className="text-lg font-bold text-gray-900">Ägypten – Günstig buchen</h3>
              <Link href="/urlaubsziele/aegypten/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Ägypten-Angebote →
              </Link>
            </div>
            <IbeTeaser
              regionId="560"
              headline=""
              diverseResults={true}
              sortBy="count"
              minRecommrate="20"
              from="7"
              to="120"
              duration="7-14"
            />
          </section>

          {/* Italien */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇮🇹</span>
              <h3 className="text-lg font-bold text-gray-900">Italien – Günstig buchen</h3>
              <Link href="/urlaubsziele/italien/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Italien-Angebote →
              </Link>
            </div>
            <IbeTeaser
              regionId="83"
              headline=""
              diverseResults={true}
              sortBy="count"
              minRecommrate="20"
              from="7"
              to="120"
              duration="7-14"
            />
          </section>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SPAR-TIPPS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          6 Tipps für günstigen Urlaub
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          So holst du das Beste aus deinem Reisebudget heraus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPAR_TIPPS.map((tip) => (
            <div
              key={tip.num}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-4"
            >
              <span className="text-3xl font-extrabold text-gray-100 leading-none shrink-0 select-none">
                {tip.num}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Häufige Fragen rund ums günstige Buchen
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Alles was du zu Pauschalreisen, Last-Minute &amp; Frühbuchern wissen solltest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-[#00838F] to-[#004F5A] rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Alle Urlaubsziele entdecken</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Von Türkei über Mallorca bis Malediven – entdecke günstige Angebote
              für über 50 Reiseziele weltweit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/urlaubsziele/"
                className="inline-block bg-white text-[#00838F] font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
              >
                Alle Urlaubsziele →
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
