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

import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `🧘 Wellnessurlaub ${YEAR} günstig buchen – Spa & Entspannung`,
  description: `Wellnessurlaub ${YEAR} günstig buchen ✓ Hotels mit Spa & Massagen ✓ Sauna & Pool ✓ Für Körper und Geist ✓ Täglich neue Wellnessreisen.`,
  keywords: ["Wellnessurlaub günstig", "Wellnessurlaub buchen", "Wellnesshotel", "Spa Urlaub", "Wellness Türkei", "Wellness Mallorca", "Entspannungsurlaub", "Wellnessreise buchen"],
  alternates: {
    canonical: "https://www.urlaubfinder365.de/urlaubsthemen/wellnessurlaub/",
  },
  openGraph: {
    title: `🧘 Wellnessurlaub ${YEAR} – Spa & Entspannung | Urlaubfinder365`,
    description: `Wellnessurlaub ${YEAR} günstig buchen ✓ Hotels mit Spa & Massagen ✓ Sauna & Pool ✓ Für Körper und Geist ✓ Täglich neue Wellnessreisen.`,
    url: "https://www.urlaubfinder365.de/urlaubsthemen/wellnessurlaub/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
        width: 1200,
        height: 630,
        alt: "Wellnessurlaub günstig buchen – Traumurlaub auf Urlaubfinder365",
      },
    ],
  },
};

export const revalidate = 3600;

