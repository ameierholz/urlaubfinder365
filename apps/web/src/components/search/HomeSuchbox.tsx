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

const DURATION_OPTIONS = [
  { value: 3, label: "3 Nächte" }, { value: 4, label: "4 Nächte" },
  { value: 5, label: "5 Nächte" }, { value: 6, label: "6 Nächte" },
  { value: 7, label: "7 Nächte" }, { value: 8, label: "8 Nächte" },
  { value: 9, label: "9 Nächte" }, { value: 10, label: "10 Nächte" },
  { value: 11, label: "11 Nächte" }, { value: 12, label: "12 Nächte" },
  { value: 13, label: "13 Nächte" }, { value: 14, label: "14 Nächte" },
  { value: 0, label: "Beliebig" },
];

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

  // Destination
  const [destination, setDestination] = useState("");
  const [destSearch, setDestSearch] = useState("");

  // Airports (multi-select)
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);

  // Single airport for Flug
  const [flugVon, setFlugVon] = useState("");
  const [flugNach, setFlugNach] = useState("");
  const [flugRoundtrip, setFlugRoundtrip] = useState(true);

  // Date
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(7);
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

  // ── Derived ──

  const airportDisplay = selectedAirports.length === 0
    ? "Beliebig"
    : selectedAirports.length <= 3
      ? selectedAirports.join(", ")
      : `${selectedAirports.slice(0, 3).join(", ")} +${selectedAirports.length - 3}`;

  const dateDisplay = departure && returnDate
    ? `${formatDate(departure)} – ${formatDate(returnDate)}, ${duration > 0 ? `${duration} Nächte` : "Beliebig"}`
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
        const toDays = returnDate ? daysBetween(today, returnDate) : fromDays + duration;
        const params = new URLSearchParams();
        const regionId = destination ? DESTINATION_REGION_MAP[destination] : undefined;
        if (regionId) params.set("regionId", regionId);
        else if (destination) params.set("destination", destination);
        if (selectedAirports.length) params.set("airport", selectedAirports.join(","));
        params.set("from", String(fromDays));
        params.set("to", String(toDays));
        params.set("duration", `${duration}-${duration}`);
        params.set("adults", String(adults));
        if (childAges.length) params.set("children", childAges.join(","));
        router.push(`/guenstig-urlaub-buchen/?${params.toString()}`);
        break;
      }
      case "lastminute": {
        const params = new URLSearchParams();
        const regionId = destination ? DESTINATION_REGION_MAP[destination] : undefined;
        if (regionId) params.set("regionId", regionId);
        else if (destination) params.set("destination", destination);
        if (selectedAirports.length) params.set("airport", selectedAirports.join(","));
        params.set("duration", `${duration}-${duration}`);
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

  // ── Overlay wrapper ──

  function Overlay({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
      <div className={`absolute top-full left-0 z-50 bg-[#0d1f35] rounded-2xl shadow-2xl border border-white/15 mt-1 p-5 max-h-[75vh] overflow-y-auto ${wide ? "w-175 max-w-[95vw]" : "w-100 max-w-[95vw]"}`}>
        {children}
      </div>
    );
  }

  // ── Filtered destinations ──

  const filteredBeliebte = destSearch
    ? BELIEBTE_REISEZIELE.filter((d) => d.toLowerCase().includes(destSearch.toLowerCase()))
    : BELIEBTE_REISEZIELE;

  const filteredAlle = destSearch
    ? ALLE_REISEZIELE.filter((d) => d.toLowerCase().includes(destSearch.toLowerCase()))
    : ALLE_REISEZIELE;

  // ── Render overlays ──

  function renderDestinationOverlay() {
    if (openOverlay !== "destination") return null;
    return (
      <Overlay wide>
        <div className="mb-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Reiseziel eingeben..."
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

        {filteredBeliebte.length > 0 && (
          <>
            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Beliebte Reiseziele</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredBeliebte.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { setDestination(z); setDestSearch(""); closeOverlay(); }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${destination === z ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/25 text-white/80 hover:border-[#1db682] hover:text-[#1db682]"}`}
                >
                  {z}
                </button>
              ))}
            </div>
          </>
        )}

        {filteredAlle.length > 0 && (
          <>
            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Alle Reiseziele A–Z</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-60 overflow-y-auto">
              {filteredAlle.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { setDestination(z); setDestSearch(""); closeOverlay(); }}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${destination === z ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}
                >
                  {z}
                </button>
              ))}
            </div>
          </>
        )}

        {filteredBeliebte.length === 0 && filteredAlle.length === 0 && (
          <div className="text-white/40 text-sm text-center py-6">Kein Reiseziel gefunden.</div>
        )}
      </Overlay>
    );
  }

  function renderAirportOverlay() {
    if (openOverlay !== "airport") return null;
    return (
      <Overlay wide>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Abflughafen wählen</div>
          <button
            type="button"
            onClick={() => setSelectedAirports([])}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${selectedAirports.length === 0 ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/25 text-white/60 hover:border-[#1db682]"}`}
          >
            Beliebig
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-h-100 overflow-y-auto pr-1">
          {AIRPORT_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-xs font-bold text-[#6991d8] uppercase tracking-wider mb-1.5">{group.label}</div>
              <div className="space-y-0.5">
                {group.airports.map((ap) => {
                  const checked = selectedAirports.includes(ap.code);
                  return (
                    <label
                      key={ap.code}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <span className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-[#1db682] border-[#1db682]" : "border-white/30"}`}>
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleAirport(ap.code)} />
                      <span className="text-sm text-white/85 font-medium">{ap.name}</span>
                      <span className="text-xs font-mono text-white/40 ml-0.5">{ap.code}</span>
                    </label>
                  );
                })}
              </div>
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
      <Overlay wide>
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
        <div className="mb-4">
          <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1.5">Reisedauer</div>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDuration(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${duration === opt.value ? "bg-[#1db682] text-white border-[#1db682]" : "border-white/20 text-white/70 hover:border-[#1db682]"}`}
              >
                {opt.label}
              </button>
            ))}
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
      <Overlay>
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
      <Overlay>
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
                value={activeTab === "lastminute" ? `Nächste 14 Tage, ${duration > 0 ? `${duration} Nächte` : "Beliebig"}` : dateDisplay}
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
                label="Von"
                value={flugVon || "Abflughafen"}
                onClick={() => setOpenOverlay(openOverlay === "flugVon" ? null : "flugVon")}
                active={openOverlay === "flugVon"}
              />
              {openOverlay === "flugVon" && (
                <Overlay>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Abflughafen wählen</div>
                  <div className="max-h-75 overflow-y-auto space-y-0.5">
                    {AIRPORT_GROUPS.flatMap((g) => g.airports).map((ap) => (
                      <button key={ap.code} type="button"
                        onClick={() => { setFlugVon(`${ap.name} (${ap.code})`); closeOverlay(); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${flugVon.includes(ap.code) ? "bg-[#1db682]/20 text-[#1db682] font-semibold" : "text-white/80 hover:bg-white/10"}`}>
                        <span className="font-medium">{ap.name}</span> <span className="text-white/40 ml-0.5">{ap.code}</span>
                      </button>
                    ))}
                  </div>
                </Overlay>
              )}
            </div>
            <div className="relative flex-[1.2] border-b md:border-b-0 md:border-r border-white/15">
              <FieldBox
                label="Nach"
                value={flugNach || "Zielflughafen"}
                onClick={() => setOpenOverlay(openOverlay === "flugNach" ? null : "flugNach")}
                active={openOverlay === "flugNach"}
              />
              {openOverlay === "flugNach" && (
                <Overlay>
                  <input type="text" placeholder="Zielflughafen eingeben..." value={flugNach}
                    onChange={(e) => setFlugNach(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1db682]" autoFocus />
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
                <Overlay>
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
                <Overlay>
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
