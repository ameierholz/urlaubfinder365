"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Megaphone, ChevronDown, ChevronUp, CheckCircle, Loader2, X } from "lucide-react";

const KATEGORIEN_LABELS: Record<string, string> = {
  stadtfuehrung: "Stadtführungen", tagesausflug: "Tagesausflüge",
  wassersport: "Wassersport", outdoor: "Outdoor & Wandern",
  kulinarik: "Kulinarik", kultur: "Kultur & Kunst",
  fotoshooting: "Fotoshooting", transfer: "Transfer",
};

const REGIONEN = [
  "Türkei","Spanien","Griechenland","Italien","Portugal","Ägypten","Marokko",
  "Thailand","Bali / Indonesien","Dubai / VAE","Kroatien","Österreich","Schweiz","Andere",
];

const LAUFZEITEN = [
  { monate: 1,  label: "1 Monat",    rabatt: 0   },
  { monate: 3,  label: "3 Monate",   rabatt: 0.05 },
  { monate: 6,  label: "6 Monate",   rabatt: 0.10 },
  { monate: 12, label: "12 Monate",  rabatt: 0.15 },
];

export const PAKETE = [
  {
    id:          "stadt_unten",
    emoji:       "🌆",
    label:       "Stadtseite",
    position:    "Unten auf der Seite",
    beschreibung:"Dein Angebot wird auf einer Zielort-Seite deiner Wahl prominent platziert.",
    preisMonat:  49,
    badge:       null,
  },
  {
    id:          "stadt_oben",
    emoji:       "🌆",
    label:       "Stadtseite Top-Platz",
    position:    "Immer ganz oben — auch wenn mehrere Anzeigen aktiv sind",
    beschreibung:"Deine Anzeige erscheint stets als erste — egal wie viele andere Werbeplätze auf derselben Stadtseite gebucht sind.",
    preisMonat:  79,
    badge:       "Beliebt",
  },
  {
    id:          "kategorie",
    emoji:       "🏷️",
    label:       "Themenseite",
    position:    "Auf einer Kategorie-Seite",
    beschreibung:"Erscheine auf allen Seiten einer Aktivitätskategorie (z. B. alle Wassersport-Seiten).",
    preisMonat:  99,
    badge:       null,
  },
  {
    id:          "region",
    emoji:       "🗺️",
    label:       "Regionspaket",
    position:    "Alle Seiten einer Region / eines Landes",
    beschreibung:"Dein Angebot ist auf sämtlichen Seiten eines Landes oder einer Region sichtbar.",
    preisMonat:  149,
    badge:       null,
  },
  {
    id:          "homepage",
    emoji:       "🏠",
    label:       "Marktplatz-Startseite",
    position:    "Featured-Bereich der Startseite",
    beschreibung:"Maximale Reichweite: Dein Angebot erscheint im Featured-Bereich der Marktplatz-Startseite.",
    preisMonat:  199,
    badge:       "Meiste Reichweite",
  },
  {
    id:          "rundum",
    emoji:       "⭐",
    label:       "Rundum-Paket",
    position:    "Startseite + Kategorie + Region",
    beschreibung:"Alle Kanäle auf einmal: Startseite, Themenseite und Regionsseiten deiner Wahl.",
    preisMonat:  299,
    badge:       "Bestes Preis-Leistungs-Verhältnis",
  },
  {
    id:          "anbieter_spotlight",
    emoji:       "👤",
    label:       "Anbieter-Spotlight",
    position:    "\"Empfohlene Anbieter\" Sidebar",
    beschreibung:"Dein Anbieterprofil wird in der Sidebar auf Marktplatz- und Zielort-Seiten hervorgehoben.",
    preisMonat:  99,
    badge:       null,
  },
] as const;

type PaketId = typeof PAKETE[number]["id"];

interface Props {
  anbieter_id: string;
  angebot_id?: string;
}

