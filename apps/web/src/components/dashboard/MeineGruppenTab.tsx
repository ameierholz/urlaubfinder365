"use client";

import { useState, useEffect } from "react";
import type { AppUser } from "@/context/AuthContext";
import { getUserGroups, createGroup, leaveGroup } from "@/lib/supabase-db";
import { TravelGroup, GroupCategory } from "@/types";
import { Users2, Plus, LogOut, Loader2, X, Globe, Lock, ChevronDown } from "lucide-react";
import Link from "next/link";

const CAT_OPTIONS: { value: GroupCategory; label: string; emoji: string; desc: string }[] = [
  { value: "destination", label: "Destination",   emoji: "🗺️", desc: "Reiseziel-Gruppe" },
  { value: "style",       label: "Reisestil",     emoji: "🎒", desc: "Art des Reisens" },
  { value: "date",        label: "Reisezeitraum", emoji: "📅", desc: "Wann ihr reist" },
  { value: "interest",    label: "Interesse",     emoji: "💡", desc: "Gemeinsames Hobby" },
];

const TRAVEL_ICONS = [
  "✈️","🏖️","🏔️","🌴","🗺️","🏝️","🌊","⛷️","🚢","🏕️",
  "🎒","🌅","🏛️","🎭","🍽️","🌍","🧳","🚐","🏄","🤿",
];

const COVER_THEMES = [
  { id: "teal",   label: "Ozean",    from: "from-teal-400",   to: "to-cyan-500" },
  { id: "sunset", label: "Sunset",   from: "from-orange-400", to: "to-rose-500" },
  { id: "jungle", label: "Jungle",   from: "from-green-400",  to: "to-emerald-600" },
  { id: "night",  label: "Nacht",    from: "from-indigo-500", to: "to-purple-700" },
  { id: "sand",   label: "Sand",     from: "from-yellow-400", to: "to-amber-500" },
  { id: "sky",    label: "Himmel",   from: "from-sky-400",    to: "to-blue-600" },
];

const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget",  emoji: "🟢", desc: "Bis 500 €/P" },
  { value: "mittel", label: "Mittel",  emoji: "🟡", desc: "500–1.500 €/P" },
  { value: "luxus",  label: "Luxus",   emoji: "🔴", desc: "Ab 1.500 €/P" },
];

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const YEARS  = ["2025","2026","2027"];

const THEME_GRADIENTS: Record<string, string> = {
  teal:   "bg-linear-to-br from-teal-400 to-cyan-500",
  sunset: "bg-linear-to-br from-orange-400 to-rose-500",
  jungle: "bg-linear-to-br from-green-400 to-emerald-600",
  night:  "bg-linear-to-br from-indigo-500 to-purple-700",
  sand:   "bg-linear-to-br from-yellow-400 to-amber-500",
  sky:    "bg-linear-to-br from-sky-400 to-blue-600",
};

const EMPTY_FORM = {
  name: "", description: "", destination: "", country: "", tags: "",
  category: "destination" as GroupCategory, travelMonth: "",
  isPublic: true, coverImageUrl: "",
  iconEmoji: "✈️",
  coverTheme: "teal",
  budget: "",
  maxMembers: "",
};

interface Props { user: AppUser }

