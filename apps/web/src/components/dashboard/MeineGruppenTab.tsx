"use client";

import { useState, useEffect } from "react";
import type { AppUser } from "@/context/AuthContext";
import { getUserGroups, createGroup, leaveGroup } from "@/lib/supabase-db";
import { TravelGroup, GroupCategory } from "@/types";
import { Users2, Plus, LogOut, Loader2, X } from "lucide-react";
import Link from "next/link";

const CAT_OPTIONS: { value: GroupCategory; label: string; emoji: string }[] = [
  { value: "destination", label: "Destination",   emoji: "🗺️" },
  { value: "style",       label: "Reisestil",     emoji: "🎒" },
  { value: "date",        label: "Reisezeitraum", emoji: "📅" },
  { value: "interest",    label: "Interesse",     emoji: "💡" },
];

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const YEARS  = ["2025","2026","2027"];

interface Props { user: AppUser }

export default function MeineGruppenTab({ user }: Props) {
  const [groups, setGroups]     = useState<TravelGroup[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [form, setForm]         = useState({
    name: "", description: "", destination: "", country: "", tags: "",
    category: "destination" as GroupCategory, travelMonth: "",
    isPublic: true, coverImageUrl: "",
  });

  useEffect(() => {
    getUserGroups(user.uid).then(setGroups).finally(() => setLoading(false));
  }, [user.uid]);

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Anonym";
    try {
      const id = await createGroup(user.uid, displayName, {
        name: form.name, description: form.description, category: form.category,
        destination: form.destination || undefined, country: form.country || undefined,
        travelMonth: form.travelMonth || undefined, isPublic: form.isPublic,
        coverImageUrl: form.coverImageUrl || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      const newGroup: TravelGroup = {
        id, creatorId: user.uid, creatorName: displayName,
        name: form.name, description: form.description,
        category: form.category, destination: form.destination || undefined,
        country: form.country || undefined, travelMonth: form.travelMonth || undefined,
        isPublic: form.isPublic, membersCount: 1, memberIds: [user.uid],
        postsCount: 0, coverImageUrl: form.coverImageUrl || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setGroups((prev) => [newGroup, ...prev]);
      setShowForm(false);
      setForm({ name:"", description:"", destination:"", country:"", tags:"", category:"destination", travelMonth:"", isPublic:true, coverImageUrl:"" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleLeave(id: string) {
    if (!confirm("Gruppe verlassen?")) return;
    await leaveGroup(user.uid, id);
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

    {/* Erklärung rechts */}
    <div className="order-first lg:order-last lg:w-64 shrink-0">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">So funktioniert&apos;s</h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start gap-2"><span className="shrink-0">👥</span><span>Klicke <strong>„Gruppe gründen"</strong> um eine neue Urlaubs-Gruppe zu erstellen</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🗺️</span><span>Gib ein Ziel, Beschreibung und <strong>Tags</strong> an – Tags helfen anderen, deine Gruppe zu finden</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔍</span><span>Entdecke Gruppen anderer Urlauber unter <a href="/community/gruppen/" className="text-blue-600 underline">Community → Gruppen</a></span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">💬</span><span>Tritt einer Gruppe bei und schreibe Beiträge, teile Tipps und plane gemeinsam</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🚪</span><span>Gruppe verlassen: LogOut-Icon klicken (nur bei fremden Gruppen)</span></li>
        </ul>
      </div>
    </div>

    <div className="flex-1 min-w-0 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-teal-600" />
            Meine Urlaubs-Gruppen
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{groups.length} Gruppen beigetreten</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          <Plus className="w-4 h-4" /> Gruppe gründen
        </button>
      </div>

      {/* Gruppe erstellen */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Neue Gruppe gründen</h3>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Gruppenname *</label>
              <input type="text" placeholder="z.B. Türkei Fans 2026" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={60}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Beschreibung</label>
              <textarea placeholder="Worum geht es in dieser Gruppe?" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} maxLength={300}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Kategorie</label>
              <div className="grid grid-cols-2 gap-1">
                {CAT_OPTIONS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setForm((f) => ({ ...f, category: c.value }))}
                    className={`text-xs py-1.5 px-2 rounded-lg border-2 font-semibold transition-all ${
                      form.category === c.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Destination (optional)</label>
              <input type="text" placeholder="z.B. Antalya, Türkei" value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            {form.category === "date" && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Reisemonat</label>
                <div className="flex gap-2">
                  <select onChange={(e) => {
                    const mi = MONTHS.indexOf(e.target.value)+1;
                    const y = form.travelMonth.split("-")[0] || "2026";
                    setForm((f) => ({ ...f, travelMonth: `${y}-${String(mi).padStart(2,"0")}` }));
                  }} className="flex-1 border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    <option value="">Monat</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select onChange={(e) => {
                    const m = form.travelMonth.split("-")[1] || "01";
                    setForm((f) => ({ ...f, travelMonth: `${e.target.value}-${m}` }));
                  }} className="flex-1 border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Tags (kommagetrennt)</label>
              <input type="text" placeholder="strand, all-inclusive, familie" value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
              <strong>Fehler:</strong> {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={() => { setShowForm(false); setError(null); }}
              className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold"
            >Abbrechen</button>
            <button onClick={handleCreate} disabled={saving || !form.name.trim()}
              className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Gruppe erstellen
            </button>
          </div>
        </div>
      )}

      {groups.length === 0 && !showForm ? (
        <div className="text-center py-16 text-gray-400">
          <Users2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Noch keiner Gruppe beigetreten</p>
          <p className="text-sm mt-1">Entdecke Urlaubs-Gruppen oder gründe deine eigene</p>
          <Link href="/community/gruppen/" className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Gruppen entdecken
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groups.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Cover image or gradient header */}
              <div className="relative h-20 bg-linear-to-br from-teal-400 to-cyan-500">
                {g.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.coverImageUrl} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <p className="absolute bottom-2 left-3 font-bold text-white text-sm drop-shadow line-clamp-1">{g.name}</p>
                {g.creatorId !== user.uid && (
                  <button onClick={() => handleLeave(g.id)} className="absolute top-2 right-2 text-white/70 hover:text-red-300 transition-colors" title="Verlassen">
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <Link href={`/community/gruppen/${g.id}/`} className="text-xs font-semibold text-teal-700 hover:underline">
                  Zur Gruppe →
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{g.description}</p>
                <p className="text-[10px] text-gray-400 mt-1">{g.membersCount} Mitglieder · {g.postsCount} Beiträge</p>
                {/* Tags */}
                {g.tags && g.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {g.tags.map((tag) => (
                      <span key={tag} className="inline-block bg-teal-50 text-teal-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-teal-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
