"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { TravelTip, TravelTipCategory } from "@/types";
import { CATEGORY_CONFIG } from "./travelMapConfig";

// ─── Leaflet Marker Icons (via CDN, kein Build-Problem) ──────────────────────

function getMarkerIcon(category: TravelTipCategory) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet");
  const cfg = CATEGORY_CONFIG[category];
  return L.divIcon({
    html: `<div style="
      background:${cfg.color};
      width:32px;height:32px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1;">${cfg.emoji}</span></div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

function getPendingIcon() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet");
  return L.divIcon({
    html: `<div style="
      background:#8B5CF6;
      width:36px;height:36px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 2px 12px rgba(139,92,246,0.6);
      animation: pulse 1s infinite;
    "></div>
    <style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}</style>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// ─── Map-Klick-Handler ────────────────────────────────────────────────────────

function MapClickHandler({ onPick, enabled }: { onPick: (lat: number, lng: number) => void; enabled: boolean }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Leaflet CSS laden ────────────────────────────────────────────────────────

function LeafletCss() {
  useEffect(() => {
    if (document.querySelector('link[data-leaflet-css]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.setAttribute("data-leaflet-css", "true");
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  tips: TravelTip[];
  activeCategory: TravelTipCategory | "all";
  isPickingLocation: boolean;
  pendingLat: number | null;
  pendingLng: number | null;
  onLocationPicked: (lat: number, lng: number) => void;
  onMapReady?: (map: LeafletMap) => void;
  currentUserId?: string;
  onDeleteTip?: (id: string) => void;
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function TravelMapLeaflet({
  tips,
  activeCategory,
  isPickingLocation,
  pendingLat,
  pendingLng,
  onLocationPicked,
  currentUserId,
  onDeleteTip,
}: Props) {
  const filtered = activeCategory === "all" ? tips : tips.filter((t) => t.category === activeCategory);

  return (
    <>
      <LeafletCss />
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={2}
        style={{ width: "100%", height: "100%", cursor: isPickingLocation ? "crosshair" : "grab" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        <MapClickHandler onPick={onLocationPicked} enabled={isPickingLocation} />

        {/* Pending-Marker (noch nicht gespeichert) */}
        {pendingLat !== null && pendingLng !== null && (
          <Marker position={[pendingLat, pendingLng]} icon={getPendingIcon()} />
        )}

        {/* Bestehende Tipps */}
        {filtered.map((tip) => (
          <Marker
            key={tip.id}
            position={[tip.lat, tip.lng]}
            icon={getMarkerIcon(tip.category)}
          >
            <Popup minWidth={220} maxWidth={300}>
              <div style={{ fontFamily: "sans-serif", padding: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <span style={{
                    background: CATEGORY_CONFIG[tip.category].color,
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "99px",
                  }}>
                    {CATEGORY_CONFIG[tip.category].emoji} {CATEGORY_CONFIG[tip.category].label}
                  </span>
                </div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#111", marginBottom: "4px", lineHeight: 1.3 }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: "12px", color: "#555", marginBottom: "6px", lineHeight: 1.4 }}>
                  📍 {tip.locationName}
                </div>
                <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.5, marginBottom: "8px" }}>
                  {tip.description}
                </div>
                <div style={{ fontSize: "11px", color: "#888", borderTop: "1px solid #f0f0f0", paddingTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>von {tip.displayName}</span>
                  {currentUserId && currentUserId === tip.userId && onDeleteTip && (
                    <button
                      onClick={() => onDeleteTip(tip.id)}
                      style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                    >
                      Löschen
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
