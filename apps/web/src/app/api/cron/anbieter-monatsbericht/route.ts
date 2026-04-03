import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_BUCHUNG } from "@/lib/email";
import { EmailAnbieterMonatsbericht } from "@/emails/templates/EmailAnbieterMonatsbericht";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  // Sicherheit: nur Vercel Cron darf diese Route aufrufen
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const vormonat = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const von = new Date(vormonat.getFullYear(), vormonat.getMonth(), 1).toISOString();
  const bis = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monatLabel = vormonat.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  // Alle Anbieter mit Buchungen im Vormonat
  const { data: anbieter } = await supabaseAdmin
    .from("anbieter_profile")
    .select("id, name, email, sprache");

  if (!anbieter) return NextResponse.json({ ok: true, count: 0 });

  let sent = 0;
  for (const a of anbieter) {
    const { data: buchungen } = await supabaseAdmin
      .from("buchungen")
      .select("datum, personen, gesamtpreis, angebote:angebot_id(titel)")
      .eq("anbieter_id", a.id)
      .eq("status", "abgeschlossen")
      .gte("created_at", von)
      .lt("created_at", bis);

    if (!buchungen || buchungen.length === 0) continue;

    const gesamtEinnahmen = buchungen.reduce((s, b) => s + (b.gesamtpreis ?? 0), 0);
    const provision = gesamtEinnahmen * 0.15;
    const auszahlung = gesamtEinnahmen - provision;

    const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";

    await sendMail({
      to: a.email,
      from: FROM_BUCHUNG,
      subject: `Monatsbericht ${monatLabel} – Urlaubfinder365`,
      react: EmailAnbieterMonatsbericht({
        anbieterName: a.name,
        sprache: a.sprache,
        monat: monatLabel,
        buchungen: buchungen.map((b) => ({
          datum: new Date(b.datum).toLocaleDateString("de-DE"),
          angebot: (b.angebote as { titel: string } | null)?.titel ?? "–",
          personen: b.personen,
          betrag: fmt(b.gesamtpreis ?? 0),
        })),
        gesamtEinnahmen: fmt(gesamtEinnahmen),
        provision: fmt(provision),
        auszahlung: fmt(auszahlung),
        dashboardUrl: "https://urlaubfinder365.de/anbieter/dashboard",
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
