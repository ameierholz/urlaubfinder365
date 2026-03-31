export interface TiqetsCategory {
  id: string;
  label: string;
  emoji: string;
  tagIds: number[];
}

export const TIQETS_CATEGORIES: TiqetsCategory[] = [
  { id: "history",     label: "Geschichte & Kultur",  emoji: "🏰", tagIds: [705, 706, 707, 708, 710, 1942] },
  { id: "sightseeing", label: "Sightseeing & Touren", emoji: "🗺️", tagIds: [1032, 1035, 1040, 1042] },
  { id: "nature",      label: "Natur",                emoji: "🌿", tagIds: [724, 725, 726] },
  { id: "adventure",   label: "Abenteuer",            emoji: "🎯", tagIds: [1033, 1036, 1037, 1038, 1039] },
  { id: "food",        label: "Food & Drinks",        emoji: "🍽️", tagIds: [1034, 1398, 1399] },
  { id: "attractions", label: "Attraktionen",         emoji: "🎡", tagIds: [962, 1086] },
  { id: "services",    label: "Services",             emoji: "🛎️", tagIds: [1048, 1840] },
];

export function matchesCategory(tagIds: number[] = [], categoryId: string): boolean {
  const cat = TIQETS_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return false;
  return tagIds.some((id) => cat.tagIds.includes(id));
}

export function getPrimaryCategory(tagIds: number[] = []): TiqetsCategory | undefined {
  return TIQETS_CATEGORIES.find((cat) => tagIds.some((id) => cat.tagIds.includes(id)));
}
