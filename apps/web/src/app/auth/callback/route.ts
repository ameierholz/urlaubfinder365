import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Auth Callback – wird nach Google OAuth aufgerufen.
 * Tauscht den Code gegen eine Session aus und leitet weiter.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const user = data.user;

      // Willkommens-E-Mail nur beim ersten Login senden:
      // created_at ≈ last_sign_in_at → frisch registriert (max. 3 Minuten Toleranz)
      const createdAt      = user.created_at ? new Date(user.created_at).getTime()      : 0;
      const lastSignIn     = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0;
      const isFirstSignIn  = Math.abs(lastSignIn - createdAt) < 3 * 60 * 1000; // 3 min

      if (isFirstSignIn && user.email) {
        const name = (user.user_metadata?.full_name as string | undefined)
          ?? user.email.split("@")[0]
          ?? "dort";
        const typ  = (user.user_metadata?.typ as string | undefined) === "anbieter" ? "anbieter" : "kunde";
        fetch(`${origin}/api/email/welcome`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name, typ }),
        }).catch(() => {});
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Bei Fehler → Login-Seite mit Hinweis
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
