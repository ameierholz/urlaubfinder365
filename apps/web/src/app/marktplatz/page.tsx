import type { Metadata } from "next";
import { Compass, ShieldCheck, Euro, Users } from "lucide-react";
import Link from "next/link";
import MarktplatzListe from "@/components/marktplatz/MarktplatzListe";

export const metadata: Metadata = {
  title: "Aktivitäten & Touren buchen – Lokaler Marktplatz | Urlaubfinder365",
  description:
    "Touren, Stadtführungen, Wassersport & Erlebnisse direkt bei lokalen Anbietern buchen. Geprüfte Guides, faire Preise, sofortige Buchungsbestätigung.",
  alternates: { canonical: "https://www.urlaubfinder365.de/marktplatz/" },
  openGraph: {
    title: "Aktivitäten & Touren – Lokaler Marktplatz | Urlaubfinder365",
    description: "Unvergessliche Erlebnisse direkt bei lokalen Guides & Anbietern buchen.",
    url: "https://www.urlaubfinder365.de/marktplatz/",
    type: "website",
  },
};

const STATS = [
  { icon: Compass,     zahl: "50+",     text: "Aktivitäten" },
  { icon: ShieldCheck, zahl: "Geprüft", text: "Alle Anbieter verifiziert" },
  { icon: Euro,        zahl: "Fair",    text: "Direkt beim Anbieter" },
  { icon: Users,       zahl: "1.200+",  text: "Zufriedene Reisende" },
];

export default function MarktplatzPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "360px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
          alt="Aktivitäten & Touren"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0f3460]/90 via-[#1a5276]/80 to-[#00838F]/75" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🌍 Lokaler Aktivitäten-Marktplatz
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Unvergessliche Erlebnisse<br />direkt vor Ort buchen
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed mb-8">
            Touren, Stadtführungen, Wassersport & Erlebnisse — direkt bei verifizierten
            lokalen Anbietern. Authentisch, fair und persönlich.
          </p>

          <Link
            href="/marktplatz/anbieter-werden/"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            🤝 Du bist Anbieter? Jetzt kostenlos listen
          </Link>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {STATS.map(({ icon: Icon, zahl, text }) => (
              <div key={text} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-5 h-5 mx-auto mb-1 text-white/80" />
                <p className="text-lg font-black">{zahl}</p>
                <p className="text-xs text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MarktplatzListe />
      </section>

      {/* Anbieter CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-linear-to-r from-[#00838F] to-[#006d78] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black mb-2">Du bist lokaler Guide oder Anbieter?</h2>
            <p className="text-white/80 max-w-lg leading-relaxed">
              Liste deine Touren & Aktivitäten kostenlos auf unserem Marktplatz.
              Wir nehmen nur 15% Provision bei erfolgreicher Buchung — kein Risiko, kein Abo.
            </p>
          </div>
          <Link
            href="/marktplatz/anbieter-werden/"
            className="shrink-0 bg-white text-[#00838F] font-black px-7 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors text-sm"
          >
            Kostenlos registrieren →
          </Link>
        </div>
      </section>
    </div>
  );
}
