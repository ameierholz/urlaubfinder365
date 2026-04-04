import { NextRequest, NextResponse } from "next/server";
import { stripe, calcApplicationFee } from "@/lib/stripe";
import { rateLimit, isValidEmail, supabaseAdmin as getAdmin } from "@/lib/api-helpers";
import type Stripe from "stripe";

const supabaseAdmin = getAdmin();

function genBuchungsNummer(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `BU-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60_000);
  if (limited) return limited;

  const { angebot_slug, kunden_name, kunden_email, datum, personen, preis_pro_person, titel } =
    await req.json();

  if (!kunden_name || !kunden_email || !datum || !personen || !preis_pro_person) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  if (!isValidEmail(kunden_email)) {
    return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
  }

  // Angebot und Anbieter per Slug nachschlagen (optional — FK ist nullable)
  let angebot_id: string | null = null;
  let anbieter_id: string | null = null;
  let angebot_titel = titel ?? "Aktivitätsbuchung";
  let anbieter: { name: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean } | null = null;

  if (angebot_slug) {
    const { data: angebot } = await supabaseAdmin
      .from("angebote")
      .select("id, titel, anbieter_id, anbieter_profile(name, stripe_account_id, stripe_onboarding_complete)")
      .eq("slug", angebot_slug)
      .maybeSingle() as {
        data: {
          id: string; titel: string; anbieter_id: string | null;
          anbieter_profile: { name: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean } | null;
        } | null
      };

    if (angebot) {
      angebot_id = angebot.id;
      anbieter_id = angebot.anbieter_id;
      angebot_titel = angebot.titel;
      anbieter = angebot.anbieter_profile;
    }
  }

  const gesamtpreis = Number(preis_pro_person) * Number(personen);
  const provision_betrag = calcApplicationFee(gesamtpreis) / 100; // in EUR
  const auszahlungs_betrag = gesamtpreis - provision_betrag;
  const buchungs_nummer = genBuchungsNummer();

  // Buchung in DB anlegen
  const { data: buchung, error: dbErr } = await supabaseAdmin
    .from("buchungen")
    .insert({
      buchungs_nummer,
      angebot_id,
      anbieter_id,
      kunden_name,
      kunden_email,
      datum,
      personen: Number(personen),
      gesamtpreis,
      provision_betrag,
      auszahlungs_betrag,
      status: "ausstehend",
    })
    .select("id")
    .single() as { data: { id: string } | null; error: unknown };

  if (dbErr || !buchung) {
    console.error("Buchung DB Fehler:", dbErr);
    return NextResponse.json({ error: "Buchung konnte nicht gespeichert werden" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubfinder365.de";
  const preisInCent = Math.round(gesamtpreis * 100);
  const applicationFeeInCent = calcApplicationFee(gesamtpreis);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: kunden_email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: preisInCent,
          product_data: {
            name: angebot_titel,
            description: `${personen} Person(en) · ${new Date(datum).toLocaleDateString("de-DE")}${anbieter ? ` · ${anbieter.name}` : ""}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { typ: "buchung", buchung_id: buchung.id, buchungs_nummer },
    success_url: `${siteUrl}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}&buchung=${buchungs_nummer}`,
    cancel_url:  `${siteUrl}/buchung/abgebrochen?buchung=${buchungs_nummer}`,
    payment_intent_data: {
      description: `UF365 ${buchungs_nummer} – ${angebot_titel}`,
      metadata: { buchung_id: buchung.id, buchungs_nummer },
    },
  };

  // Stripe Connect: Direktüberweisung an Anbieter wenn Konto verbunden
  if (anbieter?.stripe_account_id && anbieter?.stripe_onboarding_complete) {
    sessionParams.payment_intent_data = {
      ...sessionParams.payment_intent_data,
      application_fee_amount: applicationFeeInCent,
      transfer_data: { destination: anbieter.stripe_account_id },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams, {
    idempotencyKey: `checkout-${buchung.id}`,
  });

  await supabaseAdmin
    .from("buchungen")
    .update({ stripe_checkout_session_id: session.id, stripe_payment_status: "pending" })
    .eq("id", buchung.id);

  return NextResponse.json({ url: session.url });
}
