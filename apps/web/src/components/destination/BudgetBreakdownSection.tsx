import type { DestinationConfig } from "@/types";

interface Props {
  dest: DestinationConfig;
}

/** Heuristik: Budget-Bereiche in EUR pro Person/Woche je nach Land/Destination. */
function budgetForDestination(dest: DestinationConfig) {
  const country = dest.country.toLowerCase();

  // Türkei & Ägypten – günstig
  if (country.includes("türkei") || country.includes("ägypten") || country.includes("tunesien") || country.includes("marokko")) {
    return {
      tier: "Günstig",
      low:    { total: 550,  hotel: 280, food: 0,   transport: 250, activities: 20  },
      mid:    { total: 900,  hotel: 520, food: 0,   transport: 300, activities: 80  },
      luxury: { total: 1600, hotel: 1100, food: 0,  transport: 350, activities: 150 },
      note: "Inklusive Flug, 4-Sterne All-Inclusive und Transfer. In diesen Ländern ist All-Inclusive fast ohne Aufpreis zu Halbpension buchbar.",
    };
  }

  // Griechenland, Portugal, Kanaren – mittel
  if (
    country.includes("griechenland") ||
    country.includes("portugal") ||
    country.includes("spanien") ||
    country.includes("kroatien") ||
    country.includes("zypern") ||
    dest.slug.includes("kanar") ||
    ["teneriffa","gran-canaria","fuerteventura","lanzarote","mallorca","ibiza","menorca","kreta","rhodos","korfu","kos","madeira","algarve","malta"].includes(dest.slug)
  ) {
    return {
      tier: "Mittel",
      low:    { total: 700,  hotel: 350, food: 140, transport: 200, activities: 40  },
      mid:    { total: 1200, hotel: 650, food: 220, transport: 260, activities: 120 },
      luxury: { total: 2200, hotel: 1400, food: 400, transport: 320, activities: 220 },
      note: "Preise für 7 Tage, 2 Erwachsene, inklusive Flug und Unterkunft. Selbstverpflegung oder Halbpension möglich.",
    };
  }

  // Fernreisen
  if (
    country.includes("thailand") ||
    country.includes("indonesien") ||
    country.includes("vietnam") ||
    country.includes("sri lanka") ||
    country.includes("malediven") ||
    country.includes("kuba") ||
    country.includes("mexiko") ||
    country.includes("dominikanische") ||
    country.includes("usa")
  ) {
    return {
      tier: "Fernreise",
      low:    { total: 1200, hotel: 500,  food: 150, transport: 550, activities: 60  },
      mid:    { total: 2000, hotel: 900,  food: 250, transport: 700, activities: 180 },
      luxury: { total: 3800, hotel: 2200, food: 450, transport: 800, activities: 400 },
      note: "Fernreisen: Flugkosten machen den größten Posten aus. Vor Ort ist das Leben oft sehr günstig.",
    };
  }

  // Default (Europa-Städtereise / unbekannt)
  return {
    tier: "Europa",
    low:    { total: 650,  hotel: 300, food: 140, transport: 180, activities: 40  },
    mid:    { total: 1100, hotel: 600, food: 220, transport: 230, activities: 100 },
    luxury: { total: 2000, hotel: 1250, food: 380, transport: 280, activities: 180 },
    note: "Alle Werte in Euro pro Person für 7 Tage, inklusive An- und Abreise.",
  };
}

interface TierProps {
  label: string;
  color: string;
  badge: string;
  data: { total: number; hotel: number; food: number; transport: number; activities: number };
}

function TierCard({ label, color, badge, data }: TierProps) {
  const rows: Array<[string, number, string]> = [
    ["🏨 Hotel",       data.hotel,      "7 Nächte"],
    ["🍽️ Essen",       data.food,        data.food === 0 ? "All-Inklusive" : "pro Tag ~30€"],
    ["✈️ An-/Abreise", data.transport,  "Flug + Transfer"],
    ["🎟️ Aktivitäten", data.activities, "Ausflüge & Tickets"],
  ];

  return (
    <div className={`rounded-2xl border-2 ${color} p-6 flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{label}</h3>
        <span className={`${badge} text-xs font-bold px-2.5 py-1 rounded-full`}>{badge.includes("emerald") ? "günstig" : badge.includes("amber") ? "mittel" : "luxus"}</span>
      </div>
      <div className="text-3xl font-black text-gray-900 mb-4">
        {data.total.toLocaleString("de-DE")} €
        <span className="text-sm font-normal text-gray-400 ml-1">/ Person</span>
      </div>
      <div className="space-y-2 flex-1">
        {rows.map(([label, val, hint]) => (
          <div key={label} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1.5">
            <div>
              <p className="text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{hint}</p>
            </div>
            <p className="font-semibold text-gray-800">
              {val === 0 ? "inkl." : `${val.toLocaleString("de-DE")} €`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BudgetBreakdownSection({ dest }: Props) {
  const budget = budgetForDestination(dest);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
      <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Kosten-Kalkulation</p>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        Was kostet ein {dest.name}-Urlaub?
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-2xl">
        Realistische Richtwerte für 7 Tage, pro Person, in drei Budget-Klassen. Basis: {budget.tier}-Destination.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <TierCard
          label="Sparfuchs"
          color="border-emerald-200 bg-emerald-50/50"
          badge="bg-emerald-100 text-emerald-700"
          data={budget.low}
        />
        <TierCard
          label="Standard"
          color="border-amber-200 bg-amber-50/50"
          badge="bg-amber-100 text-amber-700"
          data={budget.mid}
        />
        <TierCard
          label="Luxus"
          color="border-rose-200 bg-rose-50/50"
          badge="bg-rose-100 text-rose-700"
          data={budget.luxury}
        />
      </div>

      <p className="text-xs text-gray-400 mt-4 italic">{budget.note} Tagesaktuelle Preise können je nach Saison und Verfügbarkeit abweichen.</p>
    </div>
  );
}
