import { NextResponse } from "next/server";
import { requireAuth, supabaseAdmin } from "@/lib/api-helpers";

/** DSGVO Art. 20: Recht auf Datenübertragbarkeit — exportiert alle User-Daten als JSON */
export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const admin = supabaseAdmin();
  const uid = user.id;

  // Alle relevanten Tabellen parallel abfragen
  const [profile, communityProfile, favorites, priceAlerts, reports, travelReports, destinationReviews, tips, achievements, buchungen] =
    await Promise.all([
      admin.from("users").select("*").eq("id", uid).maybeSingle(),
      admin.from("community_profiles").select("*").eq("uid", uid).maybeSingle(),
      admin.from("favorites").select("*").eq("user_id", uid),
      admin.from("price_alerts").select("*").eq("user_id", uid),
      admin.from("reports").select("*").eq("user_id", uid),
      admin.from("travel_reports").select("*").eq("user_id", uid),
      admin.from("destination_reviews").select("*").eq("user_id", uid),
      admin.from("travel_tips").select("*").eq("user_id", uid),
      admin.from("user_achievements").select("*").eq("user_id", uid),
      admin.from("buchungen").select("buchungs_nummer, datum, personen, gesamtpreis, status, created_at").eq("kunden_email", user.email ?? ""),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.name ?? null,
      createdAt: user.created_at,
    },
    profile: profile.data ?? null,
    communityProfile: communityProfile.data ?? null,
    favorites: favorites.data ?? [],
    priceAlerts: priceAlerts.data ?? [],
    reports: reports.data ?? [],
    travelReports: travelReports.data ?? [],
    destinationReviews: destinationReviews.data ?? [],
    travelTips: tips.data ?? [],
    achievements: achievements.data ?? [],
    buchungen: buchungen.data ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="urlaubfinder365-daten-${uid.slice(0, 8)}.json"`,
    },
  });
}
