import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckSquare, Sun, Plane, Shield, Smartphone, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Reise-Packliste 2026 – Checkliste für den Urlaub",
  description:
    "Die ultimative Reise-Packliste 2026: Checkliste für Strand-, Sommer- und Pauschalurlaub. Dokumente, Kleidung, Apotheke – alles zum Ausdrucken.",
  keywords: [
    "Reise Packliste",
    "Packliste Urlaub",
    "Checkliste Urlaub",
    "Packliste Strand",
    "Packliste Türkei",
    "Packliste Mallorca",
    "Reise Checkliste ausdrucken",
  ],
  alternates: { canonical: "https://www.urlaubfinder365.de/tipps/reise-packliste/" },
  openGraph: {
    title: "Reise-Packliste 2026 – Die ultimative Checkliste für deinen Urlaub",
    description:
      "Vergiss nie wieder etwas! Unsere kostenlose Reise-Packliste für Strand- und Pauschalurlaub – zum Ausdrucken oder als digitale Checkliste.",
    url: "https://www.urlaubfinder365.de/tipps/reise-packliste/",
  },
};

// JSON-LD: HowTo / Article für Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Reise-Packliste 2026: Die ultimative Checkliste für deinen Urlaub",
  description:
    "Kostenlose Reise-Packliste und Checkliste für Strand- und Pauschalurlaub 2026 – Dokumente, Kleidung, Apotheke und mehr.",
  author: { "@type": "Organization", name: "Urlaubfinder365", url: "https://www.urlaubfinder365.de/" },
  publisher: { "@type": "Organization", name: "Urlaubfinder365", logo: { "@type": "ImageObject", url: "https://www.urlaubfinder365.de/images/header_logo.webp" } },
  datePublished: "2026-03-01",
  dateModified: new Date().toISOString().slice(0, 10),
  inLanguage: "de",
  url: "https://www.urlaubfinder365.de/tipps/reise-packliste/",
};

const SECTIONS = [
  {
    icon: Shield,
    color: "bg-red-500",
    title: "Dokumente & Finanzen",
    items: [
      "Reisepass / Personalausweis (Gültigkeit prüfen!)",
      "Krankenversicherungskarte / Auslandskrankenversicherung",
      "Reiseunterlagen (Buchungsbestätigung, Hotel-Voucher)",
      "Flugtickets (digital oder ausgedruckt)",
      "Führerschein (international, falls nötig)",
      "Kreditkarte & etwas Bargeld (Lokalwährung)",
      "Notfallnummern (Botschaft, Versicherung)",
      "Kopien aller Dokumente (separat aufbewahren)",
    ],
  },
  {
    icon: Sun,
    color: "bg-sand-500",
    title: "Kleidung & Schuhe",
    items: [
      "T-Shirts / Tops (ca. 1 pro Tag + Reserve)",
      "Shorts / leichte Hosen",
      "Badebekleidung (2×)",
      "Leichte Abendkleidung (für Restaurants)",
      "Leichte Jacke / Strickjacke (Abende, AC)",
      "Flip-Flops / Badelatschen",
      "Bequeme Laufschuhe",
      "Unterwäsche & Socken",
      "Sonnenhut / Kappe",
    ],
  },
  {
    icon: ShoppingBag,
    color: "bg-violet-500",
    title: "Hygiene & Körperpflege",
    items: [
      "Sonnencreme (LSF 30 / 50)",
      "After-Sun-Lotion",
      "Zahnbürste, Zahnpasta, Zahnseide",
      "Deo, Duschgel, Shampoo (100-ml-Flaschen für Handgepäck)",
      "Haarbürste / Kamm",
      "Rasier-Set",
      "Damenhygieneartikel",
      "Feuchttücher & Desinfektionsgel",
      "Insektenschutz",
    ],
  },
  {
    icon: Shield,
    color: "bg-green-500",
    title: "Reiseapotheke",
    items: [
      "Schmerzmittel (z. B. Ibuprofen, Paracetamol)",
      "Mittel gegen Reisekrankheit (Übelkeit)",
      "Mittel gegen Durchfall (z. B. Imodium)",
      "Pflaster & kleines Verbandsmaterial",
      "Sonnenbrandgel / Wundsalbe",
      "Augenspray / Nasenspray",
      "Persönliche Medikamente (ausreichend + Attest)",
      "Zeckenzange (Europa-Reisen)",
    ],
  },
  {
    icon: Smartphone,
    color: "bg-blue-500",
    title: "Technik & Elektronik",
    items: [
      "Handy-Ladekabel & Powerbank",
      "Reiseadapter (Stecker für Zielland)",
      "Kopfhörer",
      "Kamera / Action-Cam (+ Speicherkarte)",
      "E-Reader oder Tablet",
      "Laptop (falls nötig)",
      "Universalsteckerleiste",
    ],
  },
  {
    icon: Plane,
    color: "bg-cyan-500",
    title: "Strand & Freizeit",
    items: [
      "Strandtuch / Mikrofaserhandtuch (2×)",
      "Wasserfeste Tasche / Dry Bag",
      "Schnorchelset (oder am Zielort ausleihen)",
      "Sonnenschirm (falls im Gepäck möglich)",
      "Bücher / Reiseführer",
      "Kartenspiel / Reisespiele",
      "Reisekissen (für Langstreckenflug)",
    ],
  },
];

