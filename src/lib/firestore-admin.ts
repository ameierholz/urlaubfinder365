/**
 * Server-only Firestore-Funktionen via Firebase Admin SDK.
 * Nur in API-Routes / Cron-Jobs importieren, nie in Client-Komponenten.
 */

import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { PriceSnapshot, PriceProfileData, PriceProfileId, PriceAlert } from "@/types";

/** Tages-Snapshot für eine Destination speichern oder aktualisieren */
export async function upsertPriceTrend(
  slug: string,
  destinationName: string,
  snapshot: PriceSnapshot
): Promise<void> {
  const db  = adminDb();
  const ref = db.collection("priceTrends").doc(slug);
  const existing = await ref.get();

  let snapshots: PriceSnapshot[] = [];
  if (existing.exists) {
    snapshots = (existing.data()?.snapshots ?? []) as PriceSnapshot[];
    // Heutigen Eintrag entfernen falls schon vorhanden (Idempotenz)
    snapshots = snapshots.filter((s) => s.date !== snapshot.date);
  }

  // Neuesten Snapshot vorne, max. 60 Tage behalten
  snapshots = [snapshot, ...snapshots].slice(0, 60);

  await ref.set(
    {
      slug,
      destinationName,
      lastUpdated:        FieldValue.serverTimestamp(),
      currentMinPrice:    snapshot.minPrice,
      currentDealCount:   snapshot.dealCount,
      snapshots,
    },
    { merge: true }
  );
}

/**
 * Profil-spezifischen Preis-Snapshot speichern (pauschal / hotel / ai).
 * Schreibt in priceTrends/{slug}.{profileId} ohne andere Profile zu überschreiben.
 */
export async function upsertPriceTrendProfile(
  slug: string,
  destinationName: string,
  profileId: PriceProfileId,
  snapshot: PriceSnapshot
): Promise<void> {
  const db  = adminDb();
  const ref = db.collection("priceTrends").doc(slug);
  const existing = await ref.get();

  let prevSnapshots: PriceSnapshot[] = [];
  if (existing.exists) {
    const profileData = existing.data()?.[profileId] as PriceProfileData | undefined;
    prevSnapshots = profileData?.snapshots ?? [];
    prevSnapshots = prevSnapshots.filter((s) => s.date !== snapshot.date);
  }

  const snapshots = [snapshot, ...prevSnapshots].slice(0, 60);

  const profileUpdate: PriceProfileData = {
    currentMinPrice:  snapshot.minPrice,
    currentDealCount: snapshot.dealCount,
    snapshots,
  };

  await ref.set(
    {
      slug,
      destinationName,
      lastUpdated: FieldValue.serverTimestamp(),
      [profileId]: profileUpdate,
    },
    { merge: true }
  );
}

/**
 * Alle aktiven Preisalarme für eine Destination prüfen.
 * Wenn aktueller Preis ≤ maxPrice des Nutzers → matchedPrice setzen.
 * Gibt die Anzahl gefundener Matches zurück.
 */
export async function checkAndUpdateAlerts(
  slug: string,
  currentMinPrice: number,
  dealCount: number
): Promise<number> {
  const db = adminDb();
  const snap = await db
    .collection("priceAlerts")
    .where("destination", "==", slug)
    .get();

  let matched = 0;
  for (const alertDoc of snap.docs) {
    const alert = alertDoc.data() as PriceAlert;
    if (!alert.enabled) continue;
    if (currentMinPrice <= alert.maxPrice) {
      await alertDoc.ref.update({
        matchedPrice:      currentMinPrice,
        matchedAt:         FieldValue.serverTimestamp(),
        matchedDealCount:  dealCount,
      });
      matched++;
    }
  }
  return matched;
}
