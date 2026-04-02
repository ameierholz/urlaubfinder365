"use client";

import { useState, useEffect } from "react";
import { getTravelReports } from "@/lib/supabase-db";
import { TravelReport } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import { BookOpen, Loader2, Filter } from "lucide-react";
import Link from "next/link";

/* ── Demo-Daten (Fallback wenn DB leer) ──────────────────────────────────── */

const DEMO_REPORTS: TravelReport[] = [
  {
    id: "demo-1",
    userId: "demo",
    displayName: "Familie Weber",
    destination: "Antalya, Türkei",
    country: "Türkei",
    title: "Traumurlaub an der türkischen Riviera",
    highlights: "Riesiger Strand, tolles Essen, Kinderclub, saubere Anlage",
    lowlights: "Pool manchmal voll, Liegen früh reserviert",
    tips: "Früh aufstehen für Strandliegen, Ausflug nach Side lohnt sich",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80",
    visitedAt: "2025-08",
    createdAt: "2025-09-01T10:00:00Z",
    likesCount: 24,
    likedBy: [],
    commentsCount: 5,
    isPublished: true,
  },
  {
    id: "demo-2",
    userId: "demo",
    displayName: "Sandra K.",
    destination: "Mallorca, Spanien",
    country: "Spanien",
    title: "Entspannter Pärchenurlaub auf Mallorca",
    highlights: "Strandlage, gutes Restaurant, ruhig im Oktober",
    lowlights: "WLAN im Zimmer schwach",
    tips: "Mietwagen buchen für Serra de Tramuntana, Tapas in Palma",
    priceRange: "mittel",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80",
    visitedAt: "2025-10",
    createdAt: "2025-10-20T14:30:00Z",
    likesCount: 18,
    likedBy: [],
    commentsCount: 3,
    isPublished: true,
  },
  {
    id: "demo-3",
    userId: "demo",
    displayName: "Marco T.",
    destination: "Hurghada, Ägypten",
    country: "Ägypten",
    title: "Schnorchel-Paradies am Roten Meer",
    highlights: "Fantastisches Hausriff, All-Inclusive top, Spa",
    lowlights: "Flughafentransfer 45 Min.",
    tips: "Tauchkurs vor Ort buchen, Ausflug nach Luxor einplanen",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    visitedAt: "2025-11",
    createdAt: "2025-12-01T09:15:00Z",
    likesCount: 31,
    likedBy: [],
    commentsCount: 7,
    isPublished: true,
  },
  {
    id: "demo-4",
    userId: "demo",
    displayName: "Julia & Max",
    destination: "Kreta, Griechenland",
    country: "Griechenland",
    title: "Kreta – Kultur und Traumstrände",
    highlights: "Vielfältige Insel, freundliche Locals, tolles Essen",
    lowlights: "Mietwagen fast Pflicht für Ausflüge",
    tips: "Elafonissi Beach besuchen, Samaria-Schlucht früh starten",
    priceRange: "mittel",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    visitedAt: "2025-06",
    createdAt: "2025-07-10T16:00:00Z",
    likesCount: 22,
    likedBy: [],
    commentsCount: 4,
    isPublished: true,
  },
  {
    id: "demo-5",
    userId: "demo",
    displayName: "Tim B.",
    destination: "Barcelona, Spanien",
    country: "Spanien",
    title: "Barcelona – die perfekte Städtereise",
    highlights: "Architektur, Essen, Strand, Nightlife",
    lowlights: "Taschendiebe auf La Rambla – aufpassen!",
    tips: "Tickets für Sagrada Família vorher online buchen",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",
    visitedAt: "2025-09",
    createdAt: "2025-09-25T11:45:00Z",
    likesCount: 15,
    likedBy: [],
    commentsCount: 2,
    isPublished: true,
  },
  {
    id: "demo-6",
    userId: "demo",
    displayName: "Fam. Schneider",
    destination: "Side, Türkei",
    country: "Türkei",
    title: "Perfekter Familienurlaub in Side",
    highlights: "Kinderfreundlich, Preis-Leistung, flacher Strand",
    lowlights: "Animation manchmal zu laut",
    tips: "Kinderbuffet nutzen, Basar in Side besuchen",
    priceRange: "budget",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    visitedAt: "2025-07",
    createdAt: "2025-07-20T08:30:00Z",
    likesCount: 29,
    likedBy: [],
    commentsCount: 6,
    isPublished: true,
  },
];

const RATINGS = [5, 4, 3, 2, 1];
const COUNTRIES = ["Alle","Türkei","Griechenland","Spanien","Ägypten","Italien","Portugal","Thailand","Malediven","Marokko","USA"];

export default function ReiseberichtePage() {
  const [all, setAll]       = useState<TravelReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("Alle");
  const [minRating, setMinRating] = useState(0);
  const [rec, setRec] = useState<boolean | null>(null);

  useEffect(() => {
    getTravelReports(60).then((r) => setAll(r.length > 0 ? r : DEMO_REPORTS)).finally(() => setLoading(false));
  }, []);

  const filtered = all.filter((r) =>
    (country === "Alle" || r.country === country) &&
    (minRating === 0 || r.rating >= minRating) &&
    (rec === null || r.recommendation === rec)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
