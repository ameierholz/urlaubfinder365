import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  // Kein CDN-Cache – damit Daten immer aktuell sind
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const destination = sp.get("destination") ?? "antalya";
  const days = Math.min(Number(sp.get("days") ?? "30"), 365);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  // Exakt dieselbe Abfrage wie /api/price-history
  const { data: rows, error } = await supabase
    .from("price_history")
    .select("date, min_price, avg_price, deal_count")
    .eq("destination_slug", destination)
    .eq("profile", "pauschal")
    .gte("date", since)
    .order("date", { ascending: true });

  if (error || !rows || rows.length === 0) {
    return NextResponse.json({ error: "Keine Daten verfügbar" }, { status: 404, headers: CORS_HEADERS });
  }

  // Destination-Name
  const destRow = await supabase
    .from("destinations")
    .select("name")
    .eq("slug", destination)
    .limit(1)
    .single();
  const destinationName = destRow.data?.name ?? destination;

  const series = rows.map((r) => ({
    date: r.date,
    minPrice: Number(r.min_price),
    avgPrice: Number(r.avg_price),
    dealCount: r.deal_count ?? 0,
  }));

  const prices = series.map((r) => r.minPrice);
  const currentPrice = prices[prices.length - 1];
  const lowestPrice = Math.min(...prices);
  const lowestDate = rows[prices.indexOf(lowestPrice)]?.date ?? null;

  // Trend (identisch mit /api/price-history)
  let trend = "stable";
  if (prices.length >= 14) {
    const recent = prices.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const older  = prices.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    const diff   = ((recent - older) / older) * 100;
    if (diff > 3)  trend = "rising";
    if (diff < -3) trend = "falling";
  }

  return NextResponse.json(
    {
      destination,
      destinationName,
      days,
      series,
      stats: {
        currentPrice,
        lowestPrice,
        lowestDate,
        highestPrice: Math.max(...prices),
        avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        isDemo: false,
      },
      trend,
      embed: {
        poweredBy: "urlaubfinder365.de",
        url: `https://www.urlaubfinder365.de/urlaubsziele/${destination}/`,
      },
    },
    { headers: CORS_HEADERS }
  );
}
