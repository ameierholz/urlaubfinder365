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
  title: `🌋 Abenteuerurlaub ${YEAR} günstig buchen – Erlebnisreisen`,
  description: `Abenteuerurlaub ${YEAR} günstig buchen ✓ Safari, Trekking, Rafting & mehr ✓ Erlebnisreisen weltweit ✓ Outdoor & Natur ✓ Jetzt entdecken.`,
  keywords: ["Abenteuerurlaub günstig", "Abenteuerurlaub buchen", "Erlebnisreise", "Safari Urlaub", "Trekking Urlaub", "Abenteuerreise", "Outdoor Reise", "Natur Urlaub"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/abenteuerurlaub/",
  },
  openGraph: {
    title: `🌋 Abenteuerurlaub ${YEAR} – Erlebnisreisen | Urlaubfinder365`,
    description: `Abenteuerurlaub ${YEAR} günstig buchen ✓ Safari, Trekking, Rafting & mehr ✓ Erlebnisreisen weltweit ✓ Outdoor & Natur ✓ Jetzt entdecken.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/abenteuerurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Abenteuerurlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die türkische Riviera ist weit mehr als Sandstrand und Sonne – das Taurusgebirge direkt hinter Antalya bietet atemberaubendes Canyoning, Wildwasser-Rafting und Paragliding von Ölüdeniz mit Blick auf das türkisblaue Mittelmeer. Erfahrene Guides führen Gruppen durch schmale Schluchten, über Kletterpfade und bei aufregenden Jeep-Safaris durchs anatolische Hochland. Wer Abenteuer mit Komfort verbinden möchte, findet in der Türkei das perfekte Preis-Leistungs-Verhältnis.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=724" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta: Schluchten-Wanderungen, Klettern und Meereshöhlen-Abenteuer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&countryId=GR" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Chiang Mai: Tauchen, Klettern, Elefanten-Trekkings und Dschungel-Touren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100220" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada & Sharm el-Sheikh: Tauchen und Schnorcheln im Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=651" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Lanzarote & La Palma: Vulkanwanderungen, Surfspots und Steilklippen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=851" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Ibiza & Mallorca: Klettersteige, Seakayaking und Canyoning in wilden Schluchten.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100000" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Kuba & Mexiko: Höhlentauchen, Ziplining und Dschungel-Expeditionen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100017" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: Wellenreiten, Klettern an Klippen und Kajakfahren an der Felsküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=725" },
];

const FAQ = [
  {
    q: "Was sind die besten Ziele für einen Abenteuerurlaub?",
    a: "Für Abenteuerurlaub in Europa sind Madeira (Wandern, Canyoning), Island (Vulkane, Gletscher), Norwegen (Fjord-Trekking) und die Türkei (Tauchen, Paragliding) besonders empfehlenswert. Für intensivere Abenteuer bieten Costa Rica (Regenwald), Nepal (Trekking zum Everest Base Camp) und Neuseeland (Bungee Jumping, Kayaking) unvergessliche Erlebnisse. Auch Ägypten ist ideal für Taucher.",
  },
  {
    q: "Welche körperliche Fitness brauche ich für einen Abenteuerurlaub?",
    a: "Das hängt stark von der gewählten Aktivität ab. Schnorcheln und einfache Wanderungen sind für alle Fitnessniveaus geeignet. Für Trekking in höheren Lagen, intensives Klettern oder mehrtägige Touren ist eine gute Grundfitness empfehlenswert. Viele Reiseveranstalter bieten Programme für verschiedene Fitnessniveaus an – von Einsteiger bis Profi. Konsultieren Sie bei gesundheitlichen Zweifeln Ihren Arzt.",
  },
  {
    q: "Brauche ich spezielle Ausrüstung für Abenteuerurlaub?",
    a: "Grundlegende Ausrüstung wie feste Wanderschuhe, wettergerechte Kleidung und Sonnenschutz sind unerlässlich. Für Wassersportaktivitäten wird oft die nötige Ausrüstung vor Ort vermietet oder gestellt. Bei spezialisierten Sportarten (Tauchen, Klettern) lohnt es sich, eigene gut sitzende Ausrüstung mitzubringen. Informieren Sie sich vorab beim Veranstalter über die erforderliche Ausstattung.",
  },
  {
    q: "Ist Abenteuerurlaub teurer als normaler Strandurlaub?",
    a: "Nicht zwangsläufig. Viele Abenteuer-Destinationen wie Marokko, Albanien oder die Türkei sind sehr preiswert. Die Kosten hängen von der Aktivität, der Destination und der gebuchten Unterkunft ab. Pauschalreisen mit Aktivprogramm können sehr attraktive Preise bieten. Besondere Sportarten wie Privatkurs-Tauchen oder geführte Trekkingtouren können jedoch zusätzliche Kosten verursachen.",
  },
  {
    q: "Wie sicher ist Abenteuerurlaub?",
    a: "Moderne Abenteureiseveranstalter legen höchsten Wert auf Sicherheit. Alle Aktivitäten werden von erfahrenen Guides begleitet, Sicherheitsausrüstung ist standardmäßig inbegriffen und Notfallpläne sind vorhanden. Buchen Sie nur bei seriösen Anbietern mit Zertifizierungen. Eine umfassende Reiseversicherung inklusive Bergungskosten ist bei Abenteuerreisen unbedingt empfehlenswert.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/aktivurlaub/", label: "🏃 Aktivurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/singlereisen/", label: "🧳 Singlereisen" },
  { href: "/urlaubsthemen/staedtereisen/", label: "🏙️ Städtereisen" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Abenteuerurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/abenteuerurlaub/" },
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
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80"
          alt="Abenteuerurlaub – Outdoor & Erlebnisreisen"
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
            <span className="text-white/90">Abenteuerurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-orange-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🧗 Abenteuerurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Abenteuerurlaub {YEAR} günstig buchen<br />
            <span className="text-orange-200">Action, Sport &amp; unvergessliche Erlebnisse</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Für alle, die Urlaub aktiv erleben wollen: Wandern, Tauchen, Surfen und
            Mountainbiking in den schönsten Ecken der Welt.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Wandern & Trekking", "Tauchen & Schnorcheln", "Surfen & Kitesurfen", "Outdoor-Erlebnisse"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-orange-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Abenteuer weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Action, Natur und unvergessliche Erlebnisse – die besten Destinationen für Abenteuer und aktive Auszeiten.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#ea580c" carouselLabel="Weitere Abenteuer Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.thomas}
          quote="Für echten Abenteuerurlaub empfehle ich die türkische Riviera – nicht nur wegen des Meeres, sondern wegen der Kombination aus Paragliding in Ölüdeniz und Schluchtenwanderungen im Taurusgebirge. Das Preis-Leistungs-Verhältnis ist unschlagbar."
          accentColor="#ea580c"
          tip="Mein Tipp: Türkei – Paragliding & Canyoning, Oktober"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-14&adults=2&category=3&minRecommrate=70"
          deeplinkLabel="Thomas' Abenteuer-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-orange-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Abenteuerurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Pakete für Aktivurlauber — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="pol,wsl,ani,spt,sws,sfr,stn,sdv"
          from="14"
          to="365"
          duration="7-14"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Abenteuerurlaub?"
        accentColor="#ea580c"
        items={[
          { emoji: "🏔️", title: "Wandern & Trekking", desc: "Bergtouren, Küstenpfade und unvergessliche Naturerlebnisse" },
              { emoji: "🤿", title: "Tauchen & Schnorcheln", desc: "Unterwasserwelten erkunden in kristallklarem Wasser" },
              { emoji: "🏄", title: "Surfen & Kiten", desc: "Wellen reiten und den Wind nutzen an Traum-Surfspots" },
              { emoji: "🚵", title: "Fahrrad & MTB", desc: "Trails und Gebirgsrouten für Biker aller Niveaus" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Abenteuerurlaub – Aktiv die Welt entdecken</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Abenteuerurlaub ist die Antithese zum passiven Strandurlaub: statt liegen
          und entspannen stehen Erleben, Entdecken und Herausfordern im Vordergrund.
          Ob Klettern in felsigen Schluchten Spaniens, Tauchen im Roten Meer, Surfen
          auf den Kanaren oder Trekking in den türkischen Taurusbergen – der
          Abenteuerurlaub fordert und belohnt gleichermaßen. Körperliche Aktivität
          in unvergesslicher Natur schafft Erlebnisse, die weit über den normalen
          Urlaub hinausgehen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die Mittelmeerregion bietet dank ihrer geografischen Vielfalt ideale
          Bedingungen für Abenteuerurlaub: Mallorca lockt mit Felsklettern und
          Kajaktouren, Kreta mit Gorty-Schlucht-Wanderungen, die Türkei mit
          Paragliding in Ölüdeniz und Tauchen in Kas. Sportliche Urlauber finden
          hier das ganze Jahr über perfekte Bedingungen für ihre Lieblingsaktivitäten.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Abenteuerurlaub-Angebote umfassen Hotels und Resorts, die aktiven
          Urlaubern besonders viele Sport- und Outdoor-Möglichkeiten bieten. Von
          einfachen Aktivpaketen bis zu intensiven Abenteuerreisen finden Sie hier
          täglich neue Angebote für jeden Aktivitätslevel.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#ea580c" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Abenteuer-Reiseziele"
        heading="Abenteuerurlaub Reiseziele im Überblick"
        accentColor="#ea580c"
        destinations={[
          { slug: "teneriffa", label: "Abenteuer Teneriffa" },
          { slug: "lanzarote", label: "Abenteuer Lanzarote" },
          { slug: "marrakesch", label: "Abenteuer Marrakesch" },
          { slug: "kreta", label: "Abenteuer Kreta" },
          { slug: "mallorca", label: "Abenteuer Mallorca" },
          { slug: "gran-canaria", label: "Abenteuer Gran Canaria" },
          { slug: "fuerteventura", label: "Abenteuer Fuerteventura" },
          { slug: "dubai", label: "Abenteuer Dubai" },
          { slug: "santorini", label: "Abenteuer Santorini" },
          { slug: "hurghada", label: "Abenteuer Hurghada" },
          { slug: "rhodos", label: "Abenteuer Rhodos" },
          { slug: "dubrovnik", label: "Abenteuer Dubrovnik" },
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
