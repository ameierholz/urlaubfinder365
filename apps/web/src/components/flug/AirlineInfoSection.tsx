"use client";

import { useState } from "react";

type Region = "alle" | "deutschland" | "europa" | "naherosten" | "asien" | "amerika";

interface Airline {
  name: string;
  iata: string;
  color: string;
  region: Region;
  web: string;
  checkin: string;
  baggage: string;
}

const AIRLINES: Airline[] = [
  // ── Deutsche Airlines ────────────────────────────────────────────────
  {
    name: "Lufthansa", iata: "LH", color: "#05164d", region: "deutschland",
    web:     "https://www.lufthansa.com/de/de/homepage",
    checkin: "https://www.lufthansa.com/de/de/check-in-optionen",
    baggage: "https://www.lufthansa.com/de/de/gepaeck",
  },
  {
    name: "Eurowings", iata: "EW", color: "#7b0f6c", region: "deutschland",
    web:     "https://www.eurowings.com/de.html",
    checkin: "https://www.eurowings.com/de/informationen/am-flughafen/check-in.html",
    baggage: "https://www.eurowings.com/de/informationen/am-flughafen/gepaeck.html",
  },
  {
    name: "TUI fly", iata: "X3", color: "#e2001a", region: "deutschland",
    web:     "https://www.tuifly.com/de",
    checkin: "https://www.tuifly.com/de/flug/checkin",
    baggage: "https://www.tuifly.com/de/flug/gepaeck",
  },
  {
    name: "Condor", iata: "DE", color: "#ff6600", region: "deutschland",
    web:     "https://www.condor.com/de",
    checkin: "https://www.condor.com/de/checkin",
    baggage: "https://www.condor.com/de/fluginfo/gepaeck/gepaeckbestimmungen.jsp",
  },
  {
    name: "SunExpress", iata: "XQ", color: "#f9a61a", region: "deutschland",
    web:     "https://www.sunexpress.com/de",
    checkin: "https://www.sunexpress.com/de/check-in",
    baggage: "https://www.sunexpress.com/de/gepaeck",
  },

  // ── Europa ────────────────────────────────────────────────────────────
  {
    name: "Ryanair", iata: "FR", color: "#073590", region: "europa",
    web:     "https://www.ryanair.com/de/de",
    checkin: "https://www.ryanair.com/de/de/useful-info/help-centre/faq-overview/article/check-in",
    baggage: "https://www.ryanair.com/de/de/useful-info/gepack",
  },
  {
    name: "easyJet", iata: "U2", color: "#ff6600", region: "europa",
    web:     "https://www.easyjet.com/de",
    checkin: "https://www.easyjet.com/de/hilfe/einchecken",
    baggage: "https://www.easyjet.com/de/hilfe/gepack",
  },
  {
    name: "Wizz Air", iata: "W6", color: "#c6007e", region: "europa",
    web:     "https://wizzair.com/de-de",
    checkin: "https://wizzair.com/de-de/information-and-services/check-in",
    baggage: "https://wizzair.com/de-de/information-and-services/gepack",
  },
  {
    name: "Norwegian", iata: "DY", color: "#d81939", region: "europa",
    web:     "https://www.norwegian.com/de",
    checkin: "https://www.norwegian.com/de/reiseinformationen/check-in",
    baggage: "https://www.norwegian.com/de/reiseinformationen/gepack",
  },
  {
    name: "Transavia", iata: "HV", color: "#00a650", region: "europa",
    web:     "https://www.transavia.com/de-DE/home",
    checkin: "https://www.transavia.com/de-DE/service/check-in",
    baggage: "https://www.transavia.com/de-DE/service/gepack",
  },
  {
    name: "Vueling", iata: "VY", color: "#ffcc00", region: "europa",
    web:     "https://www.vueling.com/de",
    checkin: "https://www.vueling.com/de/services/check-in",
    baggage: "https://www.vueling.com/de/services/gepack",
  },
  {
    name: "Iberia", iata: "IB", color: "#bb0e1e", region: "europa",
    web:     "https://www.iberia.com/de",
    checkin: "https://www.iberia.com/de/check-in",
    baggage: "https://www.iberia.com/de/informationen/gepack",
  },
  {
    name: "Air France", iata: "AF", color: "#002157", region: "europa",
    web:     "https://www.airfrance.de",
    checkin: "https://www.airfrance.de/de/local/process/onlineCheckin/redirectCheckin",
    baggage: "https://www.airfrance.de/de/local/all/travel-guide/prepare/baggage",
  },
  {
    name: "KLM", iata: "KL", color: "#00a1de", region: "europa",
    web:     "https://www.klm.com/de/de",
    checkin: "https://www.klm.com/de/de/prepare-for-travel/check-in",
    baggage: "https://www.klm.com/de/de/prepare-for-travel/baggage",
  },
  {
    name: "British Airways", iata: "BA", color: "#075aaa", region: "europa",
    web:     "https://www.britishairways.com/de-de/home",
    checkin: "https://www.britishairways.com/de-de/information/check-in-online",
    baggage: "https://www.britishairways.com/de-de/information/baggage-essentials",
  },
  {
    name: "Swiss", iata: "LX", color: "#e30613", region: "europa",
    web:     "https://www.swiss.com/de/de",
    checkin: "https://www.swiss.com/de/de/prepare/checkin",
    baggage: "https://www.swiss.com/de/de/prepare/baggage",
  },
  {
    name: "Austrian", iata: "OS", color: "#ed1c24", region: "europa",
    web:     "https://www.austrian.com/de/de/homepage",
    checkin: "https://www.austrian.com/de/de/prepare/check-in",
    baggage: "https://www.austrian.com/de/de/prepare/baggage",
  },
  {
    name: "Finnair", iata: "AY", color: "#1a2654", region: "europa",
    web:     "https://www.finnair.com/de",
    checkin: "https://www.finnair.com/de/prepare/check-in",
    baggage: "https://www.finnair.com/de/prepare/baggage",
  },
  {
    name: "SAS", iata: "SK", color: "#000080", region: "europa",
    web:     "https://www.flysas.com/de-de",
    checkin: "https://www.flysas.com/de-de/prepare-for-travel/check-in",
    baggage: "https://www.flysas.com/de-de/prepare-for-travel/baggage",
  },
  {
    name: "Volotea", iata: "V7", color: "#1b2a6b", region: "europa",
    web:     "https://www.volotea.com/de",
    checkin: "https://www.volotea.com/de/check-in",
    baggage: "https://www.volotea.com/de/gepack",
  },

  // ── Naher Osten & Golf ───────────────────────────────────────────────
  {
    name: "Emirates", iata: "EK", color: "#c8102e", region: "naherosten",
    web:     "https://www.emirates.com/de/german",
    checkin: "https://www.emirates.com/de/german/manage-booking/online-check-in",
    baggage: "https://www.emirates.com/de/german/before-you-fly/baggage",
  },
  {
    name: "Qatar Airways", iata: "QR", color: "#5c0632", region: "naherosten",
    web:     "https://www.qatarairways.com/de-de/homepage.html",
    checkin: "https://www.qatarairways.com/de-de/check-in.html",
    baggage: "https://www.qatarairways.com/de-de/baggage.html",
  },
  {
    name: "Etihad", iata: "EY", color: "#bd8b13", region: "naherosten",
    web:     "https://www.etihad.com/de-de",
    checkin: "https://www.etihad.com/de-de/check-in",
    baggage: "https://www.etihad.com/de-de/before-you-fly/baggage",
  },
  {
    name: "Turkish Airlines", iata: "TK", color: "#c8102e", region: "naherosten",
    web:     "https://www.turkishairlines.com/de-de",
    checkin: "https://www.turkishairlines.com/de-de/service/check-in",
    baggage: "https://www.turkishairlines.com/de-de/service/gepaeck",
  },
  {
    name: "Pegasus", iata: "PC", color: "#f96600", region: "naherosten",
    web:     "https://www.flypgs.com/de",
    checkin: "https://www.flypgs.com/de/check-in",
    baggage: "https://www.flypgs.com/de/gepack",
  },
  {
    name: "flydubai", iata: "FZ", color: "#e9002d", region: "naherosten",
    web:     "https://www.flydubai.com/de",
    checkin: "https://www.flydubai.com/de/plan/check-in",
    baggage: "https://www.flydubai.com/de/plan/baggage",
  },
  {
    name: "Corendon", iata: "CAI", color: "#ff6600", region: "naherosten",
    web:     "https://www.corendon.de",
    checkin: "https://www.corendon.de/check-in",
    baggage: "https://www.corendon.de/gepack",
  },

  // ── Asien & Pazifik ──────────────────────────────────────────────────
  {
    name: "Singapore Airlines", iata: "SQ", color: "#0f3460", region: "asien",
    web:     "https://www.singaporeair.com/de_DE/de/home/page",
    checkin: "https://www.singaporeair.com/de_DE/de/travel-info/check-in-options",
    baggage: "https://www.singaporeair.com/de_DE/de/travel-info/baggage",
  },
  {
    name: "Cathay Pacific", iata: "CX", color: "#005b5e", region: "asien",
    web:     "https://www.cathaypacific.com/cx/de_DE.html",
    checkin: "https://www.cathaypacific.com/cx/de_DE/prepare-trip/before-you-fly/check-in.html",
    baggage: "https://www.cathaypacific.com/cx/de_DE/prepare-trip/baggage.html",
  },
  {
    name: "Japan Airlines", iata: "JL", color: "#e61a1a", region: "asien",
    web:     "https://de.jal.com",
    checkin: "https://www.jal.co.jp/de/en/inter/service/checkin",
    baggage: "https://de.jal.com/baggage",
  },
  {
    name: "ANA", iata: "NH", color: "#0b2d6b", region: "asien",
    web:     "https://www.ana.co.jp/de/de",
    checkin: "https://www.ana.co.jp/de/de/prepare-for-travel/check-in",
    baggage: "https://www.ana.co.jp/de/de/prepare-for-travel/baggage",
  },
  {
    name: "Thai Airways", iata: "TG", color: "#59118e", region: "asien",
    web:     "https://www.thaiairways.com/de_DE/index.page",
    checkin: "https://www.thaiairways.com/de_DE/prepare/check_in.page",
    baggage: "https://www.thaiairways.com/de_DE/prepare/baggage.page",
  },
  {
    name: "AirAsia", iata: "AK", color: "#e81932", region: "asien",
    web:     "https://www.airasia.com/de/de",
    checkin: "https://www.airasia.com/de/de/manage-booking/web-check-in",
    baggage: "https://www.airasia.com/de/de/support/baggage",
  },

  // ── Amerika ──────────────────────────────────────────────────────────
  {
    name: "Delta", iata: "DL", color: "#003366", region: "amerika",
    web:     "https://www.delta.com/de/de/home",
    checkin: "https://www.delta.com/de/de/check-in/overview",
    baggage: "https://www.delta.com/de/de/baggage/overview",
  },
  {
    name: "United Airlines", iata: "UA", color: "#0066cc", region: "amerika",
    web:     "https://www.united.com/de/de",
    checkin: "https://www.united.com/de/de/checkin",
    baggage: "https://www.united.com/de/de/fly/travel/baggage",
  },
  {
    name: "American Airlines", iata: "AA", color: "#00467f", region: "amerika",
    web:     "https://www.aa.com/de-DE/home",
    checkin: "https://www.aa.com/de-DE/checkin",
    baggage: "https://www.aa.com/de-DE/baggage",
  },
  {
    name: "Air Canada", iata: "AC", color: "#d10a22", region: "amerika",
    web:     "https://www.aircanada.com/de/de",
    checkin: "https://www.aircanada.com/de/de/aco/home/plan/checkin",
    baggage: "https://www.aircanada.com/de/de/aco/home/plan/baggage",
  },
  {
    name: "LATAM", iata: "LA", color: "#e5173f", region: "amerika",
    web:     "https://www.latamairlines.com/de/de",
    checkin: "https://www.latamairlines.com/de/de/check-in",
    baggage: "https://www.latamairlines.com/de/de/gepack",
  },
  {
    name: "Avianca", iata: "AV", color: "#c6002b", region: "amerika",
    web:     "https://www.avianca.com/de/de",
    checkin: "https://www.avianca.com/de/de/manage/check-in",
    baggage: "https://www.avianca.com/de/de/informationen/gepack",
  },
  {
    name: "JetBlue", iata: "B6", color: "#003876", region: "amerika",
    web:     "https://www.jetblue.com",
    checkin: "https://www.jetblue.com/check-in",
    baggage: "https://www.jetblue.com/flying-on-jetblue/baggage",
  },
  {
    name: "Copa Airlines", iata: "CM", color: "#00205b", region: "amerika",
    web:     "https://www.copaair.com/de-de/home",
    checkin: "https://www.copaair.com/de-de/check-in",
    baggage: "https://www.copaair.com/de-de/informationen/gepack",
  },
  {
    name: "Aeromexico", iata: "AM", color: "#006cb7", region: "amerika",
    web:     "https://aeromexico.com/de-de",
    checkin: "https://aeromexico.com/de-de/checkin",
    baggage: "https://aeromexico.com/de-de/travel-information/baggage",
  },

  // ── Europa – weitere ─────────────────────────────────────────────────
  {
    name: "Aer Lingus", iata: "EI", color: "#007749", region: "europa",
    web:     "https://www.aerlingus.com/de-de/home",
    checkin: "https://www.aerlingus.com/de-de/travel-information/checkin",
    baggage: "https://www.aerlingus.com/de-de/travel-information/baggage",
  },
  {
    name: "TAP Air Portugal", iata: "TP", color: "#00843d", region: "europa",
    web:     "https://www.tapairportugal.com/de",
    checkin: "https://www.tapairportugal.com/de/check-in",
    baggage: "https://www.tapairportugal.com/de/before-you-fly/baggage",
  },
  {
    name: "ITA Airways", iata: "AZ", color: "#0047cc", region: "europa",
    web:     "https://www.itaairways.com/de-de",
    checkin: "https://www.itaairways.com/de-de/manage/check-in",
    baggage: "https://www.itaairways.com/de-de/travel-info/baggage",
  },
  {
    name: "Brussels Airlines", iata: "SN", color: "#003087", region: "europa",
    web:     "https://www.brusselsairlines.com/de-de",
    checkin: "https://www.brusselsairlines.com/de-de/check-in",
    baggage: "https://www.brusselsairlines.com/de-de/practical-information/baggage",
  },
  {
    name: "LOT Polish Airlines", iata: "LO", color: "#00559a", region: "europa",
    web:     "https://www.lot.com/de/de",
    checkin: "https://www.lot.com/de/de/check-in",
    baggage: "https://www.lot.com/de/de/gepack",
  },
  {
    name: "Aegean Airlines", iata: "A3", color: "#003087", region: "europa",
    web:     "https://en.aegeanair.com",
    checkin: "https://en.aegeanair.com/travel-information/check-in",
    baggage: "https://en.aegeanair.com/travel-information/baggage",
  },
  {
    name: "Jet2", iata: "LS", color: "#ff6600", region: "europa",
    web:     "https://www.jet2.com",
    checkin: "https://www.jet2.com/checkin",
    baggage: "https://www.jet2.com/info/baggage",
  },
  {
    name: "Air Serbia", iata: "JU", color: "#c8102e", region: "europa",
    web:     "https://www.airserbia.com/de",
    checkin: "https://www.airserbia.com/de/checkin",
    baggage: "https://www.airserbia.com/de/gepack",
  },

  // ── Naher Osten – weitere ────────────────────────────────────────────
  {
    name: "Air Arabia", iata: "G9", color: "#e60000", region: "naherosten",
    web:     "https://www.airarabia.com/de",
    checkin: "https://www.airarabia.com/de/checkin",
    baggage: "https://www.airarabia.com/de/baggage",
  },
  {
    name: "Oman Air", iata: "WY", color: "#8b0000", region: "naherosten",
    web:     "https://www.omanair.com/de/de",
    checkin: "https://www.omanair.com/de/de/check-in",
    baggage: "https://www.omanair.com/de/de/gepack",
  },

  // ── Asien – weitere ──────────────────────────────────────────────────
  {
    name: "Korean Air", iata: "KE", color: "#00256c", region: "asien",
    web:     "https://www.koreanair.com/de/de",
    checkin: "https://www.koreanair.com/de/de/check-in",
    baggage: "https://www.koreanair.com/de/de/travel/baggage",
  },
  {
    name: "Vietnam Airlines", iata: "VN", color: "#004d99", region: "asien",
    web:     "https://www.vietnamairlines.com/de/de/home",
    checkin: "https://www.vietnamairlines.com/de/de/check-in",
    baggage: "https://www.vietnamairlines.com/de/de/baggage",
  },
  {
    name: "Garuda Indonesia", iata: "GA", color: "#005aaa", region: "asien",
    web:     "https://www.garuda-indonesia.com/de/de",
    checkin: "https://www.garuda-indonesia.com/de/de/check-in",
    baggage: "https://www.garuda-indonesia.com/de/de/baggage",
  },
  {
    name: "Air India", iata: "AI", color: "#c8102e", region: "asien",
    web:     "https://www.airindia.com",
    checkin: "https://www.airindia.com/web-check-in",
    baggage: "https://www.airindia.com/baggage",
  },
  {
    name: "Scoot", iata: "TR", color: "#ffcd00", region: "asien",
    web:     "https://www.flyscoot.com/de",
    checkin: "https://www.flyscoot.com/de/checkin",
    baggage: "https://www.flyscoot.com/de/baggage",
  },
];

