import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED = ["de", "en", "tr", "es", "fr", "it", "pl", "ru", "ar"] as const;

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sprache } = await req.json() as { sprache: string };
  if (!ALLOWED.includes(sprache as typeof ALLOWED[number])) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  await supabaseAdmin
    .from("anbieter_profile")
    .update({ sprache })
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
