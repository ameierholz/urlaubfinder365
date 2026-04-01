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
  { id: "districts",  icon: "🏘️", label: "Regionen" },
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
  { label: "Januar", emoji: "🍊", text: "Mild, aber regnerisch. Zeit für Museen und die Orangenernte." },
  { label: "Februar", emoji: "🏛️", text: "Kühl. Perfekt für Knossos und Archäologische Museen ohne Andrang." },
  { label: "März", emoji: "🌿", text: "Frühling erwacht. Ideal für Wanderungen in der Samaria-Schlucht (ab Mai offen)." },
  { label: "April", emoji: "🌸", text: "Angenehm warm, Wildblumen überall. Top-Zeit für Sightseeing." },
  { label: "Mai", emoji: "🏖️", text: "Vorsaison. Warm genug für erste Strandtage, Schluchten öffnen." },
  { label: "Juni", emoji: "⛵", text: "Sommerbeginn. Perfekt für Bootsausflüge und Schnorcheln." },
  { label: "Juli", emoji: "☀️", text: "Hochsommer. Heiß, ideal für Strände und Wassersport." },
  { label: "August", emoji: "🌊", text: "Heißester Monat. Strand, Meer und abendliche Tavernen." },
  { label: "September", emoji: "🌅", text: "Nachsaison, noch sehr warm. Perfekt für alles bei weniger Trubel." },
  { label: "Oktober", emoji: "🏞️", text: "Angenehm mild. Ideal für Wanderungen und Erkundungstouren." },
  { label: "November", emoji: "🚶‍♂️", text: "Ruhig, oft sonnig. Ideal für Kulturbesuche und Stadtspaziergänge." },
  { label: "Dezember", emoji: "☕", text: "Besinnlich & kühl. Perfekt für gemütliche Tavernen und Raki-Verkostungen." },
];

interface WeatherState { temp: number; desc: string; icon: string }
interface ForecastDay  { day: string; icon: string; maxTemp: number }

/* ────────────────────────── helper components ────────────────────────── */

