"use client";

import { useState } from "react";

type Region = "alle" | "amerika" | "asien" | "naherosten" | "afrika" | "europa";

interface Land {
  country: string;
  cc: string;
  region: Region;
  visa: boolean;
  label: string;
  labelColor: string;
  doc: string;
  pass: string;
  hint: string;
  link: string;
}

const LAENDER: Land[] = [
  // ── Amerika ─────────────────────────────────────────────────────────────
  {
    country: "USA", cc: "us", region: "amerika",
    visa: false, label: "ESTA", labelColor: "bg-amber-100 text-amber-700",
    doc: "ESTA (ca. 21 USD, 2 Jahre gültig, mehrfach einreisbar)",
    pass: "Mind. 6 Monate über Aufenthalt gültig",
    hint: "Antrag mind. 72 Std. vor Abflug stellen – möglichst früher",
    link: "https://esta.cbp.dhs.gov",
  },
  {
    country: "Kanada", cc: "ca", region: "amerika",
    visa: false, label: "eTA", labelColor: "bg-amber-100 text-amber-700",
    doc: "eTA (ca. 7 CAD, 5 Jahre oder bis Passablauf gültig)",
    pass: "Mind. 6 Monate gültig",
    hint: "Antrag online in Minuten möglich, meist sofort genehmigt",
    link: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
  },
  {
    country: "Mexiko", cc: "mx", region: "amerika",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum erforderlich (bis 180 Tage)",
    pass: "Mind. 6 Monate gültig",
    hint: "Touristenkarte (FMM) am Flughafen oder online ausfüllen",
    link: "https://www.mexico.de/einreisebestimmungen",
  },
  {
    country: "Kuba", cc: "cu", region: "amerika",
    visa: false, label: "Touristenkarte", labelColor: "bg-amber-100 text-amber-700",
    doc: "Touristenkarte (ca. 25 EUR, 30 Tage, einmalig verlängerbar)",
    pass: "Mind. 6 Monate gültig",
    hint: "Oft im Flugpreis inbegriffen – beim Anbieter nachfragen",
    link: "https://www.auswaertiges-amt.de/de/service/laender/kuba-node",
  },
  {
    country: "Brasilien", cc: "br", region: "amerika",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage, max. 180 Tage/Jahr)",
    pass: "Mind. 6 Monate gültig",
    hint: "Rück- oder Weiterflugticket sowie Nachweise empfohlen",
    link: "https://www.auswaertiges-amt.de/de/service/laender/brasilien-node",
  },

  // ── Asien & Ozeanien ─────────────────────────────────────────────────────
  {
    country: "Japan", cc: "jp", region: "asien",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage)",
    pass: "Mind. gültig bei Rückreise",
    hint: "Rückflugticket & Hotelnachweis bei Einreise empfohlen",
    link: "https://www.de.emb-japan.go.jp",
  },
  {
    country: "Thailand", cc: "th", region: "asien",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 60 Tage seit Nov. 2024)",
    pass: "Mind. 6 Monate gültig",
    hint: "Einmalige Verlängerung auf 60 weitere Tage möglich",
    link: "https://www.thaiembassy.de",
  },
  {
    country: "Indien", cc: "in", region: "asien",
    visa: false, label: "e-Visa", labelColor: "bg-amber-100 text-amber-700",
    doc: "e-Visa (ca. 25 USD, 30–1-Jahres-Optionen verfügbar)",
    pass: "Mind. 6 Monate gültig + 2 leere Seiten",
    hint: "Antrag mind. 4 Tage vor Reise – e-Visa gilt für 27 Flughäfen",
    link: "https://indianvisaonline.gov.in",
  },
  {
    country: "Indonesien (Bali)", cc: "id", region: "asien",
    visa: false, label: "Visa on Arrival", labelColor: "bg-amber-100 text-amber-700",
    doc: "Visa on Arrival (35 USD, 30 Tage, einmalig verlängerbar)",
    pass: "Mind. 6 Monate gültig",
    hint: "Auch kostenloses Visa-Free-Entry möglich (30 Tage, nicht verlängerbar)",
    link: "https://www.auswaertiges-amt.de/de/service/laender/indonesien-node",
  },
  {
    country: "Vietnam", cc: "vn", region: "asien",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 45 Tage seit Aug. 2023)",
    pass: "Mind. 6 Monate gültig",
    hint: "Mehrfacheinreise möglich – vorher e-Visa (25 USD) für 90 Tage empfohlen",
    link: "https://www.auswaertiges-amt.de/de/service/laender/vietnam-node",
  },
  {
    country: "Sri Lanka", cc: "lk", region: "asien",
    visa: false, label: "ETA", labelColor: "bg-amber-100 text-amber-700",
    doc: "ETA (ca. 20 USD, 30 Tage, verlängerbar auf 90 Tage)",
    pass: "Mind. 6 Monate gültig",
    hint: "Antrag online vor Abflug empfohlen – am Flughafen teurer",
    link: "https://www.eta.gov.lk",
  },
  {
    country: "Singapur", cc: "sg", region: "asien",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 30 Tage)",
    pass: "Mind. 6 Monate gültig",
    hint: "Singapore Arrival Card (SGAC) online vor Einreise ausfüllen",
    link: "https://www.ica.gov.sg",
  },
  {
    country: "Australien", cc: "au", region: "asien",
    visa: false, label: "ETA", labelColor: "bg-amber-100 text-amber-700",
    doc: "ETA / eVisitor (kostenlos für EU-Bürger, 12 Monate gültig)",
    pass: "Mind. 6 Monate gültig",
    hint: "Aufenthalt je Besuch max. 3 Monate – Antrag über offizielle App",
    link: "https://immi.homeaffairs.gov.au",
  },
  {
    country: "Neuseeland", cc: "nz", region: "asien",
    visa: false, label: "NZeTA", labelColor: "bg-amber-100 text-amber-700",
    doc: "NZeTA (ca. 17 NZD App / 23 NZD Web, 2 Jahre gültig)",
    pass: "Gültig für gesamten Aufenthalt",
    hint: "Zusätzlich IVL-Abgabe (ca. 35 NZD) – beide zusammen beantragen",
    link: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/nzeta",
  },

  // ── Naher Osten ──────────────────────────────────────────────────────────
  {
    country: "VAE (Dubai)", cc: "ae", region: "naherosten",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage bei Einreise über Flughafen)",
    pass: "Mind. 6 Monate gültig",
    hint: "Alkohol nur in lizenzierten Betrieben – Verhaltensregeln beachten",
    link: "https://www.auswaertiges-amt.de/de/service/laender/vereinigtearabischeemirate-node",
  },
  {
    country: "Türkei", cc: "tr", region: "naherosten",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage innerhalb von 180 Tagen)",
    pass: "Mind. 3 Monate über Aufenthalt gültig (Personalausweis reicht)",
    hint: "Mit deutschem Personalausweis einreisbar – Reisepass empfohlen",
    link: "https://www.auswaertiges-amt.de/de/service/laender/tuerkei-node",
  },
  {
    country: "Oman", cc: "om", region: "naherosten",
    visa: false, label: "e-Visa", labelColor: "bg-amber-100 text-amber-700",
    doc: "e-Visa (ca. 20 OMR, 30 Tage, einmalig verlängerbar)",
    pass: "Mind. 6 Monate gültig",
    hint: "Visa on Arrival am Flughafen Maskat ebenfalls möglich",
    link: "https://evisa.rop.gov.om",
  },
  {
    country: "Ägypten", cc: "eg", region: "naherosten",
    visa: false, label: "Visa on Arrival", labelColor: "bg-amber-100 text-amber-700",
    doc: "Visa on Arrival (ca. 25 USD, 30 Tage) oder e-Visa vorher",
    pass: "Mind. 6 Monate gültig",
    hint: "Direktbucher Sinai-only (Sharm/Taba): Sinai-Stempel kostenlos",
    link: "https://www.visa2egypt.gov.eg",
  },

  // ── Afrika ───────────────────────────────────────────────────────────────
  {
    country: "Südafrika", cc: "za", region: "afrika",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage)",
    pass: "Mind. 30 Tage nach Rückreise gültig + 2 leere Seiten",
    hint: "2 vollständig leere Passseiten zwingend – sonst Einreise verweigert",
    link: "https://www.vfs-southafrica.de",
  },
  {
    country: "Marokko", cc: "ma", region: "afrika",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 90 Tage)",
    pass: "Mind. 3 Monate über Aufenthalt gültig",
    hint: "Personalausweis reicht für deutsche Staatsbürger",
    link: "https://www.auswaertiges-amt.de/de/service/laender/marokko-node",
  },
  {
    country: "Kenia", cc: "ke", region: "afrika",
    visa: false, label: "eTA", labelColor: "bg-amber-100 text-amber-700",
    doc: "eTA (ca. 30 USD, 90 Tage, Mehrfacheinreise)",
    pass: "Mind. 6 Monate gültig",
    hint: "Antrag mind. 3 Werktage vor Abflug – Genehmigung per E-Mail",
    link: "https://etakenya.go.ke",
  },

  // ── Europa ───────────────────────────────────────────────────────────────
  {
    country: "Vereinigtes Königreich", cc: "gb", region: "europa",
    visa: false, label: "UK ETA", labelColor: "bg-amber-100 text-amber-700",
    doc: "UK ETA (ca. 10 GBP, 2 Jahre gültig, mehrfach einreisbar)",
    pass: "Personalausweis ausreichend (bis 31.12.2025)",
    hint: "Ab 2026 voraussichtlich nur noch Reisepass – rechtzeitig prüfen",
    link: "https://www.gov.uk/apply-for-an-eta",
  },
  {
    country: "Georgien", cc: "ge", region: "europa",
    visa: true, label: "Visumfrei", labelColor: "bg-emerald-100 text-emerald-700",
    doc: "Kein Visum (bis 365 Tage!)",
    pass: "Gültig bei Einreise",
    hint: "Beliebt als Langzeit-Urlaubsziel – Tiflis & Kaukasus günstig erreichbar",
    link: "https://www.auswaertiges-amt.de/de/service/laender/georgien-node",
  },
];

