import { NextRequest, NextResponse } from "next/server";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailWillkommen } from "@/emails/templates/EmailWillkommen";
import { rateLimit, isValidEmail } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60_000); // max. 5 Willkommens-Mails/Minute pro IP
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const { email, name, typ } = body as { email?: string; name?: string; typ?: string };

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
  }

  if (typ !== "kunde" && typ !== "anbieter") {
    return NextResponse.json({ error: "Ungültiger Typ" }, { status: 400 });
  }

  const safeName = typeof name === "string" ? name.slice(0, 200) : "";

  await sendMail({
    to: email,
    from: FROM_DEFAULT,
    subject: typ === "anbieter"
      ? "Willkommen bei Urlaubfinder365 – dein Anbieter-Konto ist aktiv"
      : "Willkommen bei Urlaubfinder365 🌴",
    react: EmailWillkommen({ name: safeName, typ }),
  });

  return NextResponse.json({ ok: true });
}
