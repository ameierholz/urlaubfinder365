import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

function calcTrend(prices: { min_price: number }[]): "rising" | "falling" | "stable" {
  if (prices.length < 14) return "stable";
  const recent = prices.slice(-7).map((p) => p.min_price);
  const older = prices.slice(-14, -7).map((p) => p.min_price);
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  const avgOlder = older.reduce((a, b) => a + b, 0) / older.length;
  const diff = ((avgRecent - avgOlder) / avgOlder) * 100;
  if (diff > 3) return "rising";
  if (diff < -3) return "falling";
  return "stable";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const days = Math.min(parseInt(searchParams.get("days") ?? "90", 10), 365);

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("price_history")
    .select("date, min_price, avg_price, deal_count")
    .eq("destination_slug", slug)
    .eq("profile", "pauschal")
    .gte("date", since.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const prices = data ?? [];

  if (prices.length === 0) {
    return NextResponse.json({ prices: [], trend: "stable", currentPrice: null, lowestPrice: null, lowestDate: null });
  }

  const trend = calcTrend(prices);
  const currentPrice = prices[prices.length - 1].min_price;
  const minEntry = prices.reduce((a, b) => (a.min_price < b.min_price ? a : b));

  return NextResponse.json(
    {
      prices,
      trend,
      currentPrice,
      lowestPrice: minEntry.min_price,
      lowestDate: minEntry.date,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
