import type { EmailLocale } from "./types";
import { de } from "./de";
import { en } from "./en";
import { tr } from "./tr";
import { es } from "./es";

const locales: Record<string, EmailLocale> = { de, en, tr, es };

export function getLocale(sprache?: string | null): EmailLocale {
  return locales[sprache ?? "de"] ?? de;
}

export type { EmailLocale };
