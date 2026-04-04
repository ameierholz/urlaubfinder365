"use client";

import { useState, useEffect } from "react";
import { getTravelGroups, getUserGroups } from "@/lib/supabase-db";
import { TravelGroup, GroupCategory } from "@/types";
import GroupCard from "@/components/community/GroupCard";
import { useAuth } from "@/context/AuthContext";
import { Users2, Plus, Loader2, Search } from "lucide-react";
import Link from "next/link";

/* ── Demo-Daten (Fallback wenn DB leer) ──────────────────────────────────── */

const DEMO_GROUPS: TravelGroup[] = [
  {
    id: "demo-g1",
    creatorId: "demo",
    creatorName: "Sandra K.",
    name: "Türkei-Fans",
    description: "Alles rund um Urlaub in der Türkei: Antalya, Bodrum, Istanbul und mehr. Tipps, Erfahrungen und gemeinsame Urlaubsplanung.",
    category: "destination" as GroupCategory,
    destination: "Türkei",
    country: "Türkei",
    isPublic: true,
    membersCount: 47,
    memberIds: [],
    postsCount: 12,
    coverImageUrl: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80",
    tags: ["türkei", "antalya", "bodrum", "istanbul"],
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "demo-g2",
    creatorId: "demo",
    creatorName: "Fam. Weber",
    name: "Familien-Reisende",
    description: "Die Gruppe für alle Eltern! Kinderfreundliche Hotels, Tipps für Flugreisen mit Kids und familiengerechte Urlaubsziele.",
    category: "style" as GroupCategory,
    isPublic: true,
    membersCount: 89,
    memberIds: [],
    postsCount: 24,
    coverImageUrl: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80",
    tags: ["familie", "kinder", "familienurlaub"],
    createdAt: "2025-02-05T14:00:00Z",
  },
  {
    id: "demo-g3",
    creatorId: "demo",
    creatorName: "Julia & Max",
    name: "Griechenland-Liebhaber",
    description: "Kreta, Rhodos, Korfu, Santorini – wir lieben griechische Inseln! Geheimtipps, Tavernen-Empfehlungen und Urlaubsberichte.",
    category: "destination" as GroupCategory,
    destination: "Griechenland",
    country: "Griechenland",
    isPublic: true,
    membersCount: 34,
    memberIds: [],
    postsCount: 8,
    coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    tags: ["griechenland", "kreta", "rhodos", "santorini"],
    createdAt: "2025-03-15T09:30:00Z",
  },
  {
    id: "demo-g4",
    creatorId: "demo",
    creatorName: "Tim B.",
    name: "Budget-Reisende unter 500€",
    description: "Urlaub muss nicht teuer sein! Hier teilen wir die besten Schnäppchen, Tricks und Last-Minute-Deals unter 500€ pro Person.",
    category: "interest" as GroupCategory,
    isPublic: true,
    membersCount: 156,
    memberIds: [],
    postsCount: 31,
    coverImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
    tags: ["budget", "schnäppchen", "lastminute"],
    createdAt: "2025-01-20T11:00:00Z",
  },
  {
    id: "demo-g5",
    creatorId: "demo",
    creatorName: "Sandra K.",
    name: "Mallorca Insider",
    description: "Die schönsten Buchten, besten Restaurants und Geheimtipps abseits des Ballermanns. Für alle, die das echte Mallorca lieben.",
    category: "destination" as GroupCategory,
    destination: "Mallorca",
    country: "Spanien",
    isPublic: true,
    membersCount: 62,
    memberIds: [],
    postsCount: 15,
    coverImageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80",
    tags: ["mallorca", "spanien", "balearen"],
    createdAt: "2025-04-01T08:00:00Z",
  },
  {
    id: "demo-g6",
    creatorId: "demo",
    creatorName: "Alex R.",
    name: "Sommer 2026 – wer kommt mit?",
    description: "Gemeinsam den Sommer 2026 planen! Urlaubspartner finden, Gruppen-Deals teilen und zusammen buchen.",
    category: "date" as GroupCategory,
    travelMonth: "2026-07",
    isPublic: true,
    membersCount: 28,
    memberIds: [],
    postsCount: 6,
    coverImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    tags: ["sommer2026", "reisepartner", "gruppenreise"],
    createdAt: "2025-11-01T16:00:00Z",
  },
  {
    id: "demo-g7",
    creatorId: "demo",
    creatorName: "Marco T.",
    name: "Ägypten & Rotes Meer",
    description: "Tauchen, Schnorcheln, Wüstensafaris – alles über Urlaub in Ägypten. Hurghada, Sharm el Sheikh, Marsa Alam und Luxor.",
    category: "destination" as GroupCategory,
    destination: "Ägypten",
    country: "Ägypten",
    isPublic: true,
    membersCount: 41,
    memberIds: [],
    postsCount: 10,
    coverImageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    tags: ["ägypten", "tauchen", "rotesmeer", "hurghada"],
    createdAt: "2025-05-12T13:00:00Z",
  },
  {
    id: "demo-g8",
    creatorId: "demo",
    creatorName: "Lena M.",
    name: "Solo-Reisende",
    description: "Allein unterwegs und stolz drauf! Tipps für Alleinreisende, sichere Urlaubsziele und Erfahrungsberichte von Solo-Travellern.",
    category: "style" as GroupCategory,
    isPublic: true,
    membersCount: 73,
    memberIds: [],
    postsCount: 18,
    coverImageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80",
    tags: ["solo", "alleinreisend", "soloreise"],
    createdAt: "2025-06-01T10:30:00Z",
  },
];

