"use client";

import { useState, useMemo, useRef } from "react";
import { CATALOG } from "@/data/catalog-regions";
import TiqetsMultiCityDiscovery from "./TiqetsMultiCityDiscovery";

// ── Types ─────────────────────────────────────────────────────────────────────
type ContinentId = "all" | "eu" | "turkey_asia" | "africa" | "americas";

interface DestEntry {
  cityId: string;
  name: string;
  slug: string;
}

interface ContinentCfg {
  id: ContinentId;
  label: string;
  emoji: string;
  gradient: string;
  ring: string;
  description: string;
  teaser: string[];
  slugs: string[];
}

// ── Continent config ───────────────────────────────────────────────────────────
const CONTINENTS: ContinentCfg[] = [
  {
    id: "eu",
    label: "Europa",
    emoji: "🇪🇺",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    ring: "ring-blue-300",
    description: "Rom, Barcelona, Paris, Wien, Amsterdam & mehr",
    teaser: ["Rom", "Barcelona", "Paris", "Wien"],
    slugs: [
      "rom", "barcelona", "paris", "london", "wien",
      "amsterdam", "florenz", "athen", "venedig", "santorin",
      "mykonos", "neapel", "sevilla", "berlin", "madrid",
      "dubrovnik", "kreta", "korfu", "ibiza", "porto",
      "lissabon",
    ],
  },
  {
    id: "turkey_asia",
    label: "Türkei, Asien & Emirate",
    emoji: "🌏",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    ring: "ring-emerald-300",
    description: "Istanbul, Dubai, Bangkok, Bali & mehr",
    teaser: ["Istanbul", "Dubai", "Bangkok", "Bali"],
    slugs: [
      "istanbul", "dubai", "abu-dhabi",
      "bangkok", "phuket", "bali",
      "ko-samui", "singapur", "pattaya",
    ],
  },
  {
    id: "africa",
    label: "Afrika & Ägypten",
    emoji: "🌍",
    gradient: "from-amber-500 via-orange-600 to-orange-800",
    ring: "ring-amber-300",
    description: "Kairo, Kapstadt, Hurghada & mehr",
    teaser: ["Kairo", "Kapstadt", "Hurghada"],
    slugs: ["kairo", "kapstadt", "hurghada", "sharm-el-sheikh"],
  },
  {
    id: "americas",
    label: "Amerika & Karibik",
    emoji: "🌎",
    gradient: "from-violet-600 via-purple-700 to-purple-900",
    ring: "ring-violet-300",
    description: "New York, Cancun, Punta Cana & mehr",
    teaser: ["New York", "Cancun", "Punta Cana"],
    slugs: [
      "new-york", "cancun", "punta-cana",
      "dominikanische-republik", "mexiko", "usa-ostkueste",
    ],
  },
];

// Global top picks (representative mix across all continents)
const GLOBAL_SLUGS = [
  "rom", "barcelona", "paris", "wien", "amsterdam",
  "istanbul", "dubai", "bangkok", "bali", "athen",
  "florenz", "venedig", "london", "neapel", "singapur",
];

// ── Pre-compute: CATALOG indexed by slug ─────────────────────────────────────
const TIQETS_BY_SLUG: Record<string, DestEntry> = {};
for (const e of CATALOG) {
  if (e.tiqetsCityId) {
    TIQETS_BY_SLUG[e.slug] = { cityId: e.tiqetsCityId, name: e.name, slug: e.slug };
  }
}

/** Build deduplicated destination list from an ordered slug array */
function slugsToDests(slugs: string[]): DestEntry[] {
  const seen = new Set<string>();
  const result: DestEntry[] = [];
  for (const slug of slugs) {
    const entry = TIQETS_BY_SLUG[slug];
    if (entry && !seen.has(entry.cityId)) {
      seen.add(entry.cityId);
      result.push(entry);
    }
  }
  return result;
}

// Pre-compute per-continent lists (module-level, runs once)
const CONTINENT_DESTS = Object.fromEntries(
  CONTINENTS.map((c) => [c.id, slugsToDests(c.slugs)])
) as Record<ContinentId, DestEntry[]>;

const GLOBAL_DESTS = slugsToDests(GLOBAL_SLUGS);

