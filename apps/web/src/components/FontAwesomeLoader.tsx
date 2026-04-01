"use client";

import { useEffect } from "react";

const ASYNC_STYLESHEETS = [
  {
    id: "fa-stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    crossOrigin: "anonymous" as const,
  },
  {
    id: "plus-jakarta-sans",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap",
  },
  {
    id: "ibe-engine-css",
    href: "/styles/ibe-engine.css",
  },
];

/** Lädt IBE-Stylesheets nach der Hydration – kein Render-Blocking */
export default function FontAwesomeLoader() {
  useEffect(() => {
    for (const { id, href, crossOrigin } of ASYNC_STYLESHEETS) {
      if (document.getElementById(id)) continue;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    }
  }, []);
  return null;
}
