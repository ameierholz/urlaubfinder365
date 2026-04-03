import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Price-IDs aus Stripe Dashboard – nach Anlegen in .env eintragen
const PAKET_PRICE: Record<string, string> = {
  starter:  process.env.STRIPE_PRICE_WERBEPLATZ_STARTER!,
  featured: process.env.STRIPE_PRICE_WERBEPLATZ_FEATURED!,
  premium:  process.env.STRIPE_PRICE_WERBEPLATZ_PREMIUM!,
};

const PAKET_LABEL: Record<string, string> = {
  starter:  "Starter (99 €/Monat)",
  featured: "Featured (199 €/Monat)",
  premium:  "Premium (349 €/Monat)",
};

export async function POST(req: NextRequest) {
  const { name, firma, email, paket, angebotUrl, nachricht } = await req.json() as {
    name: string;
    firma: string;
    email: string;
    paket: string;
    angebotUrl?: string;
    nachricht?: string;
  };

  if (!name || !firma || !email || !paket) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  const priceId = PAKET_PRICE[paket];
  if (!priceId) {
    return NextResponse.json({ error: "Ungültiges Paket" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urlaubfinder365.de";

  // 1. Pending-Eintrag in DB anlegen (vor Zahlung — für Referenz in Webhook)
  const { data: eintrag, error: dbErr } = await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .insert({
      paket,
      preis_monatlich: paket === "starter" ? 99 : paket === "featured" ? 199 : 349,
      preis_gesamt:    paket === "starter" ? 99 : paket === "featured" ? 199 : 349,
      laufzeit_monate: 1,
      status: "offen",
      kontakt_name:   name,
      kontakt_firma:  firma,
      kontakt_email:  email,
      angebot_url:    angebotUrl ?? null,
      werbeinhalt_text: nachricht ?? null,
      stripe_price_id: priceId,
    })
    .select("id")
    .single();

  if (dbErr || !eintrag) {
    return NextResponse.json({ error: "DB-Fehler" }, { status: 500 });
  }

  // 2. Stripe Customer anlegen
  const customer = await stripe.customers.create({
    name:  `${firma} – ${name}`,
    email,
    metadata: { werbeplatz_id: eintrag.id, firma, kontakt: name },
  });

  // 3. Stripe ID in DB speichern
  await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .update({ stripe_customer_id: customer.id })
    .eq("id", eintrag.id);

  // 4. Checkout Session (Subscription)
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { werbeplatz_id: eintrag.id, paket, firma },
      trial_period_days: 0,
    },
    metadata: { typ: "werbeplatz", werbeplatz_id: eintrag.id, paket },
    customer_update: { address: "auto" },
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    invoice_creation: { enabled: false }, // Stripe erstellt Rechnungen automatisch via Subscription
    success_url: `${siteUrl}/werbeplatz/danke?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/#featured-angebote`,
    locale: "de",
    payment_method_types: ["card", "sepa_debit"],
    allow_promotion_codes: true,
    custom_text: {
      submit: {
        message: `Du buchst den ${PAKET_LABEL[paket]} – monatlich kündbar. Dein Spot wird nach Inhaltsprüfung (1–24h) aktiviert.`,
      },
    },
  });

  // 5. Checkout-Session-ID in DB speichern
  await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", eintrag.id);

  return NextResponse.json({ url: session.url });
}
