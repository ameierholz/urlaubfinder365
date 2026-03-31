import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? "2"); // Default Liste ID 2

export async function POST(req: NextRequest) {
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

    // Anmelden / aktualisieren
    const body: Record<string, unknown> = {
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true, // existierende Kontakte updaten statt Fehler
      attributes: {
        VORNAME: firstName ?? "",
        NACHNAME: lastName ?? "",
        OPT_IN: true,
        OPT_IN_DATE: new Date().toISOString().split("T")[0],
      },
    };

    const res = await fetch("https://api.brevo.com/v3/contacts", {
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
