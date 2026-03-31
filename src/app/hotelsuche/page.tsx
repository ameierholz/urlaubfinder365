import type { Metadata } from "next";
import Link from "next/link";
import { Hotel, Star, ShieldCheck, RefreshCcw, Tag, Wifi, CheckCircle } from "lucide-react";
import CollapsibleIbeWidget from "@/components/widgets/CollapsibleIbeWidget";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import PageNavBar from "@/components/ui/PageNavBar";
import AdBanner from "@/components/ui/AdBanner";

const BASE_URL = "https://www.urlaubfinder365.de";

const HOTEL_NAV_ITEMS = [
  { id: "hotel-widget",       label: "Hotel suchen",   emoji: "🏨" },
  { id: "hotelangebote",      label: "Hotelangebote",  emoji: "🌍" },
  { id: "hoteltypen",         label: "Hoteltypen",     emoji: "⭐" },
  { id: "bewertungs-kompass", label: "Bewertungen",    emoji: "📊" },
  { id: "hotel-tipps",        label: "Hotel-Tipps",    emoji: "💡" },
  { id: "faq",                label: "FAQ",            emoji: "❓" },
];

// ── Statische Inhalte ────────────────────────────────────────────────────────

const HOTEL_TIPPS = [
  {
    num: "01",
    title: "Früh buchen – besser schlafen",
    text: "Beliebte Hotels in Toplagen sind schnell ausgebucht. Wer 3–6 Monate im Voraus bucht, sichert sich die besten Zimmer zum besten Preis.",
  },
  {
    num: "02",
    title: "Hotelkategorie clever wählen",
    text: "4-Sterne-Hotels bieten oft mehr Komfort als 5-Sterne-Anlagen mit veraltetem Standard. Bewertungen lesen lohnt sich immer.",
  },
  {
    num: "03",
    title: "All-Inclusive rechnet sich oft",
    text: "Gerade in der Türkei und Ägypten ist All-Inclusive häufig kaum teurer als Halbpension – dafür sind Essen und Getränke inklusive.",
  },
  {
    num: "04",
    title: "Direkte Strandlage vs. Shuttleservice",
    text: "Hotels mit direktem Strandzugang kosten mehr, sparen aber teure Transfers. Bei großen Anlagen lohnt sich der Vergleich.",
  },
  {
    num: "05",
    title: "Kinderfreundlichkeit prüfen",
    text: "Für Familien lohnt sich ein Blick auf Kinderklubs, Babyausstattung und Sicherheit am Pool – diese Details stehen oft nur in den Bewertungen.",
  },
  {
    num: "06",
    title: "Stornokonditionen beachten",
    text: "Flexible Tarife kosten etwas mehr, bieten aber kostenlose Stornierung. Bei unsicherer Planung kann das viel Geld sparen.",
  },
];

const FAQS = [
  {
    q: "Was ist der Unterschied zwischen All-Inclusive und Halbpension?",
    a: "Bei Halbpension (HP) sind Frühstück und Abendessen inklusive. All-Inclusive (AI) umfasst zusätzlich Mittagessen, Snacks und Getränke rund um die Uhr. Für Strand- und Poolurlaube ist AI meistens die günstigere Wahl.",
  },
  {
    q: "Welche Hotelkategorie empfiehlt sich für Familien?",
    a: "Für Familien sind Clubs und Resorts mit Kinderbetreuung, Wasserspaß und Familienanimation ideal. 4-Sterne-Anlagen bieten hier oft ein besseres Preis-Leistungs-Verhältnis als 5-Sterne-Luxushotels.",
  },
  {
    q: "Wie finde ich das günstigste Hotel?",
    a: "Unser Suchrechner vergleicht täglich tausende Hotelangebote von über 200 Veranstaltern. Einfach Reiseziel, Zeitraum und Personen eingeben – die Ergebnisse sind nach Preis sortiert, Buchung direkt beim Anbieter ohne Aufpreis.",
  },
  {
    q: "Was bedeutet 'direkte Strandlage'?",
    a: "Direkte Strandlage bedeutet, dass das Hotel einen eigenen Zugang zum Strand hat, ohne Straße oder öffentlichen Bereich zu überqueren. Hotels mit direkter Strandlage sind teurer, bieten aber mehr Komfort und Sicherheit für Familien.",
  },
  {
    q: "Sind die angezeigten Preise pro Person oder pro Zimmer?",
    a: "Die Preise in unserem Vergleich sind grundsätzlich pro Person angegeben, inklusive Flug und Transfer (Pauschalreise). Bei reinen Hotelbuchungen wird der Preis pro Zimmer und Nacht angezeigt.",
  },
  {
    q: "Kann ich Hotels auch ohne Flug buchen?",
    a: "Ja – über unseren Hotelrechner kannst du Hotels auch als reines Übernachtungsangebot ohne Flug suchen und buchen. Wähle einfach im Suchformular 'Nur Hotel' aus.",
  },
];

