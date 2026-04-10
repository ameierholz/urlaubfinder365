/**
 * Admin-API für Werbeplatz-Verwaltung.
 *
 * GET    /api/admin/ad-slots         → Liste aller Slots
 * POST   /api/admin/ad-slots         → Neuen Slot anlegen
 * PATCH  /api/admin/ad-slots         → Slot aktualisieren (body.id)
 * DELETE /api/admin/ad-slots?id=X    → Slot löschen
 *
 * Auth: Eingeloggt + role IN (admin, moderator)
 * Schreiben mit Service-Role-Key (umgeht RLS).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

interface SlotRow {
  id?:          string;
  slot_key:     string;
  name:         string;
  description?: string | null;
  page_type?:   string | null;
  position?:    string | null;
  code?:        string | null;
  enabled?:     boolean;
  sort_order?:  number;
}

async function checkAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: number; error: string }> {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, status: 401, error: "Nicht angemeldet" };
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle() as { data: { role: string } | null };
    if (!profile || !["admin", "moderator"].includes(profile.role)) {
      return { ok: false, status: 403, error: "Keine Berechtigung" };
    }
    return { ok: true, userId: user.id };
  } catch (err) {
    return {
      ok: false,
      status: 401,
      error: err instanceof Error ? err.message : "Auth-Fehler",
    };
  }
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Cache invalidation für alle Pages, die AdSlots verwenden könnten.
// Die ad_slots-Tabelle hat keine Page-spezifische Zuordnung — am sichersten
// invalidieren wir die wichtigsten Routes.
function revalidateAdSlots() {
  try {
    revalidatePath("/", "layout"); // alle Seiten
  } catch {
    // revalidatePath kann in manchen Kontexten fehlschlagen
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const auth = await checkAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await adminClient()
    .from("ad_slots")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data ?? [] });
}

// ─── POST (create) ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await checkAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: SlotRow;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.slot_key || !body.name) {
    return NextResponse.json({ error: "slot_key und name sind erforderlich" }, { status: 400 });
  }

  const { data, error } = await adminClient()
    .from("ad_slots")
    .insert({
      slot_key:    body.slot_key,
      name:        body.name,
      description: body.description ?? null,
      page_type:   body.page_type ?? null,
      position:    body.position ?? null,
      code:        body.code ?? null,
      enabled:     body.enabled ?? true,
      sort_order:  body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  revalidateAdSlots();
  return NextResponse.json({ slot: data });
}

// ─── PATCH (update) ──────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const auth = await checkAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: SlotRow & { id: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id ist erforderlich" }, { status: 400 });
  }

  // Nur die übergebenen Felder updaten
  const update: Record<string, unknown> = {};
  if (body.slot_key    !== undefined) update.slot_key    = body.slot_key;
  if (body.name        !== undefined) update.name        = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.page_type   !== undefined) update.page_type   = body.page_type;
  if (body.position    !== undefined) update.position    = body.position;
  if (body.code        !== undefined) update.code        = body.code;
  if (body.enabled     !== undefined) update.enabled     = body.enabled;
  if (body.sort_order  !== undefined) update.sort_order  = body.sort_order;

  const { data, error } = await adminClient()
    .from("ad_slots")
    .update(update)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  revalidateAdSlots();
  return NextResponse.json({ slot: data });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const auth = await checkAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ist erforderlich" }, { status: 400 });

  const { error } = await adminClient().from("ad_slots").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateAdSlots();
  return NextResponse.json({ ok: true });
}