const TABS: { id: Region | "alle"; label: string; emoji: string }[] = [
  { id: "alle",        label: "Alle",              emoji: "✈️" },
  { id: "deutschland", label: "Deutsche Airlines",  emoji: "🇩🇪" },
  { id: "europa",      label: "Europa",             emoji: "🇪🇺" },
  { id: "naherosten",  label: "Naher Osten",        emoji: "🕌" },
  { id: "asien",       label: "Asien & Pazifik",    emoji: "🌏" },
  { id: "amerika",     label: "Amerika",            emoji: "🌎" },
];

function AirlineLogo({ iata, name, color }: { iata: string; name: string; color: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://pics.avs.io/120/60/${iata}.png`}
      alt={name}
      width={80}
      height={40}
      className="object-contain max-h-10"
      onError={(e) => {
        const target = e.currentTarget;
        target.style.display = "none";
        const fallback = target.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = "flex";
      }}
    />
  );
}

export default function AirlineInfoSection() {
  const [active, setActive] = useState<Region | "alle">("deutschland");

  const filtered = active === "alle"
    ? AIRLINES
    : AIRLINES.filter((a) => a.region === active);

  return (
    <div className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
          Wichtige Infos der größten Airlines
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Website, Online-Check-in und Gepäckbestimmungen – direkt beim Anbieter.
        </p>

        {/* ── Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${
                active === tab.id
                  ? "bg-[#00838F] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((airline) => (
            <div
              key={airline.iata}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Farbiger Akzentstreifen oben */}
              <div className="h-1 w-full" style={{ backgroundColor: airline.color }} />

              {/* Logo + Name auf weißem Hintergrund */}
              <div className="px-3 pt-3 pb-2 flex items-center gap-2.5">
                <div className="h-10 w-16 flex items-center justify-center shrink-0 overflow-hidden">
                  <AirlineLogo iata={airline.iata} name={airline.name} color={airline.color} />
                  {/* Fallback: farbiger IATA-Badge */}
                  <span
                    className="font-extrabold text-xs hidden items-center justify-center w-10 h-7 rounded-md text-white"
                    style={{ backgroundColor: airline.color }}
                    aria-hidden="true"
                  >
                    {airline.iata}
                  </span>
                </div>
                <span className="font-bold text-xs text-gray-800 leading-tight line-clamp-2">
                  {airline.name}
                </span>
              </div>

              {/* Trennlinie */}
              <div className="border-t border-gray-100 mx-3" />

              {/* Links */}
              <div className="px-3 py-2.5 flex flex-col gap-1.5">
                <a
                  href={airline.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#00838F] transition-colors"
                >
                  <span>🌐</span>
                  <span className="font-medium">Website</span>
                </a>
                <a
                  href={airline.checkin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#00838F] transition-colors"
                >
                  <span>✅</span>
                  <span className="font-medium">Online Check-in</span>
                </a>
                <a
                  href={airline.baggage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#00838F] transition-colors"
                >
                  <span>🧳</span>
                  <span className="font-medium">Gepäckbestimmungen</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          * Alle Links führen direkt zur offiziellen Airline-Website. Änderungen der Zieladressen vorbehalten.
        </p>
      </div>
    </div>
  );
}