export default function WerbeplatzBuchen({ anbieter_id, angebot_id }: Props) {
  const sb = createSupabaseBrowser();
  const [open, setOpen]           = useState(false);
  const [selectedId, setSelectedId] = useState<PaketId | null>(null);
  const [laufzeit, setLaufzeit]   = useState(1);
  const [zielseite, setZielseite] = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  const paket = PAKETE.find((p) => p.id === selectedId);
  const laufzeitInfo = LAUFZEITEN.find((l) => l.monate === laufzeit)!;
  const preisMonat   = paket ? paket.preisMonat * (1 - laufzeitInfo.rabatt) : 0;
  const preisGesamt  = preisMonat * laufzeit;

  const needsZielseite = selectedId && !["homepage"].includes(selectedId);
  const isZielseiteValid = !needsZielseite || zielseite.trim().length > 0;

  const handleBuchen = async () => {
    if (!paket || !isZielseiteValid) return;
    setLoading(true);
    setError("");

    const { error: err } = await sb.from("werbeplaetze_buchungen" as never).insert({
      anbieter_id,
      angebot_id: angebot_id || null,
      paket: paket.id,
      zielseite: zielseite || null,
      laufzeit_monate: laufzeit,
      preis_monatlich: preisMonat,
      preis_gesamt: preisGesamt,
      status: "angefragt",
    } as never);

    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  };

  if (done) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
      <p className="font-bold text-gray-900 text-sm">Anfrage gesendet!</p>
      <p className="text-xs text-gray-500 mt-1">Wir schalten deinen Werbeplatz innerhalb von 24 h frei.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Werbeplatz buchen</p>
            <p className="text-[11px] text-gray-400">Mehr Sichtbarkeit für dein Angebot</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">

          {/* Paket-Auswahl */}
          {!selectedId ? (
            <div className="space-y-2 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Wähle ein Paket</p>
              {PAKETE.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className="w-full text-left border border-gray-200 rounded-xl p-3.5 hover:border-amber-400 hover:bg-amber-50/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-gray-900">{p.emoji} {p.label}</span>
                        {p.badge && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{p.position}</p>
                    </div>
                    <span className="text-sm font-black text-[#00838F] shrink-0">
                      ab {p.preisMonat} €<span className="text-[10px] font-normal text-gray-400">/Mo.</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="pt-4 space-y-4">
              {/* Gewähltes Paket */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Gewähltes Paket</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{paket?.emoji} {paket?.label}</p>
                  <p className="text-[11px] text-gray-500">{paket?.position}</p>
                </div>
                <button type="button" onClick={() => { setSelectedId(null); setZielseite(""); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Zielseite */}
              {selectedId === "stadt_unten" || selectedId === "stadt_oben" ? (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Zielort <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={zielseite}
                    onChange={(e) => setZielseite(e.target.value)}
                    placeholder="z. B. Antalya"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Stadt oder Reiseziel, auf dessen Seite du erscheinen möchtest</p>
                </div>
              ) : selectedId === "kategorie" ? (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Kategorie <span className="text-red-400">*</span>
                  </label>
                  <select value={zielseite} onChange={(e) => setZielseite(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white">
                    <option value="">Bitte wählen …</option>
                    {Object.entries(KATEGORIEN_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              ) : selectedId === "region" || selectedId === "rundum" ? (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Region / Land <span className="text-red-400">*</span>
                  </label>
                  <select value={zielseite} onChange={(e) => setZielseite(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white">
                    <option value="">Bitte wählen …</option>
                    {REGIONEN.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              ) : null}

              {/* Laufzeit */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Laufzeit</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {LAUFZEITEN.map(({ monate, label, rabatt }) => (
                    <button key={monate} type="button" onClick={() => setLaufzeit(monate)}
                      className={`py-2 rounded-xl border-2 text-xs font-bold transition-all text-center relative ${
                        laufzeit === monate
                          ? "border-amber-400 bg-amber-50 text-amber-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}>
                      {label.split(" ")[0]}<br />
                      <span className="font-normal text-gray-400">{label.split(" ")[1]}</span>
                      {rabatt > 0 && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          -{rabatt * 100 | 0}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preis-Zusammenfassung */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Preis / Monat</span>
                  <span className="font-bold text-gray-900">{preisMonat.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Laufzeit</span>
                  <span className="font-bold text-gray-900">{laufzeit} {laufzeit === 1 ? "Monat" : "Monate"}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-1.5 mt-1.5">
                  <span className="font-bold text-gray-700">Gesamtbetrag</span>
                  <span className="font-black text-[#00838F]">{preisGesamt.toFixed(2)} €</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Nach Eingang deiner Anfrage schalten wir den Werbeplatz innerhalb von 24 Stunden frei. Die Abrechnung erfolgt per Rechnung.
              </p>

              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <button
                type="button"
                disabled={loading || !isZielseiteValid}
                onClick={handleBuchen}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet …</>
                  : "Werbeplatz anfragen →"
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
