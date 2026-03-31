import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Last Minute Urlaub — Günstige Reiseschnäppchen",
  description:
    "Finde die besten Last-Minute-Angebote für Pauschalreisen, Hotels und Flüge. Täglich neue Deals zu Top-Preisen.",
};

export default function LastMinutePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-7 w-7 text-primary-500" />
          <h1 className="text-3xl font-bold text-sand-900 md:text-4xl">
            Last Minute Angebote
          </h1>
        </div>
        <p className="text-lg text-sand-600">
          Spontan verreisen und dabei sparen — täglich neue Schnäppchen für
          deinen nächsten Urlaub.
        </p>
      </div>

      {/* Placeholder bis API angebunden */}
      <div className="rounded-2xl border border-sand-200 bg-white p-12 text-center">
        <Plane className="mx-auto mb-4 h-12 w-12 text-sand-300" />
        <h2 className="mb-2 text-xl font-semibold text-sand-900">
          Angebote werden geladen
        </h2>
        <p className="mb-6 text-sand-600">
          Sobald die Reise-API verbunden ist, erscheinen hier täglich
          aktuelle Last-Minute-Deals.
        </p>
        <Link
          href="/urlaubsziele/"
          className="inline-block rounded-full bg-primary-500 px-6 py-2.5 font-medium text-white transition hover:bg-primary-600"
        >
          Alle Reiseziele entdecken
        </Link>
      </div>
    </div>
  );
}
