"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/hooks/use-consent";

/**
 * Laedt Drittanbieter-Scripts nur wenn der User Consent gegeben hat.
 * - Analytics + SpeedInsights: immer (anonymisiert, Legitimate Interest)
 * - AdSense: nur bei marketing=true
 */
export default function ConsentScripts() {
  const consent = useConsent();

  return (
    <>
      {/* Vercel Analytics/SpeedInsights: anonymisiert, kein Consent noetig */}
      <Analytics />
      <SpeedInsights />

      {/*
        Google AdSense:
        Das Basis-Script wird immer geladen (nötig für Domain-Verifizierung).
        Anzeigen werden erst nach Consent ausgeliefert via data-ad-status.
        Ohne consent.marketing zeigt AdSense keine personalisierten Anzeigen.
      */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9799640580685030"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  );
}
