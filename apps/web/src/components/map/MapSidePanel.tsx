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
import NearbyActivities from "./NearbyActivities";

interface Props {
  marker:  MapMarker;
  onClose: () => void;
}

// Side-Panel-Layout via injizierter CSS — unabhängig von Tailwind-Spacing-Scale.
// Mobile (< 640px): Bottom-Sheet · Desktop: rechts angedockt
// Auch der compact-Mode (eingebettet auf Destination-Seite) ist auf Desktop
// rechts angedockt, damit der Inhalt klarer als Side-Panel erkennbar ist.
const PANEL_CSS = `
  .uf-side-panel {
    position: absolute;
    background: #ffffff;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    /* Mobile default: Bottom-Sheet */
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 75%;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
  @media (min-width: 640px) {
    /* Desktop: immer rechts angedockt */
    .uf-side-panel {
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 380px;
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

export default function MapSidePanel({ marker, onClose }: Props) {
  const cfg = LAYER_CONFIG[marker.kind];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="uf-side-panel"
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
        {marker.kind === "hotel"       && <HotelBody       m={marker} />}
        {marker.kind === "tip"         && <TipBody         m={marker} />}
        {marker.kind === "report"      && <ReportBody      m={marker} />}
        {marker.kind === "media"       && <MediaBody       m={marker} />}
        {marker.kind === "anbieter"    && <AnbieterBody    m={marker} />}
      </div>
    </div>
  );
}

// ─── Shared Sub-Components ──────────────────────────────────────────────────

/** Live-Wetter-Card für jeden Marker (verwendet Open-Meteo via useWeather) */
function WeatherCard({ lat, lng }: { lat: number; lng: number }) {
  const { data: weather, loading } = useWeather(lat, lng);
  if (weather) {
    const info = weatherCodeToInfo(weather.weatherCode, weather.isDay);
    return (
      <div className="bg-linear-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-xl px-4 py-3">
        <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mb-1">Aktuell vor Ort</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl shrink-0" title={info.label}>{info.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-black text-gray-900 leading-tight">{weather.temperature}°C</p>
            <p className="text-xs text-gray-500">
              {info.label} · {weather.tempMin}° – {weather.tempMax}°
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500">Wetter wird geladen…</span>
      </div>
    );
  }
  return null;
}

/** Cross-Link-Block: zur Destination-Seite + Aktivitäten + Reiseberichte */
function InternalLinks({ slug, name }: { slug: string; name: string }) {
  // Catalog-Eintrag suchen → tiqetsCityId vorhanden? → Aktivitäten-Link zeigen
  const catalogEntry = CATALOG.find((e) => e.slug === slug);
  const hasTiqets = !!catalogEntry?.tiqetsCityId;
  const iataCode  = catalogEntry?.iataCode;

  return (
    <div className="border-t border-gray-100 pt-4 space-y-1.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
        Mehr zu {name}
      </p>
      <Link
        href={`/urlaubsziele/${slug}/`}
        className="flex items-center justify-between text-xs text-gray-600 hover:text-[#1db682] hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors group"
      >
        <span className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Reiseinfos & Pauschalreisen
        </span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
      </Link>
      <Link
        href={`/urlaubsziele/${slug}/#preisverlauf`}
        className="flex items-center justify-between text-xs text-gray-600 hover:text-[#1db682] hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors group"
      >
        <span className="flex items-center gap-2">
          📈 Preisverlauf & Bestzeit
        </span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
      </Link>
      {hasTiqets && (
        <Link
          href={`/erlebnisse/${slug}/`}
          className="flex items-center justify-between text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors group"
        >
          <span className="flex items-center gap-2">
            🎟️ Aktivitäten & Tickets
          </span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
        </Link>
      )}
      {iataCode && (
        <Link
          href={`/flugsuche/?nach=${encodeURIComponent(iataCode)}`}
          className="flex items-center justify-between text-xs text-gray-600 hover:text-sky-600 hover:bg-sky-50 px-3 py-2 rounded-lg transition-colors group"
        >
          <span className="flex items-center gap-2">
            ✈️ Flüge nach {iataCode}
          </span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
        </Link>
      )}
      <Link
        href={`/community/reiseberichte/?destination=${encodeURIComponent(slug)}`}
        className="flex items-center justify-between text-xs text-gray-600 hover:text-[#1db682] hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors group"
      >
        <span className="flex items-center gap-2">
          📖 Reiseberichte ansehen
        </span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
      </Link>
    </div>
  );
}

// ─── Destination ─────────────────────────────────────────────────────────────

