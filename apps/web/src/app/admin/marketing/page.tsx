"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Calendar, Instagram, Facebook, Video, Globe, ChevronLeft, ChevronRight, Sparkles, Plus, Check, Clock, Pencil, Copy } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────────── */

interface Post {
  id: string;
  post_date: string;
  platform: "instagram" | "facebook" | "tiktok" | "google";
  post_type: string;
  title: string;
  caption: string | null;
  hashtags: string | null;
  link: string | null;
  canva_template: string | null;
  canva_hint: string | null;
  status: "geplant" | "erstellt" | "gepostet";
  post_time: string | null;
}

const PLATFORM_CFG = {
  instagram: { icon: Instagram, label: "Instagram", color: "bg-pink-500", border: "border-pink-400", text: "text-pink-400" },
  facebook:  { icon: Facebook,  label: "Facebook",  color: "bg-blue-600", border: "border-blue-400", text: "text-blue-400" },
  tiktok:    { icon: Video,     label: "TikTok",    color: "bg-gray-900", border: "border-gray-400", text: "text-gray-300" },
  google:    { icon: Globe,     label: "Google",     color: "bg-emerald-600", border: "border-emerald-400", text: "text-emerald-400" },
} as const;

const STATUS_CFG = {
  geplant:  { label: "Geplant",  cls: "bg-gray-800 text-gray-400 border-gray-700" },
  erstellt: { label: "Erstellt", cls: "bg-amber-900/30 text-amber-400 border-amber-700" },
  gepostet: { label: "Gepostet", cls: "bg-emerald-900/30 text-emerald-400 border-emerald-700" },
} as const;

