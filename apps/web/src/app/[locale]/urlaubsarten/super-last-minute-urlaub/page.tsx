import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";
import RightSidebar from "@/components/layout/RightSidebar";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import { setRequestLocale } from "next-intl/server";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `⚡ Super Last Minute ${YEAR} – Abreise in 72 Stunden`,
  description: `Super Last Minute ${YEAR}: In 72 Stunden am Strand ✓ Maximale Ersparnis ✓ Sofortbuchung ✓ Türkei, Griechenland & Ägypten zum Spitzenpreis.`,
  keywords: ["Super Last Minute", "Super Last Minute Urlaub", "72 Stunden Urlaub", "Last Minute Restplätze", "Sofort verreisen", "Spontanurlaub", "Billigster Last Minute Urlaub"],
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/super-last-minute-urlaub/" },
  openGraph: {
    title: `⚡ Super Last Minute ${YEAR} – Abreise in 72h | Urlaubfinder365`,
    description: `Super Last Minute ${YEAR}: In 72 Stunden am Strand ✓ Maximale Ersparnis ✓ Sofortbuchung ✓ Türkei, Griechenland & Ägypten zum Spitzenpreis.`,
    url: "https://www.urlaubfinder365.de/urlaubsarten/super-last-minute-urlaub/",
    siteName: "Urlaubfinder365",
    images: [{ url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1200&q=80&auto=format", width: 1200, height: 630, alt: "Super Last Minute – Antalya Strand mit Taurusgebirge" }],
    locale: "de_DE",
    type: "website",
  },
};

export const revalidate = 900;

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const kreta = destinations.find((d) => d.slug === "kreta")!;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.82) 0%, rgba(225,29,72,0.60) 50%, rgba(15,23,42,0.75) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🚀 Super-Last-Minute
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Super Last Minute –<br />
            <span className="text-red-200">Morgen schon am Strand!</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Abreise innerhalb von 72 Stunden? Kein Problem! Maximale Ersparnis für
            Entschlossene – buche jetzt und fliege morgen.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5">
              <span className="text-2xl">🚀</span>
              <p className="font-bold text-sm mt-2">Abreise in 72h</p>
              <p className="text-xs text-white/65 mt-1">Maximale Spontaneität</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5">
              <span className="text-2xl">💸</span>
              <p className="font-bold text-sm mt-2">Höchste Ersparnis</p>
              <p className="text-xs text-white/65 mt-1">Hotels & Airlines räumen auf</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5">
              <span className="text-2xl">⚡</span>
              <p className="font-bold text-sm mt-2">Sofortbuchung</p>
              <p className="text-xs text-white/65 mt-1">Ticket sofort ums Handy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
      <div className="flex-1 min-w-0">

      {/* Super-LM Angebote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            🔥 LIVE Angebote
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Jetzt sofort verfügbar
          </h2>
        </div>
        <p className="text-gray-500 mb-6">
          Diese Angebote sind noch heute verfügbar – Abreise innerhalb der nächsten 3 Tage.
        </p>
        <IbeTeaser
          regionId="149"
          headline="Super Last Minute"
          from="1"
          to="3"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>💡 Tipp:</strong> Super-Last-Minute Angebote ändern sich stündlich. Buche jetzt,
          solange die Verfügbarkeit noch besteht!
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/last-minute/" className="text-sm text-[#00838F] hover:underline font-medium">
            Alle Last-Minute Deals →
          </Link>
          {destinations
            .filter((d) => d.ibeRegionId)
            .map((d) => (
              <Link
                key={d.slug}
                href={`/urlaubsziele/${d.slug}/`}
                className="text-sm text-gray-500 hover:text-[#00838F] hover:underline font-medium"
              >
                {d.name} →
              </Link>
            ))}
        </div>
      </div>

      {/* Expertenempfehlung */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <ExpertBanner
          expert={EXPERTS.manuel}
          quote="Türkei Super-Last-Minute ist genau mein Ding – ich kenne die Angebote, die sich in letzter Sekunde noch lohnen. Wenn du heute buchst und morgen fliegen willst, bin ich dein Experte!"
          tip="Mein Tipp: Antalya in 72h ab 179 €"
          accentColor="#dc2626"
          deeplink="https://www.urlaubfinder365.de/last-minute/"
          deeplinkLabel="Sofort-Angebote ansehen"
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Super-Last-Minute – Abreise in 72 Stunden</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Super-Last-Minute Angebote sind die extremste Variante des Spontanurlaubs: Abflug innerhalb
          der nächsten 72 Stunden. Hotels und Airlines geben allerletzt freie Kapazitäten mit maximalen
          Rabatten ab – Ersparnisse von 50–70% gegenüber dem Normalpreis sind möglich.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Diese Angebote ändern sich stündlich und sind oft nur wenige Stunden verfügbar. Wer ein
          bestimmtes Ziel oder Hotel im Kopf hat, muss flexibel sein – denn Super-Last-Minute bedeutet
          nehmen, was noch da ist, und das zum Schnäppchenpreis.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Super-Last-Minute Suche zeigt Angebote mit Abreise in 1–3 Tagen ab heute,
          mindestens 3 Sterne und ≥50% HolidayCheck-Empfehlung. Jetzt prüfen – schnell buchen!
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zu Super-Last-Minute</h2>
        <div className="space-y-4">
          {[
            { q: "Was brauche ich für eine Super-Last-Minute Buchung?", a: "Einen gültigen Personalausweis oder Reisepass, eine Kreditkarte für die Buchung und gepackten Koffer. Check-in beim Flughafen muss oft am nächsten Tag erfolgen – also schnell sein!" },
            { q: "Sind Super-Last-Minute Buchungen seriös?", a: "Ja! Alle angezeigten Angebote kommen von seriösen Reiseveranstaltern (IATA zertifiziert). Du buchst direkt beim Veranstalter über unser Buchungsportal." },
            { q: "Kann ich ein Hotel oder Urlaubsziel wählen?", a: "Eingeschränkt – die Auswahl ist durch die kurzfristige Verfügbarkeit begrenzt. Du kannst nach Region filtern (z.B. Türkei, Spanien), aber nicht immer ein bestimmtes Hotel wählen." },
            { q: "Gibt es Stornomöglichkeiten bei Super-Last-Minute?", a: "Meist nicht. Bei Abreise innerhalb von 24–72 Stunden sind Stornogebühren von 90–100% des Reisepreises üblich. Super-Last-Minute = No-Refund. Buche nur, wenn du wirklich fahren kannst." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interne Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-t border-gray-100 pt-8">
        <p className="text-sm font-semibold text-gray-500 mb-4">Weniger spontan? Weitere Optionen</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/urlaubsarten/last-minute-urlaub/", label: "⚡ Last-Minute (2–4 Wochen)" },
            { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: "🍹 All-Inclusive" },
            { href: "/urlaubsarten/fruhbucher-urlaub/", label: "🌅 Frühbucher" },
            { href: "/last-minute/", label: "🔥 Alle Last-Minute Deals" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Aktivitäten sofort buchbar */}
      {antalya.tiqetsCityId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-gray-100 pt-10">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Aktivitäten sofort buchbar ⚡
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Handy-Ticket sofort nach Buchung – ideal für spontane Urlauber.
              </p>
            </div>
            <Link href="/aktivitaeten/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:text-[#6CC4BA] whitespace-nowrap">
              Alle Aktivitäten →
            </Link>
          </div>
          <div className="mt-5">
            <TiqetsCarousel cityId={antalya.tiqetsCityId} cityName={antalya.name} citySlug={antalya.slug} />
          </div>
          {kreta.tiqetsCityId && (
            <div className="mt-8">
              <TiqetsCarousel cityId={kreta.tiqetsCityId} cityName={kreta.name} citySlug={kreta.slug} />
            </div>
          )}
        </div>
      )}

      </div>{/* end flex-1 */}

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-24">
          <RightSidebar
            extrasBox={{
              image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70',
              eyebrow: 'Morgen weg?',
              title: 'Last-Minute ab morgen',
              description: 'Angebote 2–4 Wochen – spontan und günstig buchen.',
              href: '/urlaubsarten/last-minute-urlaub/',
              ctaLabel: 'Angebote ansehen →',
            }}
            seoLinksTitle="✈️ Urlaubsarten"
            seoLinks={[
              { href: '/urlaubsarten/pauschalreisen/', label: 'Pauschalreisen' },
              { href: '/urlaubsarten/all-inclusive-urlaub/', label: 'All-Inclusive' },
              { href: '/urlaubsarten/last-minute-urlaub/', label: 'Last-Minute' },
              { href: '/urlaubsarten/fruhbucher-urlaub/', label: 'Frühbucher' },
              { href: '/urlaubsziele/', label: 'Alle Urlaubsziele' },
            ]}
          />
        </div>
      </aside>

      </div>{/* end xl:flex */}

      {/* Beliebte Urlaubsziele */}
      <DestinationCarousel title="Jetzt sofort verfügbar – Top-Ziele" accentColor="#dc2626" />

    </div>
  );
}
