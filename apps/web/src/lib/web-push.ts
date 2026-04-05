/**
 * Web Push Helper – sendet Browser-Benachrichtigungen an gespeicherte Subscriptions.
 *
 * Voraussetzung: VAPID-Keys generieren und in .env.local eintragen:
 *   node -e "const wp=require('web-push'); console.log(JSON.stringify(wp.generateVAPIDKeys(),null,2))"
 *
 * .env.local:
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNxG...
 *   VAPID_PRIVATE_KEY=...
 *   VAPID_SUBJECT=mailto:info@urlaubfinder365.de
 */

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

function getVapidConfig() {
  const publicKey  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject    = process.env.VAPID_SUBJECT ?? "mailto:info@urlaubfinder365.de";

  if (!publicKey || !privateKey) {
    throw new Error(
      "VAPID-Keys fehlen. Generiere sie mit:\n" +
      "  node -e \"const wp=require('web-push'); console.log(JSON.stringify(wp.generateVAPIDKeys(),null,2))\"\n" +
      "und trage NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY in .env.local ein."
    );
  }
  return { publicKey, privateKey, subject };
}

export interface PushPayload {
  title: string;
  body:  string;
  url?:  string;
  icon?: string;
}

/**
 * Sendet eine Push-Benachrichtigung an alle gespeicherten Subscriptions der angegebenen User-IDs.
 * Ungültige/abgelaufene Subscriptions werden automatisch aus der DB entfernt.
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload
): Promise<void> {
  if (!userIds.length) return;

  const { publicKey, privateKey, subject } = getVapidConfig();
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (!subscriptions?.length) return;

  const expiredIds: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
          { TTL: 86400 } // 24h TTL — falls Gerät offline
        );
      } catch (err) {
        // 404/410 = Subscription abgelaufen → aus DB entfernen
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          expiredIds.push(sub.id);
        } else {
          console.warn("[web-push] Fehler beim Senden:", (err as Error).message);
        }
      }
    })
  );

  if (expiredIds.length > 0) {
    await admin.from("push_subscriptions").delete().in("id", expiredIds);
  }
}
