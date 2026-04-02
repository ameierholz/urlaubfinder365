import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Nur eingeloggte Admins dürfen diese Route nutzen
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const nummer = req.nextUrl.searchParams.get("nummer");
  if (!nummer) return NextResponse.json({ error: "nummer fehlt" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("buchungen")
    .select(`
      buchungs_nummer, qr_token, kunden_name,
      datum, personen, gesamtpreis, status, created_at,
      angebote:angebot_id (titel, ziel, dauer, foto_url, treffpunkt, treffpunkt_hinweis),
      anbieter_profile:anbieter_id (name, telefon, avatar_url, verifiziert)
    `)
    .eq("buchungs_nummer", nummer)
    .single();

  if (error || !data) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  return NextResponse.json(data);
}
