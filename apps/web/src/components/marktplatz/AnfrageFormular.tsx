"use client";

import { useState } from "react";
import { Calendar, Users, MessageSquare, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";

interface Props {
  aktivitaetTitel: string;
  aktivitaetSlug: string;
  preis: number;
  maxTeilnehmer: number;
}

export default function AnfrageFormular({ aktivitaetTitel, aktivitaetSlug, preis, maxTeilnehmer }: Props) {
  const [personen, setPersonen] = useState(2);
  const [datum, setDatum]       = useState("");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [nachricht, setNachricht] = useState("");
  const [loading, setLoading]   = useState(false);
  const [fehler, setFehler]     = useState("");

  const gesamtpreis = preis * personen;

  const senden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datum || !name || !email) { setFehler("Bitte fülle alle Pflichtfelder aus."); return; }
    setFehler("");
    setLoading(true);

    try {
      const res = await fetch("/api/buchung/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          angebot_slug:    aktivitaetSlug,
          titel:           aktivitaetTitel,
          kunden_name:     name,
          kunden_email:    email,
          datum,
          personen,
          preis_pro_person: preis,
          nachricht,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setFehler(data.error ?? "Fehler beim Checkout. Bitte versuche es erneut.");
        setLoading(false);
        return;
      }

      // Weiterleitung zu Stripe Checkout
      window.location.href = data.url;
    } catch {
      setFehler("Netzwerkfehler. Bitte versuche es erneut.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={senden} className="space-y-3">
      {/* Personen */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
          <Users className="w-3.5 h-3.5 text-[#00838F]" /> Personen
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setPersonen(Math.max(1, personen - 1))}
            className="w-9 h-9 rounded-full border border-gray-200 text-lg font-bold text-gray-600 hover:border-[#00838F] transition-colors">−</button>
          <span className="font-bold text-gray-900 w-16 text-center">{personen} {personen === 1 ? "Person" : "Personen"}</span>
          <button type="button" onClick={() => setPersonen(Math.min(maxTeilnehmer, personen + 1))}
            className="w-9 h-9 rounded-full border border-gray-200 text-lg font-bold text-gray-600 hover:border-[#00838F] transition-colors">+</button>
        </div>
      </div>

      {/* Datum */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#00838F]" /> Wunschdatum *
        </label>
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
        />
      </div>

      {/* Name & Email */}
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Dein Name *"
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Deine E-Mail *"
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />

      {/* Nachricht */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#00838F]" /> Nachricht (optional)
        </label>
        <textarea value={nachricht} onChange={(e) => setNachricht(e.target.value)}
          placeholder="Besondere Wünsche, Fragen …"
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] resize-none" />
      </div>

      {/* Gesamtpreis */}
      <div className="bg-[#00838F]/8 rounded-xl p-3 flex justify-between items-center">
        <span className="text-sm text-gray-600">Gesamtpreis ({personen} × {preis} €)</span>
        <span className="text-xl font-black text-[#00838F]">{gesamtpreis} €</span>
      </div>

      {fehler && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{fehler}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Weiterleitung zu Stripe…</>
          : <><CreditCard className="w-4 h-4" /> Jetzt sicher buchen →</>
        }
      </button>

      <p className="text-[10px] text-gray-400 text-center leading-snug">
        Sichere Zahlung via Stripe · SSL-verschlüsselt
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-[10px] text-gray-500 leading-relaxed">
        <strong className="text-gray-600">Hinweis:</strong> Du schließt den Vertrag direkt mit dem Anbieter ab.
        Urlaubfinder365 handelt als Vermittler (offener Stellvertreter gem.{" "}
        <Link href="/agb/#stellvertretung" className="underline hover:text-gray-700">§ 3a AGB</Link>)
        und ist nicht Vertragspartner für die Aktivität selbst.
      </div>
    </form>
  );
}
