import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_BUCHUNG } from "@/lib/email";
import { EmailStornierung } from "@/emails/templates/EmailStornierung";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { buchung_id } = await req.json() as { buchung_id: string };

  const { data: b } = await supabaseAdmin
    .from("buchungen")
    .select("buchungs_nummer, kunden_name, kunden_email, datum, gesamtpreis, angebote:angebot_id(titel)")
    .eq("id", buchung_id)
    .single();

  if (!b?.kunden_email) return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });

  const angebot = b.angebote as unknown as { titel: string } | null;
  const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";

  await sendMail({
    to: b.kunden_email,
    from: FROM_BUCHUNG,
    subject: `Deine Buchung ${b.buchungs_nummer} wurde storniert`,
    react: EmailStornierung({
      name: b.kunden_name,
      buchungsNummer: b.buchungs_nummer,
      angebot: angebot?.titel ?? "–",
      datum: new Date(b.datum).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      gesamtpreis: fmt(b.gesamtpreis),
      erstattungInfo: "Die Erstattung wird innerhalb von 5–10 Werktagen auf dein Zahlungsmittel zurückgebucht.",
      alternativenUrl: "https://urlaubfinder365.de/marktplatz",
    }),
  });

  return NextResponse.json({ ok: true });
}
