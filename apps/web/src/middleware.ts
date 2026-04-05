import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// next-intl handles locale routing for all public pages
const handleI18n = createIntlMiddleware(routing);

// Paths that skip i18n entirely (API, static files, auth/admin areas)
const SKIP_I18N = /^\/(api|_next|auth|admin|anbieter|buchung|scripts|styles|images|favicon|apple-icon|icon|robots|sitemap|ads\.txt)/;

// Protected routes that need Supabase session refresh (within [locale])
const NEEDS_AUTH = /^\/(dashboard|community|profil|travel-buddies)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Skip i18n for system/auth/admin routes ───────────────────────────────
  if (SKIP_I18N.test(pathname)) {
    // Still refresh Supabase session for anbieter/admin/protected routes
    if (/^\/(anbieter|admin|api\/protected)/.test(pathname)) {
      return refreshSupabaseSession(request);
    }
    return NextResponse.next();
  }

  // ── 2. i18n routing for all public routes ────────────────────────────────────
  const response = handleI18n(request);

  // ── 3. Additionally refresh Supabase session for protected locale routes ─────
  // Strip potential locale prefix to check base path
  const basePath = pathname.replace(/^\/(en|tr|es|fr|it|pl|ru|ar|zh)\//, "/");
  if (NEEDS_AUTH.test(basePath)) {
    return refreshSupabaseSession(request, response);
  }

  return response;
}

async function refreshSupabaseSession(
  request: NextRequest,
  baseResponse?: Response
): Promise<NextResponse> {
  let response = baseResponse
    ? NextResponse.next({ request, headers: baseResponse.headers })
    : NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    // Match all paths except static Next.js files and public folder files
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|robots.txt|sitemap.xml|ads.txt|scripts/|styles/|images/).*)",
  ],
};
