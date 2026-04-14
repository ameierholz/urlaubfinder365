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
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🏙 Städtereisen ${YEAR} günstig buchen – Kultur & Sightseeing`,
  description: `Städtereisen ${YEAR} günstig buchen ✓ Barcelona, Rom, Paris & mehr ✓ Flug + Hotel ✓ Sightseeing & Kultur ✓ Jetzt Städtetrip vergleichen.`,
  keywords: ["Städtereisen günstig", "Städtereise buchen", "Städtetrip", "Kurzurlaub Stadt", "Städtereise Barcelona", "Städtereise Rom", "Städtereise Paris", "City Trip buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/staedtereisen/",
  },
  openGraph: {
    title: `🏙 Städtereisen ${YEAR} – günstig buchen | Urlaubfinder365`,
    description: `Städtereisen ${YEAR} günstig buchen ✓ Barcelona, Rom, Paris & mehr ✓ Flug + Hotel ✓ Sightseeing & Kultur ✓ Jetzt Städtetrip vergleichen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/staedtereisen/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: "Städtereisen günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Barcelona", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80&auto=format", teaser:"Barcelona ist die vielleicht vielseitigste Metropole Europas: Gaudís visionäre Architektur – von der Sagrada Família bis zum Park Güell – zieht Kunstliebhaber in ihren Bann, während die lebhaften Tapas-Bars im Barri Gòtic und die mondänen Clubs am Barceloneta-Strand für unvergessliche Nächte sorgen. Eingebettet zwischen Bergen und Mittelmeer verbindet die katalanische Hauptstadt Kulturgenuss, kulinarische Extravaganz und Strandurlaub zu einem einzigartigen Städteerlebnis.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=100027" },
  { name:"Dubai", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format", teaser:"Burj Khalifa, Souk und Luxus-Shopping – Dubai begeistert auf Schritt und Tritt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=650" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80&auto=format", teaser:"Istanbul: Bosporus, Bazare und Moscheen – Europas faszinierendste Metropole.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=724" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80&auto=format", teaser:"Athen: Akropolis, Plaka-Viertel und mediterrane Küche in der Kulturhauptstadt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&countryId=GR" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80&auto=format", teaser:"Lissabon & Porto: Fado, Pastéis de Nata und Tram 28 – unvergessliche Stadtromantik.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=725" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80&auto=format", teaser:"Rom, Florenz & Venedig – Italiens Städte sind lebendige Kunstwerke.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&countryId=IT" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&auto=format", teaser:"Las Palmas & Santa Cruz: moderne Hafenstädte mit südländischem Lebensgefühl.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=851" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format", teaser:"Bangkok: Tempel, Streetfood und futuristisches Stadtleben in Asien.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=1&to=90&duration=3-5&adults=2&category=3&minRecommrate=65&regionId=100220" },
];

