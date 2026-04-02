"use client";

import { useState, useEffect, useCallback } from "react";

interface A11ySettings {
  textSize: "normal" | "lg" | "xl";
  contrast: "normal" | "high" | "invert";
  colorFilter: "normal" | "grayscale" | "protanopia" | "deuteranopia";
  focusEnhance: boolean;
  highlightLinks: boolean;
}

const DEFAULT: A11ySettings = {
  textSize: "normal",
  contrast: "normal",
  colorFilter: "normal",
  focusEnhance: false,
  highlightLinks: false,
};

const STORAGE_KEY = "uf365-a11y";

const TEXT_CLASSES: Record<string, string> = {
  lg: "a11y-text-lg",
  xl: "a11y-text-xl",
};
const CONTRAST_CLASSES: Record<string, string> = {
  high: "a11y-high-contrast",
  invert: "a11y-invert",
};
const COLOR_CLASSES: Record<string, string> = {
  grayscale: "a11y-grayscale",
  protanopia: "a11y-protanopia",
  deuteranopia: "a11y-deuteranopia",
};

function applyClasses(s: A11ySettings) {
  const html = document.documentElement;
  // Remove all a11y classes first
  const toRemove = Array.from(html.classList).filter((c) => c.startsWith("a11y-"));
  toRemove.forEach((c) => html.classList.remove(c));
  // Apply active ones
  if (s.textSize !== "normal") html.classList.add(TEXT_CLASSES[s.textSize]);
  if (s.contrast !== "normal") html.classList.add(CONTRAST_CLASSES[s.contrast]);
  if (s.colorFilter !== "normal") html.classList.add(COLOR_CLASSES[s.colorFilter]);
  if (s.focusEnhance) html.classList.add("a11y-focus");
  if (s.highlightLinks) html.classList.add("a11y-links");
}

