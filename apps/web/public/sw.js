/**
 * Service Worker – Urlaubfinder365 Web Push Notifications
 * Verarbeitet Push-Events vom Server und zeigt Browser-Benachrichtigungen.
 */

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Preisalarm!", body: event.data.text() };
  }

  const { title = "Preisalarm!", body = "", url = "/dashboard?tab=pricealerts", icon, badge } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:  icon  ?? "/images/urlaubfinder-logo.webp",
      badge: badge ?? "/images/urlaubfinder-logo.webp",
      vibrate: [200, 100, 200],
      tag: "preisalarm",       // Zusammenfassen mehrerer Alarme zu einer Benachrichtigung
      renotify: true,
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/dashboard?tab=pricealerts";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Bereits offenes Tab fokussieren wenn möglich
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Sonst neues Tab öffnen
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
