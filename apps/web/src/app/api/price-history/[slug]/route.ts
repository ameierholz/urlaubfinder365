import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { PriceProfileId } from "@/types";

export const runtime = "nodejs";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Lineare Regression ────────────────────────────────────────────────────────

function linearRegression(prices: number[]) {
  const n = prices.length;
  if (n < 7) return { slope: 0, rSquared: 0 };
  const x = prices.map((_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = prices.reduce((a, b) => a + b, 0) / n;
  const ssXY = x.reduce((s, xi, i) => s + (xi - xMean) * (prices[i] - yMean), 0);
  const ssXX = x.reduce((s, xi) => s + (xi - xMean) ** 2, 0);
  const ssTot = prices.reduce((s, yi) => s + (yi - yMean) ** 2, 0);
  const slope = ssXX === 0 ? 0 : ssXY / ssXX;
  const intercept = yMean - slope * xMean;
  const ssRes = prices.reduce((s, yi, i) => s + (yi - (slope * i + intercept)) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { slope, intercept, rSquared, n };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sp = req.nextUrl.searchParams;
  const profile = (sp.get("profile") ?? "pauschal") as PriceProfileId;
  const days    = Math.min(Number(sp.get("days") ?? "90"), 365);

  const supabase = db();
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  // Hauptserie
  const { data: series } = await supabase
    .from("price_history")
    .select("date, min_price, avg_price, deal_count")
    .eq("destination_slug", slug)
    .eq("profile", profile)
    .gte("date", since)
    .order("date", { ascending: true });

  if (!series || series.length === 0) {
    return NextResponse.json({ error: "Keine Daten" }, { status: 404 });
  }

  const destinationName = (await supabase
    .from("price_history")
    .select("destination_name")
    .eq("destination_slug", slug)
    .limit(1)
    .single()).data?.destination_name ?? slug;

  const prices = series.map((r) => Number(r.min_price));
  const { slope, intercept, rSquared, n } = linearRegression(prices);

  const trendDirection =
    slope > 1.0 ? "up" : slope < -1.0 ? "down" : "flat";

  const forecastNext30 =
    rSquared >= 0.2 && n !== undefined
      ? Math.round((intercept ?? 0) + slope * (n + 30))
      : null;

  // Monatsaggregation (Best-Time-to-Book)
  const { data: monthly } = await supabase.rpc("price_history_monthly_avg", {
    p_slug:    slug,
    p_profile: profile,
  }).catch(() => ({ data: null }));

  // Jahr-über-Jahr-Vergleich
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastYearDate = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);

  const [{ data: currWindow }, { data: prevWindow }] = await Promise.all([
    supabase
      .from("price_history")
      .select("avg_price")
      .eq("destination_slug", slug)
      .eq("profile", profile)
      .gte("date", new Date(Date.now() - 15 * 86_400_000).toISOString().slice(0, 10))
      .lte("date", todayStr),
    supabase
      .from("price_history")
      .select("avg_price")
      .eq("destination_slug", slug)
      .eq("profile", profile)
      .gte("date", new Date(new Date(lastYearDate).getTime() - 15 * 86_400_000).toISOString().slice(0, 10))
      .lte("date", new Date(new Date(lastYearDate).getTime() + 15 * 86_400_000).toISOString().slice(0, 10)),
  ]);

  let yoyComparison = null;
  if ((currWindow?.length ?? 0) >= 3 && (prevWindow?.length ?? 0) >= 3) {
    const avg = (rows: { avg_price: number }[]) =>
      rows.reduce((s, r) => s + Number(r.avg_price), 0) / rows.length;
    const currAvg = Math.round(avg(currWindow!));
    const lastAvg = Math.round(avg(prevWindow!));
    yoyComparison = {
      currentAvg:    currAvg,
      lastYearAvg:   lastAvg,
      changePercent: Math.round(((currAvg - lastAvg) / lastAvg) * 100),
    };
  }

  return NextResponse.json(
    {
      slug,
      destinationName,
      profile,
      days,
      series: series.map((r) => ({
        date:      r.date,
        minPrice:  Number(r.min_price),
        avgPrice:  Number(r.avg_price),
        dealCount: r.deal_count,
      })),
      stats: {
        currentMinPrice: prices[prices.length - 1],
        lowestEver:      Math.min(...prices),
        highestEver:     Math.max(...prices),
        averagePrice:    Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        trendSlope:      Math.round(slope * 10) / 10,
        trendDirection,
        forecastNext30,
        rSquared:        Math.round(rSquared * 100) / 100,
        monthly:         monthly ?? [],
        yoyComparison,
      },
      hasEnoughData: series.length >= 14,
      dataFreshness: series[series.length - 1].date,
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
  );
}