function Flag({ code, name, size = 20 }: { code: string; name: string; size?: number }) {
  return <img src={`https://flagcdn.com/w${size}/${code}.png`} width={size} height={Math.round(size * 0.7)} alt={name} className="inline-block rounded-sm shadow-sm" loading="lazy" />;
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function TimelineItem({ year, title, text, color = "bg-[#00838F]" }: { year: string; title: string; text: string; color?: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${color} ring-4 ring-white shadow shrink-0`} />
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

function SightCard({ title, desc, mapHref, address, duration, cost, tip }: { title: string; desc: string; mapHref: string; address: string; duration?: string; cost?: string; tip?: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      {(duration || cost) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {duration && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">⏱ {duration}</span>}
          {cost && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">💰 {cost}</span>}
        </div>
      )}
      <p className="text-sm text-gray-600 leading-relaxed mb-2">{desc}</p>
      {tip && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mb-2">💡 {tip}</p>}
      <MapLink href={mapHref} address={address} />
    </div>
  );
}

function MapLink({ href, address }: { href: string; address: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#00838F] font-semibold hover:underline">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      {address}
    </a>
  );
}

function IbeCta({ regionId = "46", label = "Pauschalreisen nach Kreta suchen" }: { regionId?: string; label?: string }) {
  return (
    <button onClick={() => {
      const url = `https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&regionId=${regionId}`;
      const fn = (window as any).ibeOpenBooking;
      if (typeof fn === "function") fn(url, label); else window.open(url, "_blank", "noopener,noreferrer");
    }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d77] text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      {label}
    </button>
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

interface DayStop { time: string; activity: string; icon: string; tip?: string; }
interface DayPlan { day: string; title: string; icon: string; color: string; stops: DayStop[]; transport?: string; meals?: string; dayCost?: string; }

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
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

/* ────────────────────────── route plans data ────────────────────────── */

const COUPLES_DAYS: DayPlan[] = [
  { day: "Tag 1", title: "Chania Altstadt & Venezianischer Hafen", icon: "🏛️", color: "bg-rose-100", dayCost: "~40 €", transport: "Zu Fuß durch Chania", meals: "Taverne am Hafen", stops: [
    { time: "09:00", activity: "Venezianischer Hafen & Leuchtturm", icon: "⛵", tip: "Morgens die beste Atmosphäre ohne Menschenmassen" },
    { time: "11:00", activity: "Archäologisches Museum Chania", icon: "🏛️" },
    { time: "13:00", activity: "Mittagessen in der Splagia-Taverne", icon: "🍽️", tip: "Fangfrischer Fisch direkt am Wasser" },
    { time: "15:00", activity: "Ledergasse (Odos Skridlof) & Markt", icon: "🛍️" },
    { time: "18:00", activity: "Sonnenuntergang am Leuchtturm", icon: "🌅" },
    { time: "20:00", activity: "Romantisches Dinner am Hafen", icon: "🌃", tip: "Thalassino Ageri oder Apostolis direkt am Wasser" },
  ]},
  { day: "Tag 2", title: "Balos Lagune & Gramvousa", icon: "🏖️", color: "bg-cyan-100", dayCost: "~35 €", transport: "Boot ab Kissamos (ab 25 €)", meals: "Picknick mitnehmen", stops: [
    { time: "08:00", activity: "Fähre ab Kissamos zur Balos-Lagune", icon: "⛴️", tip: "Tickets vorab online buchen, Boote oft ausverkauft" },
    { time: "10:00", activity: "Festung Gramvousa erkunden", icon: "🏰" },
    { time: "12:00", activity: "Baden in der Balos-Lagune", icon: "🏊", tip: "Karibik-Feeling mit rosa schimmerndem Sand" },
    { time: "15:00", activity: "Rückfahrt mit der Fähre", icon: "⛴️" },
    { time: "17:30", activity: "Frappé in Kissamos", icon: "☕" },
    { time: "20:00", activity: "Seafood-Dinner in Chania", icon: "🦐" },
  ]},
  { day: "Tag 3", title: "Rethymno & Kloster Arkadi", icon: "🕌", color: "bg-amber-100", dayCost: "~45 €", transport: "Mietwagen empfohlen", meals: "Taverne in Rethymno", stops: [
    { time: "09:00", activity: "Fahrt zum Kloster Arkadi", icon: "⛪", tip: "Bedeutendstes Kloster Kretas, Symbol des Widerstands" },
    { time: "11:30", activity: "Festung Fortezza in Rethymno", icon: "🏰" },
    { time: "13:30", activity: "Mittagessen in der Altstadt Rethymno", icon: "🍽️" },
    { time: "15:30", activity: "Bummel durch die venezianische Altstadt", icon: "🚶" },
    { time: "18:00", activity: "Strand von Rethymno", icon: "🏖️" },
    { time: "20:30", activity: "Abendessen mit Raki-Verkostung", icon: "🥃", tip: "Raki wird in Kreta immer als Gastgeschenk gereicht" },
  ]},
  { day: "Tag 4", title: "Elafonissi & Südküste", icon: "🌊", color: "bg-pink-100", dayCost: "~30 €", transport: "Mietwagen (Serpentinen!)", meals: "Strandtaverne", stops: [
    { time: "08:30", activity: "Fahrt nach Elafonissi (ca. 1,5 Std.)", icon: "🚗", tip: "Früh starten, ab 11 Uhr wird der Strand voll" },
    { time: "10:00", activity: "Baden am Elafonissi-Strand", icon: "🏖️", tip: "Rosafarbener Sand durch zermahlene Muscheln" },
    { time: "14:00", activity: "Mittagessen in einer Strandtaverne", icon: "🍽️" },
    { time: "16:00", activity: "Kloster Chrysoskalitissa besichtigen", icon: "⛪" },
    { time: "19:00", activity: "Rückfahrt über Topolia-Schlucht", icon: "🏞️" },
  ]},
  { day: "Tag 5", title: "Samaria-Schlucht", icon: "⛰️", color: "bg-emerald-100", dayCost: "~35 €", transport: "Bus + Fähre", meals: "Proviant mitnehmen", stops: [
    { time: "06:30", activity: "Bus von Chania nach Omalos", icon: "🚌", tip: "Festes Schuhwerk und mind. 2 Liter Wasser mitnehmen" },
    { time: "07:30", activity: "Start der Wanderung (16 km)", icon: "🥾" },
    { time: "12:00", activity: "Engste Stelle: Die Eisernen Pforten (3 m breit)", icon: "🏔️" },
    { time: "14:00", activity: "Ankunft in Agia Roumeli", icon: "🏁" },
    { time: "15:00", activity: "Erfrischung am Strand von Agia Roumeli", icon: "🏖️" },
    { time: "17:30", activity: "Fähre nach Sfakia, Bus zurück", icon: "⛴️" },
  ]},
];

const FAMILIES_DAYS: DayPlan[] = [
  { day: "Tag 1", title: "Heraklion & Knossos", icon: "🏛️", color: "bg-blue-100", dayCost: "~50 €", transport: "Taxi oder Mietwagen", meals: "Stadtmitte Heraklion", stops: [
    { time: "09:00", activity: "Palast von Knossos", icon: "🏛️", tip: "Eintritt 15 €, Kinder frei. Audioguide lohnt sich!" },
    { time: "12:00", activity: "Archäologisches Museum Heraklion", icon: "🏺", tip: "Die Minoischen Fresken begeistern auch Kinder" },
    { time: "14:00", activity: "Mittagessen am Löwenplatz (Plateia Morosini)", icon: "🍽️" },
    { time: "16:00", activity: "Venezianische Festung Koules am Hafen", icon: "🏰" },
    { time: "18:00", activity: "Eis essen in der 25.-August-Straße", icon: "🍦" },
  ]},
  { day: "Tag 2", title: "Acqua Plus Wasserpark & Strand", icon: "🌊", color: "bg-cyan-100", dayCost: "~60 €", transport: "Mietwagen", meals: "Im Wasserpark + Taverne", stops: [
    { time: "09:30", activity: "Acqua Plus Waterpark", icon: "🎢", tip: "Ab 25 € p.P., Kinder-Bereich sehr gut" },
    { time: "14:00", activity: "Mittagessen im Park", icon: "🍔" },
    { time: "16:00", activity: "Strand von Ammoudara", icon: "🏖️" },
    { time: "19:00", activity: "Abendessen in einer Familientaverne", icon: "🍽️", tip: "Kinder essen in griechischen Tavernen oft kostenlos" },
  ]},
  { day: "Tag 3", title: "Agios Nikolaos & Spinalonga", icon: "🏝️", color: "bg-teal-100", dayCost: "~45 €", transport: "Mietwagen + Boot", meals: "Agios Nikolaos Hafen", stops: [
    { time: "09:00", activity: "Fahrt nach Agios Nikolaos", icon: "🚗" },
    { time: "10:00", activity: "Voulismeni-See bestaunen", icon: "🌊" },
    { time: "11:00", activity: "Bootsfahrt zur Insel Spinalonga", icon: "⛴️", tip: "Ehem. Lepra-Kolonie, spannend für ältere Kinder" },
    { time: "14:00", activity: "Mittagessen am Hafen", icon: "🍽️" },
    { time: "16:00", activity: "Baden am Strand Almyros", icon: "🏖️" },
  ]},
  { day: "Tag 4", title: "Lassithi-Hochebene & Zeus-Höhle", icon: "⛰️", color: "bg-green-100", dayCost: "~35 €", transport: "Mietwagen", meals: "Bergdorf-Taverne", stops: [
    { time: "09:00", activity: "Fahrt zur Lassithi-Hochebene", icon: "🚗", tip: "Beeindruckende Serpentinenstraße mit Fotostopps" },
    { time: "10:30", activity: "Dikteon-Höhle (Zeus-Geburtsort)", icon: "🦇", tip: "Eintritt 6 €, Taschenlampe und festes Schuhwerk" },
    { time: "12:30", activity: "Mittagessen im Bergdorf Tzermiado", icon: "🍽️" },
    { time: "15:00", activity: "Traditionelle Windmühlen besichtigen", icon: "🌬️" },
    { time: "17:00", activity: "Strand von Malia", icon: "🏖️" },
  ]},
  { day: "Tag 5", title: "Vai Palmenstrand & Sitia", icon: "🌴", color: "bg-yellow-100", dayCost: "~30 €", transport: "Mietwagen", meals: "Strandtaverne", stops: [
    { time: "08:30", activity: "Fahrt zum Vai Palmenstrand", icon: "🚗", tip: "Einziger natürlicher Palmenwald Europas" },
    { time: "10:00", activity: "Baden und Entspannen am Vai Beach", icon: "🏖️" },
    { time: "13:00", activity: "Mittagessen an der Strandtaverne", icon: "🍽️" },
    { time: "15:00", activity: "Kloster Toplou besichtigen", icon: "⛪", tip: "Berühmt für Ikonen und eigenes Olivenöl" },
    { time: "17:00", activity: "Bummel durch Sitia", icon: "🚶" },
  ]},
  { day: "Tag 6", title: "Preveli Strand & Plakias", icon: "🌿", color: "bg-lime-100", dayCost: "~30 €", transport: "Mietwagen", meals: "Plakias Taverne", stops: [
    { time: "09:00", activity: "Fahrt nach Preveli", icon: "🚗" },
    { time: "10:30", activity: "Preveli-Palmenstrand & Fluss", icon: "🌴", tip: "Kurze Wanderung hinab, aber es lohnt sich absolut" },
    { time: "13:00", activity: "Kloster Preveli", icon: "⛪" },
    { time: "15:00", activity: "Strand Plakias zum Baden", icon: "🏖️" },
    { time: "19:00", activity: "Fisch-Dinner in Plakias", icon: "🐟" },
  ]},
];

const SOLO_DAYS: DayPlan[] = [
  { day: "Tag 1", title: "Heraklion erkunden", icon: "🏙️", color: "bg-indigo-100", dayCost: "~25 €", transport: "Zu Fuß", meals: "Street Food & Taverne", stops: [
    { time: "09:00", activity: "Palast von Knossos", icon: "🏛️", tip: "Morgens weniger Besucher, ca. 2 Std. einplanen" },
    { time: "12:00", activity: "Archäologisches Museum", icon: "🏺" },
    { time: "14:00", activity: "Street Food am Markt (1866-Straße)", icon: "🥙", tip: "Bougatsa (Blätterteiggebäck) probieren!" },
    { time: "16:00", activity: "Koules Festung & Hafenpromenade", icon: "🏰" },
    { time: "19:00", activity: "Raki & Mezedes in einer Rakadiko-Bar", icon: "🥃" },
  ]},
  { day: "Tag 2", title: "Samaria-Schlucht solo", icon: "🥾", color: "bg-green-100", dayCost: "~30 €", transport: "Bus + Fähre", meals: "Proviant", stops: [
    { time: "06:00", activity: "Frühbus von Heraklion nach Omalos", icon: "🚌" },
    { time: "07:30", activity: "Wanderung durch die Samaria-Schlucht", icon: "🥾", tip: "16 km, 5-7 Std. Solo ideal, aber nie alleine auf dem Trail" },
    { time: "14:00", activity: "Ankunft in Agia Roumeli", icon: "🏁" },
    { time: "15:00", activity: "Schwimmen im Libyschen Meer", icon: "🏊" },
    { time: "17:30", activity: "Fähre nach Sfakia, Bus zurück", icon: "⛴️" },
  ]},
  { day: "Tag 3", title: "Chania & Akrotiri", icon: "🏖️", color: "bg-sky-100", dayCost: "~20 €", transport: "Bus + zu Fuß", meals: "Markt & Taverne", stops: [
    { time: "09:00", activity: "Agora (Markthalle) von Chania", icon: "🏪", tip: "Lokale Produkte probieren: Honig, Käse, Oliven" },
    { time: "11:00", activity: "Venezianischer Hafen & Moschee", icon: "🕌" },
    { time: "13:00", activity: "Mittagessen im Tamam Restaurant", icon: "🍽️" },
    { time: "15:00", activity: "Strand von Stavros (Zorba-Strand)", icon: "🏖️", tip: "Der Filmstrand von Alexis Sorbas" },
    { time: "19:00", activity: "Abendessen in der Altstadt", icon: "🌃" },
  ]},
  { day: "Tag 4", title: "Südküste & Matala", icon: "🌅", color: "bg-orange-100", dayCost: "~25 €", transport: "Bus oder Mietwagen", meals: "Matala Taverne", stops: [
    { time: "09:00", activity: "Bus/Fahrt nach Matala", icon: "🚌" },
    { time: "11:00", activity: "Höhlen von Matala erkunden", icon: "🕳️", tip: "In den 1960ern Hippie-Kommune, heute UNESCO-geschützt" },
    { time: "13:00", activity: "Mittagessen am Matala-Strand", icon: "🍽️" },
    { time: "15:00", activity: "Red Beach Wanderung", icon: "🏖️", tip: "20 Min. Fußweg über den Hügel, einsamer Strand" },
    { time: "18:00", activity: "Sonnenuntergang an den Höhlen", icon: "🌅" },
  ]},
  { day: "Tag 5", title: "Spinalonga & Ostküste", icon: "🏝️", color: "bg-teal-100", dayCost: "~35 €", transport: "Bus + Boot", meals: "Elounda/Agios Nikolaos", stops: [
    { time: "08:00", activity: "Bus nach Agios Nikolaos", icon: "🚌" },
    { time: "10:00", activity: "Bootsfahrt nach Spinalonga", icon: "⛴️", tip: "Die Festungsinsel hat eine faszinierende Geschichte" },
    { time: "13:00", activity: "Mittagessen in Elounda", icon: "🍽️" },
    { time: "15:00", activity: "Voulismeni-See in Agios Nikolaos", icon: "🌊" },
    { time: "17:00", activity: "Café am Hafen, Leute beobachten", icon: "☕" },
    { time: "19:30", activity: "Abschiedsdinner mit Meerblick", icon: "🌃" },
  ]},
];

/* ────────────────────────── main component ────────────────────────── */

export default function KretaGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [liveTime, setLiveTime] = useState("");
  const [activePlan, setActivePlan] = useState<"couples" | "families" | "solo">("couples");
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=35.3387&longitude=25.1442&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Athens"
        );
        if (!res.ok) return;
        const data = await res.json();
        const code = data.current_weather.weathercode;
        const isDay = data.current_weather.is_day;
        let w = WEATHER_MAP[code] ?? { desc: "Wetter nicht verfügbar", icon: "" };
        if ((code === 0 || code === 1) && isDay === 0) w = { desc: "Klarer Himmel", icon: "🌙" };
        setWeather({ temp: Math.round(data.current_weather.temperature), ...w });

        const f: ForecastDay[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(data.daily.time[i]);
          const fw = WEATHER_MAP[data.daily.weathercode[i]] ?? { icon: "" };
          f.push({ day: WEEKDAYS[date.getUTCDay()], icon: fw.icon, maxTemp: Math.round(data.daily.temperature_2m_max[i]) });
        }
        setForecast(f);
      } catch { /* silent */ }
    };
    fetchWeather();

    const updateTime = () =>
      setLiveTime(new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Athens", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
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
            <span className="text-white font-medium">Kreta</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Kreta Reiseführer
                <span className="block sm:inline sm:ml-2 text-white/80 font-bold">2026</span>
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-relaxed">
                Dein umfassender Guide für den perfekten Griechenland-Urlaub – Strände, Schluchten, Kultur & praktische Infos.
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
                  Wetter auf Kreta
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
                    { icon: "🌸", season: "Frühling (Apr–Mai)", desc: "Ideal für Wanderungen & Sightseeing." },
                    { icon: "☀️", season: "Sommer (Jun–Sep)", desc: "Perfekt für Strände & Meer." },
                    { icon: "🍂", season: "Herbst (Okt–Nov)", desc: "Angenehm warm, weniger Touristen." },
                    { icon: "❄️", season: "Winter (Dez–Mär)", desc: "Mild, ideal für Kultur & Wanderungen." },
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
                  <p><span className="mr-1.5">🥇</span><strong>Erstbesucher:</strong> <span className="text-white/80">Knossos, Elafonissi, Chania, Samaria-Schlucht, Spinalonga.</span></p>
                  <p><span className="mr-1.5">👨‍👩‍👧‍👦</span><strong>Familien:</strong> <span className="text-white/80">Acqua Plus, Vai Palmenstrand, Knossos, Agios Nikolaos, Strandtage.</span></p>
                  <p><span className="mr-1.5">💕</span><strong>Paare:</strong> <span className="text-white/80">Balos-Lagune, Chania Hafen, Elafonissi, Rethymno Altstadt, Weinverkostung.</span></p>
                  <p><span className="mr-1.5">🎒</span><strong>Solo:</strong> <span className="text-white/80">Samaria-Schlucht, Matala, Loutro, Agios Nikolaos, Hostels in Chania.</span></p>
                </div>
              </div>
            </div>

            {/* IBE Booking CTA */}
            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">✈️</div>
                <div className="flex-1 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Jetzt günstig buchen</p>
                  <h3 className="text-xl font-extrabold mb-1">Pauschalreisen nach Kreta</h3>
                  <p className="text-white/75 text-sm">Täglich aktualisierte Angebote – Flug + Hotel ab 399 € p.P. Direkt beim Veranstalter buchen.</p>
                </div>
                <IbeCta />
              </div>
            </div>

            {/* Month Scroll */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Kreta nach Monaten</h2>
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Kreta zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <iframe className="w-full h-96" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d512784.7110884054!2d24.2!3d35.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149bbc5c5e1e8b3f%3A0x100bd2ce2b9c740!2sKreta%2C%20Griechenland!5e0!3m2!1sde!2sde" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00838F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Land:</span> Griechenland <Flag code="gr" name="Griechenland" /></li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Region:</span> Südliches Mittelmeer, größte griechische Insel</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Hauptstadt:</span> Heraklion (Iraklio)</li>
                    <li className="flex gap-2"><span className="font-bold text-gray-900 shrink-0">Besonderheit:</span> Kreta ist die fünftgrößte Mittelmeerinsel mit über 1.000 km Küstenlinie, Europas südlichster Punkt und Wiege der minoischen Zivilisation.</li>
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
              <StatCard icon="👥" label="Einwohner" value="~635.000" />
              <StatCard icon="📐" label="Fläche" value="8.450 km²" />
              <StatCard icon="🗣️" label="Sprache" value="Griechisch" />
              <StatCard icon="💶" label="Währung" value="Euro (€)" />
              <StatCard icon="🕐" label="Zeitzone" value="UTC+2 / +3" />
              <StatCard icon="🏙️" label="Hauptstadt" value="Heraklion" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Griechisch. In Touristengebieten wird oft Englisch und teilweise Deutsch gesprochen." },
                  { icon: "💶", label: "Währung", text: "Euro (€). Kartenzahlung weit verbreitet, aber kleinere Tavernen und Märkte bevorzugen Bargeld." },
                  { icon: "🛂", label: "Einreise", text: "Für EU-Bürger: Personalausweis genügt. Kein Visum nötig. Für Nicht-EU: Reisepass erforderlich." },
                  { icon: "💧", label: "Trinkwasser", text: "Leitungswasser in den Städten trinkbar, auf dem Land Flaschenwasser empfohlen. 1,5l ab 0,50 €." },
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
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">Kreta hat ein mediterranes Klima. Sommer heiß und trocken, Winter mild. Beste Reisezeit: Mai bis Oktober.</p>
                  <div className="space-y-3">
                    {[
                      { label: "Frühling", temp: "16–25 °C", w: "65%", color: "bg-emerald-500" },
                      { label: "Sommer", temp: "25–35 °C", w: "100%", color: "bg-amber-500" },
                      { label: "Herbst", temp: "18–28 °C", w: "75%", color: "bg-orange-400" },
                      { label: "Winter", temp: "10–16 °C", w: "35%", color: "bg-sky-500" },
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
                      { m: "Jan", t: "16°" }, { m: "Apr", t: "17°" }, { m: "Jul", t: "25°" }, { m: "Okt", t: "23°" },
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
                <p>🍷 <strong>Raki-Tradition:</strong> Raki (Tsikoudia) wird als Gastgeschenk in fast jeder Taverne gereicht – die Ablehnung gilt als unhöflich.</p>
                <p>🎵 <strong>Kretische Musik:</strong> Die Lyra ist das traditionelle Instrument. Abends finden oft spontane Musikabende in Tavernen statt.</p>
                <p>⛪ <strong>Religion:</strong> Griechisch-orthodox. Klöster und Kirchen überall auf der Insel – angemessene Kleidung beim Besuch.</p>
                <p>👋 <strong>Gastfreundschaft:</strong> Kreter sind bekannt für ihre Herzlichkeit. Ein &quot;Kalimera&quot; (Guten Morgen) öffnet alle Türen.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geschichte & Kultur</h2>
              <p className="text-gray-400 text-sm">Von der Wiege Europas bis heute – über 5.000 Jahre Geschichte</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Zeitstrahl</h3>
                <TimelineItem year="~2700 v. Chr." title="Minoische Hochkultur" text="Auf Kreta entsteht die erste Hochkultur Europas. Die Minoer bauen prachtvolle Paläste, treiben Handel im gesamten Mittelmeerraum und entwickeln die Linear-A-Schrift." color="bg-amber-500" />
                <TimelineItem year="~1700 v. Chr." title="Palast von Knossos" text="Der legendäre Palast von Knossos wird errichtet – mit über 1.300 Räumen, Fresken und dem Labyrinth des Minotaurus aus der griechischen Mythologie." color="bg-red-500" />
                <TimelineItem year="395–1204" title="Byzantinisches Reich" text="Als Teil des Byzantinischen Reiches wird Kreta ein christliches Zentrum. Zahlreiche Klöster und Kirchen werden erbaut, die bis heute erhalten sind." color="bg-purple-500" />
                <TimelineItem year="1204–1669" title="Venezianische Herrschaft" text="Die Venezianer prägen Kreta fast 500 Jahre lang. Festungen, Häfen und die Altstädte von Chania und Rethymno zeugen bis heute von dieser Ära." color="bg-emerald-500" />
                <TimelineItem year="1669–1898" title="Osmanische Zeit" text="Nach langer Belagerung fällt Heraklion an die Osmanen. Moscheen und Brunnen entstehen. Der kretische Widerstandsgeist bleibt legendär." color="bg-blue-500" />
                <TimelineItem year="1913" title="Vereinigung mit Griechenland" text="Nach jahrhundertelangem Kampf wird Kreta offiziell Teil Griechenlands. Der kretische Politiker Eleftherios Venizelos spielt dabei eine Schlüsselrolle." color="bg-teal-500" />
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-2">🏛️ Must-See: Historische Stätten</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>Knossos</strong> – Größter minoischer Palast, 3.500 Jahre alt</li>
                    <li><strong>Phaistos</strong> – Zweitgrößter Palast, mit berühmtem Diskos</li>
                    <li><strong>Gortyn</strong> – Römische Hauptstadt mit ältestem Gesetzestext Europas</li>
                    <li><strong>Spinalonga</strong> – Venezianische Festungsinsel</li>
                    <li><strong>Kloster Arkadi</strong> – Symbol des kretischen Widerstands</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3">Kretische Identität</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Stolz & Freiheit", text: "Kreter sehen sich zuerst als Kreter, dann als Griechen." },
                      { title: "Gastfreundschaft", text: "Philoxenia (Gastfreundschaft) wird auf Kreta besonders gelebt." },
                      { title: "Musik & Tanz", text: "Pentozali ist der traditionelle Kriegstanz, begleitet von der Lyra." },
                      { title: "Olivenöl", text: "Kreta produziert das beste Olivenöl Griechenlands – seit der Antike." },
                    ].map((item) => (
                      <div key={item.title}>
                        <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                        <p className="text-xs text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📊 Kreta heute</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🏝️ Größte griechische Insel</li>
                    <li>✈️ ~5 Mio. Touristen pro Jahr</li>
                    <li>☀️ 300+ Sonnentage im Jahr</li>
                    <li>🫒 35 Mio. Olivenbäume auf der Insel</li>
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
              <p className="text-gray-400 text-sm">Die besten Sehenswürdigkeiten auf Kreta</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="blue">Kulturelle Highlights</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Palast von Knossos" desc="Der legendäre minoische Palast mit über 1.300 Räumen – Heimat des mythischen Minotaurus-Labyrinths." mapHref="https://www.google.com/maps/search/?api=1&query=Knossos+Palace+Crete" address="Knossos, 71409 Heraklion" duration="2–3 Std." cost="15 €" tip="Morgens kommen, Audioguide oder Führung dringend empfohlen." />
                <SightCard title="Archäologisches Museum Heraklion" desc="Eines der bedeutendsten Museen Europas mit der weltweit größten Sammlung minoischer Kunst." mapHref="https://www.google.com/maps/search/?api=1&query=Archaeological+Museum+Heraklion" address="Xanthoudidou 2, 71202 Heraklion" duration="2–3 Std." cost="12 €" tip="Kombi-Ticket mit Knossos spart 5 €." />
                <SightCard title="Kloster Arkadi" desc="Symbol des kretischen Freiheitskampfes. Die barocke Fassade aus dem 16. Jh. ist ikonisch." mapHref="https://www.google.com/maps/search/?api=1&query=Arkadi+Monastery+Crete" address="Arkadi, 74100 Rethymno" duration="1–2 Std." cost="3 €" tip="Auch das kleine Museum im Kloster besuchen." />
                <SightCard title="Altstadt von Rethymno" desc="Venezianische und osmanische Architektur verschmelzen in den malerischen Gassen mit Fortezza-Festung." mapHref="https://www.google.com/maps/search/?api=1&query=Old+Town+Rethymno+Crete" address="Altstadt, 74100 Rethymno" duration="3–4 Std." cost="Kostenlos" tip="Abends durch die Gassen flanieren, wenn die Tavernen beleuchtet sind." />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="green">Natur & Abenteuer</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SightCard title="Samaria-Schlucht" desc="Mit 16 km eine der längsten Schluchten Europas. Spektakuläre Wanderung durch die Weißen Berge zum Libyschen Meer." mapHref="https://www.google.com/maps/search/?api=1&query=Samaria+Gorge+Crete" address="Omalos, 73005 Chania" duration="5–7 Std." cost="5 €" tip="Nur Mai–Oktober geöffnet. Festes Schuhwerk und 2+ Liter Wasser Pflicht!" />
                <SightCard title="Insel Spinalonga" desc="Ehemalige venezianische Festung und letzte Lepra-Kolonie Europas (bis 1957). Berühmt durch den Roman 'Die Insel'." mapHref="https://www.google.com/maps/search/?api=1&query=Spinalonga+Crete" address="Spinalonga, Elounda" duration="2–3 Std." cost="8 € + Boot" tip="Bootsfahrt ab Elounda oder Plaka, ca. 10 € retour." />
                <SightCard title="Balos Lagune" desc="Karibik-Feeling in Europa: türkisfarbenes Wasser und rosa schimmernder Sand." mapHref="https://www.google.com/maps/search/?api=1&query=Balos+Lagoon+Crete" address="Kissamos, 73400 Chania" duration="Halbtags" cost="Boot ab 25 €" tip="Per Boot ab Kissamos oder über unbefestigte Straße + 20 Min. Abstieg." />
                <SightCard title="Preveli Palmenstrand" desc="Exotischer Strand am Ende einer Flussschlucht mit kretischen Dattelpalmen." mapHref="https://www.google.com/maps/search/?api=1&query=Preveli+Beach+Crete" address="Preveli, 74060 Rethymno" duration="Halbtags" cost="Kostenlos" tip="Kurze Wanderung hinab (15 Min.), Kloster Preveli liegt oberhalb." />
              </div>
            </div>
          </div>
        )}

        {/* ════ BEACHES ════ */}
        {activeTab === "beaches" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Die schönsten Strände Kretas</h2>
              <p className="text-gray-400 text-sm">Von karibischen Lagunen bis zu versteckten Buchten</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Elafonissi", desc: "Rosafarbener Sand und seichtes, türkisfarbenes Wasser. Einer der schönsten Strände Europas und ideal für Familien.", mapHref: "https://www.google.com/maps/search/?api=1&query=Elafonissi+Beach+Crete", address: "Elafonissi, 73001 Chania", tip: "Früh kommen (vor 10 Uhr), im Sommer sehr voll. Sonnenschirme mieten (8 €)." },
                { title: "Balos Lagune", desc: "Atemberaubende Lagune mit Karibik-Flair. Das Wasser schimmert in allen Blau- und Türkistönen.", mapHref: "https://www.google.com/maps/search/?api=1&query=Balos+Beach+Crete", address: "Gramvousa, 73400 Kissamos", tip: "Bootstrip ab Kissamos oder Geländewagen + 20 Min. Abstieg. Wasser/Snacks mitnehmen." },
                { title: "Vai Palmenstrand", desc: "Europas einziger natürlicher Palmenwald direkt am Strand. Exotisches Ambiente an der Ostküste.", mapHref: "https://www.google.com/maps/search/?api=1&query=Vai+Beach+Crete", address: "Vai, 72300 Sitia", tip: "Parkgebühr 3 €. Für mehr Ruhe den Hügel zum Nachbarstrand überqueren." },
                { title: "Preveli", desc: "Palmenumsäumter Strand am Ende einer Flussschlucht. Baden im Süßwasser und Meer zugleich.", mapHref: "https://www.google.com/maps/search/?api=1&query=Preveli+Beach+Crete", address: "Preveli, 74060 Rethymno", tip: "15 Min. Abstieg über Treppen. Kein Schatten, Sonnenschutz mitnehmen!" },
                { title: "Falassarna", desc: "Breiter Sandstrand an der Westküste mit spektakulären Sonnenuntergängen. Perfekt zum Surfen.", mapHref: "https://www.google.com/maps/search/?api=1&query=Falassarna+Beach+Crete", address: "Falassarna, 73400 Kissamos", tip: "Fünf nebeneinander liegende Strände. Der größte hat Liegen und Bars." },
                { title: "Matala", desc: "Legendärer Hippie-Strand mit Höhlen in der Felswand. Geschichte und Badevergnügen vereint.", mapHref: "https://www.google.com/maps/search/?api=1&query=Matala+Beach+Crete", address: "Matala, 70200 Heraklion", tip: "Höhlen kosten 3 € Eintritt. Red Beach (20 Min. Fußweg) ist ruhiger." },
                { title: "Agia Pelagia", desc: "Geschütztes Buchtstrand nahe Heraklion. Ruhiges Wasser, perfekt für Familien und Schnorchler.", mapHref: "https://www.google.com/maps/search/?api=1&query=Agia+Pelagia+Beach+Crete", address: "Agia Pelagia, 71500 Heraklion", tip: "Nur 20 Min. vom Flughafen. Ideal für den ersten oder letzten Urlaubstag." },
                { title: "Plakias", desc: "Langer Sandstrand an der Südküste mit klarem Wasser und bergiger Kulisse. Tavernen direkt am Strand.", mapHref: "https://www.google.com/maps/search/?api=1&query=Plakias+Beach+Crete", address: "Plakias, 74060 Rethymno", tip: "Im Osten liegt der FKK-Bereich. Die Bucht von Damnoni nebenan ist ruhiger." },
              ].map((beach) => (
                <SightCard key={beach.title} {...beach} />
              ))}
            </div>
          </div>
        )}

        {/* ════ DISTRICTS ════ */}
        {activeTab === "districts" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Regionen-Guide</h2>
              <p className="text-gray-400 text-sm">Die wichtigsten Orte und Regionen auf Kreta</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Heraklion", emoji: "🏙️", type: "Hauptstadt & Kulturzentrum", desc: "Größte Stadt Kretas mit Knossos, dem Archäologischen Museum, venezianischer Festung Koules und pulsierendem Nachtleben. Guter Ausgangspunkt für die Ostküste.", best: "Kultur, Geschichte, Stadtleben" },
                { name: "Chania", emoji: "⛵", type: "Venezianisches Juwel", desc: "Die romantischste Stadt Kretas mit ihrem berühmten venezianischen Hafen, Leuchtturm, Ledergasse und hervorragenden Restaurants. Tor zur Samaria-Schlucht.", best: "Romantik, Altstadt, Gastronomie" },
                { name: "Rethymno", emoji: "🏰", type: "Renaissance-Charme", desc: "Malerische Altstadt mit der größten venezianischen Festung (Fortezza), osmanischem Erbe und einem langen Sandstrand direkt vor der Tür.", best: "Sightseeing, Strand, Familienurlaub" },
                { name: "Agios Nikolaos", emoji: "🌊", type: "Elegante Hafenstadt", desc: "Charmante Stadt am Voulismeni-See mit gehobenem Flair. Ausgangspunkt für Spinalonga und die Ostküste.", best: "Gehobener Tourismus, Bootsausflüge" },
                { name: "Ierapetra", emoji: "☀️", type: "Südlichste Stadt Europas", desc: "Authentisch griechische Atmosphäre, weniger touristisch. Ausgangspunkt für die Insel Chrysi mit karibischen Stränden.", best: "Authentizität, Insel Chrysi, Ruhe" },
                { name: "Hersonissos & Malia", emoji: "🎉", type: "Partymeilen & Familienresorts", desc: "Bekannte Touristenzentren mit All-Inclusive-Hotels, Wasserparks, Bars und Clubs. Strandurlaub mit voller Infrastruktur.", best: "Nachtleben, All-Inclusive, Wasserparks" },
                { name: "Sitia", emoji: "🌿", type: "Entspannte Ostspitze", desc: "Ruhige Hafenstadt an der Ostküste. Ausgangspunkt für Vai Palmenstrand und Kloster Toplou. Authentisches Kreta abseits der Massen.", best: "Ruhe, Natur, authentische Atmosphäre" },
              ].map((d) => (
                <div key={d.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{d.emoji}</span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{d.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00838F]/10 text-[#00838F]">{d.type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{d.desc}</p>
                  <p className="text-xs text-emerald-700 font-semibold">Ideal für: {d.best}</p>
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
              <p className="text-gray-400 text-sm">Was kostet ein Kreta-Urlaub? Alle Preise in Euro.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { level: "Budget", emoji: "🎒", daily: "40–60 €", color: "border-emerald-200 bg-emerald-50", items: [
                  "Hostel/einfaches Zimmer: 25–40 €/Nacht",
                  "Gyros/Souvlaki: 3–5 €",
                  "Taverne-Mittag: 8–12 €",
                  "Bus Heraklion–Chania: 15 €",
                  "Eintritt Knossos: 15 €",
                ]},
                { level: "Mittelklasse", emoji: "🏖️", daily: "80–130 €", color: "border-blue-200 bg-blue-50", items: [
                  "3-Sterne-Hotel: 60–100 €/Nacht",
                  "Taverne-Abendessen: 15–25 €",
                  "Mietwagen/Tag: 25–40 €",
                  "Bootstour Balos: 25–35 €",
                  "Weinverkostung: 15–25 €",
                ]},
                { level: "Komfort", emoji: "✨", daily: "150–250+ €", color: "border-amber-200 bg-amber-50", items: [
                  "4/5-Sterne-Resort: 120–250 €/Nacht",
                  "gehobenes Restaurant: 30–50 €",
                  "Privat-Bootstour: 200+ €",
                  "Luxus-Mietwagen: 60–100 €/Tag",
                  "Spa & Wellness: 50–100 €",
                ]},
              ].map((b) => (
                <div key={b.level} className={`rounded-2xl p-5 border-2 ${b.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{b.emoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{b.level}</h3>
                      <p className="text-xs font-bold text-[#00838F]">{b.daily} / Tag</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {b.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#00838F] mt-1 shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">💡 Spartipps</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li>• Vorsaison (Mai/Juni) oder Nachsaison (Sep/Okt) buchen – bis zu 40 % günstiger</li>
                <li>• In Dörfern abseits der Touristenpfade essen – authentischer und günstiger</li>
                <li>• Mietwagen früh buchen und über Vergleichsportale reservieren</li>
                <li>• Wasser im Supermarkt kaufen (6er-Pack 1,5l ab 1,50 €)</li>
                <li>• Kombi-Tickets für Knossos + Museum nutzen (spart 5 €)</li>
                <li>• Lokale Busverbindungen (KTEL) sind günstig und zuverlässig</li>
              </ul>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Aktivitäten & Tickets</h2>
              <p className="text-gray-400 text-sm">Touren, Eintrittskarten & Erlebnisse für deinen Kreta-Urlaub.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "⛵", label: "Bootstouren", desc: "Balos & Gramvousa" },
                { emoji: "🥾", label: "Wanderungen", desc: "Schluchten & Berge" },
                { emoji: "🏛️", label: "Kulturtouren", desc: "Knossos & mehr" },
                { emoji: "🤿", label: "Wassersport", desc: "Schnorcheln & Tauchen" },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                </div>
              ))}
            </div>

            <TiqetsCarousel cityId="38" cityName="Kreta" citySlug="kreta" />
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
                { id: "couples" as const, label: "Paare & Genießer", emoji: "💕", color: "from-rose-500 to-pink-500", budget: "~350 € p.P.", duration: "5 Tage", highlight: "Westküste, Schluchten & Romantik" },
                { id: "families" as const, label: "Familien", emoji: "👨‍👩‍👧‍👦", color: "from-blue-500 to-indigo-500", budget: "~400 € p.P.", duration: "6 Tage", highlight: "Kultur, Strände & Abenteuer" },
                { id: "solo" as const, label: "Solo-Reisende", emoji: "🎒", color: "from-emerald-500 to-teal-500", budget: "~250 € p.P.", duration: "5 Tage", highlight: "Freiheit, Natur & Begegnungen" },
              ]).map((p) => (
                <button key={p.id} onClick={() => setActivePlan(p.id)} className={`flex-1 min-w-48 rounded-2xl p-4 text-left transition-all border-2 ${activePlan === p.id ? "border-[#00838F] shadow-lg" : "border-gray-100 hover:border-gray-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{p.emoji}</span>
                    <span className="font-bold text-gray-900 text-sm">{p.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{p.budget}</span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{p.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{p.highlight}</p>
                </button>
              ))}
            </div>

            {/* Route Days */}
            <div className="space-y-0">
              {(activePlan === "couples" ? COUPLES_DAYS : activePlan === "families" ? FAMILIES_DAYS : SOLO_DAYS).map((plan, i, arr) => (
                <DayCard key={plan.day} plan={plan} isLast={i === arr.length - 1} />
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1db682 100%)` }}>
              <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-white">
                  <h3 className="text-lg font-extrabold">Kreta-Pauschalreise buchen</h3>
                  <p className="text-white/75 text-sm">Flug + Hotel – täglich aktualisierte Angebote.</p>
                </div>
                <IbeCta />
              </div>
            </div>
          </div>
        )}

        {/* ════ INSIDER ════ */}
        {activeTab === "insider" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Geheimtipps</h2>
              <p className="text-gray-400 text-sm">Abseits der Touristenpfade – das authentische Kreta entdecken</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Loutro – Das Dorf ohne Straße", desc: "Dieses malerische Fischerdorf an der Südküste ist nur per Boot oder zu Fuß erreichbar. Kristallklares Wasser, drei Tavernen, absolute Ruhe.", tip: "Fähre ab Sfakia (5 €). Übernachtung in Pension ab 50 €.", icon: "⛵" },
                { title: "Agia Irini Schlucht", desc: "Die kleine Schwester der Samaria-Schlucht – deutlich kürzer (7,5 km), weniger überlaufen und genauso schön.", tip: "Ideale Alternative, wenn Samaria zu lang oder zu voll ist.", icon: "🥾" },
                { title: "Kloster Toplou", desc: "Eines der ältesten Klöster Kretas, berühmt für seine Ikonen und das hauseigene preisgekrönte Olivenöl.", tip: "Olivenöl und Wein direkt im Klostershop kaufen – Top-Qualität!", icon: "⛪" },
                { title: "Elounda & Plaka", desc: "Statt des touristischen Agios Nikolaos das authentische Fischerdorf Plaka besuchen. Beste Boote nach Spinalonga starten hier.", tip: "Weniger Touristen, günstigere Bootsfahrt nach Spinalonga (8 €).", icon: "🏘️" },
                { title: "Imbros-Schlucht", desc: "Spektakuläre, aber leichte Schlucht (8 km) südlich von Sfakia. Viel weniger Besucher als Samaria.", tip: "In 2–3 Std. machbar. Perfekt mit Loutro-Besuch kombinierbar.", icon: "🏔️" },
                { title: "Anogia – Das Bergdorf", desc: "Traditionelles Bergdorf in den Weißen Bergen, bekannt für kretische Musik, Weber-Handwerk und stolze Traditionen.", tip: "Mittwochs ist Markt. Die Bergkäserei Nida besuchen!", icon: "🏔️" },
                { title: "Myli-Schlucht bei Rethymno", desc: "Kurze, schattige Schlucht direkt am Stadtrand von Rethymno mit alten Wassermühlen und üppiger Vegetation.", tip: "Nur 30 Min. Spaziergang. Perfekt für einen entspannten Vormittag.", icon: "🌿" },
                { title: "Margarites – Das Töpferdorf", desc: "Kleines Bergdorf bekannt für seine jahrhundertealte Töpfertradition. Werkstätten sind für Besucher geöffnet.", tip: "Handgemachte Keramik als Souvenir – authentisch und preiswert.", icon: "🏺" },
              ].map((gem) => (
                <div key={gem.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{gem.icon}</span>
                    <h3 className="text-base font-bold text-gray-900">{gem.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{gem.desc}</p>
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">💡 {gem.tip}</p>
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
              <p className="text-gray-400 text-sm">Die kretische Küche – eine der gesündesten der Welt</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="amber">Typische Gerichte</SectionBadge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Dakos", desc: "Das kretische Bruschetta: Hartweizen-Zwieback mit Tomaten, Mizithra-Käse, Olivenöl und Oregano. Jede Taverne hat ihre eigene Version.", price: "5–8 €", icon: "🍞" },
                  { name: "Kalitsounia", desc: "Kleine Teigtaschen gefüllt mit Mizithra-Käse und Kräutern. Als süße Version mit Honig ein perfektes Dessert.", price: "4–7 €", icon: "🥟" },
                  { name: "Graviera Kritis", desc: "Der berühmte kretische Hartkäse – geschützte Ursprungsbezeichnung. Pur, gegrillt oder als Saganaki.", price: "6–10 €", icon: "🧀" },
                  { name: "Lamm mit Stamnagathi", desc: "Geschmortes Lamm mit wilden Bergkräutern (Stamnagathi), einem bitteren Wildgemüse das nur auf Kreta wächst.", price: "12–18 €", icon: "🍖" },
                  { name: "Sfakianopita", desc: "Dünner, gefüllter Pfannkuchen aus der Region Sfakia. Traditionell mit Mizithra und Honig beträufelt.", price: "5–8 €", icon: "🥞" },
                  { name: "Schnecken (Chochlioi Boubouristi)", desc: "Gebratene Weinbergschnecken mit Rosmarin und Essig – eine kretische Delikatesse, die man probiert haben muss.", price: "8–12 €", icon: "🐌" },
                ].map((dish) => (
                  <div key={dish.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{dish.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{dish.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{dish.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{dish.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5"><SectionBadge color="teal">Getränke</SectionBadge></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Raki / Tsikoudia", desc: "Der kretische Traubenschnaps – wird in jeder Taverne als Gastgeschenk gereicht. Immer nach dem Essen, nie davor!", icon: "🥃", price: "Gratis / 2–3 €" },
                  { name: "Kretischer Wein", desc: "Rebsorten wie Vidiano und Kotsifali. Weinregionen um Heraklion und die Lassithi-Hochebene besuchen!", icon: "🍷", price: "3–6 € / Glas" },
                  { name: "Griechischer Kaffee", desc: "Stark, süß oder ungesüßt (sketo/metrio/glyko). Im Briki auf dem Herd zubereitet, mit Satz am Boden.", icon: "☕", price: "1,50–3 €" },
                ].map((drink) => (
                  <div key={drink.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <span className="text-3xl">{drink.icon}</span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1">{drink.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{drink.price}</span>
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">{drink.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">💡 Taverna-Tipps</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li>• Dort essen, wo die Einheimischen sitzen – das ist immer ein gutes Zeichen</li>
                <li>• &quot;Mezedes&quot; bestellen: Mehrere kleine Gerichte zum Teilen, typisch kretisch</li>
                <li>• Raki am Ende der Mahlzeit ist Tradition und kostenlos</li>
                <li>• Olivenöl ist das Herz der kretischen Küche – alles wird darin zubereitet</li>
              </ul>
            </div>
          </div>
        )}

        {/* ════ PRACTICAL ════ */}
        {activeTab === "practical" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Praktische Infos</h2>
              <p className="text-gray-400 text-sm">Alles, was du für deinen Kreta-Urlaub wissen musst</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { icon: "✈️", title: "Flughäfen", text: "Zwei internationale Flughäfen: Heraklion (HER) im Osten und Chania (CHQ) im Westen. Flugzeit ab Deutschland ca. 3 Stunden. Beide gut per Bus/Taxi erreichbar." },
                { icon: "🚗", title: "Mietwagen", text: "Fast ein Muss auf Kreta! Preise ab 25 €/Tag. Internationaler Führerschein nicht nötig (EU). Achtung: Bergstraßen teils eng, griechischer Fahrstil gewöhnungsbedürftig. Vollkasko empfohlen!" },
                { icon: "🚌", title: "Öffentlicher Nahverkehr", text: "KTEL-Busse verbinden alle größeren Orte zuverlässig und günstig (z.B. Heraklion–Chania 15 €, ca. 2,5 Std.). Fahrpläne unter e-ktel.com." },
                { icon: "📱", title: "SIM-Karte & Internet", text: "EU-Roaming gilt – dein deutscher Tarif funktioniert ohne Aufpreis. WLAN in fast allen Hotels und Cafés. Cosmote hat die beste Netzabdeckung auf der Insel." },
                { icon: "💳", title: "Bezahlen & Trinkgeld", text: "Kreditkarten werden fast überall akzeptiert. Trinkgeld: 5–10 % in Restaurants üblich. In Tavernen wird der Raki-Service nicht extra berechnet." },
                { icon: "🏥", title: "Gesundheit & Sicherheit", text: "EHIC (Europäische Krankenversicherungskarte) mitbringen! Apotheken (Farmakeio) gut ausgestattet. Sonnenschutz ernst nehmen: UV-Index im Sommer sehr hoch." },
                { icon: "🔌", title: "Strom & Steckdosen", text: "230 V, Steckdosentyp C/F – wie in Deutschland. Kein Adapter nötig." },
                { icon: "🧴", title: "Was einpacken?", text: "Festes Schuhwerk für Schluchten, Sonnenschutz (LSF 50), leichte Kleidung, Snorchel-Ausrüstung. Für Klöster: Knie und Schultern bedecken." },
              ].map((info) => (
                <div key={info.title} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">{info.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{info.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LANGUAGE ════ */}
        {activeTab === "language" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sprachhilfe Griechisch</h2>
              <p className="text-gray-400 text-sm">Die wichtigsten Wörter und Sätze für deinen Kreta-Urlaub</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { cat: "Begrüßung", phrases: [
                  { de: "Hallo", gr: "Geia sou", pron: "Ja su" },
                  { de: "Guten Morgen", gr: "Kalimera", pron: "Kalimera" },
                  { de: "Guten Abend", gr: "Kalispera", pron: "Kalispera" },
                  { de: "Gute Nacht", gr: "Kalinychta", pron: "Kalinichta" },
                  { de: "Tschüss", gr: "Antio", pron: "Adio" },
                ]},
                { cat: "Grundlagen", phrases: [
                  { de: "Ja / Nein", gr: "Nai / Ochi", pron: "Nä / Ochi" },
                  { de: "Bitte", gr: "Parakalo", pron: "Parakalo" },
                  { de: "Danke", gr: "Efcharisto", pron: "Efcharisto" },
                  { de: "Entschuldigung", gr: "Signomi", pron: "Signomi" },
                  { de: "Ich verstehe nicht", gr: "Den katalaveno", pron: "Den katalaweno" },
                ]},
                { cat: "Im Restaurant", phrases: [
                  { de: "Die Rechnung bitte", gr: "Ton logariasmo parakalo", pron: "Ton logariasmo parakalo" },
                  { de: "Prost!", gr: "Stin ygiá mas!", pron: "Stin ijia mas!" },
                  { de: "Lecker!", gr: "Nostimo!", pron: "Nostimo!" },
                  { de: "Wasser", gr: "Nero", pron: "Nero" },
                  { de: "Einen Kaffee bitte", gr: "Ena kafe parakalo", pron: "Ena kafé parakalo" },
                ]},
                { cat: "Unterwegs", phrases: [
                  { de: "Wo ist...?", gr: "Pou ine...?", pron: "Pu ine...?" },
                  { de: "Strand", gr: "Paralia", pron: "Paralia" },
                  { de: "Apotheke", gr: "Farmakeio", pron: "Farmakio" },
                  { de: "Krankenhaus", gr: "Nosokomio", pron: "Nosokomio" },
                  { de: "Hilfe!", gr: "Voithia!", pron: "Woithia!" },
                ]},
              ].map((section) => (
                <div key={section.cat} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Flag code="gr" name="Griechenland" />
                    {section.cat}
                  </h3>
                  <div className="space-y-2">
                    {section.phrases.map((p) => (
                      <div key={p.de} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-sm font-bold text-gray-900 w-28 shrink-0">{p.de}</span>
                        <span className="text-sm text-[#00838F] font-semibold flex-1">{p.gr}</span>
                        <span className="text-xs text-gray-400 italic">({p.pron})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-2">💡 Sprachtipp</h3>
              <p className="text-sm text-gray-600">Schon ein einfaches &quot;Kalimera&quot; oder &quot;Efcharisto&quot; bringt Kreter zum Strahlen. Griechisch klingt kompliziert, aber die Grundbegriffe sind schnell gelernt. In touristischen Gebieten kommt man gut mit Englisch durch.</p>
            </div>
          </div>
        )}

        {/* ════ HELP ════ */}
        {activeTab === "help" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Hilfe & Notfall</h2>
              <p className="text-gray-400 text-sm">Wichtige Kontakte und Notfallnummern für deinen Kreta-Urlaub</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
              <h3 className="text-xl font-extrabold text-red-700 mb-4">Notrufnummern</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Allgemeiner Notruf", number: "112", icon: "🆘" },
                  { label: "Polizei", number: "100", icon: "👮" },
                  { label: "Rettungsdienst", number: "166", icon: "🚑" },
                  { label: "Feuerwehr", number: "199", icon: "🚒" },
                  { label: "Touristenpolizei", number: "171", icon: "🛡️" },
                  { label: "Küstenwache", number: "108", icon: "⚓" },
                ].map((e) => (
                  <div key={e.label} className="bg-white rounded-xl p-4 border border-red-100 text-center">
                    <span className="text-2xl">{e.icon}</span>
                    <p className="text-xs text-gray-500 mt-1">{e.label}</p>
                    <p className="text-2xl font-extrabold text-red-700">{e.number}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">🏥 Krankenhäuser</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><strong>Universitätsklinik Heraklion (PAGNI)</strong><br />Voutes, 71110 Heraklion<br />Tel: +30 2810 392111</li>
                  <li><strong>Allgemeines Krankenhaus Chania</strong><br />Agios Loukas, 73300 Chania<br />Tel: +30 28210 22000</li>
                  <li><strong>Krankenhaus Rethymno</strong><br />Trandalidou 17, 74100 Rethymno<br />Tel: +30 28310 27814</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">💊 Apotheken (Farmakeio)</h3>
                <p className="text-sm text-gray-600 mb-3">Apotheken sind in allen Städten und größeren Orten vorhanden. Erkennbar am grünen Kreuz-Schild.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Öffnungszeiten: Mo–Fr 08:00–14:30, manche auch nachmittags</li>
                  <li>• Nachtdienst rotiert – Aushang an jeder Apotheke</li>
                  <li>• Viele Medikamente rezeptfrei erhältlich, die in DE rezeptpflichtig sind</li>
                  <li>• Sonnenschutzmittel und Mückenschutz überall verfügbar</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3">🇩🇪 Deutsche Botschaft</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Botschaft Athen</strong></li>
                  <li>Karaoli & Dimitriou 3, 10675 Athen</li>
                  <li>Tel: +30 210 7285111</li>
                  <li>Notfall außerhalb der Bürozeiten: +30 210 7285111</li>
                  <li className="text-xs text-gray-400 mt-2">Auf Kreta gibt es keinen ständigen Konsularbeamten. In dringenden Fällen die Botschaft in Athen kontaktieren.</li>
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-3">🏥 EHIC – Europäische Krankenversicherungskarte</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• EHIC (blaue Karte) immer mitnehmen!</li>
                  <li>• Gilt in allen öffentlichen Krankenhäusern und bei Vertragsärzten</li>
                  <li>• Deckt medizinisch notwendige Behandlungen ab</li>
                  <li>• Zusätzliche Reisekrankenversicherung trotzdem empfohlen</li>
                  <li>• Rücktransport nach Deutschland ist NICHT durch EHIC abgedeckt</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
