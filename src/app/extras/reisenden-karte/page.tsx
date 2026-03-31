import type { Metadata } from "next";
import TravelMapClient from "@/components/reisenden-karte/TravelMapClient";

export const metadata: Metadata = {
  title: "Reisenden-Karte – Community Tipps weltweit",
  description:
    "Entdecke Geheimtipps, besondere Orte und Restaurantempfehlungen von Reisenden weltweit. Teile deine eigenen Erfahrungen auf der interaktiven Reisenden-Karte.",
  alternates: { canonical: "https://www.urlaubfinder365.de/extras/reisenden-karte/" },
  openGraph: {
    title: "Reisenden-Karte | Urlaubfinder365",
    description: "Community-Weltkarte mit Geheimtipps, besonderen Orten & Gastronomie-Empfehlungen von echten Reisenden.",
    url: "https://www.urlaubfinder365.de/extras/reisenden-karte/",
  },
};

export default function ReisendenkartePage() {
  return <TravelMapClient />;
}
