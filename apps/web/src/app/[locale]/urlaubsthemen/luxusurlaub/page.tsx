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
  title: `💎 Luxusurlaub ${YEAR} buchen – 5-Sterne Hotels & Resorts`,
  description: `Luxusurlaub ${YEAR} in 5-Sterne Hotels buchen ✓ ≥90% Empfehlung ✓ Wellness, Strand & Exklusivität ✓ Täglich aktuelle Luxusreisen.`,
  keywords: ["Luxusurlaub buchen", "5 Sterne Hotel", "Luxushotel", "Luxusreise", "Premium Urlaub", "Luxus All Inclusive", "Exklusiver Urlaub", "High-End Reise"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/luxusurlaub/",
  },
  openGraph: {
    title: `💎 Luxusurlaub ${YEAR} – 5-Sterne Hotels | Urlaubfinder365`,
    description: `Luxusurlaub ${YEAR} in 5-Sterne Hotels buchen ✓ ≥90% Empfehlung ✓ Wellness, Strand & Exklusivität ✓ Täglich aktuelle Luxusreisen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/luxusurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Luxusurlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", teaser:"Dubai und die Vereinigten Arabischen Emirate definieren Luxusreisen neu: Das ikonische Burj Al Arab, das einzige Sieben-Sterne-Hotel der Welt, steht sinnbildlich für eine Destination, die keine Wünsche offenlässt – von Rolls-Royce-Transfers über Privatstrände bis hin zu Michelin-Restaurants mit Blick auf die glitzernde Skyline. Wer einmal die unvergleichliche Gastfreundschaft und Extravaganz der Emirate erlebt hat, versteht, warum Dubai zur Welthauptstadt des Luxustourismus geworden ist.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=650" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Privat-Villas auf Phuket & Koh Samui mit Butler-Service und Infinity-Pool.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=100220" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Mykonos & Santorini: ikonische Luxus-Hideaways mit Meerblick-Infinity-Pool.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=100002" },
  { name:"Karibik", flag:"🌴", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Exklusive Resorts in Barbados & St. Lucia – fernab vom touristischen Trubel.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=100017" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Belek & Bodrum: Weltklasse-Golfresorts und Luxusanlagen an der Ägäis.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Boutique-Hotels & 5-Sterne-Resorts mit Panoramablick auf Mallorca & Ibiza.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=100000" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Sharm el-Sheikh & Hurghada: traumhafte 5-Sterne-Resorts am Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=651" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve: exklusive Design-Hotels und Golfresorts an atemberaubenden Klippen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=90&regionId=725" },
];

const FAQ = [
  {
    q: "Was unterscheidet ein 5-Sterne-Hotel von einem 4-Sterne-Hotel?",
    a: "5-Sterne-Hotels bieten höchste Standards in allen Bereichen: großzügigere Zimmer und Suiten, eine exklusive Gastronomie mit Gourmetrestaurants, persönlicheren Service (oft ein persönlicher Butler), eine umfangreiche Spa-Anlage, hochwertigere Materialien und Einrichtungen sowie zusätzliche Services wie 24-Stunden-Room-Service, Concierge und Premium-Amenities. Die Empfehlungsraten sind ein guter Indikator für echte Luxusqualität.",
  },
  {
    q: "In welchen Regionen finde ich die besten Luxushotels?",
    a: "Die Malediven gelten als weltweit führend im Luxus-Resortbereich. Die Seychellen, Bora Bora und die Karibik (St. Barths, Turks and Caicos) bieten ebenfalls außergewöhnlichen Luxus. In Europa überzeugen die Amalfiküste, Portofino, Monaco und Santorini mit exklusiven Unterkünften. Für komfortablen Luxus zu attraktiven Preisen sind die Türkei (Bodrum) und Ägypten besonders empfehlenswert.",
  },
  {
    q: "Wie finde ich günstige Luxushotels?",
    a: "Luxushotels können außerhalb der Hochsaison erheblich günstiger sein – oft 30 bis 50 % unter dem Saisonpreis. Frühbucher-Rabatte, Last-Minute-Angebote und Pauschalreisen mit Luxushotels sind weitere Sparmöglichkeiten. Unsere gefilterten Angebote zeigen täglich die besten Luxushotels mit Preisen, die deutlich unter Direktbuchungspreisen liegen können.",
  },
  {
    q: "Welche Verpflegung ist in Luxushotels sinnvoll?",
    a: "In echten Luxusresorts lohnt sich oft die Vollpension oder All-Inclusive, da die Restaurantqualität herausragend ist und man nicht an Kosten denken möchte. Allerdings sollten Urlauber in Destinationen mit lebhafter lokaler Gastronomieszene (Istanbul, Barcelona, Rom) auch die Möglichkeit in Betracht ziehen, lokale Restaurants zu besuchen. Halbpension bietet hier eine gute Balance.",
  },
  {
    q: "Sind Luxusreisen mit Kindern empfehlenswert?",
    a: "Viele Luxusresorts bieten exzellente Kinderangebote – von privaten Kinderclubs bis zu Family-Suiten. Einige der besten Familienresorts weltweit sind 5-Sterne-Hotels, die beide Elternteile und Kinder gleichermaßen begeistern. Adults Only Luxusresorts hingegen bieten eine ruhigere Atmosphäre ohne Kinder, ideal für Paare und Gruppen von Erwachsenen.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/hochzeitsreise/", label: "💒 Hochzeitsreise" },
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
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
    { "@type": "ListItem", position: 3, name: "Luxusurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/luxusurlaub/" },
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
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80&auto=format&fit=crop"
          alt="Luxusurlaub – 5-Sterne Hotels & Resorts"
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
            <span className="text-white/90">Luxusurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-amber-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            👑 Luxusurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Luxusurlaub {YEAR} günstig buchen<br />
            <span className="text-amber-200">5-Sterne Hotels &amp; exklusive Resorts</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Erleben Sie Urlaub auf höchstem Niveau: exklusive Resorts mit privatem
            Strand, persönlichem Butler und Spa – nur die besten Hotels mit
            mindestens 90 % Empfehlungsrate.
          </p>
          <div className="flex flex-wrap gap-3">
            {["5-Sterne Kategorie", "≥90% HolidayCheck", "Private Spa & Pool", "Butler Service"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-yellow-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Luxusurlaub weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">5-Sterne-Resorts, Butler-Service und Infinity-Pools – die exklusivsten Urlaubsziele für anspruchsvolle Reisende.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#ca8a04" carouselLabel="Weitere Luxus Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.thomas}
          quote="Echter Luxusurlaub bedeutet makellose Aufmerksamkeit und außergewöhnliche Erlebnisse – nicht zwangsläufig das teuerste Hotel. Die Malediven stehen dabei ganz oben: Overwater-Bungalows, türkisblaues Wasser und eine Abgeschiedenheit, die seinesgleichen sucht."
          accentColor="#ca8a04"
          tip="Mein Tipp: Malediven Overwater-Bungalow"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&category=3&minRecommrate=80"
          deeplinkLabel="Thomas' Luxus-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Luxusurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte 5-Sterne-Angebote mit höchster Empfehlungsrate — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="bea,wel,wms,clb"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="5"
          minRecommrate="90"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Luxusurlaub?"
        accentColor="#ca8a04"
        items={[
          { emoji: "⭐", title: "5-Sterne Standard", desc: "Ausschließlich geprüfte Luxushotels mit Spitzenbewertungen" },
              { emoji: "🏝️", title: "Traumlage & Privatstrand", desc: "Private Strände, Infinity-Pools und atemberaubende Aussichten" },
              { emoji: "💆", title: "Private Spa Suite", desc: "Exklusive Spa-Suiten und private Behandlungsräume" },
              { emoji: "🍾", title: "Gastronomie auf höchstem Niveau", desc: "Gourmetrestaurants, persönlicher Butler und Concierge-Service" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Luxusurlaub – Unvergessliche Erlebnisse in 5-Sterne-Resorts</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Luxusurlaub bedeutet mehr als nur ein großes Zimmer: Es ist die Summe aus
          perfektem Service, erstklassiger Lage, exquisiter Gastronomie und
          außergewöhnlichen Erlebnissen. In einem echten 5-Sterne-Resort werden jeder
          Wunsch antizipiert und jedes Detail perfektioniert. Von der frisch gepressten
          Guave beim Frühstück bis zum maßgeschneiderten Abendprogramm – Luxushotels
          setzen Maßstäbe, die den Urlaub zur unvergesslichen Erfahrung machen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Die besten Luxusresorts weltweit finden sich auf den Malediven, in der
          Karibik, auf den Seychellen und in Südostasien. In der Mittelmeerregion
          begeistern exklusive Resorts an der türkischen Ägäis, auf Kreta, Zypern
          und Sardinien. Für europäische Urlauber bieten die Türkei und Ägypten
          besonders attraktive Möglichkeiten für günstigen Luxusurlaub – mit
          5-Sterne-Standard zu Preisen, die deutlich unter westeuropäischen
          Luxushotels liegen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Wir filtern unsere Luxusangebote konsequent nach Empfehlungsrate und
          Hotelkategorie. Nur Hotels mit mindestens 90 % HolidayCheck-Empfehlung
          und 5-Sterne-Einstufung werden angezeigt. So können Sie sicher sein,
          dass jedes angezeigte Angebot wirklich dem Luxusstandard entspricht,
          den Sie verdienen.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#ca8a04" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Luxus-Reiseziele"
        heading="Luxusurlaub Reiseziele im Überblick"
        accentColor="#ca8a04"
        destinations={[
          { slug: "dubai", label: "Luxusurlaub Dubai" },
          { slug: "mallorca", label: "Luxusurlaub Mallorca" },
          { slug: "mykonos", label: "Luxusurlaub Mykonos" },
          { slug: "santorini", label: "Luxusurlaub Santorini" },
          { slug: "ibiza", label: "Luxusurlaub Ibiza" },
          { slug: "paris", label: "Luxusurlaub Paris" },
          { slug: "venedig", label: "Luxusurlaub Venedig" },
          { slug: "marrakesch", label: "Luxusurlaub Marrakesch" },
          { slug: "phuket", label: "Luxusurlaub Phuket" },
          { slug: "halbinsel-bodrum", label: "Luxusurlaub Bodrum" },
          { slug: "korfu", label: "Luxusurlaub Korfu" },
          { slug: "teneriffa", label: "Luxusurlaub Teneriffa" },
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
