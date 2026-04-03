import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailBewertungsanfrage } from "@/emails/templates/EmailBewertungsanfrage";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Buchungen, deren Datum gestern war → Bewertungsanfrage senden
  const gestern = new Date();
  gestern.setDate(gestern.getDate() - 1);
  const tag = gestern.toISOString().split("T")[0];

  const { data: buchungen } = await supabaseAdmin
    .from("buchungen")
    .select(`
      kunden_name, kunden_email, buchungs_nummer,
      angebote:angebot_id (id, titel)
    `)
    .eq("status", "abgeschlossen")
    .eq("datum", tag)
    .eq("bewertung_angefragt", false); // verhindert doppeltes Senden

  if (!buchungen) return NextResponse.json({ ok: true, sent: 0 });

  let sent = 0;
  for (const b of buchungen) {
    const angebot = b.angebote as unknown as { id: string; titel: string } | null;
    await sendMail({
      to: b.kunden_email,
      from: FROM_DEFAULT,
      subject: `Wie war dein Erlebnis? – ${angebot?.titel ?? "Deine Tour"}`,
      react: EmailBewertungsanfrage({
        name: b.kunden_name,
        angebot: angebot?.titel ?? "–",
        bewertungsUrl: `https://urlaubfinder365.de/marktplatz/${angebot?.id ?? ""}?bewerten=1`,
      }),
    });
    // Markieren damit nicht erneut gesendet wird
    await supabaseAdmin
      .from("buchungen")
      .update({ bewertung_angefragt: true })
      .eq("buchungs_nummer", b.buchungs_nummer);
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
