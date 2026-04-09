import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

interface PriceRow {
  destination_slug: string;
  destination_name: string;
  date: string;
  min_price: number;
}

interface MonthlyAvg {
  month: number; // 1-12
  avg: number;
}

interface CalendarEntry {
  slug: string;
  name: string;
  monthlyAvg: MonthlyAvg[];
  minMonth: number;
  maxMonth: number;
}

const MONTH_LABELS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function buildCalendar(rows: PriceRow[]): CalendarEntry[] {
  const bySlug: Record<string, { name: string; byMonth: Record<number, number[]> }> = {};

  for (const row of rows) {
    if (!row.min_price || row.min_price <= 0) continue;
    const month = new Date(row.date).getMonth() + 1; // 1-12
    if (!bySlug[row.destination_slug]) {
      bySlug[row.destination_slug] = { name: row.destination_name ?? row.destination_slug, byMonth: {} };
    }
    if (!bySlug[row.destination_slug].byMonth[month]) {
      bySlug[row.destination_slug].byMonth[month] = [];
    }
    bySlug[row.destination_slug].byMonth[month].push(row.min_price);
  }

  const entries: CalendarEntry[] = [];

  for (const [slug, { name, byMonth }] of Object.entries(bySlug)) {
    const monthlyAvg: MonthlyAvg[] = Object.entries(byMonth)
      .map(([m, prices]) => ({
        month: Number(m),
        avg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
      }))
      .sort((a, b) => a.month - b.month);

    if (monthlyAvg.length < 2) continue;

    const avgs = monthlyAvg.map((m) => m.avg);
    const minAvg = Math.min(...avgs);
    const maxAvg = Math.max(...avgs);
    const minMonth = monthlyAvg.find((m) => m.avg === minAvg)!.month;
    const maxMonth = monthlyAvg.find((m) => m.avg === maxAvg)!.month;

    entries.push({ slug, name, monthlyAvg, minMonth, maxMonth });
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name, "de")).slice(0, 12);
}

function heatmapColor(avg: number, minAvg: number, maxAvg: number): string {
  if (maxAvg === minAvg) return "bg-amber-100 text-amber-800";
  const ratio = (avg - minAvg) / (maxAvg - minAvg);
  if (ratio < 0.25) return "bg-emerald-500 text-white font-bold";
  if (ratio < 0.45) return "bg-emerald-200 text-emerald-900";
  if (ratio < 0.65) return "bg-amber-100 text-amber-800";
  if (ratio < 0.85) return "bg-orange-200 text-orange-900";
  return "bg-red-200 text-red-900";
}

export default async function SeasonCalendar() {
  let entries: CalendarEntry[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    // Letztes Jahr an Daten holen für saisonale Auswertung
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const { data } = await supabase
      .from("price_history")
      .select("destination_slug, destination_name, date, min_price")
      .gte("date", oneYearAgo)
      .order("date", { ascending: true });

    entries = buildCalendar((data ?? []) as PriceRow[]);
  } catch {
    return null;
  }

  if (entries.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-black text-gray-900">
          Saisonkalender: Wann ist es am günstigsten?
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Grüner Monat = günstigster Zeitraum · Roter Monat = teuerster Zeitraum. Basiert auf historischen Preisdaten.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide min-w-32">
                  Reiseziel
                </th>
                {MONTH_LABELS.map((m) => (
                  <th key={m} className="px-1.5 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide w-12">
                    {m}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide">
                  Beste Zeit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry, i) => {
                const avgs = entry.monthlyAvg.map((m) => m.avg);
                const minAvg = Math.min(...avgs);
                const maxAvg = Math.max(...avgs);
                const byMonth = Object.fromEntries(entry.monthlyAvg.map((m) => [m.month, m.avg]));

                return (
                  <tr
                    key={entry.slug}
                    className={`${i % 2 === 0 ? "" : "bg-gray-50/30"} hover:bg-gray-50/60 transition-colors`}
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/urlaubsziele/${entry.slug}/`}
                        className="font-semibold text-gray-900 hover:text-[#1db682] transition-colors whitespace-nowrap"
                      >
                        {entry.name}
                      </Link>
                    </td>
                    {Array.from({ length: 12 }, (_, idx) => idx + 1).map((month) => {
                      const avg = byMonth[month];
                      if (!avg) {
                        return (
                          <td key={month} className="px-1 py-2 text-center">
                            <span className="text-gray-200">–</span>
                          </td>
                        );
                      }
                      const colorClass = heatmapColor(avg, minAvg, maxAvg);
                      return (
                        <td key={month} className="px-1 py-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-9 h-7 rounded text-[10px] ${colorClass}`}
                            title={`${MONTH_LABELS[month - 1]}: Ø ${avg.toLocaleString("de-DE")} €`}
                          >
                            {avg >= 1000
                              ? `${Math.round(avg / 100) / 10}k`
                              : avg.toString()}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                        ✓ {MONTH_LABELS[entry.minMonth - 1]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legende */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-xs text-gray-500 bg-gray-50">
          <span className="font-semibold">Legende:</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-emerald-500 inline-block" /> Sehr günstig
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-emerald-200 inline-block" /> Günstig
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-amber-100 inline-block" /> Mittel
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-orange-200 inline-block" /> Teuer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-200 inline-block" /> Sehr teuer
          </span>
        </div>
      </div>
    </section>
  );
}
