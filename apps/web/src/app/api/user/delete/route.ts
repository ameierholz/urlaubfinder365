import { NextRequest, NextResponse } from "next/server";
import { requireAuth, supabaseAdmin, rateLimit } from "@/lib/api-helpers";

/** DSGVO Art. 17: Recht auf Loeschung — loescht alle User-Daten und den Auth-Account */
export async function DELETE(req: NextRequest) {
  const limited = rateLimit(req, 3, 60_000);
  if (limited) return limited;

  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const admin = supabaseAdmin();
  const uid = user.id;

  // Daten in abhaengiger Reihenfolge loeschen (FKs beachten)
  await Promise.all([
    admin.from("favorites").delete().eq("user_id", uid),
    admin.from("price_alerts").delete().eq("user_id", uid),
    admin.from("itineraries").delete().eq("user_id", uid),
    admin.from("travel_tips").delete().eq("user_id", uid),
    admin.from("user_achievements").delete().eq("user_id", uid),
    admin.from("user_streaks").delete().eq("user_id", uid),
    admin.from("trivia_scores").delete().eq("user_id", uid),
    admin.from("media_feed").delete().eq("user_id", uid),
    admin.from("reports").delete().eq("user_id", uid),
    admin.from("messages").delete().eq("sender_id", uid),
  ]);

  // Profil loeschen
  await admin.from("user_profiles").delete().eq("uid", uid);

  // Storage: User-Uploads loeschen
  const { data: files } = await admin.storage.from("travel-tip-images").list(uid);
  if (files && files.length > 0) {
    await admin.storage.from("travel-tip-images").remove(files.map((f) => `${uid}/${f.name}`));
  }

  // Auth-Account loeschen (Supabase Admin API)
  const { error } = await admin.auth.admin.deleteUser(uid);
  if (error) {
    console.error("Fehler beim Loeschen des Auth-Accounts:", error.message);
    return NextResponse.json({ error: "Account konnte nicht vollständig gelöscht werden" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Alle Daten wurden gelöscht." });
}