export default function ReisePacklistePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>

        {/* ── Hero ── */}
        <section
          className="py-14 px-4 text-white text-center"
          style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">
                Kostenlose Checkliste 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-4">
              Die ultimative Reise-Packliste
            </h1>
            <p className="text-emerald-100/80 text-base sm:text-lg max-w-xl mx-auto">
              Vergiss nie wieder etwas! Unsere komplette Checkliste für Strand- und
              Pauschalurlaub – einfach abhaken oder ausdrucken.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs">
              {["🇹🇷 Türkei", "🇪🇸 Mallorca", "🇬🇷 Griechenland", "🇪🇬 Ägypten", "🌊 Allgemein"].map((z) => (
                <span key={z} className="bg-white/15 border border-white/20 rounded-full px-3 py-1 font-medium">
                  {z}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          {/* ── Intro ── */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10 text-sm text-emerald-800 leading-relaxed">
            <strong>💡 Tipp:</strong> Drucke diese Seite aus (Strg+P) oder speichere sie als
            Lesezeichen. Hake jeden Punkt ab, bevor du den Koffer schließt – so reist du
            entspannt und vollständig!
          </div>

          {/* ── Kategorien ── */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {SECTIONS.map(({ icon: Icon, color, title, items }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`${color} px-5 py-3 flex items-center gap-3`}>
                  <Icon className="w-5 h-5 text-white" />
                  <h2 className="font-black text-white text-sm">{title}</h2>
                </div>
                <ul className="p-5 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── SEO Text ── */}
          <div className="prose prose-sm max-w-none text-gray-600 space-y-4 mb-12">
            <h2 className="text-xl font-black text-gray-900">Was gehört in den Urlaubs-Koffer?</h2>
            <p>
              Eine gute <strong>Reise-Packliste</strong> ist das A und O für einen stressfreien
              Urlaub. Ob Pauschalreise in die Türkei, Strandurlaub auf Mallorca oder Badeurlaub
              in Griechenland – die wichtigsten Kategorien sind immer ähnlich: Dokumente,
              Kleidung, Hygiene, Apotheke und Technik.
            </p>
            <p>
              Besonders wichtig: Prüfe den <strong>Reisepass</strong> mindestens 6 Monate vor
              Reiseantritt auf seine Gültigkeit. Viele Länder, darunter die Türkei und Ägypten,
              verlangen eine Restgültigkeit von mindestens 6 Monaten.
            </p>
            <h3 className="text-base font-bold text-gray-900">Handgepäck-Regeln beachten</h3>
            <p>
              Flüssigkeiten im Handgepäck sind auf 100 ml pro Behälter begrenzt, alle Behälter
              müssen in einen transparenten 1-Liter-Beutel passen. Plane Sonnencreme, Duschgel
              und Shampoo als 100-ml-Versionen ein, wenn du nur Handgepäck mitführst.
            </p>
          </div>

          {/* ── CTA ── */}
          <div
            className="rounded-2xl text-white text-center py-10 px-6"
            style={{ background: "linear-gradient(135deg, #1a1200 0%, #7c5c12 50%, #c49038 100%)" }}
          >
            <h2 className="text-xl font-black mb-2">Jetzt günstige Pauschalreise buchen</h2>
            <p className="text-sand-100/80 text-sm mb-5">
              Du hast die Packliste – fehlt nur noch der Urlaub!
            </p>
            <Link
              href="/guenstig-urlaub-buchen/"
              className="inline-flex items-center gap-2 bg-sand-500 hover:bg-sand-400 text-white font-black px-7 py-3 rounded-2xl transition-all"
            >
              Pauschalreisen vergleichen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
