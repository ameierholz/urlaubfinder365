import type { Metadata } from "next";
import FeedClient from "./FeedClient";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "📸 Urlaubs-Feed – Inspiration aus der Community",
  description: "Endloser Urlaubs-Feed mit Fotos & Videos aus der Urlaubfinder365 Community ✓ Täglich neue Inspiration ✓ Urlaubsziele entdecken.",
  keywords: ["Urlaubs-Feed", "Urlaubsinspiration", "Urlaubsfotos", "Urlaubsvideos", "Community Feed", "Urlaub Inspiration"],
  alternates: { canonical: "https://www.urlaubfinder365.de/feed/" },
  openGraph: {
    title: "📸 Urlaubs-Feed – Inspiration | Urlaubfinder365",
    description: "Endloser Urlaubs-Feed mit Fotos & Videos aus der Urlaubfinder365 Community ✓ Täglich neue Inspiration ✓ Urlaubsziele entdecken.",
    url: "https://www.urlaubfinder365.de/feed/",
    type: "website",
  },
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FeedClient />;
}
