import type { ClimateMonth, EntryInfo, DestinationConfig } from "@/types";
import { CATALOG, type CatalogEntry, type ClimateZone } from "@/data/catalog-regions";

// ─── IBE Region-ID Recovery ──────────────────────────────────────────────────
// 117 von 273 Catalog-Einträgen haben Platzhalter-IBE-IDs (Pattern 1xxxxx, 6-stellig).
// Specials.de kennt diese nicht → leere oder falsche Treffer auf den Destination-Seiten.
// Recovery: Children oder Parent mit echten IDs aggregieren.

/** Erkennt Platzhalter-IDs (sequenziell vergebene 100xxx-Werte) */
export function isFakeIbeRegionId(id: string | number | undefined | null): boolean {
  if (id === undefined || id === null || id === "") return false;
  return /^1\d{5}$/.test(String(id));
}

/**
 * Liefert die echten IBE-Region-IDs für eine Destination.
 * Recovery-Strategie:
 *   1. Eigene ID echt → [parsed]
 *   2. Super-Region mit fake ID → Children mit echten IDs aggregieren
 *   3. Sub-Region mit fake ID, Parent echte ID → [parent_id]
 *   4. Sub-Region mit fake ID, Parent fake → Geschwister mit echten IDs aggregieren
 *   5. Sonst → []  (Caller sollte Top-Deals/IBE ausblenden)
 */
export function getEffectiveIbeRegionIds(slug: string): number[] {
  const entry = CATALOG.find((e) => e.slug === slug);
  if (!entry) return [];

  if (!isFakeIbeRegionId(entry.ibeRegionId)) {
    return [Number(entry.ibeRegionId)];
  }

  // Level 2: Super-Region → Children sammeln
  if (entry.type === "super") {
    return CATALOG
      .filter((c) => c.parentSlug === entry.slug && !isFakeIbeRegionId(c.ibeRegionId))
      .map((c) => Number(c.ibeRegionId))
      .slice(0, 10); // API-URL nicht überlaufen lassen
  }

  // Level 3: Sub-Region → Parent
  if (entry.parentSlug) {
    const parent = CATALOG.find((p) => p.slug === entry.parentSlug);
    if (parent && !isFakeIbeRegionId(parent.ibeRegionId)) {
      return [Number(parent.ibeRegionId)];
    }

    // Level 4: Geschwister mit echten IDs
    if (parent) {
      const siblings = CATALOG
        .filter((s) => s.parentSlug === parent.slug && !isFakeIbeRegionId(s.ibeRegionId))
        .map((s) => Number(s.ibeRegionId))
        .slice(0, 10);
      if (siblings.length > 0) return siblings;
    }
  }

  return [];
}

// ─── SEO Templates ──────────────────────────────────────────────────────────
//
// Diese Generatoren bauen Description/Meta/FAQs für die ~210 Catalog-Einträge
// ohne handgeschriebenen Supabase-Eintrag. Ziele:
//   - keine KI-typischen Floskeln ("magisch", "verzaubert", "Tauche ein in")
//   - datenbasiert: Klimazone + Country liefern konkrete Sätze
//   - Variation: 4 Templates pro Generator, deterministisch per slug-Hash gewählt
//   - SEO-Substanz: konkrete Zahlen (Sonnentage, Flugzeit, Preis-Range)

interface CountryProfile {
  highlights: string;          // 1 Satz konkreter Sehenswürdigkeiten
  cuisine: string;             // 1 Satz typische Küche
  bestFor: string;             // wofür ist das Land bekannt
  flightTime: string;          // grobe Flugzeit ab Deutschland
  priceRangeWeek: [number, number]; // Pauschalreise 7d/Person low/high €
}

