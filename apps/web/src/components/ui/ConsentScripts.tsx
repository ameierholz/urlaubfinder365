"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "@/hooks/use-consent";

/**
 * Lädt Drittanbieter-Scripts strikt nach DSGVO/TTDSG §25 erst NACH Consent.
 *
 * - Vercel Analytics + SpeedInsights → nur bei consent.analytics === true
 *   (auch wenn anonymisiert, ist es nicht „technisch notwendig" und braucht Opt-In)
 * - Google AdSense → nur bei consent.marketing === true
 *
 * Wenn der User noch keinen Consent gegeben hat oder explizit ablehnt,
 * wird KEIN externes Script geladen → keine Cookies, keine IP-Übertragung.
 */
export default function ConsentScripts() {
  const consent = useConsent();

  return (
    <>
      {/* Vercel Analytics + Speed Insights + Google Analytics 4 – nur bei Analytics-Consent */}
      {consent?.analytics && (
        <>
          <Analytics />
          <SpeedInsights />

          {/* Google Analytics 4 (gtag.js) – lädt erst nach Analytics-Consent.
              anonymize_ip für DSGVO-konforme IP-Kürzung. */}
          <Script
            id="ga4-src"
            src="https://www.googletagmanager.com/gtag/js?id=G-M6MG5M1X31"
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M6MG5M1X31', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Google AdSense – nur bei Marketing-Consent.
          Wir nutzen `lazyOnload` damit das Script nicht den Main-Thread blockiert. */}
      {consent?.marketing && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9799640580685030"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
