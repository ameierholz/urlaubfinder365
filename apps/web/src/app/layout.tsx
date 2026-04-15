import "./globals.css";
import { Inter, Annie_Use_Your_Telescope } from "next/font/google";
import { getLocale } from "next-intl/server";

// Root-Layout — rendert <html> und <body> zentral (Pflicht ab Next.js 16).
// Locale-spezifische Sachen (NextIntlProvider, Header, Footer, JSON-LD) werden
// im [locale]/layout.tsx als Children eingebracht.
//
// Admin/Anbieter/Embed-Routes laufen ebenfalls durch dieses Root-Layout —
// ihre eigenen Layouts rendern nur Inhalt ohne <html>/<body>.

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
  display: "swap",
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
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://media.traffics-switch.de" />
        <link rel="dns-prefetch" href="https://api.specials.de" />
      </head>
      <body
        className={`${inter.variable} ${annie.variable} antialiased text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
