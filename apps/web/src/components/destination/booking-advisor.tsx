import { createClient } from "@supabase/supabase-js";

interface PriceRecord {
  date: string;
  min_price: number;
  avg_price: number | null;
}

interface BookingAdvisorProps {
  destinationSlug: string;
  destinationName: string;
}

interface AnalysisResult {
  trend: "steigend" | "fallend" | "stabil";
  trendPercent: number;
  avgPrice: number;
  minPrice: number;
  minDate: string;
  currentPrice: number;
  diffFromAvg: number; // negative = günstiger als Durchschnitt
  signal: "green" | "yellow" | "red";
  signalLabel: string;
  reason: string;
}

function analyzePrices(records: PriceRecord[]): AnalysisResult | null {
  if (!records || records.length < 7) return null;

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const prices = sorted.map((r) => r.min_price).filter((p) => p > 0);
  if (prices.length < 7) return null;

  const avgPrice = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);

  const minEntry = sorted.reduce((best, r) => (r.min_price > 0 && r.min_price < best.min_price ? r : best), sorted[0]);
  const minPrice = minEntry.min_price;
  const minDate = minEntry.date;

  // Trend: letzte 7 Tage vs. davor
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

  const currentPrice = Math.round(avgRecent);
  const diffFromAvg = Math.round(((currentPrice - avgPrice) / avgPrice) * 100);

  // Signal-Logik
  let signal: "green" | "yellow" | "red";
  let signalLabel: string;
  let reason: string;

  if (diffFromAvg <= -10 && trend !== "steigend") {
    signal = "green";
    signalLabel = "Jetzt buchen!";
    reason = `Preise sind aktuell ${Math.abs(diffFromAvg)}% unter dem 90-Tage-Durchschnitt${trend === "fallend" ? " und fallen weiter" : ""}.`;
  } else if (diffFromAvg <= 0 || trend === "fallend") {
    signal = "yellow";
    signalLabel = "Guter Zeitpunkt";
    reason =
      trend === "fallend"
        ? `Preise fallen gerade — noch etwas warten könnte sich lohnen.`
        : `Preise liegen ${Math.abs(diffFromAvg)}% unter dem Durchschnitt. Ein solider Buchungszeitpunkt.`;
  } else {
    signal = "red";
    signalLabel = "Lieber warten";
    reason = `Preise liegen aktuell ${diffFromAvg}% über dem 90-Tage-Durchschnitt${trend === "steigend" ? " und steigen weiter" : ""}.`;
  }

  return {
    trend,
    trendPercent,
    avgPrice,
    minPrice,
    minDate,
    currentPrice,
    diffFromAvg,
    signal,
    signalLabel,
    reason,
  };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function BookingAdvisor({
  destinationSlug,
  destinationName,
}: BookingAdvisorProps) {
  let records: PriceRecord[] = [];

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
      .select("date, min_price, avg_price")
      .eq("destination_slug", destinationSlug)
      .gte("date", ninetyDaysAgo)
      .order("date", { ascending: true });

    records = (data ?? []) as PriceRecord[];
  } catch {
    return null;
  }

  const analysis = analyzePrices(records);
  if (!analysis) return null;

  const { trend, trendPercent, avgPrice, minPrice, minDate, currentPrice, signal, signalLabel, reason } = analysis;

  const signalConfig = {
    green: {
      emoji: "🟢",
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-200",
      badge: "bg-emerald-500 text-white",
      icon: "bg-emerald-100 text-emerald-700",
    },
    yellow: {
      emoji: "🟡",
      bg: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      badge: "bg-amber-500 text-white",
      icon: "bg-amber-100 text-amber-700",
    },
    red: {
      emoji: "🔴",
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      badge: "bg-red-500 text-white",
      icon: "bg-red-100 text-red-700",
    },
  }[signal];

  const trendIcon = trend === "steigend" ? "↑" : trend === "fallend" ? "↓" : "→";
  const trendColor =
    trend === "steigend"
      ? "text-red-600"
      : trend === "fallend"
      ? "text-emerald-600"
      : "text-amber-600";

  return (
    <div
      className={`rounded-2xl border ${signalConfig.border} bg-linear-to-br ${signalConfig.bg} p-4 sm:p-5 shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Buchungsempfehlung
          </p>
          <h3 className="text-base font-black text-gray-900 leading-tight">
            💡 Wann buchen: {destinationName}?
          </h3>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${signalConfig.badge}`}
        >
          {signalConfig.emoji} {signalLabel}
        </span>
      </div>

      {/* Reason */}
      <p className="text-sm text-gray-700 leading-relaxed mb-5">{reason}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Aktuell
          </p>
          <p className="text-xl font-black text-gray-900">
            {currentPrice.toLocaleString("de-DE")} €
          </p>
          <p className="text-[11px] text-gray-500">pro Person</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Bestzpreis 90 T.
          </p>
          <p className="text-xl font-black text-emerald-600">
            {minPrice.toLocaleString("de-DE")} €
          </p>
          <p className="text-[11px] text-gray-500">{formatDate(minDate)}</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Ø 90 Tage
          </p>
          <p className="text-xl font-black text-gray-900">
            {avgPrice.toLocaleString("de-DE")} €
          </p>
          <p className="text-[11px] text-gray-500">Durchschnitt</p>
        </div>
      </div>

      {/* Trend footer */}
      <div className="flex items-center justify-between border-t border-white/60 pt-3 mt-3">
        <p className="text-xs text-gray-500">
          Basiert auf {records.length} Datenpunkten der letzten 90 Tage
        </p>
        <span className={`text-sm font-bold ${trendColor}`}>
          {trendIcon}{" "}
          {trend === "stabil"
            ? "Preis stabil"
            : `Preis ${trend} (${Math.abs(trendPercent)}%)`}
        </span>
      </div>
    </div>
  );
}