type TabId = "display" | "screenreader" | "keyboard";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("display");
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT);

  // Load from localStorage on mount and apply
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const s = JSON.parse(stored) as A11ySettings;
        setSettings(s);
        applyClasses(s);
      }
    } catch {/* ignore */}
  }, []);

  const update = useCallback((patch: Partial<A11ySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applyClasses(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = () => {
    applyClasses(DEFAULT);
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT);
  };

  const btnCls = (active: boolean) =>
    `flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border ${
      active
        ? "bg-[#00838F] text-white border-[#00838F] shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
    }`;

  const toggleCls = (active: boolean) =>
    `relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
      active ? "bg-[#00838F]" : "bg-gray-200"
    }`;

  return (
    <>
      {/* SVG Colorblind Filters (hidden) */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="a11y-protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="a11y-deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      {/* FAB – Vertical Tab am rechten Bildschirmrand, vertikal zentriert */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Barrierefreiheits-Einstellungen öffnen"
        aria-expanded={open}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-9990 flex flex-col items-center gap-2 px-2.5 py-4 bg-[#00838F] text-white rounded-l-2xl shadow-xl hover:bg-[#006d78] hover:pr-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00838F]/50"
      >
        <span className="text-xl leading-none" aria-hidden="true">♿</span>
        <span
          className="text-[10px] font-bold tracking-wide leading-none"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Barrierefreiheit
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-9991 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Barrierefreiheits-Einstellungen"
          className="fixed right-14 top-1/2 -translate-y-1/2 z-9992 w-[320px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#00838F] text-white rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">♿</span>
              <h2 className="font-bold text-sm">Barrierefreiheit</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Schließen"
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 shrink-0">
            {([
              { id: "display" as TabId, label: "🎨 Anzeige" },
              { id: "screenreader" as TabId, label: "🔊 Screen" },
              { id: "keyboard" as TabId, label: "⌨️ Tastatur" },
            ] as const).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-2 text-[11px] font-semibold transition-colors ${
                  activeTab === id
                    ? "text-[#00838F] border-b-2 border-[#00838F]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">

            {/* ── TAB: ANZEIGE ── */}
            {activeTab === "display" && (
              <>
                {/* Textgröße */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">📏 Textgröße</p>
                  <div className="flex gap-1.5">
                    <button className={btnCls(settings.textSize === "normal")} onClick={() => update({ textSize: "normal" })}>Normal</button>
                    <button className={btnCls(settings.textSize === "lg")} onClick={() => update({ textSize: "lg" })}>Groß</button>
                    <button className={btnCls(settings.textSize === "xl")} onClick={() => update({ textSize: "xl" })}>Sehr groß</button>
                  </div>
                </div>

                {/* Kontrast */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">💡 Kontrast</p>
                  <div className="flex gap-1.5">
                    <button className={btnCls(settings.contrast === "normal")} onClick={() => update({ contrast: "normal" })}>Normal</button>
                    <button className={btnCls(settings.contrast === "high")} onClick={() => update({ contrast: "high" })}>Hoch</button>
                    <button className={btnCls(settings.contrast === "invert")} onClick={() => update({ contrast: "invert" })}>Invertiert</button>
                  </div>
                </div>

                {/* Farbfilter */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">👁️ Farbblindheitsfilter</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button className={btnCls(settings.colorFilter === "normal")} onClick={() => update({ colorFilter: "normal" })}>Normal</button>
                    <button className={btnCls(settings.colorFilter === "grayscale")} onClick={() => update({ colorFilter: "grayscale" })}>Graustufen</button>
                    <button className={btnCls(settings.colorFilter === "protanopia")} onClick={() => update({ colorFilter: "protanopia" })}>Protanopie</button>
                    <button className={btnCls(settings.colorFilter === "deuteranopia")} onClick={() => update({ colorFilter: "deuteranopia" })}>Deuteranopie</button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">Protanopie = Rot-Grün-Schwäche · Deuteranopie = Grün-Schwäche</p>
                </div>

                {/* Fokus */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">🔲 Fokus-Hervorhebung</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Starke Umrandung bei Tab-Navigation</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.focusEnhance}
                      onClick={() => update({ focusEnhance: !settings.focusEnhance })}
                      className={toggleCls(settings.focusEnhance)}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${settings.focusEnhance ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>

                {/* Links hervorheben */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">🔗 Links hervorheben</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Alle Links mit Unterstreichung</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={settings.highlightLinks}
                      onClick={() => update({ highlightLinks: !settings.highlightLinks })}
                      className={toggleCls(settings.highlightLinks)}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${settings.highlightLinks ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── TAB: SCREENREADER ── */}
            {activeTab === "screenreader" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Screenreader lesen Webseiteninhalte laut vor. Aktivieren Sie Ihren Screenreader direkt im Betriebssystem:
                </p>
                {[
                  {
                    os: "🪟 Windows",
                    name: "Narrator",
                    shortcut: "Windows + Strg + Enter",
                    hint: "Oder: Einstellungen → Barrierefreiheit → Narrator",
                  },
                  {
                    os: "🍎 macOS / iOS",
                    name: "VoiceOver",
                    shortcut: "⌘ + F5",
                    hint: "iOS: Einstellungen → Bedienungshilfen → VoiceOver",
                  },
                  {
                    os: "🤖 Android",
                    name: "TalkBack",
                    shortcut: "Lautstärke auf + ab (3 Sek.)",
                    hint: "Einstellungen → Bedienungshilfen → TalkBack",
                  },
                  {
                    os: "🐧 Linux",
                    name: "Orca",
                    shortcut: "Super + Alt + S",
                    hint: "Vorinstalliert in GNOME-Desktop-Umgebungen",
                  },
                ].map(({ os, name, shortcut, hint }) => (
                  <div key={name} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[11px] font-bold text-gray-700">{os} – {name}</p>
                    <p className="text-[11px] text-[#00838F] font-mono mt-1">{shortcut}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{hint}</p>
                  </div>
                ))}
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-blue-800">💡 Empfehlungen</p>
                  <p className="text-[10px] text-blue-600 mt-1 leading-snug">
                    NVDA (Windows, kostenlos) oder JAWS (Windows, professionell) sind beliebte
                    Drittanbieter-Screenreader für barrierefreies Surfen.
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB: TASTATUR ── */}
            {activeTab === "keyboard" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Windows bietet ein umfassendes Bedienungshilfen-Zentrum für Tastatur- und Maussteuerung:
                </p>

                <div className="bg-[#00838F]/8 rounded-xl p-3 border border-[#00838F]/20">
                  <p className="text-[11px] font-bold text-[#00838F]">🪟 Windows-Bedienungshilfen</p>
                  <p className="text-[11px] font-mono text-gray-700 mt-1 bg-white rounded px-2 py-1 border">Windows + U</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug">Öffnet das Barrierefreiheitszentrum direkt</p>
                </div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation auf dieser Seite</p>
                {[
                  { key: "Tab", desc: "Vorwärts durch Links & Schaltflächen" },
                  { key: "Shift + Tab", desc: "Rückwärts navigieren" },
                  { key: "Enter / Leertaste", desc: "Link oder Button aktivieren" },
                  { key: "Escape", desc: "Dialog / Menü schließen" },
                  { key: "↑ ↓ Pfeiltasten", desc: "Durch Listen navigieren" },
                  { key: "Pos1 / Ende", desc: "Anfang / Ende der Seite" },
                ].map(({ key, desc }) => (
                  <div key={key} className="flex items-center gap-3">
                    <code className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-[10px] font-mono text-gray-700 whitespace-nowrap shrink-0">{key}</code>
                    <span className="text-[11px] text-gray-500">{desc}</span>
                  </div>
                ))}

                <div className="bg-gray-50 rounded-xl p-3 mt-2">
                  <p className="text-[11px] font-bold text-gray-700">🖱️ Tastenmaus (Windows)</p>
                  <p className="text-[11px] font-mono text-gray-600 mt-1">Windows + U → Maus → Tastenmaus</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                    Steuern Sie den Mauszeiger mit dem Ziffernblock der Tastatur
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-gray-700">🔍 Bildschirmlupe (Windows)</p>
                  <p className="text-[11px] font-mono text-gray-600 mt-1">Windows + Plus (+)</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                    Vergrößert jeden Bildschirmbereich. Windows + Minus (–) zum Verkleinern. Windows + Esc zum Beenden.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-gray-700">🍎 macOS Zoom</p>
                  <p className="text-[11px] font-mono text-gray-600 mt-1">⌥ + ⌘ + 8 (ein/aus)</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                    ⌥ + ⌘ + Plus/Minus zum Rein-/Rauszoomen
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 shrink-0">
            <button
              onClick={reset}
              className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              Alle Einstellungen zurücksetzen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