const DAYS_DE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS_DE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function getWeekDates(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

/* ── Component ────────────────────────────────────────────────────────────── */

export default function MarketingCalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const now = new Date();
  const baseDate = new Date(now);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);
  const weekStart = fmtDate(weekDates[0]);
  const weekEnd = fmtDate(weekDates[6]);

  useEffect(() => {
    setLoading(true);
    const sb = createSupabaseBrowser();
    sb.from("marketing_posts" as never)
      .select("*")
      .gte("post_date", weekStart)
      .lte("post_date", weekEnd)
      .order("post_date")
      .order("post_time")
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPosts((data ?? []) as any[] as Post[]);
        setLoading(false);
      });
  }, [weekStart, weekEnd]);

  async function updateStatus(id: string, status: Post["status"]) {
    const sb = createSupabaseBrowser();
    await sb.from("marketing_posts" as never).update({ status, updated_at: new Date().toISOString() } as never).eq("id" as never, id);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    if (selectedPost?.id === id) setSelectedPost((prev) => prev ? { ...prev, status } : prev);
  }

  async function handleGenerate() {
    if (!selectedPost) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-marketing-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPost.platform,
          topic: selectedPost.title,
          postType: selectedPost.post_type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const sb = createSupabaseBrowser();
      const update = {
        caption: data.caption ?? selectedPost.caption,
        hashtags: data.hashtags ?? selectedPost.hashtags,
        canva_template: data.canva_template ?? selectedPost.canva_template,
        canva_hint: data.canva_hint ?? selectedPost.canva_hint,
        updated_at: new Date().toISOString(),
      };
      await sb.from("marketing_posts" as never).update(update as never).eq("id" as never, selectedPost.id);
      const updated = { ...selectedPost, ...update };
      setSelectedPost(updated);
      setPosts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    } catch (err) {
      alert("Fehler: " + String(err));
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy(field: string, text: string) {
    copyToClipboard(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  // Stats
  const total = posts.length;
  const geplant = posts.filter((p) => p.status === "geplant").length;
  const erstellt = posts.filter((p) => p.status === "erstellt").length;
  const gepostet = posts.filter((p) => p.status === "gepostet").length;

  return (
    <div className="flex gap-6 min-h-[calc(100vh-120px)]">

      {/* ── LEFT: Kalender ──────────────────────────────────────────── */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Marketing-Kalender</h1>
              <p className="text-sm text-gray-500">Posts planen, erstellen und tracken</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-white">{total}</p>
            <p className="text-[10px] text-gray-500">Diese Woche</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-gray-400">{geplant}</p>
            <p className="text-[10px] text-gray-500">Geplant</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-amber-400">{erstellt}</p>
            <p className="text-[10px] text-gray-500">Erstellt</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-xl font-black text-emerald-400">{gepostet}</p>
            <p className="text-[10px] text-gray-500">Gepostet</p>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {weekDates[0].getDate()}. {MONTHS_DE[weekDates[0].getMonth()]} – {weekDates[6].getDate()}. {MONTHS_DE[weekDates[6].getMonth()]} {weekDates[6].getFullYear()}
            </p>
            <button onClick={() => setWeekOffset(0)} className="text-[10px] text-teal-400 hover:underline">Aktuelle Woche</button>
          </div>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-800">
            {weekDates.map((d, i) => {
              const isToday = fmtDate(d) === fmtDate(now);
              return (
                <div key={i} className={`px-2 py-3 text-center border-r border-gray-800 last:border-r-0 ${isToday ? "bg-teal-900/20" : ""}`}>
                  <p className="text-[10px] text-gray-500 uppercase">{DAYS_DE[d.getDay()]}</p>
                  <p className={`text-sm font-bold ${isToday ? "text-teal-400" : "text-white"}`}>{d.getDate()}</p>
                </div>
              );
            })}
          </div>

          {/* Posts per Day */}
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDates.map((d, i) => {
              const dateStr = fmtDate(d);
              const dayPosts = posts.filter((p) => p.post_date === dateStr);
              const isToday = dateStr === fmtDate(now);
              return (
                <div key={i} className={`border-r border-gray-800 last:border-r-0 p-1.5 space-y-1.5 ${isToday ? "bg-teal-900/10" : ""}`}>
                  {dayPosts.map((p) => {
                    const cfg = PLATFORM_CFG[p.platform];
                    const Icon = cfg.icon;
                    const st = STATUS_CFG[p.status];
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPost(p)}
                        className={`w-full text-left rounded-lg p-2 border transition-all hover:scale-[1.02] ${
                          selectedPost?.id === p.id ? `${cfg.border} border-2 bg-gray-800` : "border-gray-700/50 bg-gray-800/50 hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className={`w-4 h-4 rounded-full ${cfg.color} flex items-center justify-center`}>
                            <Icon className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-[9px] text-gray-500">{p.post_time}</span>
                        </div>
                        <p className="text-[10px] text-gray-300 font-medium leading-tight line-clamp-2">{p.title}</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0 rounded text-[8px] font-bold border ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {dayPosts.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-gray-700 text-[10px]">—</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Post-Detail ──────────────────────────────────────── */}
      <div className="w-96 shrink-0">
        {selectedPost ? (() => {
          const p = selectedPost;
          const cfg = PLATFORM_CFG[p.platform];
          const Icon = cfg.icon;
          const st = STATUS_CFG[p.status];

          return (
            <div className="sticky top-4 space-y-4">
              {/* Header */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{p.title}</p>
                    <p className="text-xs text-gray-500">{cfg.label} · {p.post_type} · {p.post_time ?? ""}</p>
                  </div>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2 mb-4">
                  {(["geplant", "erstellt", "gepostet"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(p.id, s)}
                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        p.status === s ? STATUS_CFG[s].cls : "border-gray-700 text-gray-600 hover:border-gray-500"
                      }`}
                    >
                      {STATUS_CFG[s].label}
                    </button>
                  ))}
                </div>

                {/* KI Generate */}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  {generating ? "Generiert..." : "Mit KI neu generieren"}
                </button>
              </div>

              {/* Caption */}
              {p.caption && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Caption</p>
                    <button
                      onClick={() => handleCopy("caption", p.caption!)}
                      className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300"
                    >
                      {copied === "caption" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "caption" ? "Kopiert!" : "Kopieren"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{p.caption}</p>
                </div>
              )}

              {/* Hashtags */}
              {p.hashtags && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Hashtags</p>
                    <button
                      onClick={() => handleCopy("hashtags", p.hashtags!)}
                      className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300"
                    >
                      {copied === "hashtags" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "hashtags" ? "Kopiert!" : "Kopieren"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.hashtags.split(/\s+/).filter(Boolean).map((h, i) => (
                      <span key={i} className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Canva Anleitung */}
              {(p.canva_template || p.canva_hint) && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Canva-Anleitung</p>
                  {p.canva_template && (
                    <p className="text-sm text-white font-semibold mb-1">Template: {p.canva_template}</p>
                  )}
                  {p.canva_hint && (
                    <p className="text-xs text-gray-400 leading-relaxed">{p.canva_hint}</p>
                  )}
                </div>
              )}

              {/* Link */}
              {p.link && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Link</p>
                    <button
                      onClick={() => handleCopy("link", `https://www.urlaubfinder365.de${p.link}`)}
                      className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300"
                    >
                      {copied === "link" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "link" ? "Kopiert!" : "Kopieren"}
                    </button>
                  </div>
                  <p className="text-xs text-teal-400 font-mono break-all">urlaubfinder365.de{p.link}</p>
                </div>
              )}
            </div>
          );
        })() : (
          <div className="sticky top-4 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Klicke auf einen Post im Kalender um Details zu sehen</p>
          </div>
        )}
      </div>
    </div>
  );
}
