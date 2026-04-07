/**
 * Mappt unsere Site-Locale auf den IBE-Sprachcode (specials.de / ypsilon.net).
 * IBE unterstützt: de, en, be, pl, fr, sp, it, nl, tr, cz, ru
 */
const IBE_LANG_MAP: Record<string, string> = {
  de: "de",
  en: "en",
  tr: "tr",
  es: "sp",  // IBE nutzt "sp" statt "es"
  fr: "fr",
  it: "it",
  pl: "pl",
  ru: "ru",
  ar: "en",  // Arabisch nicht von IBE unterstützt → Fallback Englisch
};

export function getIbeLanguage(locale: string): string {
  return IBE_LANG_MAP[locale] ?? "de";
}

/** Hängt _language=XX an eine IBE-URL an */
export function appendIbeLang(url: string, locale: string): string {
  const lang = getIbeLanguage(locale);
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}_language=${lang}`;
}
