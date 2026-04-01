"use client";

export interface Destination {
  name: string;
  temp: string;
  code: string;       // ISO 3166-1 alpha-2 → flagcdn + countryId fallback
  tip: string;
  regionId?: string;  // specials.de regionId (überschreibt countryId)
}

interface Props {
  d: Destination;
  type: "sommer" | "winter";
}

export default function DestinationCard({ d, type }: Props) {
  function openIbe() {
    const param = d.regionId
      ? `regionId=${d.regionId}`
      : `countryId=${d.code.toUpperCase()}`;
    const url = `https://b2b.specials.de/index/jump/119/2780/993243/?from=14&to=365&duration=7-14&adults=2&${param}`;
    const title = `Pauschalreisen nach ${d.name}`;
    const fn = (window as any).ibeOpenBooking;
    if (typeof fn === "function") {
      fn(url, title);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      onClick={openIbe}
      className="flex items-start gap-3 w-full text-left rounded-xl p-2 -mx-2 transition-all hover:bg-gray-50 group cursor-pointer border border-transparent hover:border-gray-200"
    >
      {/* Flagge */}
      <img
        src={`https://flagcdn.com/w20/${d.code}.png`}
        width={20}
        height={14}
        className="mt-1 rounded-sm shadow-sm shrink-0 object-cover"
        alt={d.name}
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm text-gray-900 group-hover:text-[#00838F] transition-colors">
            {d.name}
          </span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
            type === "sommer"
              ? "text-amber-600 bg-amber-50"
              : "text-blue-600 bg-blue-50"
          }`}>
            {d.temp}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{d.tip}</p>
        <p className="text-xs text-[#00838F] mt-1 font-semibold flex items-center gap-1">
          <span>Angebote suchen</span>
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </p>
      </div>
    </button>
  );
}
