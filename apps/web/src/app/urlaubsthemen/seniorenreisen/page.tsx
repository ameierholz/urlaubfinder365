import type { Metadata } from "next";
import Link from "next/link";
import IbeTeaser from "@/components/ibe/IbeTeaser";
import ThemeSidebar from "@/components/ui/ThemeSidebar";
import DestinationGrid, { DestinationCard } from "@/components/offers/DestinationGrid";
import DestinationCarousel from "@/components/ui/DestinationCarousel";
import ExpertBanner from "@/components/ui/ExpertBanner";
import { EXPERTS } from "@/lib/experts";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import ThemeFeatureGrid from "@/components/ui/ThemeFeatureGrid";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Seniorenreisen – Entspannter Urlaub ab 60",
  description:
    "Seniorenreisen mit barrierefreien Hotels ✓ Ruhige Lage ✓ Ausgezeichneter Service ✓ Täglich aktualisierte Reiseangebote für Senioren.",
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/seniorenreisen/",
  },
  openGraph: {
    title: "Seniorenreisen – Entspannter Urlaub ab 60",
    description:
      "Seniorenreisen mit barrierefreien Hotels ✓ Ruhige Lage ✓ Ausgezeichneter Service ✓ Täglich aktualisierte Reiseangebote für Senioren.",
    url: "https://www.urlaubfinder365.de/urlaubsthemen/seniorenreisen/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Seniorenreisen günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die türkische Riviera rund um Antalya gilt zu Recht als eine der beliebtesten Destinationen für Seniorenreisen: Komfortable All-Inclusive-Resorts mit ebenerdigen Zugängen, ausreichend Schattenplätzen, ruhigen Strandabschnitten und einem breiten Wellnessangebot sorgen für echte Erholung ohne Stress. Das warme Klima, die exzellente Küche und die herzliche türkische Gastfreundschaft tun ihr Übriges, um den Urlaub zum unvergesslichen Erlebnis zu machen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Mallorca & Menorca: ruhige Buchten und seniorenfreundliche Hotels.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100000" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Gran Canaria & Teneriffa: mildes Klima das ganze Jahr – ideal für Seniorenreisen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=851" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: Kultur, Geschichte und ruhige Strände für entspannte Senioren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&countryId=GR" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada: günstige und komfortable Seniorenreisen am warmen Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=651" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: entspannte Küstenregion mit ausgezeichneter medizinischer Versorgung.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=725" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", teaser:"Gardasee & Sardinien: Kultur und Natur für anspruchsvolle Senioren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&countryId=IT" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Korfu & Lefkada: ruhige Inseln mit herzlicher Atmosphäre und gutem Service.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=75&regionId=100002" },
];

const FAQ = [
  {
    q: "Was macht eine Reise seniorengerecht?",
    a: "Seniorengerechte Reisen zeichnen sich durch barrierefreie Hotels (Aufzüge, ebenerdige Duschen, Handläufe), ruhige Lage, komfortablen Transfer und ein entspanntes Tagesprogramm aus. Wichtig sind auch gute medizinische Erreichbarkeit, deutschsprachige Ansprechpartner und ein Service, der auf die Bedürfnisse älterer Gäste eingeht. Vollpension oder All-Inclusive erleichtert die Planung erheblich.",
  },
  {
    q: "Welche Reiseziele eignen sich am besten für Senioren?",
    a: "Spanien (Costa del Sol, Teneriffa, Gran Canaria) ist bei deutschen Senioren sehr beliebt – gutes Klima, ausgezeichnete Infrastruktur und viele seniorengerechte Hotels. Portugal (Algarve) und Madeira sind ebenfalls sehr beliebt. In der Türkei bieten viele Resorts spezielle Senior-Programme an. Für kürzere Reisen eignen sich das Gardasee-Gebiet in Italien und die deutschen Kurortregionen.",
  },
  {
    q: "Sollten Senioren eine Reiseversicherung abschließen?",
    a: "Ja, eine umfassende Reiseversicherung ist für Senioren besonders wichtig. Achten Sie auf: Reisekrankenversicherung mit Rücktransport-Deckung, Reiserücktrittsversicherung (besonders bei Vorerkrankungen) und Gepäckversicherung. Viele Versicherer bieten spezielle Seniorentarife an. Prüfen Sie auch, ob bestehende Krankenversicherungen Leistungen im Ausland abdecken.",
  },
  {
    q: "Können Senioren mit gesundheitlichen Einschränkungen reisen?",
    a: "Ja, mit der richtigen Planung können auch Menschen mit gesundheitlichen Einschränkungen wunderbar reisen. Informieren Sie die Airline und das Hotel vorab über besondere Bedürfnisse. Wählen Sie Direktflüge wenn möglich. Viele Pauschalreiseanbieter haben Spezialisten für Reisen mit Behinderungen oder gesundheitlichen Einschränkungen. Besprechen Sie Ihre Reisepläne immer mit dem behandelnden Arzt.",
  },
  {
    q: "Gibt es Gruppenreisen speziell für Senioren?",
    a: "Ja, zahlreiche Reiseveranstalter bieten Gruppenreisen speziell für Senioren (ab 50 oder 60 Jahre) an. Diese bieten den Vorteil, Gleichgesinnte zu treffen und nicht alleine reisen zu müssen. Das Programm ist auf ein entspanntes Tempo ausgerichtet, Transfers sind immer organisiert und ein Reiseleiter steht für alle Fragen zur Verfügung. Besonders beliebt sind Busreisen und geführte Kulturreisen in Europa.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const LINKS = [
  { href: "/urlaubsthemen/kurreisen/", label: "💧 Kurreisen" },
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellnessurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/budget-bis-1500/", label: "💳 Budget bis 1.500 €" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Seniorenreisen",        item: "https://www.urlaubfinder365.de/urlaubsthemen/seniorenreisen/" },
  ],
};

