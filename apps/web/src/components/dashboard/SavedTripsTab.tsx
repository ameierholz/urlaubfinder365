"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { SavedTrip } from "@/types";
import { getUserSavedTrips, unsaveTrip } from "@/lib/supabase-db";
import { Hotel, MapPin, Clock, Plane, Trash2 } from "lucide-react";

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

function formatPrice(num: number): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(num);
}

const EXPLANATION = (
  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
    <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">So funktioniert&apos;s</h3>
    <ul className="space-y-2.5 text-xs text-gray-600">
      <li className="flex items-start gap-2"><span className="shrink-0">🔍</span><span>Stöbere bei den <a href="/urlaubsziele/" className="text-blue-600 underline">Urlaubszielen</a> oder auf der <a href="/" className="text-blue-600 underline">Startseite</a> nach Angeboten</span></li>
      <li className="flex items-start gap-2"><span className="shrink-0">❤️</span><span>Klicke auf das <strong>Herz-Icon</strong> bei einem Hotel – es landet sofort hier in deiner Liste</span></li>
      <li className="flex items-start gap-2"><span className="shrink-0">📋</span><span>Vergleiche Hotel, Preis, Reisedaten und Bewertung aller gemerkten Hotels</span></li>
      <li className="flex items-start gap-2"><span className="shrink-0">✈️</span><span>Klicke <strong>„Aktuelle Preise prüfen"</strong> um zum aktuellen Angebot zu gelangen</span></li>
      <li className="flex items-start gap-2"><span className="shrink-0">🗑️</span><span>Papierkorb-Icon klicken, um ein Hotel zu entfernen</span></li>
      <li className="flex items-start gap-2"><span className="shrink-0">🗓️</span><span>Füge mehrere Hotels zu deiner <strong>Urlaubsplanung</strong> hinzu, um sie zu vergleichen</span></li>
    </ul>
  </div>
);

export default function SavedTripsTab({ user }: Props) {
  const [trips, setTrips]     = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getUserSavedTrips(user.uid)
      .then((data) => setTrips(data))
      .catch((e: unknown) => { console.error("SavedTrips error:", e); setError("Hotels konnten nicht geladen werden. " + JSON.stringify(e)); })
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleRemove = async (trip: SavedTrip) => {
    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
    try {
      await unsaveTrip(user.uid, trip.id, trip.offer.product_code);
    } catch {
      setTrips((prev) => [...prev, trip]);
    }
  };

  const handleBook = (trip: SavedTrip) => {
    const p = new URLSearchParams({
      giataId:       trip.offer.giata_id ?? "",
      from:          "14",
      to:            "42",
      duration:      "7-7",
      adults:        "2",
      category:      "3",
      minRecommrate: "40",
    });
    const url = `https://b2b.specials.de/index/jump/119/2780/993243/?${p}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModal = (window as any).ibeOpenBooking;
    if (typeof openModal === "function") openModal(url, trip.offer.hotel_name);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Meine Hotels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Hotel className="w-5 h-5 text-rose-500" /> Meine Hotels
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors">
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────────────────────────
  if (trips.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Hotel className="w-5 h-5 text-rose-500" /> Meine Hotels
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <Hotel className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-bold text-gray-700 mb-2">Noch keine Hotels gespeichert</h3>
            <p className="text-gray-400 text-sm mb-6">
              Klicke beim Durchstöbern auf das ❤ bei einem Angebot, um es hier zu speichern.
            </p>
            <a href="/urlaubsziele/" className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors">
              Urlaubsziele entdecken
            </a>
          </div>
        </div>
        <div className="lg:w-64 shrink-0">{EXPLANATION}</div>
      </div>
    );
  }

  // ── Grid ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
            <Hotel className="w-5 h-5 text-rose-500" />
            Meine Hotels
            <span className="text-sm font-normal text-gray-400">({trips.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {trips.map((trip) => {
            const img = trip.offer.images?.medium || trip.offer.images?.large
              || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";
            const savedAt = formatSavedAt((trip as unknown as Record<string, unknown>).savedAt);

            return (
              <div key={trip.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">

                {/* Bild – feste Höhe */}
                <div className="relative h-40 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={trip.offer.hotel_name}
                    className="w-full h-full object-cover"
                  />
                  {/* Trash Button */}
                  <button
                    onClick={() => handleRemove(trip)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center shadow transition-colors group"
                    title="Entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                  {/* Hotelname Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 drop-shadow">
                      {trip.offer.hotel_name}
                    </h3>
                  </div>
                </div>

                {/* Inhalt */}
                <div className="flex flex-col flex-1 p-3 gap-2">

                  {/* Ort + Land */}
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-gray-400" />
                    <span>
                      {trip.offer.destination_name}
                      {trip.offer.country_name ? (<><br /><span className="text-gray-400">{trip.offer.country_name}</span></>) : ""}
                    </span>
                  </p>

                  {/* Badges */}
                  <div className="flex gap-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full px-2 py-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {trip.offer.offer_duration} Nächte
                    </span>
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-[10px] font-medium rounded-full px-2 py-0.5 border border-sky-100">
                      <Plane className="w-2.5 h-2.5" />
                      Flug inkl.
                    </span>
                  </div>

                  {/* Hinzugefügt am */}
                  {savedAt && (
                    <p className="text-[10px] text-gray-400">
                      Gespeichert am {savedAt}
                    </p>
                  )}

                  {/* Preis + Button */}
                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 mb-0.5">Gespeicherter Preis</p>
                    <p className="text-base font-extrabold text-gray-900 leading-none mb-2">
                      ab {formatPrice(trip.offer.offer_price_total)},- €
                    </p>
                    <button
                      onClick={() => handleBook(trip)}
                      className="w-full text-xs bg-[#00838F] hover:bg-[#006E7A] text-white font-semibold py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Aktuelle Preise prüfen
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Erklärung rechts */}
      <div className="lg:w-64 shrink-0">{EXPLANATION}</div>
    </div>
  );
}
