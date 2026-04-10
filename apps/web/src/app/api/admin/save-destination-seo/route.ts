/**
 * Speichert SEO-Texte fuer eine Destination in destination_seo_texts.
 *
 * Auth: User muss eingeloggt sein UND role in (admin, moderator) haben.
 * Schreiben passiert mit Service-Role-Key (umgeht RLS), nachdem die Auth
 * geprueft wurde.
 *
 * Background: Die Tabelle hat nur eine Public-Read-Policy. Schreibender
 * Direkt-Zugriff aus dem Browser via anon-key wird daher von RLS blockiert
 * — Fehler "[object Object]". Diese Route loest das Problem.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

interface Body {
  slug:           string;
  name:           string;
  country?:       string | null;
  seo_intro?:     string | null;
  seo_h2_middle?: string | null;
  seo_middle?:    string | null;
  seo_h2_bottom?: string | null;
  seo_bottom?:    string | null;
}

export async function POST(req: NextRequest) {
  // 1. Auth-Check via SSR-Client (cookies)
  let userId: string;
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }
    userId = user.id;

    // Role-Check
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle() as { data: { role: string } | null };

    const allowedRoles = ["admin", "moderator"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Auth-Fehler" },
      { status: 401 }
    );
  }

  // 2. Body parsen + validieren
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.slug || !body.name) {
    return NextResponse.json({ error: "slug und name sind erforderlich" }, { status: 400 });
  }

  // 3. Mit Service-Role-Key schreiben (umgeht RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY nicht gesetzt" }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );

  const row = {
    slug:          body.slug,
    name:          body.name,
    country:       body.country ?? null,
    seo_intro:     body.seo_intro ?? null,
    seo_h2_middle: body.seo_h2_middle ?? null,
    seo_middle:    body.seo_middle ?? null,
    seo_h2_bottom: body.seo_h2_bottom ?? null,
    seo_bottom:    body.seo_bottom ?? null,
    updated_at:    new Date().toISOString(),
  };

  const { error } = await admin
    .from("destination_seo_texts")
    .upsert(row, { onConflict: "slug" });

  if (error) {
    console.error("[save-destination-seo] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Datenbankfehler", code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, slug: body.slug, savedBy: userId });
}
