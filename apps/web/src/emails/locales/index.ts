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
import { zh } from "./zh";
import { ko } from "./ko";
import { vi } from "./vi";

const locales: Record<string, EmailLocale> = { de, en, tr, es, fr, it, pl, ru, ar, zh, ko, vi };

export function getLocale(sprache?: string | null): EmailLocale {
  return locales[sprache ?? "de"] ?? de;
}

export type { EmailLocale };
