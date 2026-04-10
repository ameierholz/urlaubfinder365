"use client";

/**
 * WeltkarteWithTipEditor — Client-Wrapper für die Weltkarte.
 *
 * Kombiniert die read-only UrlaubsfinderMap mit dem Tipp-Setz-Workflow:
 *   - "+ Tipp eintragen"-Button für angemeldete User
 *   - Picking-Modus: User klickt auf Karte → lat/lng wird gepickt
 *   - TipFormModal zum Ausfüllen
 *   - Submit → travel_tips Tabelle (status=pending)
 *
 * Ersetzt den alten TravelMapClient.
 */

import { useState } from "react";
import { Plus, MapPin, X, AlertCircle } from "lucide-react";
import UrlaubsfinderMap from "./UrlaubsfinderMap";
import TipFormModal from "./TipFormModal";
import { useAuth } from "@/context/AuthContext";
import type { MapMarker } from "@/lib/map/marker-types";

interface Props {
  markers: MapMarker[];
  /** Optional: Karten-Center (default: Welt) */
  center?: [number, number];
  zoom?:   number;
  height?: string;
}

export default function WeltkarteWithTipEditor({
  markers,
  center = [30, 10],
  zoom   = 3,
  height = "calc(100vh - 64px)",
}: Props) {
  const { user } = useAuth();
  const [picking, setPicking]   = useState(false);
  const [pendingLat, setLat]    = useState<number | null>(null);
  const [pendingLng, setLng]    = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  function startPicking() {
    if (!user) {
      setAuthError("Bitte melde dich an, um einen Tipp einzutragen.");
      setTimeout(() => setAuthError(null), 4000);
      return;
    }
    setPicking(true);
    setShowModal(false);
    setLat(null);
    setLng(null);
  }

  function handleLocationPicked(lat: number, lng: number) {
    setLat(lat);
    setLng(lng);
    setPicking(false);
    setShowModal(true);
  }

  function cancelModal() {
    setShowModal(false);
    setLat(null);
    setLng(null);
  }

  function repickLocation() {
    setShowModal(false);
    setPicking(true);
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <UrlaubsfinderMap
        markers={markers}
        center={center}
        zoom={zoom}
        height={height}
        filterUI="sidebar"
        showSearch
        editable={picking}
        onPickLocation={handleLocationPicked}
      />

      {/* Floating "Tipp eintragen"-Button — oben rechts */}
      {!picking && !showModal && (
        <button
          onClick={startPicking}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1db682] hover:bg-[#17a374] text-white font-bold px-4 py-2.5 rounded-full shadow-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tipp eintragen</span>
          <span className="sm:hidden">+ Tipp</span>
        </button>
      )}

      {/* Picking-Banner — wenn User auf Karte klicken soll */}
      {picking && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#6991d8] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl">
          <MapPin className="w-4 h-4 animate-bounce" />
          Klicke auf die Karte, um den Ort zu markieren
          <button
            onClick={() => setPicking(false)}
            className="ml-2 text-white/80 hover:text-white"
            aria-label="Abbrechen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Auth-Fehler-Toast */}
      {authError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl">
          <AlertCircle className="w-4 h-4" />
          {authError}
        </div>
      )}

      {/* Modal */}
      {showModal && user && pendingLat !== null && pendingLng !== null && (
        <TipFormModal
          user={user}
          pendingLat={pendingLat}
          pendingLng={pendingLng}
          onRepick={repickLocation}
          onClose={cancelModal}
        />
      )}
    </div>
  );
}
