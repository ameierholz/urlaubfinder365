"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Chrome, Bell, Heart, BarChart2, CheckSquare, Map, Star } from "lucide-react";

function LogoSVG({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Urlaubfinder365">
      <circle cx="22" cy="22" r="22" fill="#1db682"/>
      <text x="22" y="18" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="900" fill="white" textAnchor="middle">UF</text>
      <text x="22" y="29" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="rgba(255,255,255,0.9)" textAnchor="middle">365</text>
      <path d="M12 34 Q22 30 32 34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

interface Props {
  mode: "login" | "register";
}

const BENEFITS = [
  {
    icon: Bell,
    title: "Preisalarme",
    desc: "Wir benachrichtigen dich, sobald dein Wunschurlaub günstiger wird.",
  },
  {
    icon: Heart,
    title: "Persönliche Wunschliste",
    desc: "Merke dir Traumziele und behalte ihre Preisentwicklung im Blick.",
  },
  {
    icon: BarChart2,
    title: "Echte Preistrends",
    desc: "Sieh, ob Preise gerade fallen oder steigen – mit täglichen Daten.",
  },
  {
    icon: CheckSquare,
    title: "Smarte Packliste",
    desc: "Nie wieder etwas vergessen – deine Liste wird automatisch gespeichert.",
  },
  {
    icon: Map,
    title: "Reiseplaner",
    desc: "Plane deine nächste Reise Schritt für Schritt an einem Ort.",
  },
  {
    icon: Star,
    title: "Passende Empfehlungen",
    desc: "Angebote die zu deinen Vorlieben passen – keine Flut an irrelevanten Deals.",
  },
];

export default function AuthForm({ mode }: Props) {
  const { login, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        router.push("/dashboard");
      } else {
        if (!name.trim()) { setError("Bitte gib deinen Namen ein."); setLoading(false); return; }
        const { needsConfirmation } = await register(email, password, name);
        if (needsConfirmation) {
          setConfirmationSent(true);
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = (err instanceof Error ? err.message : "").toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
        setError("E-Mail oder Passwort ist falsch.");
      } else if (msg.includes("email already") || msg.includes("already registered") || msg.includes("email-already-in-use") || msg.includes("user already registered")) {
        setError("Diese E-Mail-Adresse ist bereits registriert.");
      } else if (msg.includes("password") && msg.includes("6")) {
        setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      } else if (msg.includes("email not confirmed")) {
        setError("Bitte bestätige zuerst deine E-Mail-Adresse. Schau in dein Postfach.");
      } else if (msg.includes("signup disabled") || msg.includes("signups not allowed")) {
        setError("Registrierungen sind derzeit deaktiviert.");
      } else {
        setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Google-Anmeldung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Login: schmales, zentriertes Layout (unverändert) ── */
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-md p-8">
          <Link href="/" className="flex justify-center mb-8">
            <LogoSVG size={56} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Willkommen zurück</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Melde dich an, um deine Reisen zu verwalten.</p>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4">
            <Chrome className="w-4 h-4" /> Mit Google anmelden
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">oder</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dein Passwort" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors">
              {loading ? "Bitte warten…" : "Anmelden"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Noch kein Konto?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">Registrieren</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── E-Mail-Bestätigung ausstehend ── */
  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-md p-10 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fast geschafft!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt.
            Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
          </p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm">
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  /* ── Register: breites 2-Spalten-Layout ── */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-4xl overflow-hidden flex flex-col lg:flex-row">

        {/* ── Linke Spalte: Vorteile ── */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 lg:p-10 lg:w-[52%] flex flex-col justify-between">
          <div>
            <Link href="/" className="flex justify-start mb-8">
              <LogoSVG size={40} />
            </Link>

            <h2 className="text-2xl font-bold mb-1">Dein kostenloses Reisekonto</h2>
            <p className="text-blue-200 text-sm mb-8">
              Registriere dich in weniger als einer Minute und hol das Beste aus deiner Urlaubsplanung heraus.
            </p>

            <ul className="space-y-5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-blue-200 text-xs leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Rechte Spalte: Formular ── */}
        <div className="p-8 lg:p-10 lg:w-[48%] flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Konto erstellen</h1>
          <p className="text-gray-500 text-sm mb-6">Schon dabei?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Anmelden</Link>
          </p>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4">
            <Chrome className="w-4 h-4" /> Mit Google registrieren
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">oder per E-Mail</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mindestens 6 Zeichen" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Newsletter Opt-in */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                Ja, ich möchte den kostenlosen Newsletter mit Reiseangeboten, Preisalarmen und Tipps erhalten.
                Die Abmeldung ist jederzeit möglich.
              </span>
            </label>

            {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? "Bitte warten…" : "Jetzt kostenlos registrieren"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            Mit der Registrierung stimmst du unseren{" "}
            <Link href="/datenschutz/" className="underline hover:text-gray-600">Datenschutzbestimmungen</Link>{" "}
            zu.
          </p>
        </div>
      </div>
    </div>
  );
}
