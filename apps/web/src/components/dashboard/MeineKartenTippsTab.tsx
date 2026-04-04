"use client";

import { useState, useEffect } from "react";
import { getMyTravelTips, deleteTravelTip } from "@/lib/supabase-db";
import { TravelTip } from "@/types";
import { CATEGORY_CONFIG } from "@/components/reisenden-karte/travelMapConfig";
import {
  MapPin, Clock, CheckCircle2, XCircle, Hourglass,
  Trash2, ImageIcon, AlertCircle, Loader2, Map,
} from "lucide-react";
import type { AppUser } from "@/context/AuthContext";

interface Props { user: AppUser }

const STATUS_CONFIG = {
  approved: { label: "Freigegeben",    icon: CheckCircle2, color: "text-teal-600",  bg: "bg-teal-50",  border: "border-teal-200" },
  pending:  { label: "Wird geprüft",   icon: Hourglass,    color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  rejected: { label: "Abgelehnt",      icon: XCircle,      color: "text-red-600",   bg: "bg-red-50",   border: "border-red-200" },
};

export default function MeineKartenTippsTab({ user }: Props) {
  const [tips, setTips]       = useState<TravelTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getMyTravelTips(user.uid)
      .then(setTips)
      .catch(() => setError("Fehler beim Laden deiner Tipps."))
      .finally(() => setLoading(false));
  }, [user.uid]);

  async function handleDelete(tipId: string) {
    if (!confirm("Tipp wirklich löschen?")) return;
    setDeleting(tipId);
    try {
      await deleteTravelTip(user.uid, tipId);
      setTips((prev) => prev.filter((t) => t.id !== tipId));
    } catch {
      setError("Fehler beim Löschen.");
    } finally {
      setDeleting(null);
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">Meine Karten-Tipps</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {tips.length === 0
            ? "Du hast noch keine Tipps eingereicht."
            : `${tips.length} Tipp${tips.length !== 1 ? "s" : ""} eingereicht`}
        </p>
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
          <Map className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-gray-500">Noch keine Tipps</p>
          <p className="text-sm mt-1">
            Besuche die{" "}
            <a href="/extras/reisenden-karte/" className="text-teal-600 hover:underline font-medium">
              Reisenden-Karte
            </a>{" "}
            und teile deinen ersten Geheimtipp!
          </p>
        </div>
      )}

      {/* Status-Legende */}
      {tips.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(
            ([key, { label, icon: Icon, color, bg, border }]) => {
              const count = tips.filter((t) => (t.status ?? "pending") === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${bg} ${border} ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}: {count}
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Tip-Liste */}
      <div className="space-y-3">
        {tips.map((tip) => {
          const cat = CATEGORY_CONFIG[tip.category];
          const statusKey = (tip.status ?? "pending") as keyof typeof STATUS_CONFIG;
          const status = STATUS_CONFIG[statusKey];
          const StatusIcon = status.icon;
          const isDeleting = deleting === tip.id;

          return (
            <div
              key={tip.id}
              className={`border rounded-2xl overflow-hidden bg-white shadow-sm ${
                statusKey === "rejected" ? "border-red-200" : "border-gray-200"
              }`}
            >
              <div className="flex gap-0">
                {/* Bild oder Placeholder */}
                {tip.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-24 h-auto object-cover shrink-0 sm:w-32"
                  />
                ) : (
                  <div className="w-16 shrink-0 flex items-center justify-center bg-gray-50 border-r border-gray-100">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Kategorie + Status */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: cat.color }}
                        >
                          {cat.emoji} {cat.label}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.border} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-sm leading-snug truncate">{tip.title}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" /> {tip.locationName}
                      </div>
                    </div>

                    {/* Löschen */}
                    <button
                      onClick={() => handleDelete(tip.id)}
                      disabled={isDeleting}
                      className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Tipp löschen"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Beschreibung */}
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{tip.description}</p>

                  {/* Ablehnungsgrund */}
                  {statusKey === "rejected" && tip.adminNote && (
                    <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <p className="text-[11px] font-bold text-red-600 mb-0.5">Ablehnungsgrund:</p>
                      <p className="text-[11px] text-red-700">{tip.adminNote}</p>
                    </div>
                  )}

                  {/* Datum */}
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-300">
                    <Clock className="w-3 h-3" />
                    {typeof tip.createdAt === "string"
                      ? new Date(tip.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
