import { TravelTipCategory } from "@/types";

export const CATEGORY_CONFIG: Record<TravelTipCategory, { label: string; emoji: string; color: string }> = {
  geheimtipp:        { label: "Geheimtipp",           emoji: "🌟", color: "#00838F" },
  sehenswuerdigkeit: { label: "Besonderer Ort",        emoji: "🏛️", color: "#3B82F6" },
  gastronomie:       { label: "Gastronomie",            emoji: "🍽️", color: "#F97316" },
  negativ:           { label: "Nicht empfehlenswert",  emoji: "👎", color: "#EF4444" },
};

export const FILTER_OPTIONS: { value: TravelTipCategory | "all"; label: string; emoji: string }[] = [
  { value: "all",               label: "Alle",                 emoji: "🗺️" },
  { value: "geheimtipp",        label: "Geheimtipps",          emoji: "🌟" },
  { value: "sehenswuerdigkeit", label: "Besondere Orte",       emoji: "🏛️" },
  { value: "gastronomie",       label: "Gastronomie",           emoji: "🍽️" },
  { value: "negativ",           label: "Nicht empfehlenswert", emoji: "👎" },
];
