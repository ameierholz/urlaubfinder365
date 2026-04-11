import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Car, ShieldCheck, Tag, MapPin, Clock } from "lucide-react";
import IbeWidget from "@/components/widgets/IbeWidget";
import PageNavBar from "@/components/ui/PageNavBar";
import RightSidebar from "@/components/layout/RightSidebar";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildB2bUrl } from "@/lib/search-params";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";

// Nav items, Tipps & FAQs werden in der async-Funktion mit t() aufgebaut

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🚗 Mietwagen günstig buchen ${YEAR} – weltweit vergleichen`,
  description: `Mietwagen ${YEAR} günstig vergleichen & buchen ✓ Alle Fahrzeugklassen ✓ Vollkasko inklusive ✓ Kein Aufpreis ✓ 100+ Anbieter weltweit.`,
  keywords: ["Mietwagen günstig", "Mietwagen buchen", "Mietwagen Preisvergleich", "Mietwagen Mallorca", "Mietwagen Türkei", "Mietwagen Kreta", "Autovermietung günstig", "Leihwagen buchen"],
  alternates: { canonical: `${BASE_URL}/mietwagen-reservieren/` },
  openGraph: {
    title: `🚗 Mietwagen günstig buchen ${YEAR} | Urlaubfinder365`,
    description: `Mietwagen ${YEAR} günstig vergleichen & buchen ✓ Alle Fahrzeugklassen ✓ Vollkasko inklusive ✓ Kein Aufpreis ✓ 100+ Anbieter weltweit.`,
    url: `${BASE_URL}/mietwagen-reservieren/`,
    type: "website",
  },
};

const HERO_IMG =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80";

// ── Beliebte Mietwagen-Ziele ─────────────────────────────────────────────────
const ZIELE = [
  { name: "Spanien",      cc: "es", sub: "Mallorca · Teneriffa · Ibiza" },
  { name: "Griechenland", cc: "gr", sub: "Kreta · Rhodos · Korfu" },
  { name: "USA",          cc: "us", sub: "Florida · Kalifornien · NYC" },
  { name: "Portugal",     cc: "pt", sub: "Algarve · Lissabon · Madeira" },
  { name: "Italien",      cc: "it", sub: "Toskana · Sizilien · Amalfi" },
  { name: "Türkei",       cc: "tr", sub: "Antalya · Bodrum · Istanbul" },
  { name: "Deutschland",  cc: "de", sub: "Überall vor Ort verfügbar" },
  { name: "Österreich",   cc: "at", sub: "Wien · Salzburg · Innsbruck" },
];

// ── Fahrzeugklassen ──────────────────────────────────────────────────────────
const KLASSEN = [
  {
    emoji: "🚗",
    label: "Kleinwagen",
    desc: "Wendig & sparsam – ideal für Städtetrips und enge Gassen. Günstigste Kategorie.",
    bg: "from-teal-600 to-cyan-700",
    badge: "Günstigste",
  },
  {
    emoji: "🚙",
    label: "Mittelklasse",
    desc: "Komfort für 4–5 Personen, ausreichend Kofferraum – der Allrounder für jeden Urlaub.",
    bg: "from-blue-600 to-indigo-700",
    badge: "Bestseller",
  },
  {
    emoji: "🚐",
    label: "SUV & Geländewagen",
    desc: "Mehr Platz, höhere Sitzposition, perfekt für Familien und Bergstrecken.",
    bg: "from-green-600 to-emerald-700",
    badge: "Familientipp",
  },
  {
    emoji: "🏎️",
    label: "Cabrio & Luxus",
    desc: "Für unvergessliche Küstenstraßen – offen fahren entlang der Amalfiküste oder Algarve.",
    bg: "from-amber-600 to-orange-700",
    badge: "Erlebnis",
  },
];

// ── Spar-Tipps ───────────────────────────────────────────────────────────────
const TIPPS = [
  {
    num: "01",
    title: "Frühzeitig buchen",
    text: "Wer 4–8 Wochen im Voraus bucht, zahlt oft 30–40 % weniger. Besonders in der Hochsaison auf Mallorca oder Kreta.",
  },
  {
    num: "02",
    title: "Full-to-Full Tankoption",
    text: "Immer Full-to-Full wählen: Auto voll abholen, voll zurückgeben. Prepaid-Tankoptionen sind meistens teurer.",
  },
  {
    num: "03",
    title: "Vollkasko ohne SB prüfen",
    text: "Viele günstige Tarife haben hohe Selbstbeteiligung. Vollkasko ohne Selbstbeteiligung spart im Schadensfall hunderte Euro.",
  },
  {
    num: "04",
    title: "Kreditkarte bereithalten",
    text: "Für die Kaution benötigen fast alle Anbieter eine Kreditkarte (Visa/Mastercard) – keine Debitkarte, kein Bargeld.",
  },
  {
    num: "05",
    title: "Zusatzfahrer vergleichen",
    text: "Manche Anbieter berechnen bis zu 15 €/Tag für einen zweiten Fahrer. Im Preisvergleich immer mit einberechnen.",
  },
  {
    num: "06",
    title: "GPS & Kindersitz buchen",
    text: "Zubehör vor Ort ist teuer. GPS vorab buchen oder Navi-App nutzen – Kindersitze immer im Voraus reservieren.",
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Wie alt muss man für einen Mietwagen sein?",
    a: "Das Mindestalter liegt bei den meisten Anbietern bei 21 Jahren, manchmal 25 Jahren für größere Fahrzeugklassen. Fahrer unter 25 Jahren zahlen oft einen \"Young Driver\"-Aufpreis von 5–15 €/Tag.",
  },
  {
    q: "Welche Dokumente brauche ich beim Mietwagen?",
    a: "Führerschein (mindestens 1 Jahr alt), Reisepass oder Personalausweis sowie eine Kreditkarte auf den Namen des Hauptfahrers. Für Nicht-EU-Länder ist manchmal ein internationaler Führerschein erforderlich.",
  },
  {
    q: "Was ist im Mietpreis enthalten?",
    a: "In der Regel sind Haftpflichtversicherung, unbegrenzte Kilometer und Steuern enthalten. Vollkasko, Diebstahlschutz und Reifenschutz müssen oft extra gebucht werden – am besten beim Buchen direkt mitabsichern.",
  },
  {
    q: "Kann ich den Mietwagen kostenlos stornieren?",
    a: "Die meisten über uns buchbaren Tarife sind kostenlos stornierbar bis 24–48 Stunden vor Abholung. Achte beim Buchen auf den Hinweis \"Kostenlose Stornierung\" im Tarif.",
  },
  {
    q: "Was ist eine Kaution beim Mietwagen?",
    a: "Die Kaution (100–1.500 €) wird als Blockierung auf deiner Kreditkarte hinterlegt und nach schadensfreier Rückgabe wieder freigegeben. Sie deckt mögliche Schäden oder Zusatzkosten ab.",
  },
  {
    q: "Kann ich den Mietwagen an einem anderen Ort zurückgeben?",
    a: "One-Way-Buchungen (z.B. abholen in Rom, zurückgeben in Florenz) sind möglich, aber oft mit Aufpreis. Im Buchungsprozess kannst du Start- und Rückgabeort separat angeben.",
  },
];

// ── JSON-LD ──────────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Mietwagen reservieren", item: `${BASE_URL}/mietwagen-reservieren/` },
  ],
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mietwagenPage");
  const sp = (await searchParams) ?? {};
  const ibeUrl = buildB2bUrl(
    "https://b2b.specials.de/index/jump/2/2776/993243/",
    sp
  );

  const MIETWAGEN_NAV_ITEMS = [
    { id: "mietwagen-widget",    label: t("navMietwagensuche"), emoji: "🚗" },
    { id: "mietwagen-ziele",     label: t("navZiele"),          emoji: "🌍" },
    { id: "fahrzeugklassen",     label: t("navFahrzeugklassen"),emoji: "🚙" },
    { id: "versicherungs-guide", label: t("navVersicherung"),   emoji: "🛡️" },
    { id: "spar-tipps",          label: t("navSparTipps"),      emoji: "💰" },
    { id: "faq",                 label: t("navFaq"),            emoji: "❓" },
  ];

  const TIPPS = [
    { num: "01", title: t("tip1Title"), text: t("tip1Text") },
    { num: "02", title: t("tip2Title"), text: t("tip2Text") },
    { num: "03", title: t("tip3Title"), text: t("tip3Text") },
    { num: "04", title: t("tip4Title"), text: t("tip4Text") },
    { num: "05", title: t("tip5Title"), text: t("tip5Text") },
    { num: "06", title: t("tip6Title"), text: t("tip6Text") },
  ];

  const FAQS = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbSchema} />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px] md:h-[440px]"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
      >
        {/* Gradient-Overlay – lighter so the car photo shines through */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(6,78,59,0.55) 0%, rgba(5,150,105,0.38) 50%, rgba(6,78,59,0.65) 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            <Car className="w-4 h-4" />
            {t("heroBadge")}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 mb-6">

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {t("heroTitle")}<br />
                <span className="text-emerald-300">{t("heroTitleHighlight")}</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-4">
                {t("heroSubtitle")}
              </p>

              {/* Infopills – beliebte Abholorte */}
              <p className="text-white/50 text-xs uppercase tracking-wide mb-2">
                {t("popularPickupLocations")}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { city: "Flughafen",   icon: "✈️" },
                  { city: "Stadtmitte",  icon: "🏙️" },
                  { city: "Bahnhof",     icon: "🚉" },
                  { city: "Hotel-Lieferung", icon: "🏨" },
                ].map((loc) => (
                  <span
                    key={loc.city}
                    className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {loc.icon} {loc.city}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust-Chips */}
            <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:shrink-0">
              {([
                { Icon: Tag,         label: t("trustBestprice"),    color: "#34d399" },
                { Icon: ShieldCheck, label: t("trustFullCover"),   color: "#38bdf8" },
                { Icon: Clock,       label: t("trustFreeCancellation"),color: "#f59e0b" },
                { Icon: MapPin,      label: t("trustCountries"),  color: "#a78bfa" },
              ] as const).map(({ Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2.5 rounded-xl">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  {label}
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* ── Sticky Schnellnavigation ── */}
      <PageNavBar items={MIETWAGEN_NAV_ITEMS} />

      {/* ═══════════════════════════════════════════════════════════════════
          ZWEISPALTEN-LAYOUT: Hauptinhalt + Sticky Sidebar Ad
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">

        {/* ── Hauptinhalt (linke Spalte) ── */}
        <div className="flex-1 min-w-0">

      {/* ── IBE Mietwagen – immer sichtbar ── */}
      <div id="mietwagen-widget" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[2px] mt-8 mb-2">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <IbeWidget dataSrc={ibeUrl} height={580} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BELIEBTE MIETWAGEN-ZIELE
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="mietwagen-ziele" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          {t("popularDestinationsTitle")}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {t("popularDestinationsSubtitle")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ZIELE.map((z) => (
            <div
              key={z.name}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Image
                src={`https://flagcdn.com/48x36/${z.cc}.png`}
                alt={z.name}
                width={32}
                height={24}
                className="rounded shrink-0"
                unoptimized
              />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">{z.name}</p>
                <p className="text-gray-400 text-xs truncate">{z.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FAHRZEUGKLASSEN
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="fahrzeugklassen" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            {t("vehicleTypesTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KLASSEN.map((k) => (
              <div key={k.label} className="rounded-2xl overflow-hidden shadow-sm">
                <div className={`bg-linear-to-br ${k.bg} px-4 py-4 text-white relative`}>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {k.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 pr-14">
                    <span className="text-2xl leading-none">{k.emoji}</span>
                    <h3 className="font-extrabold text-base leading-tight">{k.label}</h3>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-gray-500 leading-relaxed">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          VERSICHERUNGS-GUIDE + FÜHRERSCHEIN-SCHNELLCHECK
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="versicherungs-guide" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Exklusiver Ratgeber
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Mietwagen-Versicherung: Was bedeutet was?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Diese Abkürzungen solltest du kennen – bevor du buchst und draufzahlst.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              {
                code: "CDW",
                name: "Collision Damage Waiver",
                desc: "Schutz bei Unfallschäden am Mietwagen. Fast immer im Basispreis enthalten – jedoch mit Selbstbeteiligung (SB) von 500–3.000 €.",
                status: "Im Basispreis",
                statusColor: "bg-amber-100 text-amber-700",
                rec: "SB kann teuer werden",
                icon: "🔶",
              },
              {
                code: "SCDW",
                name: "Super CDW (ohne SB)",
                desc: "CDW ohne Selbstbeteiligung – im Schadensfall zahlst du nichts. Kostet ca. 5–15 €/Tag extra, schützt aber vor bösen Überraschungen.",
                status: "Empfohlen",
                statusColor: "bg-green-100 text-green-700",
                rec: "Unser Tipp: immer buchen",
                icon: "✅",
              },
              {
                code: "TP",
                name: "Theft Protection",
                desc: "Schutz gegen Diebstahl des Fahrzeugs. In vielen Ländern (bes. Südeuropa) dringend empfohlen – oft separat oder im SCDW enthalten.",
                status: "Meistens nötig",
                statusColor: "bg-blue-100 text-blue-700",
                rec: "Im Angebot prüfen",
                icon: "🔒",
              },
              {
                code: "PAI",
                name: "Personal Accident Insurance",
                desc: "Unfallversicherung für Fahrer und Insassen. Sinnvoll wenn keine private Unfallversicherung vorhanden – bei vielen Tarifen optional.",
                status: "Optional",
                statusColor: "bg-gray-100 text-gray-600",
                rec: "Prüfe deinen Urlaubversicherung",
                icon: "🏥",
              },
              {
                code: "Reifenschutz",
                name: "Tyre & Glass Protection",
                desc: "Schützt bei Reifenschäden und Glasbruch. Besonders sinnvoll auf Schotterwegen, in Griechenland oder auf den Kanarischen Inseln.",
                status: "Optional",
                statusColor: "bg-gray-100 text-gray-600",
                rec: "Für Offroad-Strecken nötig",
                icon: "🛞",
              },
              {
                code: "Kreditkarten-Schutz",
                name: "Deckung durch Kreditkarte",
                desc: "Manche Premium-Kreditkarten (Gold/Platinum) enthalten Mietwagen-CDW. Kreditkartenbedingungen prüfen – kann Zusatzversicherung ersetzen.",
                status: "Kartenabhängig",
                statusColor: "bg-purple-100 text-purple-700",
                rec: "Kreditkartenbedingungen prüfen",
                icon: "💳",
              },
            ].map((ins) => (
              <div key={ins.code} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ins.icon}</span>
                    <div>
                      <div className="font-extrabold text-gray-900 text-sm">{ins.code}</div>
                      <div className="text-gray-400 text-xs">{ins.name}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${ins.statusColor}`}>
                    {ins.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{ins.desc}</p>
                <p className="text-xs font-semibold text-[#00838F]">{ins.rec}</p>
              </div>
            ))}
          </div>

          {/* Führerschein-Schnellcheck */}
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            🪪 Führerschein-Schnellcheck: Was brauche ich wo?
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            In diesen Ländern reicht dein EU-Führerschein – und wo du einen internationalen Führerschein brauchst.
          </p>

          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100 mb-6">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Land</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">EU-Führerschein</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Int. Führerschein</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Hinweis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { cc: "es", land: "Spanien",       eu: "✅ Reicht",            intl: "Nicht nötig",   hint: "Auch auf Inseln (Mallorca, Teneriffa)" },
                  { cc: "gr", land: "Griechenland",   eu: "✅ Reicht",            intl: "Nicht nötig",   hint: "Auch auf Kreta, Rhodos, Korfu" },
                  { cc: "it", land: "Italien",         eu: "✅ Reicht",            intl: "Nicht nötig",   hint: "Inkl. Sizilien & Sardinien" },
                  { cc: "pt", land: "Portugal",        eu: "✅ Reicht",            intl: "Nicht nötig",   hint: "Auch auf Madeira & Azoren" },
                  { cc: "tr", land: "Türkei",          eu: "✅ Reicht",            intl: "Empfohlen",     hint: "EU-FS reicht, int. FS für manche Anbieter" },
                  { cc: "us", land: "USA",             eu: "⚠️ Meist reicht",     intl: "Empfohlen",     hint: "Florida & NY akzeptieren EU-FS; int. FS empfohlen" },
                  { cc: "ma", land: "Marokko",         eu: "❌ Nicht ausreichend", intl: "Erforderlich",  hint: "Internationaler Führerschein Pflicht" },
                  { cc: "th", land: "Thailand",        eu: "❌ Nicht ausreichend", intl: "Erforderlich",  hint: "Lokales Permit für Motorroller empfohlen" },
                  { cc: "ae", land: "VAE / Dubai",     eu: "⚠️ Meist reicht",     intl: "Empfohlen",     hint: "Zusätzl. arab. Übersetzung bei manchen Anbietern" },
                  { cc: "au", land: "Australien",      eu: "⚠️ Meist reicht",     intl: "Empfohlen",     hint: "Englische Übersetzung oder int. FS empfohlen" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`https://flagcdn.com/48x36/${row.cc}.png`}
                          alt={row.land}
                          width={20}
                          height={15}
                          className="rounded shrink-0"
                          unoptimized
                        />
                        {row.land}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{row.eu}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.intl}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{row.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#00838F]/5 border border-[#00838F]/20 rounded-2xl p-4 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00838F] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">Internationalen Führerschein beim ADAC oder DVR beantragen</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Kosten: ca. 15 € · Gültig: 3 Jahre · Ausstellung sofort beim ADAC vor Ort möglich.
                Immer zusammen mit dem nationalen EU-Führerschein vorzeigen.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SPAR-TIPPS
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="spar-tipps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          6 Tipps für günstige Mietwagen
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          So sparst du bei der nächsten Automiete und vermeidest Fallen.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPPS.map((tip) => (
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
      <div id="faq" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Häufige Fragen zum Mietwagen
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Alles Wichtige rund um die Automiete – schnell erklärt.
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
        <div className="bg-linear-to-br from-[#064e3b] to-[#065f46] rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🚗</div>
            <h2 className="text-2xl font-bold mb-2">Auch Flug oder Hotel buchen?</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Kombiniere Mietwagen mit Flug und Hotel – oft günstiger als Einzelbuchung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guenstig-urlaub-buchen/"
                className="inline-block bg-white text-[#065f46] font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
              >
                Pauschalreisen vergleichen →
              </Link>
              <Link
                href="/flugsuche/"
                className="inline-block bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/25 transition-colors border border-white/30"
              >
                Nur Flug suchen →
              </Link>
            </div>
          </div>
        </div>
      </div>

        </div>{/* ── Ende Hauptinhalt ── */}

        {/* ── Sticky Sidebar (nur XL+) ── */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24 pt-8">
            <RightSidebar
              extrasBox={{
                image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&h=200&q=70",
                eyebrow: "Tipp",
                title: "Flug + Hotel + Mietwagen im Paket",
                description: "Als Pauschalreise buchst du alles günstiger aus einer Hand.",
                href: "/guenstig-urlaub-buchen/",
                ctaLabel: "Jetzt vergleichen →",
                accentColor: "bg-emerald-700",
              }}
              seoLinksTitle="🚗 Mietwagen-Ziele"
              seoLinks={[
                { href: "/urlaubsziele/mallorca/",  label: "Mietwagen Mallorca" },
                { href: "/urlaubsziele/kreta/",     label: "Mietwagen Kreta" },
                { href: "/urlaubsziele/teneriffa/", label: "Mietwagen Teneriffa" },
                { href: "/urlaubsziele/algarve/",   label: "Mietwagen Algarve" },
                { href: "/urlaubsziele/antalya/",   label: "Mietwagen Antalya" },
                { href: "/urlaubsziele/sardinien/", label: "Mietwagen Sardinien" },
                { href: "/urlaubsziele/sizilien/",  label: "Mietwagen Sizilien" },
              ]}
            />
          </div>
        </aside>

      </div>{/* ── Ende Zweispalten-Layout ── */}

    </div>
  );
}
