import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";
import AdBanner from "@/components/ui/AdBanner";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import { setRequestLocale } from "next-intl/server";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🌅 Frühbucher Urlaub ${YEAR}/${YEAR + 1} – bis 40% sparen`,
  description: `Frühbucher Angebote ${YEAR}/${YEAR + 1}: Bis zu 40% auf Pauschalreisen sparen ✓ Beste Hotels sichern ✓ Maximale Auswahl ✓ Jetzt früh buchen!`,
  keywords: ["Frühbucher Urlaub", "Frühbucher Angebote", "Frühbucher Türkei", "Frühbucher Mallorca", "Frühbucher Griechenland", "Früh buchen sparen", "Frühbucher Pauschalreise", "Frühbucherrabatt"],
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/fruhbucher-urlaub/" },
  openGraph: {
    title: `🌅 Frühbucher Urlaub ${YEAR}/${YEAR + 1} – bis 40% sparen | Urlaubfinder365`,
    description: `Frühbucher Angebote ${YEAR}/${YEAR + 1}: Bis zu 40% auf Pauschalreisen sparen ✓ Beste Hotels sichern ✓ Maximale Auswahl ✓ Jetzt früh buchen!`,
    url: "https://www.urlaubfinder365.de/urlaubsarten/fruhbucher-urlaub/",
    siteName: "Urlaubfinder365",
    images: [{ url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80", width: 1200, height: 630, alt: "Frühbucher Urlaub – Traumstrand auf griechischer Insel" }],
    locale: "de_DE",
    type: "website",
  },
};

export const revalidate = 3600;

const FB_VORTEILE = [
  { emoji: "🌅", title: "Bis zu 40% sparen", desc: "Wer früh bucht, bekommt die besten Preise." },
  { emoji: "🏨", title: "Beste Zimmer sichern", desc: "Meerblick & Top-Ausstattung gehen zuerst." },
  { emoji: "🗓️", title: "Flexible Planung", desc: "Mehr Zeit für Urlaubsvorbereitung & Aktivitäten." },
  { emoji: "✈️", title: "Wunschflug wählen", desc: "Abflugzeiten nach deinen Vorlieben." },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const barcelona = destinations.find((d) => d.slug === "barcelona")!;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.82) 0%, rgba(15,118,110,0.60) 50%, rgba(15,23,42,0.75) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🌅 Frühbucher Urlaub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Frühbucher Urlaub –<br />
            <span className="text-emerald-200">Früh buchen, mehr sparen</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Plane deinen Traumurlaub jetzt und sichere dir die besten Preise, die schönsten
            Zimmer und mehr Zeit für perfekte Vorbereitung.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FB_VORTEILE.map((v) => (
              <div key={v.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5">
                <span className="text-2xl">{v.emoji}</span>
                <p className="font-bold text-sm mt-2 leading-tight">{v.title}</p>
                <p className="text-xs text-white/65 mt-1 leading-snug">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
      <div className="flex-1 min-w-0">

      {/* Frühbucher-Angebote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Frühbucher nach <span className="text-sand-500">Antalya</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Jetzt für den Sommer planen und Top-Preise sichern – bevor andere buchen.
        </p>
        <IbeTeaser
          regionId="149"
          headline="Antalya"
          from="60"
          to="180"
          duration="7-14"
          adults="2"
          category="3"
          minRecommrate="70"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {destinations.filter((d) => d.tiqetsCityId).map((d) => (
            <Link key={d.slug} href={`/urlaubsziele/${d.slug}/`} className="text-sm text-[#00838F] hover:underline font-medium">
              Frühbucher {d.name} →
            </Link>
          ))}
        </div>
      </div>

      {/* Expertenempfehlung */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Wer Mallorca oder Ibiza im Sommer liebt, sollte jetzt schon buchen – die schönsten Meerblick-Zimmer sind im Februar schon weg. Ich empfehle meinen Kunden immer: früh planen, entspannt reisen."
          tip="Mein Tipp: Mallorca Frühbucher ab 259 €"
          accentColor="#059669"
          deeplink="https://www.urlaubfinder365.de/urlaubsziele/mallorca/"
          deeplinkLabel="Mallorca Frühbucher ansehen"
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frühbucher Urlaub – Früh entscheiden, mehr sparen</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Wer seinen Urlaub mindestens 3–6 Monate im Voraus bucht, profitiert von Frühbucherrabatten
          von bis zu 40%. Die schönsten Zimmer mit Meerblick oder Pool-Direktzugang gehen als erstes
          weg – genauso wie die besten Abflugzeiten. Früh zu buchen bedeutet maximale Auswahl bei
          minimalem Preis.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Frühbucherangebote gibt es besonders attraktiv für Sommerreisen (Juli/August) ab November
          des Vorjahres und für Winterurlaub ab Juli/August. Viele Veranstalter bieten kostenlose
          Umbuchungsmöglichkeiten bei Frühbucherangeboten an.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Frühbucher-Suche zeigt Angebote mit Abreise in 60–180 Tagen, mindestens 3 Sterne
          und ≥70% HolidayCheck-Empfehlung – damit du sicher planst.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zu Frühbucherreisen</h2>
        <div className="space-y-4">
          {[
            { q: "Wann lohnt sich ein Frühbucher besonders?", a: "Besonders bei Sommerferien (Juli/August), Weihnachten und Silvester sowie populären Destinationen wie Mallorca oder der Türkei. In diesen Zeiträumen steigen Preise und Nachfrage – wer früh bucht, spart und hat die beste Auswahl." },
            { q: "Wie früh muss ich buchen, um Frühbucherrabatt zu bekommen?", a: "In der Regel ab 180 Tage (6 Monate) vor Abreise. Viele Veranstalter bieten Frühbucherpreise bis 90 Tage vorher an. Danach steigen die Preise oft wieder." },
            { q: "Kann ich einen Frühbucher stornieren oder umbuchen?", a: "Viele Frühbucher-Tarife erlauben kostenlose Umbuchungen bis zu einem bestimmten Datum. Stornierungen sind meist gegen Stornogebühren möglich. Prüfe immer die Buchungsbedingungen des Veranstalters." },
            { q: "Sind Frühbucherpreise wirklich günstiger?", a: "In den meisten Fällen ja – besonders für Familien und beliebte Ferienzeiten. Einzelne Last-Minute Angebote können günstiger sein, aber das Risiko ist höher, das Wunschzimmer oder -datum nicht zu bekommen." },
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
        <p className="text-sm font-semibold text-gray-500 mb-4">Weitere Urlaubsarten entdecken</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: "🍹 All-Inclusive" },
            { href: "/urlaubsarten/last-minute-urlaub/", label: "⚡ Last-Minute" },
            { href: "/urlaubsarten/super-last-minute-urlaub/", label: "🚀 Super-Last-Minute" },
            { href: "/urlaubsziele/", label: "🌍 Alle Urlaubsziele" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Aktivitäten vorausplanen */}
      {barcelona.tiqetsCityId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-gray-100 pt-10">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Aktivitäten jetzt vorausplanen 🎟️
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Die beliebtesten Tickets sind schnell ausgebucht – sicher dir deinen Platz schon heute.
              </p>
            </div>
            <Link href="/aktivitaeten/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:text-[#6CC4BA] whitespace-nowrap">
              Alle Aktivitäten →
            </Link>
          </div>
          <div className="mt-5">
            <TiqetsCarousel cityId={barcelona.tiqetsCityId} cityName={barcelona.name} citySlug={barcelona.slug} />
          </div>
          {antalya.tiqetsCityId && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Aktivitäten in <span className="text-sand-500">Antalya</span> vorausbuchen
              </h3>
              <TiqetsCarousel cityId={antalya.tiqetsCityId} cityName={antalya.name} citySlug={antalya.slug} />
            </div>
          )}
        </div>
      )}

      </div>{/* end flex-1 */}

      <aside className="hidden xl:block w-[186px] shrink-0 pr-4">
        <div className="sticky top-24 pt-8 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
              Anzeige
            </p>
            <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
          </div>
          <div className="bg-[#00838F]/8 rounded-2xl p-4 border border-[#00838F]/15 text-center">
            <p className="text-xs font-bold text-[#00838F] mb-1">🌅 Frühbucher</p>
            <p className="text-[11px] text-gray-500 mb-3 leading-snug">
              Jetzt für Sommer buchen &amp; bis zu 40% sparen
            </p>
            <Link href="/urlaubsarten/pauschalreisen/" className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors">
              Angebote ansehen →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
              🔗 Urlaubsarten
            </p>
            <ul className="space-y-1.5">
              {[
                { href: "/urlaubsarten/pauschalreisen/", label: "Pauschalreisen" },
                { href: "/urlaubsarten/all-inclusive-urlaub/", label: "All-Inclusive" },
                { href: "/urlaubsarten/last-minute-urlaub/", label: "Last-Minute" },
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
      <DestinationCarousel title="Frühbucher-Tipp: Beliebte Reiseziele" accentColor="#059669" />

    </div>
  );
}
