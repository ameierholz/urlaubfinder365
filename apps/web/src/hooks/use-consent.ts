"use client";

import { useSyncExternalStore } from "react";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = "uf365-consent";

// Listeners für useSyncExternalStore
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Cache für stabile Referenz – useSyncExternalStore vergleicht per ===
let cachedRaw: string | null = null;
let cachedParsed: CookieConsent | null = null;

function getSnapshot(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { cachedRaw = null; cachedParsed = null; return null; }
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = JSON.parse(raw) as CookieConsent;
    return cachedParsed;
  } catch {
    return null;
  }
}

function getServerSnapshot(): CookieConsent | null {
  return null;
}

/** Wird vom CookieBanner nach dem Speichern aufgerufen */
export function notifyConsentChange() {
  listeners.forEach((cb) => cb());
}

/** React-Hook: gibt aktuellen Consent-Status zurueck, reagiert auf Aenderungen */
export function useConsent(): CookieConsent | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