const CAT_FILTER: { value: GroupCategory | "all"; label: string; emoji: string }[] = [
  { value: "all",         label: "Alle",           emoji: "🗺️" },
  { value: "destination", label: "Destination",    emoji: "📍" },
  { value: "style",       label: "Reisestil",      emoji: "🎒" },
  { value: "date",        label: "Zeitraum",        emoji: "📅" },
  { value: "interest",    label: "Interesse",      emoji: "💡" },
];

export default function GruppenPage() {
  const { user } = useAuth();
  const [all, setAll]         = useState<TravelGroup[]>([]);
  const [myGroups, setMyGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading]  = useState(true);
  const [cat, setCat]          = useState<GroupCategory | "all">("all");
  const [search, setSearch]    = useState("");

  useEffect(() => {
    Promise.all([
      getTravelGroups(60),
      user ? getUserGroups(user.uid) : Promise.resolve([]),
    ]).then(([g, mg]) => {
      setAll(g.length > 0 ? g : DEMO_GROUPS);
      setMyGroups(new Set(mg.map((x) => x.id)));
    }).finally(() => setLoading(false));
  }, [user]);

  const filtered = all.filter((g) =>
    (cat === "all" || g.category === cat) &&
    (search === "" || g.name.toLowerCase().includes(search.toLowerCase()) ||
     g.destination?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-teal-600" />
            Urlaubs-Gruppen
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Finde Gleichgesinnte, tausche Tipps aus und plant gemeinsam Urlaube.
          </p>
        </div>
        {user && (
          <Link href="/community/gruppen/neu/" className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold">
            <Plus className="w-4 h-4" /> Gruppe gründen
          </Link>
        )}
      </div>

      {/* Filter + Suche */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Gruppe suchen…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-40"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CAT_FILTER.map((f) => (
            <button key={f.value} onClick={() => setCat(f.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                cat === f.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-teal-200"
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} Gruppen</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Keine Gruppen gefunden</p>
          <p className="text-sm mt-1">Gründe die erste Gruppe zu diesem Thema!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((g) => <GroupCard key={g.id} group={g} isMember={myGroups.has(g.id)} />)}
        </div>
      )}
    </div>
  );
}
