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

      {/* Google AdSense: nur bei Marketing-Consent */}
      {consent?.marketing && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9799640580685030"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
