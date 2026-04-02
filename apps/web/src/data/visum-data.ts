export type VisumTyp =
  | "visumfrei"
  | "visa-on-arrival"
  | "e-visum"
  | "visum-erforderlich"
  | "esta"
  | "eta"
  | "tourist-card";

export interface VisumInfo {
  land: string;
  flagge: string;          // ISO 2-letter cc
  typ: VisumTyp;
  aufenthalt: string;      // z.B. "90 Tage"
  kosten: string;          // z.B. "kostenlos" | "ca. 25 USD"
  bearbeitung: string;     // z.B. "sofort" | "3–5 Werktage"
  hinweis?: string;
  affiliateUrl?: string;   // iVisa oder ähnliches
  slug: string;            // für spätere SEO-Unterseiten
}

// Primär für deutsche Reisepässe (DE) — erweiterbar auf AT, CH etc.
export const VISUM_DATEN: VisumInfo[] = [
  // ── Europa / Schengen ──────────────────────────────────────────────
  {
    land: "Spanien", flagge: "es", slug: "spanien",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Als EU-Bürger uneingeschränktes Aufenthaltsrecht.",
  },
  {
    land: "Griechenland", flagge: "gr", slug: "griechenland",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Italien", flagge: "it", slug: "italien",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Frankreich", flagge: "fr", slug: "frankreich",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Portugal", flagge: "pt", slug: "portugal",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Kroatien", flagge: "hr", slug: "kroatien",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Österreich", flagge: "at", slug: "oesterreich",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Niederlande", flagge: "nl", slug: "niederlande",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Schweiz", flagge: "ch", slug: "schweiz",
    typ: "visumfrei", aufenthalt: "90 Tage / 180 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Schengen-Mitglied, kein EU-Mitglied. Freizügigkeitsabkommen mit der EU.",
  },
  {
    land: "Norwegen", flagge: "no", slug: "norwegen",
    typ: "visumfrei", aufenthalt: "90 Tage / 180 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "EWR-Mitglied, Schengen-Zone.",
  },
  {
    land: "Schweden", flagge: "se", slug: "schweden",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Polen", flagge: "pl", slug: "polen",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Tschechien", flagge: "cz", slug: "tschechien",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Ungarn", flagge: "hu", slug: "ungarn",
    typ: "visumfrei", aufenthalt: "unbegrenzt (EU)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },

  // ── Großbritannien ─────────────────────────────────────────────────
  {
    land: "Großbritannien", flagge: "gb", slug: "grossbritannien",
    typ: "visumfrei", aufenthalt: "6 Monate",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Ab 2025 ist die ETA (Electronic Travel Authorisation) für EU-Bürger erforderlich (ca. 10 GBP).",
    affiliateUrl: "https://www.ivisa.com/united-kingdom-eta",
  },

  // ── Nordamerika ────────────────────────────────────────────────────
  {
    land: "USA", flagge: "us", slug: "usa",
    typ: "esta", aufenthalt: "90 Tage",
    kosten: "ca. 21 USD", bearbeitung: "sofort bis 72 Std.",
    hinweis: "ESTA (Electronic System for Travel Authorization) ist kein Visum, aber Pflicht vor Einreise. Gültig 2 Jahre für beliebig viele Einreisen.",
    affiliateUrl: "https://www.ivisa.com/united-states-esta",
  },
  {
    land: "Kanada", flagge: "ca", slug: "kanada",
    typ: "eta", aufenthalt: "6 Monate",
    kosten: "ca. 7 CAD", bearbeitung: "sofort bis wenige Minuten",
    hinweis: "eTA (Electronic Travel Authorization) vor dem Flug beantragen. Gültig 5 Jahre.",
    affiliateUrl: "https://www.ivisa.com/canada-eta",
  },
  {
    land: "Mexiko", flagge: "mx", slug: "mexiko",
    typ: "visumfrei", aufenthalt: "180 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Einreisekarte (FMM) am Flughafen ausfüllen.",
  },

  // ── Südamerika ─────────────────────────────────────────────────────
  {
    land: "Brasilien", flagge: "br", slug: "brasilien",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Argentinien", flagge: "ar", slug: "argentinien",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Peru", flagge: "pe", slug: "peru",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Kolumbien", flagge: "co", slug: "kolumbien",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Kuba", flagge: "cu", slug: "kuba",
    typ: "tourist-card", aufenthalt: "30 Tage (verlängerbar)",
    kosten: "ca. 25 USD", bearbeitung: "sofort",
    hinweis: "Touristenkarte (Tarjeta del Turista) ist kein Visum. Oft im Flugticket enthalten bei Direktflügen.",
    affiliateUrl: "https://www.ivisa.com/cuba-tourist-card",
  },
  {
    land: "Dominikanische Republik", flagge: "do", slug: "dominikanische-republik",
    typ: "tourist-card", aufenthalt: "30 Tage",
    kosten: "ca. 10 USD (oft im Flugticket)",
    bearbeitung: "sofort",
    hinweis: "Touristenkarte oft direkt im Flugticket inkludiert.",
  },

  // ── Australien & Ozeanien ──────────────────────────────────────────
  {
    land: "Australien", flagge: "au", slug: "australien",
    typ: "eta", aufenthalt: "90 Tage / 12 Monate gültig",
    kosten: "ca. 20 AUD", bearbeitung: "sofort (App)",
    hinweis: "ETA über die offizielle Australian ETA App beantragen.",
    affiliateUrl: "https://www.ivisa.com/australia-eta",
  },
  {
    land: "Neuseeland", flagge: "nz", slug: "neuseeland",
    typ: "eta", aufenthalt: "90 Tage",
    kosten: "ca. 23 NZD", bearbeitung: "sofort bis 72 Std.",
    hinweis: "NZeTA (New Zealand Electronic Travel Authority) vor Reise beantragen.",
    affiliateUrl: "https://www.ivisa.com/new-zealand-nzeta",
  },
  {
    land: "Malediven", flagge: "mv", slug: "malediven",
    typ: "visa-on-arrival", aufenthalt: "30 Tage",
    kosten: "kostenlos", bearbeitung: "sofort bei Ankunft",
    hinweis: "Visum bei Ankunft kostenfrei. Rückflug und Unterkunftsnachweis erforderlich.",
  },

  // ── Asien ──────────────────────────────────────────────────────────
  {
    land: "Thailand", flagge: "th", slug: "thailand",
    typ: "visumfrei", aufenthalt: "60 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Seit 2024 visumfreier Aufenthalt auf 60 Tage verlängert. Verlängerung vor Ort möglich.",
  },
  {
    land: "Bali / Indonesien", flagge: "id", slug: "bali-indonesien",
    typ: "visa-on-arrival", aufenthalt: "30 Tage (verlängerbar)",
    kosten: "ca. 35 USD", bearbeitung: "sofort bei Ankunft",
    hinweis: "Visa on Arrival am Flughafen oder vorab als e-VOA online beantragen.",
    affiliateUrl: "https://www.ivisa.com/indonesia-visa-on-arrival",
  },
  {
    land: "Japan", flagge: "jp", slug: "japan",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Ab 2025 wird ein Einreisegebühren-System eingeführt.",
  },
  {
    land: "Südkorea", flagge: "kr", slug: "suedkorea",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "K-ETA derzeit ausgesetzt (visumfreie Einreise für Deutsche).",
  },
  {
    land: "Singapur", flagge: "sg", slug: "singapur",
    typ: "visumfrei", aufenthalt: "30 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Malaysia", flagge: "my", slug: "malaysia",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Vietnam", flagge: "vn", slug: "vietnam",
    typ: "e-visum", aufenthalt: "90 Tage",
    kosten: "ca. 25 USD", bearbeitung: "3 Werktage",
    hinweis: "E-Visum über offizielle vietnamesische Regierungsseite beantragen.",
    affiliateUrl: "https://www.ivisa.com/vietnam-evisa",
  },
  {
    land: "Indien", flagge: "in", slug: "indien",
    typ: "e-visum", aufenthalt: "60 Tage (Tourist)",
    kosten: "ca. 25 USD", bearbeitung: "3–5 Werktage",
    hinweis: "e-Visa (eTV) auf der offiziellen indischen Regierungsseite beantragen.",
    affiliateUrl: "https://www.ivisa.com/india-evisa",
  },
  {
    land: "Sri Lanka", flagge: "lk", slug: "sri-lanka",
    typ: "e-visum", aufenthalt: "30 Tage",
    kosten: "ca. 20 USD", bearbeitung: "sofort bis 24 Std.",
    affiliateUrl: "https://www.ivisa.com/sri-lanka-eta",
  },
  {
    land: "Nepal", flagge: "np", slug: "nepal",
    typ: "visa-on-arrival", aufenthalt: "15 / 30 / 90 Tage",
    kosten: "25 USD (15 T.) / 40 USD (30 T.) / 100 USD (90 T.)",
    bearbeitung: "sofort bei Ankunft",
    affiliateUrl: "https://www.ivisa.com/nepal-tourist-visa",
  },
  {
    land: "China", flagge: "cn", slug: "china",
    typ: "visumfrei", aufenthalt: "15 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Seit 2024 visumfreier Aufenthalt für Deutsche für bis zu 15 Tage. Für längere Aufenthalte weiterhin Visum erforderlich.",
    affiliateUrl: "https://www.ivisa.com/china-visa",
  },
  {
    land: "Philippinen", flagge: "ph", slug: "philippinen",
    typ: "visumfrei", aufenthalt: "30 Tage (verlängerbar)",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Kambodscha", flagge: "kh", slug: "kambodscha",
    typ: "e-visum", aufenthalt: "30 Tage",
    kosten: "ca. 36 USD", bearbeitung: "3 Werktage",
    affiliateUrl: "https://www.ivisa.com/cambodia-evisa",
  },

  // ── Naher Osten ────────────────────────────────────────────────────
  {
    land: "Türkei", flagge: "tr", slug: "tuerkei",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Visumfreier Aufenthalt für bis zu 90 Tage innerhalb von 180 Tagen.",
  },
  {
    land: "VAE / Dubai", flagge: "ae", slug: "vae-dubai",
    typ: "visa-on-arrival", aufenthalt: "30 Tage (verlängerbar)",
    kosten: "kostenlos", bearbeitung: "sofort bei Ankunft",
    hinweis: "Visum bei Ankunft kostenlos für deutsche Staatsangehörige. Verlängerung um 30 Tage möglich.",
  },
  {
    land: "Israel", flagge: "il", slug: "israel",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Jordanien", flagge: "jo", slug: "jordanien",
    typ: "visa-on-arrival", aufenthalt: "30 Tage",
    kosten: "ca. 40 JOD (ca. 50 €)", bearbeitung: "sofort bei Ankunft",
    hinweis: "Jordan Pass kaufen (inkl. Visum + Petra-Eintritt) lohnt sich oft mehr.",
    affiliateUrl: "https://www.ivisa.com/jordan-visa-on-arrival",
  },
  {
    land: "Oman", flagge: "om", slug: "oman",
    typ: "e-visum", aufenthalt: "30 Tage",
    kosten: "ca. 20 OMR (ca. 48 €)", bearbeitung: "sofort bis 24 Std.",
    affiliateUrl: "https://www.ivisa.com/oman-evisa",
  },
  {
    land: "Katar", flagge: "qa", slug: "katar",
    typ: "visumfrei", aufenthalt: "30 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Saudi-Arabien", flagge: "sa", slug: "saudi-arabien",
    typ: "e-visum", aufenthalt: "90 Tage",
    kosten: "ca. 117 SAR (ca. 29 €)", bearbeitung: "sofort",
    affiliateUrl: "https://www.ivisa.com/saudi-arabia-evisa",
  },

  // ── Afrika ────────────────────────────────────────────────────────
  {
    land: "Ägypten", flagge: "eg", slug: "aegypten",
    typ: "visa-on-arrival", aufenthalt: "30 Tage",
    kosten: "ca. 25 USD", bearbeitung: "sofort bei Ankunft",
    hinweis: "Alternativ E-Visum vorab beantragen (empfehlenswert für schnellere Einreise).",
    affiliateUrl: "https://www.ivisa.com/egypt-evisa",
  },
  {
    land: "Marokko", flagge: "ma", slug: "marokko",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Tunesien", flagge: "tn", slug: "tunesien",
    typ: "visumfrei", aufenthalt: "90 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Kenia", flagge: "ke", slug: "kenia",
    typ: "e-visum", aufenthalt: "90 Tage",
    kosten: "ca. 51 USD", bearbeitung: "3 Werktage",
    affiliateUrl: "https://www.ivisa.com/kenya-evisa",
  },
  {
    land: "Tansania / Sansibar", flagge: "tz", slug: "tansania-sansibar",
    typ: "visa-on-arrival", aufenthalt: "90 Tage",
    kosten: "ca. 50 USD", bearbeitung: "sofort bei Ankunft",
    affiliateUrl: "https://www.ivisa.com/tanzania-visa-on-arrival",
  },
  {
    land: "Südafrika", flagge: "za", slug: "suedafrika",
    typ: "visumfrei", aufenthalt: "30 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Pass muss mindestens 30 Tage nach Ausreise gültig sein und 2 leere Seiten haben.",
  },
  {
    land: "Mauritius", flagge: "mu", slug: "mauritius",
    typ: "visumfrei", aufenthalt: "60 Tage",
    kosten: "kostenlos", bearbeitung: "sofort",
  },
  {
    land: "Seychellen", flagge: "sc", slug: "seychellen",
    typ: "visumfrei", aufenthalt: "unbegrenzt (mit Unterkunft)",
    kosten: "kostenlos", bearbeitung: "sofort",
    hinweis: "Keine feste Aufenthaltsbegrenzung, solange Unterkunft und Mittel nachgewiesen.",
  },
  {
    land: "Kapverdische Inseln", flagge: "cv", slug: "kapverdische-inseln",
    typ: "e-visum", aufenthalt: "30 Tage",
    kosten: "ca. 25 €", bearbeitung: "24–72 Std.",
    affiliateUrl: "https://www.ivisa.com/cape-verde-evisa",
  },
];

export const VISUM_TYPEN: Record<VisumTyp, { label: string; farbe: string; beschreibung: string }> = {
  "visumfrei": {
    label: "Visumfrei",
    farbe: "emerald",
    beschreibung: "Keine Einreisegenehmigung nötig.",
  },
  "visa-on-arrival": {
    label: "Visum bei Ankunft",
    farbe: "blue",
    beschreibung: "Visum direkt am Flughafen/Grenzübergang erhältlich.",
  },
  "e-visum": {
    label: "E-Visum",
    farbe: "amber",
    beschreibung: "Online vor der Reise beantragen.",
  },
  "visum-erforderlich": {
    label: "Visum erforderlich",
    farbe: "red",
    beschreibung: "Visum vorab bei der Botschaft beantragen.",
  },
  "esta": {
    label: "ESTA",
    farbe: "blue",
    beschreibung: "Electronic System for Travel Authorization — online beantragen.",
  },
  "eta": {
    label: "ETA",
    farbe: "blue",
    beschreibung: "Electronic Travel Authorization — online beantragen.",
  },
  "tourist-card": {
    label: "Touristenkarte",
    farbe: "purple",
    beschreibung: "Touristenkarte — oft im Flugticket enthalten oder vor Ort erhältlich.",
  },
};
