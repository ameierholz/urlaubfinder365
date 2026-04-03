import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_BUCHUNG } from "@/lib/email";
import { EmailErinnerung48h } from "@/emails/templates/EmailErinnerung48h";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Buchungen, die in ~48h stattfinden (morgen + übermorgen)
  const in48h = new Date();
  in48h.setHours(in48h.getHours() + 48);
  const von = new Date(in48h);
  von.setHours(0, 0, 0, 0);
  const bis = new Date(in48h);
  bis.setHours(23, 59, 59, 999);

  const { data: buchungen } = await supabaseAdmin
    .from("buchungen")
    .select(`
      kunden_name, kunden_email, buchungs_nummer,
      datum, personen,
      angebote:angebot_id (titel, treffpunkt, treffpunkt_hinweis),
      anbieter_profile:anbieter_id (name, telefon)
    `)
    .eq("status", "bestaetigt")
    .gte("datum", von.toISOString().split("T")[0])
    .lte("datum", bis.toISOString().split("T")[0]);

  if (!buchungen) return NextResponse.json({ ok: true, sent: 0 });

  let sent = 0;
  for (const b of buchungen) {
    const angebot = b.angebote as unknown as { titel: string; treffpunkt?: string } | null;
    const anbieter = b.anbieter_profile as unknown as { name: string; telefon?: string } | null;
    await sendMail({
      to: b.kunden_email,
      from: FROM_BUCHUNG,
      subject: `Erinnerung: ${angebot?.titel ?? "Deine Tour"} startet in 48h`,
      react: EmailErinnerung48h({
        name: b.kunden_name,
        angebot: angebot?.titel ?? "–",
        datum: new Date(b.datum).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        treffpunkt: angebot?.treffpunkt,
        anbieterTelefon: anbieter?.telefon,
        ticketUrl: `https://urlaubfinder365.de/buchung/ticket/${b.buchungs_nummer}/`,
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
