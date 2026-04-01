import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageNavBar from "@/components/ui/PageNavBar";
import LifestyleSection from "@/components/home/LifestyleSection";

export const metadata: Metadata = {
  title: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
  description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/" },
  openGraph: {
    title: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
    description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
    url: "https://www.urlaubfinder365.de/urlaubsarten/",
    type: "website",
  },
};

const NAV_ITEMS = [
  { id: "urlaubsarten-uebersicht", label: "Urlaubsarten",    emoji: "✈️" },
  { id: "lifestyle",               label: "Dein Lifestyle",  emoji: "💫" },
  { id: "reise-tipps",             label: "Reise-Tipps",     emoji: "💡" },
  { id: "faq",                     label: "FAQ",             emoji: "❓" },
];

const arten = [
  {
    title: "Pauschalreisen",
    href: "/urlaubsarten/pauschalreisen/",
    desc: "Flug + Hotel + Transfer – alles inklusive gebucht. Kein Stress, kein Organisationsaufwand.",
    emoji: "✈️",
    highlight: "Beliebteste Wahl",
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    title: "Frühbucher Urlaub",
    href: "/urlaubsarten/fruhbucher-urlaub/",
    desc: "Früh buchen und bis zu 40 % sparen. Die besten Zimmer und Kabinen sichert man sich frühzeitig.",
    emoji: "🌅",
    highlight: "Bis zu 40% sparen",
    color: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    title: "All-Inclusive Urlaub",
    href: "/urlaubsarten/all-inclusive-urlaub/",
    desc: "Essen, Trinken und mehr – alles inklusive. Entspannt genießen ohne laufend Ausgaben im Kopf.",
    emoji: "🍹",
    highlight: "Sorgenlos genießen",
    color: "bg-teal-50 border-teal-100",
    badge: "bg-teal-100 text-teal-700",
  },
  {
    title: "Last-Minute Urlaub",
    href: "/urlaubsarten/last-minute-urlaub/",
    desc: "Spontan und günstig – kurzfristige Angebote bis 14 Tage vor Abreise mit Top-Rabatten.",
    emoji: "⚡",
    highlight: "Spontan & günstig",
    color: "bg-orange-50 border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    title: "Super-Last-Minute",
    href: "/urlaubsarten/super-last-minute-urlaub/",
    desc: "Innerhalb von 72 Stunden abreisen – maximale Ersparnis für echte Spontanreisende.",
    emoji: "🚀",
    highlight: "Innerhalb 72h",
    color: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700",
  },
];

const TIPPS = [
  {
    num: "01",
    title: "Flexibel bleiben",
    text: "Wer bei Reisedatum und Abflughafen flexibel ist, findet oft deutlich günstigere Angebote. Mittwochs und donnerstags sind Preise häufig am niedrigsten.",
    emoji: "📅",
  },
  {
    num: "02",
    title: "Vergleichen lohnt sich",
    text: "Selbst bei gleicher Destination und gleichem Hotel können Preise je nach Anbieter stark schwanken. Unser Vergleich zeigt dir täglich alle aktuellen Angebote.",
    emoji: "🔍",
  },
  {
    num: "03",
    title: "Frühbucher-Rabatte nutzen",
    text: "6–12 Monate vor Reiseantritt sind Frühbucher-Rabatte am größten. Beliebte Ziele wie Mallorca oder die Türkei sind im Sommer früh ausgebucht.",
    emoji: "🗓️",
  },
  {
    num: "04",
    title: "Reiseversicherung nicht vergessen",
    text: "Eine Reiserücktrittsversicherung schützt bei Krankheit, Unfall oder Jobverlust vor Stornokosten. Besonders bei teuren Reisen absolut empfehlenswert.",
    emoji: "🛡️",
  },
  {
    num: "05",
    title: "Direktbuchung vs. Pauschalreise",
    text: "Pauschalreisen bieten Insolvenzschutz und Komplettorganisation. Bei Einzelbuchungen braucht man mehr Planung, kann aber manchmal günstiger reisen.",
    emoji: "⚖️",
  },
  {
    num: "06",
    title: "Preisalarm nutzen",
    text: "Du hast ein Wunschziel? Setze einen Preisalarm und erhalte eine Benachrichtigung sobald der Preis fällt – so verpasst du kein Schnäppchen.",
    emoji: "🔔",
  },
];

