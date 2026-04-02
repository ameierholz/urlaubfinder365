"use client";

import { useState } from "react";
import {
  MapPin, Calendar, Users, Euro, Sun, Loader2,
  Sparkles, ChevronRight, ChevronLeft, Check,
} from "lucide-react";

const INTERESSEN = [
  { id: "strand",    label: "🏖️ Strand & Meer" },
  { id: "kultur",    label: "🏛️ Kultur & Geschichte" },
  { id: "natur",     label: "🏔️ Natur & Wandern" },
  { id: "essen",     label: "🍽️ Kulinarik & Food" },
  { id: "abenteuer", label: "🪂 Abenteuer & Sport" },
  { id: "shopping",  label: "🛍️ Shopping & Stadt" },
  { id: "wellness",  label: "🧘 Wellness & Erholung" },
  { id: "nachtleben",label: "🎉 Nachtleben & Bars" },
  { id: "familie",   label: "👨‍👩‍👧 Familienfreundlich" },
  { id: "romantik",  label: "💑 Romantik & Paare" },
];

const MONATE = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

const UNTERKUENFTE = ["Hotel","Hostel","Ferienwohnung / Airbnb","Resort","Camping","Boutique-Hotel"];

const BUDGETS = [
  { value: "unter 500 €",    label: "Budget", sub: "unter 500 €" },
  { value: "500–1.000 €",    label: "Mittel",  sub: "500–1.000 €" },
  { value: "1.000–2.000 €",  label: "Komfort", sub: "1.000–2.000 €" },
  { value: "über 2.000 €",   label: "Luxus",   sub: "über 2.000 €" },
];

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResult: (plan: any, ziel: string) => void;
  onLoading: (v: boolean) => void;
  loading: boolean;
}

