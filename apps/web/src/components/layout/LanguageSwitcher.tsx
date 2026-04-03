"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useRef, useEffect, useTransition } from "react";
import { locales, localeNames, localeFlagCodes, type Locale } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const locale   = useLocale() as Locale;
  const router   = useRouter();
  const pathname = usePathname(); // Pfad OHNE Locale-Präfix dank next-intl
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (next: Locale) => {
    if (next === locale) { setOpen(false); return; }
    setOpen(false);
    startTransition(() => {
      // next-intl router.replace setzt Locale-Präfix automatisch korrekt
      router.replace(pathname, { locale: next });
    });
  };

  const currentFlag = localeFlagCodes[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-sm font-semibold text-white disabled:opacity-50"
        aria-label="Change language"
        aria-expanded={open}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://flagcdn.com/w20/${currentFlag}.png`}
          srcSet={`https://flagcdn.com/w40/${currentFlag}.png 2x`}
          width={18}
          height={13}
          alt={locale.toUpperCase()}
          className="rounded-sm object-cover"
        />
        <span className="hidden sm:inline font-bold">{locale.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-300">
          <div className="py-1.5">
            {locales.map((l) => {
              const isActive = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#00838F]/10 text-[#00838F] font-bold"
                      : "text-gray-700 hover:bg-gray-50 font-medium"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w20/${localeFlagCodes[l]}.png`}
                    srcSet={`https://flagcdn.com/w40/${localeFlagCodes[l]}.png 2x`}
                    width={20}
                    height={15}
                    alt={l.toUpperCase()}
                    className="rounded-sm object-cover shrink-0"
                  />
                  <span className="flex-1 text-left">{localeNames[l]}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00838F]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
