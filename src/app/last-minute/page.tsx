import type { Metadata } from "next";
import Link from "next/link";
import { fetchOffers } from "@/lib/travel-api";
import { destinations } from "@/lib/destinations";
import OffersGrid from "@/components/offers/OffersGrid";

export const metadata: Metadata = {
  title: "Last-Minute Urlaub 2026 – bis zu 60% günstiger",
  description:
    "Last-Minute Urlaub günstig buchen ✓ Täglich aktualisiert ✓ Bis zu 60% sparen ✓ Türkei, Mallorca, Ägypten & Griechenland – spontan verreisen zum Bestpreis!",
  alternates: {
    canonical: "https://www.urlaubfinder365.de/last-minute/",
  },
  openGraph: {
    title: "Last-Minute Urlaub 2026 – Kurzfristige Angebote günstig buchen",
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

// JSON-LD Structured Data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie viel spare ich mit Last-Minute Urlaub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mit Last-Minute Reisen sind Ersparnisse von 20–60% gegenüber dem Normalpreis möglich. Je näher der Abflugtermin, desto höher der Rabatt, da Veranstalter freie Kapazitäten füllen wollen.",
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
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Last-Minute Urlaub", item: "https://www.urlaubfinder365.de/last-minute/" },
  ],
};

export const revalidate = 1800;

export default async function LastMinutePage() {
  const antalya = destinations.find((d) => d.slug === "antalya")!;
  const offers = await fetchOffers({ regionIds: antalya.regionIds, duration: "3-5", limit: 6 }).catch(() => []);

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen">
        {/* Hero */}
        <div
          className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[340px]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(180,83,9,0.82) 0%, rgba(220,38,38,0.58) 50%, rgba(15,23,42,0.78) 100%)" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {/* Breadcrumb */}
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

        {/* Angebote */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aktuelle Last-Minute Angebote</h2>
          <p className="text-gray-500 mb-6">Heute verfügbare Reisen – täglich aktualisiert, direkt buchbar.</p>
          <OffersGrid offers={offers} />
        </div>

        {/* Info-Sektion */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Text */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Was sind Last-Minute Reisen?
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Last-Minute Reisen sind kurzfristig verfügbare Pauschalreisen, die Reiseveranstalter
                  zu deutlich reduzierten Preisen anbieten – oft <strong>20 bis 60 % günstiger</strong> als
                  der Normalpreis. Der Grund: Flugzeuge, Hotels und Kreuzfahrtschiffe sollen voll
                  ausgelastet sein. Wer also flexibel ist und spontan buchen kann, profitiert enorm.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Auf Urlaubfinder365 aggregieren wir täglich frische Last-Minute Deals von führenden
                  deutschen Reiseveranstaltern. Klicke einfach auf ein Angebot, wähle dein Wunschdatum
                  und buche direkt beim Anbieter – ohne Umwege, ohne versteckte Gebühren.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Besonders beliebt: <strong>Türkei (Antalya, Side)</strong>, <strong>Mallorca</strong>,
                  <strong>Kreta</strong> und <strong>Ägypten (Hurghada)</strong>. All-Inclusive Angebote
                  sind besonders empfehlenswert, da Verpflegungskosten bereits inklusive sind.
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

              {/* Vorteile */}
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
                    Aktiviere unsere Preisalarme im Dashboard für sofortige Benachrichtigungen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ-Sektion */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Häufige Fragen zu Last-Minute Urlaub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqSchema.mainEntity.map((item) => (
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