export default function ReiseplanerForm({ onResult, onLoading, loading }: Props) {
  const [schritt, setSchritt] = useState(1);
  const [ziel, setZiel]           = useState("");
  const [tage, setTage]           = useState(7);
  const [reisende, setReisende]   = useState(2);
  const [monat, setMonat]         = useState("");
  const [budget, setBudget]       = useState("");
  const [interessen, setInteressen] = useState<string[]>([]);
  const [unterkunft, setUnterkunft] = useState("Hotel");
  const [fehler, setFehler]       = useState("");

  const toggleInteresse = (id: string) => {
    setInteressen((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const weiter = () => {
    if (schritt === 1 && !ziel.trim()) { setFehler("Bitte gib ein Reiseziel ein."); return; }
    setFehler("");
    setSchritt((s) => s + 1);
  };

  const zurueck = () => setSchritt((s) => s - 1);

  const generieren = async () => {
    onLoading(true);
    setFehler("");
    try {
      const res = await fetch("/api/reiseplaner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ziel, tage, reisende, monat, budget, interessen, unterkunft }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setFehler(data.error ?? "Fehler beim Generieren. Bitte erneut versuchen.");
      } else {
        onResult(data.reiseplan, ziel);
      }
    } catch {
      setFehler("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      onLoading(false);
    }
  };

  const SCHRITTE = ["Ziel", "Reise", "Vorlieben", "Los!"];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Schritt-Indikator */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          {SCHRITTE.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 < schritt  ? "bg-[#00838F] text-white" :
                i + 1 === schritt ? "bg-[#00838F] text-white ring-4 ring-[#00838F]/20" :
                "bg-gray-200 text-gray-500"
              }`}>
                {i + 1 < schritt ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${i + 1 === schritt ? "text-[#00838F]" : "text-gray-400"}`}>
                {s}
              </span>
              {i < SCHRITTE.length - 1 && (
                <div className={`h-px w-6 sm:w-10 ${i + 1 < schritt ? "bg-[#00838F]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">

        {/* ── Schritt 1: Reiseziel ── */}
        {schritt === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Wohin soll die Reise gehen?</h2>
              <p className="text-sm text-gray-500">Stadt, Land oder Region eingeben</p>
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={ziel}
                onChange={(e) => setZiel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && weiter()}
                placeholder="z. B. Thailand, New York, Mallorca …"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-base focus:outline-none focus:border-[#00838F] focus:ring-2 focus:ring-[#00838F]/10"
                autoFocus
              />
            </div>

            {/* Beliebte Ziele */}
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold">Beliebte Ziele</p>
              <div className="flex flex-wrap gap-2">
                {["Thailand","Bali","Japan","Türkei","Mallorca","New York","Marokko","Italien"].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZiel(z)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      ziel === z
                        ? "bg-[#00838F] text-white border-[#00838F]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Schritt 2: Reisedaten ── */}
        {schritt === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Wie lange & wann?</h2>
              <p className="text-sm text-gray-500">Dauer, Reisende und Reisemonat</p>
            </div>

            {/* Tage */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 text-[#00838F]" /> Reisedauer
              </label>
              <div className="flex items-center gap-4">
                <button onClick={() => setTage(Math.max(1, tage - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#00838F] hover:text-[#00838F] transition-colors">−</button>
                <span className="text-2xl font-black text-gray-900 w-20 text-center">{tage} {tage === 1 ? "Tag" : "Tage"}</span>
                <button onClick={() => setTage(Math.min(21, tage + 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#00838F] hover:text-[#00838F] transition-colors">+</button>
              </div>
            </div>

            {/* Reisende */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users className="w-4 h-4 text-[#00838F]" /> Reisende
              </label>
              <div className="flex items-center gap-4">
                <button onClick={() => setReisende(Math.max(1, reisende - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#00838F] hover:text-[#00838F] transition-colors">−</button>
                <span className="text-2xl font-black text-gray-900 w-20 text-center">{reisende} {reisende === 1 ? "Person" : "Personen"}</span>
                <button onClick={() => setReisende(Math.min(10, reisende + 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-[#00838F] hover:text-[#00838F] transition-colors">+</button>
              </div>
            </div>

            {/* Monat */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sun className="w-4 h-4 text-[#00838F]" /> Reisemonat (optional)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {MONATE.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonat(monat === m ? "" : m)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      monat === m
                        ? "bg-[#00838F] text-white border-[#00838F]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Schritt 3: Vorlieben ── */}
        {schritt === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Was magst du?</h2>
              <p className="text-sm text-gray-500">Budget, Unterkunft & Interessen</p>
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Euro className="w-4 h-4 text-[#00838F]" /> Budget pro Person
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setBudget(budget === b.value ? "" : b.value)}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all ${
                      budget === b.value
                        ? "bg-[#00838F] text-white border-[#00838F]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F]"
                    }`}
                  >
                    <p className="font-bold text-sm">{b.label}</p>
                    <p className="text-[10px] opacity-75 mt-0.5">{b.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Unterkunft */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Unterkunft</p>
              <div className="flex flex-wrap gap-2">
                {UNTERKUENFTE.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnterkunft(u)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      unterkunft === u
                        ? "bg-[#00838F] text-white border-[#00838F]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Interessen */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Interessen <span className="text-gray-400 font-normal">(mehrere wählbar)</span></p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INTERESSEN.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggleInteresse(i.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                      interessen.includes(i.id)
                        ? "bg-[#00838F] text-white border-[#00838F]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#00838F]"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Schritt 4: Zusammenfassung ── */}
        {schritt === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Alles bereit!</h2>
              <p className="text-sm text-gray-500">Deine KI plant jetzt deine Traumreise</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              {[
                { label: "Reiseziel",  wert: ziel },
                { label: "Dauer",      wert: `${tage} Tage` },
                { label: "Reisende",   wert: `${reisende} Person(en)` },
                { label: "Monat",      wert: monat || "flexibel" },
                { label: "Budget",     wert: budget || "flexibel" },
                { label: "Unterkunft", wert: unterkunft },
                { label: "Interessen", wert: interessen.length > 0 ? interessen.map((id) => INTERESSEN.find((i) => i.id === id)?.label).join(", ") : "allgemein" },
              ].map(({ label, wert }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[60%]">{wert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fehler */}
        {fehler && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{fehler}</p>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {schritt > 1 && (
            <button
              onClick={zurueck}
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Zurück
            </button>
          )}

          {schritt < 4 ? (
            <button
              onClick={weiter}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] text-white font-bold py-3 rounded-2xl transition-colors"
            >
              Weiter <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={generieren}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-3 rounded-2xl transition-colors text-base"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Reiseplan wird erstellt …</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Reiseplan generieren</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
