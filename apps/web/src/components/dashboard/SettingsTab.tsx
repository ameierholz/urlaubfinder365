"use client";

import { useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, TravelPreferences } from "@/types";
import { updateTravelPreferences } from "@/lib/supabase-db";
import { Settings, Wallet, Users, Calendar, Heart, CheckCircle, Mail, Download, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

interface Props {
  user: AppUser;
  userProfile: UserProfile | null;
}

const DEFAULT_PREFS: TravelPreferences = {
  budget: "",
  adults: 2,
  children: 0,
  preferredMonths: [],
  preferredTypes: [],
  preferredRegions: [],
};

const BUDGETS = [
  { id: "budget",  label: "Budget",  sub: "bis 500 €/Person",  color: "border-green-200 bg-green-50 text-green-700" },
  { id: "mittel",  label: "Mittel",  sub: "500–1.000 €/Person", color: "border-blue-200 bg-blue-50 text-blue-700" },
  { id: "premium", label: "Premium", sub: "1.000–2.000 €/Person", color: "border-purple-200 bg-purple-50 text-purple-700" },
  { id: "luxus",   label: "Luxus",   sub: "2.000+ €/Person",   color: "border-amber-200 bg-amber-50 text-amber-700" },
];

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

const TRIP_TYPES = [
  { id: "strand",   emoji: "🏖️", label: "Strand & Meer" },
  { id: "stadt",    emoji: "🏙️", label: "Städtereise" },
  { id: "natur",    emoji: "🌿", label: "Natur & Wandern" },
  { id: "kultur",   emoji: "🏛️", label: "Kultur & Geschichte" },
  { id: "abenteuer",emoji: "🧗", label: "Abenteuer & Sport" },
  { id: "wellness", emoji: "🧘", label: "Wellness & Entspannung" },
  { id: "kreuzfahrt",emoji: "🚢", label: "Kreuzfahrt" },
  { id: "familie",  emoji: "👨‍👩‍👧", label: "Familienurlaub" },
];

export default function SettingsTab({ user, userProfile }: Props) {
  const [prefs, setPrefs] = useState<TravelPreferences>({
    ...DEFAULT_PREFS,
    ...(userProfile?.preferences ?? {}),
    preferredMonths: userProfile?.preferences?.preferredMonths ?? [],
    preferredTypes:  userProfile?.preferences?.preferredTypes ?? [],
    preferredRegions: userProfile?.preferences?.preferredRegions ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const set = <K extends keyof TravelPreferences>(key: K, val: TravelPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const toggleMonth = (m: string) => {
    const months = prefs.preferredMonths ?? [];
    set("preferredMonths", months.includes(m) ? months.filter((x) => x !== m) : [...months, m]);
  };

  const toggleType = (id: string) => {
    const types = prefs.preferredTypes ?? [];
    set("preferredTypes", types.includes(id) ? types.filter((x) => x !== id) : [...types, id]);
  };

  const save = async () => {
    setSaving(true);
    await updateTravelPreferences(user.uid, prefs).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

    {/* Erklärung rechts */}
    <div className="order-first lg:order-last lg:w-64 shrink-0">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">So funktioniert&apos;s</h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start gap-2"><span className="shrink-0">💰</span><span>Wähle dein <strong>Urlaubsbudget</strong> – wir filtern Angebote passend für dich</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">👨‍👩‍👧</span><span>Gib Anzahl <strong>Erwachsene und Kinder</strong> an für passende Angebote</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">📅</span><span>Wähle bevorzugte <strong>Reisemonate</strong> für personalisierte Empfehlungen</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🏖️</span><span>Wähle deinen <strong>Urlaubstyp</strong> (Strand, Stadt, Abenteuer …)</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">💾</span><span>Klicke <strong>„Speichern"</strong> oben rechts um alle Einstellungen zu sichern</span></li>
        </ul>
      </div>
    </div>

    <div className="flex-1 min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#00838F]" />
          Einstellungen
        </h2>
        <button
          onClick={save}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-[#00838F] text-white hover:bg-[#006E7A]"
          } disabled:opacity-50`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Gespeichert!</> : saving ? "Speichert…" : "Speichern"}
        </button>
      </div>

      {/* Budget */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-gray-400" />
          Mein Urlaubsbudget
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUDGETS.map(({ id, label, sub, color }) => (
            <button
              key={id}
              onClick={() => set("budget", id as TravelPreferences["budget"])}
              className={`rounded-xl border-2 p-3 text-center transition-all ${
                prefs.budget === id
                  ? `${color} border-current`
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <p className="font-bold text-sm">{label}</p>
              <p className="text-xs opacity-75 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reisende */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          Reisende
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Erwachsene", key: "adults" as const, min: 1, max: 8 },
            { label: "Kinder (bis 17)", key: "children" as const, min: 0, max: 6 },
          ].map(({ label, key, min, max }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                {label}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => set(key, Math.max(min, prefs[key] - 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-xl font-bold text-gray-900 w-8 text-center">{prefs[key]}</span>
                <button
                  onClick={() => set(key, Math.min(max, prefs[key] + 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bevorzugte Reisemonate */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          Bevorzugte Reisemonate
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMonth(m)}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                (prefs.preferredMonths ?? []).includes(m)
                  ? "bg-[#00838F] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Urlaubstyp */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-gray-400" />
          Mein Urlaubstyp (Mehrfachauswahl)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TRIP_TYPES.map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => toggleType(id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                (prefs.preferredTypes ?? []).includes(id)
                  ? "bg-[#00838F] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-base">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-gray-400" />
          Newsletter & Angebote
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Erhalte wöchentlich die besten Urlaubsangebote, Deals und Urlaubsideen per E-Mail.
        </p>
        <NewsletterSignup
          variant="inline"
          userEmail={user.email ?? ""}
          firstName={user.displayName?.split(" ")[0] ?? ""}
          lastName={user.displayName?.split(" ").slice(1).join(" ") ?? ""}
        />
      </div>

      {/* Daten & Konto (DSGVO) */}
      <DataPrivacySection />
    </div>
    </div>
  );
}

/** DSGVO: Datenexport + Konto loeschen */
function DataPrivacySection() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "urlaubfinder365-meine-daten.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Fehler beim Exportieren. Bitte versuche es erneut.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error();
      window.location.href = "/";
    } catch {
      alert("Fehler beim Löschen. Bitte kontaktiere info@urlaubfinder365.de");
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <Settings className="w-4 h-4 text-gray-400" />
        Daten & Datenschutz
      </h3>

      {/* Export */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700">Meine Daten exportieren</p>
          <p className="text-xs text-gray-500">Lade alle deine gespeicherten Daten als JSON-Datei herunter (DSGVO Art. 20).</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Exportieren
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Löschen */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-600">Konto & Daten löschen</p>
          <p className="text-xs text-gray-500">Alle deine Daten werden unwiderruflich gelöscht (DSGVO Art. 17).</p>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Konto löschen
        </button>
      </div>

      {/* Bestätigungs-Dialog */}
      {showDelete && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Bist du sicher?</p>
              <p className="text-xs text-red-600 mt-1">
                Alle deine Daten (Profil, Favoriten, Preisalarme, Berichte, Tipps) werden unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-white transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Endgültig löschen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
