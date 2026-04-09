"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Mail, Globe, Plus, Loader2, Copy, Check,
  ExternalLink, Tag, BookOpen, Handshake, ArrowLeftRight,
  Newspaper, MessageSquare, TrendingUp,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Purpose = "gastbeitrag" | "kooperation" | "linktausch";
type Status = "geplant" | "kontaktiert" | "antwort" | "erfolg" | "abgelehnt";

interface OutreachResult {
  subject: string;
  emailBody: string;
  topicSuggestions: string[];
}

interface OutreachEntry {
  id: string;
  target_url: string;
  target_name: string | null;
  contact_email: string | null;
  purpose: string;
  status: Status;
  notes: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Suggested targets (20 deutsche Reiseblogs / Medien)
// ---------------------------------------------------------------------------

const SUGGESTED_TARGETS = [
  { name: "Reisereporter", url: "https://www.reisereporter.de", type: "Magazin", focus: "Nachrichten, Deals, Reisethemen" },
  { name: "Travelbook", url: "https://www.travelbook.de", type: "Magazin", focus: "Inspirationen, Tipps, Deals" },
  { name: "Urlaubsguru", url: "https://www.urlaubsguru.de", type: "Deal-Portal", focus: "Last-Minute, Schnäppchen" },
  { name: "Fernweh-Hack", url: "https://www.fernweh-hack.de", type: "Blog", focus: "Günstig reisen, Hacks" },
  { name: "Reisemagazin.TV", url: "https://www.reisemagazin.tv", type: "Magazin", focus: "Videoreportagen, Reiseberichte" },
  { name: "Travelcircus Blog", url: "https://www.travelcircus.de/reiseblog", type: "Blog", focus: "Städtereisen, Hoteltipps" },
  { name: "Nomadbubbles", url: "https://www.nomadbubbles.de", type: "Blog", focus: "Slow Travel, Nachhaltigkeit" },
  { name: "Weltreisender.net", url: "https://www.weltreisender.net", type: "Blog", focus: "Fernreisen, Backpacking" },
  { name: "Reise-Liebe", url: "https://www.reise-liebe.de", type: "Blog", focus: "Familienurlaub, Erlebnisse" },
  { name: "GlobetrotterGirls", url: "https://www.globetrottergirls.com", type: "Blog", focus: "Solo-Reisen, Frauen" },
  { name: "Der Reisende", url: "https://www.der-reisende.de", type: "Blog", focus: "Abenteuer, Outdoor" },
  { name: "Reisehappen", url: "https://www.reisehappen.de", type: "Blog", focus: "Kurztrips, Wochenendreisen" },
  { name: "Traveldudes", url: "https://www.traveldudes.com", type: "Community", focus: "Reisetipps, Community" },
  { name: "Reisegezwitscher", url: "https://www.reisegezwitscher.de", type: "Blog", focus: "Familienreisen, Kinder" },
  { name: "1000 Abenteuer", url: "https://www.1000abenteuer.de", type: "Magazin", focus: "Outdoor, Extremsport, Fernreisen" },
  { name: "Strandtraveller", url: "https://www.strandtraveller.de", type: "Blog", focus: "Strand, Meer, Entspannung" },
  { name: "Clever-auf-Reisen", url: "https://www.clever-auf-reisen.de", type: "Blog", focus: "Spartipps, Budgetreisen" },
  { name: "Entdeckerreisen", url: "https://www.entdeckerreisen.de", type: "Blog", focus: "Naturreisen, Öko-Tourismus" },
  { name: "Urlaub.de Blog", url: "https://www.urlaub.de/blog", type: "Magazin", focus: "Allgemein, breites Publikum" },
  { name: "HolidayCheck Magazin", url: "https://www.holidaycheck.de/magazin", type: "Magazin", focus: "Hotelbewertungen, Tipps" },
];

const STATUS_STYLES: Record<Status, string> = {
  geplant: "bg-gray-700 text-gray-300",
  kontaktiert: "bg-blue-900/60 text-blue-300",
  antwort: "bg-yellow-900/60 text-yellow-300",
  erfolg: "bg-emerald-900/60 text-emerald-300",
  abgelehnt: "bg-red-900/60 text-red-300",
};

const PURPOSE_ICONS: Record<Purpose, React.ReactNode> = {
  gastbeitrag: <BookOpen className="w-3.5 h-3.5" />,
  kooperation: <Handshake className="w-3.5 h-3.5" />,
  linktausch: <ArrowLeftRight className="w-3.5 h-3.5" />,
};

// ---------------------------------------------------------------------------
// Supabase client (client-side, public anon key OK for admin page)
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OutreachPage() {
  // Form state
  const [targetUrl, setTargetUrl] = useState("");
  const [targetName, setTargetName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("gastbeitrag");
  const [notes, setNotes] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutreachResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Tracker state
  const [entries, setEntries] = useState<OutreachEntry[]>([]);
  const [trackerLoaded, setTrackerLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Suggested target selection
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // ---------------------------------------------------------------------------

  async function generateOutreach() {
    if (!targetUrl) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/admin/generate-outreach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetUrl, targetName, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function saveToTracker() {
    if (!targetUrl) return;
    setSaving(true);
    try {
      const sb = getSupabase();
      const { error: err } = await sb.from("backlink_outreach" as never).insert({
        target_url: targetUrl,
        target_name: targetName || null,
        contact_email: contactEmail || null,
        purpose,
        status: "geplant",
        notes: notes || null,
      });
      if (err) throw err;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (trackerLoaded) loadTracker();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function loadTracker() {
    const sb = getSupabase();
    const { data } = await sb
      .from("backlink_outreach" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setEntries(data ?? []);
    setTrackerLoaded(true);
  }

  async function updateStatus(id: string, status: Status) {
    const sb = getSupabase();
    await sb.from("backlink_outreach" as never).update({ status }).eq("id", id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  function copyEmail() {
    if (!result) return;
    const full = `Betreff: ${result.subject}\n\n${result.emailBody}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function selectSuggestedTarget(t: (typeof SUGGESTED_TARGETS)[0]) {
    setTargetUrl(t.url);
    setTargetName(t.name);
    setSelectedTarget(t.url);
  }

  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard/" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo/" className="hover:text-gray-300 transition-colors">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Backlink-Outreach</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <Mail className="w-6 h-6 text-[#00838F]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Backlink-Outreach</h1>
            <p className="text-sm text-gray-500">KI-personalisierte Anschreiben für Gastbeiträge & Kooperationen</p>
          </div>
        </div>
        <Link href="/admin/seo/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Zurück zu SEO
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: Form */}
        <div className="xl:col-span-1 space-y-6">

          {/* Form Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00838F]" />
              Outreach-Anschreiben generieren
            </h2>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Ziel-URL *</label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.reiseblog.de"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Name des Blogs / Mediums</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="z. B. Reisereporter"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Kontakt-E-Mail (optional)</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="redaktion@reiseblog.de"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Zweck</label>
              <div className="flex gap-2">
                {(["gastbeitrag", "kooperation", "linktausch"] as Purpose[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      purpose === p
                        ? "bg-[#00838F]/20 border-[#00838F] text-[#00838F]"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {PURPOSE_ICONS[p]}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Notizen</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Interne Notizen zum Kontakt..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={generateOutreach}
                disabled={!targetUrl || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006f7a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generiere...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Anschreiben generieren</>
                )}
              </button>

              <button
                onClick={saveToTracker}
                disabled={!targetUrl || saving}
                className="px-3 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                title="In Tracker speichern"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 rounded-lg p-2">{error}</p>
            )}
          </div>

          {/* Tracker button */}
          <button
            onClick={loadTracker}
            className="w-full bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-5 py-3 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#00838F]" />
            {trackerLoaded ? "Tracker aktualisieren" : "Outreach-Tracker laden"}
          </button>
        </div>

        {/* MIDDLE: Result */}
        <div className="xl:col-span-2 space-y-6">

          {/* Generated Email */}
          {result && (
            <div className="bg-gray-900 border border-[#00838F]/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00838F]" />
                  Generiertes Anschreiben
                </h2>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>

              {/* Subject */}
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Betreff</p>
                <p className="text-sm text-white font-medium">{result.subject}</p>
              </div>

              {/* Body */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">E-Mail-Text</p>
                <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.emailBody}
                </pre>
              </div>

              {/* Topic Suggestions */}
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5" />
                  Gastbeitrag-Themenvorschläge
                </p>
                <div className="space-y-2">
                  {result.topicSuggestions.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 bg-gray-800 rounded-lg p-3">
                      <span className="w-5 h-5 rounded-full bg-[#00838F]/20 text-[#00838F] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-200">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggested Targets */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00838F]" />
              20 empfohlene Outreach-Targets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_TARGETS.map((t) => (
                <button
                  key={t.url}
                  onClick={() => selectSuggestedTarget(t)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedTarget === t.url
                      ? "bg-[#00838F]/10 border-[#00838F]/50"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{t.name}</span>
                    <span className="text-[10px] bg-gray-700 text-gray-400 rounded px-1.5 py-0.5">
                      {t.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1">{t.focus}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#00838F]">
                    <ExternalLink className="w-3 h-3" />
                    {t.url.replace("https://www.", "")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tracker Table */}
          {trackerLoaded && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00838F]" />
                Outreach-Tracker ({entries.length})
              </h2>
              {entries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Noch keine Einträge. Füge Targets über das Formular hinzu.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-gray-500 font-medium pb-2 pr-4">Ziel</th>
                        <th className="text-left text-gray-500 font-medium pb-2 pr-4">Zweck</th>
                        <th className="text-left text-gray-500 font-medium pb-2 pr-4">Status</th>
                        <th className="text-left text-gray-500 font-medium pb-2">Datum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-800/50">
                          <td className="py-2 pr-4">
                            <p className="text-white font-medium">{entry.target_name ?? "–"}</p>
                            <a
                              href={entry.target_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00838F] hover:underline flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              {entry.target_url.replace("https://www.", "").slice(0, 30)}
                            </a>
                          </td>
                          <td className="py-2 pr-4">
                            <span className="flex items-center gap-1 text-gray-400">
                              {PURPOSE_ICONS[entry.purpose as Purpose]}
                              {entry.purpose}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            <select
                              value={entry.status}
                              onChange={(e) => updateStatus(entry.id, e.target.value as Status)}
                              className={`rounded px-2 py-0.5 text-[11px] font-medium border-0 cursor-pointer ${STATUS_STYLES[entry.status]}`}
                            >
                              {(["geplant", "kontaktiert", "antwort", "erfolg", "abgelehnt"] as Status[]).map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
