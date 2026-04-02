export interface VersicherungTyp {
  id: string;
  name: string;
  emoji: string;
  kurzbeschreibung: string;
  fuer: string;           // Für wen geeignet
  preisAb: string;        // Preis ab (pro Person/Jahr)
  highlights: string[];
  nichtEnthalten?: string[];
  empfehlung: "pflicht" | "empfohlen" | "optional";
  affiliateUrl: string;
}

export interface Anbieter {
  name: string;
  logo: string;           // Emoji oder Initialen
  bewertung: number;      // 1-5
  preisAb: string;
  highlight: string;
  affiliateUrl: string;
  testsieger?: boolean;
}

export const VERSICHERUNG_TYPEN: VersicherungTyp[] = [
  {
    id: "auslandskranken",
    name: "Auslandskrankenversicherung",
    emoji: "🏥",
    kurzbeschreibung: "Schützt vor hohen Arztkosten im Ausland — die wichtigste Reiseversicherung.",
    fuer: "Jeden Reisenden — absolut unverzichtbar",
    preisAb: "ab ca. 10 € / Jahr",
    empfehlung: "pflicht",
    highlights: [
      "Arzt- und Krankenhauskosten im Ausland",
      "Medizinisch notwendiger Rücktransport nach Deutschland",
      "24/7 Notruf-Hotline",
      "Zahnarztbehandlung bei akuten Schmerzen",
      "Oft auch Familien-Tarife verfügbar",
    ],
    nichtEnthalten: [
      "Vorerkrankungen (je nach Tarif)",
      "Kosmetische Behandlungen",
      "Chronische Erkrankungen",
    ],
    affiliateUrl: "https://www.check24.de/reiseversicherung/auslandskranken/",
  },
  {
    id: "reiseruecktritt",
    name: "Reiserücktrittsversicherung",
    emoji: "↩️",
    kurzbeschreibung: "Erstattet Stornokosten wenn du die Reise wegen Krankheit oder Notfall absagen musst.",
    fuer: "Reisende mit teuren Buchungen",
    preisAb: "ab ca. 20 € / Reise",
    empfehlung: "empfohlen",
    highlights: [
      "Stornokosten bis 100 % des Reisepreises",
      "Gilt bei Krankheit, Unfall, Todesfall",
      "Auch bei Jobverlust oder Schwangerschaft",
      "Für die gesamte Familie mitversicherbar",
    ],
    nichtEnthalten: [
      "Selbst verschuldete Stornierungen",
      "Bereits bekannte Erkrankungen",
      "Reiseänderungen (nur Rücktritt)",
    ],
    affiliateUrl: "https://www.check24.de/reiseversicherung/reiseruecktritt/",
  },
  {
    id: "reiseabbruch",
    name: "Reiseabbruchversicherung",
    emoji: "✂️",
    kurzbeschreibung: "Springt ein, wenn du eine laufende Reise vorzeitig abbrechen musst.",
    fuer: "Reisende mit langen oder teuren Reisen",
    preisAb: "ab ca. 15 € / Reise",
    empfehlung: "empfohlen",
    highlights: [
      "Mehrkosten für vorzeitige Rückreise",
      "Nicht genutzte Reiseleistungen anteilig erstattet",
      "Bei Krankheit, Todesfall, Naturkatastrophen",
      "Oft kombinierbar mit Reiserücktritt",
    ],
    affiliateUrl: "https://www.check24.de/reiseversicherung/",
  },
  {
    id: "reisegepaeck",
    name: "Reisegepäckversicherung",
    emoji: "🧳",
    kurzbeschreibung: "Entschädigt bei Diebstahl, Beschädigung oder Verlust deines Gepäcks.",
    fuer: "Reisende mit wertvollem Gepäck",
    preisAb: "ab ca. 8 € / Reise",
    empfehlung: "optional",
    highlights: [
      "Diebstahl aus Hotelzimmer oder Fahrzeug",
      "Beschädigung durch Unfall",
      "Verlust durch Airline",
      "Elektronik, Kameras, Sportgeräte (bis Versicherungssumme)",
    ],
    nichtEnthalten: [
      "Vergessene Gegenstände",
      "Bargeld und Ausweise",
      "Smartphones (oft separat)",
    ],
    affiliateUrl: "https://www.check24.de/reiseversicherung/",
  },
  {
    id: "kombiversicherung",
    name: "Reisekombiversicherung",
    emoji: "🛡️",
    kurzbeschreibung: "Das Rundum-Sorglos-Paket: Alle wichtigen Absicherungen in einer Police.",
    fuer: "Familien und Vielreisende",
    preisAb: "ab ca. 35 € / Reise",
    empfehlung: "empfohlen",
    highlights: [
      "Auslandskranken + Rücktritt + Abbruch kombiniert",
      "Oft günstiger als Einzelpolicen",
      "Familien-Tarife sehr attraktiv",
      "Jahrespolicen für mehrere Reisen verfügbar",
      "Nur eine Police für alles",
    ],
    affiliateUrl: "https://www.check24.de/reiseversicherung/",
  },
];

