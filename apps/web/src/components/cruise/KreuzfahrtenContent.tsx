"use client";

import Image from "next/image";
import Link from "next/link";
import PageNavBar from "@/components/ui/PageNavBar";
import {
  Ship, Anchor, Waves, Plane, Zap, Star, MapPin,
  Users, ChevronRight, Check, Compass, ArrowRight,
} from "lucide-react";
import CruiseWidget from "@/components/cruise/CruiseWidget";
import AdBanner from "@/components/ui/AdBanner";

const PARTNER_ID = "30412";
const DL = (params = "") =>
  `https://kreuzfahrten.travelsystem.de/de?p=2&subid=${PARTNER_ID}${params}`;

// travialinks-URL erlaubt iframe-Einbettung im IBE-Modal
const TRAVIA_URL = "https://www.travialinks.de/link/A-30412-0/A/cruisecompass";

/** Opens the IBE modal with travialinks URL (iframe-kompatibel).
 *  Fallback: öffnet den Typ-spezifischen Link im neuen Tab. */
function openModal(_fallbackUrl: string, title = "Kreuzfahrten buchen") {
  const w = window as typeof window & {
    ibeOpenBooking?: (u: string, t: string) => void;
  };
  if (w.ibeOpenBooking) {
    w.ibeOpenBooking(TRAVIA_URL, title);
  } else {
    window.location.href = "/kreuzfahrten/";
  }
}

// ─── Reisetypen ────────────────────────────────────────────────────────────────
const CRUISE_TYPES = [
  {
    icon: Ship,
    title: "Hochseekreuzfahrten",
    desc: "Das Meer als Bühne – von Mittelmeer bis Karibik.",
    gradient: "from-blue-900 to-blue-700",
    href: DL("&type=NS"),
    label: "Hochseekreuzfahrten vergleichen",
  },
  {
    icon: Plane,
    title: "Kreuzfahrt + Flug",
    desc: "Rundum-sorglos: Flug, Schiff & Kabine aus einer Hand.",
    gradient: "from-sky-800 to-cyan-600",
    href: DL("&type=S"),
    label: "Kreuzfahrt + Flug buchen",
  },
  {
    icon: Waves,
    title: "Flusskreuzfahrten",
    desc: "Rhein, Donau, Nil & mehr – malerische Flussrouten.",
    gradient: "from-teal-800 to-emerald-600",
    href: DL("&type=R"),
    label: "Flusskreuzfahrten entdecken",
  },
  {
    icon: Compass,
    title: "Kreuzfahrt + Hotel",
    desc: "Kombi-Urlaub: Schiff kombiniert mit Hotelaufenthalt.",
    gradient: "from-indigo-800 to-purple-600",
    href: DL("&type=KOMBI"),
    label: "Kreuzfahrt + Hotel",
  },
  {
    icon: Zap,
    title: "Last-Minute Deals",
    desc: "Spontan auf große Fahrt – zu unschlagbaren Preisen.",
    gradient: "from-sand-700 to-red-600",
    href: DL("&sort=pauf"),
    label: "Last-Minute Kreuzfahrten",
  },
  {
    icon: Star,
    title: "Luxuskreuzfahrten",
    desc: "5-Sterne-Komfort auf See: Suiten, Butler & Gourmet.",
    gradient: "from-amber-700 to-yellow-600",
    href: DL("&cab=4"),
    label: "Luxuskreuzfahrten",
  },
];

// ─── Beliebte Reedereien ───────────────────────────────────────────────────────
const REEDEREIEN = [
  { id: 1,  name: "AIDA Cruises",          color: "bg-red-600",    flag: "🇩🇪", tag: "Beliebt" },
  { id: 7,  name: "TUI Cruises",           color: "bg-blue-600",   flag: "🇩🇪", tag: "Deutsch" },
  { id: 15, name: "MSC Cruises",           color: "bg-sky-700",    flag: "🌍", tag: "" },
  { id: 11, name: "Royal Caribbean",       color: "bg-indigo-700", flag: "🌍", tag: "Größte Schiffe" },
  { id: 10, name: "Norwegian Cruise Line", color: "bg-teal-700",   flag: "🌍", tag: "" },
  { id: 18, name: "Celebrity Cruises",     color: "bg-slate-700",  flag: "🌍", tag: "Premium" },
  { id: 14, name: "Costa Kreuzfahrten",    color: "bg-green-700",  flag: "🇮🇹", tag: "" },
  { id: 17, name: "Hapag-Lloyd Cruises",   color: "bg-amber-700",  flag: "🇩🇪", tag: "Luxus" },
  { id: 2,  name: "A-ROSA",               color: "bg-pink-700",   flag: "🇩🇪", tag: "Fluss" },
  { id: 26, name: "Phoenix Seereisen",     color: "bg-sand-700", flag: "🇩🇪", tag: "" },
  { id: 30, name: "Silversea",             color: "bg-gray-700",   flag: "🌍", tag: "Ultra-Luxus" },
  { id: 27, name: "Princess Cruises",      color: "bg-violet-700", flag: "🌍", tag: "" },
];

