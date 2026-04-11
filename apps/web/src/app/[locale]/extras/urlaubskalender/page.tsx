import type { Metadata } from "next";
import Link from "next/link";
import PageNavBar from "@/components/ui/PageNavBar";
import RightSidebar from "@/components/layout/RightSidebar";
import DestinationCard, { type Destination } from "@/components/urlaubskalender/DestinationCard";
import KalenderAngebotBox, { type KalenderAngebot } from "@/components/urlaubskalender/KalenderAngebotBox";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

const KALENDER_ANGEBOTE: KalenderAngebot[] = [
  {
    id: "ka-1",
    titel: "All-Inclusive Strandurlaub",
    ziel: "Antalya, Türkei",
    countryCode: "tr",
    preis: 349,
    foto_url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=150&q=70&fit=crop&auto=format",
    regionId: "100046",
  },
  {
    id: "ka-2",
    titel: "Traumstrand & Meerblick",
    ziel: "Mallorca, Spanien",
    countryCode: "es",
    preis: 299,
    foto_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=150&q=70&fit=crop&auto=format",
    regionId: "100052",
  },
  {
    id: "ka-3",
    titel: "Tauchen & Entspannen",
    ziel: "Hurghada, Ägypten",
    countryCode: "eg",
    preis: 279,
    foto_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=150&q=70&fit=crop&auto=format",
    regionId: "100070",
  },
  {
    id: "ka-4",
    titel: "Kultur & Strand",
    ziel: "Kreta, Griechenland",
    countryCode: "gr",
    preis: 319,
    foto_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-5",
    titel: "Wüste & Meer",
    ziel: "Dubai, VAE",
    countryCode: "ae",
    preis: 499,
    foto_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-6",
    titel: "Trauminseln & Natur",
    ziel: "Malediven",
    countryCode: "mv",
    preis: 899,
    foto_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-7",
    titel: "Tempel & Strände",
    ziel: "Thailand",
    countryCode: "th",
    preis: 599,
    foto_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=150&q=70&fit=crop&auto=format",
    regionId: "100220",
  },
  {
    id: "ka-8",
    titel: "Safari & Atlantik",
    ziel: "Kapverdische Inseln",
    countryCode: "cv",
    preis: 449,
    foto_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-9",
    titel: "Flamenco & Sonne",
    ziel: "Andalusien, Spanien",
    countryCode: "es",
    preis: 329,
    foto_url: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-10",
    titel: "Karibik-Feeling",
    ziel: "Kuba",
    countryCode: "cu",
    preis: 699,
    foto_url: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=300&h=150&q=70&fit=crop&auto=format",
    regionId: "100017",
  },
  {
    id: "ka-11",
    titel: "Safari & Sunset",
    ziel: "Kenia",
    countryCode: "ke",
    preis: 749,
    foto_url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&h=150&q=70&fit=crop&auto=format",
  },
  {
    id: "ka-12",
    titel: "Skiurlaub & Bergpanorama",
    ziel: "Österreich",
    countryCode: "at",
    preis: 389,
    foto_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=150&q=70&fit=crop&auto=format",
  },
];

export const metadata: Metadata = {
  title: `📅 Urlaubskalender ${YEAR} – beste Reisezeit finden`,
  description: `Urlaubskalender ${YEAR}: Finde die beste Reisezeit für jedes Urlaubsziel ✓ Klima & Wetter ✓ Preistipps ✓ Feiertage & Schulferien.`,
  keywords: ["Urlaubskalender", "Beste Reisezeit", "Wann wohin reisen", "Reisezeit Kalender", "Schulferien Urlaub", "Klimatabelle Urlaubsziele"],
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/urlaubskalender/" },
  openGraph: {
    title: `📅 Urlaubskalender ${YEAR} – beste Reisezeit | Urlaubfinder365`,
    description: `Urlaubskalender ${YEAR}: Finde die beste Reisezeit für jedes Urlaubsziel ✓ Klima & Wetter ✓ Preistipps ✓ Feiertage & Schulferien.`,
    url: "https://www.urlaubfinder365.de/extras/urlaubskalender/",
    type: "website",
  },
};

