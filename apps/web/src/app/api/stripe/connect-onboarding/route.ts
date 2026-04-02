import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Eingeloggten User prüfen
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  // Anbieter-Profil laden
  const { data: anbieter } = await supabaseAdmin
    .from("anbieter_profile")
    .select("id, name, email, stripe_account_id, stripe_onboarding_complete")
    .eq("user_id", user.id)
    .single() as { data: {
      id: string; name: string; email: string;
      stripe_account_id: string | null; stripe_onboarding_complete: boolean;
    } | null };

  if (!anbieter) return NextResponse.json({ error: "Kein Anbieter-Profil gefunden" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urlaubfinder365.de";

  // Bestehenden Account nutzen oder neuen erstellen
  let accountId = anbieter.stripe_account_id;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: anbieter.email,
      business_profile: { name: anbieter.name },
      capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
      metadata: { anbieter_id: anbieter.id },
    });
    accountId = account.id;
    await supabaseAdmin.from("anbieter_profile")
      .update({ stripe_account_id: accountId })
      .eq("id", anbieter.id);
  }

  // Onboarding-Link generieren
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/anbieter/stripe/onboarding`,
    return_url:  `${siteUrl}/anbieter/stripe/success`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
