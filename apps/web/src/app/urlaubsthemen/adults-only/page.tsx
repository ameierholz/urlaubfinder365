import type { Metadata } from "next";
import Link from "next/link";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import ThemeSidebar from "@/components/ui/ThemeSidebar";
import DestinationGrid, { DestinationCard } from "@/components/offers/DestinationGrid";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import ThemeFeatureGrid from "@/components/ui/ThemeFeatureGrid";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import Image from "next/image";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `💑 Adults Only Urlaub ${YEAR} – Hotels nur für Erwachsene`,
  description: `Adults Only Urlaub ${YEAR} günstig buchen ✓ Hotels exklusiv für Erwachsene ✓ Keine Kinder ✓ Ruhe & Romantik ✓ Täglich neue Angebote.`,
  keywords: ["Adults Only Urlaub", "Adults Only Hotel", "Urlaub ohne Kinder", "Erwachsenenhotel", "Adults Only Türkei", "Adults Only Mallorca", "Paarurlaub", "Romantikurlaub"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/adults-only/",
  },
  openGraph: {
    title: `💑 Adults Only Urlaub ${YEAR} – nur für Erwachsene | Urlaubfinder365`,
    description: `Adults Only Urlaub ${YEAR} günstig buchen ✓ Hotels exklusiv für Erwachsene ✓ Keine Kinder ✓ Ruhe & Romantik ✓ Täglich neue Angebote.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/adults-only/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Adults Only Urlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Die Balearen sind Europas Inbegriff für exklusiven Adults Only Urlaub: Mallorca überzeugt mit romantischen Cliff-Hotels und privaten Infinity-Pools, Ibiza mit stilvollem Boutique-Ambiente und Menorca mit unberührter Naturlandschaft. Keine Kinder, nur Ruhe, Genuss und unvergessliche Zweisamkeit – an einem der schönsten Meere der Welt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100000&keywords=ado" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Antalya & Bodrum: stilvolle Erwachsenenhotels direkt am türkisblauen Mittelmeer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=724&keywords=ado" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Korfu, Kos & Mykonos: entspannte Strandatmosphäre auf den schönsten Inseln.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100002&keywords=ado" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: romantische Resorts mit traumhaftem Panoramablick.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&countryId=GR&keywords=ado" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Lanzarote & Teneriffa: Adults Only Hotels mit Meerblick – das ganze Jahr.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=851&keywords=ado" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada & Marsa Alam: luxuriöse Resorts am kristallklaren Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=651&keywords=ado" },
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", teaser:"Exklusive Strandhotels und Rooftop-Pools auf höchstem Niveau.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=650&keywords=ado" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Koh Samui: romantische Bungalows und Spa-Resorts im Tropenparadies.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100220&keywords=ado" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Kuba, Jamaika & Mexiko: Adults Only Strandresorts mit All-Inclusive-Komfort.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100017&keywords=ado" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", teaser:"Sardinien & Sizilien: charmante Hotels an der wildromantischen Mittelmeerküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&countryId=IT&keywords=ado" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: moderne Adults Only Hotels an den schönsten Klippen Europas.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=725&keywords=ado" },
];

const FAQ = [
  {
    q: "Was bedeutet Adults Only bei Hotels?",
    a: "Adults Only Hotels sind ausschließlich für Erwachsene (meist ab 16 oder 18 Jahren) zugänglich. Es sind keine Kinder erlaubt, was für eine ruhige und entspannte Atmosphäre sorgt. Diese Hotels sind besonders bei Paaren, Honeymoonern und Reisenden beliebt, die eine erholsame Auszeit ohne den Lärm von Kindern suchen.",
  },
  {
    q: "Für wen eignen sich Adults Only Urlaube besonders?",
    a: "Adults Only Urlaube sind ideal für Paare, die eine romantische Auszeit suchen, für Frischvermählte auf Flitterwochen, aber auch für Alleinreisende oder Freundesgruppen, die eine ruhige und gehobene Atmosphäre bevorzugen. Wer nach ungestörter Entspannung und exklusivem Service sucht, ist in Adults Only Hotels bestens aufgehoben.",
  },
  {
    q: "In welchen Reisezielen gibt es die besten Adults Only Hotels?",
    a: "Adults Only Hotels finden sich in allen bekannten Urlaubsregionen: Mallorca, Ibiza und Menorca auf den Balearen, Lanzarote und Teneriffa auf den Kanaren, Kreta und Rhodos in Griechenland sowie Antalya und Bodrum in der Türkei bieten eine große Auswahl. Auch auf Mauritius, auf den Malediven und in der Karibik gibt es hervorragende Adults Only Resorts.",
  },
  {
    q: "Sind Adults Only Hotels teurer als normale Hotels?",
    a: "Nicht zwangsläufig. Es gibt Adults Only Hotels in allen Preisklassen – von günstig bis luxuriös. Viele 3- und 4-Sterne Adults Only Hotels sind preislich mit regulären Familienhotels vergleichbar. Der Vorteil liegt nicht unbedingt im Preis, sondern im deutlich ruhigeren und entspannteren Ambiente.",
  },
  {
    q: "Was sollte ich bei der Buchung eines Adults Only Hotels beachten?",
    a: "Achten Sie auf das Mindestalter (16 oder 18 Jahre je nach Hotel) und prüfen Sie die HolidayCheck-Bewertungen. Außerdem lohnt es sich, auf die Verpflegungsart zu achten: All-Inclusive eignet sich für entspannten Genuss, Halbpension für mehr Freiheit beim Abendessen. Informieren Sie sich auch über besondere Romantikpakete, die viele Hotels für Paare anbieten.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/hochzeitsreise/", label: "💒 Hochzeitsreise" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellnessurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Adults Only",        item: "https://www.urlaubfinder365.de/urlaubsthemen/adults-only/" },
  ],
};

export default function AdultsOnlyPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <div
        className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1920&q=80"
          alt="Adults Only Urlaub – Exklusive Resorts für Erwachsene"
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
            <span className="text-white/90">Adults Only</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-rose-600/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💑 Adults Only
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Urlaub nur für Erwachsene<br />
            <span className="text-rose-200">Romantik &amp; pure Entspannung</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Erleben Sie Urlaub ohne Kompromisse: ruhige Pools, romantische Abende und
            erstklassiger Service – ausschließlich für Erwachsene.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Keine Kinder im Hotel", "Romantische Atmosphäre", "Premium Service", "Exklusive Pools"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-rose-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Reiseziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Adults Only Urlaub weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Exklusive Erwachsenenhotels in den beliebtesten Urlaubsregionen – ruhige Atmosphäre, romantischer Flair und erstklassiger Service.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#e11d48" carouselLabel="Weitere Adults Only Reiseziele" />
      </div>

      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Die Balearen sind mein persönliches Paradies für Adults Only Urlaub. Mallorca hat sich enorm entwickelt – besonders die Nordküste bietet inzwischen Boutique-Resorts auf absolutem Toplevel. Keine Kinder, kein Lärm, einfach nur entspannter Genuss. Am schönsten ist es im Mai und September."
          accentColor="#e11d48"
          tip="Mein Tipp: Mallorca Nordküste, Mai oder September"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=42&duration=7-7&adults=2&category=3&minRecommrate=60&regionId=100000&keywords=ado"
          deeplinkLabel="Susannes Adults-Only-Tipps"
        />
      </div>

      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-rose-600 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Aktuelle Adults Only Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Angebote für Paare und Erwachsene — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="ado"
          from="14"
          to="365"
          duration="5-5"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Adults Only?"
        accentColor="#e11d48"
        items={[
          { emoji: "🚫", title: "Kinderfreie Zone", desc: "Ausschließlich für Erwachsene – maximale Ruhe garantiert" },
              { emoji: "💑", title: "Paare & Verliebte", desc: "Perfekte Kulisse für Zweisamkeit und romantische Momente" },
              { emoji: "🍷", title: "Gastronomie & Bar", desc: "Gehobene Küche und aufmerksamer Barservice bis spät in die Nacht" },
              { emoji: "🛁", title: "Spa & Wellness", desc: "Exklusive Spa-Bereiche und Massagen in ruhiger Atmosphäre" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Adults Only Hotels – Urlaub nur für Erwachsene</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Adults Only Hotels bieten eine einzigartige Urlaubsatmosphäre, die speziell auf
          die Bedürfnisse von Erwachsenen ausgerichtet ist. Kein Kinderlärm am Pool, keine
          wartenden Familien am Frühstücksbuffet – stattdessen entspannte Stille, ein
          gepflegtes Ambiente und ein Service, der sich vollständig auf erwachsene Gäste
          konzentriert. Besonders beliebt sind diese Hotels bei Paaren, die eine romantische
          Auszeit suchen, oder bei Alleinreisenden, die Erholung in ruhiger Umgebung
          genießen möchten.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die beliebtesten Destinationen für Adults Only Urlaub sind die Balearen, die
          Kanarischen Inseln, Griechenland und die Türkei. Hier finden sich zahlreiche
          gehobene Resorts mit privaten Stränden, exklusiven Spa-Bereichen und
          erstklassiger Gastronomie. Viele Hotels bieten romantische Pakete an, etwa
          Candle-Light-Dinner, Champagner bei Anreise oder private Cabanas am Pool –
          ideal für Hochzeitsreisen und besondere Anlässe.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Bei der Buchung lohnt es sich, auf Hotels mit hoher HolidayCheck-Empfehlungsrate
          zu achten, da diese konstant hohe Gästezufriedenheit beweisen. All-Inclusive
          Adults Only Angebote sind besonders praktisch: Sie lassen sich vollständig
          entspannen, ohne an Kosten zu denken. Buchen Sie jetzt Ihren Adults Only Urlaub
          und genießen Sie exklusive Zweisamkeit oder verdiente Auszeit in gehobener
          Atmosphäre.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#e11d48" />
        </div>
      </div>

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

      {/* Beliebte Reiseziele */}
      <DestinationCarousel title="Beliebte Reiseziele direkt buchen" />

    </div>
  );
}
