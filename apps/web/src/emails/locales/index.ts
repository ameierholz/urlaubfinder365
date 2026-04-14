import type { EmailLocale } from "./types";
import { de } from "./de";
import { en } from "./en";
import { tr } from "./tr";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pl } from "./pl";
import { ru } from "./ru";
import { ar } from "./ar";

const locales: Record<string, EmailLocale> = { de, en, tr, es, fr, it, pl, ru, ar };

export function getLocale(sprache?: string | null): EmailLocale {
  return locales[sprache ?? "de"] ?? de;
}

export type { EmailLocale };
