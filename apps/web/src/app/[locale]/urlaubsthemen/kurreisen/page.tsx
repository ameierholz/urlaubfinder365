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
  title: `🏥 Kurreisen ${YEAR} günstig buchen – Kur & Erholung`,
  description: `Kurreisen ${YEAR} günstig buchen ✓ Thermalbäder & Heilbehandlungen ✓ Kururlaub & Gesundheitsreisen ✓ Erholung für Körper und Geist.`,
  keywords: ["Kurreisen günstig", "Kururlaub buchen", "Gesundheitsreise", "Thermalbad Urlaub", "Kur Tschechien", "Kur Ungarn", "Heilbad Reise", "Gesundheitsurlaub"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/kurreisen/",
  },
  openGraph: {
    title: `🏥 Kurreisen ${YEAR} – Kur & Erholung | Urlaubfinder365`,
    description: `Kurreisen ${YEAR} günstig buchen ✓ Thermalbäder & Heilbehandlungen ✓ Kururlaub & Gesundheitsreisen ✓ Erholung für Körper und Geist.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/kurreisen/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Kurreisen günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die Türkei blickt auf eine jahrtausendealte Badekultur zurück: Traditionelle Hammams reinigen Körper und Geist mit heißem Dampf und intensiven Massagen, während die mineralreichen Thermalquellen Anatoliens – wie die berühmten weißen Kalkterrassen von Pamukkale – nachweislich heilende Wirkung auf Gelenke und Haut haben. Moderne Kurorte verbinden diese Tradition mit zeitgemäßen Spa-Angeboten und bieten so eine ganzheitliche Erholung, die weit über den gewöhnlichen Wellness-Urlaub hinausgeht.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Mallorca: moderne Kur-Resorts mit Meerwasser-Therapien und Thalasso.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=100000" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Gran Canaria: Thalasso-Zentren und Meerwasser-Behandlungen das ganze Jahr.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=851" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: griechische Kräutertherapien und Meeresluft-Kuren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&countryId=GR" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: renommierte Thalasso-Spas und Wellness-Resorts an der Atlantikküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=725" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada: Totes-Meer-Therapien und mineralreiche Bäder am Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=651" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket: traditionelle Thai-Medizin, Kräuter-Dampfbäder und Ayurveda-Kuren.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=100220" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", teaser:"Toskana & Sardinien: Thermalbäder, Schlammpackungen und Weinbäder.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&countryId=IT" },
];

const FAQ = [
  {
    q: "Was ist der Unterschied zwischen Kururlaub und Wellnessurlaub?",
    a: "Kurreisen haben einen stärkeren medizinischen Fokus: Hier stehen ärztliche Diagnosen, therapeutische Behandlungen (Physiotherapie, Balneotherapie, medizinische Bäder) und strukturierte Anwendungsprogramme im Vordergrund. Wellnessurlaub hingegen ist auf Entspannung, Beauty und allgemeines Wohlbefinden ausgerichtet ohne zwingend medizinischen Hintergrund. Viele Kur-Destinationen bieten beide Konzepte kombiniert an.",
  },
  {
    q: "Welche Kurregionen in Europa sind besonders bekannt?",
    a: "Tschechien (Karlsbad, Marienbad, Franzensbad) ist Europas bekanntestes Kurzentrum mit jahrhundertelanger Tradition. Deutschland bietet mit Baden-Baden, Bad Kissingen und Bad Homburg erstklassige Kurbäder. Ungarn (Budapest, Hévíz) ist für Thermalquellen bekannt. Österreich (Bad Gastein, Bad Ischl) verbindet Kur mit alpinem Flair. Im Mittelmeer bieten die türkischen Pamukkale-Quellen einzigartige Thermalbäder.",
  },
  {
    q: "Werden Kurreisen von der Krankenkasse bezuschusst?",
    a: "Medizinisch notwendige Kurmaßnahmen können von der gesetzlichen Krankenkasse bezuschusst oder vollständig übernommen werden, wenn sie ärztlich verordnet sind. Präventive Kurreisen ohne medizinische Indikation werden in der Regel nicht erstattet. Informieren Sie sich vor der Reise bei Ihrer Krankenkasse über die Erstattungsmöglichkeiten und lassen Sie sich wenn möglich eine ärztliche Empfehlung ausstellen.",
  },
  {
    q: "Wie lange sollte eine Kurreise dauern?",
    a: "Für eine nachhaltige Wirkung empfehlen Mediziner mindestens 10 bis 14 Tage. Der Körper benötigt einige Tage, um sich auf die Behandlungen einzustellen und erste therapeutische Effekte zu zeigen. Kürzere Kur-Aufenthalte von 5 bis 7 Tagen sind ebenfalls wertvoll für Entspannung und Prävention, haben aber eine begrenztere medizinische Wirkung als längere Programme.",
  },
  {
    q: "Für wen sind Kurreisen besonders geeignet?",
    a: "Kurreisen eignen sich besonders für Menschen mit chronischen Beschwerden wie Rheuma, Rückenproblemen, Herz-Kreislauf-Erkrankungen oder Erschöpfungszuständen. Auch zur Prävention und zur Erholung nach Operationen oder intensiven Lebensphasen sind Kurreisen sehr wertvoll. Senioren profitieren besonders von der kombinierten medizinischen Betreuung und entspannten Urlaubsatmosphäre vieler Kurhotels.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellnessurlaub" },
  { href: "/urlaubsthemen/seniorenreisen/", label: "🌟 Seniorenreisen" },
  { href: "/urlaubsthemen/aktivurlaub/", label: "🏃 Aktivurlaub" },
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Kurreisen",        item: "https://www.urlaubfinder365.de/urlaubsthemen/kurreisen/" },
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
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80"
          alt="Kurreisen – Wellness & Gesundheitsurlaub"
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
            <span className="text-white/90">Kurreisen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-cyan-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            💧 Kurreisen
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Kurreisen {YEAR} günstig buchen<br />
            <span className="text-cyan-200">Heilbäder, Thermalquellen &amp; Naturheilkunde</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Heilende Wasser, medizinische Behandlungen und tiefe Erholung –
            Kurreisen verbinden Gesundheit mit Urlaub für nachhaltige Regeneration.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Medizinische Behandlung", "Thermalquellen & Heilbäder", "Naturheilkunde", "Nachhaltige Erholung"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-cyan-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Kurreisen & Regeneration weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Medizinische Bäder, Thermalbäder und Kur-Behandlungen – die besten Destinationen zur körperlichen Erneuerung.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#0891b2" carouselLabel="Weitere Kur Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Kurreisen erleben gerade einen starken Aufschwung – und das zu Recht. Bad Gastein und Bad Reichenhall bieten exzellente Programme, aber auch Budapest oder Abano Terme in Norditalien kombinieren medizinische Qualität mit einem tollen Urlaubserlebnis."
          accentColor="#0891b2"
          tip="Mein Tipp: Bad Gastein oder Budapest Thermen"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&category=3&minRecommrate=70"
          deeplinkLabel="Susannes Kur-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Kurreisen Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Kur- und Gesundheitsreisen — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="kur"
          from="14"
          to="365"
          duration="7-14"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Kurreisen?"
        accentColor="#0891b2"
        items={[
          { emoji: "🏥", title: "Medizinische Behandlung", desc: "Ärztlich begleitete Behandlungen und Therapieprogramme" },
              { emoji: "💧", title: "Thermalquellen & Mineral", desc: "Heilende Mineralwässer und natürliche Thermalquellen" },
              { emoji: "🌿", title: "Naturheilkunde & Kräuter", desc: "Pflanzliche Wirkstoffe, Hydrotherapie und sanfte Heilmethoden" },
              { emoji: "😌", title: "Tiefe Regeneration", desc: "Regeneration für Körper, Geist und Seele über mehrere Tage" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Kurreisen – Gesundheit und Erholung vereint</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Kurreisen haben in Europa eine jahrhundertelange Tradition: Schon die Römer
          schätzten die heilenden Eigenschaften natürlicher Thermalquellen. Heute
          verbinden moderne Kur-Hotels medizinisches Know-how mit zeitgemäßem Komfort
          und bieten umfassende Gesundheitsprogramme, die weit über den normalen
          Wellnessurlaub hinausgehen. Balneotherapie (Heilbäder), Hydrotherapie,
          Physiotherapie und Naturheilkunde-Anwendungen werden von erfahrenen
          Medizinern und Therapeuten begleitet.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Europas bekannteste Kur-Destinationen sind das böhmische Bäderdreieck in
          Tschechien (Karlsbad, Marienbad), die deutschen Kurbäder (Baden-Baden,
          Bad Kissingen) sowie die ungarischen Thermalbäder-Städte Budapest und
          Hévíz. Im Mittelmeerraum bieten Anlagen in der Türkei (Pamukkale,
          Afyon) einzigartige Thermalwasser-Erlebnisse. Alle diese Destinationen
          verbinden medizinische Qualität mit einer angenehmen, touristischen
          Urlaubsatmosphäre.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Kurreisen-Angebote werden nach Hotels mit nachgewiesenen
          Kur-Einrichtungen und Gesundheitsprogrammen gefiltert. Ob präventive
          Auszeit, Erholung nach einer Erkrankung oder jahrzehntelange Kur-Tradition
          erleben – hier finden Sie täglich aktuelle Angebote für Ihre Gesundheitsreise.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#0891b2" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Kurreise-Ziele"
        heading="Kurreisen & Städtetrips im Überblick"
        accentColor="#0891b2"
        destinations={[
          { slug: "wien", label: "Kurreise Wien" },
          { slug: "rom", label: "Kurreise Rom" },
          { slug: "florenz", label: "Kurreise Florenz" },
          { slug: "amsterdam", label: "Kurreise Amsterdam" },
          { slug: "paris", label: "Kurreise Paris" },
          { slug: "venedig", label: "Kurreise Venedig" },
          { slug: "marrakesch", label: "Kurreise Marrakesch" },
          { slug: "lissabon", label: "Kurreise Lissabon" },
          { slug: "barcelona", label: "Kurreise Barcelona" },
          { slug: "dubai", label: "Kurreise Dubai" },
          { slug: "split", label: "Kurreise Split" },
          { slug: "dubrovnik", label: "Kurreise Dubrovnik" },
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
