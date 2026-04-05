"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";
import type { DestinationConfig } from "@/types";
import type { GuideContent, DayPlan } from "@/lib/guide-data/_types";

/* ── Types ─────────────────────────────────────────────────────────────── */
type TabId = "home" | "overview" | "history" | "sights" | "beaches" | "regions"
  | "budget" | "activities" | "routes" | "insider" | "food" | "practical"
  | "language" | "help";

interface WeatherState { temp: number; desc: string; icon: string }
interface ForecastDay  { day: string; icon: string; maxTemp: number }

/* ── Constants ──────────────────────────────────────────────────────────── */
const TEAL = "#00838F";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "home",       icon: "🏠", label: "Startseite" },
  { id: "overview",   icon: "📊", label: "Überblick" },
  { id: "history",    icon: "📜", label: "Geschichte" },
  { id: "sights",     icon: "🏰", label: "Sehen & Erleben" },
  { id: "beaches",    icon: "🏖️", label: "Strände" },
  { id: "regions",    icon: "🏘️", label: "Regionen" },
  { id: "budget",     icon: "💰", label: "Budget" },
  { id: "activities", icon: "🎟️", label: "Aktivitäten" },
  { id: "routes",     icon: "🗺️", label: "Tagesplanung" },
  { id: "insider",    icon: "🤫", label: "Geheimtipps" },
  { id: "food",       icon: "🍽️", label: "Essen & Trinken" },
  { id: "practical",  icon: "💡", label: "Praktische Infos" },
  { id: "language",   icon: "🗣️", label: "Sprachhilfe" },
  { id: "help",       icon: "🆘", label: "Hilfe & Notfall" },
];