// ── JSON-LD ──────────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Hotelsuche",  item: `${BASE_URL}/hotelsuche/` },
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

export const metadata: Metadata = {
  title: "Hotelsuche – Günstige Hotels finden & buchen",
  description:
    "Hotels weltweit vergleichen & direkt buchen. Täglich aktualisierte Hotelpreise von über 200 Veranstaltern – alle Kategorien, alle Reiseziele, kein Aufpreis.",
  alternates: { canonical: `${BASE_URL}/hotelsuche/` },
  openGraph: {
    title: "Hotelsuche – Günstige Hotels finden & buchen | Urlaubfinder365",
    description: "Hotels weltweit vergleichen & direkt buchen. Täglich aktualisierte Hotelpreise von über 200 Veranstaltern – alle Kategorien, alle Reiseziele, kein Aufpreis.",
    url: `${BASE_URL}/hotelsuche/`,
    type: "website",
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HotelSuchePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px] md:h-[440px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')" }}
      >
        {/* Gradient-Overlay – lighter so the hotel photo shines through */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(120,53,15,0.55) 0%, rgba(180,83,9,0.40) 50%, rgba(120,53,15,0.65) 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            <Hotel className="w-4 h-4" />
            Hotelvergleich &amp; Direktbuchung
          </div>

          {/* Headline + Trust-Chips */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-6">

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Günstige Hotels finden –<br />
                <span className="text-amber-300">Weltweit direkt buchen</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-4">
                Hotelpreise vergleichen von über 200 Veranstaltern – täglich aktualisiert,
                alle Kategorien, direkt beim Veranstalter.
              </p>

              {/* Hotelkategorien-Pills */}
              <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
                Verfügbare Kategorien
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {["⭐⭐⭐ Budget", "⭐⭐⭐⭐ Komfort", "⭐⭐⭐⭐⭐ Luxus", "🏖️ Strandhotels", "👨‍👩‍👧‍👦 Familienhotels", "🌿 Boutique"].map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust-Chips */}
            <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:shrink-0">
              {([
                { Icon: Tag,        label: "Bestpreis-Garantie",   color: "#fcd34d" },
                { Icon: RefreshCcw, label: "Täglich aktuell",       color: "#f59e0b" },
                { Icon: ShieldCheck,label: "Sicher buchen",         color: "#34d399" },
                { Icon: Wifi,       label: "WLAN-Info inklusive",   color: "#a78bfa" },
              ] as const).map(({ Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2.5 rounded-xl">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Wellenabschluss */}
        <div className="h-8" />
      </div>

      {/* ── Sticky Schnellnavigation ── */}
      <PageNavBar items={HOTEL_NAV_ITEMS} />

      {/* ═══════════════════════════════════════════════════════════════════
          ZWEISPALTEN-LAYOUT: Hauptinhalt + Sticky Sidebar Ad
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">

        {/* ── Hauptinhalt (linke Spalte) ── */}
        <div className="flex-1 min-w-0">

      {/* ── IBE Hotelsuche – ein-/ausklappbar ── */}
      <div id="hotel-widget" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[2px] mt-8 mb-2">
        <CollapsibleIbeWidget
          dataSrc="https://b2b.specials.de/index/jump/124/2818/993243/"
          label="Hotel suchen & buchen"
          hint="Alle Reiseziele · Alle Kategorien · 200+ Veranstalter"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          AKTUELLE HOTELANGEBOTE – IbeTeaser
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="hotelangebote" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Aktuelle Hotelangebote
            </h2>
            <p className="text-gray-500 text-sm">
              Live-Preise von über 200 Veranstaltern – täglich aktualisiert.
            </p>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://flagcdn.com/48x36/tr.png" alt="Türkei" width={24} height={18} className="rounded shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Türkei – Hotels & Resorts</h3>
              <Link href="/urlaubsziele/tuerkei/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Türkei-Angebote →
              </Link>
            </div>
            <IbeTeaser regionId="149" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://flagcdn.com/48x36/es.png" alt="Spanien" width={24} height={18} className="rounded shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Spanien & Balearen – Hotels</h3>
              <Link href="/urlaubsziele/spanien/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Spanien-Angebote →
              </Link>
            </div>
            <IbeTeaser regionId="133" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://flagcdn.com/48x36/gr.png" alt="Griechenland" width={24} height={18} className="rounded shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Griechenland – Hotels & Inseln</h3>
              <Link href="/urlaubsziele/griechenland/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Griechenland-Angebote →
              </Link>
            </div>
            <IbeTeaser regionId="46" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://flagcdn.com/48x36/eg.png" alt="Ägypten" width={24} height={18} className="rounded shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Ägypten – Hotels am Roten Meer</h3>
              <Link href="/urlaubsziele/aegypten/" className="ml-auto text-xs text-[#00838F] font-semibold hover:underline">
                Alle Ägypten-Angebote →
              </Link>
            </div>
            <IbeTeaser regionId="560" headline="" diverseResults={true} sortBy="count" minRecommrate="20" from="7" to="120" duration="7-14" />
          </section>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HOTELKATEGORIEN
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="hoteltypen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          Welcher Hoteltyp passt zu dir?
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Von Strandresort bis Stadthotel – finde das perfekte Angebot.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              emoji: "🏖️",
              label: "Strandhotel",
              desc: "Direkte Lage am Meer – aufwachen und ins Wasser springen.",
              bg: "from-cyan-600 to-blue-700",
              badge: "Bestseller",
              badgeColor: "bg-white/20 text-white",
              highlights: ["Direkter Strandzugang", "Sonnenliegen inklusive", "Meerblick-Zimmer"],
            },
            {
              emoji: "🌴",
              label: "All-Inclusive Resort",
              desc: "Essen, Trinken & Entertainment rund um die Uhr – einfach entspannen.",
              bg: "from-[#00838F] to-[#005F6B]",
              badge: "Beliebt",
              badgeColor: "bg-white/20 text-white",
              highlights: ["Vollpension inklusive", "Bar & Snacks ganztags", "Abendprogramm"],
            },
            {
              emoji: "👨‍👩‍👧‍👦",
              label: "Familienhotel",
              desc: "Kinderbetreuung, Wasserspaß & Spielplatz – Eltern können entspannen.",
              bg: "from-violet-600 to-purple-700",
              badge: "Familien-Tipp",
              badgeColor: "bg-white/20 text-white",
              highlights: ["Kinderklub", "Babybett inklusive", "Kinderpool"],
            },
            {
              emoji: "🏙️",
              label: "Stadthotel",
              desc: "Zentral gelegen, perfekt für Städtetrips und Kurzurlaube.",
              bg: "from-slate-600 to-gray-700",
              badge: "City-Break",
              badgeColor: "bg-white/20 text-white",
              highlights: ["Zentrale Lage", "WLAN inklusive", "Frühstück optional"],
            },
          ].map((typ) => (
            <div key={typ.label} className="rounded-2xl overflow-hidden shadow-sm">
              <div className={`bg-gradient-to-br ${typ.bg} px-4 py-4 text-white relative`}>
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typ.badgeColor}`}>
                    {typ.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 pr-14">
                  <span className="text-2xl leading-none">{typ.emoji}</span>
                  <h3 className="font-extrabold text-base leading-tight">{typ.label}</h3>
                </div>
              </div>
              <div className="bg-white p-4">
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{typ.desc}</p>
                <ul className="space-y-1.5">
                  {typ.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3 text-amber-400 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BEWERTUNGS-KOMPASS
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="bewertungs-kompass" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Exklusiver Ratgeber
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Bewertungs-Kompass: Was bedeuten die Hotel-Noten?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            So liest du Hotelbewertungen richtig – und buchst das beste Hotel zum besten Preis.
          </p>

          {/* Rating Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
            {[
              {
                range: "9,0 – 10",
                label: "Ausgezeichnet",
                desc: "Außergewöhnliche Qualität – Gäste sind begeistert. Selten Kritikpunkte.",
                headerBg: "bg-[#00838F]",
              },
              {
                range: "8,0 – 8,9",
                label: "Sehr gut",
                desc: "Überdurchschnittliches Hotel. Kleine Schwächen, aber insgesamt top.",
                headerBg: "bg-green-500",
              },
              {
                range: "7,0 – 7,9",
                label: "Gut",
                desc: "Solides Hotel, angenehmer Aufenthalt. Gut für preisbewusste Reisende.",
                headerBg: "bg-lime-500",
              },
              {
                range: "6,0 – 6,9",
                label: "Befriedigend",
                desc: "Grundstandard erfüllt, aber spürbare Mängel. Bewertungen genau lesen.",
                headerBg: "bg-amber-400",
              },
              {
                range: "< 6,0",
                label: "Mit Vorsicht",
                desc: "Viele kritische Bewertungen. Nur buchen wenn Preis-Leistung wirklich stimmt.",
                headerBg: "bg-orange-500",
              },
            ].map((r) => (
              <div key={r.range} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className={`${r.headerBg} px-4 py-3`}>
                  <div className="text-white font-extrabold text-lg leading-none">{r.range}</div>
                  <div className="text-white/90 font-semibold text-sm">{r.label}</div>
                </div>
                <p className="p-3 text-xs text-gray-500 leading-relaxed bg-white">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* What to check in reviews */}
          <h3 className="text-lg font-extrabold text-gray-900 mb-4">
            Worauf sollte ich bei Hotelbewertungen achten?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { emoji: "📍", label: "Lage & Umgebung", tip: "Entfernung zu Strand, Zentrum und Supermarkt" },
              { emoji: "🧹", label: "Sauberkeit", tip: "Zimmer, Bad und Gemeinschaftsbereiche" },
              { emoji: "👋", label: "Service", tip: "Freundlichkeit, Hilfsbereitschaft, Sprache" },
              { emoji: "🛏️", label: "Zimmerqualität", tip: "Bettkomfort, Klimaanlage, Balkon, Lärm" },
              { emoji: "🍽️", label: "Essen & Getränke", tip: "Qualität, Auswahl, Öffnungszeiten" },
              { emoji: "💰", label: "Preis-Leistung", tip: "Zahlt das Hotel, was es verspricht?" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100 text-center">
                <div className="text-2xl mb-1.5">{item.emoji}</div>
                <div className="font-bold text-gray-900 text-xs mb-1">{item.label}</div>
                <div className="text-gray-400 text-xs leading-tight">{item.tip}</div>
              </div>
            ))}
          </div>

          {/* Pro-Tip */}
          <div className="bg-[#00838F]/5 border border-[#00838F]/20 rounded-2xl p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-[#00838F] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Profi-Tipp: Aktuelle Bewertungen zählen mehr</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hotels verändern sich – achte besonders auf Bewertungen der letzten 6 Monate.
                Eine Note von 8,5 mit aktuellen Kommentaren schlägt eine alte 9,0 mit veralteten Erfahrungen.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HOTEL-TIPPS
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="hotel-tipps" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            6 Tipps für günstige Hotels
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            So buchst du das beste Hotel zum besten Preis.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOTEL_TIPPS.map((tip) => (
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
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="faq" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Häufige Fragen zur Hotelsuche
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Alles Wichtige rund ums Hotelbuchen.
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
        <div className="bg-gradient-to-br from-amber-700 to-orange-800 rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🏨</div>
            <h2 className="text-2xl font-bold mb-2">Hotel + Flug als Paket buchen?</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Pauschalreisen sind oft günstiger als Hotel und Flug einzeln –
              jetzt vergleichen und sparen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guenstig-urlaub-buchen/"
                className="inline-block bg-white text-amber-800 font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
              >
                Pauschalreisen vergleichen →
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

        </div>{/* ── Ende Hauptinhalt ── */}

        {/* ── Sticky Sidebar Ad (nur XL+) ── */}
        <aside className="hidden xl:block w-[160px] shrink-0 pr-4">
          <div className="sticky top-24 pt-8 space-y-3">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
                Anzeige
              </p>
              <AdBanner
                placementKey="86c5e79b5bd126e0b09685dad18c2682"
                height={600}
              />
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50 text-center">
              <p className="text-xs font-bold text-amber-800 mb-1">🏨 Pauschalreise?</p>
              <p className="text-[11px] text-amber-700 mb-3 leading-snug">
                Hotel + Flug im Paket oft günstiger
              </p>
              <Link
                href="/guenstig-urlaub-buchen/"
                className="inline-block bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-amber-800 transition-colors"
              >
                Jetzt vergleichen →
              </Link>
            </div>

            {/* SEO-Linkbox: Beliebte Hotelziele */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                🏨 Beliebte Hotelziele
              </p>
              <ul className="space-y-1.5">
                {([
                  { href: "/urlaubsziele/antalya/",           label: "Hotels Antalya" },
                  { href: "/urlaubsziele/mallorca/",          label: "Hotels Mallorca" },
                  { href: "/urlaubsziele/kreta/",             label: "Hotels Kreta" },
                  { href: "/urlaubsziele/teneriffa/",         label: "Hotels Teneriffa" },
                  { href: "/urlaubsziele/hurghada/",          label: "Hotels Hurghada" },
                  { href: "/urlaubsziele/griechische-inseln/",label: "Griechische Inseln" },
                  { href: "/urlaubsziele/tuerkei/",           label: "Hotels Türkei" },
                ] as const).map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight">
                      <span className="text-gray-300 shrink-0">›</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO-Linkbox: Urlaubsarten */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                🔗 Urlaubsarten
              </p>
              <ul className="space-y-1.5">
                {([
                  { href: "/urlaubsarten/all-inclusive-urlaub/", label: "All-Inclusive Hotel" },
                  { href: "/urlaubsarten/pauschalreisen/",       label: "Pauschalreisen" },
                  { href: "/last-minute/",                       label: "Last-Minute Hotels" },
                  { href: "/urlaubsarten/fruhbucher-urlaub/",    label: "Frühbucher Hotels" },
                  { href: "/flugsuche/",                         label: "Flug suchen" },
                  { href: "/urlaubsziele/",                      label: "Alle Reiseziele" },
                ] as const).map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight">
                      <span className="text-gray-300 shrink-0">›</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

      </div>{/* ── Ende Zweispalten-Layout ── */}

    </div>
  );
}
