import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin as getAdmin } from "@/lib/api-helpers";
import { stripe } from "@/lib/stripe";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailWerbeplatzFreigabe } from "@/emails/templates/EmailWerbeplatzFreigabe";
import { EmailWerbeplatzAbgelehnt } from "@/emails/templates/EmailWerbeplatzAbgelehnt";

const supabaseAdmin = getAdmin();

const PAKET_LABEL: Record<string, string> = {
  starter:  "Starter (99 €/Monat)",
  featured: "Featured (199 €/Monat)",
  premium:  "Premium (349 €/Monat)",
};

export async function POST(req: NextRequest) {
  // Admin-Auth + Rollen-Prüfung
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });

  const { id, aktion, grund } = await req.json() as {
    id: string;
    aktion: "freigeben" | "ablehnen";
    grund?: string;
  };

  const { data: wp } = await supabaseAdmin
    .from("werbeplaetze_buchungen")
    .select("*")
    .eq("id", id)
    .single() as { data: {
      id: string;
      stripe_subscription_id: string | null;
      stripe_customer_id: string | null;
      kontakt_name: string;
      kontakt_firma: string;
      kontakt_email: string;
      paket: string;
      status: string;
    } | null };

  if (!wp) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.urlaubfinder365.de";
  const paketLabel = PAKET_LABEL[wp.paket] ?? wp.paket;

  // ── FREIGEBEN ────────────────────────────────────────────────────
  if (aktion === "freigeben") {
    const now = new Date();
    await supabaseAdmin.from("werbeplaetze_buchungen").update({
      status: "aktiv",
      starts_at: now.toISOString(),
      sub_status: "active",
    }).eq("id", id);

    // Stripe Customer Portal URL generieren
    const portalFallback = process.env.STRIPE_CUSTOMER_PORTAL_URL ?? siteUrl;
    let portalUrl = portalFallback;
    if (wp.stripe_customer_id) {
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: wp.stripe_customer_id,
          return_url: siteUrl,
        });
        portalUrl = session.url;
      } catch { /* Fallback auf statischen Link */ }
    }

    if (wp.kontakt_email) {
      await sendMail({
        to: wp.kontakt_email,
        from: FROM_DEFAULT,
        subject: `🚀 Dein Werbeplatz ist live – ${wp.kontakt_firma}`,
        react: EmailWerbeplatzFreigabe({
          name:      wp.kontakt_name,
          firma:     wp.kontakt_firma,
          paket:     paketLabel,
          portalUrl,
        }),
      });
    }

    return NextResponse.json({ ok: true, aktion: "freigegeben" });
  }

  // ── ABLEHNEN ─────────────────────────────────────────────────────
  if (aktion === "ablehnen") {
    // Stripe Subscription sofort canceln + Refund des letzten Payments
    if (wp.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(wp.stripe_subscription_id, {
          cancellation_details: { comment: grund ?? "Inhalt abgelehnt durch Admin" },
        });
      } catch (e) {
        console.error("[werbeplatz-ablehnen] Stripe cancel error:", e);
      }

      // Letzte erfolgreiche Invoice finden und erstatten
      try {
        const invoices = await stripe.invoices.list({
          subscription: wp.stripe_subscription_id,
          limit: 1,
          status: "paid",
        });
        const inv = invoices.data[0] as (typeof invoices.data[0]) & { payment_intent?: string | null };
        if (inv?.payment_intent && typeof inv.payment_intent === "string") {
          await stripe.refunds.create({ payment_intent: inv.payment_intent });
        }
      } catch (e) {
        console.error("[werbeplatz-ablehnen] Refund error:", e);
      }
    }

    await supabaseAdmin.from("werbeplaetze_buchungen").update({
      status: "storniert",
      sub_status: "canceled",
      gekuendigt_at: new Date().toISOString(),
      admin_notiz: grund ?? null,
    }).eq("id", id);

    if (wp.kontakt_email) {
      await sendMail({
        to: wp.kontakt_email,
        from: FROM_DEFAULT,
        subject: `Werbeplatz nicht freigegeben – ${wp.kontakt_firma}`,
        react: EmailWerbeplatzAbgelehnt({
          name:  wp.kontakt_name,
          firma: wp.kontakt_firma,
          paket: paketLabel,
          grund,
        }),
      });
    }

    return NextResponse.json({ ok: true, aktion: "abgelehnt" });
  }

  return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });
}
