"use client";

import { useState } from "react";
import { CreditCard, Loader2, Check } from "lucide-react";

const PAKETE = [
  { key: "stadt_unten", label: "Stadtseite Banner",       preis: 29,  beschreibung: "Anzeige auf Stadtseiten" },
  { key: "stadt_oben",  label: "Stadtseite Top-Platz",    preis: 49,  beschreibung: "Immer ganz oben — erscheint als erstes, wenn mehrere Anzeigen sichtbar sind" },
  { key: "kategorie",   label: "Themenseite",             preis: 39,  beschreibung: "Sichtbar auf Kategorie-/Themenseiten" },
  { key: "region",      label: "Regionspaket",            preis: 59,  beschreibung: "Alle Seiten einer Region" },
  { key: "homepage",    label: "Marktplatz-Startseite",   preis: 99,  beschreibung: "Premium-Platzierung auf der Startseite" },
  { key: "rundum",      label: "Rundum-Paket",            preis: 149, beschreibung: "Maximale Sichtbarkeit auf allen Seiten" },
] as const;

const LAUFZEITEN = [
  { monate: 1,  label: "1 Monat",    rabatt: 0 },
  { monate: 3,  label: "3 Monate",   rabatt: 10 },
  { monate: 6,  label: "6 Monate",   rabatt: 15 },
  { monate: 12, label: "12 Monate",  rabatt: 20 },
] as const;

export default function WerbeplatzBuchungForm() {
  const [paket, setPaket]         = useState<string>("stadt_unten");
  const [laufzeit, setLaufzeit]   = useState<number>(3);
  const [zielseite, setZielseite] = useState("");
  const [loading, setLoading]     = useState(false);
  const [fehler, setFehler]       = useState("");

  const aktivPaket   = PAKETE.find((p) => p.key === paket)!;
  const aktivLaufzeit = LAUFZEITEN.find((l) => l.monate === laufzeit)!;
  const preisMonatlich = aktivPaket.preis * (1 - aktivLaufzeit.rabatt / 100);
  const preisGesamt    = Math.round(preisMonatlich * laufzeit * 100) / 100;

  const buchen = async () => {
    setFehler("");
    setLoading(true);
    try {
      const res = await fetch("/api/werbeplatz/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paket, laufzeit_monate: laufzeit, zielseite }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setFehler(data.error ?? "Fehler beim Checkout");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setFehler("Netzwerkfehler. Bitte versuche es erneut.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Paket wählen */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">1. Paket wählen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PAKETE.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPaket(p.key)}
              className={`text-left rounded-2xl border-2 p-4 transition-all ${
                paket === p.key
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-violet-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.beschreibung}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-black text-violet-600">{p.preis} €</span>
                  <span className="text-[10px] text-gray-400">/Monat</span>
                </div>
              </div>
              {paket === p.key && (
                <div className="mt-2 flex items-center gap-1 text-violet-600 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" /> Ausgewählt
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Laufzeit wählen */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">2. Laufzeit wählen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LAUFZEITEN.map((l) => (
            <button
              key={l.monate}
              type="button"
              onClick={() => setLaufzeit(l.monate)}
              className={`rounded-2xl border-2 p-4 text-center transition-all ${
                laufzeit === l.monate
                  ? "border-violet-500 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-violet-300"
              }`}
            >
              <p className="font-bold text-gray-900 text-sm">{l.label}</p>
              {l.rabatt > 0 ? (
                <p className="text-xs text-emerald-600 font-semibold mt-1">{l.rabatt}% Rabatt</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Kein Rabatt</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Zielseite (optional) */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">3. Zielseite (optional)</h2>
        <input
          type="text"
          value={zielseite}
          onChange={(e) => setZielseite(e.target.value)}
          placeholder="z.B. Antalya, Mallorca, Tauchen …"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Für Stadtseite / Themenseite / Region: Auf welcher Seite soll deine Werbung erscheinen?
        </p>
      </div>

      {/* Preisübersicht */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Preisübersicht</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paket</span>
          <span className="font-semibold">{aktivPaket.label}</span>
        </div>
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
          <span className="text-gray-600">Effektiver Monatspreis</span>
          <span className="font-semibold">{preisMonatlich.toFixed(2)} €</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between">
          <span className="font-bold text-gray-900">Gesamtbetrag</span>
          <span className="font-black text-violet-600 text-xl">{preisGesamt.toFixed(2)} €</span>
        </div>
        <p className="text-[10px] text-gray-400">Einmalige Zahlung · inkl. MwSt.</p>
      </div>

      {fehler && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{fehler}</p>}

      <button
        type="button"
        onClick={buchen}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors text-base"
      >
        {loading
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Weiterleitung zu Stripe…</>
          : <><CreditCard className="w-5 h-5" /> Jetzt buchen · {preisGesamt.toFixed(2)} €</>
        }
      </button>

      <p className="text-xs text-gray-400 text-center">
        Sichere Zahlung via Stripe · SSL-verschlüsselt · Nach Zahlung Freischaltung innerhalb von 24 h
      </p>
    </div>
  );
}
