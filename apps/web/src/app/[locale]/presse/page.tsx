import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  Users,
  TrendingUp,
  Star,
  FileText,
  Download,
  ArrowRight,
  Newspaper,
  BarChart3,
  Bot,
  MapPin,
  BookOpen,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { EmbedCode } from "@/components/ui/embed-code";

export const metadata: Metadata = {
  title: "Presse – Urlaubfinder365.de | Mediadaten & Pressemitteilungen",
  description:
    "Presseinformationen, Medienkit, Pressemitteilungen und Kontakt für Journalisten von Urlaubfinder365.de – dem unabhängigen Reisevergleichsportal.",
  alternates: { canonical: "https://www.urlaubfinder365.de/presse/" },
  openGraph: {
    title: "Presse – Urlaubfinder365.de | Mediadaten & Pressemitteilungen",
    description:
      "Presseinformationen, Medienkit, Pressemitteilungen und Kontakt für Journalisten von Urlaubfinder365.de.",
    url: "https://www.urlaubfinder365.de/presse/",
  },
};

// ── Daten ────────────────────────────────────────────────────────────────────

const PRESSEKONTAKT = {
  name: "Andre Meier",
  rolle: "Gründer & Pressekontakt",
  email: "presse@urlaubfinder365.de",
  telefon: "+49 7042 / 90 71 180",
  adresse: "Dieselstraße 18, 74372 Sersheim, Deutschland",
};

const FAKTEN = [
  { icon: Globe,    value: "200+",   label: "Reiseziele weltweit", color: "#1db682" },
  { icon: Users,    value: "50+",    label: "Reiseveranstalter",   color: "#6991d8" },
  { icon: FileText, value: "1.700+", label: "Seiten & Inhalte",    color: "#1db682" },
  { icon: BookOpen, value: "60+",    label: "Magazin-Artikel",     color: "#6991d8" },
  { icon: TrendingUp, value: "täglich", label: "aktualisierte Preise", color: "#1db682" },
  { icon: Star,     value: "kostenlos", label: "für alle Nutzer",  color: "#6991d8" },
];

const PRESSEMITTEILUNGEN = [
  {
    datum: "März 2026",
    icon: TrendingUp,
    titel: "urlaubfinder365.de launcht innovativen Preisverlauf-Tracker für Pauschalreisen",
    teaser:
      "Das Reisevergleichsportal urlaubfinder365.de führt einen einzigartigen Preisverlauf-Tracker ein, der historische Preisdaten für über 200 Urlaubsziele visualisiert. Reisende können damit den optimalen Buchungszeitpunkt ermitteln und durchschnittlich bis zu 30 % sparen.",
    badge: "Produkt-Launch",
    badgeColor: "#1db682",
  },
  {
    datum: "Februar 2026",
    icon: Newspaper,
    titel: "Neues Urlaubsmagazin: 60 Artikel zu Reisetipps, Spartricks und Reiserecht",
    teaser:
      "urlaubfinder365.de erweitert sein Angebot um ein umfangreiches Reisemagazin. Mit über 60 redaktionellen Artikeln zu Reisetipps, Spartricks, Reiserecht und Destinationsguides positioniert sich das Portal als ganzheitliche Informationsquelle für Reisende.",
    badge: "Content",
    badgeColor: "#6991d8",
  },
  {
    datum: "Januar 2026",
    icon: Bot,
    titel: "KI-gestützter Reiseplaner: urlaubfinder365.de setzt auf künstliche Intelligenz",
    teaser:
      "urlaubfinder365.de integriert künstliche Intelligenz in seinen Reiseplaner. Auf Basis von Nutzerpräferenzen, Saisonalität und aktuellen Preisdaten generiert das System individuelle Reiseempfehlungen – und revolutioniert damit die Urlaubsplanung für Millionen Reisende.",
    badge: "Innovation",
    badgeColor: "#1db682",
  },
];

const ZIELGRUPPE = [
  "Urlaubsreisende aus Deutschland, Österreich und der Schweiz",
  "Preisbewusste Familien, Paare und Alleinreisende (25–65 Jahre)",
  "Interessierte an Pauschalreisen, All Inclusive und Last-Minute-Deals",
  "Kreuzfahrt-Enthusiasten und Abenteuerreisende",
  "Digitalaffine Reisende, die vor der Buchung intensiv vergleichen",
];

