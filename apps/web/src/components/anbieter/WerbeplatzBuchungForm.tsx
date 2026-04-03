"use client";

import { useState } from "react";
import { CreditCard, Loader2, Check, MapPin, Tag, Globe, Star, Home, Layers, Zap, Crown, User } from "lucide-react";

// ─── Paket-Definitionen ──────────────────────────────────────────────────────
const PLACEMENT_PAKETE = [
  {
    key: "stadt_unten",
    icon: MapPin,
    label: "Stadtseite",
    position: "Unterhalb der Top-Angebote einer Zielort-Seite",
    preis: 49,
    badge: null,
    farbe: "blue",
    features: [
      "Platzierung auf einer Stadtseite deiner Wahl",
      "Sichtbar für alle Besucher dieser Seite",
      "Link direkt zu deinem Angebot",
      "Ideal für lokale Anbieter",
    ],
    zielseiteTyp: "ort" as const,
  },
  {
    key: "stadt_oben",
    icon: MapPin,
    label: "Stadtseite Top-Platz",
    position: "Immer ganz oben — auch bei mehreren Anzeigen",
    preis: 79,
    badge: "Beliebt",
    farbe: "indigo",
    features: [
      "Erste Position auf der Stadtseite",
      "Vorrang vor allen anderen Stadtseiten-Anzeigen",
      "Mehr Klicks durch Top-Sichtbarkeit",
      "Ideal für starke Zielort-Präsenz",
    ],
    zielseiteTyp: "ort" as const,
  },
  {
    key: "anbieter_spotlight",
    icon: User,
    label: "Anbieter-Spotlight",
    position: 'Sidebar "Empfohlene Anbieter" auf Marktplatz-Seiten',
    preis: 99,
    badge: null,
    farbe: "violet",
    features: [
      "Dein Profil in der Empfohlene-Anbieter-Sidebar",
      "Sichtbar auf allen Marktplatz- & Zielort-Seiten",
      "Stärkt deine Markenbekanntheit",
      "Ideal für Neueinsteiger",
    ],
    zielseiteTyp: null,
  },
  {
    key: "kategorie",
    icon: Tag,
    label: "Themenseite",
    position: "Alle Seiten einer Aktivitätskategorie",
    preis: 99,
    badge: null,
    farbe: "cyan",
    features: [
      "Erscheint auf allen Seiten einer Kategorie",
      "z. B. alle Wassersport- oder Kulinarik-Seiten",
      "Zielgruppengenau für dein Angebotssegment",
      "Höhere Conversion durch Kontextrelevanz",
    ],
    zielseiteTyp: "kategorie" as const,
  },
  {
    key: "region",
    icon: Globe,
    label: "Regionspaket",
    position: "Alle Seiten eines Landes oder einer Region",
    preis: 149,
    badge: null,
    farbe: "teal",
    features: [
      "Flächendeckend auf allen Seiten einer Region",
      "z. B. alle Türkei- oder Spanien-Seiten",
      "Maximale Reichweite im Zielgebiet",
      "Ideal für Anbieter mit breitem Angebotsspektrum",
    ],
    zielseiteTyp: "region" as const,
  },
  {
    key: "rundum",
    icon: Layers,
    label: "Rundum-Paket",
    position: "Startseite + Kategorie + Region deiner Wahl",
    preis: 299,
    badge: "Bestes Preis-Leistungs-Verhältnis",
    farbe: "orange",
    features: [
      "Kombination aller Platzierungstypen",
      "Startseite + Themenseite + Regionsseiten",
      "Größtmögliche Sichtbarkeit im Netzwerk",
      "Spare vs. Einzelbuchung aller Plätze",
    ],
    zielseiteTyp: "region" as const,
  },
] as const;

const HOMEPAGE_PAKETE = [
  {
    key: "starter",
    icon: Zap,
    label: "Homepage Starter",
    position: "Featured-Carousel auf der Startseite",
    preis: 99,
    badge: null,
    farbe: "green",
    features: [
      "Dein Angebot im Featured-Carousel der Startseite",
      "Sichtbar für alle Homepage-Besucher",
      "Anbieter-Avatar + Verifiziert-Badge",
      "Monatlich kündbar",
    ],
    stripeFixed: true,
  },
  {
    key: "featured",
    icon: Star,
    label: "Homepage Featured",
    position: "Prominente Platzierung im Featured-Carousel",
    preis: 199,
    badge: "Meiste Reichweite",
    farbe: "amber",
    features: [
      "Hervorgehobene Position im Startseiten-Carousel",
      "\"Sponsored\"-Badge für mehr Vertrauen",
      "Sichtbar für tausende Reisende täglich",
      "Monatliche Reichweiten-Auswertung",
    ],
    stripeFixed: true,
  },
  {
    key: "premium",
    icon: Crown,
    label: "Homepage Premium",
    position: "Top-Platzierung + Newsletter + Landingpage",
    preis: 349,
    badge: "Premium",
    farbe: "purple",
    features: [
      "Alles aus Featured",
      "Top-Position im Carousel (erste Kachel)",
      "Erwähnung im Monats-Newsletter",
      "Persönlicher Account-Manager",
    ],
    stripeFixed: true,
  },
] as const;

