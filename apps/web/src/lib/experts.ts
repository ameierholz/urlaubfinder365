export interface Expert {
  name: string;
  role: string;
  /** SVG-Avatar-Gradient (2 Farben) – Bilder sind 100% einzigartig, nicht recherchierbar */
  gradient: [string, string];
  /** Dekoratives Icon unten rechts im Avatar */
  icon: string;
}

export const EXPERTS: Record<string, Expert> = {
  manuel: {
    name: "Manuel Richter",
    role: "Reiseexperte Türkei & Ägypten",
    gradient: ["#e46c3a", "#b33f1a"], // warm orange – Wüste/Orient
    icon: "🏛️",
  },
  susanne: {
    name: "Susanne Weber",
    role: "Reiseexpertin Balearen & Wellness",
    gradient: ["#2bb89a", "#0d7a6e"], // türkis – Mittelmeer/Wellness
    icon: "🧖",
  },
  thomas: {
    name: "Thomas Berger",
    role: "Reiseexperte Fernreisen & Kreuzfahrten",
    gradient: ["#4a6dc6", "#1b3a8a"], // tiefblau – Ozean
    icon: "⚓",
  },
  julia: {
    name: "Julia Hoffmann",
    role: "Reiseexpertin Familien & All Inclusive",
    gradient: ["#f0638a", "#b8315e"], // pink/rosé – Familie
    icon: "👨‍👩‍👧",
  },
};
