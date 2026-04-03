import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAKET_PREISE: Record<string, number> = {
  stadt_unten:        49,
  stadt_oben:         79,
  anbieter_spotlight: 99,
  kategorie:          99,
  region:             149,
  homepage:           199, // legacy
  featured:           199,
  rundum:             299,
  starter:            99,
  premium:            349,
};

const PAKET_LABEL: Record<string, string> = {
  stadt_unten:        "Stadtseite Banner",
  stadt_oben:         "Stadtseite Top-Platz",
  anbieter_spotlight: "Anbieter-Spotlight",
  kategorie:          "Themenseite",
  region:             "Regionspaket",
  homepage:           "Marktplatz-Startseite",
  featured:           "Homepage Featured",
  rundum:             "Rundum-Paket",
  starter:            "Homepage Starter",
  premium:            "Homepage Premium",
};

// Homepage-Carousel-Pakete: feste Stripe Price IDs (monatlich, kein Laufzeitrabatt)
const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  starter:  process.env.STRIPE_PRICE_WERBEPLATZ_STARTER,
  featured: process.env.STRIPE_PRICE_WERBEPLATZ_FEATURED,
  homepage: process.env.STRIPE_PRICE_WERBEPLATZ_FEATURED, // legacy → featured
  premium:  process.env.STRIPE_PRICE_WERBEPLATZ_PREMIUM,
};

const LAUFZEIT_RABATT: Record<number, number> = { 1: 0, 3: 10, 6: 15, 12: 20 };

export async function POST(req: NextRequest) {
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
  const isFixedPrice = !!STRIPE_PRICE_IDS[paket];
  const rabatt = isFixedPrice ? 0 : (LAUFZEIT_RABATT[laufzeit] ?? 0);
  const preisMonatlichRabatt = Math.round(preisMonatlich * (1 - rabatt / 100) * 100) / 100;
  const preisGesamt = isFixedPrice ? preisMonatlichRabatt : Math.round(preisMonatlichRabatt * laufzeit * 100) / 100;
  const paketName = PAKET_LABEL[paket] ?? paket;

  // DB-Eintrag anlegen
  const { data: buchung, error: dbErr } = await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .insert({
      anbieter_id:     profil.id,
      paket,
      zielseite:       zielseite || null,
      laufzeit_monate: isFixedPrice ? 1 : laufzeit,
      preis_monatlich: preisMonatlichRabatt,
      preis_gesamt:    preisGesamt,
      status:          "offen",
      kontakt_name:    profil.name,
      kontakt_email:   profil.email,
      stripe_price_id: STRIPE_PRICE_IDS[paket] ?? null,
    })
    .select("id")
    .single() as { data: { id: string } | null; error: unknown };

  if (dbErr || !buchung) return NextResponse.json({ error: "DB-Fehler" }, { status: 500 });

  // Stripe Customer anlegen
  const customer = await stripe.customers.create({
    email: profil.email,
    name:  profil.name,
    metadata: { werbeplatz_id: buchung.id, anbieter_id: profil.id },
  });

  await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .update({ stripe_customer_id: customer.id })
    .eq("id", buchung.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urlaubfinder365.de";

  // Laufzeit-Ende (nur für Placement-Pakete mit fester Laufzeit)
  const cancelAt = isFixedPrice ? undefined : Math.floor(Date.now() / 1000) + laufzeit * 30 * 24 * 60 * 60;

  // Line Items: feste Price-ID oder dynamisch
  const lineItems = isFixedPrice
    ? [{ price: STRIPE_PRICE_IDS[paket]!, quantity: 1 }]
    : [{
        price_data: {
          currency: "eur",
          unit_amount: Math.round(preisMonatlichRabatt * 100),
          recurring: { interval: "month" as const },
          product_data: {
            name: `Werbeplatz: ${paketName}`,
            description: [
              zielseite ? `Zielseite: ${zielseite}` : null,
              `${laufzeit} Monat${laufzeit > 1 ? "e" : ""}`,
              rabatt > 0 ? `${rabatt}% Laufzeitrabatt` : null,
            ].filter(Boolean).join(" · "),
          },
        },
        quantity: 1,
      }];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: lineItems,
    subscription_data: {
      ...(cancelAt ? { cancel_at: cancelAt } : {}),
      metadata: { werbeplatz_id: buchung.id, paket, anbieter_id: profil.id },
    },
    metadata: { typ: "werbeplatz", werbeplatz_id: buchung.id, paket },
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    allow_promotion_codes: true,
    locale: "de",
    payment_method_types: ["card", "sepa_debit"],
    custom_text: {
      submit: {
        message: isFixedPrice
          ? `Du buchst ${paketName} – monatlich kündbar. Freischaltung nach Inhaltsprüfung (max. 24 h).`
          : `Du buchst ${paketName} für ${laufzeit} Monat${laufzeit > 1 ? "e" : ""} – endet automatisch. Freischaltung nach Inhaltsprüfung (max. 24 h).`,
      },
    },
    success_url: `${siteUrl}/werbeplatz/danke?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/anbieter/werbeplatz/`,
  });

  await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", buchung.id);

  return NextResponse.json({ url: session.url });
}
