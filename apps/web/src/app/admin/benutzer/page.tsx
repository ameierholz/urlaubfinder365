"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCog, Search, Loader2, Shield, ShieldCheck, Crown, User, Ban } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface UserRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  xp: number;
  level: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  bio: string | null;
  visited_countries: string[] | null;
  favorite_destinations: string[] | null;
}

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  admin:     { label: "Admin",     icon: Crown,       cls: "text-red-400 bg-red-900/30 border-red-800" },
  moderator: { label: "Moderator", icon: ShieldCheck,  cls: "text-amber-400 bg-amber-900/30 border-amber-800" },
  premium:   { label: "Premium",   icon: Shield,       cls: "text-purple-400 bg-purple-900/30 border-purple-800" },
  user:      { label: "User",      icon: User,         cls: "text-gray-400 bg-gray-800/30 border-gray-700" },
  banned:    { label: "Gesperrt",  icon: Ban,          cls: "text-red-500 bg-red-950/30 border-red-900" },
};

export default function AdminBenutzerPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("alle");

  useEffect(() => {
    const sb = createSupabaseBrowser();
    sb.from("users")
      .select("id, display_name, avatar_url, role, xp, level, is_public, created_at, updated_at, bio, visited_countries, favorite_destinations")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUsers((data ?? []) as UserRow[]);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch = !search ||
      (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search);
    const matchesRole = roleFilter === "alle" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    mods: users.filter((u) => u.role === "moderator").length,
    premium: users.filter((u) => u.role === "premium").length,
    active: users.filter((u) => u.role !== "banned").length,
    banned: users.filter((u) => u.role === "banned").length,
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-violet-900/30 rounded-lg">
          <UserCog className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Benutzer</h1>
          <p className="text-sm text-gray-500">Registrierte Benutzer verwalten, Rollen zuweisen, Profile einsehen</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Gesamt", value: stats.total, color: "text-white" },
          { label: "Aktiv", value: stats.active, color: "text-green-400" },
          { label: "Admins", value: stats.admins, color: "text-red-400" },
          { label: "Moderatoren", value: stats.mods, color: "text-amber-400" },
          { label: "Premium", value: stats.premium, color: "text-purple-400" },
          { label: "Gesperrt", value: stats.banned, color: "text-gray-500" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, E-Mail oder ID suchen..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {["alle", "admin", "moderator", "premium", "user", "banned"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === r ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {r === "alle" ? "Alle" : (ROLE_CONFIG[r]?.label ?? r)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[250px]">Benutzer</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[90px]">Rolle</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[60px]">Level</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[60px]">XP</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[70px]">Länder</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[70px]">Favoriten</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[55px]">Profil</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-[75px]">Registriert</th>
              <th className="w-[70px] px-2 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const role = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.user;
              const RoleIcon = role.icon;
              const registered = new Date(u.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
              return (
                <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                          {(u.display_name ?? "?")[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] text-white font-medium truncate">{u.display_name || "Unbenannt"}</p>
                        <p className="text-[10px] text-gray-600 font-mono truncate">{u.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.cls}`}>
                      <RoleIcon className="w-2.5 h-2.5" /> {role.label}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-400 font-mono">{u.level}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-400 font-mono">{u.xp.toLocaleString("de-DE")}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">{u.visited_countries?.length ?? 0}</td>
                  <td className="px-2 py-2 text-[11px] text-gray-400">{u.favorite_destinations?.length ?? 0}</td>
                  <td className="px-2 py-2">
                    <span className={`text-[10px] font-bold ${u.is_public ? "text-green-400" : "text-gray-600"}`}>
                      {u.is_public ? "Öffentlich" : "Privat"}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-500">{registered}</td>
                  <td className="px-2 py-2">
                    <Link href={`/admin/benutzer/${u.id}/`}
                      className="text-violet-400 hover:text-violet-300 text-[11px] font-semibold transition-colors">
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-gray-500 text-sm">
                  {search ? "Keine Benutzer gefunden." : "Noch keine Benutzer registriert."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 mt-3">{filtered.length} von {users.length} Benutzern</p>
    </div>
  );
}
