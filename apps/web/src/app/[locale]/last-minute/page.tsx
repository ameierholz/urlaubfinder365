import type { Metadata } from "next";
import Link from "next/link";
import { fetchOffers } from "@/lib/travel-api";
import { destinations } from "@/lib/destinations";
import OffersGrid from "@/components/offers/OffersGrid";
import IbeWidget from "@/components/widgets/IbeWidget";
import PriceChart from "@/components/destination/price-chart";
import AutoScrollToWidget from "@/components/widgets/AutoScrollToWidget";
import { buildB2bUrl } from "@/lib/search-params";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `⚡ Last Minute Urlaub ${YEAR} – bis 60% günstiger buchen`,
  description: `Last Minute Urlaub ${YEAR} günstig buchen ✓ Täglich neue Deals ✓ Bis zu 60% sparen ✓ Türkei, Mallorca, Ägypten & Griechenland – jetzt spontan verreisen!`,
  keywords: ["Last Minute Urlaub", "Last Minute Reisen günstig", "Last Minute Türkei", "Last Minute Mallorca", "Last Minute Ägypten", "Kurzfristig Urlaub buchen", "Spontan verreisen", "Billige Last Minute Angebote", "Last Minute Pauschalreise"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/last-minute/",
  },
  openGraph: {
    title: `⚡ Last Minute Urlaub ${YEAR} – günstige Angebote | Urlaubfinder365`,
    description:
      "Täglich neue Last-Minute Deals ✓ Bis zu 60% günstiger ✓ Türkei, Mallorca, Griechenland & mehr – jetzt spontan buchen!",
    url: "https://www.urlaubfinder365.de/last-minute/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Last-Minute Urlaub günstig buchen – Strandurlaub mit Traumhotels",
      },
    ],
  },
};

// FAQ data for rendering (JSON-LD FAQPage removed – restricted by Google since Aug 2023)
const faqData = [
    {
      "@type": "Question",
      name: "Wie viel spare ich mit Last-Minute Urlaub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mit Last-Minute Urlaube sind Ersparnisse von 20–60% gegenüber dem Normalpreis möglich. Je näher der Abflugtermin, desto höher der Rabatt, da Veranstalter freie Kapazitäten füllen wollen.",
      },
    },
    {
      "@type": "Question",
      name: "Wann sind Last-Minute Angebote am günstigsten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die besten Last-Minute Deals gibt es 1–21 Tage vor dem Abflug. Besonders günstig wird es oft 3–7 Tage vorher, wenn noch viele freie Plätze vorhanden sind.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Ziele gibt es bei Last-Minute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beliebte Last-Minute Ziele sind Türkei (Antalya, Side), Mallorca, Kreta, Fuerteventura, Ägypten (Hurghada) und die Kanarischen Inseln. Auf Urlaubfinder365 findest du täglich aktualisierte Angebote für alle Ziele.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich Last-Minute Urlaub mit Familie buchen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Auch Familien können von Last-Minute Angeboten profitieren. Viele Pauschalreisen sind für 2 Erwachsene + 2 Kinder buchbar. Besonders günstig: All-Inclusive Angebote, da Verpflegungskosten inklusive sind.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Last-Minute und Super-Last-Minute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Last-Minute Angebote gelten für Reisen 1–21 Tage im Voraus. Super-Last-Minute bezeichnet extrem kurzfristige Angebote für den selben oder nächsten Tag mit den größten Rabatten.",
      },
    },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Last-Minute Urlaub", item: "https://www.urlaubfinder365.de/last-minute/" },
  ],
};

export const revalidate = 1800;

