/**
 * supabase-db-admin.ts
 * Server-only admin client (Service Role Key) — nur für Cron-Jobs und API-Routes.
 * NIEMALS im Browser oder Client-Code importieren.
 */

import { createClient } from "@supabase/supabase-js";
import type { PriceSnapshot, PriceProfileId } from "@/types";

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// ── price_trends ─────────────────────────────────────────────────────────────

/**
 * Schreibt einen neuen Tages-Snapshot in das Profil-JSONB einer Destination.
 * Legt den Eintrag an falls er noch nicht existiert.
 * Behält maximal 60 Snapshots (neueste zuerst).
 */
export async function upsertPriceTrendProfile(
  slug: string,
  destinationName: string,
  profileId: PriceProfileId,
  snapshot: PriceSnapshot
): Promise<void> {
  const supabase = adminDb();

  // Bestehenden Eintrag laden
  const { data: existing } = await supabase
    .from("price_trends")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const now = new Date().toISOString();

  // Vorhandene Profil-Snapshots mergen
  const prevProfile = (existing as Record<string, unknown> | null)?.[profileId] as
    | { snapshots?: PriceSnapshot[]; currentMinPrice?: number; currentDealCount?: number }
    | undefined;

  const prevSnapshots: PriceSnapshot[] = prevProfile?.snapshots ?? [];

  // Heutigen Snapshot ersetzen falls bereits vorhanden, sonst vorne einfügen
  const filtered = prevSnapshots.filter((s) => s.date !== snapshot.date);
  const snapshots = [snapshot, ...filtered].slice(0, 60);

  const profileData = {
    currentMinPrice:  snapshot.minPrice,
    currentDealCount: snapshot.dealCount,
    snapshots,
  };

  // Legacy top-level Felder nur beim pauschal-Profil aktualisieren
  const topLevel =
    profileId === "pauschal"
      ? {
          current_min_price:  snapshot.minPrice,
          current_deal_count: snapshot.dealCount,
          snapshots,
        }
      : {};

  const row = {
    slug,
    destination_name: destinationName,
    last_updated:     now,
    [profileId]:      profileData,
    ...topLevel,
  };

  // 1. price_trends (JSONB-Cache, Rückwärtskompatibilität)
  if (existing) {
    await supabase.from("price_trends").update(row).eq("slug", slug);
  } else {
    await supabase.from("price_trends").insert(row);
  }

  // 2. price_history (normalisiert, append-only, für Charts & Analyse)
  await supabase.from("price_history").upsert(
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
}

// ── price_alerts ─────────────────────────────────────────────────────────────

/**
 * Prüft aktive Preisalarme für eine Destination.
 * Wenn der aktuelle Mindestpreis ≤ max_price des Alarms → als getroffen markieren.
 * Gibt die Anzahl neu getroffener Alarme zurück.
 */
export async function checkAndUpdateAlerts(
  slug: string,
  minPrice: number,
  dealCount: number
): Promise<number> {
  const supabase = adminDb();

  // Aktive Alarme für diese Destination laden
  const { data: alerts, error } = await supabase
    .from("price_alerts")
    .select("id, max_price")
    .eq("destination", slug)
    .eq("enabled", true);

  if (error || !alerts || alerts.length === 0) return 0;

  // Alarme filtern die getroffen wurden
  const triggered = alerts.filter(
    (a) => minPrice <= (a as { max_price: number }).max_price
  );

  if (triggered.length === 0) return 0;

  const ids = triggered.map((a) => (a as { id: string }).id);
  const now = new Date().toISOString();

  await supabase
    .from("price_alerts")
    .update({
      matched_price:      minPrice,
      matched_at:         now,
      matched_deal_count: dealCount,
    })
    .in("id", ids);

  return triggered.length;
}