const WEATHER_MAP: Record<number, { desc: string; icon: string }> = {
  0:  { desc: "Klarer Himmel",            icon: "☀️" },
  1:  { desc: "Meist klar",               icon: "🌤️" },
  2:  { desc: "Teilweise bewölkt",        icon: "⛅" },
  3:  { desc: "Bedeckt",                  icon: "☁️" },
  45: { desc: "Nebel",                    icon: "🌫️" },
  51: { desc: "Leichter Nieselregen",     icon: "🌦️" },
  61: { desc: "Leichter Regen",           icon: "🌧️" },
  63: { desc: "Mäßiger Regen",            icon: "🌧️" },
  65: { desc: "Starker Regen",            icon: "🌧️" },
  80: { desc: "Regenschauer",             icon: "🌦️" },
  95: { desc: "Gewitter",                 icon: "⛈️" },
};
const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/* ── Helper Components ──────────────────────────────────────────────────── */
function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function TimelineItem({ year, title, text }: { year: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-[#00838F] ring-4 ring-white shadow shrink-0" />
        <div className="w-0.5 flex-1 bg-gray-200" />
      </div>
      <div className="pb-8">
        <span className="text-xs font-bold text-[#00838F]">{year}</span>
        <h3 className="text-base font-bold text-gray-900 mt-0.5">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function SightCard({ title, desc, mapHref, address, duration, cost, tip }: {
  title: string; desc: string; mapHref: string; address: string;
  duration?: string; cost?: string; tip?: string;
}) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-[#00838F]/20 hover:-translate-y-0.5">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#00838F]/60 group-hover:bg-[#00838F] transition-colors" />
      <h3 className="text-base font-bold text-gray-900 mb-1 pl-3">{title}</h3>
      {(duration || cost) && (
        <div className="pl-3 flex flex-wrap gap-2 mb-2">
          {duration && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">⏱ {duration}</span>}
          {cost && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">💰 {cost}</span>}
        </div>
      )}
      <p className="text-sm text-gray-600 leading-relaxed pl-3 mb-2">{desc}</p>
      {tip && <p className="text-xs text-amber-600 font-medium pl-3 mb-2">💡 {tip}</p>}
      <a href={mapHref} target="_blank" rel="noopener noreferrer"
        className="pl-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#00838F] hover:text-[#006670] transition-colors">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Auf Karte anzeigen
        {address && <span className="text-xs text-gray-400">· {address}</span>}
      </a>
    </div>
  );
}

function IbeCta({ regionId, label }: { regionId: string; label: string }) {
  return (
    <button onClick={() => {
      const url = `https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=${regionId}`;
      const fn = (window as any).ibeOpenBooking;
      if (typeof fn === "function") fn(url, label); else window.open(url, "_blank", "noopener,noreferrer");
    }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d77] text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {label}
    </button>
  );
}

function DayCard({ plan, isLast }: { plan: DayPlan; isLast?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1">
        <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>{plan.icon}</div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-[#00838F]/30 to-transparent mt-2" />}
      </div>
      <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
        <button onClick={() => setOpen(!open)} className="w-full text-left group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#00838F] uppercase tracking-wider">{plan.day}</p>
              <h4 className="text-base font-bold text-gray-900 mt-0.5 group-hover:text-[#00838F] transition-colors">{plan.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              {plan.dayCost && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 hidden sm:inline-block">{plan.dayCost}</span>}
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {!open && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{plan.stops.map(s => s.activity).join(" → ")}</p>}
        </button>
        {open && (
          <div className="mt-3 space-y-2">
            {plan.stops.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-100 shadow-sm">
                <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#00838F] bg-[#00838F]/5 px-1.5 py-0.5 rounded">{s.time}</span>
                    <span className="text-sm font-semibold text-gray-900">{s.activity}</span>
                  </div>
                  {s.tip && <p className="text-xs text-gray-500 mt-0.5 italic">💡 {s.tip}</p>}
                </div>
              </div>
            ))}
            {(plan.transport || plan.meals) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                {plan.transport && <span>🚌 {plan.transport}</span>}
                {plan.meals && <span>🍽️ {plan.meals}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
interface Props {
  dest: DestinationConfig;
  content: GuideContent;
}

export default function GenericGuide({ dest, content }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [routeMode, setRouteMode] = useState<"couples" | "families" | "solo">("couples");
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  const lat = dest.coordinates?.lat ?? 0;
  const lng = dest.coordinates?.lng ?? 0;

  useEffect(() => {
    if (!lat || !lng) return;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max&timezone=auto&forecast_days=5`)
      .then(r => r.json())
      .then(d => {
        const cw = d.current_weather;
        const wInfo = WEATHER_MAP[cw?.weathercode] ?? { desc: "Aktuell", icon: "🌡️" };
        setWeather({ temp: Math.round(cw.temperature), desc: wInfo.desc, icon: wInfo.icon });
        setForecast((d.daily?.time ?? []).slice(1, 5).map((t: string, i: number) => ({
          day: WEEKDAYS[new Date(t).getDay()],
          icon: (WEATHER_MAP[d.daily.weathercode[i + 1]] ?? { icon: "🌡️" }).icon,
          maxTemp: Math.round(d.daily.temperature_2m_max[i + 1]),
        })));
      }).catch(() => {});
  }, [lat, lng]);

  const ibeRegionId = dest.ibeRegionId ?? dest.regionIds[0]?.toString() ?? "1";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">

      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 50%, #26c6da 100%)` }}>
        {/* Dezentes Foto-Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url(${dest.heroImageFallback ?? dest.heroImage})` }}
        />
        {/* Subtiles Muster */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative px-6 md:px-10 pt-6 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/70 mb-5 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span className="text-white/40">›</span>
            <Link href="/urlaubsguides/" className="hover:text-white transition-colors">Urlaubsguides</Link>
            <span className="text-white/40">›</span>
            <span className="text-white font-medium">{dest.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{dest.country}</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {dest.name} Urlaubsführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">{new Date().getFullYear()}</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                {dest.description?.slice(0, 140)}…
              </p>
            </div>
            {weather && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center shrink-0 self-start sm:self-auto border border-white/20">
                <span className="text-3xl">{weather.icon}</span>
                <p className="text-white font-extrabold text-xl">{weather.temp}°C</p>
                <p className="text-white/70 text-[10px] font-medium">Jetzt</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ TABS ═══════ */}
      <nav className="sticky top-20 lg:top-28 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 print:hidden">
        <div className="flex flex-wrap items-center gap-1.5 px-4 sm:px-6 py-3">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-2 px-3.5 text-sm rounded-full whitespace-nowrap transition-all duration-200 font-medium ${
                activeTab === tab.id
                  ? "bg-[#00838F] text-white shadow-md shadow-[#00838F]/25"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══════ CONTENT ═══════ */}
      <main className="p-5 sm:p-8 md:p-10">

        {/* ── HOME ── */}
        {activeTab === "home" && (
          <div className="space-y-8">

            {/* 3-Karten-Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Wetter-Karte */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-sky-500 to-cyan-600 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                  Wetter in {dest.name}
                </h3>
                <div className="relative">
                  {weather ? (
                    <div className="text-center mb-4">
                      <div className="text-5xl font-extrabold tracking-tight">{weather.temp}°C</div>
                      <div className="text-base mt-1 text-white/90">{weather.icon} {weather.desc}</div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <p className="text-white/70 text-sm mt-2">Wird geladen…</p>
                    </div>
                  )}
                </div>
                {forecast.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="grid grid-cols-4 gap-1 text-center text-xs">
                      {forecast.map((d, i) => (
                        <div key={i} className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                          <div className="font-bold text-white/90">{d.day}</div>
                          <div className="text-lg my-0.5">{d.icon}</div>
                          <div className="font-semibold">{d.maxTemp}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Beste Reisezeit-Karte */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Beste Reisezeit
                </h3>
                <div className="space-y-3 relative">
                  {[
                    { icon: content.monthlyNotes[2]?.emoji ?? "🌸", season: "Frühling (Mär–Mai)", desc: content.monthlyNotes[3]?.text ?? "" },
                    { icon: content.monthlyNotes[6]?.emoji ?? "☀️", season: "Sommer (Jun–Aug)",   desc: content.monthlyNotes[6]?.text ?? "" },
                    { icon: content.monthlyNotes[9]?.emoji ?? "🍂", season: "Herbst (Sep–Nov)",   desc: content.monthlyNotes[9]?.text ?? "" },
                    { icon: content.monthlyNotes[0]?.emoji ?? "❄️", season: "Winter (Dez–Feb)",   desc: content.monthlyNotes[0]?.text ?? "" },
                  ].map((s) => (
                    <div key={s.season} className="flex gap-3">
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{s.season}</p>
                        <p className="text-xs text-white/75 line-clamp-2">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights-Karte */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-rose-500 to-red-600 relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Top-Tipps
                </h3>
                <div className="space-y-3 text-sm relative">
                  {content.insider.slice(0, 4).map((tip, i) => (
                    <p key={i}>
                      <span className="mr-1.5">{tip.icon}</span>
                      <strong>{tip.title}:</strong>{" "}
                      <span className="text-white/80">{tip.text.slice(0, 70)}{tip.text.length > 70 ? "…" : ""}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach {dest.name}</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P. Direkt beim Veranstalter buchen.</p>
                </div>
                <IbeCta regionId={ibeRegionId} label={`${dest.name} buchen →`} />
              </div>
            </div>

            {/* Monatskalender */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">{dest.name} nach Monaten</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.monthlyNotes.map((m, i) => {
                  const isCurrentMonth = i === new Date().getMonth();
                  return (
                    <div key={i} className={`rounded-2xl p-4 border-2 transition-all duration-300 ${isCurrentMonth ? "border-[#00838F] bg-[#00838F]/5 scale-[1.03] shadow-lg shadow-[#00838F]/15" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{m.emoji}</span>
                        <h3 className="text-xs font-extrabold text-gray-900">{m.label}</h3>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{m.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQs */}
            {dest.faqs && dest.faqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Häufige Fragen</h2>
                <div className="space-y-3">
                  {dest.faqs.map((faq, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{faq.question}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">{dest.name} auf einen Blick</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="🌍" label="Land" value={dest.country} />
              {dest.iataCode && <StatCard icon="✈️" label="Flughafen" value={dest.iataCode} />}
              {dest.climate && dest.climate.length > 0 && (
                <StatCard icon="☀️" label="Sommer max." value={`${Math.max(...dest.climate.map(c => c.tempHigh))}°C`} />
              )}
              {dest.climate && dest.climate.length > 0 && (
                <StatCard icon="🌊" label="Badesaison" value={`Mai–Okt.`} />
              )}
              <StatCard icon="💶" label="Währung" value={dest.entryInfo?.currency?.split(".")[0] ?? "EUR"} />
              <StatCard icon="🗣️" label="Sprache" value={dest.entryInfo?.language?.split(".")[0] ?? "Landessprache"} />
            </div>

            {/* Klimatabelle */}
            {dest.climate && dest.climate.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">🌡️ Klimatabelle</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="px-2 py-1 text-left font-semibold">Monat</th>
                        {dest.climate.map(m => <th key={m.month} className="px-2 py-1 font-semibold">{m.month}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 text-left text-gray-600">☀️ Max.</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-1 font-bold text-orange-600">{m.tempHigh}°</td>)}
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-left text-gray-600">🌙 Min.</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-1 text-blue-600">{m.tempLow}°</td>)}
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-left text-gray-600">🌧️ mm</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-1 text-gray-500">{m.rain}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-[#00838F]/5 rounded-2xl p-4 border border-[#00838F]/20 text-center">
              <IbeCta regionId={ibeRegionId} label={`Urlaub in ${dest.name} buchen`} />
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Geschichte von {dest.name}</h2>
            <div className="mt-4">
              {content.history.map((e, i) => <TimelineItem key={i} {...e} />)}
            </div>
          </div>
        )}

        {/* ── SIGHTS ── */}
        {activeTab === "sights" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Sehenswürdigkeiten in {dest.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.sights.map((s, i) => <SightCard key={i} {...s} />)}
            </div>
            <div className="text-center pt-2">
              <IbeCta regionId={ibeRegionId} label={`${dest.name} Pauschalreisen`} />
            </div>
          </div>
        )}

        {/* ── BEACHES ── */}
        {activeTab === "beaches" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Strände in {dest.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.beaches.map((b, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{b.emoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{b.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-block mb-1">{b.type}</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                      {b.tip && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2">💡 {b.tip}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REGIONS ── */}
        {activeTab === "regions" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Regionen & Gebiete</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.regions.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <h3 className="font-bold text-gray-900">{r.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.highlights.map((h, j) => (
                      <span key={j} className="text-xs bg-[#00838F]/10 text-[#00838F] font-semibold px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BUDGET ── */}
        {activeTab === "budget" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Budget-Guide für {dest.name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-500 font-semibold">Kategorie</th>
                    <th className="text-center py-2 text-green-700 font-semibold">💚 Budget</th>
                    <th className="text-center py-2 text-blue-700 font-semibold">💙 Mittel</th>
                    <th className="text-center py-2 text-purple-700 font-semibold">💜 Luxus</th>
                  </tr>
                </thead>
                <tbody>
                  {content.budget.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i === content.budget.length - 1 ? "font-bold bg-gray-50" : ""}`}>
                      <td className="py-2 text-gray-700">{row.label}</td>
                      <td className="py-2 text-center text-green-700">{row.budget}</td>
                      <td className="py-2 text-center text-blue-700">{row.mid}</td>
                      <td className="py-2 text-center text-purple-700">{row.luxury}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              💡 <strong>Spartipp:</strong> Frühbucher-Rabatte von bis zu 30 % findest du oft 4–6 Monate im Voraus. Vergleiche mehrere Anbieter für die besten Preise.
            </div>
            <div className="text-center">
              <IbeCta regionId={ibeRegionId} label={`Günstige ${dest.name}-Angebote`} />
            </div>
          </div>
        )}

        {/* ── ACTIVITIES ── */}
        {activeTab === "activities" && dest.tiqetsCityId && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Aktivitäten in {dest.name}</h2>
            <TiqetsCarousel cityId={dest.tiqetsCityId} cityName={dest.name} citySlug={dest.slug} />
          </div>
        )}
        {activeTab === "activities" && !dest.tiqetsCityId && (
          <div className="space-y-4 text-center py-8">
            <span className="text-5xl">🎟️</span>
            <p className="text-gray-500">Aktivitäten werden bald verfügbar.</p>
            <IbeCta regionId={ibeRegionId} label={`${dest.name} Pauschalreisen`} />
          </div>
        )}

        {/* ── ROUTES ── */}
        {activeTab === "routes" && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-gray-900">Tagesplanung für {dest.name}</h2>
            <div className="flex gap-2">
              {(["couples", "families", "solo"] as const).map(m => (
                <button key={m} onClick={() => setRouteMode(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${routeMode === m ? "bg-[#00838F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {m === "couples" ? "💑 Paare" : m === "families" ? "👨‍👩‍👧 Familien" : "🧳 Solo"}
                </button>
              ))}
            </div>
            <div>
              {(routeMode === "couples" ? content.couplesDays :
                routeMode === "families" ? content.familiesDays :
                content.soloDays).map((plan, i, arr) => (
                <DayCard key={i} plan={plan} isLast={i === arr.length - 1} />
              ))}
            </div>
          </div>
        )}

        {/* ── INSIDER ── */}
        {activeTab === "insider" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Geheimtipps für {dest.name}</h2>
            <div className="grid gap-4">
              {content.insider.map((tip, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{tip.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOD ── */}
        {activeTab === "food" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Essen & Trinken in {dest.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.food.map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{f.emoji ?? "🍽️"}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{f.name}</h3>
                      {f.original && <p className="text-xs text-gray-400 italic mb-1">{f.original}</p>}
                      {f.price && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 inline-block mb-1">💰 {f.price}</span>}
                      <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                      {f.tip && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2">💡 {f.tip}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRACTICAL ── */}
        {activeTab === "practical" && dest.entryInfo && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Praktische Infos für {dest.name}</h2>
            <div className="grid gap-3">
              {[
                { icon: "🛂", label: "Einreise & Visum", text: dest.entryInfo.visa },
                { icon: "💰", label: "Währung & Zahlung", text: dest.entryInfo.currency },
                { icon: "🗣️", label: "Sprache", text: dest.entryInfo.language },
                { icon: "🕐", label: "Zeitzone", text: dest.entryInfo.timezone },
                { icon: "🔌", label: "Strom & Stecker", text: dest.entryInfo.voltage },
                { icon: "🏥", label: "Gesundheit & Versicherung", text: dest.entryInfo.health },
              ].map(({ icon, label, text }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LANGUAGE ── */}
        {activeTab === "language" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Sprachhilfe für {dest.name}</h2>
            <p className="text-sm text-gray-500">Die wichtigsten Phrasen für deinen Urlaub in {dest.country}:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="text-left py-2 font-semibold">Originalsprache</th>
                    <th className="text-left py-2 font-semibold hidden sm:table-cell">Aussprache</th>
                    <th className="text-left py-2 font-semibold">Deutsch</th>
                  </tr>
                </thead>
                <tbody>
                  {content.phrases.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 font-semibold text-[#00838F]">{p.original}</td>
                      <td className="py-2 text-gray-400 italic hidden sm:table-cell">[{p.pronunciation}]</td>
                      <td className="py-2 text-gray-700">{p.translation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── HELP ── */}
        {activeTab === "help" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Hilfe & Notfall in {dest.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "🚔", label: "Polizei", value: content.emergency.police },
                { icon: "🚑", label: "Notarzt / Rettung", value: content.emergency.ambulance },
                { icon: "🚒", label: "Feuerwehr", value: content.emergency.fire },
                ...(content.emergency.embassy ? [{ icon: "🏛️", label: "Deutsche Botschaft/Konsulat", value: content.emergency.embassy }] : []),
                ...(content.emergency.hospital ? [{ icon: "🏥", label: "Nächstes Krankenhaus", value: content.emergency.hospital }] : []),
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-red-50 rounded-xl p-4 border border-red-100 flex gap-3 items-start">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{label}</p>
                    <p className="text-base font-black text-gray-900 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-bold mb-1">🇪🇺 Europäischer Notruf</p>
              <p>Der einheitliche Notruf <strong>112</strong> funktioniert in den meisten Ländern. Kostenlos von jedem Handy, auch ohne SIM-Karte.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
