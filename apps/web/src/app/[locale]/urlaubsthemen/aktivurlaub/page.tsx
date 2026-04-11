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
  title: `🧗 Aktivurlaub ${YEAR} günstig buchen – Sport & Abenteuer`,
  description: `Aktivurlaub ${YEAR} günstig buchen ✓ Wandern, Radfahren, Wassersport ✓ Sportreisen & Outdoor ✓ Abenteuer weltweit ✓ Jetzt vergleichen.`,
  keywords: ["Aktivurlaub günstig", "Aktivurlaub buchen", "Sportreise", "Wanderurlaub", "Radurlaub", "Wassersport Urlaub", "Outdoor Urlaub", "Abenteuerurlaub buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/aktivurlaub/",
  },
  openGraph: {
    title: `🧗 Aktivurlaub ${YEAR} – Sport & Abenteuer | Urlaubfinder365`,
    description: `Aktivurlaub ${YEAR} günstig buchen ✓ Wandern, Radfahren, Wassersport ✓ Sportreisen & Outdoor ✓ Abenteuer weltweit ✓ Jetzt vergleichen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/aktivurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Aktivurlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die türkische Riviera rund um Antalya ist ein Aktivurlaub-Paradies für Sportbegeisterte: Entlang der Lykischen Küste lassen sich antike Ruinen zu Fuß oder per Rad erkunden, während moderne Resorts mit Tennisanlagen, Tauchschulen und Wassersportcentern aufwarten. Wer morgens wandert, mittags surft und abends in einem komfortablen All-Inclusive-Hotel entspannt, findet hier das perfekte Gleichgewicht zwischen Sport und Erholung.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Mallorca: Radsport-Paradies, Wanderwege und Wassersportmöglichkeiten.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100000" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta: Wandern durch die Samaria-Schlucht und Segeln zwischen den Inseln.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&countryId=GR" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Teneriffa & La Palma: Vulkanwanderungen und Surfkurse mit Weltklasse-Wellen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=851" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: Surfen, Golfen und Klettern – aktiver Urlaub an Europas Atlantikküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=725" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket: Muay Thai Training, Tauchen, Kayaking und Dschungeltouren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100220" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada: Windsurfen, Kitesurfen und Tauchen am Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=651" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Kos & Rhodos: Radfahren, Segeln und Windsurfen auf den Ägäischen Inseln.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100002" },
];

const FAQ = [
  {
    q: "Was ist der Unterschied zwischen Aktivurlaub und Abenteuerurlaub?",
    a: "Aktivurlaub umfasst sportliche und körperliche Aktivitäten wie Golf, Tauchen, Radfahren oder Wandern als Teil eines komfortablen Urlaubspakets mit Hotel. Abenteuerurlaub geht oft einen Schritt weiter und beinhaltet intensivere, risikoreichere Aktivitäten wie Klettern, Trekking oder Kanufahren in wilden Regionen. Aktivurlaub ist für alle Fitnessniveaus geeignet, Abenteuerurlaub erfordert oft mehr körperliche Vorbereitung.",
  },
  {
    q: "Welche Sportarten sind im Aktivurlaub am Mittelmeer besonders beliebt?",
    a: "Golf ist in Spanien, Portugal und der Türkei extrem beliebt – alle drei Länder haben weltklasse Golfplätze. Tauchen und Schnorcheln eignen sich besonders in Ägypten (Rotes Meer), Kroatien und der Türkei. Surfen und Windsurfen sind auf Fuerteventura und Lanzarote ideal. Wandern bietet Madeira, die Alpujarra in Spanien und die kretischen Schluchten. Radfahren ist auf Mallorca besonders verbreitet.",
  },
  {
    q: "Brauche ich Vorkenntnisse für Aktivurlaub?",
    a: "Nein, die meisten Aktivhotels bieten Kurse für alle Niveaus an – von Absolut-Anfängern bis Fortgeschrittenen. Tauchkurse starten mit dem Open Water Diver und sind innerhalb weniger Tage abschließbar. Surfen lernt man mit einem guten Kurs im Urlaubstempo. Golf-Anfängerkurse sind auf allen Anlagen verfügbar. Fragen Sie vor der Buchung nach dem Sportprogramm und den verfügbaren Kursniveaus.",
  },
  {
    q: "Wann ist die beste Zeit für Aktivurlaub?",
    a: "Das hängt stark von der Destination und Aktivität ab. Golf und Wandern sind im Frühling (März bis Mai) und Herbst (September bis November) ideal, wenn die Temperaturen nicht zu heiß sind. Wassersport und Surfen sind im Sommer am besten. Wintersurfen auf den Kanaren ist dank ganzjährig milder Temperaturen möglich. Radfahren auf Mallorca ist im Frühjahr (April/Mai) am beliebtesten bei Profiradrennfahrern.",
  },
  {
    q: "Sind Aktivurlaube teurer als normale Pauschalreisen?",
    a: "Aktivhotels mit Sportinfrastruktur (Golfplatz, Tauchschule) können etwas teurer sein als reine Strandhotels. Allerdings sparen Sie die Kosten für externe Kurse und Ausrüstungsverleih. Viele All-Inclusive-Hotels inkludieren grundlegende Wassersportmöglichkeiten wie Schnorcheln, Kanus und Tretboote. Separate Tauchkurse oder Golfrunden können zusätzliche Kosten verursachen, die vorab einzuplanen sind.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/abenteuerurlaub/", label: "🧗 Abenteuerurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/familienurlaub/", label: "👨‍👩‍👧‍👦 Familienurlaub" },
  { href: "/urlaubsthemen/singlereisen/", label: "🧳 Singlereisen" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Aktivurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/aktivurlaub/" },
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
          src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&q=80"
          alt="Aktivurlaub – Sport & Outdoor Reisen"
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
            <span className="text-white/90">Aktivurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-lime-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🏃 Aktivurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Aktivurlaub {YEAR} günstig buchen<br />
            <span className="text-lime-200">Golf, Tauchen, Surfen &amp; Wandern</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Urlaub aktiv erleben: Golf auf Weltklasse-Anlagen, Tauchen im
            kristallklaren Meer, Surfen auf perfekten Wellen und Wandern in
            atemberaubender Natur.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Golf & Tennis", "Tauchen & Schnorcheln", "Surfen & Wassersport", "Wandern & Radfahren"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Aktivurlaub weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Sport, Bewegung und frische Luft – die besten Regionen für aktive Urlauber, die Sonne und Natur erleben wollen.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#16a34a" carouselLabel="Weitere Aktiv Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.thomas}
          quote="Wer Aktivurlaub mit tollem Wetter verbinden will, sollte Mallorca im Oktober ausprobieren. Die Wanderwege an der Tramuntana sind im Herbst traumhaft – kein Massentourismus, angenehme Temperaturen und die Hotelpreise deutlich günstiger als im Sommer."
          accentColor="#16a34a"
          tip="Mein Tipp: Mallorca Tramuntana, Oktober"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100000"
          deeplinkLabel="Thomas' Aktiv-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-lime-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Aktivurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Hotels mit Sport- und Outdoor-Programm — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="spt,sws,sbs,shb,sgl,srd,sae,sfr,stn,sdv"
          from="14"
          to="365"
          duration="7-14"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Aktivurlaub?"
        accentColor="#16a34a"
        items={[
          { emoji: "⛳", title: "Golf & Tennis", desc: "Erstklassige Golfanlagen mit gepflegten Greens und traumhafter Kulisse" },
              { emoji: "🤿", title: "Tauchen & Schnorcheln", desc: "Zertifizierte Tauchschulen und faszinierende Unterwasserwelten" },
              { emoji: "🏄", title: "Surf & Wassersport", desc: "Surf-Camps und Kurse mit erfahrenen Instruktoren" },
              { emoji: "🥾", title: "Hiking & Trekking", desc: "Geführte Touren durch atemberaubende Naturlandschaften" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Aktivurlaub – Sport und Bewegung in Traumkulissen</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Wer im Urlaub nicht nur die Seele baumeln lassen, sondern auch aktiv sein
          und etwas leisten möchte, ist beim Aktivurlaub genau richtig. Die Palette
          reicht von entspanntem Schnorcheln und geführten Küstenwanderungen bis hin
          zu intensiven Golfwochen und professionellen Tauchlehrgängen. Aktivhotels
          bieten die ideale Infrastruktur: Kurse für Anfänger und Fortgeschrittene,
          Ausrüstungsverleih und erfahrene Guides, die jeden Urlaubstag zu einem
          sportlichen Erlebnis machen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Besonders die Mittelmeerregion bietet hervorragende Bedingungen für
          Aktivurlaub. Spanien (Mallorca, Costa del Sol) hat über 100 Golfplätze
          und ist Europas Golf-Hauptstadt. Ägypten und die Türkei bieten
          Weltklasse-Tauchspots. Die Kanaren (Fuerteventura, Lanzarote) sind
          dank konstantem Wind das Mekka für Surfer und Kite-Surfer. Für
          Wanderbegeisterte sind Madeira und die griechischen Berggebiete ideal.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Aktivurlaub-Angebote werden täglich nach Hotels mit nachgewiesenem
          Sportprogramm gefiltert. Ob Sie Golf spielen, tauchen lernen oder einfach
          aktiver am Strand sein möchten – hier finden Sie das passende Angebot für
          Ihren Sporturlaub.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#16a34a" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Aktiv-Reiseziele"
        heading="Aktivurlaub Reiseziele im Überblick"
        accentColor="#16a34a"
        destinations={[
          { slug: "teneriffa", label: "Aktiv Teneriffa" },
          { slug: "mallorca", label: "Aktiv Mallorca" },
          { slug: "kreta", label: "Aktiv Kreta" },
          { slug: "gran-canaria", label: "Aktiv Gran Canaria" },
          { slug: "lanzarote", label: "Aktiv Lanzarote" },
          { slug: "fuerteventura", label: "Aktiv Fuerteventura" },
          { slug: "dubrovnik", label: "Aktiv Dubrovnik" },
          { slug: "split", label: "Aktiv Split" },
          { slug: "korfu", label: "Aktiv Korfu" },
          { slug: "rhodos", label: "Aktiv Rhodos" },
          { slug: "santorini", label: "Aktiv Santorini" },
          { slug: "marrakesch", label: "Aktiv Marrakesch" },
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
