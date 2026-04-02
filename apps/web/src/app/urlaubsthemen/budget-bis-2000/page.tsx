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

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `👑 Urlaub bis 2.000€ – Luxus-Pauschalreisen ${YEAR}`,
  description: `Urlaub bis 2.000€ pro Person ${YEAR}: Luxuriöse Pauschalreisen ✓ 5 Sterne Hotels ✓ Suite & Meerblick ✓ Ultra All Inclusive ✓ Jetzt buchen.`,
  keywords: ["Urlaub bis 2000 Euro", "Luxus Pauschalreise", "5 Sterne Hotel günstig", "Ultra All Inclusive", "Luxusurlaub buchen", "Premium Reise buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-2000/",
  },
  openGraph: {
    title: `👑 Urlaub bis 2.000€ ${YEAR} – Luxus buchen | Urlaubfinder365`,
    description: `Urlaub bis 2.000€ pro Person ${YEAR}: Luxuriöse Pauschalreisen ✓ 5 Sterne Hotels ✓ Suite & Meerblick ✓ Ultra All Inclusive ✓ Jetzt buchen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-2000/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Budget-bis-2000 günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Mit einem Budget von bis zu 2.000 € pro Person öffnet die Karibik ihre exklusivsten Türen: Auf Barbados, St. Lucia und Jamaika erwarten Sie Premium-Resorts mit privatem Strand, gehobener Cuisine und Spa-Bereich direkt am Meer. Diese Inseln stehen für ein Reiseerlebnis, das Grandezza mit karibischer Leichtigkeit verbindet – und durch clevere Frühbucher- oder Last-Minute-Deals ist dieser Traum überraschend gut erreichbar.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=10-14&adults=2&category=3&minRecommrate=80&regionId=100017&maxPrice=2000" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Koh Samui: Villa-Urlaub und Spa-Resorts der Spitzenklasse.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=10-14&adults=2&category=3&minRecommrate=80&regionId=100220&maxPrice=2000" },
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", teaser:"Dubai: das ultimative Luxus-Erlebnis in den besten Hotels der Welt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=7-10&adults=2&category=3&minRecommrate=85&regionId=650&maxPrice=2000" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Mykonos & Santorini: unvergessliche Luxus-Erlebnisse bis 2.000 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=7-10&adults=2&category=3&minRecommrate=85&regionId=100002&maxPrice=2000" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Ibiza & Formentera: Weltklasse-Resorts und Traumvillen bis 2.000 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=7-10&adults=2&category=3&minRecommrate=85&regionId=100000&maxPrice=2000" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta & Rhodos: 5-Sterne-Resorts mit privatem Strand bis 2.000 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=7-10&adults=2&category=3&minRecommrate=85&countryId=GR&maxPrice=2000" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Sharm el-Sheikh: Taucherparadies und Luxusresorts bis 2.000 € per Person.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=10-14&adults=2&category=3&minRecommrate=80&regionId=651&maxPrice=2000" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: luxuriöse Golfhotels und private Villen-Resorts bis 2.000 €.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=7&to=365&duration=7-10&adults=2&category=3&minRecommrate=85&regionId=725&maxPrice=2000" },
];

const FAQ = [
  {
    q: "Was erwartet mich bei Pauschalreisen bis 2.000 € pro Person?",
    a: "Mit einem Budget von 2.000 € pro Person betreten Sie die Welt des echten Luxusreisens. 5-Sterne-Hotels mit Privatstrand, exklusivem Spa, Gourmet-Restaurants und persönlichem Service werden in diesem Segment regelmäßig angeboten. Auch Fernreisen nach Thailand, Bali oder Mauritius werden in diesem Budget in der Nebensaison realistisch. Es ist das ideale Budget für besondere Anlässe wie Hochzeitsreisen oder runde Geburtstage.",
  },
  {
    q: "Welche 5-Sterne-Destinationen sind bis 2.000 € buchbar?",
    a: "In der Türkei (besonders Bodrum und Antalya) und in Ägypten erhalten Sie für 2.000 € pro Person oft überwältigende 5-Sterne All-Inclusive-Erlebnisse. In Griechenland (Kreta, Mykonos, Santorini) und auf Zypern sind exklusive Resorts buchbar. Für Fernreisen bieten die Malediven und Mauritius in der Nebensaison erste Möglichkeiten in diesem Budget-Rahmen.",
  },
  {
    q: "Lohnen sich Honeymoon- oder Jubiläumsreisen im 2.000-€-Budget?",
    a: "Absolut. 2.000 € pro Person ist ein hervorragendes Budget für Hochzeitsreisen und besondere Jubiläen. Sie können ein 5-Sterne-Hotel mit Honeymoon-Paket buchen, das dekoriertes Zimmer, Champagner, romantisches Dinner und exklusive Spa-Behandlungen umfasst. Dieser Budget-Bereich ermöglicht eine Qualität, die den besonderen Anlass angemessen würdigt.",
  },
  {
    q: "Wie unterscheidet sich das 2.000-€-Budget vom 1.500-€-Budget?",
    a: "Der entscheidende Sprung liegt in der Hotelkategorie und den Reisemöglichkeiten: Mit 2.000 € können Sie konsequent 5-Sterne-Hotels wählen, in der Hauptsaison reisen, längere Aufenthalte (bis 14 Tage) in erstklassigen Resorts planen oder Destinationen mit höherem Preisniveau (Santorini, Ibiza, Zypern) zu attraktiven Konditionen buchen. Auch All-Inclusive mit Gourmet-Option ist häufiger verfügbar.",
  },
  {
    q: "Wann ist die beste Zeit, um Luxusreisen bis 2.000 € zu buchen?",
    a: "Frühbucherrabatte (6 bis 9 Monate vor Abreise) bieten oft die besten Angebote für Luxushotels, da die begehrten Zimmer und Suiten schnell ausgebucht sind. Auch Last-Minute-Angebote für 5-Sterne-Hotels entstehen regelmäßig und können sehr attraktiv sein. In der Nebensaison (Mai, Juni, September, Oktober) sind Luxushotels oft zu deutlich günstigeren Preisen als im Hauptsommer buchbar.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/budget-bis-1500/", label: "💳 Budget bis 1.500 €" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/hochzeitsreise/", label: "💒 Hochzeitsreise" },
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Budget bis 2.000 €",        item: "https://www.urlaubfinder365.de/urlaubsthemen/budget-bis-2000/" },
  ],
};

export default function BudgetBis2000Page() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <div
        className="relative overflow-hidden -mt-24 pt-24 min-h-[480px] flex items-end"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="https://images.unsplash.com/photo-1582610116397-edb72af7e453?w=1920&q=80"
          alt="Günstiger Urlaub bis 2.000 € buchen"
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
            <span className="text-white/90">Budget bis 2.000 €</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-purple-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            ✨ Budget bis 2.000 €
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Urlaub bis 2.000 € – Luxus trifft Budget<br />
            <span className="text-purple-200">5-Sterne Erlebnisse zum fairen Preis</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Das Beste vom Besten: Pauschalreisen bis 2.000 € pro Person öffnen die
            Türen zu 5-Sterne-Resorts, exklusiven Destinationen und unvergesslichen
            Luxuserlebnissen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Max. 2.000 € pro Person", "5-Sterne Hotels", "All-Inclusive möglich", "Top-Bewertungen"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-purple-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Reiseziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Luxusurlaub bis 2.000 € pro Person</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Das Beste der Welt für bis zu 2.000 € – außergewöhnliche Resorts, Fernreisen und Traumziele mit Top-Service.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#9333ea" carouselLabel="Weitere Günstige Reiseziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Bei 2000 Euro steigt die Qualitätsschwelle deutlich – ich buche dann gerne 4-Sterne-Plus-Hotels auf Mallorca. Wer flexibel ist und Last-Minute-Deals nutzt, bekommt sogar 5-Sterne-Qualität für diesen Preis."
          accentColor="#9333ea"
          tip="Mein Tipp: Mallorca 4-Sterne-Plus, Mai oder Oktober"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-7&adults=2&category=3&minRecommrate=70&regionId=100000"
          deeplinkLabel="Susannes Budget-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-purple-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Luxusreisen bis 2.000 €
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Luxus-Pauschalreisen bis 2.000 € pro Person — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          maxPrice="2000"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="4"
          minRecommrate="70"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Urlaub bis 2.000 €?"
        accentColor="#9333ea"
        items={[
          { emoji: "💶", title: "Max. 2.000 € p.P.", desc: "Großzügiges Budget für echte Urlaubsträume" },
              { emoji: "✈️", title: "Flug inklusive", desc: "Komfortabler Hin- und Rückflug bereits im Preis enthalten" },
              { emoji: "👑", title: "5-Sterne Hotels", desc: "Luxuriöse Resorts mit privatem Strand und exklusivem Spa" },
              { emoji: "🏆", title: "Top HolidayCheck", desc: "Ausschließlich Hotels mit herausragenden Gästebewertungen" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Pauschalreisen bis 2.000 € – Luxusreisen für besondere Anlässe</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Ein Budget von 2.000 € pro Person eröffnet die Welt des echten
          Luxusreisens – zu einem Preis, der noch sehr fair ist. In diesem
          Segment erhalten Sie Zugang zu 5-Sterne-Resorts mit privatem Strand,
          exklusivem Spa, Gourmet-Gastronomie und dem außergewöhnlichen Service,
          der Luxushotels auszeichnet. Besonders in der Türkei, Ägypten und auf
          Zypern bietet dieses Budget ein herausragendes Preis-Leistungs-Verhältnis
          bei echter 5-Sterne-Qualität.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Das 2.000-€-Budget eignet sich hervorragend für besondere Anlässe:
          Hochzeitsreisen, runde Geburtstage, Jubiläen oder einfach den lang
          ersehnten Traumurlaub. Viele 5-Sterne-Hotels bieten spezielle Pakete
          für diese Anlässe an – mit dekorierten Zimmern, Champagner und romantischen
          Extras, die das Erlebnis unvergesslich machen. Für Fernreisen wie die
          Malediven oder Mauritius reicht das Budget in der Nebensaison bereits für
          erste Erkundungen dieser Traumdestinationen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Angebote bis 2.000 € werden täglich aktualisiert und zeigen
          ausschließlich Hotels mit mindestens 70 % HolidayCheck-Empfehlung und
          4-Sterne-Plus-Standard. Genießen Sie täglich neue Luxus-Angebote und
          finden Sie Ihre perfekte Traumreise in diesem Premium-Preissegment.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#9333ea" />
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
