import type { Metadata } from "next";
import Link from "next/link";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale } from "next-intl/server";
import {
  Megaphone, MapPin, TrendingUp, Users, BadgeCheck, Star,
  Monitor, Globe, ChevronRight,
  CheckCircle2, Zap, BarChart3, Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Werbepartner werden – Lokale Werbeplätze auf Urlaubfinder365",
  description:
    "Erreiche Hunderttausende Urlauber: Werbeplätze für lokale Unternehmen & Marktplatz-Anbieter auf Urlaubfinder365.de – transparent, flexibel, messbar.",
  alternates: { canonical: "https://www.urlaubfinder365.de/werbepartner/" },
  openGraph: {
    title: "Werbepartner werden – Lokale Werbeplätze | Urlaubfinder365",
    description: "Schalte Werbung dort, wo Urlauber planen und buchen. Lokale Werbeplätze ab 49 €/Monat.",
    url: "https://www.urlaubfinder365.de/werbepartner/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Werbepartner werden – Urlaubfinder365",
  description: "Werbeplätze für lokale Unternehmen und Aktivitäts-Anbieter auf Urlaubfinder365.",
  url: "https://www.urlaubfinder365.de/werbepartner/",
};

// ── Werbepakete Lokale Partner ───────────────────────────────────────────────

const PAKETE_LOKAL = [
  {
    id: "sidebar",
    name: "Sidebar Starter",
    price: 49,
    badge: null,
    accentBg: "bg-gray-50",
    accentBorder: "border-gray-200",
    icon: "📌",
    placement: "Sidebar · 1 Zielseite",
    desc: "Dein Unternehmen erscheint im Lokale-Partner-Widget auf einer Zielseite deiner Wahl – sichtbar für alle Besucher dieser Seite.",
    features: [
      "1 Zielseite (z. B. Mallorca, Antalya, …)",
      "Avatar + Name + Kurzbeschreibung",
      "Direktlink zur deiner Website",
      "Verifiziert-Badge",
      "Flexible Laufzeit (monatlich kündbar)",
    ],
    cta: "Starter buchen",
    size: "250 × 80 px pro Eintrag",
  },
  {
    id: "city",
    name: "City Spotlight",
    price: 79,
    badge: "Beliebt",
    accentBg: "bg-[#1db682]/5",
    accentBorder: "border-[#1db682]",
    icon: "🏙️",
    placement: "Gesponserte Angebote · 1 Stadt",
    desc: "Dein Angebot erscheint prominent in der Gesponsert-Sektion auf der Zielseite einer Stadt – mit Bild, Preis und Buchungs-CTA.",
    features: [
      "1 Stadtseite (z. B. Antalya, Kreta, …)",
      "Bild + Titel + Preis + Anbieter-Info",
      "\"Anzeige\"-Kennzeichnung (DSGVO-konform)",
      "Click-Through zu deiner Detailseite",
      "Monatliche Klick-Statistik",
    ],
    cta: "City Spotlight buchen",
    size: "Karte 300 × 200 px",
  },
  {
    id: "regional",
    name: "Regional",
    price: 149,
    badge: null,
    accentBg: "bg-blue-50/50",
    accentBorder: "border-blue-200",
    icon: "🌍",
    placement: "Gesponserte Angebote · 1 Region/Land",
    desc: "Maximale Reichweite auf allen Seiten einer Region oder eines Landes – ideal für Regionen-Anbieter und Tourenanbieter.",
    features: [
      "Alle Seiten einer Region/eines Landes",
      "Bild + Titel + Preis + Anbieter-Info",
      "Priorisierte Darstellung über organische Einträge",
      "Monatliche Performance-Auswertung",
      "Optimal ab 3 Monate (5 % Rabatt)",
    ],
    cta: "Regional buchen",
    size: "Karte 300 × 200 px",
  },
  {
    id: "premium",
    name: "Premium Bundle",
    price: 299,
    badge: "Beste Reichweite",
    accentBg: "bg-purple-50/50",
    accentBorder: "border-purple-300",
    icon: "🚀",
    placement: "Alle Kanäle · Rundum-Sichtbarkeit",
    desc: "Kombiniertes Paket mit maximaler Sichtbarkeit: Homepage-Carousel, alle Regionseiten, Sidebar-Widget und Anbieter-Spotlight.",
    features: [
      "Homepage-Carousel (250.000+ Besucher/Mo.)",
      "Alle Seiten deiner Zielregion",
      "Sidebar-Widget auf allen relevanten Seiten",
      "Anbieter-Spotlight in der Sidebar",
      "Persönlicher Ansprechpartner & Reporting",
    ],
    cta: "Premium anfragen",
    size: "Alle Formate kombiniert",
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────

const STATS = [
  { zahl: "250.000+", label: "Monatliche Besucher", icon: Users },
  { zahl: "200+",     label: "Urlaubsziele",         icon: MapPin },
  { zahl: "85 %",     label: "In der Planungsphase", icon: TrendingUp },
  { zahl: "ab 49 €",  label: "Einstiegspreis/Monat", icon: BarChart3 },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Was ist der Unterschied zwischen Lokaler Werbepartner und Marktplatz-Anbieter?",
    a: "Lokale Werbepartner sind Unternehmen (Hotels, Restaurants, Tour-Anbieter vor Ort), die Werbeflächen auf Urlaubfinder365 buchen – zu einer festen Monatsgebühr. Marktplatz-Anbieter listen ihre Aktivitäten und Erlebnisse direkt im Marktplatz und zahlen nur bei Buchungen (15 % Provision).",
  },
  {
    q: "Wie lange ist die Mindestlaufzeit?",
    a: "Alle Pakete sind monatlich kündbar. Ab 3 Monaten Laufzeit erhältst du automatisch 5 % Rabatt, ab 6 Monaten 10 % und ab 12 Monaten 15 %.",
  },
  {
    q: "Kann ich die Zielseite meiner Werbung selbst wählen?",
    a: "Ja – beim Buchen wählst du deine Ziel-Stadt, Region oder das Land aus. Deine Anzeige erscheint dann ausschließlich auf den passenden Seiten dieser Region.",
  },
  {
    q: "Wie wird die Werbung DSGVO-konform gekennzeichnet?",
    a: "Alle gesponserten Inhalte werden mit einem deutlichen \"Anzeige\"- oder \"Gesponsert\"-Label versehen. Die Abrechnung erfolgt über Stripe, für datenschutzkonforme Verarbeitung sorgt unsere Datenschutzerklärung.",
  },
  {
    q: "Was passiert wenn noch keine Werbung auf meiner Wunsch-Zielseite aktiv ist?",
    a: "Kein Problem – auf allen Seiten werden Beispiel-Placements angezeigt, damit du siehst wie deine Werbung aussehen wird. Als erster Werbepartner einer Region profitierst du von 100 % Share of Voice.",
  },
];

export default async function WerbepartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "420px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80"
          alt="Werbepartner werden"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0f2027]/95 via-[#1a3a4a]/85 to-[#1db682]/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Megaphone className="w-4 h-4 text-[#1db682]" /> Werbepartner werden
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Mehr Buchungen.<br />
            <span className="text-[#a8f0d8]">Mehr Sichtbarkeit.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Schalte Werbung genau dort, wo Urlauber aktiv planen und buchen —
            auf Urlaubfinder365.de, Deutschlands aufstrebendem Reiseportal für 200+ Ziele.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10">
            {STATS.map(({ zahl, label, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-4 h-4 mx-auto mb-1 text-[#1db682]" />
                <p className="text-xl font-black">{zahl}</p>
                <p className="text-xs text-white/65 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#pakete"
              className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#18a270] text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-colors"
            >
              <Zap className="w-5 h-5" /> Werbeplatz buchen
            </a>
            <Link
              href="/marktplatz/anbieter-werden/"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
            >
              Als Anbieter listen →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Zwei Wege ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">Zwei Modelle</p>
            <h2 className="text-2xl font-extrabold text-gray-900">Wie möchtest du mit uns zusammenarbeiten?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Lokaler Werbepartner */}
            <div className="group rounded-3xl border-2 border-[#1db682]/40 hover:border-[#1db682] bg-gradient-to-br from-[#1db682]/5 to-transparent p-8 transition-all cursor-pointer">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Lokaler Werbepartner</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Für Hotels, Restaurants, Aktivitäts-Anbieter und lokale Unternehmen, die Werbeflächen buchen möchten.
                Du zahlst eine transparente Monatsgebühr — ohne Provision oder versteckte Kosten.
              </p>
              <ul className="space-y-2 mb-6">
                {["Feste Monatsgebühr ab 49 €", "Werbeplatz auf deiner Wunsch-Zielseite", "Mehrere Formate & Größen", "DSGVO-konform & kündbar"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1db682] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#pakete" className="inline-flex items-center gap-1.5 text-[#1db682] font-bold text-sm group-hover:underline">
                Pakete ansehen <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Marktplatz-Anbieter */}
            <div className="group rounded-3xl border-2 border-[#6991d8]/40 hover:border-[#6991d8] bg-gradient-to-br from-[#6991d8]/5 to-transparent p-8 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Marktplatz-Anbieter</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Für Aktivitäts- und Erlebnisanbieter, die ihre Touren, Kurse oder Erlebnisse direkt im Marktplatz listen wollen.
                Listing kostenlos — du zahlst nur bei erfolgter Buchung.
              </p>
              <ul className="space-y-2 mb-6">
                {["Kostenlos listen", "15 % Provision nur bei Buchung", "Eigenes Anbieter-Profil", "Verifiziert-Badge & Bewertungen"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#6991d8] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/marktplatz/anbieter-werden/" className="inline-flex items-center gap-1.5 text-[#6991d8] font-bold text-sm group-hover:underline">
                Jetzt Anbieter werden <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Werbepakete ─────────────────────────────────────────────────── */}
      <section id="pakete" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">Werbeplätze</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Wähle dein Paket</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Monatlich kündbar · DSGVO-konform · Direktlink auf deine Website
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {PAKETE_LOKAL.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-3xl border-2 ${p.accentBorder} ${p.accentBg} p-6 flex flex-col`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#1db682] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{p.name}</h3>
                <p className="text-[11px] text-gray-400 mb-3 font-semibold">{p.placement}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{p.desc}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1db682] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Format Badge */}
                <div className="bg-white/70 rounded-xl px-3 py-2 mb-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Format</p>
                  <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{p.size}</p>
                </div>

                {/* Preis */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900">{p.price} €</span>
                  <span className="text-gray-400 text-sm">/Monat</span>
                </div>

                <a
                  href={`mailto:werbung@urlaubfinder365.de?subject=${encodeURIComponent(`Werbeplatz-Anfrage: ${p.name}`)}`}
                  className="block text-center bg-[#1db682] hover:bg-[#18a270] text-white font-bold px-4 py-3 rounded-2xl transition-colors text-sm"
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Alle Preise zzgl. MwSt. · Rabatte: 3 Mo. −5 % · 6 Mo. −10 % · 12 Mo. −15 %
          </p>
        </div>
      </section>

      {/* ── Live Vorschau ────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="xl:flex xl:gap-16 xl:items-start">

            {/* Text */}
            <div className="xl:w-1/2 mb-10 xl:mb-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">Live-Vorschau</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                So sieht deine Werbung aus
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Die Widgets sind dezent und professionell in das Design von Urlaubfinder365 integriert.
                Dein Eintrag erscheint neben hochwertigem Reise-Content – genau dann, wenn Urlauber
                aktiv ihr Ziel recherchieren.
              </p>

              <div className="space-y-4">
                {[
                  { icon: BadgeCheck, title: "Authentische Einbindung", desc: "Deine Werbung sieht aus wie ein empfohlener Partner, kein aufdringliches Banner." },
                  { icon: MapPin, title: "Zielgenaue Platzierung", desc: "Deine Anzeige erscheint nur auf Seiten, die zu deinem Standort / Angebot passen." },
                  { icon: Shield, title: "DSGVO-konform", desc: "Alle Placements sind sauber als Anzeige gekennzeichnet – keine Cookies ohne Einwilligung." },
                  { icon: TrendingUp, title: "Messbare Performance", desc: "Du erhältst monatlich Klick-Statistiken zu deinem Werbeplatz." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#1db682]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#1db682]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup: So sieht die Sidebar aus */}
            <div className="xl:w-1/2">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 max-w-sm mx-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sidebar-Vorschau</p>

                {/* AdBanner Placeholder */}
                <div className="bg-gray-100 rounded-xl border border-gray-200 mb-4 overflow-hidden">
                  <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-200">Anzeige</p>
                  <div className="h-40 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <p className="text-2xl mb-1">📢</p>
                      <p className="text-xs text-gray-500 font-semibold">Werbebanner 250×160</p>
                      <p className="text-[10px] text-gray-400">Deine Anzeige hier</p>
                    </div>
                  </div>
                </div>

                {/* Gesponserte Angebote Mockup */}
                <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden mb-4">
                  <div className="relative h-24 bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=100&q=60&fit=crop&auto=format"
                      alt="Demo"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">Anzeige</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-900 mb-1">Dein Angebot / Tour / Hotel</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">Deine Stadt, Land</span>
                      <span className="text-sm font-black text-[#00838F]">49 €</span>
                    </div>
                    <div className="mt-2 w-full text-center bg-[#00838F] text-white text-[11px] font-bold py-1.5 rounded-xl">
                      Jetzt buchen →
                    </div>
                  </div>
                </div>

                {/* Lokale Partner Mockup */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lokale Partner</p>
                    <Megaphone className="w-3.5 h-3.5 text-[#1db682]" />
                  </div>
                  {["Dein Unternehmen", "Weitere Partner"].map((name, i) => (
                    <div key={name} className={`flex items-center gap-2.5 px-3 py-2 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                      <div className="w-8 h-8 rounded-full bg-[#1db682]/20 flex items-center justify-center text-xs font-black text-[#1db682] shrink-0">
                        {i === 0 ? "D" : "W"}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900">{name}</p>
                        <p className="text-[10px] text-gray-400">Kurzbeschreibung deines Unternehmens</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-3 py-2 border-t border-gray-100 flex justify-between">
                    <span className="text-[10px] text-gray-400">Werbeplatz frei</span>
                    <span className="text-[10px] text-[#1db682] font-bold">Hier werben →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ + Sidebar ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="xl:flex xl:gap-12 xl:items-start">

          {/* FAQ */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">FAQ</p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufige Fragen</h2>

            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            {/* Kontakt-CTA */}
            <div className="mt-10 bg-linear-to-br from-[#1db682] to-[#00838F] rounded-3xl p-8 text-white text-center">
              <p className="text-2xl mb-2">💬</p>
              <h3 className="text-xl font-black mb-2">Noch Fragen? Wir helfen gerne!</h3>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                Schreib uns einfach eine E-Mail — wir melden uns innerhalb von 24 Stunden
                mit einem individuellen Angebot.
              </p>
              <a
                href="mailto:werbung@urlaubfinder365.de"
                className="inline-flex items-center gap-2 bg-white text-[#1db682] font-black px-8 py-3 rounded-2xl hover:bg-green-50 transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                werbung@urlaubfinder365.de
              </a>
              <p className="text-white/60 text-xs mt-3">Oder rufe uns unter +49 (0)30 – Beispielnummer an</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&q=70&auto=format&fit=crop",
                  eyebrow: "Marktplatz",
                  title: "Als Anbieter listen",
                  description: "Aktivitäten & Erlebnisse direkt im Marktplatz anbieten – kostenlos listen, 15 % Provision.",
                  href: "/marktplatz/anbieter-werden/",
                  ctaLabel: "Anbieter werden →",
                  accentColor: "bg-[#6991d8]",
                }}
                seoLinksTitle="📢 Mehr Infos"
                seoLinks={[
                  { href: "/marktplatz/anbieter-werden/", label: "Als Anbieter listen" },
                  { href: "/marktplatz/",                 label: "Zum Marktplatz" },
                  { href: "/extras/",                     label: "Alle Tools" },
                  { href: "/urlaubsziele/",               label: "Urlaubsziele" },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
