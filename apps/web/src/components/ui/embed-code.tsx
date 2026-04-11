"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Code2 } from "lucide-react";

interface DestinationOption {
  slug: string;
  name: string;
}

interface Props {
  destinationSlug: string;
  destinationName: string;
  days?: number;
  theme?: "light" | "dark";
  /** Wenn übergeben, wird ein Destination-Picker angezeigt */
  destinations?: DestinationOption[];
}

export function EmbedCode({
  destinationSlug,
  destinationName,
  days = 30,
  theme = "light",
  destinations,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedDays, setSelectedDays] = useState(days);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">(theme);
  const [selectedSlug, setSelectedSlug] = useState(destinationSlug);
  const [selectedName, setSelectedName] = useState(destinationName);

  const embedUrl = `https://www.urlaubfinder365.de/embed/price-chart?destination=${selectedSlug}&days=${selectedDays}&theme=${selectedTheme}`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="500"
  height="340"
  frameborder="0"
  scrolling="no"
  style="border-radius:12px;overflow:hidden;max-width:100%"
  title="Preisverlauf ${selectedName} – urlaubfinder365.de"
  loading="lazy"
></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function handleDestinationChange(slug: string) {
    const dest = destinations?.find((d) => d.slug === slug);
    if (dest) {
      setSelectedSlug(dest.slug);
      setSelectedName(dest.name);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#1db682]" />
          <span className="font-bold text-sm text-gray-900">
            Widget: Preisverlauf {selectedName}
          </span>
        </div>
        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#1db682] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "preview" ? "Vorschau" : "Embed-Code"}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex-wrap">
        {destinations && destinations.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Reiseziel:</span>
            <select
              value={selectedSlug}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1db682] max-w-45"
            >
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Zeitraum:</span>
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1db682]"
          >
            <option value={7}>7 Tage</option>
            <option value={14}>14 Tage</option>
            <option value={30}>30 Tage</option>
            <option value={60}>60 Tage</option>
            <option value={90}>90 Tage</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Design:</span>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as "light" | "dark")}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1db682]"
          >
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === "preview" ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              So sieht das Widget auf deiner Webseite aus:
            </p>
            <div className="bg-gray-100 rounded-xl p-3">
              <iframe
                src={embedUrl}
                width="100%"
                height="340"
                style={{
                  border: "none",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "block",
                  minWidth: 0,
                }}
                title={`Preisverlauf ${selectedName}`}
                loading="lazy"
              />
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#6991d8] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Widget in neuem Tab öffnen
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Kopiere diesen Code und füge ihn in deine Webseite ein:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-green-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
                {iframeCode}
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Kopieren
                  </>
                )}
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Hinweis:</strong> Das Widget funktioniert auf jeder Webseite, jedem Blog und CMS (WordPress, Wix, Squarespace u.v.m.). Eine Verlinkung auf urlaubfinder365.de ist bereits integriert.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
