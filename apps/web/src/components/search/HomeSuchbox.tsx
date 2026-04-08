"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Plane, Calendar, Users, ChevronDown, X, Check } from "lucide-react";
import { DESTINATION_REGION_MAP } from "@/lib/search-params";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = "urlaub" | "lastminute" | "hotel" | "flug" | "mietwagen" | "kreuzfahrt";
type OverlayKey = "destination" | "airport" | "date" | "travelers" | "flugVon" | "flugNach" | "cruiseArea" | "cruiseLine" | "mietAbhol" | "mietRueck" | null;

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { key: "urlaub", label: "Urlaub", icon: "🌴" },
  { key: "lastminute", label: "Last-Minute", icon: "⚡" },
  { key: "hotel", label: "Hotel", icon: "🏨" },
  { key: "flug", label: "Flug", icon: "✈️" },
  { key: "mietwagen", label: "Mietwagen", icon: "🚗" },
  { key: "kreuzfahrt", label: "Kreuzfahrt", icon: "🚢" },
];

const BELIEBTE_REISEZIELE = [
  "Antalya & Belek", "Mallorca", "Teneriffa", "Kreta", "Rhodos",
  "Hurghada", "Gran Canaria", "Fuerteventura", "Lanzarote", "Side & Alanya",
  "Ibiza", "Zypern", "Dubai", "Thailand", "Malediven",
];

const ALLE_REISEZIELE = [
  "Ägypten", "Albanien", "Balearen", "Bulgarien", "Dominikanische Republik",
  "Dubai", "Griechenland", "Kanarische Inseln", "Karibik", "Kroatien",
  "Kuba", "Malediven", "Malta", "Marokko", "Mexiko", "Portugal",
  "Sardinien", "Sizilien", "Thailand", "Tunesien", "Türkei", "USA",
  "Vereinigte Arab. Emirate",
];

interface AirportGroup {
  label: string;
  airports: { name: string; code: string }[];
}

const AIRPORT_GROUPS: AirportGroup[] = [
  {
    label: "Deutschland West",
    airports: [
      { name: "Dortmund", code: "DTM" }, { name: "Düsseldorf", code: "DUS" },
      { name: "Frankfurt", code: "FRA" }, { name: "Hahn", code: "HHN" },
      { name: "Köln/Bonn", code: "CGN" }, { name: "Münster", code: "FMO" },
      { name: "Weeze", code: "NRN" }, { name: "Paderborn", code: "PAD" },
      { name: "Saarbrücken", code: "SCN" },
    ],
  },
  {
    label: "Deutschland Nord",
    airports: [
      { name: "Bremen", code: "BRE" }, { name: "Hamburg", code: "HAM" },
      { name: "Hannover", code: "HAJ" }, { name: "Rostock", code: "RLG" },
      { name: "Lübeck", code: "LBC" },
    ],
  },
  {
    label: "Deutschland Süd",
    airports: [
      { name: "Friedrichshafen", code: "FDH" }, { name: "Karlsruhe", code: "FKB" },
      { name: "Memmingen", code: "FMM" }, { name: "München", code: "MUC" },
      { name: "Nürnberg", code: "NUE" }, { name: "Stuttgart", code: "STR" },
    ],
  },
  {
    label: "Deutschland Ost",
    airports: [
      { name: "Berlin", code: "BER" }, { name: "Dresden", code: "DRS" },
      { name: "Erfurt", code: "ERF" }, { name: "Leipzig/Halle", code: "LEJ" },
    ],
  },
  {
    label: "Österreich",
    airports: [
      { name: "Graz", code: "GRZ" }, { name: "Innsbruck", code: "INN" },
      { name: "Klagenfurt", code: "KLU" }, { name: "Linz", code: "LNZ" },
      { name: "Salzburg", code: "SZG" }, { name: "Wien", code: "VIE" },
    ],
  },
  {
    label: "Schweiz",
    airports: [
      { name: "Basel", code: "BSL" }, { name: "Bern", code: "BRN" },
      { name: "Genf", code: "GVA" }, { name: "Zürich", code: "ZRH" },
    ],
  },
  {
    label: "Benelux",
    airports: [
      { name: "Amsterdam", code: "AMS" }, { name: "Brüssel", code: "BRU" },
      { name: "Eindhoven", code: "EIN" }, { name: "Luxemburg", code: "LUX" },
    ],
  },
];

// duration wird als "min-max" String gespeichert (z.B. "7-7" = exakt, "5-8" = Bereich)
const DURATION_WEEKS = [
  { label: "1 Woche",   value: "6-8" },
  { label: "2 Wochen",  value: "13-15" },
  { label: "3 Wochen",  value: "19-22" },
  { label: "4 Wochen",  value: "26-29" },
];
const DURATION_RANGES = [
  { label: "1–4 Nächte",   value: "1-4" },
  { label: "5–8 Nächte",   value: "5-8" },
  { label: "9–12 Nächte",  value: "9-12" },
  { label: "13–15 Nächte", value: "13-15" },
];
const DURATION_EXACT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];


