import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generiert eine Stripe Customer Portal Session für Werbeplatz-Kunden.
// Aufruf: POST mit { werbeplatz_id } oder { stripe_customer_id }
// Anbieter können damit: Abo kündigen, Zahlungsmethode ändern, Rechnungen herunterladen
export async function POST(req: NextRequest) {
  const { werbeplatz_id, stripe_customer_id: directCustomerId } = await req.json() as {
    werbeplatz_id?: string;
    stripe_customer_id?: string;
  };

  let customerId = directCustomerId;

  if (!customerId && werbeplatz_id) {
    const { data } = await supabaseAdmin
      .from("werbeplaetze_buchungen")
      .select("stripe_customer_id")
      .eq("id", werbeplatz_id)
      .single();
    customerId = data?.stripe_customer_id ?? undefined;
  }

  if (!customerId) {
    return NextResponse.json({ error: "Kein Stripe-Kunde gefunden" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urlaubfinder365.de";
  const portalFallback = process.env.STRIPE_CUSTOMER_PORTAL_URL ?? siteUrl;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: siteUrl,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    // Fallback auf den statischen Portal-Link
    return NextResponse.json({ url: portalFallback });
  }
}
