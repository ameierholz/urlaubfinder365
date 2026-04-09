import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const revalidate = 0;

export async function GET() {
  const supabase = await createSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("sponsored_deals" as never)
    .select("*")
    .eq("status", "aktiv")
    .lte("start_date", today)
    .gte("end_date", today)
    .order("daily_budget", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ deal: null }, { status: 200 });
  }

  return NextResponse.json({ deal: data ?? null });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const body = await req.json().catch(() => null);

  if (!body?.action || !body?.dealId) {
    return NextResponse.json({ error: "Missing action or dealId" }, { status: 400 });
  }

  const { action, dealId } = body as { action: "impression" | "click"; dealId: string };

  if (action !== "impression" && action !== "click") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const column = action === "impression" ? "impressions" : "clicks";

  // Fetch current value, then increment (simple approach without custom RPC)
  const { data } = await supabase
    .from("sponsored_deals" as never)
    .select(column)
    .eq("id", dealId)
    .single();

  if (data) {
    const current = (data as Record<string, number>)[column] ?? 0;
    await supabase
      .from("sponsored_deals" as never)
      .update({ [column]: current + 1 })
      .eq("id", dealId);
  }

  return NextResponse.json({ ok: true });
}
