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
  { label: "Januar", emoji: "🌤️", text: "Angenehm warm (20 °C). Perfekt für Tauchen und Wüstenausflüge ohne Hitze." },
  { label: "Februar", emoji: "🐠", text: "Ruhige Nebensaison. Ideal für günstige Tauchkurse und entspannte Strandtage." },
  { label: "März", emoji: "🌊", text: "Das Meer wird wärmer. Guter Mix aus Strand, Schnorcheln und Sightseeing." },
  { label: "April", emoji: "⛵", text: "Perfekte Temperaturen. Bootsausflüge zu den Giftun-Inseln sind jetzt ideal." },
  { label: "Mai", emoji: "🤿", text: "Tauch-Hochsaison beginnt. Klare Sicht im Roten Meer und warme Tage." },
  { label: "Juni", emoji: "☀️", text: "Heiß und sonnig. Strandtage und Wassersport stehen im Mittelpunkt." },
  { label: "Juli", emoji: "🏖️", text: "Hochsommer. Sehr heiß, aber das Meer bietet perfekte Abkühlung." },
  { label: "August", emoji: "🌅", text: "Heißester Monat (bis 40 °C). Alles dreht sich um Wasser und Klimaanlage." },
  { label: "September", emoji: "🐬", text: "Angenehmer werdend. Delfinbeobachtung und Schnorcheln bei bester Sicht." },
  { label: "Oktober", emoji: "🏜️", text: "Ideal für Wüstensafaris. Noch warm genug zum Baden, weniger Touristen." },
  { label: "November", emoji: "🧘", text: "Ruhig und entspannt. Perfekt für Wellness und Tauchabenteuer." },
  { label: "Dezember", emoji: "🎄", text: "Mildes Winterwetter (22 °C). Ideal als Flucht vor dem europäischen Winter." },
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

