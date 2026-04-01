import type { Metadata } from "next";
import TravelBuddiesClient from "./TravelBuddiesClient";

export const metadata: Metadata = {
  title: "Travel Buddies – Reisepartner finden | Urlaubfinder365",
  description: "Finde Gleichgesinnte für deine nächste Reise. Verbinde dich mit anderen Reisenden, die ähnliche Ziele und Reisestile haben.",
};

export default function TravelBuddiesPage() {
  return <TravelBuddiesClient />;
}