const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  "Spanien": {
    highlights:    "Tapas-Bars in Sevilla, die Alhambra in Granada, Gaudís Sagrada Familia in Barcelona und kilometerlange Sandstrände an der Costa del Sol",
    cuisine:       "Tapas, Paella, Iberico-Schinken und frische Meeresfrüchte",
    bestFor:       "Strandurlaub, Inselhopping und Städtetrip",
    flightTime:    "2,5 bis 3 Stunden ab Frankfurt",
    priceRangeWeek:[400, 850],
  },
  "Türkei": {
    highlights:    "antike Stätten wie Ephesus und Pamukkale, türkische Bäder, die Basare Istanbuls und endlose Sandstrände an der türkischen Riviera",
    cuisine:       "Kebab, Meze, frischer Fisch und süßes Baklava",
    bestFor:       "All-Inclusive-Familienurlaub und Kulturreisen",
    flightTime:    "rund 3 bis 3,5 Stunden ab Frankfurt",
    priceRangeWeek:[330, 720],
  },
  "Griechenland": {
    highlights:    "die Akropolis von Athen, weiß getünchte Inseldörfer, jahrhundertealte Olivenhaine und das kristallklare Ägäismeer",
    cuisine:       "Souvlaki, Tzatziki, Moussaka und Ouzo",
    bestFor:       "Inselhopping und Strandurlaub mit Geschichte",
    flightTime:    "rund 2,5 bis 3 Stunden ab Frankfurt",
    priceRangeWeek:[420, 900],
  },
  "Griechenland Festland": {
    highlights:    "die Akropolis von Athen, die Klosterfelsen von Meteora, antike Stätten in Olympia und Delphi sowie die Strände der Chalkidiki",
    cuisine:       "Souvlaki, Moussaka, Bauernsalat und Retsina",
    bestFor:       "Kultur, Wandern und Strandurlaub",
    flightTime:    "rund 2,5 bis 3 Stunden ab Frankfurt",
    priceRangeWeek:[420, 880],
  },
  "Italien": {
    highlights:    "das Kolosseum in Rom, die Kanäle Venedigs, die Hügellandschaft der Toskana und die Felsendörfer der Amalfiküste",
    cuisine:       "Pasta, Pizza, Espresso und regionale Weine",
    bestFor:       "Kultur, Küche und Strände",
    flightTime:    "rund 1,5 bis 2,5 Stunden ab Frankfurt",
    priceRangeWeek:[480, 1100],
  },
  "Portugal": {
    highlights:    "die Felsenküste der Algarve, das Lissabonner Alfama-Viertel, die Portweinkeller in Porto und die wilden Atlantikstrände",
    cuisine:       "Bacalhau, Sardinen, Pastéis de Nata und Vinho Verde",
    bestFor:       "Atlantikküste und Städtetrips",
    flightTime:    "rund 3 bis 3,5 Stunden ab Frankfurt",
    priceRangeWeek:[450, 950],
  },
  "Ägypten": {
    highlights:    "die Pyramiden von Gizeh, die Korallenriffe des Roten Meeres, das Tal der Könige in Luxor und Wüstentouren ins Hinterland",
    cuisine:       "Koshari, Falafel, Ful Medames und gegrillter Fisch vom Roten Meer",
    bestFor:       "Tauchen, Schnorcheln und Kulturreisen",
    flightTime:    "rund 4 bis 4,5 Stunden ab Frankfurt",
    priceRangeWeek:[400, 850],
  },
  "Tunesien": {
    highlights:    "die Medina von Tunis, das Amphitheater von El Jem, die Sahara südlich von Douz und Sandstrände in Hammamet und Djerba",
    cuisine:       "Couscous, Brik, Harissa und Pfefferminztee",
    bestFor:       "Strandurlaub und Wüstenabenteuer",
    flightTime:    "rund 2,5 bis 3 Stunden ab Frankfurt",
    priceRangeWeek:[330, 700],
  },
  "Marokko": {
    highlights:    "die Souks von Marrakesch, das Atlasgebirge, die blaue Stadt Chefchaouen und Kameltouren in der Sahara",
    cuisine:       "Tajine, Couscous, Pastilla und Pfefferminztee",
    bestFor:       "Märkte, Wüstentouren und orientalisches Flair",
    flightTime:    "rund 3,5 bis 4 Stunden ab Frankfurt",
    priceRangeWeek:[420, 900],
  },
  "Kroatien": {
    highlights:    "die Altstadt von Dubrovnik, die Wasserfälle der Plitvicer Seen, die Inseln Hvar und Brač und das glasklare Adriawasser",
    cuisine:       "Adria-Fisch, Pršut-Schinken, Pasticada und kroatische Weine",
    bestFor:       "Adriaurlaub, Inselhopping und Yachtfahrten",
    flightTime:    "rund 1,5 bis 2 Stunden ab Frankfurt",
    priceRangeWeek:[480, 1050],
  },
  "Bulgarien": {
    highlights:    "die Sandstrände am Goldstrand und Sonnenstrand, die Altstadt von Plovdiv, das Rila-Gebirge und das Rila-Kloster",
    cuisine:       "Shopska-Salat, Banitsa, gegrilltes Lamm und Rakija",
    bestFor:       "günstigen Strandurlaub am Schwarzen Meer",
    flightTime:    "rund 2,5 Stunden ab Frankfurt",
    priceRangeWeek:[290, 620],
  },
  "Zypern": {
    highlights:    "die Strände von Ayia Napa und Protaras, antike Tempel in Paphos, das Troodos-Gebirge und die Halbinsel Akamas",
    cuisine:       "Meze, Halloumi, Souvla und Commandaria-Wein",
    bestFor:       "lange Badesaison von April bis November",
    flightTime:    "rund 3,5 Stunden ab Frankfurt",
    priceRangeWeek:[450, 920],
  },
  "Malta Gozo Comino": {
    highlights:    "Valletta als kleinste Hauptstadt Europas, die Blaue Lagune auf Comino, prähistorische Megalith-Tempel und Tauchspots an der Steilküste",
    cuisine:       "Pastizzi, Stuffat tal-Fenek und maltesische Weine",
    bestFor:       "Tauchen, Geschichte und Mittelmeerflair",
    flightTime:    "rund 2,5 bis 3 Stunden ab Frankfurt",
    priceRangeWeek:[470, 950],
  },
  "Vereinigte Arabische Emirate": {
    highlights:    "die Skyline und der Burj Khalifa in Dubai, die Sheikh-Zayed-Moschee in Abu Dhabi, Wüstensafaris und Luxushotels am Persischen Golf",
    cuisine:       "Mezze, Hummus, gegrilltes Lammfleisch und arabischer Kaffee",
    bestFor:       "Luxusurlaub, Shopping und Stopover",
    flightTime:    "rund 6 Stunden ab Frankfurt",
    priceRangeWeek:[800, 1900],
  },
  "Thailand": {
    highlights:    "die Tempel und Streetfood-Märkte in Bangkok, die Strände von Phuket und Koh Samui, die Inseln in der Andamanensee und der Norden um Chiang Mai",
    cuisine:       "Pad Thai, Tom Yum, grünes Curry und Mango Sticky Rice",
    bestFor:       "Strandurlaub, Streetfood und Kultur",
    flightTime:    "rund 11 Stunden ab Frankfurt",
    priceRangeWeek:[950, 1900],
  },
  "Malediven": {
    highlights:    "Überwasserbungalows, türkisfarbene Lagunen, Korallenriffe und einsame Sandbänke",
    cuisine:       "Mas Huni, Curry mit Kokos und frischer Thunfisch",
    bestFor:       "Tauchen, Schnorcheln und Honeymoon",
    flightTime:    "rund 9,5 Stunden ab Frankfurt",
    priceRangeWeek:[1700, 4200],
  },
  "Mauritius": {
    highlights:    "die Lagune von Trou aux Biches, der Black-River-Gorges-Nationalpark, kreolische Dörfer und Premium-Resorts an der Westküste",
    cuisine:       "Kreolisches Curry, Dholl Puri, frischer Fisch und Rum",
    bestFor:       "Strände und Hochzeitsreisen",
    flightTime:    "rund 11 Stunden ab Frankfurt",
    priceRangeWeek:[1500, 3500],
  },
  "Seychellen": {
    highlights:    "die Granitfelsen am Anse Source d'Argent, dichte Tropenwälder im Morne Seychellois, Schildkröten auf Curieuse und die Insel La Digue",
    cuisine:       "Kreolische Küche mit Fisch, Reis und tropischen Früchten",
    bestFor:       "Inselhopping, Tauchen und Honeymoon",
    flightTime:    "rund 10 Stunden ab Frankfurt",
    priceRangeWeek:[1800, 4000],
  },
  "Dominikanische Republik": {
    highlights:    "endlose Sandstrände in Punta Cana, die Kolonialstadt Santo Domingo, Wasserfälle bei Damajagua und die Halbinsel Samaná",
    cuisine:       "Mangu, gegrillter Hummer, frische Tropenfrüchte und Rum",
    bestFor:       "All-Inclusive-Karibikurlaub",
    flightTime:    "rund 9,5 Stunden ab Frankfurt",
    priceRangeWeek:[1100, 2400],
  },
  "Kuba": {
    highlights:    "Havannas Altstadt mit Oldtimern, die Tabakplantagen im Viñales-Tal, koloniales Trinidad und die Strände von Varadero",
    cuisine:       "Ropa Vieja, schwarze Bohnen, Mojitos und kubanische Zigarren",
    bestFor:       "Kultur und karibische Strände",
    flightTime:    "rund 11 Stunden ab Frankfurt",
    priceRangeWeek:[1100, 2300],
  },
  "Mexiko": {
    highlights:    "Maya-Stätten in Tulum und Chichén Itzá, türkisfarbene Cenotes, der weiße Sand von Cancún und die Riviera Maya",
    cuisine:       "Tacos, Guacamole, Tamales und Mezcal",
    bestFor:       "Karibikstrände und Maya-Kultur",
    flightTime:    "rund 11 Stunden ab Frankfurt",
    priceRangeWeek:[1200, 2600],
  },
  "USA": {
    highlights:    "die Skyline New Yorks, der Sunset Strip in Los Angeles, die Strände Floridas und die Nationalparks im Westen",
    cuisine:       "Burger, BBQ, Diners-Klassiker und vielfältige Ethnoküche",
    bestFor:       "Städte- und Roadtrip-Urlaub",
    flightTime:    "8 bis 11 Stunden ab Frankfurt",
    priceRangeWeek:[950, 2400],
  },
  "Frankreich": {
    highlights:    "Paris mit Eiffelturm und Louvre, die Weingüter im Burgund, die Lavendelfelder der Provence und die Strände der Côte d'Azur",
    cuisine:       "Croissants, Käseauswahl, Bouillabaisse und französische Weine",
    bestFor:       "Kultur, Küche und die Côte d'Azur",
    flightTime:    "rund 1,5 bis 2 Stunden ab Frankfurt",
    priceRangeWeek:[500, 1300],
  },
  "Großbritannien & Irland": {
    highlights:    "London mit Tower und Big Ben, die schottischen Highlands, die irischen Cliffs of Moher und gemütliche Pubs",
    cuisine:       "Fish and Chips, Sunday Roast, Scones und Whisky",
    bestFor:       "Städtetrip und grüne Landschaften",
    flightTime:    "rund 1,5 bis 2 Stunden ab Frankfurt",
    priceRangeWeek:[550, 1300],
  },
  "Österreich": {
    highlights:    "Wien mit Schloss Schönbrunn, das Salzkammergut, die Tiroler Alpen und Salzburg mit seiner Mozart-Geschichte",
    cuisine:       "Wiener Schnitzel, Sachertorte, Knödel und österreichische Weine",
    bestFor:       "Wandern und Skifahren",
    flightTime:    "rund 1 Stunde ab Frankfurt — Auto und Bahn oft attraktiver",
    priceRangeWeek:[480, 1200],
  },
  "Schweiz": {
    highlights:    "die Bergbahn aufs Jungfraujoch, der Genfersee, das Matterhorn bei Zermatt und Schweizer Käseproduzenten",
    cuisine:       "Käsefondue, Raclette, Rösti und Schweizer Schokolade",
    bestFor:       "Berge, Seen und Wintersport",
    flightTime:    "rund 1 Stunde ab Frankfurt — Auto und Bahn oft attraktiver",
    priceRangeWeek:[600, 1500],
  },
  "Deutschland": {
    highlights:    "die Nord- und Ostseeküste, die Bayerischen Alpen, der Schwarzwald und Städte wie Berlin, Hamburg und München",
    cuisine:       "regionale Spezialitäten von Bratwurst über Sauerbraten bis zu frischem Nordseefisch",
    bestFor:       "Familienurlaub im eigenen Land",
    flightTime:    "in 1 bis 6 Stunden mit Auto oder Bahn erreichbar",
    priceRangeWeek:[350, 900],
  },
  "Portugal Madeira": {
    highlights:    "die Levada-Wanderwege, die Steilküste der Westküste, die tropischen Gärten in Funchal und die Pico-Ruivo-Bergroute",
    cuisine:       "Espetada, Bolo do Caco, Bacalhau und Madeira-Wein",
    bestFor:       "Wanderurlaub und ganzjährig mildes Klima",
    flightTime:    "rund 4 Stunden ab Frankfurt",
    priceRangeWeek:[550, 1100],
  },
  "Indien & Sri Lanka": {
    highlights:    "das Taj Mahal in Agra, die Backwaters von Kerala, die Teeplantagen von Sri Lanka und der Tempel von Sigiriya",
    cuisine:       "Curry mit Reis, Naan-Brot, Samosas und süßer Chai",
    bestFor:       "Kultur, Tempel und Strände in Sri Lanka",
    flightTime:    "9 bis 10 Stunden ab Frankfurt",
    priceRangeWeek:[850, 1800],
  },
};

const DEFAULT_COUNTRY_PROFILE: CountryProfile = {
  highlights:    "Sehenswürdigkeiten, Strände und kulinarische Spezialitäten",
  cuisine:       "regionale Spezialitäten",
  bestFor:       "abwechslungsreichen Urlaub",
  flightTime:    "wenige Flugstunden ab Deutschland",
  priceRangeWeek:[450, 1200],
};

