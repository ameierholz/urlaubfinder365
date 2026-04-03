import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailPreisalarm } from "@/emails/templates/EmailPreisalarm";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { angebot_id, neuerPreis } = await req.json() as { angebot_id: string; neuerPreis: number };

  const { data: angebot } = await supabaseAdmin
    .from("angebote")
    .select("titel, ziel, preis, slug")
    .eq("id", angebot_id)
    .single();

  if (!angebot) return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });

  // Alle Preisalarme für dieses Ziel abrufen
  const { data: alarme } = await supabaseAdmin
    .from("price_alerts")
    .select("user_id, users:user_id(email, kunden_name)")
    .eq("ziel", angebot.ziel)
    .lte("ziel_preis", neuerPreis);

  if (!alarme?.length) return NextResponse.json({ ok: true, sent: 0 });

  const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
  const ersparnis = angebot.preis - neuerPreis;

  let sent = 0;
  for (const alarm of alarme) {
    const user = alarm.users as { email: string; kunden_name: string } | null;
    if (!user?.email) continue;
    await sendMail({
      to: user.email,
      from: FROM_DEFAULT,
      subject: `🔔 Preisalarm: ${angebot.ziel} jetzt ${fmt(ersparnis)} günstiger!`,
      react: EmailPreisalarm({
        name: user.kunden_name,
        ziel: angebot.ziel,
        angebot: angebot.titel,
        alterPreis: fmt(angebot.preis),
        neuerPreis: fmt(neuerPreis),
        ersparnis: fmt(ersparnis),
        angebotUrl: `https://urlaubfinder365.de/marktplatz/${angebot.slug}`,
      }),
    });
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
