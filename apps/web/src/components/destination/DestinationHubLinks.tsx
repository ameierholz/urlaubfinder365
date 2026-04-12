"use client";

const AGENT = "993243";
const IBE_BASE = "https://ibe.specials.de/";

interface Props {
  name: string;
  regionId?: string;
}

interface HubEntry {
  emoji: string;
  suffix: string;
  ibeParams: Record<string, string>;
}

const URLAUBSARTEN: HubEntry[] = [
  { emoji: "✈️",  suffix: "Pauschalreisen", ibeParams: { from: "14", to: "42" } },
  { emoji: "🥂",  suffix: "All Inclusive",   ibeParams: { boardCode: "AI" } },
  { emoji: "⚡",  suffix: "Last Minute",     ibeParams: { from: "3", to: "21" } },
  { emoji: "📅",  suffix: "Frühbucher",      ibeParams: { from: "60", to: "365" } },
];

const URLAUBSTHEMEN: HubEntry[] = [
  { emoji: "🏖️", suffix: "Strandurlaub",   ibeParams: { from: "14", to: "42", keywords: "bea,ben" } },
  { emoji: "👨‍👩‍👧",  suffix: "Familienurlaub", ibeParams: { from: "14", to: "42", children: "8,8" } },
  { emoji: "🧖",  suffix: "Wellness",       ibeParams: { from: "14", to: "42", keywords: "spa,wel" } },
  { emoji: "🏙️", suffix: "Städtereise",    ibeParams: { duration: "3-5" } },
  { emoji: "💑",  suffix: "Adults Only",    ibeParams: { from: "14", to: "42", keywords: "ado" } },
  { emoji: "⭐",  suffix: "Luxus",          ibeParams: { from: "14", to: "42", category: "5" } },
  { emoji: "🧳",  suffix: "Singles",        ibeParams: { adults: "1", from: "14", to: "42" } },
  { emoji: "🏔️", suffix: "Abenteuer",      ibeParams: { from: "14", to: "42" } },
];

function openBooking(regionId: string, ibeParams: Record<string, string>, title: string) {
  const base: Record<string, string> = { agent: AGENT, adults: "2", duration: "7-7", regionId };
  const merged = { ...base, ...ibeParams };
  const p = new URLSearchParams(merged);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ibeOpenBooking?.(`${IBE_BASE}?${p.toString()}`, title);
}

export default function DestinationHubLinks({ name, regionId }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-5">
        {name} – alle Urlaubsarten &amp; Themen
      </h2>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Reisearten</p>
          <div className="flex flex-wrap gap-2">
            {URLAUBSARTEN.map(({ emoji, suffix, ibeParams }) => (
              <button
                key={suffix}
                type="button"
                onClick={() => regionId && openBooking(regionId, ibeParams, `${suffix} ${name}`)}
                disabled={!regionId}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#1db682] hover:text-[#1db682] text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{emoji}</span>
                {suffix} {name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Urlaubsthemen</p>
          <div className="flex flex-wrap gap-2">
            {URLAUBSTHEMEN.map(({ emoji, suffix, ibeParams }) => (
              <button
                key={suffix}
                type="button"
                onClick={() => regionId && openBooking(regionId, ibeParams, `${suffix} ${name}`)}
                disabled={!regionId}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#6991d8] hover:text-[#6991d8] text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{emoji}</span>
                {suffix} {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
