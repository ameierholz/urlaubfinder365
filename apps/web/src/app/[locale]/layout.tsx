import type { Metadata, Viewport } from "next";
import { Inter, Annie_Use_Your_Telescope } from "next/font/google";
import "../globals.css";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
});

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
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80",
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
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=630&q=80",
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
    other: {
      // Google AdSense – Domain-Verifizierung via Meta-Tag
      "google-adsense-account": "ca-pub-9799640580685030",
    },
  };
}

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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "1243",
    bestRating: "5",
    worstRating: "1",
  },
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

// HTML dir-Attribut für RTL-Sprachen
const RTL_LOCALES: Locale[] = ["ar"];

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
  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Google AdSense – Domain-Verifizierung (statisch im HTML, kein JS nötig) */}
        <meta name="google-adsense-account" content="ca-pub-9799640580685030" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://api.specials.de" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.specials.de" />
        <link rel="dns-prefetch" href="https://b2b.specials.de" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://widget.trustpilot.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${annie.variable} antialiased text-gray-900`}
        style={{ backgroundColor: "rgba(238, 206, 161, 0.44)" }}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <FontAwesomeLoader />
            <IbeProvider />
            <ScrollToTop />
            <Header />
            <main>{children}</main>
            <Footer />
            <CookieBanner />
            <AccessibilityWidget />
            <ScrollToTopButton />
          </AuthProvider>
        </NextIntlClientProvider>
        <ConsentScripts />
      </body>
    </html>
  );
}
