import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IbeProvider from "@/components/ibe/IbeProvider";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";
import CookieBanner from "@/components/ui/CookieBanner";
import AccessibilityWidget from "@/components/ui/AccessibilityWidget";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import ConsentScripts from "@/components/ui/ConsentScripts";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing, locales, SITE_URL, type Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00838F",
};

const YEAR = new Date().getFullYear();

// Alle Locale-Kombinationen für Static Generation vorberechnen
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const alternateLanguages: Record<string, string> = {};
  locales.forEach((l) => {
    alternateLanguages[l] = l === "de" ? `${SITE_URL}/` : `${SITE_URL}/${l}/`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("homeTitle"),
      template: t("titleTemplate"),
    },
    description: t("homeDescription"),
    keywords: [
      "Pauschalreisen günstig buchen",
      "Urlaub günstig buchen",
      "Last Minute Urlaub",
      "All Inclusive Urlaub",
      "Pauschalreisen Türkei",
      "Package Holidays",
      "Cheap Holidays",
    ],
    // Nicht-deutsche Locale-Varianten: noindex bis echte Übersetzungen existieren.
    // Verhindert "gecrawlt – nicht indexiert" durch dünnen Duplicate-Content.
    // Seiten mit eigener robots-Angabe (login, dashboard, …) überschreiben dies.
    robots: locale === "de"
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: true },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: t("ogLocale"),
      images: [
        {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
          width: 1200,
          height: 630,
          alt: `${t("homeTitle")} | ${YEAR}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@urlaubfinder365",
      creator: "@urlaubfinder365",
      images: [
        {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80&auto=format",
          alt: `${t("homeTitle")} | ${YEAR}`,
        },
      ],
    },
    alternates: {
      canonical: locale === "de" ? `${SITE_URL}/` : `${SITE_URL}/${locale}/`,
      languages: {
        ...alternateLanguages,
        "x-default": `${SITE_URL}/`,
      },
    },
    // Search Engine Verifications (Token aus env vars, leer = kein Tag)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.YANDEX_VERIFICATION || undefined,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
    other: {
      // Google AdSense – Domain-Verifizierung via Meta-Tag
      "google-adsense-account": "ca-pub-9799640580685030",
    },
  };
}

// ─── Preconnect / DNS-Prefetch via Metadata Links ───────────────────────────
// In Next.js 16 wandern <link>-Hints, die früher in <head> direkt rendert wurden,
// ins Root-Layout via Next.js Metadata API (siehe app/layout.tsx).

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Urlaubfinder365",
  url: SITE_URL,
  logo: `${SITE_URL}/images/urlaubfinder-logo.webp`,
  sameAs: [
    "https://www.instagram.com/urlaubfinder365",
    "https://www.facebook.com/urlaubfinder365",
    "https://www.pinterest.de/urlaubfinder365",
    "https://www.youtube.com/@urlaubfinder365",
    "https://www.tiktok.com/@urlaubfinder365",
    `${SITE_URL}/en/`,
    `${SITE_URL}/tr/`,
  ],
  // aggregateRating entfernt: Daten waren hartcodiert (Fake) und verstoßen
  // gegen Googles Rich-Results-Richtlinien. Erst wieder hinzufügen, wenn
  // echte Bewertungen (z.B. Trustpilot) automatisch abgerufen werden.
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@urlaubfinder365.de",
    availableLanguage: ["German", "English", "Turkish", "Spanish", "French",
      "Italian", "Polish", "Russian", "Arabic", "Chinese"],
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Urlaubfinder365",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/guenstig-urlaub-buchen/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  // Für Static Rendering erforderlich
  setRequestLocale(locale);

  const messages = await getMessages();

  // Hinweis: <html>/<body> werden im Root-Layout (app/layout.tsx) gerendert.
  // Hier nur Provider, Header/Footer und Page-Inhalt.
  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <div style={{ backgroundColor: "rgba(238, 206, 161, 0.44)" }}>
          {/* JSON-LD: Inline im <body> erlaubt, wird von Google trotzdem indexiert */}
          <JsonLd data={organizationSchema} />
          <JsonLd data={webSiteSchema} />
          <FontAwesomeLoader />
          <IbeProvider />
          <ScrollToTop />
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <AccessibilityWidget />
          <ScrollToTopButton />
        </div>
      </AuthProvider>
      <ConsentScripts />
    </NextIntlClientProvider>
  );
}
