// Firebase: Firestore (Community-Daten) + FCM (Push-Notifications).
// Auth & relationale DB → Supabase.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

/** Firestore für Community-Daten, Saved Trips etc. */
export function db(): Firestore {
  if (!_db) {
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase: API-Key fehlt in .env.local");
    _db = getFirestore(app);
  }
  return _db;
}

/** Firebase Storage für Avatar-Uploads */
export function storage(): FirebaseStorage {
  if (!_storage) {
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase: API-Key fehlt in .env.local");
    _storage = getStorage(app);
  }
  return _storage;
}
