"use client";

import { useState } from "react";

interface IbeWidgetProps {
  dataSrc: string;
}

export default function IbeWidget({ dataSrc }: IbeWidgetProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full" style={{ minHeight: 4000 }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <span className="text-sm text-gray-400">Suchmaske wird geladen…</span>
        </div>
      )}
      <iframe
        src={dataSrc}
        title="Reisesuche & Buchung"
        className="w-full border-0 block"
        style={{ height: 4000 }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
