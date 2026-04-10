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

import { useMemo, useState } from "react";
import { Plus, MapPin, X, AlertCircle } from "lucide-react";
import UrlaubsfinderMap from "./UrlaubsfinderMap";
import TipFormModal from "./TipFormModal";
import { useHotelsInBounds, type MapBounds } from "./useHotelsInBounds";
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

  // Bbox & Layer-State für Hotels-Lazy-Loading
  const [bounds, setBounds]                     = useState<MapBounds | null>(null);
  const [hotelsLayerEnabled, setHotelsEnabled]  = useState(true);

  // Hotels lazy aus der Specials.de API laden, sobald sich Bbox ändert
  const { hotels, loading: hotelsLoading } = useHotelsInBounds({
    enabled:      hotelsLayerEnabled,
    bounds,
    destinations: markers,
  });

  // Merge: alle vorhandenen Marker + dynamisch geladene Hotels
  const allMarkers = useMemo<MapMarker[]>(() => {
    return [...markers, ...hotels];
  }, [markers, hotels]);

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
        markers={allMarkers}
        center={center}
        zoom={zoom}
        height={height}
        filterUI="sidebar"
        showSearch
        editable={picking}
        onPickLocation={handleLocationPicked}
        onBoundsChange={setBounds}
      />

      {/* Hotels-Loading-Toast */}
      {hotelsLoading && hotelsLayerEnabled && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          Hotels in der Region werden geladen…
        </div>
      )}

      {/* Hotel-Layer Toggle (oben rechts, neben Tipp-Button) */}
      {!picking && !showModal && (
        <button
          onClick={() => setHotelsEnabled((v) => !v)}
          className={`absolute top-4 right-44 z-20 hidden md:flex items-center gap-2 font-bold px-4 py-2.5 rounded-full shadow-lg transition-colors text-sm ${
            hotelsLayerEnabled
              ? "bg-[#0EA5E9] hover:bg-[#0284c7] text-white"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          🏨 Hotels {hotelsLayerEnabled ? "an" : "aus"}
        </button>
      )}

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
