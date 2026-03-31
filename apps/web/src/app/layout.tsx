import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://urlaubfinder365.de"
  ),
  title: {
    default: "Urlaubfinder365 — Dein Traumurlaub zum besten Preis",
    template: "%s | Urlaubfinder365",
  },
  description:
    "Vergleiche Pauschalreisen, Last-Minute-Angebote und Hotels für über 250 Reiseziele weltweit. Finde deinen perfekten Urlaub zum besten Preis.",
  keywords: [
    "Urlaub",
    "Pauschalreisen",
    "Last Minute",
    "Reisen",
    "Preisvergleich",
    "All Inclusive",
    "Urlaubsangebote",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Urlaubfinder365",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-sand-50 text-sand-900 antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
