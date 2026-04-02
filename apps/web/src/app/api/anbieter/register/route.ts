import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, E-Mail und Passwort sind erforderlich." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben." }, { status: 400 });
  }

  const supabase = adminClient();

  // 1. Auth-User anlegen
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { name, rolle: "anbieter" },
  });

  if (authError) {
    const msg = authError.message.includes("already registered")
      ? "Diese E-Mail ist bereits registriert. Bitte melde dich an."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2. Minimales Anbieter-Profil anlegen — Rest wird beim Onboarding ausgefüllt
  const { error: profileError } = await supabase.from("anbieter_profile").insert({
    user_id:     userId,
    name,
    email,
    status:      "unvollstaendig", // Sonderstatus: Profil noch nicht ausgefüllt
    verifiziert: false,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Profil konnte nicht angelegt werden." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
