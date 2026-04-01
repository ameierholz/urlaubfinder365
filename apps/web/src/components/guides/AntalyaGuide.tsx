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
  { label: "Januar", emoji: "🍊", text: "Mild, aber regnerisch. Zeit der Orangenernte & ideal für Museen." },
  { label: "Februar", emoji: "🏛️", text: "Kühl. Perfekt, um antike Stätten wie Perge ohne Menschenmassen zu erkunden." },
  { label: "März", emoji: "⛰️", text: "Der Frühling erwacht. Ideal für erste Wanderungen am Lykischen Weg." },
  { label: "April", emoji: "🌸", text: "Angenehm warm, alles blüht. Top-Zeit für Sightseeing." },
  { label: "Mai", emoji: "🏖️", text: "Vorsaison. Warm genug für erste Strandtage." },
  { label: "Juni", emoji: "⛵", text: "Sommerbeginn. Perfekt für Bootsausflüge und Wassersport." },
  { label: "Juli", emoji: "☀️", text: "Hochsommer. Sehr heiß, ideal für Sonnenanbeter und Wasserparks." },
  { label: "August", emoji: "🌊", text: "Heißester Monat. Alles dreht sich um Strand, Meer und Klimaanlage." },
  { label: "September", emoji: "🌅", text: "Nachsaison, noch sehr warm. Perfekt für alles bei weniger Trubel." },
  { label: "Oktober", emoji: "🏞️", text: "Angenehm mild. Ideal für Ausflüge zu den Wasserfällen." },
  { label: "November", emoji: "🚶‍♂️", text: "Ruhig, oft sonnig. Ideal für Stadtspaziergänge in Kaleiçi." },
  { label: "Dezember", emoji: "☕", text: "Besinnlich & kühl. Perfekt für einen Besuch im Hamam oder Teehäusern." },
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
      {/* Timeline */}
      <div className="flex flex-col items-center pt-1">
        <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center text-lg shrink-0 shadow-sm`}>
          {plan.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-[#00838F]/30 to-transparent mt-2" />}
      </div>
      {/* Content */}
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
          {/* Preview when collapsed */}
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
        const url = "https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=724";
        const fn = (window as any).ibeOpenBooking;
        if (typeof fn === "function") fn(url, "Pauschalreisen nach Antalya");
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

export default function AntalyaGuide() {
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
          "https://api.open-meteo.com/v1/forecast?latitude=36.89&longitude=30.71&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Istanbul"
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
      setLiveTime(new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
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
            <span className="text-white font-medium">Antalya</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Antalya Reiseführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">2026</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                Dein umfassender Guide für den perfekten Türkei-Urlaub – Tipps, Sehenswürdigkeiten & praktische Infos.
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
                  Wetter in Antalya
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
                    { icon: "🌸", season: "Frühling (Apr–Mai)", desc: "Perfekt für Wanderungen & Sightseeing." },
                    { icon: "☀️", season: "Sommer (Jun–Sep)", desc: "Ideal für Strand & Meer." },
                    { icon: "🍂", season: "Herbst (Okt–Nov)", desc: "Angenehm warm, weniger Trubel." },
                    { icon: "❄️", season: "Winter (Dez–Mär)", desc: "Mild, für Kultur & Ruhe." },
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
                  <p><span className="mr-1.5">🥇</span><strong>Erstbesucher:</strong> <span className="text-white/80">Kaleiçi, Düden-Wasserfälle, Aspendos, Bootstour, Konyaaltı Strand.</span></p>
                  <p><span className="mr-1.5">👨‍👩‍👧‍👦</span><strong>Familien:</strong> <span className="text-white/80">Land of Legends, Antalya Aquarium, Sandland, Lara Strand, Jeep-Safari.</span></p>
                  <p><span className="mr-1.5">💕</span><strong>Paare:</strong> <span className="text-white/80">Abendessen in Kaleiçi, Sonnenuntergang am Hafen, Lykischer Weg, Bootstour, Hamam-Besuch.</span></p>
                  <p><span className="mr-1.5">🍸</span><strong>Singles:</strong> <span className="text-white/80">Beach Clubs in Lara, Bars in Kaleiçi, organisierte Touren, Wassersport am Konyaaltı.</span></p>
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach Antalya</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P. Direkt beim Veranstalter buchen.</p>
                </div>
                <IbeCta />
              </div>
            </div>

            {/* Month Scroll */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Antalya nach Monaten</h2>
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Antalya zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe className="w-full h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204283.2039229884!2d30.5484850729223!3d36.89725404659929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39aa2b83f3e45%3A0x6e14759604888e7f!2sAntalya%2C%20T%C3%BCrkei!5e0!3m2!1sde!2sde!4v1658835282115!5m2!1sde!2sde" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Land:</span> Türkei</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Region:</span> Türkische Riviera, Mittelmeerküste</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Hauptstadt:</span> Antalya (Provinz)</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Besonderheit:</span> Antalya liegt an einer malerischen Steilküste vor der Kulisse des imposanten Taurusgebirges – reiche Antike trifft moderne Touristenzentren.</li>
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard icon="👥" label="Einwohner" value="~2,6 Mio." />
              <StatCard icon="🌡️" label="Ø Jahrestemp." value="18,7 °C" />
              <StatCard icon="🕐" label="Zeitzone" value="UTC+3 (MEZ+2)" />
              <StatCard icon="🔌" label="Steckdose" value="Typ C/F (230V)" />
              <StatCard icon="🌊" label="Wassertemp. Sommer" value="25–28 °C" />
              <StatCard icon="✈️" label="Flugzeit (DE)" value="~3,5 Std." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Türkisch. In Touristengebieten wird oft Englisch und Deutsch gesprochen." },
                  { icon: "💶", label: "Währung", text: "Türkische Lira (TRY). Euro wird oft akzeptiert, der Kurs ist aber meist schlecht. Geldwechsel vor Ort empfohlen." },
                  { icon: "🛂", label: "Einreise", text: "Reisepass oder Personalausweis (für Deutsche) erforderlich. Visum für touristische Aufenthalte bis 90 Tage meist nicht nötig – aktuelle Bestimmungen prüfen!" },
                  { icon: "💧", label: "Trinkwasser", text: "Leitungswasser nicht trinken! Überall günstig in Flaschen erhältlich (0,5l ab 0,50 €). Im Restaurant immer Flaschenwasser bestellen." },
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
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">Antalya hat ein heißes Mittelmeerklima. Sommer heiß und trocken, Winter mild und regnerisch. Beste Reisezeit: Frühling und Herbst.</p>
                  <div className="space-y-3">
                    {[
                      { label: "Frühling", temp: "15–25 °C", w: "70%", color: "bg-emerald-500" },
                      { label: "Sommer", temp: "25–35 °C+", w: "100%", color: "bg-amber-500" },
                      { label: "Herbst", temp: "18–28 °C", w: "75%", color: "bg-orange-400" },
                      { label: "Winter", temp: "10–15 °C", w: "40%", color: "bg-sky-500" },
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

                {/* Water Temperature */}
                <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🌊</span> Wassertemperatur (Mittelmeer)</h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { m: "Jan", t: "17°" }, { m: "Apr", t: "18°" }, { m: "Jul", t: "27°" }, { m: "Okt", t: "24°" },
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
                <p>🍵 <strong>Teekultur:</strong> Einladungen zum Çay sind üblich und sollten nicht ausgeschlagen werden – es ist eine Geste der Gastfreundschaft.</p>
                <p>🛍️ <strong>Handeln:</strong> Auf Basaren (&quot;Pazarlık&quot;) ist Verhandeln Tradition. Starte bei 50% des genannten Preises.</p>
                <p>🕌 <strong>Moscheebesuch:</strong> Schultern und Knie bedecken, Frauen zusätzlich das Haar. Schuhe am Eingang ausziehen.</p>
                <p>👋 <strong>Begrüßung:</strong> Ein freundliches &quot;Merhaba&quot; öffnet Türen. Türken schätzen es sehr, wenn Gäste ihre Sprache versuchen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte & Kultur</h2>
              <p className="text-gray-400 text-sm">Von der Antike bis heute – eine Stadt mit 2.200 Jahren Geschichte</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Timeline */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Zeitstrahl</h3>
                <TimelineItem year="~150 v. Chr." era="Gründung als Attaleia" text="König Attalos II. von Pergamon gründet die Stadt als Hafensiedlung. Der Name 'Attaleia' lebt im heutigen 'Antalya' fort." color="bg-amber-500" />
                <TimelineItem year="133 v. Chr." era="Römische Herrschaft" text="Antalya wird Teil des Römischen Reiches. Kaiser Hadrian besucht die Stadt 130 n. Chr. – das berühmte Hadrianstor wird ihm zu Ehren errichtet." color="bg-red-500" />
                <TimelineItem year="395–1207" era="Byzantinische Epoche" text="Als Teil des Oströmischen Reiches wird Antalya ein bedeutendes christliches Zentrum. Zahlreiche Kirchen und Befestigungen entstehen." color="bg-purple-500" />
                <TimelineItem year="1207" era="Seldschuken erobern Antalya" text="Die Seldschuken hinterlassen bleibende Spuren: Das Yivli-Minare (gerilltes Minarett) wird zum Wahrzeichen der Stadt." color="bg-emerald-500" />
                <TimelineItem year="1423" era="Osmanisches Reich" text="Unter den Osmanen wächst Antalya zu einem wichtigen Handelshafen. Die Altstadt Kaleiçi mit ihren osmanischen Holzhäusern entsteht in dieser Zeit." color="bg-blue-500" />
                <TimelineItem year="1923" era="Moderne Türkei" text="Nach dem Unabhängigkeitskrieg wird Antalya Teil der Republik Türkei. Ab den 1970er-Jahren beginnt der Aufstieg zur internationalen Tourismus-Metropole." color="bg-teal-500" />
              </div>

              {/* Side Info */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2">🏛️ Must-See: Historische Stätten</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>Hadrianstor</strong> – Dreiflügeliges Marmortor aus 130 n. Chr.</li>
                    <li><strong>Yivli-Minare</strong> – Seldschukisches Wahrzeichen (1230)</li>
                    <li><strong>Aspendos</strong> – Besterhaltenes Römertheater der Welt</li>
                    <li><strong>Perge</strong> – Antike Stadt mit Stadion für 12.000</li>
                    <li><strong>Termessos</strong> – Bergstadt im Nationalpark</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Lokale Etikette</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Begrüßung", text: "Ein freundliches \"Merhaba\" wird sehr geschätzt." },
                      { title: "Handeln", text: "Auf Basaren und bei Taxifahrten ohne Taxameter ist Handeln üblich." },
                      { title: "Moscheebesuch", text: "Schultern und Knie bedecken, Frauen zusätzlich das Haar. Schuhe ausziehen." },
                      { title: "Gastfreundschaft", text: "Eine Einladung zum Tee sollte angenommen werden." },
                    ].map((item) => (
                      <div key={item.title}>
                        <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Antalya heute</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🏙️ 5. größte Stadt der Türkei</li>
                    <li>✈️ ~16 Mio. Touristen pro Jahr</li>
                    <li>🏖️ 300+ Sonnentage im Jahr</li>
                    <li>🏨 Über 1.000 Hotels & Resorts</li>
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
              <p className="text-gray-400 text-sm">Die besten Sehenswürdigkeiten in und um Antalya</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Für Kulturinteressierte & Entdecker</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Kaleiçi (Altstadt)" desc="Schlendere durch enge Gassen, entdecke das Hadrianstor und den alten römischen Hafen." mapHref="https://www.google.com/maps/search/?api=1&query=Kalei%C3%A7i+Antalya" address="Kaleiçi, 07100 Muratpaşa/Antalya" duration="3–5 Std." cost="Kostenlos" tip="Am frühen Morgen oder Abend besuchen – tagsüber sehr voll." />
                <SightCard title="Antikes Theater von Aspendos" desc="Das am besten erhaltene römische Theater der Antike. Ein absolutes Muss!" mapHref="https://www.google.com/maps/search/?api=1&query=Aspendos+Antalya" address="Serik, 07500 Serik/Antalya" duration="1–2 Std." cost="~15 €" tip="Im Sommer finden hier Open-Air-Konzerte und Opernabende statt." />
                <SightCard title="Antike Stadt Perge" desc="Erkunde beeindruckende Ruinen mit Stadion, Agora und Kolonnadenstraße." mapHref="https://www.google.com/maps/search/?api=1&query=Perge+Antalya" address="Barbaros, 07112 Aksu/Antalya" duration="2–3 Std." cost="~10 €" tip="Sonnenschutz und Wasser mitnehmen – kaum Schatten!" />
                <SightCard title="Archäologisches Museum Antalya" desc="Eines der bedeutendsten Museen der Türkei mit faszinierenden Funden aus der Region." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Museum" address="Bahçelievler, Konyaaltı Cd. No:88, 07050 Muratpaşa/Antalya" duration="2–3 Std." cost="~10 €" tip="Perfekt für Regentage. Die Götterstatuen-Galerie ist spektakulär." />
                <SightCard title="Yivli-Minare-Moschee" desc="Das Wahrzeichen von Antalya mit seinem gerillten Minarett aus der Seldschukenzeit." mapHref="https://www.google.com/maps/search/?api=1&query=Yivli+Minaret+Mosque" address="Selçuk, İskele Cd. No:38, 07100 Muratpaşa/Antalya" duration="30 Min." cost="Kostenlos" tip="Befindet sich im Zentrum von Kaleiçi – ideal als erster Stopp." />
                <SightCard title="Termessos" desc="Antike Bergstadt in einem Nationalpark. Spektakuläre Lage – gutes Schuhwerk und Wasser mitnehmen!" mapHref="https://www.google.com/maps/search/?api=1&query=Termessos" address="Bayatbademleri, 07800 Döşemealtı/Antalya" duration="3–4 Std." cost="~5 €" tip="Alexander der Große konnte diese Stadt nicht erobern. Im Herbst besonders schön." />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Für Familien & Abenteurer</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Düden-Wasserfälle" desc="Bestaune die unteren Fälle, die direkt ins Meer stürzen, und spaziere hinter den oberen Fällen hindurch." mapHref="https://www.google.com/maps/search/?api=1&query=D%C3%BCden+Wasserf%C3%A4lle+Antalya" address="Lara Cd. No:457, 07100 Muratpaşa/Antalya" duration="1–2 Std." cost="~3 €" tip="Obere und untere Fälle sind verschiedene Standorte – beide lohnen sich!" />
                <SightCard title="The Land of Legends" desc="Ein riesiger Themen- und Wasserpark, der einen ganzen Tag voller Spaß verspricht." mapHref="https://www.google.com/maps/search/?api=1&query=The+Land+of+Legends+Kadriye" address="Kadriye, Atatürk Cd. No:1, 07506 Serik/Antalya" duration="Ganztags" cost="~50 €" tip="Tickets online kaufen – oft 20% günstiger als an der Kasse." />
                <SightCard title="Antalya Aquarium" desc="Tausende Meeresbewohner und eines der längsten Tunnel-Aquarien der Welt." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Aquarium" address="Arapsuyu, Dumlupınar Blv. No:502, 07200 Konyaaltı/Antalya" duration="2–3 Std." cost="~30 €" tip="Auch ein Schneeerlebnis-Raum ist dabei – Jacke nicht vergessen!" />
                <SightCard title="Tünektepe Seilbahn" desc="Fahre auf den Berg und genieße atemberaubende Panoramaaussicht über die ganze Stadt und Küste." mapHref="https://www.google.com/maps/search/?api=1&query=T%C3%BCnektepe+Teleferik" address="Liman, 07130 Konyaaltı/Antalya" duration="1–2 Std." cost="~8 €" tip="Zum Sonnenuntergang fahren – die Aussicht ist dann unschlagbar." />
                <SightCard title="Jeep-Safari / Quad-Tour" desc="Erlebe Natur und Abenteuer im Geländewagen oder Quad, Kamelreiten und Sternenhimmel." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Jeep+Safari" duration="Halbtags" cost="25–60 €" tip="Nur bei vertrauenswürdigen Anbietern mit Versicherung buchen." />
                <SightCard title="Bootstour ab Kaleiçi" desc="Entdecke die Küste vom Wasser aus. Viele Touren starten am alten Hafen und fahren zu den Düden-Wasserfällen." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Boat+Tour" duration="3–6 Std." cost="15–40 €" tip="Vormittags starten – nachmittags kann es auf dem Meer wellig werden." />
              </div>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten & Tickets</h2>
              <p className="text-gray-400 text-sm">Buche direkt vor Ort oder von zuhause – Touren, Eintrittskarten & Erlebnisse für deinen Antalya-Urlaub.</p>
            </div>

            {/* Featured Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "⛵", label: "Bootstouren", desc: "Küste & Höhlen" },
                { emoji: "🏛️", label: "Kulturtouren", desc: "Antike Stätten" },
                { emoji: "🤿", label: "Wassersport", desc: "Tauchen & Rafting" },
                { emoji: "🎢", label: "Freizeitparks", desc: "Action & Spaß" },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                </div>
              ))}
            </div>

            <TiqetsCarousel cityId="78987" cityName="Antalya" citySlug="antalya" />
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
            {(() => {
              const plans = {
                couples: {
                  label: "Paare & Genießer",
                  emoji: "💕",
                  color: "from-rose-500 to-pink-500",
                  budget: "~350 € p.P.",
                  duration: "7 Tage",
                  highlight: "Kultur, Romantik & Riviera",
                  days: [
                    { day: "Tag 1", title: "Altstadt & Romantik", icon: "🏛️", color: "bg-rose-100", dayCost: "~35 €", transport: "Zu Fuß durch Kaleiçi", meals: "Lokanta-Mittag + Rooftop-Dinner", stops: [
                      { time: "09:00", activity: "Hadrianstor & Kaleiçi erkunden", icon: "🏛️", tip: "Morgens leer – beste Fotos ohne Menschenmassen" },
                      { time: "11:00", activity: "Türkischer Kaffee im historischen Teehaus", icon: "☕", tip: "Kaffee in der Mermerlı Altstadt, ab 20 ₺" },
                      { time: "13:00", activity: "Mittagessen in der Sim Restaurant Lokanta", icon: "🍽️" },
                      { time: "15:00", activity: "Yivli-Minare-Moschee & Basarviertel", icon: "🕌" },
                      { time: "18:00", activity: "Alter Hafen — Spaziergang bei Sonnenuntergang", icon: "⛵" },
                      { time: "20:00", activity: "Rooftop-Dinner mit Meerblick", icon: "🌃", tip: "Castle Café oder Vanilla Lounge bieten die beste Aussicht" },
                    ]},
                    { day: "Tag 2", title: "Antike Stätten & Strandabend", icon: "🎭", color: "bg-amber-100", dayCost: "~50 €", transport: "Mietwagen oder Tour (ab 25 €)", meals: "Picknick + Strandrestaurant", stops: [
                      { time: "08:30", activity: "Tagesausflug nach Perge (Ruinenstadt)", icon: "🏛️", tip: "Eintritt 200 ₺, gut 1,5 h einplanen" },
                      { time: "11:30", activity: "Weiterfahrt zum Aspendos-Theater", icon: "🎭", tip: "Eines der besterhaltenen römischen Theater der Welt" },
                      { time: "14:00", activity: "Rückfahrt & spätes Mittagessen", icon: "🍽️" },
                      { time: "16:30", activity: "Konyaaltı Strand — Entspannen & Baden", icon: "🏖️" },
                      { time: "19:30", activity: "Sonnenuntergang an der Strandpromenade", icon: "🌅", tip: "Die Klippenbar Aqualand hat den besten Blick" },
                    ]},
                    { day: "Tag 3", title: "Hamam & Shopping", icon: "🧖", color: "bg-purple-100", dayCost: "~55 €", transport: "Zu Fuß + Straßenbahn", meals: "Café-Brunch + Fischrestaurant", stops: [
                      { time: "10:00", activity: "Traditioneller Hamam-Besuch", icon: "🧖", tip: "Sefa Hamam in Kaleiçi: authentisch, ab 400 ₺ inkl. Massage" },
                      { time: "12:30", activity: "Brunch in einem Kaleiçi-Café", icon: "☕" },
                      { time: "14:00", activity: "Moderne Shops im MarkAntalya oder TerraCity", icon: "🛍️" },
                      { time: "17:00", activity: "Karaalioglu Park Spaziergang", icon: "🌳" },
                      { time: "19:30", activity: "Fisch-Dinner am alten Hafen", icon: "🐟", tip: "Frischen Fisch direkt am Boot kaufen – Restaurants grillen ihn" },
                    ]},
                    { day: "Tag 4", title: "Bootstour & Wasserfälle", icon: "⛵", color: "bg-blue-100", dayCost: "~45 €", transport: "Boot + Taxi", meals: "An Bord + Abendessen Altstadt", stops: [
                      { time: "09:30", activity: "Ganztags-Bootstour ab dem alten Hafen", icon: "⛵", tip: "6-Stunden-Tour ab 200 ₺ – inkl. Mittagessen und Badepausen" },
                      { time: "10:30", activity: "Halt an den Untere Düden-Wasserfällen (vom Meer aus)", icon: "🌊" },
                      { time: "12:00", activity: "Mittagessen an Bord & Badepause", icon: "🏊" },
                      { time: "15:30", activity: "Rückkehr zum Hafen", icon: "⚓" },
                      { time: "17:00", activity: "Obere Düden-Wasserfälle (Park)", icon: "🌊", tip: "Eintritt frei – hinter dem Wasserfall durchgehen möglich" },
                      { time: "20:00", activity: "Abendessen im Altstadt-Viertel", icon: "🍽️" },
                    ]},
                    { day: "Tag 5", title: "Bergabenteuer Termessos", icon: "⛰️", color: "bg-emerald-100", dayCost: "~40 €", transport: "Mietwagen empfohlen", meals: "Picknick + Lokanta", stops: [
                      { time: "08:00", activity: "Frühe Abfahrt nach Termessos (30 km)", icon: "🚗", tip: "Früh starten – mittags wird es heiß in den Ruinen" },
                      { time: "09:00", activity: "Wanderung durch die antike Bergstadt", icon: "🏔️", tip: "Festes Schuhwerk! 1.050 m Höhe, atemberaubende Aussicht" },
                      { time: "12:00", activity: "Picknick im Nationalpark", icon: "🧺" },
                      { time: "14:00", activity: "Güver-Schlucht Aussichtspunkt", icon: "🏞️" },
                      { time: "17:00", activity: "Rückkehr & Entspannung am Hotel-Pool", icon: "🏊" },
                      { time: "20:00", activity: "Romantisches Abendessen am Lara Strand", icon: "🌙" },
                    ]},
                    { day: "Tag 6", title: "Kaputaş & Türkisküste", icon: "🏖️", color: "bg-cyan-100", dayCost: "~60 €", transport: "Mietwagen (ca. 2 h Fahrt)", meals: "Fischrestaurant in Kaş", stops: [
                      { time: "07:30", activity: "Abfahrt Richtung Kaputaş Strand", icon: "🚗", tip: "Früh losfahren – Parkplätze sind ab 11 Uhr voll" },
                      { time: "09:30", activity: "Baden am Kaputaş Strand", icon: "🏖️", tip: "Einer der schönsten Strände der Türkei – türkisblaues Wasser" },
                      { time: "12:30", activity: "Mittagessen in Kaş (Fischrestaurant)", icon: "🐟" },
                      { time: "14:00", activity: "Bummel durch Kaş — Boutiquen & Gassen", icon: "🛍️" },
                      { time: "17:00", activity: "Rückfahrt mit Stopps an der Küstenstraße", icon: "📸", tip: "D400 Küstenstraße = eine der schönsten Strecken der Türkei" },
                      { time: "20:00", activity: "Letztes Paar-Dinner am alten Hafen", icon: "💕" },
                    ]},
                    { day: "Tag 7", title: "Wasserfall & Abschieds-Basar", icon: "🏞️", color: "bg-orange-100", dayCost: "~30 €", transport: "Taxi + zu Fuß", meals: "Frühstück + Lokanta", stops: [
                      { time: "09:00", activity: "Kurşunlu-Wasserfall & Naturpark", icon: "🏞️", tip: "Ruhiger als Düden – ideal für einen entspannten Morgen" },
                      { time: "11:30", activity: "Letzter Bummel auf dem Altstadtbasar", icon: "🛍️", tip: "Hier noch Souvenirs kaufen — immer handeln!" },
                      { time: "13:30", activity: "Abschluss-Mittagessen in einer Lokanta", icon: "🍽️" },
                      { time: "15:00", activity: "Tee am Hafen & Reise Revue passieren lassen", icon: "☕" },
                    ]},
                  ] as DayPlan[],
                },
                families: {
                  label: "Familien",
                  emoji: "👨‍👩‍👧‍👦",
                  color: "from-blue-500 to-indigo-500",
                  budget: "~500 € (Fam.)",
                  duration: "7 Tage",
                  highlight: "Spaß, Action & Abenteuer",
                  days: [
                    { day: "Tag 1", title: "Aquarium & Strand", icon: "🐠", color: "bg-blue-100", dayCost: "~80 € Fam.", transport: "Straßenbahn + zu Fuß", meals: "Food Court Aquarium + Strandlokal", stops: [
                      { time: "09:30", activity: "Antalya Aquarium — Tunnelaquarium & Schneewelt", icon: "🐠", tip: "Combo-Ticket (Aquarium + Schneewelt) lohnt sich, ca. 700 ₺/Erw." },
                      { time: "12:30", activity: "Mittagessen im Food Court", icon: "🍽️" },
                      { time: "14:00", activity: "Konyaaltı Strand — Baden & Sandburgen", icon: "🏖️", tip: "Flacher Einstieg am westlichen Ende, ideal für Kinder" },
                      { time: "17:00", activity: "Eisessen an der Strandpromenade", icon: "🍦" },
                      { time: "19:00", activity: "Pizza-Abendessen (kinderfreundlich)", icon: "🍕" },
                    ]},
                    { day: "Tag 2", title: "Wasserfälle & Mini-Bootstour", icon: "🌊", color: "bg-cyan-100", dayCost: "~50 € Fam.", transport: "Dolmuş + Boot", meals: "Picknick + Restaurant", stops: [
                      { time: "09:00", activity: "Obere Düden-Wasserfälle (Park)", icon: "🌊", tip: "Kostenlos! Kinder lieben den Weg hinter dem Wasserfall" },
                      { time: "11:00", activity: "Picknick-Pause im Wasserfall-Park", icon: "🧺" },
                      { time: "13:00", activity: "Fahrt zu den Unteren Düden-Wasserfällen", icon: "🚌" },
                      { time: "14:30", activity: "Kurze Bootstour ab dem alten Hafen (1 h)", icon: "⛵", tip: "1-Stunden-Tour ab 100 ₺ — perfekt für kleine Kinder" },
                      { time: "16:30", activity: "Kaleiçi Altstadt erkunden", icon: "🏛️" },
                      { time: "19:00", activity: "Abendessen im Hafen", icon: "🍽️" },
                    ]},
                    { day: "Tag 3", title: "Jeep-Safari Abenteuer", icon: "🏜️", color: "bg-amber-100", dayCost: "~90 € Fam.", transport: "Abholung durch Veranstalter", meals: "BBQ-Lunch inkl.", stops: [
                      { time: "08:30", activity: "Abholung am Hotel — Jeep-Safari Start", icon: "🚙", tip: "Halbtages-Tour ab 250 ₺/Person — Kinder unter 6 oft gratis" },
                      { time: "10:00", activity: "Offroad durch die Berge & Flussbett", icon: "⛰️" },
                      { time: "11:30", activity: "Stopp an einem Bergdorf — lokales Handwerk", icon: "🏘️" },
                      { time: "12:30", activity: "BBQ-Mittagessen in der Natur (inkl.)", icon: "🍖" },
                      { time: "14:30", activity: "Wasserschlacht & Flussbaden", icon: "💦", tip: "Wechselkleidung für die Kinder einpacken!" },
                      { time: "16:00", activity: "Rückkehr zum Hotel & Pool-Nachmittag", icon: "🏊" },
                    ]},
                    { day: "Tag 4", title: "Land of Legends Themenpark", icon: "🎢", color: "bg-purple-100", dayCost: "~150 € Fam.", transport: "Shuttle-Bus oder Taxi (Belek, 35 km)", meals: "Im Park", stops: [
                      { time: "09:00", activity: "Shuttle zum Land of Legends (Belek)", icon: "🚌", tip: "Shuttle vorab buchen, ca. 100 ₺ p.P. hin & zurück" },
                      { time: "10:00", activity: "Achterbahnen & Fahrgeschäfte", icon: "🎢" },
                      { time: "12:30", activity: "Mittagessen im Park", icon: "🍔" },
                      { time: "14:00", activity: "Wasserpark-Bereich — Rutschen & Wellenbad", icon: "🌊", tip: "Wasserpark ist im Ticket inklusive!" },
                      { time: "17:00", activity: "Delphin-Show & Tierwelt", icon: "🐬" },
                      { time: "19:00", activity: "Rückfahrt & entspanntes Hotel-Abendessen", icon: "🍽️" },
                    ]},
                    { day: "Tag 5", title: "Lara Strand & Sandland", icon: "🏖️", color: "bg-yellow-100", dayCost: "~40 € Fam.", transport: "Dolmuş oder Hotel-Shuttle", meals: "Strandrestaurant", stops: [
                      { time: "09:30", activity: "Lara Strand — feiner Sand & warmes Wasser", icon: "🏖️", tip: "Liegen ab 50 ₺ – oder Handtuch mitnehmen" },
                      { time: "12:00", activity: "Mittagessen im Strand-Restaurant", icon: "🍽️" },
                      { time: "14:00", activity: "Sandland Skulpturen-Festival", icon: "🏰", tip: "Riesige Sandskulpturen – Kinder sind begeistert (Eintritt ~100 ₺)" },
                      { time: "16:00", activity: "Nochmal Baden & Strandspiele", icon: "⚽" },
                      { time: "18:30", activity: "Eis & Abendspaziergang", icon: "🍦" },
                    ]},
                    { day: "Tag 6", title: "Seilbahn & Panorama", icon: "🚠", color: "bg-teal-100", dayCost: "~60 € Fam.", transport: "Taxi zur Seilbahn-Station", meals: "Bergrestaurant + Abendessen", stops: [
                      { time: "09:30", activity: "Tünektepe Seilbahn — Auffahrt", icon: "🚠", tip: "Hin & zurück ab 200 ₺/Erw., Kinder halber Preis" },
                      { time: "10:30", activity: "Panorama-Aussicht & Fotos auf 605 m", icon: "📸" },
                      { time: "11:30", activity: "Mittagessen im Bergrestaurant", icon: "🍽️" },
                      { time: "13:00", activity: "Abfahrt & Nachmittag am Hotel-Pool", icon: "🏊" },
                      { time: "16:00", activity: "Mini-Golf oder Spielplatz am Hotel", icon: "⛳" },
                      { time: "19:00", activity: "Familien-Abschiedsdinner in Kaleiçi", icon: "🍽️" },
                    ]},
                    { day: "Tag 7", title: "Piraten-Bootstour", icon: "⛵", color: "bg-red-100", dayCost: "~70 € Fam.", transport: "Boot ab Hafen", meals: "Lunch an Bord", stops: [
                      { time: "09:30", activity: "Piraten-Bootstour ab dem alten Hafen", icon: "🏴‍☠️", tip: "Kinder lieben die Kostüme & Wasserpistolen-Schlachten!" },
                      { time: "11:00", activity: "Bade-Stopp in einer einsamen Bucht", icon: "🏊" },
                      { time: "12:30", activity: "Mittagessen an Bord (inkl.)", icon: "🍽️" },
                      { time: "14:30", activity: "Schatzsuche & Animation", icon: "🗺️" },
                      { time: "16:00", activity: "Rückkehr zum Hafen", icon: "⚓" },
                      { time: "17:00", activity: "Letzte Souvenirs & Eis", icon: "🎁" },
                    ]},
                  ] as DayPlan[],
                },
                solo: {
                  label: "Solo & Backpacker",
                  emoji: "🎒",
                  color: "from-amber-500 to-orange-500",
                  budget: "~180 € total",
                  duration: "5 Tage",
                  highlight: "Budget-freundlich & authentisch",
                  days: [
                    { day: "Tag 1", title: "Kaleiçi Deep Dive", icon: "🏛️", color: "bg-amber-100", dayCost: "~25 €", transport: "Alles zu Fuß", meals: "Simit-Frühstück + Lokanta", stops: [
                      { time: "08:00", activity: "Simit & Çay vom Straßenverkäufer", icon: "🥯", tip: "Simit kostet 10 ₺ — das günstigste Frühstück der Stadt" },
                      { time: "09:00", activity: "Hadrianstor → Kaleiçi-Gassen erkunden", icon: "🏛️" },
                      { time: "11:00", activity: "Verstecktes Teehaus in der Altstadt", icon: "☕", tip: "Çay kostet 5–10 ₺, Türkischer Kaffee ab 30 ₺" },
                      { time: "13:00", activity: "Mittagessen in einer Lokanta (Tagesgericht)", icon: "🍽️", tip: "Lokantas zeigen die Gerichte in Vitrinen — zeigen & bestellen. Ab 80 ₺" },
                      { time: "15:00", activity: "Antalya Museum — Geschichte & Archäologie", icon: "🏛️" },
                      { time: "18:00", activity: "Sunset Walk am alten Hafen", icon: "🌅" },
                      { time: "20:00", activity: "Streetfood & Çay-Runde im Kaleiçi-Nachtleben", icon: "🌙" },
                    ]},
                    { day: "Tag 2", title: "Strand & Nightlife", icon: "🏖️", color: "bg-blue-100", dayCost: "~30 €", transport: "Straßenbahn (7 ₺)", meals: "Strand-Pide + Kebab", stops: [
                      { time: "09:00", activity: "Konyaaltı Strand — Baden & Lesen", icon: "🏖️", tip: "Öffentlicher Bereich kostenlos, Liegen ab 50 ₺" },
                      { time: "12:30", activity: "Pide oder Lahmacun am Strand", icon: "🍕", tip: "Pide ab 60 ₺, Lahmacun ab 40 ₺ — lecker & günstig" },
                      { time: "14:00", activity: "Strandpromenade — Joggen oder Radfahren", icon: "🚴" },
                      { time: "16:00", activity: "Antalya Aquarium (optional, 350 ₺)", icon: "🐠" },
                      { time: "19:00", activity: "Kebab-Abendessen in der Altstadt", icon: "🍖" },
                      { time: "21:00", activity: "Rooftop-Bar oder Live-Musik in Kaleiçi", icon: "🎵", tip: "Viele Bars haben keinen Eintritt — nur Getränke ab 80 ₺" },
                    ]},
                    { day: "Tag 3", title: "Wasserfall-Tour gratis", icon: "🌊", color: "bg-cyan-100", dayCost: "~20 €", transport: "Dolmuş (7–10 ₺)", meals: "Picknick + Lokanta", stops: [
                      { time: "09:00", activity: "Dolmuş zu den Oberen Düden-Wasserfällen", icon: "🚌" },
                      { time: "09:30", activity: "Wasserfall-Park erkunden (Eintritt frei!)", icon: "🌊", tip: "Hinter dem Wasserfall durchgehen — spektakuläre Fotos" },
                      { time: "11:30", activity: "Picknick im Park", icon: "🧺" },
                      { time: "13:00", activity: "Weiter zu den Unteren Düden-Wasserfällen", icon: "🌊", tip: "Klippen-Promenade mit Aussicht — ebenfalls kostenlos" },
                      { time: "15:00", activity: "Sonnenuntergang an der Falezler Klippenpromenade", icon: "🌅" },
                      { time: "19:00", activity: "Günstig essen in einer Lokanta abseits der Touristenzone", icon: "🍽️", tip: "Abseits der Altstadt essen = halber Preis" },
                    ]},
                    { day: "Tag 4", title: "Olympos & ewige Feuer", icon: "🔥", color: "bg-orange-100", dayCost: "~45 €", transport: "Dolmuş nach Olympos (~25 ₺)", meals: "Baumhaus-Pension", stops: [
                      { time: "07:30", activity: "Dolmuş vom Otogar nach Olympos", icon: "🚌", tip: "Ca. 1,5 h Fahrt — am Busterminal Richtung Kumluca" },
                      { time: "09:30", activity: "Antike Ruinen von Olympos", icon: "🏛️", tip: "Eintritt 200 ₺, die Ruinen liegen direkt am Strand" },
                      { time: "12:00", activity: "Çıralı Beach — Baden im kristallklaren Wasser", icon: "🏖️" },
                      { time: "14:00", activity: "Mittagessen in einer Baumhaus-Pension", icon: "🌴", tip: "Legendäres Backpacker-Erlebnis — Übernachtung ab 300 ₺ inkl. Essen" },
                      { time: "17:00", activity: "Wanderung zur Chimäre (Yanartaş)", icon: "🔥", tip: "Ewige Flammen aus dem Fels! Am besten bei Dunkelheit — Taschenlampe mitnehmen" },
                      { time: "20:00", activity: "Lagerfeuer & Backpacker-Austausch", icon: "🏕️" },
                    ]},
                    { day: "Tag 5", title: "Termessos & Rooftop-Abschied", icon: "🏔️", color: "bg-emerald-100", dayCost: "~35 €", transport: "Dolmuş + Taxi", meals: "Gözleme + Rooftop-Dinner", stops: [
                      { time: "08:00", activity: "Rückfahrt nach Antalya & Dolmuş nach Termessos", icon: "🚌" },
                      { time: "10:00", activity: "Wanderung durch Termessos — antike Bergstadt", icon: "🏔️", tip: "Die einzige Stadt die Alexander der Große nicht erobern konnte" },
                      { time: "12:30", activity: "Gözleme am Parkeingang (ab 30 ₺)", icon: "🥞" },
                      { time: "14:00", activity: "Rückfahrt & letztes Strandzeit", icon: "🏖️" },
                      { time: "17:00", activity: "Letzte Souvenirs im Basar", icon: "🛍️", tip: "Gewürze, Tee & Seife — handeln nicht vergessen!" },
                      { time: "19:30", activity: "Abschiedsessen auf einem Kaleiçi-Rooftop", icon: "🌙", tip: "Perfekter Abschluss — Meze-Platte und Raki bei Meerblick" },
                    ]},
                  ] as DayPlan[],
                },
              };
              type PlanKey = keyof typeof plans;
              const plan = plans[activePlan];
              return (
                <>
                  {/* Selector Cards */}
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

                  {/* Active Plan Timeline */}
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

                  {/* Pro-Tipps */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <span>💡</span> Spar-Tipps für alle Reisetypen
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "Transport", text: "Dolmuş (Sammeltaxi) kostet 7–15 ₺ pro Fahrt. Straßenbahn 7 ₺. Taxi-Apps (BiTaksi) nutzen statt Taxameter.", icon: "🚌" },
                        { title: "Essen", text: "In Lokantas essen wie die Einheimischen: Tagesgericht ab 80 ₺. Touristenrestaurants kosten 3–5x mehr.", icon: "🍽️" },
                        { title: "Eintritte", text: "Museum Pass Türkiye (ab 1.500 ₺) lohnt sich ab 3 Sehenswürdigkeiten. Online-Tickets sind oft günstiger.", icon: "🎫" },
                        { title: "Wasser", text: "Leitungswasser ist trinkbar aber gechlort. 5L-Kanister im Migros für 15 ₺ statt Flaschen kaufen.", icon: "💧" },
                        { title: "Souvenirs", text: "Im Basar immer handeln! Starte bei 50% des genannten Preises. Gewürze & Tee sind die besten Mitbringsel.", icon: "🛍️" },
                        { title: "Geld", text: "Mit Karte zahlen für besten Wechselkurs. Nur kleine Mengen in Wechselstuben tauschen (nicht am Flughafen!).", icon: "💳" },
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
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das echte Antalya</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Karaalioğlu Park",
                  badge: "Verstecktes Highlight",
                  badgeColor: "green",
                  desc: "Eine grüne Oase oberhalb der Klippen mit toller Aussicht und weniger Touristen als im Zentrum von Kaleiçi. Perfekt für einen Morgenspaziergang.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Karaali%C4%9Flu+Park",
                  address: "Kılınçarslan, Park Sk., 07100 Muratpaşa/Antalya",
                },
                {
                  title: "Köy Kahvaltısı in Çakırlar",
                  badge: "Kulinarisch",
                  badgeColor: "amber",
                  desc: "Fahre ins Umland für ein traditionelles türkisches Dorf-Frühstück (\"Köy Kahvaltısı\") mit 20+ kleinen Schalen. Ein unvergessliches Erlebnis für ~10 € p.P.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=S%C4%B1rt+K%C3%B6yde+Kahvalt%C4%B1",
                  address: "Çakırlar, 07070 Konyaaltı/Antalya",
                },
                {
                  title: "Kaş & Kalkan",
                  badge: "Tagesausflug",
                  badgeColor: "blue",
                  desc: "Malerische Küstenstädte, ca. 3 Stunden westlich von Antalya. Ideal für einen entspannten Tag mit Bohème-Flair, bunten Gassen und türkisem Meer.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Ka%C5%9F+Antalya",
                  address: "07580 Kaş/Antalya",
                },
                {
                  title: "Saklıkent-Schlucht",
                  badge: "Abenteuer",
                  badgeColor: "teal",
                  desc: "Eine beeindruckende Schlucht, durch die man im Sommer im eiskalten Wasser waten kann. Ca. 2,5h Fahrt – ideal mit Kaş kombinierbar.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Sakl%C4%B1kent+National+Park",
                  address: "Kayadibi, 48340 Seydikemer/Muğla",
                },
                {
                  title: "Çıralı & das ewige Feuer Chimäre",
                  badge: "Magisch",
                  badgeColor: "red",
                  desc: "Natürliche Gasaustrittstellen am Berg Olympos brennen seit Jahrtausenden. Am besten nach Sonnenuntergang besuchen – mystische Atmosphäre.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Chimaera+Flames+Antalya",
                  address: "Çıralı, 07350 Kemer/Antalya",
                },
                {
                  title: "Kurşunlu-Wasserfall",
                  badge: "Naturjuwel",
                  badgeColor: "green",
                  desc: "Weniger bekannt als die Düden-Fälle, dafür viel ruhiger. Ein idyllischer Waldspaziergang führt zum Wasserfall. Perfekt für heiße Tage.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Kursunlu+Waterfall",
                  address: "Kursunlu Şelalesi, 07300 Aksu/Antalya",
                },
                {
                  title: "Alter Basar & Atatürk Caddesi",
                  badge: "Shopping",
                  badgeColor: "amber",
                  desc: "Abseits der Touristen-Basare: Auf der Atatürk Caddesi und im alten Viertel Tuzcular findest du echte Gewürze, Lederwaren und Textilien zu lokalen Preisen.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Atatürk+Caddesi+Antalya",
                  address: "Tuzcular, 07100 Muratpaşa/Antalya",
                },
                {
                  title: "Sonnenuntergang an der Falez-Klippenpromenade",
                  badge: "Fotogenisch",
                  badgeColor: "red",
                  desc: "Die Klippen-Promenade zwischen Konyaaltı und Lara bietet die besten Sonnenuntergänge der Stadt. Einheimische picknicken hier – Çay-Verkäufer inklusive.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Falez+Antalya",
                  address: "Falez Parkı, 07070 Konyaaltı/Antalya",
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
              <p className="text-gray-400 text-sm">Kulinarische Highlights der türkischen Küche</p>
            </div>

            {/* Must Try */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Was du unbedingt probieren musst</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { emoji: "🥙", title: "Kebab", desc: "Adana (scharf), İskender (mit Joghurt & Butter), Döner – jede Region hat ihre Spezialität.", price: "5–15 €" },
                  { emoji: "🧆", title: "Meze", desc: "Kalte und warme Vorspeisen zum Teilen – Hummus, Babaganusch, Cacık, Kisir und mehr.", price: "3–8 €" },
                  { emoji: "🍕", title: "Pide & Lahmacun", desc: "Die türkische Pizza: Pide mit Käse/Fleisch, Lahmacun dünn und knusprig.", price: "3–8 €" },
                  { emoji: "🥞", title: "Gözleme", desc: "Dünne, gefüllte Teigfladen, frisch am Straßenrand zubereitet. Klassiker: Spinat & Käse.", price: "2–5 €" },
                  { emoji: "🍮", title: "Künefe & Baklava", desc: "Heißer Fadenkäse-Nachtisch (Künefe) oder die berühmten Blätterteig-Pistazien-Stücke.", price: "2–6 €" },
                  { emoji: "🥛", title: "Ayran & Çay", desc: "Salziger Joghurt-Drink zu jedem Essen, dazu der allgegenwärtige türkische Tee.", price: "0,50–2 €" },
                  { emoji: "🍦", title: "Dondurma", desc: "Türkisches Eis – klebrig-elastisch, oft mit Show vom Eismacher serviert.", price: "1–3 €" },
                  { emoji: "🥤", title: "Frischer Granatapfelsaft", desc: "An jeder Ecke frisch gepresst. Eines der besten Erfrischungsgetränke.", price: "1–3 €" },
                  { emoji: "☕", title: "Türkischer Kaffee", desc: "Stark, unfiltriert, im Kupferkännchen (Cezve) serviert. Aus dem Satz wird die Zukunft gelesen!", price: "1–3 €" },
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

            {/* Restaurant Empfehlungen */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant-Empfehlungen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { badge: "Fisch & Meeresfrüchte", badgeColor: "blue", name: "Arma Restaurant", desc: "Gehobene Küche mit fantastischem Blick über den Hafen. Abendessen ab ~30 € p.P.", mapHref: "https://www.google.com/maps/search/?api=1&query=Arma+Restaurant+Antalya", address: "Selçuk, İskele Cd. No:75, 07100 Muratpaşa/Antalya" },
                  { badge: "Authentisch & günstig", badgeColor: "green", name: "Can Can Pide", desc: "Beliebt bei Einheimischen für günstige und leckere Pide und Kebab. Hauptgericht ab ~5 €.", mapHref: "https://www.google.com/maps/search/?api=1&query=Can+Can+Pide+Kebap+Antalya", address: "Tuzcular, Paşa Cami Sk. No:14, 07100 Muratpaşa/Antalya" },
                  { badge: "Street Food", badgeColor: "amber", name: "Şişçi Ramazan", desc: "Der beste Adana-Kebab der Stadt – laut vielen Einheimischen. Authentisch, günstig, köstlich.", mapHref: "https://www.google.com/maps/search/?api=1&query=%C5%9Ei%C5%9F%C3%A7i+Ramazan+Antalya", address: "Muratpaşa, 07040 Antalya" },
                  { badge: "Frühstück", badgeColor: "teal", name: "Çakırlar Köy Kahvaltısı", desc: "Das ultimative türkische Dorf-Frühstück mit 25+ Schalen. Samstag/Sonntag sehr beliebt!", mapHref: "https://www.google.com/maps/search/?api=1&query=%C3%87ak%C4%B1rlar+Kahvalt%C4%B1+Antalya", address: "Çakırlar, 07070 Konyaaltı/Antalya" },
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
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Iss wie die Einheimischen</p>
                <p className="text-gray-600 text-xs leading-relaxed">Meide touristische Restaurants direkt am Hafen. In den Seitenstraßen findest du &quot;Lokantas&quot; (einfache Selbstbedienungs-Restaurants) mit frisch gekochtem Essen für 3–6 €. Mittags gibt es oft &quot;Menü&quot;-Angebote mit Suppe, Hauptgang und Getränk.</p>
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
                  emoji: "🚃", title: "Transport vor Ort",
                  text: "Tram (\"Antray\") verbindet Flughafen–Zentrum–Konyaaltı. Dolmuş-Minibusse sind günstig (0,50–1 €). Taxis: immer Taxameter verlangen oder Preis vorher vereinbaren. Mietwagen ab ~25 €/Tag.",
                },
                {
                  emoji: "✈️", title: "Anreise & Flughafen",
                  text: "Flughafen Antalya (AYT) liegt 13 km östlich. Transfer: Havaş-Bus (~3 €, 30 Min.), Tram oder Taxi (~15–20 €). Viele Charter-Direktflüge aus DACH ab ~150 € return.",
                },
                {
                  emoji: "🏨", title: "Unterkünfte",
                  text: "Boutique-Hotels in Kaleiçi (ab 40 €), große All-Inclusive-Resorts in Lara (ab 80 € p.P.), Hostels (ab 12 €). Frühbucher profitieren von 20–30% Rabatt.",
                },
                {
                  emoji: "📱", title: "SIM-Karte & Internet",
                  text: "Türkische SIM (Turkcell, Vodafone) am Flughafen kaufen – Tourist-Paket ~15 € für 20 GB/30 Tage. Kostenlos WLAN in den meisten Hotels, Cafés und Einkaufszentren.",
                },
                {
                  emoji: "💰", title: "Trinkgeld",
                  text: "Restaurant: 5–10% des Rechnungsbetrags. Hotel-Housekeeping: 5–10 TL/Tag. Taxifahrer: Aufrunden. Hamam: 10–15% für den Tellak (Bademeister).",
                },
                {
                  emoji: "🛡️", title: "Sicherheit",
                  text: "Antalya ist generell sehr sicher für Touristen. Taschendiebstahl kann in belebten Gebieten vorkommen. Keine Wertgegenstände am Strand lassen. Seriöse Touranbieter wählen.",
                },
                {
                  emoji: "🏥", title: "Gesundheit & Apotheke",
                  text: "Apotheken (\"Eczane\") sind gut ausgestattet und viele Medikamente rezeptfrei. Krankenhaus: Akdeniz Üniversitesi Hastanesi. Auslandskrankenversicherung dringend empfohlen!",
                },
                {
                  emoji: "👗", title: "Kleidung & Packliste",
                  text: "Sommer: Leicht, luftig, Sonnenschutz. Für Moscheen: Tuch zum Bedecken. Badelatschen für Kieselstrände! Abends in Kaleiçi: Smart-Casual. Winter: Leichte Jacke und Regenschutz.",
                },
                {
                  emoji: "🔌", title: "Strom & Technik",
                  text: "Steckdose Typ C/F (wie Deutschland), 230V. Kein Adapter nötig für DACH-Reisende. USB-Ladestationen an vielen öffentlichen Plätzen.",
                },
              ].map((card) => (
                <div key={card.title} className="group bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#00838F]/20">
                  <div className="w-12 h-12 rounded-xl bg-[#00838F]/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-[#00838F]/15 transition-colors">{card.emoji}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
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
              <p className="text-gray-400 text-sm">Ein paar Worte auf Türkisch öffnen dir Türen und Herzen</p>
            </div>

            {[
              {
                category: "Grundlagen",
                icon: "👋",
                phrases: [
                  ["Hallo", "Merhaba", "mer-HA-ba"],
                  ["Guten Morgen", "Günaydın", "gün-AY-dın"],
                  ["Guten Abend", "İyi akşamlar", "i-yi ak-SCHAM-lar"],
                  ["Tschüss", "Görüşürüz", "gö-rü-SCHÜ-rüz"],
                  ["Bitte", "Lütfen", "LÜT-fen"],
                  ["Danke", "Teşekkür ederim", "te-schek-KÜR e-de-RIM"],
                  ["Ja / Nein", "Evet / Hayır", "e-WET / ha-YIR"],
                ],
              },
              {
                category: "Im Restaurant",
                icon: "🍽️",
                phrases: [
                  ["Die Rechnung, bitte", "Hesap, lütfen", "he-SAP, lüt-FEN"],
                  ["Ein Wasser, bitte", "Bir su, lütfen", "bir SU, lüt-FEN"],
                  ["Sehr lecker!", "Çok lezzetli!", "tschok lez-ZET-li"],
                  ["Ohne Schärfe", "Acısız", "a-dschı-SIZ"],
                  ["Noch einen Tee, bitte", "Bir çay daha, lütfen", "bir TSCHAI da-HA"],
                ],
              },
              {
                category: "Unterwegs",
                icon: "🗺️",
                phrases: [
                  ["Wo ist...?", "... nerede?", "ne-RE-de"],
                  ["Wie viel kostet das?", "Ne kadar?", "ne ka-DAR"],
                  ["Zu teuer!", "Çok pahalı!", "tschok pa-ha-LI"],
                  ["Ich verstehe nicht", "Anlamıyorum", "an-la-MI-yo-rum"],
                  ["Hilfe!", "İmdat!", "im-DAT"],
                ],
              },
            ].map((group) => (
              <div key={group.category}>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">{group.icon}</span> {group.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.phrases.map(([de, tr, pron]) => (
                    <div key={de} className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:border-[#00838F]/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{de}</p>
                        <p className="text-[#00838F] font-semibold text-sm">{tr}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded shrink-0">{pron}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Aussprache-Tipp</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  <strong>ç</strong> = tsch, <strong>ş</strong> = sch, <strong>ğ</strong> = stumm (verlängert den Vokal davor), <strong>ı</strong> = dumpfes i (wie englisches &quot;uh&quot;), <strong>ö/ü</strong> = wie im Deutschen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HELP ════ */}
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
                    <span className="font-medium text-gray-700">🚓 Touristenpolizei</span>
                    <span className="font-bold text-gray-900">155</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚑 Rettungsdienst</span>
                    <span className="font-bold text-gray-900">112</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚕 Taxizentrale</span>
                    <span className="font-bold text-gray-900">+90 242 334 44 44</span>
                  </div>
                </div>
              </div>

              {/* Consulates */}
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="font-extrabold text-blue-800 mb-4 flex items-center gap-2">
                  <Flag code="de" alt="DE" />
                  <Flag code="at" alt="AT" />
                  <Flag code="ch" alt="CH" />
                  <span className="ml-1">Konsulate</span>
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="de" alt="DE" /> Deutsches Konsulat</span>
                      <span className="font-bold text-gray-900">+90 242 314 11 01</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Çağlayan, 2042. Sk. No:2, 07230 Muratpaşa</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="at" alt="AT" /> Österreich. Konsulat</span>
                      <span className="font-bold text-gray-900">+90 242 312 37 07</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Aspendos Blv. No:71, 07200 Muratpaşa</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="ch" alt="CH" /> Schweizer Konsulat</span>
                      <span className="font-bold text-gray-900">+90 242 248 68 00</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Kılıçaslan, Fırın Sk. No:17, 07100 Muratpaşa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical & Insurance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl mb-3">🏥</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Nächstes Krankenhaus</h4>
                <p className="text-xs text-gray-600 mb-2">Akdeniz Üniversitesi Hastanesi – 24h Notaufnahme mit englischsprachigem Personal.</p>
                <MapLink href="https://www.google.com/maps/search/?api=1&query=Akdeniz+%C3%9Cniversitesi+Hastanesi" address="Dumlupınar Blv., 07070 Konyaaltı/Antalya" />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl mb-3">💊</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Apotheke (Eczane)</h4>
                <p className="text-xs text-gray-600">In Kaleiçi und an jeder Hauptstraße. Nachts gibt es &quot;Nöbetçi Eczane&quot; (Notdienst-Apotheke) – Aushang an jeder Apothekentür.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-3">📋</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Reiseversicherung</h4>
                <p className="text-xs text-gray-600">Auslandskrankenversicherung ist Pflicht! EHIC/EKVK gilt NICHT in der Türkei. Private Reisekrankenversicherung ab ~10 €/Reise abschließen.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Wichtig: Dokumentenkopien</p>
                <p className="text-gray-600 text-xs leading-relaxed">Fotografiere deinen Reisepass, Versicherungsnachweis und Buchungsbestätigung und speichere sie in der Cloud (Google Drive, iCloud). So hast du im Notfall immer Zugriff, selbst wenn das Original verloren geht.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ BEACHES ════ */}
        {activeTab === "beaches" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Strände in Antalya</h2>
              <p className="text-gray-400 text-sm">Von städtischen Kieselstränden bis zu feinsandigen Traumstränden</p>
            </div>
            <div className="space-y-5">
              {[
                { name: "Konyaaltı Strand", type: "Stadtstrand · Kiesel", rating: "★★★★☆", ideal: "Städtereisende, Einheimische", desc: "Antalyas beliebtester Stadtstrand mit 7 km Länge. Blau-Flagge ausgezeichnet, sehr gut erschlossen mit Restaurants, Duschen und Sportmöglichkeiten. Herrlicher Blick auf das Taurusgebirge.", pros: ["Kostenloser Zugang", "Gut erreichbar mit Tram", "Viele Restaurants & Bars", "Sportangebote (Volleyball, Wasserski)"], cons: ["Kieselstrand (keine Badelatschen vergessen!)", "Im Hochsommer sehr voll"], mapHref: "https://www.google.com/maps/search/?api=1&query=Konyaalti+Beach+Antalya", color: "border-blue-200 bg-blue-50/50", badge: "bg-blue-100 text-blue-700" },
                { name: "Lara Strand", type: "Hotelstrand · Sand & Kiesel", rating: "★★★★★", ideal: "Familien, Paare, All-Inclusive-Urlauber", desc: "Der bekannteste Strandabschnitt Antalyas mit feinem Sand und glasklarem Wasser. Hier reihen sich die großen 5-Sterne-Resorts aneinander. Öffentlicher Zugang möglich, jedoch sind viele Bereiche hoteleigen.", pros: ["Feinsandiger Strand", "Kristallklares Wasser", "Luxushotels direkt am Strand", "Wasserpark-Nähe (Land of Legends)"], cons: ["Viele Bereiche nur für Hotelgäste", "Weiter vom Stadtzentrum entfernt"], mapHref: "https://www.google.com/maps/search/?api=1&query=Lara+Beach+Antalya", color: "border-amber-200 bg-amber-50/50", badge: "bg-amber-100 text-amber-700" },
                { name: "Cleopatra Beach (Alanya)", type: "Sandstrand · Ausflugsziel", rating: "★★★★★", ideal: "Badeurlauber, Romantik-Paare", desc: "Ca. 130 km von Antalya entfernt – einer der schönsten Sandstrände der Türkei. Der Legende nach badete Kleopatra hier. Feinsand, Schatten durch Burgruine, kristallklares Wasser.", pros: ["Feinsandstrand", "Kleopatra-Legende", "Tolles Umfeld (Alanya-Burg)", "Sehr klares Wasser"], cons: ["Tagesausflug nötig (1,5h Fahrt)", "Im Hochsommer überfüllt"], mapHref: "https://www.google.com/maps/search/?api=1&query=Cleopatra+Beach+Alanya", color: "border-rose-200 bg-rose-50/50", badge: "bg-rose-100 text-rose-700" },
                { name: "Olympos & Çıralı Beach", type: "Naturstrand · Ruhig", rating: "★★★★☆", ideal: "Natur-Liebhaber, Backpacker, Paare", desc: "Ca. 90 km westlich von Antalya – ein wilder, unberührter Kieselstrand eingebettet in Pinien. In der Nähe die antike Stadt Olympos und das ewige Feuer Chimäre. Kein Massentourismus.", pros: ["Unberührte Natur", "Karettschildkröten-Nistplatz", "Antike Ruinen direkt am Strand", "Ruhige Atmosphäre"], cons: ["Kieselstrand", "Wenig Infrastruktur", "Tagesausflug oder Übernachtung nötig"], mapHref: "https://www.google.com/maps/search/?api=1&query=Cirali+Beach+Antalya", color: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700" },
                { name: "Kaputaş Beach", type: "Traumstrand · Fotogen", rating: "★★★★★", ideal: "Fotografen, Romantik-Reisende", desc: "Ca. 185 km westlich von Antalya zwischen Kaş und Kalkan – ein kleiner Traumstrand mit türkisblauem Wasser in einer dramatischen Schlucht. Spektakulärer Anblick, besonders morgens.", pros: ["Atemberaubend schön", "Türkisblaues Wasser", "Einzigartige Schluchtlage"], cons: ["Sehr klein (schnell voll)", "Steile Treppen (185 Stufen)", "Weiter Weg von Antalya"], mapHref: "https://www.google.com/maps/search/?api=1&query=Kaputa%C5%9F+Beach", color: "border-cyan-200 bg-cyan-50/50", badge: "bg-cyan-100 text-cyan-700" },
              ].map((beach) => (
                <div key={beach.name} className={`rounded-2xl border-2 p-6 transition-all hover:shadow-md ${beach.color}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-extrabold text-gray-900">{beach.name}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${beach.badge}`}>{beach.type}</span>
                        <span className="text-sm text-amber-500 tracking-tight">{beach.rating}</span>
                      </div>
                      <p className="text-xs text-[#00838F] font-semibold mb-2">Ideal für: {beach.ideal}</p>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{beach.desc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/80 rounded-xl p-3">
                          <p className="text-xs font-bold text-emerald-600 mb-1.5">✓ Vorteile</p>
                          <ul className="space-y-1">{beach.pros.map((p) => <li key={p} className="text-xs text-gray-600">• {p}</li>)}</ul>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3">
                          <p className="text-xs font-bold text-red-500 mb-1.5">✗ Nachteile</p>
                          <ul className="space-y-1">{beach.cons.map((c) => <li key={c} className="text-xs text-gray-600">• {c}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                    <a href={beach.mapHref} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-[#00838F] hover:text-[#006670] transition-colors mt-2 sm:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Karte
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-sky-50 border-2 border-sky-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">🌊</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5">Strand-Tipp: Badelatschen nicht vergessen!</p>
                <p className="text-gray-600 text-sm leading-relaxed">Die meisten Strände rund um Antalya sind Kieselstrände. Wasserschuhe oder Badelatschen machen den Einstieg ins Wasser deutlich angenehmer.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ DISTRICTS ════ */}
        {activeTab === "districts" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Viertel-Guide Antalya</h2>
              <p className="text-gray-400 text-sm">Wo übernachten? Wo ausgehen? Finde das richtige Viertel für dich.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "Kaleiçi (Altstadt)", emoji: "🏛️", ideal: "Kulturinteressierte, Romantik-Paare, Erstbesucher", vibe: "Historisch, charmant, lebendig", preis: "€€–€€€", desc: "Das Herzstück Antalyas – enge Kopfsteinpflastergassen, osmanische Häuser, Boutique-Hotels in historischen Gebäuden. Direkter Zugang zum alten Hafen und Hadrianstor. Abends gemütliche Bars und Restaurants.", highlights: ["Hadrianstor", "Alter Hafen", "Boutique-Hotels", "Abendleben"], nota: "Etwas laut an Wochenenden. Kein direkter Strandzugang.", color: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
                { name: "Konyaaltı", emoji: "🏖️", ideal: "Familien, Strandliebhaber, Aktiv-Urlauber", vibe: "Modern, entspannt, strandnah", preis: "€€", desc: "Modernes Wohnviertel westlich des Zentrums direkt am gleichnamigen Kieselstrand. Viele Restaurants, Cafés und Strandpromenade. Aquarium und Seilbahn in der Nähe. Gut mit der Tram erreichbar.", highlights: ["Strandpromenade", "Aquarium", "Tünektepe Seilbahn", "Moderne Infrastruktur"], nota: "Kieselstrand, kein Feinsand.", color: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
                { name: "Lara", emoji: "🏨", ideal: "Luxus-Urlauber, All-Inclusive-Gäste, Familien", vibe: "Luxuriös, ruhig, resortnah", preis: "€€€–€€€€", desc: "Das Luxusviertel Antalyas östlich der Stadt. Hier stehen die großen 5-Sterne-All-Inclusive-Resorts direkt am feinsandigen Strand. Land of Legends Freizeitpark in der Nähe. Weniger urban, mehr Resort-Feeling.", highlights: ["5-Sterne-Resorts", "Feinsand-Strand", "Land of Legends", "Düden-Wasserfälle"], nota: "Weit vom Stadtzentrum (Taxi/Auto nötig).", color: "border-rose-200", badge: "bg-rose-100 text-rose-700" },
                { name: "Belek", emoji: "⛳", ideal: "Golfer, Luxus-Urlauber, Sport-Begeisterte", vibe: "Exklusiv, naturnah, golfaffin", preis: "€€€€", desc: "Ca. 35 km östlich von Antalya. Weltklasse-Golfplätze und gehobene Resorts in Pinienhainen. Breiter, feinsandiger Strand. Beliebt bei internationalen Sportlern – hier finden regelmäßig ATP-Turniere statt.", highlights: ["12+ Golfplätze", "Luxus-Resorts", "Feinsand-Strand", "Sport-Events"], nota: "Sehr auf Resorts ausgerichtet, kaum Stadtleben.", color: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
                { name: "Side", emoji: "🏺", ideal: "Geschichtsinteressierte, Paare, Ruhesuchende", vibe: "Antik, romantisch, entspannt", preis: "€–€€€", desc: "Ca. 75 km östlich von Antalya. Malerisches Städtchen auf einer Halbinsel mit antiken Ruinen direkt am Strand. Tempel des Apollon mit Meeresblick – einer der romantischsten Orte der türkischen Mittelmeerküste.", highlights: ["Apollon-Tempel", "Antike Ruinen", "Sandstrände beidseitig", "Romantische Altstadt"], nota: "Im Hochsommer sehr touristisch.", color: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
                { name: "Alanya", emoji: "🏰", ideal: "Junge Reisende, Partytouristen, Familien", vibe: "Lebendig, günstig, vielfältig", preis: "€–€€", desc: "Ca. 130 km östlich von Antalya. Beliebter Ferienort mit markanter Burg auf einem Felsen, Cleopatra Beach und lebhafter Strandpromenade. Günstigere Preise als Antalya-Stadt, viel Nachtleben.", highlights: ["Alanya-Burg", "Cleopatra Beach", "Damlataş-Höhle", "Nachtleben"], nota: "Lange Fahrt von Antalya-Flughafen (1,5h).", color: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
              ].map((d) => (
                <div key={d.name} className={`bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${d.color}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">{d.emoji}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-gray-900 text-lg">{d.name}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${d.badge}`}>{d.preis}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{d.vibe}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#00838F] font-semibold mb-2">Ideal für: {d.ideal}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{d.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {d.highlights.map((h) => <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{h}</span>)}
                  </div>
                  <p className="text-xs text-gray-400 italic flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {d.nota}
                  </p>
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
              <p className="text-gray-400 text-sm">Was kostet ein Antalya-Urlaub wirklich? Realistische Preise für alle Budgets (Stand 2026).</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { level: "Budget-Reisender", emoji: "🎒", daily: "30–60 € / Tag", color: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700", items: ["Hostel / Pension: 15–25 €", "Straßenessen / Lokanta: 5–10 €", "Dolmuş / Tram: 0,50–1 €", "Eintritt Sehenswürdigkeiten: 5–15 €"] },
                { level: "Mittleres Budget", emoji: "🧳", daily: "70–150 € / Tag", color: "border-blue-200 bg-blue-50/50", badge: "bg-blue-100 text-blue-700", items: ["3-4-Sterne-Hotel: 50–100 €", "Restaurant: 15–25 €", "Taxi / Mietwagen: 20–40 €", "Aktivitäten: 20–40 €"] },
                { level: "Luxus-Reisender", emoji: "👑", daily: "200–500+ € / Tag", color: "border-amber-200 bg-amber-50/50", badge: "bg-amber-100 text-amber-700", items: ["5-Sterne-Resort All-Inc.: 150–350 €", "Gourmet-Restaurant: 40–80 €", "Private Transfers: 60–120 €", "Exklusive Touren: 80–200 €"] },
              ].map((b) => (
                <div key={b.level} className={`rounded-2xl border-2 p-6 ${b.color}`}>
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-3 shadow-sm">{b.emoji}</div>
                  <h3 className="font-extrabold text-gray-900 mb-1">{b.level}</h3>
                  <p className={`text-sm font-bold px-3 py-1 rounded-lg inline-block mb-4 ${b.badge}`}>{b.daily}</p>
                  <ul className="space-y-1.5">{b.items.map((i) => <li key={i} className="text-xs text-gray-600 flex gap-2"><span className="text-gray-300">•</span> {i}</li>)}</ul>
                </div>
              ))}
            </div>

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
                    {[
                      ["Übernachtung (pro Nacht)", "15–25 €", "50–100 €", "150–350 €"],
                      ["Frühstück", "2–5 €", "8–15 €", "20–40 €"],
                      ["Mittagessen", "4–8 €", "12–20 €", "30–60 €"],
                      ["Abendessen", "6–12 €", "20–35 €", "50–100 €"],
                      ["Wasser (0,5l)", "0,50 €", "1–2 €", "3–5 €"],
                      ["Tee (Çay)", "0,50–1 €", "1–2 €", "3–5 €"],
                      ["Bier (0,5l)", "1–3 €", "3–6 €", "6–15 €"],
                      ["Taxi (5 km)", "3–5 €", "5–8 €", "10–15 €"],
                      ["Mietwagen (pro Tag)", "25–40 €", "40–70 €", "80–200 €"],
                      ["Aspendos Eintritt", "15 €", "15 €", "15 €"],
                      ["Bootstour (ganztags)", "15–25 €", "25–40 €", "80–200 €"],
                      ["Hamam", "10–20 €", "25–50 €", "80–150 €"],
                      ["Jeep-Safari", "20–35 €", "35–60 €", "100+ €"],
                    ].map(([leistung, budget, mittel, luxus]) => (
                      <tr key={leistung} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{leistung}</td>
                        <td className="px-5 py-3 text-emerald-700">{budget}</td>
                        <td className="px-5 py-3 text-blue-700">{mittel}</td>
                        <td className="px-5 py-3 text-amber-700">{luxus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div><p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Reisezeit</p><p className="text-gray-600 text-xs leading-relaxed">Mai und September sind günstiger als der Hochsommer (Juli–August) – oft 30–40% Ersparnis bei gleich gutem Wetter.</p></div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div><p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: All-Inclusive</p><p className="text-gray-600 text-xs leading-relaxed">Bei All-Inclusive-Resorts sind Essen, Trinken und viele Aktivitäten inklusive – oft günstiger als Hotel + einzeln bezahlen.</p></div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="font-bold mb-0.5">Jetzt Antalya-Pauschalreisen vergleichen</p>
                  <p className="text-white/70 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 299 € p.P.</p>
                </div>
                <IbeCta />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ FOOTER CTA ═══════════════ */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
          <div>
            <h3 className="text-xl font-extrabold mb-1">Bereit für deinen Antalya-Urlaub?</h3>
            <p className="text-white/70 text-sm">Jetzt tagesaktuelle Pauschalreisen, All-Inclusive & Last-Minute Deals vergleichen und günstig buchen.</p>
          </div>
          <Link href="/urlaubsziele/antalya/" className="bg-white text-[#00838F] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 shadow-sm">
            Antalya Angebote ansehen →
          </Link>
        </div>

      </main>
    </div>
  );
}
