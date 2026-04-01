"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Map, MapPin, Calendar, Users, Copy, Search, ArrowRight, Palmtree } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PublicRoute {
  id: string;
  userId: string;
  title: string;
  destination: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  notes: string;
  cloneCount: number;
  coverImageUrl: string | null;
  createdAt: string;
}

function db() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

function nightsBetween(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
}

export default function ReiseroutenClient() {
  const [routes, setRoutes] = useState<PublicRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cloning, setCloning] = useState<string | null>(null);
  const [cloned, setCloned] = useState<Set<string>>(new Set());
  const router = useRouter();

  const load = useCallback(async () => {
    const { data: authData } = await db().auth.getUser();
    setUserId(authData.user?.id ?? null);

    const { data } = await db()
      .from("trip_plans")
      .select("*")
      .eq("is_public", true)
      .order("clone_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    setRoutes((data ?? []).map((r) => ({
      id: r.id, userId: r.user_id, title: r.title, destination: r.destination,
      destinationName: r.destination_name, startDate: r.start_date, endDate: r.end_date,
      adults: r.adults, children: r.children, notes: r.notes ?? "",
      cloneCount: r.clone_count ?? 0, coverImageUrl: r.cover_image_url ?? null,
      createdAt: r.created_at,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleClone = async (route: PublicRoute) => {
    if (!userId) { router.push("/login"); return; }
    setCloning(route.id);

    await db().from("trip_plans").insert({
      user_id: userId,
      title: `${route.title} (Kopie)`,
      destination: route.destination,
      destination_name: route.destinationName,
      start_date: route.startDate,
      end_date: route.endDate,
      adults: route.adults,
      children: route.children,
      notes: route.notes,
      status: "planning",
      linked_trip_ids: [],
      linked_activity_ids: [],
      cloned_from: route.id,
    });

    // increment clone count
    await db().from("trip_plans")
      .update({ clone_count: route.cloneCount + 1 })
      .eq("id", route.id);

    setCloned((prev) => new Set([...prev, route.id]));
    setCloning(null);
    setRoutes((prev) => prev.map((r) => r.id === route.id ? { ...r, cloneCount: r.cloneCount + 1 } : r));
  };

  const filtered = routes.filter((r) =>
    search === "" ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
            <h1 className="font-bold text-gray-900 flex items-center gap-2">
              <Map className="w-5 h-5 text-[#00838F]" />
              Reiserouten
            </h1>
          </div>
          {userId && (
            <Link
              href="/dashboard"
              className="text-xs text-[#00838F] font-semibold hover:underline"
            >
              Meine Routen verwalten →
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Reiserouten entdecken & klonen</h2>
          <p className="text-gray-500 text-sm">Lass dich inspirieren und übernimm Routen anderer mit einem Klick in deine Planung.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ziel oder Titel suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30 bg-white"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map((i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Palmtree className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-700 mb-2">Noch keine öffentlichen Routen</p>
            <p className="text-sm text-gray-400 mb-6">Teile deine Reiseplanung im Dashboard, um hier zu erscheinen.</p>
            {userId && (
              <Link href="/dashboard" className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors">
                Zum Dashboard
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((route) => {
              const nights = nightsBetween(route.startDate, route.endDate);
              const isCloned = cloned.has(route.id);
              const isOwn = route.userId === userId;
              return (
                <div key={route.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {route.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={route.coverImageUrl} alt={route.title} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-linear-to-br from-[#00838F]/10 to-[#1db682]/10 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-[#00838F]/30" />
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{route.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {route.destinationName}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(route.startDate)}</span>
                      <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {nights} Nächte</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {route.adults + route.children} Pers.</span>
                    </div>

                    {route.notes && (
                      <p className="text-xs text-gray-500 line-clamp-2">{route.notes}</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Copy className="w-3 h-3" /> {route.cloneCount}× geklont
                      </span>
                      {!isOwn && (
                        <button
                          onClick={() => handleClone(route)}
                          disabled={!!cloning || isCloned}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            isCloned
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-[#00838F] text-white hover:bg-[#006E7A]"
                          } disabled:opacity-60`}
                        >
                          <Copy className="w-3 h-3" />
                          {isCloned ? "Geklont!" : cloning === route.id ? "…" : "Klonen"}
                        </button>
                      )}
                      {isOwn && (
                        <span className="text-[10px] text-[#00838F] font-semibold">Deine Route</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
