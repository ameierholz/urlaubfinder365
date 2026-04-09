import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

interface PriceRow {
  destination_slug: string;
  destination_name: string;
  date: string;
  min_price: number;
}

interface DestinationSummary {
  slug: string;
  name: string;
  currentPrice: number;
  minPrice90: number;
  avgPrice90: number;
  trend: "steigend" | "fallend" | "stabil";
  trendPercent: number;
  signal: "green" | "yellow" | "red";
  bookingTip: string;
}

function buildSummaries(rows: PriceRow[]): DestinationSummary[] {
  // Gruppiere nach slug
  const bySlug: Record<string, { name: string; entries: { date: string; price: number }[] }> = {};
  for (const row of rows) {
    if (!row.destination_slug || !row.min_price || row.min_price <= 0) continue;
    if (!bySlug[row.destination_slug]) {
      bySlug[row.destination_slug] = {
        name: row.destination_name ?? row.destination_slug,
        entries: [],
      };
    }
    bySlug[row.destination_slug].entries.push({ date: row.date, price: row.min_price });
  }

  const summaries: DestinationSummary[] = [];

  for (const [slug, { name, entries }] of Object.entries(bySlug)) {
    if (entries.length < 5) continue;

    entries.sort((a, b) => a.date.localeCompare(b.date));
    const prices = entries.map((e) => e.price);

    const avgPrice90 = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
    const minPrice90 = Math.min(...prices);
    const currentPrice = Math.round(prices.slice(-7).reduce((s, p) => s + p, 0) / Math.min(7, prices.length));

    const recent = prices.slice(-7);
    const older = prices.slice(-21, -7);
    const avgRecent = recent.reduce((s, p) => s + p, 0) / recent.length;
    const avgOlder = older.length > 0
      ? older.reduce((s, p) => s + p, 0) / older.length
      : avgRecent;

    const trendPercent = avgOlder > 0
      ? Math.round(((avgRecent - avgOlder) / avgOlder) * 100)
      : 0;
    const trend: "steigend" | "fallend" | "stabil" =
      trendPercent >= 3 ? "steigend" : trendPercent <= -3 ? "fallend" : "stabil";

    const diffFromAvg = Math.round(((currentPrice - avgPrice90) / avgPrice90) * 100);

    let signal: "green" | "yellow" | "red";
    let bookingTip: string;

    if (diffFromAvg <= -10 && trend !== "steigend") {
      signal = "green";
      bookingTip = `${Math.abs(diffFromAvg)}% unter Ø`;
    } else if (diffFromAvg <= 0 || trend === "fallend") {
      signal = "yellow";
      bookingTip = trend === "fallend" ? "Preise fallen" : `${Math.abs(diffFromAvg)}% unter Ø`;
    } else {
      signal = "red";
      bookingTip = `${diffFromAvg}% über Ø`;
    }

    summaries.push({ slug, name, currentPrice, minPrice90, avgPrice90, trend, trendPercent, signal, bookingTip });
  }

  // Sortiere nach Datenmenge (meiste Daten = verlässlichste Empfehlung) → dann nach Name
  return summaries
    .sort((a, b) => a.name.localeCompare(b.name, "de"))
    .slice(0, 15);
}

export default async function PriceComparisonTable() {
  let summaries: DestinationSummary[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const { data } = await supabase
      .from("price_history")
      .select("destination_slug, destination_name, date, min_price")
      .gte("date", ninetyDaysAgo)
      .order("date", { ascending: true });

    summaries = buildSummaries((data ?? []) as PriceRow[]);
  } catch {
    return null;
  }

  if (summaries.length === 0) return null;

  const signalDot: Record<string, string> = {
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-red-500",
  };
  const trendIcon: Record<string, string> = {
    steigend: "↑",
    fallend: "↓",
    stabil: "→",
  };
  const trendColor: Record<string, string> = {
    steigend: "text-red-600",
    fallend: "text-emerald-600",
    stabil: "text-amber-600",
  };

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-2xl font-black text-gray-900">
          Preisvergleich: Top Reiseziele
        </h2>
        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
          90-Tage-Analyse
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop-Tabelle */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Reiseziel
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-right">
                  Aktuell
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-right">
                  Bestpreis 90 T.
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-right">
                  Ø 90 Tage
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-center">
                  Trend
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-center">
                  Jetzt buchen?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summaries.map((s, i) => (
                <tr
                  key={s.slug}
                  className={`hover:bg-gray-50/60 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/urlaubsziele/${s.slug}/`}
                      className="font-semibold text-gray-900 hover:text-[#1db682] transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-gray-900">
                    {s.currentPrice.toLocaleString("de-DE")} €
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                    {s.minPrice90.toLocaleString("de-DE")} €
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-600">
                    {s.avgPrice90.toLocaleString("de-DE")} €
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`font-bold text-base ${trendColor[s.trend]}`}>
                      {trendIcon[s.trend]}
                      {s.trendPercent !== 0 && (
                        <span className="text-xs ml-0.5">
                          {Math.abs(s.trendPercent)}%
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${signalDot[s.signal]}`} />
                      <span className="text-xs font-semibold text-gray-700">{s.bookingTip}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile-Liste */}
        <div className="sm:hidden divide-y divide-gray-100">
          {summaries.map((s) => (
            <div key={s.slug} className="px-4 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/urlaubsziele/${s.slug}/`}
                  className="font-semibold text-gray-900 hover:text-[#1db682] block truncate"
                >
                  {s.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ø {s.avgPrice90.toLocaleString("de-DE")} € · Bestpreis{" "}
                  {s.minPrice90.toLocaleString("de-DE")} €
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-black text-gray-900 text-base">
                  {s.currentPrice.toLocaleString("de-DE")} €
                </p>
                <span className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${signalDot[s.signal]}`} />
                  <span className={`text-xs font-bold ${trendColor[s.trend]}`}>
                    {trendIcon[s.trend]} {s.bookingTip}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        * Preise pro Person. Signalfarbe: 🟢 = jetzt buchen, 🟡 = guter Zeitpunkt, 🔴 = lieber warten.
      </p>
    </section>
  );
}
