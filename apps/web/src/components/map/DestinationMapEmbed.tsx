/**
 * DestinationMapEmbed — Server Component, lädt Marker im Umkreis und
 * rendert die UrlaubsfinderMap im eingebetteten Modus.
 *
 * Wird auf jeder Destination-Seite verwendet (ersetzt das alte iframe).
 */

import dynamic from "next/dynamic";
import { loadAllMarkers } from "@/lib/map/load-markers";

const UrlaubsfinderMap = dynamic(() => import("@/components/map/UrlaubsfinderMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="w-8 h-8 border-2 border-[#1db682] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface Props {
  lat:  number;
  lng:  number;
  slug: string;
  name: string;
}

export default async function DestinationMapEmbed({ lat, lng, slug, name }: Props) {
  // Lade alle Marker im 80 km Umkreis
  const markers = await loadAllMarkers({
    near: { lat, lng, radiusKm: 80 },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Karte: {name} & Umgebung
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {markers.length} Marker im Umkreis – Klicke auf einen Pin für Details
          </p>
        </div>
        <a
          href="/weltkarte/"
          className="text-xs font-semibold text-[#1db682] hover:underline"
        >
          ↗ Weltkarte öffnen
        </a>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
        <UrlaubsfinderMap
          markers={markers}
          center={[lat, lng]}
          zoom={9}
          height="480px"
          filterUI="compact"
          showSearch={false}
          excludeSlug={slug}
          compact
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Kartendaten ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </section>
  );
}
