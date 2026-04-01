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
  { label: "Januar", emoji: "🍊", text: "Mild, ruhig. Mandelbaumblüte beginnt – ein Naturschauspiel." },
  { label: "Februar", emoji: "🌸", text: "Mandelblüte in voller Pracht. Ideal für Wanderungen in der Tramuntana." },
  { label: "März", emoji: "⛰️", text: "Frühling erwacht. Perfekt für Radtouren und Sightseeing." },
  { label: "April", emoji: "🌿", text: "Angenehm warm, alles grün. Top-Zeit für Aktivurlaub." },
  { label: "Mai", emoji: "🏖️", text: "Vorsaison. Warm genug zum Baden, noch nicht überfüllt." },
  { label: "Juni", emoji: "⛵", text: "Sommerbeginn. Ideal für Bootsausflüge und Strandtage." },
  { label: "Juli", emoji: "☀️", text: "Hochsommer. Heiß, perfekt für Strand und Wassersport." },
  { label: "August", emoji: "🌊", text: "Heißester Monat. Strand, Meer und Fiestas." },
  { label: "September", emoji: "🌅", text: "Nachsaison. Noch warm, weniger Trubel, günstiger." },
  { label: "Oktober", emoji: "🏞️", text: "Angenehm mild. Ideal für Wanderungen und Weinlese." },
  { label: "November", emoji: "🚶‍♂️", text: "Ruhig, oft sonnig. Perfekt für Kulturausflüge." },
  { label: "Dezember", emoji: "☕", text: "Mild & besinnlich. Weihnachtsmärkte in Palma." },
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

