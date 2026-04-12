import { Rocket } from "lucide-react";
import { PAUSCHAL_KOMBIS } from "@/lib/pauschalreisen-kombi-data";
import { SEASON_GUIDES } from "@/lib/season-guide-data";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { destinations } from "@/lib/destinations";
import IndexingClient from "./indexing-client";

const BASE = "https://www.urlaubfinder365.de";

interface PresetGroup {
  label: string;
  emoji: string;
  description: string;
  urls: string[];
}

export default function IndexingPage() {
  const presets: PresetGroup[] = [
    {
      label: "Hub-Seiten (höchste Priorität)",
      emoji: "🎯",
      description: "Die wichtigsten Einstiegsseiten für Google – direkt nach Sitemap-Submit zuerst einreichen.",
      urls: [
        `${BASE}/`,
        `${BASE}/urlaubsziele/`,
        `${BASE}/urlaubsthemen/`,
        `${BASE}/urlaubsarten/`,
        `${BASE}/pauschalreisen/`,
        `${BASE}/ratgeber/`,
        `${BASE}/reiseziele/`,
        `${BASE}/aktivitaeten/`,
        `${BASE}/community/`,
        `${BASE}/last-minute/`,
        `${BASE}/guenstig-urlaub-buchen/`,
      ],
    },
    {
      label: "Top-Destinationen",
      emoji: "🏖️",
      description: "Die wichtigsten Reiseziele mit höchstem Suchvolumen.",
      urls: destinations.slice(0, 12).map((d) => `${BASE}/urlaubsziele/${d.slug}/`),
    },
    {
      label: "Pauschalreisen-Kombis (NEU)",
      emoji: "✈️",
      description: "13 neue Pauschalreisen-Kombi-Seiten nach Land/Budget.",
      urls: PAUSCHAL_KOMBIS.map((k) => `${BASE}/pauschalreisen/${k.slug}/`),
    },
    {
      label: "Ratgeber-Artikel (NEU)",
      emoji: "📖",
      description: "28 Long-Form Reise-Ratgeber-Artikel.",
      urls: RATGEBER_ARTICLES.map((a) => `${BASE}/ratgeber/${a.slug}/`),
    },
    {
      label: "Saisonal-Guides (NEU)",
      emoji: "🗓️",
      description: "12 Reiseziele-nach-Monat Guides.",
      urls: SEASON_GUIDES.map((g) => `${BASE}/reiseziele/${g.slug}/`),
    },
    {
      label: "Top-20-Attraktionen pro Stadt",
      emoji: "🏆",
      description: "Tiqets-basierte Top-20-Listicles für die wichtigsten Tiqets-Städte.",
      urls: destinations
        .filter((d) => d.tiqetsCityId)
        .slice(0, 12)
        .map((d) => `${BASE}/erlebnisse/${d.slug}/top-attraktionen/`),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-900/30 rounded-lg">
          <Rocket className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Google Indexing API</h1>
          <p className="text-sm text-gray-500">
            URLs manuell zur sofortigen Indexierung bei Google einreichen
          </p>
        </div>
      </div>

      {/* Erklärung */}
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-200 leading-relaxed">
          <strong>Hinweis:</strong> Die Google Indexing API ist offiziell für JobPosting + BroadcastEvent gedacht,
          funktioniert aber meistens auch für normale Seiten – Google priorisiert dann die Crawl-Queue.
          Limit: <strong>~200 Anfragen pro Tag</strong>. Voraussetzung: Service-Account muss in der
          Search Console als <strong>„Inhaber"</strong> eingetragen sein (nicht nur „Voll").
        </p>
      </div>

      <IndexingClient presets={presets} />
    </div>
  );
}
