"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TiqetsCarousel from "@/components/tiqets/TiqetsCarousel";

type TabId =
  | "home" | "overview" | "history" | "sights"
  | "routes" | "insider" | "food" | "practical"
  | "language" | "help" | "activities";

const TEAL = "#00838F";

const TABS: { id: TabId; label: string }[] = [
  { id: "home",       label: "🏠 Startseite" },
  { id: "overview",   label: "📊 Überblick & Fakten" },
  { id: "history",    label: "📜 Geschichte & Kultur" },
  { id: "sights",     label: "🏰 Sehen & Erleben" },
  { id: "activities", label: "🎟️ Aktivitäten & Tickets" },
  { id: "routes",     label: "🗺️ Tagesplanung" },
  { id: "insider",    label: "🤫 Geheimtipps & Ausflüge" },
  { id: "food",       label: "🍽️ Essen & Trinken" },
  { id: "practical",  label: "💡 Praktische Infos" },
  { id: "language",   label: "🗣️ Sprachhilfe" },
  { id: "help",       label: "🆘 Hilfe & Notfall" },
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
  { label: "Januar in Antalya 🍊",  text: "Mild, aber regnerisch. Zeit der Orangenernte & ideal für Museen." },
  { label: "Februar in Antalya 🏛️", text: "Kühl. Perfekt, um antike Stätten wie Perge ohne Menschenmassen zu erkunden." },
  { label: "März in Antalya ⛰️",    text: "Der Frühling erwacht. Ideal für erste Wanderungen am Lykischen Weg." },
  { label: "April in Antalya 🌸",   text: "Angenehm warm, alles blüht. Top-Zeit für Sightseeing." },
  { label: "Mai in Antalya 🏖️",     text: "Vorsaison. Warm genug für erste Strandtage." },
  { label: "Juni in Antalya ⛵",     text: "Sommerbeginn. Perfekt für Bootsausflüge und Wassersport." },
  { label: "Juli in Antalya ☀️",    text: "Hochsommer. Sehr heiß, ideal für Sonnenanbeter und Wasserparks." },
  { label: "August in Antalya 🌊",  text: "Heißester Monat. Alles dreht sich um Strand, Meer und Klimaanlage." },
  { label: "September in Antalya 🌅", text: "Nachsaison, noch sehr warm. Perfekt für alles bei weniger Trubel." },
  { label: "Oktober in Antalya 🏞️", text: "Angenehm mild. Ideal für Ausflüge zu den Wasserfällen." },
  { label: "November in Antalya 🚶‍♂️", text: "Ruhig, oft sonnig. Ideal für Stadtspaziergänge in Kaleiçi." },
  { label: "Dezember in Antalya ☕", text: "Besinnlich & kühl. Perfekt für einen Besuch im Hamam oder Teehäusern." },
];

interface WeatherState { temp: number; desc: string; icon: string }
interface ForecastDay  { day: string; icon: string; maxTemp: number }

function MapPinSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function MapLink({ href, address }: { href: string; address?: string }) {
  return (
    <div className="mt-1">
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center text-sm">
        <MapPinSvg /> Karte
      </a>
      {address && <p className="text-xs text-gray-500 mt-0.5">📍 {address}</p>}
    </div>
  );
}

function SightCard({ title, desc, mapHref, address }: { title: string; desc: string; mapHref: string; address?: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <strong>{title}:</strong> {desc}
      <MapLink href={mapHref} address={address} />
    </div>
  );
}

function ItineraryDay({ day, text }: { day: string; text: string }) {
  return (
    <div className="border-l-[3px] border-[#00838F] pl-6 ml-2">
      <p><strong>{day}:</strong> {text}</p>
    </div>
  );
}

