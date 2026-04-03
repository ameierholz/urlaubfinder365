import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Gestrige Buchungen auf abgeschlossen setzen
  const gestern = new Date();
  gestern.setDate(gestern.getDate() - 1);
  const tag = gestern.toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("buchungen")
    .update({ status: "abgeschlossen" })
    .eq("status", "bestaetigt")
    .eq("datum", tag)
    .select("buchungs_nummer");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, abgeschlossen: data?.length ?? 0 });
}