const FAQS = [
  {
    q: "Was ist der Unterschied zwischen Pauschalreise und Individualreise?",
    a: "Bei einer Pauschalreise werden Flug, Hotel und oft auch Transfer zu einem Gesamtpaket kombiniert. Du buchst alles auf einmal und hast gesetzlichen Insolvenzschutz. Bei der Individualreise buchst du jeden Baustein separat – mehr Freiheit, aber mehr Planungsaufwand.",
  },
  {
    q: "Wann lohnt sich All-Inclusive?",
    a: "All-Inclusive lohnt sich besonders bei Familien mit Kindern und bei Urlauben in Regionen, wo Essen & Trinken teuer ist. Wer viel am Hotel bleiben möchte und keinen Stress mit der Budgetplanung vor Ort will, profitiert am meisten.",
  },
  {
    q: "Wie kurzfristig kann ich Last-Minute buchen?",
    a: "Last-Minute-Angebote sind in der Regel 3–14 Tage vor Abreise verfügbar. Super-Last-Minute geht sogar bis zu 72 Stunden vor Abflug. Je kurzfristiger, desto größer oft der Rabatt – aber auch die Auswahl wird kleiner.",
  },
  {
    q: "Lohnt sich Frühbuchen wirklich?",
    a: "Ja – besonders für beliebte Sommerziele und Hauptreisezeiten. Frühbucher sichern sich die besten Zimmer und Kabinen zu den niedrigsten Preisen. Studien zeigen, dass 4–6 Monate vor Reiseantritt häufig die günstigsten Preise zu finden sind.",
  },
  {
    q: "Sind Pauschalreisen sicher bei Insolvenz des Veranstalters?",
    a: "Ja. Seit der EU-Pauschalreiserichtlinie sind Pauschalreisen durch einen Sicherungsschein geschützt. Bei Insolvenz des Veranstalters erhalten Reisende ihr Geld zurück oder werden heimgebracht.",
  },
  {
    q: "Welche Urlaubsart eignet sich für Familien mit Kindern am besten?",
    a: "Pauschalreisen mit All-Inclusive sind für Familien ideal: kein Planungsaufwand, feste Kosten, Animationsprogramm vor Ort. Viele Clubs haben eigene Kinderclubs und Pools – so entspannen Eltern und Kinder gleichzeitig.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
    description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
    url: "https://www.urlaubfinder365.de/urlaubsarten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Urlaubsarten", item: "https://www.urlaubfinder365.de/urlaubsarten/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

export default function UrlaubsartenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/urlaubsarten_header.webp"
        alt="Urlaubsarten"
        className="w-full object-cover"
        style={{ maxHeight: "180px" }}
        loading="eager"
      />

      {/* ── Sticky NavBar ── */}
      <PageNavBar items={NAV_ITEMS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════════════════
            URLAUBSARTEN ÜBERSICHT
        ═══════════════════════════════════════════════════════ */}
        <section id="urlaubsarten-uebersicht" className="py-12">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Alle Möglichkeiten im Überblick</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Urlaubsarten – finde deine perfekte Reise
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Von entspannten Pauschalreisen über All-Inclusive bis zu spontanen Last-Minute-Deals – hier findest du die Reiseart, die zu dir passt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {arten.map((art) => (
              <Link
                key={art.href}
                href={art.href}
                className={`relative rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 group ${art.color}`}
              >
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${art.badge}`}>
                  {art.highlight}
                </span>
                <div className="text-4xl mb-3">{art.emoji}</div>
                <h2 className="font-extrabold text-gray-900 text-xl mb-2 group-hover:text-[#00838F] transition-colors">
                  {art.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{art.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[#00838F] text-sm font-semibold">
                  <span>Jetzt entdecken</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            LIFESTYLE
        ═══════════════════════════════════════════════════════ */}
        <section id="lifestyle" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Für jeden das Richtige</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dein Lifestyle, deine Wahl!</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Ob Familien, Paare, Singles oder Abenteurer – entdecke die Urlaubswelt, die zu deinem Leben passt.
            </p>
          </div>
          <LifestyleSection />
        </section>

        {/* ═══════════════════════════════════════════════════════
            REISE-TIPPS
        ═══════════════════════════════════════════════════════ */}
        <section id="reise-tipps" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Expertenwissen</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Reise-Tipps für den perfekten Urlaub</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Mit diesen Tipps buchst du smarter, sparst mehr und reist entspannter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIPPS.map((tipp) => (
              <div key={tipp.num} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{tipp.emoji}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">{tipp.num}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{tipp.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tipp.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FAQ
        ═══════════════════════════════════════════════════════ */}
        <section id="faq" className="py-12 border-t border-gray-100">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-2">Häufige Fragen</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">FAQ – Urlaubsarten im Detail</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex gap-2">
                  <span className="text-[#00838F] shrink-0">Q</span>
                  {q}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed pl-5">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
