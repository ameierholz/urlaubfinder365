"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { SavedActivity } from "@/types";
import { getUserSavedActivities, unsaveActivity } from "@/lib/supabase-db";
import { Ticket, Trash2 } from "lucide-react";

interface Props { user: AppUser }

function formatSavedAt(val: unknown): string {
  if (!val) return "";
  let date: Date;
  if (typeof val === "object" && val !== null && "toDate" in val) {
    date = (val as { toDate: () => Date }).toDate();
  } else {
    date = new Date(val as string);
  }
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-xs leading-none ${s <= full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

export default function SavedActivitiesTab({ user }: Props) {
  const [activities, setActivities] = useState<SavedActivity[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setError]      = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getUserSavedActivities(user.uid)
      .then(setActivities)
      .catch(() => setError("Aktivitäten konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const removeActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try { await unsaveActivity(user.uid, id); } catch { /* ignore */ }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Meine Aktivitäten</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand-teal" /> Meine Aktivitäten
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm font-semibold">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors">
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────────────────────────
  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand-teal" /> Meine Aktivitäten
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Noch keine Aktivitäten gespeichert</h3>
          <p className="text-gray-400 text-sm mb-6">
            Klicke beim Stöbern auf das ❤ bei einer Aktivität, um sie hier zu speichern.
          </p>
          <a href="/aktivitaeten/" className="inline-block bg-[#6CC4BA] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#5ab0a6] transition-colors">
            Aktivitäten entdecken
          </a>
        </div>
      </div>
    );
  }

  // ── Grid ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Erklärung rechts */}
      <div className="order-first lg:order-last lg:w-64 shrink-0">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">So funktioniert&apos;s</h3>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2"><span className="shrink-0">🎯</span><span>Stöbere durch Ausflüge, Touren und Erlebnisse bei den <a href="/urlaubsziele/" className="text-blue-600 underline">Urlaubszielen</a></span></li>
            <li className="flex items-start gap-2"><span className="shrink-0">❤️</span><span>Klicke das <strong>Herz-Icon</strong> – die Aktivität wird sofort hier gespeichert</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0">⭐</span><span>Vergleiche Bewertungen und Preise aller gemerkten Aktivitäten</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0">🎫</span><span>Klicke <strong>„Zur Aktivität"</strong> für die Buchung beim Anbieter</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0">🗑️</span><span>Papierkorb-Icon klicken um eine Aktivität zu entfernen</span></li>
          </ul>
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-brand-teal" />
        Meine Aktivitäten
        <span className="text-sm font-normal text-gray-400">({activities.length})</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {activities.map((saved) => {
          const a       = saved.activity;
          // Handle both Tiqets products (large/medium) and experiences (same keys) APIs
          const imgObj  = a.images?.[0] as Record<string, string | undefined> | undefined;
          const img     = imgObj?.extra_large ?? imgObj?.large ?? imgObj?.medium ?? imgObj?.small ?? "";
          const rating  = a.ratings?.average ? Math.round(a.ratings.average * 10) / 10 : null;
          const cnt     = a.ratings?.total ?? 0;
          const price   = typeof a.price === "number" ? a.price.toFixed(2).replace(".", ",") : null;
          const link    = a.product_url ?? "#";
          const savedAt = formatSavedAt((saved as unknown as Record<string, unknown>).savedAt);

          return (
            <div key={saved.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">

              {/* Bild – feste Höhe */}
              <div className="relative h-40 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"}
                  alt={a.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";
                  }}
                />
                {/* Trash button */}
                <button
                  onClick={() => removeActivity(saved.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center shadow transition-colors group"
                  title="Entfernen"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
                {/* City badge */}
                {a.city_name && (
                  <div className="absolute top-2 left-2 bg-[#00838F]/85 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    📍 {a.city_name}
                  </div>
                )}
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2">
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 drop-shadow">
                    {a.title}
                  </h3>
                </div>
              </div>

              {/* Inhalt */}
              <div className="flex flex-col flex-1 p-3 gap-2">

                {/* Bewertung */}
                {rating && (
                  <div className="flex items-center gap-1.5">
                    <StarRow rating={rating} />
                    <span className="text-xs font-bold text-gray-700">{rating}</span>
                    {cnt > 0 && (
                      <span className="text-[10px] text-gray-400">({cnt.toLocaleString("de-DE")})</span>
                    )}
                  </div>
                )}

                {/* Gespeichert am */}
                {savedAt && (
                  <p className="text-[10px] text-gray-400">
                    Gespeichert am {savedAt}
                  </p>
                )}

                {/* Preis + Button */}
                <div className="mt-auto pt-2 border-t border-gray-100">
                  {price && (
                    <>
                      <p className="text-[10px] text-gray-400 mb-0.5">Gespeicherter Preis</p>
                      <p className="text-base font-extrabold text-gray-900 leading-none mb-2">
                        ab {price} €
                      </p>
                    </>
                  )}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-xs bg-[#6CC4BA] hover:bg-[#5ab0a6] text-white font-semibold py-2 rounded-xl transition-colors"
                  >
                    Zur Aktivität
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
