import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";
import AdBanner from "@/components/ui/AdBanner";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import Image from "next/image";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `✈ Pauschalreisen ${YEAR} günstig buchen – Flug + Hotel`,
  description: `Pauschalreisen ${YEAR} mit Flug, Hotel & Transfer günstig buchen ✓ Täglich aktuell ✓ Ab 3 Sterne ✓ 50+ Veranstalter ✓ Direkt buchen & sparen.`,
  keywords: ["Pauschalreisen günstig", "Pauschalreisen buchen", "Flug und Hotel", "Pauschalreisen Türkei", "Pauschalreisen Mallorca", "Pauschalreisen Griechenland", "Pauschalreisen Ägypten", "Billige Pauschalreisen", "Paketreise buchen"],
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/pauschalreisen/" },
  openGraph: {
    title: `✈ Pauschalreisen ${YEAR} günstig buchen | Urlaubfinder365`,
    description: `Pauschalreisen ${YEAR} mit Flug, Hotel & Transfer günstig buchen ✓ Täglich aktuell ✓ Ab 3 Sterne ✓ 50+ Veranstalter ✓ Direkt buchen & sparen.`,
    url: "https://www.urlaubfinder365.de/urlaubsarten/pauschalreisen/",
    type: "website",
  },
};

export const revalidate = 3600;

const HIGHLIGHTS = [
  { emoji: "✈️", title: "Flug inklusive", desc: "Hin- und Rückflug ab deinem Abflughafen." },
  { emoji: "🏨", title: "Hotel inklusive", desc: "Geprüfte Hotels ab 3 Sterne mit echten Bewertungen." },
  { emoji: "🚌", title: "Transfer inklusive", desc: "Zuverlässiger Bustransfer vom Flughafen ins Hotel." },
  { emoji: "💶", title: "Ein Preis, alles dabei", desc: "Kein Preiszusatz vor Ort – was du buchst, das zahlst du." },
];

const FAQ = [
  {
    q: "Was ist eine Pauschalreise?",
    a: "Eine Pauschalreise (auch Paket-Reise genannt) kombiniert mindestens zwei Reiseleistungen – in der Regel Flug, Hotel und Transfer – zu einem Gesamtpreis. Du buchst alles auf einmal beim selben Veranstalter.",
  },
  {
    q: "Welche Vorteile hat eine Pauschalreise gegenüber einer Einzelbuchung?",
    a: "Pauschalreisen sind oft günstiger als die Summe der Einzelbausteine. Zudem bist du durch das Pauschalreisegesetz (EU-Richtlinie) besonders gut geschützt: Bei Insolvenz des Veranstalters oder erheblichen Änderungen hast du Anspruch auf Rückerstattung oder eine Alternative.",
  },
  {
    q: "Wie früh sollte ich eine Pauschalreise buchen?",
    a: "Für Sommerreisen (Juli/August) empfehlen sich Frühbuchungen ab November des Vorjahres – so sicherst du dir die besten Zimmer und Preise. Last-Minute Pauschalreisen gibt es oft 2–4 Wochen vor Abreise mit hohen Rabatten.",
  },
  {
    q: "Sind Pauschalreisen stornierbar?",
    a: "Ja. Pauschalreisen können in der Regel gegen Stornogebühren storniert werden. Je näher der Abreisetermin, desto höher die Gebühr (meist 25–90%). Viele Veranstalter bieten zusätzlich eine Reiserücktrittsversicherung an.",
  },
  {
    q: "Welche Reiseziele gibt es als Pauschalreise?",
    a: "Die beliebtesten Pauschalreise-Ziele ab Deutschland sind Türkei (Antalya, Side), Spanien (Mallorca, Kanaren), Griechenland (Kreta, Rhodos) und Ägypten (Hurghada). Aber auch Fernziele wie Thailand oder die Malediven gibt es als Paket.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsarten", item: "https://www.urlaubfinder365.de/urlaubsarten/" },
    { "@type": "ListItem", position: 3, name: "Pauschalreisen", item: "https://www.urlaubfinder365.de/urlaubsarten/pauschalreisen/" },
  ],
};

