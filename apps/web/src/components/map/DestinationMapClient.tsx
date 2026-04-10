"use client";

/**
 * Client-Wrapper für die eingebettete Destination-Karte.
 * Lädt UrlaubsfinderMap nur clientseitig (Leaflet-Beschränkung).
 */

import dynamic from "next/dynamic";
import type { MapMarker } from "@/lib/map/marker-types";

const UrlaubsfinderMap = dynamic(
  () => import("./UrlaubsfinderMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="w-8 h-8 border-2 border-[#1db682] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  },
);

interface Props {
  markers:     MapMarker[];
  center:      [number, number];
  zoom:        number;
  height:      string;
  excludeSlug: string;
}

export default function DestinationMapClient(props: Props) {
  return (
    <UrlaubsfinderMap
      markers={props.markers}
      center={props.center}
      zoom={props.zoom}
      height={props.height}
      filterUI="compact"
      showSearch={false}
      excludeSlug={props.excludeSlug}
      compact
    />
  );
}
