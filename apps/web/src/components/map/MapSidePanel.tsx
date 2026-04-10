"use client";

/**
 * MapSidePanel — polymorphes Side-Panel für die UrlaubsfinderMap.
 *
 * Discriminator: marker.kind. Jeder Marker-Typ hat sein eigenes Layout.
 */

import Link from "next/link";
import { X, MapPin, Star, ExternalLink, Heart, CheckCircle2, Calendar, Plane, CalendarDays, Sparkles, Utensils } from "lucide-react";
import type { MapMarker } from "@/lib/map/marker-types";
import { LAYER_CONFIG } from "@/lib/map/marker-types";
import { useWeather, weatherCodeToInfo } from "./useWeather";

interface Props {
  marker:  MapMarker;
  onClose: () => void;
  compact?: boolean;
}

// Side-Panel-Layout via injizierter CSS — unabhängig von Tailwind-Spacing-Scale.
// Mobile (< 640px): Bottom-Sheet · Desktop: rechts angedockt 400px
const PANEL_CSS = `
  .uf-side-panel {
    position: absolute;
    background: #ffffff;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    /* Mobile default */
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 70%;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
  .uf-side-panel--compact {
    max-height: 60%;
  }
  @media (min-width: 640px) {
    .uf-side-panel:not(.uf-side-panel--compact) {
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 400px;
      max-height: none;
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
      border-top-right-radius: 0;
      box-shadow: -8px 0 32px rgba(0,0,0,0.18);
    }
  }
`;

function PanelStyles() {
  if (typeof document !== "undefined" && !document.querySelector('style[data-uf-panel-css]')) {
    const style = document.createElement("style");
    style.setAttribute("data-uf-panel-css", "true");
    style.textContent = PANEL_CSS;
    document.head.appendChild(style);
  }
  return null;
}

export default function MapSidePanel({ marker, onClose, compact = false }: Props) {
  const cfg = LAYER_CONFIG[marker.kind];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`uf-side-panel${compact ? " uf-side-panel--compact" : ""}`}
    >
      <PanelStyles />
      {/* Header */}
      <div
        className="relative flex items-center justify-between px-5 py-4 border-b border-gray-100"
        style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd)` }}
      >
        <div className="flex items-center gap-2.5 text-white min-w-0">
          <span className="text-2xl shrink-0">{cfg.emoji}</span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
              {cfg.label}
            </p>
            <h3 className="text-base font-extrabold truncate">{marker.title}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
          aria-label="Schließen"
          className="shrink-0 ml-3 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body — polymorph je nach kind */}
      <div className="flex-1 overflow-y-auto">
        {marker.kind === "destination" && <DestinationBody m={marker} />}
        {marker.kind === "tip"         && <TipBody         m={marker} />}
        {marker.kind === "report"      && <ReportBody      m={marker} />}
        {marker.kind === "media"       && <MediaBody       m={marker} />}
        {marker.kind === "anbieter"    && <AnbieterBody    m={marker} />}
      </div>
    </div>
  );
}

// ─── Destination ─────────────────────────────────────────────────────────────

function DestinationBody({ m }: { m: Extract<MapMarker, { kind: "destination" }> }) {
  const { data: weather, loading: weatherLoading } = useWeather(m.lat, m.lng);

  return (
    <>
      {m.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.imageUrl} alt={m.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 space-y-4">
        {/* Ort + Land */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.country}{m.superRegion && m.superRegion !== m.title && m.superRegion !== m.country ? ` · ${m.superRegion}` : ""}</span>
        </div>

        {/* Live-Wetter (Open-Meteo) */}
        {weather ? (
          <div className="bg-linear-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mb-1">Aktuell vor Ort</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl shrink-0" title={weatherCodeToInfo(weather.weatherCode, weather.isDay).label}>
                {weatherCodeToInfo(weather.weatherCode, weather.isDay).emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-black text-gray-900 leading-tight">
                  {weather.temperature}°C
                </p>
                <p className="text-xs text-gray-500">
                  {weatherCodeToInfo(weather.weatherCode, weather.isDay).label} · {weather.tempMin}° – {weather.tempMax}°
                </p>
              </div>
            </div>
          </div>
        ) : weatherLoading ? (
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Wetter wird geladen…</span>
          </div>
        ) : null}

        {/* Aktueller Bestpreis */}
        {m.priceFrom && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Aktueller Bestpreis</p>
            <p className="font-black text-emerald-700 text-2xl leading-tight">ab {m.priceFrom} €</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">pro Person · Pauschalreise (7 Tage)</p>
          </div>
        )}

        {/* Reiseinfos – Grid mit Fakten */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {m.bestMonths && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Beste Reisezeit
              </p>
              <p className="font-semibold text-gray-800">{m.bestMonths}</p>
            </div>
          )}
          {m.flightTime && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Plane className="w-3 h-3" /> Flugzeit{m.iataCode ? ` (${m.iataCode})` : ""}
              </p>
              <p className="font-semibold text-gray-800">{m.flightTime}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Klima</p>
            <p className="font-semibold text-gray-800">{climateLabel(m.climateZone)}</p>
          </div>
          {m.summerTemp && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Sommer</p>
              <p className="font-semibold text-gray-800">{m.summerTemp}</p>
            </div>
          )}
        </div>

        {/* Highlights */}
        {m.highlights && (
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Highlights
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{m.highlights}</p>
          </div>
        )}

        {/* Küche */}
        {m.cuisine && (
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Auf den Tellern
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{m.cuisine}</p>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/urlaubsziele/${m.slug}/`}
          className="flex items-center justify-center gap-2 w-full bg-[#1db682] hover:bg-[#17a374] text-white font-bold px-4 py-3 rounded-xl transition-colors text-sm"
        >
          Reiseinfos & Angebote
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