// ── Component ─────────────────────────────────────────────────────────────────
export default function AktivitaetenDiscovery() {
  const [active, setActive] = useState<ContinentId | "all">("all");
  const discoveryRef = useRef<HTMLDivElement>(null);

  const destinations = useMemo(() => {
    if (active === "all") return GLOBAL_DESTS;
    return CONTINENT_DESTS[active as ContinentId] ?? GLOBAL_DESTS;
  }, [active]);

  const handleSelect = (id: ContinentId | "all") => {
    setActive(id);
    setTimeout(() => {
      discoveryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const activeCfg = CONTINENTS.find((c) => c.id === active);
  const activeLabel = active === "all" ? "weltweit" : (activeCfg?.label ?? "");

  return (
    <div>
      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Wo möchtest du Aktivitäten buchen?
        </h2>
        {active !== "all" && (
          <button
            onClick={() => handleSelect("all")}
            className="text-sm text-[#00838F] hover:text-[#6CC4BA] font-semibold transition-colors shrink-0 mt-1 ml-4"
          >
            Alle anzeigen ✕
          </button>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Wähle deine Region – wir zeigen dir sofort die besten Aktivitäten &amp; Touren vor Ort.
      </p>

      {/* ── Geographic continent grid ────────────────────────────────────
           Desktop (3 cols):  [Europa 2/3] [Türkei/Asien 1/3]
                              [Afrika 1/3] [Amerika 2/3]
           Tablet  (2 cols):  Europa full · Türkei+Afrika side by side · Amerika full
           Mobile  (1 col):   All stacked
      ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">

        {/* Europa – large card (2/3 on desktop) */}
        <ContinentCard
          cfg={CONTINENTS[0]}
          active={active === CONTINENTS[0].id}
          count={CONTINENT_DESTS[CONTINENTS[0].id].length}
          onSelect={handleSelect}
          className="sm:col-span-2 lg:col-span-2"
        />

        {/* Türkei & Asien – right column (1/3 on desktop) */}
        <ContinentCard
          cfg={CONTINENTS[1]}
          active={active === CONTINENTS[1].id}
          count={CONTINENT_DESTS[CONTINENTS[1].id].length}
          onSelect={handleSelect}
          className="lg:col-span-1"
        />

        {/* Afrika – left column (1/3 on desktop) */}
        <ContinentCard
          cfg={CONTINENTS[2]}
          active={active === CONTINENTS[2].id}
          count={CONTINENT_DESTS[CONTINENTS[2].id].length}
          onSelect={handleSelect}
          className="lg:col-span-1"
        />

        {/* Amerika – large card (2/3 on desktop) */}
        <ContinentCard
          cfg={CONTINENTS[3]}
          active={active === CONTINENTS[3].id}
          count={CONTINENT_DESTS[CONTINENTS[3].id].length}
          onSelect={handleSelect}
          className="sm:col-span-2 lg:col-span-2"
        />
      </div>

      {/* ── "All" button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => handleSelect("all")}
        className={`
          w-full rounded-2xl p-3.5 text-center font-bold text-sm transition-all duration-300 mb-10
          ${active === "all"
            ? "bg-[#00838F] text-white shadow-lg ring-2 ring-[#00838F]/30"
            : "bg-white border-2 border-gray-200 text-gray-600 hover:border-[#00838F] hover:text-[#00838F] hover:shadow-sm"
          }
        `}
      >
        🌍 Alle Regionen – Top-Aktivitäten weltweit
      </button>

      {/* ── Discovery widget ─────────────────────────────────────────────── */}
      <div ref={discoveryRef} className="scroll-mt-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" aria-hidden>
            {active === "all" ? "🌍" : activeCfg?.emoji}
          </span>
          <h2 className="text-xl font-bold text-gray-900">
            {active === "all"
              ? "Top-Aktivitäten weltweit"
              : `Aktivitäten in ${activeLabel}`}
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          {active === "all"
            ? "Top-bewertete Touren, Tickets & Erlebnisse an unseren beliebtesten Urlaubszielen."
            : `Sofort buchbare Touren, Eintrittskarten & Erlebnisse in ${activeLabel}.`}
        </p>
        {/* key={active} forces remount + fresh fetch when continent changes */}
        <TiqetsMultiCityDiscovery key={active} destinations={destinations} />
      </div>
    </div>
  );
}

// ── ContinentCard ─────────────────────────────────────────────────────────────
function ContinentCard({
  cfg,
  active,
  count,
  onSelect,
  className = "",
}: {
  cfg: ContinentCfg;
  active: boolean;
  count: number;
  onSelect: (id: ContinentId) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => onSelect(cfg.id)}
      className={`
        relative overflow-hidden rounded-2xl p-5 text-left
        bg-linear-to-br ${cfg.gradient} text-white
        transition-all duration-300
        ${active
          ? `ring-4 ${cfg.ring} shadow-2xl scale-[1.01]`
          : "opacity-85 hover:opacity-100 hover:shadow-xl hover:scale-[1.01]"
        }
        ${className}
      `}
    >
      {/* Decorative circles */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/8 pointer-events-none" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{cfg.emoji}</span>
          <div className="flex flex-col items-end gap-1">
            {active && (
              <span className="bg-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-snug">
                ✓ Ausgewählt
              </span>
            )}
            <span className="bg-white/20 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full leading-snug">
              {count} Städte
            </span>
          </div>
        </div>

        {/* Labels */}
        <h3 className="font-extrabold text-base lg:text-lg leading-tight mb-1">
          {cfg.label}
        </h3>
        <p className="text-white/70 text-xs leading-relaxed mb-3 hidden sm:block">
          {cfg.description}
        </p>

        {/* Teaser city pills */}
        <div className="flex flex-wrap gap-1">
          {cfg.teaser.map((city) => (
            <span
              key={city}
              className="bg-white/15 text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full"
            >
              {city}
            </span>
          ))}
          <span className="bg-white/10 text-white/55 text-[10px] font-medium px-2 py-0.5 rounded-full">
            & mehr →
          </span>
        </div>
      </div>
    </button>
  );
}
