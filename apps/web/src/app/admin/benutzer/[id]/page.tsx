"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, UserCog, Loader2, Save, Shield, ShieldCheck, Crown, User, Ban,
  MapPin, Heart, Bell, Trophy, Calendar, Mail, Globe, Star, AlertTriangle,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface UserDetail {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  xp: number;
  level: number;
  is_public: boolean;
  fcm_token: string | null;
  notification_prefs: Record<string, boolean> | null;
  visited_countries: string[] | null;
  favorite_destinations: string[] | null;
  saved_trip_codes: string[] | null;
  preferences: Record<string, unknown> | null;
  checklist: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Achievement { id: string; name: string; unlocked_at: string }
interface Favorite { id: string; destination_slug: string; created_at: string }
interface PriceAlert { id: string; destination_slug: string; max_price: number; created_at: string }

const ROLES = ["user", "premium", "moderator", "admin", "banned"] as const;
const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  admin:     { label: "Admin",     icon: Crown,       cls: "text-red-400 bg-red-900/30 border-red-800" },
  moderator: { label: "Moderator", icon: ShieldCheck,  cls: "text-amber-400 bg-amber-900/30 border-amber-800" },
  premium:   { label: "Premium",   icon: Shield,       cls: "text-purple-400 bg-purple-900/30 border-purple-800" },
  user:      { label: "User",      icon: User,         cls: "text-gray-400 bg-gray-800/30 border-gray-700" },
  banned:    { label: "Gesperrt",  icon: Ban,          cls: "text-red-500 bg-red-950/30 border-red-900" },
};

