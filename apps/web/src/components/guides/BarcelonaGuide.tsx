"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";

/* ────────────────────────── types & constants ────────────────────────── */

type TabId =
  | "home" | "overview" | "history" | "sights"
  | "routes" | "insider" | "food" | "practical"
  | "language" | "help" | "activities"
  | "beaches" | "districts" | "budget";

const TEAL = "#00838F";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "home",       icon: "🏠", label: "Startseite" },
  { id: "overview",   icon: "📊", label: "Überblick" },
  { id: "history",    icon: "📜", label: "Geschichte" },
  { id: "sights",     icon: "🏰", label: "Sehen & Erleben" },
  { id: "beaches",    icon: "🏖️", label: "Strände" },
  { id: "districts",  icon: "🏘️", label: "Viertel-Guide" },
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
  0: { desc: "Klarer Himmel", icon: "☀️" },
  1: { desc: "Meist klar", icon: "🌤️" },
  2: { desc: "Teilweise bewölkt", icon: "⛅" },
  3: { desc: "Bedeckt", icon: "☁️" },
  45: { desc: "Nebel", icon: "🌫️" },
  48: { desc: "Reifnebel", icon: "🌫️" },
  51: { desc: "Leichter Nieselregen", icon: "🌦️" },
  53: { desc: "Mäßiger Nieselregen", icon: "🌦️" },
  55: { desc: "Starker Nieselregen", icon: "🌦️" },
  61: { desc: "Leichter Regen", icon: "🌧️" },
  63: { desc: "Mäßiger Regen", icon: "🌧️" },
  65: { desc: "Starker Regen", icon: "🌧️" },
  80: { desc: "Leichte Regenschauer", icon: "🌦️" },
  81: { desc: "Mäßige Regenschauer", icon: "🌦️" },
  82: { desc: "Heftige Regenschauer", icon: "⛈️" },
  95: { desc: "Gewitter", icon: "⛈️" },
};

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const MONTHS_DATA = [
  { label: "Januar", emoji: "🎉", text: "Mild, ideal für Museen und Gaudí-Architektur ohne Warteschlangen." },
  { label: "Februar", emoji: "🎭", text: "Karneval in Barcelona! Kulturelle Events und angenehm ruhig." },
  { label: "März", emoji: "🌸", text: "Frühling beginnt, perfekt für Spaziergänge durch den Park Güell." },
  { label: "April", emoji: "🌷", text: "Sant Jordi (23. Apr) – Rosen & Bücher auf den Ramblas. Wunderschön!" },
  { label: "Mai", emoji: "☀️", text: "Warm, aber nicht zu heiß. Ideale Reisezeit für Strand und Stadt." },
  { label: "Juni", emoji: "🔥", text: "Sant Joan (23. Jun) – Feuerfest am Strand! Beginn der Badesaison." },
  { label: "Juli", emoji: "🏖️", text: "Hochsommer, volle Strände. Grec-Festival mit Konzerten und Theater." },
  { label: "August", emoji: "🌊", text: "Heißester Monat. Festa Major de Gràcia – bunte Straßenfeste." },
  { label: "September", emoji: "🎆", text: "La Mercè (24. Sep) – Barcelonas größtes Stadtfest mit Feuerwerk." },
  { label: "Oktober", emoji: "🍂", text: "Angenehm warm, weniger Touristen. Perfekt für Sightseeing." },
  { label: "November", emoji: "🍷", text: "Weinlese-Saison. Ideal für Ausflüge ins Penedès-Weingebiet." },
  { label: "Dezember", emoji: "🎄", text: "Weihnachtsmärkte, Fira de Santa Llúcia. Mild und festlich." },
];

interface WeatherState { temp: number; desc: string; icon: string }
interface ForecastDay  { day: string; icon: string; maxTemp: number }

/* ────────────────────────── helper components ────────────────────────── */

