"use client";

import { useState, useEffect } from "react";
import { getPendingTravelTips, approveTravelTip, rejectTravelTip } from "@/lib/supabase-db";
import { TravelTip } from "@/types";
import { CATEGORY_CONFIG } from "@/components/reisenden-karte/travelMapConfig";
import { CheckCircle2, XCircle, MapPin, Clock, ImageIcon, AlertCircle, Loader2, RefreshCw } from "lucide-react";

export default function AdminTravelTipsTab() {
  const [tips, setTips]         = useState<TravelTip[]>([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [showReject, setShowReject] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setTips(await getPendingTravelTips());
    } catch {
      setError("Fehler beim Laden der ausstehenden Tipps.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(tipId: string) {
    setActionId(tipId);
    try {
      await approveTravelTip(tipId);
      setTips((prev) => prev.filter((t) => t.id !== tipId));
    } catch {
      setError("Fehler beim Freigeben.");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(tipId: string) {
    const note = rejectNote[tipId]?.trim() || "Entspricht nicht unseren Richtlinien.";
    setActionId(tipId);
    try {
      await rejectTravelTip(tipId, note);
      setTips((prev) => prev.filter((t) => t.id !== tipId));
      setShowReject(null);
    } catch {
      setError("Fehler beim Ablehnen.");
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Reisenden-Karte · Moderation</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {tips.length === 0 ? "Keine ausstehenden Tipps" : `${tips.length} Tipp${tips.length !== 1 ? "s" : ""} warten auf Freigabe`}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Aktualisieren
        </button>
      </div>

      {/* Fehler */}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Leer */}
      {tips.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-teal-200" />
          <p className="font-semibold text-gray-500">Alles erledigt!</p>
          <p className="text-sm mt-1">Keine ausstehenden Tipps.</p>
        </div>
      )}

      {/* Tip-Karten */}
      <div className="space-y-4">
        {tips.map((tip) => {
          const cfg = CATEGORY_CONFIG[tip.category];
          const isActing = actionId === tip.id;

          return (
            <div key={tip.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {/* Bild */}
              {tip.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tip.imageUrl} alt={tip.title} className="w-full h-48 object-cover" />
              )}

              <div className="p-4 space-y-3">
                {/* Meta */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ background: cfg.color }}
                      >
                        {cfg.emoji} {cfg.label}
                      </span>
                      {!tip.imageUrl && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Kein Bild
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-base leading-snug">{tip.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {tip.locationName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{tip.displayName}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      {typeof tip.createdAt === "string"
                        ? new Date(tip.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Beschreibung */}
                <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>

                {/* Koordinaten */}
                <p className="text-[10px] text-gray-300 font-mono">
                  {tip.lat.toFixed(4)}°, {tip.lng.toFixed(4)}°
                </p>

                {/* Ablehnen: Textfeld */}
                {showReject === tip.id && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Ablehnungsgrund (für interne Dokumentation)</label>
                    <textarea
                      rows={2}
                      placeholder="z.B. Inhalt unangemessen, Spam, fehlende Angaben…"
                      value={rejectNote[tip.id] ?? ""}
                      onChange={(e) => setRejectNote((n) => ({ ...n, [tip.id]: e.target.value }))}
                      className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                    />
                  </div>
                )}

                {/* Aktionen */}
                <div className="flex gap-2 pt-1">
                  {showReject === tip.id ? (
                    <>
                      <button
                        onClick={() => setShowReject(null)}
                        className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={() => handleReject(tip.id)}
                        disabled={isActing}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                      >
                        {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Ablehnen bestätigen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowReject(tip.id)}
                        disabled={isActing}
                        className="flex-1 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Ablehnen
                      </button>
                      <button
                        onClick={() => handleApprove(tip.id)}
                        disabled={isActing}
                        className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Freigeben
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
