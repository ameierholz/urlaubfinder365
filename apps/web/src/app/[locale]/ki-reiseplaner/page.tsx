import type { Metadata } from "next";
import { Sparkles, MapPin, Clock, Brain } from "lucide-react";
import ReiseplanerClient from "@/components/reiseplaner/ReiseplanerClient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "KI-Reiseplaner – Dein persönlicher Reiseplan in Sekunden",
  description:
    "Kostenloser KI-Reiseplaner: Einfach Ziel, Dauer & Interessen eingeben — die KI erstellt deinen kompletten Tagesplan mit Aktivitäten, Tipps & Budgetschätzung.",
  alternates: { canonical: "https://www.urlaubfinder365.de/ki-reiseplaner/" },
  openGraph: {
    title: "KI-Reiseplaner – Dein persönlicher Reiseplan in Sekunden",
    description: "KI plant deine Traumreise: Tagesplan, Aktivitäten, Budget & Insider-Tipps — kostenlos & sofort.",
    url: "https://www.urlaubfinder365.de/ki-reiseplaner/",
    type: "website",
  },
};

const FEATURES = [
  { icon: Brain,   text: "Powered by Claude AI" },
  { icon: MapPin,  text: "250+ Reiseziele" },
  { icon: Clock,   text: "Fertig in ~15 Sek." },
  { icon: Sparkles,text: "Kostenlos nutzbar" },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "380px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
          alt="KI Reiseplaner"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#1a1a2e]/90 via-[#16213e]/80 to-[#0f3460]/85" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4 text-amber-300" /> KI-Reiseplaner — Powered by Claude AI
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Dein persönlicher<br />Reiseplan in Sekunden
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Gib dein Reiseziel, die Dauer und deine Interessen ein —
            unsere KI erstellt dir einen kompletten Tagesplan mit Aktivitäten, Insider-Tipps und Budgetschätzung.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                <Icon className="w-4 h-4 text-amber-300" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReiseplanerClient />
      </section>
    </div>
  );
}
