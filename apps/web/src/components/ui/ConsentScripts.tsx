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
        Google AdSense: Nur laden wenn Consent (marketing=true) erteilt wurde.
        Ohne Consent werden keine AdSense-Scripts geladen → DSGVO-konform.
        Hinweis: Domain-Verifizierung bei Google via AdSense-Dashboard oder
        alternativ per DNS TXT-Record "google-site-verification=..." erledigen.
      */}
      {consent?.marketing === true && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9799640580685030"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
