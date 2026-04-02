import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAKET_LABEL: Record<string, string> = {
  stadt_unten:        "Stadtseite Banner",
  stadt_oben:         "Stadtseite Top-Platz",
  kategorie:          "Themenseite",
  region:             "Regionspaket",
  homepage:           "Marktplatz-Startseite",
  rundum:             "Rundum-Paket",
  anbieter_spotlight: "Anbieter-Spotlight",
};

export async function POST(req: NextRequest) {
  const { werbung_id } = await req.json();
  if (!werbung_id) return NextResponse.json({ error: "werbung_id fehlt" }, { status: 400 });

  const { data: buchung } = await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .select("*, anbieter_profile(name, email)")
    .eq("id", werbung_id)
    .single() as { data: {
      id: string; paket: string; zielseite: string | null; laufzeit_monate: number;
      preis_gesamt: number; preis_monatlich: number;
      anbieter_profile: { name: string; email: string };
    } | null };

  if (!buchung) return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });

  const preisInCent = Math.round(Number(buchung.preis_gesamt) * 100);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubfinder365.de";
  const paketName = PAKET_LABEL[buchung.paket] ?? buchung.paket;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: buchung.anbieter_profile.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: preisInCent,
          product_data: {
            name: `Werbeplatz: ${paketName}`,
            description: [
              buchung.zielseite ? `Zielseite: ${buchung.zielseite}` : null,
              `Laufzeit: ${buchung.laufzeit_monate} Monat${buchung.laufzeit_monate > 1 ? "e" : ""}`,
              `${Number(buchung.preis_monatlich).toFixed(2)} €/Monat`,
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
      description: `UF365 Werbeplatz – ${paketName} – ${buchung.anbieter_profile.name}`,
      metadata: { werbung_id: buchung.id },
    },
  });

  await supabaseAdmin.from("werbeplaetze_buchungen")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", werbung_id);

  return NextResponse.json({ url: session.url });
}
