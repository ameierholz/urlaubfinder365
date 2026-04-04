import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  // Nur eingeloggte Admins/Moderatoren duerfen diese Route nutzen
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });

  const supabaseAdminClient = supabaseAdmin();

  const nummer = req.nextUrl.searchParams.get("nummer");
  if (!nummer) return NextResponse.json({ error: "nummer fehlt" }, { status: 400 });

  const { data, error } = await supabaseAdminClient
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
