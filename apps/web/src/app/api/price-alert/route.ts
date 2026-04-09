import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Admin-Client (Service Role) für serverseitige Writes ohne Auth
function adminClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, destinationSlug, destinationName, maxPrice } = body;

    // --- Validierung ---
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Bitte gib eine gültige E-Mail-Adresse ein." }, { status: 400 });
    }
    if (!destinationSlug || typeof destinationSlug !== "string") {
      return NextResponse.json({ error: "Ungültiges Reiseziel." }, { status: 400 });
    }
    if (!maxPrice || typeof maxPrice !== "number" || maxPrice <= 0) {
      return NextResponse.json({ error: "Der Wunschpreis muss größer als 0 sein." }, { status: 400 });
    }

    const supabase = adminClient();

    // --- Rate Limiting: max. 5 Alarme pro E-Mail ---
    const { count } = await supabase
      .from("price_alerts")
      .select("id", { count: "exact", head: true })
      .eq("email", email.toLowerCase().trim());

    if ((count ?? 0) >= 5) {
      return NextResponse.json(
        { error: "Maximal 5 Preisalarme pro E-Mail-Adresse erlaubt." },
        { status: 429 }
      );
    }

    // --- Duplikat-Check: gleiche E-Mail + gleicher Slug ---
    const { data: existing } = await supabase
      .from("price_alerts")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .eq("destination", destinationSlug)
      .maybeSingle();

    if (existing) {
      // Update Wunschpreis statt Duplikat anlegen
      await supabase
        .from("price_alerts")
        .update({ max_price: maxPrice, enabled: true })
        .eq("id", existing.id);

      return NextResponse.json({ success: true, updated: true });
    }

    // --- Preisalarm speichern ---
    const { error: insertError } = await supabase.from("price_alerts").insert({
      user_id:          null,
      email:            email.toLowerCase().trim(),
      destination:      destinationSlug,
      destination_name: destinationName ?? destinationSlug,
      max_price:        maxPrice,
      enabled:          true,
    });

    if (insertError) {
      console.error("[price-alert] insert error:", insertError);
      return NextResponse.json({ error: "Fehler beim Speichern. Bitte später erneut versuchen." }, { status: 500 });
    }

    // --- E-Mail auch in Newsletter-Tabelle eintragen (Double-Opt-In via Newsletter-Flow) ---
    try {
      await fetch(`${req.nextUrl.origin}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:     email.toLowerCase().trim(),
          action:    "subscribe",
          source:    "price-alert",
          firstName: "",
          lastName:  "",
        }),
      });
    } catch (newsletterErr) {
      // Newsletter-Fehler darf Preisalarm nicht blockieren
      console.warn("[price-alert] newsletter sync failed:", newsletterErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[price-alert] unexpected error:", err);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
