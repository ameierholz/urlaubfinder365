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
import { setRequestLocale } from "next-intl/server";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `👨‍👩‍👧‍👦 Familienurlaub ${YEAR} günstig buchen – mit Kinderclub`,
  description: `Familienurlaub ${YEAR} günstig buchen ✓ Hotels mit Kinderclub & Wasserpark ✓ Animation ✓ Für Familien mit Kindern optimiert ✓ Jetzt vergleichen.`,
  keywords: ["Familienurlaub günstig", "Familienurlaub buchen", "Familienurlaub Türkei", "Familienurlaub Mallorca", "Hotel mit Kinderclub", "Familienhotel", "Urlaub mit Kindern", "Familienreise buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/familienurlaub/",
  },
  openGraph: {
    title: `👨‍👩‍👧‍👦 Familienurlaub ${YEAR} – Hotels mit Kinderclub | Urlaubfinder365`,
    description: `Familienurlaub ${YEAR} günstig buchen ✓ Hotels mit Kinderclub & Wasserpark ✓ Animation ✓ Für Familien mit Kindern optimiert ✓ Jetzt vergleichen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/familienurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Familienurlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Kein Land in Europa wird so sehr mit kinderfreundlichem Familienurlaub verbunden wie die Türkei: Riesige All-Inclusive-Resorts in Antalya und Belek verfügen über eigene Wasserparks, Kinderclubs für alle Altersgruppen und professionelle Animationsteams, die den Kleinen vom Morgen bis zum Abend unvergessliche Erlebnisse bereiten. Eltern können am Pool entspannen, während der Nachwuchs sicher betreut wird – und das zu Preisen, die die ganze Familie lächeln lassen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Familien-Pauschalreisen auf Mallorca & Menorca – ruhige Buchten und flaches Wasser.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=100000" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: flaches Wasser, Sandstrände und viele Kinderattraktionen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&countryId=GR" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Mildes Klima das ganze Jahr – ideal für Familien mit kleinen Kindern.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=851" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada: günstige Familienhotels am Roten Meer mit Schnorchelmöglichkeiten.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=651" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"All-Inclusive Familienresorts in Mexiko und der Dominikanischen Republik.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=100017" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Koh Samui: abenteuerliche Ausflüge und ruhige Strandabschnitte.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=100220" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: breite Sandstrände, ruhiges Wasser und familienfreundliche Hotels.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&regionId=725" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", teaser:"Sizilien & Sardinien: süditalienisches Flair mit kinderfreundlichen Stränden.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&children=1&category=3&minRecommrate=65&countryId=IT" },
];

const FAQ = [
  {
    q: "Was macht ein gutes Familienhotel aus?",
    a: "Ein gutes Familienhotel bietet neben komfortablen Familienzimmern oder -suiten auch einen Kinderclub mit professioneller Betreuung, einen Wasserpark oder Kinderpool sowie ein abwechslungsreiches Animationsprogramm. Wichtig sind auch kinderfreundliche Buffets, Frühstückszeiten und eine sichere Umgebung, in der sich Kinder frei bewegen können.",
  },
  {
    q: "Ab welchem Alter können Kinder im Kinderclub betreut werden?",
    a: "Die meisten Kinderclubs nehmen Kinder ab 3 oder 4 Jahren auf. Viele Hotels bieten auch separate Betreuung für Kleinkinder (ab 1 Jahr) an. Für Teenager gibt es häufig eigene Teen-Clubs mit spezifischen Aktivitäten wie Sportturnieren, Tanzworkshops oder Computerspielen. Das genaue Angebot variiert je nach Hotel.",
  },
  {
    q: "Welche Urlaubsziele eignen sich am besten für den Familienurlaub?",
    a: "Mallorca, Kreta, die Türkische Riviera und die Kanarischen Inseln sind besonders familienfreundlich und bieten eine große Auswahl an Familienhotels. Auch Portugal (Algarve) und Tunesien sind beliebt. Diese Regionen punkten mit ruhigen Stränden, warmen Temperaturen und einer guten touristischen Infrastruktur für Familien.",
  },
  {
    q: "Lohnt sich All-Inclusive beim Familienurlaub?",
    a: "Ja, All-Inclusive ist beim Familienurlaub besonders empfehlenswert. Kinder essen oft mehr als geplant, trinken viele Softdrinks und möchten häufig Eis. Mit All-Inclusive haben Sie volle Kostenkontrolle und müssen sich keine Gedanken über zusätzliche Ausgaben machen. Das erleichtert die Urlaubsplanung und entspannt das Budget erheblich.",
  },
  {
    q: "Wie früh sollte man einen Familienurlaub buchen?",
    a: "Für Familienurlaube in den Sommerferien empfiehlt sich eine Buchung 6 bis 9 Monate im Voraus, da die beliebten Familienhotels schnell ausgebucht sind. Außerhalb der Schulferien sind auch kurzfristigere Buchungen möglich. Frühbucher profitieren zudem oft von besseren Zimmerlagen und Rabatten.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/aktivurlaub/", label: "🏃 Aktivurlaub" },
  { href: "/urlaubsthemen/budget-bis-1000/", label: "💰 Budget bis 1.000 €" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Familienurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/familienurlaub/" },
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
          src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
          alt="Familienurlaub – Hotels für die ganze Familie"
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
            <span className="text-white/90">Familienurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-sky-600/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            👨‍👩‍👧‍👦 Familienurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Familienurlaub {YEAR} günstig buchen<br />
            <span className="text-sky-200">Mit Kinderclub, Wasserpark &amp; Animation</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Unvergessliche Ferien mit Kinderclub, Wasserpark und Animation – perfekt
            abgestimmt auf die Bedürfnisse von Familien mit Kindern.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Kinderclub & Animation", "Wasserpark & Pools", "Kinderbuffet", "Familienfreundliche Zimmer"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Familienurlaub weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Perfekte Familienhotels mit Kinderbetreuung, Pools und Action für Klein und Groß – in den familienfreundlichsten Urlaubsregionen.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#d97706" carouselLabel="Weitere Familien Urlaubsziele" />
      </div>

      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.julia}
          quote="Mit Kindern zu reisen ist wunderbar – wenn das Hotel mitspielt! Die großen türkischen und ägyptischen Resorts haben Wasserparks, die selbst Teenager begeistern, und trotzdem Ruhe-Bereiche für Eltern. Mein wichtigster Tipp: Achten Sie auf einen Kinderclub ab 3 Jahren – das ist Gold wert für entspannte Elternzeit!"
          accentColor="#f59e0b"
          tip="Juliasempfehlung: Side/Belek – tolle Waterparks, faire Preise"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=90&duration=7-7&adults=2&children=2&childrenAges=8,6&category=3&minRecommrate=60&regionId=724"
          deeplinkLabel="Julias Familientipps ansehen"
        />
      </div>

      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sky-600 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Familienurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Pauschalreisen für Familien — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="chf,ecc,eec,emd,emc"
          from="14"
          to="365"
          duration="7-14"
          adults="2"
          children="9,9"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Familienurlaub mit uns buchen?"
        accentColor="#d97706"
        items={[
          { emoji: "🎠", title: "Kinderclub", desc: "Professionelle Betreuung und Spaßprogramm für alle Altersgruppen" },
              { emoji: "🏊", title: "Wasserpark", desc: "Rutschen, Wasserspiele und Kinderbecken für stundenlangen Badespaß" },
              { emoji: "🎭", title: "Animation", desc: "Tages- und Abendprogramm für Kinder und die ganze Familie" },
              { emoji: "🍽️", title: "Kinderverpflegung", desc: "Altersgerechte Gerichte und kinderfreundliche Buffets täglich" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Familienurlaub – Pauschalreisen für die ganze Familie</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Ein gelungener Familienurlaub braucht mehr als nur Sonne und Meer. Kinder
          wollen betreut, beschäftigt und begeistert werden – und Eltern möchten sich
          dabei auch erholen. Familienhotels mit Kinderclub, Wasserpark und
          Animationsteam bieten genau das: ein rundum sorgenloses Urlaubspaket für alle
          Altersgruppen. All-Inclusive macht die Sache noch einfacher, denn so ist für
          das leibliche Wohl aller Familienmitglieder rund um die Uhr gesorgt.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die beliebtesten Familiendestinationen in Europa sind Mallorca, Kreta, die
          Türkische Riviera sowie die Kanaren. Diese Regionen bieten flaches, ruhiges
          Meer, kindgerechte Strandabschnitte und eine hervorragende
          Hotelinfrastruktur. Viele Resorts verfügen über ausgedehnte Wasserparks,
          Mini-Clubs für verschiedene Altersgruppen und spezielle Teenager-Bereiche.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Beim Buchen lohnt es sich, auf Hotels zu achten, die speziell für Familien
          ausgezeichnet wurden. Achten Sie auf Familienzimmer oder verbundene Zimmer,
          auf Betreuungszeiten im Kinderclub und auf das Angebot an
          Wassersportmöglichkeiten. Unsere gefilterten Angebote zeigen Ihnen täglich
          die besten Familienhotels zu attraktiven Preisen.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#d97706" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Beliebte Familien-Reiseziele</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Familienurlaub Reiseziele im Überblick</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { href: "/urlaubsziele/mallorca/",     label: "Familienurlaub Mallorca" },
            { href: "/urlaubsziele/teneriffa/",     label: "Familienurlaub Teneriffa" },
            { href: "/urlaubsziele/gran-canaria/",  label: "Familienurlaub Gran Canaria" },
            { href: "/urlaubsziele/antalya/",       label: "Familienurlaub Antalya" },
            { href: "/urlaubsziele/kreta/",         label: "Familienurlaub Kreta" },
            { href: "/urlaubsziele/rhodos/",        label: "Familienurlaub Rhodos" },
            { href: "/urlaubsziele/hurghada/",      label: "Familienurlaub Hurghada" },
            { href: "/urlaubsziele/fuerteventura/", label: "Familienurlaub Fuerteventura" },
            { href: "/urlaubsziele/lanzarote/",     label: "Familienurlaub Lanzarote" },
            { href: "/urlaubsziele/side/",          label: "Familienurlaub Side" },
            { href: "/urlaubsziele/alanya/",        label: "Familienurlaub Alanya" },
            { href: "/urlaubsziele/korfu/",         label: "Familienurlaub Korfu" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#d97706] hover:text-[#d97706] text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-all group">
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#d97706] text-xs ml-1 shrink-0">→</span>
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