const KOOPERATIONEN = [
  {
    icon: FileText,
    titel: "Content-Kooperationen",
    beschreibung:
      "Gastbeiträge, Reiseberichte und gemeinsame Urlaubsführer mit dofollow-Verlinkung. Ideale Reichweitensteigerung für Reiseblogger und Tourismusorganisationen.",
  },
  {
    icon: BarChart3,
    titel: "Daten & Studien",
    beschreibung:
      "Preisvergleiche, Marktübersichten und exklusive Daten aus unserem Preisverlauf-System für redaktionelle Beiträge und Studien.",
  },
  {
    icon: Globe,
    titel: "Affiliate & Vertrieb",
    beschreibung:
      "Wir verlinken Reiseangebote von Veranstaltern mit Partnerlink. Transparente Affiliate-Strukturen mit CHECK24, Traveltainment und weiteren Partnern.",
  },
];

// ── Seite ────────────────────────────────────────────────────────────────────

export default async function PressePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative py-20 px-4 text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d4a6e 55%, #0f7a6b 100%)" }}
      >
        {/* Dekorative Kreise */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #1db682, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6991d8, transparent)", transform: "translate(-30%, 30%)" }} />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Newspaper className="w-3.5 h-3.5 text-[#1db682]" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Presse & Medien</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
            Pressebereich<br />
            <span style={{ color: "#1db682" }}>urlaubfinder365.de</span>
          </h1>
          <p className="text-blue-100/75 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Hier finden Journalisten, Blogger und Medienpartner alle relevanten Informationen,
            Pressemitteilungen und Kontaktdaten zu urlaubfinder365.de.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href={`mailto:${PRESSEKONTAKT.email}?subject=Presseanfrage`}
              className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#17a370] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Presseanfrage senden
            </a>
            <a
              href="#medienkit"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Medienkit herunterladen
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ── Pressekontakt ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#1db682]" />
            Pressekontakt
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl font-black text-white"
                  style={{ background: "linear-gradient(135deg, #1db682, #6991d8)" }}
                >
                  {PRESSEKONTAKT.name.charAt(0)}
                </div>
                <h3 className="font-black text-gray-900 text-lg">{PRESSEKONTAKT.name}</h3>
                <p className="text-sm text-gray-500 mb-5">{PRESSEKONTAKT.rolle}</p>
                <div className="space-y-3">
                  <a
                    href={`mailto:${PRESSEKONTAKT.email}?subject=Presseanfrage%20urlaubfinder365.de`}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1db682] transition-colors group"
                  >
                    <span className="w-8 h-8 bg-[#1db682]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1db682]/20 transition-colors">
                      <Mail className="w-4 h-4 text-[#1db682]" />
                    </span>
                    {PRESSEKONTAKT.email}
                  </a>
                  <a
                    href={`tel:${PRESSEKONTAKT.telefon.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#6991d8] transition-colors group"
                  >
                    <span className="w-8 h-8 bg-[#6991d8]/10 rounded-lg flex items-center justify-center group-hover:bg-[#6991d8]/20 transition-colors">
                      <Phone className="w-4 h-4 text-[#6991d8]" />
                    </span>
                    {PRESSEKONTAKT.telefon}
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </span>
                    {PRESSEKONTAKT.adresse}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Reaktionszeit</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Presseanfragen werden in der Regel innerhalb von <strong>24 Stunden</strong> an Werktagen beantwortet.
                </p>
                <h3 className="font-bold text-gray-900 text-sm mb-3 mt-5">Wir bieten Journalisten</h3>
                <ul className="space-y-2">
                  {[
                    "Exklusive Preisdaten & Marktanalysen",
                    "Experten-Statements zu Reisetrends",
                    "Hintergrundgespräche & Interviews",
                    "Bildmaterial in Druckqualität",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#1db682] font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Über uns ── */}
        <section className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#1db682]" />
              Über urlaubfinder365.de
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">urlaubfinder365.de</strong> ist ein unabhängiges
                deutschsprachiges Reisevergleichsportal, gegründet im Jahr 2025 von Andre Meier.
                Die Plattform aggregiert täglich tausende Urlaubsangebote von über 50 führenden
                Reiseveranstaltern und stellt diese übersichtlich dar – von Pauschalreisen über
                All-Inclusive bis zu Last-Minute-Deals und Kreuzfahrten.
              </p>
              <p>
                Was urlaubfinder365.de besonders macht: Der einzigartige{" "}
                <strong className="text-gray-900">Preisverlauf-Tracker</strong> visualisiert
                historische Preisdaten für 200+ Reiseziele und hilft Reisenden dabei, den
                optimalen Buchungszeitpunkt zu finden. Ergänzt durch detaillierte{" "}
                <strong className="text-gray-900">Urlaubsführer</strong>,
                ein wachsendes Reisemagazin mit 60+ Artikeln und einen
                KI-gestützten Reiseplaner bietet die Plattform einen ganzheitlichen
                Service – vollständig kostenlos für Nutzer.
              </p>
              <p>
                Die Mission: Urlaubern helfen, in wenigen Minuten das beste Angebot
                zum günstigsten Preis zu finden und transparent direkt beim Veranstalter zu buchen.
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6991d8]" />
              Zielgruppe
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <ul className="space-y-3">
                {ZIELGRUPPE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#1db682] font-bold mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Fakten & Zahlen ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1db682]" />
            Fakten & Zahlen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FAKTEN.map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-xl font-black text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pressemitteilungen ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#1db682]" />
              Pressemitteilungen
            </h2>
          </div>
          <div className="space-y-4">
            {PRESSEMITTEILUNGEN.map((pm) => (
              <article
                key={pm.titel}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${pm.badgeColor}15` }}
                  >
                    <pm.icon className="w-5 h-5" style={{ color: pm.badgeColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${pm.badgeColor}15`,
                          color: pm.badgeColor,
                        }}
                      >
                        {pm.badge}
                      </span>
                      <span className="text-xs text-gray-400">{pm.datum}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-base mb-2 leading-snug">
                      {pm.titel}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{pm.teaser}</p>
                    <a
                      href={`mailto:${PRESSEKONTAKT.email}?subject=Pressemitteilung: ${encodeURIComponent(pm.titel)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold mt-3 hover:underline"
                      style={{ color: pm.badgeColor }}
                    >
                      Vollständige PM anfordern
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Medienkit / Logo-Download ── */}
        <section id="medienkit">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#1db682]" />
            Medienkit & Logo-Download
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                titel: "Logo PNG (hell)",
                beschreibung: "Transparent, 2000×600 px, für helle Hintergründe",
                href: "/assets/press/urlaubfinder365-logo-light.png",
                tag: "PNG",
              },
              {
                titel: "Logo PNG (dunkel)",
                beschreibung: "Transparent, 2000×600 px, für dunkle Hintergründe",
                href: "/assets/press/urlaubfinder365-logo-dark.png",
                tag: "PNG",
              },
              {
                titel: "Komplettes Medienkit",
                beschreibung: "Logos, Brand-Guidelines, Pressetexte und Screenshots",
                href: "/assets/press/urlaubfinder365-medienkit.zip",
                tag: "ZIP",
              },
            ].map(({ titel, beschreibung, href, tag }) => (
              <a
                key={titel}
                href={href}
                download
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-[#1db682]/30 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white"
                    style={{ background: "linear-gradient(135deg, #1db682, #6991d8)" }}
                  >
                    {tag}
                  </div>
                  <Download className="w-4 h-4 text-gray-300 group-hover:text-[#1db682] transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{titel}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{beschreibung}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Kooperationen ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#6991d8]" />
            Kooperationen & Partnerschaften
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-2xl">
            Wir freuen uns über Kooperationen mit Reiseveranstaltern, Urlaubsbloggern,
            Tourismusorganisationen und Medienpartnern – transparente, faire Partnerschaft
            auf Augenhöhe.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {KOOPERATIONEN.map(({ icon: Icon, titel, beschreibung }) => (
              <div
                key={titel}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#1db682]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1db682]" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{titel}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{beschreibung}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Embeddable Widget ── */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-[#6991d8]" />
              Embeddable Preisverlauf-Widget
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              Binde unseren Preisverlauf-Chart kostenlos auf deinem Blog oder deiner Webseite ein.
              Das Widget aktualisiert sich automatisch und enthält einen Backlink zu urlaubfinder365.de.
              Ideal für Reiseblogger und Medienseiten.
            </p>
          </div>
          <EmbedCode
            destinationSlug="antalya"
            destinationName="Antalya"
            days={30}
            theme="light"
          />
        </section>

        {/* ── Kontakt CTA ── */}
        <section
          className="rounded-3xl text-white text-center p-12 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d4a6e 55%, #0f7a6b 100%)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #1db682, transparent)", transform: "translate(30%, -30%)" }} />
          <div className="relative">
            <Newspaper className="w-10 h-10 mx-auto mb-4 text-[#1db682]" />
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Presseanfragen & Kooperationen
            </h2>
            <p className="text-blue-100/75 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Für Presseanfragen, Interviewwünsche, Daten-Anfragen oder Kooperationsanfragen
              stehen wir gerne zur Verfügung. Wir antworten in der Regel innerhalb von 24 Stunden.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${PRESSEKONTAKT.email}?subject=Presseanfrage%20urlaubfinder365.de`}
                className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#17a370] text-white font-black px-7 py-3.5 rounded-2xl transition-colors"
              >
                <Mail className="w-4 h-4" />
                {PRESSEKONTAKT.email}
              </a>
              <a
                href={`tel:${PRESSEKONTAKT.telefon.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                {PRESSEKONTAKT.telefon}
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
