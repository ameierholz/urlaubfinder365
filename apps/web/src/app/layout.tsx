import "./globals.css";
import { Inter, Annie_Use_Your_Telescope } from "next/font/google";

// Root-Layout — rendert <html> und <body> zentral (Pflicht ab Next.js 16).
// KEIN getLocale() hier! Das ruft headers() auf und macht ALLE Seiten dynamisch
// → kein ISR, kein Edge-Caching, TTFB ~420ms statt ~20ms.
// Die korrekte Locale wird im [locale]/layout.tsx per setRequestLocale gesetzt.
// lang="de" ist der Default; hreflang-Tags + Content-Language signalisieren die
// richtige Sprache für andere Locales an Suchmaschinen.

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://media.traffics-switch.de" />
        <link rel="dns-prefetch" href="https://api.specials.de" />
        {/* Hero-Bild vorladen — LCP-Element auf Mobile */}
        <link rel="preload" as="image" href="/images/hero-mobile.webp" media="(max-width: 768px)" />
      </head>
      <body
        className={`${inter.variable} ${annie.variable} antialiased text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
