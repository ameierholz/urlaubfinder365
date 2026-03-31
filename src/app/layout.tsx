import type { Metadata } from "next";
import { Inter, Annie_Use_Your_Telescope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IbeProvider from "@/components/ibe/IbeProvider";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";
import CookieBanner from "@/components/ui/CookieBanner";
import AccessibilityWidget from "@/components/ui/AccessibilityWidget";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.urlaubfinder365.de"),
  title: {
    default: "Pauschalreisen günstig buchen | Urlaubfinder365",
    template: "%s | Urlaubfinder365",
  },
  description:
    "Pauschalreisen, All Inclusive & Last Minute günstig buchen ✓ Täglich aktuell ✓ Türkei, Mallorca & Ägypten ✓ Direkt beim Veranstalter buchen.",
  keywords: [
    "Pauschalreisen günstig buchen",
    "Urlaub günstig buchen",
    "Last Minute Urlaub",
    "All Inclusive Urlaub",
    "Pauschalreisen Türkei",
    "Pauschalreisen Mallorca",
    "Pauschalreisen Griechenland",
    "Pauschalreisen Ägypten",
    "Kreuzfahrten günstig",
    "Frühbucher Urlaub",
    "Urlaub buchen",
    "Reiseführer",
    "Urlaubsfinder",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    siteName: "Urlaubfinder365",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Traumstrand – Pauschalreisen günstig buchen | Urlaubfinder365",
      },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Urlaubfinder365",
  url: "https://www.urlaubfinder365.de",
  logo: "https://www.urlaubfinder365.de/images/header_logo.webp",
  description:
    "Urlaubfinder365 ist Deutschlands Reisevergleichsportal für Pauschalreisen, All-Inclusive und Last-Minute Angebote. Täglich aktualisierte Deals von führenden Reiseveranstaltern.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@urlaubfinder365.de",
    availableLanguage: "German",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Urlaubfinder365",
  url: "https://www.urlaubfinder365.de",
  description: "Pauschalreisen, All-Inclusive & Last-Minute günstig buchen – täglich aktuelle Angebote",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.urlaubfinder365.de/guenstig-urlaub-buchen/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Preconnect – kritische Drittanbieter-Domains frühzeitig verbinden */}
        <link rel="preconnect" href="https://assets.specials.de" />
        <link rel="dns-prefetch" href="https://assets.specials.de" />
        <link rel="preconnect" href="https://api.specials.de" />
        <link rel="dns-prefetch" href="https://api.specials.de" />
        <link rel="preconnect" href="https://b2b.specials.de" />
        <link rel="dns-prefetch" href="https://b2b.specials.de" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        {/* Organization + WebSite Schema (global) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${annie.variable} antialiased text-gray-900`}
            style={{ backgroundColor: "rgba(238, 206, 161, 0.44)" }}>
        <AuthProvider>
          <FontAwesomeLoader />
          <IbeProvider />
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <AccessibilityWidget />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
