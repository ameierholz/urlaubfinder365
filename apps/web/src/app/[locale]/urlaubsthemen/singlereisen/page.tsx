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

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🎒 Singlereisen ${YEAR} günstig buchen – allein verreisen`,
  description: `Singlereisen ${YEAR} günstig buchen ✓ Ohne Einzelzimmerzuschlag ✓ Alleinreisende willkommen ✓ Neue Leute kennenlernen ✓ Jetzt vergleichen.`,
  keywords: ["Singlereisen günstig", "Singleurlaub", "Alleinreisende", "Urlaub alleine", "Singlereise buchen", "Ohne Einzelzimmerzuschlag", "Solo Urlaub", "Alleinreisende Urlaub"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/singlereisen/",
  },
  openGraph: {
    title: `🎒 Singlereisen ${YEAR} – allein verreisen | Urlaubfinder365`,
    description: `Singlereisen ${YEAR} günstig buchen ✓ Ohne Einzelzimmerzuschlag ✓ Alleinreisende willkommen ✓ Neue Leute kennenlernen ✓ Jetzt vergleichen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/singlereisen/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Singlereisen günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80", teaser:"Die Balearen sind für Alleinreisende ein Glücksgriff: Mallorca bietet mit seiner kosmopolitischen Urlaubsatmosphäre und den belebten Strandpromenaden jede Menge Gelegenheiten, neue Bekanntschaften zu schließen, während Ibiza mit seinem weltberühmten Nachtleben und offenen Vibe Solotrips zu einem unvergesslichen Erlebnis macht. Wer alleine reist, aber nicht allein sein möchte, findet auf den Balearen die perfekte Bühne.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=100000" },
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80", teaser:"Antalya & Alanya: internationale Urlauberatmosphäre und Einzelreisende herzlich willkommen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=724" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", teaser:"Kreta, Rhodos & Korfu: Kultur, Geschichte und entspanntes Solo-Urlaubsflair.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&countryId=GR" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", teaser:"Gran Canaria & Teneriffa: ganzjähriger Sonnenschein für Alleinreisende.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=851" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", teaser:"Hurghada: günstige All-Inclusive Einzelreise am warmen Roten Meer.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=651" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", teaser:"Algarve & Lissabon: ideal für Alleinreisende – offen, sicher und weltoffen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=725" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", teaser:"Phuket & Bangkok: weltoffen und perfekt für Solotrips mit vielen Begegnungen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=100220" },
  { name:"Griech. Inseln", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80", teaser:"Kos & Mykonos: pulsierendes Nachtleben und entspannte Tagszeiten für Solo-Reisende.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=1&category=3&minRecommrate=65&regionId=100002" },
];

