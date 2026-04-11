import type { Metadata } from "next";
import Link from "next/link";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import ThemeSidebar from "@/components/ui/ThemeSidebar";
import DestinationGrid, { DestinationCard } from "@/components/offers/DestinationGrid";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import ExpertBanner from "@/components/ui/ExpertBanner";
import ThemeDestinationLinks from "@/components/ui/ThemeDestinationLinks";
import { EXPERTS } from "@/lib/experts";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import ThemeFeatureGrid from "@/components/ui/ThemeFeatureGrid";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `💶 Urlaub bis 1.000€ – Pauschalreisen ${YEAR}`,
  description: `Urlaub bis 1.000€ pro Person ${YEAR}: Hochwertige Pauschalreisen ✓ 4-Sterne Hotels ✓ All Inclusive möglich ✓ Jetzt Top-Deals sichern.`,
  keywords: ["Urlaub bis 1000 Euro", "Pauschalreise 1000 Euro", "Mittelklasse Urlaub", "4 Sterne Urlaub günstig", "All Inclusive günstig", "Urlaub gutes Preis-Leistungs-Verhältnis"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1000/",
  },
  openGraph: {
    title: `💶 Urlaub bis 1.000€ ${YEAR} – Top-Deals | Urlaubfinder365`,
    description: `Urlaub bis 1.000€ pro Person ${YEAR}: Hochwertige Pauschalreisen ✓ 4-Sterne Hotels ✓ All Inclusive möglich ✓ Jetzt Top-Deals sichern.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1000/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Budget-bis-1000 günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die Türkei gehört zu den besten Budget-Urlaubszielen der Welt: In Antalya und Belek bekommt man für unter 1.000 € pro Person eine Woche in einem 4- oder 5-Sterne-All-Inclusive-Resort mit uneingeschränktem Zugang zu Pools, Stränden und Buffets. Dank des starken Wettbewerbs und günstiger Wechselkurse sind Preise, die anderswo undenkbar wären, hier regelmäßig buchbar – ohne Abstriche beim Komfort.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=724&maxPrice=1000" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Mallorca & Ibiza: komfortable Pauschalreisen bis 1.000 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100000&maxPrice=1000" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: Top-Hotels mit ausgezeichneten Bewertungen bis 1.000 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&countryId=GR&maxPrice=1000" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada & Sharm el-Sheikh: 5-Sterne-Luxus am Roten Meer für unter 1.000 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=651&maxPrice=1000" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Teneriffa & Fuerteventura: hochwertige Hotels bis 1.000 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=851&maxPrice=1000" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: anspruchsvolle Unterkünfte an der schönen Atlantikküste bis 1.000 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=725&maxPrice=1000" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Mykonos, Kos & Korfu: komfortabler Inselurlaub bis 1.000 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100002&maxPrice=1000" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Kuba & Mexiko: traumhafte Karibikurlaube bis 1.000 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100017&maxPrice=1000" },
];

const FAQ = [
  {
    q: "Was bekomme ich für ein Urlaubsbudget von 1.000 € pro Person?",
    a: "Mit einem Budget von 1.000 € pro Person stehen Ihnen deutlich mehr Optionen offen als im 500-€-Bereich. Sie können gut bewertete 4-Sterne-Hotels, attraktivere Destinationen in der Hochsaison und komfortablere Verpflegungsoptionen (z.B. All-Inclusive) wählen. Urlaubsziele wie Mallorca, Kreta, Rhodos und Sardinien sind in diesem Budget-Bereich häufig gut buchbar.",
  },
  {
    q: "Welche Destinationen bieten das beste Preis-Leistungs-Verhältnis bis 1.000 €?",
    a: "Die Türkei bietet im 1.000-€-Budget exzellente All-Inclusive-Pakete in 4-Sterne-Hotels. Ägypten ermöglicht sogar Luxus-5-Sterne-Aufenthalte. Mallorca, Kreta und Rhodos bieten eine breite Auswahl an 4-Sterne-Hotels in schönen Lagen. Für Fernreisen sind Thailand und Kapverdische Inseln in diesem Budget gelegentlich in der Nebensaison erreichbar.",
  },
  {
    q: "Lohnt sich All-Inclusive im 1.000-€-Budget?",
    a: "Ja, All-Inclusive ist im 1.000-€-Budget besonders attraktiv. In der Türkei und in Ägypten bekommt man für dieses Budget hochwertige All-Inclusive-Angebote in guten Hotels. All-Inclusive eliminiert Zusatzkosten für Essen und Trinken, sodass das Gesamtbudget für den Urlaub leichter kalkulierbar ist – ideal für Familien und Paare.",
  },
  {
    q: "Kann ich im Sommer für unter 1.000 € nach Mallorca reisen?",
    a: "Ja, im 1.000-€-Budget sind Sommerbuchungen nach Mallorca durchaus möglich, besonders mit etwas Vorlauf oder bei Last-Minute-Angeboten. Im Juli und August wird die Auswahl etwas eingeschränkter, aber 3- bis 4-Sterne-Hotels in guten Lagen sind regelmäßig buchbar. Die Nebensaison (Mai, Juni, September, Oktober) bietet in diesem Budget noch deutlich mehr Auswahl.",
  },
  {
    q: "Wie unterscheidet sich das 1.000-€-Budget vom 500-€-Budget bei der Hotelqualität?",
    a: "Mit 1.000 € statt 500 € pro Person können Sie typischerweise ein Upgrade von 3 auf 4 Sterne genießen, eine deutlich bessere Strandlage wählen, eine attraktivere Verpflegung (von Frühstück auf Halbpension oder All-Inclusive) buchen oder in der Hauptsaison statt nur Nebensaison reisen. Das erhöhte Budget eröffnet deutlich mehr Qualität und Komfort.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/budget-bis-500/", label: "💸 Budget bis 500 €" },
  { href: "/urlaubsthemen/budget-bis-1500/", label: "💳 Budget bis 1.500 €" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/familienurlaub/", label: "👨‍👩‍👧‍👦 Familienurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Budget bis 1.000 €",        item: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1000/" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* HERO */}
      <div
        className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
          alt="Günstiger Urlaub bis 1.000 € buchen"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/urlaubsthemen/" className="hover:text-white">Urlaubsthemen</Link>
            <span>/</span>
            <span className="text-white/90">Budget bis 1.000 €</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-sky-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💰 Budget bis 1.000 €
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Urlaub bis 1.000 € günstig buchen {YEAR}<br />
            <span className="text-sky-200">Traumurlaub für jedes Budget</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Pauschalreisen bis 1.000 € pro Person – mit Flug, Hotel und mehr
            Auswahlmöglichkeiten: 4-Sterne-Hotels, All-Inclusive und Top-Destinationen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Max. 1.000 € pro Person", "Flug & Hotel inklusive", "3-4 Sterne Hotels", "Täglich neue Deals"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Top-Urlaub bis 1.000 € pro Person</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Mehr Komfort und Auswahl für bis zu 1.000 € – diese Destinationen bieten ausgezeichnete Hotels zu fairem Preis.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#059669" carouselLabel="Weitere Günstige Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="Bis 1000 Euro sind tolle Urlaubserlebnisse absolut realistisch. Die Türkei bietet das beste Preis-Leistungs-Verhältnis: Antalya mit riesigen Poolanlagen und Full-Board. Im September ist das Wetter perfekt und die Preise sinken nochmal deutlich."
          accentColor="#059669"
          tip="Mein Tipp: Antalya September, Full Board"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=724"
          deeplinkLabel="Julias Budget-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sky-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Pauschalreisen bis 1.000 €
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Pauschalreisen bis maximal 1.000 € pro Person — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          maxPrice="1000"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Urlaub bis 1.000 €?"
        accentColor="#059669"
        items={[
          { emoji: "💶", title: "Max. 1.000 € p.P.", desc: "Komplette Pauschalreise inklusive Flug und Hotel" },
              { emoji: "✈️", title: "Flug inklusive", desc: "Hin- und Rückflug bereits im Preis enthalten" },
              { emoji: "🏨", title: "3–4 Sterne Hotels", desc: "Komforthotels mit guten Bewertungen und toller Lage" },
              { emoji: "🔥", title: "Täglich neue Deals", desc: "Jeden Tag frische Angebote – schnell sein lohnt sich" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Pauschalreisen bis 1.000 € – Mehr Qualität für Ihr Urlaubsbudget</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Mit einem Urlaubsbudget von bis zu 1.000 € pro Person öffnet sich eine
          erheblich größere Auswahl an Destinationen, Hotelkategorien und
          Reisezeiten. Während im 500-€-Segment hauptsächlich günstige Destinationen
          in der Nebensaison verfügbar sind, ermöglicht das 1.000-€-Budget auch
          Hauptsaison-Buchungen auf Mallorca, Kreta, Rhodos und an der Algarve.
          4-Sterne-Hotels mit All-Inclusive sind in diesem Preissegment besonders
          attraktiv und bieten exzellentes Preis-Leistungs-Verhältnis.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Besonders lukrativ ist das 1.000-€-Budget in der Türkei: Hier bekommt man
          für diesen Preis oft 5-Sterne-Hotels mit All-Inclusive in hervorragenden
          Lagen. Ägypten bietet ebenfalls herausragende Qualität in diesem Segment.
          Für anspruchsvollere Reisende eröffnet das Budget auch Gelegenheiten für
          Paarreisen mit Wellnessangeboten oder familiengerechte Hotels mit
          Wasserpark und Kinderclub.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Pauschalreisen bis 1.000 € werden täglich nach aktuellen Preisen
          und Empfehlungsraten gefiltert. Das Angebot wechselt täglich – setzen Sie
          daher regelmäßige Checks durch, um die besten Angebote nicht zu verpassen.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#059669" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Reiseziele unter 1.000 €"
        heading="Preiswerte Reiseziele im Überblick"
        accentColor="#059669"
        destinations={[
          { slug: "mallorca", label: "Mallorca unter 1.000 €" },
          { slug: "antalya", label: "Antalya unter 1.000 €" },
          { slug: "side", label: "Side unter 1.000 €" },
          { slug: "hurghada", label: "Hurghada unter 1.000 €" },
          { slug: "kreta", label: "Kreta unter 1.000 €" },
          { slug: "rhodos", label: "Rhodos unter 1.000 €" },
          { slug: "gran-canaria", label: "Gran Canaria unter 1.000 €" },
          { slug: "teneriffa", label: "Teneriffa unter 1.000 €" },
          { slug: "fuerteventura", label: "Fuerteventura unter 1.000 €" },
          { slug: "korfu", label: "Korfu unter 1.000 €" },
          { slug: "kos", label: "Kos unter 1.000 €" },
          { slug: "marrakesch", label: "Marrakesch unter 1.000 €" },
        ]}
      />

      {/* INTERNAL LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Weitere Urlaubsthemen</p>
        <div className="flex flex-wrap gap-2">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-[#00838F] hover:bg-[#00838F]/5 text-gray-700 hover:text-[#00838F] text-sm font-medium px-4 py-2 rounded-full transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>

        </div>
        <ThemeSidebar />
      </div>

      {/* Beliebte Urlaubsziele */}
      <DestinationCarousel title="Beliebte Urlaubsziele direkt buchen" />

    </div>
  );
}
