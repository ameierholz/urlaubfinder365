"use client";

export interface KalenderAngebot {
  id: string;
  titel: string;
  ziel: string;
  countryCode: string;
  preis: number;
  foto_url: string;
  regionId?: string;
}

interface Props {
  angebot: KalenderAngebot;
}

export default function KalenderAngebotBox({ angebot }: Props) {
  function openIbe() {
    const param = angebot.regionId
      ? `regionId=${angebot.regionId}`
      : `countryId=${angebot.countryCode.toUpperCase()}`;
    const url = `https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&${param}`;
    const fn = (window as any).ibeOpenBooking;
    if (typeof fn === "function") {
      fn(url, angebot.titel);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      onClick={openIbe}
      className="group relative w-full text-left rounded-xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all bg-white cursor-pointer"
    >
      {/* Bild mit Overlay */}
      <div className="relative h-[72px] overflow-hidden bg-gray-100">
        <img
          src={angebot.foto_url}
          alt={angebot.titel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />

        {/* Anzeigen-Badge */}
        <span className="absolute top-1.5 left-1.5 bg-amber-400 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          Anzeige
        </span>

        {/* Preis-Badge */}
        <span className="absolute top-1.5 right-1.5 bg-[#1db682] text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg leading-none">
          ab {angebot.preis} €
        </span>

        {/* Ziel + Titel */}
        <div className="absolute bottom-1.5 left-2 right-2">
          <div className="flex items-center gap-1 mb-0.5">
            <img
              src={`https://flagcdn.com/w16/${angebot.countryCode}.png`}
              width={12}
              height={9}
              className="rounded-sm shrink-0"
              alt=""
            />
            <span className="text-[9px] text-white/75 font-medium truncate">{angebot.ziel}</span>
          </div>
          <p className="text-[10px] font-bold text-white leading-tight line-clamp-1">
            {angebot.titel}
          </p>
        </div>
      </div>

      {/* CTA-Zeile */}
      <div className="px-2.5 py-1.5 bg-amber-50/60 flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#00838F] group-hover:underline">
          Jetzt buchen →
        </span>
        <span className="text-[9px] text-gray-400">/ Person</span>
      </div>
    </button>
  );
}
