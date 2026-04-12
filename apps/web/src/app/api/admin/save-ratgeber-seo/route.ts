/**
 * Speichert Ratgeber-SEO-Texte in ratgeber_seo_texts.
 * Auth: User muss admin oder moderator sein.
 * Schreibt mit Service-Role-Key (umgeht RLS).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

interface Body {
  slug:             string;
  title:            string;
  seo_title?:       string | null;
  seo_description?: string | null;
  focus_keyword?:   string | null;
  keywords?:        string | null;
  og_title?:        string | null;
  og_description?:  string | null;
  og_image?:        string | null;
  lead?:            string | null;
  hero_image?:      string | null;
  category?:        string | null;
  reading_time_min?: number | null;
  seo_intro?:       string | null;
  seo_h2_middle?:   string | null;
  seo_middle?:      string | null;
  seo_h2_bottom?:   string | null;
  seo_bottom?:      string | null;
  sections?:        Array<{ heading: string; body: string }> | null;
  faqs?:            Array<{ question: string; answer: string }> | null;
  related_slugs?:   string[] | null;
}

export async function POST(req: NextRequest) {
  // 1. Auth-Check
  let userId: string;
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }
    userId = user.id;

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle() as { data: { role: string } | null };

    if (!profile || !["admin", "moderator"].includes(profile.role)) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Auth-Fehler" },
      { status: 401 }
    );
  }

  // 2. Body parsen
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: "slug und title sind erforderlich" }, { status: 400 });
  }

  // 3. Mit Service-Role-Key schreiben
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
    slug:             body.slug,
    title:            body.title,
    seo_title:        body.seo_title ?? null,
    seo_description:  body.seo_description ?? null,
    focus_keyword:    body.focus_keyword ?? null,
    keywords:         body.keywords ?? null,
    og_title:         body.og_title ?? null,
    og_description:   body.og_description ?? null,
    og_image:         body.og_image ?? null,
    lead:             body.lead ?? null,
    hero_image:       body.hero_image ?? null,
    category:         body.category ?? null,
    reading_time_min: body.reading_time_min ?? null,
    seo_intro:        body.seo_intro ?? null,
    seo_h2_middle:    body.seo_h2_middle ?? null,
    seo_middle:       body.seo_middle ?? null,
    seo_h2_bottom:    body.seo_h2_bottom ?? null,
    seo_bottom:       body.seo_bottom ?? null,
    sections:         body.sections ?? [],
    faqs:             body.faqs ?? [],
    related_slugs:    body.related_slugs ?? [],
    updated_at:       new Date().toISOString(),
  };

  const { error } = await admin
    .from("ratgeber_seo_texts")
    .upsert(row, { onConflict: "slug" });

  if (error) {
    console.error("[save-ratgeber-seo] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Datenbankfehler", code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, slug: body.slug, savedBy: userId });
}
