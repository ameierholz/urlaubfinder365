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
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm transition-shadow">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function SectionBadge({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue:  "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    teal:  "bg-teal-50 text-teal-700 ring-teal-200",
    red:   "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ring-1 ${colors[color] ?? colors.blue}`}>
      {children}
    </span>
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
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{dest.name} auf einen Blick</h2>
              <p className="text-gray-400 text-sm">Alle wichtigen Fakten auf einen Blick</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon="🌍" label="Land" value={dest.country} />
              {dest.iataCode && <StatCard icon="✈️" label="Flughafen" value={dest.iataCode} />}
              {dest.climate && dest.climate.length > 0 && (
                <StatCard icon="☀️" label="Sommer max." value={`${Math.max(...dest.climate.map(c => c.tempHigh))}°C`} />
              )}
              {dest.climate && dest.climate.length > 0 && (
                <StatCard icon="🌊" label="Badesaison" value="Mai–Okt." />
              )}
              <StatCard icon="💶" label="Währung" value={dest.entryInfo?.currency?.split(".")[0] ?? "EUR"} />
              <StatCard icon="🗣️" label="Sprache" value={dest.entryInfo?.language?.split(".")[0] ?? "Landessprache"} />
            </div>

            {/* Klimatabelle */}
            {dest.climate && dest.climate.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌡️ Klimatabelle</h3>
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-xs text-center">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-3 text-left font-bold text-gray-700">Monat</th>
                        {dest.climate.map(m => <th key={m.month} className="px-2 py-3 font-bold text-gray-700">{m.month}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2.5 text-left text-gray-600 font-medium">☀️ Max.</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-2.5 font-bold text-orange-600">{m.tempHigh}°</td>)}
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2.5 text-left text-gray-600 font-medium">🌙 Min.</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-2.5 text-blue-600">{m.tempLow}°</td>)}
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-3 py-2.5 text-left text-gray-600 font-medium">🌧️ mm</td>
                        {dest.climate.map(m => <td key={m.month} className="px-2 py-2.5 text-gray-500">{m.rain}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="font-bold mb-0.5">Jetzt {dest.name}-Pauschalreisen vergleichen</p>
                  <p className="text-white/70 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P.</p>
                </div>
                <IbeCta regionId={ibeRegionId} label={`${dest.name} buchen →`} />
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte von {dest.name}</h2>
              <p className="text-gray-400 text-sm">Von der Antike bis heute</p>
            </div>
            <div>
              {content.history.map((e, i) => <TimelineItem key={i} {...e} />)}
            </div>
          </div>
        )}

        {/* ── SIGHTS ── */}
        {activeTab === "sights" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sehenswürdigkeiten in {dest.name}</h2>
              <p className="text-gray-400 text-sm">Die schönsten Orte und Highlights</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.sights.map((s, i) => <SightCard key={i} {...s} />)}
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="font-bold mb-0.5">Jetzt {dest.name}-Pauschalreisen vergleichen</p>
                  <p className="text-white/70 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P.</p>
                </div>
                <IbeCta regionId={ibeRegionId} label={`${dest.name} buchen →`} />
              </div>
            </div>
          </div>
        )}

        {/* ── BEACHES ── */}
        {activeTab === "beaches" && (() => {
          const beachColors = [
            "border-blue-200 bg-blue-50/50",
            "border-amber-200 bg-amber-50/50",
            "border-rose-200 bg-rose-50/50",
            "border-emerald-200 bg-emerald-50/50",
            "border-cyan-200 bg-cyan-50/50",
            "border-violet-200 bg-violet-50/50",
          ];
          const badgeColors = [
            "bg-blue-100 text-blue-700",
            "bg-amber-100 text-amber-700",
            "bg-rose-100 text-rose-700",
            "bg-emerald-100 text-emerald-700",
            "bg-cyan-100 text-cyan-700",
            "bg-violet-100 text-violet-700",
          ];
          return (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Strände in {dest.name}</h2>
                <p className="text-gray-400 text-sm">Die schönsten Strände und Badeorte</p>
              </div>
              <div className="space-y-5">
                {content.beaches.map((b, i) => (
                  <div key={i} className={`rounded-2xl border-2 p-6 transition-all hover:shadow-md ${beachColors[i % beachColors.length]}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xl">{b.emoji}</span>
                      <h3 className="text-xl font-extrabold text-gray-900">{b.name}</h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColors[i % badgeColors.length]}`}>{b.type}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{b.desc}</p>
                    {b.tip && (
                      <div className="bg-white/80 rounded-xl p-3">
                        <p className="text-xs text-amber-700">💡 {b.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-sky-50 border-2 border-sky-100 rounded-2xl p-5 flex gap-3">
                <span className="text-2xl shrink-0">🌊</span>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Strand-Tipp für {dest.name}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">Informiere dich vorab über Wasserqualität und Infrastruktur. Sonnenschutz, Wasser und Badelatschen gehören zur Grundausstattung.</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── REGIONS ── */}
        {activeTab === "regions" && (() => {
          const regionColors = [
            "border-amber-200",
            "border-blue-200",
            "border-rose-200",
            "border-emerald-200",
            "border-violet-200",
            "border-orange-200",
          ];
          return (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Regionen & Gebiete</h2>
                <p className="text-gray-400 text-sm">Wo übernachten? Welcher Teil passt zu dir?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {content.regions.map((r, i) => (
                  <div key={i} className={`bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${regionColors[i % regionColors.length]}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">{r.emoji}</div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-lg">{r.name}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{r.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.highlights.map((h, j) => (
                        <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── BUDGET ── */}
        {activeTab === "budget" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Budget & Kosten</h2>
              <p className="text-gray-400 text-sm">Was kostet ein {dest.name}-Urlaub wirklich? Realistische Preise für alle Budgets.</p>
            </div>

            {/* 3-col budget level cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { level: "Budget-Reisender", emoji: "🎒", color: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700" },
                { level: "Mittleres Budget",  emoji: "🧳", color: "border-blue-200 bg-blue-50/50",     badge: "bg-blue-100 text-blue-700" },
                { level: "Luxus-Reisender",   emoji: "👑", color: "border-amber-200 bg-amber-50/50",   badge: "bg-amber-100 text-amber-700" },
              ].map((b, idx) => {
                const rows = content.budget.filter((_, i) => i < content.budget.length - 1);
                const lastRow = content.budget[content.budget.length - 1];
                const val = idx === 0 ? "budget" : idx === 1 ? "mid" : "luxury";
                return (
                  <div key={b.level} className={`rounded-2xl border-2 p-6 ${b.color}`}>
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-3 shadow-sm">{b.emoji}</div>
                    <h3 className="font-extrabold text-gray-900 mb-1">{b.level}</h3>
                    {lastRow && (
                      <p className={`text-sm font-bold px-3 py-1 rounded-lg inline-block mb-4 ${b.badge}`}>{lastRow[val as keyof typeof lastRow]}</p>
                    )}
                    <ul className="space-y-1.5">
                      {rows.slice(0, 4).map((row, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-2">
                          <span className="text-gray-300">•</span>
                          {row.label}: {row[val as keyof typeof row]}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Price table */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Typische Preise auf einen Blick</h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3.5 text-left font-bold text-gray-700">Leistung</th>
                      <th className="px-5 py-3.5 text-left font-bold text-emerald-700">Budget</th>
                      <th className="px-5 py-3.5 text-left font-bold text-blue-700">Mittel</th>
                      <th className="px-5 py-3.5 text-left font-bold text-amber-700">Luxus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {content.budget.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{row.label}</td>
                        <td className="px-5 py-3 text-emerald-700">{row.budget}</td>
                        <td className="px-5 py-3 text-blue-700">{row.mid}</td>
                        <td className="px-5 py-3 text-amber-700">{row.luxury}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spar tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Reisezeit</p>
                  <p className="text-gray-600 text-xs leading-relaxed">Schulterseason (Mai, Sep–Okt) ist oft 20–40% günstiger als Hochsommer – bei meist gleichem Wetter.</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Frühbucher</p>
                  <p className="text-gray-600 text-xs leading-relaxed">Frühbucher-Rabatte von bis zu 30% gibt es oft 4–6 Monate im Voraus. Mehrere Anbieter vergleichen!</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="font-bold mb-0.5">Jetzt {dest.name}-Pauschalreisen vergleichen</p>
                  <p className="text-white/70 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P.</p>
                </div>
                <IbeCta regionId={ibeRegionId} label={`Günstige ${dest.name}-Angebote`} />
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVITIES ── */}
        {activeTab === "activities" && dest.tiqetsCityId && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten in {dest.name}</h2>
              <p className="text-gray-400 text-sm">Touren, Tickets & Erlebnisse vor Ort</p>
            </div>
            <TiqetsCarousel cityId={dest.tiqetsCityId} cityName={dest.name} citySlug={dest.slug} />
          </div>
        )}
        {activeTab === "activities" && !dest.tiqetsCityId && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten in {dest.name}</h2>
              <p className="text-gray-400 text-sm">Touren, Tickets & Erlebnisse vor Ort</p>
            </div>
            <div className="text-center py-8">
              <span className="text-5xl">🎟️</span>
              <p className="text-gray-500 mt-3">Aktivitäten werden bald verfügbar.</p>
              <div className="mt-4">
                <IbeCta regionId={ibeRegionId} label={`${dest.name} Pauschalreisen`} />
              </div>
            </div>
          </div>
        )}

        {/* ── ROUTES ── */}
        {activeTab === "routes" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Tagesplanung für {dest.name}</h2>
              <p className="text-gray-400 text-sm">Fertige Routen für jeden Reisetyp</p>
            </div>
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
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geheimtipps & Ausflüge</h2>
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das echte {dest.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {content.insider.map((tip, i) => {
                const badgeColors = ["green", "amber", "blue", "teal", "red", "green", "amber", "blue"];
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#00838F]/20 transition-all">
                    <SectionBadge color={badgeColors[i % badgeColors.length]}>{tip.icon} Geheimtipp</SectionBadge>
                    <h4 className="font-bold text-gray-900 mt-3 mb-1.5">{tip.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FOOD ── */}
        {activeTab === "food" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Essen & Trinken</h2>
              <p className="text-gray-400 text-sm">Kulinarische Highlights aus {dest.name}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Was du unbedingt probieren musst</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.food.map((f, i) => (
                  <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <span className="text-2xl shrink-0">{f.emoji ?? "🍽️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{f.name}</h4>
                        {f.price && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">{f.price}</span>
                        )}
                      </div>
                      {f.original && <p className="text-[10px] text-gray-400 italic mt-0.5">{f.original}</p>}
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{f.desc}</p>
                      {f.tip && <p className="text-xs text-amber-700 mt-1">💡 {f.tip}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Tipp: Iss wie die Einheimischen</p>
                <p className="text-gray-600 text-xs leading-relaxed">Meide touristische Restaurants in Hauptlagen. In Seitenstraßen findest du oft authentischeres Essen zu einem Bruchteil des Preises.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── PRACTICAL ── */}
        {activeTab === "practical" && dest.entryInfo && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Praktische Infos</h2>
              <p className="text-gray-400 text-sm">Alles was du vor und während der Reise wissen musst</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { emoji: "🛂", title: "Einreise & Visum",          text: dest.entryInfo.visa },
                { emoji: "💰", title: "Währung & Zahlung",          text: dest.entryInfo.currency },
                { emoji: "🗣️", title: "Sprache",                   text: dest.entryInfo.language },
                { emoji: "🕐", title: "Zeitzone",                   text: dest.entryInfo.timezone },
                { emoji: "🔌", title: "Strom & Stecker",            text: dest.entryInfo.voltage },
                { emoji: "🏥", title: "Gesundheit & Versicherung",  text: dest.entryInfo.health },
              ].map(({ emoji, title, text }) => (
                <div key={title} className="group bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#00838F]/20">
                  <div className="w-12 h-12 rounded-xl bg-[#00838F]/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-[#00838F]/15 transition-colors">{emoji}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LANGUAGE ── */}
        {activeTab === "language" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sprachhilfe</h2>
              <p className="text-gray-400 text-sm">Ein paar Worte in der Landessprache öffnen dir Türen und Herzen</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {content.phrases.map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:border-[#00838F]/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{p.translation}</p>
                    <p className="text-[#00838F] font-semibold text-sm">{p.original}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded shrink-0">{p.pronunciation}</span>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Aussprache-Tipp</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Die Aussprache in eckigen Klammern zeigt dir, wie du die Wörter laut aussprechen kannst. Keine Sorge – Einheimische freuen sich über jeden Versuch!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── HELP ── */}
        {activeTab === "help" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Hilfe & Notfall</h2>
              <p className="text-gray-400 text-sm">Wichtige Kontakte, Adressen und Anlaufstellen</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency Numbers */}
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
                <h3 className="font-extrabold text-red-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-sm">🚨</span>
                  Notrufnummern
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-bold text-red-800">🚨 Allgemeiner Notruf</span>
                    <span className="font-extrabold text-red-700 text-lg">112</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚓 Polizei</span>
                    <span className="font-bold text-gray-900">{content.emergency.police}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚑 Rettungsdienst</span>
                    <span className="font-bold text-gray-900">{content.emergency.ambulance}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚒 Feuerwehr</span>
                    <span className="font-bold text-gray-900">{content.emergency.fire}</span>
                  </div>
                </div>
              </div>

              {/* Consulate & Travel */}
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="font-extrabold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm">🏛️</span>
                  Konsulate & Hilfe
                </h3>
                <div className="space-y-2.5 text-sm">
                  {content.emergency.embassy && (
                    <div className="bg-white rounded-xl p-3 border border-blue-100">
                      <p className="font-medium text-gray-700">🏛️ Deutsche Botschaft/Konsulat</p>
                      <p className="font-bold text-gray-900 mt-0.5">{content.emergency.embassy}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <p className="font-medium text-gray-700">🇪🇺 EU-Bürger-Notruf</p>
                    <p className="font-bold text-gray-900 mt-0.5">+32 2 505 33 00 (Konsularschutz)</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <p className="font-medium text-gray-700">📞 ADAC-Auslandsnotruf</p>
                    <p className="font-bold text-gray-900 mt-0.5">+49 89 22 22 22</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl mb-3">🏥</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Nächstes Krankenhaus</h4>
                <p className="text-xs text-gray-600">{content.emergency.hospital ?? "Erfrage beim Hotel die nächste Notaufnahme. Auslandskrankenversicherung dringend empfohlen."}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl mb-3">💊</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Apotheke</h4>
                <p className="text-xs text-gray-600">Apotheken sind i.d.R. gut ausgestattet. Im Notfall informiert dich dein Hotel über den Apotheken-Notdienst.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-3">📋</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Reiseversicherung</h4>
                <p className="text-xs text-gray-600">Auslandskrankenversicherung ist Pflicht! Private Reisekrankenversicherung ab ~10 €/Reise abschließen.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Wichtig: Dokumentenkopien</p>
                <p className="text-gray-600 text-xs leading-relaxed">Fotografiere Reisepass, Versicherungsnachweis und Buchungsbestätigung und speichere sie in der Cloud (Google Drive, iCloud). So hast du im Notfall immer Zugriff, selbst wenn das Original verloren geht.</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FOOTER CTA ═══ */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
          <div>
            <h3 className="text-xl font-extrabold mb-1">Bereit für deinen {dest.name}-Urlaub?</h3>
            <p className="text-white/70 text-sm">Jetzt tagesaktuelle Pauschalreisen, All-Inclusive & Last-Minute Deals vergleichen und günstig buchen.</p>
          </div>
          {dest.slug && (
            <Link href={`/urlaubsziele/${dest.slug}/`}
              className="bg-white text-[#00838F] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 shadow-sm">
              {dest.name} Angebote ansehen →
            </Link>
          )}
        </div>

      </main>
    </div>
  );
}
