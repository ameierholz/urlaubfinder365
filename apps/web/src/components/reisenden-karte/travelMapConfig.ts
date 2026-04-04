import { TravelTipCategory } from "@/types";

export const CATEGORY_CONFIG: Record<TravelTipCategory, { label: string; emoji: string; color: string }> = {
  geheimtipp:        { label: "Geheimtipp",            emoji: "🌟", color: "#00838F" },
  sehenswuerdigkeit: { label: "Sehenswürdigkeit",      emoji: "🏛️", color: "#3B82F6" },
  gastronomie:       { label: "Restaurant / Café",     emoji: "🍽️", color: "#F97316" },
  strand:            { label: "Strand / Baden",        emoji: "🏖️", color: "#06B6D4" },
  unterkunft:        { label: "Unterkunft",             emoji: "🏨", color: "#8B5CF6" },
  shopping:          { label: "Shopping / Markt",      emoji: "🛍️", color: "#EC4899" },
  natur:             { label: "Natur / Aussichtspunkt", emoji: "🌿", color: "#22C55E" },
  nachtleben:        { label: "Nachtleben / Bar",      emoji: "🎉", color: "#A855F7" },
  transport:         { label: "Transport / Anreise",   emoji: "🚌", color: "#64748B" },
  negativ:           { label: "Nicht empfehlenswert",  emoji: "👎", color: "#EF4444" },
};

export const FILTER_OPTIONS: { value: TravelTipCategory | "all"; label: string; emoji: string }[] = [
  { value: "all",               label: "Alle",                  emoji: "🗺️" },
  { value: "geheimtipp",        label: "Geheimtipps",           emoji: "🌟" },
  { value: "sehenswuerdigkeit", label: "Sehenswürdigkeiten",    emoji: "🏛️" },
  { value: "gastronomie",       label: "Restaurants",           emoji: "🍽️" },
  { value: "strand",            label: "Strand / Baden",        emoji: "🏖️" },
  { value: "unterkunft",        label: "Unterkünfte",           emoji: "🏨" },
  { value: "shopping",          label: "Shopping",              emoji: "🛍️" },
  { value: "natur",             label: "Natur",                 emoji: "🌿" },
  { value: "nachtleben",        label: "Nachtleben",            emoji: "🎉" },
  { value: "transport",         label: "Transport",             emoji: "🚌" },
  { value: "negativ",           label: "Nicht empfehlenswert",  emoji: "👎" },
];