const NAV_ITEMS = [
  { id: "uebersicht",   label: "Übersicht",    emoji: "📅" },
  { id: "sommerurlaub", label: "Sommerurlaub", emoji: "☀️" },
  { id: "winterurlaub", label: "Winterurlaub", emoji: "❄️" },
  { id: "monatsguide",  label: "Monatsguide",  emoji: "🗓️" },
];

interface MonthData {
  month: string;
  short: string;
  season: "sommer" | "winter" | "beides";
  highlight: string;
  weather: string;
  sommer: Destination[];
  winter: Destination[];
}

const MONTHS: MonthData[] = [
  {
    month: "Januar", short: "Jan", season: "winter",
    highlight: "Perfekt für Fernreisen & Skiurlaub",
    weather: "In Europa kalt – ideal für Flucht in die Wärme",
    sommer: [
      { name: "Australien",  temp: "28°C", code: "au", tip: "Hochsaison Down Under – Strände & Outback" },
      { name: "Neuseeland",  temp: "22°C", code: "nz", tip: "Grüne Landschaften im Südsommer" },
      { name: "Brasilien",   temp: "30°C", code: "br", tip: "Vor dem Karneval – günstigere Preise" },
      { name: "Südafrika",   temp: "26°C", code: "za", tip: "Kapstadt in voller Blüte" },
    ],
    winter: [
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Trockenste Zeit – kristallklares Wasser" },
      { name: "Thailand",    temp: "32°C", code: "th", regionId: "100220", tip: "Hochsaison – Phuket & Koh Samui ideal" },
      { name: "Kuba",        temp: "28°C", code: "cu", regionId: "100017", tip: "Angenehme Temperaturen & kaum Regen" },
      { name: "Kanaren",     temp: "21°C", code: "es", tip: "Gran Canaria & Teneriffa – Europas Sonne" },
    ],
  },
  {
    month: "Februar", short: "Feb", season: "winter",
    highlight: "Skiurlaub & Sonnenflucht",
    weather: "Kältester Monat in Deutschland – Fernweh auf dem Höhepunkt",
    sommer: [
      { name: "Argentinien", temp: "28°C", code: "ar", tip: "Buenos Aires & Patagonien in voller Pracht" },
      { name: "Australien",  temp: "28°C", code: "au", tip: "Great Barrier Reef – perfekte Sicht" },
      { name: "Südafrika",   temp: "26°C", code: "za", tip: "Weinregion Stellenbosch genießen" },
      { name: "Seychellen",  temp: "29°C", code: "sc", tip: "Trockenzeit beginnt – ideale Bedingungen" },
    ],
    winter: [
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Beste Schnorchel-Bedingungen des Jahres" },
      { name: "Sri Lanka",   temp: "30°C", code: "lk", tip: "Westküste sonnig – Süden ebenfalls trocken" },
      { name: "Kanaren",     temp: "20°C", code: "es", tip: "Lanzarote & Fuerteventura – beliebt" },
      { name: "Oman",        temp: "24°C", code: "om", tip: "Wüste & Küste – vor der Sommerhitze" },
    ],
  },
  {
    month: "März", short: "Mär", season: "beides",
    highlight: "Frühling oder Fernreise – beides möglich",
    weather: "Europa erwacht – Mittelmeer noch kühl, Ferne lockt",
    sommer: [
      { name: "Australien",  temp: "26°C", code: "au", tip: "Herbstbeginn – weniger Touristen" },
      { name: "Neuseeland",  temp: "20°C", code: "nz", tip: "Herbstfarben & ruhige Landschaft" },
      { name: "Südafrika",   temp: "24°C", code: "za", tip: "Safari-Saison beginnt – Tiere aktiv" },
      { name: "Tansania",    temp: "30°C", code: "tz", tip: "Sansibar-Traumstrände noch sonnig" },
    ],
    winter: [
      { name: "Thailand",    temp: "34°C", code: "th", regionId: "100220", tip: "Letzter ruhiger Monat vor der Regenzeit" },
      { name: "Vietnam",     temp: "28°C", code: "vn", tip: "Mittelregion & Süden ideal" },
      { name: "Marokko",     temp: "20°C", code: "ma", tip: "Frühling in der Wüste – traumhafte Farben" },
      { name: "Ägypten",     temp: "24°C", code: "eg", tip: "Rotes Meer – perfekte Bedingungen" },
    ],
  },
  {
    month: "April", short: "Apr", season: "beides",
    highlight: "Europa erwacht – Frühlings-Highlights",
    weather: "Mild in Europa, Mittelmeer wird wärmer",
    sommer: [
      { name: "Südafrika",   temp: "22°C", code: "za", tip: "Herbst – beste Safari-Sicht" },
      { name: "Kenia",       temp: "29°C", code: "ke", tip: "Kurz vor der Regenzeit – günstige Preise" },
      { name: "Mauritius",   temp: "26°C", code: "mu", tip: "Ruhigere See – ideal für Taucher" },
      { name: "Australien",  temp: "22°C", code: "au", tip: "Sydney & Melbourne angenehm kühl" },
    ],
    winter: [
      { name: "Griechenland",temp: "18°C", code: "gr", tip: "Santorini & Kreta – vor der Hochsaison" },
      { name: "Portugal",    temp: "18°C", code: "pt", regionId: "725", tip: "Algarve – Frühling, wenig Touristen" },
      { name: "Türkei",      temp: "20°C", code: "tr", regionId: "724", tip: "Ägäis-Küste ideal zur Vorsaison" },
      { name: "Marokko",     temp: "22°C", code: "ma", tip: "Marrakesch im Frühling – angenehm warm" },
    ],
  },
  {
    month: "Mai", short: "Mai", season: "sommer",
    highlight: "Vorsaison Mittelmeer – beste Preise",
    weather: "Warm in Europa – Mittelmeer ideal ohne Massen",
    sommer: [
      { name: "Mallorca",    temp: "22°C", code: "es", regionId: "100000", tip: "Vorsaison – günstiger als Juli/August" },
      { name: "Kreta",       temp: "22°C", code: "gr", regionId: "100002", tip: "Schön warm, wenig Touristen" },
      { name: "Türkei",      temp: "25°C", code: "tr", regionId: "724",    tip: "Antalya – perfektes Frühsommer-Wetter" },
      { name: "Portugal",    temp: "20°C", code: "pt", regionId: "725",    tip: "Lissabon & Algarve im Frühling" },
    ],
    winter: [
      { name: "Bali",        temp: "28°C", code: "id", tip: "Trockenzeit beginnt – idealer Zeitpunkt" },
      { name: "Mexiko",      temp: "30°C", code: "mx", tip: "Yucatán vor der Regenzeit" },
      { name: "Kuba",        temp: "30°C", code: "cu", regionId: "100017", tip: "Letzter guter Monat vor dem Sommer" },
      { name: "Japan",       temp: "22°C", code: "jp", tip: "Nachblüte & goldgrüne Natur" },
    ],
  },
  {
    month: "Juni", short: "Jun", season: "sommer",
    highlight: "Hochsommer in Europa beginnt",
    weather: "Mediterrane Sommer-Hochsaison startet",
    sommer: [
      { name: "Spanien",     temp: "28°C", code: "es", tip: "Barcelona, Ibiza & Costa del Sol" },
      { name: "Griechenland",temp: "28°C", code: "gr", regionId: "100002", tip: "Inselhüpfen auf dem Höhepunkt" },
      { name: "Kroatien",    temp: "26°C", code: "hr", tip: "Dalmatien – klares Wasser, tolle Buchten" },
      { name: "Italien",     temp: "28°C", code: "it", tip: "Amalfiküste & Sizilien wunderbar warm" },
    ],
    winter: [
      { name: "Kanaren",     temp: "23°C", code: "es", tip: "Gleichmäßiges Klima das ganze Jahr" },
      { name: "Bali",        temp: "27°C", code: "id", tip: "Trockenzeit – beste Bedingungen" },
      { name: "Tansania",    temp: "24°C", code: "tz", tip: "Wildebeest-Migration beginnt" },
      { name: "Island",      temp: "12°C", code: "is", tip: "Mitternachtssonne – einzigartiges Erlebnis" },
    ],
  },
  {
    month: "Juli", short: "Jul", season: "sommer",
    highlight: "Peak-Sommer – Hochsaison Mittelmeer",
    weather: "Heißester Monat – Mittelmeer auf dem Höhepunkt",
    sommer: [
      { name: "Griechenland",temp: "32°C", code: "gr", tip: "Mykonos, Rhodos & Kos – Hochsaison" },
      { name: "Türkei",      temp: "34°C", code: "tr", regionId: "724", tip: "Bodrum & Side – voller Strandbetrieb" },
      { name: "Mallorca",    temp: "30°C", code: "es", regionId: "100000", tip: "Hochbetrieb – früh buchen!" },
      { name: "Montenegro",  temp: "28°C", code: "me", tip: "Geheimtipp Adria – günstiger als Kroatien" },
    ],
    winter: [
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Außerhalb Hochsaison – günstigere Preise" },
      { name: "Kenia",       temp: "24°C", code: "ke", tip: "Masai Mara – Große Migration" },
      { name: "Tansania",    temp: "22°C", code: "tz", tip: "Serengeti & Ngorongoro in Topform" },
      { name: "Australien",  temp: "14°C", code: "au", tip: "Winter in Sydney – mild & günstig" },
    ],
  },
  {
    month: "August", short: "Aug", season: "sommer",
    highlight: "Hochsommer – beliebtester Urlaubsmonat",
    weather: "Schulferien – früh buchen ist Pflicht",
    sommer: [
      { name: "Mallorca",    temp: "30°C", code: "es", regionId: "100000", tip: "Heißester Monat – Hochbetrieb" },
      { name: "Kroatien",    temp: "28°C", code: "hr", tip: "Inselhopping zu Brac & Hvar" },
      { name: "Ägypten",     temp: "35°C", code: "eg", tip: "Hurghada & Sharm – traumhafte Tauchgründe" },
      { name: "Bulgarien",   temp: "28°C", code: "bg", tip: "Schwarzmeerküste – günstig & heiß" },
    ],
    winter: [
      { name: "Kanaren",     temp: "24°C", code: "es", tip: "Gleichmäßig warm – ganzjährig ideal" },
      { name: "Mauritius",   temp: "22°C", code: "mu", tip: "Perfekte Taucherkonditionen" },
      { name: "Kenia",       temp: "25°C", code: "ke", tip: "Beste Safari-Bedingungen" },
      { name: "Argentinien", temp: "10°C", code: "ar", tip: "Patagonien im Winter – günstig & ruhig" },
    ],
  },
  {
    month: "September", short: "Sep", season: "sommer",
    highlight: "Nachsaison – bestes Preis-Leistungs-Verhältnis",
    weather: "Sommer ohne Massen – Geheimtipp-Monat",
    sommer: [
      { name: "Griechenland",temp: "27°C", code: "gr", tip: "Nachsaison – weniger Touristen, warm" },
      { name: "Türkei",      temp: "28°C", code: "tr", regionId: "724", tip: "Noch heiß, deutlich günstiger" },
      { name: "Portugal",    temp: "24°C", code: "pt", regionId: "725", tip: "Algarve im Herbst – Geheimtipp" },
      { name: "Zypern",      temp: "28°C", code: "cy", tip: "Wärmstes Mittelmeer im September" },
    ],
    winter: [
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Günstigere Nebensaison" },
      { name: "Bali",        temp: "28°C", code: "id", tip: "Letzter trockener Monat – ideal" },
      { name: "Kanaren",     temp: "25°C", code: "es", tip: "Angenehmer als Hochsommer" },
      { name: "Kapverden",   temp: "27°C", code: "cv", tip: "Hochsaison – perfektes Wetter" },
    ],
  },
  {
    month: "Oktober", short: "Okt", season: "beides",
    highlight: "Herbstreisen & Wintervorschau",
    weather: "Europa kühlt ab – perfekte Zeit für Städtereisen",
    sommer: [
      { name: "Australien",  temp: "22°C", code: "au", tip: "Frühling beginnt – günstig & schön" },
      { name: "Neuseeland",  temp: "16°C", code: "nz", tip: "Frühlingsblüte – traumhafte Landschaft" },
      { name: "Kenia",       temp: "27°C", code: "ke", tip: "Kurze Regenzeit – günstiger" },
      { name: "Namibia",     temp: "28°C", code: "na", tip: "Frühling – Wüstenblüte spektakulär" },
    ],
    winter: [
      { name: "Marokko",     temp: "24°C", code: "ma", tip: "Beste Reisezeit – angenehm warm" },
      { name: "Ägypten",     temp: "28°C", code: "eg", tip: "Ideal – nach dem Sommer" },
      { name: "Thailand",    temp: "30°C", code: "th", regionId: "100220", tip: "Trockenzeit beginnt im Norden" },
      { name: "Kanaren",     temp: "25°C", code: "es", tip: "Hochsaison startet – buchen!" },
    ],
  },
  {
    month: "November", short: "Nov", season: "winter",
    highlight: "Winterflucht oder Frühbucher sichern",
    weather: "Herbst in Deutschland – ideale Fernreise-Saison",
    sommer: [
      { name: "Australien",  temp: "25°C", code: "au", tip: "Frühsommer – vor dem Touristenansturm" },
      { name: "Südafrika",   temp: "24°C", code: "za", tip: "Kapstadt & Weinregionen in Topform" },
      { name: "Neuseeland",  temp: "18°C", code: "nz", tip: "Vor der Hochsaison – günstig" },
      { name: "Tansania",    temp: "28°C", code: "tz", tip: "Kurze Trockenzeit vor Dezember" },
    ],
    winter: [
      { name: "Thailand",    temp: "32°C", code: "th", regionId: "100220", tip: "Hochsaison beginnt – Phuket & Samui" },
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Beste Jahreszeit startet" },
      { name: "Oman",        temp: "27°C", code: "om", tip: "Perfekt mild – Wüste & Küste" },
      { name: "Sri Lanka",   temp: "28°C", code: "lk", tip: "Westküste Hochsaison" },
    ],
  },
  {
    month: "Dezember", short: "Dez", season: "winter",
    highlight: "Weihnachten in der Ferne oder Skiurlaub",
    weather: "Winterzeit – Fernreise oder Ski in den Alpen",
    sommer: [
      { name: "Australien",  temp: "28°C", code: "au", tip: "Weihnachten am Strand – unvergesslich" },
      { name: "Argentinien", temp: "28°C", code: "ar", tip: "Sommer & Tango in Buenos Aires" },
      { name: "Südafrika",   temp: "26°C", code: "za", tip: "Hochsaison – Garden Route traumhaft" },
      { name: "Seychellen",  temp: "30°C", code: "sc", tip: "Perfekte Bedingungen – Trauminseln" },
    ],
    winter: [
      { name: "Thailand",    temp: "32°C", code: "th", regionId: "100220", tip: "Hochsaison – Koh Samui & Phuket" },
      { name: "Malediven",   temp: "30°C", code: "mv", tip: "Traumurlaub zu Weihnachten" },
      { name: "Kanaren",     temp: "21°C", code: "es", tip: "Europas Wintersonneninsel" },
      { name: "Kuba",        temp: "28°C", code: "cu", regionId: "100017", tip: "Beste Reisezeit beginnt" },
    ],
  },
];

