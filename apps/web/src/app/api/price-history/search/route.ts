import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const supabase = db();

  const { data, error } = await supabase
    .from("price_history")
    .select("destination_slug, destination_name, min_price, date")
    .ilike("destination_name", `%${q}%`)
    .eq("profile", "pauschal")
    .order("date", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ results: [] });

  // Deduplizieren: nur neuesten Eintrag pro Destination
  const seen = new Map<string, { slug: string; name: string; minPrice: number; date: string }>();
  for (const row of data ?? []) {
    if (!seen.has(row.destination_slug)) {
      seen.set(row.destination_slug, {
        slug:     row.destination_slug,
        name:     row.destination_name,
        minPrice: row.min_price,
        date:     row.date,
      });
    }
  }

  return NextResponse.json(
    { results: Array.from(seen.values()).slice(0, 10) },
    { headers: { "Cache-Control": "public, s-maxage=300" } }
  );
}
