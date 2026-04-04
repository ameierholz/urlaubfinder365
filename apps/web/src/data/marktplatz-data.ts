export type Kategorie =
  | "stadtfuehrung"
  | "tagesausflug"
  | "wassersport"
  | "kulinarik"
  | "transfer"
  | "fotoshooting"
  | "outdoor"
  | "kultur";

export interface Anbieter {
  slug: string;
  name: string;
  avatar: string;       // Unsplash URL
  titelbild?: string;   // Cover image URL
  bio?: string;
  bewertung: number;
  bewertungenAnzahl: number;
  sprachen: string[];
  mitgliedSeit: string;
  verifiziert: boolean;
}

export interface Aktivitaet {
  slug: string;
  titel: string;
  kurzbeschreibung: string;
  beschreibung: string;
  ziel: string;          // z.B. "Antalya, Türkei"
  land: string;          // ISO cc
  kategorie: Kategorie;
  foto: string;          // Unsplash URL
  fotos: string[];
  preis: number;         // EUR pro Person
  dauer: string;         // z.B. "3 Stunden"
  maxTeilnehmer: number;
  sprachen: string[];
  highlights: string[];
  inbegriffen: string[];
  nichtInbegriffen: string[];
  treffpunkt: string;
  treffpunkt_hinweis?: string;
  bewertung: number;
  bewertungenAnzahl: number;
  anbieter: Anbieter;
  beliebt?: boolean;
  neu?: boolean;
}

export const KATEGORIEN: Record<Kategorie, { label: string; emoji: string }> = {
  stadtfuehrung: { label: "Stadtführung",  emoji: "🏛️" },
  tagesausflug:  { label: "Tagesausflug",  emoji: "🚌" },
  wassersport:   { label: "Wassersport",   emoji: "🤿" },
  kulinarik:     { label: "Kulinarik",     emoji: "🍽️" },
  transfer:      { label: "Transfer",      emoji: "🚗" },
  fotoshooting:  { label: "Fotoshooting",  emoji: "📸" },
  outdoor:       { label: "Outdoor",       emoji: "🏔️" },
  kultur:        { label: "Kultur & Kunst",emoji: "🎭" },
};