// ─── Kabinen-Kategorien ────────────────────────────────────────────────────────
const KABINEN = [
  {
    cab: 1,
    title: "Innenkabine",
    price: "ab 499 €",
    desc: "Günstigste Option – perfekt für Aktiv-Urlauber, die kaum Zeit in der Kabine verbringen.",
    perks: ["Vollwertige Ausstattung", "Ruhiger Schlaf (kein Tageslicht)", "Bestes Preis-Leistungs-Verhältnis"],
    color: "border-gray-200",
    badge: "Günstigste",
    badgeColor: "bg-gray-100 text-gray-700",
  },
  {
    cab: 2,
    title: "Außenkabine",
    price: "ab 649 €",
    desc: "Mit Fenster oder Bullauge – Tageslicht und Ausblick aufs Meer inklusive.",
    perks: ["Natürliches Tageslicht", "Meerblick durch Fenster", "Gutes Preis-Leistungs-Verhältnis"],
    color: "border-blue-200",
    badge: "Beliebt",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    cab: 3,
    title: "Balkonkabine",
    price: "ab 899 €",
    desc: "Eigener Balkon mit Meerblick – Morgenkaffe mit Sonnenaufgang über dem Ozean.",
    perks: ["Privater Balkon", "Frische Seeluft", "Bester Meerblick"],
    color: "border-sky-300",
    badge: "Empfohlen",
    badgeColor: "bg-sky-100 text-sky-700",
  },
  {
    cab: 4,
    title: "Suite",
    price: "ab 1.499 €",
    desc: "Das Feinste an Bord – großzügige Suiten mit Butler-Service und exklusiven Extras.",
    perks: ["Separater Wohn- & Schlafbereich", "Butler-Service", "Exklusive Vorteile"],
    color: "border-amber-300",
    badge: "Premium",
    badgeColor: "bg-amber-100 text-amber-700",
  },
];

// ─── Destinationen ─────────────────────────────────────────────────────────────
const DESTINATIONEN = [
  {
    title: "Mittelmeer",
    sub: "Spanien · Italien · Griechenland · Türkei",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    href: DL("&type=NS"),
    label: "Mittelmeer-Kreuzfahrt buchen",
  },
  {
    title: "Karibik",
    sub: "Bahamas · Jamaika · Barbados · Mexiko",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    href: DL("&type=NS"),
    label: "Karibik-Kreuzfahrt buchen",
  },
  {
    title: "Nordeuropa & Fjorde",
    sub: "Norwegen · Island · Spitzbergen",
    img: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=800&q=80",
    href: DL("&type=NS"),
    label: "Nordeuropa-Kreuzfahrt buchen",
  },
  {
    title: "Flusskreuzfahrten",
    sub: "Rhein · Donau · Elbe · Nil",
    img: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80",
    href: DL("&type=R"),
    label: "Flusskreuzfahrt buchen",
  },
];

// ─── USPs ──────────────────────────────────────────────────────────────────────
const USPS = [
  { icon: Ship,   text: "30+ Reedereien im Vergleich" },
  { icon: Star,   text: "Top-Bewertungen & Empfehlungen" },
  { icon: Users,  text: "Für Paare, Familien & Gruppen" },
  { icon: Anchor, text: "Hochsee & Fluss aus einer Hand" },
];

// ─── Wave SVG Divider ──────────────────────────────────────────────────────────
function WaveDivider({ flip = false, topColor = "#f9fafb", bottomColor = "#ffffff" }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: bottomColor }}>
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined, background: topColor }}
      >
        <path
          d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