const DESTINATIONS: DestinationCard[] = [
  { name:"Türkei", flag:"🇹🇷", image:"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80&auto=format", teaser:"Die Türkische Riviera vereint moderne 5-Sterne-Resorts mit der Jahrtausende alten Hamam-Tradition. Antalya und Side bieten großzügige Spa-Landschaften mit Innen- und Außenpool, Kräuterbehandlungen und professionellen Massagen direkt am türkisblauen Mittelmeer. Wer Wellness mit orientalischem Flair und außergewöhnlicher Gastfreundschaft erleben möchte, ist hier bestens aufgehoben – und das zu hervorragenden Pauschalpreisen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=724" },
  { name:"Balearen", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80&auto=format", teaser:"Mallorca & Ibiza: exklusive Wellness-Hotels mit Panorama-Meerblick.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=100000" },
  { name:"Griechenland", flag:"🇬🇷", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80&auto=format", teaser:"Kreta & Rhodos: naturnahe Spa-Resorts mit griechischen Kräuterbehandlungen.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&countryId=GR" },
  { name:"Ägypten", flag:"🇪🇬", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format", teaser:"Hurghada: All-Inclusive Wellness an der warmen Küste des Roten Meeres.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=651" },
  { name:"Kanaren", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&auto=format", teaser:"Teneriffa & Lanzarote: ganzjährig angenehmes Klima für entspannten Wellness-Urlaub.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=851" },
  { name:"Thailand", flag:"🇹🇭", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format", teaser:"Phuket & Koh Samui: Thai-Massagen, Yoga und Meditation im Tropenparadies.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=100220" },
  { name:"Dubai & VAE", flag:"🇦🇪", image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format", teaser:"Dubai: weltklasse Spa-Anlagen in den luxuriösesten Hotels der Welt.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=650" },
  { name:"Portugal", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80&auto=format", teaser:"Algarve: entspannte Wellness-Auszeit an Europas sonnigster Atlantikküste.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=725" },
  { name:"Italien", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80&auto=format", teaser:"Sardinien & Toskana: Vinotherapie, Thermalbäder und Meeresluft pur.", deeplink:"https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&countryId=IT" },
];

const FAQ = [
  {
    q: "Was umfasst ein typischer Wellnessurlaub?",
    a: "Ein Wellnessurlaub beinhaltet typischerweise einen großzügigen Spa-Bereich mit Innen- und Außenpool, Sauna, Dampfbad und Massagebereich. Viele Wellnesshotels bieten täglich Yoga- und Meditationskurse, spezielle Beautyanwendungen sowie gesundheitsbewusste Ernährung an. Das Ziel ist die vollständige Erholung von Körper, Geist und Seele.",
  },
  {
    q: "Welche Wellnessdestinationen sind besonders empfehlenswert?",
    a: "Österreich, Deutschland (Bayern, Schwarzwald) und die Schweiz sind führend im alpinen Wellnesstourismus. Im Mittelmeerraum bieten Mallorca, die Türkische Riviera und Zypern hervorragende Wellnessresorts. International sind Thailand, Bali und die Malediven für ihre außergewöhnlichen Spa-Erfahrungen bekannt. Bei Pauschalreisen sind türkische und griechische Wellnesshotels besonders preiswert.",
  },
  {
    q: "Was kostet ein Wellnessurlaub durchschnittlich?",
    a: "Die Kosten variieren stark je nach Destination und Hotelkategorie. In Deutschland und Österreich beginnen gute Wellnesshotels ab etwa 150 Euro pro Person und Nacht mit Halbpension. Im Mittelmeerraum sind Wellnesshotels oft günstiger – All-Inclusive Wellnessreisen sind ab ca. 600 Euro pro Person für 7 Nächte erhältlich, besonders in der Türkei und in Ägypten.",
  },
  {
    q: "Wie viele Behandlungen sollte ich für einen Wellnessurlaub einplanen?",
    a: "Als Faustregel gilt: eine bis zwei Behandlungen pro Tag sind ideal, um Körper und Geist zu regenerieren. Zu viele Massagen hintereinander können kontraproduktiv sein. Kombinieren Sie Massagen mit Bädern, Saunabesuchen und Entspannungszeiten. Viele Hotels bieten Wellness-Pakete an, die eine optimale Kombination verschiedener Anwendungen umfassen.",
  },
  {
    q: "Eignet sich Wellnessurlaub auch für Paare?",
    a: "Absolut! Paarsmassagen, romantische Spa-Rituale und gemeinsame Entspannungsprogramme machen Wellnessurlaub zu einem wunderbaren Erlebnis für Paare. Viele Hotels bieten spezielle Couple-Suites mit privatem Whirlpool und Kaminfeuern. Wellnessurlaub eignet sich hervorragend als Valentinstag-Reise, für Hochzeitstage oder als besonderes Geschenk zu zweit.",
  },
];

const LINKS = [
  { href: "/urlaubsthemen/kurreisen/", label: "💧 Kurreisen" },
  { href: "/urlaubsthemen/adults-only/", label: "💑 Adults Only" },
  { href: "/urlaubsthemen/luxusurlaub/", label: "👑 Luxusurlaub" },
  { href: "/urlaubsthemen/strandurlaub/", label: "🏖️ Strandurlaub" },
  { href: "/urlaubsthemen/", label: "🗂️ Alle Urlaubsthemen" },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Urlaubsthemen", item: "https://www.urlaubfinder365.de/urlaubsthemen/" },
    { "@type": "ListItem", position: 3, name: "Wellnessurlaub",        item: "https://www.urlaubfinder365.de/urlaubsthemen/wellnessurlaub/" },
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
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop"
          alt="Wellnessurlaub – Spa & Erholung"
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
            <span className="text-white/90">Wellnessurlaub</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-emerald-700/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            🧖 Wellnessurlaub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Wellnessurlaub {YEAR} günstig buchen<br />
            <span className="text-emerald-200">Spa, Massagen &amp; tiefe Entspannung</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10 leading-relaxed">
            Tanken Sie neue Energie in erstklassigen Spa-Hotels – mit Massagen,
            Thermalbädern und ganzheitlichen Wellness-Programmen für Körper und Geist.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Spa & Sauna inklusive", "Massagen & Treatments", "Gesunde Küche", "Naturkosmetik"].map((u) => (
              <span key={u} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                ✓ {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
        <p className="text-teal-600 text-sm font-bold uppercase tracking-widest mb-2">Beliebte Urlaubsziele</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Wellness & Spa weltweit</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">Erholen Sie sich in den besten Wellness-Hotels der Welt – von türkischen Hamams bis zu tropischen Spa-Resorts.</p>
        <DestinationGrid destinations={DESTINATIONS} accentColor="#0d9488" carouselLabel="Weitere Wellness Urlaubsziele" />
      </div>

      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExpertBanner
          expert={EXPERTS.susanne}
          quote="Wellness-Urlaub ist für mich mehr als nur Massagen – es geht ums Loslassen. Mein absoluter Geheimtipp: türkische Resorts mit echtem Hamam-Bereich. Die Qualität ist oft besser als in der Schweiz, zum halben Preis. Buchen Sie ruhig im Mai oder Oktober – dann ist es angenehm warm und weniger voll."
          accentColor="#0d9488"
          tip="Türkische Riviera im Mai – warm, ruhig, traumhaft"
          deeplink="https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=180&duration=7-7&adults=2&category=3&minRecommrate=80&regionId=724&keywords=wel"
          deeplinkLabel="Susannes Wellnesstipps ansehen"
        />
      </div>

      {/* New flex wrapper */}
      <div className="xl:flex xl:items-start xl:gap-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex-1 min-w-0">

      {/* OFFERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-emerald-700 text-sm font-bold uppercase tracking-widest mb-2">Tagesaktuelle Angebote</p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Wellnessurlaub Angebote
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl">
              Täglich aktualisierte Wellnesshotels — inklusive Flug, Hotel und Transfer.
            </p>
          </div>
          <Link href="/urlaubsthemen/" className="hidden md:inline text-sm font-semibold text-[#00838F] hover:underline whitespace-nowrap shrink-0">
            Alle Themen →
          </Link>
        </div>
        <IbeTeaser
          hideHeading={true}
          keywords="wel"
          from="14"
          to="365"
          duration="7-7"
          adults="2"
          category="3"
          minRecommrate="50"
        />
      </div>

      <ThemeFeatureGrid
        heading="Warum Wellnessurlaub?"
        accentColor="#0d9488"
        items={[
          { emoji: "💆", title: "Massagen & Treatments", desc: "Ganzkörpermassagen, Aromatherapie und Shiatsu für tiefe Entspannung" },
              { emoji: "🛁", title: "Thermalbad & Sauna", desc: "Innen- und Außenpools, Saunalandschaft und Dampfbad" },
              { emoji: "🌿", title: "Naturheilkunde", desc: "Gesichtsbehandlungen und Körperpflege mit natürlichen Wirkstoffen" },
              { emoji: "🧘", title: "Yoga & Meditation", desc: "Tägliche Kurse für innere Balance und mentale Erholung" },
        ]}
      />

      {/* SEO TEXT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Wellnessurlaub – Erholung für Körper und Seele</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          In einer schnelllebigen Welt ist echter Urlaub für Körper und Geist
          wichtiger denn je. Wellnesshotels bieten genau das: einen geschützten Raum,
          in dem Sie den Alltag vollständig hinter sich lassen können. Professionelle
          Massagen lösen Verspannungen, Thermalbäder verbessern die Durchblutung und
          Yoga-Kurse bringen innere Ruhe. Ein guter Wellnessurlaub kombiniert aktive
          Behandlungen mit bewusstem Nichtstun – und das ist der Schlüssel zu echter
          Regeneration.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Wellnesshotels sind heute in allen Preisklassen zu finden – von gemütlichen
          4-Sterne-Anlagen bis hin zu exklusiven Luxusresorts mit privatem Butler und
          Infinity-Pool. Besonders in der Türkei, in Ägypten und auf Mallorca bieten
          viele Hotelkomplexe umfangreiche Spa-Bereiche bereits im Pauschalpreis.
          Gesundheitsbewusste Urlauber schätzen zudem die zunehmend angebotenen
          ayurvedischen Behandlungen und detox-orientierten Ernährungskonzepte.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Unsere Wellnessurlaub-Angebote werden täglich auf Aktualität geprüft und nach
          Hotels mit echtem Wellness-Schwerpunkt gefiltert. Ob romantisches
          Wochenende für zwei, regenerierende Auszeit für Singles oder erholsamer
          Familienurlaub mit Spa-Bereich – hier finden Sie das passende Angebot.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>
          <ThemeFAQAccordion items={FAQ} accentColor="#0d9488" />
        </div>
      </div>

      {/* REISEZIEL-LINKS (Hub→Spoke) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Beliebte Wellness-Reiseziele</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Wellnessurlaub Reiseziele im Überblick</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { href: "/urlaubsziele/mallorca/",   label: "Wellness Mallorca" },
            { href: "/urlaubsziele/teneriffa/",   label: "Wellness Teneriffa" },
            { href: "/urlaubsziele/antalya/",     label: "Wellness Antalya" },
            { href: "/urlaubsziele/bodrum/",      label: "Wellness Bodrum" },
            { href: "/urlaubsziele/marrakesch/",  label: "Wellness Marrakesch" },
            { href: "/urlaubsziele/dubai/",       label: "Wellness Dubai" },
            { href: "/urlaubsziele/bali/",        label: "Wellness Bali" },
            { href: "/urlaubsziele/phuket/",      label: "Wellness Phuket" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#0d9488] hover:text-[#0d9488] text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-all group">
              <span>{label}</span>
              <span className="text-gray-300 group-hover:text-[#0d9488] text-xs ml-1 shrink-0">→</span>
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

    <SeoTextBlocks pagePath="/urlaubsthemen/wellnessurlaub" />
    </div>
  );
}
