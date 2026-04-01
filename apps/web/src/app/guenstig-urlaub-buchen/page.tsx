import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, RefreshCcw, BookOpen, HeartHandshake } from "lucide-react";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import CollapsibleIbeWidget from "@/components/widgets/CollapsibleIbeWidget";
import ReiseartenCards from "@/components/widgets/ReiseartenCards";

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

        </div>
      </div>

      {/* ── IBE aufklappbar (unterhalb Hero) ── */}
      <div id="ibe-suche" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10 scroll-mt-24">
        <CollapsibleIbeWidget dataSrc="https://b2b.specials.de/index/jump/119/2780/993243/?from=0&to=180&duration=7-14&adults=2" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          URLAUBSARTEN – Reisearten Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <ReiseartenCards />

      {/* ═══════════════════════════════════════════════════════════════════
          AKTUELLE DEALS – IbeTeaser Carousels
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-gray-50">

        {/* ── Section Header ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-600">Live-Preise</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                Aktuelle Angebote – täglich aktualisiert
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Direkt von über 200 Reiseveranstaltern – klick auf ein Angebot zur Sofortbuchung.
              </p>
            </div>
            {/* Stat-Chips */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {[
                { label: "200+ Veranstalter" },
                { label: "5 Top-Länder" },
                { label: "Täglich aktuell" },
              ].map(({ label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ LAST-MINUTE — Editorial CTA-Sektion ════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)" }}
        >
          {/* Dekorative Kreise */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">

              {/* Linke Seite: Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-red-300">Spontan &amp; günstig</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
                  ⚡ Last-Minute
                </h3>
                <p className="text-red-100/80 text-base leading-relaxed mb-5 max-w-lg">
                  Abflug in den nächsten 14 Tagen: Veranstalter räumen freie Plätze mit bis zu 60 % Rabatt. Ideal für alle, die flexibel sind und spontan in den Urlaub wollen.
                </p>
                {/* Fact-Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["✈️ Abflug in &lt;14 Tagen", "💸 Bis zu 60 % günstiger", "🔥 Täglich neue Angebote", "⏱️ Sofortbuchung"].map(f => (
                    <span key={f} className="bg-red-900/60 border border-red-700/50 text-red-100 text-xs font-medium px-3 py-1.5 rounded-full"
                      dangerouslySetInnerHTML={{ __html: f }} />
                  ))}
                </div>
                <Link
                  href="/last-minute/"
                  className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 text-sm font-bold px-6 py-3 rounded-full transition-colors shadow-lg"
                >
                  Alle Last-Minute Deals ansehen →
                </Link>
              </div>

              {/* Rechte Seite: Ziel-Grid */}
              <div className="lg:w-80 shrink-0">
                <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-3">Beliebte Last-Minute Ziele</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { flag: "tr", name: "Türkei",       href: "/urlaubsziele/tuerkei/" },
                    { flag: "es", name: "Mallorca",      href: "/urlaubsziele/mallorca/" },
                    { flag: "gr", name: "Griechenland",  href: "/urlaubsziele/griechenland/" },
                    { flag: "eg", name: "Ägypten",       href: "/urlaubsziele/aegypten/" },
                    { flag: "pt", name: "Portugal",      href: "/urlaubsziele/portugal/" },
                    { flag: "cy", name: "Zypern",        href: "/urlaubsziele/zypern/" },
                  ].map(({ flag, name, href }) => (
                    <Link
                      key={name}
                      href={href}
                      className="flex items-center gap-2 bg-red-900/50 hover:bg-red-800/70 border border-red-800/40 text-white text-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://flagcdn.com/w20/${flag}.png`} width="18" height="13" alt={name} className="rounded-sm shrink-0" />
                      {name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══ TÜRKEI — Layout: Großes Banner, Text-Overlay unten ══════════ */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
            <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 mb-6 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1400&q=85" alt="Türkei" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <Link href="/urlaubsziele/tuerkei/" className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#00838F] text-xs font-bold px-3.5 py-1.5 rounded-full shadow transition-colors">
                Alle Türkei-Angebote →
              </Link>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/tr.png" width="28" height="21" alt="Türkei" className="rounded shadow" />
                  <span className="text-white/70 text-sm">Antalya · Side · Bodrum · Alanya</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow mb-3">Türkei</h3>
                <div className="flex flex-wrap gap-2">
                  {["☀️ 300+ Sonnentage", "✈️ ~3,5h Flugzeit", "🏨 AI ab 399 €"].map(f => (
                    <span key={f} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-3xl">
              Die Türkei zählt zu den beliebtesten Urlaubszielen der Deutschen – Traumstrände, jahrhundertealte Geschichte und großzügige All-Inclusive-Resorts machen das Land zum Preis-Leistungs-Champion.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <IbeTeaser regionId="149" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </div>
        </div>

        {/* ══ SPANIEN — Layout: Split (Bild links, Text rechts) ══════════ */}
        <div className="bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Bild links */}
              <div className="lg:w-5/12 shrink-0">
                <div className="relative rounded-2xl overflow-hidden h-52 lg:h-full min-h-55 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=85" alt="Spanien" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/es.png" width="28" height="21" alt="Spanien" className="absolute bottom-4 left-4 rounded shadow" />
                </div>
              </div>
              {/* Text rechts */}
              <div className="flex flex-col justify-center lg:py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Spanien &amp; Balearen</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                  Mallorca, Teneriffa,<br />Gran Canaria &amp; Ibiza
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed my-4">
                  Von der pulsierenden Partyinsel Ibiza bis zur Familiendestination Mallorca: Spanien bietet für jeden das Richtige – mit kurzen Flugzeiten und unschlagbaren Preisen.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["🌊 Traumstrände", "✈️ ~2,5h Flugzeit", "👨‍👩‍👧 Familienfreundlich"].map(f => (
                    <span key={f} className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">{f}</span>
                  ))}
                </div>
                <Link href="/urlaubsziele/spanien/" className="self-start inline-flex items-center gap-1.5 bg-[#00838F] hover:bg-[#006B77] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow">
                  Alle Spanien-Angebote →
                </Link>
              </div>
            </div>
            <IbeTeaser regionId="133" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </div>
        </div>

        {/* ══ GRIECHENLAND — Layout: Editorial (Text dominant, Bild rechts) ══ */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row gap-6 mb-6 items-start">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/gr.png" width="32" height="24" alt="Griechenland" className="rounded shadow" />
                  <div className="h-px flex-1 bg-blue-100" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-1">
                  Griechenland
                </h3>
                <p className="text-base text-blue-600 font-semibold mb-4">Kreta · Rhodos · Korfu · Santorini · Mykonos</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-lg">
                  Weiß-blaue Häuser, kristallklares Wasser und unschlagbare Gastfreundschaft: Griechenland verzaubert Jahr für Jahr Millionen Besucher. Jede Insel hat ihren ganz eigenen Charakter.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["🏛️ Antike Kultur", "✈️ ~3h Flugzeit", "🌅 Weltklasse-Sonnenuntergänge"].map(f => (
                    <span key={f} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">{f}</span>
                  ))}
                </div>
                <Link href="/urlaubsziele/griechenland/" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Alle Griechenland-Angebote →
                </Link>
              </div>
              {/* Bild rechts – kleiner, floating */}
              <div className="sm:w-64 lg:w-80 shrink-0">
                <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=85" alt="Griechenland" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
            <IbeTeaser regionId="46" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </div>
        </div>

        {/* ══ ÄGYPTEN — Layout: Dramatisch dunkles Banner, zentriert ══════ */}
        <div className="bg-amber-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
            <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 mb-6 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1400&q=85" alt="Ägypten" className="w-full h-full object-cover object-center" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80" />
              <Link href="/urlaubsziele/aegypten/" className="absolute top-4 right-4 bg-amber-400/90 hover:bg-amber-400 text-amber-950 text-xs font-bold px-3.5 py-1.5 rounded-full shadow transition-colors">
                Alle Ägypten-Angebote →
              </Link>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="flex items-center gap-2 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/eg.png" width="28" height="21" alt="Ägypten" className="rounded shadow" />
                  <span className="text-amber-200 text-sm">Hurghada · Sharm el-Sheikh · Marsa Alam</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">Ägypten</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {["🐠 Top-Tauchspot", "✈️ ~4,5h Flugzeit", "🏺 7.000 Jahre Geschichte"].map(f => (
                    <span key={f} className="bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 text-amber-100 text-xs font-medium px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-amber-200/80 leading-relaxed mb-6 max-w-3xl">
              Ägypten bietet das perfekte Doppelpaket: tagsüber Schnorcheln im Roten Meer, dazu Ausflüge zu den ältesten Bauwerken der Menschheit – und das zu unschlagbaren Preisen.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <IbeTeaser regionId="560" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </div>
        </div>

        {/* ══ ITALIEN — Layout: Split gespiegelt (Text links, Bild rechts) ═ */}
        <div className="bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row-reverse gap-6 mb-6">
              {/* Bild rechts */}
              <div className="lg:w-5/12 shrink-0">
                <div className="relative rounded-2xl overflow-hidden h-52 lg:h-full min-h-55 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=85" alt="Italien" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://flagcdn.com/w40/it.png" width="28" height="21" alt="Italien" className="absolute bottom-4 right-4 rounded shadow" />
                </div>
              </div>
              {/* Text links */}
              <div className="flex flex-col justify-center lg:py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">La dolce vita</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                  Italien –<br />Sizilien, Sardinien &amp; Amalfi
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed my-4">
                  In Italien stimmt einfach alles: Weltklasse-Küche, beeindruckende Kunstschätze und dramatische Landschaften. Ob Städtereise oder Strandurlaub – Italia macht alles richtig.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["🍕 Weltküche", "✈️ ~2h Flugzeit", "🎨 60 UNESCO-Welterbe"].map(f => (
                    <span key={f} className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">{f}</span>
                  ))}
                </div>
                <Link href="/urlaubsziele/italien/" className="self-start inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow">
                  Alle Italien-Angebote →
                </Link>
              </div>
            </div>
            <IbeTeaser regionId="83" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </div>
        </div>

        <div className="pb-2" />
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
        <div className="bg-linear-to-br from-[#00838F] to-[#004F5A] rounded-3xl p-10 text-white text-center relative overflow-hidden">
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