export default function SeniorenreisenPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <div
        className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&q=80"
          alt="Seniorenreisen – Komfortables Reisen für Senioren"
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
            <span className="text-white/90">Seniorenreisen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-blue-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🌟 Seniorenreisen
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Seniorenreisen – Entspannt genießen<br />
            <span className="text-blue-200">Komfort, Ruhe &amp; bester Service ab 60</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Komfortables Reisen ohne Hektik: barrierefreie Hotels, ruhige Lagen und
            ein Service, der auf die Bedürfnisse reiseerfahrener Gäste eingeht.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Barrierefreie Zugänge", "Ruhige Hotellage", "Vollpension verfügbar", "Medizinische Versorgung"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Reiseziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Seniorenreisen weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Entspannte Reisen mit besonderem Service – die besten Reiseziele für Senioren mit komfortablen Hotels und ruhiger Atmosphäre.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#2563eb" carouselLabel="Weitere Senioren Reiseziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="Senioren legen beim Urlaub Wert auf komfortablen Transfer, gute medizinische Versorgung vor Ort und ein entspanntes Tempo. Die Kanaren eignen sich perfekt: mildes Klima ganzjährig, hervorragende Infrastruktur und viele geführte Ausflüge ohne Stress."
          accentColor="#2563eb"
          tip="Mein Tipp: Teneriffa ganzjährig, komfortables Hotel"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&category=3&minRecommrate=70&regionId=851"
          deeplinkLabel="Julias Senioren-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Seniorenreisen Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Reiseangebote für Senioren — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          from="14"
          to="365"
          duration="10-14"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Seniorenreisen?"
        accentColor="#2563eb"
        items={[
          { emoji: "♿", title: "Barrierefreie Hotels", desc: "Hotels mit barrierefreiem Zugang, breiten Gängen und Aufzügen" },
              { emoji: "🌅", title: "Ruhige, exklusive Lage", desc: "Entspannte Atmosphäre fernab von Partylärm und Trubel" },
              { emoji: "🍽️", title: "Vollpension & All-Inclusive", desc: "Rundum-Verpflegung mit ausgewogenen Speiseplänen täglich" },
              { emoji: "👨‍⚕️", title: "Gesundheitsservice", desc: "Hotels mit medizinischer Grundversorgung oder in Kliniknähe" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Seniorenreisen – Komfort und Ruhe im wohlverdienten Urlaub</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die Lebensphase ab 60 bietet eine wunderbare Gelegenheit, die Welt in aller
          Ruhe zu entdecken. Ohne Termindruck, ohne Schulferien-Trubel und mit der
          Weisheit und Erfahrung, die besten Seiten jeder Destination zu genießen.
          Seniorenreisen sind darauf ausgerichtet, maximalen Komfort zu bieten: von
          barrierefreiem Zugang über bequeme Transfermöglichkeiten bis hin zu einem
          Programm, das Erholung in den Vordergrund stellt. Viele Hotels in
          klassischen Urlaubsregionen haben sich auf ältere Gäste spezialisiert.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Beliebte Reiseziele für Senioren sind die Kanarischen Inseln (besonders
          Gran Canaria und Teneriffa) mit ihrem milden Klima ganzjährig, die Costa del
          Sol in Spanien und die Algarve in Portugal. Viele Senioren schätzen auch
          Österreich, die Schweiz und Südtirol für kultivierte Urlaubserlebnisse in
          vertrauter Sprachumgebung. Für Erholungssuchende bieten Kur-Destinationen
          wie Bad Kissingen oder Karlsbad eine ideale Kombination aus Gesundheit und
          Urlaub.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Seniorenreisen-Angebote werden nach Komfortniveau, Empfehlungsrate
          und Eignung für ältere Gäste gefiltert. Längere Reisedauern von 10 bis 14
          Tagen ermöglichen eine echte Erholung ohne Stress. Vergleichen Sie täglich
          aktuelle Angebote und finden Sie Ihre perfekte Seniorenreise.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#2563eb" />
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
