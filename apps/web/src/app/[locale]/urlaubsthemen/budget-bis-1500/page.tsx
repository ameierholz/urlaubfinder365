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

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `💎 Urlaub bis 1.500€ – Premium-Reisen ${YEAR}`,
  description: `Urlaub bis 1.500€ pro Person ${YEAR}: Premium-Pauschalreisen ✓ 4-5 Sterne Hotels ✓ All Inclusive ✓ Top-Urlaubsziele ✓ Jetzt Premium buchen.`,
  keywords: ["Urlaub bis 1500 Euro", "Premium Urlaub", "Gehobener Urlaub", "5 Sterne Urlaub", "Premium Pauschalreise", "Urlaub gehoben buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1500/",
  },
  openGraph: {
    title: `💎 Urlaub bis 1.500€ ${YEAR} – Premium-Reisen | Urlaubfinder365`,
    description: `Urlaub bis 1.500€ pro Person ${YEAR}: Premium-Pauschalreisen ✓ 4-5 Sterne Hotels ✓ All Inclusive ✓ Top-Urlaubsziele ✓ Jetzt Premium buchen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1500/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Budget-bis-1500 günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Die Karibik klingt nach unerreichbarem Luxus – doch mit einem Budget von bis zu 1.500 € pro Person sind traumhafte Pauschalreisen nach Mexiko, Jamaika oder Kuba durchaus realistisch. Weitläufige All-Inclusive-Resorts mit türkisblauem Meer, palmengesäumten Stränden und pulsierendem Nightlife warten auf Entdecker, die das Beste aus Fernreise und Budgetplanung herausholen möchten.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100017&maxPrice=1500" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Koh Samui: exzellente Resorts in Fernost bis 1.500 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100220&maxPrice=1500" },
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", teaser:"Dubai: Luxushotels und exzellenter Service bis 1.500 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=650&maxPrice=1500" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Mykonos & Santorini: ikonische Inselresorts für bis zu 1.500 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100002&maxPrice=1500" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Mallorca & Ibiza: 5-Sterne-Resorts mit Meerblick bis 1.500 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100000&maxPrice=1500" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: Golfresorts und Design-Hotels bis 1.500 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=725&maxPrice=1500" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: hochwertige Resorts mit ausgezeichneten Bewertungen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&countryId=GR&maxPrice=1500" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Belek & Bodrum: Luxus-Golfresorts und 5-Sterne-Anlagen bis 1.500 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=724&maxPrice=1500" },
];

const FAQ = [
  {
    q: "Was bietet das 1.500-€-Budget im Vergleich zu günstigeren Reisen?",
    a: "Mit 1.500 € pro Person reisen Sie deutlich komfortabler: 4-Sterne-Hotels mit hervorragenden Lagen, All-Inclusive-Pakete in etablierten Ferienresorts, Reisen in der Hochsaison zu beliebten Destinationen oder längere Aufenthalte von bis zu 10 Nächten. Auch erste Fernreisen nach Thailand oder Kapverden werden in diesem Budget realistisch, besonders in der Nebensaison.",
  },
  {
    q: "Welche Premium-Destinationen sind bis 1.500 € buchbar?",
    a: "Mallorca, Ibiza und Mykonos können im 1.500-€-Budget gut gebucht werden. In Griechenland (Santorini, Kos, Rhodos) sind 4-Sterne-Resorts in sehr guten Lagen verfügbar. Die Algarve und Madeira bieten hochwertige Hotels in diesem Segment. Für Fernreisen sind die Kapverdischen Inseln und Thailand (außerhalb der Hochsaison) erreichbar.",
  },
  {
    q: "Lohnen sich längere Reisedauern im 1.500-€-Budget?",
    a: "Ja, das 1.500-€-Budget ermöglicht auch Reisen von 10 bis 14 Nächten – besonders in günstigere Destinationen wie Türkei, Ägypten oder Bulgarien. Längere Reisen sind pro Nacht oft günstiger als kürzere Aufenthalte, da die Flugkosten auf mehr Tage verteilt werden. Besonders für Ruhe- und Erholungssuchende bieten 14-Nächte-Reisen den größten Mehrwert.",
  },
  {
    q: "Gibt es im 1.500-€-Budget auch Reisen mit Halbpension oder Vollpension?",
    a: "Ja, im 1.500-€-Budget sind neben All-Inclusive auch Halbpension und in einigen Fällen Vollpension verfügbar. Halbpension ermöglicht es, abends lokale Restaurants zu erkunden, während der Frühstücks- und Mittagsbereich durch das Hotel abgedeckt ist. In der Türkei und Ägypten ist All-Inclusive in diesem Budget-Bereich häufig das attraktivste Angebot.",
  },
  {
    q: "Welche Reisezeit ist für Premium-Budget-Reisen am besten?",
    a: "Das 1.500-€-Budget bietet in der Vor-Saison (Mai/Juni) und Nach-Saison (September/Oktober) besonders attraktive Premium-Angebote. In dieser Zeit sind hochwertige Resorts zu günstigen Preisen verfügbar, das Wetter ist noch warm und die Strände weniger überfüllt. Für Hauptsaison-Reisen (Juli/August) nach Mallorca oder Griechenland ist das Budget gut kalkuliert.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/budget-bis-1000/", label: "💰 Budget bis 1.000 €" },
  { href: "/urlaubsthemen/budget-bis-2000/", label: "✨ Budget bis 2.000 €" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Budget bis 1.500 €",        item: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-1500/" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <div
        className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&q=80"
          alt="Günstiger Urlaub bis 1.500 € buchen"
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
            <span className="text-white/90">Budget bis 1.500 €</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-amber-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💳 Budget bis 1.500 €
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Urlaub bis 1.500 € günstig buchen {YEAR}<br />
            <span className="text-amber-200">Ausgezeichnete Hotels mit Bestpreisgarantie</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Mehr Komfort, mehr Auswahl, mehr Destinationen: Pauschalreisen bis
            1.500 € pro Person öffnen die Tür zu 4-Sterne-Hotels und
            Premium-Reiseerlebnissen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Max. 1.500 € pro Person", "Flug & Hotel inklusive", "4 Sterne & mehr", "Hohe Empfehlungsrate"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Premiumurlaub bis 1.500 € pro Person</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">4- und 5-Sterne-Komfort weltweit – hervorragende Hotels mit Top-Bewertungen bis 1.500 € pro Person inklusive Flug.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#4f46e5" carouselLabel="Weitere Günstige Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.manuel}
          quote="Mit 1500 Euro eröffnen sich wirklich schöne Optionen – Kreta im Mai oder Oktober ist eines der besten Preis-Leistungs-Verhältnisse Europas: traumhafte Landschaft, authentisches Essen, zuverlässiges Wetter und 4-Sterne-Qualität."
          accentColor="#4f46e5"
          tip="Mein Tipp: Kreta Oktober, 4-Sterne Hotel"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=46"
          deeplinkLabel="Manuels Budget-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Premium Reisen bis 1.500 €
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Premium-Pauschalreisen bis 1.500 € — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          maxPrice="1500"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Urlaub bis 1.500 €?"
        accentColor="#4f46e5"
        items={[
          { emoji: "💶", title: "Max. 1.500 € p.P.", desc: "Premium Pauschalreise mit Flug und erstklassigem Hotel" },
              { emoji: "✈️", title: "Flug inklusive", desc: "Komfortabler Hin- und Rückflug bereits im Preis enthalten" },
              { emoji: "🌟", title: "4-Sterne Hotels", desc: "Hochwertige Unterkunft mit gehobener Ausstattung und Spa" },
              { emoji: "💆", title: "Spa & Wellness möglich", desc: "In diesem Budget sind bereits echte Wellnesshotels buchbar" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Pauschalreisen bis 1.500 € – Premium-Urlaub zum fairen Preis</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Das Budget von 1.500 € pro Person markiert den Übergang vom einfachen
          Strandurlaub zum echten Premium-Reiseerlebnis. In diesem Preissegment
          öffnen sich die Türen zu 4-Sterne-Hotels mit exklusiver Strandlage, zu
          All-Inclusive-Resorts mit umfangreichem Freizeitprogramm und zu begehrten
          Destinationen wie Ibiza, Mykonos oder Madeira. Auch Reisedauern von 10 bis
          14 Tagen sind in günstigen Regionen sehr gut realisierbar.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Besonders attraktiv ist das 1.500-€-Budget für Reisen nach Mallorca und
          auf die griechischen Inseln: Hier finden Sie im Frühjahr und Herbst
          hervorragende Hotels zu attraktiven Preisen, die im Hochsommer deutlich
          teurer wären. Die türkische Riviera bietet in diesem Budget häufig
          5-Sterne-Qualität mit All-Inclusive, was es zur kosteneffizientesten Option
          für gehobene Ansprüche macht.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Angebote bis 1.500 € werden täglich nach Preis, Qualität und
          Empfehlungsrate aktualisiert. Ob kurze Auszeit oder ausgedehnter
          Familienurlaub – in diesem Preissegment finden Sie täglich neue attraktive
          Premium-Pauschalreisen.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#4f46e5" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Reiseziele unter 1.500 €"
        heading="Mittelklasse-Reiseziele im Überblick"
        accentColor="#4f46e5"
        destinations={[
          { slug: "mallorca", label: "Mallorca unter 1.500 €" },
          { slug: "ibiza", label: "Ibiza unter 1.500 €" },
          { slug: "dubai", label: "Dubai unter 1.500 €" },
          { slug: "barcelona", label: "Barcelona unter 1.500 €" },
          { slug: "rom", label: "Rom unter 1.500 €" },
          { slug: "santorini", label: "Santorini unter 1.500 €" },
          { slug: "mykonos", label: "Mykonos unter 1.500 €" },
          { slug: "venedig", label: "Venedig unter 1.500 €" },
          { slug: "lissabon", label: "Lissabon unter 1.500 €" },
          { slug: "dubrovnik", label: "Dubrovnik unter 1.500 €" },
          { slug: "split", label: "Split unter 1.500 €" },
          { slug: "ayia-napa", label: "Ayia Napa unter 1.500 €" },
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
