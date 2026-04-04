import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/api-helpers";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? "2"); // Default Liste ID 2

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60_000);
  if (limited) return limited;

  try {
    const { email, firstName, lastName, action } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
      // Kein API-Key konfiguriert → trotzdem 200 (für Dev-Modus)
      console.warn("BREVO_API_KEY nicht gesetzt");
      return NextResponse.json({ success: true, dev: true });
    }

    if (action === "unsubscribe") {
      // Abmelden
      const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailBlacklisted: true }),
      });
      return NextResponse.json({ success: res.ok });
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    // Double-Opt-In: Brevo sendet Bestaetigungsmail mit Template #1
    const body: Record<string, unknown> = {
      email,
      includeListIds: [BREVO_LIST_ID],
      templateId: 1,
      redirectionUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urlaubfinder365.de"}/newsletter-bestaetigt/`,
      attributes: {
        VORNAME: firstName ?? "",
        NACHNAME: lastName ?? "",
      },
    };

    const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Brevo Fehler:", err);
      return NextResponse.json({ error: "Newsletter-Anmeldung fehlgeschlagen" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Newsletter API Error:", e);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
