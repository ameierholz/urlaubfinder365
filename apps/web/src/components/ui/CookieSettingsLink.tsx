"use client";

import { openCookieSettings } from "@/components/ui/CookieBanner";

/**
 * Footer-Link, der die Cookie-Einstellungen erneut öffnet.
 * Erfüllt die DSGVO-Vorgabe, dass die Einwilligung jederzeit
 * so einfach widerrufbar sein muss wie sie erteilt wurde (Art. 7 III).
 */
export default function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="block hover:text-gray-300 text-left"
    >
      {label}
    </button>
  );
}
