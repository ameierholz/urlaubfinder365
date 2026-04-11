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
  title: `🏖 Strandurlaub ${YEAR} günstig buchen – Traumhotels am Meer`,
  description: `Strandurlaub ${YEAR} günstig buchen ✓ Beachfront-Hotels ✓ Traumstrände weltweit ✓ Täglich aktualisierte Angebote ✓ Jetzt Traumstrand sichern!`,
  keywords: ["Strandurlaub günstig", "Strandurlaub buchen", "Strandhotel", "Beachfront Hotel", "Strandurlaub Türkei", "Strandurlaub Mallorca", "Urlaub am Meer", "Badeurlaub buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/strandurlaub/",
  },
  openGraph: {
    title: `🏖 Strandurlaub ${YEAR} – Traumhotels am Meer | Urlaubfinder365`,
    description: `Strandurlaub ${YEAR} günstig buchen ✓ Beachfront-Hotels ✓ Traumstrände weltweit ✓ Täglich aktualisierte Angebote ✓ Jetzt Traumstrand sichern!`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/strandurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Strandurlaub günstig buchen – Traumhotels am Meer auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Die türkische Riviera beheimatet einige der beeindruckendsten Sandstrände Europas: Lara Beach bei Antalya erstreckt sich über Kilometer feinen goldenen Sands, Side besticht durch sein einzigartiges Panorama zwischen antiken Ruinen und türkisblauem Meer, und Alanya trumpft mit einer dramatischen Felsenkulisse auf. Gepaart mit dem warmen Mittelmeerklima, exzellentem All-Inclusive-Angebot und günstigen Pauschalpreisen ist die Türkei die erste Wahl für den perfekten Strandurlaub.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Kristallklares Wasser und weiße Sandstrände auf Mallorca, Ibiza & Formentera.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=100000" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"365 Tage Sommer: Traumstrände auf Fuerteventura, Teneriffa & Gran Canaria.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=851" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta, Rhodos & Korfu: türkisblaues Wasser und einsame Buchten.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&countryId=GR" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Mykonos, Santorini & Kos: traumhafte Buchten und azurblaues Ägäisches Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=100002" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada & Marsa Alam: kristallklares Rotes Meer mit Korallenriffen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=651" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Kuba, Mexiko & Dominikanische Republik: endlose weiße Traumstrände.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=100017" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phi Phi, Phuket & Samui: tropische Strände inmitten üppiger Natur.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=100220" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: wilde Atlantikstrände mit imposanten Felsenformationen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&regionId=725" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", teaser:"Sardinien: das klarste Wasser Europas und fast unberührte Sandstrände.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=65&countryId=IT" },
];

