import type { Metadata } from "next";
import { Euro, Users, Globe, ShieldCheck, TrendingUp, Smartphone } from "lucide-react";
import AnbieterFormular from "@/components/marktplatz/AnbieterFormular";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Anbieter werden – Touren, Transfers & Aktivitäten listen | Urlaubfinder365 Marktplatz",
  description:
    "Kostenlos als Anbieter registrieren: Liste deine Touren, Transfers, Stadtführungen & Aktivitäten auf dem Urlaubfinder365 Marktplatz. Nur 15% Provision bei erfolgreicher Buchung.",
  alternates: { canonical: "https://www.urlaubfinder365.de/marktplatz/anbieter-werden/" },
};

const VORTEILE = [
  { icon: Euro,       titel: "Nur 15% Provision",      text: "Keine Fixkosten, kein Abo. Du zahlst nur bei erfolgreicher Buchung." },
  { icon: Globe,      titel: "Millionen Reisende",      text: "Zugang zu deutschen Urlaubern — der kaufkräftigsten Urlaubsgruppe weltweit." },
  { icon: ShieldCheck,titel: "Verifizierter Anbieter", text: "Dein Profil erhält das Verifizierungs-Badge für mehr Vertrauen & Buchungen." },
  { icon: Users,      titel: "Eigenes Profil",          text: "Profil mit Fotos, Bewertungen, Sprachen und deiner Geschichte." },
  { icon: TrendingUp, titel: "Kostenlose Reichweite",   text: "Deine Angebote werden in Suchergebnissen und auf Urlaubsziel-Seiten angezeigt." },
  { icon: Smartphone, titel: "Einfache Verwaltung",     text: "Buchungsanfragen direkt per E-Mail — kein kompliziertes Dashboard nötig." },
];

const SCHRITTE = [
  { nr: "1", titel: "Registrieren",         text: "Füll das Formular aus — dauert 5 Minuten." },
  { nr: "2", titel: "Profil erstellen",      text: "Füge Fotos, Beschreibung und Preise hinzu." },
  { nr: "3", titel: "Verifizierung",         text: "Wir prüfen dein Profil innerhalb von 48 Stunden." },
  { nr: "4", titel: "Buchungen empfangen",   text: "Anfragen kommen per E-Mail — du bestätigst direkt." },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "340px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80&auto=format"
          alt="Anbieter werden"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#00838F]/90 via-[#006d78]/85 to-[#004d57]/90" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🤝 Werde Partner auf unserem Marktplatz
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Mehr Buchungen.<br />Weniger Aufwand.
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Kostenlos listen, nur bei Buchung zahlen. Erreiche tausende deutsche Urlauber mit deinen Touren, Transfers & Aktivitäten.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Vorteile */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Warum Urlaubfinder365?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VORTEILE.map(({ icon: Icon, titel, text }) => (
              <div key={titel} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-2xl bg-[#00838F]/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#00838F]" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{titel}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Wie es funktioniert */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">So einfach geht's</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHRITTE.map((s) => (
              <div key={s.nr} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-[#00838F] text-white font-black text-lg flex items-center justify-center mx-auto mb-3">
                  {s.nr}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.titel}</h3>
                <p className="text-xs text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Registrierungsformular */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Jetzt kostenlos registrieren</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Füll das Formular aus und wir melden uns innerhalb von 48 Stunden bei dir.
              Dein erstes Angebot ist sofort nach Freischaltung sichtbar.
            </p>
            <div className="bg-[#00838F]/8 border border-[#00838F]/20 rounded-2xl p-5 space-y-2 text-sm text-gray-700">
              <p className="font-bold text-[#00838F]">💰 Preismodell</p>
              <p>✅ Registrierung & Listing: <strong>kostenlos</strong></p>
              <p>✅ Provision: <strong>nur 15%</strong> bei erfolgreicher Buchung</p>
              <p>✅ Keine Monatsgebühren, kein Abo, kein Risiko</p>
            </div>
          </div>
          <AnbieterFormular />
        </section>
      </div>
    </div>
  );
}