export const AKTIVITAETEN: Aktivitaet[] = [
  // ── Türkei ──────────────────────────────────────────────────────────
  {
    slug: "antalya-altstadt-tour",
    titel: "Antalya Altstadt & Kaleiçi – Private Führung",
    kurzbeschreibung: "Entdecke die 2.000 Jahre alte Altstadt Antalyas mit einem lokalen Experten.",
    beschreibung: "Tauche ein in die Geschichte Antalyas: Vom römischen Hadriantor über die schmalen Gassen von Kaleiçi bis hin zu den osmanischen Karawansereien. Dein Guide lebt seit Geburt in Antalya und kennt jede Geschichte, jede Legende — und das beste Lokum der Stadt.",
    ziel: "Antalya, Türkei", land: "tr", kategorie: "stadtfuehrung",
    foto: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&q=80",
    fotos: [
      "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&q=80",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    ],
    preis: 29, dauer: "3 Stunden", maxTeilnehmer: 8,
    sprachen: ["Deutsch", "Englisch", "Türkisch"],
    highlights: ["Hadriantor (193 n. Chr.)", "Kaleiçi Altstadt", "Yivli Minarett", "Lokaler Basar", "Versteckte Cafés"],
    inbegriffen: ["Professioneller Guide", "Wasserflaschen", "Lokale Kostproben"],
    nichtInbegriffen: ["Transfer zum Treffpunkt", "Eintrittskarten (ca. 5 €)"],
    treffpunkt: "Hadriantor, Kaleiçi, Antalya",
    treffpunkt_hinweis: "Bitte 10 Minuten vor Tourstart am Hadriantor sein. Der Guide trägt eine rote Mütze.",
    bewertung: 4.9, bewertungenAnzahl: 127,
    beliebt: true,
    anbieter: {
      slug: "mehmet-k",
      name: "Mehmet K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=1200&q=80",
      bio: "Ich bin in Antalya aufgewachsen und kenne jede Gasse der Altstadt. Als lizenzierter Urlaubsführer zeige ich dir das echte Antalya – abseits der Touristenpfade.",
      bewertung: 4.9, bewertungenAnzahl: 312, sprachen: ["Deutsch", "Englisch", "Türkisch"],
      mitgliedSeit: "2022", verifiziert: true,
    },
  },
  {
    slug: "boote-tour-tuerkische-riviera",
    titel: "Blaue Lagune Bootstour – Türkische Riviera",
    kurzbeschreibung: "Ganztägige Bootstour zu den schönsten Buchten und Lagunen der türkischen Riviera.",
    beschreibung: "Eine unvergessliche Tagestour entlang der Türkischen Riviera: kristallklares Wasser, einsame Buchten und atemberaubende Landschaften. Snorkel-Equipment inklusive, mehrere Stopps zum Schwimmen und ein frisch zubereitetes türkisches Mittagessen an Bord.",
    ziel: "Antalya, Türkei", land: "tr", kategorie: "wassersport",
    foto: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
    preis: 45, dauer: "8 Stunden", maxTeilnehmer: 20,
    sprachen: ["Deutsch", "Englisch"],
    highlights: ["5 Buchten & Lagunen", "Schnorcheln", "Mittagessen an Bord", "Sonnenuntergang"],
    inbegriffen: ["Bootstour", "Mittagessen", "Snorkelausrüstung", "Transfers vom Hotel"],
    nichtInbegriffen: ["Getränke (außer Wasser)", "Trinkgeld"],
    treffpunkt: "Antalya Alter Hafen",
    treffpunkt_hinweis: "Bitte 15 Minuten vor Abfahrt am Boot sein. Pier C, Liegeplatz 7.",
    bewertung: 4.8, bewertungenAnzahl: 89,
    neu: true,
    anbieter: {
      slug: "ahmet-y",
      name: "Ahmet Y.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
      bio: "Kapitän mit Leidenschaft: Seit über 10 Jahren fahre ich Gäste aus aller Welt zu den schönsten Buchten der Türkischen Riviera. Jede Tour ist für mich ein Abenteuer.",
      bewertung: 4.8, bewertungenAnzahl: 203, sprachen: ["Deutsch", "Englisch"],
      mitgliedSeit: "2023", verifiziert: true,
    },
  },
  {
    slug: "antalya-food-tour",
    titel: "Antalya Street Food Tour – 10 Kostproben",
    kurzbeschreibung: "Probiere die besten Streetfood-Gerichte Antalyas bei einer geführten Genusstour.",
    beschreibung: "Von Gözleme über Börek bis hin zu frischen Granatapfelsäften — entdecke die kulinarische Seele Antalyas. Dein Guide führt dich durch den alten Basar und versteckte Lokale, die kein Urlaubsführer kennt.",
    ziel: "Antalya, Türkei", land: "tr", kategorie: "kulinarik",
    foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"],
    preis: 35, dauer: "3 Stunden", maxTeilnehmer: 10,
    sprachen: ["Deutsch", "Englisch"],
    highlights: ["10+ Kostproben", "Lokale Märkte", "Geheimtipps", "Rezeptkarte zum Mitnehmen"],
    inbegriffen: ["Alle Speisen & Getränke der Tour", "Guide", "Rezeptkarte"],
    nichtInbegriffen: ["Zusätzliche Getränke"],
    treffpunkt: "Kalekapısı Platz, Antalya",
    bewertung: 4.7, bewertungenAnzahl: 54,
    anbieter: {
      slug: "fatma-s",
      name: "Fatma S.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      bio: "Kulinarik ist meine Leidenschaft. Ich nehme dich mit auf eine Geschmacksreise durch Antalyas Streetfood-Szene – von der Großmutters Gözleme bis zum besten Baklava der Stadt.",
      bewertung: 4.7, bewertungenAnzahl: 98, sprachen: ["Deutsch", "Englisch"],
      mitgliedSeit: "2023", verifiziert: true,
    },
  },

  // ── Mallorca ─────────────────────────────────────────────────────────
  {
    slug: "mallorca-tramuntana-wanderung",
    titel: "Serra de Tramuntana – Geführte Wanderung",
    kurzbeschreibung: "Wandere durch das UNESCO-Welterbe der Tramuntana mit einem erfahrenen Bergführer.",
    beschreibung: "Die Serra de Tramuntana ist Mallorcas Herzstück — ein UNESCO-Weltkulturerbe mit spektakulären Ausblicken. Dieser Halbtagswanderkurs führt durch Olivenhaine, historische Trockensteinmauern und Bergdörfer.",
    ziel: "Mallorca, Spanien", land: "es", kategorie: "outdoor",
    foto: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80"],
    preis: 39, dauer: "5 Stunden", maxTeilnehmer: 12,
    sprachen: ["Deutsch", "Englisch", "Spanisch"],
    highlights: ["UNESCO-Welterbe", "Panoramablicke", "Bergdörfer", "Lokaler Picknick-Stopp"],
    inbegriffen: ["Professioneller Bergführer", "Picknick", "Wanderkarte"],
    nichtInbegriffen: ["Transfer (optional buchbar)", "Wanderschuhe"],
    treffpunkt: "Sóller Marktplatz, Mallorca",
    bewertung: 4.9, bewertungenAnzahl: 73,
    beliebt: true,
    anbieter: {
      slug: "tomeu-m",
      name: "Tomeu M.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&q=80",
      bio: "Mallorca ist meine Heimat und die Tramuntana mein Wohnzimmer. Als zertifizierter Bergführer zeige ich dir die Seele dieser Insel – fernab der Touristenströme.",
      bewertung: 4.9, bewertungenAnzahl: 187, sprachen: ["Deutsch", "Englisch", "Spanisch"],
      mitgliedSeit: "2021", verifiziert: true,
    },
  },
  {
    slug: "mallorca-fotoshooting-sunset",
    titel: "Mallorca Sonnenuntergang Fotoshooting",
    kurzbeschreibung: "Professionelles Fotoshooting an den schönsten Spots Mallorcas beim goldenen Sonnenuntergang.",
    beschreibung: "Ein professioneller Fotograf begleitet dich zu den drei schönsten Sonnenuntergangs-Spots Mallorcas. Perfekt für Paare, Familien oder Solo-Reisende die unvergessliche Erinnerungsfotos möchten.",
    ziel: "Mallorca, Spanien", land: "es", kategorie: "fotoshooting",
    foto: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80"],
    preis: 149, dauer: "2 Stunden", maxTeilnehmer: 6,
    sprachen: ["Deutsch", "Englisch"],
    highlights: ["50+ bearbeitete Fotos", "3 Locations", "Goldene Stunde", "Sofortiger Download"],
    inbegriffen: ["Fotograf", "50+ Bilder (bearbeitet)", "Online-Galerie", "Lizenz zur freien Nutzung"],
    nichtInbegriffen: ["Prints & Fotoalben (optional)", "Transfer"],
    treffpunkt: "Nach Absprache (Abholung möglich)",
    bewertung: 5.0, bewertungenAnzahl: 41,
    neu: true,
    anbieter: {
      slug: "julia-w",
      name: "Julia W.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80",
      bio: "Fotografie ist mehr als ein Beruf – es ist die Kunst, Momente einzufrieren. Ich zeige dir die schönsten Seiten Mallorcas und du nimmst Erinnerungen mit, die ein Leben lang halten.",
      bewertung: 5.0, bewertungenAnzahl: 67, sprachen: ["Deutsch", "Englisch"],
      mitgliedSeit: "2024", verifiziert: true,
    },
  },

  // ── Kreta ─────────────────────────────────────────────────────────────
  {
    slug: "kreta-samaria-schlucht",
    titel: "Samaria-Schlucht – Tagesausflug mit Guide",
    kurzbeschreibung: "Wandere durch eine der längsten Schluchten Europas mit einem ortskundigen Guide.",
    beschreibung: "Die Samaria-Schlucht (18 km) ist eine der spektakulärsten Wanderungen Europas. Unser Guide begleitet euch durch das Nationalpark-Gebiet, erklärt die Flora & Fauna und sorgt für eine sichere Rückkehr per Fähre.",
    ziel: "Kreta, Griechenland", land: "gr", kategorie: "tagesausflug",
    foto: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"],
    preis: 55, dauer: "Ganztag (10 Std.)", maxTeilnehmer: 15,
    sprachen: ["Deutsch", "Englisch", "Griechisch"],
    highlights: ["18 km Schlucht", "Nationalpark", "Fährfahrt zurück", "Mittagspause am Meer"],
    inbegriffen: ["Guide", "Transfers", "Fährticket", "Lunchpaket"],
    nichtInbegriffen: ["Nationalparkgebühr (ca. 5 €)", "Zusätzliche Getränke"],
    treffpunkt: "Abholung vom Hotel (Heraklion/Rethymno/Chania)",
    bewertung: 4.8, bewertungenAnzahl: 156,
    beliebt: true,
    anbieter: {
      slug: "nikos-p",
      name: "Nikos P.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
      bio: "Kreta ist die Seele Griechenlands und die Samaria-Schlucht ihr Herzschlag. Seit 2020 führe ich Gäste sicher durch das wildeste Naturerlebnis der Insel.",
      bewertung: 4.8, bewertungenAnzahl: 289, sprachen: ["Deutsch", "Englisch", "Griechisch"],
      mitgliedSeit: "2020", verifiziert: true,
    },
  },

  // ── Dubai ─────────────────────────────────────────────────────────────
  {
    slug: "dubai-wuesten-safari",
    titel: "Dubai Wüstensafari mit BBQ & Kamelritt",
    kurzbeschreibung: "Unvergessliche Abend-Safari durch die Wüste Dubais mit Dünenfahrt, Kamelritt und BBQ.",
    beschreibung: "Erlebe die Magie der arabischen Wüste: Rasante Dünenfahrten im 4x4, ein traditionelles Beduinencamp, Kamelritt, Sandboarding und ein üppiges BBQ-Abendessen unter dem Sternenhimmel. Mit Bauchtanz- und Feuershow.",
    ziel: "Dubai, VAE", land: "ae", kategorie: "tagesausflug",
    foto: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"],
    preis: 65, dauer: "6 Stunden (Abendtour)", maxTeilnehmer: 25,
    sprachen: ["Deutsch", "Englisch", "Arabisch"],
    highlights: ["Dünensafari", "Kamelritt", "Sandboarding", "BBQ-Buffet", "Bauchtanzshow"],
    inbegriffen: ["Transfer", "Dünensafari", "BBQ-Buffet", "Softdrinks", "Kamelritt"],
    nichtInbegriffen: ["Alkohol", "Professionelle Fotos (optional)"],
    treffpunkt: "Abholung vom Hotel in Dubai",
    bewertung: 4.7, bewertungenAnzahl: 203,
    beliebt: true,
    anbieter: {
      slug: "omar-a",
      name: "Omar A.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      bio: "Dubai ist meine Stadt – und die Wüste ist mein zweites Zuhause. Ich biete unvergessliche Safari-Erlebnisse für alle, die das echte Arabien spüren möchten.",
      bewertung: 4.7, bewertungenAnzahl: 445, sprachen: ["Deutsch", "Englisch", "Arabisch"],
      mitgliedSeit: "2021", verifiziert: true,
    },
  },

  // ── Bali ─────────────────────────────────────────────────────────────
  {
    slug: "bali-tempel-reisfelder-tour",
    titel: "Bali Tempel & Reisfelder – Private Tagestour",
    kurzbeschreibung: "Besuche Balis ikonischste Tempel und die malerischen Reisterrassen von Tegallalang.",
    beschreibung: "Eine private Tagestour zu den Highlights Balis: Tanah Lot Tempel, Tegallalang Reisterrassen, Uluwatu Klippen und ein traditionelles Kecak-Feuer-Tanzspektakel bei Sonnenuntergang. Inkl. privatem Fahrer und lokalem Guide.",
    ziel: "Bali, Indonesien", land: "id", kategorie: "kultur",
    foto: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    fotos: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"],
    preis: 49, dauer: "10 Stunden", maxTeilnehmer: 6,
    sprachen: ["Deutsch", "Englisch", "Balinesisch"],
    highlights: ["Tanah Lot Tempel", "Tegallalang Reisterrassen", "Uluwatu", "Kecak-Tanzshow"],
    inbegriffen: ["Privater Fahrer & Guide", "Mittagessen", "Eintrittskarten"],
    nichtInbegriffen: ["Tempelschal (an Ort ausleihbar)", "Zusätzliche Getränke"],
    treffpunkt: "Abholung vom Hotel in Seminyak/Kuta/Ubud",
    bewertung: 4.9, bewertungenAnzahl: 118,
    beliebt: true,
    anbieter: {
      slug: "wayan-s",
      name: "Wayan S.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      titelbild: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      bio: "Als geborener Balinese ist es mir eine Ehre, Gäste in die spirituelle Welt meiner Insel einzuführen. Tempel, Reisterrassen und Traditionen – ich zeige dir das echte Bali.",
      bewertung: 4.9, bewertungenAnzahl: 267, sprachen: ["Deutsch", "Englisch"],
      mitgliedSeit: "2022", verifiziert: true,
    },
  },
];

export const PROVISION_PROZENT = 15;
