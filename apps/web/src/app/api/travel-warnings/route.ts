import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET /api/travel-warnings?level=warning,partial   → gefilterte Liste
// GET /api/travel-warnings?country=Türkei          → Einzelabfrage
export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams;
  const country = sp.get("country");
  const level   = sp.get("level"); // kommasepariert, z. B. "warning,partial"

  const supabase = db();

  if (country) {
    const { data, error } = await supabase
      .from("travel_warnings")
      .select("*")
      .ilike("country_name", country.trim())
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { warning: data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
    );
  }

  // Vollständige Liste
  let query = supabase
    .from("travel_warnings")
    .select("iso3_country_code, iso2_country_code, country_name, warning_level, situation_short, aa_last_updated, fetched_at")
    .order("country_name", { ascending: true });

  if (level) {
    const levels = level.split(",").map((l) => l.trim()).filter(Boolean);
    query = query.in("warning_level", levels);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { warnings: data ?? [], count: data?.length ?? 0 },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
  );
}