const TABS: { id: Region | "alle"; label: string; emoji: string }[] = [
  { id: "alle",       label: "Alle",              emoji: "🌐" },
  { id: "amerika",    label: "Amerika",            emoji: "🌎" },
  { id: "asien",      label: "Asien & Ozeanien",  emoji: "🌏" },
  { id: "naherosten", label: "Naher Osten",        emoji: "🕌" },
  { id: "afrika",     label: "Afrika",             emoji: "🌍" },
  { id: "europa",     label: "Europa (non-EU)",    emoji: "🏛️" },
];

export default function EinreiseSchnellcheck() {
  const [active, setActive] = useState<Region | "alle">("alle");

  const filtered = active === "alle" ? LAENDER : LAENDER.filter((l) => l.region === active);

  return (
    <div id="einreise-schnellcheck" className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="inline-flex items-center gap-1.5 bg-[#00838F]/10 text-[#00838F] text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          🛂 Einreise-Info
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Einreise-Schnellcheck</h2>
        <p className="text-gray-500 text-sm mb-5">
          Visum, eTA und Reisepass-Anforderungen für beliebte Urlaubsziele weltweit – für deutsche Staatsbürger.
        </p>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                active === tab.id
                  ? "bg-[#00838F] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.country} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/48x36/${c.cc}.png`}
                  alt={c.country}
                  width={32}
                  height={24}
                  className="rounded shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{c.country}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.labelColor}`}>
                    {c.label}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 flex flex-col gap-1.5 text-xs text-gray-600">
                <div className="flex gap-2"><span className="shrink-0">📄</span><span>{c.doc}</span></div>
                <div className="flex gap-2"><span className="shrink-0">🛂</span><span>{c.pass}</span></div>
                <div className="flex gap-2"><span className="shrink-0">💡</span><span className="text-gray-400">{c.hint}</span></div>
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[#00838F] font-semibold hover:underline"
                >
                  🌐 Offizielle Infos →
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-5">
          * Angaben für deutsche Staatsbürger, ohne Gewähr – Einreisebestimmungen können sich kurzfristig ändern. Bitte vor Reiseantritt beim Auswärtigen Amt prüfen:{" "}
          <a href="https://www.auswaertiges-amt.de" target="_blank" rel="noopener noreferrer" className="underline text-[#00838F]">
            auswaertiges-amt.de
          </a>
        </p>
      </div>
    </div>
  );
}