const FAQ = [
  {
    q: "Was ist ein Einzelzimmerzuschlag und wie vermeide ich ihn?",
    a: "Hotels berechnen für Einzelbelegung eines Doppelzimmers oft einen Aufpreis von 20 bis 50 %, da die Fixkosten pro Zimmer gleich bleiben. Diesen Zuschlag vermeiden Sie durch spezielle Singlereise-Angebote, die für Alleinreisende ohne Aufpreis konzipiert sind. Auch einige All-Inclusive-Hotels haben Einzel-Angebote zu attraktiven Preisen, besonders in der Nebensaison.",
  },
  {
    q: "Ist Solo-Reisen sicher?",
    a: "Solo-Reisen ist heute sehr sicher, besonders in bekannten Tourismusdestinationen. Standardmäßige Vorsichtsmaßnahmen wie das Aufbewahren von Reisedokumenten im Hotelsafe, das Informieren von Bekannten über Urlaubspläne und das Vermeiden von abgelegenen Gegenden nachts sind ausreichend. Für Frauen allein reisend sind mediterrane Resorts und asiatische Touristenzentren besonders sicher.",
  },
  {
    q: "Welche Destinationen eignen sich am besten für Alleinreisende?",
    a: "Thailand ist besonders bei Solo-Reisenden beliebt – freundliche Bevölkerung, günstige Preise und viele Mitreisende in der gleichen Situation. Portugal (Lissabon, Porto, Algarve) ist in Europa führend für Solo-Reisende. Auch Bali, die Türkei (Istanbul, Bodrum) und Ägypten bieten hervorragende Infrastruktur für Alleinreisende. Städtereisen sind generell ideal für Singles.",
  },
  {
    q: "Wie finde ich als Alleinreisender Anschluss zu anderen Reisenden?",
    a: "Hostels haben gemeinschaftliche Bereiche, die Begegnungen fördern, aber auch viele 3- bis 4-Sterne-Hotels sind sozial ausgerichtet. Geführte Tagestouren und Gruppenausflüge sind hervorragend zum Kennenlernen. Reisende Apps und Community-Plattformen wie Meetup oder Couchsurfing helfen, lokale Events zu finden. All-Inclusive-Hotels mit lebhafter Poolbar-Atmosphäre fördern natürliche Begegnungen.",
  },
  {
    q: "Sollte ich als Alleinreisender eine Pauschalreise oder individuell buchen?",
    a: "Pauschalreisen haben für Solo-Reisende den Vorteil, dass Flug und Hotel koordiniert sind, es oft spezielle Einzelpreise gibt und der Reiseveranstalter im Problemfall hilft. Individuelle Buchungen bieten mehr Flexibilität beim Itinerar. Für Erstmals-Solo-Reisende sind Pauschalreisen mit Gruppenaktivitäten besonders empfehlenswert, da sie eine natürliche Gemeinschaft schaffen.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/aktivurlaub/", label: "🏃 Aktivurlaub" },
  { href: "/urlaubsthemen/staedtereisen/", label: "🏙️ Städtereisen" },
  { href: "/urlaubsthemen/abenteuerurlaub/", label: "🧗 Abenteuerurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Singlereisen",        item: "https://www.urlaubfinder365.de/urlaubsthemen/singlereisen/" },
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
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1600&q=80&auto=format&fit=crop"
          alt="Singlereisen – Urlaub für Alleinreisende"
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
            <span className="text-white/90">Singlereisen</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-teal-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🧳 Singlereisen
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Singlereisen {YEAR} günstig buchen<br />
            <span className="text-teal-200">Neue Freundschaften &amp; maximale Freiheit</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Als Alleinreisender die Welt entdecken – ohne Kompromisse, ohne
            Einzelzimmerzuschlag und mit der Chance, weltweit Menschen kennenzulernen.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Kein Einzelzimmerzuschlag", "Gruppentouren verfügbar", "Neue Menschen kennenlernen", "Maximale Flexibilität"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Solo-Urlaubsziele weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Als Alleinreisender die Welt entdecken – entspannte Einzelzimmer und tolle Destinationen ohne Einzelzimmer-Zuschlag.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#7c3aed" carouselLabel="Weitere Single Urlaubsziele" />
      </div>


      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.manuel}
          quote="Singlereisen haben einen riesigen Vorteil: ich bestimme allein das Tempo. Mein Favorit sind geführte Gruppenreisen nach Marokko oder Thailand – man lernt schnell andere Reisende kennen und teilt unvergessliche Erlebnisse, ohne auf eigene Flexibilität zu verzichten."
          accentColor="#7c3aed"
          tip="Mein Tipp: Gruppenreise Thailand oder Marokko"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=1&category=3&minRecommrate=70"
          deeplinkLabel="Manuels Single-Tipps"
        />
      </div>
      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-teal-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Singlereisen Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Urlaubsangebote für Alleinreisende — inklusive Flug, Hotel und Transfer.
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
          duration="7-7"
          adults="1"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Singlereisen?"
        accentColor="#7c3aed"
        items={[
          { emoji: "👤", title: "Solo reisen ohne Aufpreis", desc: "Viele Hotels ohne Einzelzimmerzuschlag für Alleinreisende" },
              { emoji: "🤝", title: "Gruppenaktivitäten", desc: "Geführte Gruppenreisen, um gleichgesinnte Reisende zu treffen" },
              { emoji: "🌍", title: "Weltoffene Atmosphäre", desc: "Internationale Gäste und gemeinsame Aktivitäten verbinden" },
              { emoji: "🔓", title: "Volle Freiheit", desc: "Eigenes Tempo, eigene Entscheidungen – vollständige Unabhängigkeit" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Singlereisen – Solo unterwegs und frei wie nie</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Solo reisen liegt im Trend: Immer mehr Menschen entscheiden sich bewusst
          dafür, alleine zu verreisen – sei es nach einer Trennung, weil Freunde
          keinen Urlaub haben, oder einfach weil man die maximale Freiheit genießen
          möchte. Ohne Kompromisse beim Urlaubsziel, ohne Diskussionen über das
          Abendrestaurant und ohne Rücksicht auf den Tagesplan anderer. Solo-Reisen
          ist eine der befreiendsten Erfahrungen, die man machen kann – und sie
          stärkt das Selbstvertrauen nachhaltig.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Für Alleinreisende gibt es heute zahlreiche spezialisierte Angebote.
          Viele All-Inclusive-Hotels in der Türkei, Ägypten und auf den Kanaren
          bieten Einzel-Arrangements ohne den üblichen Einzelzimmerzuschlag an.
          Auch Gruppenreisen für Singles sind beliebt: Hier reisen Gleichgesinnte
          gemeinsam, teilen Erlebnisse und knüpfen neue Freundschaften – mit der
          Freiheit, jederzeit alleine Zeit zu verbringen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere gefilterten Angebote für Alleinreisende zeigen Hotels und Resorts,
          die sich besonders für Solo-Urlauber eignen – mit lebhafter Poolatmosphäre,
          Gruppenaktivitäten und einer offenen Community von Mitreisenden aus aller
          Welt.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#7c3aed" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <ThemeDestinationLinks
        eyebrow="Beliebte Single-Reiseziele"
        heading="Singlereisen Reiseziele im Überblick"
        accentColor="#7c3aed"
        destinations={[
          { slug: "ibiza", label: "Single Ibiza" },
          { slug: "mykonos", label: "Single Mykonos" },
          { slug: "mallorca", label: "Single Mallorca" },
          { slug: "phuket", label: "Single Phuket" },
          { slug: "dubrovnik", label: "Single Dubrovnik" },
          { slug: "split", label: "Single Split" },
          { slug: "barcelona", label: "Single Barcelona" },
          { slug: "amsterdam", label: "Single Amsterdam" },
          { slug: "lissabon", label: "Single Lissabon" },
          { slug: "marrakesch", label: "Single Marrakesch" },
          { slug: "korfu", label: "Single Korfu" },
          { slug: "rom", label: "Single Rom" },
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
