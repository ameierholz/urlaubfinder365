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
        Google AdSense: Script immer laden (Domain-Verifizierung + Crawler).
        Ohne dieses Script markiert AdSense die Domain als "Nicht gefunden".
        Die eigentliche Anzeigen-Personalisierung wird per data-npa-on-failure
        und dem Consent-Signal gesteuert — DSGVO-konform laut Google-Richtlinien.
      */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9799640580685030"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      {/* Personalisierte Werbung nur bei Marketing-Consent aktivieren */}
      {consent?.marketing === false && (
        <Script id="adsense-no-consent" strategy="afterInteractive">{`
          (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
        `}</Script>
      )}
    </>
  );
}
