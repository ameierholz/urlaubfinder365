import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ui/AdBanner";
import { Plane, ShieldCheck, RefreshCcw, Tag, Zap } from "lucide-react";
import IbeFixedWrapper from "@/components/widgets/IbeFixedWrapper";
import FlugzieleGrid from "@/components/flug/FlugzieleGrid";
import AirlineInfoSection from "@/components/flug/AirlineInfoSection";
import FlugNavBar from "@/components/flug/FlugNavBar";
import EinreiseSchnellcheck from "@/components/flug/EinreiseSchnellcheck";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Flugsuche – Günstige Flüge finden & buchen",
  description:
    "Günstige Flüge vergleichen & direkt buchen. Täglich aktualisierte Flugpreise von über 200 Airlines – One-Way, Hin- & Rückflug, alle Abflughäfen.",
  alternates: { canonical: `${BASE_URL}/flugsuche/` },
  openGraph: {
    title: "Flugsuche – Günstige Flüge finden & buchen | Urlaubfinder365",
    description: "Günstige Flüge vergleichen & direkt buchen. Täglich aktualisierte Flugpreise von über 200 Airlines – One-Way, Hin- & Rückflug, alle Abflughäfen.",
    url: `${BASE_URL}/flugsuche/`,
    type: "website",
  },
};

// ── Statische Inhalte ────────────────────────────────────────────────────────

const SPAR_TIPPS = [
  {
    num: "01",
    title: "Flexibel beim Reisetag",
    text: "Dienstag und Mittwoch sind oft die günstigsten Abflugtage. Freitag und Sonntag sind regelmäßig am teuersten.",
  },
  {
    num: "02",
    title: "Mehrere Abflughäfen vergleichen",
    text: "Frankfurt, München, Düsseldorf, Hamburg, Köln – oft ist ein Nachbarflughafen 50–100 € günstiger.",
  },
  {
    num: "03",
    title: "Frühzeitig buchen",
    text: "Für beliebte Sommerziele lohnt sich eine Buchung 3–6 Monate im Voraus. Flugpreise steigen mit der Nachfrage.",
  },
  {
    num: "04",
    title: "Preisalarm nutzen",
    text: "Setze einen Preisalarm und buche, sobald dein Wunschpreis erreicht ist – Preise schwanken täglich.",
  },
  {
    num: "05",
    title: "Stopovers als Schnäppchen",
    text: "Flüge mit einem Zwischenstopp sind oft deutlich günstiger als Direktflüge – ideal für Fernreisende.",
  },
  {
    num: "06",
    title: "Handgepäck vs. Aufgabegepäck",
    text: "Nur-Handgepäck-Tarife sind günstiger – aber Aufgabegepäck kann nachträglich teuer werden. Immer vergleichen.",
  },
];

const FAQS = [
  {
    q: "Wann sind Flüge am günstigsten?",
    a: "Flüge sind in der Regel dienstags und mittwochs am günstigsten, da die Nachfrage geringer ist. Außerhalb der Schulferien und an Feiertagen sind Preise deutlich niedriger. Für Sommerflüge lohnt sich eine Buchung 3–6 Monate im Voraus.",
  },
  {
    q: "Wie finde ich den günstigsten Flug?",
    a: "Unser Flugsuchrechner vergleicht täglich tausende Angebote verschiedener Airlines. Einfach Abflughafen, Ziel, Datum und Passagierzahl eingeben – die Ergebnisse sind sofort nach Preis sortiert und du buchst direkt beim Anbieter.",
  },
  {
    q: "Was ist der Unterschied zwischen One-Way und Hin- & Rückflug?",
    a: "Ein One-Way-Ticket ist nur für eine Richtung. Bei manchen Airlines und Routen ist es günstiger, zwei Einzeltickets zu buchen statt ein Hin- & Rückflugticket. Unser Vergleich zeigt dir automatisch die günstigste Kombination.",
  },
  {
    q: "Wie viel Gepäck darf ich mitnehmen?",
    a: "Das hängt vom Tarif und der Airline ab. Viele Billigfluggesellschaften erlauben kostenlos nur kleines Handgepäck (ca. 40×20×25 cm). Größeres Kabinengepäck und aufzugebendes Gepäck kosten extra – oft 20–50 € pro Strecke.",
  },
  {
    q: "Kann ich ein Pauschalreise-Flugticket einzeln umbuchen?",
    a: "Bei Pauschalreisen ist der Flug fest an das Hotelpaket gekoppelt und kann meist nicht einzeln umgebucht werden. Einzeln gebuchte Flüge lassen sich hingegen je nach Tarif umbuchen oder erstatten – oft gegen eine Umbuchungsgebühr.",
  },
  {
    q: "Welche Zahlungsmethoden sind beim Flugbuchen üblich?",
    a: "Kreditkarte (Visa/Mastercard), PayPal und Lastschrift sind die gängigsten Zahlungsmethoden. Achtung: Manche Airlines erheben Kreditkartengebühren. Vergleiche vor dem Abschluss die Gesamtkosten inklusive aller Gebühren.",
  },
];

