"use client";

import { useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, TravelPreferences } from "@/types";
import { updateTravelPreferences } from "@/lib/supabase-db";
import { Settings, Wallet, Users, Calendar, Heart, CheckCircle, Mail } from "lucide-react";
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
    <div className="space-y-6 max-w-2xl">
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
          Mein Reisebudget
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
          Erhalte wöchentlich die besten Reiseangebote, Deals und Urlaubsideen per E-Mail.
        </p>
        <NewsletterSignup
          variant="inline"
          userEmail={user.email ?? ""}
          firstName={user.displayName?.split(" ")[0] ?? ""}
          lastName={user.displayName?.split(" ").slice(1).join(" ") ?? ""}
        />
      </div>
    </div>
  );
}
