import type { Metadata } from "next";
import FeedClient from "./FeedClient";

export const metadata: Metadata = {
  title: "📸 Reise-Feed – Inspiration aus der Community",
  description: "Endloser Reise-Feed mit Fotos & Videos aus der Urlaubfinder365 Community ✓ Täglich neue Inspiration ✓ Reiseziele entdecken.",
  keywords: ["Reise Feed", "Reise Inspiration", "Reisefotos", "Reisevideos", "Community Feed", "Urlaub Inspiration"],
  alternates: { canonical: "https://www.urlaubfinder365.de/feed/" },
  openGraph: {
    title: "📸 Reise-Feed – Inspiration | Urlaubfinder365",
    description: "Endloser Reise-Feed mit Fotos & Videos aus der Urlaubfinder365 Community ✓ Täglich neue Inspiration ✓ Reiseziele entdecken.",
    url: "https://www.urlaubfinder365.de/feed/",
    type: "website",
  },
};

export default function FeedPage() {
  return <FeedClient />;
}
