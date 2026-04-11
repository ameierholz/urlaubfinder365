import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
};

// Demo-Fallback wenn keine echten Daten vorhanden
function generateDemoSeries(days: number, destination: string) {
  const basePrice = destination === "antalya" ? 589 : destination === "mallorca" ? 649 : 729;
  const series = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    const noise = Math.sin(i * 0.4) * 30 + Math.random() * 20 - 10;
    const minPrice = Math.round(basePrice + noise);
    series.push({ date, minPrice, avgPrice: Math.round(minPrice * 1.12), dealCount: Math.floor(Math.random() * 40 + 10) });
  }
  return series;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const destination = sp.get("destination") ?? "antalya";
  const days = Math.min(Number(sp.get("days") ?? "30"), 365);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    const { data: series } = await supabase
      .from("price_history")
      .select("date, min_price, avg_price, deal_count")
      .eq("destination_slug", destination)
      .eq("profile", "pauschal")
      .gte("date", since)
      .order("date", { ascending: true });

    const destRow = await supabase
      .from("price_history")
      .select("destination_name")
      .eq("destination_slug", destination)
      .limit(1)
      .single();

    const destinationName = destRow.data?.destination_name ?? destination;

    const finalSeries =
      series && series.length >= 7
        ? series.map((r) => ({
            date: r.date,
            minPrice: Number(r.min_price),
            avgPrice: Number(r.avg_price),
            dealCount: r.deal_count,
          }))
        : generateDemoSeries(days, destination);

    const prices = finalSeries.map((r) => r.minPrice);
    const currentPrice = prices[prices.length - 1];
    const lowestPrice = Math.min(...prices);
    const isGoodDeal = currentPrice <= lowestPrice * 1.05;

    return NextResponse.json(
      {
        destination,
        destinationName,
        days,
        series: finalSeries,
        stats: {
          currentPrice,
          lowestPrice,
          highestPrice: Math.max(...prices),
          avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
          isGoodDeal,
          isDemo: !series || series.length < 7,
        },
        embed: {
          poweredBy: "urlaubfinder365.de",
          url: `https://www.urlaubfinder365.de/reiseziele/${destination}/`,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    // Fallback auf Demo-Daten
    const demoSeries = generateDemoSeries(days, destination);
    const prices = demoSeries.map((r) => r.minPrice);
    return NextResponse.json(
      {
        destination,
        destinationName: destination,
        days,
        series: demoSeries,
        stats: {
          currentPrice: prices[prices.length - 1],
          lowestPrice: Math.min(...prices),
          highestPrice: Math.max(...prices),
          avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
          isGoodDeal: false,
          isDemo: true,
        },
        embed: {
          poweredBy: "urlaubfinder365.de",
          url: `https://www.urlaubfinder365.de/reiseziele/${destination}/`,
        },
      },
      { headers: CORS_HEADERS }
    );
  }
}
