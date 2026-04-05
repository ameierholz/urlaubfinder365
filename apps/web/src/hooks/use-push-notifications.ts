"use client";

import { useState, useEffect, useCallback } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export type PushState = "unsupported" | "default" | "granted" | "denied" | "loading";

export function usePushNotifications() {
  const [state, setState] = useState<PushState>("loading");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Aktuellen Subscription-Status aus dem Browser laden
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setSubscription(sub);
        if (sub) {
          setState("granted");
        } else {
          setState(Notification.permission === "denied" ? "denied" : "default");
        }
      });
    }).catch(() => setState("unsupported"));
  }, []);

  /** Push-Notifications aktivieren */
  const subscribe = useCallback(async (): Promise<boolean> => {
    setState("loading");
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("VAPID Public Key fehlt");

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Subscription an Server senden
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")!))),
            auth:   btoa(String.fromCharCode(...new Uint8Array(sub.getKey("auth")!))),
          },
        }),
      });

      if (!res.ok) throw new Error("Subscription konnte nicht gespeichert werden");

      setSubscription(sub);
      setState("granted");
      return true;
    } catch (err) {
      console.error("[push] subscribe Fehler:", err);
      setState(Notification.permission === "denied" ? "denied" : "default");
      return false;
    }
  }, []);

  /** Push-Notifications deaktivieren */
  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!subscription) return;
    setState("loading");
    try {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
      setSubscription(null);
      setState("default");
    } catch {
      setState("granted");
    }
  }, [subscription]);

  return { state, subscription, subscribe, unsubscribe };
}
