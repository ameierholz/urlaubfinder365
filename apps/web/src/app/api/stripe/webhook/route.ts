import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { sendMail, FROM_BUCHUNG } from "@/lib/email";
import { EmailBuchungsbestaetigung } from "@/emails/templates/EmailBuchungsbestaetigung";
import { EmailAnbieterNeueBuchung } from "@/emails/templates/EmailAnbieterNeueBuchung";
import { EmailAnbieterAuszahlung } from "@/emails/templates/EmailAnbieterAuszahlung";

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

        // Buchungsdaten für Emails laden
        const { data: buchung } = await supabaseAdmin
          .from("buchungen")
          .select(`
            buchungs_nummer, kunden_name, kunden_email,
            datum, personen, gesamtpreis,
            angebote:angebot_id (titel, ziel, treffpunkt),
            anbieter_profile:anbieter_id (name, email, telefon, sprache)
          `)
          .eq("id", meta.buchung_id)
          .single();

        if (buchung) {
          const angebot = buchung.angebote as { titel: string; ziel: string; treffpunkt?: string } | null;
          const anbieter = buchung.anbieter_profile as { name: string; email: string; telefon?: string; sprache?: string } | null;
          const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
          const datumFormatiert = new Date(buchung.datum).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
          const ticketUrl = `https://urlaubfinder365.de/buchung/ticket/${buchung.buchungs_nummer}/`;

          // Email an Kunden
          await sendMail({
            to: buchung.kunden_email,
            from: FROM_BUCHUNG,
            subject: `Buchungsbestätigung ${buchung.buchungs_nummer} – ${angebot?.titel ?? "Deine Buchung"}`,
            react: EmailBuchungsbestaetigung({
              name: buchung.kunden_name,
              buchungsNummer: buchung.buchungs_nummer,
              angebot: angebot?.titel ?? "–",
              anbieter: anbieter?.name ?? "–",
              datum: datumFormatiert,
              personen: buchung.personen,
              gesamtpreis: fmt(buchung.gesamtpreis),
              treffpunkt: angebot?.treffpunkt,
              ticketUrl,
            }),
          });

          // Email an Anbieter
          if (anbieter?.email) {
            await sendMail({
              to: anbieter.email,
              from: FROM_BUCHUNG,
              subject: `Neue Buchung: ${angebot?.titel ?? "–"}`,
              react: EmailAnbieterNeueBuchung({
                anbieterName: anbieter.name,
                sprache: anbieter.sprache,
                kunde: buchung.kunden_name,
                datum: datumFormatiert,
                personen: buchung.personen,
                betrag: fmt(buchung.gesamtpreis),
                angebot: angebot?.titel ?? "–",
                buchungsNummer: buchung.buchungs_nummer,
                dashboardUrl: "https://urlaubfinder365.de/anbieter/dashboard",
              }),
            });
          }
        }
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

        // Auszahlungs-Email an Anbieter
        const { data: az } = await supabaseAdmin
          .from("auszahlungen")
          .select("betrag, anbieter_id, anbieter_profile:anbieter_id(name, email, iban, sprache)")
          .eq("id", transfer.metadata.auszahlung_id)
          .single();

        if (az) {
          const ap = az.anbieter_profile as { name: string; email: string; iban?: string; sprache?: string } | null;
          if (ap?.email) {
            const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";
            const erwDatum = new Date();
            erwDatum.setDate(erwDatum.getDate() + 3);
            await sendMail({
              to: ap.email,
              from: FROM_BUCHUNG,
              subject: `Auszahlung ${fmt(az.betrag)} veranlasst`,
              react: EmailAnbieterAuszahlung({
                anbieterName: ap.name,
                sprache: ap.sprache,
                betrag: fmt(az.betrag),
                datum: erwDatum.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
                iban: ap.iban ? `****${ap.iban.slice(-4)}` : "****",
                buchungen: 0,
                referenz: transfer.id,
              }),
            });
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

