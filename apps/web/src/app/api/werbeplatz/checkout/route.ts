import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Monatspreise je Paket in EUR
const PAKET_PREISE: Record<string, number> = {
  stadt_unten: 29,
  stadt_oben:  49,
  kategorie:   39,
  region:      59,
  homepage:    99,
  rundum:      149,
};

const PAKET_LABEL: Record<string, string> = {
  stadt_unten: "Stadtseite Banner",
  stadt_oben:  "Stadtseite Premium",
  kategorie:   "Themenseite",
  region:      "Regionspaket",
  homepage:    "Marktplatz-Startseite",
  rundum:      "Rundum-Paket",
};

// Rabatt je Laufzeit (%)
const LAUFZEIT_RABATT: Record<number, number> = { 1: 0, 3: 10, 6: 15, 12: 20 };

export async function POST(req: NextRequest) {
  // Authentifizierung — Anbieter muss eingeloggt sein
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, name, email")
    .eq("user_id", user.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; name: string; email: string } | null;
  if (!profil) return NextResponse.json({ error: "Kein Anbieter-Profil gefunden" }, { status: 403 });

  const { paket, laufzeit_monate, zielseite } = await req.json();

  if (!PAKET_PREISE[paket]) return NextResponse.json({ error: "Ungültiges Paket" }, { status: 400 });
  if (![1, 3, 6, 12].includes(Number(laufzeit_monate))) {
    return NextResponse.json({ error: "Ungültige Laufzeit" }, { status: 400 });
  }

  const laufzeit = Number(laufzeit_monate);
  const preisMonatlich = PAKET_PREISE[paket];
  const rabatt = LAUFZEIT_RABATT[laufzeit] ?? 0;
  const preisMonatlichRabatt = preisMonatlich * (1 - rabatt / 100);
  const preisGesamt = Math.round(preisMonatlichRabatt * laufzeit * 100) / 100;

  // werbeplaetze_buchungen Eintrag erstellen
  const { data: buchung, error: dbErr } = await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .insert({
      anbieter_id:    profil.id,
      paket,
      zielseite:      zielseite || null,
      laufzeit_monate: laufzeit,
      preis_monatlich: preisMonatlichRabatt,
      preis_gesamt:   preisGesamt,
      status:         "ausstehend",
    })
    .select("id")
    .single() as { data: { id: string } | null; error: unknown };

  if (dbErr || !buchung) {
    console.error("Werbeplatz DB Fehler:", dbErr);
    return NextResponse.json({ error: "Buchung konnte nicht gespeichert werden" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubfinder365.de";
  const paketName = PAKET_LABEL[paket] ?? paket;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: profil.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(preisGesamt * 100),
          product_data: {
            name: `Werbeplatz: ${paketName}`,
            description: [
              zielseite ? `Zielseite: ${zielseite}` : null,
              `Laufzeit: ${laufzeit} Monat${laufzeit > 1 ? "e" : ""}`,
              `${preisMonatlichRabatt.toFixed(2)} €/Monat`,
              rabatt > 0 ? `${rabatt}% Laufzeitrabatt` : null,
            ].filter(Boolean).join(" · "),
          },
        },
        quantity: 1,
      },
    ],
    metadata: { typ: "werbung", werbung_id: buchung.id },
    success_url: `${siteUrl}/anbieter/werbung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/anbieter/werbeplatz/`,
    payment_intent_data: {
      description: `UF365 Werbeplatz – ${paketName} – ${profil.name}`,
      metadata: { werbung_id: buchung.id },
    },
  });

  await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", buchung.id);

  return NextResponse.json({ url: session.url });
}
