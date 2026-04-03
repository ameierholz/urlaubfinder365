import { NextRequest, NextResponse } from "next/server";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailWerbeplatzAnfrage } from "@/emails/templates/EmailWerbeplatzAnfrage";

export async function POST(req: NextRequest) {
  const { name, firma, email, angebotUrl, nachricht } = await req.json() as {
    name: string;
    firma: string;
    email: string;
    angebotUrl?: string;
    nachricht?: string;
  };

  if (!name || !firma || !email) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  await sendMail({
    to: "info@urlaubfinder365.de",
    from: FROM_DEFAULT,
    replyTo: email,
    subject: `Werbeplatz-Anfrage von ${firma}`,
    react: EmailWerbeplatzAnfrage({ name, firma, email, angebotUrl, nachricht }),
  });

  return NextResponse.json({ ok: true });
}
