"use client";

import Image from "next/image";

interface Ziel {
  cc: string;
  iata: string;
  name: string;
  photo: string;
}

const ZIELE: Ziel[] = [
  { cc: "tr", iata: "AYT", name: "Antalya",   photo: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80" },
  { cc: "es", iata: "PMI", name: "Mallorca",  photo: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80" },
  { cc: "gr", iata: "HER", name: "Kreta",     photo: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { cc: "gr", iata: "ATH", name: "Athen",     photo: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80" },
  { cc: "es", iata: "BCN", name: "Barcelona", photo: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80" },
  { cc: "ae", iata: "DXB", name: "Dubai",     photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { cc: "th", iata: "BKK", name: "Bangkok",   photo: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=600&q=80" },
  { cc: "us", iata: "JFK", name: "New York",  photo: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
  { cc: "pt", iata: "LIS", name: "Lissabon",  photo: "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=600&q=80" },
  { cc: "it", iata: "FCO", name: "Rom",       photo: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" },
  { cc: "fr", iata: "CDG", name: "Paris",     photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
  { cc: "id", iata: "DPS", name: "Bali",      photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
];

// 5 größte deutsche Abflughäfen
const ABFLUEGHAEFEN = [
  { code: "FRA", label: "Frankfurt" },
  { code: "MUC", label: "München" },
  { code: "DUS", label: "Düsseldorf" },
  { code: "BER", label: "Berlin" },
  { code: "HAM", label: "Hamburg" },
];

function openFlugModal(dep: string, dst: string, name: string) {
  const url = `https://b2b.specials.de/index/jump/15/1450/993243/?depapt1=${dep}&dstapt1=${dst}&action=search`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.ibeOpenBooking === "function") {
    w.ibeOpenBooking(url, `${dep} → ${name}`);
  } else {
    window.open(url, "_blank", "noopener");
  }
}

export default function FlugzieleGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {ZIELE.map((z) => (
        <div
          key={z.iata}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          {/* Destination Photo */}
          <div className="relative h-32 overflow-hidden">
            <Image
              src={z.photo}
              alt={z.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Flag + Name overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/48x36/${z.cc}.png`}
                alt={z.name}
                width={24}
                height={18}
                className="rounded shadow-sm shrink-0"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight drop-shadow">{z.name}</p>
                <p className="text-[10px] text-white/70">{z.iata}</p>
              </div>
            </div>
          </div>

          {/* Abflughafen-Buttons */}
          <div className="px-3 pt-2.5 pb-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">Abflughafen wählen:</p>
            <div className="flex flex-wrap gap-1">
              {ABFLUEGHAEFEN.map((apt) => (
                <button
                  key={apt.code}
                  onClick={() => openFlugModal(apt.code, z.iata, z.name)}
                  className="inline-flex items-center shrink-0 bg-gray-50 hover:bg-[#00838F]/10 hover:text-[#00838F] hover:border-[#00838F]/30 border border-gray-200 text-gray-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  title={`Flug ab ${apt.label} nach ${z.name}`}
                >
                  ab {apt.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
