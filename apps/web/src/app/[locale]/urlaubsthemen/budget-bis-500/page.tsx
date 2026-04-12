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
  title: `💶 Urlaub bis 500€ – günstige Pauschalreisen ${YEAR}`,
  description: `Urlaub bis 500€ pro Person ${YEAR}: Günstige Pauschalreisen mit Flug & Hotel ✓ Türkei, Griechenland & Ägypten ✓ Jetzt Schnäppchen buchen.`,
  keywords: ["Urlaub bis 500 Euro", "Günstiger Urlaub", "Billiger Urlaub", "Pauschalreise günstig", "Urlaub unter 500", "Budget Urlaub", "Urlaub Schnäppchen", "Billig verreisen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-500/",
  },
  openGraph: {
    title: `💶 Urlaub bis 500€ ${YEAR} – Schnäppchen | Urlaubfinder365`,
    description: `Urlaub bis 500€ pro Person ${YEAR}: Günstige Pauschalreisen mit Flug & Hotel ✓ Türkei, Griechenland & Ägypten ✓ Jetzt Schnäppchen buchen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-500/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: "Budget-bis-500 günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80&auto=format", teaser:"Wer glaubt, für unter 500 € gebe es keinen richtigen Urlaub, wird von der Türkei eines Besseren belehrt: Antalya, Side und Alanya bieten All-Inclusive-Pakete mit Flug und komfortablem Strandhotel, die regelmäßig weit unter dieser Marke buchbar sind. Das Erfolgsrezept liegt in der dichten Hotelindustrie, günstigen Direktflügen und einem extrem wettbewerbsintensiven Markt – Sonnenurlaub ohne Kompromisse zum Schnäppchenpreis.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&regionId=724&maxPrice=500" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80&auto=format", teaser:"Mallorca Last-Minute-Deals: spontane Reisen unter 500 € pro Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=3&to=30&duration=5-7&adults=2&category=3&minRecommrate=60&regionId=100000&maxPrice=500" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80&auto=format", teaser:"Kreta & Rhodos: günstige Pauschalreisen nach Griechenland unter 500 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&countryId=GR&maxPrice=500" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format", teaser:"Hurghada: eines der günstigsten Urlaubsziele überhaupt, All-Inclusive ab 350 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=651&maxPrice=500" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&auto=format", teaser:"Gran Canaria & Teneriffa: preiswerte Pauschalreisen bei bestem Wetter.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&regionId=851&maxPrice=500" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80&auto=format", teaser:"Kos & Korfu: günstige Flug-Hotel-Pakete auf den schönen griechischen Inseln.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&regionId=100002&maxPrice=500" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80&auto=format", teaser:"Algarve: sonnige Urlaubswochen an Europas günstigster Atlantikküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&regionId=725&maxPrice=500" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80&auto=format", teaser:"Sizilien & Sardinien: günstige Urlaubsangebote auf Italiens Inseln.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=90&duration=5-7&adults=2&category=3&minRecommrate=60&countryId=IT&maxPrice=500" },
];

const FAQ = [
  {
    q: "Was bekomme ich für einen Urlaub bis 500 € pro Person?",
    a: "Für bis zu 500 € pro Person erhalten Sie eine komplette Pauschalreise inklusive Hin- und Rückflug sowie Hotelunterkunft für 7 Nächte. Je nach Destination und Reisezeit sind 3- bis 4-Sterne-Hotels möglich. Besonders günstig sind Reisen nach Ägypten, Türkei und Bulgarien. In der Nebensaison können auch Ziele wie Mallorca oder Griechenland im Budget liegen.",
  },
  {
    q: "Welche Destinationen sind günstig und trotzdem schön?",
    a: "Ägypten (Hurghada, Sharm el-Sheikh) bietet hervorragende Preis-Leistung mit traumhaften Tauchspots. Die Türkei (Antalya, Side) ist für erschwingliche All-Inclusive-Urlaube bekannt. Bulgarien (Sonnenstrand) ist Europas günstigstes Badeziel. Tunesien bietet großartige Strände zu sehr günstigen Preisen. Mit etwas Flexibilität beim Datum sind auch Mallorca und Kreta im Budget-Bereich buchbar.",
  },
  {
    q: "Wann sind Pauschalreisen bis 500 € am häufigsten verfügbar?",
    a: "Günstige Pauschalreisen unter 500 € sind besonders in der Nebensaison (April/Mai und Oktober/November) häufig. Auch Last-Minute-Angebote 1 bis 4 Wochen vor Abreise fallen oft in diesen Preisbereich. Frühbucherangebote für Herbst-Reisen können ebenfalls sehr günstig sein. Unter-500-€-Angebote im Hauptsommer (Juli/August) sind seltener, aber nicht unmöglich bei flexiblem Reisedatum.",
  },
  {
    q: "Gibt es einen Haken bei sehr günstigen Pauschalreisen?",
    a: "Nicht zwangsläufig. Günstige Preise entstehen durch Frühbucherrabatte, Auslastungsmanagement und saisonale Schwankungen. Es empfiehlt sich jedoch, Bewertungen zu prüfen: Ein 3-Sterne-Hotel mit 80 % HolidayCheck-Empfehlung kann einen angenehmeren Urlaub bieten als ein nicht bewertetes 4-Sterne-Hotel. Lesen Sie immer aktuelle Gästebewertungen, bevor Sie buchen.",
  },
  {
    q: "Sind Extras wie Transfers oder Gepäck im Preis enthalten?",
    a: "Das hängt vom Angebot ab. Bei klassischen Pauschalreisen ist der Transfer vom Flughafen zum Hotel oft inklusive. Gepäck ist bei den meisten Pauschalreisen mit einem Koffer (je nach Airline 15 bis 23 kg) enthalten. Prüfen Sie die genauen Leistungen im Angebot. Zusätzliche Extras wie Mietwagen oder Ausflüge sind in der Regel nicht im Pauschalpreis enthalten.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/budget-bis-1000/", label: "💰 Budget bis 1.000 €" },
  { href: "/urlaubsthemen/budget-bis-1500/", label: "💳 Budget bis 1.500 €" },
  { href: "/urlaubsarten/last-minute-urlaub/", label: "⚡ Last Minute Urlaub" },
  { href: "/urlaubsarten/super-last-minute-urlaub/", label: "🔥 Super Last Minute" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Budget bis 500 €",        item: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-500/" },
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
          src="https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80&auto=format"
          alt="Günstiger Urlaub bis 500 € buchen"
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
            <span className="text-white/90">Budget bis 500 €</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-green-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💸 Budget bis 500 €
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Urlaub bis 500 € günstig buchen {YEAR}<br />
            <span className="text-green-200">Pauschalreisen zum Schnäppchenpreis</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Traumurlaub muss nicht teuer sein: Pauschalreisen unter 500 € pro Person
            mit Flug und Hotel – täglich neue Angebote zu echten Schnäppchenpreisen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Max. 500 € pro Person", "Flug & Hotel inklusive", "Geprüfte Hotels", "Täglich neue Deals"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-green-700 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Günstige Urlaubsziele unter 500 €</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Traumurlaub ohne großes Budget – diese Regionen bieten das beste Preis-Leistungs-Verhältnis für unter 500 € pro Person.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#15803d" carouselLabel="Weitere Günstige Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="Günstiger Urlaub bedeutet nicht schlechter Urlaub – das beweisen Türkei und Ägypten. Für unter 500 Euro gibt es im Herbst tolle All-Inclusive-Pakete. Hurghada ist besonders gut: flaches Meer, kinderfreundliche Resorts und das Rote Meer ist spektakulär."
          accentColor="#15803d"
          tip="Mein Tipp: Hurghada Herbst, All Inclusive unter 500 €"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=651"
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
            <p className="text-green-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Pauschalreisen bis 500 €
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Pauschalreisen bis maximal 500 € pro Person — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          maxPrice="500"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Urlaub bis 500 €?"
        accentColor="#15803d"
        items={[
          { emoji: "💶", title: "Max. 500 € p.P.", desc: "Komplette Pauschalreise inklusive Flug und Hotel zum Sparpreis" },
              { emoji: "✈️", title: "Flug inklusive", desc: "Hin- und Rückflug bereits im Preis enthalten" },
              { emoji: "🏨", title: "Hotel inklusive", desc: "Übernachtungen in geprüften Hotels mit guter Bewertung" },
              { emoji: "✅", title: "HolidayCheck geprüft", desc: "Nur Hotels mit positiven Gästebewertungen werden angezeigt" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Günstige Pauschalreisen bis 500 € – So sparen Sie clever</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Wer meint, für einen vollwertigen Strandurlaub mit Flug und Hotel tief in
          die Tasche greifen zu müssen, irrt sich. Täglich entstehen günstige
          Pauschalreise-Angebote unter 500 € pro Person – entstanden durch
          Frühbucherrabatte, Kapazitätsmanagement der Veranstalter und saisonale
          Preisschwankungen. Ägypten, die Türkei und Bulgarien sind besonders häufig
          in diesem Preissegment vertreten und bieten dabei erstaunlich gute
          Hotelqualität und herrliche Strandabschnitte.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Der Schlüssel zum günstigen Urlaub ist Flexibilität: Wer beim Reisedatum
          ein paar Tage verschieben kann und nicht zwingend auf Hochsaison besteht,
          findet regelmäßig echte Schnäppchen. Auch Reisen in die Nebensaison (Mai,
          Oktober) bieten oft sehr günstigen Urlaub bei noch angenehmen Temperaturen.
          Last-Minute-Angebote in der 1- bis 4-Wochen-Frist vor Abreise fallen
          ebenfalls häufig unter 500 € pro Person.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Budget-Angebote bis 500 € werden täglich aktualisiert und zeigen
          ausschließlich Pauschalreisen mit geprüfter Qualität. Wir filtern nach
          Empfehlungsrate und Preisobergrenze, damit Sie das beste Angebot in Ihrem
          Budget finden.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#15803d" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Reiseziele unter 500 €"
        heading="Günstige Reiseziele im Überblick"
        accentColor="#15803d"
        destinations={[
          { slug: "antalya", label: "Antalya unter 500 €" },
          { slug: "side", label: "Side unter 500 €" },
          { slug: "alanya", label: "Alanya unter 500 €" },
          { slug: "hurghada", label: "Hurghada unter 500 €" },
          { slug: "marmaris", label: "Marmaris unter 500 €" },
          { slug: "sharm-el-sheikh", label: "Sharm el-Sheikh unter 500 €" },
          { slug: "sonnenstrand", label: "Sonnenstrand unter 500 €" },
          { slug: "djerba", label: "Djerba unter 500 €" },
          { slug: "agadir", label: "Agadir unter 500 €" },
          { slug: "rhodos", label: "Rhodos unter 500 €" },
          { slug: "kreta", label: "Kreta unter 500 €" },
          { slug: "marrakesch", label: "Marrakesch unter 500 €" },
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
