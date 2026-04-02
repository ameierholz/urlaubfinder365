import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Nur eingeloggte Anbieter
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ valid: false, reason: "Nicht eingeloggt" }, { status: 401 });

  const { token } = await req.json() as { token: string };
  if (!token?.trim()) return NextResponse.json({ valid: false, reason: "Kein Token angegeben" });

  const input = token.trim().toUpperCase();

  // Suche per Buchungsnummer (UF-2026-000111) ODER per qr_token (UUID)
  const { data: buchung } = await supabaseAdmin
    .from("buchungen")
    .select("id, buchungs_nummer, kunden_name, personen, datum, status, qr_token, angebote:angebot_id(titel)")
    .or(`buchungs_nummer.eq.${input},qr_token.eq.${token.trim()}`)
    .maybeSingle() as { data: {
      id: string; buchungs_nummer: string; kunden_name: string; personen: number;
      datum: string; status: string; qr_token: string;
      angebote: { titel: string } | null;
    } | null };

  if (!buchung) {
    return NextResponse.json({ valid: false, reason: "Buchung nicht gefunden." });
  }

  if (buchung.status === "storniert") {
    return NextResponse.json({ valid: false, reason: "Diese Buchung wurde storniert." });
  }

  if (buchung.status !== "bestaetigt" && buchung.status !== "abgeschlossen") {
    return NextResponse.json({ valid: false, reason: `Buchung ist nicht bestätigt (Status: ${buchung.status}).` });
  }

  return NextResponse.json({
    valid: true,
    buchungs_nummer: buchung.buchungs_nummer,
    kunden_name: buchung.kunden_name,
    personen: buchung.personen,
    datum: new Date(buchung.datum).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
    angebot: buchung.angebote?.titel ?? null,
  });
}