export default function PauschalreisenPage() {
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const mallorca = destinations.find((d) => d.slug === "mallorca")!;
  const kreta = destinations.find((d) => d.slug === "kreta")!;

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <div
        className="text-white relative overflow-hidden -mt-24 pt-24 min-h-[380px]"
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Pauschalreisen günstig buchen – Flug & Hotel"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.82) 0%, rgba(3,105,161,0.60) 50%, rgba(15,23,42,0.75) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            ✈️ Pauschalreisen
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Pauschalreisen –<br />
            <span className="text-sky-200">Flug, Hotel & Transfer</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Alles aus einer Hand: Flug, Hotel und Transfer zum Bestpreis.
            Täglich aktualisierte Angebote ab mindestens 3 Sterne und ≥50% HolidayCheck-Empfehlung.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5">
                <span className="text-2xl">{h.emoji}</span>
                <p className="font-bold text-sm mt-2 leading-tight">{h.title}</p>
                <p className="text-xs text-white/65 mt-1 leading-snug">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
      <div className="flex-1 min-w-0">

      {/* Angebote Antalya */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Pauschalreisen nach <span className="text-sand-500">Antalya</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Türkeis beliebteste Ferienregion – exzellente Hotels, traumhafte Strände.
        </p>
        <IbeTeaser
          regionId="149"
          headline="Antalya"
          from="14"
          to="120"
          duration="7-14"
          adults="2"
          category="3"
          minRecommrate="50"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {destinations.filter((d) => d.ibeRegionId).map((d) => (
            <Link key={d.slug} href={`/urlaubsziele/${d.slug}/`}
              className="text-sm text-[#00838F] hover:underline font-medium">
              Pauschalreisen {d.name} →
            </Link>
          ))}
        </div>
      </div>

      {/* Expertenempfehlung */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <ExpertBanner
          expert={EXPERTS.manuel}
          quote="Für eine Pauschalreise mit perfektem Preis-Leistungs-Verhältnis empfehle ich die türkische Riviera. Top-Hotels, traumhafte Strände und alles aus einer Hand – Antalya ist einfach unschlagbar."
          tip="Mein Tipp: Antalya Pauschal ab 299 €"
          accentColor="#0284c7"
          deeplink="https://www.urlaubfinder365.de/urlaubsziele/antalya/"
          deeplinkLabel="Antalya Angebote ansehen"
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Was ist eine Pauschalreise?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Eine Pauschalreise kombiniert mindestens zwei Reiseleistungen – meist Flug, Hotelunterkunft und
          Flughafentransfer – zu einem Gesamtpaket. Du buchst alles auf einmal, hast einen einzigen
          Ansprechpartner und profitierst vom gesetzlichen Schutz gemäß EU-Pauschalreiserichtlinie.
          Bei Insolvenz des Veranstalters oder wesentlichen Vertragsänderungen hast du Anspruch auf
          vollständige Rückerstattung oder ein gleichwertiges Ersatzangebot.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die beliebtesten Abflughäfen für Pauschalreisen ab Deutschland sind Frankfurt, München,
          Düsseldorf, Hamburg, Berlin und Stuttgart. Wir zeigen dir täglich aktualisierte Angebote
          mit mindestens 3 Sternen und einer HolidayCheck-Empfehlung von mindestens 50 % – damit du
          weißt, dass das gebuchte Hotel wirklich empfehlenswert ist.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Über den IBE-Buchungsbutton gelangst du direkt zum Veranstalter und kannst sicher und
          verschlüsselt buchen. Urlaubfinder365 ist ein unabhängiges Reiseportal – wir vergleichen
          täglich Hunderte Angebote, damit du den günstigsten Preis findest.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zu Pauschalreisen</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interne Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-t border-gray-100 pt-8">
        <p className="text-sm font-semibold text-gray-500 mb-4">Weitere Urlaubsarten entdecken</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: "🍹 All-Inclusive Urlaub" },
            { href: "/urlaubsarten/last-minute-urlaub/", label: "⚡ Last-Minute Urlaub" },
            { href: "/urlaubsarten/fruhbucher-urlaub/", label: "🌅 Frühbucher Urlaub" },
            { href: "/urlaubsarten/super-last-minute-urlaub/", label: "🚀 Super-Last-Minute" },
            { href: "/last-minute/", label: "🔥 Heutige Last-Minute Deals" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Aktivitäten Cross-Sell */}
      {antalya.tiqetsCityId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-gray-100 pt-10">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Aktivitäten für deinen Pauschalurlaub 🎟️</h2>
              <p className="text-gray-500 text-sm mt-1">Touren, Tickets & Erlebnisse – perfekt kombinierbar mit deiner Pauschalreise.</p>
            </div>
            <Link href="/aktivitaeten/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:text-[#6CC4BA] whitespace-nowrap shrink-0">
              Alle Aktivitäten →
            </Link>
          </div>
          <div className="mt-5">
            <TiqetsCarousel cityId={antalya.tiqetsCityId} cityName={antalya.name} citySlug={antalya.slug} />
          </div>
        </div>
      )}

      </div>{/* end flex-1 */}

      {/* Sticky Sidebar Ad (nur XL+) */}
      <aside className="hidden xl:block w-[186px] shrink-0 pr-4">
        <div className="sticky top-24 pt-8 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
              Anzeige
            </p>
            <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
          </div>
          <div className="bg-[#00838F]/8 rounded-2xl p-4 border border-[#00838F]/15 text-center">
            <p className="text-xs font-bold text-[#00838F] mb-1">🔥 Last-Minute</p>
            <p className="text-[11px] text-gray-500 mb-3 leading-snug">
              Günstige Reisen – Abreise in 7–14 Tagen
            </p>
            <Link href="/last-minute/" className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors">
              Deals ansehen →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
              🔗 Urlaubsarten
            </p>
            <ul className="space-y-1.5">
              {[
                { href: "/urlaubsarten/all-inclusive-urlaub/", label: "All-Inclusive" },
                { href: "/urlaubsarten/last-minute-urlaub/", label: "Last-Minute" },
                { href: "/urlaubsarten/fruhbucher-urlaub/", label: "Frühbucher" },
                { href: "/urlaubsarten/super-last-minute-urlaub/", label: "Super-Last-Minute" },
                { href: "/urlaubsziele/", label: "Alle Reiseziele" },
              ].map(({ href, label }) => (
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

      </div>{/* end xl:flex */}

      {/* Beliebte Reiseziele */}
      <DestinationCarousel title="Beliebte Pauschalreise-Ziele" accentColor="#0284c7" />

    </div>
  );
}