export default async function ({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = (await searchParams) ?? {};
  const hasSearchParams = !!(sp.regionId || sp.destination || sp.adults);
  const ibeUrl = buildB2bUrl(
    "https://b2b.specials.de/index/jump/121/2798/993243/",
    { adults: "2", duration: sp.duration || "1-14", ...sp }
  );
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const offers = await fetchOffers({ regionIds: antalya.regionIds, duration: "3-5", limit: 6 }).catch(() => []);

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen">
        {/* Hero */}
        <div
          className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[340px]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(180,83,9,0.82) 0%, rgba(220,38,38,0.58) 50%, rgba(15,23,42,0.78) 100%)" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-white/60 text-xs mb-5">
              <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
              <span>/</span>
              <span className="text-white/90">Last-Minute Urlaub</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
              🔥 Last-Minute Deals – täglich aktuell
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
              Last-Minute Urlaub –<br />
              <span className="text-orange-200">Heute buchen, morgen fliegen</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Täglich aktualisierte Last-Minute Angebote – spontan verreisen und bis zu 60% sparen.
            </p>
          </div>
        </div>

        {/* Inhaltsverzeichnis */}
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-3">Inhaltsverzeichnis</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-orange-800">
              <a href="#angebote" className="hover:text-orange-600 transition-colors">① Aktuelle Angebote</a>
              <a href="#was-ist" className="hover:text-orange-600 transition-colors">② Was sind Last-Minute Urlaube?</a>
              <a href="#wann-buchen" className="hover:text-orange-600 transition-colors">③ Wann am günstigsten buchen?</a>
              <a href="#top-ziele" className="hover:text-orange-600 transition-colors">④ Top Last-Minute Ziele</a>
              <a href="#checkliste" className="hover:text-orange-600 transition-colors">⑤ Checkliste vor der Buchung</a>
              <a href="#faq" className="hover:text-orange-600 transition-colors">⑥ Häufige Fragen</a>
            </nav>
          </div>
        </div>

        {/* IBE Last-Minute Suche */}
        {hasSearchParams && <AutoScrollToWidget targetId="lastminute-ibe" />}
        <div id="lastminute-ibe" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-2 scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <IbeWidget dataSrc={ibeUrl} height={3750} />
          </div>
        </div>

        {/* Angebote */}
        <div id="angebote" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aktuelle Last-Minute Angebote</h2>
          <p className="text-gray-500 mb-6">Heute verfügbare Angebote – täglich aktualisiert, direkt buchbar.</p>
          <OffersGrid offers={offers} />
        </div>

        {/* Preisverlauf Top-Ziele */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preisverlauf: Beliebte Last-Minute Ziele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceChart destinationSlug="antalya" destinationName="Antalya" />
            <PriceChart destinationSlug="mallorca" destinationName="Mallorca" />
          </div>
        </div>

        {/* Was sind Last-Minute + Vorteile */}
        <div id="was-ist" className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Was sind Last-Minute Urlaube?</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Last-Minute Urlaube sind kurzfristig verfügbare Pauschalreisen, die Reiseveranstalter
                  zu deutlich reduzierten Preisen anbieten – oft <strong>20 bis 60 % günstiger</strong> als
                  der Normalpreis. Der Grund: Flugzeuge, Hotels und Kreuzfahrtschiffe sollen voll
                  ausgelastet sein. Wer also flexibel ist und spontan buchen kann, profitiert enorm.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Auf Urlaubfinder365 aggregieren wir täglich frische Last-Minute Deals von über 50
                  führenden deutschen Reiseveranstaltern wie TUI, DER Touristik, FTI und Alltours.
                  Klicke einfach auf ein Angebot und buche direkt beim Anbieter – ohne Umwege, ohne
                  versteckte Gebühren.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Der Begriff <em>Last-Minute</em> stammt ursprünglich aus der Luftfahrt: Airlines
                  verkauften kurz vor Abflug unbesetzte Plätze zu Schleuderpreisen. Heute umfasst der
                  Begriff alle kurzfristigen Pauschalreise-Deals – von Strandurlaub über Städtetrips bis
                  zur Kreuzfahrt.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Besonders beliebt: <strong>Türkei (Antalya, Side)</strong>, <strong>Mallorca</strong>,
                  <strong>Kreta</strong> und <strong>Ägypten (Hurghada)</strong>. All-Inclusive Angebote
                  sind besonders empfehlenswert, da Verpflegungskosten bereits inklusive sind und du
                  vor Ort nicht nachkalkulieren musst.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/urlaubsarten/super-last-minute-urlaub/" className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                    Super-Last-Minute →
                  </Link>
                  <Link href="/urlaubsarten/all-inclusive-urlaub/" className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition-colors">
                    All-Inclusive Urlaub →
                  </Link>
                  <Link href="/urlaubsziele/" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                    Alle Urlaubsziele →
                  </Link>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Vorteile von Last-Minute</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
                  {[
                    { icon: "💰", text: "Bis zu 60% Rabatt gegenüber Normalpreis" },
                    { icon: "🗓️", text: "Ideal für Spontanurlauber ohne festes Datum" },
                    { icon: "🌍", text: "Alle Top-Ziele: Türkei, Mallorca, Griechenland, Ägypten" },
                    { icon: "🍽️", text: "Viele Angebote inkl. All-Inclusive Verpflegung" },
                    { icon: "✈️", text: "Direktflüge & Charterflüge ab deutschen Airports" },
                    { icon: "🔄", text: "Täglich aktualisiert – immer neue Deals" },
                    { icon: "👨‍👩‍👧", text: "Auch für Familien: Kinder oft kostenfrei oder stark reduziert" },
                    { icon: "🛡️", text: "Reiseschutz & Insolvenzschutz wie bei Normalpreis-Buchungen" },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-2">
                      <span className="text-base">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-orange-200">
                  <p className="text-xs text-gray-500">
                    💡 <strong>Tipp:</strong> Die besten Deals gibt es 3–7 Tage vor Abflug.
                    Aktiviere unsere <Link href="/dashboard/" className="underline text-orange-700">Preisalarme im Dashboard</Link> für sofortige Benachrichtigungen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wann buchen – Timing-Tabelle */}
        <div id="wann-buchen" className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Wann sind Last-Minute Deals am günstigsten?</h2>
            <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">
              Nicht jeder Tag ist gleich gut für Last-Minute-Buchungen. Die folgende Tabelle zeigt, wie sich
              der Buchungszeitpunkt auf den Preis auswirkt – basierend auf typischen Marktbewegungen bei
              deutschen Pauschalreise-Veranstaltern:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-orange-50 text-orange-800 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3">Buchungszeitraum vor Abflug</th>
                    <th className="px-5 py-3">Typ</th>
                    <th className="px-5 py-3">Ersparnis ggü. Normalpreis</th>
                    <th className="px-5 py-3">Verfügbarkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {[
                    ["21–14 Tage", "Early Last-Minute", "10–25 %", "Gut – viele Ziele wählbar"],
                    ["13–8 Tage", "Last-Minute", "20–40 %", "Mittel – beliebte Ziele teils ausgebucht"],
                    ["7–3 Tage", "Hot Last-Minute", "30–55 %", "Eingeschränkt – schnell buchen"],
                    ["2–1 Tage", "Super-Last-Minute", "bis 60 %", "Gering – oft nur Einzelzimmer"],
                    ["Same Day", "Last-Second", "bis 70 %", "Sehr gering – Glückssache"],
                  ].map(([zeit, typ, ersparnis, verf]) => (
                    <tr key={zeit} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-semibold">{zeit}</td>
                      <td className="px-5 py-3">{typ}</td>
                      <td className="px-5 py-3 text-emerald-700 font-bold">{ersparnis}</td>
                      <td className="px-5 py-3 text-gray-500">{verf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * Richtwerte basierend auf typischen Marktbewegungen. Preise variieren je nach Ziel, Saison und Veranstalter.
            </p>
          </div>
        </div>

        {/* Top Last-Minute Ziele */}
        <div id="top-ziele" className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Top Last-Minute Urlaubsziele 2026</h2>
            <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">
              Diese Urlaubsziele sind besonders häufig in Last-Minute Angeboten vertreten – dank hoher
              Flugfrequenz und großem Hotelbettangebot entstehen regelmäßig attraktive Preisnachlässe:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  flag: "🇹🇷", name: "Türkei – Antalya & Side",
                  href: "/urlaubsziele/antalya/",
                  text: "Nummer-1-Ziel für Last-Minute Pauschalreisen. Traumhafter Sandstrand, hervorragendes All-Inclusive-Angebot und kurze Flugzeit von ~3,5 h machen die Türkei zum idealen Spontanziel.",
                  tags: ["All-Inclusive", "Familienurlaub", "ab 399 €"],
                },
                {
                  flag: "🇪🇸", name: "Mallorca",
                  href: "/urlaubsziele/mallorca/",
                  text: "Spaniens größte Insel überzeugt mit über 300 Sonnentagen im Jahr, top Infrastruktur und zahlreichen Direktflügen ab fast allen deutschen Flughäfen – auch kurzfristig.",
                  tags: ["Strandurlaub", "Städtetrip", "ab 299 €"],
                },
                {
                  flag: "🇬🇷", name: "Kreta",
                  href: "/urlaubsziele/kreta/",
                  text: "Griechenlands größte Insel bietet günstige Hotels, traumhafte Strände und authentische Kultur. Last-Minute Deals sind besonders außerhalb der Hochsaison sehr attraktiv.",
                  tags: ["Kultur & Strand", "Naturerlebnis", "ab 349 €"],
                },
                {
                  flag: "🇪🇬", name: "Ägypten – Hurghada",
                  href: "/urlaubsziele/hurghada/",
                  text: "Ganzjährig warmes Wetter und günstige All-Inclusive-Resorts machen Hurghada zum Geheimtipp. Last-Minute Preise fallen hier oft unter 400 € pro Person.",
                  tags: ["Ganzjährig", "All-Inclusive", "ab 379 €"],
                },
                {
                  flag: "🇵🇹", name: "Kanarische Inseln",
                  href: "/urlaubsziele/teneriffa/",
                  text: "Teneriffa, Fuerteventura und Gran Canaria locken das ganze Jahr mit mildem Klima. Perfekt für Winter-Last-Minute, wenn andere Ziele Nebensaison haben.",
                  tags: ["Ganzjährig", "Winterurlaub", "ab 449 €"],
                },
                {
                  flag: "🇪🇸", name: "Barcelona",
                  href: "/urlaubsziele/barcelona/",
                  text: "Für Städtetripper: Barcelona ist kurzfristig oft günstiger buchbar als im Voraus. Weltkulturerbe, Tapas und Strandpromenade – die Kombination ist unschlagbar.",
                  tags: ["Städtetrip", "Kultur", "ab 249 €"],
                },
              ].map((dest) => (
                <Link key={dest.href} href={dest.href} className="group block bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{dest.flag}</span>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-700 transition-colors">{dest.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{dest.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="bg-white border border-gray-200 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Checkliste vor der Buchung */}
        <div id="checkliste" className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkliste: Das solltest du vor der Last-Minute-Buchung prüfen</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Schnell buchen ist gut – vorbereitet buchen ist besser. Prüfe diese Punkte, bevor du
                  auf &quot;Jetzt buchen&quot; klickst:
                </p>
                <ol className="space-y-4">
                  {[
                    { n: "1", title: "Reisepass & Dokumente", text: "Reisepass muss noch mindestens 6 Monate gültig sein. Für einige Ziele reicht der Personalausweis." },
                    { n: "2", title: "Reisewarnung prüfen", text: "Das Auswärtige Amt aktualisiert Reisewarnungen täglich – unbedingt vor der Buchung checken." },
                    { n: "3", title: "Reiserücktrittsversicherung", text: "Gerade bei Last-Minute empfehlenswert: Falls du kurzfristig krank wirst, bist du abgesichert." },
                    { n: "4", title: "Impfungen & Gesundheit", text: "Für außereuropäische Ziele können Impfungen nötig sein. Ärztlichen Rat rechtzeitig einholen." },
                    { n: "5", title: "Gepäck & Handgepäck", text: "Gepäckfreigrenzen unterscheiden sich je Veranstalter – oft ist Handgepäck im Last-Minute-Preis inklusive." },
                    { n: "6", title: "Transfer & Anreise", text: "Flughafentransfer meist im Pauschalpreis enthalten. Anreise zum Abflughafen frühzeitig planen." },
                  ].map((item) => (
                    <li key={item.n} className="flex gap-4">
                      <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">{item.n}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3">🏛️ Offizielle Informationsquellen</h3>
                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <a href="https://www.auswaertiges-amt.de/de/ReiseUndSicherheit/reise-und-sicherheitshinweise" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                        Auswärtiges Amt – Reise- & Sicherheitshinweise ↗
                      </a>
                      <p className="text-gray-500 text-xs mt-0.5">Aktuelle Warnungen & Einreisebestimmungen für alle Länder</p>
                    </li>
                    <li>
                      <a href="https://www.adac.de/reise-freizeit/reiseplanung/reisevorbereitung/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                        ADAC – Reisevorbereitung & Checklisten ↗
                      </a>
                      <p className="text-gray-500 text-xs mt-0.5">Packlisten, Gesundheitstipps und Reiserecht</p>
                    </li>
                    <li>
                      <a href="https://www.bzga.de/infomaterialien/reisemedizin/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                        BZgA – Reisemedizin & Impfberatung ↗
                      </a>
                      <p className="text-gray-500 text-xs mt-0.5">Impfempfehlungen nach Urlaubsziel</p>
                    </li>
                    <li>
                      <a href="https://www.bundesnetzagentur.de/DE/Vportal/TK/Roaming/start.html" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                        Bundesnetzagentur – EU-Roaming ↗
                      </a>
                      <p className="text-gray-500 text-xs mt-0.5">Handy & Internet im Urlaub: Roaming-Regeln</p>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-3">💡 Last-Minute Spartipps</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2"><span>✓</span><span>Abflugtag flexibel halten – Dienstag & Mittwoch oft am günstigsten</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Mehrzimmer-Buchungen: Zwei Doppelzimmer statt Familienzimmer prüfen</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>All-Inclusive schützt vor Überraschungskosten vor Ort</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Preisalarm aktivieren – wir benachrichtigen dich sobald dein Ziel günstig wird</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Inkl. Transfer buchen spart oft 30–80 € gegenüber Taxi vor Ort</span></li>
                  </ul>
                  <div className="mt-4">
                    <Link href="/dashboard/" className="inline-block bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors">
                      Preisalarm einrichten →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ-Sektion */}
        <div id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Häufige Fragen zu Last-Minute Urlaub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqData.map((item) => (
              <div key={item.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interne Links / Related */}
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weitere Reisethemen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { href: "/urlaubsziele/antalya/", label: "🇹🇷 Türkei" },
                { href: "/urlaubsziele/mallorca/", label: "🇪🇸 Mallorca" },
                { href: "/urlaubsziele/kreta/", label: "🇬🇷 Kreta" },
                { href: "/urlaubsziele/barcelona/", label: "🇪🇸 Barcelona" },
                { href: "/urlaubsarten/", label: "🏖️ Urlaubsarten" },
                { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-center px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-sand-400 hover:text-sand-600 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