function Flag({ code, alt, className = "" }: { code: string; alt: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code}.png`}
      width={20}
      height={14}
      className={`inline-block rounded-sm shadow-sm align-text-bottom ${className}`}
      alt={alt}
      loading="lazy"
    />
  );
}

function MapLink({ href, address }: { href: string; address?: string }) {
  return (
    <div className="mt-2 flex items-start gap-2">
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00838F] hover:text-[#006670] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Auf Karte anzeigen
      </a>
      {address && <span className="text-xs text-gray-400 pt-0.5">· {address}</span>}
    </div>
  );
}

function SightCard({ title, desc, mapHref, address, duration, cost, tip }: {
  title: string; desc: string; mapHref: string; address?: string;
  duration?: string; cost?: string; tip?: string;
}) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-[#00838F]/20 hover:-translate-y-0.5">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#00838F]/60 group-hover:bg-[#00838F] transition-colors" />
      <h4 className="font-bold text-gray-900 mb-1.5 pl-3">{title}</h4>
      {(duration || cost) && (
        <div className="pl-3 flex flex-wrap gap-2 mb-2">
          {duration && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">⏱ {duration}</span>}
          {cost && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">💰 {cost}</span>}
        </div>
      )}
      <p className="text-sm text-gray-600 leading-relaxed pl-3">{desc}</p>
      {tip && <p className="text-xs text-amber-600 font-medium mt-2 pl-3">💡 {tip}</p>}
      <div className="pl-3">
        <MapLink href={mapHref} address={address} />
      </div>
    </div>
  );
}

interface DayStop {
  time: string;
  activity: string;
  icon: string;
  tip?: string;
}

interface DayPlan {
  day: string;
  title: string;
  icon: string;
  color: string;
  stops: DayStop[];
  transport?: string;
  meals?: string;
  dayCost?: string;
}

function DayCard({ plan, isLast }: { plan: DayPlan; isLast?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1">
        <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>
          {plan.icon}
        </div>
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
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {!open && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{plan.stops.map(s => s.activity).join(" → ")}</p>
          )}
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
                {plan.transport && <span className="flex items-center gap-1">🚌 {plan.transport}</span>}
                {plan.meals && <span className="flex items-center gap-1">🍽️ {plan.meals}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionBadge({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ring-1 ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

function IbeCta({ label = "Pauschalreisen nach Barcelona suchen" }: { label?: string }) {
  return (
    <button
      onClick={() => {
        const url = "https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=100027";
        const fn = (window as any).ibeOpenBooking;
        if (typeof fn === "function") fn(url, "Pauschalreisen nach Barcelona");
        else window.open(url, "_blank", "noopener,noreferrer");
      }}
      className="shrink-0 bg-white text-[#00838F] font-extrabold px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm transition-shadow">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function TimelineItem({ year, era, text, color }: { year: string; era: string; text: string; color: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${color} ring-4 ring-white shadow-sm shrink-0`} />
        <div className="w-0.5 flex-1 bg-gray-200 group-last:hidden" />
      </div>
      <div className="pb-8">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color} text-white`}>{year}</span>
        <h4 className="font-bold text-gray-900 mt-1.5">{era}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ────────────────────────── main component ────────────────────────── */

export default function BarcelonaGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [weather,   setWeather]   = useState<WeatherState | null>(null);
  const [forecast,  setForecast]  = useState<ForecastDay[]>([]);
  const [liveTime,  setLiveTime]  = useState("");
  const [activePlan, setActivePlan] = useState<"couples" | "families" | "solo">("couples");
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.3851&longitude=2.1734&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Madrid"
        );
        if (!res.ok) return;
        const data = await res.json();
        const code  = data.current_weather.weathercode;
        const isDay = data.current_weather.is_day;
        let w = WEATHER_MAP[code] ?? { desc: "Wetter nicht verfügbar", icon: "" };
        if ((code === 0 || code === 1) && isDay === 0) w = { desc: "Klarer Himmel", icon: "🌙" };
        setWeather({ temp: Math.round(data.current_weather.temperature), ...w });

        const f: ForecastDay[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(data.daily.time[i]);
          const fw   = WEATHER_MAP[data.daily.weathercode[i]] ?? { icon: "" };
          f.push({ day: WEEKDAYS[date.getUTCDay()], icon: fw.icon, maxTemp: Math.round(data.daily.temperature_2m_max[i]) });
        }
        setForecast(f);
      } catch { /* silent */ }
    };
    fetchWeather();

    const updateTime = () =>
      setLiveTime(new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">

      {/* ═══════════════ HERO HEADER ═══════════════ */}
      <div className="relative overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 50%, #26c6da 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative px-6 md:px-10 pt-6 pb-8">
          <nav className="flex items-center gap-1.5 text-sm text-white/70 mb-5 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span className="text-white/40">›</span>
            <Link href="/urlaubsguides/" className="hover:text-white transition-colors">Urlaubsguides</Link>
            <span className="text-white/40">›</span>
            <span className="text-white font-medium">Barcelona</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Barcelona Reiseführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">2026</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                Dein umfassender Guide für den perfekten Städtetrip – Gaudí, Tapas, Strände & praktische Infos.
              </p>
            </div>
            <button onClick={() => window.print()} className="print:hidden self-start sm:self-auto bg-white/15 backdrop-blur-sm text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-white/25 transition-all flex items-center gap-2 text-sm border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" /></svg>
              Drucken
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════ TAB NAVIGATION ═══════════════ */}
      <nav className="sticky top-20 lg:top-28 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 print:hidden">
        <div className="flex flex-wrap items-center gap-1.5 px-4 sm:px-6 py-3">
          {TABS.map((tab) => (
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

      {/* ═══════════════ CONTENT ═══════════════ */}
      <main className="p-5 sm:p-8 md:p-10">

        {/* ════ HOME ════ */}
        {activeTab === "home" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Weather */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-sky-500 to-cyan-600 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                  Wetter in Barcelona
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
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
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
                {liveTime && (
                  <div className="mt-3 pt-3 border-t border-white/20 text-center text-sm text-white/80">
                    Ortszeit: <strong className="text-white">{liveTime}</strong>
                  </div>
                )}
              </div>

              {/* Best Travel Time */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Beste Reisezeit
                </h3>
                <div className="space-y-3 relative">
                  {[
                    { icon: "🌸", season: "Frühling (Apr–Mai)", desc: "Ideal! Warm, trocken, weniger Touristen." },
                    { icon: "☀️", season: "Sommer (Jun–Aug)", desc: "Heiß & voll. Perfekt für Strandliebhaber." },
                    { icon: "🍂", season: "Herbst (Sep–Okt)", desc: "Top-Empfehlung! Warm, Feste, weniger Trubel." },
                    { icon: "❄️", season: "Winter (Nov–Mär)", desc: "Mild (10–15°C), günstig, kulturell reich." },
                  ].map((s) => (
                    <div key={s.season} className="flex gap-3">
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div><p className="font-bold text-sm">{s.season}</p><p className="text-xs text-white/75">{s.desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 */}
              <div className="rounded-2xl text-white shadow-lg p-6 bg-linear-to-br from-rose-500 to-red-600 relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Top 5 für…
                </h3>
                <div className="space-y-3 text-sm relative">
                  <p><span className="mr-1.5">🥇</span><strong>Erstbesucher:</strong> <span className="text-white/80">Sagrada Família, Park Güell, La Rambla, Barri Gòtic, Barceloneta Strand.</span></p>
                  <p><span className="mr-1.5">👨‍👩‍👧‍👦</span><strong>Familien:</strong> <span className="text-white/80">Aquarium Barcelona, Tibidabo Freizeitpark, Zoo, Strand, Camp Nou.</span></p>
                  <p><span className="mr-1.5">💕</span><strong>Paare:</strong> <span className="text-white/80">Bunkers del Carmel, Abendessen im El Born, Park Güell bei Sonnenuntergang, Flamenco-Show.</span></p>
                  <p><span className="mr-1.5">🍸</span><strong>Singles:</strong> <span className="text-white/80">Barceloneta Beach Bars, El Raval, Gràcia Plazas, Nachtleben im Port Olímpic.</span></p>
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach Barcelona</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 249 € p.P. Direkt beim Veranstalter buchen.</p>
                </div>
                <IbeCta />
              </div>
            </div>

            {/* Month Scroll */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Barcelona nach Monaten</h2>
              <div className="guide-month-scroll print:hidden">
                {MONTHS_DATA.map((month, i) => (
                  <div key={i} className={`guide-month-card rounded-2xl p-4 border-2 transition-all duration-300 ${i === currentMonth ? "border-[#00838F] bg-[#00838F]/5 scale-[1.03] shadow-lg shadow-[#00838F]/15" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{month.emoji}</span>
                      <h3 className="text-xs font-extrabold text-gray-900">{month.label}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{month.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Barcelona zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe className="w-full h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95889.7006608658!2d2.0692495!3d41.3873974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49816718e30e5%3A0x44b0fb3d4f47660a!2sBarcelona%2C%20Spanien!5e0!3m2!1sde!2sde!4v1658835282115!5m2!1sde!2sde" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Land:</span> Spanien <Flag code="es" alt="Spanien" className="ml-1" /></li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Region:</span> Katalonien, Mittelmeerküste</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Hauptstadt:</span> Hauptstadt der autonomen Gemeinschaft Katalonien</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Besonderheit:</span> Barcelona liegt zwischen Meer und Bergen – mit dem Tibidabo (512 m) und dem Montjuïc als natürliche Wahrzeichen der Skyline.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Überblick & Fakten</h2>
              <p className="text-gray-400 text-sm">Alles Wichtige auf einen Blick</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard icon="👥" label="Einwohner" value="~1,6 Mio." />
              <StatCard icon="📐" label="Fläche" value="101 km²" />
              <StatCard icon="🗣️" label="Sprache" value="Katalanisch / Spanisch" />
              <StatCard icon="💶" label="Währung" value="Euro (EUR)" />
              <StatCard icon="🕐" label="Zeitzone" value="UTC+1 / +2 (MESZ)" />
              <StatCard icon="✈️" label="Flughafen" value="BCN El Prat" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Katalanisch und Spanisch (Castellano) sind beide Amtssprachen. In touristischen Gebieten wird Englisch gut verstanden." },
                  { icon: "💶", label: "Währung", text: "Euro (EUR). Kartenzahlung ist fast überall möglich, selbst in kleinen Bars. Bargeld nur für Märkte und kleine Geschäfte nötig." },
                  { icon: "🛂", label: "Einreise", text: "EU-Bürger benötigen nur einen Personalausweis. Schweizer ebenso. Für Nicht-EU-Bürger gelten die Schengen-Bestimmungen – bis zu 90 Tage visumfrei." },
                  { icon: "💧", label: "Trinkwasser", text: "Leitungswasser ist trinkbar, schmeckt aber stark nach Chlor. Die meisten Einheimischen kaufen Flaschenwasser (1,5 L ab 0,30 € im Supermarkt)." },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div><h4 className="font-bold text-gray-900 mb-0.5">{item.label}</h4><p className="text-sm text-gray-600 leading-relaxed">{item.text}</p></div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Klima & Beste Reisezeit</h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">Barcelona hat ein mediterranes Klima mit heißen Sommern und milden Wintern. Beste Reisezeit: Frühling und Herbst.</p>
                  <div className="space-y-3">
                    {[
                      { label: "Frühling", temp: "14–22 °C", w: "70%", color: "bg-emerald-500" },
                      { label: "Sommer", temp: "22–30 °C", w: "95%", color: "bg-amber-500" },
                      { label: "Herbst", temp: "15–24 °C", w: "75%", color: "bg-orange-400" },
                      { label: "Winter", temp: "8–15 °C", w: "40%", color: "bg-sky-500" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <span className="w-16 text-xs font-bold text-gray-700">{s.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                          <div className={`${s.color} h-7 rounded-full flex items-center justify-center text-xs text-white font-bold transition-all duration-500`} style={{ width: s.w }}>{s.temp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🌊</span> Wassertemperatur (Mittelmeer)</h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { m: "Jan", t: "13°" }, { m: "Apr", t: "15°" }, { m: "Jul", t: "25°" }, { m: "Okt", t: "21°" },
                    ].map((w) => (
                      <div key={w.m} className="bg-white rounded-lg p-2 border border-sky-100">
                        <p className="font-bold text-gray-700">{w.m}</p>
                        <p className="text-sky-600 font-extrabold text-base">{w.t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kultur & Besonderheiten</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <p>🎨 <strong>Gaudí & Modernisme:</strong> Barcelona ist untrennbar mit Antoni Gaudí verbunden. Sieben seiner Werke sind UNESCO-Welterbe.</p>
                <p>🏳️ <strong>Katalanische Identität:</strong> Katalonien hat eine eigene Sprache, Kultur und starkes Regionalbewusstsein – Senyera-Flaggen überall.</p>
                <p>⏰ <strong>Essenszeiten:</strong> Mittagessen ab 14:00, Abendessen ab 21:00. Tapas-Bars füllen sich erst ab 20:00.</p>
                <p>🎶 <strong>Feste:</strong> La Mercè (Sept.), Sant Joan (Juni) und die Castellers (Menschentürme) sind einzigartige katalanische Traditionen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte & Kultur</h2>
              <p className="text-gray-400 text-sm">Über 2.000 Jahre Geschichte – von Barcino bis zur Weltstadt</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Zeitstrahl</h3>
                <TimelineItem year="~15 v. Chr." era="Römisches Barcino" text="Die Römer gründen die Kolonie Barcino. Reste der Stadtmauer und des Tempels sind noch im Barri Gòtic sichtbar." color="bg-amber-500" />
                <TimelineItem year="801–1137" era="Grafschaft Barcelona" text="Barcelona wird zum Zentrum der Grafschaft und entwickelt sich zu einer bedeutenden Handelsmacht im westlichen Mittelmeer." color="bg-red-500" />
                <TimelineItem year="13.–15. Jh." era="Goldenes Zeitalter" text="Als Hauptstadt der Krone von Aragón dominiert Barcelona den Mittelmeerhandel. Die gotische Altstadt, die Kathedrale und die Llotja de Mar entstehen." color="bg-purple-500" />
                <TimelineItem year="1850–1900" era="Industrialisierung & Eixample" text="Barcelona industrialisiert sich als erste Stadt Spaniens. Der Ingenieur Ildefons Cerdà entwirft das berühmte Schachbrettmuster des Eixample-Viertels." color="bg-emerald-500" />
                <TimelineItem year="1882–heute" era="Gaudí & Modernisme" text="Antoni Gaudí beginnt 1882 mit der Sagrada Família. Der Modernisme prägt Barcelonas Architektur nachhaltig – Casa Batlló, Park Güell und mehr entstehen." color="bg-blue-500" />
                <TimelineItem year="1992" era="Olympische Spiele" text="Die Olympischen Sommerspiele transformieren Barcelona. Der Hafen, die Strände und das olympische Dorf werden neu gestaltet – die Stadt öffnet sich zum Meer." color="bg-teal-500" />
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2">🏛️ Must-See: Historische Stätten</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>MUHBA (Stadtgeschichtsmuseum)</strong> – Unterirdische römische Ruinen unter dem Barri Gòtic</li>
                    <li><strong>Kathedrale von Barcelona</strong> – Gotische Kathedrale aus dem 13.–15. Jahrhundert</li>
                    <li><strong>Palau de la Música Catalana</strong> – Meisterwerk des Modernisme (UNESCO)</li>
                    <li><strong>Santa Maria del Mar</strong> – Perfekte katalanische Gotik im El Born</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Lokale Etikette</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Begrüßung", text: "Zwei Küsschen auf die Wange (rechts, dann links) unter Bekannten. Handschlag unter Fremden." },
                      { title: "Sprache", text: "Ein \"Bon dia\" (Katalanisch) statt \"Buenos días\" wird sehr geschätzt." },
                      { title: "Essenszeiten", text: "Mittagessen nie vor 14:00, Abendessen nie vor 21:00. Alles andere gilt als touristisch." },
                      { title: "Trinkgeld", text: "Nicht zwingend, aber 5–10% bei zufriedenem Service ist üblich." },
                    ].map((item) => (
                      <div key={item.title}>
                        <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Barcelona heute</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🏙️ Zweitgrößte Stadt Spaniens</li>
                    <li>✈️ ~30 Mio. Touristen pro Jahr</li>
                    <li>🏖️ 4,5 km Stadtstrände</li>
                    <li>🎨 9 UNESCO-Welterbestätten</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ SIGHTS ════ */}
        {activeTab === "sights" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sehen & Erleben</h2>
              <p className="text-gray-400 text-sm">Die besten Sehenswürdigkeiten in Barcelona</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Gaudí & Architektur</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Sagrada Família" desc="Gaudís unvollendetes Meisterwerk – die berühmteste Basilika der Welt. Seit 1882 im Bau, Fertigstellung geplant 2026." mapHref="https://www.google.com/maps/search/?api=1&query=Sagrada+Familia+Barcelona" address="Carrer de Mallorca, 401, 08013 Barcelona" duration="1,5–2 Std." cost="26 € (online)" tip="Unbedingt online Tickets buchen – oft Wochen im Voraus ausverkauft! Türme separat buchbar." />
                <SightCard title="Park Güell" desc="Gaudís bunter Mosaikpark mit fantastischem Panoramablick über die ganze Stadt und das Meer." mapHref="https://www.google.com/maps/search/?api=1&query=Park+Güell+Barcelona" address="08024 Barcelona" duration="1,5–2 Std." cost="10 € (online)" tip="Morgens um 8:00 oder abends ab 17:00 besuchen – weniger Touristen und bestes Licht." />
                <SightCard title="Casa Batlló" desc="Gaudís farbenfrohes Wohnhaus am Passeig de Gràcia. Die Fassade erinnert an Drachenschuppen." mapHref="https://www.google.com/maps/search/?api=1&query=Casa+Batlló+Barcelona" address="Passeig de Gràcia, 43, 08007 Barcelona" duration="1–1,5 Std." cost="35 € (online)" tip="Die Nachttour mit Lichtshow auf der Dachterrasse ist einzigartig." />
                <SightCard title="Casa Milà / La Pedrera" desc="Gaudís letztes ziviles Werk mit wellenförmiger Fassade und surrealer Dachlandschaft." mapHref="https://www.google.com/maps/search/?api=1&query=La+Pedrera+Barcelona" address="Passeig de Gràcia, 92, 08008 Barcelona" duration="1–1,5 Std." cost="25 € (online)" tip="Die Abendshow &quot;La Pedrera Night Experience&quot; mit Projektion auf dem Dach ist spektakulär." />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Altstadt & Klassiker</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Barri Gòtic (Gotisches Viertel)" desc="Verwinkelte mittelalterliche Gassen, die Kathedrale, versteckte Plazas und die ältesten Gebäude der Stadt." mapHref="https://www.google.com/maps/search/?api=1&query=Barri+Gòtic+Barcelona" address="Barri Gòtic, 08002 Barcelona" duration="2–3 Std." cost="Kostenlos" tip="Den Plaça de Sant Felip Neri entdecken – einer der verstecktesten und schönsten Plätze." />
                <SightCard title="La Rambla" desc="Barcelonas berühmteste Flaniermeile vom Plaça de Catalunya bis zum Hafen. Lebhaft, bunt und voller Straßenkünstler." mapHref="https://www.google.com/maps/search/?api=1&query=La+Rambla+Barcelona" address="La Rambla, 08002 Barcelona" duration="1–2 Std." cost="Kostenlos" tip="Auf Taschendiebe achten! Besser die Seitenstraßen erkunden für authentischere Erlebnisse." />
                <SightCard title="Camp Nou (FC Barcelona)" desc="Das legendäre Stadion des FC Barcelona – eines der größten Europas. Museum und Stadion-Tour verfügbar." mapHref="https://www.google.com/maps/search/?api=1&query=Camp+Nou+Barcelona" address="C. d'Arístides Maillol, 08028 Barcelona" duration="2–3 Std." cost="28 € (Tour + Museum)" tip="Derzeit wird das Stadion renoviert – Interims-Spielstätte Montjuïc prüfen." />
                <SightCard title="Montjuïc" desc="Barcelonas Hausberg mit Festung, Gärten, Museen, olympischen Anlagen und der Magischen Fontäne." mapHref="https://www.google.com/maps/search/?api=1&query=Montjuïc+Barcelona" address="Parc de Montjuïc, 08038 Barcelona" duration="Halbtags" cost="Seilbahn 13 €" tip="Freitag/Samstag abends die Licht- und Musikshow der Font Màgica nicht verpassen!" />
                <SightCard title="Mercat de la Boqueria" desc="Der berühmteste Lebensmittelmarkt Europas, direkt an der Rambla. Frische Säfte, Tapas, Meeresfrüchte und Obst." mapHref="https://www.google.com/maps/search/?api=1&query=Mercat+de+la+Boqueria+Barcelona" address="La Rambla, 91, 08001 Barcelona" duration="1–2 Std." cost="Kostenlos (Eintritt)" tip="Vormittags besuchen (vor 11:00). Kein Essen an den Ständen direkt am Eingang – die hinteren sind günstiger." />
              </div>
            </div>
          </div>
        )}

        {/* ════ BEACHES ════ */}
        {activeTab === "beaches" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Strände</h2>
              <p className="text-gray-400 text-sm">4,5 km Stadtstrände und die schönsten Küsten der Umgebung</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Stadtstrände Barcelona</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Barceloneta", desc: "Der bekannteste Stadtstrand – lebhaft, voller Chiringuitos (Strandbars), Volleyball und Menschen. Der klassische Barcelona-Strand.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+de+la+Barceloneta", tip: "Im Sommer extrem voll. Morgens vor 10:00 oder ab 18:00 ist es angenehmer." },
                  { title: "Nova Icària", desc: "Familienfreundlicher Strand neben dem Port Olímpic. Ruhiger als Barceloneta, mit Spielplätzen und guter Infrastruktur.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+de+Nova+Icària+Barcelona", tip: "Perfekt für Familien – flaches Wasser und Rettungsschwimmer." },
                  { title: "Bogatell", desc: "Beliebt bei Einheimischen und Sportlern. Weniger touristisch, sauberer Sand und Beach-Volleyball-Felder.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+del+Bogatell+Barcelona", tip: "Der Lieblingsstrand der Barcelonesen – hier trifft man weniger Touristen." },
                  { title: "Mar Bella", desc: "Alternativer Strand im Viertel Poblenou. Teilweise FKK-Bereich. Beliebt bei jüngerer Crowd und Wassersportlern.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+de+la+Mar+Bella+Barcelona", tip: "Guter Strand zum Windsurfen und Kajakfahren." },
                  { title: "Sant Sebastià", desc: "Am westlichen Ende der Barceloneta. Einer der längsten Stadtstrände mit dem Hotel W als markanter Kulisse.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+de+Sant+Sebastià+Barcelona", tip: "Hier starten viele Segeltouren und Kajak-Ausflüge." },
                ].map((beach) => (
                  <div key={beach.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#00838F]/20 transition-all">
                    <h4 className="font-bold text-gray-900 mb-1.5">🏖️ {beach.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{beach.desc}</p>
                    {beach.tip && <p className="text-xs text-amber-600 font-medium mt-2">💡 {beach.tip}</p>}
                    <MapLink href={beach.mapHref} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Tagesausflüge an die Küste</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Ocata (El Masnou)", desc: "Nur 20 Min. mit dem Rodalies-Zug nördlich von Barcelona. Ruhiger, breiter Sandstrand mit klarem Wasser – der Geheimtipp der Einheimischen.", mapHref: "https://www.google.com/maps/search/?api=1&query=Platja+d'Ocata+El+Masnou", tip: "R1-Zug ab Passeig de Gràcia, Ausstieg El Masnou. Nur 2,50 € mit T-Casual." },
                  { title: "Sitges", desc: "Das charmante Küstenstädtchen 35 Min. südlich. Wunderschöne Strände, malerische Altstadt, lebhafte Atmosphäre und hervorragende Restaurants.", mapHref: "https://www.google.com/maps/search/?api=1&query=Sitges+Strand", tip: "Mittwochs ist Markttag. Die Strände von Sitges sind sauberer und ruhiger als die in Barcelona." },
                ].map((beach) => (
                  <div key={beach.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#00838F]/20 transition-all">
                    <h4 className="font-bold text-gray-900 mb-1.5">🌊 {beach.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{beach.desc}</p>
                    {beach.tip && <p className="text-xs text-amber-600 font-medium mt-2">💡 {beach.tip}</p>}
                    <MapLink href={beach.mapHref} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ DISTRICTS ════ */}
        {activeTab === "districts" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Viertel-Guide</h2>
              <p className="text-gray-400 text-sm">Barcelonas Barrios entdecken – jedes Viertel hat seinen eigenen Charakter</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "Barri Gòtic", badge: "Historisches Zentrum", badgeColor: "amber", desc: "Das mittelalterliche Herz Barcelonas mit verwinkelten Gassen, gotischer Kathedrale, versteckten Plätzen und dem ältesten Gebiet der Stadt. Voller Geschichte, Boutiquen und Tapas-Bars.", vibe: "Historisch, romantisch, touristisch", mapHref: "https://www.google.com/maps/search/?api=1&query=Barri+Gòtic+Barcelona" },
                { name: "El Born / La Ribera", badge: "Trendy & Kreativ", badgeColor: "teal", desc: "Das angesagteste Viertel mit dem Picasso-Museum, Santa Maria del Mar und unzähligen Cocktail-Bars, Boutiquen und Galerien. Perfektes Nachtleben.", vibe: "Hip, lebendig, kulturell", mapHref: "https://www.google.com/maps/search/?api=1&query=El+Born+Barcelona" },
                { name: "El Raval", badge: "Multikulturell", badgeColor: "red", desc: "Barcelonas vielfältigstes Viertel: MACBA (Museum für zeitgenössische Kunst), alternative Bars, internationales Streetfood und das Beste an urbaner Kultur.", vibe: "Alternativ, divers, authentisch", mapHref: "https://www.google.com/maps/search/?api=1&query=El+Raval+Barcelona" },
                { name: "Barceloneta", badge: "Strand & Meer", badgeColor: "blue", desc: "Das ehemalige Fischerviertel direkt am Meer. Enge Gassen, Meeresfrüchte-Restaurants, Chiringuitos am Strand und eine unverwechselbare maritime Atmosphäre.", vibe: "Entspannt, maritim, gesellig", mapHref: "https://www.google.com/maps/search/?api=1&query=Barceloneta+Barcelona" },
                { name: "Eixample", badge: "Gaudí & Modernisme", badgeColor: "green", desc: "Das Schachbrettviertel mit Gaudís Meisterwerken (Casa Batlló, La Pedrera, Sagrada Família), exklusiven Boutiquen und den besten Restaurants der Stadt.", vibe: "Elegant, architektonisch, kosmopolitisch", mapHref: "https://www.google.com/maps/search/?api=1&query=Eixample+Barcelona" },
                { name: "Gràcia", badge: "Lokaler Charme", badgeColor: "amber", desc: "Ehemals eigenständiges Dorf mit eigenem Charakter. Kleine Plazas (Plaça del Sol, Plaça de la Vila), Independent-Shops, Bio-Cafés und das berühmte Festa Major de Gràcia im August.", vibe: "Lokal, bohemian, gemütlich", mapHref: "https://www.google.com/maps/search/?api=1&query=Gràcia+Barcelona" },
                { name: "Montjuïc", badge: "Kultur & Natur", badgeColor: "green", desc: "Barcelonas Hausberg mit der Festung, dem Fundació Joan Miró, olympischen Anlagen, botanischen Gärten und der magischen Fontäne. Ideal für einen Halbtagesausflug.", vibe: "Grün, kulturell, weitläufig", mapHref: "https://www.google.com/maps/search/?api=1&query=Montjuïc+Barcelona" },
                { name: "Poblenou", badge: "Aufstrebend", badgeColor: "teal", desc: "Das ehemalige Industrieviertel wandelt sich zum kreativen Tech-Hub. Street Art, hippe Cafés, Co-Working Spaces und der Rambla del Poblenou – weniger Touristen, viel Charme.", vibe: "Kreativ, ruhig, zukunftsweisend", mapHref: "https://www.google.com/maps/search/?api=1&query=Poblenou+Barcelona" },
              ].map((d) => (
                <div key={d.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#00838F]/20 transition-all">
                  <SectionBadge color={d.badgeColor}>{d.badge}</SectionBadge>
                  <h4 className="font-bold text-lg text-gray-900 mt-3 mb-1">{d.name}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{d.desc}</p>
                  <p className="text-xs text-gray-400"><strong>Vibe:</strong> {d.vibe}</p>
                  <MapLink href={d.mapHref} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ BUDGET ════ */}
        {activeTab === "budget" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Budget & Kosten</h2>
              <p className="text-gray-400 text-sm">Was kostet Barcelona? Preise in Euro (Stand 2026)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { cat: "🏨 Unterkunft / Nacht", items: [
                  { label: "Hostel (Schlafsaal)", price: "20–40 €" },
                  { label: "3-Sterne-Hotel", price: "80–140 €" },
                  { label: "4-Sterne-Hotel", price: "140–250 €" },
                  { label: "Airbnb (Zentrum)", price: "70–150 €" },
                ]},
                { cat: "🍽️ Essen", items: [
                  { label: "Menú del día (Mittagsmenü)", price: "12–18 €" },
                  { label: "Tapas (pro Portion)", price: "4–10 €" },
                  { label: "Abendessen (gehobener)", price: "30–60 €" },
                  { label: "Bocadillo (Baguette)", price: "3–6 €" },
                ]},
                { cat: "🚇 Transport", items: [
                  { label: "T-Casual (10 Fahrten)", price: "11,35 €" },
                  { label: "Einzelfahrt Metro", price: "2,40 €" },
                  { label: "Flughafen-Bus (Aerobus)", price: "7,75 €" },
                  { label: "Taxi Flughafen–Zentrum", price: "39 € (Festpreis)" },
                ]},
                { cat: "🎫 Eintritte", items: [
                  { label: "Sagrada Família", price: "26 €" },
                  { label: "Park Güell", price: "10 €" },
                  { label: "Casa Batlló", price: "35 €" },
                  { label: "Picasso Museum", price: "12 €" },
                ]},
                { cat: "🍺 Getränke", items: [
                  { label: "Caña (kleines Bier)", price: "2–3,50 €" },
                  { label: "Glas Wein", price: "3–5 €" },
                  { label: "Café con leche", price: "1,80–3 €" },
                  { label: "Cocktail", price: "8–14 €" },
                ]},
                { cat: "📱 Sonstiges", items: [
                  { label: "SIM-Karte (Prepaid)", price: "10–20 €" },
                  { label: "Touristensteuer / Nacht", price: "1,70–4 €" },
                  { label: "Sonnencreme (200 ml)", price: "8–12 €" },
                  { label: "Postkarte + Briefmarke", price: "2 €" },
                ]},
              ].map((group) => (
                <div key={group.cat} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">{group.cat}</h4>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.label} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-bold text-gray-900 shrink-0 ml-2">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-3">💡 Tagesbudget-Empfehlung</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="font-bold text-emerald-700 mb-1">🎒 Budget</p>
                  <p className="text-2xl font-extrabold text-gray-900">50–80 €</p>
                  <p className="text-xs text-gray-500 mt-1">Hostel, Menú del día, Metro, kostenlose Sehenswürdigkeiten</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="font-bold text-blue-700 mb-1">🏨 Mittelklasse</p>
                  <p className="text-2xl font-extrabold text-gray-900">120–180 €</p>
                  <p className="text-xs text-gray-500 mt-1">3-Sterne-Hotel, Restaurants, 1–2 Eintritte, Tapas-Tour</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="font-bold text-purple-700 mb-1">✨ Komfort</p>
                  <p className="text-2xl font-extrabold text-gray-900">250+ €</p>
                  <p className="text-xs text-gray-500 mt-1">4-Sterne-Hotel, gehobene Restaurants, alle Top-Attraktionen, Taxi</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten & Tickets</h2>
              <p className="text-gray-400 text-sm">Buche direkt vor Ort oder von zuhause – Touren, Eintrittskarten & Erlebnisse für deinen Barcelona-Urlaub.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "🏛️", label: "Gaudí-Touren", desc: "Architektur-Highlights" },
                { emoji: "🍷", label: "Food & Wein", desc: "Tapas & Verkostungen" },
                { emoji: "⛵", label: "Bootstouren", desc: "Küste & Sonnenuntergang" },
                { emoji: "🚴", label: "Fahrradtouren", desc: "Stadt aktiv erleben" },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                </div>
              ))}
            </div>

            <TiqetsCarousel cityId="66342" cityName="Barcelona" citySlug="barcelona" />
          </div>
        )}

        {/* ════ ROUTES ════ */}
        {activeTab === "routes" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Tagesplanung</h2>
              <p className="text-gray-400 text-sm">Klicke auf einen Tag, um den detaillierten Ablauf zu sehen</p>
            </div>

            {(() => {
              const plans = {
                couples: {
                  label: "Paare & Genießer",
                  emoji: "💕",
                  color: "from-rose-500 to-pink-500",
                  budget: "~400 € p.P.",
                  duration: "5 Tage",
                  highlight: "Romantik, Gaudí & Kulinarik",
                  days: [
                    { day: "Tag 1", title: "Gaudí & Gotisches Viertel", icon: "🏛️", color: "bg-rose-100", dayCost: "~60 €", transport: "Metro + zu Fuß", meals: "Tapas-Mittagessen + Dinner im Born", stops: [
                      { time: "09:00", activity: "Sagrada Família (Tickets vorab gebucht)", icon: "⛪", tip: "Morgens die beste Lichtstimmung durch die bunten Fenster" },
                      { time: "11:30", activity: "Spaziergang durch den Eixample, Modernisme-Fassaden", icon: "🚶" },
                      { time: "13:00", activity: "Tapas-Mittagessen an der Rambla del Poblenou", icon: "🍽️", tip: "Günstiger und authentischer als an der Hauptrambla" },
                      { time: "15:00", activity: "Barri Gòtic erkunden: Kathedrale, Plaça Reial", icon: "🏰" },
                      { time: "17:30", activity: "Café auf dem Plaça de Sant Felip Neri", icon: "☕", tip: "Einer der romantischsten Plätze Barcelonas" },
                      { time: "20:30", activity: "Abendessen im El Born – katalanische Küche", icon: "🌃", tip: "Cal Pep oder Bormujos für ausgezeichnete Tapas" },
                    ]},
                    { day: "Tag 2", title: "Park Güell & Gràcia", icon: "🎨", color: "bg-amber-100", dayCost: "~45 €", transport: "Metro + zu Fuß", meals: "Brunch + Vermouth-Runde", stops: [
                      { time: "08:30", activity: "Park Güell (frühester Slot – weniger Touristen)", icon: "🦎", tip: "Die Eidechse auf der Treppe ist DAS Fotomotiv" },
                      { time: "10:30", activity: "Brunch in Gràcia (Plaça del Sol)", icon: "☕" },
                      { time: "12:00", activity: "Gràcia erkunden: Independent-Shops & Galerien", icon: "🛍️" },
                      { time: "14:00", activity: "Vermouth-Stunde in einer Bar auf dem Plaça de la Vila", icon: "🍷", tip: "Vermouth mit Oliven und Chips – eine katalanische Tradition" },
                      { time: "16:00", activity: "Casa Vicens (Gaudís erstes Haus)", icon: "🏠" },
                      { time: "19:00", activity: "Sonnenuntergang am Bunkers del Carmel", icon: "🌅", tip: "DER beste Aussichtspunkt Barcelonas – Getränke und Snacks mitnehmen" },
                    ]},
                    { day: "Tag 3", title: "Meer, Strand & Romantik", icon: "⛵", color: "bg-blue-100", dayCost: "~70 €", transport: "Zu Fuß + Boot", meals: "Paella am Strand + Cocktails", stops: [
                      { time: "10:00", activity: "Barceloneta-Strand: Schwimmen & Sonne", icon: "🏖️" },
                      { time: "12:30", activity: "Paella-Mittagessen mit Meerblick", icon: "🥘", tip: "La Mar Salada oder Can Paixano für authentische Paella" },
                      { time: "15:00", activity: "Segelboot-Tour entlang der Küste (2 Std.)", icon: "⛵", tip: "Sonnenuntergangstour ab ~40 € p.P. – Cava inklusive" },
                      { time: "18:00", activity: "Spaziergang am Port Olímpic", icon: "🚶" },
                      { time: "20:30", activity: "Cocktails in der Rooftop-Bar des Hotel W", icon: "🍸" },
                    ]},
                    { day: "Tag 4", title: "Casa Batlló & Montjuïc", icon: "🏰", color: "bg-purple-100", dayCost: "~55 €", transport: "Metro + Seilbahn", meals: "Bocadillo-Mittagessen + Dinner", stops: [
                      { time: "09:30", activity: "Casa Batlló – Gaudís Meisterwerk am Passeig de Gràcia", icon: "🏛️" },
                      { time: "11:30", activity: "La Pedrera / Casa Milà besichtigen", icon: "🏠" },
                      { time: "13:00", activity: "Bocadillo und Cerveza in einer lokalen Bar", icon: "🥖" },
                      { time: "15:00", activity: "Seilbahn zum Montjuïc & Festung", icon: "🚡" },
                      { time: "17:00", activity: "Fundació Joan Miró oder Botanischer Garten", icon: "🎨" },
                      { time: "21:00", activity: "Font Màgica Lichtshow (Fr/Sa)", icon: "⛲", tip: "Kostenlos und spektakulär – ab 21:30 im Sommer" },
                    ]},
                    { day: "Tag 5", title: "Tagesausflug & Abschied", icon: "🌊", color: "bg-emerald-100", dayCost: "~50 €", transport: "Rodalies-Zug", meals: "Meeresfrüchte in Sitges", stops: [
                      { time: "09:30", activity: "Zugfahrt nach Sitges (35 Min.)", icon: "🚆" },
                      { time: "10:30", activity: "Altstadt und Kirche am Meer erkunden", icon: "⛪" },
                      { time: "12:00", activity: "Strand und Baden in Sitges", icon: "🏖️" },
                      { time: "14:00", activity: "Meeresfrüchte-Mittagessen in Sitges", icon: "🦐", tip: "Fideuà (Nudelpaella) ist die Spezialität" },
                      { time: "17:00", activity: "Rückfahrt nach Barcelona", icon: "🚆" },
                      { time: "19:30", activity: "Letzter Abend: Tapas-Tour durch El Born", icon: "🍷", tip: "Der perfekte Abschluss – von Bar zu Bar schlendern" },
                    ]},
                  ] as DayPlan[],
                },
                families: {
                  label: "Familien mit Kindern",
                  emoji: "👨‍👩‍👧‍👦",
                  color: "from-blue-500 to-indigo-500",
                  budget: "~500 € (4 Pers.)",
                  duration: "6 Tage",
                  highlight: "Strand, Spaß & Kultur kindgerecht",
                  days: [
                    { day: "Tag 1", title: "Ankommen & Barceloneta", icon: "🏖️", color: "bg-blue-100", dayCost: "~40 €", transport: "Metro", meals: "Pizza + Strandessen", stops: [
                      { time: "10:00", activity: "Ankunft und Einchecken", icon: "🏨" },
                      { time: "12:00", activity: "Barceloneta Strand – Sandburgen & Baden", icon: "🏖️" },
                      { time: "14:00", activity: "Mittagessen am Strand (Chiringuito)", icon: "🍽️" },
                      { time: "16:00", activity: "Spaziergang am Port Olímpic", icon: "🚶" },
                      { time: "18:00", activity: "Eisessen an der Passeig Marítim", icon: "🍦" },
                    ]},
                    { day: "Tag 2", title: "Sagrada Família & Park Güell", icon: "⛪", color: "bg-amber-100", dayCost: "~70 €", transport: "Metro", meals: "Markt-Essen + Restaurant", stops: [
                      { time: "09:00", activity: "Sagrada Família (Online-Tickets!)", icon: "⛪", tip: "Kinder unter 11 sind kostenlos" },
                      { time: "11:30", activity: "Snack auf dem Spielplatz nebenan", icon: "🏞️" },
                      { time: "13:00", activity: "Park Güell erkunden", icon: "🦎", tip: "Kinder lieben die bunten Mosaike und die Eidechse" },
                      { time: "15:00", activity: "Mittagessen in Gràcia", icon: "🍕" },
                      { time: "17:00", activity: "Spielplatz im Parc de la Creueta del Coll", icon: "🛝" },
                    ]},
                    { day: "Tag 3", title: "Aquarium & Hafen", icon: "🐠", color: "bg-cyan-100", dayCost: "~80 €", transport: "Metro + zu Fuß", meals: "Mercat + Abendessen", stops: [
                      { time: "10:00", activity: "Aquarium Barcelona (80 m Unterwassertunnel!)", icon: "🐠", tip: "Der Hai-Tunnel ist ein Highlight für alle Altersgruppen" },
                      { time: "12:30", activity: "Hafen-Spaziergang & Las Golondrinas Boot", icon: "⛵" },
                      { time: "14:00", activity: "Mercat de la Boqueria: frische Smoothies & Obst", icon: "🍓" },
                      { time: "16:00", activity: "La Rambla entlangschlendern", icon: "🚶" },
                      { time: "18:00", activity: "Abendessen im familienfreundlichen Restaurant", icon: "🍽️" },
                    ]},
                    { day: "Tag 4", title: "Tibidabo Freizeitpark", icon: "🎡", color: "bg-rose-100", dayCost: "~60 €", transport: "Tram + Standseilbahn", meals: "Picknick + Restaurant", stops: [
                      { time: "10:00", activity: "Fahrt zum Tibidabo mit Tramvia Blau + Standseilbahn", icon: "🚋", tip: "Die nostalgische Tram ist allein schon ein Erlebnis" },
                      { time: "11:00", activity: "Freizeitpark Tibidabo (Fahrgeschäfte & Aussicht)", icon: "🎡", tip: "Älter als Disneyland! Aussicht über ganz Barcelona" },
                      { time: "14:00", activity: "Picknick auf dem Tibidabo", icon: "🧺" },
                      { time: "16:00", activity: "Rückfahrt und Eis in Sarrià", icon: "🍦" },
                      { time: "18:00", activity: "Spielplatz im Parc de la Ciutadella", icon: "🛝" },
                    ]},
                    { day: "Tag 5", title: "Camp Nou & Strand", icon: "⚽", color: "bg-green-100", dayCost: "~55 €", transport: "Metro", meals: "Hotdog + Strandrestaurant", stops: [
                      { time: "09:30", activity: "Camp Nou Experience (Museum & Stadion-Tour)", icon: "⚽", tip: "Auch für Nicht-Fußballfans beeindruckend" },
                      { time: "12:00", activity: "Mittagessen im Stadionbereich", icon: "🌭" },
                      { time: "14:00", activity: "Nova Icària Strand – der familienfreundlichste Strand", icon: "🏖️" },
                      { time: "17:00", activity: "Wassersport: Kajak oder Paddelboot", icon: "🚣" },
                      { time: "19:00", activity: "Abendessen in Barceloneta", icon: "🍽️" },
                    ]},
                    { day: "Tag 6", title: "Montjuïc & Abschied", icon: "🏰", color: "bg-purple-100", dayCost: "~40 €", transport: "Seilbahn + Metro", meals: "Picknick + Farewell Tapas", stops: [
                      { time: "10:00", activity: "Seilbahn zum Montjuïc – Festung erkunden", icon: "🏰" },
                      { time: "12:00", activity: "Olympisches Stadion & Olympia-Museum", icon: "🏅" },
                      { time: "13:30", activity: "Picknick in den Gärten von Montjuïc", icon: "🧺" },
                      { time: "15:00", activity: "Letzte Souvenirs im Barri Gòtic", icon: "🛍️", tip: "Handgemachte Espadrilles sind ein tolles Mitbringsel" },
                      { time: "18:00", activity: "Farewell-Tapas in El Born", icon: "🍷" },
                    ]},
                  ] as DayPlan[],
                },
                solo: {
                  label: "Solo-Abenteurer",
                  emoji: "🎒",
                  color: "from-violet-500 to-purple-500",
                  budget: "~250 € gesamt",
                  duration: "3 Tage",
                  highlight: "Intensiv, flexibel & authentisch",
                  days: [
                    { day: "Tag 1", title: "Altstadt Deep Dive", icon: "🏛️", color: "bg-violet-100", dayCost: "~50 €", transport: "Zu Fuß", meals: "Boqueria-Snacks + Tapas-Hopping", stops: [
                      { time: "09:00", activity: "Mercat de la Boqueria – Frühstück am Markt", icon: "🍓", tip: "Frischer Saft und Jamón Ibérico zum Start" },
                      { time: "10:30", activity: "Barri Gòtic: Kathedrale, römische Mauer, Plaça del Rei", icon: "🏰" },
                      { time: "12:30", activity: "El Born: Picasso Museum", icon: "🎨", tip: "Sonntags ab 15:00 und jeden 1. Sonntag im Monat kostenlos" },
                      { time: "14:30", activity: "Menú del día in einer lokalen Bar im Raval", icon: "🍽️", tip: "3-Gänge-Menü mit Getränk für 12–15 € – unschlagbar!" },
                      { time: "16:30", activity: "MACBA & Street Art im Raval", icon: "🎨" },
                      { time: "20:00", activity: "Tapas-Hopping: 3–4 Bars im El Born", icon: "🍷", tip: "La Vinya del Senyor für Wein, El Xampanyet für Cava" },
                    ]},
                    { day: "Tag 2", title: "Gaudí-Marathon & Aussichtspunkte", icon: "🏗️", color: "bg-orange-100", dayCost: "~80 €", transport: "Metro + zu Fuß", meals: "Bocadillo + Dinner", stops: [
                      { time: "08:00", activity: "Sagrada Família (erster Slot!)", icon: "⛪" },
                      { time: "10:30", activity: "Passeig de Gràcia: Casa Batlló (Außenansicht reicht)", icon: "🏛️", tip: "Fotos von außen sind kostenlos – drinnen 35 €" },
                      { time: "11:30", activity: "La Pedrera / Casa Milà besichtigen", icon: "🏠" },
                      { time: "13:00", activity: "Bocadillo in einer Bäckerei im Eixample", icon: "🥖" },
                      { time: "14:30", activity: "Park Güell", icon: "🦎" },
                      { time: "17:00", activity: "Bunkers del Carmel – 360°-Panorama", icon: "🌅", tip: "Der ultimative Instagram-Spot Barcelonas" },
                      { time: "19:30", activity: "Abendessen und Nachtleben in Gràcia", icon: "🍻" },
                    ]},
                    { day: "Tag 3", title: "Montjuïc, Strand & Nachtleben", icon: "🌊", color: "bg-teal-100", dayCost: "~45 €", transport: "Seilbahn + Metro", meals: "Markt-Lunch + Bar-Hopping", stops: [
                      { time: "09:30", activity: "Montjuïc Festung & Panoramablick", icon: "🏰" },
                      { time: "11:00", activity: "Fundació Joan Miró", icon: "🎨", tip: "Für Kunstliebhaber ein Muss – moderne Kunst in toller Architektur" },
                      { time: "13:00", activity: "Mittagessen am Mercat de Sant Antoni", icon: "🍽️" },
                      { time: "15:00", activity: "Bogatell Strand – entspannen wie Einheimische", icon: "🏖️" },
                      { time: "18:00", activity: "Street Art Tour durch Poblenou", icon: "🎨" },
                      { time: "20:30", activity: "Bar-Hopping: El Born → Barceloneta Beachbars", icon: "🍸", tip: "Perfekter Solo-Abschluss mit Meerblick und Musik" },
                    ]},
                  ] as DayPlan[],
                },
              };
              type PlanKey = keyof typeof plans;
              const plan = plans[activePlan];
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(Object.keys(plans) as PlanKey[]).map(key => {
                      const p = plans[key];
                      const active = activePlan === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActivePlan(key)}
                          className={`relative rounded-2xl p-5 text-left transition-all cursor-pointer border-2 ${
                            active
                              ? "border-[#00838F] bg-gradient-to-br from-[#00838F]/5 to-[#00838F]/10 shadow-lg shadow-[#00838F]/10"
                              : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-md"
                          }`}
                        >
                          {active && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#00838F] animate-pulse" />}
                          <span className="text-2xl">{p.emoji}</span>
                          <h3 className="text-base font-bold text-gray-900 mt-2">{p.label}</h3>
                          <p className="text-xs text-gray-500 mt-1">{p.highlight}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#00838F]/10 text-[#00838F]">{p.duration}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{p.budget}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{plan.emoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.label}</h3>
                          <p className="text-sm text-gray-500">{plan.duration} &middot; {plan.budget}</p>
                        </div>
                      </div>
                      <SectionBadge color="teal">{plan.highlight}</SectionBadge>
                    </div>

                    <div>
                      {plan.days.map((d, i) => (
                        <DayCard key={i} plan={d} isLast={i === plan.days.length - 1} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <span>💡</span> Spar-Tipps für alle Reisetypen
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Transport", text: "T-Casual (10 Fahrten, 11,35 €) statt Einzeltickets. Metro, Bus, Tram und Rodalies abgedeckt.", icon: "🚇" },
                        { title: "Essen", text: "Menú del día (Tagesmenü) in lokalen Bars: 3 Gänge + Getränk für 12–15 €. Nicht an der Rambla essen!", icon: "🍽️" },
                        { title: "Eintritte", text: "Viele Museen sind am 1. Sonntag im Monat kostenlos. Tickets immer online vorab buchen – günstiger und ohne Schlange.", icon: "🎫" },
                        { title: "Wasser", text: "Wiederverwendbare Flasche mitnehmen – Barcelona hat über 1.600 öffentliche Trinkbrunnen (\"fonts\").", icon: "💧" },
                        { title: "Kostenlos", text: "Barri Gòtic, Barceloneta, Park Güell (außerhalb der Kernzone), Montjuïc-Gärten und viele Plazas sind gratis.", icon: "🆓" },
                        { title: "Geld", text: "Kartenzahlung überall möglich. Keine Wechselgebühren mit einer guten Reisekreditkarte.", icon: "💳" },
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-lg shrink-0">{tip.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{tip.title}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{tip.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ════ INSIDER ════ */}
        {activeTab === "insider" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geheimtipps & Ausflüge</h2>
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das echte Barcelona</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Bunkers del Carmel",
                  badge: "Bester Aussichtspunkt",
                  badgeColor: "red",
                  desc: "Alte Bürgerkriegs-Bunker auf dem Turó de la Rovira mit dem besten 360°-Panorama über Barcelona. Bei Einheimischen beliebt zum Sonnenuntergang – Picknick und Getränke mitnehmen.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Bunkers+del+Carmel+Barcelona",
                  address: "Turó de la Rovira, 08032 Barcelona",
                },
                {
                  title: "Versteckte Plazas in Gràcia",
                  badge: "Lokaler Charme",
                  badgeColor: "green",
                  desc: "Plaça de la Virreina, Plaça del Diamant und Plaça de la Revolució – die gemütlichsten Plätze der Stadt, wo Einheimische auf einen Vermouth einkehren.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Plaça+de+la+Virreina+Barcelona",
                  address: "Gràcia, 08012 Barcelona",
                },
                {
                  title: "Tibidabo & Collserola",
                  badge: "Bergerlebnis",
                  badgeColor: "teal",
                  desc: "Barcelonas Hausberg (512 m) mit nostalgischem Freizeitpark, neogotischer Kirche und Wanderwegen im Collserola-Naturpark. Die Tramvia Blau ist allein eine Attraktion.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Tibidabo+Barcelona",
                  address: "Tibidabo, 08035 Barcelona",
                },
                {
                  title: "Street Art in Poblenou",
                  badge: "Kreativ",
                  badgeColor: "amber",
                  desc: "Das ehemalige Industrieviertel hat sich zum Zentrum der Street-Art-Szene entwickelt. Wandbilder, Galerien und das kreative Zentrum Palo Alto Market (1. Wochenende im Monat).",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Poblenou+Street+Art+Barcelona",
                  address: "Poblenou, 08005 Barcelona",
                },
                {
                  title: "Cementiri de Montjuïc",
                  badge: "Ungewöhnlich",
                  badgeColor: "blue",
                  desc: "Einer der schönsten Friedhöfe Europas, terrassenförmig am Hang des Montjuïc. Beeindruckende Skulpturen, Mausoleen und Panoramablick auf den Hafen.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Cementiri+de+Montjuïc",
                  address: "Mare de Déu de Port, 56, 08038 Barcelona",
                },
                {
                  title: "El Born Centre de Cultura",
                  badge: "Verstecktes Highlight",
                  badgeColor: "green",
                  desc: "Unter der historischen Markthalle wurden Ruinen aus dem Jahr 1714 freigelegt. Kostenloser Eintritt! Der beste Einblick in die katalanische Geschichte.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=El+Born+Centre+Cultural+Barcelona",
                  address: "Plaça Comercial, 12, 08003 Barcelona",
                },
                {
                  title: "Tagesausflug nach Montserrat",
                  badge: "Tagesausflug",
                  badgeColor: "amber",
                  desc: "Das Kloster in den bizarren Felsformationen, 60 km westlich von Barcelona. Zahnradbahn, Wanderwege und die Schwarze Madonna. Ein unvergesslicher Ausflug.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Montserrat+Kloster",
                  address: "08199 Montserrat, Barcelona",
                },
                {
                  title: "Sonnenuntergang am Barceloneta-Wellenbrecher",
                  badge: "Fotogenisch",
                  badgeColor: "red",
                  desc: "Am Ende des Wellenbrechers (Espigó de la Barceloneta) hat man den besten Blick auf die Skyline und das Meer. Wenige Touristen, magische Stimmung.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Espigó+de+la+Barceloneta",
                  address: "Espigó de la Barceloneta, 08003 Barcelona",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-[#00838F]/20 transition-all">
                  <SectionBadge color={item.badgeColor}>{item.badge}</SectionBadge>
                  <h4 className="font-bold text-gray-900 mt-3 mb-1.5">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  <MapLink href={item.mapHref} address={item.address} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ FOOD ════ */}
        {activeTab === "food" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Essen & Trinken</h2>
              <p className="text-gray-400 text-sm">Katalanische Küche, Tapas-Kultur & kulinarische Highlights</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Was du unbedingt probieren musst</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { emoji: "🍞", title: "Pa amb tomàquet", desc: "DAS katalanische Grundnahrungsmittel: geröstetes Brot mit Tomate, Olivenöl und Salz. Zu jedem Essen!", price: "2–4 €" },
                  { emoji: "🥘", title: "Tapas", desc: "Patatas bravas (Kartoffeln mit scharfer Soße), Jamón Ibérico, Pimientos de Padrón, Tortilla – die Klassiker.", price: "4–10 €" },
                  { emoji: "💣", title: "Bombas", desc: "Barcelonas eigene Tapas-Erfindung: frittierte Kartoffelbällchen mit Fleischfüllung und Alioli-Soße.", price: "3–6 €" },
                  { emoji: "🍝", title: "Fideuà", desc: "Die katalanische Paella – mit kurzen Nudeln statt Reis, Meeresfrüchten und Alioli. Unbedingt probieren!", price: "12–18 €" },
                  { emoji: "🍮", title: "Crema catalana", desc: "Der Vorgänger der Crème brûlée! Vanillecreme mit karamellisierter Zuckerkruste. Traditionell am Josepstag (19. März).", price: "4–7 €" },
                  { emoji: "🥂", title: "Cava", desc: "Katalanischer Schaumwein aus dem Penedès. Wird wie Champagner hergestellt, ist aber deutlich günstiger.", price: "3–6 € (Glas)" },
                  { emoji: "🍷", title: "Vermouth (Vermut)", desc: "Vor dem Essen in einer Bar: Vermouth mit Oliven, Chips und Sardellen. Eine heilige katalanische Tradition.", price: "3–5 €" },
                  { emoji: "🥘", title: "Paella", desc: "Die valencianische Spezialität wird auch in Barcelona hervorragend zubereitet – mit Meeresfrüchten, Hähnchen oder gemischt.", price: "14–20 €" },
                  { emoji: "🍓", title: "Boqueria-Markt", desc: "Frische Säfte, Obst, Jamón, Käse und Tapas – der berühmteste Markt Europas ist ein Fest für alle Sinne.", price: "3–10 €" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">{item.price}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant-Empfehlungen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { badge: "Tapas-Institution", badgeColor: "amber", name: "Cal Pep", desc: "Legendäre Tapas-Bar im El Born. Direkt an der Theke sitzen und den Köchen zusehen. Hauptgerichte ab ~20 € p.P.", mapHref: "https://www.google.com/maps/search/?api=1&query=Cal+Pep+Barcelona", address: "Plaça de les Olles, 8, 08003 Barcelona" },
                  { badge: "Authentisch & günstig", badgeColor: "green", name: "Bar del Pla", desc: "Katalanische Tapas mit modernem Twist in gemütlicher Atmosphäre. Menú del día ab 14 €.", mapHref: "https://www.google.com/maps/search/?api=1&query=Bar+del+Pla+Barcelona", address: "Carrer de Montcada, 2, 08003 Barcelona" },
                  { badge: "Meeresfrüchte", badgeColor: "blue", name: "La Mar Salada", desc: "Hervorragende Paella und Fideuà direkt am Hafen in Barceloneta. Mittags Menú del día ab 16 €.", mapHref: "https://www.google.com/maps/search/?api=1&query=La+Mar+Salada+Barcelona", address: "Passeig de Joan de Borbó, 58, 08003 Barcelona" },
                  { badge: "Cava & Tapas", badgeColor: "teal", name: "El Xampanyet", desc: "Seit 1929 die beste Adresse für Cava und katalanische Tapas. Winzige Bar mit unglaublicher Atmosphäre.", mapHref: "https://www.google.com/maps/search/?api=1&query=El+Xampanyet+Barcelona", address: "Carrer de Montcada, 22, 08003 Barcelona" },
                ].map((r) => (
                  <div key={r.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                    <SectionBadge color={r.badgeColor}>{r.badge}</SectionBadge>
                    <p className="text-sm text-gray-700 mt-3"><strong>{r.name}</strong> – {r.desc}</p>
                    <MapLink href={r.mapHref} address={r.address} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Menú del día</p>
                <p className="text-gray-600 text-xs leading-relaxed">Mittags bieten fast alle Bars und Restaurants ein &quot;Menú del día&quot; an: Vorspeise, Hauptgang, Dessert, Brot und Getränk für 12–18 €. Meide die Rambla und die direkten Touristengebiete – in Seitenstraßen und lokalen Bars ist das Essen authentischer und günstiger.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ PRACTICAL ════ */}
        {activeTab === "practical" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Praktische Infos</h2>
              <p className="text-gray-400 text-sm">Alles was du vor und während der Reise wissen musst</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  emoji: "🚇", title: "Transport vor Ort",
                  text: "Metro (8 Linien, fährt bis 24:00, Fr bis 2:00, Sa durchgehend). Bus, Tram und Rodalies-Züge. T-Casual: 10 Fahrten für 11,35 € (Zone 1). Taxis: Gelb-schwarz, ab 2,50 € Grundgebühr.",
                },
                {
                  emoji: "✈️", title: "Anreise & Flughafen",
                  text: "Flughafen El Prat (BCN) liegt 14 km südwestlich. Aerobus (7,75 €, 35 Min. zum Plaça de Catalunya), Metro L9 (5,15 €), Taxi (Festpreis 39 € ins Zentrum). Viele Direktflüge aus DACH ab ~80 € return.",
                },
                {
                  emoji: "🏨", title: "Unterkünfte",
                  text: "Hostels ab 20 €, 3-Sterne ab 80 €, 4-Sterne ab 140 €. Beste Lagen: Eixample, El Born, Gràcia. Touristensteuer: 1,70–4 € pro Nacht zusätzlich.",
                },
                {
                  emoji: "📱", title: "SIM-Karte & Internet",
                  text: "In der EU: Roaming inklusive für EU-Bürger. Für Nicht-EU: Prepaid-SIM von Orange, Vodafone oder Movistar am Flughafen (ab 10 € für 10 GB). Kostenloses WLAN in vielen Cafés und an der Rambla.",
                },
                {
                  emoji: "💰", title: "Trinkgeld",
                  text: "Nicht obligatorisch in Spanien. Üblich: Kleingeld auf dem Tisch (5–10% bei zufriedenem Service). In Bars reicht Aufrunden. Taxifahrer: Aufrunden auf den nächsten Euro.",
                },
                {
                  emoji: "🛡️", title: "Sicherheit & Taschendiebstahl",
                  text: "Barcelona hat ein Taschendiebstahl-Problem, besonders an der Rambla, in der Metro und am Strand. Keine Wertsachen offen tragen, Rucksack nach vorne, Geld verteilt aufbewahren. Ansonsten sehr sichere Stadt.",
                },
                {
                  emoji: "🏥", title: "Gesundheit",
                  text: "Europäische Krankenversicherungskarte (EHIC) gilt. Apotheken (\"Farmàcia\") gut ausgestattet, viele Medikamente rezeptfrei. Bei Notfällen: 112. Krankenhäuser: Hospital Clínic, Hospital del Mar.",
                },
                {
                  emoji: "🏷️", title: "Touristensteuer",
                  text: "Seit 2012 erhebt Barcelona eine Übernachtungssteuer: 1,70 € (Pensionen) bis 4 € (5-Sterne-Hotels) pro Nacht und Person, maximal 7 Nächte. Wird beim Check-in berechnet.",
                },
                {
                  emoji: "🌞", title: "Öffnungszeiten",
                  text: "Siesta beachten: Viele kleine Geschäfte schließen 14:00–17:00. Supermärkte und Einkaufszentren durchgehend geöffnet. Sonntags haben die meisten Geschäfte geschlossen.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LANGUAGE ════ */}
        {activeTab === "language" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sprachhilfe</h2>
              <p className="text-gray-400 text-sm">Grundlegende Spanisch- und Katalanisch-Phrasen für deinen Aufenthalt</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Spanish */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flag code="es" alt="Spanien" /> Spanisch (Castellano)
                </h3>
                <div className="space-y-2">
                  {[
                    { de: "Hallo", es: "¡Hola!", pron: "Ola" },
                    { de: "Guten Tag", es: "Buenos días", pron: "Buenos díjas" },
                    { de: "Tschüss", es: "¡Adiós!", pron: "Adijós" },
                    { de: "Bitte", es: "Por favor", pron: "Por fabór" },
                    { de: "Danke", es: "Gracias", pron: "Gráthias" },
                    { de: "Ja / Nein", es: "Sí / No", pron: "ßi / No" },
                    { de: "Entschuldigung", es: "Perdona", pron: "Perdóna" },
                    { de: "Wie viel kostet das?", es: "¿Cuánto cuesta?", pron: "Kuánto kuesta" },
                    { de: "Die Rechnung, bitte", es: "La cuenta, por favor", pron: "La kuenta por fabór" },
                    { de: "Wo ist …?", es: "¿Dónde está …?", pron: "Dónde está" },
                    { de: "Ich verstehe nicht", es: "No entiendo", pron: "No entiéndo" },
                    { de: "Sprechen Sie Deutsch?", es: "¿Habla alemán?", pron: "Ábla alemán" },
                    { de: "Ein Bier, bitte", es: "Una caña, por favor", pron: "Una kánja por fabór" },
                    { de: "Prost!", es: "¡Salud!", pron: "Salúd" },
                  ].map((phrase) => (
                    <div key={phrase.de} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{phrase.de}</span>
                      <span className="text-sm font-bold text-gray-900 flex-1">{phrase.es}</span>
                      <span className="text-[10px] text-gray-400 italic shrink-0">[{phrase.pron}]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catalan */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🏳️ Katalanisch (Català)
                </h3>
                <div className="space-y-2">
                  {[
                    { de: "Guten Tag", cat: "Bon dia", pron: "Bon díja" },
                    { de: "Guten Abend", cat: "Bona tarda", pron: "Bona tárda" },
                    { de: "Tschüss", cat: "Adéu", pron: "Adéu" },
                    { de: "Bitte", cat: "Si us plau", pron: "ßi us pláu" },
                    { de: "Danke", cat: "Gràcies", pron: "Gráßies" },
                    { de: "Ja / Nein", cat: "Sí / No", pron: "ßi / No" },
                    { de: "Entschuldigung", cat: "Perdoni", pron: "Perdóni" },
                    { de: "Wie viel kostet das?", cat: "Quant costa?", pron: "Kuan kósta" },
                    { de: "Die Rechnung", cat: "El compte", pron: "El kómpte" },
                    { de: "Prost!", cat: "Salut!", pron: "Salút" },
                  ].map((phrase) => (
                    <div key={phrase.de} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{phrase.de}</span>
                      <span className="text-sm font-bold text-gray-900 flex-1">{phrase.cat}</span>
                      <span className="text-[10px] text-gray-400 italic shrink-0">[{phrase.pron}]</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mt-5">
                  <p className="text-sm text-gray-700"><strong>💡 Tipp:</strong> In Barcelona wird Katalanisch sehr geschätzt. Ein einfaches &quot;Bon dia&quot; statt &quot;Buenos días&quot; öffnet Herzen. Die meisten Straßenschilder, Menükarten und Ansagen sind zweisprachig.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ HELP ════ */}
        {activeTab === "help" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Hilfe & Notfall</h2>
              <p className="text-gray-400 text-sm">Wichtige Nummern, Adressen und Anlaufstellen</p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <h3 className="text-xl font-extrabold text-red-700 mb-4 flex items-center gap-2">
                <span>🚨</span> Notrufnummern
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Allgemeiner Notruf", number: "112", desc: "Polizei, Feuerwehr, Rettung" },
                  { label: "Polizei (Policía Nacional)", number: "091", desc: "Für Anzeigen (z.B. Diebstahl)" },
                  { label: "Mossos d'Esquadra", number: "088", desc: "Katalanische Polizei" },
                ].map((item) => (
                  <div key={item.number} className="bg-white rounded-xl p-4 border border-red-100">
                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                    <p className="text-2xl font-extrabold text-red-700 mt-1">{item.number}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🏥</span> Krankenhäuser</h4>
                <div className="space-y-3">
                  {[
                    { name: "Hospital Clínic de Barcelona", address: "Carrer de Villarroel, 170, 08036", mapHref: "https://www.google.com/maps/search/?api=1&query=Hospital+Clinic+Barcelona" },
                    { name: "Hospital del Mar", address: "Passeig Marítim de la Barceloneta, 25, 08003", mapHref: "https://www.google.com/maps/search/?api=1&query=Hospital+del+Mar+Barcelona" },
                    { name: "Hospital de Sant Pau", address: "Carrer de Sant Quintí, 89, 08041", mapHref: "https://www.google.com/maps/search/?api=1&query=Hospital+Sant+Pau+Barcelona" },
                  ].map((h) => (
                    <div key={h.name}>
                      <p className="font-bold text-sm text-gray-900">{h.name}</p>
                      <MapLink href={h.mapHref} address={h.address} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>💊</span> Apotheken</h4>
                <p className="text-sm text-gray-600 mb-3">Apotheken (&quot;Farmàcia&quot;) sind durch ein grünes Kreuz gekennzeichnet. Es gibt immer eine Nacht- und Feiertagsapotheke (&quot;Farmàcia de Guàrdia&quot;) in der Nähe.</p>
                <div className="space-y-2">
                  {[
                    { name: "Farmàcia Alvarez (24 Std.)", address: "Passeig de Gràcia, 26", mapHref: "https://www.google.com/maps/search/?api=1&query=Farmacia+Alvarez+Passeig+Gracia+Barcelona" },
                    { name: "Farmàcia Torres (24 Std.)", address: "Carrer d'Aribau, 62", mapHref: "https://www.google.com/maps/search/?api=1&query=Farmacia+Torres+Aribau+Barcelona" },
                  ].map((p) => (
                    <div key={p.name}>
                      <p className="font-bold text-sm text-gray-900">{p.name}</p>
                      <MapLink href={p.mapHref} address={p.address} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Flag code="de" alt="Deutschland" /> Deutsches Generalkonsulat Barcelona
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Adresse:</strong> Passeig de Gràcia, 111, Àtic, 08008 Barcelona</p>
                  <p><strong>Telefon:</strong> +34 93 292 10 00</p>
                  <p><strong>Notfall außerhalb der Öffnungszeiten:</strong> +49 30 1817 0</p>
                  <p><strong>Öffnungszeiten:</strong> Mo–Fr 9:00–12:00 (nur mit Termin)</p>
                </div>
                <MapLink href="https://www.google.com/maps/search/?api=1&query=Deutsches+Generalkonsulat+Barcelona" address="Passeig de Gràcia, 111, 08008 Barcelona" />
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🔐</span> Diebstahl & Verlust</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Anzeige erstatten:</strong> Comisaría de Policía Nacional, Carrer Nou de la Rambla, 76–78. Oder online unter <em>denuncias.policia.es</em>.</p>
                  <p><strong>Reisepass verloren:</strong> Sofort das deutsche Generalkonsulat kontaktieren. Ein vorläufiger Reisepass kann vor Ort ausgestellt werden.</p>
                  <p><strong>Kreditkarte sperren:</strong> Sperr-Notruf aus dem Ausland: +49 116 116</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ FOOTER CTA ═══════════════ */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
          <div>
            <h3 className="text-xl font-extrabold mb-1">Bereit für deinen Barcelona-Urlaub?</h3>
            <p className="text-white/70 text-sm">Jetzt tagesaktuelle Pauschalreisen, Städtereisen & Last-Minute Deals vergleichen und günstig buchen.</p>
          </div>
          <Link href="/urlaubsziele/barcelona/" className="bg-white text-[#00838F] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 shadow-sm">
            Barcelona Angebote ansehen →
          </Link>
        </div>

      </main>
    </div>
  );
}
