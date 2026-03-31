import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";
import AdBanner from "@/components/ui/AdBanner";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import DestinationCarousel from "@/components/ui/DestinationCarousel";

export const metadata: Metadata = {
  title: "Last Minute Urlaub – Günstige Reisen kurzfristig buchen",
  description:
    "Last Minute Urlaub günstig buchen: Spontan verreisen und bis zu 60% sparen. ✓ Tägliche neue Angebote ✓ Sofortbuchung ✓ Aktivitäten dazu buchen.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/last-minute-urlaub/" },
};

export const revalidate = 1800;

const LM_VORTEILE = [
  { emoji: "⚡", title: "Spontan abreisen", desc: "Angebote für die nächsten 2–4 Wochen." },
  { emoji: "💰", title: "Bis zu 60% sparen", desc: "Hotels & Fluglinien geben Last-Minute Rabatte." },
  { emoji: "📱", title: "Sofort buchbar", desc: "Ticket sofort auf dein Handy – kein Warten." },
  { emoji: "🛡️", label: "Gratis Storno", desc: "Viele Angebote mit kostenlosem Storno." },
];

export default function LastMinuteUrlaub() {
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const mallorca = destinations.find((d) => d.slug === "mallorca")!;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[380px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(180,83,9,0.82) 0%, rgba(220,38,38,0.60) 50%, rgba(15,23,42,0.75) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            ⚡ Last-Minute Urlaub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Last Minute Urlaub –<br />
            <span className="text-sand-100">Spontan und günstig reisen</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Kurzfristig entschieden? Perfekt! Entdecke unsere tagesaktuellen Last-Minute
            Angebote und spare bis zu 60% gegenüber dem Normalpreis.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LM_VORTEILE.map((v) => (
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

      {/* Last-Minute Angebote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Last-Minute nach <span className="text-sand-500">Antalya</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Kurzfristige Angebote für die nächsten 2 Wochen – jetzt buchen und spontan fliegen!
        </p>
        <IbeTeaser
          regionId="149"
          headline="Antalya"
          from="3"
          to="17"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {destinations.filter((d) => d.tiqetsCityId && d.ibeRegionId).map((d) => (
            <Link key={d.slug} href={`/urlaubsziele/${d.slug}/`} className="text-sm text-[#00838F] hover:underline font-medium">
              Last-Minute {d.name} →
            </Link>
          ))}
        </div>
      </div>

      {/* Expertenempfehlung */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <ExpertBanner
          expert={EXPERTS.thomas}
          quote="Last-Minute ist meine Leidenschaft! Wer flexibel ist, bekommt manchmal Angebote, die man sonst nie bezahlen könnte. Mein Geheimtipp: einfach mal schauen, was die nächsten 14 Tage bieten."
          tip="Mein Tipp: Türkei Last-Minute ab 199 €"
          accentColor="#b45309"
          deeplink="https://www.urlaubfinder365.de/last-minute/"
          deeplinkLabel="Heutige Deals ansehen"
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Last-Minute Urlaub – Was steckt dahinter?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Last-Minute Reisen sind Angebote, die kurzfristig – in der Regel 2 bis 4 Wochen vor Abreise –
          zu reduzierten Preisen verfügbar sind. Hotels und Fluglinien geben freie Kapazitäten günstig ab,
          damit sie nicht leer bleiben. Für spontane Reisende bedeutet das: bis zu 60% Ersparnis gegenüber
          dem regulären Buchungspreis.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Beliebt sind Last-Minute Deals besonders in der Türkei (Antalya), Spanien (Mallorca, Kanaren)
          und Griechenland (Kreta, Rhodos). Die Auswahl ist kurzfristig begrenzt – wer buchen möchte,
          sollte nicht zu lange warten.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Last-Minute Suche zeigt dir täglich tagesaktuelle Angebote mit Abflug in den nächsten
          2–4 Wochen, mindestens 3 Sterne und ≥50% HolidayCheck-Empfehlung.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zu Last-Minute</h2>
        <div className="space-y-4">
          {[
            { q: "Wann ist Last-Minute am günstigsten?", a: "Die besten Preise gibt es 7 bis 21 Tage vor Abreise. Direkt nach Buchungsöffnung sind Preise meist hoch, fallen dann und steigen kurz vor Abflug wieder." },
            { q: "Kann ich Last-Minute stornieren?", a: "Last-Minute Angebote haben oft keine oder sehr hohe Stornogebühren, da der Abreisetermin nahe ist. Eine Reiserücktrittsversicherung ist hier besonders empfehlenswert." },
            { q: "Bekomme ich einen guten Zimmertyp bei Last-Minute?", a: "Die Zimmerkategorien sind oft eingeschränkt – was noch frei ist, wird vergeben. Wer ein bestimmtes Zimmer (z.B. Meerblick) möchte, sollte lieber früh buchen." },
            { q: "Gibt es Last-Minute auch für Familien?", a: "Ja, aber die Auswahl ist begrenzt. Suche gezielt nach 2 Erwachsene + Kinder und filtere nach Familienhotels. Unsere Suche lässt das Hinzufügen von Kindern zu." },
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
            { href: "/urlaubsarten/super-last-minute-urlaub/", label: "🚀 Super-Last-Minute (72h)" },
            { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: "🍹 All-Inclusive" },
            { href: "/urlaubsarten/fruhbucher-urlaub/", label: "🌅 Frühbucher" },
            { href: "/last-minute/", label: "🔥 Heutige Deals" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700 hover:text-orange-700 text-sm font-medium px-4 py-2 rounded-full transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sofort buchbare Aktivitäten */}
      {antalya.tiqetsCityId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-gray-100 pt-10">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Sofort buchbare Aktivitäten ⚡
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Ticket sofort aufs Handy – perfekt für Spontanbucher.
              </p>
            </div>
            <Link href="/aktivitaeten/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:text-[#6CC4BA] whitespace-nowrap">
              Alle Aktivitäten →
            </Link>
          </div>
          <div className="mt-5">
            <TiqetsCarousel cityId={antalya.tiqetsCityId} cityName={antalya.name} citySlug={antalya.slug} />
          </div>
          {mallorca.tiqetsCityId && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Aktivitäten auf <span className="text-sand-500">Mallorca</span>
              </h3>
              <TiqetsCarousel cityId={mallorca.tiqetsCityId} cityName={mallorca.name} citySlug={mallorca.slug} />
            </div>
          )}
        </div>
      )}

      </div>{/* end flex-1 */}

      <aside className="hidden xl:block w-[160px] shrink-0 pr-4">
        <div className="sticky top-24 pt-8 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
              Anzeige
            </p>
            <AdBanner placementKey="86c5e79b5bd126e0b09685dad18c2682" height={600} />
          </div>
          <div className="bg-[#00838F]/8 rounded-2xl p-4 border border-[#00838F]/15 text-center">
            <p className="text-xs font-bold text-[#00838F] mb-1">⚡ Spontan?</p>
            <p className="text-[11px] text-gray-500 mb-3 leading-snug">
              Super-Last-Minute – Abreise in 72h
            </p>
            <Link href="/urlaubsarten/super-last-minute-urlaub/" className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors">
              Jetzt ansehen →
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
      <DestinationCarousel title="Last-Minute nach diesen Zielen" accentColor="#b45309" />

    </div>
  );
}
