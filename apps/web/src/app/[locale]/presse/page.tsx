import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Download, Globe, Users, TrendingUp, Star } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "📰 Presse – Urlaubfinder365",
  description: "Presseinformationen, Medienkit und Kontakt für Journalisten von Urlaubfinder365.de.",
  alternates: { canonical: "https://www.urlaubfinder365.de/presse/" },
  openGraph: {
    title: "📰 Presse – Urlaubfinder365",
    description: "Presseinformationen, Medienkit und Kontakt für Journalisten von Urlaubfinder365.de.",
    url: "https://www.urlaubfinder365.de/presse/",
  },
};

const STATS = [
  { icon: Globe,      value: "365 Tage",  label: "täglich neue Angebote" },
  { icon: Users,      value: "50+",       label: "Reiseveranstalter verglichen" },
  { icon: TrendingUp, value: "10.000+",   label: "Angebote täglich aktuell" },
  { icon: Star,       value: "kostenlos", label: "Reiseführer für Nutzer" },
];

// Betreiber
const BETREIBER = {
  name:    "Andre Meier",
  adresse: "Dieselstraße 18, 74372 Sersheim, Deutschland",
  email:   "info@urlaubfinder365.de",
};

const PRESS_RELEASES = [
  {
    date: "März 2026",
    title: "Urlaubfinder365.de startet als neues Reisevergleichsportal für den deutschsprachigen Markt",
    teaser:
      "Das neue Reiseportal Urlaubfinder365.de vergleicht täglich tausende Pauschalreisen, All-Inclusive- und Last-Minute-Angebote von über 50 namhaften Reiseveranstaltern.",
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>

      {/* ── Hero ── */}
      <section
        className="relative py-16 px-4 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f2d4a 0%, #0d6e8c 60%, #1a9f8f 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-6">
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">📰 Presse & Partner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">
            Mediadaten & Kooperationen
          </h1>
          <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto">
            Urlaubfinder365.de ist Deutschlands kompaktes Reisevergleichsportal für Pauschalreisen,
            All Inclusive, Last Minute und Kreuzfahrten. Hier findest du alle Infos für Medien,
            Blogger und Kooperationspartner.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ── Zahlen ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">Urlaubfinder365 auf einen Blick</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <Icon className="w-7 h-7 text-sand-500 mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Über das Portal ── */}
        <section className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">Über Urlaubfinder365</h2>
            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>
                <strong>Urlaubfinder365.de</strong> ist ein unabhängiges deutschsprachiges
                Reisevergleichsportal. Wir aggregieren täglich tausende Reiseangebote von über 50
                führenden Reiseveranstaltern und stellen sie übersichtlich dar – von Pauschalreisen
                über All-Inclusive bis hin zu Last-Minute-Deals und Kreuzfahrten.
              </p>
              <p>
                Zusätzlich bieten wir kostenlose <strong>Reiseführer</strong> für die beliebtesten
                deutschen Urlaubsziele: Türkei, Griechenland, Spanien, Ägypten und mehr.
              </p>
              <p>
                Unser Ziel: Urlaubern helfen, in wenigen Minuten das beste Angebot zum günstigsten
                Preis zu finden und direkt beim Veranstalter zu buchen.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">Zielgruppe</h2>
            <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
              {[
                "Urlaubsreisende aus Deutschland, Österreich und der Schweiz",
                "Preisbewusste Reisende, die vergleichen möchten",
                "Familien, Paare und Alleinreisende (25–65 Jahre)",
                "Interessierte an All Inclusive, Last Minute und Frühbucher-Angeboten",
                "Kreuzfahrt-Enthusiasten",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-sand-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Pressemitteilungen ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">Pressemitteilungen</h2>
          <div className="space-y-4">
            {PRESS_RELEASES.map((pr) => (
              <div key={pr.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="text-xs font-bold text-sand-500 uppercase tracking-wide">{pr.date}</span>
                <h3 className="font-black text-gray-900 text-base mt-1 mb-2">{pr.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pr.teaser}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kooperationen ── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Kooperationen & Partnerschaften</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Wir sind offen für Kooperationen mit Reiseveranstaltern, Reisebloggern,
            Tourismusorganisationen und Medienpartnern. Mögliche Formen der Zusammenarbeit:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Content-Kooperationen", desc: "Gastbeiträge, Reiseberichte und gemeinsame Reiseführer mit Verlinkung." },
              { title: "Affiliate & Vertrieb", desc: "Wir verlinken Reiseangebote von Veranstaltern mit Partnerlink (Affiliate)." },
              { title: "Medienkooperationen", desc: "Preisvergleiche, Marktübersichten und Daten für redaktionelle Beiträge." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-sand-50 rounded-2xl border border-sand-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kontakt ── */}
        <section
          className="rounded-3xl text-white text-center p-10"
          style={{ background: "linear-gradient(135deg, #1a1200 0%, #7c5c12 50%, #c49038 100%)" }}
        >
          <h2 className="text-2xl font-black mb-3">Presseanfragen & Kooperationen</h2>
          <p className="text-sand-100/80 text-sm mb-6 max-w-lg mx-auto">
            Für Presseanfragen, Interviewwünsche oder Kooperationsanfragen stehen wir gerne
            zur Verfügung.
          </p>
          <div className="space-y-2 mb-4 text-blue-100/70 text-sm">
            <p>{BETREIBER.name}</p>
            <p>{BETREIBER.adresse}</p>
          </div>
          <a
            href={`mailto:${BETREIBER.email}?subject=Presseanfrage%20Urlaubfinder365`}
            className="inline-flex items-center gap-2 bg-white text-sand-600 font-black px-7 py-3.5 rounded-2xl hover:bg-sand-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {BETREIBER.email}
          </a>
        </section>

      </div>
    </main>
  );
}