function IbeCta({ label = "Angebote suchen →" }: { label?: string }) {
  return (
    <button
      onClick={() => {
        const url = "https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=133";
        const fn = (window as any).ibeOpenBooking;
        if (typeof fn === "function") fn(url, "Pauschalreisen nach Mallorca");
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

export default function MallorcaGuide() {
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
          "https://api.open-meteo.com/v1/forecast?latitude=39.6953&longitude=3.0176&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Madrid"
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
            <span className="text-white font-medium">Mallorca</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Mallorca Reiseführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">2026</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                Dein umfassender Guide für den perfekten Balearen-Urlaub – Strände, Serra de Tramuntana & praktische Infos.
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
                  Wetter in Mallorca
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
                    { icon: "🌸", season: "Frühling (Apr–Mai)", desc: "Mandelblüte, Wandern, angenehm warm." },
                    { icon: "☀️", season: "Sommer (Jun–Sep)", desc: "Strandurlaub pur, heiß & trocken." },
                    { icon: "🍂", season: "Herbst (Okt–Nov)", desc: "Mild, weniger Touristen, Weinlese." },
                    { icon: "❄️", season: "Winter (Dez–Mär)", desc: "Ruhig, Mandelblüte ab Januar." },
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
                  <p><span className="mr-1.5">🥇</span><strong>Erstbesucher:</strong> <span className="text-white/80">Kathedrale La Seu, Altstadt Palma, Es Trenc, Serra de Tramuntana, Cap de Formentor.</span></p>
                  <p><span className="mr-1.5">👨‍👩‍👧‍👦</span><strong>Familien:</strong> <span className="text-white/80">Playa de Muro, Palma Aquarium, Cuevas del Drach, Katmandu Park, Tren de Sóller.</span></p>
                  <p><span className="mr-1.5">💕</span><strong>Paare:</strong> <span className="text-white/80">Deià, Valldemossa, Sonnenuntergang am Cap, Weingut-Tour, Abendessen in Palma.</span></p>
                  <p><span className="mr-1.5">🍸</span><strong>Singles:</strong> <span className="text-white/80">El Arenal, Magaluf, Santa Catalina Bars, Beach Clubs, Bootspartys.</span></p>
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach Mallorca</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 349 € p.P. Direkt beim Veranstalter buchen.</p>
                </div>
                <IbeCta />
              </div>
            </div>

            {/* Month Scroll */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Mallorca nach Monaten</h2>
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Mallorca zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe className="w-full h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d390908.71407658606!2d2.6348985!3d39.6149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297b80e1e6d2a5d%3A0x64b2a8b84b041e05!2sMallorca!5e0!3m2!1sde!2sde!4v1658835282115!5m2!1sde!2sde" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Land:</span> Spanien <Flag code="es" alt="Spanien" className="ml-1" /></li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Region:</span> Balearen, westliches Mittelmeer</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Hauptstadt:</span> Palma de Mallorca</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Besonderheit:</span> Größte Baleareninsel mit vielfältiger Landschaft – von der Serra de Tramuntana (UNESCO) über Traumstrände bis zur pulsierenden Hauptstadt Palma.</li>
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
              <StatCard icon="👥" label="Einwohner" value="~920.000" />
              <StatCard icon="📐" label="Fläche" value="3.640 km²" />
              <StatCard icon="🗣️" label="Sprache" value="Spanisch / Katalanisch" />
              <StatCard icon="💶" label="Währung" value="Euro (EUR)" />
              <StatCard icon="🕐" label="Zeitzone" value="UTC+1 / +2 (MESZ)" />
              <StatCard icon="🏛️" label="Hauptstadt" value="Palma" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Amtssprachen sind Spanisch (Castellano) und Katalanisch (Mallorquín). In Touristengebieten wird verbreitet Deutsch und Englisch gesprochen." },
                  { icon: "💶", label: "Währung", text: "Euro (EUR). Bargeld und Karten werden überall akzeptiert. Geldautomaten sind flächendeckend verfügbar." },
                  { icon: "🛂", label: "Einreise", text: "Für EU-Bürger: Personalausweis genügt. Kein Visum erforderlich. Mallorca gehört zum Schengen-Raum." },
                  { icon: "💧", label: "Trinkwasser", text: "Leitungswasser ist trinkbar, hat aber einen hohen Kalkgehalt. Flaschenwasser wird zum Trinken empfohlen (0,5l ab 0,50 €)." },
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
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">Mallorca hat ein mediterranes Klima mit heißen, trockenen Sommern und milden Wintern. Beste Reisezeit: Mai–Juni und September–Oktober.</p>
                  <div className="space-y-3">
                    {[
                      { label: "Frühling", temp: "15–23 °C", w: "65%", color: "bg-emerald-500" },
                      { label: "Sommer", temp: "25–33 °C", w: "100%", color: "bg-amber-500" },
                      { label: "Herbst", temp: "16–26 °C", w: "70%", color: "bg-orange-400" },
                      { label: "Winter", temp: "8–15 °C", w: "35%", color: "bg-sky-500" },
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
                      { m: "Jan", t: "14°" }, { m: "Apr", t: "16°" }, { m: "Jul", t: "26°" }, { m: "Okt", t: "23°" },
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
                <p>🎭 <strong>Feste:</strong> Die Nit de Sant Joan (23. Juni) wird mit Feuer und Strand gefeiert. Im Januar lockt die Sant-Antoni-Fiesta mit Teufelsumzügen.</p>
                <p>🍷 <strong>Wein:</strong> Mallorca hat hervorragende Weinregionen – Binissalem und Pla i Llevant. Lokale Rebsorten wie Manto Negro und Prensal entdecken!</p>
                <p>🏔️ <strong>UNESCO:</strong> Die Serra de Tramuntana ist seit 2011 UNESCO-Weltkulturerbe – eine einzigartige Kulturlandschaft.</p>
                <p>👋 <strong>Begrüßung:</strong> Ein freundliches &quot;Hola&quot; oder &quot;Bon dia&quot; (Katalanisch) öffnet Türen. Mallorquiner schätzen es, wenn Gäste die lokale Sprache versuchen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte & Kultur</h2>
              <p className="text-gray-400 text-sm">Von den Römern bis heute – eine Insel mit über 2.000 Jahren Geschichte</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Zeitstrahl</h3>
                <TimelineItem year="123 v. Chr." era="Römische Eroberung" text="Quintus Caecilius Metellus erobert die Balearen. Die Römer gründen Palma und Pollentia (Alcúdia) und bringen Weinbau und Olivenkultur auf die Insel." color="bg-amber-500" />
                <TimelineItem year="903" era="Maurische Herrschaft" text="Die Mauren erobern Mallorca und prägen die Insel über 300 Jahre. Bewässerungssysteme, Architektur und Ortsnamen tragen bis heute arabische Spuren." color="bg-emerald-500" />
                <TimelineItem year="1229" era="Reconquista – König Jaume I." text="König Jaume I. von Aragón erobert Mallorca zurück. Er lässt die Kathedrale La Seu errichten – sie wird zum Wahrzeichen der Insel." color="bg-red-500" />
                <TimelineItem year="1715" era="Spanische Zentralisierung" text="Nach dem Spanischen Erbfolgekrieg verliert Mallorca seine Autonomie. Kastilisch wird als Amtssprache eingeführt." color="bg-purple-500" />
                <TimelineItem year="1960er" era="Tourismus-Boom" text="Der internationale Tourismus erreicht Mallorca. In wenigen Jahren entstehen tausende Hotels, besonders an der Playa de Palma und in Magaluf." color="bg-blue-500" />
                <TimelineItem year="Heute" era="Nachhaltiger Qualitätstourismus" text="Mallorca setzt auf nachhaltigen Tourismus, Naturschutz und kulturelle Vielfalt. Die Insel zieht jährlich über 14 Millionen Besucher an." color="bg-teal-500" />
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2">🏛️ Must-See: Historische Stätten</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>Kathedrale La Seu</strong> – Gotisches Meisterwerk am Hafen von Palma</li>
                    <li><strong>Castell de Bellver</strong> – Einzige runde Burg Spaniens (14. Jh.)</li>
                    <li><strong>Alcúdia Altstadt</strong> – Mittelalterliche Stadtmauer komplett erhalten</li>
                    <li><strong>Palau de l&apos;Almudaina</strong> – Königspalast aus maurischer Zeit</li>
                    <li><strong>Pollentia</strong> – Römische Ruinenstadt bei Alcúdia</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Lokale Etikette</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Siesta", text: "Zwischen 14 und 17 Uhr schließen viele Geschäfte. Einplanen!" },
                      { title: "Essenszeiten", text: "Mittagessen ab 13:30, Abendessen ab 20:30 – deutlich später als in Deutschland." },
                      { title: "Strand-Etikette", text: "FKK nur an ausgewiesenen Stränden. Badekleidung gehört an den Strand, nicht in die Stadt." },
                      { title: "Trinkgeld", text: "5–10% im Restaurant sind üblich, aber kein Muss." },
                    ].map((item) => (
                      <div key={item.title}>
                        <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Mallorca heute</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🏙️ Größte Insel der Balearen</li>
                    <li>✈️ ~14 Mio. Touristen pro Jahr</li>
                    <li>🏖️ 300+ Sonnentage im Jahr</li>
                    <li>🏔️ Serra de Tramuntana: UNESCO-Welterbe</li>
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
              <p className="text-gray-400 text-sm">Die besten Sehenswürdigkeiten auf Mallorca</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Kultur & Architektur</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Kathedrale La Seu" desc="Das gotische Wahrzeichen Palmas direkt am Meer. Beeindruckende Rosette und Gaudí-Elemente im Inneren." mapHref="https://www.google.com/maps/search/?api=1&query=Catedral+de+Mallorca+Palma" address="Plaça de la Seu, 07001 Palma" duration="1–2 Std." cost="~9 €" tip="Am frühen Morgen besuchen – dann fällt das Licht durch die Rosette ins Innere." />
                <SightCard title="Castell de Bellver" desc="Die einzige runde Burg Spaniens mit Panoramablick über Palma und die Bucht." mapHref="https://www.google.com/maps/search/?api=1&query=Castell+de+Bellver+Palma" address="Carrer Camilo José Cela, 07014 Palma" duration="1–2 Std." cost="~4 €" tip="Sonntags ist der Eintritt oft kostenlos." />
                <SightCard title="Altstadt Alcúdia" desc="Komplett erhaltene mittelalterliche Stadtmauer. Dienstags und sonntags großer Markt." mapHref="https://www.google.com/maps/search/?api=1&query=Alcudia+Old+Town+Mallorca" address="07400 Alcúdia" duration="2–3 Std." cost="Kostenlos" tip="Marktdienstag lohnt sich besonders – aber früh kommen!" />
                <SightCard title="Valldemossa" desc="Das malerische Bergdorf in der Tramuntana, in dem Chopin und George Sand den Winter 1838/39 verbrachten." mapHref="https://www.google.com/maps/search/?api=1&query=Valldemossa+Mallorca" address="07170 Valldemossa" duration="2–3 Std." cost="~4 € (Kartause)" tip="Die Coca de Patata in einer der Bäckereien probieren – eine Spezialität!" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Natur & Abenteuer</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Serra de Tramuntana" desc="UNESCO-Welterbe: Spektakuläre Berglandschaft mit Wanderwegen, Schluchten und Aussichtspunkten." mapHref="https://www.google.com/maps/search/?api=1&query=Serra+de+Tramuntana+Mallorca" duration="Halbtags–Ganztags" cost="Kostenlos" tip="Der GR 221 (Trockenmauerweg) ist der beste Fernwanderweg der Insel." />
                <SightCard title="Cap de Formentor" desc="Die nördlichste Spitze Mallorcas mit atemberaubenden Klippen und dem berühmten Leuchtturm." mapHref="https://www.google.com/maps/search/?api=1&query=Cap+de+Formentor+Mallorca" address="07460 Pollença" duration="2–3 Std." cost="Kostenlos" tip="Im Sommer ist die Zufahrt nur per Bus möglich (ab Port de Pollença)." />
                <SightCard title="Cuevas del Drach (Drachenhöhlen)" desc="Spektakuläre Tropfsteinhöhlen mit unterirdischem See und klassischem Konzert." mapHref="https://www.google.com/maps/search/?api=1&query=Cuevas+del+Drach+Porto+Cristo" address="Ctra. Cuevas, 07680 Porto Cristo" duration="1–2 Std." cost="~16 €" tip="Tickets online vorab kaufen – vor Ort oft ausverkauft." />
                <SightCard title="Tren de Sóller (Roter Blitz)" desc="Historische Schmalspurbahn von Palma nach Sóller durch 13 Tunnel und über ein Viadukt." mapHref="https://www.google.com/maps/search/?api=1&query=Tren+de+Soller+Palma" address="Plaça d'Espanya, 07002 Palma" duration="1 Std. (einfach)" cost="~25 € (Hin+Rück)" tip="Platz auf der linken Seite wählen – bessere Aussicht auf die Berge." />
              </div>
            </div>
          </div>
        )}

        {/* ════ BEACHES ════ */}
        {activeTab === "beaches" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Die schönsten Strände</h2>
              <p className="text-gray-400 text-sm">Von langen Sandstränden bis versteckten Buchten</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Lange Sandstrände</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Playa de Muro" desc="6 km langer, flach abfallender Sandstrand mit kristallklarem Wasser – perfekt für Familien mit Kindern." mapHref="https://www.google.com/maps/search/?api=1&query=Playa+de+Muro+Mallorca" duration="Halbtags–Ganztags" cost="Liege ab 8 €" tip="Der Abschnitt beim Es Comú Naturstrand ist ruhiger und naturbelassener." />
                <SightCard title="Es Trenc" desc="Der berühmteste Naturstrand Mallorcas: weißer Sand, türkises Wasser und Dünenlandschaft." mapHref="https://www.google.com/maps/search/?api=1&query=Es+Trenc+Beach+Mallorca" duration="Halbtags–Ganztags" cost="Parkplatz 7 €" tip="Früh kommen – der Parkplatz ist ab 11 Uhr voll. Alternativ per Rad." />
                <SightCard title="Cala Millor" desc="Beliebter 1,8 km langer Strand mit Strandpromenade, ideal für einen entspannten Strandtag." mapHref="https://www.google.com/maps/search/?api=1&query=Cala+Millor+Mallorca" duration="Halbtags–Ganztags" cost="Liege ab 8 €" tip="Viele Wassersport-Angebote direkt am Strand." />
                <SightCard title="Playa de Palma" desc="Langer Stadtstrand nahe Palma mit guter Infrastruktur, Bars und Restaurants." mapHref="https://www.google.com/maps/search/?api=1&query=Playa+de+Palma+Mallorca" duration="Halbtags" cost="Liege ab 10 €" tip="Der Abschnitt bei Can Pastilla ist ruhiger als der bei El Arenal." />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Buchten & Geheimtipps</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Cala Mondragó" desc="Bilderbuch-Bucht im Naturpark mit türkisem Wasser, umgeben von Pinienwald." mapHref="https://www.google.com/maps/search/?api=1&query=Cala+Mondrago+Mallorca" duration="Halbtags–Ganztags" cost="Kostenlos" tip="Zwei Buchten nebeneinander – S'Amarador ist etwas ruhiger." />
                <SightCard title="Cala Varques" desc="Versteckte Bucht mit türkisem Wasser – nur über einen 20-minütigen Fußweg erreichbar." mapHref="https://www.google.com/maps/search/?api=1&query=Cala+Varques+Mallorca" duration="Halbtags" cost="Kostenlos" tip="Essen und Trinken mitbringen – es gibt keine Infrastruktur." />
                <SightCard title="Cala Agulla" desc="Wunderschöne Bucht bei Cala Ratjada mit feinem Sand und Pinienhintergrund." mapHref="https://www.google.com/maps/search/?api=1&query=Cala+Agulla+Mallorca" duration="Halbtags" cost="Liege ab 8 €" tip="Idealer Ausgangspunkt für Küstenwanderungen." />
                <SightCard title="Cala d'Or" desc="Mehrere kleine, geschützte Buchten im gleichnamigen Ort – ideal zum Schnorcheln." mapHref="https://www.google.com/maps/search/?api=1&query=Cala+d%27Or+Mallorca" duration="Halbtags" cost="Liege ab 10 €" tip="Cala Gran und Cala Esmeralda sind die schönsten der kleinen Buchten." />
              </div>
            </div>
          </div>
        )}

        {/* ════ DISTRICTS ════ */}
        {activeTab === "districts" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Viertel-Guide</h2>
              <p className="text-gray-400 text-sm">Die wichtigsten Orte und Regionen auf Mallorca</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "Palma Altstadt", vibe: "Kultur, Shopping, Gastronomie", desc: "Das pulsierende Herz Mallorcas mit der Kathedrale, engen Gassen, Boutiquen und erstklassigen Restaurants.", tip: "Die Gegend um die Plaça Major und den Passeig del Born erkunden." },
                { name: "Santa Catalina", vibe: "Hipster-Viertel, Markthalle, Nightlife", desc: "Das trendigste Viertel Palmas mit dem berühmten Mercat de Santa Catalina, Craft-Beer-Bars und internationaler Küche.", tip: "Samstags morgens die Markthalle besuchen – frische Tapas und lokale Produkte." },
                { name: "El Arenal", vibe: "Party, All-Inclusive, Strandleben", desc: "Das bekannteste Touristenviertel mit der Playa de Palma, Bierkönig und Mega Park. Lebhaft und laut.", tip: "Wer Ruhe sucht, sollte eher die östlichen Abschnitte der Playa wählen." },
                { name: "Puerto de Alcúdia", vibe: "Familien, ruhige Strände", desc: "Familienfreundlicher Ferienort mit flach abfallendem Strand und guter Infrastruktur am Naturpark S'Albufera.", tip: "Unbedingt die Altstadt von Alcúdia besuchen – nur 3 km entfernt." },
                { name: "Cala Ratjada", vibe: "Strandleben, Wandern, Nachtleben", desc: "Beliebter Ort im Nordosten mit der traumhaften Cala Agulla und einem lebhaften Hafen.", tip: "Wanderung zum Leuchtturm Punta de Capdepera für einen grandiosen Ausblick." },
                { name: "Sóller & Port de Sóller", vibe: "Romantik, Wandern, Genuss", desc: "Charmantes Bergtal-Städtchen mit dem historischen Tren de Sóller und einer malerischen Hafenbucht.", tip: "Mit dem Roten Blitz von Palma anreisen – eine der schönsten Bahnstrecken Europas." },
                { name: "Pollença", vibe: "Kunst, Ruhe, Wandern", desc: "Kulturell reiches Städtchen am Fuß der Tramuntana mit dem berühmten Kalvarienberg (365 Stufen).", tip: "Sonntags findet der große Wochenmarkt statt – einer der besten der Insel." },
                { name: "Deià", vibe: "Künstlerdorf, Luxus, Natur", desc: "Malerisches Bergdorf, das Künstler und Schriftsteller seit Jahrzehnten anzieht. Robert Graves lebte hier.", tip: "Wanderung zur Cala Deià – kleine Felsenbucht mit Restaurant direkt am Meer." },
              ].map((d) => (
                <div key={d.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <h4 className="font-bold text-gray-900 text-lg">{d.name}</h4>
                  <p className="text-xs text-[#00838F] font-semibold mt-0.5">{d.vibe}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{d.desc}</p>
                  <p className="text-xs text-amber-600 font-medium mt-2">💡 {d.tip}</p>
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
              <p className="text-gray-400 text-sm">Was kostet ein Urlaub auf Mallorca?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { level: "Budget", range: "50–80 €/Tag", color: "bg-emerald-500", items: ["Hostel/Pension: 30–50 €", "Menü del Día: 10–14 €", "Bus-Fahrschein: 2–5 €", "Strand: kostenlos", "Bier (0,5l): 2,50–4 €"] },
                { level: "Mittelklasse", range: "100–180 €/Tag", color: "bg-blue-500", items: ["3★-Hotel: 70–120 €", "Restaurant: 20–35 €", "Mietwagen: 25–40 €/Tag", "Bootstour: 40–60 €", "Cocktail: 8–12 €"] },
                { level: "Luxus", range: "250+ €/Tag", color: "bg-purple-500", items: ["5★-Hotel/Finca: 200–500 €", "Fine Dining: 60–120 €", "Yacht-Charter: ab 400 €", "Spa & Wellness: 80–150 €", "Weintour privat: 100–200 €"] },
              ].map((b) => (
                <div key={b.level} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`${b.color} text-white p-4 text-center`}>
                    <h4 className="font-extrabold text-lg">{b.level}</h4>
                    <p className="text-white/80 text-sm">{b.range}</p>
                  </div>
                  <ul className="p-5 space-y-2 text-sm text-gray-600">
                    {b.items.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-[#00838F] font-bold">•</span>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-3">💡 Spartipps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p>🍽️ <strong>Menú del Día:</strong> Viele Restaurants bieten mittags ein 3-Gänge-Menü inkl. Getränk für 10–15 € an.</p>
                <p>🚌 <strong>TIB-Busse:</strong> Das öffentliche Busnetz ist günstig und gut ausgebaut. Interbus-Karte spart zusätzlich.</p>
                <p>🏖️ <strong>Strände:</strong> Alle Strände sind öffentlich und kostenlos – Liege und Schirm kann man sich sparen.</p>
                <p>🍷 <strong>Supermärkte:</strong> Eroski und Mercadona bieten gute lokale Produkte zu fairen Preisen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten & Tickets</h2>
              <p className="text-gray-400 text-sm">Buche direkt vor Ort oder von zuhause – Touren, Eintrittskarten & Erlebnisse für deinen Mallorca-Urlaub.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "⛵", label: "Bootstouren", desc: "Buchten & Küste" },
                { emoji: "🚴", label: "Radtouren", desc: "Tramuntana & Küste" },
                { emoji: "🤿", label: "Wassersport", desc: "Tauchen & Schnorcheln" },
                { emoji: "🍷", label: "Wein & Kulinarik", desc: "Weingüter & Tapas" },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                </div>
              ))}
            </div>

            <TiqetsCarousel cityId="65915" cityName="Mallorca" citySlug="mallorca" />
          </div>
        )}

        {/* ════ ROUTES ════ */}
        {activeTab === "routes" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Tagesplanung</h2>
              <p className="text-gray-400 text-sm">Klicke auf einen Tag, um den detaillierten Ablauf zu sehen</p>
            </div>

            {/* Plan-Auswahl */}
            <div className="flex flex-wrap gap-3">
              {([
                { key: "couples" as const, label: "Paare & Genießer", emoji: "💕", color: "from-rose-500 to-pink-500", budget: "~400 € p.P.", duration: "5 Tage", highlight: "Kultur, Romantik & Genuss" },
                { key: "families" as const, label: "Familien", emoji: "👨‍👩‍👧‍👦", color: "from-blue-500 to-indigo-500", budget: "~600 € (Fam.)", duration: "5 Tage", highlight: "Strand, Spaß & Natur" },
                { key: "solo" as const, label: "Solo-Abenteurer", emoji: "🎒", color: "from-amber-500 to-orange-500", budget: "~300 € p.P.", duration: "5 Tage", highlight: "Wandern, Entdecken & Freiheit" },
              ]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePlan(p.key)}
                  className={`flex items-center gap-3 rounded-2xl px-5 py-3 border-2 transition-all duration-300 cursor-pointer ${
                    activePlan === p.key
                      ? "border-[#00838F] bg-[#00838F]/5 shadow-lg shadow-[#00838F]/10"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-400">{p.duration} · {p.budget}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Plan Content */}
            <div className="bg-gray-50 rounded-2xl p-5 sm:p-8 border border-gray-100">
              {activePlan === "couples" && (
                <div className="space-y-0">
                  {([
                    { day: "Tag 1", title: "Palma Altstadt & Kathedrale", icon: "🏛️", color: "bg-rose-100", dayCost: "~60 €", transport: "Zu Fuß durch Palma", meals: "Tapas-Mittag + Rooftop-Dinner", stops: [
                      { time: "09:00", activity: "Kathedrale La Seu besichtigen", icon: "🏛️", tip: "Morgens, wenn das Licht durch die Rosette fällt" },
                      { time: "11:00", activity: "Palau de l'Almudaina erkunden", icon: "🏰" },
                      { time: "13:00", activity: "Tapas in Santa Catalina", icon: "🍽️", tip: "Mercat de Santa Catalina für authentische Tapas" },
                      { time: "15:00", activity: "Passeig del Born & Boutiquen", icon: "🛍️" },
                      { time: "18:00", activity: "Castell de Bellver bei Sonnenuntergang", icon: "🌅", tip: "Panoramablick über die gesamte Bucht von Palma" },
                      { time: "20:30", activity: "Dinner in der Altstadt", icon: "🌃" },
                    ]},
                    { day: "Tag 2", title: "Tramuntana & Valldemossa", icon: "⛰️", color: "bg-amber-100", dayCost: "~70 €", transport: "Mietwagen", meals: "Café in Valldemossa + Fischrestaurant Deià", stops: [
                      { time: "09:00", activity: "Fahrt nach Valldemossa", icon: "🚗" },
                      { time: "10:00", activity: "Kartause von Valldemossa besichtigen", icon: "🏛️", tip: "Hier lebten Chopin & George Sand im Winter 1838/39" },
                      { time: "12:00", activity: "Coca de Patata & Kaffee", icon: "☕", tip: "Lokale Spezialität, unbedingt probieren!" },
                      { time: "13:30", activity: "Weiterfahrt nach Deià", icon: "🚗" },
                      { time: "14:00", activity: "Mittagessen in Deià", icon: "🍽️" },
                      { time: "16:00", activity: "Wanderung zur Cala Deià", icon: "🏖️", tip: "20 Min. Abstieg – kleine Bucht mit Restaurant am Meer" },
                      { time: "19:00", activity: "Sonnenuntergang auf der Rückfahrt", icon: "🌅" },
                    ]},
                    { day: "Tag 3", title: "Sóller & Bootstour", icon: "⛵", color: "bg-blue-100", dayCost: "~80 €", transport: "Tren de Sóller + Boot", meals: "Hafen-Lunch + Tapas-Dinner", stops: [
                      { time: "09:00", activity: "Tren de Sóller ab Palma (Roter Blitz)", icon: "🚂", tip: "Links sitzen für die bessere Aussicht!" },
                      { time: "10:15", activity: "Sóller Marktplatz & Kirche", icon: "🏘️" },
                      { time: "11:00", activity: "Straßenbahn nach Port de Sóller", icon: "🚋" },
                      { time: "12:00", activity: "Bootstour entlang der Küste", icon: "⛵" },
                      { time: "14:00", activity: "Fisch-Mittagessen am Hafen", icon: "🐟" },
                      { time: "16:00", activity: "Baden in Port de Sóller", icon: "🏖️" },
                      { time: "19:00", activity: "Rückfahrt nach Palma", icon: "🚗" },
                    ]},
                    { day: "Tag 4", title: "Weingut-Tour & Es Trenc", icon: "🍷", color: "bg-purple-100", dayCost: "~90 €", transport: "Mietwagen", meals: "Weingut-Degustation + Strand-Restaurant", stops: [
                      { time: "10:00", activity: "Weingut in Binissalem besuchen", icon: "🍷", tip: "José L. Ferrer oder Macià Batle – Verkostung ab 15 €" },
                      { time: "12:30", activity: "Fahrt zum Es Trenc Strand", icon: "🚗" },
                      { time: "13:00", activity: "Mittagessen am Strand", icon: "🍽️" },
                      { time: "14:00", activity: "Baden & Relaxen am Es Trenc", icon: "🏖️", tip: "Karibik-Feeling auf Mallorca – weißer Sand, türkises Wasser" },
                      { time: "18:00", activity: "Fahrt nach Ses Salines – Tapas", icon: "🍷" },
                      { time: "20:00", activity: "Romantisches Abendessen", icon: "💕" },
                    ]},
                    { day: "Tag 5", title: "Cap de Formentor & Abschied", icon: "🌊", color: "bg-cyan-100", dayCost: "~50 €", transport: "Mietwagen oder Bus", meals: "Café-Brunch + Abschieds-Dinner Palma", stops: [
                      { time: "08:00", activity: "Fahrt zum Cap de Formentor", icon: "🚗", tip: "Früh starten – im Sommer Straße ab 10 Uhr gesperrt" },
                      { time: "09:30", activity: "Leuchtturm & Aussichtspunkte", icon: "🏔️" },
                      { time: "11:00", activity: "Badepause Platja de Formentor", icon: "🏖️" },
                      { time: "13:00", activity: "Rückfahrt & Mittagessen in Pollença", icon: "🍽️" },
                      { time: "16:00", activity: "Letzter Bummel durch Palma", icon: "🛍️" },
                      { time: "20:00", activity: "Abschieds-Dinner in Santa Catalina", icon: "🌃" },
                    ]},
                  ] as DayPlan[]).map((plan, i, arr) => (
                    <DayCard key={plan.day} plan={plan} isLast={i === arr.length - 1} />
                  ))}
                </div>
              )}

              {activePlan === "families" && (
                <div className="space-y-0">
                  {([
                    { day: "Tag 1", title: "Strand & Aquarium", icon: "🐠", color: "bg-blue-100", dayCost: "~100 € Fam.", transport: "Bus + zu Fuß", meals: "Food Court + Strandlokal", stops: [
                      { time: "09:30", activity: "Palma Aquarium — Haie, Rochen & Spielplatz", icon: "🐠", tip: "Online-Tickets vorab kaufen – günstiger und kein Anstehen" },
                      { time: "12:30", activity: "Mittagessen im Aquarium-Restaurant", icon: "🍽️" },
                      { time: "14:00", activity: "Playa de Palma — Baden & Sandburgen", icon: "🏖️", tip: "Flacher Einstieg, ideal für kleine Kinder" },
                      { time: "17:00", activity: "Eis an der Strandpromenade", icon: "🍦" },
                      { time: "19:00", activity: "Pizza-Abendessen (kinderfreundlich)", icon: "🍕" },
                    ]},
                    { day: "Tag 2", title: "Höhlen & Porto Cristo", icon: "🦇", color: "bg-amber-100", dayCost: "~80 € Fam.", transport: "Mietwagen", meals: "Picknick + Restaurant", stops: [
                      { time: "09:00", activity: "Fahrt zu den Cuevas del Drach", icon: "🚗" },
                      { time: "10:00", activity: "Höhlenführung mit Konzert am See", icon: "🦇", tip: "Kinder lieben die Bootsfahrt auf dem unterirdischen See" },
                      { time: "12:00", activity: "Porto Cristo – Hafen erkunden", icon: "⚓" },
                      { time: "13:00", activity: "Mittagessen am Hafen", icon: "🍽️" },
                      { time: "15:00", activity: "Strand Cala Millor", icon: "🏖️" },
                      { time: "18:00", activity: "Abendessen & Rückfahrt", icon: "🚗" },
                    ]},
                    { day: "Tag 3", title: "Tren de Sóller & Strand", icon: "🚂", color: "bg-emerald-100", dayCost: "~90 € Fam.", transport: "Historische Bahn + Straßenbahn", meals: "Marktplatz-Café + Hafen-Restaurant", stops: [
                      { time: "09:30", activity: "Tren de Sóller (Roter Blitz) ab Palma", icon: "🚂", tip: "Kinder lieben die historische Zugfahrt durch die Berge!" },
                      { time: "10:45", activity: "Sóller Marktplatz & Eis", icon: "🍦" },
                      { time: "11:30", activity: "Straßenbahn nach Port de Sóller", icon: "🚋" },
                      { time: "12:00", activity: "Baden am Stadtstrand", icon: "🏖️" },
                      { time: "14:00", activity: "Mittagessen am Hafen", icon: "🐟" },
                      { time: "16:00", activity: "Spielplatz & freie Zeit", icon: "🎢" },
                      { time: "18:00", activity: "Rückfahrt nach Palma", icon: "🚗" },
                    ]},
                    { day: "Tag 4", title: "Alcúdia & Playa de Muro", icon: "🏖️", color: "bg-cyan-100", dayCost: "~60 € Fam.", transport: "Mietwagen", meals: "Altstadt-Restaurant + Strand-Snacks", stops: [
                      { time: "09:00", activity: "Altstadt Alcúdia erkunden", icon: "🏰", tip: "Kinder können auf der Stadtmauer laufen – kostenlos!" },
                      { time: "10:30", activity: "Römische Ruinen Pollentia", icon: "🏛️" },
                      { time: "11:30", activity: "Playa de Muro – der perfekte Familienstrand", icon: "🏖️", tip: "Flaches, warmes Wasser auf Hunderten von Metern" },
                      { time: "13:00", activity: "Mittagessen am Strand", icon: "🍽️" },
                      { time: "14:00", activity: "Weiter Baden & Schnorcheln", icon: "🤿" },
                      { time: "17:00", activity: "Naturpark S'Albufera (Vogelbeobachtung)", icon: "🦩", tip: "Kostenloser Eintritt – Fernglas mitbringen!" },
                    ]},
                    { day: "Tag 5", title: "Katmandu Park & Abreise", icon: "🎢", color: "bg-orange-100", dayCost: "~70 € Fam.", transport: "Bus/Taxi", meals: "Frühstück + Park-Restaurant", stops: [
                      { time: "09:30", activity: "Katmandu Park Magaluf", icon: "🎢", tip: "Mini-Golf, 4D-Kino, Klettergarten – für Kinder ideal" },
                      { time: "12:30", activity: "Mittagessen im Park", icon: "🍽️" },
                      { time: "14:00", activity: "Letzte Strandzeit", icon: "🏖️" },
                      { time: "16:00", activity: "Souvenirs in Palma kaufen", icon: "🛍️" },
                      { time: "18:00", activity: "Abschieds-Eis am Passeig Marítim", icon: "🍦" },
                    ]},
                  ] as DayPlan[]).map((plan, i, arr) => (
                    <DayCard key={plan.day} plan={plan} isLast={i === arr.length - 1} />
                  ))}
                </div>
              )}

              {activePlan === "solo" && (
                <div className="space-y-0">
                  {([
                    { day: "Tag 1", title: "Palma & Santa Catalina", icon: "🏘️", color: "bg-amber-100", dayCost: "~45 €", transport: "Zu Fuß", meals: "Markt-Tapas + Bar-Dinner", stops: [
                      { time: "09:00", activity: "Kathedrale La Seu & Altstadt", icon: "🏛️" },
                      { time: "11:00", activity: "Kaffee an der Plaça Major", icon: "☕" },
                      { time: "12:30", activity: "Mercat de l'Olivar – Tapas am Markt", icon: "🍽️", tip: "Frische Meeresfrüchte direkt an der Theke – ab 8 €" },
                      { time: "14:30", activity: "Es Baluard Museum (moderne Kunst)", icon: "🎨" },
                      { time: "17:00", activity: "Santa Catalina erkunden", icon: "🏘️" },
                      { time: "20:00", activity: "Craft-Beer-Tour durch die Bars", icon: "🍺", tip: "La Rosa Vermutería und Bar Flexas sind Top-Adressen" },
                    ]},
                    { day: "Tag 2", title: "Tramuntana-Wanderung", icon: "🥾", color: "bg-emerald-100", dayCost: "~35 €", transport: "Bus + zu Fuß", meals: "Picknick + Lokanta", stops: [
                      { time: "07:30", activity: "Bus nach Valldemossa", icon: "🚌" },
                      { time: "09:00", activity: "GR 221 Wanderung: Valldemossa → Deià", icon: "🥾", tip: "Ca. 3–4 Stunden, mittelschwer, atemberaubende Aussichten" },
                      { time: "13:00", activity: "Mittagessen in Deià", icon: "🍽️" },
                      { time: "15:00", activity: "Abstieg zur Cala Deià & Baden", icon: "🏖️" },
                      { time: "17:30", activity: "Bus zurück nach Palma", icon: "🚌" },
                      { time: "20:00", activity: "Abendessen am Hafen", icon: "🌅" },
                    ]},
                    { day: "Tag 3", title: "Ostküste & Buchten", icon: "🏖️", color: "bg-cyan-100", dayCost: "~40 €", transport: "Mietwagen oder Bus", meals: "Strand-Snacks + Restaurant", stops: [
                      { time: "08:30", activity: "Fahrt nach Cala Mondragó", icon: "🚗" },
                      { time: "10:00", activity: "Schnorcheln in Cala Mondragó", icon: "🤿", tip: "Naturpark mit klarem Wasser – Schnorchelausrüstung mitbringen" },
                      { time: "13:00", activity: "Weiterfahrt nach Cala Varques", icon: "🚗" },
                      { time: "13:30", activity: "Wanderung & Baden an der Cala Varques", icon: "🏖️", tip: "20 Min. Fußweg – kaum Touristen, keine Infrastruktur" },
                      { time: "17:00", activity: "Porto Colom – Hafen-Spaziergang", icon: "⚓" },
                      { time: "19:30", activity: "Abendessen am Fischerhafen", icon: "🐟" },
                    ]},
                    { day: "Tag 4", title: "Cap de Formentor & Norden", icon: "🏔️", color: "bg-sky-100", dayCost: "~40 €", transport: "Mietwagen oder Bus", meals: "Café + Restaurant Pollença", stops: [
                      { time: "07:30", activity: "Frühe Fahrt zum Cap de Formentor", icon: "🚗", tip: "Vor 10 Uhr ankommen, danach Zufahrt gesperrt (Sommer)" },
                      { time: "09:00", activity: "Leuchtturm & Aussichtspunkte", icon: "🏔️" },
                      { time: "10:30", activity: "Platja de Formentor – Baden", icon: "🏖️" },
                      { time: "13:00", activity: "Pollença – 365 Kalvarienstufen", icon: "🏛️", tip: "Oben angekommen: sensationeller Blick über die gesamte Bucht" },
                      { time: "14:30", activity: "Mittagessen auf dem Marktplatz", icon: "🍽️" },
                      { time: "16:00", activity: "Alcúdia Altstadt & Stadtmauer", icon: "🏰" },
                      { time: "19:00", activity: "Rückfahrt & Abendessen", icon: "🌅" },
                    ]},
                    { day: "Tag 5", title: "Radtour & Abschied", icon: "🚴", color: "bg-orange-100", dayCost: "~50 €", transport: "Leihrad + zu Fuß", meals: "Café-Frühstück + Abschieds-Dinner", stops: [
                      { time: "08:00", activity: "Fahrrad leihen in Palma", icon: "🚴", tip: "Viele Verleihe am Passeig Marítim – ab 12 €/Tag" },
                      { time: "09:00", activity: "Radtour: Palma → S'Arenal (Küstenweg)", icon: "🚴" },
                      { time: "11:00", activity: "Badepause am Strand", icon: "🏖️" },
                      { time: "13:00", activity: "Rückfahrt & Rad zurückgeben", icon: "🚴" },
                      { time: "14:30", activity: "Mercat de l'Olivar – letztes Marktessen", icon: "🍽️" },
                      { time: "16:00", activity: "Souvenirs: Ensaïmada & Sobrassada", icon: "🛍️", tip: "Im Forn des Teatre gibt es die besten Ensaïmadas der Stadt" },
                      { time: "20:00", activity: "Abschieds-Drink in Santa Catalina", icon: "🍸" },
                    ]},
                  ] as DayPlan[]).map((plan, i, arr) => (
                    <DayCard key={plan.day} plan={plan} isLast={i === arr.length - 1} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ INSIDER ════ */}
        {activeTab === "insider" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geheimtipps</h2>
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das kennen nur Insider</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Torrent de Pareis", desc: "Spektakuläre Schlucht an der Nordwestküste, die zu einer kleinen Bucht führt. Nur zu Fuß erreichbar – ein echtes Abenteuer.", icon: "🏞️" },
                { title: "Cala Deià Fischrestaurant", desc: "Das Ca's Patró March in der kleinen Felsenbucht von Deià serviert den besten frischen Fisch der Insel – direkt am Meer.", icon: "🐟" },
                { title: "Artà Höhlen (Coves d'Artà)", desc: "Weniger überlaufen als die Drachenhöhlen, aber genauso beeindruckend – mit einer der höchsten Stalaktit-Säulen Europas.", icon: "🦇" },
                { title: "Sonnenuntergang am Mirador de ses Ànimes", desc: "Der Wachturm bei Banyalbufar bietet den vielleicht schönsten Sonnenuntergang Mallorcas – kaum Touristen.", icon: "🌅" },
                { title: "Ses Fonts Ufanes", desc: "Ein Naturphänomen: Nach starkem Regen brechen Quellen aus dem Waldboden bei Campanet hervor – magisch!", icon: "💧" },
                { title: "Sant Elm & Sa Dragonera", desc: "Vom kleinen Ort Sant Elm per Boot auf die unbewohnte Dracheninsel Sa Dragonera – Naturschutzgebiet mit Eidechsen.", icon: "🏝️" },
                { title: "Palma Street Art Tour", desc: "Im Viertel Sa Gerreria findet man überraschende Wandkunst. Einfach durch die Gassen schlendern.", icon: "🎨" },
                { title: "Frühstück im Forn des Teatre", desc: "Die älteste Bäckerei Palmas (seit 1916) – hier die legendäre Ensaïmada zum Frühstück genießen.", icon: "🥐" },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                  </div>
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
              <p className="text-gray-400 text-sm">Mallorquinische Küche – von Ensaïmada bis Pa amb oli</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="amber">Typische Gerichte</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Ensaïmada", desc: "Das Wahrzeichen der mallorquinischen Bäckerei: zartes Schneckengebäck aus Schweineschmalz-Teig, pur oder mit Kürbiskonfitüre (cabello de ángel) gefüllt.", price: "2–6 €" },
                  { name: "Pa amb oli", desc: "Brot mit Tomaten eingerieben, Olivenöl, Meersalz und typisch mallorquinischem Belag wie Serrano-Schinken, Käse oder Sobrassada.", price: "5–10 €" },
                  { name: "Tumbet", desc: "Geschichtetes Gemüsegericht aus Kartoffeln, Auberginen, Paprika und Tomatensauce – das mallorquinische Ratatouille.", price: "8–12 €" },
                  { name: "Sobrassada", desc: "Streichbare Rohwurst aus Schweinefleisch mit Paprika – mild oder scharf. Typisch auf Pa amb oli oder als Tapa.", price: "3–8 €" },
                  { name: "Frito mallorquín", desc: "Traditionelles Pfannengericht aus Innereien, Kartoffeln, Fenchel und Paprika. Deftig und authentisch.", price: "10–14 €" },
                  { name: "Arròs brut", desc: "Mallorquinische Reissuppe mit Fleisch, Wild, Gemüse und Safran – ein typisches Wintergericht.", price: "12–16 €" },
                ].map((dish) => (
                  <div key={dish.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{dish.name}</h4>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{dish.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{dish.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Märkte & Einkaufen</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Mercat de l'Olivar" desc="Die größte Markthalle Palmas: frischer Fisch, Fleisch, Obst, Gemüse und Tapas-Bars zum Essen vor Ort." mapHref="https://www.google.com/maps/search/?api=1&query=Mercat+de+l%27Olivar+Palma" address="Plaça de l'Olivar, 07002 Palma" duration="1–2 Std." tip="Die Fisch-Abteilung ist beeindruckend – morgens am frischesten." />
                <SightCard title="Mercat de Santa Catalina" desc="Kleinere, hippe Markthalle im trendigen Viertel. Perfekt für ein Tapas-Frühstück oder Brunch." mapHref="https://www.google.com/maps/search/?api=1&query=Mercat+de+Santa+Catalina+Palma" address="Plaça de la Navegació, 07013 Palma" duration="1 Std." tip="Samstags besonders lebendig – Einheimische kaufen hier ein." />
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-3">🍷 Getränke-Tipps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p>🍷 <strong>Mallorquinischer Wein:</strong> Binissalem-DO und Pla i Llevant – hervorragende lokale Weine ab 3 € pro Glas.</p>
                <p>🍊 <strong>Hierbas:</strong> Traditioneller mallorquinischer Kräuterlikör – süß oder trocken als Digestif.</p>
                <p>🍺 <strong>Craft Beer:</strong> Die lokale Brauerei Tramuntana Brewing in Palma braut erstklassige Biere.</p>
                <p>☕ <strong>Café con leche:</strong> Starker Espresso mit Milch. Für einen größeren Kaffee &quot;café con leche grande&quot; bestellen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ PRACTICAL ════ */}
        {activeTab === "practical" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Praktische Infos</h2>
              <p className="text-gray-400 text-sm">Alles, was du vor und während deines Mallorca-Urlaubs wissen musst</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { icon: "✈️", title: "Anreise", text: "Flughafen Palma de Mallorca (PMI) – drittgrößter Flughafen Spaniens. Flugzeit ab Deutschland ca. 2–2,5 Stunden. Direktflüge von allen großen deutschen Flughäfen." },
                { icon: "🚌", title: "Bus (TIB)", text: "Das Busnetz Transports de les Illes Balears (TIB) verbindet alle wichtigen Orte. Günstig und zuverlässig. Einzelticket 2–8 € je nach Strecke. T20-Karte lohnt sich bei mehreren Fahrten." },
                { icon: "🚂", title: "Tren de Sóller", text: "Historische Schmalspurbahn Palma–Sóller (seit 1912). Eine der schönsten Zugstrecken Europas. Hin+Rück ca. 25 €." },
                { icon: "🚗", title: "Mietwagen", text: "Ideal für die Tramuntana und Ostküste. Ab 20 €/Tag. Internationale Führerscheine werden anerkannt. Tanken: SP95 (bleifrei), Diesel verfügbar." },
                { icon: "📱", title: "Internet & SIM", text: "EU-Roaming gilt – deutsche SIM-Karten funktionieren ohne Aufpreis. Kostenloses WLAN in den meisten Hotels, Cafés und Restaurants." },
                { icon: "🔌", title: "Strom", text: "EU-Standardstecker Typ C/F, 230V/50Hz. Deutsche Stecker passen – kein Adapter nötig." },
                { icon: "💊", title: "Gesundheit", text: "Europäische Krankenversicherungskarte (EHIC) mitbringen. Apotheken (Farmacia) gut ausgestattet, viele sprechen Deutsch." },
                { icon: "🛡️", title: "Sicherheit", text: "Mallorca ist sehr sicher. Taschendiebstahl in touristischen Gebieten beachten. Wertsachen nicht sichtbar im Auto lassen." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3">🏧 Geld & Bezahlen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p>💶 <strong>Währung:</strong> Euro (EUR) – keine Umrechnung nötig für Reisende aus dem Euroraum.</p>
                <p>💳 <strong>Kartenzahlung:</strong> Fast überall akzeptiert. Kontaktlos (NFC) weit verbreitet.</p>
                <p>🏧 <strong>Geldautomaten:</strong> Flächendeckend vorhanden. Tipp: Immer in Euro abheben, nicht in der Heimatwährung.</p>
                <p>💰 <strong>Trinkgeld:</strong> 5–10% im Restaurant sind üblich. In Bars reichen ein paar Münzen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ LANGUAGE ════ */}
        {activeTab === "language" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sprachhilfe</h2>
              <p className="text-gray-400 text-sm">Wichtige Wörter & Sätze auf Spanisch und Katalanisch (Mallorquín)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flag code="es" alt="Spanien" /> Spanisch (Castellano)
                </h3>
                <div className="space-y-2">
                  {[
                    { de: "Hallo", es: "Hola", pron: "Oh-la" },
                    { de: "Guten Tag", es: "Buenos días", pron: "Bwe-nos dí-as" },
                    { de: "Tschüss", es: "Adiós", pron: "A-di-ós" },
                    { de: "Bitte", es: "Por favor", pron: "Por fa-bor" },
                    { de: "Danke", es: "Gracias", pron: "Gra-thi-as" },
                    { de: "Ja / Nein", es: "Sí / No", pron: "Si / No" },
                    { de: "Entschuldigung", es: "Perdón", pron: "Per-dón" },
                    { de: "Wie viel kostet das?", es: "¿Cuánto cuesta?", pron: "Kwan-to kwes-ta" },
                    { de: "Die Rechnung, bitte", es: "La cuenta, por favor", pron: "La kwen-ta, por fa-bor" },
                    { de: "Wo ist…?", es: "¿Dónde está…?", pron: "Dón-de es-tá" },
                    { de: "Ich spreche kein Spanisch", es: "No hablo español", pron: "No ab-lo es-pan-jol" },
                    { de: "Hilfe!", es: "¡Socorro!", pron: "So-kó-ro" },
                  ].map((phrase) => (
                    <div key={phrase.de} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      <span className="text-sm font-bold text-gray-900 w-40 shrink-0">{phrase.de}</span>
                      <span className="text-sm text-[#00838F] font-semibold flex-1">{phrase.es}</span>
                      <span className="text-xs text-gray-400 italic hidden sm:block">{phrase.pron}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🏝️ Katalanisch (Mallorquín)
                </h3>
                <div className="space-y-2">
                  {[
                    { de: "Guten Tag", cat: "Bon dia", pron: "Bon dí-a" },
                    { de: "Guten Abend", cat: "Bona tarda", pron: "Bó-na tár-da" },
                    { de: "Bitte", cat: "Si us plau", pron: "Sis-pláu" },
                    { de: "Danke", cat: "Gràcies", pron: "Grá-si-es" },
                    { de: "Tschüss", cat: "Adéu", pron: "A-déu" },
                    { de: "Ja / Nein", cat: "Sí / No", pron: "Si / No" },
                    { de: "Wie geht es Ihnen?", cat: "Com estau?", pron: "Kom es-táu" },
                    { de: "Strand", cat: "Platja", pron: "Plát-dscha" },
                    { de: "Berg", cat: "Muntanya", pron: "Mun-tán-ja" },
                    { de: "Markt", cat: "Mercat", pron: "Mer-kát" },
                  ].map((phrase) => (
                    <div key={phrase.de} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      <span className="text-sm font-bold text-gray-900 w-40 shrink-0">{phrase.de}</span>
                      <span className="text-sm text-[#00838F] font-semibold flex-1">{phrase.cat}</span>
                      <span className="text-xs text-gray-400 italic hidden sm:block">{phrase.pron}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-2">💡 Sprach-Tipp</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Auf Mallorca werden Spanisch und Katalanisch (Mallorquín) gesprochen. Schilder und offizielle Texte sind oft zweisprachig. In touristischen Gebieten wird verbreitet Deutsch und Englisch gesprochen. Einheimische freuen sich über ein paar Worte Katalanisch – vor allem ein &quot;Bon dia&quot; zur Begrüßung.</p>
            </div>
          </div>
        )}

        {/* ════ HELP ════ */}
        {activeTab === "help" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Hilfe & Notfall</h2>
              <p className="text-gray-400 text-sm">Wichtige Kontakte und Notfallnummern für deinen Mallorca-Aufenthalt</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">🚨 Notrufnummern</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Europäischer Notruf", number: "112", desc: "Polizei, Feuerwehr, Rettung" },
                  { label: "Polizei (Policía Nacional)", number: "091", desc: "Für Anzeigen & Diebstahl" },
                  { label: "Guardia Civil", number: "062", desc: "Ländliche Gebiete" },
                  { label: "Krankenwagen (SAMU)", number: "061", desc: "Medizinischer Notfall" },
                  { label: "Feuerwehr", number: "080", desc: "Brandnotfälle" },
                  { label: "Seenotrettung", number: "900 202 202", desc: "Notfälle auf dem Meer" },
                ].map((n) => (
                  <div key={n.label} className="bg-white rounded-xl p-4 border border-red-100">
                    <p className="text-xs text-gray-500">{n.label}</p>
                    <p className="text-2xl font-extrabold text-red-600 mt-1">{n.number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">🏥 Krankenhäuser</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-bold text-gray-900">Hospital Universitario Son Espases</p>
                    <p>Carretera de Valldemossa 79, 07120 Palma</p>
                    <p>Tel: +34 871 20 50 00</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Hospital de Manacor</p>
                    <p>Carretera Manacor-Alcúdia, 07500 Manacor</p>
                    <p>Tel: +34 971 84 70 00</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">🏛️ Deutsche Vertretung</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-bold text-gray-900">Deutsches Konsulat Palma de Mallorca</p>
                    <p>Carrer de Porto Pi 8, 07015 Palma</p>
                    <p>Tel: +34 971 70 77 37</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Deutsche Botschaft Madrid</p>
                    <p>Calle de Fortuny 8, 28010 Madrid</p>
                    <p>Tel: +34 91 557 90 00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3">💊 Apotheken (Farmacia)</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Apotheken sind mit einem grünen Kreuz gekennzeichnet. Öffnungszeiten: Mo–Fr 9:30–20:00, Sa 9:30–13:30. Es gibt immer eine Notdienst-Apotheke (Farmacia de guardia). Viele Apotheker sprechen Deutsch.</p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <h4 className="font-bold text-gray-900 mb-3">🛡️ Reiseversicherung</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Eine Auslandsreise-Krankenversicherung wird empfohlen, auch wenn die EHIC-Karte gilt. Sie deckt Rücktransporte und private Behandlungen ab. Dokumente digital und als Kopie mitführen.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
