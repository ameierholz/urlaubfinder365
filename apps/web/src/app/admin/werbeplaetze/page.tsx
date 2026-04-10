"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Plus,
  Save,
  Trash2,
  Code as CodeIcon,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  X,
} from "lucide-react";

interface AdSlot {
  id:           string;
  slot_key:     string;
  name:         string;
  description:  string | null;
  page_type:    string | null;
  position:     string | null;
  code:         string | null;
  enabled:      boolean;
  sort_order:   number;
  updated_at:   string;
}

const POSITION_LABELS: Record<string, string> = {
  content: "📄 Content",
  sidebar: "📋 Sidebar",
  header:  "🔝 Header",
  footer:  "🔻 Footer",
};

const PAGE_TYPE_LABELS: Record<string, string> = {
  destination: "Reiseziel-Seiten",
  magazin:     "Magazin",
  global:      "Global (alle Seiten)",
};

function errorToText(err: unknown): string {
  if (!err) return "Unbekannter Fehler";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error === "string")   return e.error;
    try { return JSON.stringify(err); } catch { return "Unbekannt"; }
  }
  return String(err);
}

export default function WerbeplaetzePage() {
  const [slots, setSlots]       = useState<AdSlot[]>([]);
  const [loading, setLoading]   = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId]     = useState<string | null>(null);
  const [drafts, setDrafts]     = useState<Record<string, AdSlot>>({});
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  // Neuer-Slot-Form
  const [showNew, setShowNew] = useState(false);
  const [newSlot, setNewSlot] = useState({
    slot_key:    "",
    name:        "",
    description: "",
    page_type:   "destination",
    position:    "content",
  });

  async function loadSlots() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ad-slots");
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data?.error));
      setSlots(data.slots ?? []);
    } catch (err) {
      setError(errorToText(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSlots(); }, []);

  function getDraft(slot: AdSlot): AdSlot {
    return drafts[slot.id] ?? slot;
  }

  function updateDraft(slot: AdSlot, patch: Partial<AdSlot>) {
    setDrafts((prev) => ({
      ...prev,
      [slot.id]: { ...getDraft(slot), ...patch },
    }));
  }

  function clearDraft(id: string) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function saveSlot(slot: AdSlot) {
    setSavingId(slot.id);
    setError(null);
    setSuccess(null);
    const draft = getDraft(slot);
    try {
      const res = await fetch("/api/admin/ad-slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:          slot.id,
          slot_key:    draft.slot_key,
          name:        draft.name,
          description: draft.description,
          page_type:   draft.page_type,
          position:    draft.position,
          code:        draft.code,
          enabled:     draft.enabled,
          sort_order:  draft.sort_order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data?.error));
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? data.slot : s)));
      clearDraft(slot.id);
      setSuccess(`Slot "${draft.name}" gespeichert.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(errorToText(err));
    } finally {
      setSavingId(null);
    }
  }

  async function toggleEnabled(slot: AdSlot) {
    const newState = !slot.enabled;
    setSavingId(slot.id);
    try {
      const res = await fetch("/api/admin/ad-slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slot.id, enabled: newState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data?.error));
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, enabled: newState } : s)));
    } catch (err) {
      setError(errorToText(err));
    } finally {
      setSavingId(null);
    }
  }

  async function deleteSlot(slot: AdSlot) {
    if (!confirm(`Slot "${slot.name}" wirklich löschen?`)) return;
    setSavingId(slot.id);
    try {
      const res = await fetch(`/api/admin/ad-slots?id=${encodeURIComponent(slot.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data?.error));
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
      clearDraft(slot.id);
    } catch (err) {
      setError(errorToText(err));
    } finally {
      setSavingId(null);
    }
  }

  async function createSlot() {
    if (!newSlot.slot_key.trim() || !newSlot.name.trim()) {
      setError("slot_key und Name sind erforderlich");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/admin/ad-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_key:    newSlot.slot_key.trim(),
          name:        newSlot.name.trim(),
          description: newSlot.description.trim() || null,
          page_type:   newSlot.page_type,
          position:    newSlot.position,
          enabled:     true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(errorToText(data?.error));
      setSlots((prev) => [...prev, data.slot].sort((a, b) => a.sort_order - b.sort_order));
      setNewSlot({ slot_key: "", name: "", description: "", page_type: "destination", position: "content" });
      setShowNew(false);
      setSuccess("Neuer Slot angelegt.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(errorToText(err));
    }
  }

  // Gruppieren nach page_type
  const grouped = slots.reduce<Record<string, AdSlot[]>>((acc, slot) => {
    const key = slot.page_type ?? "global";
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Megaphone className="w-7 h-7 text-orange-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Werbeplätze</h1>
            <p className="text-sm text-gray-400">
              Eigenen Code (Adup, GoogleAds, AdSense, eigene Banner …) pro Slot hinterlegen
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Neuer Slot
        </button>
      </div>

      {/* Toast: Error / Success */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Neuer Slot Form */}
      {showNew && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white">Neuen Slot anlegen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Slot Key</label>
              <input
                type="text"
                value={newSlot.slot_key}
                onChange={(e) => setNewSlot({ ...newSlot, slot_key: e.target.value })}
                placeholder="z.B. magazin_sidebar_top"
                className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <p className="text-[10px] text-gray-500 mt-1">Eindeutig, snake_case, wird im Code als Identifier verwendet</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Name</label>
              <input
                type="text"
                value={newSlot.name}
                onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
                placeholder="z.B. Magazin – Sidebar oben"
                className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Seitentyp</label>
              <select
                value={newSlot.page_type}
                onChange={(e) => setNewSlot({ ...newSlot, page_type: e.target.value })}
                className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="destination">Reiseziel-Seiten</option>
                <option value="magazin">Magazin</option>
                <option value="global">Global (alle Seiten)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Position</label>
              <select
                value={newSlot.position}
                onChange={(e) => setNewSlot({ ...newSlot, position: e.target.value })}
                className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="content">Content</option>
                <option value="sidebar">Sidebar</option>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Beschreibung (optional)</label>
            <input
              type="text"
              value={newSlot.description}
              onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
              placeholder="Wo wird dieser Slot angezeigt?"
              className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={createSlot}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 py-2 rounded-lg text-sm"
            >
              Anlegen
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg text-sm"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Slot-Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center">
          <Megaphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Noch keine Werbeplätze angelegt.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([pageType, list]) => (
          <div key={pageType}>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              {PAGE_TYPE_LABELS[pageType] ?? pageType}
            </h2>
            <div className="space-y-2">
              {list.map((slot) => {
                const draft = getDraft(slot);
                const isOpen = openId === slot.id;
                const isDirty = drafts[slot.id] !== undefined;
                const hasCode = !!(draft.code && draft.code.trim());
                return (
                  <div
                    key={slot.id}
                    className={`bg-gray-800 border rounded-xl overflow-hidden ${
                      isDirty ? "border-orange-500/60" : "border-gray-700"
                    }`}
                  >
                    {/* Row Header */}
                    <button
                      onClick={() => setOpenId(isOpen ? null : slot.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-800/70"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-white text-sm">{slot.name}</span>
                          {isDirty && <span className="text-[10px] text-orange-400 font-semibold">● geändert</span>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <code className="font-mono bg-gray-900 px-1.5 py-0.5 rounded">{slot.slot_key}</code>
                          {slot.position && (
                            <span className="text-gray-400">{POSITION_LABELS[slot.position] ?? slot.position}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {hasCode ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                            Code aktiv
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
                            leer
                          </span>
                        )}
                        <span
                          onClick={(e) => { e.stopPropagation(); toggleEnabled(slot); }}
                          className={`px-2 py-1 rounded-md cursor-pointer ${
                            slot.enabled ? "bg-emerald-900/50 text-emerald-300" : "bg-gray-900 text-gray-500"
                          }`}
                        >
                          {slot.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </span>
                      </div>
                    </button>

                    {/* Row Body — Code-Editor */}
                    {isOpen && (
                      <div className="border-t border-gray-700 p-4 space-y-4">
                        {slot.description && (
                          <p className="text-xs text-gray-400">{slot.description}</p>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                            <CodeIcon className="w-3 h-3" /> HTML / JS Code
                          </label>
                          <textarea
                            value={draft.code ?? ""}
                            onChange={(e) => updateDraft(slot, { code: e.target.value })}
                            rows={10}
                            placeholder={`<!-- HTML/JS Snippet hier einfügen, z.B. -->
<script type="text/javascript">
  window.uAd_init = function() {
    window.uAd.embed("adup1", {
      placementKey: "...",
      responsive: true
    });
  };
  ...
</script>
<div id="adup1"></div>`}
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono resize-y min-h-[200px] focus:outline-none focus:border-orange-500"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">
                            Wird per <code>dangerouslySetInnerHTML</code> eingespielt. Beliebiger HTML/JS Code.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => saveSlot(slot)}
                            disabled={savingId === slot.id || !isDirty}
                            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-lg text-xs"
                          >
                            {savingId === slot.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Speichern
                          </button>
                          {isDirty && (
                            <button
                              onClick={() => clearDraft(slot.id)}
                              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold px-3 py-2 rounded-lg text-xs"
                            >
                              Verwerfen
                            </button>
                          )}
                          <div className="flex-1" />
                          <button
                            onClick={() => deleteSlot(slot)}
                            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 font-semibold px-3 py-2 rounded-lg text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Löschen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
