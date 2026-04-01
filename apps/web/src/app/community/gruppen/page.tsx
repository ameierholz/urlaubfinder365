"use client";

import { useState, useEffect } from "react";
import { getTravelGroups, getUserGroups } from "@/lib/supabase-db";
import { TravelGroup, GroupCategory } from "@/types";
import GroupCard from "@/components/community/GroupCard";
import { useAuth } from "@/context/AuthContext";
import { Users2, Plus, Loader2, Search } from "lucide-react";
import Link from "next/link";

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
      setAll(g);
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
            Reise-Gruppen
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Finde Gleichgesinnte, tausche Tipps aus und plane gemeinsam Reisen.
          </p>
        </div>
        {user && (
          <Link href="/dashboard/" className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold">
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
