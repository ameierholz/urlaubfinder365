import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase nur initialisieren wenn API-Key vorhanden (verhindert Build-Fehler ohne .env)
function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
}

// Lazy Getter für Komponenten die Auth/DB/Storage direkt verwenden
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function auth(): Auth {
  if (!_auth) {
    const a = getFirebaseAuth();
    if (!a) throw new Error("Firebase Auth nicht initialisiert – API-Key fehlt in .env.local");
    _auth = a;
  }
  return _auth;
}

export function db(): Firestore {
  if (!_db) {
    const d = getFirebaseDb();
    if (!d) throw new Error("Firebase Firestore nicht initialisiert – API-Key fehlt in .env.local");
    _db = d;
  }
  return _db;
}

export function storage(): FirebaseStorage {
  if (!_storage) {
    const app = getApps().length ? getApp() : null;
    if (!app) throw new Error("Firebase Storage nicht initialisiert – API-Key fehlt in .env.local");
    _storage = getStorage(app);
  }
  return _storage;
}