function IbeCta({ label = "Pauschalreisen nach Hurghada suchen" }: { label?: string }) {
  return (
    <button
      onClick={() => {
        const url = "https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=310";
        const fn = (window as any).ibeOpenBooking;
        if (typeof fn === "function") fn(url, "Pauschalreisen nach Hurghada");
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

export default function HurghadaGuide() {
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
          "https://api.open-meteo.com/v1/forecast?latitude=27.2579&longitude=33.8116&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Africa/Cairo"
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
      setLiveTime(new Date().toLocaleTimeString("de-DE", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
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
            <span className="text-white font-medium">Hurghada</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Hurghada Reiseführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">2026</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                Dein umfassender Guide für den perfekten Ägypten-Urlaub am Roten Meer – Strände, Tauchen, Wüste & praktische Infos.
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
                  Wetter in Hurghada
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
                    { icon: "🌸", season: "Frühling (Mär–Mai)", desc: "Ideal für Tauchen & Sightseeing." },
                    { icon: "☀️", season: "Sommer (Jun–Aug)", desc: "Sehr heiß, perfekt für Strand & Meer." },
                    { icon: "🌅", season: "Herbst (Sep–Nov)", desc: "Angenehm warm, beste Tauchsicht." },
                    { icon: "🌤️", season: "Winter (Dez–Feb)", desc: "Mild (20 °C), ideal für Ruhesuchende." },
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
                  <p><span className="mr-1.5">🥇</span><strong>Erstbesucher:</strong> <span className="text-white/80">Giftun-Inseln, Schnorcheln, Marina, Wüstensafari, El Gouna.</span></p>
                  <p><span className="mr-1.5">👨‍👩‍👧‍👦</span><strong>Familien:</strong> <span className="text-white/80">Aqua Park, Glasbodenboot, Sand City, Delfin-Show, Makadi Bay.</span></p>
                  <p><span className="mr-1.5">💕</span><strong>Paare:</strong> <span className="text-white/80">Mahmya Island, Sonnenuntergang am Roten Meer, Beduinen-Dinner, Bootstour, Spa.</span></p>
                  <p><span className="mr-1.5">🤿</span><strong>Taucher:</strong> <span className="text-white/80">Abu Nuhas Wracks, Giftun Drift, Shaab El Erg, Umm Gamar, Abu Ramada.</span></p>
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach Hurghada</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 399 € p.P. All-Inclusive am Roten Meer.</p>
                </div>
                <IbeCta />
              </div>
            </div>

            {/* Month Scroll */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Hurghada nach Monaten</h2>
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Hurghada zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe className="w-full h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115089.71865476982!2d33.7416!3d27.2579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14537f03e6112b6f%3A0x4e9cbb8e4c3bb404!2sHurghada%2C%20%C3%84gypten!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Land:</span> Ägypten <Flag code="eg" alt="Ägypten" /></li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Region:</span> Red Sea Governorate, Ostküste Ägyptens</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Meer:</span> Rotes Meer</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Besonderheit:</span> Hurghada erstreckt sich über 40 km Küstenlinie entlang des Roten Meeres – eines der weltweit besten Tauch- und Schnorchelreviere mit ganzjährig warmem Wasser.</li>
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
              <StatCard icon="👥" label="Einwohner" value="~300.000" />
              <StatCard icon="🌍" label="Fläche" value="Red Sea Gov." />
              <StatCard icon="🗣️" label="Sprache" value="Arabisch" />
              <StatCard icon="💵" label="Währung" value="EGP (£E)" />
              <StatCard icon="🕐" label="Zeitzone" value="UTC+2 (MEZ+1)" />
              <StatCard icon="✈️" label="Flughafen" value="HRG" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Arabisch. In Hotels und Touristengebieten wird oft Englisch, Deutsch und Russisch gesprochen." },
                  { icon: "💵", label: "Währung", text: "Ägyptisches Pfund (EGP/£E). 1 EUR ≈ 50 EGP (Stand 2026). Euro und US-Dollar werden vielerorts akzeptiert, der Kurs ist aber meist ungünstig." },
                  { icon: "🛂", label: "Einreise", text: "Deutsche benötigen ein Visum: e-Visa vorab (~25 USD) oder Visa-on-Arrival am Flughafen (25 USD). Reisepass muss 6 Monate über die Reise hinaus gültig sein." },
                  { icon: "💧", label: "Trinkwasser", text: "Leitungswasser NICHT trinken! Immer Flaschenwasser kaufen (1,5l ab 10 EGP). Im Restaurant nur versiegelte Flaschen. Auch zum Zähneputzen Flaschenwasser nutzen." },
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
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">Hurghada hat ein heißes Wüstenklima. Sommer extrem heiß, Winter mild und sonnig. Kaum Regen das ganze Jahr. Beste Reisezeit: Oktober bis April.</p>
                  <div className="space-y-3">
                    {[
                      { label: "Frühling", temp: "25–35 °C", w: "75%", color: "bg-emerald-500" },
                      { label: "Sommer", temp: "35–42 °C", w: "100%", color: "bg-amber-500" },
                      { label: "Herbst", temp: "25–35 °C", w: "80%", color: "bg-orange-400" },
                      { label: "Winter", temp: "18–25 °C", w: "50%", color: "bg-sky-500" },
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
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><span>🌊</span> Wassertemperatur (Rotes Meer)</h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { m: "Jan", t: "22°" }, { m: "Apr", t: "24°" }, { m: "Jul", t: "28°" }, { m: "Okt", t: "27°" },
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
                <p>🕌 <strong>Moscheebesuch:</strong> Schultern und Knie bedecken, Frauen zusätzlich das Haar. Schuhe am Eingang ausziehen. Bitte um Erlaubnis bevor man fotografiert.</p>
                <p>💰 <strong>Bakschisch:</strong> Trinkgeld (&quot;Bakschisch&quot;) ist ein fester Bestandteil der ägyptischen Kultur – für Servicekräfte, Gepäckträger, Zimmermädchen.</p>
                <p>🤝 <strong>Handeln:</strong> Auf Basaren und in Souvenirshops ist Feilschen Tradition und wird erwartet. Starte bei 30–40% des genannten Preises.</p>
                <p>☕ <strong>Gastfreundschaft:</strong> Ein angebotener Tee oder Kaffee ist ein Zeichen der Gastfreundschaft und sollte nicht abgelehnt werden.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte & Kultur</h2>
              <p className="text-gray-400 text-sm">Vom Fischerdorf zur Tauch-Metropole am Roten Meer</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Zeitstrahl</h3>
                <TimelineItem year="~3000 v. Chr." era="Altes Ägypten & das Rote Meer" text="Die Region am Roten Meer diente den alten Ägyptern als Zugang zu Handelsrouten nach Punt (heutiges Somalia/Eritrea). Der Hafen Myos Hormos lag in der Nähe des heutigen Hurghada." color="bg-amber-500" />
                <TimelineItem year="3.–7. Jh." era="Römische & koptische Zeit" text="Die Römer nutzten Häfen am Roten Meer für den Handel mit Indien. Koptische Christen gründeten Klöster in der östlichen Wüste, von denen einige bis heute bestehen." color="bg-red-500" />
                <TimelineItem year="7.–19. Jh." era="Islamische Periode" text="Nach der arabischen Eroberung Ägyptens blieb die Region dünn besiedelt. Fischer und Beduinenstämme prägten das Leben an der Küste über Jahrhunderte." color="bg-purple-500" />
                <TimelineItem year="Frühes 20. Jh." era="Kleines Fischerdorf" text="Hurghada war ein verschlafenes Fischerdorf mit wenigen Hundert Einwohnern. Die Entdeckung von Erdöl in der Region brachte erste wirtschaftliche Impulse." color="bg-emerald-500" />
                <TimelineItem year="1980er Jahre" era="Tourismus-Boom" text="Die Schönheit der Korallenriffe wurde international bekannt. Erste Tauchschulen und Hotels entstanden. Der Flughafen wurde ausgebaut und Hurghada entwickelte sich rasant." color="bg-blue-500" />
                <TimelineItem year="Heute" era="Internationale Urlaubsmetropole" text="Hurghada ist eines der beliebtesten Reiseziele Ägyptens mit über 200 Hotels, einem internationalen Flughafen und Millionen von Besuchern jährlich. Die Stadt erstreckt sich über 40 km Küstenlinie." color="bg-teal-500" />
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2">🏛️ Historische Highlights in der Region</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>Luxor</strong> – Tal der Könige, Karnak-Tempel (ca. 4 Std.)</li>
                    <li><strong>Mons Claudianus</strong> – Römischer Granitsteinbruch in der Wüste</li>
                    <li><strong>St.-Antonius-Kloster</strong> – Ältestes Kloster der Welt (328 n. Chr.)</li>
                    <li><strong>St.-Paulus-Kloster</strong> – Koptisches Wüstenkloster</li>
                    <li><strong>Alte Hafenstadt Myos Hormos</strong> – Römischer Handelshafen</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Lokale Etikette</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Begrüßung", text: "Ein freundliches \"Salam\" oder \"Ahlan\" wird sehr geschätzt." },
                      { title: "Bakschisch", text: "Trinkgeld ist allgegenwärtig – 10–15% im Restaurant, kleine Beträge für Dienste." },
                      { title: "Kleidung", text: "In Hotels & am Strand westliche Kleidung ok. In der Stadt konservativere Kleidung wählen." },
                      { title: "Ramadan", text: "Während des Ramadan tagsüber nicht in der Öffentlichkeit essen oder trinken." },
                    ].map((item) => (
                      <div key={item.title}>
                        <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Hurghada heute</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🏙️ ~300.000 Einwohner</li>
                    <li>✈️ ~5 Mio. Touristen pro Jahr</li>
                    <li>🏖️ 360+ Sonnentage im Jahr</li>
                    <li>🏨 Über 200 Hotels & Resorts</li>
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
              <p className="text-gray-400 text-sm">Die besten Sehenswürdigkeiten in und um Hurghada</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Natur & Unterwasserwelt</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Giftun-Inseln (Nationalpark)" desc="Zwei traumhafte Inseln mit kristallklarem Wasser, Korallenriffen und weißen Sandstränden. Perfekt zum Schnorcheln und Relaxen." mapHref="https://www.google.com/maps/search/?api=1&query=Giftun+Islands+Hurghada" address="Giftun Islands, Red Sea" duration="Ganztags" cost="~30 €" tip="Bootstouren ab Hurghada Marina, Nationalpark-Gebühr inklusive. Frühbucher-Rabatt online." />
                <SightCard title="Mahmya Island" desc="Exklusiver Strandclub auf der Giftun-Insel. Weißer Sand, türkises Wasser und gehobener Service – das karibische Feeling am Roten Meer." mapHref="https://www.google.com/maps/search/?api=1&query=Mahmya+Island+Hurghada" address="Giftun Island, Red Sea" duration="Ganztags" cost="~50 €" tip="Online vorbuchen – die Plätze sind begrenzt. Schnorchelausrüstung ist inklusive." />
                <SightCard title="El Gouna" desc="Die elegante Lagunenstadt 20 km nördlich. Kanäle, bunte Architektur, Golfplatz und eine lebendige Downtown mit Restaurants und Bars." mapHref="https://www.google.com/maps/search/?api=1&query=El+Gouna+Egypt" address="El Gouna, Red Sea Governorate" duration="Halbtags–Ganztags" cost="Kostenlos" tip="Mit dem Taxi oder Minibus erreichbar (ca. 30 Min.). Downtown Abu Tig Marina ist besonders schön." />
                <SightCard title="Orange Bay (Paradise Island)" desc="Traumhafte Insel mit Strandclub-Atmosphäre. Kristallklares Wasser, Wassersport und Entspannung pur." mapHref="https://www.google.com/maps/search/?api=1&query=Orange+Bay+Hurghada" address="Paradise Island, Hurghada" duration="Ganztags" cost="~35 €" tip="Bootstour inklusive Mittagessen. Schnorchelausrüstung mitnehmen!" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Kultur & Stadtleben</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Al-Mina Moschee (Aldahaar)" desc="Die größte und schönste Moschee Hurghadas mit beeindruckender Architektur und Minaretten. Abends wunderschön beleuchtet." mapHref="https://www.google.com/maps/search/?api=1&query=Al+Mina+Mosque+Hurghada" address="El Dahar, Hurghada" duration="30–60 Min." cost="Kostenlos" tip="Außerhalb der Gebetszeiten besuchen. Lange Kleidung tragen." />
                <SightCard title="Hurghada Marine Museum & Aquarium" desc="Einblick in die faszinierende Unterwasserwelt des Roten Meeres – ideal für alle, die nicht tauchen möchten." mapHref="https://www.google.com/maps/search/?api=1&query=Hurghada+Marine+Museum" address="Hurghada, Red Sea" duration="1–2 Std." cost="~10 €" tip="Besonders spannend für Kinder. Kombination mit Glasbodenboot empfehlenswert." />
                <SightCard title="Hurghada Marina" desc="Moderne Flaniermeile mit Restaurants, Cafés und Yachthafen. Perfekt für einen Abendspaziergang mit Meerblick." mapHref="https://www.google.com/maps/search/?api=1&query=Hurghada+Marina" address="New Hurghada Marina" duration="1–3 Std." cost="Kostenlos" tip="Abends kommen, wenn die Boote beleuchtet sind und die Restaurants öffnen." />
                <SightCard title="Sand City Hurghada" desc="Freiluft-Museum mit riesigen Sandskulpturen – von Pharaonen bis Hollywood-Figuren. Beeindruckend für die ganze Familie." mapHref="https://www.google.com/maps/search/?api=1&query=Sand+City+Hurghada" address="Sahl Hasheesh Road, Hurghada" duration="1–2 Std." cost="~10 €" tip="Am besten am späten Nachmittag besuchen, wenn die Sonne tiefer steht und die Skulpturen toll beleuchtet sind." />
              </div>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten & Tickets</h2>
              <p className="text-gray-400 text-sm">Buche direkt vor Ort oder von zuhause – Touren, Tauchkurse & Erlebnisse für deinen Hurghada-Urlaub.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "🤿", label: "Tauchen", desc: "Korallenriffe & Wracks" },
                { emoji: "🐬", label: "Bootstouren", desc: "Inseln & Delfine" },
                { emoji: "🏜️", label: "Wüstensafari", desc: "Quad & Beduinen" },
                { emoji: "🏄", label: "Wassersport", desc: "Kiten & Surfen" },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                </div>
              ))}
            </div>

            <TiqetsCarousel cityId="19370" cityName="Hurghada" citySlug="hurghada" />
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
                  duration: "7 Tage",
                  highlight: "Romantik, Meer & Wüste",
                  days: [
                    { day: "Tag 1", title: "Ankommen & Marina", icon: "⛵", color: "bg-rose-100", dayCost: "~30 €", transport: "Hoteltransfer + Taxi", meals: "Marina-Restaurant", stops: [
                      { time: "14:00", activity: "Check-in im Resort & Pool genießen", icon: "🏨", tip: "All-Inclusive-Resorts bieten oft Upgrade bei Ankunft" },
                      { time: "17:00", activity: "Spaziergang zur Hurghada Marina", icon: "⛵" },
                      { time: "19:00", activity: "Romantisches Dinner mit Meerblick", icon: "🍽️", tip: "Restaurants an der Marina haben frischen Fisch ab 150 EGP" },
                      { time: "21:00", activity: "Sundowner an der Hafenpromenade", icon: "🌙" },
                    ]},
                    { day: "Tag 2", title: "Mahmya Island Paradies", icon: "🏝️", color: "bg-amber-100", dayCost: "~50 €", transport: "Boot (im Preis)", meals: "Lunch auf der Insel", stops: [
                      { time: "08:00", activity: "Bootstour zur Mahmya Island", icon: "⛵", tip: "Online vorbuchen – die exklusivste Insel-Erfahrung in Hurghada" },
                      { time: "10:00", activity: "Schnorcheln am Korallenriff", icon: "🤿" },
                      { time: "12:30", activity: "Gourmet-Mittagessen auf der Insel", icon: "🍽️" },
                      { time: "14:00", activity: "Entspannen am weißen Sandstrand", icon: "🏖️" },
                      { time: "16:30", activity: "Rückfahrt mit Sonnenuntergang", icon: "🌅", tip: "Champagner-Upgrade für ~20 € extra möglich" },
                    ]},
                    { day: "Tag 3", title: "El Gouna Entdecken", icon: "🏘️", color: "bg-blue-100", dayCost: "~40 €", transport: "Taxi (~10 €)", meals: "Downtown Abu Tig", stops: [
                      { time: "10:00", activity: "Fahrt nach El Gouna (20 Min.)", icon: "🚕" },
                      { time: "10:30", activity: "Bummel durch die bunte Downtown", icon: "🏘️", tip: "Die Lagunenstadt ist komplett autofrei im Zentrum" },
                      { time: "12:00", activity: "Kaffee an der Abu Tig Marina", icon: "☕" },
                      { time: "13:30", activity: "Mittagessen im Tamr Henna Restaurant", icon: "🍽️" },
                      { time: "15:00", activity: "Bootsfahrt durch die Lagunen", icon: "⛵" },
                      { time: "18:00", activity: "Sundowner in einer Strandbar", icon: "🍸", tip: "Mangroovy Beach Bar ist der beste Spot für den Sonnenuntergang" },
                    ]},
                    { day: "Tag 4", title: "Wüste & Sterne", icon: "🏜️", color: "bg-orange-100", dayCost: "~35 €", transport: "Abholung durch Veranstalter", meals: "Beduinen-BBQ", stops: [
                      { time: "14:00", activity: "Wüstensafari per Quad oder Jeep", icon: "🏜️", tip: "Nachmittagstour wählen – dann erlebt man Sonnenuntergang und Sterne" },
                      { time: "16:00", activity: "Besuch eines Beduinendorfs", icon: "🏕️" },
                      { time: "17:30", activity: "Kamelritt bei Sonnenuntergang", icon: "🐪" },
                      { time: "19:00", activity: "Beduinen-BBQ unter dem Sternenhimmel", icon: "🌌", tip: "Ohne Lichtverschmutzung sieht man die Milchstraße mit bloßem Auge" },
                      { time: "21:00", activity: "Rückfahrt zum Hotel", icon: "🚙" },
                    ]},
                    { day: "Tag 5", title: "Tauchen & Spa", icon: "🤿", color: "bg-cyan-100", dayCost: "~60 €", transport: "Tauchboot", meals: "An Bord + Hotel", stops: [
                      { time: "08:00", activity: "Schnuppertauchen oder Schnorcheltour", icon: "🤿", tip: "Schnuppertauchen ab 40 € – keine Vorkenntnisse nötig" },
                      { time: "10:00", activity: "Zweiter Tauchgang am Korallenriff", icon: "🐠" },
                      { time: "12:00", activity: "Mittagessen an Bord", icon: "🍽️" },
                      { time: "14:00", activity: "Rückkehr & Entspannung am Pool", icon: "🏊" },
                      { time: "16:00", activity: "Paar-Spa-Behandlung im Hotel", icon: "💆", tip: "Ägyptische Massagen sind deutlich günstiger als in Europa – ab 25 €" },
                      { time: "20:00", activity: "Candlelight-Dinner am Strand", icon: "🕯️" },
                    ]},
                    { day: "Tag 6", title: "Sahl Hasheesh Luxus", icon: "🏖️", color: "bg-purple-100", dayCost: "~35 €", transport: "Taxi (15 Min.)", meals: "Strandrestaurant", stops: [
                      { time: "10:00", activity: "Fahrt nach Sahl Hasheesh", icon: "🚕" },
                      { time: "10:30", activity: "Baden am exklusiven Sandstrand", icon: "🏖️", tip: "Einer der schönsten Strände Ägyptens – feiner Sand, klares Wasser" },
                      { time: "13:00", activity: "Mittagessen im Strandrestaurant", icon: "🍽️" },
                      { time: "15:00", activity: "Old Vic Beach Bar entspannen", icon: "🍹" },
                      { time: "18:00", activity: "Rückfahrt & Abendessen im Hotel", icon: "🍽️" },
                    ]},
                    { day: "Tag 7", title: "Letzte Einkäufe & Abschied", icon: "🛍️", color: "bg-teal-100", dayCost: "~20 €", transport: "Taxi + zu Fuß", meals: "El Dahar Lokale Küche", stops: [
                      { time: "10:00", activity: "Bummel durch El Dahar (Altstadt)", icon: "🏘️", tip: "Authentischstes Viertel – hier kaufen auch Einheimische ein" },
                      { time: "11:30", activity: "Souvenirs auf dem Basar", icon: "🛍️", tip: "Papyrus, Gewürze, ätherische Öle – immer handeln!" },
                      { time: "13:00", activity: "Abschluss-Mittagessen: Koshari & frischer Saft", icon: "🍽️" },
                      { time: "15:00", activity: "Letzter Pool- oder Strandbesuch", icon: "🏊" },
                    ]},
                  ] as DayPlan[],
                },
                families: {
                  label: "Familien",
                  emoji: "👨‍👩‍👧‍👦",
                  color: "from-blue-500 to-indigo-500",
                  budget: "~600 € (Fam.)",
                  duration: "7 Tage",
                  highlight: "Meer, Abenteuer & Spaß",
                  days: [
                    { day: "Tag 1", title: "Ankommen & Strand", icon: "🏖️", color: "bg-blue-100", dayCost: "~20 € Fam.", transport: "Hoteltransfer", meals: "All-Inclusive Hotel", stops: [
                      { time: "14:00", activity: "Check-in & Hotelstrand erkunden", icon: "🏨" },
                      { time: "16:00", activity: "Kinder-Pool & Wasserrutschen", icon: "🏊", tip: "Die meisten Resorts haben eigene Kinder-Aqua-Parks" },
                      { time: "18:00", activity: "Familien-Abendessen im Hotel", icon: "🍽️" },
                      { time: "20:00", activity: "Abendprogramm & Animation", icon: "🎭" },
                    ]},
                    { day: "Tag 2", title: "Glasbodenboot & Schnorcheln", icon: "🐠", color: "bg-cyan-100", dayCost: "~50 € Fam.", transport: "Hoteltransfer zum Hafen", meals: "Mittagessen an Bord", stops: [
                      { time: "09:00", activity: "Glasbodenboot-Tour starten", icon: "🚢", tip: "Ideal für kleine Kinder – Unterwasserwelt sehen ohne nass zu werden" },
                      { time: "10:30", activity: "Schnorchelstopp am Korallenriff", icon: "🤿" },
                      { time: "12:00", activity: "Mittagessen an Bord", icon: "🍽️" },
                      { time: "13:30", activity: "Zweiter Badestopp & Wasserrutsche vom Boot", icon: "💦" },
                      { time: "15:30", activity: "Rückkehr zum Hotel", icon: "⚓" },
                      { time: "17:00", activity: "Pool-Nachmittag", icon: "🏊" },
                    ]},
                    { day: "Tag 3", title: "Giftun-Inseln Paradies", icon: "🏝️", color: "bg-emerald-100", dayCost: "~80 € Fam.", transport: "Boot", meals: "BBQ-Lunch auf der Insel", stops: [
                      { time: "08:30", activity: "Bootstour zu den Giftun-Inseln", icon: "⛵" },
                      { time: "10:30", activity: "Schnorcheln im türkisblauen Wasser", icon: "🐠", tip: "Schwimmwesten für Kinder an Bord vorhanden" },
                      { time: "12:30", activity: "BBQ-Mittagessen am Strand", icon: "🍖" },
                      { time: "14:00", activity: "Sandburgen bauen & Strandspiele", icon: "🏰" },
                      { time: "16:00", activity: "Rückfahrt mit Delfin-Spotting", icon: "🐬", tip: "Auf dem Rückweg oft Delfine zu sehen – Kamera bereithalten!" },
                    ]},
                    { day: "Tag 4", title: "Wüstenabenteuer", icon: "🏜️", color: "bg-amber-100", dayCost: "~60 € Fam.", transport: "Abholung durch Veranstalter", meals: "Beduinen-BBQ", stops: [
                      { time: "14:00", activity: "Jeep-Safari in die Wüste", icon: "🚙", tip: "Kinder lieben die Dünenfahrt – Sonnenschutz und Wasser mitnehmen!" },
                      { time: "15:30", activity: "Besuch eines Beduinendorfs", icon: "🏕️" },
                      { time: "16:30", activity: "Kamelreiten für die ganze Familie", icon: "🐪", tip: "Kinder können gemeinsam mit einem Elternteil reiten" },
                      { time: "18:00", activity: "Sonnenuntergang in der Wüste", icon: "🌅" },
                      { time: "19:00", activity: "BBQ-Dinner & Sternenhimmel", icon: "🌌" },
                    ]},
                    { day: "Tag 5", title: "Aqua Park & Sand City", icon: "🎢", color: "bg-purple-100", dayCost: "~70 € Fam.", transport: "Taxi", meals: "Im Park + Hotel", stops: [
                      { time: "09:30", activity: "Aqua Park – Rutschen & Wellenbad", icon: "🎢", tip: "Jungle Aqua Park oder Sindbad Aqua Park – ganztägig Spaß" },
                      { time: "12:30", activity: "Mittagessen im Park", icon: "🍔" },
                      { time: "14:30", activity: "Weiter rutschen & planschen", icon: "💦" },
                      { time: "16:00", activity: "Sand City Hurghada besuchen", icon: "🏰", tip: "Riesige Sandskulpturen – Pharaonen & Filmfiguren" },
                      { time: "18:00", activity: "Abendessen im Hotel & Animation", icon: "🍽️" },
                    ]},
                    { day: "Tag 6", title: "Delfin-Tour & Strand", icon: "🐬", color: "bg-pink-100", dayCost: "~50 € Fam.", transport: "Boot + Hotel", meals: "An Bord + Hotel", stops: [
                      { time: "07:00", activity: "Frühe Delfin-Schwimm-Tour", icon: "🐬", tip: "Frühe Touren haben die beste Chance auf Delfinbegegnungen" },
                      { time: "09:00", activity: "Schnorcheln mit den Delfinen", icon: "🤿" },
                      { time: "11:00", activity: "Rückkehr & Strandvormittag", icon: "🏖️" },
                      { time: "13:00", activity: "Mittagessen im Hotel", icon: "🍽️" },
                      { time: "15:00", activity: "Freier Nachmittag – Pool & Strand", icon: "🏊" },
                      { time: "19:00", activity: "Familien-Abschiedsdinner", icon: "🍽️" },
                    ]},
                    { day: "Tag 7", title: "Letzter Strandtag", icon: "🌅", color: "bg-yellow-100", dayCost: "~15 € Fam.", transport: "Hotel", meals: "All-Inclusive", stops: [
                      { time: "09:00", activity: "Ausgiebiges Frühstück", icon: "🍳" },
                      { time: "10:00", activity: "Letztes Baden & Strandspiele", icon: "🏖️" },
                      { time: "12:00", activity: "Pool-Party mit den Kindern", icon: "🏊" },
                      { time: "14:00", activity: "Check-out & Transfer zum Flughafen", icon: "✈️", tip: "3 Std. vor Abflug am Flughafen sein" },
                    ]},
                  ] as DayPlan[],
                },
                solo: {
                  label: "Solo & Backpacker",
                  emoji: "🎒",
                  color: "from-amber-500 to-orange-500",
                  budget: "~250 € total",
                  duration: "5 Tage",
                  highlight: "Tauchen, Kultur & Freiheit",
                  days: [
                    { day: "Tag 1", title: "El Dahar & Locals", icon: "🏘️", color: "bg-amber-100", dayCost: "~20 €", transport: "Zu Fuß + Minibus", meals: "Straßenessen", stops: [
                      { time: "09:00", activity: "Frühstück: Ful & Ta'ameya vom Straßenstand", icon: "🥙", tip: "Das ägyptische Frühstück kostet nur 20–30 EGP" },
                      { time: "10:00", activity: "El Dahar Altstadt erkunden – das echte Hurghada", icon: "🏘️" },
                      { time: "11:30", activity: "Al-Mina Moschee besichtigen", icon: "🕌" },
                      { time: "13:00", activity: "Koshari-Mittagessen im lokalen Restaurant", icon: "🍽️", tip: "Ägyptens Nationalgericht – eine große Portion ab 30 EGP" },
                      { time: "15:00", activity: "Hurghada Marina Spaziergang", icon: "⛵" },
                      { time: "18:00", activity: "Sonnenuntergang am Stadtstrand", icon: "🌅" },
                      { time: "20:00", activity: "Shisha-Café & Backpacker kennenlernen", icon: "💨" },
                    ]},
                    { day: "Tag 2", title: "Tauchen am Riff", icon: "🤿", color: "bg-blue-100", dayCost: "~45 €", transport: "Tauchboot", meals: "An Bord + Streetfood", stops: [
                      { time: "07:30", activity: "Tagestour: 2 Tauchgänge am Korallenriff", icon: "🤿", tip: "PADI Open Water Kurs ab 250 € – oder Schnuppertauchen ab 40 €" },
                      { time: "10:00", activity: "Erster Tauchgang: Abu Ramada Riff", icon: "🐠" },
                      { time: "12:00", activity: "Mittagessen auf dem Boot & Sonnenbaden", icon: "🍽️" },
                      { time: "14:00", activity: "Zweiter Tauchgang: Giftun Drift", icon: "🐢" },
                      { time: "16:00", activity: "Rückkehr & Nachmittag am Strand", icon: "🏖️" },
                      { time: "20:00", activity: "Günstig essen in Sekalla", icon: "🍽️", tip: "Die Sheraton Road hat die besten Budget-Restaurants" },
                    ]},
                    { day: "Tag 3", title: "Wüste & Beduinen", icon: "🏜️", color: "bg-orange-100", dayCost: "~25 €", transport: "Organisierte Tour", meals: "Beduinen-BBQ", stops: [
                      { time: "14:00", activity: "Quad-Tour durch die Arabische Wüste", icon: "🏍️", tip: "Quad-Tour ab 20 € – unbedingt Tuch gegen Sand mitnehmen" },
                      { time: "16:00", activity: "Beduinendorf besuchen", icon: "🏕️" },
                      { time: "17:00", activity: "Tee mit den Beduinen & Gespräche", icon: "☕", tip: "Die Beduinen sind unglaublich gastfreundlich" },
                      { time: "18:00", activity: "Sonnenuntergang in der Wüste", icon: "🌅" },
                      { time: "19:30", activity: "BBQ unter dem Sternenhimmel", icon: "🌌" },
                      { time: "21:00", activity: "Stargazing in der Wüste", icon: "⭐", tip: "Klarer Himmel fast garantiert – Milchstraße sichtbar!" },
                    ]},
                    { day: "Tag 4", title: "Giftun & Schnorcheln", icon: "🏝️", color: "bg-cyan-100", dayCost: "~30 €", transport: "Boot", meals: "Lunch an Bord", stops: [
                      { time: "08:00", activity: "Schnorchelausflug zu den Giftun-Inseln", icon: "⛵" },
                      { time: "10:00", activity: "Schnorcheln am Korallenriff", icon: "🐠" },
                      { time: "12:00", activity: "Mittagessen & Relaxen am Strand", icon: "🏖️" },
                      { time: "14:00", activity: "Zweiter Schnorchel-Stopp", icon: "🤿" },
                      { time: "16:00", activity: "Rückfahrt & Abend frei", icon: "⚓" },
                      { time: "19:00", activity: "Fischrestaurant in El Dahar", icon: "🐟", tip: "Frischer Fisch vom Markt – Restaurant grillt ihn für wenig Geld" },
                    ]},
                    { day: "Tag 5", title: "El Gouna & Abschied", icon: "🏘️", color: "bg-emerald-100", dayCost: "~25 €", transport: "Minibus (5 EGP)", meals: "Café + Streetfood", stops: [
                      { time: "09:00", activity: "Minibus nach El Gouna", icon: "🚌", tip: "Lokaler Minibus kostet nur 5–10 EGP statt 200 EGP Taxi" },
                      { time: "10:00", activity: "Downtown Abu Tig Marina erkunden", icon: "🏘️" },
                      { time: "12:00", activity: "Strand in El Gouna genießen", icon: "🏖️" },
                      { time: "14:00", activity: "Mittagessen & Kaffee", icon: "☕" },
                      { time: "16:00", activity: "Rückfahrt & letzte Souvenirs", icon: "🛍️", tip: "Gewürze, Papyrus und ätherische Öle als Mitbringsel" },
                      { time: "19:00", activity: "Abschlussabend auf der Dachterrasse", icon: "🌙" },
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
                        { title: "All-Inclusive", text: "All-Inclusive-Resorts sind in Hurghada oft günstiger als Hotel + einzeln essen. Ab 40 € p.P./Nacht.", icon: "🏨" },
                        { title: "Transport", text: "Minibusse kosten 5–10 EGP. Taxipreis VOR der Fahrt verhandeln. Uber funktioniert in Hurghada.", icon: "🚌" },
                        { title: "Essen", text: "Straßenessen ist sicher und günstig: Koshari ab 30 EGP, Ful ab 15 EGP. Touristenrestaurants kosten 5x mehr.", icon: "🍽️" },
                        { title: "Touren", text: "Touren über das Hotel sind teurer. Direkt bei Anbietern in der Stadt buchen spart 30–50%.", icon: "🎫" },
                        { title: "Handeln", text: "Im Basar nie den ersten Preis akzeptieren! Starte bei 30% und einige dich bei 50–60%.", icon: "🛍️" },
                        { title: "Geld", text: "Am Flughafen nur minimal tauschen. Bessere Kurse in der Stadt (Wechselstuben in Sekalla). Kartenzahlung in Hotels ok.", icon: "💳" },
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
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das echte Hurghada</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Stargazing in der Wüste",
                  badge: "Magisch",
                  badgeColor: "red",
                  desc: "Fahr abends in die Arabische Wüste – ohne Lichtverschmutzung bietet sich ein unfassbarer Sternenhimmel. Die Milchstraße ist mit bloßem Auge sichtbar. Manche Anbieter haben Teleskope dabei.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Eastern+Desert+Hurghada",
                  address: "Arabische Wüste, östlich von Hurghada",
                },
                {
                  title: "El Dahar Fischmarkt",
                  badge: "Authentisch",
                  badgeColor: "amber",
                  desc: "Der lokale Fischmarkt in der Altstadt – frischer geht es nicht. Kaufe deinen Fisch und lass ihn in einem der umliegenden Restaurants zubereiten. Ein Bruchteil der Kosten touristischer Restaurants.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Fish+Market+El+Dahar+Hurghada",
                  address: "El Dahar, Hurghada",
                },
                {
                  title: "Beduinen-Dinner in der Wüste",
                  badge: "Kulinarisch",
                  badgeColor: "amber",
                  desc: "Ein authentisches Abendessen bei den Beduinen mit frisch gegrilltem Fleisch, Fladenbrot und Tee. Unter dem Sternenhimmel, umgeben von absoluter Stille – unvergesslich.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Bedouin+Village+Hurghada",
                  address: "Arabische Wüste bei Hurghada",
                },
                {
                  title: "El Gouna Downtown bei Nacht",
                  badge: "Nightlife",
                  badgeColor: "blue",
                  desc: "Das charmante Städtchen El Gouna verwandelt sich abends: Live-Musik, schicke Cocktailbars an der Marina und ein kosmopolitisches Flair, das man in Hurghada sonst nicht findet.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Downtown+El+Gouna+Abu+Tig+Marina",
                  address: "Abu Tig Marina, El Gouna",
                },
                {
                  title: "Versteckte Riffe zum Schnorcheln",
                  badge: "Geheimspot",
                  badgeColor: "teal",
                  desc: "Statt der überlaufenen Touristenboote: Frage lokale Fischer nach Schnorchelspots abseits der bekannten Riffe. Shaab Abu Shaar und Careless Reef bieten unberührte Korallen.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Careless+Reef+Hurghada",
                  address: "Rotes Meer vor Hurghada",
                },
                {
                  title: "Mangrovenwald am Roten Meer",
                  badge: "Naturjuwel",
                  badgeColor: "green",
                  desc: "Wenige Kilometer südlich liegt ein seltener Mangrovenwald – ein einzigartiges Ökosystem am Roten Meer. Ideal für Naturliebhaber und Fotografen. Am besten bei Ebbe besuchen.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Mangrove+Forest+Hurghada",
                  address: "Südlich von Hurghada",
                },
                {
                  title: "Luxor Tagesausflug",
                  badge: "Kultur-Highlight",
                  badgeColor: "red",
                  desc: "Nur 4 Stunden entfernt liegt Luxor mit dem Tal der Könige, dem Karnak-Tempel und dem Hatschepsut-Tempel. Per Bus oder Inlandsflug (45 Min.) erreichbar.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Luxor+Egypt",
                  address: "Luxor, Ägypten",
                },
                {
                  title: "Sonnenaufgang am Mons Claudianus",
                  badge: "Abenteuer",
                  badgeColor: "teal",
                  desc: "Römischer Granitsteinbruch tief in der Arabischen Wüste. Eine Nacht-Tour mit Camping und Sonnenaufgang zwischen 2.000 Jahre alten Ruinen – ein einmaliges Erlebnis.",
                  mapHref: "https://www.google.com/maps/search/?api=1&query=Mons+Claudianus+Egypt",
                  address: "Arabische Wüste, ca. 120 km von Hurghada",
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
              <p className="text-gray-400 text-sm">Kulinarische Highlights der ägyptischen Küche</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Was du unbedingt probieren musst</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { emoji: "🍚", title: "Koshari", desc: "Ägyptens Nationalgericht: Reis, Linsen, Nudeln und Kichererbsen mit Tomatensoße und Röstzwiebeln. Günstig und sättigend.", price: "1–2 €" },
                  { emoji: "🫘", title: "Ful Medames", desc: "Gekochte Fava-Bohnen mit Olivenöl, Zitrone und Kreuzkümmel – das traditionelle ägyptische Frühstück seit Pharaonenzeiten.", price: "0,50–1 €" },
                  { emoji: "🧆", title: "Ta'ameya (Falafel)", desc: "Die ägyptische Variante wird aus Fava-Bohnen statt Kichererbsen gemacht – außen knusprig, innen grün und aromatisch.", price: "0,50–1 €" },
                  { emoji: "🐟", title: "Frischer Fisch vom Roten Meer", desc: "Fangfrischer Fisch, gegrillt oder gebraten serviert. Am Fischmarkt kaufen und im Restaurant zubereiten lassen.", price: "5–15 €" },
                  { emoji: "🥤", title: "Frische Säfte", desc: "An jeder Ecke: Mango, Guave, Erdbeere, Zuckerrohr – frisch gepresst und eiskalt. Eines der besten Erfrischungen.", price: "0,50–1 €" },
                  { emoji: "💨", title: "Shisha & Tee", desc: "In den lokalen Ahwas (Kaffeehäusern) Shisha rauchen und süßen Minztee oder starken ägyptischen Kaffee genießen.", price: "2–5 €" },
                  { emoji: "🥙", title: "Shawarma", desc: "Dünn geschnittenes Fleisch vom Drehspieß im Fladenbrot – Ägyptens beliebtester Schnellimbiss. Mit Tahini-Soße.", price: "1–3 €" },
                  { emoji: "🍮", title: "Um Ali", desc: "Warmes Dessert aus Blätterteig, Milch, Nüssen und Rosinen – das ägyptische Comfort Food schlechthin.", price: "1–3 €" },
                  { emoji: "🍵", title: "Karkade (Hibiskustee)", desc: "Leuchtend roter Hibiskustee – heiß oder eiskalt. Erfrischend, gesund und das inoffizielle Nationalgetränk Ägyptens.", price: "0,50 €" },
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
                  { badge: "Fisch & Meeresfrüchte", badgeColor: "blue", name: "El Halaka Fish Restaurant", desc: "Direkt am alten Hafen, frischester Fisch der Stadt. Wähle deinen Fisch aus der Auslage – er wird vor deinen Augen zubereitet. Ab ~8 € p.P.", mapHref: "https://www.google.com/maps/search/?api=1&query=El+Halaka+Restaurant+Hurghada", address: "El Dahar, Hurghada" },
                  { badge: "Authentisch & günstig", badgeColor: "green", name: "Gad Restaurant", desc: "Beliebte ägyptische Kette mit großen Portionen und winzigen Preisen. Koshari, Ful, Falafel – alles frisch. Ab ~2 €.", mapHref: "https://www.google.com/maps/search/?api=1&query=Gad+Restaurant+Hurghada", address: "Sekalla, Sheraton Road, Hurghada" },
                  { badge: "Marina-Feeling", badgeColor: "teal", name: "The Lodge Restaurant", desc: "Gehobene Küche an der Hurghada Marina mit Blick auf die Yachten. Internationale und ägyptische Gerichte. Ab ~15 € p.P.", mapHref: "https://www.google.com/maps/search/?api=1&query=The+Lodge+Hurghada+Marina", address: "New Hurghada Marina" },
                  { badge: "Juice & Snacks", badgeColor: "amber", name: "Lokale Saftbars in El Dahar", desc: "Die kleinen Saftbars in der Altstadt pressen dir jeden erdenklichen Saft frisch: Mango, Erdbeere, Zuckerrohr. Ab 15 EGP.", mapHref: "https://www.google.com/maps/search/?api=1&query=El+Dahar+Hurghada", address: "El Dahar Altstadt, Hurghada" },
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
                <p className="text-gray-600 text-xs leading-relaxed">Meide touristische Restaurants an der Sheraton Road. In El Dahar (Altstadt) und den Seitenstraßen findest du authentische ägyptische Küche für einen Bruchteil des Preises. Eine komplette Mahlzeit mit Koshari, Salat und Getränk kostet oft unter 3 €.</p>
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
                  emoji: "🛂", title: "Visum & Einreise",
                  text: "Deutsche, Österreicher und Schweizer benötigen ein Visum: e-Visa vorab online (~25 USD, visa2egypt.gov.eg) oder Visa-on-Arrival am Flughafen (25 USD bar). Reisepass muss 6 Monate über die Reise hinaus gültig sein.",
                },
                {
                  emoji: "✈️", title: "Anreise & Flughafen",
                  text: "Flughafen Hurghada International (HRG) liegt 5 km südwestlich. Direktflüge aus DACH ab ~200 € return (4,5 Std.). Transfer: Hotelshuttle (oft gratis bei Pauschalreise), Taxi (~5–10 €).",
                },
                {
                  emoji: "🚕", title: "Transport vor Ort",
                  text: "Minibusse (Mikrobus) sind das günstigste Transportmittel (5–10 EGP). Taxis: Preis IMMER vorher verhandeln! Uber funktioniert in Hurghada. Mietwagen ab ~25 €/Tag (internationaler Führerschein nötig).",
                },
                {
                  emoji: "💵", title: "Geld & Währung",
                  text: "Ägyptisches Pfund (EGP). 1 EUR ≈ 50 EGP (2026). Am Flughafen minimal tauschen, in der Stadt bessere Kurse. Kreditkarten in Hotels und großen Restaurants akzeptiert. Bargeld für Basare und Streetfood.",
                },
                {
                  emoji: "💰", title: "Trinkgeld (Bakschisch)",
                  text: "Bakschisch ist ein fester Teil der Kultur. Restaurant: 10–15%. Zimmermädchen: 20–50 EGP/Tag. Gepäckträger: 10–20 EGP. Taxifahrer: Aufrunden. Bootscrew: 50–100 EGP.",
                },
                {
                  emoji: "🛡️", title: "Sicherheit",
                  text: "Hurghada ist generell sicher für Touristen. Touristische Gebiete werden stark bewacht. Taschendiebstahl selten, aber wertvollles nicht offen tragen. Keine Wertgegenstände am Strand lassen.",
                },
                {
                  emoji: "🏥", title: "Gesundheit",
                  text: "Kein Leitungswasser trinken! Sonnenschutz essentiell (UV-Index sehr hoch). Apotheken gut ausgestattet. El Gouna Hospital und Hurghada General Hospital für Notfälle. Auslandskrankenversicherung Pflicht!",
                },
                {
                  emoji: "👗", title: "Kleidung & Packliste",
                  text: "Resort/Strand: Strandkleidung ok. In der Stadt: Schultern und Knie bedecken (Respekt). Moschee: Kopftuch für Frauen. Sonnenhut, Reef-Safe Sonnencreme, Wasserschuhe für felsige Strände.",
                },
                {
                  emoji: "🔌", title: "Strom & Technik",
                  text: "Steckdose Typ C (wie Deutschland). 220V/50Hz. Meist kein Adapter nötig für DACH-Reisende. WLAN in allen Hotels, oft langsam. Lokale SIM-Karte (Vodafone/Orange) am Flughafen: ~5 € für 10 GB.",
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
              <p className="text-gray-400 text-sm">Ein paar Worte auf Arabisch öffnen dir Türen und Herzen</p>
            </div>

            {[
              {
                category: "Grundlagen",
                icon: "👋",
                phrases: [
                  ["Hallo", "Ahlan / Marhaba", "AH-lan / MAR-ha-ba"],
                  ["Guten Morgen", "Sabah el-kheir", "sa-BAH el-CHEIR"],
                  ["Guten Abend", "Masa el-kheir", "MA-sa el-CHEIR"],
                  ["Tschüss", "Ma'a salama", "MA-a sa-LA-ma"],
                  ["Bitte", "Min fadlak (m) / Min fadlik (f)", "min FAD-lak"],
                  ["Danke", "Shukran", "SCHUK-ran"],
                  ["Ja / Nein", "Aiwa / La'a", "AI-wa / LA-a"],
                ],
              },
              {
                category: "Im Restaurant",
                icon: "🍽️",
                phrases: [
                  ["Die Rechnung, bitte", "El-hisab, min fadlak", "el-hi-SAB, min FAD-lak"],
                  ["Ein Wasser, bitte", "Mayya, min fadlak", "MAI-ya, min FAD-lak"],
                  ["Sehr lecker!", "Laziz awi!", "la-SIS A-wi"],
                  ["Ohne Schärfe", "Min gheir shatta", "min GHEIR SCHAT-ta"],
                  ["Noch einen Tee, bitte", "Shai tani, min fadlak", "SCHAI TA-ni"],
                ],
              },
              {
                category: "Unterwegs",
                icon: "🗺️",
                phrases: [
                  ["Wo ist...?", "Fein...?", "FEIN"],
                  ["Wie viel kostet das?", "Bi kam da?", "bi KAM da"],
                  ["Zu teuer!", "Ghali awi!", "GHA-li A-wi"],
                  ["Ich verstehe nicht", "Mish fahem (m) / fahma (f)", "misch FA-hem"],
                  ["Hilfe!", "El-haq!", "el-HAQ"],
                ],
              },
            ].map((group) => (
              <div key={group.category}>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">{group.icon}</span> {group.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.phrases.map(([de, ar, pron]) => (
                    <div key={de} className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:border-[#00838F]/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{de}</p>
                        <p className="text-[#00838F] font-semibold text-sm">{ar}</p>
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
                  Ägyptisch-Arabisch klingt weicher als Hocharabisch. <strong>Gh</strong> = ein weiches, kehlig-raues R, <strong>Kh</strong> = wie deutsches &quot;ch&quot; in &quot;Bach&quot;, <strong>Sh</strong> = sch. Ein freundliches &quot;Shukran&quot; (Danke) wird überall sehr geschätzt!
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
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
                <h3 className="font-extrabold text-red-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-sm">🚨</span>
                  Notrufnummern
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-bold text-red-800">🚨 Allgemeiner Notruf</span>
                    <span className="font-extrabold text-red-700 text-lg">122</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚓 Touristenpolizei</span>
                    <span className="font-bold text-gray-900">126</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🚑 Rettungsdienst</span>
                    <span className="font-bold text-gray-900">123</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-100">
                    <span className="font-medium text-gray-700">🔥 Feuerwehr</span>
                    <span className="font-bold text-gray-900">180</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <h3 className="font-extrabold text-blue-800 mb-4 flex items-center gap-2">
                  <Flag code="de" alt="DE" />
                  <Flag code="at" alt="AT" />
                  <Flag code="ch" alt="CH" />
                  <span className="ml-1">Botschaften & Konsulate</span>
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="de" alt="DE" /> Deutsche Botschaft Kairo</span>
                      <span className="font-bold text-gray-900">+20 2 2728 2000</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">2, Sharia Berlin (Hassan Sabri), Zamalek, Kairo</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="at" alt="AT" /> Österr. Botschaft Kairo</span>
                      <span className="font-bold text-gray-900">+20 2 3570 2975</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Corner El Nil & Thawra St., 5th Floor, Kairo</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5"><Flag code="ch" alt="CH" /> Schweizer Botschaft Kairo</span>
                      <span className="font-bold text-gray-900">+20 2 2575 8284</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">10, Abdel Khalek Sarwat St., Kairo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl mb-3">🏥</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Nächstes Krankenhaus</h4>
                <p className="text-xs text-gray-600 mb-2">Hurghada General Hospital & El Gouna Hospital – 24h Notaufnahme. Für ernsthafte Fälle bieten private Kliniken bessere Versorgung.</p>
                <MapLink href="https://www.google.com/maps/search/?api=1&query=Hurghada+General+Hospital" address="El Dahar, Hurghada" />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl mb-3">💊</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Apotheke (Saidaliyya)</h4>
                <p className="text-xs text-gray-600">Apotheken sind in Hurghada weit verbreitet und viele Medikamente rezeptfrei erhältlich. In Hotelresorts gibt es oft eigene Apotheken. 24h-Apotheken in Sekalla.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-3">📋</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Reiseversicherung</h4>
                <p className="text-xs text-gray-600">Auslandskrankenversicherung ist absolute Pflicht! EHIC/EKVK gilt NICHT in Ägypten. Private Reisekrankenversicherung ab ~10 €/Reise abschließen. Bei Tauchunfällen: DAN-Versicherung empfohlen.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-bold text-gray-900 mb-0.5 text-sm">Wichtig: Dokumentenkopien</p>
                <p className="text-gray-600 text-xs leading-relaxed">Fotografiere deinen Reisepass, Visum, Versicherungsnachweis und Buchungsbestätigung und speichere sie in der Cloud (Google Drive, iCloud). So hast du im Notfall immer Zugriff, selbst wenn das Original verloren geht.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ BEACHES ════ */}
        {activeTab === "beaches" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Strände in Hurghada</h2>
              <p className="text-gray-400 text-sm">Vom Hotelstrand bis zur Trauminsel – das Rote Meer bietet alles</p>
            </div>
            <div className="space-y-5">
              {[
                { name: "Makadi Bay", type: "Resortstrand · Sand", rating: "★★★★★", ideal: "Familien, Paare, All-Inclusive-Urlauber", desc: "Etwa 30 km südlich von Hurghada gelegen. Wunderschöne Bucht mit feinem Sandstrand und einem der besten Hausriffe zum Schnorcheln. Exklusive Resorts direkt am Strand. Ruhiger und gehobener als Hurghada-Stadt.", pros: ["Traumhaftes Hausriff", "Feinsand", "Ruhige Lage", "Gehobene Resorts"], cons: ["Abgelegen (nur Resort-Infrastruktur)", "Taxi nach Hurghada teuer"], mapHref: "https://www.google.com/maps/search/?api=1&query=Makadi+Bay+Egypt", color: "border-blue-200 bg-blue-50/50", badge: "bg-blue-100 text-blue-700" },
                { name: "Soma Bay", type: "Luxusstrand · Sand", rating: "★★★★★", ideal: "Luxus-Urlauber, Taucher, Kitesurfer", desc: "Halbinsel ca. 45 km südlich von Hurghada mit einigen der exklusivsten Resorts Ägyptens. Spektakuläres Riff direkt vor der Tür, dazu erstklassige Spa- und Golfanlagen.", pros: ["Weltklasse-Riff", "Luxus-Resorts", "Golf & Spa", "Kitesurfen"], cons: ["Sehr abgelegen", "Hohe Preise"], mapHref: "https://www.google.com/maps/search/?api=1&query=Soma+Bay+Egypt", color: "border-amber-200 bg-amber-50/50", badge: "bg-amber-100 text-amber-700" },
                { name: "Sahl Hasheesh", type: "Exklusivstrand · Sand", rating: "★★★★★", ideal: "Paare, Luxus-Reisende, Schnorchler", desc: "Edle Resort-Bucht 18 km südlich mit architektonisch beeindruckenden Hotels. Kristallklares Wasser über versunkenem Unterwasser-Museum. Einer der schönsten Strände Ägyptens.", pros: ["Unterwasser-Museum", "Kristallklares Wasser", "Exklusive Atmosphäre", "Feiner Sand"], cons: ["Teurer als andere Gebiete", "Wenig öffentlicher Zugang"], mapHref: "https://www.google.com/maps/search/?api=1&query=Sahl+Hasheesh+Egypt", color: "border-rose-200 bg-rose-50/50", badge: "bg-rose-100 text-rose-700" },
                { name: "El Gouna Strände", type: "Lagunenstrand · Sand", rating: "★★★★☆", ideal: "Junge Reisende, Paare, Kite-Anfänger", desc: "Die Lagunenstadt bietet mehrere Strandabschnitte: Mangroovy Beach (Kiten), Zeytuna Beach (exklusiv auf einer Insel) und diverse Hotelstrände. Flaches, ruhiges Wasser.", pros: ["Flaches Wasser", "Kite-Spots", "Trendiges Ambiente", "Gute Infrastruktur"], cons: ["Teurer als Hurghada", "Einige Strände nur per Boot erreichbar"], mapHref: "https://www.google.com/maps/search/?api=1&query=El+Gouna+Beach+Egypt", color: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700" },
                { name: "Old Vic Beach (Hurghada)", type: "Stadtstrand · Sand", rating: "★★★★☆", ideal: "Budget-Reisende, Einheimische, Solo-Reisende", desc: "Einer der wenigen öffentlichen Strände in Hurghada-Stadt. Günstig, lebendig und authentisch. Hier mischen sich Touristen und Einheimische.", pros: ["Günstig", "Zentral gelegen", "Authentische Atmosphäre"], cons: ["Nicht so gepflegt wie Resort-Strände", "Kann voll werden"], mapHref: "https://www.google.com/maps/search/?api=1&query=Old+Vic+Beach+Hurghada", color: "border-cyan-200 bg-cyan-50/50", badge: "bg-cyan-100 text-cyan-700" },
                { name: "Orange Bay (Paradise Island)", type: "Inselstrand · Sand", rating: "★★★★★", ideal: "Tagesausflügler, Paare, Instagram-Fans", desc: "Per Boot erreichbare Insel mit Strandclub-Atmosphäre. Türkises Wasser, weißer Sand, Musik und Cocktails – das Instagram-Paradies am Roten Meer.", pros: ["Traumhaft schönes Wasser", "Strandclub-Vibes", "Essen & Drinks inklusive"], cons: ["Nur per Boot erreichbar", "Kann am Wochenende voll werden", "Tagesausflug nötig (~35 €)"], mapHref: "https://www.google.com/maps/search/?api=1&query=Orange+Bay+Hurghada", color: "border-orange-200 bg-orange-50/50", badge: "bg-orange-100 text-orange-700" },
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
                <p className="font-bold text-gray-900 mb-0.5">Strand-Tipp: Reef-Safe Sonnencreme!</p>
                <p className="text-gray-600 text-sm leading-relaxed">Die Korallenriffe des Roten Meeres sind empfindlich. Nutze rifffreundliche Sonnencreme ohne Oxybenzon und Octinoxat. Viele Hotels bieten sie inzwischen an.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ DISTRICTS ════ */}
        {activeTab === "districts" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Viertel-Guide Hurghada</h2>
              <p className="text-gray-400 text-sm">Wo übernachten? Wo ausgehen? Finde das richtige Viertel für dich.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: "El Dahar (Altstadt)", emoji: "🏘️", ideal: "Budget-Reisende, Kulturinteressierte, Backpacker", vibe: "Authentisch, lebendig, günstig", preis: "€", desc: "Das ursprüngliche Hurghada – hier leben die Einheimischen. Bunte Basare, die Al-Mina Moschee, Fischmarkt und authentische Restaurants. Hier erlebst du das echte Ägypten fernab der Resorts.", highlights: ["Al-Mina Moschee", "Lokaler Basar", "Fischmarkt", "Günstigstes Essen"], nota: "Touristisch weniger erschlossen, weiter von Stränden entfernt.", color: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
                { name: "Sekalla (Downtown)", emoji: "🏙️", ideal: "Junge Reisende, Nightlife, Shopping", vibe: "Lebhaft, urban, touristisch", preis: "€€", desc: "Das touristische Zentrum von Hurghada. Die Sheraton Road ist die Hauptachse mit Hotels, Restaurants, Shops und Bars. Hier pulsiert das Nachtleben mit Clubs und Bars.", highlights: ["Sheraton Road", "Nachtleben", "Shopping", "Restaurants"], nota: "Kann laut und touristisch überlaufen sein.", color: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
                { name: "New Hurghada (Touristenstreifen)", emoji: "🏨", ideal: "Pauschalurlauber, Familien, Strandliebhaber", vibe: "Resort, entspannt, strandnah", preis: "€€–€€€", desc: "Der lange Küstenstreifen südlich von Sekalla mit den großen All-Inclusive-Resorts. Direkte Strandzugänge, Aqua Parks und Animation. Wenig städtisches Flair, aber maximaler Komfort.", highlights: ["All-Inclusive-Resorts", "Direkte Strandlage", "Aqua Parks", "Familienfreundlich"], nota: "Wenig authentisches Ägypten-Feeling.", color: "border-rose-200", badge: "bg-rose-100 text-rose-700" },
                { name: "El Gouna", emoji: "⛵", ideal: "Trendsetter, Paare, Kitesurfer, Golfer", vibe: "Exklusiv, kosmopolitisch, chic", preis: "€€€–€€€€", desc: "Die elegante Lagunenstadt 20 km nördlich ist ein eigener Mikrokosmos: Kanäle, bunte Häuser, Marina, Golfplatz und eine internationale Community. Fühlt sich an wie eine Mischung aus Venedig und Ibiza.", highlights: ["Abu Tig Marina", "Kitesurfen", "Golf", "Boutique-Hotels"], nota: "Deutlich teurer als Hurghada, weniger authentisch ägyptisch.", color: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
                { name: "Makadi Bay", emoji: "🏖️", ideal: "Familien, Taucher, Ruhesuchende", vibe: "Exklusiv, naturnah, ruhig", preis: "€€€", desc: "Ruhige Bucht 30 km südlich mit gehobenen Resorts und einem der besten Hausriffe der Region. Perfekt für alle, die Ruhe suchen und direkt vom Strand aus Schnorcheln möchten.", highlights: ["Bestes Hausriff", "Ruhe & Natur", "Gehobene Resorts", "Tauch-Hotspot"], nota: "Sehr abgelegen – außerhalb der Resorts gibt es nichts.", color: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
                { name: "Sahl Hasheesh", emoji: "👑", ideal: "Luxus-Urlauber, Paare, Wellness-Fans", vibe: "Luxuriös, exklusiv, ruhig", preis: "€€€€", desc: "Die luxuriöseste Bucht der Region mit architektonisch beeindruckenden 5-Sterne-Resorts. Unterwasser-Museum vor der Küste, exklusive Spas und ein privater Strand-Charme, der seinesgleichen sucht.", highlights: ["Unterwasser-Museum", "5-Sterne-Resorts", "Privat-Strand-Feeling", "Spa & Wellness"], nota: "Sehr isoliert und teuer. Kaum eigenständige Erkundungsmöglichkeiten.", color: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
                { name: "Soma Bay", emoji: "🏌️", ideal: "Golfer, Kitesurfer, Luxus-Taucher", vibe: "Exklusiv, sportlich, naturnah", preis: "€€€€", desc: "Halbinsel ca. 45 km südlich mit wenigen, aber erstklassigen Resorts. Weltklasse-Tauchspot mit dem berühmten \"Ras Abu Soma\" Riff. Cascades Spa und Gary Player Golfplatz.", highlights: ["Weltklasse-Riff", "Cascades Spa", "Gary Player Golf", "Kite-Paradies"], nota: "Sehr abgelegen, nur für Resort-Gäste interessant.", color: "border-cyan-200", badge: "bg-cyan-100 text-cyan-700" },
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
              <p className="text-gray-400 text-sm">Was kostet ein Hurghada-Urlaub wirklich? Realistische Preise für alle Budgets (Stand 2026).</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { level: "Budget-Reisender", emoji: "🎒", daily: "20–40 € / Tag", color: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700", items: ["Hostel / einfaches Hotel: 10–20 €", "Straßenessen / Lokale: 3–6 €", "Minibus: 0,10–0,20 €", "Schnorcheltour: 15–25 €"] },
                { level: "Mittleres Budget", emoji: "🧳", daily: "50–100 € / Tag", color: "border-blue-200 bg-blue-50/50", badge: "bg-blue-100 text-blue-700", items: ["3-4-Sterne All-Inclusive: 40–70 €", "Restaurant: 8–15 €", "Taxi / Uber: 5–10 €", "Tauchgang: 30–50 €"] },
                { level: "Luxus-Reisender", emoji: "👑", daily: "150–400+ € / Tag", color: "border-amber-200 bg-amber-50/50", badge: "bg-amber-100 text-amber-700", items: ["5-Sterne-Resort: 100–300 €", "Gourmet-Restaurant: 30–60 €", "Private Bootstour: 100–250 €", "Spa-Treatment: 40–100 €"] },
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
                      ["Übernachtung (pro Nacht)", "10–20 €", "40–70 €", "100–300 €"],
                      ["Frühstück", "1–3 €", "inkl. (AI)", "inkl. (AI)"],
                      ["Mittagessen", "2–5 €", "8–15 €", "20–40 €"],
                      ["Abendessen", "3–8 €", "inkl. (AI)", "30–60 €"],
                      ["Wasser (1,5l)", "0,20 €", "0,50 €", "1–3 €"],
                      ["Frischer Saft", "0,50 €", "1–2 €", "3–5 €"],
                      ["Bier (0,5l)", "2–4 €", "inkl. (AI)", "5–10 €"],
                      ["Taxi (5 km)", "2–3 €", "3–5 €", "5–10 €"],
                      ["Schnorcheltour (Tag)", "15–25 €", "25–40 €", "80–150 €"],
                      ["Tauchgang (2 Dives)", "30–45 €", "45–65 €", "80–120 €"],
                      ["Wüstensafari", "15–25 €", "30–50 €", "80–150 €"],
                      ["Massage (1 Std.)", "10–15 €", "20–40 €", "60–100 €"],
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
                <div><p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: Reisezeit</p><p className="text-gray-600 text-xs leading-relaxed">Mai, Juni und September sind günstiger als die Hochsaison (Dez–Mär). Oft 30–40% Ersparnis bei ähnlich gutem Wetter.</p></div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div><p className="font-bold text-gray-900 mb-0.5 text-sm">Spar-Tipp: All-Inclusive</p><p className="text-gray-600 text-xs leading-relaxed">All-Inclusive lohnt sich in Hurghada fast immer – Essen, Trinken und Pool/Strand sind inklusive. Oft schon ab 40 € p.P./Nacht.</p></div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="font-bold mb-0.5">Jetzt Hurghada-Pauschalreisen vergleichen</p>
                  <p className="text-white/70 text-sm">Täglich aktualisierte Angebote – Flug + Hotel All-Inclusive ab 399 € p.P.</p>
                </div>
                <IbeCta />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ FOOTER CTA ═══════════════ */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
          <div>
            <h3 className="text-xl font-extrabold mb-1">Bereit für deinen Hurghada-Urlaub?</h3>
            <p className="text-white/70 text-sm">Jetzt tagesaktuelle Pauschalreisen, All-Inclusive & Last-Minute Deals vergleichen und günstig buchen.</p>
          </div>
          <Link href="/urlaubsziele/hurghada/" className="bg-white text-[#00838F] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 shadow-sm">
            Hurghada Angebote ansehen →
          </Link>
        </div>

      </main>
    </div>
  );
}