const FAQ = [
  {
    q: "Was sind die schönsten Strandurlaub-Ziele in Europa?",
    a: "Zu den beliebtesten europäischen Strandreisezielen zählen Mallorca, Ibiza und Menorca auf den Balearen, die Algarve in Portugal, Kreta, Rhodos und Santorin in Griechenland sowie die Türkische Riviera um Antalya und Bodrum. Außerhalb Europas sind Ägypten (Hurghada, Sharm el-Sheikh) und die Kanarischen Inseln (Teneriffa, Lanzarote) ganzjährig beliebt.",
  },
  {
    q: "Wann ist die beste Reisezeit für Strandurlaub?",
    a: "Für Mittelmeer-Ziele ist die Hochsaison von Juni bis September ideal – mit Wassertemperaturen zwischen 23 und 28 Grad. Die Kanaren und Ägypten bieten ganzjährig angenehme Temperaturen und eignen sich auch im Winter für Strandurlaub. Die Nebensaison (Mai und Oktober) ist oft günstiger und weniger überfüllt bei noch guten Bedingungen.",
  },
  {
    q: "Was bedeutet Beachfront oder strandnah bei Hotels?",
    a: "Beachfront-Hotels liegen direkt am Strand – oft nur wenige Meter vom Wasser entfernt. Strandnah bedeutet meist eine Gehzeit von 5 bis 15 Minuten. Achten Sie bei der Buchung auf den tatsächlichen Abstand zum Strand, da Hotelangaben variieren können. Reisebewertungen und Fotos geben oft einen besseren Eindruck als die offizielle Beschreibung.",
  },
  {
    q: "Welche Verpflegung empfiehlt sich beim Strandurlaub?",
    a: "All-Inclusive ist beim Strandurlaub sehr beliebt, da Sie jederzeit essen, trinken und Snacks genießen können – ideal für aktive Urlauber am Strand. Halbpension eignet sich, wenn Sie abends gerne lokale Restaurants erkunden möchten. Für flexible Individualgäste ist Frühstück oder Übernachtung ohne Verpflegung die beste Wahl.",
  },
  {
    q: "Gibt es günstige Strandurlaub-Angebote außerhalb der Sommersaison?",
    a: "Ja, die Schulter-Saison (Mai, Juni, September, Oktober) bietet deutlich günstigere Preise bei noch guten Strand- und Wetterbedingungen. Auch Last-Minute-Angebote im Sommer können sehr attraktiv sein. Die Kanarischen Inseln und Ägypten sind zudem perfekte Winterdestinationen für günstigen Strandurlaub außerhalb der Hochsaison.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/familienurlaub/", label: "👨‍👩‍👧‍👦 Familienurlaub" },
  { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellnessurlaub" },
  { href: "/urlaubsthemen/budget-bis-1000/", label: "💰 Budget bis 1.000 €" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Strandurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/strandurlaub/" },
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
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Strandurlaub am schönsten Meer der Welt"
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
            <span className="text-white/90">Strandurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-teal-600/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🏖️ Strandurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Strandurlaub {YEAR} günstig buchen<br />
            <span className="text-teal-200">Traumhotels &amp; Beachfront-Hotels weltweit</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Weißer Sand, türkisblaues Meer und Hotels in bester Strandlage – entdecken
            Sie die schönsten Strandurlaub-Angebote zu unschlagbaren Preisen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Strandlage garantiert", "Türkisblaues Wasser", "Wassersport & Schnorcheln", "Strandbar inklusive"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-sky-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Die schönsten Strände weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Traumhafte Sandstrände, türkisblaues Wasser und Sonne satt – in den beliebtesten Strandregionen der Welt.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#0284c7" carouselLabel="Weitere Strand Urlaubsziele" />
      </div>

      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.thomas}
          quote="Strandurlaub ist nicht gleich Strandurlaub: Feinsandige Strände mit glasklarem Wasser findet man vor allem in Griechenland, auf den Kanaren und auf Sardinien. Mein persönliches Geheimnis: Sardinien im September – die Wassertemperaturen sind ideal, die Massen sind weg und die Preise purzeln."
          accentColor="#0284c7"
          tip="Thomas' Geheimtipp: Sardinien im September"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=90&duration=7-7&adults=2&category=3&minRecommrate=60&countryId=IT"
          deeplinkLabel="Thomas' Strandtipps ansehen"
        />
      </div>

      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-teal-600 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Strandurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Strandhotels in bester Lage — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="bea,ben"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Strandurlaub?"
        accentColor="#0284c7"
        items={[
          { emoji: "🌊", title: "Direkte Strandlage", desc: "Aufwachen und wenige Schritte später am Meer liegen" },
              { emoji: "🤿", title: "Schnorcheln & Tauchen", desc: "Faszinierende Unterwasserwelten vor der Hoteltür" },
              { emoji: "🏄", title: "Wassersport", desc: "Surfen, Kitesurfen, Kanufahren – alles direkt am Hotel" },
              { emoji: "🌅", title: "Sonnenuntergang", desc: "Unvergleichliche Abendstimmung direkt am Wasser genießen" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Strandurlaub – Erholung direkt am Meer</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Strandurlaub ist und bleibt die beliebteste Urlaubsform der Deutschen.
          Das sanfte Meeresrauschen, warmer Sand zwischen den Zehen und die wohltuende
          Sonne – diese Kombination sorgt für Erholung, die man nirgendwo anders findet.
          Hotels in direkter Strandlage bieten den ultimativen Komfort: aufwachen und
          wenige Schritte später am Meer liegen. Besonders attraktiv sind All-Inclusive
          Angebote, bei denen Essen, Trinken und Freizeitaktivitäten bereits inklusive
          sind.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Europas Strandparadiese wie Mallorca, die griechischen Inseln, die Türkische
          Riviera und die Algarve in Portugal locken jedes Jahr Millionen von Urlaubern.
          Wer ganzjährig Sonne sucht, findet auf den Kanarischen Inseln oder in Ägypten
          das ganze Jahr über ideale Strandwetter-Bedingungen. Wassersportbegeisterte
          kommen auf Korfu, Mykonos oder Fuerteventura auf ihre Kosten.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Strandurlaub-Angebote werden täglich aktualisiert und zeigen Ihnen
          ausschließlich Hotels mit nachgewiesener Qualität. Wir filtern nach
          Strandlage, Empfehlungsrate und Preis-Leistungs-Verhältnis, damit Sie das
          perfekte Strandurlaubsangebot für Ihre Bedürfnisse finden.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#0284c7" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke interne Verlinkung) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Beliebte Strand-Reiseziele buchen</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Strandurlaub Reiseziele im Überblick</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { href: "/urlaubsziele/mallorca/",     label: "Strandurlaub Mallorca" },
            { href: "/urlaubsziele/ibiza/",         label: "Strandurlaub Ibiza" },
            { href: "/urlaubsziele/teneriffa/",     label: "Strandurlaub Teneriffa" },
            { href: "/urlaubsziele/fuerteventura/", label: "Strandurlaub Fuerteventura" },
            { href: "/urlaubsziele/lanzarote/",     label: "Strandurlaub Lanzarote" },
            { href: "/urlaubsziele/gran-canaria/",  label: "Strandurlaub Gran Canaria" },
            { href: "/urlaubsziele/antalya/",       label: "Strandurlaub Antalya" },
            { href: "/urlaubsziele/side/",          label: "Strandurlaub Side" },
            { href: "/urlaubsziele/alanya/",        label: "Strandurlaub Alanya" },
            { href: "/urlaubsziele/kreta/",         label: "Strandurlaub Kreta" },
            { href: "/urlaubsziele/rhodos/",        label: "Strandurlaub Rhodos" },
            { href: "/urlaubsziele/korfu/",         label: "Strandurlaub Korfu" },
            { href: "/urlaubsziele/hurghada/",      label: "Strandurlaub Hurghada" },
            { href: "/urlaubsziele/maldiven/",      label: "Strandurlaub Malediven" },
            { href: "/urlaubsziele/phuket/",        label: "Strandurlaub Phuket" },
            { href: "/urlaubsziele/bali/",          label: "Strandurlaub Bali" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#0284c7] hover:text-[#0284c7] text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-all group">
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#0284c7] text-xs ml-1 shrink-0">→</span>
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
