import type { Metadata } from "next";
import { Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Flugsuche — Günstige Flüge vergleichen",
  description:
    "Vergleiche Flüge weltweit und finde die günstigsten Verbindungen ab allen deutschen Flughäfen.",
};

export default function FlugsuchePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <Plane className="h-7 w-7 text-primary-500" />
          <h1 className="text-3xl font-bold text-sand-900 md:text-4xl">
            Flugsuche
          </h1>
        </div>
        <p className="text-lg text-sand-600">
          Finde günstige Flüge ab allen deutschen Flughäfen zu über 250
          Reisezielen.
        </p>
      </div>

      <div className="rounded-2xl border border-sand-200 bg-white p-12 text-center">
        <Plane className="mx-auto mb-4 h-12 w-12 text-sand-300" />
        <h2 className="mb-2 text-xl font-semibold text-sand-900">
          Flugsuche wird eingerichtet
        </h2>
        <p className="text-sand-600">
          Die Flug-Suchfunktion wird in Kürze verfügbar sein.
        </p>
      </div>
    </div>
  );
}
