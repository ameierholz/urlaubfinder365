import "./globals.css";
import { Inter, Annie_Use_Your_Telescope } from "next/font/google";
import { getLocale } from "next-intl/server";

// Root-Layout — rendert <html> und <body> zentral (Pflicht ab Next.js 16).
// Locale-spezifische Sachen (NextIntlProvider, Header, Footer, JSON-LD) werden
// im [locale]/layout.tsx als Children eingebracht.
//
// Admin/Anbieter/Embed-Routes laufen ebenfalls durch dieses Root-Layout —
// ihre eigenen Layouts rendern nur Inhalt ohne <html>/<body>.

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // next-intl middleware setzt die Locale im Server-Context;
  // hier holen wir sie für das lang-Attribut. Fallback: "de".
  let locale: string;
  try {
    locale = await getLocale();
  } catch {
    locale = "de";
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Performance: Preconnect/DNS-Prefetch zu kritischen Drittdomains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://media.traffics-switch.de" />
        <link rel="preconnect" href="https://api.specials.de" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.specials.de" />
        <link rel="dns-prefetch" href="https://b2b.specials.de" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://widget.trustpilot.com" />
      </head>
      <body
        className={`${inter.variable} ${annie.variable} antialiased text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
