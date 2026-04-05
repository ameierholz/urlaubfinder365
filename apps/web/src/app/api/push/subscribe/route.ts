import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/api-helpers";
import { rateLimit } from "@/lib/api-helpers";

/** POST /api/push/subscribe – Browser-Push-Subscription speichern */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60_000);
  if (limited) return limited;

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const { endpoint, keys } = body as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Subscription-Daten unvollständig" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { onConflict: "user_id,endpoint" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/push/subscribe – Subscription entfernen */
export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Ungültiger Body" }, { status: 400 });
  }

  const { endpoint } = body as { endpoint?: string };
  if (!endpoint) return NextResponse.json({ error: "endpoint fehlt" }, { status: 400 });

  await supabaseAdmin()
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
