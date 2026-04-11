import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Globe, Users, TrendingUp, Heart, Award } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
export const metadata: Metadata = {
  title: "Über uns – Urlaubfinder365",
  description:
    "Erfahre mehr über Urlaubfinder365: Unsere Mission, unser Team und warum wir täglich tausende Urlaubsangebote vergleichen, damit du den besten Urlaub findest.",
  alternates: { canonical: "https://www.urlaubfinder365.de/ueber-uns/" },
  openGraph: {
    title: "Über uns – Urlaubfinder365",
    description:
      "Erfahre mehr über Urlaubfinder365: Unsere Mission, unser Team und warum wir täglich tausende Urlaubsangebote vergleichen.",
    url: "https://www.urlaubfinder365.de/ueber-uns/",
    type: "website",
  },
};

const WERTE = [
  {
    icon: ShieldCheck,
    title: "Transparenz",
    desc: "Keine versteckten Aufpreise. Du siehst den echten Endpreis und buchst direkt beim Reiseveranstalter.",
  },
  {
    icon: Globe,
    title: "Vielfalt",
    desc: "Über 50 Reiseveranstalter, 250+ Urlaubsziele und tausende Hotels – täglich aktualisiert.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Echte Urlaubsberichte, Gruppen und Tipps von Reisenden für Reisende – nicht von Marketing-Teams.",
  },
  {
    icon: TrendingUp,
    title: "Beste Preise",
    desc: "Algorithmen vergleichen täglich tausende Angebote, damit du zum besten Zeitpunkt buchst.",
  },
  {
    icon: Heart,
    title: "Leidenschaft",
    desc: "Wir reisen selbst leidenschaftlich gern. Jeder Guide basiert auf echtem Urlaubswissen.",
  },
  {
    icon: Award,
    title: "Qualität",
    desc: "Nur Hotels mit mindestens 50% HolidayCheck-Empfehlung schaffen es in unsere Ergebnisse.",
  },
];

const MEILENSTEINE = [
  { year: "2024", text: "Idee und Konzeptentwicklung: Reisevergleich einfach, ehrlich und für alle zugänglich machen." },
  { year: "2025", text: "Gründung von Urlaubfinder365. Anbindung an specials.de, travianet und Tiqets. Launch der ersten Version." },
  { year: "2026", text: "Community-Funktionen, kostenlose Urlaubsführer für 5 Top-Ziele und über 250 buchbare Urlaubsziele." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Über uns – Urlaubfinder365",
    description: "Erfahre mehr über Urlaubfinder365, unsere Mission und unser Team.",
    url: "https://www.urlaubfinder365.de/ueber-uns/",
    mainEntity: {
      "@type": "Organization",
      name: "Urlaubfinder365",
      url: "https://www.urlaubfinder365.de",
      founder: {
        "@type": "Person",
        name: "Andre Meier",
      },
      foundingDate: "2025",
      description:
        "Urlaubfinder365 ist ein deutsches Reisevergleichsportal, das täglich tausende Pauschalreisen, All-Inclusive- und Last-Minute-Angebote von über 50 Reiseveranstaltern vergleicht.",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Über uns", item: "https://www.urlaubfinder365.de/ueber-uns/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen">
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')",
          minHeight: "340px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Über Urlaubfinder365
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Wir machen Urlaub buchen einfach, ehrlich und für jeden zugänglich.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission */}
        <section className="py-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Unsere Mission</h2>
          <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
            <p>
              Wer online nach Pauschalreisen sucht, verliert sich schnell in einem Dschungel
              aus Vergleichsportalen, versteckten Aufpreisen und unübersichtlichen Buchungsstrecken.
              Genau das wollen wir ändern.
            </p>
            <p>
              <strong>Urlaubfinder365</strong> vergleicht täglich tausende Urlaubsangebote von über
              50 namhaften Veranstaltern – von TUI und DERTOUR bis FTI und Alltours. Unser Ziel:
              Dir den besten Preis zeigen, ohne Tricks, ohne versteckte Kosten. Du buchst direkt
              beim Veranstalter und bist durch das deutsche Pauschalreisegesetz voll geschützt.
            </p>
            <p>
              Aber Urlaubfinder365 ist mehr als ein Preisvergleich. Mit unseren kostenlosen
              Urlaubsführern, der aktiven Urlaubs-Community und Aktivitäten-Tickets für über 250
              Urlaubsziele begleiten wir dich von der ersten Inspiration bis zum letzten Urlaubstag.
            </p>
          </div>
        </section>

        {/* Unsere Werte */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Unsere Werte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WERTE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gründer */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Der Gründer</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-3xl font-black text-emerald-600">AM</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Andre Meier</h3>
              <p className="text-sm text-emerald-600 font-medium mb-3">Gründer & Geschäftsführer</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Als leidenschaftlicher Reisender und Softwareentwickler hat Andre Urlaubfinder365
                aus einer einfachen Überzeugung gegründet: Urlaub buchen sollte nicht kompliziert
                sein. Mit Erfahrung in Webentwicklung und einem tiefen Verständnis für die
                Bedürfnisse von Reisenden hat er eine Plattform geschaffen, die Preistransparenz,
                Community und Urlaubs-Inspiration vereint.
              </p>
            </div>
          </div>
        </section>

        {/* Meilensteine */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Unsere Geschichte</h2>
          <div className="space-y-6">
            {MEILENSTEINE.map(({ year, text }) => (
              <div key={year} className="flex gap-4">
                <div className="w-16 shrink-0 text-right">
                  <span className="text-lg font-black text-emerald-600">{year}</span>
                </div>
                <div className="border-l-2 border-emerald-200 pl-4 pb-2">
                  <p className="text-gray-700 text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zahlen */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Urlaubfinder365 in Zahlen</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: "50+", label: "Reiseveranstalter" },
              { num: "250+", label: "Urlaubsziele" },
              { num: "5", label: "Kostenlose Urlaubsführer" },
              { num: "24/7", label: "Täglich aktuell" },
            ].map(({ num, label }) => (
              <div key={label} className="bg-emerald-50 rounded-xl p-5 text-center">
                <div className="text-2xl font-black text-emerald-600">{num}</div>
                <div className="text-sm text-gray-600 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Unsere Partner</h2>
          <p className="text-gray-700 text-sm mb-6">
            Wir arbeiten mit etablierten Partnern zusammen, um dir die besten Urlaubsangebote zu bieten:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <p className="font-bold text-gray-900">specials.de / Ypsilon.Net</p>
              <p className="text-xs text-gray-500 mt-1">Pauschalreisen, Last Minute & All Inclusive</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <p className="font-bold text-gray-900">travianet GmbH</p>
              <p className="text-xs text-gray-500 mt-1">Kreuzfahrten & Hochseefahrten</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <p className="font-bold text-gray-900">Tiqets B.V.</p>
              <p className="text-xs text-gray-500 mt-1">Aktivitäten, Tickets & Erlebnisse</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-t border-gray-200 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">
            Bereit für deinen nächsten Traumurlaub?
          </h2>
          <p className="text-gray-600 mb-6">
            Vergleiche jetzt tausende Angebote und finde den besten Preis.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              Urlaub suchen
            </Link>
            <Link
              href="/community/"
              className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              Community beitreten
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
