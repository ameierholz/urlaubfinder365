"use client";

import { useState } from "react";
import IbeTeaser from "./IbeTeaser";

interface CountryTab {
  flagCode: string;
  label: string;
  headline: string;
  regionId: string;
}

const TABS: CountryTab[] = [
  { flagCode: "tr", label: "Türkei",       headline: "Türkei",       regionId: "724"    },
  { flagCode: "es", label: "Spanien",      headline: "Spanien",      regionId: "100000" },
  { flagCode: "gr", label: "Griechenland", headline: "Griechenland", regionId: "100002" },
  { flagCode: "eg", label: "Ägypten",      headline: "Ägypten",      regionId: "651"    },
  { flagCode: "it", label: "Italien",      headline: "Italien",      regionId: "100007" },
];

export default function CountryTabTeaser() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <div>
      {/* Tab-Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t, i) => (
          <button
            key={t.regionId}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              active === i
                ? "bg-sand-500 border-sand-500 text-white shadow-md"
                : "bg-white border-gray-200 text-gray-700 hover:border-sand-300 hover:text-sand-600"
            }`}
          >
            <img
              src={`https://flagcdn.com/w20/${t.flagCode}.png`}
              srcSet={`https://flagcdn.com/w40/${t.flagCode}.png 2x`}
              width={18}
              height={13}
              alt={t.label}
              className="rounded-sm object-cover"
            />
            {t.label}
          </button>
        ))}
      </div>

      {/* Aktiver Teaser – key erzwingt Re-Mount bei Tab-Wechsel */}
      <IbeTeaser
        key={tab.regionId}
        regionId={tab.regionId}
        headline={tab.headline}
        from="14"
        to="42"
        duration="7-7"
        adults="2"
        category="3"
        minRecommrate="30"
        sortBy="count"
        diverseResults={true}
      />
    </div>
  );
}
