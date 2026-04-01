"use client";

import { useState } from "react";
import { TravelReport, PriceRange } from "@/types";
import { Star, CheckCircle2, XCircle, Loader2, X } from "lucide-react";

const COUNTRIES = [
  "Ägypten","Albanien","Bulgarien","Deutschland","Frankreich","Griechenland",
  "Indonesien","Island","Italien","Japan","Kanaren","Kapverden","Kroatien",
  "Kuba","Kenia","Mallorca","Malta","Marokko","Malediven","Mexiko","Montenegro",
  "Österreich","Portugal","Schweiz","Slowenien","Spanien","Thailand","Türkei",
  "Tunesien","USA","VAE / Dubai","Zypern",
];

const PRICE_OPTIONS: { value: PriceRange; label: string; desc: string }[] = [
  { value: "budget",  label: "Budget",  desc: "< 500 € / Person" },
  { value: "mittel",  label: "Mittel",  desc: "500–1.200 € / Person" },
  { value: "premium", label: "Premium", desc: "1.200–2.500 € / Person" },
  { value: "luxus",   label: "Luxus",   desc: "> 2.500 € / Person" },
];

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const YEARS  = ["2020","2021","2022","2023","2024","2025","2026"];

export interface ReportFormData {
  destination: string;
  country: string;
  title: string;
  highlights: string;
  lowlights: string;
  tips: string;
  priceRange: PriceRange;
  rating: number;
  recommendation: boolean;
  coverImageUrl: string;
  visitedAt: string;          // "YYYY-MM"
}

const EMPTY: ReportFormData = {
  destination: "", country: "", title: "", highlights: "", lowlights: "", tips: "",
  priceRange: "mittel", rating: 4, recommendation: true, coverImageUrl: "", visitedAt: "",
};

interface Props {
  initial?: Partial<ReportFormData>;
  onSave: (data: ReportFormData, publish: boolean) => Promise<void>;
  onCancel: () => void;
}

export default function TravelReportForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ReportFormData>({ ...EMPTY, ...initial });
  const [month, setMonth] = useState(form.visitedAt.split("-")[1] ? MONTHS[parseInt(form.visitedAt.split("-")[1]) - 1] : "");
  const [year, setYear]   = useState(form.visitedAt.split("-")[0] || "2025");
  const [saving, setSaving] = useState<false | "draft" | "publish">(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ReportFormData>(key: K, val: ReportFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function updateVisitedAt(m: string, y: string) {
    const mi = MONTHS.indexOf(m) + 1;
    if (mi > 0 && y) set("visitedAt", `${y}-${String(mi).padStart(2, "0")}`);
  }

  async function handleSubmit(publish: boolean) {
    if (!form.destination.trim() || !form.country || !form.title.trim()) {
      setError("Bitte Destination, Land und Titel ausfüllen."); return;
    }
    if (!form.highlights.trim() || !form.lowlights.trim() || !form.tips.trim()) {
      setError("Bitte Highlights, Lowlights und Tipps ausfüllen."); return;
    }
    setSaving(publish ? "publish" : "draft");
    setError(null);
    try {
      await onSave({ ...form, visitedAt: form.visitedAt || `${year}-${String(MONTHS.indexOf(month)+1).padStart(2,"0")}` }, publish);
    } catch {
      setError("Fehler beim Speichern. Bitte erneut versuchen.");
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Reisebericht schreiben</h2>
          <p className="text-teal-100 text-sm">Teile deine Erfahrungen mit der Community</p>
        </div>
        <button onClick={onCancel} className="text-white/80 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Destination + Land */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Destination / Ort *</label>
            <input type="text" placeholder="z.B. Antalya, Türkei"
              value={form.destination} onChange={(e) => set("destination", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Land *</label>
            <select value={form.country} onChange={(e) => set("country", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">– Land wählen –</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Titel */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Titel *</label>
          <input type="text" placeholder="Ein prägnanter Titel für deinen Bericht"
            value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={80}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Reisezeitraum */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Reisemonat</label>
            <select value={month} onChange={(e) => { setMonth(e.target.value); updateVisitedAt(e.target.value, year); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">– Monat –</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Jahr</label>
            <select value={year} onChange={(e) => { setYear(e.target.value); updateVisitedAt(month, e.target.value); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-xs font-bold text-emerald-600 mb-1.5">✅ Highlights – Was war besonders gut? *</label>
          <textarea placeholder="z.B. Das Hotel war top, der Strand traumhaft, das Essen authentisch…"
            value={form.highlights} onChange={(e) => set("highlights", e.target.value)}
            rows={3} maxLength={600}
            className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <p className="text-right text-[10px] text-gray-400">{form.highlights.length}/600</p>
        </div>

        {/* Lowlights */}
        <div>
          <label className="block text-xs font-bold text-orange-600 mb-1.5">⚠️ Lowlights – Was hätte besser sein können? *</label>
          <textarea placeholder="z.B. Die Zimmer waren etwas klein, der Pool war oft überfüllt…"
            value={form.lowlights} onChange={(e) => set("lowlights", e.target.value)}
            rows={3} maxLength={600}
            className="w-full border border-orange-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
          <p className="text-right text-[10px] text-gray-400">{form.lowlights.length}/600</p>
        </div>

        {/* Tipps */}
        <div>
          <label className="block text-xs font-bold text-blue-600 mb-1.5">💡 Tipps für andere *</label>
          <textarea placeholder="z.B. Zimmer Nr. 12-20 sind ruhiger, beim Einchecken direkt nach Meerblick fragen…"
            value={form.tips} onChange={(e) => set("tips", e.target.value)}
            rows={3} maxLength={600}
            className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <p className="text-right text-[10px] text-gray-400">{form.tips.length}/600</p>
        </div>

        {/* Preisklasse */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Preisklasse</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRICE_OPTIONS.map((p) => (
              <button key={p.value} type="button" onClick={() => set("priceRange", p.value)}
                className={`flex flex-col items-center px-2 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                  form.priceRange === p.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="font-bold">{p.label}</span>
                <span className="text-[10px] text-gray-400 font-normal">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bewertung + Empfehlung */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Bewertung</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => set("rating", n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-7 h-7 ${n <= form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Würdest du empfehlen?</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => set("recommendation", true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  form.recommendation ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Ja
              </button>
              <button type="button" onClick={() => set("recommendation", false)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  !form.recommendation ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" /> Nein
              </button>
            </div>
          </div>
        </div>

        {/* Cover-Bild */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Cover-Bild URL (optional)</label>
          <input type="url" placeholder="https://images.unsplash.com/…"
            value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Fehler */}
        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold"
          >
            Abbrechen
          </button>
          <button onClick={() => handleSubmit(false)} disabled={!!saving}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
          >
            {saving === "draft" && <Loader2 className="w-4 h-4 animate-spin" />}
            Als Entwurf speichern
          </button>
          <button onClick={() => handleSubmit(true)} disabled={!!saving}
            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
          >
            {saving === "publish" && <Loader2 className="w-4 h-4 animate-spin" />}
            Veröffentlichen
          </button>
        </div>
      </div>
    </div>
  );
}