const CRUISE_AREAS = [
  "Alle Gebiete", "Mittelmeer", "Karibik", "Nordsee", "Ostsee",
  "Atlantik", "Fjorde", "Orient", "Transatlantik", "Südostasien",
];

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return day > start && day < end;
}

// ─── useClickOutside ────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, handler]);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Counter({ label, value, min = 0, max, onChange }: {
  label: string; value: number; min?: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-white/85 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border-2 border-white/25 text-white/60 flex items-center justify-center text-lg font-bold hover:border-[#1db682] hover:text-[#1db682] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          −
        </button>
        <span className="w-6 text-center text-lg font-semibold text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border-2 border-white/25 text-white/60 flex items-center justify-center text-lg font-bold hover:border-[#1db682] hover:text-[#1db682] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

function CalendarMonth({ year, month, departure, returnDate, onSelect }: {
  year: number; month: number; departure: Date | null; returnDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex-1 min-w-65">
      <div className="text-center font-semibold text-white mb-2">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-white/40 mb-1">
        {DAY_NAMES.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isDep = isSameDay(date, departure);
          const isRet = isSameDay(date, returnDate);
          const inRange = isInRange(date, departure, returnDate);

          let cls = "py-1.5 rounded-lg cursor-pointer transition-colors ";
          if (isPast) {
            cls += "text-white/20 cursor-not-allowed";
          } else if (isDep || isRet) {
            cls += "bg-[#1db682] text-white font-bold";
          } else if (inRange) {
            cls += "bg-[#1db682]/20 text-white";
          } else {
            cls += "hover:bg-white/15 text-white/80";
          }

          return (
            <div
              key={day}
              className={cls}
              onClick={() => !isPast && onSelect(date)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overlay (außerhalb der Hauptkomponente – verhindert Remount bei Re-render) ──

function Overlay({ children, wide = false, onClose }: { children: React.ReactNode; wide?: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Mobile: Backdrop + Bottom Sheet */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
        <div className="fixed inset-x-0 bottom-0 z-50 bg-[#0d1f35] border-t border-white/15 rounded-t-2xl shadow-2xl p-5 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
          </div>
          {children}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-3 bg-[#1db682] hover:bg-[#18a070] text-white font-semibold rounded-xl transition-colors"
          >
            Übernehmen
          </button>
        </div>
      </div>
      {/* Desktop: Dropdown */}
      <div className={`hidden md:block absolute top-full left-0 z-50 bg-[#0d1f35] rounded-2xl shadow-2xl border border-white/15 mt-1 p-5 max-h-[75vh] overflow-y-auto ${wide ? "w-175 max-w-[95vw]" : "w-100 max-w-[95vw]"}`}>
        {children}
      </div>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomeSuchbox() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>("urlaub");

  // Overlay state
  const [openOverlay, setOpenOverlay] = useState<OverlayKey>(null);
  const closeOverlay = useCallback(() => setOpenOverlay(null), []);
  useClickOutside(containerRef, closeOverlay);

  // Destination (live search from IBE data)
  const [destination, setDestination] = useState("");
  const [destRegionCode, setDestRegionCode] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [destCityCode, setDestCityCode] = useState("");
  const [destGiataId, setDestGiataId] = useState("");
  const [destResults, setDestResults] = useState<{ name: string; regionCode: string; cityCode?: string; giataId?: string; parent: string; type?: string; stars?: number | null; rating?: number | null }[]>([]);
  const [destLoading, setDestLoading] = useState(false);

  // Airports (multi-select)
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);

  // Single airport for Flug
  const [flugVon, setFlugVon] = useState("");
  const [flugVonSearch, setFlugVonSearch] = useState("");
  const [flugVonResults, setFlugVonResults] = useState<{ iata: string; name: string; city: string; country: string }[]>([]);
  const [flugVonLoading, setFlugVonLoading] = useState(false);
  const [flugNach, setFlugNach] = useState("");
  const [flugNachSearch, setFlugNachSearch] = useState("");
  const [flugNachConfirmed, setFlugNachConfirmed] = useState(false);
  const [flugNachResults, setFlugNachResults] = useState<{ iata: string; name: string; city: string; country: string }[]>([]);
  const [flugNachLoading, setFlugNachLoading] = useState(false);
  const [flugRoundtrip, setFlugRoundtrip] = useState(true);

  // Date
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState("6-8"); // "min-max" Format
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Travelers
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<number[]>([]);

  // Cruise
  const [cruiseArea, setCruiseArea] = useState("Alle Gebiete");
  const [cruiseLine, setCruiseLine] = useState("Alle Reedereien");

  // Mietwagen
  const [mietAbhol, setMietAbhol] = useState("");
  const [mietRueck, setMietRueck] = useState("");
  const [mietSameLocation, setMietSameLocation] = useState(true);

  // Debounced destination search (IBE regions)
  useEffect(() => {
    if (destSearch.length < 2) { setDestResults([]); return; }
    setDestLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/destinations?q=${encodeURIComponent(destSearch)}`)
        .then((r) => r.json())
        .then((data) => { setDestResults(data); setDestLoading(false); })
        .catch(() => setDestLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [destSearch]);

  // Debounced airport search – Von
  useEffect(() => {
    if (flugVonSearch.length < 2) { setFlugVonResults([]); return; }
    setFlugVonLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/airports?q=${encodeURIComponent(flugVonSearch)}`)
        .then((r) => r.json())
        .then((data) => { setFlugVonResults(data); setFlugVonLoading(false); })
        .catch(() => setFlugVonLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [flugVonSearch]);

  // Debounced airport search – Nach
  useEffect(() => {
    if (flugNachSearch.length < 2) { setFlugNachResults([]); return; }
    setFlugNachLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/airports?q=${encodeURIComponent(flugNachSearch)}`)
        .then((r) => r.json())
        .then((data) => { setFlugNachResults(data); setFlugNachLoading(false); })
        .catch(() => setFlugNachLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [flugNachSearch]);

  // ── Derived ──

  const airportDisplay = selectedAirports.length === 0
    ? "Beliebig"
    : selectedAirports.length <= 3
      ? selectedAirports.join(", ")
      : `${selectedAirports.slice(0, 3).join(", ")} +${selectedAirports.length - 3}`;

  const durationLabel = (() => {
    if (duration === "1-28" || duration === "1-21") return "Beliebig";
    const week = DURATION_WEEKS.find((d) => d.value === duration);
    if (week) return week.label;
    const range = DURATION_RANGES.find((d) => d.value === duration);
    if (range) return range.label;
    const [min, max] = duration.split("-");
    if (min === max) return `${min} Nächte`;
    return `${min}–${max} Nächte`;
  })();
  const dateDisplay = departure && returnDate
    ? `${formatDate(departure)} – ${formatDate(returnDate)}, ${durationLabel}`
    : "Wann & wie lange?";

  const travelerDisplay = children > 0
    ? `${adults} Erwachsene, ${children} ${children === 1 ? "Kind" : "Kinder"}`
    : `${adults} Erwachsene`;

  // ── Handlers ──

  function handleDateSelect(d: Date) {
    if (!departure || (departure && returnDate)) {
      setDeparture(d);
      setReturnDate(null);
    } else {
      if (d <= departure) {
        setDeparture(d);
        setReturnDate(null);
      } else {
        setReturnDate(d);
      }
    }
  }

  function toggleAirport(code: string) {
    setSelectedAirports((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function handleChildrenChange(count: number) {
    setChildren(count);
    setChildAges((prev) => {
      if (count > prev.length) return [...prev, ...Array(count - prev.length).fill(5)];
      return prev.slice(0, count);
    });
  }

  function handleChildAge(index: number, age: number) {
    setChildAges((prev) => {
      const copy = [...prev];
      copy[index] = age;
      return copy;
    });
  }

  function prevMonth() {
    setCalMonth((m) => {
      if (m.month === 0) return { year: m.year - 1, month: 11 };
      return { year: m.year, month: m.month - 1 };
    });
  }

  function nextMonth() {
    setCalMonth((m) => {
      if (m.month === 11) return { year: m.year + 1, month: 0 };
      return { year: m.year, month: m.month + 1 };
    });
  }

  // ── Submit ──

  function handleSubmit() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case "urlaub": {
        const fromDays = departure ? daysBetween(today, departure) : 1;
        const durMax = parseInt(duration.split("-")[1] || "7", 10);
        const toDays = returnDate ? daysBetween(today, returnDate) : fromDays + durMax;
        const params = new URLSearchParams();
        const regionId = destRegionCode || (destination ? DESTINATION_REGION_MAP[destination] : undefined);
        if (regionId) params.set("regionId", regionId);
        else if (destination) params.set("destination", destination);
        if (destCityCode) params.set("cityId", destCityCode);
        if (destGiataId) params.set("giataId", destGiataId);
        if (selectedAirports.length) params.set("airport", selectedAirports.join(","));
        params.set("from", String(fromDays));
        params.set("to", String(toDays));
        params.set("duration", duration);
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/guenstig-urlaub-buchen/?${params.toString()}`);
        break;
      }
      case "lastminute": {
        const params = new URLSearchParams();
        const regionId = destRegionCode || (destination ? DESTINATION_REGION_MAP[destination] : undefined);
        if (regionId) params.set("regionId", regionId);
        else if (destination) params.set("destination", destination);
        if (destCityCode) params.set("cityId", destCityCode);
        if (selectedAirports.length) params.set("airport", selectedAirports.join(","));
        params.set("duration", duration);
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/last-minute/?${params.toString()}`);
        break;
      }
      case "hotel": {
        const params = new URLSearchParams();
        if (destination) params.set("destination", destination);
        if (departure) params.set("checkin", formatDate(departure));
        if (returnDate) params.set("checkout", formatDate(returnDate));
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/hotelsuche/?${params.toString()}`);
        break;
      }
      case "flug": {
        const params = new URLSearchParams();
        if (flugVon) params.set("von", flugVon);
        if (flugNach) params.set("nach", flugNach);
        if (departure) params.set("hin", formatDate(departure));
        if (flugRoundtrip && returnDate) params.set("rueck", formatDate(returnDate));
        params.set("type", flugRoundtrip ? "roundtrip" : "oneway");
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/flugsuche/?${params.toString()}`);
        break;
      }
      case "mietwagen": {
        const params = new URLSearchParams();
        if (mietAbhol) params.set("abholort", mietAbhol);
        params.set("rueckgabeort", mietSameLocation ? mietAbhol : mietRueck);
        if (departure) params.set("abholdatum", formatDate(departure));
        if (returnDate) params.set("rueckgabedatum", formatDate(returnDate));
        router.push(`/mietwagen-reservieren/?${params.toString()}`);
        break;
      }
      case "kreuzfahrt": {
        const params = new URLSearchParams();
        if (cruiseArea && cruiseArea !== "Alle Gebiete") params.set("gebiet", cruiseArea);
        if (departure) params.set("ab", formatDate(departure));
        if (returnDate) params.set("bis", formatDate(returnDate));
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/kreuzfahrten/?${params.toString()}`);
        break;
      }
    }
  }

  // ── Field click box helper ──

  function FieldBox({ label, value, onClick, className = "", active = false }: {
    label: string; value: string; onClick: () => void; className?: string; active?: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`text-left px-4 py-3 flex flex-col justify-center min-h-14 transition-colors hover:bg-white/10 ${active ? "bg-white/15" : ""} ${className}`}
      >
        <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none mb-1">{label}</span>
        <span className="text-sm text-white font-semibold truncate">{value}</span>
      </button>
    );
  }

  // ── Filtered destinations (removed – now using live search) ──

  // ── Render overlays ──

  function renderDestinationOverlay() {
    if (openOverlay !== "destination") return null;

    const selectDest = (name: string, regionCode: string, cityCode?: string, giataId?: string) => {
      setDestination(name);
      setDestRegionCode(regionCode);
      setDestCityCode(cityCode ?? "");
      setDestGiataId(giataId ?? "");
      setDestSearch("");
      closeOverlay();
    };

    return (
      <Overlay wide onClose={closeOverlay}>
        {/* Suchfeld */}
        <div className="mb-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Reiseziel eingeben – z. B. Mallorca, Kreta, Hurghada …"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1db682] focus:ring-1 focus:ring-[#1db682]/40"
              autoFocus
            />
            {destSearch && (
              <button type="button" onClick={() => setDestSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>
        </div>

        {/* Livesuche-Ergebnisse */}
        {destSearch.length >= 2 && (
          <div className="mb-4">
            {destLoading && <div className="text-white/40 text-sm py-3 text-center">Suche…</div>}
            {!destLoading && destResults.length > 0 && (() => {
              const regions = destResults.filter((d) => d.type === "region" || d.type === "city" || d.type === "country");
              const hotels = destResults.filter((d) => d.type === "hotel");
              return (
                <div className="max-h-72 overflow-y-auto">
                  {/* Regionen / Orte / Länder */}
                  {regions.length > 0 && (
                    <>
                      <div className="text-[10px] font-bold text-white/35 uppercase tracking-wider px-3 pt-1 pb-1.5">Regionen</div>
                      {regions.map((d, i) => {
                        const isCity = d.type === "city";
                        const label = isCity ? `${d.name} (${d.parent})` : d.name;
                        return (
                          <button
                            key={`r-${d.regionCode}-${d.name}-${i}`}
                            type="button"
                            onClick={() => selectDest(label, d.regionCode, d.cityCode)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${destination === label ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isCity && <MapPin className="w-3 h-3 text-white/30 shrink-0" />}
                              <span className="font-medium truncate">{d.name}</span>
                              {d.parent && d.parent !== d.name && (
                                <span className="text-white/40 text-xs shrink-0">{isCity ? `· ${d.parent}` : d.parent}</span>
                              )}
                              {d.type === "country" && (
                                <span className="text-[10px] text-white/30 border border-white/15 px-1.5 py-0.5 rounded-full shrink-0">Land</span>
                              )}
                            </div>
                            {destination === label && <Check className="w-4 h-4 text-[#1db682] shrink-0" />}
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Hotels */}
                  {hotels.length > 0 && (
                    <>
                      <div className="text-[10px] font-bold text-white/35 uppercase tracking-wider px-3 pt-3 pb-1.5">Hotels</div>
                      {hotels.map((d, i) => (
                        <button
                          key={`h-${d.giataId}-${i}`}
                          type="button"
                          onClick={() => selectDest(d.name, d.regionCode, undefined, d.giataId)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${destination === d.name ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-white/30 text-xs">🏨</span>
                              <span className="font-medium truncate">{d.name}</span>
                              {d.stars && <span className="text-yellow-400 text-[10px] shrink-0">{"★".repeat(d.stars)}</span>}
                            </div>
                            {d.parent && <div className="text-white/35 text-xs mt-0.5 truncate">{d.parent}</div>}
                          </div>
                          {d.rating && <span className="text-[10px] text-white/40 border border-white/15 px-1.5 py-0.5 rounded-full shrink-0">{d.rating}%</span>}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              );
            })()}
            {!destLoading && destResults.length === 0 && destSearch.length >= 2 && (
              <div className="text-white/40 text-sm text-center py-4">Kein Reiseziel gefunden.</div>
            )}
          </div>
        )}

        {/* Beliebte Ziele (wenn kein Suchtext) */}
        {destSearch.length < 2 && (
          <>
            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Beliebte Reiseziele</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {BELIEBTE_REISEZIELE.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { setDestination(z); setDestRegionCode(DESTINATION_REGION_MAP[z] ?? ""); setDestSearch(""); closeOverlay(); }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${destination === z ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/25 text-white/80 hover:border-[#1db682] hover:text-[#1db682]"}`}
                >
                  {z}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Alle Regionen A–Z</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-52 overflow-y-auto">
              {ALLE_REISEZIELE.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { setDestination(z); setDestRegionCode(DESTINATION_REGION_MAP[z] ?? ""); setDestSearch(""); closeOverlay(); }}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${destination === z ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                >
                  {z}
                </button>
              ))}
            </div>
          </>
        )}
      </Overlay>
    );
  }

  function renderAirportOverlay() {
    if (openOverlay !== "airport") return null;
    return (
      <Overlay wide onClose={closeOverlay}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Abflughafen wählen</div>
          <button
            type="button"
            onClick={() => setSelectedAirports([])}
            className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${selectedAirports.length === 0 ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/25 text-white/60 hover:border-[#1db682]"}`}
          >
            Beliebig
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 max-h-80 overflow-y-auto pr-1">
          {AIRPORT_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-bold text-[#6991d8] uppercase tracking-wider mb-1">{group.label}</div>
              {group.airports.map((ap) => {
                const checked = selectedAirports.includes(ap.code);
                return (
                  <label
                    key={ap.code}
                    className="flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <span className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-[#1db682] border-[#1db682]" : "border-white/30"}`}>
                      {checked && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleAirport(ap.code)} />
                    <span className="text-xs text-white/85">{ap.name}</span>
                    <span className="text-[10px] font-mono text-white/35">{ap.code}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </Overlay>
    );
  }

  function renderDateOverlay() {
    if (openOverlay !== "date") return null;

    const isLastMinute = activeTab === "lastminute";
    const m2 = calMonth.month === 11 ? { year: calMonth.year + 1, month: 0 } : { year: calMonth.year, month: calMonth.month + 1 };

    return (
      <Overlay wide onClose={closeOverlay}>
        {isLastMinute ? (
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-semibold border border-amber-400/30">
            <span>⚡</span> Nächste 14 Tage
          </div>
        ) : (
          <div className="flex gap-4 mb-4">
            <div className="flex-1 px-3 py-2 bg-white/10 rounded-xl border border-white/15">
              <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Früheste Anreise</div>
              <div className="text-sm text-white font-medium">{departure ? formatDate(departure) : "—"}</div>
            </div>
            <div className="flex-1 px-3 py-2 bg-white/10 rounded-xl border border-white/15">
              <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Späteste Rückreise</div>
              <div className="text-sm text-white font-medium">{returnDate ? formatDate(returnDate) : "—"}</div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="mb-3 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Dauer</span>
            <button type="button" onClick={() => setDuration("1-28")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${duration === "1-28" ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/20 text-white/60 hover:border-[#1db682]"}`}>
              Beliebig</button>
            {DURATION_WEEKS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setDuration(opt.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${duration === opt.value ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/20 text-white/60 hover:border-[#1db682]"}`}>
                {opt.label}</button>
            ))}
            {DURATION_RANGES.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setDuration(opt.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${duration === opt.value ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/20 text-white/60 hover:border-[#1db682]"}`}>
                {opt.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] text-white/30">Exakt</span>
            {DURATION_EXACT.map((n) => {
              const val = `${n}-${n}`;
              return (
                <button key={n} type="button" onClick={() => setDuration(val)}
                  className={`w-8 h-7 rounded-lg text-xs font-medium border transition-colors ${duration === val ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/15 text-white/50 hover:border-[#1db682]"}`}>
                  {n}</button>
              );
            })}
          </div>
        </div>

        {/* Calendar */}
        {!isLastMinute && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10">
                <ChevronDown className="w-5 h-5 rotate-90 text-white/60" />
              </button>
              <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/10">
                <ChevronDown className="w-5 h-5 -rotate-90 text-white/60" />
              </button>
            </div>
            <div className="flex gap-6 flex-col sm:flex-row">
              <CalendarMonth year={calMonth.year} month={calMonth.month} departure={departure} returnDate={returnDate} onSelect={handleDateSelect} />
              <CalendarMonth year={m2.year} month={m2.month} departure={departure} returnDate={returnDate} onSelect={handleDateSelect} />
            </div>
          </div>
        )}
      </Overlay>
    );
  }

  function renderTravelersOverlay() {
    if (openOverlay !== "travelers") return null;
    return (
      <Overlay onClose={closeOverlay}>
        <Counter label="Erwachsene" value={adults} min={1} max={8} onChange={setAdults} />
        <div className="border-t border-white/15" />
        <Counter label="Kinder (0–17)" value={children} min={0} max={6} onChange={handleChildrenChange} />

        {children > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Alter der Kinder</div>
            <div className="flex flex-wrap gap-2">
              {childAges.map((age, i) => (
                <select
                  key={i}
                  value={age}
                  onChange={(e) => handleChildAge(i, Number(e.target.value))}
                  className="px-3 py-1.5 border border-white/20 rounded-lg text-sm bg-white/10 text-white focus:outline-none focus:border-[#1db682]"
                >
                  {Array.from({ length: 18 }, (_, a) => (
                    <option key={a} value={a} className="bg-gray-900 text-white">{a} {a === 1 ? "Jahr" : "Jahre"}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        )}
      </Overlay>
    );
  }

  function renderCruiseAreaOverlay() {
    if (openOverlay !== "cruiseArea") return null;
    return (
      <Overlay onClose={closeOverlay}>
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Fahrtgebiet wählen</div>
        <div className="space-y-0.5">
          {CRUISE_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => { setCruiseArea(area); closeOverlay(); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cruiseArea === area ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
            >
              {area}
            </button>
          ))}
        </div>
      </Overlay>
    );
  }

  // ─── Tab content fields ────────────────────────────────────────────────────

  function renderTabContent() {
    switch (activeTab) {
      case "urlaub":
      case "lastminute":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-2 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label="Reiseziel"
                value={destination || "Wohin soll es gehen?"}
                onClick={() => setOpenOverlay(openOverlay === "destination" ? null : "destination")}
                active={openOverlay === "destination"}
              />
              {renderDestinationOverlay()}
            </div>

            <div className="relative flex-[1.2] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label="Abflughafen"
                value={airportDisplay}
                onClick={() => setOpenOverlay(openOverlay === "airport" ? null : "airport")}
                active={openOverlay === "airport"}
              />
              {renderAirportOverlay()}
            </div>

            <div className="relative flex-[1.5] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label="Reisezeitraum"
                value={activeTab === "lastminute" ? `Nächste 14 Tage, ${durationLabel}` : dateDisplay}
                onClick={() => setOpenOverlay(openOverlay === "date" ? null : "date")}
                active={openOverlay === "date"}
              />
              {renderDateOverlay()}
            </div>

            <div className="relative flex-1 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label="Reisende"
                value={travelerDisplay}
                onClick={() => setOpenOverlay(openOverlay === "travelers" ? null : "travelers")}
                active={openOverlay === "travelers"}
              />
              {renderTravelersOverlay()}
            </div>

            <div className="hidden md:flex items-center px-4 shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a070] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                Suchen
              </button>
            </div>
          </div>
        );

      case "hotel":
        return (
          <>
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-2 border-b md:border-b-0 md:border-r border-white/15">
                <FieldBox
                  label="Reiseziel"
                  value={destination || "Wohin soll es gehen?"}
                  onClick={() => setOpenOverlay(openOverlay === "destination" ? null : "destination")}
                  active={openOverlay === "destination"}
                />
                {renderDestinationOverlay()}
              </div>

              <div className="relative flex-3/2 border-b md:border-b-0 md:border-r border-white/15">
                <FieldBox
                  label="Reisezeitraum"
                  value={dateDisplay}
                  onClick={() => setOpenOverlay(openOverlay === "date" ? null : "date")}
                  active={openOverlay === "date"}
                />
                {renderDateOverlay()}
              </div>

              <div className="relative flex-3/2 border-b md:border-b-0 md:border-r border-white/15">
                <FieldBox
                  label="Reisende"
                  value={travelerDisplay}
                  onClick={() => setOpenOverlay(openOverlay === "travelers" ? null : "travelers")}
                  active={openOverlay === "travelers"}
                />
                {renderTravelersOverlay()}
              </div>

              <div className="hidden md:flex items-center px-4 shrink-0">
                <button type="button" onClick={handleSubmit} className="flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a070] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                  <Search className="w-3.5 h-3.5" />
                  Suchen
                </button>
              </div>
            </div>
          </>
        );

      case "flug":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-[1.2] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label={flugVon ? "✓ Abflug" : "Von"}
                value={flugVon || "Abflughafen"}
                onClick={() => setOpenOverlay(openOverlay === "flugVon" ? null : "flugVon")}
                active={openOverlay === "flugVon"}
              />
              {openOverlay === "flugVon" && (
                <Overlay wide onClose={closeOverlay}>
                  {/* Top 5 Schnellwahl */}
                  {!flugVonSearch && (
                    <>
                      <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Beliebteste Abflughäfen</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { iata: "FRA", city: "Frankfurt" },
                          { iata: "MUC", city: "München" },
                          { iata: "BER", city: "Berlin" },
                          { iata: "DUS", city: "Düsseldorf" },
                          { iata: "HAM", city: "Hamburg" },
                        ].map((ap) => {
                          const val = `${ap.city} (${ap.iata})`;
                          const selected = flugVon === val;
                          return (
                            <button
                              key={ap.iata}
                              type="button"
                              onClick={() => { setFlugVon(val); closeOverlay(); }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${selected ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/25 text-white/80 hover:border-[#1db682] hover:text-[#1db682]"}`}
                            >
                              {selected && <Check className="w-3.5 h-3.5" />}
                              <span className="font-mono text-xs text-white/50">{ap.iata}</span>
                              {ap.city}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Live-Suche */}
                  <div className="relative mb-3">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Anderen Abflughafen suchen…"
                      value={flugVonSearch}
                      onChange={(e) => setFlugVonSearch(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1db682]"
                      autoFocus={!!flugVon}
                    />
                    {flugVonSearch && (
                      <button type="button" onClick={() => { setFlugVonSearch(""); setFlugVonResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    )}
                  </div>

                  {flugVonLoading && <p className="text-white/40 text-xs text-center py-3">Suche…</p>}
                  {!flugVonLoading && flugVonSearch.length >= 2 && flugVonResults.length === 0 && (
                    <p className="text-white/40 text-xs text-center py-3">Kein Flughafen gefunden.</p>
                  )}
                  {!flugVonLoading && flugVonResults.length > 0 && (
                    <div className="space-y-0.5">
                      {flugVonResults.map((ap) => {
                        const val = `${ap.city} (${ap.iata})`;
                        const selected = flugVon === val;
                        return (
                          <button
                            key={ap.iata}
                            type="button"
                            onClick={() => { setFlugVon(val); setFlugVonSearch(""); setFlugVonResults([]); closeOverlay(); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${selected ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                          >
                            <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/60 shrink-0 w-10 text-center">{ap.iata}</span>
                            <span className="flex-1 text-left">
                              <span className="font-medium">{ap.city}</span>
                              <span className="text-white/40 text-xs ml-1.5">{ap.name}</span>
                            </span>
                            <span className="text-xs text-white/30 shrink-0">{ap.country}</span>
                            {selected && <Check className="w-4 h-4 text-[#1db682] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Overlay>
              )}
            </div>
            <div className="relative flex-[1.2] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label={flugNachConfirmed ? "✓ Ziel" : "Nach"}
                value={flugNach || "Zielflughafen"}
                onClick={() => setOpenOverlay(openOverlay === "flugNach" ? null : "flugNach")}
                active={openOverlay === "flugNach"}
              />
              {openOverlay === "flugNach" && (
                <Overlay wide onClose={closeOverlay}>
                  <div className="relative mb-3">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Stadt, Flughafen oder IATA-Code..."
                      value={flugNachSearch}
                      onChange={(e) => { setFlugNachSearch(e.target.value); setFlugNachConfirmed(false); }}
                      className="w-full pl-10 pr-8 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1db682]"
                      autoFocus
                    />
                    {flugNachSearch && (
                      <button type="button" onClick={() => { setFlugNachSearch(""); setFlugNach(""); setFlugNachConfirmed(false); setFlugNachResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    )}
                  </div>

                  {flugNachSearch.length < 2 && (
                    <p className="text-white/40 text-xs text-center py-4">Mindestens 2 Zeichen eingeben…</p>
                  )}

                  {flugNachLoading && (
                    <p className="text-white/40 text-xs text-center py-4">Suche…</p>
                  )}

                  {!flugNachLoading && flugNachSearch.length >= 2 && flugNachResults.length === 0 && (
                    <p className="text-white/40 text-xs text-center py-4">Kein Flughafen gefunden.</p>
                  )}

                  {!flugNachLoading && flugNachResults.length > 0 && (
                    <div className="space-y-0.5">
                      {flugNachResults.map((ap) => {
                        const val = `${ap.city} (${ap.iata})`;
                        const selected = flugNach === val;
                        return (
                          <button
                            key={ap.iata}
                            type="button"
                            onClick={() => { setFlugNach(val); setFlugNachSearch(""); setFlugNachConfirmed(true); setFlugNachResults([]); closeOverlay(); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${selected ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                          >
                            <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/60 shrink-0 w-10 text-center">{ap.iata}</span>
                            <span className="flex-1 text-left">
                              <span className="font-medium">{ap.city}</span>
                              <span className="text-white/40 text-xs ml-1.5">{ap.name}</span>
                            </span>
                            <span className="text-xs text-white/30 shrink-0">{ap.country}</span>
                            {selected && <Check className="w-4 h-4 text-[#1db682] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Overlay>
              )}
            </div>
            <div className="relative flex-[1.5] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label={flugRoundtrip ? "Hin- & Rückflug" : "Hinflug"}
                value={departure ? (flugRoundtrip && returnDate ? `${formatDate(departure)} – ${formatDate(returnDate)}` : formatDate(departure)) : "Datum wählen"}
                onClick={() => setOpenOverlay(openOverlay === "date" ? null : "date")}
                active={openOverlay === "date"}
              />
              {renderDateOverlay()}
            </div>
            {/* Hin&Rück toggle inline */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/15 flex items-center px-4 gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="flugType" checked={flugRoundtrip} onChange={() => setFlugRoundtrip(true)} className="accent-[#1db682]" />
                <span className="text-xs text-white/80 font-medium whitespace-nowrap">Hin & Rück</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="flugType" checked={!flugRoundtrip} onChange={() => setFlugRoundtrip(false)} className="accent-[#1db682]" />
                <span className="text-xs text-white/80 font-medium whitespace-nowrap">Nur Hin</span>
              </label>
            </div>
            <div className="relative flex-1 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Reisende" value={travelerDisplay}
                onClick={() => setOpenOverlay(openOverlay === "travelers" ? null : "travelers")}
                active={openOverlay === "travelers"} />
              {renderTravelersOverlay()}
            </div>
            <div className="hidden md:flex items-center px-4 shrink-0">
              <button type="button" onClick={handleSubmit} className="flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a070] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                <Search className="w-3.5 h-3.5" /> Suchen
              </button>
            </div>
          </div>
        );

      case "mietwagen":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-2 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Abholort" value={mietAbhol || "Ort oder Flughafen"}
                onClick={() => setOpenOverlay(openOverlay === "mietAbhol" ? null : "mietAbhol")}
                active={openOverlay === "mietAbhol"} />
              {openOverlay === "mietAbhol" && (
                <Overlay onClose={closeOverlay}>
                  <input type="text" placeholder="Abholort eingeben..." value={mietAbhol}
                    onChange={(e) => { setMietAbhol(e.target.value); if (mietSameLocation) setMietRueck(e.target.value); }}
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1db682]" autoFocus />
                </Overlay>
              )}
            </div>
            <div className="relative flex-2 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Zeitraum"
                value={departure && returnDate ? `${formatDate(departure)} – ${formatDate(returnDate)}` : "Datum wählen"}
                onClick={() => setOpenOverlay(openOverlay === "date" ? null : "date")}
                active={openOverlay === "date"} />
              {renderDateOverlay()}
            </div>
            {/* Gleicher Ort Toggle inline */}
            <div className="flex-[1.2] border-b md:border-b-0 md:border-r border-white/15 flex items-center px-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={mietSameLocation}
                  onChange={(e) => { setMietSameLocation(e.target.checked); if (e.target.checked) setMietRueck(mietAbhol); }}
                  className="accent-[#1db682] w-4 h-4" />
                <span className="text-xs text-white/80 font-medium">Gleicher Rückgabeort</span>
              </label>
            </div>
            <div className="hidden md:flex items-center px-4 shrink-0">
              <button type="button" onClick={handleSubmit} className="flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a070] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                <Search className="w-3.5 h-3.5" /> Suchen
              </button>
            </div>
          </div>
        );

      case "kreuzfahrt":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-[1.2] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Fahrtgebiet" value={cruiseArea}
                onClick={() => setOpenOverlay(openOverlay === "cruiseArea" ? null : "cruiseArea")}
                active={openOverlay === "cruiseArea"} />
              {renderCruiseAreaOverlay()}
            </div>
            <div className="relative flex-[1.5] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Reederei" value={cruiseLine}
                onClick={() => setOpenOverlay(openOverlay === "cruiseLine" ? null : "cruiseLine")}
                active={openOverlay === "cruiseLine"} />
              {openOverlay === "cruiseLine" && (
                <Overlay onClose={closeOverlay}>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Reederei wählen</div>
                  <div className="space-y-0.5 max-h-64 overflow-y-auto">
                    {["Alle Reedereien","AIDA Cruises","Costa Cruises","MSC Cruises","Norwegian Cruise Line","Princess Cruises","Royal Caribbean","TUI Cruises","Viking Ocean Cruises","Hapag-Lloyd Cruises"].map((line) => (
                      <button key={line} type="button"
                        onClick={() => { setCruiseLine(line); closeOverlay(); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cruiseLine === line ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}>
                        {line}
                      </button>
                    ))}
                  </div>
                </Overlay>
              )}
            </div>
            <div className="relative flex-[1.5] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Reisezeitraum" value={dateDisplay}
                onClick={() => setOpenOverlay(openOverlay === "date" ? null : "date")}
                active={openOverlay === "date"} />
              {renderDateOverlay()}
            </div>
            <div className="relative flex-1 border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox label="Reisende" value={travelerDisplay}
                onClick={() => setOpenOverlay(openOverlay === "travelers" ? null : "travelers")}
                active={openOverlay === "travelers"} />
              {renderTravelersOverlay()}
            </div>
            <div className="hidden md:flex items-center px-4 shrink-0">
              <button type="button" onClick={handleSubmit} className="flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a070] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                <Search className="w-3.5 h-3.5" /> Suchen
              </button>
            </div>
          </div>
        );
    }
  }

  // ─── Main render ───────────────────────────────────────────────────────────

  const submitLabels: Record<TabKey, string> = {
    urlaub: "Angebote finden",
    lastminute: "Angebote finden",
    hotel: "Hotels finden",
    flug: "Flüge finden",
    mietwagen: "Mietwagen finden",
    kreuzfahrt: "Kreuzfahrten finden",
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Card */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl overflow-visible border border-white/15">
        {/* Tab row */}
        <div className="flex overflow-x-auto border-b border-white/15 px-2 gap-0 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); closeOverlay(); }}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-white font-bold"
                    : "text-white/55 font-medium hover:text-white/80"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1db682] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="relative">
          {renderTabContent()}
        </div>

        {/* Mobile submit */}
        <div className="md:hidden p-3 border-t border-white/15">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-[#1db682] hover:bg-[#18a070] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <Search className="w-5 h-5" />
            {submitLabels[activeTab]}
          </button>
        </div>
      </div>
    </div>
  );
}