// ── JSON-LD ──────────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Flugsuche",  item: `${BASE_URL}/flugsuche/` },
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FlugSuchePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px] md:h-[440px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80')" }}
      >
        {/* Gradient-Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.62) 0%, rgba(0,131,143,0.45) 50%, rgba(15,23,42,0.72) 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            <Plane className="w-4 h-4" />
            Flugvergleich &amp; Direktbuchung
          </div>

          {/* Headline + Trust-Chips */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-6">

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Günstige Flüge finden –<br />
                <span className="text-sky-400">Direkt beim Anbieter buchen</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-4">
                Flugpreise vergleichen von über 200 Airlines – täglich aktualisiert,
                direkt beim Veranstalter.
              </p>
              {/* Abflughafen-Pills – rein informativ */}
              <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
                Häufig gebuchte Abflughäfen
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { city: "Frankfurt",   code: "FRA" },
                  { city: "München",     code: "MUC" },
                  { city: "Düsseldorf",  code: "DUS" },
                  { city: "Berlin",      code: "BER" },
                  { city: "Hamburg",     code: "HAM" },
                ].map((apt) => (
                  <span
                    key={apt.code}
                    className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium px-3.5 py-1.5 rounded-full"
                  >
                    <span className="text-white/50">ab</span>
                    ✈ {apt.city} <span className="text-white/50">({apt.code})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Trust-Chips */}
            <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:shrink-0">
              {([
                { Icon: Tag,        label: "Bestpreis-Garantie",     color: "#38bdf8" },
                { Icon: RefreshCcw, label: "Täglich aktuell",         color: "#f59e0b" },
                { Icon: ShieldCheck,label: "Sicher buchen",           color: "#34d399" },
                { Icon: Zap,        label: "Sofortbuchung",           color: "#a78bfa" },
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

      {/* ── Sticky Section-Nav ── */}
      <FlugNavBar />

      {/* ═══════════════════════════════════════════════════════════════════
          ZWEISPALTEN-LAYOUT: Hauptinhalt + Sticky Sidebar Ad
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">

        {/* ── Hauptinhalt (linke Spalte) ── */}
        <div className="flex-1 min-w-0">

          {/* ── IBE Flugsuche – immer sichtbar ── */}
          <div id="flugsuche-widget" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[2px] mt-8 mb-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <IbeFixedWrapper dataSrc="https://b2b.specials.de/index/jump/15/1450/993243/" minHeight={500} />
            </div>
          </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP FLUGZIELE
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="top-flugziele" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            ✈️ Top Destinationen
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Beliebte Flugziele
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Top-Destinationen mit Preisen ab Deutschland – täglich aktualisiert.
          </p>
          <FlugzieleGrid />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          GEPÄCK-VERGLEICH
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="gepaeck-vergleich" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            🧳 Gepäck-Info
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Gepäck-Vergleich der Airlines</h2>
          <p className="text-gray-500 text-sm mb-6">Handgepäck-Maße, Freigepäck und Zusatzkosten auf einen Blick.</p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-[#00838F] text-left">
                  <th className="px-4 py-3 font-bold text-white border-b border-[#007a85]">Airline</th>
                  <th className="px-4 py-3 font-bold text-white border-b border-[#007a85]">Handgepäck (kostenlos)</th>
                  <th className="px-4 py-3 font-bold text-white border-b border-[#007a85]">Freigepäck inkl.?</th>
                  <th className="px-4 py-3 font-bold text-white border-b border-[#007a85]">Extra-Gepäck (ca.)</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { airline:"Lufthansa",       carry:"55×40×23 cm, 8 kg",          free:"Ja (Economy Classic+)",    extra:"ab ~50 €",  ok:true  },
                  { airline:"Eurowings",        carry:"40×30×10 cm kostenlos",       free:"Nein (ab Tarif Smart)",    extra:"ab ~25 €",  ok:false },
                  { airline:"Ryanair",          carry:"40×20×25 cm kostenlos",       free:"Nein",                    extra:"ab ~15 €",  ok:false },
                  { airline:"easyJet",          carry:"56×45×25 cm, 15 kg",          free:"Nein",                    extra:"ab ~15 €",  ok:false },
                  { airline:"TUI fly",          carry:"55×40×20 cm, 8 kg",           free:"Ja (20 kg)",              extra:"ab ~30 €",  ok:true  },
                  { airline:"Condor",           carry:"55×40×20 cm, 6 kg",           free:"Nein (ab Economy)",       extra:"ab ~25 €",  ok:false },
                  { airline:"Wizz Air",         carry:"40×30×20 cm kostenlos",       free:"Nein",                    extra:"ab ~20 €",  ok:false },
                  { airline:"Turkish Airlines", carry:"55×40×23 cm, 8 kg",           free:"Ja (20 kg Economy)",      extra:"ab ~50 €",  ok:true  },
                  { airline:"Emirates",         carry:"55×38×20 cm, 7 kg",           free:"Ja (25 kg Economy)",      extra:"ab ~100 €", ok:true  },
                  { airline:"Qatar Airways",    carry:"50×37×25 cm, 7 kg",           free:"Ja (23 kg Economy)",      extra:"ab ~80 €",  ok:true  },
                ] as const).map((row, i) => (
                  <tr key={row.airline} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-50">{row.airline}</td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-50">{row.carry}</td>
                    <td className="px-4 py-3 border-b border-gray-50">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${row.ok ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {row.ok ? "✓ Ja" : "✗ Nein"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 border-b border-gray-50">{row.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Angaben ohne Gewähr – Tarife ändern sich regelmäßig. Bitte vor der Buchung beim Anbieter prüfen.</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MID-PAGE VISUAL BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,131,143,0.88) 0%, rgba(0,95,107,0.75) 60%, rgba(15,23,42,0.70) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Täglich aktuell</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Über 200 Airlines im direkten Vergleich
            </h2>
            <p className="text-white/75 text-sm mt-2">
              Günstige Flüge finden, direkt beim Anbieter buchen — ohne Umwege.
            </p>
          </div>
          <a
            href="#flugsuche-widget"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#00838F] font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm whitespace-nowrap"
          >
            ✈️ Jetzt Flüge vergleichen →
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          AIRLINE-INFO
      ═══════════════════════════════════════════════════════════════════ */}
      <AirlineInfoSection />

      {/* ═══════════════════════════════════════════════════════════════════
          FLUGHAFEN-GUIDE
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            🏢 Flughafen-Guide
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Flughafen-Guide Deutschland</h2>
          <p className="text-gray-500 text-sm mb-6">Anreise, Parken und wann du am besten da sein solltest.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {([
              { code:"FRA", name:"Frankfurt",  color:"bg-blue-500",   bahn:"S8/S9 → 15 Min zum Hbf (~5 €)",              park:"P36 ab ~14 €/Tag",  time:"3 Std (Langstrecke) / 2,5 Std (EU)",   terminals:"Terminal 1 (Star Alliance) + Terminal 2" },
              { code:"MUC", name:"München",    color:"bg-sky-500",    bahn:"S1 oder S8 → 40 Min zum Hbf (~13 €)",         park:"P44 ab ~18 €/Tag",  time:"3 Std (Langstrecke) / 2,5 Std (EU)",   terminals:"Terminal 1, Terminal 2 (LH), Satellit" },
              { code:"DUS", name:"Düsseldorf", color:"bg-violet-500", bahn:"SkyTrain → S11 → 15 Min zum Hbf (~3 €)",      park:"P2 ab ~14 €/Tag",   time:"2,5 Std (Langstrecke) / 2 Std (EU)",   terminals:"Terminal A, B, C" },
              { code:"BER", name:"Berlin",     color:"bg-rose-500",   bahn:"S9/S45 → 30 Min zum Hbf (~4 €)",              park:"P1 ab ~20 €/Tag",   time:"2,5 Std (Langstrecke) / 2 Std (EU)",   terminals:"Terminal 1 (aktuell einziger)" },
              { code:"HAM", name:"Hamburg",    color:"bg-amber-500",  bahn:"Bus 6 → 25 Min zum Hbf (~3,50 €)",            park:"P4 ab ~15 €/Tag",   time:"2,5 Std (Langstrecke) / 2 Std (EU)",   terminals:"Terminal 1 + Terminal 2" },
            ] as const).map((ap) => (
              <div key={ap.code} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl ${ap.color} flex items-center justify-center font-extrabold text-white text-xs shrink-0`}>{ap.code}</span>
                  <span className="font-bold text-gray-900">{ap.name}</span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2 text-xs text-gray-600">
                  <div className="flex gap-2"><span className="shrink-0">🚆</span><span>{ap.bahn}</span></div>
                  <div className="flex gap-2"><span className="shrink-0">🅿️</span><span>{ap.park}</span></div>
                  <div className="flex gap-2"><span className="shrink-0">⏰</span><span>{ap.time}</span></div>
                  <div className="flex gap-2"><span className="shrink-0">✈️</span><span className="text-gray-400">{ap.terminals}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BESTE REISEZEIT
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            ☀️ Klimainfo
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Beste Reisezeit nach Destination</h2>
          <p className="text-gray-500 text-sm mb-6">Wann lohnt sich der Flug und wann sparst du am meisten?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {([
              { dest:"Mallorca",      months:"Mai – Oktober",     temp:"23–30°C", tip:"Schulterzeit Apr/Nov günstiger",   emoji:"🏖️", accent:"from-sky-400 to-blue-500" },
              { dest:"Türkei/Antalya",months:"April – Oktober",   temp:"22–35°C", tip:"Juni–Sept. am heißesten",          emoji:"🕌", accent:"from-red-400 to-rose-500" },
              { dest:"Kreta",         months:"Mai – September",   temp:"24–30°C", tip:"April & Oktober: weniger Trubel",  emoji:"🏛️", accent:"from-blue-400 to-indigo-500" },
              { dest:"Dubai",         months:"Oktober – April",   temp:"20–30°C", tip:"Sommer: bis 45°C, sehr teuer",     emoji:"🏙️", accent:"from-amber-400 to-orange-500" },
              { dest:"Thailand",      months:"Nov – Februar",     temp:"27–34°C", tip:"März–Mai: sehr heiß & schwül",     emoji:"🐘", accent:"from-emerald-400 to-teal-500" },
              { dest:"Malediven",     months:"Nov – April",       temp:"28–31°C", tip:"Mai–Okt: Regenzeit, günstiger",    emoji:"🌴", accent:"from-cyan-400 to-sky-500" },
              { dest:"Ägypten",       months:"Oktober – März",    temp:"18–27°C", tip:"Sommer 38°C+ am Roten Meer",       emoji:"🏺", accent:"from-yellow-400 to-amber-500" },
              { dest:"New York",      months:"Apr–Jun / Sep–Nov", temp:"14–25°C", tip:"Sommer & Weihnachten sehr teuer",  emoji:"🗽", accent:"from-violet-400 to-purple-500" },
              { dest:"Bali",          months:"April – Oktober",   temp:"27–32°C", tip:"Nov–März: Regenzeit",              emoji:"🌺", accent:"from-pink-400 to-rose-500" },
              { dest:"Karibik",       months:"Dez – April",       temp:"27–31°C", tip:"Hurrikan-Saison: Jun–Nov meiden",  emoji:"🌊", accent:"from-teal-400 to-cyan-500" },
              { dest:"Japan",         months:"März–Mai / Okt–Nov",temp:"15–25°C", tip:"Kirschblüte April = Hochpreiszeit",emoji:"🌸", accent:"from-fuchsia-400 to-pink-500" },
              { dest:"Kanaren",       months:"Ganzjährig",        temp:"18–26°C", tip:"Winter beliebt bei Deutschen",     emoji:"🌋", accent:"from-orange-400 to-red-500" },
            ] as const).map((z) => (
              <div key={z.dest} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className={`bg-gradient-to-r ${z.accent} px-3 py-2 flex items-center gap-2`}>
                  <span className="text-lg leading-none">{z.emoji}</span>
                  <span className="font-bold text-white text-sm drop-shadow-sm">{z.dest}</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#00838F] mb-1">{z.months}</p>
                  <p className="text-xs text-gray-500 mb-1">Ø {z.temp}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">{z.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          EINREISE-SCHNELLCHECK
      ═══════════════════════════════════════════════════════════════════ */}
      <EinreiseSchnellcheck />

      {/* ═══════════════════════════════════════════════════════════════════
          DIREKTFLUG VS. UMSTIEG
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            ↔️ Flug-Vergleich
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Direktflug vs. Umstieg</h2>
          <p className="text-gray-500 text-sm mb-6">Wann lohnt sich welche Option – und worauf musst du achten?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border-2 border-[#00838F]/30 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#00838F] flex items-center justify-center text-white text-sm">✈</span>
                Direktflug
              </h3>
              <div className="space-y-2 mb-4">
                {["Keine Wartezeiten & kein Gepäck-Verlustrisiko","Weniger Stressanfällig bei Verspätungen","Ideal für Kurzreisen & Business","Oft günstiger für europäische Ziele"].map(p => (
                  <div key={p} className="flex gap-2 text-sm text-gray-700"><span className="text-emerald-500 shrink-0">✓</span>{p}</div>
                ))}
              </div>
              <div className="space-y-2">
                {["Bei Langstrecke deutlich teurer","Weniger Flexibilität bei Flugzeiten"].map(p => (
                  <div key={p} className="flex gap-2 text-sm text-gray-400"><span className="text-red-400 shrink-0">✗</span>{p}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-amber-300/50 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm">🔄</span>
                Umstieg (Stopover)
              </h3>
              <div className="space-y-2 mb-4">
                {["Oft 30–60 % günstiger bei Langstrecke","Mehr Abflugzeiten & Verbindungen verfügbar","Stopover-Städte wie Dubai/Istanbul entdecken","Zwei Abflughäfen kombinierbar"].map(p => (
                  <div key={p} className="flex gap-2 text-sm text-gray-700"><span className="text-emerald-500 shrink-0">✓</span>{p}</div>
                ))}
              </div>
              <div className="space-y-2">
                {["Mind. 1,5–2 Std Umstiegszeit einplanen","Gepäck kann verloren gehen","Bei Verspätung Anschluss gefährdet"].map(p => (
                  <div key={p} className="flex gap-2 text-sm text-gray-400"><span className="text-red-400 shrink-0">✗</span>{p}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 bg-[#00838F]/5 rounded-xl p-4 text-sm text-gray-700 border border-[#00838F]/15">
            <strong className="text-[#00838F]">💡 Faustregel:</strong> Für europäische Ziele lohnt sich meist ein Direktflug. Für Fernreisen (Asien, Amerika, Australien) kann ein Stopover über Dubai, Istanbul oder Doha 30–60 % Ersparnis bedeuten.
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FLUG-TYPEN
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            🎯 Flug-Kategorien
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Welcher Flug passt zu dir?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "⚡",
                label: "Last-Minute Flüge",
                desc: "Spontan verreisen und bis zu 60 % sparen – Abflug in den nächsten 14 Tagen.",
                bg: "from-red-600 to-rose-700",
                badge: "Bis −60 %",
                badgeColor: "bg-white/20 text-white",
              },
              {
                emoji: "📅",
                label: "Frühbucher-Flüge",
                desc: "3–6 Monate im Voraus buchen und den Wunschsitzplatz zum Bestpreis sichern.",
                bg: "from-[#00838F] to-[#005F6B]",
                badge: "Empfohlen",
                badgeColor: "bg-white/20 text-white",
              },
              {
                emoji: "👨‍👩‍👧‍👦",
                label: "Familienflüge",
                desc: "Plätze nebeneinander, Kinderermäßigungen und großzügiges Freigepäck für die ganze Familie.",
                bg: "from-violet-600 to-purple-700",
                badge: "Familien-Tipp",
                badgeColor: "bg-white/20 text-white",
              },
              {
                emoji: "🌍",
                label: "Fernreise-Flüge",
                desc: "Direktflüge & günstige Verbindungen nach Asien, Amerika, Afrika und in die Karibik.",
                bg: "from-amber-600 to-orange-700",
                badge: "Weltweit",
                badgeColor: "bg-white/20 text-white",
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
                  <p className="text-xs text-gray-500 leading-relaxed">{typ.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SPAR-TIPPS
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="spar-tipps" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            💰 Spar-Tipps
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            6 Tipps für günstige Flüge
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            So zahlst du weniger und fliegst trotzdem komfortabel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPAR_TIPPS.map((tip) => (
              <div
                key={tip.num}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-4"
              >
                <span className="text-3xl font-extrabold text-[#00838F]/20 leading-none shrink-0 select-none">
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
      <div id="faq" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
            ❓ FAQ
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Häufige Fragen zur Flugsuche
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Alles Wichtige rund ums Fliegen und günstige Flugtickets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="bg-[#00838F] text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">Q</span>
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
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">✈️</div>
            <h2 className="text-2xl font-bold mb-2">Auch Pauschalreise oder Hotel buchen?</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Flug + Hotel im Paket ist oft günstiger als Einzelbuchung –
              jetzt Pauschalreisen vergleichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guenstig-urlaub-buchen/"
                className="inline-block bg-white text-[#1e3a8a] font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
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

            <div className="bg-[#00838F]/8 rounded-2xl p-4 border border-[#00838F]/15 text-center">
              <p className="text-xs font-bold text-[#00838F] mb-1">✈️ Pauschalreise?</p>
              <p className="text-[11px] text-gray-500 mb-3 leading-snug">
                Flug + Hotel oft günstiger als Einzelbuchung
              </p>
              <Link
                href="/guenstig-urlaub-buchen/"
                className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors"
              >
                Jetzt vergleichen →
              </Link>
            </div>

            {/* SEO-Linkbox: Beliebte Flugziele */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                ✈️ Beliebte Flugziele
              </p>
              <ul className="space-y-1.5">
                {([
                  { href: "/urlaubsziele/mallorca/",  label: "Flüge Mallorca" },
                  { href: "/urlaubsziele/antalya/",   label: "Flüge Antalya" },
                  { href: "/urlaubsziele/kreta/",     label: "Flüge Kreta" },
                  { href: "/urlaubsziele/barcelona/", label: "Flüge Barcelona" },
                  { href: "/urlaubsziele/kanaren/",   label: "Flüge Kanaren" },
                  { href: "/urlaubsziele/aegypten/",  label: "Flüge Ägypten" },
                  { href: "/urlaubsziele/tuerkei/",   label: "Flüge Türkei" },
                ] as const).map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight">
                      <span className="text-gray-300 shrink-0">›</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO-Linkbox: Schnellzugriff */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                🔗 Mehr entdecken
              </p>
              <ul className="space-y-1.5">
                {([
                  { href: "/last-minute/",                       label: "Last-Minute Reisen" },
                  { href: "/urlaubsarten/pauschalreisen/",       label: "Pauschalreisen" },
                  { href: "/urlaubsarten/all-inclusive-urlaub/", label: "All-Inclusive Urlaub" },
                  { href: "/urlaubsarten/fruhbucher-urlaub/",    label: "Frühbucher Angebote" },
                  { href: "/hotelsuche/",                        label: "Hotelsuche" },
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