export default function MeineGruppenTab({ user }: Props) {
  const [groups, setGroups]         = useState<TravelGroup[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);

  useEffect(() => {
    getUserGroups(user.uid).then(setGroups).finally(() => setLoading(false));
  }, [user.uid]);

  function closeForm() { setShowForm(false); setError(null); setShowIconPicker(false); }

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Anonym";

    // Encode icon + theme into coverImageUrl field as a marker (no real upload yet)
    const metaUrl = `theme:${form.coverTheme}|icon:${form.iconEmoji}`;

    try {
      const id = await createGroup(user.uid, displayName, {
        name: form.name, description: form.description, category: form.category,
        destination: form.destination || undefined, country: form.country || undefined,
        travelMonth: form.travelMonth || undefined, isPublic: form.isPublic,
        coverImageUrl: form.coverImageUrl || metaUrl,
        tags: [
          ...form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          ...(form.budget ? [`budget:${form.budget}`] : []),
          ...(form.maxMembers ? [`max:${form.maxMembers}`] : []),
        ],
      });
      const newGroup: TravelGroup = {
        id, creatorId: user.uid, creatorName: displayName,
        name: form.name, description: form.description,
        category: form.category, destination: form.destination || undefined,
        country: form.country || undefined, travelMonth: form.travelMonth || undefined,
        isPublic: form.isPublic, membersCount: 1, memberIds: [user.uid],
        postsCount: 0, coverImageUrl: form.coverImageUrl || metaUrl,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setGroups((prev) => [newGroup, ...prev]);
      closeForm();
      setForm(EMPTY_FORM);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleLeave(id: string) {
    if (!confirm("Gruppe verlassen?")) return;
    await leaveGroup(user.uid, id);
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  function getGroupTheme(g: TravelGroup): string {
    if (g.coverImageUrl?.startsWith("theme:")) {
      const themeId = g.coverImageUrl.split("|")[0].replace("theme:", "");
      return THEME_GRADIENTS[themeId] ?? THEME_GRADIENTS.teal;
    }
    return THEME_GRADIENTS.teal;
  }

  function getGroupIcon(g: TravelGroup): string {
    if (g.coverImageUrl?.includes("|icon:")) {
      return g.coverImageUrl.split("|icon:")[1] ?? "✈️";
    }
    return "✈️";
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
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Gruppe gründen
          </button>
        </div>

        {/* ── Modal ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />

            <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* ── Live Preview Header ── */}
              <div className={`relative h-32 ${THEME_GRADIENTS[form.coverTheme]} rounded-t-2xl overflow-hidden`}>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                {/* Icon badge */}
                <div className="absolute top-4 left-5 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/30">
                  {form.iconEmoji}
                </div>
                <div className="absolute bottom-4 left-5 right-16">
                  <p className="text-white font-bold text-base drop-shadow line-clamp-1">
                    {form.name || "Gruppenname…"}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {form.isPublic ? "Öffentliche Gruppe" : "Private Gruppe"} · 1 Mitglied
                  </p>
                </div>
                <button onClick={closeForm} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <h3 className="font-bold text-gray-800 text-base">Neue Gruppe gründen</h3>

                {/* ── Icon + Name ── */}
                <div className="flex gap-3 items-start">
                  {/* Icon picker trigger */}
                  <div className="relative shrink-0">
                    <button type="button"
                      onClick={() => setShowIconPicker((v) => !v)}
                      className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center text-2xl border-2 border-dashed border-gray-300 transition-colors relative"
                      title="Icon wählen"
                    >
                      {form.iconEmoji}
                      <span className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">+</span>
                    </button>
                    {showIconPicker && (
                      <div className="absolute top-16 left-0 z-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 grid grid-cols-5 gap-1.5 w-52">
                        <p className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Gruppen-Icon</p>
                        {TRAVEL_ICONS.map((icon) => (
                          <button key={icon} type="button"
                            onClick={() => { setForm((f) => ({ ...f, iconEmoji: icon })); setShowIconPicker(false); }}
                            className={`text-xl p-1.5 rounded-xl hover:bg-gray-100 transition-colors ${form.iconEmoji === icon ? "bg-teal-50 ring-2 ring-teal-400" : ""}`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Gruppenname *</label>
                    <input type="text" placeholder="z.B. Türkei Strand-Gang 2026" value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={60}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">{form.name.length}/60</p>
                  </div>
                </div>

                {/* ── Cover Theme ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Titelbild-Farbschema</label>
                  <div className="grid grid-cols-6 gap-2">
                    {COVER_THEMES.map((t) => (
                      <button key={t.id} type="button"
                        onClick={() => setForm((f) => ({ ...f, coverTheme: t.id }))}
                        className={`h-10 rounded-xl bg-linear-to-br ${t.from} ${t.to} transition-all ${
                          form.coverTheme === t.id ? "ring-3 ring-offset-2 ring-teal-500 scale-105" : "opacity-70 hover:opacity-100"
                        }`}
                        title={t.label}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    Gewählt: <strong>{COVER_THEMES.find(t => t.id === form.coverTheme)?.label}</strong>
                    {" · "}
                    <span className="text-gray-400">Eigenes Bild (URL) optional:</span>
                  </p>
                  <input type="url" placeholder="https://… (optional, überschreibt Farbschema)" value={form.coverImageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
                    className="w-full mt-1.5 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* ── Beschreibung ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Beschreibung</label>
                  <textarea placeholder="Worum geht es? Wen sucht ihr? Was plant ihr?" value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} maxLength={500}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                  />
                  <p className="text-[10px] text-gray-400 text-right">{form.description.length}/500</p>
                </div>

                {/* ── Kategorie ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Kategorie</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CAT_OPTIONS.map((c) => (
                      <button key={c.value} type="button" onClick={() => setForm((f) => ({ ...f, category: c.value }))}
                        className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 font-semibold transition-all text-left ${
                          form.category === c.value
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{c.emoji}</span>
                        <span>
                          <span className="block text-xs font-bold">{c.label}</span>
                          <span className="block text-[10px] font-normal text-gray-400">{c.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Destination + Reisemonat ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Destination</label>
                    <input type="text" placeholder="z.B. Antalya, Türkei" value={form.destination}
                      onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Reisemonat</label>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <select onChange={(e) => {
                          const mi = MONTHS.indexOf(e.target.value) + 1;
                          const y = form.travelMonth.split("-")[0] || "2026";
                          setForm((f) => ({ ...f, travelMonth: `${y}-${String(mi).padStart(2, "0")}` }));
                        }} className="w-full appearance-none border border-gray-200 rounded-xl pl-2.5 pr-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                          <option value="">Monat</option>
                          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-2.5 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <select onChange={(e) => {
                          const m = form.travelMonth.split("-")[1] || "01";
                          setForm((f) => ({ ...f, travelMonth: `${e.target.value}-${m}` }));
                        }} className="w-full appearance-none border border-gray-200 rounded-xl pl-2.5 pr-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-2.5 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Budget ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Budget-Rahmen <span className="font-normal text-gray-400">(optional)</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map((b) => (
                      <button key={b.value} type="button"
                        onClick={() => setForm((f) => ({ ...f, budget: f.budget === b.value ? "" : b.value }))}
                        className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all ${
                          form.budget === b.value
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{b.emoji}</span>
                        <span className="text-xs font-bold mt-0.5">{b.label}</span>
                        <span className="text-[10px] text-gray-400">{b.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Tags + Max Members ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Tags</label>
                    <input type="text" placeholder="strand, all-inclusive…" value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Max. Mitglieder</label>
                    <div className="relative">
                      <select value={form.maxMembers}
                        onChange={(e) => setForm((f) => ({ ...f, maxMembers: e.target.value }))}
                        className="w-full appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                      >
                        <option value="">Unbegrenzt</option>
                        <option value="5">5 Personen</option>
                        <option value="10">10 Personen</option>
                        <option value="20">20 Personen</option>
                        <option value="50">50 Personen</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* ── Sichtbarkeit ── */}
                <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                      {form.isPublic ? <Globe className="w-4 h-4 text-teal-600" /> : <Lock className="w-4 h-4 text-gray-500" />}
                      {form.isPublic ? "Öffentliche Gruppe" : "Private Gruppe"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {form.isPublic
                        ? "Jeder kann die Gruppe finden und beitreten"
                        : "Nur eingeladene Personen können beitreten"}
                    </p>
                  </div>
                  <button type="button"
                    onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? "bg-teal-500" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
                    <strong>Fehler:</strong> {error}
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex gap-2 pb-2">
                  <button onClick={closeForm}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
                  >Abbrechen</button>
                  <button onClick={handleCreate} disabled={saving || !form.name.trim()}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : form.iconEmoji}
                    {saving ? "Erstellen…" : "Gruppe erstellen"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Gruppen-Liste ── */}
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
                <div className={`relative h-24 ${getGroupTheme(g)}`}>
                  {g.coverImageUrl && !g.coverImageUrl.startsWith("theme:") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.coverImageUrl} alt="" className="w-full h-full object-cover absolute inset-0" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  {/* Group icon */}
                  <div className="absolute top-3 left-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl border border-white/30">
                    {getGroupIcon(g)}
                  </div>
                  <div className="absolute bottom-2 left-14 right-8">
                    <p className="font-bold text-white text-sm drop-shadow line-clamp-1">{g.name}</p>
                    <p className="text-white/70 text-[10px]">
                      {g.isPublic ? "🌍 Öffentlich" : "🔒 Privat"} · {g.membersCount} Mitgl.
                    </p>
                  </div>
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
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{g.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{g.postsCount} Beiträge</p>
                  {g.tags && g.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {g.tags.filter(t => !t.startsWith("budget:") && !t.startsWith("max:")).map((tag) => (
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
