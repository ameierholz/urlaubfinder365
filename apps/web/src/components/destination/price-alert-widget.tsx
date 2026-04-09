"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCircle, Loader2, X } from "lucide-react";

interface Props {
  destinationSlug: string;
  destinationName: string;
  currentPrice?: number;
}

export default function PriceAlertWidget({ destinationSlug, destinationName, currentPrice }: Props) {
  const defaultMax = currentPrice ? Math.round(currentPrice * 0.9) : 400;

  const [email, setEmail]       = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(defaultMax);
  const [consent, setConsent]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) { setError("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (maxPrice <= 0)         { setError("Bitte gib einen Wunschpreis über 0 € ein."); return; }
    if (!consent)              { setError("Bitte akzeptiere die Datenschutzerklärung."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/price-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, destinationSlug, destinationName, maxPrice }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Ein Fehler ist aufgetreten."); return; }
      setDone(true);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-black text-lg leading-tight">Preisalarm aktiv!</h2>
        </div>
        {/* Success Body */}
        <div className="bg-white px-6 py-5 flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-teal-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 mb-1">
              Du wirst benachrichtigt, wenn der Preis unter {maxPrice.toLocaleString("de-DE")} € fällt.
            </p>
            <p className="text-sm text-gray-500">
              Wir schicken dir eine E-Mail, sobald ein passendes Angebot für{" "}
              <span className="font-semibold text-gray-700">{destinationName}</span> verfügbar ist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-lg leading-tight">Preisalarm aktivieren</h2>
            <p className="text-white/75 text-xs">Kostenlos — kein Account nötig</p>
          </div>
        </div>
        <p className="text-white/80 text-sm mt-2">
          Erhalte eine Benachrichtigung, sobald der Reisepreis für{" "}
          <span className="font-bold text-white">{destinationName}</span> unter deinen Wunschpreis fällt.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white px-6 py-5 space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
            Deine E-Mail-Adresse
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Wunschpreis */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
            Wunschpreis pro Person (€)
          </label>
          <div className="relative">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              min={50}
              max={9999}
              step={10}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition pr-10"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">
              €
            </span>
          </div>
          {currentPrice && (
            <p className="text-xs text-gray-400 mt-1">
              Aktuell ab ca. {currentPrice.toLocaleString("de-DE")} € — Alarm bei{" "}
              <span className="text-teal-600 font-semibold">{maxPrice.toLocaleString("de-DE")} €</span>{" "}
              ({Math.round(((currentPrice - maxPrice) / currentPrice) * 100)} % Rabatt)
            </p>
          )}
        </div>

        {/* DSGVO */}
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-5 h-5 shrink-0 accent-teal-500 cursor-pointer"
          />
          <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
            Ich stimme zu, per E-Mail über Preisänderungen informiert zu werden.
            Meine Daten werden gemäß der{" "}
            <a href="/datenschutz/" className="text-teal-600 hover:underline font-medium">
              Datenschutzerklärung
            </a>{" "}
            verarbeitet. Abmeldung jederzeit möglich.
          </span>
        </label>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !consent}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Bell className="w-4 h-4" />
          }
          {loading ? "Wird gespeichert…" : "Preisalarm aktivieren"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Kein Account erforderlich · Jederzeit abmeldbar · 100 % kostenlos
        </p>
      </form>
    </div>
  );
}
