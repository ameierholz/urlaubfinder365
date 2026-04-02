"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

const KATEGORIEN_OPTIONS = [
  "Stadtführungen","Tagesausflüge","Wassersport","Kulinarik",
  "Transfer","Fotoshooting","Outdoor & Wandern","Kultur & Kunst","Sonstiges",
];

export default function AnbieterFormular() {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [telefon, setTelefon]     = useState("");
  const [standort, setStandort]   = useState("");
  const [kategorie, setKategorie] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [loading, setLoading]     = useState(false);
  const [gesendet, setGesendet]   = useState(false);
  const [fehler, setFehler]       = useState("");

  const senden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !standort || !kategorie) {
      setFehler("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    setFehler("");
    setLoading(true);

    // Demo: Anfrage speichern (später Supabase-Integration)
    await new Promise((r) => setTimeout(r, 1500));
    setGesendet(true);
    setLoading(false);
  };

  if (gesendet) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-black text-gray-900 text-xl mb-2">Bewerbung eingegangen! 🎉</h3>
        <p className="text-gray-500 leading-relaxed">
          Hallo {name.split(" ")[0]}, wir haben deine Anfrage erhalten und melden uns
          innerhalb von <strong>48 Stunden</strong> bei <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={senden} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Vollständiger Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Maria Müller"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">E-Mail *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Standort / Stadt *</label>
          <input type="text" value={standort} onChange={(e) => setStandort(e.target.value)}
            placeholder="z. B. Antalya, Mallorca …"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Telefon (optional)</label>
          <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)}
            placeholder="+49 …"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Kategorie deiner Angebote *</label>
        <select value={kategorie} onChange={(e) => setKategorie(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] bg-white">
          <option value="">Bitte wählen …</option>
          {KATEGORIEN_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Kurze Beschreibung deiner Angebote</label>
        <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)}
          placeholder="Was bietest du an? Wie lange bist du schon Guide? Welche Sprachen sprichst du?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] resize-none" />
      </div>

      {fehler && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{fehler}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet …</>
          : "Kostenlos als Anbieter registrieren →"
        }
      </button>

      <p className="text-[10px] text-gray-400 text-center leading-snug">
        Mit der Registrierung stimmst du unseren <a href="/agb/" className="underline">AGB</a> und der <a href="/datenschutz/" className="underline">Datenschutzerklärung</a> zu.
      </p>
    </form>
  );
}
