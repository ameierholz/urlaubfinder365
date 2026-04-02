import type { Metadata } from "next";
import { ShieldCheck, Euro, Clock, Star } from "lucide-react";
import VersicherungVergleich from "@/components/versicherung/VersicherungVergleich";

export const metadata: Metadata = {
  title: "Reiseversicherung Vergleich 2025 – Günstig & sicher reisen",
  description:
    "Reiseversicherung vergleichen & online abschließen ✓ Auslandskranken, Rücktritt, Gepäck & Kombipolicen ✓ Ab 9,80 € / Jahr ✓ Testsieger & Empfehlungen.",
  alternates: { canonical: "https://www.urlaubfinder365.de/reiseversicherung/" },
  openGraph: {
    title: "Reiseversicherung Vergleich 2025 – Günstig & sicher reisen",
    description: "Alle Reiseversicherungen im Vergleich: Auslandskranken, Rücktritt, Gepäck & Kombi — jetzt günstig abschließen.",
    url: "https://www.urlaubfinder365.de/reiseversicherung/",
    type: "website",
  },
};

const STATS = [
  { icon: ShieldCheck, zahl: "5",         text: "Versicherungstypen" },
  { icon: Star,        zahl: "50+",        text: "Tarife im Vergleich" },
  { icon: Euro,        zahl: "ab 9,80 €",  text: "Preis pro Jahr" },
  { icon: Clock,       zahl: "2 Min.",      text: "Bis zum Abschluss" },
];

export default function ReiseversicherungPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-br from-[#1a5f9a] to-[#0e4070] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🛡️ Reiseversicherung Vergleich 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Sicher reisen —<br />günstig versichert
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Vergleiche Auslandskrankenversicherung, Reiserücktritt & Co. und finde den besten Tarif
            für deine nächste Reise. Ab 9,80 € pro Jahr bereits gut abgesichert.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {STATS.map(({ icon: Icon, zahl, text }) => (
              <div key={text} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-5 h-5 mx-auto mb-1 text-white/80" />
                <p className="text-xl font-black">{zahl}</p>
                <p className="text-xs text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wichtigkeits-Banner */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm text-red-800">
            <strong>Wichtig:</strong> Die gesetzliche Krankenkasse zahlt im Ausland oft gar nicht.
            Ein Krankenhausaufenthalt in den USA kann <strong>50.000 € und mehr</strong> kosten.
            Eine Auslandskrankenversicherung ist für nur ca. 10 € / Jahr unverzichtbar.
          </p>
        </div>
      </div>

      {/* Hauptinhalt */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <VersicherungVergleich />
      </section>
    </div>
  );
}
