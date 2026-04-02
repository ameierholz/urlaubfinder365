import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Nur Admins
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("users").select("role").eq("id", user.id).single() as { data: { role: string } | null };
  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
  }

  const { auszahlung_id } = await req.json();
  if (!auszahlung_id) return NextResponse.json({ error: "auszahlung_id fehlt" }, { status: 400 });

  // Auszahlung + Anbieter laden
  const { data: auszahlung } = await supabaseAdmin
    .from("auszahlungen")
    .select("*, anbieter_profile(name, stripe_account_id, stripe_onboarding_complete)")
    .eq("id", auszahlung_id)
    .single() as { data: {
      id: string; betrag: number; status: string; stripe_transfer_id: string | null;
      anbieter_profile: { name: string; stripe_account_id: string | null; stripe_onboarding_complete: boolean };
    } | null };

  if (!auszahlung) return NextResponse.json({ error: "Auszahlung nicht gefunden" }, { status: 404 });
  if (auszahlung.status === "ueberwiesen") return NextResponse.json({ error: "Bereits überwiesen" }, { status: 400 });

  const anbieter = auszahlung.anbieter_profile;

  // Stripe Connect Transfer
  if (!anbieter.stripe_account_id || !anbieter.stripe_onboarding_complete) {
    return NextResponse.json({
      error: "Anbieter hat kein verknüpftes Stripe-Konto. Bitte zuerst Stripe Connect einrichten.",
      fallback: true,
    }, { status: 400 });
  }

  const betragInCent = Math.round(Number(auszahlung.betrag) * 100);
  const transfer = await stripe.transfers.create({
    amount: betragInCent,
    currency: "eur",
    destination: anbieter.stripe_account_id,
    description: `Urlaubfinder365 Auszahlung – ${anbieter.name}`,
    metadata: { auszahlung_id: auszahlung.id },
  });

  // Sofort updaten (Webhook als Backup)
  await supabaseAdmin.from("auszahlungen").update({
    stripe_transfer_id: transfer.id,
    status: "ueberwiesen",
    ueberwiesen_at: new Date().toISOString(),
    referenz: `Stripe ${transfer.id}`,
  }).eq("id", auszahlung_id);

  return NextResponse.json({ success: true, transfer_id: transfer.id });
}
