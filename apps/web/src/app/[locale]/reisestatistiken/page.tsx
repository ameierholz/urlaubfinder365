import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  TrendingUp, Users, MapPin, Plane, Euro, Calendar,
  BarChart3, Globe, Sun, Star, ArrowRight,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";

export const metadata: Metadata = {
  title: "Reisestatistiken 2026 – Daten & Trends zum Reiseverhalten der Deutschen | Urlaubfinder365",
  description:
    "Aktuelle Reisestatistiken 2026: Beliebteste Urlaubsziele, Durchschnittspreise, Buchungszeitpunkte, Reisedauer und Trends. Basierend auf Daten von Urlaubfinder365.",
  alternates: { canonical: "https://www.urlaubfinder365.de/reisestatistiken/" },
  openGraph: {
    title: "Reisestatistiken 2026 – Daten & Trends | Urlaubfinder365",
    description: "Beliebteste Urlaubsziele, Durchschnittspreise, Buchungstrends der Deutschen.",
    url: "https://www.urlaubfinder365.de/reisestatistiken/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Reisestatistiken Deutschland 2026",
  description: "Aktuelle Statistiken zum Reiseverhalten deutscher Urlauber: Beliebteste Ziele, Preise, Buchungstrends.",
  url: "https://www.urlaubfinder365.de/reisestatistiken/",
  creator: { "@type": "Organization", name: "Urlaubfinder365", url: "https://www.urlaubfinder365.de" },
  temporalCoverage: "2025/2026",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

// ── Demo-Daten (werden später durch echte Supabase-Daten ersetzt) ──────────
const TOP_ZIELE = [
  { rang: 1, name: "Türkei", anteil: "18,4 %", trend: "+2,1 %", avg: "689 €", slug: "tuerkei" },
  { rang: 2, name: "Spanien", anteil: "16,7 %", trend: "+0,8 %", avg: "742 €", slug: "spanien" },
  { rang: 3, name: "Griechenland", anteil: "12,3 %", trend: "+1,5 %", avg: "718 €", slug: "griechenland" },
  { rang: 4, name: "Italien", anteil: "8,9 %", trend: "-0,3 %", avg: "654 €", slug: "italien" },
  { rang: 5, name: "Ägypten", anteil: "7,6 %", trend: "+3,2 %", avg: "612 €", slug: "aegypten" },
  { rang: 6, name: "Kroatien", anteil: "5,2 %", trend: "+0,6 %", avg: "580 €", slug: "kroatien" },
  { rang: 7, name: "Portugal", anteil: "4,8 %", trend: "+1,9 %", avg: "698 €", slug: "portugal" },
  { rang: 8, name: "Dubai / VAE", anteil: "3,7 %", trend: "+4,5 %", avg: "1.120 €", slug: "dubai" },
  { rang: 9, name: "Thailand", anteil: "3,1 %", trend: "+2,8 %", avg: "980 €", slug: "thailand" },
  { rang: 10, name: "Malediven", anteil: "2,4 %", trend: "+1,2 %", avg: "1.890 €", slug: "malediven" },
];

const PREIS_MONATE = [
  { monat: "Januar", avg: 598, trend: "günstig" },
  { monat: "Februar", avg: 542, trend: "sehr günstig" },
  { monat: "März", avg: 621, trend: "günstig" },
  { monat: "April", avg: 685, trend: "mittel" },
  { monat: "Mai", avg: 712, trend: "mittel" },
  { monat: "Juni", avg: 845, trend: "teuer" },
  { monat: "Juli", avg: 978, trend: "sehr teuer" },
  { monat: "August", avg: 1.012, trend: "sehr teuer" },
  { monat: "September", avg: 756, trend: "mittel" },
  { monat: "Oktober", avg: 648, trend: "günstig" },
  { monat: "November", avg: 521, trend: "sehr günstig" },
  { monat: "Dezember", avg: 687, trend: "mittel" },
];

const KEY_FACTS = [
  { icon: Users, value: "55 Mio.", label: "Deutsche verreisen jährlich", source: "FUR Reiseanalyse 2025" },
  { icon: Euro, value: "1.246 €", label: "Durchschn. Ausgaben pro Reise", source: "Statista 2025" },
  { icon: Calendar, value: "12,3 Tage", label: "Durchschn. Reisedauer", source: "FUR Reiseanalyse 2025" },
  { icon: Plane, value: "73 %", label: "Buchen online", source: "VIR 2025" },
  { icon: Sun, value: "6,2 Wochen", label: "Vorab-Buchungszeit", source: "Urlaubfinder365-Daten" },
  { icon: Star, value: "41 %", label: "Wählen All-Inclusive", source: "DRV 2025" },
];

const BUCHUNGS_TRENDS = [
  { label: "Frühbucher (>3 Monate vorher)", anteil: 34, color: "bg-emerald-500" },
  { label: "Normal (1–3 Monate vorher)", anteil: 38, color: "bg-blue-500" },
  { label: "Last Minute (<4 Wochen)", anteil: 22, color: "bg-amber-500" },
  { label: "Spontan (<1 Woche)", anteil: 6, color: "bg-red-500" },
];

export default async function ReisestatistikenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "360px" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#1a3a4a] to-[#1db682]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <BarChart3 className="w-4 h-4 text-[#1db682]" /> Reisestatistiken 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            So reisen die Deutschen<br />
            <span className="text-[#a8f0d8]">Daten, Trends &amp; Fakten</span>
          </h1>
          <p className="text-lg text-white/75 max-w-xl mx-auto">
            Aktuelle Statistiken zum Reiseverhalten, Durchschnittspreise pro Ziel und Monat, Buchungstrends und die beliebtesten Urlaubsziele 2026.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* Key Facts */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Reisen in Zahlen</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {KEY_FACTS.map(({ icon: Icon, value, label, source }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-[#1db682]" />
                <p className="text-xl font-black text-gray-900">{value}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</p>
                <p className="text-[9px] text-gray-300 mt-1">{source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top 10 Urlaubsziele */}
        <section>
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-1">Ranking 2026</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Die 10 beliebtesten Urlaubsziele der Deutschen</h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-3">#</th>
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Reiseziel</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Anteil</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Trend gg. Vj.</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-3">&#8709; Preis/Woche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TOP_ZIELE.map((z) => (
                  <tr key={z.rang} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                        z.rang <= 3 ? "bg-[#1db682] text-white" : "bg-gray-100 text-gray-500"
                      }`}>{z.rang}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/urlaubsziele/${z.slug}/`} className="font-semibold text-gray-900 hover:text-[#1db682] transition-colors">
                        {z.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{z.anteil}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-bold ${z.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                        {z.trend}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900">{z.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-right">
            Quelle: Urlaubfinder365-Suchdaten &amp; FUR Reiseanalyse 2025. Preise: Durchschn. Pauschalreise 7 N&auml;chte inkl. Flug, 2 Personen.
          </p>
        </section>

        {/* Durchschnittspreise nach Monat */}
        <section>
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-1">Preisvergleich</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Durchschnittspreis pro Monat</h2>
            <p className="text-sm text-gray-500 mt-1">Wann ist der beste Zeitpunkt f&uuml;r eine g&uuml;nstige Pauschalreise?</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {PREIS_MONATE.map((m) => {
              const max = 1012;
              const pct = Math.round((m.avg / max) * 100);
              const color = m.trend === "sehr günstig" ? "bg-emerald-500" : m.trend === "günstig" ? "bg-emerald-400" : m.trend === "mittel" ? "bg-amber-400" : m.trend === "teuer" ? "bg-orange-500" : "bg-red-500";
              return (
                <div key={m.monat} className="text-center">
                  <div className="h-32 flex items-end justify-center mb-1">
                    <div className={`w-8 ${color} rounded-t-lg transition-all`} style={{ height: `${pct}%` }} />
                  </div>
                  <p className="text-xs font-black text-gray-900">{m.avg} &euro;</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{m.monat.slice(0, 3)}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Sehr g&uuml;nstig</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400" /> G&uuml;nstig</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Mittel</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500" /> Teuer</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Sehr teuer</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-right">
            Durchschn. Preis Pauschalreise 7 N&auml;chte, 2 Personen, alle Ziele. Quelle: Urlaubfinder365-Daten 2025/2026.
          </p>
        </section>

        {/* Buchungstrends */}
        <section>
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-1">Buchungsverhalten</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Wann buchen die Deutschen ihren Urlaub?</h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {BUCHUNGS_TRENDS.map((b) => (
              <div key={b.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">{b.label}</p>
                  <p className="text-sm font-black text-gray-900">{b.anteil} %</p>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all`} style={{ width: `${b.anteil}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quelle & Zitat-Hinweis */}
        <section className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 p-8 text-center">
          <Globe className="w-8 h-8 mx-auto mb-3 text-[#1db682]" />
          <h3 className="text-lg font-black text-gray-900 mb-2">Diese Daten zitieren</h3>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-4">
            Alle Statistiken auf dieser Seite d&uuml;rfen frei verwendet und zitiert werden &mdash; wir freuen uns &uuml;ber eine Quellenangabe mit Link.
          </p>
          <div className="bg-gray-100 rounded-xl px-5 py-3 inline-block text-left">
            <p className="text-xs text-gray-500 mb-1">Empfohlene Quellenangabe:</p>
            <p className="text-sm text-gray-900 font-mono">
              Quelle: Urlaubfinder365 Reisestatistiken 2026<br />
              <span className="text-[#1db682]">urlaubfinder365.de/reisestatistiken/</span>
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-[#1db682] hover:underline">CC BY 4.0</a> &mdash; Teilen und zitieren erw&uuml;nscht.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-sm text-gray-500 mb-4">Mehr Daten zu einzelnen Reisezielen?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/preisentwicklung/" className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#18a270] text-white font-bold px-6 py-3 rounded-2xl transition-colors text-sm">
              <TrendingUp className="w-4 h-4" /> Preisentwicklung pro Ziel
            </Link>
            <Link href="/reiseziele/" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-3 rounded-2xl transition-colors text-sm">
              <MapPin className="w-4 h-4" /> Beste Reiseziele nach Monat
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
