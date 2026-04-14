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
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `💍 Hochzeitsreise ${YEAR} buchen – Flitterwochen-Hotels`,
  description: `Hochzeitsreise ${YEAR} günstig buchen ✓ Romantik-Hotels & Suiten ✓ Flitterwochen-Pakete ✓ Malediven, Mauritius & mehr ✓ Jetzt Traumreise planen.`,
  keywords: ["Hochzeitsreise buchen", "Flitterwochen", "Honeymoon Urlaub", "Romantikurlaub", "Hochzeitsreise günstig", "Flitterwochen Hotel", "Honeymoon Reise", "Romantik Pauschalreise"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/hochzeitsreise/",
  },
  openGraph: {
    title: `💍 Hochzeitsreise ${YEAR} – Flitterwochen buchen | Urlaubfinder365`,
    description: `Hochzeitsreise ${YEAR} günstig buchen ✓ Romantik-Hotels & Suiten ✓ Flitterwochen-Pakete ✓ Malediven, Mauritius & mehr ✓ Jetzt Traumreise planen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/hochzeitsreise/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: "Hochzeitsreise günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80&auto=format", teaser:"Kaum ein Ort der Welt lässt Herzen so höher schlagen wie Santorini und Mykonos: Die ikonischen weißgetünchten Caldera-Häuser, die in das tiefblaue Ägäische Meer hinabblicken, der legendäre Sonnenuntergang über Oia und die exklusiven Boutique-Hotels mit privatem Infinity-Pool machen die griechischen Inseln zur ersten Wahl für Flitterwochen. Hier beginnt das gemeinsame Leben mit einem Kapitel, das man sein Leben lang nicht vergisst.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100002&keywords=ado" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80&auto=format", teaser:"Mallorca & Formentera: romantische Buchten und exklusive Boutique-Hotels.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100000&keywords=ado" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format", teaser:"Phuket & Koh Samui: private Strandbungalows und romantische Sonnenuntergänge.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100220&keywords=ado" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format", teaser:"Jamaika & Kuba: Flitterwochen in All-Inclusive-Resorts nur für Erwachsene.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100017&keywords=ado" },
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format", teaser:"Dubai: unvergessliche Hochzeitsreise in den ikonischsten Hotels der Welt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=650&keywords=ado" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80&auto=format", teaser:"Bodrum & Çeşme: romantische Ägäis-Resorts mit Kerzenlicht-Dinner am Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=724&keywords=ado" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80&auto=format", teaser:"Kreta & Rhodos: romantische Hochzeitsnächte direkt am türkisblauen Mittelmeer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&countryId=GR&keywords=ado" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80&auto=format", teaser:"Algarve: exklusive Klippenhotels für einen romantischen Start zu zweit.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=725&keywords=ado" },
];

const FAQ = [
  {
    q: "Wann sollte man die Hochzeitsreise buchen?",
    a: "Für eine Hochzeitsreise in begehrte Destinationen (Malediven, Bali, Karibik) empfiehlt sich eine Buchung 9 bis 12 Monate im Voraus. Für Mittelmeer-Ziele sind 4 bis 6 Monate ausreichend. Bei Last-Minute-Buchungen sind oft noch gute 5-Sterne-Hotels verfügbar, jedoch mit weniger Auswahl. Wichtig: Das Hotel unbedingt über den Anlass informieren, damit Sonderdekorationen vorbereitet werden können.",
  },
  {
    q: "Welche Destinationen eignen sich am besten für Flitterwochen?",
    a: "Die Malediven gelten als das romantischste Urlaubsziel der Welt mit Bungalows über dem Wasser. Bali, Thailand (Koh Samui) und die Seychellen sind weitere Traumziele. Für Europäer mit kleinerem Budget sind die Malediven Europas – Griechenland (Santorini, Mykonos) und die Amalfiküste in Italien – wunderschöne Alternativen. Die Türkei und Ägypten bieten luxuriöse All-Inclusive Flitterwochen zu attraktiven Preisen.",
  },
  {
    q: "Was bieten spezielle Honeymoon-Pakete?",
    a: "Honeymoon-Pakete beinhalten meist ein dekoriertes Zimmer mit Blumenarrangement und Champagner, ein romantisches Candle-Light-Dinner, Late-Check-out sowie Spa-Gutscheine für gemeinsame Behandlungen. Manche Hotels bieten auch private Strandabende, Bootsausflüge oder individuelle Erlebnisse wie Unterwasseressen. Informieren Sie das Hotel vor der Anreise über Ihre Flitterwochen.",
  },
  {
    q: "Wie lange sollten Flitterwochen dauern?",
    a: "Klassische Flitterwochen dauern 10 bis 14 Tage. Diese Zeit ist ideal, um in einer fernöstlichen Destination (Malediven, Bali) die Zeitzone zu überwinden und wirklich abzuschalten. Für Nahziele wie Griechenland oder die Türkei sind auch 7 bis 10 Tage vollkommen ausreichend. Wichtiger als die Dauer ist die Qualität des Hotels und die Zweisamkeit, die man sich gönnt.",
  },
  {
    q: "Sollte man für die Hochzeitsreise All-Inclusive wählen?",
    a: "All-Inclusive hat bei Hochzeitsreisen viele Vorteile: keine Gedanken über Kosten, entspannter Genuss von Drinks und Gerichten wann immer man möchte, und mehr Qualitätszeit zu zweit. Allerdings verleiht Halbpension mehr Freiheit für Restaurantbesuche und lokale Kulinarik. Für Fernreisen in 5-Sterne-Resorts ist All-Inclusive oft die bessere Wahl, da Restaurantpreise vor Ort sehr hoch sein können.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellnessurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Hochzeitsreise",        item: "https://www.urlaubfinder365.de/urlaubsthemen/hochzeitsreise/" },
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
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&auto=format&fit=crop"
          alt="Hochzeitsreise – Romantische Flitterwochen"
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
            <span className="text-white/90">Hochzeitsreise</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-pink-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💒 Hochzeitsreise
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Hochzeitsreise &amp; Flitterwochen {YEAR} buchen<br />
            <span className="text-pink-200">Das schönste Erlebnis zu zweit</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Das schönste Erlebnis zu zweit: exklusive 5-Sterne-Resorts, romantische
            Sonnenuntergänge und unvergessliche Momente für Ihre Flitterwochen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["5-Sterne Resorts", "All-Inclusive Vollpension", "≥90% Empfehlungsrate", "Romantik-Extras"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-pink-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Honeymoon Urlaubsziele</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Die romantischsten Ziele für Ihre Hochzeitsreise – exklusive Resorts, unendliche Sonnenuntergänge und unvergessliche Momente zu zweit.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#db2777" carouselLabel="Weitere Hochzeitsreise Ziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Für die Hochzeitsreise empfehle ich Mauritius oder Santorini – beide Ziele schaffen diese besondere Mischung aus Abgeschiedenheit, romantischen Sonnenuntergängen und erstklassigem Service. Santorini im September ist dabei besonders unvergesslich."
          accentColor="#db2777"
          tip="Mein Tipp: Santorini September oder Mauritius"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&category=3&minRecommrate=80"
          deeplinkLabel="Susannes Hochzeitsreise-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-pink-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Hochzeitsreise Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Handverlesene 5-Sterne-Hotels für unvergessliche Flitterwochen — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="ado"
          boardCode="AI"
          from="14"
          to="365"
          duration="5-5"
          adults="2"
          category="5"
          minRecommrate="90"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Hochzeitsreise mit uns buchen?"
        accentColor="#db2777"
        items={[
          { emoji: "⭐", title: "5-Sterne Standard", desc: "Ausschließlich erstklassige Resorts mit höchstem Komfortstandard" },
              { emoji: "🍾", title: "All-Inclusive", desc: "Kulinarischer Genuss rund um die Uhr ohne Extrakosten" },
              { emoji: "🌹", title: "Romantik-Setup", desc: "Dekoriertes Zimmer, Blumen und Champagner bei Ankunft" },
              { emoji: "💍", title: "Honeymoon-Service", desc: "Persönlicher Concierge und exklusive Paarprogramme" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Hochzeitsreise – Die Reise Ihres Lebens</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die Hochzeitsreise ist für die meisten Paare die wichtigste Reise ihres
          Lebens. Nach dem aufregenden Hochzeitstag verdienen Frischvermählte eine
          Auszeit in Luxus und Romantik. Ob Strandresort auf den Malediven, Boutique-
          Hotel auf Santorini oder exklusives Spa-Resort in der Türkei – die perfekten
          Flitterwochen beginnen mit der richtigen Unterkunft. 5-Sterne-Hotels mit
          hoher Empfehlungsrate garantieren, dass Ihre Hochzeitsreise alle
          Erwartungen erfüllt und übertrifft.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Viele Luxusresorts bieten spezielle Honeymoon-Pakete an: ein festlich
          dekoriertes Zimmer mit Rosenblüten und Champagner, ein privates
          Candle-Light-Dinner am Strand, Spa-Behandlungen für zwei und persönlichen
          Concierge-Service. Es lohnt sich, das Hotel über Ihre Flitterwochen zu
          informieren – oft werden Paare mit kleinen Aufmerksamkeiten überrascht, die
          die Reise noch unvergesslicher machen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Hochzeitsreise-Angebote zeigen ausschließlich Hotels mit mindestens
          90 % HolidayCheck-Empfehlung und 5-Sterne-Standard. Denn für die wichtigste
          Reise Ihres Lebens sollte nur das Beste gut genug sein. Vergleichen Sie
          täglich aktualisierte Angebote und sichern Sie sich die Flitterwochen, von
          denen Sie schon immer geträumt haben.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#db2777" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Hochzeitsreise-Ziele"
        heading="Hochzeitsreise Reiseziele im Überblick"
        accentColor="#db2777"
        destinations={[
          { slug: "santorini", label: "Hochzeitsreise Santorini" },
          { slug: "mykonos", label: "Hochzeitsreise Mykonos" },
          { slug: "mallorca", label: "Hochzeitsreise Mallorca" },
          { slug: "dubai", label: "Hochzeitsreise Dubai" },
          { slug: "venedig", label: "Hochzeitsreise Venedig" },
          { slug: "paris", label: "Hochzeitsreise Paris" },
          { slug: "teneriffa", label: "Hochzeitsreise Teneriffa" },
          { slug: "phuket", label: "Hochzeitsreise Phuket" },
          { slug: "ibiza", label: "Hochzeitsreise Ibiza" },
          { slug: "marrakesch", label: "Hochzeitsreise Marrakesch" },
          { slug: "rom", label: "Hochzeitsreise Rom" },
          { slug: "dubrovnik", label: "Hochzeitsreise Dubrovnik" },
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

    <SeoTextBlocks pagePath="/urlaubsthemen/hochzeitsreise" />
    </div>
  );
}