export default function KreuzfahrtenContent() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[380px] md:h-[440px] flex items-center overflow-hidden -mt-24 pt-24">
        {/* Background Image */}
        <Image
          src="/images/kreuzfahrten-hero.jpg"
          alt="Kreuzfahrtschiff auf dem Meer"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Ocean gradient overlay – dark left + subtle right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(5,30,65,0.90) 0%, rgba(5,40,80,0.75) 45%, rgba(0,60,100,0.45) 75%, rgba(0,80,120,0.20) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">

            {/* Linke Spalte: Headline + Text + CTAs */}
            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Ship className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">
                  {`Kreuzfahrten ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                Traumkreuzfahrten
                <br />
                <span className="text-cyan-300">günstig buchen</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-xl drop-shadow">
                Über 30 Reedereien vergleichen – Hochsee, Flusskreuzfahrten,
                Karibik, Mittelmeer und mehr. Jetzt die perfekte Kreuzfahrt zum
                besten Preis finden.
              </p>

            </div>

            {/* Rechte Spalte: Trust-Chips */}
            <div className="hidden lg:flex flex-col gap-2.5 shrink-0 mt-6 lg:mt-0">
              {[
                { icon: Ship,    text: "30+ Reedereien im Vergleich" },
                { icon: Star,    text: "Top-Bewertungen & Empfehlungen" },
                { icon: Users,   text: "Für Paare, Familien & Gruppen" },
                { icon: Waves,   text: "Hochsee & Fluss aus einer Hand" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2.5 rounded-xl border border-white/15"
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-300" />
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Schnellnavigation ────────────────────────────────────────────────── */}
      <PageNavBar items={[
        { id: "kreuzfahrt-typen",     label: "Kreuzfahrttypen",   emoji: "🚢" },
        { id: "kreuzfahrt-buchen",    label: "Jetzt buchen",      emoji: "🔍" },
        { id: "kreuzfahrt-routen",    label: "Routen & Regionen", emoji: "🌍" },
        { id: "kreuzfahrt-kabinen",   label: "Kabinen",           emoji: "🛏️" },
        { id: "kreuzfahrt-reedereien",label: "Reedereien",        emoji: "⚓" },
      ]} />

      {/* ── Reisetypen ───────────────────────────────────────────────────────── */}
      <section id="kreuzfahrt-typen" className="bg-sky-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              Für jeden das Richtige
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              Welche Kreuzfahrt passt zu dir?
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CRUISE_TYPES.map(({ icon: Icon, title, desc, gradient, href, label }) => (
              <button
                key={title}
                onClick={() => openModal(href, label)}
                className={`group relative flex flex-col items-center text-center p-5 rounded-2xl bg-linear-to-br ${gradient} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer w-full`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm leading-tight mb-1">{title}</h3>
                <p className="text-white/70 text-[11px] leading-snug">{desc}</p>
                <div className="mt-3 flex items-center gap-1 text-white/80 text-[11px] font-semibold">
                  Jetzt suchen <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── CruiseCompass Widget ──────────────────────────────────────────────── */}
      <section id="kreuzfahrt-buchen" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              Live-Suche
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Kreuzfahrten vergleichen & buchen
            </h2>
            <p className="text-gray-500 text-sm">
              Tausende Angebote von über 30 Reedereien – direkt buchbar
            </p>
          </div>

          {/* Zweispalten: Widget + Sidebar */}
          <div className="xl:flex xl:items-start xl:gap-8">

            {/* Widget */}
            <div className="flex-1 min-w-0">
              <CruiseWidget />
            </div>

            {/* Sidebar (nur XL+) */}
            <aside className="hidden xl:block w-[160px] shrink-0">
              <div className="space-y-3">

                {/* Anzeige */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
                    Anzeige
                  </p>
                  <AdBanner
                    placementKey="86c5e79b5bd126e0b09685dad18c2682"
                    height={600}
                  />
                </div>

                {/* CTA */}
                <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200/50 text-center">
                  <p className="text-xs font-bold text-cyan-800 mb-1">🚢 Kreuzfahrt?</p>
                  <p className="text-[11px] text-cyan-700 mb-3 leading-snug">
                    30+ Reedereien direkt vergleichen
                  </p>
                  <Link
                    href="/kreuzfahrten/"
                    className="inline-block bg-cyan-700 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-cyan-800 transition-colors"
                  >
                    Jetzt buchen →
                  </Link>
                </div>

                {/* SEO-Linkbox: Kreuzfahrt-Ziele */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                    🌊 Kreuzfahrt-Routen
                  </p>
                  <ul className="space-y-1.5">
                    {([
                      { href: "/urlaubsziele/griechenland/",    label: "Mittelmeer-Kreuzfahrt" },
                      { href: "/urlaubsziele/kanaren/",         label: "Kanaren-Kreuzfahrt" },
                      { href: "/urlaubsziele/skandinavien/",    label: "Norwegen & Fjorde" },
                      { href: "/urlaubsziele/karibik/",         label: "Karibik-Kreuzfahrt" },
                      { href: "/urlaubsziele/indischer-ozean/", label: "Indischer Ozean" },
                      { href: "/urlaubsziele/dubai/",           label: "Dubai & VAE" },
                    ] as const).map(({ href, label }) => (
                      <li key={href}>
                        <Link href={href} className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight">
                          <span className="text-gray-300 shrink-0">›</span>{label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO-Linkbox: Verwandte Seiten */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2 pb-1.5 border-b border-gray-50">
                    🔗 Mehr entdecken
                  </p>
                  <ul className="space-y-1.5">
                    {([
                      { href: "/last-minute/",                       label: "Last-Minute Reisen" },
                      { href: "/urlaubsarten/pauschalreisen/",       label: "Pauschalreisen" },
                      { href: "/urlaubsarten/all-inclusive-urlaub/", label: "All-Inclusive" },
                      { href: "/hotelsuche/",                        label: "Hotels buchen" },
                      { href: "/flugsuche/",                         label: "Flüge vergleichen" },
                      { href: "/urlaubsziele/",                      label: "Alle Reiseziele" },
                    ] as const).map(({ href, label }) => (
                      <li key={href}>
                        <Link href={href} className="text-[11px] text-gray-600 hover:text-[#00838F] transition-colors flex items-center gap-1 leading-tight">
                          <span className="text-gray-300 shrink-0">›</span>{label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#ffffff" bottomColor="#f0f9ff" />

      {/* ── Beliebte Destinationen ────────────────────────────────────────────── */}
      <section id="kreuzfahrt-routen" className="bg-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              Routen & Regionen
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              Beliebte Kreuzfahrt-Destinationen
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATIONEN.map(({ title, sub, img, href, label }) => (
              <button
                key={title}
                onClick={() => openModal(href, label)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
                style={{ height: "220px" }}
              >
                <Image
                  src={img}
                  alt={`Kreuzfahrt ${title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-black text-lg leading-tight">{title}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{sub}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-cyan-300 text-xs font-bold">
                    Routen entdecken <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── Kabinen-Ratgeber ──────────────────────────────────────────────────── */}
      <section id="kreuzfahrt-kabinen" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              Kabinen-Ratgeber
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Welche Kabine passt zu dir?
            </h2>
            <p className="text-gray-500 text-sm">
              Von günstig bis Luxus – finde deine ideale Kabinenkategorie
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KABINEN.map(({ cab, title, price, desc, perks, color, badge, badgeColor }) => (
              <button
                key={cab}
                onClick={() => openModal(DL(`&cab=${cab}`), `${title} – Kreuzfahrten`)}
                className={`group flex flex-col text-left rounded-2xl border-2 ${color} bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer w-full`}
              >
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{title}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>
                  <p className="text-cyan-600 font-black text-xl mb-2">{price}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600">Angebote ansehen</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#ffffff" bottomColor="#f0f9ff" />

      {/* ── Beliebte Reedereien ───────────────────────────────────────────────── */}
      <section id="kreuzfahrt-reedereien" className="bg-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              Reedereien
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              Alle großen Reedereien im Vergleich
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {REEDEREIEN.map(({ id, name, color, flag, tag }) => (
              <button
                key={id}
                onClick={() => openModal(DL(`&red=${id}`), `${name} – Kreuzfahrten`)}
                className="group flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-gray-100 cursor-pointer w-full"
              >
                <div
                  className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-2 text-white text-lg`}
                >
                  {flag}
                </div>
                <span className="text-xs font-bold text-gray-800 leading-tight">{name}</span>
                {tag && (
                  <span className="mt-1 text-[9px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => openModal(DL(), "Alle Kreuzfahrten vergleichen")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <Anchor className="w-4 h-4" />
              Alle Reedereien & Angebote vergleichen
            </button>
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── SEO Text ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Kreuzfahrten günstig buchen – Dein Ratgeber
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Ship className="w-5 h-5 text-cyan-500" /> Hochsee vs. Flusskreuzfahrt
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong>Hochseekreuzfahrten</strong> bringen dich zu fernen Küsten – von der Karibik
                  über das Mittelmeer bis zu den norwegischen Fjorden. Das Schiff selbst ist das Erlebnis
                  mit Pools, Restaurants und Entertainment.{" "}
                  <strong>Flusskreuzfahrten</strong> führen dich durch das Herz Europas: Rhein, Donau oder
                  Elbe – täglich neue Städte, immer von Bord aus erreichbar.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-500" /> Die beliebtesten Routen
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Das <strong>Mittelmeer</strong> ist die meistgebuchte Kreuzfahrtregion: Barcelona, Rom,
                  Athen und Istanbul in einer Reise. Die <strong>Karibik</strong> punktet mit türkisblauem
                  Wasser und weißen Stränden. <strong>Nordeuropa</strong> begeistert mit Fjorden,
                  Polarlichtern und Metropolen wie London und Amsterdam.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-500" /> Tipps für günstige Kreuzfahrten
                </h3>
                <ul className="text-gray-600 text-sm space-y-1.5">
                  {[
                    "Frühbucher-Rabatte: bis zu 30% sparen bei Buchung 6–12 Monate vorher",
                    "Last-Minute: kurzfristige Schnäppchen ab 4 Wochen vor Abfahrt",
                    "Innenkabinen wählen für maximales Ersparnis",
                    "Repositionierungsfahrten für ungewöhnliche Routen zum Tiefpreis",
                    "Kreuzfahrt + Flug-Pakete oft günstiger als Einzelbuchung",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-cyan-500" /> Für wen eignet sich eine Kreuzfahrt?
                </h3>
                <ul className="text-gray-600 text-sm space-y-1.5">
                  {[
                    "Paare: Romantische Abendsonne auf dem Balkon",
                    "Familien: Kinderclubs & Action für jedes Alter",
                    "Senioren: Komfort & gepflegte Atmosphäre an Bord",
                    "Alleinreisende: Viele Reedereien mit Single-Kabinen",
                    "Genießer: Gourmet-Restaurants & Wellnessbereiche",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <h3 className="text-xl font-black text-gray-900 mb-5">
              Häufige Fragen zu Kreuzfahrten
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Was ist im Kreuzfahrtpreis enthalten?",
                  a: "Im Grundpreis sind Kabine, Vollpension (alle Hauptmahlzeiten), Entertainment und Nutzung der Schiffseinrichtungen enthalten. Nicht inklusive: Getränke, Ausflüge, Spa-Behandlungen und Trinkgelder (je nach Reederei).",
                },
                {
                  q: "Wie lange dauern Kreuzfahrten?",
                  a: "Kurzreisen starten bereits ab 3–4 Nächten. Klassische Kreuzfahrten dauern 7–14 Nächte. Weltreisen können bis zu 100 Tage dauern. Flusskreuzfahrten sind meist 7–15 Nächte lang.",
                },
                {
                  q: "Welche Reederei ist die beste für Einsteiger?",
                  a: "AIDA und TUI Cruises sind besonders bei deutschen Gästen beliebt – deutschsprachige Atmosphäre, breites Unterhaltungsprogramm. MSC bietet ein internationales Flair zu günstigen Preisen.",
                },
                {
                  q: "Wann sollte man eine Kreuzfahrt buchen?",
                  a: "Frühbucher sichern sich die besten Kabinen und bis zu 30% Rabatt bei Buchung 6–12 Monate im Voraus. Last-Minute-Deals lohnen sich für flexible Reisende, die kurzfristig buchen können.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <Compass className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    {q}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed pl-6">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Finaler CTA-Banner ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        {/* Hintergrund – Ocean Deep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #051e41 0%, #0a3060 50%, #0e4f7c 100%)",
          }}
        />
        {/* Decorative waves */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,40 C480,0 960,80 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-400/30">
            <Anchor className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Bereit für deine Traumkreuzfahrt?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Über 30 Reedereien, tausende Routen – jetzt kostenlos vergleichen
            und die beste Kreuzfahrt zum besten Preis buchen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal(DL("&sort=pauf"), "Günstigste Kreuzfahrten")}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-cyan-500/30 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Günstigste Kreuzfahrten
            </button>
            <button
              onClick={() => openModal(DL(), "Alle Kreuzfahrten")}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold px-8 py-3.5 rounded-xl border border-white/30 transition-colors cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              Alle Angebote ansehen
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