function climateLabel(zone: string): string {
  const labels: Record<string, string> = {
    mediterranean: "Mittelmeer",
    tropical:      "Tropisch",
    tropical_dry:  "Trocken-tropisch",
    desert:        "Wüste",
    atlantic:      "Atlantik",
    continental:   "Kontinental",
    alpine:        "Alpin",
    arctic:        "Arktisch",
  };
  return labels[zone] ?? zone;
}

// ─── Tipp ────────────────────────────────────────────────────────────────────

function TipBody({ m }: { m: Extract<MapMarker, { kind: "tip" }> }) {
  return (
    <div>
      {m.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.imageUrl} alt={m.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold capitalize">{m.category}</span>
          {m.locationName && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {m.locationName}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{m.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>von {m.authorName}</span>
          {m.createdAt && <span>{new Date(m.createdAt).toLocaleDateString("de-DE")}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Reisebericht ────────────────────────────────────────────────────────────

function ReportBody({ m }: { m: Extract<MapMarker, { kind: "report" }> }) {
  return (
    <div>
      {m.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.coverImage} alt={m.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.destination}{m.country && m.country !== m.destination ? `, ${m.country}` : ""}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= m.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          {m.recommendation && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Empfehlung
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 flex items-center justify-between pt-2 border-t border-gray-100">
          <span>von {m.authorName}</span>
          {m.visitedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {m.visitedAt}
            </span>
          )}
        </div>

        <Link
          href={`/community/reiseberichte/${m.reportId}/`}
          className="flex items-center justify-center gap-2 w-full bg-[#6991d8] hover:bg-[#5680c4] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          Bericht lesen
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Media-Feed ──────────────────────────────────────────────────────────────

function MediaBody({ m }: { m: Extract<MapMarker, { kind: "media" }> }) {
  return (
    <div>
      {m.mediaType === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.mediaUrl} alt={m.caption} className="w-full max-h-64 object-cover" />
      ) : (
        <video src={m.mediaUrl} controls className="w-full max-h-64 object-cover bg-black" />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.destination}</span>
        </div>
        {m.caption && <p className="text-sm text-gray-700 leading-relaxed">{m.caption}</p>}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>von {m.authorName}</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            {m.likesCount}
          </span>
        </div>
        {m.destinationSlug && (
          <Link
            href={`/urlaubsziele/${m.destinationSlug}/`}
            className="flex items-center justify-center gap-2 w-full bg-[#F97316] hover:bg-[#ea6a0d] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            Zur Destination
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Anbieter ────────────────────────────────────────────────────────────────

function AnbieterBody({ m }: { m: Extract<MapMarker, { kind: "anbieter" }> }) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        {m.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.avatarUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-200" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl">🏨</div>
        )}
        <div>
          <h4 className="font-bold text-gray-900">{m.name}</h4>
          <p className="text-xs text-gray-500 capitalize">{m.kategorie}</p>
        </div>
        {m.verifiziert && (
          <CheckCircle2 className="w-5 h-5 text-purple-500 ml-auto" />
        )}
      </div>

      {m.bio && <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{m.bio}</p>}

      {(m.stadt || m.landName) && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{[m.stadt, m.landName].filter(Boolean).join(", ")}</span>
        </div>
      )}

      {/* Aktive Angebote + Bestpreis */}
      {m.priceFrom !== undefined && m.offerCount !== undefined && m.offerCount > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
          <p className="text-[11px] text-purple-600 font-semibold uppercase tracking-wider">
            {m.offerCount === 1 ? "1 Aktivität verfügbar" : `${m.offerCount} Aktivitäten verfügbar`}
          </p>
          <p className="font-black text-purple-700 text-lg leading-tight">
            ab {m.priceFrom.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
          </p>
        </div>
      )}

      <Link
        href={`/marktplatz/anbieter/${m.anbieterId}/`}
        className="flex items-center justify-center gap-2 w-full bg-[#A855F7] hover:bg-[#9333ea] text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
      >
        Anbieter-Profil
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
}