const FAQ = [
  {
    q: "Welche europäischen Städte eignen sich am besten für eine Städtereise?",
    a: "Zu den beliebtesten Städtereisezielen in Europa zählen Barcelona, Paris, Amsterdam, Wien, Prag, Rom, Lissabon und Istanbul. Diese Städte bieten eine perfekte Kombination aus Geschichte, Architektur, Gastronomie und Nachtleben. Für ein langes Wochenende eignen sich Prag, Wien oder Budapest besonders gut, da sie kompakt und gut zu Fuß erkundbar sind.",
  },
  {
    q: "Wie viele Tage braucht man für eine Städtereise?",
    a: "Für ein intensives Stadterleben sind 3 bis 5 Tage ideal. An 3 Tagen können Sie die wichtigsten Sehenswürdigkeiten besuchen und die Atmosphäre aufnehmen. Für Städte wie Paris, London oder Istanbul empfehlen sich mindestens 5 Tage, um auch abseits der Touristenpfade zu erkunden. Kurztrips über ein langes Wochenende (3 Nächte) sind für näher gelegene Metropolen völlig ausreichend.",
  },
  {
    q: "Was sollte man bei der Hotelwahl für Städtereisen beachten?",
    a: "Lage ist bei Städtereisen das wichtigste Kriterium. Ein zentral gelegenes Hotel spart viel Zeit und Geld für Transport. Achten Sie auf die Nähe zu öffentlichen Verkehrsmitteln, Sehenswürdigkeiten und der Altstadt. Kleinere Boutique-Hotels bieten oft mehr Charme als große Kettenhotels und vermitteln ein authentischeres Stadtgefühl.",
  },
  {
    q: "Wie buche ich günstige Städtereisen?",
    a: "Günstige Städtereisen sind besonders in der Nebensaison (November bis März, außer Weihnachten/Silvester) verfügbar. Flüge und Hotels sind dann deutlich günstiger. Pauschalangebote mit Flug und Hotel sind oft günstiger als separate Buchungen. Vergleichen Sie auch verschiedene Abflughäfen und seien Sie zeitlich flexibel für die besten Preise.",
  },
  {
    q: "Welche Versicherungen braucht man für eine Städtereise?",
    a: "Für Städtereisen in Europa ist eine Reisekrankenversicherung empfehlenswert, auch wenn die Europäische Krankenversicherungskarte (EHIC) grundlegende Versorgung abdeckt. Eine Reiserücktrittsversicherung schützt bei unvorhergesehenen Ereignissen. Für außereuropäische Städte (Istanbul, New York, Tokio) ist eine umfassende Reiseversicherung inklusive Gepäckschutz ratsam.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/abenteuerurlaub/", label: "🧗 Abenteuerurlaub" },
  { href: "/urlaubsthemen/aktivurlaub/", label: "🏃 Aktivurlaub" },
  { href: "/urlaubsthemen/singlereisen/", label: "🧳 Singlereisen" },
  { href: "/urlaubsthemen/budget-bis-1000/", label: "💰 Budget bis 1.000 €" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Städtereisen",        item: "https://www.urlaubfinder365.de/urlaubsthemen/staedtereisen/" },
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
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80&auto=format&fit=crop"
          alt="Städtereisen – Europäische Metropolen entdecken"
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
            <span className="text-white/90">Städtereisen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-violet-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🏙️ Städtereisen
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Städtereisen {YEAR} günstig buchen<br />
            <span className="text-violet-200">Kultur, Kunst &amp; Gastronomie</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Entdecken Sie Europas schönste Metropolen – von Barcelona bis Istanbul.
            Kultur, Gastronomie und Architektur auf unvergesslichen Städtetrips.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Zentrale Hotellage", "Kulturelle Highlights", "Kulinarische Szene", "Shopping & Events"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-slate-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Städtereisen weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Pulsierendes Stadtleben, Kultur, Architektur und Kulinarik – die beliebtesten Städtereiseziele mit Hin- und Rückflug.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#475569" carouselLabel="Weitere Städtereise Ziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="Städtereisen sind meine heimliche Leidenschaft neben Familienreisen. Barcelona, Lissabon und Wien stehen ganz oben – jede Stadt hat ihre eigene Energie. Für ein langes Wochenende empfehle ich Lissabon: günstig, charmant, und das Essen ist einfach phänomenal."
          accentColor="#475569"
          tip="Mein Tipp: Lissabon Kurztrip, Frühling oder Herbst"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=3&to=90&duration=3-4&adults=2&category=3&minRecommrate=70"
          deeplinkLabel="Julias Städtereise-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-violet-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Städtereisen Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Städtereisen mit Hotel in zentraler Lage — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="cit"
          from="14"
          to="365"
          duration="3-5"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Städtereisen?"
        accentColor="#475569"
        items={[
          { emoji: "🗺️", title: "Zentrale Lage", desc: "Hotels mitten im Stadtgeschehen – alles zu Fuß erreichbar" },
              { emoji: "🎭", title: "Kultur & Museen", desc: "Museen, Theater, Konzerte und lokale Festivals entdecken" },
              { emoji: "🍽️", title: "Top Restaurants", desc: "Von Streetfood bis Gourmet – kulinarische Vielfalt erleben" },
              { emoji: "🛍️", title: "Shopping", desc: "Boutiquen, Designer-Stores und lokale Märkte entdecken" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Städtereisen – Europas Metropolen entdecken</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Städtereisen boomen wie nie zuvor. Lange Wochenenden in europäischen
          Metropolen, Kurztrips zu weniger bekannten Städten oder ausgedehnte
          Stadtentdeckungen über eine Woche – die Vielfalt ist riesig. Städtereisen
          verbinden Kultur, Geschichte, Gastronomie und Shopping auf einzigartige Weise
          und ermöglichen einen intensiven Kontakt mit lokaler Lebensweise und
          Traditionen. Zentral gelegene Hotels sind dabei das Fundament eines gelungenen
          Städtetrips.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Barcelona begeistert mit Gaudís Architektur und der Barceloneta-Strandpromenade,
          Wien verzaubert mit Hofburg und Kaffeehaus-Kultur, Lissabon fasziniert mit
          Fado-Klängen und dem Blick über den Tejo. Istanbul verbindet Orient und
          Okzident auf einzigartige Weise. Für jeden Geschmack und jedes Budget findet
          sich die passende Metropole – von günstigem Prag bis zum exklusiven Monaco.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Städtereise-Angebote umfassen Hotels in bevorzugter Citylage mit guten
          Bewertungen. Nutzen Sie die Filteroptionen, um Ihre ideale Reisedauer und
          Ihren Zielort zu finden. Besonders in der Nebensaison sind außergewöhnlich
          günstige Städtereise-Pakete verfügbar.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#475569" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Beliebte Städtereise-Ziele</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Städtereisen Reiseziele im Überblick</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { href: "/urlaubsziele/barcelona/",    label: "Städtereise Barcelona" },
            { href: "/urlaubsziele/rom/",           label: "Städtereise Rom" },
            { href: "/urlaubsziele/paris/",         label: "Städtereise Paris" },
            { href: "/urlaubsziele/amsterdam/",     label: "Städtereise Amsterdam" },
            { href: "/urlaubsziele/dubai/",         label: "Städtereise Dubai" },
            { href: "/urlaubsziele/istanbul/",      label: "Städtereise Istanbul" },
            { href: "/urlaubsziele/new-york/",      label: "Städtereise New York" },
            { href: "/urlaubsziele/london/",        label: "Städtereise London" },
            { href: "/urlaubsziele/prag/",          label: "Städtereise Prag" },
            { href: "/urlaubsziele/wien/",          label: "Städtereise Wien" },
            { href: "/urlaubsziele/lissabon/",      label: "Städtereise Lissabon" },
            { href: "/urlaubsziele/marrakesch/",    label: "Städtereise Marrakesch" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#475569] hover:text-[#475569] text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-all group">
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#475569] text-xs ml-1 shrink-0">→</span>
            </Link>
          ))}
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

      {/* Beliebte Urlaubsziele */}
      <DestinationCarousel title="Beliebte Urlaubsziele direkt buchen" />

    </div>
  );
}