// Mehrere Schreibweisen / Abkürzungen auf den kanonischen Schlüssel mappen
const COUNTRY_ALIASES: Record<string, string> = {
  "VAE":                       "Vereinigte Arabische Emirate",
  "Vereinigte Staaten":        "USA",
  "Vereinigte Staaten von Amerika": "USA",
  "United Kingdom":            "Großbritannien & Irland",
  "Großbritannien":            "Großbritannien & Irland",
  "Irland":                    "Großbritannien & Irland",
  "Indien":                    "Indien & Sri Lanka",
  "Sri Lanka":                 "Indien & Sri Lanka",
  "Madeira":                   "Portugal Madeira",
  "Malta":                     "Malta Gozo Comino",
};

function getCountryProfile(country: string): CountryProfile {
  const canonical = COUNTRY_ALIASES[country] ?? country;
  return COUNTRY_PROFILES[canonical] ?? DEFAULT_COUNTRY_PROFILE;
}

interface ClimateNarrative {
  sunDays:    string;     // "rund 300 Sonnentage im Jahr" — passt nach "mit"
  bestMonths: string;     // "Mai bis Oktober" — passt nach "von" oder "ist"
  summerTemp: string;     // "26 bis 32 °C im Sommer"
  vibe:       string;     // 1 vollständiger Satz, beginnt mit Großbuchstabe
}

const CLIMATE_NARRATIVES: Record<ClimateZone, ClimateNarrative> = {
  mediterranean: {
    sunDays:    "rund 300 Sonnentagen im Jahr",
    bestMonths: "Mai bis Oktober",
    summerTemp: "26 bis 32 °C",
    vibe:       "Trockene, sonnige Sommer und milde Winter sorgen für eine lange Badesaison.",
  },
  tropical: {
    sunDays:    "ganzjährig warmen Temperaturen",
    bestMonths: "November bis April (Trockenzeit)",
    summerTemp: "30 bis 33 °C",
    vibe:       "Das tropische Klima sorgt für konstant hohe Temperaturen, badewannenwarmes Meer und üppige Vegetation.",
  },
  tropical_dry: {
    sunDays:    "über 320 Sonnentagen im Jahr",
    bestMonths: "ganzjährig, besonders schön von Oktober bis April",
    summerTemp: "26 bis 30 °C",
    vibe:       "Das trocken-tropische Klima bringt kaum Niederschlag und angenehme Temperaturen das ganze Jahr über.",
  },
  desert: {
    sunDays:    "fast ganzjährigem Sonnenschein",
    bestMonths: "Oktober bis April",
    summerTemp: "über 35 °C im Hochsommer",
    vibe:       "Heiße, trockene Wüstenluft mit klaren Sternennächten — Winter und Frühjahr sind die angenehmsten Monate.",
  },
  atlantic: {
    sunDays:    "rund 280 Sonnentagen im Jahr",
    bestMonths: "Juni bis September",
    summerTemp: "22 bis 26 °C",
    vibe:       "Eine frische Atlantikbrise hält die Sommer angenehm und sorgt für ungewöhnlich milde Winter.",
  },
  continental: {
    sunDays:    "rund 200 Sonnentagen im Jahr",
    bestMonths: "Mai bis September",
    summerTemp: "22 bis 28 °C",
    vibe:       "Vier ausgeprägte Jahreszeiten bringen warme Sommer, schneereiche Winter und beständiges Wetter im Herbst.",
  },
  alpine: {
    sunDays:    "rund 230 Sonnentagen im Jahr",
    bestMonths: "Juni bis September oder Dezember bis März für Wintersport",
    summerTemp: "18 bis 25 °C im Tal",
    vibe:       "Das Alpenklima verbindet warme Sommertage im Tal mit schneereichen Wintern und glasklarer Bergluft.",
  },
  arctic: {
    sunDays:    "Mitternachtssonne im Sommer und Polarnacht im Winter",
    bestMonths: "Juni bis August oder Januar bis März für Nordlichter",
    summerTemp: "12 bis 18 °C im Sommer",
    vibe:       "Mitternachtssonne, Nordlichter und unberührte Natur prägen das arktische Klima.",
  },
};

/** Deterministischer Hash → variant index. Gleicher Slug → gleicher Text. */
function variantIndex(slug: string, salt: string, max: number): number {
  let h = 0;
  const s = slug + salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % max;
}

export function generateMetaTitle(entry: CatalogEntry): string {
  const year = new Date().getFullYear();
  const v = variantIndex(entry.slug, "title", 4);
  if (entry.type === "super") {
    const variants = [
      `${entry.name} Urlaub ${year} – Pauschalreisen, Hotels & Reisetipps`,
      `Urlaub in ${entry.name} ${year}: Pauschalreisen, All Inclusive & Last Minute`,
      `${entry.name} Reisen ${year} – Hotels, Angebote & Reiseführer`,
      `${entry.name}: Pauschalreisen & Reisetipps ${year}`,
    ];
    return `${variants[v]} | Urlaubfinder365`;
  }
  const countryTag = entry.name === entry.country ? "" : ` (${entry.country})`;
  const variants = [
    `${entry.name} Urlaub ${year} – Pauschalreisen & Hotels günstig`,
    `${entry.name} Reisen ${year}: All Inclusive, Hotels & Reisetipps`,
    `Urlaub ${entry.name}: Pauschalreisen, Last Minute & Reiseführer ${year}`,
    `${entry.name}${countryTag} ${year} – Hotels, Angebote & Reiseinfos`,
  ];
  return `${variants[v]} | Urlaubfinder365`;
}

export function generateMetaDescription(entry: CatalogEntry): string {
  const profile = getCountryProfile(entry.country);
  const climate = CLIMATE_NARRATIVES[entry.climateZone];
  const v = variantIndex(entry.slug, "metadesc", 4);

  const variants = [
    `${entry.name} Urlaub buchen: Pauschalreisen, All Inclusive und Last Minute mit ${climate.sunDays}, beste Reisezeit ${climate.bestMonths}. Jetzt Hotels und Angebote vergleichen.`,
    `Urlaub in ${entry.name}: ${climate.summerTemp}, ${profile.bestFor}, Flugzeit ${profile.flightTime}. Pauschalreisen und Hotels jetzt vergleichen.`,
    `${entry.name} (${entry.country}) — ${climate.bestMonths} ist die beste Reisezeit. Pauschalreisen, All Inclusive und Hotels mit aktuellen Preisen vergleichen.`,
    `Pauschalreisen nach ${entry.name}: ${profile.flightTime}, ideale Reisezeit ${climate.bestMonths}. Aktuelle Hotelangebote, Last Minute und Reisetipps auf einen Blick.`,
  ];
  return variants[v];
}

export function generateDescription(entry: CatalogEntry): string {
  const profile = getCountryProfile(entry.country);
  const climate = CLIMATE_NARRATIVES[entry.climateZone];
  const v = variantIndex(entry.slug, "desc", 4);

  // Bei Sub-Regions wird klar gesagt, dass die Highlights vom Land sind
  // (z. B. "Italien ist bekannt für …") — sonst klingt es nach Verwechslung.
  const isSubRegion = entry.type === "region" && entry.name !== entry.country;
  const highlightSubject = isSubRegion ? entry.country : entry.name;

  const placeLabel = entry.name === entry.country
    ? entry.name
    : `${entry.name} in ${entry.country}`;

  // 4 verschiedene Satz-Strukturen, deterministisch per Hash ausgewählt
  const variants = [
    // Variante A: klimazentriert
    `Mit ${climate.sunDays} und Sommertemperaturen von ${climate.summerTemp} ist ${placeLabel} ein attraktives Reiseziel. ${climate.vibe} Bekannt ist ${highlightSubject} für ${profile.highlights}. Auf den Tellern stehen ${profile.cuisine}. Pauschalreisen ab 7 Tagen kosten typischerweise zwischen ${profile.priceRangeWeek[0]} und ${profile.priceRangeWeek[1]} € pro Person, Flugzeit ${profile.flightTime}.`,
    // Variante B: highlights-zentriert
    `Wer ${entry.name} besucht, kommt vor allem für ${profile.bestFor}. ${highlightSubject === entry.name ? "Die Region ist" : `${highlightSubject} ist`} bekannt für ${profile.highlights}. ${climate.vibe} Die beste Reisezeit liegt zwischen ${climate.bestMonths}, mit ${climate.summerTemp} im Sommer. Eine Woche Pauschalreise kostet je nach Saison ${profile.priceRangeWeek[0]} bis ${profile.priceRangeWeek[1]} € pro Person — die Anreise dauert ${profile.flightTime}.`,
    // Variante C: praktisch / Reise-orientiert
    `${entry.name} liegt ${profile.flightTime} entfernt und eignet sich für ${profile.bestFor}. Beste Reisezeit ist ${climate.bestMonths} mit ${climate.summerTemp}. ${highlightSubject === entry.name ? "Vor Ort warten" : `${highlightSubject} ist bekannt für`} ${profile.highlights}. Kulinarisch lohnt sich ein Blick auf ${profile.cuisine}. Pauschalpreise pro Person und Woche bewegen sich zwischen ${profile.priceRangeWeek[0]} und ${profile.priceRangeWeek[1]} €.`,
    // Variante D: kompakter Reiseführer-Stil
    `${entry.name} ist ein beliebtes Ziel für ${profile.bestFor}. ${highlightSubject === entry.name ? "Charakteristisch sind" : `${highlightSubject} ist bekannt für`} ${profile.highlights}. ${climate.vibe} Die beste Reisezeit liegt zwischen ${climate.bestMonths}, die Flugzeit beträgt ${profile.flightTime}. Auf der Speisekarte: ${profile.cuisine}. Eine Pauschalreise (7 Tage, 2 Personen) liegt preislich bei ${profile.priceRangeWeek[0]}–${profile.priceRangeWeek[1]} € pro Person.`,
  ];
  return variants[v];
}

