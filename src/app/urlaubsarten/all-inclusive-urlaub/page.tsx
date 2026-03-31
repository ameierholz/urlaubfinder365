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

export const metadata: Metadata = {
  title: "All-Inclusive Urlaub 2026 – günstig ab 299 €",
  description:
    "All-Inclusive Urlaub 2026 günstig buchen: Essen, Trinken & Unterhaltung inklusive. ✓ 4 & 5 Sterne Hotels ✓ Täglich neue Angebote ✓ Bestpreis-Garantie.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/all-inclusive-urlaub/" },
  openGraph: {
    title: "All-Inclusive Urlaub 2026 – günstig ab 299 € | Urlaubfinder365",
    description:
      "All-Inclusive Urlaub 2026 günstig buchen: Essen, Trinken & Unterhaltung inklusive. ✓ 4 & 5 Sterne Hotels ✓ Täglich neue Angebote ✓ Bestpreis-Garantie.",
    url: "https://www.urlaubfinder365.de/urlaubsarten/all-inclusive-urlaub/",
    siteName: "Urlaubfinder365",
    images: [{ url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80", width: 1200, height: 630, alt: "All Inclusive Hotel Pool mit türkisblauem Wasser" }],
    locale: "de_DE",
    type: "website",
  },
};

export const revalidate = 3600;

const FAQ = [
  { q: "Was ist bei All-Inclusive immer inklusive?", a: "Mindestens: Frühstück, Mittagessen, Abendessen, Softdrinks, Wasser, Kaffee und Tee. Meist auch: alkoholische Getränke an der Bar, Snacks zwischendurch und Animation. Premium-AI schließt manchmal auch Ausflüge oder Spa-Leistungen ein." },
  { q: "Lohnt sich All-Inclusive?", a: "Für Familien mit Kindern, Strandliebhaber und Vielzecher ist AI fast immer günstiger als alles einzeln zu bezahlen. Wer viel sightseeing macht und selten im Hotel isst, fährt mit Frühstück oft besser." },
  { q: "Gibt es AI auch im 3-Sterne-Hotel?", a: "Ja! Viele 3- und 4-Sterne Hotels in der Türkei und Griechenland bieten echtes AI zu günstigen Preisen an. Unsere Suche filtert nach mindestens 3 Sternen und HolidayCheck-Bewertung." },
  { q: "Wie unterscheidet sich UAI von AI?", a: "UAI (Ultra All-Inclusive) ist die Premium-Variante: mehr Restaurants, höherwertige Alkoholmarken, mehr Inklusivleistungen wie Wassersport oder Spa. Der Preisunterschied beträgt oft 20–40%." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const AI_HIGHLIGHTS = [
  { emoji: "🍽️", title: "Unbegrenzt essen & trinken", desc: "Frühstück, Mittag, Abendessen und Snacks ganztags inklusive." },
  { emoji: "🏊", title: "Pool & Strand inklusive", desc: "Liegen, Schirme und Wasserpark ohne Aufpreis." },
  { emoji: "🎭", title: "Animation & Entertainment", desc: "Abendshows, Sport und Kinderprogramm kostenlos." },
  { emoji: "💶", title: "Volle Kostenkontrolle", desc: "Kein unerwarteter Zusatzausgaben vor Ort." },
];

export default function AllInclusiveUrlaub() {
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const kreta = destinations.find((d) => d.slug === "kreta")!;

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <div
        className="text-white relative overflow-hidden -mt-24 pt-24 min-h-[380px]"
      >
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80"
          alt="All-Inclusive Urlaub – Pool & Strand im Hotel"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.82) 0%, rgba(30,64,175,0.60) 50%, rgba(15,23,42,0.75) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🍹 All-Inclusive Urlaub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            All Inclusive Urlaub –<br />
            <span className="text-blue-200">Rundum sorglos genießen</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mb-8">
            Essen, Trinken, Sport und Unterhaltung – bei All-Inclusive ist alles dabei.
            Maximale Entspannung bei voller Kostenkontrolle.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AI_HIGHLIGHTS.map((h) => (
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

      {/* Angebote Antalya (AI) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          All-Inclusive in <span className="text-sand-500">Antalya</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Die türkische Riviera ist weltweit bekannt für hervorragende All-Inclusive Resorts.
        </p>
        <IbeTeaser
          regionId="149"
          headline="Antalya"
          boardCode="AI"
          from="14"
          to="42"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {destinations.filter((d) => d.tiqetsCityId && d.ibeRegionId).map((d) => (
            <Link key={d.slug} href={`/urlaubsziele/${d.slug}/`} className="text-sm text-[#00838F] hover:underline font-medium">
              All-Inclusive {d.name} →
            </Link>
          ))}
        </div>
      </div>

      {/* Expertenempfehlung */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="All-Inclusive ist für Familien einfach die entspannteste Lösung – kein Stress mit Kosten, kein Feilschen. In Antalya gibt es Resorts, die für Kinder und Eltern gleichzeitig das Beste bieten."
          tip="Mein Tipp: AI-Resort in Antalya ab 349 €"
          accentColor="#1d4ed8"
          deeplink="https://www.urlaubfinder365.de/urlaubsziele/antalya/"
          deeplinkLabel="All-Inclusive Angebote"
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Was ist All-Inclusive Urlaub?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Bei einem All-Inclusive Urlaub sind Mahlzeiten (Frühstück, Mittag, Abendessen), Getränke
          (alkoholfrei und oft auch alkoholisch), Snacks und viele Freizeitangebote im Zimmerpreis
          enthalten. Keine unerwarteten Ausgaben vor Ort – du zahlst einmal und genießt unbegrenzt.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Besonders beliebt ist All-Inclusive in der Türkei (Antalya, Side, Bodrum), Griechenland
          (Kreta, Rhodos) und Ägypten (Hurghada, Sharm el-Sheikh). Große Resorts bieten oft mehrere
          Restaurants, Wasserparks, Animation und Abendshows.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Wir zeigen dir täglich aktualisierte AI-Angebote mit mindestens 3 Sternen und ≥50%
          HolidayCheck-Empfehlung – damit du sicher buchen kannst.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zu All-Inclusive</h2>
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
            { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
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
              <h2 className="text-2xl font-bold text-gray-900">
                Touren & Aktivitäten dazu buchen 🎟️
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Ergänze deinen All-Inclusive Urlaub mit unvergesslichen Erlebnissen.
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Aktivitäten auf <span className="text-sand-500">Kreta</span>
              </h3>
              <TiqetsCarousel cityId={kreta.tiqetsCityId} cityName={kreta.name} citySlug={kreta.slug} />
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
            <p className="text-xs font-bold text-[#00838F] mb-1">🍹 All-Inclusive</p>
            <p className="text-[11px] text-gray-500 mb-3 leading-snug">
              Alles inklusive – keine Zusatzkosten vor Ort
            </p>
            <Link href="/urlaubsarten/pauschalreisen/" className="inline-block bg-[#00838F] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#006d78] transition-colors">
              Jetzt buchen →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
              🔗 Urlaubsarten
            </p>
            <ul className="space-y-1.5">
              {[
                { href: "/urlaubsarten/pauschalreisen/", label: "Pauschalreisen" },
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
      <DestinationCarousel title="Top All-Inclusive-Reiseziele" accentColor="#1d4ed8" />

    </div>
  );
}