const SOMMER_HIGHLIGHTS = [
  { monat: "Mai–Jun", ziele: "Vorsaison Mittelmeer", desc: "Günstig & kaum Touristen", emoji: "🌸" },
  { monat: "Jul–Aug", ziele: "Hochsaison Mittelmeer", desc: "Heiß, voll, aber perfekt", emoji: "🏖️" },
  { monat: "Sep–Okt", ziele: "Nachsaison Mittelmeer", desc: "Bestes Preis-Klima-Verhältnis", emoji: "🍂" },
];

const WINTER_HIGHLIGHTS = [
  { monat: "Nov–Jan", ziele: "Thailand, Malediven", desc: "Hochsaison Südostasien", emoji: "🌴" },
  { monat: "Dez–Feb", ziele: "Kanaren, Ägypten", desc: "Nahes Winterziel für Europäer", emoji: "☀️" },
  { monat: "Jan–Mär", ziele: "Australien, Neuseeland", desc: "Südhalbkugel-Sommer", emoji: "🦘" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite",      item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Extras",          item: "https://www.urlaubfinder365.de/extras/" },
    { "@type": "ListItem", position: 3, name: "Urlaubskalender", item: "https://www.urlaubfinder365.de/extras/urlaubskalender/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "340px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Urlaubskalender – beste Reisezeit"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#00838F]/90 via-[#1db682]/75 to-[#006d78]/85" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            📅 Urlaubsplanung leicht gemacht
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Urlaubskalender
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Wann ist wo die beste Reisezeit? Unser Monatsguide zeigt dir die Top-Ziele für Sommer- und Winterurlaub – jeden Monat des Jahres.
          </p>
        </div>
      </section>

      {/* ── NavBar ── */}
      <PageNavBar items={NAV_ITEMS} />

      {/* ── Zweispalten-Layout ── */}
      <div className="xl:flex xl:items-start xl:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hauptinhalt ── */}
        <div className="flex-1 min-w-0">

          {/* ═══════════════════════════════════════════════════════
              ÜBERSICHT
          ═══════════════════════════════════════════════════════ */}
          <section id="uebersicht" className="py-12">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Das ganze Jahr im Blick</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">12 Monate – 12 Möglichkeiten</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Klicke auf einen Monat und springe direkt zum Monatsguide.</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
              {MONTHS.map((m) => (
                <a
                  key={m.month}
                  href={`#${m.month.toLowerCase()}`}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    m.season === "sommer"
                      ? "bg-amber-50 border-amber-200 hover:border-amber-400"
                      : m.season === "winter"
                      ? "bg-blue-50 border-blue-200 hover:border-blue-400"
                      : "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                  }`}
                >
                  <span className="text-xl">
                    {m.season === "sommer" ? "☀️" : m.season === "winter" ? "❄️" : "🌤️"}
                  </span>
                  <span className="text-xs font-bold text-gray-700">{m.short}</span>
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { color: "bg-amber-100 border-amber-300", label: "☀️ Sommer-Schwerpunkt" },
                { color: "bg-blue-100 border-blue-300",   label: "❄️ Winter-Schwerpunkt" },
                { color: "bg-emerald-100 border-emerald-300", label: "🌤️ Beides möglich" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className={`w-4 h-4 rounded border inline-block ${l.color}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              SOMMERURLAUB
          ═══════════════════════════════════════════════════════ */}
          <section id="sommerurlaub" className="py-12 border-t border-gray-100">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Sonne, Strand & Meer</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">☀️ Sommerurlaub – wann & wohin?</h2>
              <p className="text-gray-500 mt-2 max-w-xl">Der richtige Zeitpunkt macht den Unterschied zwischen Hochpreis und Schnäppchen.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {SOMMER_HIGHLIGHTS.map((h) => (
                <div key={h.monat} className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <div className="text-3xl mb-3">{h.emoji}</div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{h.monat}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{h.ziele}</h3>
                  <p className="text-gray-600 text-sm">{h.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-4xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-1">Sommer-Tipp: Vorsaison schlägt Hochsaison</p>
                <p className="text-gray-600 text-sm">Mai und September bieten oft dasselbe Wetter wie Juli, aber zu 30–40% günstigeren Preisen.</p>
              </div>
              <Link href="/urlaubsarten/fruhbucher-urlaub/" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                Frühbucher-Deals →
              </Link>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              WINTERURLAUB
          ═══════════════════════════════════════════════════════ */}
          <section id="winterurlaub" className="py-12 border-t border-gray-100">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Sonne im Winter finden</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">❄️ Winterurlaub – dem Grau entfliehen</h2>
              <p className="text-gray-500 mt-2 max-w-xl">Wenn es in Deutschland kalt und grau wird, locken Fernreiseziele mit Traumtemperaturen.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {WINTER_HIGHLIGHTS.map((h) => (
                <div key={h.monat} className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <div className="text-3xl mb-3">{h.emoji}</div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{h.monat}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{h.ziele}</h3>
                  <p className="text-gray-600 text-sm">{h.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-4xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-1">Winter-Tipp: Kanaren als schnelle Alternative</p>
                <p className="text-gray-600 text-sm">Gran Canaria und Teneriffa bieten im Winter konstante 20–22°C – nur 4 Flugstunden von Deutschland.</p>
              </div>
              <Link href="/urlaubsarten/pauschalreisen/" className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                Pauschalreisen →
              </Link>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              MONATSGUIDE
          ═══════════════════════════════════════════════════════ */}
          <section id="monatsguide" className="py-12 border-t border-gray-100">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Detailübersicht</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🗓️ Alle Monate im Detail</h2>
              <p className="text-gray-500 mt-2 max-w-xl">
                Klicke auf ein Ziel um direkt die passenden Pauschalreisen zu suchen.
              </p>
            </div>

            <div className="space-y-6">
              {MONTHS.map((m, idx) => (
                <div
                  key={m.month}
                  id={m.month.toLowerCase()}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  {/* Monats-Header */}
                  <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 ${
                    m.season === "sommer"
                      ? "bg-linear-to-r from-amber-50 to-orange-50 border-b border-amber-100"
                      : m.season === "winter"
                      ? "bg-linear-to-r from-blue-50 to-cyan-50 border-b border-blue-100"
                      : "bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {m.season === "sommer" ? "☀️" : m.season === "winter" ? "❄️" : "🌤️"}
                      </span>
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900">{m.month}</h3>
                        <p className="text-xs text-gray-500">{m.weather}</p>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${
                        m.season === "sommer"
                          ? "bg-amber-100 text-amber-700"
                          : m.season === "winter"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {m.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Zwei Spalten */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {/* Sommerurlaub */}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                        ☀️ Sommerurlaub im {m.month}
                      </p>
                      <div className="space-y-2">
                        {m.sommer.map((d) => (
                          <DestinationCard key={d.name} d={d} type="sommer" />
                        ))}
                      </div>
                    </div>

                    {/* Winterurlaub */}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">
                        ❄️ Winterurlaub im {m.month}
                      </p>
                      <div className="space-y-2">
                        {m.winter.map((d) => (
                          <DestinationCard key={d.name} d={d} type="winter" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gesponserte Angebotsboxen */}
                  <div className="px-5 pb-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Passende Angebote im {m.month}
                      </span>
                      <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">
                        Anzeige
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <KalenderAngebotBox
                        angebot={KALENDER_ANGEBOTE[(idx * 2) % KALENDER_ANGEBOTE.length]}
                      />
                      <KalenderAngebotBox
                        angebot={KALENDER_ANGEBOTE[(idx * 2 + 1) % KALENDER_ANGEBOTE.length]}
                      />
                    </div>
                    <div className="mt-3 text-right">
                      <Link
                        href="/guenstig-urlaub-buchen/"
                        className="text-xs font-bold text-[#00838F] hover:underline"
                      >
                        Alle Angebote ansehen →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 border-t border-gray-100">
            <div className="bg-linear-to-br from-[#00838F] to-[#1db682] rounded-3xl p-8 text-center text-white">
              <h2 className="text-2xl font-extrabold mb-2">Bereit zum Buchen?</h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Vergleiche täglich aktualisierte Angebote und buche deinen Traumurlaub zum besten Preis.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/guenstig-urlaub-buchen/" className="bg-white text-[#00838F] px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
                  Urlaub vergleichen
                </Link>
                <Link href="/urlaubsarten/last-minute-urlaub/" className="bg-white/20 text-white border border-white/40 px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors">
                  Last-Minute Deals
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24 pt-12">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&q=70&auto=format&fit=crop",
                eyebrow: "Urlaub planen",
                title: "Günstige Pauschalreisen",
                description: "Täglich tausende Angebote vergleichen – Last-Minute & Frühbucher.",
                href: "/guenstig-urlaub-buchen/",
                ctaLabel: "Angebote vergleichen →",
              }}
              seoLinksTitle="📅 Reiseplanung"
              seoLinks={[
                { href: "/urlaubsarten/last-minute-urlaub/",    label: "Last-Minute Urlaub" },
                { href: "/urlaubsarten/fruhbucher-urlaub/",     label: "Frühbucher Urlaub" },
                { href: "/urlaubsziele/",                       label: "Alle Urlaubsziele" },
                { href: "/ki-reiseplaner/",                     label: "KI-Urlaubsplaner" },
                { href: "/preisentwicklung/",                   label: "Preisentwicklung" },
              ]}
            />
          </div>
        </aside>

      </div>
    </>
  );
}