function DestinationBody({ m }: { m: Extract<MapMarker, { kind: "destination" }> }) {
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

        {/* Live-Wetter */}
        <WeatherCard lat={m.lat} lng={m.lng} />

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
            m.iataCode ? (
              <Link
                href={`/flugsuche/?nach=${encodeURIComponent(m.iataCode)}`}
                className="bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-400 rounded-lg px-3 py-2.5 col-span-2 transition-colors cursor-pointer block"
              >
                <p className="text-sky-600 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Plane className="w-3 h-3" /> Flugzeit ({m.iataCode})
                  <span className="ml-auto text-sky-700 font-semibold flex items-center gap-0.5">
                    Flüge nach {m.iataCode} →
                  </span>
                </p>
                <p className="font-semibold text-gray-800">{m.flightTime}</p>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Plane className="w-3 h-3" /> Flugzeit
                </p>
                <p className="font-semibold text-gray-800">{m.flightTime}</p>
              </div>
            )
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

        {/* Highlights — Beschreibung */}
        {m.highlights && (
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Highlights
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{m.highlights}</p>
          </div>
        )}

        {/* Tiqets-Aktivitäten — live geladen, max 4 Cards */}
        <NearbyActivities slug={m.slug} lat={m.lat} lng={m.lng} limit={4} />

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
  // locationName parsen — meist "Ort, Land" → wir nutzen ersten Teil
  const locationShort = m.locationName?.split(",")[0]?.trim() ?? "";
  const slug = guessSlug(locationShort);

  return (
    <div>
      {m.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.imageUrl} alt={m.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold capitalize">{m.category}</span>
          {m.locationName && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {m.locationName}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{m.description}</p>

        {/* Live-Wetter am Ort des Tipps */}
        <WeatherCard lat={m.lat} lng={m.lng} />

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>von {m.authorName}</span>
          {m.createdAt && <span>{new Date(m.createdAt).toLocaleDateString("de-DE")}</span>}
        </div>

        {slug && <InternalLinks slug={slug} name={locationShort || m.title} />}
      </div>
    </div>
  );
}

// Hilfe: aus einem Stadt/Ort-Namen einen Catalog-Slug raten
import { CATALOG } from "@/data/catalog-regions";
function guessSlug(name: string): string | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  // Exact match
  const exact = CATALOG.find((e) => e.name.toLowerCase() === lower);
  if (exact) return exact.slug;
  // Substring match
  const partial = CATALOG.find((e) => {
    const n = e.name.toLowerCase();
    return n.includes(lower) || lower.includes(n);
  });
  return partial?.slug ?? null;
}

// ─── Reisebericht ────────────────────────────────────────────────────────────

function ReportBody({ m }: { m: Extract<MapMarker, { kind: "report" }> }) {
  const slug = guessSlug(m.destination);
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

        {/* Live-Wetter am Reise-Ort */}
        <WeatherCard lat={m.lat} lng={m.lng} />

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

        {slug && <InternalLinks slug={slug} name={m.destination} />}
      </div>
    </div>
  );
}

// ─── Media-Feed ──────────────────────────────────────────────────────────────

function MediaBody({ m }: { m: Extract<MapMarker, { kind: "media" }> }) {
  const slug = m.destinationSlug || guessSlug(m.destination);
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

        {/* Live-Wetter am Foto-Ort */}
        <WeatherCard lat={m.lat} lng={m.lng} />

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>von {m.authorName}</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            {m.likesCount}
          </span>
        </div>

        {slug && <InternalLinks slug={slug} name={m.destination} />}
      </div>
    </div>
  );
}

// ─── Anbieter ────────────────────────────────────────────────────────────────

function AnbieterBody({ m }: { m: Extract<MapMarker, { kind: "anbieter" }> }) {
  const slug = guessSlug(m.stadt ?? "") ?? guessSlug(m.landName ?? "");
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

      {/* Live-Wetter am Anbieter-Standort */}
      <WeatherCard lat={m.lat} lng={m.lng} />

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

      {slug && <InternalLinks slug={slug} name={m.stadt ?? m.name} />}
    </div>
  );
}

// ─── Hotel ──────────────────────────────────────────────────────────────────

function HotelBody({ m }: { m: Extract<MapMarker, { kind: "hotel" }> }) {
  const stars = Math.min(5, Math.max(0, Math.round(m.category)));
  const slug = m.destinationSlug || guessSlug(m.destination);
  return (
    <div>
      {m.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.imageUrl} alt={m.hotelName} className="w-full h-44 object-cover" />
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.destination}{m.country && m.country !== m.destination ? `, ${m.country}` : ""}</span>
        </div>

        {/* Sterne + Empfehlung */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          {m.recommendation !== undefined && m.recommendation > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {m.recommendation}% Empfehlung
            </span>
          )}
        </div>

        {/* Preis */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
          <p className="text-sky-600 text-[10px] font-bold uppercase tracking-widest mb-1">
            Live-Preis (7 Tage, 2 Personen)
          </p>
          <p className="font-black text-sky-700 text-2xl leading-tight">
            ab {m.priceFrom.toLocaleString("de-DE")} €
          </p>
          <p className="text-[11px] text-sky-600/80 mt-0.5">pro Person · inkl. Flug</p>
        </div>

        {/* Live-Wetter am Hotel-Standort */}
        <WeatherCard lat={m.lat} lng={m.lng} />

        {/* Buchen-Button → Affiliate-Link */}
        <a
          href={m.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-4 py-3 rounded-xl transition-colors text-sm"
        >
          Hotel ansehen & buchen
          <ExternalLink className="w-4 h-4" />
        </a>

        {slug && <InternalLinks slug={slug} name={m.destination} />}
      </div>
    </div>
  );
}
