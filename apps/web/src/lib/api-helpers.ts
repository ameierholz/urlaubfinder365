import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

/** Zentraler Admin-Client (umgeht RLS) — nur serverseitig verwenden */
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/** Prueft ob der aktuelle Request von einem eingeloggten User stammt. Gibt User oder 401 zurueck. */
export async function requireAuth() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Prueft ob der aktuelle User Admin/Moderator ist. Gibt User oder null zurueck.
 *  Liest aus public.users (Spalten: id, role). */
export async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return null;

  const admin = supabaseAdmin();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) return null;
  return user;
}

/** E-Mail-Validierung */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Einfaches IP-basiertes Rate-Limiting (In-Memory, pro Serverless-Instance) */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(req: NextRequest, maxRequests = 10, windowMs = 60_000): NextResponse | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
  const key = `${req.nextUrl.pathname}:${ip}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) } }
    );
  }
  return null;
}
