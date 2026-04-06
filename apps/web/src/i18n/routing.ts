import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "tr", "es", "fr", "it", "pl", "ru", "ar", "zh", "ko", "vi"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  // DE hat kein Präfix → bestehende URLs bleiben erhalten
  localePrefix: "as-needed",
});

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pl: "Polski",
  ru: "Русский",
  ar: "العربية",
  zh: "中文",
  ko: "한국어",
  vi: "Tiếng Việt",
};

export const localeFlagCodes: Record<Locale, string> = {
  de: "de",
  en: "gb",
  tr: "tr",
  es: "es",
  fr: "fr",
  it: "it",
  pl: "pl",
  ru: "ru",
  ar: "sa",
  zh: "cn",
  ko: "kr",
  vi: "vn",
};

/** Basis-URL für hreflang-Tags */
export const SITE_URL = "https://www.urlaubfinder365.de";

/** Gibt alle hreflang-Alternate-URLs für eine gegebene Pfad zurück */
export function getAlternateUrls(pathWithoutLocale: string) {
  const path = pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === "de"
        ? `${SITE_URL}${path}`
        : `${SITE_URL}/${locale}${path}`,
    ])
  ) as Record<Locale, string>;
}
