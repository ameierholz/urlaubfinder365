"use client";

import { useState, useEffect } from "react";
import { getTravelReports } from "@/lib/firestore";
import { TravelReport } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import { BookOpen, Loader2, Filter } from "lucide-react";
import Link from "next/link";

const RATINGS = [5, 4, 3, 2, 1];
const COUNTRIES = ["Alle","Türkei","Griechenland","Spanien","Ägypten","Italien","Portugal","Thailand","Malediven","Marokko","USA"];

export default function ReiseberichtePage() {
  const [all, setAll]       = useState<TravelReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("Alle");
  const [minRating, setMinRating] = useState(0);
  const [rec, setRec] = useState<boolean | null>(null);

  useEffect(() => {
    getTravelReports(60).then(setAll).finally(() => setLoading(false));
  }, []);

  const filtered = all.filter((r) =>
    (country === "Alle" || r.country === country) &&
    (minRating === 0 || r.rating >= minRating) &&
    (rec === null || r.recommendation === rec)
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2 mb-2">
        <BookOpen className="w-6 h-6 text-teal-600" />
        Reiseberichte der Community
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Echte Erfahrungen von echten Reisenden — strukturiert, ehrlich, hilfreich.
        <Link href="/dashboard/" className="ml-2 text-teal-600 font-semibold hover:underline">+ Eigenen Bericht schreiben</Link>
      </p>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        >
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        >
          <option value={0}>Alle Bewertungen</option>
          {RATINGS.map((r) => <option key={r} value={r}>{"★".repeat(r)}{"☆".repeat(5-r)} und besser</option>)}
        </select>
        <div className="flex gap-2">
          {[{label:"Alle", val:null},{label:"Empfohlen ✅", val:true},{label:"Nicht empfohlen ❌", val:false}].map((o) => (
            <button key={String(o.val)} onClick={() => setRec(o.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                rec === o.val ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} Berichte</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Keine Berichte gefunden</p>
          <p className="text-sm mt-1">Passe die Filter an oder schreibe den ersten Bericht!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => <TravelReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
