import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailAnbieterBewertung } from "@/emails/templates/EmailAnbieterBewertung";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { anbieter_id, sterne, kommentar, angebot } = await req.json() as {
    anbieter_id: string;
    sterne: number;
    kommentar: string;
    angebot: string;
  };

  const { data: anbieter } = await supabaseAdmin
    .from("anbieter_profile")
    .select("name, email, sprache")
    .eq("id", anbieter_id)
    .single();

  if (!anbieter?.email) return NextResponse.json({ error: "Anbieter nicht gefunden" }, { status: 404 });

  await sendMail({
    to: anbieter.email,
    from: FROM_DEFAULT,
    subject: `Neue Bewertung für ${angebot}: ${"⭐".repeat(sterne)}`,
    react: EmailAnbieterBewertung({
      anbieterName: anbieter.name,
      sprache: anbieter.sprache,
      sterne,
      kommentar,
      angebot,
      dashboardUrl: "https://urlaubfinder365.de/anbieter/dashboard",
    }),
  });

  return NextResponse.json({ ok: true });
}