type PlacementKey = typeof PLACEMENT_PAKETE[number]["key"];
type HomepageKey  = typeof HOMEPAGE_PAKETE[number]["key"];
type PaketKey = PlacementKey | HomepageKey;

const ALLE_PAKETE = [...PLACEMENT_PAKETE, ...HOMEPAGE_PAKETE];

const LAUFZEITEN = [
  { monate: 1,  label: "1 Monat",   rabatt: 0  },
  { monate: 3,  label: "3 Monate",  rabatt: 10 },
  { monate: 6,  label: "6 Monate",  rabatt: 15 },
  { monate: 12, label: "12 Monate", rabatt: 20 },
] as const;

const KATEGORIEN = [
  "Stadtführungen", "Tagesausflüge", "Wassersport", "Outdoor & Wandern",
  "Kulinarik", "Kultur & Kunst", "Fotoshooting", "Transfer",
];
const REGIONEN = [
  "Türkei", "Spanien", "Griechenland", "Italien", "Portugal", "Ägypten",
  "Marokko", "Thailand", "Bali / Indonesien", "Dubai / VAE", "Kroatien",
  "Österreich", "Schweiz", "Andere",
];

// Farb-Map für Tailwind (statisch, damit Purge nicht wegoptimiert)
const FARBE_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue:   { border: "border-blue-400",   bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
  indigo: { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
  cyan:   { border: "border-cyan-400",   bg: "bg-cyan-50",   text: "text-cyan-700",   badge: "bg-cyan-100 text-cyan-700" },
  teal:   { border: "border-teal-400",   bg: "bg-teal-50",   text: "text-teal-700",   badge: "bg-teal-100 text-teal-700" },
  orange: { border: "border-orange-400", bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
  green:  { border: "border-green-400",  bg: "bg-green-50",  text: "text-green-700",  badge: "bg-green-100 text-green-700" },
  amber:  { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700" },
  purple: { border: "border-purple-400", bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function WerbeplatzBuchungForm() {
  const [paket, setPaket]         = useState<PaketKey>("stadt_unten");
  const [laufzeit, setLaufzeit]   = useState<number>(3);
  const [zielseite, setZielseite] = useState("");
  const [loading, setLoading]     = useState(false);
  const [fehler, setFehler]       = useState("");

  const aktivPaket    = ALLE_PAKETE.find((p) => p.key === paket)!;
  const isHomepage    = HOMEPAGE_PAKETE.some((p) => p.key === paket);
  const aktivLaufzeit = LAUFZEITEN.find((l) => l.monate === laufzeit)!;
  const preisMonatlich = isHomepage
    ? aktivPaket.preis
    : Math.round(aktivPaket.preis * (1 - aktivLaufzeit.rabatt / 100) * 100) / 100;
  const preisGesamt = isHomepage ? aktivPaket.preis : Math.round(preisMonatlich * laufzeit * 100) / 100;

  const placer = aktivPaket as typeof PLACEMENT_PAKETE[number];
  const brauchtZielseite = !isHomepage && placer.zielseiteTyp != null;

  const buchen = async () => {
    setFehler("");
    setLoading(true);
    try {
      const res = await fetch("/api/werbeplatz/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paket,
          laufzeit_monate: isHomepage ? 1 : laufzeit,
          zielseite: zielseite || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) { setFehler(data.error ?? "Fehler"); setLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setFehler("Netzwerkfehler. Bitte erneut versuchen.");
      setLoading(false);
    }
  };

  const PaketCard = ({ p, group }: { p: typeof ALLE_PAKETE[number]; group: "placement" | "homepage" }) => {
    const aktiv = paket === p.key;
    const c = FARBE_MAP[p.farbe] ?? FARBE_MAP.blue;
    const Icon = p.icon;
    const isHP = group === "homepage";
    return (
      <button
        type="button"
        onClick={() => { setPaket(p.key as PaketKey); setZielseite(""); }}
        className={`relative text-left rounded-2xl border-2 p-4 transition-all hover:-translate-y-0.5 duration-150 ${
          aktiv ? `${c.border} ${c.bg}` : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        {/* Badge */}
        {"badge" in p && p.badge && (
          <span className={`absolute -top-2.5 left-4 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest ${
            isHP ? "bg-amber-400 text-white" : c.badge
          }`}>
            {p.badge}
          </span>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${aktiv ? c.bg : "bg-gray-100"}`}>
            <Icon className={`w-4 h-4 ${aktiv ? c.text : "text-gray-500"}`} />
          </div>
          <div className="text-right shrink-0">
            <p className={`font-black text-lg leading-none ${aktiv ? c.text : "text-gray-800"}`}>
              {p.preis} €
            </p>
            <p className="text-[10px] text-gray-400">/Monat</p>
          </div>
        </div>

        <p className={`font-black text-sm mb-0.5 ${aktiv ? c.text : "text-gray-900"}`}>{p.label}</p>
        <p className="text-[11px] text-gray-500 mb-3 leading-snug">{p.position}</p>

        {/* Features */}
        <ul className="space-y-1">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <Check className={`w-3 h-3 mt-0.5 shrink-0 ${aktiv ? c.text : "text-gray-400"}`} />
              <span className="text-[11px] text-gray-600 leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {aktiv && (
          <div className={`mt-3 pt-2.5 border-t ${c.border.replace("border-", "border-t-")} flex items-center gap-1`}>
            <Check className={`w-3.5 h-3.5 ${c.text}`} />
            <span className={`text-xs font-bold ${c.text}`}>Ausgewählt</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8">

      {/* ── Sektion 1: Platzierungs-Pakete ───────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">1. Paket wählen</span>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platzierungs-Werbung</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {PLACEMENT_PAKETE.map((p) => (
            <PaketCard key={p.key} p={p} group="placement" />
          ))}
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Homepage Featured Carousel</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOMEPAGE_PAKETE.map((p) => (
            <PaketCard key={p.key} p={p} group="homepage" />
          ))}
        </div>
      </div>

      {/* ── Sektion 2: Laufzeit (nur für Placement-Pakete) ───────── */}
      {!isHomepage && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">2. Laufzeit wählen</p>
          <div className="grid grid-cols-4 gap-2">
            {LAUFZEITEN.map((l) => (
              <button
                key={l.monate}
                type="button"
                onClick={() => setLaufzeit(l.monate)}
                className={`relative rounded-2xl border-2 py-3 px-2 text-center transition-all ${
                  laufzeit === l.monate
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {l.rabatt > 0 && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                    −{l.rabatt}%
                  </span>
                )}
                <p className={`font-black text-sm ${laufzeit === l.monate ? "text-teal-700" : "text-gray-800"}`}>
                  {l.label.split(" ")[0]}
                </p>
                <p className="text-[11px] text-gray-400">{l.label.split(" ")[1]}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Sektion 3: Zielseite ─────────────────────────────────── */}
      {!isHomepage && placer.zielseiteTyp && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
            {isHomepage ? "3." : "3."} Zielseite angeben
          </p>
          {placer.zielseiteTyp === "ort" && (
            <input
              type="text"
              value={zielseite}
              onChange={(e) => setZielseite(e.target.value)}
              placeholder="z. B. Antalya, Palma, Santorini …"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500"
            />
          )}
          {placer.zielseiteTyp === "kategorie" && (
            <select
              value={zielseite}
              onChange={(e) => setZielseite(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 bg-white"
            >
              <option value="">Kategorie wählen …</option>
              {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          )}
          {placer.zielseiteTyp === "region" && (
            <select
              value={zielseite}
              onChange={(e) => setZielseite(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 bg-white"
            >
              <option value="">Region / Land wählen …</option>
              {REGIONEN.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          )}
          <p className="text-xs text-gray-400 mt-1.5">Auf welcher Seite soll deine Werbung erscheinen?</p>
        </div>
      )}

      {/* ── Preisübersicht ────────────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Preisübersicht</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paket</span>
          <span className="font-semibold">{aktivPaket.label}</span>
        </div>
        {!isHomepage && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Laufzeit</span>
              <span className="font-semibold">{aktivLaufzeit.label}</span>
            </div>
            {aktivLaufzeit.rabatt > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Laufzeitrabatt</span>
                <span className="font-semibold text-emerald-600">−{aktivLaufzeit.rabatt}%</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monatspreis</span>
              <span className="font-semibold">{preisMonatlich.toFixed(2)} €</span>
            </div>
          </>
        )}
        {isHomepage && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monatlich, kündbar</span>
            <span className="font-semibold">{preisMonatlich.toFixed(2)} €</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="font-bold text-gray-900">{isHomepage ? "Pro Monat" : "Gesamtbetrag"}</span>
          <span className="font-black text-teal-600 text-xl">{preisGesamt.toFixed(2)} €</span>
        </div>
        <p className="text-[10px] text-gray-400">
          {isHomepage
            ? "Monatlich abgebucht · jederzeit kündbar · inkl. MwSt."
            : "Monatlich abgebucht · endet automatisch nach Laufzeit · inkl. MwSt."}
        </p>
      </div>

      {fehler && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{fehler}</p>}

      <button
        type="button"
        onClick={buchen}
        disabled={loading || (brauchtZielseite && !zielseite.trim())}
        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-colors text-base"
      >
        {loading
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Weiterleitung zu Stripe…</>
          : <><CreditCard className="w-5 h-5" /> Jetzt buchen · {preisGesamt.toFixed(2)} € {isHomepage ? "/Monat" : "gesamt"}</>
        }
      </button>

      <p className="text-xs text-gray-400 text-center">
        Sichere Zahlung via Stripe · Freischaltung nach Inhaltsprüfung (max. 24 h) · Rechnung automatisch per E-Mail
      </p>
    </div>
  );
}
