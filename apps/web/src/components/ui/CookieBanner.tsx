"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notifyConsentChange } from "@/hooks/use-consent";

interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = "uf365-consent";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export default function CookieBanner() {
  const [status, setStatus] = useState<"loading" | "show" | "hidden">("loading");
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent;
        if (Date.now() - parsed.timestamp < ONE_YEAR_MS) {
          setStatus("hidden");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    // Kleine Verzögerung damit der Banner nicht sofort aufpoppt
    const t = setTimeout(() => setStatus("show"), 800);
    return () => clearTimeout(t);
  }, []);

  const save = (a: boolean, m: boolean) => {
    const c: CookieConsent = {
      necessary: true,
      analytics: a,
      marketing: m,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    notifyConsentChange();
    setStatus("hidden");
  };

  if (status !== "show") return null;

  return (
    <>
      {/* Overlay für Einstellungen */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Settings-Panel */}
      {showSettings && (
        <div className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] bottom-24 z-[9999] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col">
          <div className="px-6 pt-6 pb-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍪</span>
              <h2 className="font-bold text-gray-900 text-base">Cookie-Einstellungen</h2>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Notwendige Cookies */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="mt-0.5 shrink-0">
                <div className="w-10 h-6 bg-[#00838F] rounded-full flex items-center justify-end pr-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">Notwendige Cookies</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  Immer aktiv – für Basisfunktionen wie Seitennavigation, Sicherheit und Spracheinstellungen. Ohne diese Cookies kann die Website nicht richtig funktionieren.
                </p>
              </div>
            </div>

            {/* Statistik */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="mt-0.5 shrink-0">
                <button
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${analytics ? "bg-[#00838F] justify-end pr-1" : "bg-gray-300 justify-start pl-1"}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow transition-all" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">Statistik & Analyse</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  Helfen uns zu verstehen, wie Besucher die Website nutzen (z.&thinsp;B. Vercel Analytics). Alle Daten sind anonymisiert und werden nicht an Dritte weitergegeben.
                </p>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="mt-0.5 shrink-0">
                <button
                  role="switch"
                  aria-checked={marketing}
                  onClick={() => setMarketing(!marketing)}
                  className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${marketing ? "bg-[#00838F] justify-end pr-1" : "bg-gray-300 justify-start pl-1"}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow transition-all" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">Marketing & Personalisierung</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  Ermöglichen personalisierte Werbeanzeigen. Diese Cookies können Ihrem Browser-Profil zugeordnet werden. Derzeit nicht aktiv.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex gap-3 border-t border-gray-100">
            <button
              onClick={() => save(false, false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Nur notwendige
            </button>
            <button
              onClick={() => save(analytics, marketing)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#00838F] text-white text-sm font-bold hover:bg-[#006d78] transition-colors"
            >
              Auswahl speichern
            </button>
          </div>
        </div>
      )}

      {/* Haupt-Banner */}
      <div
        className="fixed bottom-0 inset-x-0 z-[9997] px-4 pb-4 pt-0"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie-Einstellungen"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl" aria-hidden="true">🍪</span>
                <p className="font-bold text-gray-900 text-sm">Wir verwenden Cookies</p>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Wir nutzen Cookies für grundlegende Funktionen, anonyme Nutzungsstatistiken und ein besseres Surferlebnis.
                Mehr Infos in unserer{" "}
                <Link href="/datenschutz/" className="text-[#00838F] hover:underline font-medium">
                  Datenschutzerklärung
                </Link>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors px-2 py-2 min-h-11 flex items-center"
              >
                Einstellungen
              </button>
              <button
                onClick={() => save(false, false)}
                className="px-4 py-2.5 min-h-11 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Nur notwendige
              </button>
              <button
                onClick={() => save(true, false)}
                className="px-4 py-2.5 min-h-11 rounded-xl bg-[#00838F] text-white text-xs font-bold hover:bg-[#006d78] transition-colors whitespace-nowrap"
              >
                Alle akzeptieren ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
