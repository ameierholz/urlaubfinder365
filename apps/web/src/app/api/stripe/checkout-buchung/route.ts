import { NextRequest, NextResponse } from "next/server";
import { stripe, calcApplicationFee } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { buchung_id } = await req.json();
  if (!buchung_id) return NextResponse.json({ error: "buchung_id fehlt" }, { status: 400 });

  // Buchung + Angebot + Anbieter laden
  const { data: buchung } = await supabaseAdmin
    .from("buchungen")
    .select("*, angebote(titel, foto_url), anbieter_profile(name, stripe_account_id, stripe_onboarding_complete)")
    .eq("id", buchung_id)
    .single() as { data: {
      id: string; buchungs_nummer: string; kunden_name: string; kunden_email: string;
      gesamtpreis: number; personen: number; datum: string;
      angebote: { titel: string; foto_url: string | null };
      anbieter_profile: { name: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean };
    } | null };

  if (!buchung) return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });

  const anbieter = buchung.anbieter_profile;
  const preisInCent = Math.round(Number(buchung.gesamtpreis) * 100);
  const applicationFee = calcApplicationFee(Number(buchung.gesamtpreis));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubfinder365.de";

  // Checkout Session Optionen
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: buchung.kunden_email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: preisInCent,
          product_data: {
            name: buchung.angebote?.titel ?? "Aktivitätsbuchung",
            description: `${buchung.personen} Person(en) · ${new Date(buchung.datum).toLocaleDateString("de-DE")} · Anbieter: ${anbieter.name}`,
            images: buchung.angebote?.foto_url ? [buchung.angebote.foto_url] : [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: { typ: "buchung", buchung_id: buchung.id, buchungs_nummer: buchung.buchungs_nummer },
    success_url: `${siteUrl}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}&buchung=${buchung.buchungs_nummer}`,
    cancel_url:  `${siteUrl}/buchung/abgebrochen?buchung=${buchung.buchungs_nummer}`,
    payment_intent_data: {
      description: `UF365 Buchung ${buchung.buchungs_nummer} – ${buchung.angebote?.titel}`,
      metadata: { buchung_id: buchung.id, buchungs_nummer: buchung.buchungs_nummer },
    },
  };

  // Stripe Connect: Anbieter-Anteil automatisch überweisen (falls Konto verbunden)
  if (anbieter.stripe_account_id && anbieter.stripe_onboarding_complete) {
    sessionParams.payment_intent_data = {
      ...sessionParams.payment_intent_data,
      application_fee_amount: applicationFee,
      transfer_data: { destination: anbieter.stripe_account_id },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  // Checkout Session ID in Buchung speichern
  await supabaseAdmin.from("buchungen")
    .update({ stripe_checkout_session_id: session.id, stripe_payment_status: "pending" })
    .eq("id", buchung_id);

  return NextResponse.json({ url: session.url });
}
