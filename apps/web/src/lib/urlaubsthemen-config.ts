/**
 * Zentrale Konfiguration der Urlaubsthemen.
 * Wird sowohl von der Index-Seite (/urlaubsthemen/) für Kacheln
 * als auch von den Detail-Seiten für Hero-Bilder genutzt.
 *
 * Ziel: EIN Bild pro Thema – Kachel & Hero nutzen die gleiche Unsplash-ID.
 */

export interface UrlaubsthemaConfig {
  slug: string;
  label: string;
  emoji: string;
  desc: string;
  /** Unsplash Photo-ID – wird via themeImage() zu einer vollen URL */
  imageId: string;
  /** Tailwind-Gradient-Klasse für die Kachel auf der Index-Seite */
  cardGradient: string;
  /** Hex-Akzentfarbe für die Detail-Seite (Badge, Buttons, Hover) */
  accentColor: string;
  /** Begleit-Farbe für den Highlight-Span im H1 (helle Variante) */
  accentLight: string;
}

export const URLAUBSTHEMEN: UrlaubsthemaConfig[] = [
  {
    slug: "adults-only",
    label: "Adults Only",
    emoji: "💑",
    desc: "Paare & Erwachsene – ruhig, romantisch, exklusiv",
    imageId: "photo-1515934751635-c81c6bc9a2d8",
    cardGradient: "from-rose-500/80 to-pink-700/80",
    accentColor: "#e11d48",
    accentLight: "text-rose-200",
  },
  {
    slug: "familienurlaub",
    label: "Familienurlaub",
    emoji: "👨‍👩‍👧‍👦",
    desc: "Kinderclub, Wasserpark & Animation für die ganze Familie",
    imageId: "photo-1511895426328-dc8714191300",
    cardGradient: "from-sky-500/80 to-blue-700/80",
    accentColor: "#d97706",
    accentLight: "text-amber-200",
  },
  {
    slug: "strandurlaub",
    label: "Strandurlaub",
    emoji: "🏖️",
    desc: "Traumhotels in bester Strandlage am Meer",
    imageId: "photo-1507525428034-b723cf961d3e",
    cardGradient: "from-teal-500/80 to-cyan-700/80",
    accentColor: "#0284c7",
    accentLight: "text-teal-200",
  },
  {
    slug: "wellnessurlaub",
    label: "Wellnessurlaub",
    emoji: "🧖",
    desc: "Spa, Sauna & pure Entspannung für Körper und Geist",
    imageId: "photo-1540555700478-4be289fbecef",
    cardGradient: "from-emerald-500/80 to-green-700/80",
    accentColor: "#0d9488",
    accentLight: "text-emerald-200",
  },
  {
    slug: "staedtereisen",
    label: "Städtereisen",
    emoji: "🏙️",
    desc: "Metropolen, Kultur und Gastronomie entdecken",
    imageId: "photo-1499856871958-5b9627545d1a",
    cardGradient: "from-violet-500/80 to-purple-700/80",
    accentColor: "#475569",
    accentLight: "text-violet-200",
  },
  {
    slug: "hochzeitsreise",
    label: "Hochzeitsreise",
    emoji: "💒",
    desc: "Flitterwochen in 5-Sterne All-Inclusive Resorts",
    imageId: "photo-1519225421980-715cb0215aed",
    cardGradient: "from-pink-500/80 to-rose-700/80",
    accentColor: "#db2777",
    accentLight: "text-pink-200",
  },
  {
    slug: "abenteuerurlaub",
    label: "Abenteuerurlaub",
    emoji: "🧗",
    desc: "Action, Sport & Outdoor – Tauchen, Wandern, Surfen",
    imageId: "photo-1551632811-561732d1e306",
    cardGradient: "from-orange-500/80 to-red-700/80",
    accentColor: "#ea580c",
    accentLight: "text-orange-200",
  },
  {
    slug: "luxusurlaub",
    label: "Luxusurlaub",
    emoji: "👑",
    desc: "5-Sterne Hotels & Resorts – exklusiv und unvergesslich",
    imageId: "photo-1571896349842-33c89424de2d",
    cardGradient: "from-amber-500/80 to-yellow-700/80",
    accentColor: "#ca8a04",
    accentLight: "text-amber-200",
  },
  {
    slug: "singlereisen",
    label: "Singlereisen",
    emoji: "🧳",
    desc: "Solo reisen – neue Menschen kennenlernen",
    imageId: "photo-1503220317375-aaad61436b1b",
    cardGradient: "from-teal-500/80 to-cyan-700/80",
    accentColor: "#7c3aed",
    accentLight: "text-violet-200",
  },
  {
    slug: "aktivurlaub",
    label: "Aktivurlaub",
    emoji: "🏃",
    desc: "Golf, Tauchen, Surfen & Wandern – Sport pur",
    imageId: "photo-1530789253388-582c481c54b0",
    cardGradient: "from-lime-500/80 to-green-700/80",
    accentColor: "#16a34a",
    accentLight: "text-lime-200",
  },
  {
    slug: "kurreisen",
    label: "Kurreisen",
    emoji: "💧",
    desc: "Heilbäder, Thermalquellen & Naturheilkunde",
    imageId: "photo-1544161515-4ab6ce6db874",
    cardGradient: "from-cyan-500/80 to-blue-700/80",
    accentColor: "#0891b2",
    accentLight: "text-cyan-200",
  },
  {
    slug: "seniorenreisen",
    label: "Seniorenreisen",
    emoji: "🌟",
    desc: "Entspannter Urlaub ab 60 – barrierefrei & komfortabel",
    imageId: "photo-1510414842594-a61c69b5ae57",
    cardGradient: "from-blue-500/80 to-indigo-700/80",
    accentColor: "#2563eb",
    accentLight: "text-blue-200",
  },
];

/**
 * Baut eine Unsplash-URL in gewünschter Breite.
 * @param imageId Photo-ID, z.B. "photo-1515934751635-c81c6bc9a2d8"
 * @param width   Pixelbreite (600 für Kachel, 1920 für Hero)
 * @param quality JPEG-Qualität 0-100
 */
export function themeImage(imageId: string, width: number, quality = 80): string {
  return `https://images.unsplash.com/${imageId}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export function getTheme(slug: string): UrlaubsthemaConfig | undefined {
  return URLAUBSTHEMEN.find((t) => t.slug === slug);
}
