/**
 * Firebase Admin SDK – nur serverseitig verwenden (API-Routes, Cron-Jobs).
 * Benötigte Env-Variablen (in .env.local & Vercel Settings):
 *   FIREBASE_ADMIN_PROJECT_ID      – z.B. "urlaubfinder-abc12"
 *   FIREBASE_ADMIN_CLIENT_EMAIL    – Service-Account E-Mail
 *   FIREBASE_ADMIN_PRIVATE_KEY     – Private Key (mit \\n für Zeilenumbrüche)
 */

import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function initAdmin(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID
                   ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
                   ?? "";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
  const privateKey  = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "")
                        .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK: Bitte FIREBASE_ADMIN_PROJECT_ID, " +
      "FIREBASE_ADMIN_CLIENT_EMAIL und FIREBASE_ADMIN_PRIVATE_KEY " +
      "in .env.local und Vercel-Einstellungen hinterlegen."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function adminDb(): Firestore {
  initAdmin();
  return getFirestore();
}
