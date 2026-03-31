import type { Metadata } from "next";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Hotelsuche — Hotels weltweit vergleichen",
  description:
    "Vergleiche Hotels weltweit und finde die besten Preise. Von 3-Sterne bis Luxus-Resort.",
};

export default function HotelsuchePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary-500" />
          <h1 className="text-3xl font-bold text-sand-900 md:text-4xl">
            Hotelsuche
          </h1>
        </div>
        <p className="text-lg text-sand-600">
          Finde und vergleiche Hotels weltweit — vom gemütlichen
          Boutique-Hotel bis zum Luxus-Resort.
        </p>
      </div>

      <div className="rounded-2xl border border-sand-200 bg-white p-12 text-center">
        <Building2 className="mx-auto mb-4 h-12 w-12 text-sand-300" />
        <h2 className="mb-2 text-xl font-semibold text-sand-900">
          Hotelsuche wird eingerichtet
        </h2>
        <p className="text-sand-600">
          Die Hotel-Suchfunktion wird in Kürze verfügbar sein.
        </p>
      </div>
    </div>
  );
}
