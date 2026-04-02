"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AnbieterFormular() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [gesendet, setGesendet] = useState(false);
  const [fehler,   setFehler]   = useState("");

  const senden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setFehler("Bitte fülle alle Felder aus.");
      return;
    }
    if (password.length < 8) {
      setFehler("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    setFehler("");
    setLoading(true);

    const res = await fetch("/api/anbieter/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFehler(data.error ?? "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      setLoading(false);
      return;
    }

    setGesendet(true);
    setLoading(false);
  };

  if (gesendet) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-black text-gray-900 text-xl mb-2">Account erstellt! 🎉</h3>
        <p className="text-gray-500 leading-relaxed mb-4">
          Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet.
          Klicke auf den Link darin — danach kannst du dein Profil vervollständigen.
        </p>
        <div className="bg-[#00838F]/8 border border-[#00838F]/20 rounded-xl px-4 py-3 text-sm text-gray-700 mb-5">
          <p className="font-semibold text-[#00838F] mb-1">Nächste Schritte:</p>
          <ol className="text-left space-y-1 list-decimal list-inside text-gray-600">
            <li>E-Mail bestätigen</li>
            <li>Anmelden → Profil & Angebote einrichten</li>
            <li>Wir schalten deinen Account frei (bis 48 Std.)</li>
          </ol>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-[#00838F] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#006d78] transition-colors text-sm"
        >
          Zum Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const INPUT = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]";

  return (
    <form onSubmit={senden} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Vollständiger Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Maria Müller" className={INPUT} />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">E-Mail-Adresse *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de" className={INPUT} />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Passwort * <span className="text-gray-400 font-normal">(min. 8 Zeichen)</span></label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sicheres Passwort wählen"
            className={INPUT + " pr-11"}
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {fehler && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{fehler}</p>}

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors">
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Account wird erstellt …</>
          : <>Kostenlos registrieren <ArrowRight className="w-4 h-4" /></>
        }
      </button>

      <p className="text-[10px] text-gray-400 text-center leading-snug">
        Mit der Registrierung stimmst du unseren{" "}
        <a href="/agb/" className="underline">AGB</a> und der{" "}
        <a href="/datenschutz/" className="underline">Datenschutzerklärung</a> zu.
        Alle weiteren Details füllst du nach dem Login aus.
      </p>
    </form>
  );
}