export default function AdminBenutzerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const sb = createSupabaseBrowser();

    Promise.all([
      sb.from("users").select("*").eq("id", userId).maybeSingle(),
      sb.from("user_achievements" as never).select("id, achievement_id, unlocked_at").eq("user_id", userId),
      sb.from("favorites" as never).select("id, destination_slug, created_at").eq("user_id", userId),
      sb.from("price_alerts" as never).select("id, destination_slug, max_price, created_at").eq("user_id", userId),
    ]).then(([userRes, achRes, favRes, alertRes]) => {
      const u = userRes.data as UserDetail | null;
      setUser(u);
      setSelectedRole(u?.role ?? "user");
      setAdminNotes(u?.notes ?? "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAchievements((achRes.data ?? []) as any[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFavorites((favRes.data ?? []) as any[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPriceAlerts((alertRes.data ?? []) as any[]);
      setLoading(false);
    });
  }, [userId]);

  const saveChanges = async () => {
    setSaving(true);
    const sb = createSupabaseBrowser();
    await sb.from("users").update({
      role: selectedRole,
      notes: adminNotes || null,
    }).eq("id", userId);
    setSaving(false);
    if (user) setUser({ ...user, role: selectedRole, notes: adminNotes });
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>;
  if (!user) return <div className="text-center py-16 text-gray-500">Benutzer nicht gefunden.</div>;

  const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.user;
  const RoleIcon = role.icon;
  const registered = new Date(user.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  const lastUpdate = new Date(user.updated_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/benutzer" className="hover:text-gray-300 transition-colors">Benutzer</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">{user.display_name || user.id.slice(0, 8)}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-700 flex items-center justify-center text-2xl font-black text-gray-400">
            {(user.display_name ?? "?")[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black text-white">{user.display_name || "Unbenannt"}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${role.cls}`}>
              <RoleIcon className="w-3 h-3" /> {role.label}
            </span>
            <span className="text-xs text-gray-500">Level {user.level} · {user.xp.toLocaleString("de-DE")} XP</span>
            <span className="text-xs text-gray-600 font-mono">{user.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte: Profil + Admin-Aktionen */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profil-Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-violet-400" /> Profil-Informationen</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Anzeigename</p>
                <p className="text-gray-300">{user.display_name || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Profil-Sichtbarkeit</p>
                <p className={user.is_public ? "text-green-400" : "text-gray-500"}>{user.is_public ? "Öffentlich" : "Privat"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-gray-400 text-xs">{user.bio || "Keine Bio hinterlegt"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Registriert</p>
                <p className="text-gray-300">{registered}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Letztes Update</p>
                <p className="text-gray-300">{lastUpdate}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Besuchte Länder</p>
                <p className="text-gray-300">{user.visited_countries?.length ?? 0} {user.visited_countries?.length ? `(${user.visited_countries.join(", ")})` : ""}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Bell className="w-3 h-3" /> Push-Token</p>
                <p className="text-gray-400 text-xs font-mono truncate">{user.fcm_token ? user.fcm_token.slice(0, 20) + "..." : "Kein Token"}</p>
              </div>
            </div>
          </div>

          {/* Admin-Aktionen */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-violet-400" /> Admin-Aktionen</h2>

            {/* Rolle ändern */}
            <div className="mb-5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Rolle ändern</p>
              <div className="flex gap-2 flex-wrap">
                {ROLES.map((r) => {
                  const rc = ROLE_CONFIG[r];
                  const Icon = rc.icon;
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedRole === r ? rc.cls : "bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <Icon className="w-3 h-3" /> {rc.label}
                    </button>
                  );
                })}
              </div>
              {selectedRole === "banned" && (
                <div className="mt-3 bg-red-950/30 border border-red-900 rounded-lg p-3">
                  <p className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Der Benutzer wird sofort gesperrt und kann sich nicht mehr einloggen.</p>
                </div>
              )}
            </div>

            {/* Admin-Notizen */}
            <div className="mb-5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Admin-Notizen (intern)</p>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Interne Notizen zum Benutzer..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Speichern */}
            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Speichert..." : "Änderungen speichern"}
            </button>
          </div>
        </div>

        {/* Rechte Spalte: Aktivität */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Achievements
              <span className="text-[10px] text-gray-500 font-normal ml-auto">{achievements.length}</span>
            </h2>
            {achievements.length > 0 ? (
              <div className="space-y-2">
                {achievements.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-300">{a.name || a.id}</span>
                    <span className="text-[10px] text-gray-500">{new Date(a.unlocked_at).toLocaleDateString("de-DE")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Keine Achievements freigeschaltet</p>
            )}
          </div>

          {/* Favoriten */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" /> Favoriten
              <span className="text-[10px] text-gray-500 font-normal ml-auto">{favorites.length}</span>
            </h2>
            {favorites.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {favorites.map((f) => (
                  <span key={f.id} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">{f.destination_slug}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Keine Favoriten gespeichert</p>
            )}
          </div>

          {/* Preisalarme */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-400" /> Preisalarme
              <span className="text-[10px] text-gray-500 font-normal ml-auto">{priceAlerts.length}</span>
            </h2>
            {priceAlerts.length > 0 ? (
              <div className="space-y-2">
                {priceAlerts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-300">{a.destination_slug}</span>
                    <span className="text-xs text-teal-400 font-mono">max {a.max_price}€</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Keine Preisalarme aktiv</p>
            )}
          </div>

          {/* Notification Prefs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Benachrichtigungen
            </h2>
            {user.notification_prefs ? (
              <div className="space-y-1.5">
                {Object.entries(user.notification_prefs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{key}</span>
                    <span className={`text-[10px] font-bold ${val ? "text-green-400" : "text-gray-600"}`}>{val ? "AN" : "AUS"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Standard-Einstellungen</p>
            )}
          </div>

          {/* Preferences */}
          {user.preferences && Object.keys(user.preferences).length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Präferenzen
              </h2>
              <pre className="text-[10px] text-gray-500 overflow-auto max-h-40">{JSON.stringify(user.preferences, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Back */}
      <div className="mt-6">
        <Link href="/admin/benutzer" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Zurück zur Benutzer-Übersicht
        </Link>
      </div>
    </div>
  );
}