export const ANBIETER: Anbieter[] = [
  {
    name: "CHECK24 Vergleich",
    logo: "🔍",
    bewertung: 5,
    preisAb: "Bester Marktpreis",
    highlight: "Vergleicht 50+ Tarife auf einmal — größte Auswahl",
    affiliateUrl: "https://www.check24.de/reiseversicherung/",
    testsieger: true,
  },
  {
    name: "HanseMerkur",
    logo: "🏛️",
    bewertung: 5,
    preisAb: "ab 9,80 € / Jahr",
    highlight: "Testsieger bei Stiftung Warentest — sehr gute Leistungen",
    affiliateUrl: "https://www.hansemerkur.de/reiseversicherung",
  },
  {
    name: "ERGO Reiseversicherung",
    logo: "🔵",
    bewertung: 4,
    preisAb: "ab 10,50 € / Jahr",
    highlight: "Starke Kombipakete, einfache Online-Abwicklung",
    affiliateUrl: "https://www.ergo.de/de/Produkte/Reiseversicherung",
  },
  {
    name: "Allianz Travel",
    logo: "🟦",
    bewertung: 4,
    preisAb: "ab 11 € / Jahr",
    highlight: "Weltweite Präsenz, schnelle Schadensregulierung",
    affiliateUrl: "https://www.allianztravelversicherung.de/",
  },
  {
    name: "ADAC",
    logo: "🟡",
    bewertung: 4,
    preisAb: "ab 15 € / Jahr (Mitglieder)",
    highlight: "Attraktiv für ADAC-Mitglieder, guter Pannenschutz kombinierbar",
    affiliateUrl: "https://www.adac.de/reise-freizeit/reiseversicherung/",
  },
];

export const FAQS = [
  {
    frage: "Welche Reiseversicherung ist am wichtigsten?",
    antwort: "Die Auslandskrankenversicherung ist absolut unverzichtbar. Die gesetzliche Krankenkasse zahlt im Ausland oft gar nicht oder nur sehr wenig — ein Krankenhausaufenthalt in den USA kann schnell 50.000 € kosten.",
  },
  {
    frage: "Wann muss ich die Versicherung abschließen?",
    antwort: "Die Auslandskrankenversicherung kann bis kurz vor Reiseantritt abgeschlossen werden. Die Reiserücktrittsversicherung sollte ideally innerhalb von 30 Tagen nach der Buchung abgeschlossen werden — sonst können Vorerkrankungen ausgeschlossen werden.",
  },
  {
    frage: "Lohnt sich eine Jahresversicherung?",
    antwort: "Ja, wenn du mehr als 1–2 Mal pro Jahr reist. Eine Jahres-Auslandskrankenversicherung kostet oft nur 10–15 € und gilt für alle Reisen im Jahr (meist max. 6–8 Wochen je Reise).",
  },
  {
    frage: "Sind Vorerkrankungen mitversichert?",
    antwort: "Das hängt vom Tarif ab. Akute Erkrankungen sind meist gedeckt. Chronische Vorerkrankungen oder bekannte Beschwerden sind oft ausgeschlossen. Premium-Tarife bieten manchmal Einschluss gegen Aufpreis.",
  },
  {
    frage: "Was deckt die EU-Krankenversicherungskarte (EHIC) ab?",
    antwort: "Die EHIC/EHIC-Karte gilt nur in EU/EWR-Ländern und der Schweiz — und auch dort nur für staatliche Ärzte und Kliniken. Privatärzte, Rücktransport und viele Zusatzleistungen sind nicht abgedeckt. Eine private Auslandskrankenversicherung ist trotzdem empfehlenswert.",
  },
];