export function generateHeroUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop&q=80&ixlib=rb-4.0.3`;
  // Note: Unsplash search doesn't support dynamic keywords via URL in production.
  // Using a curated fallback per climate zone in generateHeroFallback instead.
  void encoded;
}

// Per-keyword curated Unsplash fallbacks – jede Destination hat ein eigenes Foto
const HERO_FALLBACKS: Record<string, string> = {
  // Balearen
  "formentera beach spain":         "https://images.unsplash.com/photo-1523289917096-b640e6e64f58?w=1600&q=80",
  "ibiza spain beach":              "https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=1600&q=80",
  "mallorca cove beach":            "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1600&q=80",
  "menorca beach turquoise":        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  // Kanaren
  "fuerteventura beach dunes":      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80",
  "gran canaria beach sand":        "https://images.unsplash.com/photo-1692697936225-249a57ad0e5c?w=1600&q=80",
  "lanzarote volcano landscape":    "https://images.unsplash.com/photo-1685636600601-c7c78b8366ef?w=1600&q=80",
  "tenerife volcano landscape":     "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "la palma canary island":         "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80",
  // Spanien
  "andalusia spain landscape":      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "barcelona catalonia spain":      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80",
  "costa blanca alicante":          "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1600&q=80",
  "costa brava beach spain":        "https://images.unsplash.com/photo-1561016444-14f747499547?w=1600&q=80",
  "costa del sol malaga beach":     "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80",
  "costa dorada tarragona spain":   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "madrid spain city":              "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "valencia spain city coast":      "https://images.unsplash.com/photo-1599982890963-3aabd60064d2?w=1600&q=80",
  "catalonia spain landscape":      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80",
  // Portugal
  "algarve portugal beach":         "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
  "azores island ocean":            "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  "lisbon portugal city":           "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1600&q=80",
  "madeira island flowers":         "https://images.unsplash.com/photo-1688669546785-3c06792e10e1?w=1600&q=80",
  "porto portugal bridge":          "https://images.unsplash.com/photo-1555881400-69a2384edcd4?w=1600&q=80",
  // Türkei
  "antalya turkey turquoise coast": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "istanbul turkey bosphorus":      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "bodrum turkey aegean":           "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "cappadocia turkey hot air":      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
  "aegean turkey coast":            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  // Griechenland
  "athens acropolis greece":        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "chalkidiki beach greece":        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80",
  "peloponnese greece coast":       "https://images.unsplash.com/photo-1531693251400-ed5e00dc2b9e?w=1600&q=80",
  "corfu greece beach":             "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=1600&q=80",
  "kos greece beach":               "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600&q=80",
  "crete greece beach":             "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80",
  "mykonos greece windmills":       "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&q=80",
  "rhodes greece medieval city":    "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "santorini blue dome sunset":     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "zakynthos shipwreck beach":      "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=1600&q=80",
  "kefalonia greece turquoise":     "https://images.unsplash.com/photo-1555624435-d57b87c836b8?w=1600&q=80",
  "thassos greece beach":           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80",
  "lefkada greece lagoon":          "https://images.unsplash.com/photo-1669411397081-808c2c8f5acf?w=1600&q=80",
  // Ägypten
  "hurghada egypt red sea":         "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80",
  "sharm el sheikh egypt reef":     "https://images.unsplash.com/photo-1544014400-73d4059e6cc4?w=1600&q=80",
  "marsa alam egypt diving":        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80",
  "cairo egypt pyramids":           "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  // Tunesien
  "djerba tunisia beach":           "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80",
  "hammamet tunisia resort":        "https://images.unsplash.com/photo-1548813831-f8e7e974d3aa?w=1600&q=80",
  "monastir tunisia coast":         "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1600&q=80",
  // Marokko
  "agadir morocco beach":           "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1600&q=80",
  "marrakech morocco souk":         "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1600&q=80",
  // VAE
  "dubai skyline burj khalifa":     "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
  "abu dhabi uae modern":           "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1600&q=80",
  "ras al khaimah uae mountains":   "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
  // Thailand
  "bangkok thailand temple":        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80",
  "phuket thailand beach":          "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80",
  "koh samui thailand palm":        "https://images.unsplash.com/photo-1518379370532-52d984c3aafd?w=1600&q=80",
  "khao lak thailand beach":        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600&q=80",
  "pattaya thailand coast":         "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Bali/Asien
  "bali indonesia temple rice":     "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
  "vietnam ha long bay":            "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=80",
  "singapore city skyline":         "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80",
  "georgia tbilisi city":           "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600&q=80",
  // Indischer Ozean
  "maldives overwater bungalow":    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  "mauritius island beach":         "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80",
  "seychelles beach palm":          "https://images.unsplash.com/photo-1573997868729-b7019f95cfb2?w=1600&q=80",
  // Indien
  "goa india beach":                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
  "delhi india gateway":            "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "sri lanka beach palm":           "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1600&q=80",
  // Karibik
  "jamaica beach tropical":         "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  "curacao colorful waterfront":    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
  "punta cana beach palm":          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "puerto plata beach caribbean":   "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
  "havana cuba colorful streets":   "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "cancun mexico beach resort":     "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
  "riviera maya mexico beach":      "https://images.unsplash.com/photo-1573548842355-73bb50e50b83?w=1600&q=80",
  "yucatan mexico ruins":           "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&q=80",
  // Italien
  "tuscany rolling hills italy":    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&q=80",
  "venice italy canal gondola":     "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&q=80",
  "rome italy colosseum":           "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80",
  "sicily italy coast":             "https://images.unsplash.com/photo-1523289917096-b640e6e64f58?w=1600&q=80",
  "sardinia italy beach":           "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=1600&q=80",
  "lake garda italy mountains":     "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=80",
  "amalfi coast italy cliffs":      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1600&q=80",
  "puglia italy trulli":            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
  "rimini italy adriatic beach":    "https://images.unsplash.com/photo-1530214804894-2e64cd4e2454?w=1600&q=80",
  "calabria italy beach":           "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=1600&q=80",
  // Frankreich
  "paris eiffel tower france":      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
  "cote azur nice france":          "https://images.unsplash.com/photo-1534970028765-91e34f8b5e1b?w=1600&q=80",
  "provence lavender france":       "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&q=80",
  "corsica france mountain sea":    "https://images.unsplash.com/photo-1574887427561-d3d5d58c9273?w=1600&q=80",
  "brittany france coast":          "https://images.unsplash.com/photo-1555581680-7d7d1e87c00e?w=1600&q=80",
  // UK
  "london england big ben":         "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "scotland highlands landscape":   "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "dublin ireland cliffs":          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  // Kroatien
  "dubrovnik croatia old town":     "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "split croatia palace":           "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  "zadar croatia coast":            "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "istria croatia coast":           "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "hvar island croatia":            "https://images.unsplash.com/photo-1596463989429-64a0f0c27862?w=1600&q=80",
  "zagreb croatia city":            "https://images.unsplash.com/photo-1555348607-6c16b9eb25ea?w=1600&q=80",
  // Österreich/Schweiz
  "vienna austria palace":          "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1600&q=80",
  "tyrol austria mountains":        "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
  "salzburg austria mountains":     "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  "zurich switzerland lake":        "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1600&q=80",
  "geneva switzerland alps":        "https://images.unsplash.com/photo-1525825630168-e44a41a0cfb7?w=1600&q=80",
  "ticino switzerland mediterranean":"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  // Malta/Zypern/Bulgarien
  "malta ancient temples sea":      "https://images.unsplash.com/photo-1582531579313-b68e5b7bcab7?w=1600&q=80",
  "gozo malta cliffs":              "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "cyprus beach mediterranean":     "https://images.unsplash.com/photo-1710106793368-82f483165c7f?w=1600&q=80",
  "cyprus north coast":             "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
  "golden sands bulgaria beach":    "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=1600&q=80",
  "sunny beach bulgaria":           "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80",
  "sofia bulgaria city":            "https://images.unsplash.com/photo-1545315003-8f45c0a6cbf2?w=1600&q=80",
  // Skandinavien/BeNeLux
  "amsterdam netherlands canals":   "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80",
  "brussels belgium grand place":   "https://images.unsplash.com/photo-1559598460-2b8b3c7c18b6?w=1600&q=80",
  "oslo norway fjord city":         "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=1600&q=80",
  "stockholm sweden city water":    "https://images.unsplash.com/photo-1518982380512-5a3c6883e8b5?w=1600&q=80",
  "helsinki finland harbor":        "https://images.unsplash.com/photo-1553565057-1a6c36f98a1e?w=1600&q=80",
  "lapland finland northern lights":"https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  "copenhagen denmark nyhavn":      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1600&q=80",
  "reykjavik iceland northern lights":"https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  // Deutschland
  "berlin germany city":            "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "bavaria germany alps":           "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
  "black forest germany":           "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "ruegen island baltic sea":       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "north sea coast germany":        "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  "allgaeu germany mountains":      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  // Afrika/Naher Osten
  "kenya safari elephant":          "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
  "zanzibar tanzania beach":        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80",
  "cape town south africa mountain":"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1600&q=80",
  "johannesburg south africa city": "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1600&q=80",
  "cape verde beach atlantic":      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  "amman jordan ancient city":      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  "muscat oman mountains":          "https://images.unsplash.com/photo-1586118502404-7e50f6c44cd4?w=1600&q=80",
  "doha qatar skyline":             "https://images.unsplash.com/photo-1544084944-15269ec7b5a0?w=1600&q=80",
  // USA/Kanada/Lateinamerika
  "florida beach miami":            "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=1600&q=80",
  "new york city skyline":          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=80",
  "california los angeles beach":   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "las vegas nevada strip night":   "https://images.unsplash.com/photo-1531765408077-9a1f85f90df1?w=1600&q=80",
  "toronto canada city lake":       "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1600&q=80",
  "vancouver canada mountains":     "https://images.unsplash.com/photo-1560814304-4f05b62af116?w=1600&q=80",
  "buenos aires argentina city":    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1600&q=80",

  // ── Catalog Super-Region Keywords ─────────────────────────────────────────
  "balearic islands turquoise cove":          "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1600&q=80",
  "canary islands volcanic landscape":        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "spain costa del sol beach":                "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "portugal algarve cliffs coastline":        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
  "turkey turquoise coast sailing":           "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "greece ancient ruins parthenon":           "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "greek islands whitewashed village sea":    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "egypt pyramids desert sunset":             "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  "tunisia medina blue architecture":         "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80",
  "morocco marrakech riad courtyard":         "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1600&q=80",
  "cyprus aphrodite beach crystal water":     "https://images.unsplash.com/photo-1710106793368-82f483165c7f?w=1600&q=80",
  "bulgaria black sea beach resort":          "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80",
  "north sea germany coastline lighthouse":   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "berlin city architecture skyline":         "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "bavaria alps neuschwanstein castle":       "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  "rhine valley germany castles vineyard":    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "tallinn old town medieval architecture":   "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1600&q=80",
  "prague old town square colorful buildings":"https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=1600&q=80",
  "balkans scenic mountains village":         "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "monaco harbor luxury yachts":              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80",
  "france lavender fields provence":          "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&q=80",
  "uk countryside rolling hills village":     "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "iceland northern lights aurora waterfall": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  "italy tuscany cypress trees rolling hills": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1600&q=80",
  "malta blue lagoon crystal water":          "https://images.unsplash.com/photo-1582531579313-b68e5b7bcab7?w=1600&q=80",
  "croatia dubrovnik old city walls adriatic":"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  "austria alps mountain village snow":       "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1600&q=80",
  "switzerland lake mountains reflection":    "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1600&q=80",
  "amsterdam canal houses tulips":            "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80",
  "scandinavia fjord norway majestic":        "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=1600&q=80",
  "denmark copenhagen colorful nyhavn harbour":"https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1600&q=80",
  "africa savanna wildlife safari sunset":    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
  "south africa cape town table mountain":    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1600&q=80",
  "cape verde atlantic island beach":         "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  "middle east desert wadi ancient ruins":    "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  "dubai skyline modern architecture desert": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
  "asia temple rice terraces bali":           "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
  "thailand tropical beach turquoise water":  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80",
  "india taj mahal sunrise golden":           "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "maldives overwater bungalow turquoise lagoon":"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  "caribbean turquoise sea palm beach":       "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  "dominican republic punta cana palm beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "cuba havana vintage cars colorful streets":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "mexico cancun beach turquoise water resort":"https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
  "central america jungle volcano tropical":  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600&q=80",
  "south america andes mountains machu picchu":"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&q=80",
  "canada mountains lake banff rocky":        "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1600&q=80",
  "usa midwest great plains landscape":       "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&q=80",
  "new york city skyline manhattan":          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=80",
  "california pacific coast highway sunset":  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "gulf of mexico florida beach white sand":  "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=1600&q=80",
  // ── Catalog Sub-Region Keywords ────────────────────────────────────────────
  // Balearen
  "formentera turquoise water white sand beach":"https://images.unsplash.com/photo-1523289917096-b640e6e64f58?w=1600&q=80",
  "ibiza cala salada turquoise cove":         "https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=1600&q=80",
  "mallorca cove beach turquoise water cliffs":"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1600&q=80",
  "menorca hidden cove turquoise sea":        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  // Kanaren
  "el hierro volcanic island atlantic":       "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "fuerteventura dunes white sand beach wind":"https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80",
  "gran canaria maspalomas dunes sunset":     "https://images.unsplash.com/photo-1692697936225-249a57ad0e5c?w=1600&q=80",
  "la gomera lush green valleys canary":      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "lanzarote volcanic landscape fire mountains":"https://images.unsplash.com/photo-1685636600601-c7c78b8366ef?w=1600&q=80",
  "la palma green island canary volcanic crater":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80",
  "tenerife teide volcano landscape":         "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  // Spanien
  "andalusia alhambra granada spain":         "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "barcelona sagrada familia architecture":   "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80",
  "costa blanca spain white beach alicante":  "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1600&q=80",
  "costa brava cala rocky cove catalonia":    "https://images.unsplash.com/photo-1561016444-14f747499547?w=1600&q=80",
  "almeria spain desert beach cabo de gata":  "https://images.unsplash.com/photo-1599982890963-3aabd60064d2?w=1600&q=80",
  "costa de la luz tarifa beach atlantic":    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "costa azahar orange blossom coast valencia":"https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80",
  "costa del sol marbella beach sunshine":    "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1600&q=80",
  "costa dorada golden beach salou spain":    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "madrid gran via cityscape spain":          "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "valencia spain city arts sciences architecture":"https://images.unsplash.com/photo-1599982890963-3aabd60064d2?w=1600&q=80",
  "catalonia pyrenees mountains village spain":"https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80",
  // Portugal
  "algarve portugal cliffs golden beach":     "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
  "azores sao miguel volcanic lake green":    "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  "lisbon tram colorful street portugal":     "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1600&q=80",
  "madeira island levada lush tropical green":"https://images.unsplash.com/photo-1688669546785-3c06792e10e1?w=1600&q=80",
  "porto ribeira colorful houses douro river":"https://images.unsplash.com/photo-1555881400-69a2384edcd4?w=1600&q=80",
  // Türkei
  "antalya turkey beach turquoise water resort":"https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1600&q=80",
  "istanbul bosphorus mosque skyline":        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "turkey aegean coast kusadasi ancient ruins":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "bodrum turkey harbor castle white village":"https://images.unsplash.com/photo-1529528018027-2ee0409703af?w=1600&q=80",
  "cappadocia hot air balloon fairy chimneys":"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
  // Griechenland
  "athens acropolis parthenon greece":        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "halkidiki beach turquoise water pine trees":"https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80",
  "mount olympus greece coastline beach":     "https://images.unsplash.com/photo-1531693251400-ed5e00dc2b9e?w=1600&q=80",
  "peloponnese greece ancient ruins nafplio": "https://images.unsplash.com/photo-1531693251400-ed5e00dc2b9e?w=1600&q=80",
  "corfu greece emerald sea beach old town":  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80",
  "kos greece beach clear water palm trees":  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600&q=80",
  "crete balos lagoon turquoise beach":       "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80",
  "mykonos windmill white architecture cyclades":"https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1600&q=80",
  "rhodes greece medieval old town acropolis":"https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1600&q=80",
  "santorini blue dome white buildings caldera":"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "zakynthos navagio shipwreck beach greece": "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=1600&q=80",
  "kefalonia myrtos beach turquoise greece":  "https://images.unsplash.com/photo-1555624435-d57b87c836b8?w=1600&q=80",
  "lefkada porto katsiki beach turquoise cliffs":"https://images.unsplash.com/photo-1669411397081-808c2c8f5acf?w=1600&q=80",
  "thassos greece marble beach turquoise water":"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  // Ägypten
  "hurghada red sea beach resort coral":      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80",
  "sharm el sheikh sinai coral reef diving":  "https://images.unsplash.com/photo-1544014400-73d4059e6cc4?w=1600&q=80",
  "marsa alam red sea pristine diving turtle":"https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80",
  "cairo giza pyramids sphinx egypt ancient": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  // Tunesien
  "djerba tunisia beach palm trees mediterranean":"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80",
  "hammamet tunisia medina beach resort":     "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80",
  "monastir tunisia ribat fortress coastline":"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1600&q=80",
  // Marokko
  "agadir morocco beach atlantic sunset":     "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1600&q=80",
  "marrakech souks djemaa el fna square":     "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1600&q=80",
  // Zypern/Bulgarien
  "cyprus south limassol beach blue sea":     "https://images.unsplash.com/photo-1710106793368-82f483165c7f?w=1600&q=80",
  "north cyprus kyrenia harbor castle":       "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
  "golden sands bulgaria black sea beach":    "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=1600&q=80",
  "sunny beach bulgaria black sea resort":    "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80",
  "sofia bulgaria alexander nevsky cathedral":"https://images.unsplash.com/photo-1545315003-8f45c0a6cbf2?w=1600&q=80",
  // Deutschland
  "baltic sea germany beach pier sunset":     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "north sea germany mudflat lighthouse":     "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  "ruegen white chalk cliffs jasmund baltic sea":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "usedom baltic sea beach resort germany":   "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80",
  "berlin city night skyline brandenburger tor":"https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "bavaria neuschwanstein castle alps autumn":"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
  "black forest germany misty pine trees village":"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "allgaeu alps meadow flowers mountains germany":"https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "cologne cathedral rhine germany":          "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  // Frankreich
  "cote d azur nice french riviera beach":    "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&q=80",
  "corsica turquoise beach mountains france": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  "paris eiffel tower seine river sunset":    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
  "provence lavender field village france":   "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&q=80",
  "brittany france coastal cliffs lighthouse":"https://images.unsplash.com/photo-1555581680-7d7d1e87c00e?w=1600&q=80",
  // UK/Irland/Island
  "london tower bridge thames cityscape":     "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "scotland highlands loch misty mountains":  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "dublin ireland colorful pub street":       "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1600&q=80",
  "iceland geysir waterfall northern lights": "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  // Italien
  "puglia trulli alberobello italy":          "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
  "lake garda italy mountain reflection village":"https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=80",
  "sardinia costa smeralda turquoise sea beach":"https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=1600&q=80",
  "sicily agrigento temples valley sunset":   "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=1600&q=80",
  "tuscany rolling hills cypress trees vineyards":"https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&q=80",
  "venice canal gondola italy romantic":      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&q=80",
  "rome colosseum ancient italy golden hour": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80",
  "amalfi coast positano italy colorful cliffs sea":"https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1600&q=80",
  "rimini adriatic sea beach italy resort":   "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=1600&q=80",
  "calabria italy tropea cliff village sea":  "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=1600&q=80",
  // Malta/Kroatien
  "malta valletta golden harbor baroque architecture":"https://images.unsplash.com/photo-1571166985066-81d97975f4e7?w=1600&q=80",
  "gozo malta blue lagoon comino sea":        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "dubrovnik old town walls adriatic sea":    "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "split croatia diocletian palace harbor":   "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  "zadar croatia sea organ sunset adriatic":  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "istria croatia pula amphitheatre vineyards":"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "hvar island croatia lavender town harbor": "https://images.unsplash.com/photo-1596463989429-64a0f0c27862?w=1600&q=80",
  "zagreb croatia upper town cathedral":      "https://images.unsplash.com/photo-1555348607-6c16b9eb25ea?w=1600&q=80",
  // Österreich/Schweiz/BeNeLux
  "vienna schoenbrunn palace austria baroque":"https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1600&q=80",
  "tyrol austria alpine village snow mountains":"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
  "salzburg austria fortress old city mountains":"https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  "zurich lake switzerland old town":         "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1600&q=80",
  "geneva lake switzerland jet d eau":        "https://images.unsplash.com/photo-1525825630168-e44a41a0cfb7?w=1600&q=80",
  "ticino switzerland lake lugano mediterranean":"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  "amsterdam canal houses tulips spring":     "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80",
  "brussels grand place belgium architecture":"https://images.unsplash.com/photo-1559598460-2b8b3c7c18b6?w=1600&q=80",
  // Skandinavien
  "oslo fjord norway city waterfront":        "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=1600&q=80",
  "stockholm gamla stan old town sweden water":"https://images.unsplash.com/photo-1518982380512-5a3c6883e8b5?w=1600&q=80",
  "helsinki finland cathedral senate square": "https://images.unsplash.com/photo-1553565057-1a6c36f98a1e?w=1600&q=80",
  "lapland finland reindeer snow aurora":     "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  "copenhagen nyhavn colorful houses denmark":"https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1600&q=80",
  // VAE/Orient
  "dubai burj khalifa skyline desert":        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
  "abu dhabi sheikh zayed mosque grand":      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1600&q=80",
  "ras al khaimah uae mountains desert beach":"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
  "petra jordan rose city ancient treasury":  "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
  "oman muscat grand mosque sultan":          "https://images.unsplash.com/photo-1544084944-15269ec7b5a0?w=1600&q=80",
  "qatar doha skyline corniche modern":       "https://images.unsplash.com/photo-1544084944-15269ec7b5a0?w=1600&q=80",
  // Afrika
  "kenya mombasa beach ocean palms safari":   "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
  "zanzibar white sand beach turquoise ocean":"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80",
  "cape town table mountain harbor south africa":"https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1600&q=80",
  "johannesburg south africa city skyline":   "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1600&q=80",
  "cape verde sal island beach atlantic kite":"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  // Thailand
  "bangkok temple wat grand palace thailand": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80",
  "phuket beach thailand limestone cliffs sea":"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80",
  "koh samui coconut palm beach thailand":    "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80",
  "khao lak thailand jungle beach pristine":  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600&q=80",
  "pattaya thailand beach resort waterfront": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Asien
  "bali rice terrace temple spiritual tropical":"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
  "vietnam halong bay limestone karst sea mist":"https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=80",
  "singapore marina bay sands skyline night": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80",
  "georgia tbilisi old town caucasus mountains":"https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600&q=80",
  // Indien/Indischer Ozean
  "goa india beach palm sunset tropical":     "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
  "delhi india india gate taj mahal agra":    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
  "sri lanka sigiriya rock temple jungle":    "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1600&q=80",
  "maldives overwater bungalow turquoise lagoon coral":"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
  "mauritius beach lagoon tropical island paradise":"https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80",
  "seychelles granite boulders beach turquoise":"https://images.unsplash.com/photo-1573997868729-b7019f95cfb2?w=1600&q=80",
  // Karibik/Amerika
  "jamaica beach palm reggae caribbean sea":  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  "curacao willemstad colorful houses caribbean":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80",
  "punta cana beach palm resort dominican":   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "puerto plata dominican republic north coast beach":"https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
  "havana cuba classic cars malecon colorful":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "cancun mexico turquoise beach resort luxury":"https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
  "riviera maya tulum ruins beach mexico cenote":"https://images.unsplash.com/photo-1573548842355-73bb50e50b83?w=1600&q=80",
  "yucatan chichen itza maya pyramid mexico":  "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&q=80",
  "orlando florida theme park sunshine":      "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=1600&q=80",
  "new york city manhattan skyline sunset":   "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=80",
  "miami beach south beach florida ocean":    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "california golden gate bridge san francisco":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  // ─── Neue Destinations ────────────────────────────────────────────────────
  // Türkei – Sub-Destinationen (alle visuell geprüft)
  "side turkey roman temple sea ruins":           "https://images.unsplash.com/photo-1561712815-883650f32f92?w=1600&q=80",
  "alanya turkey castle cliff mediterranean":     "https://images.unsplash.com/photo-1701855081405-546cb8753b5a?w=1600&q=80",
  "belek turkey golf resort luxury pool":         "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=1600&q=80",
  "oludeniz blue lagoon turkey paragliding":      "https://images.unsplash.com/photo-1498222954553-93fc8d1941da?w=1600&q=80",
  "antalya old town harbor turkey turquoise":     "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "kusadasi turkey aegean sea harbor":            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "cesme turkey aegean coast windmill":           "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "marmaris turkey bay marina sailing boats":     "https://images.unsplash.com/photo-1529528018027-2ee0409703af?w=1600&q=80",
  "dalyan turkey river delta loggerhead turtles": "https://images.unsplash.com/photo-1651002754376-379014f145f8?w=1600&q=80",
  // Griechenland – neue Inseln
  "samos greece olive trees bay coastline":       "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "naxos greece portara temple beach cyclades":   "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "paros greece white village windmill cyclades": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "skiathos greece pine forest beach turquoise":  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "lesbos greece petrified forest olive groves":  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "ios greece cyclades white village hilltop church":"https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
  "kalymnos greece dodecanese colorful harbour boats":"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
  "milos greece colourful fishing village volcanic":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Italien – neue
  "naples italy vesuvius bay coast panorama":     "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&q=80",
  "florence italy ponte vecchio arno duomo":      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1600&q=80",
  "capri italy island villa luxury cliffs blue grotto":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "ischia italy volcanic island thermal spa beach":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "cinque terre italy colorful cliffside villages sea":"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&q=80",
  "umbria italy rolling hills medieval hill town": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1600&q=80",
  "rimini italy adriatic beach umbrella pier":    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  // Spanien – neue
  "seville spain flamenco plaza alcazar cathedral":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
  "granada spain alhambra palace sierra nevada":  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
  "marbella spain marina luxury yachts old town": "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80",
  "benidorm spain skyline beach nightlife":       "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1600&q=80",
  "palma mallorca cathedral gothic harbor old town":"https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1600&q=80",
  // Kroatien – neue
  "makarska riviera croatia beach biokovo mountain":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "pula croatia roman amphitheatre adriatic coast":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "rovinj croatia old town adriatic peninsula church":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "trogir croatia old town island cathedral waterfront":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "korcula croatia old walled town medieval sea": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Portugal – neue
  "cascais portugal atlantic coast fishing village":"https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "alentejo portugal rolling hills cork trees vineyard":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "setubal portugal natural park cliffs atlantic beach":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Ägypten – neue
  "el gouna egypt red sea lagoon resort":         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "luxor egypt karnak temple columns nile":       "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600&q=80",
  // Karibik – neue
  "aruba eagle beach caribbean palm trees turquoise":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "barbados caribbean beach rum island palm sunset":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "guadeloupe french caribbean island beach tropical":"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
  "st lucia pitons caribbean volcanic peaks luxury":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  // Thailand – neue
  "krabi thailand limestone cliffs longtail boat beach":"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80",
  "hua hin thailand beach resort promenade":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80",
  "chiang mai thailand temple monks mountains jungle":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  // Asien – neue
  "lombok indonesia rice terraces rinjani volcano beach":"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&q=80",
  "philippines palawan island hopping turquoise lagoon":"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "myanmar bagan temples sunrise pagodas golden": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "kuala lumpur malaysia petronas towers skyline": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  // ── Neu hinzugefügte Regionen (Spanien/Portugal/Türkei/Japan) ─────────────
  // Spanien
  "aragon spain zaragoza pyrenees mountains":           "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80",
  "murcia spain cathedral beach mar menor":             "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "navarra spain pamplona rioja wine vineyards":        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80",
  "pyrenees mountains spain france snow hiking":        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  "galicia spain atlantic coast green landscape santiago compostela": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1600&q=80",
  "toledo spain castille meseta historic old town":     "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=1600&q=80",
  "costa azahar valencia orange blossom beach spain":   "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80",
  // Portugal
  "coimbra portugal university historic city green hills": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1600&q=80",
  "northern portugal vinho verde douro valley vineyards braga": "https://images.unsplash.com/photo-1555881400-69a2384edcd4?w=1600&q=80",
  "costa caparica portugal long sandy beach atlantic waves": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "costa prata portugal silver coast beach waves nazare": "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=1600&q=80",
  "estoril portugal coast casino sintra palace beach":  "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1600&q=80",
  "minho portugal green coast viana castelo beach":     "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1600&q=80",
  "porto santo island madeira golden beach atlantic portugal": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1600&q=80",
  // Türkei
  "istanbul sea marmara bosphorus turkish coast":       "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80",
  "black sea coast turkey trabzon green mountains":     "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  "turkey interior anatolia pamukkale salt lake landscape": "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=1600&q=80",
  // Japan
  "japan cherry blossom sakura temple kyoto":           "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=80",
  "tokyo japan shibuya crossing night neon":            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80",
  "kyoto japan fushimi inari shrine bamboo arashiyama": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80",
  // Nordamerika / Südamerika (im Katalog, aber nicht auf Urlaubsziele-Seite)
  "las vegas strip nevada night lights":                "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1600&q=80",
  "toronto canada cn tower skyline lake":               "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1600&q=80",
  "vancouver canada mountains sea skyline":             "https://images.unsplash.com/photo-1560814304-4f05b62af116?w=1600&q=80",
  "buenos aires argentina tango colorful la boca":      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1600&q=80",
};

const CLIMATE_ZONE_FALLBACK = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";

export function generateHeroFallback(keyword: string): string {
  return HERO_FALLBACKS[keyword] ?? CLIMATE_ZONE_FALLBACK;
}

// ─── Climate Templates ───────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

const CLIMATE_TEMPLATES: Record<ClimateZone, Array<[number, number, number]>> = {
  // [tempHigh, tempLow, rain]
  mediterranean: [
    [15, 8, 60], [16, 9, 50], [18, 11, 40], [22, 14, 30], [26, 18, 20], [30, 22, 8],
    [33, 24, 3],  [33, 24, 5],  [28, 21, 20], [24, 17, 45], [19, 13, 65], [16, 9, 65],
  ],
  tropical: [
    [33, 25, 65], [33, 25, 55], [34, 25, 80], [34, 26, 120], [33, 26, 200], [32, 26, 180],
    [31, 25, 200], [31, 25, 230], [31, 25, 260], [31, 25, 230], [32, 25, 120], [32, 25, 70],
  ],
  tropical_dry: [
    [21, 14, 10], [22, 15, 10], [23, 16, 8],  [24, 17, 5],  [25, 18, 2],  [26, 19, 0],
    [28, 20, 0],  [28, 21, 0],  [27, 20, 5],  [25, 18, 10], [23, 16, 15], [21, 15, 12],
  ],
  desert: [
    [20, 12, 5],  [22, 14, 3],  [26, 17, 2],  [31, 22, 0],  [36, 26, 0],  [38, 28, 0],
    [39, 29, 0],  [39, 29, 0],  [36, 27, 0],  [33, 24, 2],  [27, 18, 3],  [22, 14, 5],
  ],
  atlantic: [
    [10, 5, 80],  [11, 5, 70],  [13, 7, 65],  [16, 9, 60],  [19, 12, 55], [22, 15, 50],
    [24, 17, 50], [24, 17, 55], [21, 15, 65], [17, 12, 80], [13, 8, 90],  [11, 6, 85],
  ],
  continental: [
    [3, -3, 35],  [5, -2, 30],  [11, 2, 40],  [17, 7, 45],  [22, 12, 55], [25, 15, 65],
    [28, 17, 55], [27, 17, 50], [22, 13, 45], [15, 8, 40],  [8, 3, 40],   [4, -1, 40],
  ],
  alpine: [
    [-2, -8, 55], [0, -7, 45], [6, -2, 50],  [12, 3, 60],  [17, 7, 70],  [21, 11, 80],
    [24, 13, 75], [23, 13, 75], [18, 9, 65],  [12, 4, 60],  [5, -1, 60],  [0, -5, 60],
  ],
  arctic: [
    [2, -3, 50],  [3, -3, 45], [5, -1, 50],  [9, 2, 40],   [13, 5, 35],  [16, 8, 40],
    [18, 10, 45], [17, 10, 50], [13, 7, 55],  [8, 3, 65],   [4, 0, 65],   [2, -2, 55],
  ],
};

export function generateClimate(zone: ClimateZone): ClimateMonth[] {
  const template = CLIMATE_TEMPLATES[zone];
  return MONTHS.map((month, i) => ({
    month,
    tempHigh: template[i][0],
    tempLow:  template[i][1],
    rain:     template[i][2],
  }));
}

// ─── FAQ Templates ───────────────────────────────────────────────────────────

function bestMonthsForZone(zone: ClimateZone): string {
  const best: Record<ClimateZone, string> = {
    mediterranean: "Mai bis Oktober",
    tropical:      "November bis April (Trockenzeit)",
    tropical_dry:  "Ganzjährig – besonders schön von November bis März",
    desert:        "Oktober bis April (angenehme Temperaturen)",
    atlantic:      "Juni bis September",
    continental:   "Mai bis September",
    alpine:        "Juni bis September oder Dezember bis März (Wintersport)",
    arctic:        "Juni bis August (Mitternachtssonne) oder Januar bis März (Nordlichter)",
  };
  return best[zone];
}

export function generateFaqs(
  entry: CatalogEntry
): Array<{ question: string; answer: string }> {
  const profile = getCountryProfile(entry.country);
  const climate = CLIMATE_NARRATIVES[entry.climateZone];
  const name    = entry.name;

  // Anreise: Direktflug-Hinweis nur bei vorhandenem IATA-Code
  const arrival = entry.iataCode
    ? `Der Flughafen ${entry.iataCode} wird ab Frankfurt, München, Düsseldorf und weiteren deutschen Drehkreuzen direkt angeflogen. Die Flugzeit beträgt ${profile.flightTime}.`
    : `Die Anreise erfolgt meist über den nächstgelegenen internationalen Flughafen mit Direktflügen aus Deutschland oder einem kurzen Anschluss. Flugzeit: ${profile.flightTime}.`;

  // Saisonale Hinweise je Klimazone
  const seasonHints: Partial<Record<ClimateZone, string>> = {
    mediterranean: "Im Juli und August ist es am heißesten und am vollsten, im Mai/Juni und September/Oktober findest du angenehme Temperaturen, weniger Trubel und oft günstigere Preise.",
    tropical:      "Die Trockenzeit zwischen November und April bietet stabiles Wetter; in der Regenzeit fallen kurze, kräftige Schauer, die schnell wieder vorüber sind.",
    tropical_dry:  "Die Temperaturen schwanken kaum übers Jahr — selbst im Winter bleiben die Tage mild und sonnig.",
    desert:        "Im Sommer wird es teils sehr heiß. Wer Strand und Ausflüge kombinieren will, reist besser zwischen Oktober und April.",
    atlantic:      "Atlantische Brisen halten die Sommer angenehm; im Winter bleibt es mild, aber wechselhaft.",
    continental:   "Die Sommerferien sind die beliebteste Reisezeit, im Herbst überzeugen warme Tage und kühle Abende.",
    alpine:        "Sommer für Wanderer, Winter für Skifahrer — die Saison hängt davon ab, was du suchst.",
    arctic:        "Reise im Sommer für Mitternachtssonne und milde Temperaturen, im Winter für Polarlichter und Schnee.",
  };
  const seasonHint = seasonHints[entry.climateZone] ?? "";

  // Familienhinweis je Land/Klima
  const familyHint =
    entry.climateZone === "mediterranean" || entry.climateZone === "tropical_dry"
      ? `Für Familien ist ${name} besonders attraktiv: Hotels mit Kinderbecken, Animation und All-Inclusive-Verpflegung sind weit verbreitet, viele Strände flach abfallend.`
      : entry.climateZone === "tropical"
      ? `Familien mit Kindern finden in ${name} familienfreundliche Resorts mit Pools, Kinderclubs und kurzen Wegen zum Strand. Wegen der langen Flugzeit lohnt sich meist ein Aufenthalt von zwei Wochen.`
      : entry.climateZone === "alpine" || entry.climateZone === "continental"
      ? `${name} eignet sich für Familien mit Kindern verschiedenen Alters — Wanderungen, Seen, Tierparks und im Winter Skifahren bieten ein vielseitiges Programm.`
      : `${name} ist ein beliebtes Reiseziel für Familien. Viele Hotels bieten Kinderbetreuung, Pools und vegetarische Optionen — All-Inclusive-Häuser machen die Tagesplanung besonders einfach.`;

  return [
    {
      question: `Wann ist die beste Reisezeit für ${name}?`,
      answer:   `Für ${name} ist ${climate.bestMonths} die beste Reisezeit. Mit ${climate.sunDays} und ${climate.summerTemp} herrschen dann die idealen Bedingungen. ${seasonHint}`,
    },
    {
      question: `Wie kommt man nach ${name}?`,
      answer:   `${arrival} Pauschalreisen kombinieren Flug und Hotel und sind oft günstiger als Einzelbuchungen. Die aktuellen Angebote findest du direkt weiter oben auf dieser Seite.`,
    },
    {
      question: `Was kostet ein Urlaub in ${name}?`,
      answer:   `Eine Pauschalreise (7 Tage, 2 Personen, Hotel + Flug) liegt für ${name} typischerweise zwischen ${profile.priceRangeWeek[0]} und ${profile.priceRangeWeek[1]} € pro Person. Last-Minute-Buchungen und Nebensaison drücken den Preis nach unten, Hochsaison und 5-Sterne-Hotels nach oben. Die tagesaktuellen Preise siehst du in den Angeboten weiter oben.`,
    },
    {
      question: `Was kann man in ${name} unternehmen?`,
      answer:   `${entry.country !== name ? `${entry.country} ist bekannt für` : "Die Region steht für"} ${profile.highlights}. Direkt vor Ort lohnen sich Tagesausflüge, Bootstouren entlang der Küste und kulinarische Erlebnisse: Auf den Tellern stehen ${profile.cuisine}. Aktivitäten und Tickets kannst du bequem vorab buchen.`,
    },
    {
      question: `Ist ${name} für Familien mit Kindern geeignet?`,
      answer:   familyHint,
    },
  ];
}

// ─── EntryInfo Templates ─────────────────────────────────────────────────────

export function generateEntryInfo(country: string, ibeBpRegion: string): EntryInfo {
  const templates: Record<string, EntryInfo> = {
    eu: {
      visa:     "Kein Visum erforderlich für EU-Bürger. Reisepass oder Personalausweis genügt.",
      currency: "Euro (€) – In den meisten Ländern der EU-Zone akzeptiert. Kartenzahlung weit verbreitet.",
      language: "Je nach Land. Englisch wird in touristischen Gebieten häufig gesprochen.",
      timezone: "Mitteleuropäische Zeit (MEZ/MESZ) oder abweichend je nach Land.",
      voltage:  "220–230 V, 50 Hz. Steckdosen Typ C/F (Schuko) – kein Adapter nötig.",
      health:   "Europäische Krankenversicherungskarte (EHIC) empfohlen. Auslandskrankenversicherung sinnvoll.",
    },
    turkey: {
      visa:     "E-Visum erforderlich für deutsche Staatsangehörige (ca. 35 USD, online beantragen). Reisepass mit mind. 6 Monaten Gültigkeit.",
      currency: "Türkische Lira (TRY). Euro und US-Dollar in Touristengebieten akzeptiert. Kreditkarten weit verbreitet.",
      language: "Türkisch. In Touristengebieten und Hotels wird Englisch und Deutsch gesprochen.",
      timezone: "UTC+3 (keine Sommerzeit). Deutschland liegt 1–2 Stunden hinter der Türkei.",
      voltage:  "220 V, 50 Hz. Steckdosen Typ F – kein Adapter nötig.",
      health:   "Auslandskrankenversicherung dringend empfohlen. Staatliche Impfung gegen Hepatitis A sinnvoll.",
    },
    africa: {
      visa:     "Visapflicht je nach Land und Staatsangehörigkeit – bitte vorab prüfen. Oft Visum on arrival oder E-Visum möglich.",
      currency: "Lokale Währung je nach Land. Euro und US-Dollar häufig als Zahlungsmittel akzeptiert.",
      language: "Je nach Land Arabisch, Französisch, Englisch oder lokale Sprachen. In Touristengebieten Englisch üblich.",
      timezone: "Abweichend je nach Land – meist UTC bis UTC+4.",
      voltage:  "220–240 V, 50 Hz. Steckertyp je nach Land variiert – Adapter empfohlen.",
      health:   "Auslandskrankenversicherung mit Notfallevakuierung dringend empfohlen. Impfungen je nach Urlaubsziel (Malaria, Hepatitis, Gelbfieber) – Reisemediziner konsultieren.",
    },
    asia: {
      visa:     "Visabestimmungen je nach Land unterschiedlich. Für viele Länder Visum bei Einreise oder E-Visum möglich.",
      currency: "Lokale Währung je nach Land. Kreditkarten in Städten akzeptiert, Bargeld in ländlichen Gebieten empfohlen.",
      language: "Je nach Land. Englisch wird in Touristenzentren gesprochen.",
      timezone: "Variiert stark je nach Destination (UTC+5:30 bis UTC+9).",
      voltage:  "110–240 V je nach Land. Steckertypen variieren – Universal-Adapter empfohlen.",
      health:   "Auslandskrankenversicherung empfohlen. Impfungen je nach Zielland (Hepatitis, Typhus, Japanische Enzephalitis) – Reisemediziner befragen.",
    },
    americas: {
      visa:     "Einreisebestimmungen je nach Land. Für die USA ESTA-Genehmigung erforderlich (ca. 21 USD). Andere Länder oft kein Visum oder Visum bei Einreise.",
      currency: "Lokale Währung je nach Land. US-Dollar in vielen Karibik-Ländern und Mittelamerika akzeptiert.",
      language: "Englisch (USA, Kanada, Karibik), Spanisch (Lateinamerika), Französisch (Martinique, Guadeloupe).",
      timezone: "Stark variierend je nach Destination (UTC-10 bis UTC-3).",
      voltage:  "110–120 V in USA/Kanada/Karibik (Adapter nötig), 220 V in Teilen Lateinamerikas.",
      health:   "Auslandskrankenversicherung dringend empfohlen. In tropischen Regionen Malariaprophylaxe und Impfungen prüfen.",
    },
  };

  return templates[ibeBpRegion] ?? templates.eu;
}

// ─── Catalog → DestinationConfig ────────────────────────────────────────────

export function catalogToConfig(entry: CatalogEntry): DestinationConfig {
  const heroFallback = generateHeroFallback(entry.unsplashKeyword);

  return {
    slug:               entry.slug,
    name:               entry.name,
    regionIds:          [Number(entry.ibeRegionId)],
    country:            entry.country,
    heroImage:          `/images/destinations/${entry.slug}-hero.jpg`,
    heroImageFallback:  heroFallback,
    cardImage:          heroFallback,
    description:        generateDescription(entry),
    metaTitle:          generateMetaTitle(entry),
    metaDescription:    generateMetaDescription(entry),
    iataCode:           entry.iataCode,
    ibeBpRegion:        entry.ibeBpRegion,
    ibeRegionId:        entry.ibeRegionId,
    tiqetsCityId:       entry.tiqetsCityId,
    faqs:               generateFaqs(entry),
    entryInfo:          generateEntryInfo(entry.country, entry.ibeBpRegion),
    climate:            generateClimate(entry.climateZone),
    coordinates:        entry.coordinates,
    // No tiqetsNiches, guideSlug, carLocationKey for catalog entries
  };
}
