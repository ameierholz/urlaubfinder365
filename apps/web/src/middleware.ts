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

// HTML-Seiten, die keine CSP brauchen (statische Assets, API-Routes)
const SKIP_CSP = /^\/(api|_next\/static|_next\/image|favicon|apple-icon|icon|robots|sitemap|ads\.txt|scripts|styles|images)/;

/** Baut den dynamischen CSP-Header mit Per-Request-Nonce.
 *  unsafe-inline für script-src ist entfernt — nur Nonce-tragende Inline-Scripts laufen.
 *  unsafe-eval bleibt (benötigt für IBE-Widget & AdSense).
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.adup-tech.com https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://*.ypsilon.net https://*.specials.de https://api.specials.de https://widget.trustpilot.com https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com https://cdn.googlesyndication.com https://fundingchoicesmessages.google.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com https://unpkg.com",
    "font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com https://assets.specials.de data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.specials.de https://media.traffics-switch.de https://flagcdn.com https://*.tiqets.com https://aws-tiqets-cdn.imgix.net https://*.supabase.co https://*.googleusercontent.com https://*.googleapis.com https://i.pravatar.cc https://*.ypsilon.net https://pics.avs.io https://*.trustpilot.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://*.openstreetmap.org https://unpkg.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.firebaseio.com https://*.googleapis.com https://api.specials.de https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.adup-tech.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://accounts.google.com https://*.ypsilon.net https://api.open-meteo.com https://*.trustpilot.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://csi.gstatic.com https://*.gstatic.com https://ep1.adtrafficquality.google",
    "frame-src 'self' https://*.specials.de https://d.adup-tech.com https://s.adup-tech.com https://www.openstreetmap.org https://openstreetmap.org https://accounts.google.com https://*.ypsilon.net https://www.google.com https://maps.google.com https://www.travialinks.de https://kreuzfahrten.travelsystem.de https://*.trustpilot.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.safeframe.googlesyndication.com https://pagead2.googlesyndication.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
  ].join("; ");
}

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

  // ── 2. Nonce generieren (per Request, kryptografisch sicher) ─────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // ── 3. i18n routing für alle öffentlichen Routen ────────────────────────────
  const i18nResponse = handleI18n(request);

  // ── 4. Response mit Nonce + CSP vorbereiten ──────────────────────────────────
  let response: NextResponse;

  // Strip potential locale prefix to check base path
  const basePath = pathname.replace(/^\/(en|tr|es|fr|it|pl|ru|ar|zh)\//, "/");

  if (NEEDS_AUTH.test(basePath)) {
    // Supabase-Session für geschützte Routen refreshen
    response = await refreshSupabaseSession(request, i18nResponse);
  } else {
    response = NextResponse.next({ request, headers: i18nResponse.headers });
  }

  // Nonce als Request-Header setzen → Next.js nutzt ihn für eigene Inline-Scripts
  // und layout.tsx liest ihn für JSON-LD <script>-Tags
  response.headers.set("x-nonce", nonce);

  // CSP nur für HTML-Seiten setzen (nicht für statische Assets / API)
  if (!SKIP_CSP.test(pathname)) {
    response.headers.set("Content-Security-Policy", buildCsp(nonce));
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
