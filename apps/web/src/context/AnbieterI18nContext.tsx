"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import de, { type AnbieterTranslations } from "@/lib/i18n/anbieter/de";

type Sprache = "de" | "en" | "tr" | "es" | "fr" | "it" | "pl" | "ru" | "ar";

interface I18nCtx {
  t:       AnbieterTranslations;
  sprache: Sprache;
  setSprache: (lang: Sprache) => void;
  isPending: boolean;
}

const AnbieterI18nContext = createContext<I18nCtx>({
  t:       de,
  sprache: "de",
  setSprache: () => {},
  isPending: false,
});

const TRANSLATIONS: Record<Sprache, () => Promise<{ default: AnbieterTranslations }>> = {
  de: () => import("@/lib/i18n/anbieter/de"),
  en: () => import("@/lib/i18n/anbieter/en"),
  tr: () => import("@/lib/i18n/anbieter/tr"),
  es: () => import("@/lib/i18n/anbieter/es"),
  fr: () => import("@/lib/i18n/anbieter/fr"),
  it: () => import("@/lib/i18n/anbieter/it"),
  pl: () => import("@/lib/i18n/anbieter/pl"),
  ru: () => import("@/lib/i18n/anbieter/ru"),
  ar: () => import("@/lib/i18n/anbieter/ar"),
};

interface ProviderProps {
  children:      ReactNode;
  initialSprache: Sprache;
  anbieter_id:   string;
}

export function AnbieterI18nProvider({ children, initialSprache, anbieter_id }: ProviderProps) {
  const [sprache, setSpracheState] = useState<Sprache>(initialSprache);
  const [translations, setTranslations] = useState<AnbieterTranslations>(de);
  const [isPending, startTransition]    = useTransition();

  // Load initial translations if not German
  if (initialSprache !== "de" && translations === de) {
    TRANSLATIONS[initialSprache]().then((m) => setTranslations(m.default));
  }

  const setSprache = (lang: Sprache) => {
    if (lang === sprache) return;
    startTransition(async () => {
      const mod = await TRANSLATIONS[lang]();
      setTranslations(mod.default);
      setSpracheState(lang);
      // Persist to DB (fire-and-forget)
      fetch("/api/anbieter/sprache", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ sprache: lang, anbieter_id }),
      }).catch(() => {});
    });
  };

  return (
    <AnbieterI18nContext.Provider value={{ t: translations, sprache, setSprache, isPending }}>
      {children}
    </AnbieterI18nContext.Provider>
  );
}

export function useT() {
  return useContext(AnbieterI18nContext);
}
