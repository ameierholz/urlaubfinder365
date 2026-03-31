import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Cron-Schutz: nur Vercel-Crons oder mit Secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = request.nextUrl.searchParams.get("profile") || "pauschal";

  // TODO: Implementierung in Phase 2
  // 1. Angebote von api.specials.de abrufen
  // 2. In Supabase `offers` Tabelle upserten
  // 3. Preisalarme prüfen und ggf. Push senden

  return NextResponse.json({
    ok: true,
    profile,
    message: `Price collection for "${profile}" — not yet implemented`,
    timestamp: new Date().toISOString(),
  });
}
