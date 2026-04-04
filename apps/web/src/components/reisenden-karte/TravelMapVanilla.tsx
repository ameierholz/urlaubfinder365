"use client";

// Vanilla-Leaflet-Implementierung ohne react-leaflet MapContainer.
// Grund: react-leaflet's MapContainer nutzt useCallback mit staler Closure
// (context === null immer), sodass React 19 Strict Mode "reappearLayoutEffects"
// doppelt initialisiert → "Map container is already initialized".
// Mit useLayoutEffect + eigenem map.remove() im Cleanup ist der Lifecycle
// vollständig unter unserer Kontrolle.

import { useEffect, useLayoutEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { TravelTip, TravelTipCategory } from "@/types";
import { CATEGORY_CONFIG } from "./travelMapConfig";

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
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<LeafletMap | null>(null);
  const markersRef     = useRef<Marker[]>([]);
  const pendingRef     = useRef<Marker | null>(null);

  // Stabile Refs für Callbacks (vermeidet Stale-Closures in Event-Handlern)
  const onPickRef      = useRef(onLocationPicked);
  const isPickingRef   = useRef(isPickingLocation);
  const userIdRef      = useRef(currentUserId);
  const onDeleteRef    = useRef(onDeleteTip);
  onPickRef.current    = onLocationPicked;
  isPickingRef.current = isPickingLocation;
  userIdRef.current    = currentUserId;
  onDeleteRef.current  = onDeleteTip;

  // ── Karte initialisieren (useLayoutEffect für synchronen Cleanup) ─────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    const map = L.map(containerRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e) => {
      if (isPickingRef.current) {
        onPickRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;

    // Synchroner Cleanup: map.remove() löscht _leaflet_id vom Container,
    // sodass React 19 Strict Mode sauber remounten kann.
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      pendingRef.current = null;
    };
  }, []);

  // ── Cursor synchron halten ────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(".leaflet-container");
    if (el) el.style.cursor = isPickingLocation ? "crosshair" : "grab";
  }, [isPickingLocation]);

  // ── Marker synchronisieren ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    // Alte Marker entfernen
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      activeCategory === "all"
        ? tips
        : tips.filter((t) => t.category === activeCategory);

    filtered.forEach((tip) => {
      const cfg = CATEGORY_CONFIG[tip.category];

      const icon = L.divIcon({
        html: `<div style="background:${cfg.color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;line-height:1;">${cfg.emoji}</span></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });

      const marker = L.marker([tip.lat, tip.lng], { icon }).addTo(map);

      // Popup als DOM-Node (Event-Handler ohne Stale-Closure)
      const popupNode = document.createElement("div");
      popupNode.style.fontFamily = "sans-serif";
      popupNode.style.padding = "2px";
      popupNode.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="background:${cfg.color};color:white;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;">${cfg.emoji} ${cfg.label}</span>
        </div>
        <div style="font-weight:700;font-size:14px;color:#111;margin-bottom:4px;line-height:1.3;">${tip.title}</div>
        <div style="font-size:12px;color:#555;margin-bottom:6px;line-height:1.4;">📍 ${tip.locationName}</div>
        <div style="font-size:13px;color:#333;line-height:1.5;margin-bottom:8px;">${tip.description}</div>
        <div style="font-size:11px;color:#888;border-top:1px solid #f0f0f0;padding-top:6px;display:flex;justify-content:space-between;align-items:center;">
          <span>von ${tip.displayName}</span>
          ${userIdRef.current === tip.userId && onDeleteRef.current ? `<button data-tipid="${tip.id}" style="color:#EF4444;background:none;border:none;cursor:pointer;font-size:11px;font-weight:600;">Löschen</button>` : ""}
        </div>`;

      const btn = popupNode.querySelector<HTMLButtonElement>("[data-tipid]");
      if (btn) {
        btn.addEventListener("click", () => onDeleteRef.current?.(tip.id));
      }

      marker.bindPopup(popupNode, { minWidth: 220, maxWidth: 300 });
      markersRef.current.push(marker);
    });
  }, [tips, activeCategory]);

  // ── Pending-Marker (noch nicht gespeichert) ───────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pendingRef.current?.remove();
    pendingRef.current = null;

    if (pendingLat !== null && pendingLng !== null) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet") as typeof import("leaflet");
      const icon = L.divIcon({
        html: `<div style="background:#8B5CF6;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 12px rgba(139,92,246,0.6);animation:pulse 1s infinite;"></div><style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}</style>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      pendingRef.current = L.marker([pendingLat, pendingLng], { icon }).addTo(map);
    }
  }, [pendingLat, pendingLng]);

  return (
    <>
      <LeafletCss />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
