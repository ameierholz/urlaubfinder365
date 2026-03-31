interface Props {
  lat: number;
  lng: number;
  destination: string;
}

export default function DestinationMap({ lat, lng, destination }: Props) {
  // OpenStreetMap embed – no API key needed
  const delta = 0.6;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Karte: {destination}
      </h2>
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200" style={{ height: "420px" }}>
        <iframe
          src={src}
          title={`Karte ${destination}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer"
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
