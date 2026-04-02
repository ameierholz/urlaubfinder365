import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Supabase Admin Client (umgeht RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {

    // ── Buchung bezahlt ──────────────────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};

      if (meta.typ === "buchung" && meta.buchung_id) {
        await supabaseAdmin.from("buchungen").update({
          status: "bestaetigt",
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_checkout_session_id: session.id,
          stripe_payment_status: session.payment_status,
        }).eq("id", meta.buchung_id);
      }

      if (meta.typ === "werbung" && meta.werbung_id) {
        await supabaseAdmin.from("werbeplaetze_buchungen").update({
          status: "bestaetigt",
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          bezahlt_at: new Date().toISOString(),
        }).eq("id", meta.werbung_id);
      }
      break;
    }

    // ── Zahlung fehlgeschlagen ───────────────────────────────────
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      if (meta.typ === "buchung" && meta.buchung_id) {
        await supabaseAdmin.from("buchungen").update({
          stripe_payment_status: "expired",
        }).eq("id", meta.buchung_id);
      }
      break;
    }

    // ── Stripe Connect: Account vollständig eingerichtet ─────────
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      if (account.charges_enabled && account.details_submitted) {
        await supabaseAdmin.from("anbieter_profile").update({
          stripe_onboarding_complete: true,
        }).eq("stripe_account_id", account.id);
      }
      break;
    }

    // ── Transfer an Anbieter erfolgreich ─────────────────────────
    case "transfer.created": {
      const transfer = event.data.object as Stripe.Transfer;
      if (transfer.metadata?.auszahlung_id) {
        await supabaseAdmin.from("auszahlungen").update({
          stripe_transfer_id: transfer.id,
          status: "ueberwiesen",
          ueberwiesen_at: new Date().toISOString(),
          referenz: `Stripe Transfer ${transfer.id}`,
        }).eq("id", transfer.metadata.auszahlung_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Stripe braucht den Raw Body — kein Parsen durch Next.js
export const config = { api: { bodyParser: false } };
