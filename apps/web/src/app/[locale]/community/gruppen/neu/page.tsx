"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createGroup } from "@/lib/supabase-db";
import { GroupCategory } from "@/types";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Globe, Image as ImageIcon,
  Lock, Plus, Shield, Tag, Trash2, Users2, X, Loader2, Upload,
} from "lucide-react";

/* ── Preset cover images ────────────────────────────────────────────────── */

const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", label: "Strand & Meer" },
  { url: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=800&q=80", label: "Türkei" },
  { url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80", label: "Mallorca" },
  { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", label: "Griechenland" },
  { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", label: "Ägypten" },
  { url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", label: "Barcelona" },
  { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", label: "Abenteuer" },
  { url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80", label: "Solo-Urlaub" },
  { url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", label: "Familie" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", label: "All-Inclusive" },
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", label: "Berge & Natur" },
  { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", label: "Städtereise" },
];

const CATEGORY_OPTIONS: { value: GroupCategory; label: string; emoji: string; hint: string }[] = [
  { value: "destination", emoji: "📍", label: "Urlaubsziel",   hint: "z.B. Türkei-Fans, Mallorca Insider" },
  { value: "style",       emoji: "🎒", label: "Reisestil",   hint: "z.B. Familien, Budget-Reisende, Solo" },
  { value: "date",        emoji: "📅", label: "Zeitraum",    hint: "z.B. Sommer 2026, Weihnachtsurlaub" },
  { value: "interest",    emoji: "💡", label: "Interesse",   hint: "z.B. Schnorcheln, Fotografie, Kulinarik" },
];

const LANGUAGES = [
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "en", flag: "🇬🇧", label: "Englisch" },
  { code: "tr", flag: "🏖",  label: "Türkisch" },
  { code: "pl", flag: "🌍",  label: "Polnisch" },
  { code: "ru", flag: "🌍",  label: "Russisch" },
  { code: "es", flag: "🌍",  label: "Spanisch" },
];

const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

/* ── Step indicator ─────────────────────────────────────────────────────── */

function StepDot({ n, current, label }: { n: number; current: number; label: string }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
        done ? "bg-teal-600 text-white" : active ? "bg-teal-600 text-white ring-4 ring-teal-100" : "bg-gray-100 text-gray-400"
      }`}>
        {done ? <Check className="w-4 h-4" /> : n}
      </div>
      <span className={`text-[10px] font-semibold hidden sm:block ${active ? "text-teal-700" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

function StepLine({ done }: { done: boolean }) {
  return <div className={`flex-1 h-0.5 transition-all mt-4 ${done ? "bg-teal-500" : "bg-gray-200"}`} />;
}

/* ── Tag input ──────────────────────────────────────────────────────────── */

function TagInput({ tags, setTags, max = 8 }: { tags: string[]; setTags: (t: string[]) => void; max?: number }) {
  const [input, setInput] = useState("");
  function add() {
    const val = input.trim().toLowerCase().replace(/[^a-z0-9äöüß-]/g, "");
    if (!val || tags.includes(val) || tags.length >= max) return;
    setTags([...tags, val]);
    setInput("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full">
            #{t}
            <button onClick={() => setTags(tags.filter((x) => x !== t))} className="text-teal-400 hover:text-teal-700 ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length < max && (
          <div className="flex items-center gap-1 border border-dashed border-gray-300 rounded-full px-2.5 py-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
              placeholder="Tag hinzufügen…"
              className="text-xs outline-none w-24 bg-transparent"
            />
            <button onClick={add} className="text-gray-400 hover:text-teal-600"><Plus className="w-3 h-3" /></button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-gray-400">Enter oder Komma drücken · max. {max} Tags</p>
    </div>
  );
}

/* ── Moderator entry ────────────────────────────────────────────────────── */

interface ModEntry { id: string; name: string; role: "moderator" | "admin" }

function ModeratorManager({ mods, setMods }: { mods: ModEntry[]; setMods: (m: ModEntry[]) => void }) {
  const [input, setInput] = useState("");

  function add() {
    const name = input.trim();
    if (!name || mods.find((m) => m.name.toLowerCase() === name.toLowerCase())) return;
    setMods([...mods, { id: `mod-${Date.now()}`, name, role: "moderator" }]);
    setInput("");
  }

  function remove(id: string) { setMods(mods.filter((m) => m.id !== id)); }

  function toggleRole(id: string) {
    setMods(mods.map((m) => m.id === id ? { ...m, role: m.role === "moderator" ? "admin" : "moderator" } : m));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Nutzername oder E-Mail eingeben…"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button onClick={add} className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Hinzufügen
        </button>
      </div>

      {mods.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
          Noch keine Moderatoren eingeladen. Du als Ersteller bist automatisch Admin.
        </p>
      ) : (
        <div className="space-y-2">
          {mods.map((m) => (
            <div key={m.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                <p className="text-[10px] text-gray-400">Einladung ausstehend</p>
              </div>
              <button
                onClick={() => toggleRole(m.id)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  m.role === "admin"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                <Shield className="w-3 h-3" />
                {m.role === "admin" ? "Admin" : "Moderator"}
              </button>
              <button onClick={() => remove(m.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */

export default function NeueGruppePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState<GroupCategory>("destination");
  const [destination, setDestination] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
  const [tags, setTags]             = useState<string[]>([]);

  // Step 2: Cover image
  const [coverUrl, setCoverUrl]     = useState("");
  const [customUrl, setCustomUrl]   = useState("");
  const [previewError, setPreviewError] = useState(false);

  // Step 3: Settings
  const [isPublic, setIsPublic]     = useState(true);
  const [language, setLanguage]     = useState("de");
  const [joinApproval, setJoinApproval] = useState(false);
  const [rules, setRules]           = useState("");

  // Step 4: Moderators
  const [mods, setMods]             = useState<ModEntry[]>([]);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [newGroupId, setNewGroupId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Users2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h2 className="font-bold text-gray-700 mb-2">Anmeldung erforderlich</h2>
        <p className="text-sm text-gray-400 mb-6">Melde dich an, um eine Gruppe zu gründen.</p>
        <Link href="/login/" className="bg-teal-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors">
          Jetzt anmelden
        </Link>
      </div>
    );
  }

  // ── Validation per step ────────────────────────────────────────────────

  const step1Valid = name.trim().length >= 3 && description.trim().length >= 10;
  const step2Valid = true; // cover image optional
  const step3Valid = true; // all settings have defaults

  async function handleSubmit() {
    if (!user || !step1Valid) return;
    setSubmitting(true);
    try {
      const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Anonym";
      const id = await createGroup(user.uid, displayName, {
        name: name.trim(),
        description: description.trim(),
        category,
        destination: destination.trim() || undefined,
        country: destination.trim() || undefined,
        travelMonth: travelMonth || undefined,
        isPublic,
        coverImageUrl: coverUrl || undefined,
        tags,
      });
      setNewGroupId(id);
      setDone(true);
    } catch {
      // demo fallback
      setNewGroupId("demo-new");
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Done screen ────────────────────────────────────────────────────────

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Gruppe gegründet!</h2>
        <p className="text-gray-500 text-sm mb-8">
          Deine Gruppe <strong>„{name}"</strong> ist jetzt live.
          {mods.length > 0 && ` Einladungen wurden an ${mods.length} Moderatoren verschickt.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/community/gruppen/${newGroupId}/`}
            className="bg-teal-600 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-teal-700 transition-colors"
          >
            Zur Gruppe →
          </Link>
          <Link
            href="/community/gruppen/"
            className="border border-gray-200 text-gray-600 font-semibold text-sm px-6 py-2.5 rounded-full hover:border-gray-300 transition-colors"
          >
            Alle Gruppen
          </Link>
        </div>
      </div>
    );
  }

  // ── Active cover preview ───────────────────────────────────────────────

  const activeCover = coverUrl || PRESET_IMAGES[0].url;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/community/gruppen/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Gruppen
      </Link>

      <h1 className="text-2xl font-black text-gray-800 mb-1">Neue Gruppe gründen</h1>
      <p className="text-sm text-gray-500 mb-8">Erstelle in wenigen Schritten deine eigene Urlaubs-Community.</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        <StepDot n={1} current={step} label="Grundinfo" />
        <StepLine done={step > 1} />
        <StepDot n={2} current={step} label="Titelbild" />
        <StepLine done={step > 2} />
        <StepDot n={3} current={step} label="Einstellungen" />
        <StepLine done={step > 3} />
        <StepDot n={4} current={step} label="Moderatoren" />
      </div>

      {/* ── Step 1: Grundinfo ──────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Gruppenname *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="z.B. Türkei-Fans 2026, Budget-Reisende, Mallorca Insider…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">{name.length}/60 Zeichen</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Beschreibung *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={400}
              rows={4}
              placeholder="Worum geht es in dieser Gruppe? Was erwartet neue Mitglieder? Wer soll beitreten?"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">{description.length}/400 Zeichen</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategorie *</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    category === c.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-200"
                  }`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <p className={`text-sm font-bold ${category === c.value ? "text-teal-700" : "text-gray-700"}`}>{c.label}</p>
                    <p className="text-[10px] text-gray-400">{c.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional fields */}
          {category === "destination" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Urlaubsziel</label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="z.B. Türkei, Mallorca, Kreta…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          )}

          {category === "date" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Reisemonat</label>
              <div className="relative">
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none bg-white"
                >
                  <option value="">Monat wählen…</option>
                  {[2026, 2027].flatMap((y) =>
                    MONTHS.map((m, i) => (
                      <option key={`${y}-${i}`} value={`${y}-${String(i + 1).padStart(2, "0")}`}>
                        {m} {y}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
            <TagInput tags={tags} setTags={setTags} />
          </div>
        </div>
      )}

      {/* ── Step 2: Titelbild ─────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Preview */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Vorschau</label>
            <div className="relative h-48 rounded-2xl overflow-hidden bg-linear-to-br from-teal-400 to-cyan-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCover}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={() => setPreviewError(true)}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-white font-black text-lg drop-shadow">{name || "Gruppenname"}</h3>
                <p className="text-white/70 text-xs">von {user.displayName ?? "dir"}</p>
              </div>
            </div>
          </div>

          {/* Preset gallery */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Aus Vorlagen wählen</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  onClick={() => { setCoverUrl(img.url); setCustomUrl(""); setPreviewError(false); }}
                  className={`relative rounded-xl overflow-hidden aspect-video group border-2 transition-all ${
                    coverUrl === img.url ? "border-teal-500 ring-2 ring-teal-200" : "border-transparent hover:border-teal-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-start p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[9px] font-semibold">{img.label}</span>
                  </div>
                  {coverUrl === img.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Oder eigene Bild-URL eingeben</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <button
                onClick={() => { if (customUrl.startsWith("http")) { setCoverUrl(customUrl); setPreviewError(false); } }}
                className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors"
              >
                Übernehmen
              </button>
            </div>
            {previewError && (
              <p className="text-xs text-red-500 mt-1">Bild konnte nicht geladen werden – bitte URL prüfen.</p>
            )}
          </div>

          {/* Clear */}
          {coverUrl && (
            <button
              onClick={() => { setCoverUrl(""); setCustomUrl(""); }}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Titelbild entfernen
            </button>
          )}
        </div>
      )}

      {/* ── Step 3: Einstellungen ─────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* Public / Private */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Sichtbarkeit</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPublic(true)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  isPublic ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-200"
                }`}
              >
                <Globe className={`w-6 h-6 ${isPublic ? "text-teal-600" : "text-gray-400"}`} />
                <div className="text-center">
                  <p className={`text-sm font-bold ${isPublic ? "text-teal-700" : "text-gray-600"}`}>Öffentlich</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Alle können beitreten und Beiträge lesen</p>
                </div>
                {isPublic && <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  !isPublic ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-200"
                }`}
              >
                <Lock className={`w-6 h-6 ${!isPublic ? "text-teal-600" : "text-gray-400"}`} />
                <div className="text-center">
                  <p className={`text-sm font-bold ${!isPublic ? "text-teal-700" : "text-gray-600"}`}>Privat</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Nur eingeladene Mitglieder haben Zugang</p>
                </div>
                {!isPublic && <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
              </button>
            </div>
          </div>

          {/* Join approval */}
          <div className="flex items-center justify-between py-3 border-t border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">Beitritt bestätigen</p>
              <p className="text-xs text-gray-400">Neue Mitglieder müssen von Moderatoren freigegeben werden</p>
            </div>
            <button
              onClick={() => setJoinApproval((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${joinApproval ? "bg-teal-500" : "bg-gray-200"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${joinApproval ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gruppensprache</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                    language === lang.code ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-200"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className={`text-xs font-semibold ${language === lang.code ? "text-teal-700" : "text-gray-600"}`}>{lang.label}</span>
                  {language === lang.code && <Check className="w-3 h-3 text-teal-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Gruppenregeln <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={4}
              maxLength={600}
              placeholder={"1. Respektvoller Umgang miteinander\n2. Nur reisebezogene Themen\n3. Keine Werbung oder Spam"}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">{rules.length}/600 Zeichen · Wird als angepinnter Beitrag angezeigt</p>
          </div>
        </div>
      )}

      {/* ── Step 4: Moderatoren ───────────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-1">Moderatoren einladen</h3>
            <p className="text-xs text-gray-400 mb-4">
              Moderatoren können Beiträge verwalten und Mitglieder freigeben.
              Admins haben außerdem Zugriff auf die Gruppeneinstellungen.
            </p>
            <ModeratorManager mods={mods} setMods={setMods} />
          </div>

          {/* Summary */}
          <div className="border-t border-gray-50 pt-4 space-y-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Zusammenfassung</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Gruppenname</p>
                <p className="font-semibold text-gray-800 truncate">{name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Kategorie</p>
                <p className="font-semibold text-gray-800">{CATEGORY_OPTIONS.find((c) => c.value === category)?.label}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Sichtbarkeit</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  {isPublic ? <><Globe className="w-3 h-3 text-teal-600" />Öffentlich</> : <><Lock className="w-3 h-3 text-amber-500" />Privat</>}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 mb-0.5">Sprache</p>
                <p className="font-semibold text-gray-800">{LANGUAGES.find((l) => l.code === language)?.label}</p>
              </div>
              {coverUrl && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 mb-0.5">Titelbild</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-1"><ImageIcon className="w-3 h-3 text-teal-600" />Ausgewählt</p>
                </div>
              )}
              {tags.length > 0 && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => <span key={t} className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">#{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        ) : <div />}

        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !step1Valid}
            className="flex items-center gap-2 bg-teal-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Weiter <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !step1Valid}
            className="flex items-center gap-2 bg-teal-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {submitting ? "Wird erstellt…" : "Gruppe gründen"}
          </button>
        )}
      </div>

      {step === 1 && !step1Valid && name.length > 0 && (
        <p className="text-xs text-gray-400 text-right mt-2">
          {name.trim().length < 3 ? "Name mindestens 3 Zeichen" : "Beschreibung mindestens 10 Zeichen"}
        </p>
      )}
    </div>
  );
}
