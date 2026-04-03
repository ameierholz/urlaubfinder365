import { NextRequest, NextResponse } from "next/server";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailWillkommen } from "@/emails/templates/EmailWillkommen";

export async function POST(req: NextRequest) {
  const { email, name, typ } = await req.json() as {
    email: string;
    name: string;
    typ: "kunde" | "anbieter";
  };

  if (!email) return NextResponse.json({ error: "email fehlt" }, { status: 400 });

  await sendMail({
    to: email,
    from: FROM_DEFAULT,
    subject: typ === "anbieter"
      ? "Willkommen bei Urlaubfinder365 – dein Anbieter-Konto ist aktiv"
      : "Willkommen bei Urlaubfinder365 🌴",
    react: EmailWillkommen({ name, typ }),
  });

  return NextResponse.json({ ok: true });
}