export default function AntalyaGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [weather,   setWeather]   = useState<WeatherState | null>(null);
  const [forecast,  setForecast]  = useState<ForecastDay[]>([]);
  const [liveTime,  setLiveTime]  = useState("");
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
    <div className="max-w-[1500px] mx-auto bg-white shadow-2xl rounded-lg my-8 border border-gray-200">

      {/* ── Page Header: Breadcrumb + H1 ── */}
      <div className="px-6 md:px-10 pt-8 pb-5 border-b border-gray-100">
        <nav className="flex items-center gap-1 text-sm text-gray-400 mb-3 flex-wrap">
          <Link href="/" className="hover:text-sand-500 transition-colors">Startseite</Link>
          <span>›</span>
          <Link href="/urlaubsguides/" className="hover:text-sand-500 transition-colors">Urlaubsguides</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Antalya Reiseführer</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Antalya Reiseführer <span style={{ color: TEAL }}>2025</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Dein umfassender Guide für den perfekten Türkei-Urlaub – Tipps, Sehenswürdigkeiten & praktische Infos.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <nav className="bg-white border-b border-gray-200 print:hidden">
        <div className="flex overflow-x-auto -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-5 text-sm whitespace-nowrap text-gray-600 hover:text-gray-800 focus:outline-none transition-colors shrink-0 ${activeTab === tab.id ? "font-semibold text-gray-900" : ""}`}
              style={activeTab === tab.id ? { borderBottom: `3px solid ${TEAL}` } : { borderBottom: "3px solid transparent" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-6 md:p-10">

        {/* ════ HOME ════ */}
        {activeTab === "home" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Dein Antalya-Dashboard</h2>
              <button onClick={() => window.print()} className="print:hidden bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" />
                </svg>
                Drucken
              </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Weather */}
              <div className="rounded-2xl text-white shadow-xl p-6 bg-linear-to-br from-sky-500 to-cyan-600 flex flex-col transition-transform duration-300 hover:scale-[1.03]">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  Aktuelles Wetter in Antalya
                </h3>
                <div className="flex-grow">
                  {weather ? (
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold">{weather.temp}°C</div>
                      <div className="text-lg">{weather.desc} {weather.icon}</div>
                      <div className="text-sm font-bold text-white/80">Antalya</div>
                    </div>
                  ) : (
                    <p className="text-white/80">Wetterdaten werden geladen...</p>
                  )}
                </div>
                {forecast.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {forecast.map((d, i) => (
                        <div key={i} className="p-1 rounded-md bg-white/10">
                          <div className="font-bold">{d.day}</div>
                          <div className="text-xl">{d.icon}</div>
                          <div>{d.maxTemp}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {liveTime && (
                  <div className="mt-4 pt-3 border-t border-white/20 text-center text-sm">
                    <strong>Uhrzeit vor Ort:</strong> {liveTime}
                  </div>
                )}
              </div>

              {/* Best Travel Time */}
              <div className="rounded-2xl text-white shadow-xl p-6 bg-linear-to-br from-emerald-500 to-teal-600 flex flex-col transition-transform duration-300 hover:scale-[1.03]">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Beste Reisezeit für Antalya
                </h3>
                <div className="space-y-3 text-sm text-white/90 flex-grow">
                  {[
                    { icon: "🌸", season: "Frühling (Apr-Mai)", desc: "Perfekt für Wanderungen & Sightseeing." },
                    { icon: "☀️", season: "Sommer (Jun-Sep)",  desc: "Ideal für Strand & Meer." },
                    { icon: "🍂", season: "Herbst (Okt-Nov)",  desc: "Angenehm warm, weniger Trubel." },
                    { icon: "❄️", season: "Winter (Dez-Mär)",  desc: "Mild, für Kultur & Ruhe." },
                  ].map((s) => (
                    <div key={s.season}>
                      <div className="font-bold flex items-center"><span className="text-lg mr-2">{s.icon}</span>{s.season}</div>
                      <p className="text-white/80 pl-7">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 */}
              <div className="rounded-2xl text-white shadow-xl p-6 bg-linear-to-br from-rose-500 to-red-600 flex flex-col transition-transform duration-300 hover:scale-[1.03]">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Top 5 für...
                </h3>
                <div className="space-y-3 text-sm text-white/90 flex-grow">
                  <p><span className="mr-2">🥇</span><strong>Erstbesucher:</strong> Kaleiçi, Düden-Wasserfälle, Aspendos, Bootstour, Konyaaltı Strand.</p>
                  <p><span className="mr-2">👨‍👩‍👧‍👦</span><strong>Familien:</strong> Land of Legends, Antalya Aquarium, Sandland, Lara Strand, Jeep-Safari.</p>
                  <p><span className="mr-2">💕</span><strong>Paare:</strong> Abendessen in Kaleiçi, Sonnenuntergang am Hafen, Lykischer Weg, Bootstour, Hamam-Besuch.</p>
                  <p><span className="mr-2">🍸</span><strong>Singles:</strong> Beach Clubs in Lara, Bars in Kaleiçi, organisierte Touren, Wassersport am Konyaaltı.</p>
                </div>
              </div>
            </div>

            {/* Month Scroll */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Antalya nach Monaten: Dein perfekter Reisezeitpunkt</h2>
              <div className="guide-month-scroll print:hidden">
                {MONTHS_DATA.map((month, i) => (
                  <div
                    key={i}
                    className={`guide-month-card bg-white rounded-lg p-4 border transition-all duration-200 ${
                      i === currentMonth
                        ? "border-[#00838F] border-2 scale-105 shadow-[0_10px_20px_rgba(0,131,143,0.25)]"
                        : "border-gray-200"
                    }`}
                  >
                    <h3 className="text-xs font-semibold">{month.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{month.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Antalya zur Orientierung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <iframe
                  className="w-full h-96 rounded-lg border"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204283.2039229884!2d30.5484850729223!3d36.89725404659929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39aa2b83f3e45%3A0x6e14759604888e7f!2sAntalya%2C%20T%C3%BCrkei!5e0!3m2!1sde!2sde!4v1658835282115!5m2!1sde!2sde"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <MapPinSvg /> Lage & Geografie
                  </h3>
                  <ul className="space-y-3 text-gray-700 list-disc list-inside">
                    <li><strong>Land:</strong> Türkei</li>
                    <li><strong>Region:</strong> Türkische Riviera, Mittelmeerküste</li>
                    <li><strong>Hauptstadt der Provinz:</strong> Antalya</li>
                    <li><strong>Besonderheit:</strong> Antalya liegt an einer malerischen Steilküste vor der Kulisse des imposanten Taurusgebirges – reiche Antike trifft moderne Touristenzentren.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>📊 Überblick & Fakten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-4">
                {[
                  { icon: "🗣️", label: "Sprache", text: "Türkisch. In Touristengebieten wird oft Englisch und Deutsch gesprochen." },
                  { icon: "💶", label: "Währung", text: "Türkische Lira (TRY). Euro wird oft akzeptiert, der Kurs ist aber meist schlecht. Geldwechsel vor Ort empfohlen." },
                  { icon: "🛂", label: "Einreise", text: "Reisepass oder Personalausweis (für Deutsche) erforderlich. Visum für touristische Aufenthalte bis 90 Tage meist nicht nötig – aktuelle Bestimmungen prüfen!" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div><strong className="block">{item.label}:</strong> {item.text}</div>
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="text-xl font-semibold mb-3">Klima & Beste Reisezeit</h3>
                <p className="text-gray-700 mb-4">Antalya hat ein heißes Mittelmeerklima. Sommer heiß und trocken, Winter mild und regnerisch. Beste Reisezeit: Frühling und Herbst.</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Frühling:", temp: "15-25°C", w: "70%",  color: "bg-green-400"  },
                    { label: "Sommer:",  temp: "25-35°C+", w: "100%", color: "bg-yellow-400" },
                    { label: "Herbst:",  temp: "18-28°C",  w: "75%",  color: "bg-sand-400" },
                    { label: "Winter:",  temp: "10-15°C",  w: "40%",  color: "bg-blue-400"   },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="w-20 font-bold text-xs">{s.label}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-5">
                        <div className={`${s.color} h-5 rounded-full text-xs text-white text-center leading-5`} style={{ width: s.w }}>{s.temp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-3">Kultur & Besonderheiten</h3>
              <p className="text-gray-700">Die türkische Kultur ist geprägt von Gastfreundschaft. Einladungen zum Tee (&quot;Çay&quot;) sind üblich und sollten nicht ausgeschlagen werden. Handeln auf Basaren (&quot;Pazarlık&quot;) gehört zur Kultur. Respekt vor religiösen Sitten beim Moscheebesuch ist wichtig.</p>
            </div>
          </div>
        )}

        {/* ════ HISTORY ════ */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>📜 Geschichte & Kultur</h2>
            <p className="text-gray-700 mb-4">
              Antalya, in der Antike als Attaleia bekannt, wurde im 2. Jahrhundert v. Chr. gegründet. Die Stadt war ein wichtiger Hafen unter den <strong>Römern</strong> (Hadrianstor). Später prägten <strong>Byzantiner</strong>, <strong>Seldschuken</strong> (Yivli-Minarett) und <strong>Osmanen</strong> die Stadt. Diese reiche Geschichte lebt in Kaleiçi und antiken Stätten wie Perge und Aspendos fort.
            </p>
            <h3 className="text-xl font-semibold mb-3">Lokale Etikette</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Begrüßung:</strong> Ein freundliches &quot;Merhaba&quot; wird sehr geschätzt.</li>
              <li><strong>Handeln:</strong> Auf Basaren und bei Taxifahrten ohne Taxameter ist Handeln üblich.</li>
              <li><strong>Moscheebesuch:</strong> Schultern und Knie bedecken, Frauen zusätzlich das Haar. Schuhe ausziehen.</li>
              <li><strong>Gastfreundschaft:</strong> Eine Einladung zum Tee ist eine Geste der Freundlichkeit und sollte angenommen werden.</li>
            </ul>
          </div>
        )}

        {/* ════ SIGHTS ════ */}
        {activeTab === "sights" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🏰 Sehen & Erleben in Antalya</h2>

            <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: TEAL }}>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">Für Kulturinteressierte & Entdecker</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SightCard title="Kaleiçi (Altstadt)" desc="Schlendere durch enge Gassen, entdecke das Hadrianstor und den alten römischen Hafen." mapHref="https://www.google.com/maps/search/?api=1&query=Kalei%C3%A7i+Antalya" address="Kaleiçi, 07100 Muratpaşa/Antalya" />
              <SightCard title="Antikes Theater von Aspendos" desc="Das am besten erhaltene römische Theater der Antike. Ein absolutes Muss!" mapHref="https://www.google.com/maps/search/?api=1&query=Aspendos+Antalya" address="Serik, 07500 Serik/Antalya" />
              <SightCard title="Antike Stadt Perge" desc="Erkunde beeindruckende Ruinen mit Stadion, Agora und Kolonnadenstraße." mapHref="https://www.google.com/maps/search/?api=1&query=Perge+Antalya" address="Barbaros, 07112 Aksu/Antalya" />
              <SightCard title="Archäologisches Museum Antalya" desc="Eines der bedeutendsten Museen der Türkei mit faszinierenden Funden aus der Region." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Museum" address="Bahçelievler, Konyaaltı Cd. No:88, 07050 Muratpaşa/Antalya" />
              <SightCard title="Yivli-Minare-Moschee" desc="Das Wahrzeichen von Antalya mit seinem gerillten Minarett aus der Seldschukenzeit." mapHref="https://www.google.com/maps/search/?api=1&query=Yivli+Minaret+Mosque" address="Selçuk, İskele Cd. No:38, 07100 Muratpaşa/Antalya" />
              <SightCard title="Termessos" desc="Antike Bergstadt in einem Nationalpark. Spektakuläre Lage – gutes Schuhwerk und Wasser mitnehmen!" mapHref="https://www.google.com/maps/search/?api=1&query=Termessos" address="Bayatbademleri, 07800 Döşemealtı/Antalya" />
            </div>

            <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: TEAL }}>
              <span className="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">Für Familien & Abenteurer</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SightCard title="Düden-Wasserfälle" desc="Bestaune die unteren Fälle, die direkt ins Meer stürzen, und spaziere hinter den oberen Fällen hindurch." mapHref="https://www.google.com/maps/search/?api=1&query=D%C3%BCden+Wasserf%C3%A4lle+Antalya" address="Lara Cd. No:457, 07100 Muratpaşa/Antalya" />
              <SightCard title="The Land of Legends" desc="Ein riesiger Themen- und Wasserpark, der einen ganzen Tag voller Spaß verspricht." mapHref="https://www.google.com/maps/search/?api=1&query=The+Land+of+Legends+Kadriye" address="Kadriye, Atatürk Cd. No:1, 07506 Serik/Antalya" />
              <SightCard title="Antalya Aquarium" desc="Tausende Meeresbewohner und eines der längsten Tunnel-Aquarien der Welt." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Aquarium" address="Arapsuyu, Dumlupınar Blv. No:502, 07200 Konyaaltı/Antalya" />
              <SightCard title="Tünektepe Seilbahn" desc="Fahre auf den Berg und genieße atemberaubende Panoramaaussicht über die ganze Stadt und Küste." mapHref="https://www.google.com/maps/search/?api=1&query=T%C3%BCnektepe+Teleferik" address="Liman, 07130 Konyaaltı/Antalya" />
              <SightCard title="Jeep-Safari / Wüstensafari" desc="Erlebe Natur und Abenteuer im Geländewagen oder Quad, Kamelreiten und Sternenhimmel." mapHref="https://www.google.com/maps/search/?api=1&query=Antalya+Jeep+Safari" />
              <div className="bg-gray-50 p-4 rounded-lg">
                <strong>Bootstour:</strong> Entdecke die Küste vom Wasser aus. Viele Touren starten am alten Hafen in Kaleiçi und fahren zu den Düden-Wasserfällen.
              </div>
            </div>
          </div>
        )}

        {/* ════ ACTIVITIES ════ */}
        {activeTab === "activities" && (
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: TEAL }}>🎟️ Aktivitäten & Tickets in Antalya</h2>
            <p className="text-gray-500 text-sm mb-6">
              Buche direkt vor Ort oder von zuhause – Touren, Eintrittskarten & Erlebnisse für deinen Antalya-Urlaub.
            </p>
            <TiqetsCarousel cityId="78987" cityName="Antalya" citySlug="antalya" />
          </div>
        )}

        {/* ════ ROUTES ════ */}
        {activeTab === "routes" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🗺️ Tagesplanung</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Couples */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Für Paare & Genießer</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2">3 Tage: Kultur & Romantik</h4>
                    <div className="space-y-4">
                      <ItineraryDay day="Tag 1" text="🏛️ Kaleiçi (Hadrianstor, Hafen), ☕ Türkischer Kaffee, 🌃 Abendessen mit Blick aufs Meer." />
                      <ItineraryDay day="Tag 2" text="🎭 Tagesausflug nach Perge & Aspendos, 🌅 Sonnenuntergang am Konyaaltı Strand." />
                      <ItineraryDay day="Tag 3" text="🧖‍♀️ Besuch in einem traditionellen Hamam, 🛍️ Bummel durch die modernen Geschäfte." />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">7 Tage: Die ganze Riviera</h4>
                    <div className="space-y-4">
                      <p><strong>Tag 1–3:</strong> Wie oben.</p>
                      <ItineraryDay day="Tag 4" text="⛵ Bootstour entlang der Küste zu den Düden-Wasserfällen." />
                      <ItineraryDay day="Tag 5" text="⛰️ Ausflug in die Berge nach Termessos oder zum Lykischen Weg." />
                      <ItineraryDay day="Tag 6" text="🏖️ Entspannungstag am Kaputaş Strand (Tagesausflug)." />
                      <ItineraryDay day="Tag 7" text="🏞️ Besuch des Kurşunlu-Wasserfalls und letzter Bummel auf dem Basar." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Families */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Für Familien</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2">3 Tage: Spaß & Abenteuer</h4>
                    <div className="space-y-4">
                      <ItineraryDay day="Tag 1" text="🐠 Antalya Aquarium, danach zum Konyaaltı Strand." />
                      <ItineraryDay day="Tag 2" text="🌊 Düden-Wasserfälle (oben & unten), danach eine kurze Bootstour ab dem Hafen." />
                      <ItineraryDay day="Tag 3" text="🏜️ Halbtägige Jeep- oder Quad-Safari in der Umgebung." />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">7 Tage: Die komplette Action</h4>
                    <div className="space-y-4">
                      <p><strong>Tag 1–3:</strong> Wie oben.</p>
                      <ItineraryDay day="Tag 4" text='🎢 Ein ganzer Tag im "The Land of Legends" Themenpark.' />
                      <ItineraryDay day="Tag 5" text="🏖️ Strandtag am Lara Strand mit Besuch des Sandland Skulpturenfestivals." />
                      <ItineraryDay day="Tag 6" text="🚠 Fahrt mit der Tünektepe Seilbahn für eine tolle Aussicht." />
                      <ItineraryDay day="Tag 7" text="⛵ Piraten-Bootstour für Kinder ab dem Hafen." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ INSIDER ════ */}
        {activeTab === "insider" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🤫 Geheimtipps & Ausflüge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Versteckte Highlights</h3>
                <ul className="space-y-4">
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <strong>Karaalioğlu Park:</strong> Eine grüne Oase oberhalb der Klippen mit toller Aussicht und weniger Touristen als im Zentrum von Kaleiçi.
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Karaali%C4%9Flu+Park" address="Kılınçarslan, Park Sk., 07100 Muratpaşa/Antalya" />
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <strong>Sırt Köyde Kahvaltı:</strong> Fahre ins Umland für ein traditionelles türkisches Dorf-Frühstück (&quot;Köy Kahvaltısı&quot;). Ein unvergessliches Erlebnis.
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=S%C4%B1rt+K%C3%B6yde+Kahvalt%C4%B1" address="Çakırlar, 07070 Konyaaltı/Antalya" />
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Tagesausflüge</h3>
                <ul className="space-y-4">
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <strong>Kaş & Kalkan:</strong> Malerische Küstenstädte, ca. 3 Stunden westlich von Antalya. Ideal für einen entspannten Tag mit Bohème-Flair.
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Ka%C5%9F+Antalya" address="07580 Kaş/Antalya" />
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <strong>Saklıkent-Schlucht:</strong> Eine beeindruckende Schlucht, durch die man im Sommer im eiskalten Wasser waten kann.
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Sakl%C4%B1kent+National+Park" address="Kayadibi, 48340 Seydikemer/Muğla" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ════ FOOD ════ */}
        {activeTab === "food" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🍽️ Essen & Trinken</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Was du probieren musst</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>🥙 <strong>Kebab:</strong> Verschiedene Sorten wie Adana (scharf) oder İskender.</li>
                  <li>🧆 <strong>Meze:</strong> Auswahl kalter und warmer Vorspeisen – perfekt zum Teilen.</li>
                  <li>🍕 <strong>Pide & Lahmacun:</strong> Die türkische Antwort auf Pizza.</li>
                  <li>🥞 <strong>Gözleme:</strong> Dünne, gefüllte Teigfladen, oft frisch am Straßenrand zubereitet.</li>
                  <li>🍮 <strong>Süßes:</strong> Baklava, Künefe oder Lokum (Türkischer Honig).</li>
                  <li>🥛 <strong>Getränke:</strong> Ayran, frischer Granatapfelsaft oder starker türkischer Kaffee.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Restaurant-Empfehlungen</h3>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p><strong>Für Fisch & Meeresfrüchte:</strong> Arma Restaurant – gehobene Küche mit fantastischem Blick über den Hafen.</p>
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Arma+Restaurant+Antalya" address="Selçuk, İskele Cd. No:75, 07100 Muratpaşa/Antalya" />
                  </div>
                  <div>
                    <p><strong>Für authentische türkische Küche:</strong> Can Can – beliebt bei Einheimischen für günstige und leckere Pide und Kebab.</p>
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Can+Can+Pide+Kebap+Antalya" address="Tuzcular, Paşa Cami Sk. No:14, 07100 Muratpaşa/Antalya" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ PRACTICAL ════ */}
        {activeTab === "practical" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>💡 Praktische Infos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Transport",
                  text: 'Taxis (Preis vorher aushandeln!), die moderne Straßenbahn ("Antray") und die günstigen "Dolmuş"-Minibusse sind die besten Optionen.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Unterkünfte",
                  text: "Von Boutique-Hotels in Kaleiçi über große All-Inclusive-Resorts in Lara bis zu günstigen Stadthotels ist alles dabei.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  ),
                },
                {
                  title: "Sicherheit & Budget",
                  text: 'Achte auf seriöse Touranbieter. Geld sparen kannst du in "Lokantas" (einfache Restaurants) und durch Handeln auf dem Basar.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.49l-1.955 5.236a1 1 0 01-1.858.05l-2.423-4.846a1 1 0 00-1.858-.05L5.618 13.51l-2.423-4.846a1 1 0 00-1.858-.05l-1.955 5.236" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="text-xl font-bold mb-3 flex items-center">{card.icon}{card.title}</h3>
                  <p className="text-gray-700">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LANGUAGE ════ */}
        {activeTab === "language" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🗣️ Sprachhilfe</h2>
            <p className="text-gray-700 mb-4">Ein paar Worte auf Türkisch werden sehr geschätzt. Hier die wichtigsten Phrasen:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                ["Hallo",                  "Merhaba"],
                ["Guten Morgen",           "Günaydın"],
                ["Tschüss",               "Görüşürüz"],
                ["Bitte",                  "Lütfen"],
                ["Danke",                  "Teşekkür ederim"],
                ["Ja / Nein",              "Evet / Hayır"],
                ["Die Rechnung, bitte",    "Hesap, lütfen"],
                ["Wie viel kostet das?",   "Ne kadar?"],
                ["Wo ist...?",             "... nerede?"],
                ["Ich verstehe nicht",     "Anlamıyorum"],
                ["Ein Wasser, bitte",      "Bir su, lütfen"],
              ].map(([de, tr]) => (
                <div key={de} className="bg-gray-50 p-3 rounded-lg">
                  <strong>{de}:</strong> {tr}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ HELP ════ */}
        {activeTab === "help" && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: TEAL }}>🆘 Hilfe & Notfall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
                <h3 className="font-bold mb-2">Wichtige Telefonnummern</h3>
                <p><strong>🚨 Allgemeiner Notruf: 112</strong> (Polizei, Ambulanz, Feuerwehr)</p>
                <p><strong>🚓 Touristenpolizei:</strong> 155</p>
                <p><strong>🚕 Lokale Taxizentrale:</strong> +90 242 334 44 44</p>
                <p><strong>🇩🇪 Deutsches Konsulat:</strong> +90 242 314 11 01</p>
                <p><strong>🇦🇹 Österreichisches Konsulat:</strong> +90 242 312 37 07</p>
                <p><strong>🇨🇭 Schweizer Konsulat:</strong> +90 242 248 68 00</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">🇩🇪🇦🇹🇨🇭 Konsulate in der Region</h3>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p><strong>🇩🇪 Deutsches Konsulat</strong></p>
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Deutsches+Konsulat+Antalya" address="Çağlayan, 2042. Sk. No:2, 07230 Muratpaşa/Antalya" />
                  </div>
                  <div>
                    <p><strong>🇦🇹 Österreichisches Honorarkonsulat</strong></p>
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=%C3%96sterreichisches+Honorarkonsulat+Antalya" address="Aspendos Blv. No:71, 07200 Muratpaşa/Antalya" />
                  </div>
                  <div>
                    <p><strong>🇨🇭 Schweizer Honorarkonsulat</strong></p>
                    <MapLink href="https://www.google.com/maps/search/?api=1&query=Schweizer+Honorarkonsulat+Antalya" address="Kılıçaslan, Fırın Sk. No:17, 07100 Muratpaşa/Antalya" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Booking CTA ── */}
        <div className="mt-10 bg-linear-to-r from-sand-500 to-sand-400 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold mb-1">Bereit für deinen Antalya-Urlaub?</h3>
            <p className="text-sand-100 text-sm">
              Jetzt tagesaktuelle Pauschalreisen, All-Inclusive & Last-Minute Deals vergleichen und günstig buchen.
            </p>
          </div>
          <Link
            href="/urlaubsziele/antalya/"
            className="bg-white text-sand-600 font-semibold px-6 py-3 rounded-full hover:bg-sand-50 transition-colors whitespace-nowrap shrink-0"
          >
            Antalya Angebote ansehen →
          </Link>
        </div>

      </main>
    </div>
  );
}
