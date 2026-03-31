/**
 * Server-only Datenbankfunktionen via Supabase Service-Role-Client.
 * Nur in API-Routes / Cron-Jobs importieren.
 */

import { createClient } from "@supabase/supabase-js";
import type { PriceSnapshot, PriceProfileId } from "@/types";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Admin: URL oder SERVICE_ROLE_KEY fehlt in .env.local");
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Profil-spezifischen Preis-Snapshot upserten (pauschal / hotel / ai).
 */
export async function upsertPriceTrendProfile(
  slug: string,
  destinationName: string,
  profileId: PriceProfileId,
  snapshot: PriceSnapshot
): Promise<void> {
  const supabase = adminClient();

  // Snapshot in price_history speichern (upsert per slug + date + profile)
  const { error } = await supabase
    .from("price_history")
    .upsert(
      {
        destination_slug: slug,
        destination_name: destinationName,
        profile:          profileId,
        date:             snapshot.date,
        min_price:        snapshot.minPrice,
        avg_price:        snapshot.avgPrice,
        deal_count:       snapshot.dealCount,
      },
      { onConflict: "destination_slug,date,profile" }
    );

  if (error) throw new Error(`upsertPriceTrendProfile(${slug}): ${error.message}`);
}

/** Legacy-Compat: upsertPriceTrend ohne Profil → schreibt als "pauschal" */
export async function upsertPriceTrend(
  slug: string,
  destinationName: string,
  snapshot: PriceSnapshot
): Promise<void> {
  return upsertPriceTrendProfile(slug, destinationName, "pauschal", snapshot);
}

/**
 * Alle aktiven Preisalarme für eine Destination prüfen.
 * Gibt Anzahl der Matches zurück.
 */
export async function checkAndUpdateAlerts(
  slug: string,
  currentMinPrice: number,
  dealCount: number
): Promise<number> {
  const supabase = adminClient();

  const { data: alerts, error } = await supabase
    .from("price_alerts")
    .select("id, max_price")
    .eq("destination", slug)
    .eq("enabled", true);

  if (error || !alerts) return 0;

  let matched = 0;
  for (const alert of alerts) {
    if (currentMinPrice <= alert.max_price) {
      await supabase
        .from("price_alerts")
        .update({
          matched_price:      currentMinPrice,
          matched_at:         new Date().toISOString(),
          matched_deal_count: dealCount,
        })
        .eq("id", alert.id);
      matched++;
    }
  }

  return matched;
}
