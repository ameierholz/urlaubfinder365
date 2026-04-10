"use client";

/**
 * Client-Wrapper für /weltkarte/.
 * Lädt WeltkarteWithTipEditor (Leaflet-basiert) nur clientseitig,
 * weil Leaflet auf `window`/`document` zugreift und keine SSR unterstützt.
 *
 * In Next.js 16 darf `dynamic({ ssr: false })` nicht mehr in Server Components
 * verwendet werden — daher dieser Client-Wrapper.
 */

import dynamic from "next/dynamic";
import type { MapMarker } from "@/lib/map/marker-types";

const WeltkarteWithTipEditor = dynamic(
  () => import("./WeltkarteWithTipEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#1db682] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-semibold">Weltkarte wird geladen…</p>
        </div>
      </div>
    ),
  },
);

interface Props {
  markers: MapMarker[];
  center?: [number, number];
  zoom?:   number;
  height?: string;
}

export default function WeltkartePageClient(props: Props) {
  return <WeltkarteWithTipEditor {...props} />;
}
