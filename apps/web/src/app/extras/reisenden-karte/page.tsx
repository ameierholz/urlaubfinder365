import type { Metadata } from "next";
import TravelMapClient from "@/components/reisenden-karte/TravelMapClient";

export const metadata: Metadata = {
  title: "🗺 Reisenden-Karte – wo unsere Community unterwegs ist",
  description: "Interaktive Reisenden-Karte: Entdecke wo die Urlaubfinder365 Community gerade unterwegs ist ✓ Erlebnisse ansehen ✓ Reiseziele entdecken.",
  keywords: ["Reisenden-Karte", "Reise Weltkarte", "Interaktive Karte", "Community Karte", "Reiseziele Karte"],
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/reisenden-karte/" },
  openGraph: {
    title: "🗺 Reisenden-Karte | Urlaubfinder365",
    description: "Interaktive Reisenden-Karte: Entdecke wo die Urlaubfinder365 Community gerade unterwegs ist ✓ Erlebnisse ansehen ✓ Reiseziele entdecken.",
    url: "https://www.urlaubfinder365.de/extras/reisenden-karte/",
  },
};

export default function ReisendenkartePage() {
  return <TravelMapClient />;
}
