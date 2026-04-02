"use client";

import { useState } from "react";
import { ExternalLink, Check, X, Star, Crown, ShieldCheck } from "lucide-react";
import { VERSICHERUNG_TYPEN, ANBIETER, FAQS } from "@/data/versicherung-data";

const EMPFEHLUNG_STYLE = {
  pflicht:    { label: "Pflicht",    cls: "bg-red-100 text-red-700" },
  empfohlen:  { label: "Empfohlen", cls: "bg-amber-100 text-amber-700" },
  optional:   { label: "Optional",  cls: "bg-gray-100 text-gray-600" },
};

export default function VersicherungVergleich() {
  const [aktiv, setAktiv] = useState<string | null>(null);
  const [faqOffen, setFaqOffen] = useState<number | null>(null);

  return (
    <div className="space-y-16">

      {/* ── Versicherungstypen ─────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welche Reiseversicherung brauche ich?</h2>
        <p className="text-gray-500 text-sm mb-6">Klicke auf einen Typ für alle Details.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {VERSICHERUNG_TYPEN.map((v) => {
            const isAktiv = aktiv === v.id;
            const empf = EMPFEHLUNG_STYLE[v.empfehlung];

            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 overflow-hidden ${
                  isAktiv ? "border-[#00838F] shadow-md ring-2 ring-[#00838F]/20" : "border-gray-100 hover:shadow-md hover:border-gray-200"
                }`}
                onClick={() => setAktiv(isAktiv ? null : v.id)}
              >
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl">{v.emoji}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${empf.cls}`}>
                      {empf.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{v.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.kurzbeschreibung}</p>
                  <p className="text-[#00838F] font-bold text-sm mt-3">{v.preisAb}</p>
                </div>

                {/* Ausgeklappt */}
                {isAktiv && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Geeignet für</p>
                      <p className="text-xs text-gray-700">{v.fuer}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enthalten</p>
                      <ul className="space-y-1.5">
                        {v.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-xs text-gray-700">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {v.nichtEnthalten && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nicht enthalten</p>
                        <ul className="space-y-1.5">
                          {v.nichtEnthalten.map((n) => (
                            <li key={n} className="flex items-start gap-2 text-xs text-gray-500">
                              <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <a
                      href={v.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#00838F] hover:bg-[#006d78] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Jetzt vergleichen & abschließen
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Anbieter-Vergleich ─────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Die besten Anbieter im Vergleich</h2>
        <p className="text-gray-500 text-sm mb-6">Unsere Empfehlungen für deutsche Reisende.</p>

        <div className="space-y-3">
          {ANBIETER.map((a, i) => (
            <div
              key={a.name}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 ${
                a.testsieger ? "border-[#00838F] ring-2 ring-[#00838F]/15" : "border-gray-100"
              }`}
            >
              {/* Rang */}
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                {a.testsieger
                  ? <Crown className="w-4 h-4 text-amber-500" />
                  : <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                }
              </div>

              {/* Logo + Name */}
              <div className="text-2xl shrink-0">{a.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-gray-900">{a.name}</span>
                  {a.testsieger && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      #1 Empfehlung
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{a.highlight}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s < a.bewertung ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Preis + CTA */}
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">{a.preisAb}</p>
                <a
                  href={a.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-[#00838F] hover:bg-[#006d78] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Zum Anbieter
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tipp-Box ──────────────────────────────────────────────── */}
      <section className="bg-[#00838F]/8 border border-[#00838F]/20 rounded-3xl p-6 flex gap-4">
        <ShieldCheck className="w-8 h-8 text-[#00838F] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-gray-900 mb-2">Unser Tipp: Jahrespolice für Vielreisende</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Wer mehr als zweimal im Jahr verreist, spart mit einer <strong>Jahres-Auslandskrankenversicherung</strong> bares Geld.
            Für oft unter 15 € pro Person bist du für alle Reisen des Jahres abgesichert — ohne jedes Mal neu abschließen zu müssen.
          </p>
          <a
            href="https://www.check24.de/reiseversicherung/auslandskranken/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 mt-3 text-[#00838F] font-bold text-sm hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Jahrespolicen vergleichen
          </a>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zur Reiseversicherung</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setFaqOffen(faqOffen === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm text-gray-900 pr-4">{f.frage}</span>
                <span className={`text-[#00838F] text-lg shrink-0 transition-transform duration-200 ${faqOffen === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {faqOffen === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {f.antwort}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed">
        * Preisangaben sind Richtwerte und können je nach Anbieter, Alter und Leistungsumfang abweichen.
        Diese Seite enthält Affiliate-Links — bei einem Abschluss erhalten wir ggf. eine Provision.
        Für dich entstehen dadurch keine Mehrkosten.
      </p>
    </div>
  );
}
