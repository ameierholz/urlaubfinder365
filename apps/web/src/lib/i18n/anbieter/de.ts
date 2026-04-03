export interface AnbieterTranslations {
  nav: {
    dashboard:    string;
    angebote:     string;
    buchungen:    string;
    scanner:      string;
    einnahmen:    string;
    werbeplatz:   string;
    profil:       string;
    zuMarktplatz: string;
    portal:       string;
    abmelden:     string;
  };
  status: {
    verifiziert:  string;
    ausstehend:   string;
    gesperrt:     string;
    aktiv:        string;
  };
  sprache: {
    label:        string;
    de:           string;
    en:           string;
    tr:           string;
    es:           string;
    fr:           string;
    it:           string;
    pl:           string;
    ru:           string;
    ar:           string;
  };
  dashboard: {
    title:        string;
    willkommen:   string;
    keineAngebote:string;
    angebotErstellen: string;
  };
  angebote: {
    title:        string;
    neu:          string;
    bearbeiten:   string;
    loeschen:     string;
    keineAngebote:string;
    status: {
      aktiv:      string;
      inaktiv:    string;
      ausstehend: string;
      abgelehnt:  string;
    };
  };
  buchungen: {
    title:        string;
    keineBuchungen: string;
    kunde:        string;
    datum:        string;
    betrag:       string;
    status:       string;
  };
  scanner: {
    title:        string;
    beschreibung: string;
    scannen:      string;
    gueltig:      string;
    ungueltig:    string;
    bereits:      string;
  };
  einnahmen: {
    title:        string;
    gesamt:       string;
    dieserMonat:  string;
    letzterMonat: string;
    auszahlung:   string;
  };
  werbeplatz: {
    title:        string;
    beschreibung: string;
    paketWaehlen: string;
    laufzeit:     string;
    zielseite:    string;
    zielort:      string;
    kategorie:    string;
    region:       string;
    bittWaehlen:  string;
    preisProMonat:string;
    gesamtbetrag: string;
    jetztBuchen:  string;
    weiterleitung:string;
    zahlungshinweis: string;
  };
  profil: {
    title:        string;
    speichern:    string;
    gespeichert:  string;
    name:         string;
    beschreibung: string;
    webseite:     string;
    telefon:      string;
    adresse:      string;
    avatar:       string;
    avatarAendern:string;
  };
  angebotForm: {
    titel:        string;
    beschreibung: string;
    preis:        string;
    kategorie:    string;
    ort:          string;
    dauer:        string;
    bilder:       string;
    speichern:    string;
    veroeffentlichen: string;
    entwurf:      string;
    pflichtfeld:  string;
  };
  common: {
    laden:        string;
    fehler:       string;
    zurueck:      string;
    weiter:       string;
    abbrechen:    string;
    loeschen:     string;
    bestaetigen:  string;
    ja:           string;
    nein:         string;
    euro:         string;
    monat:        string;
    monate:       string;
  };
}

const de: AnbieterTranslations = {
  nav: {
    dashboard:    "Übersicht",
    angebote:     "Meine Angebote",
    buchungen:    "Buchungen",
    scanner:      "QR-Scanner",
    einnahmen:    "Einnahmen",
    werbeplatz:   "Werbeplatz buchen",
    profil:       "Mein Profil",
    zuMarktplatz: "← Zum Marktplatz",
    portal:       "Anbieter-Portal",
    abmelden:     "Abmelden",
  },
  status: {
    verifiziert:  "Verifiziert",
    ausstehend:   "⏳ Prüfung ausstehend",
    gesperrt:     "🚫 Gesperrt",
    aktiv:        "✅ Aktiv",
  },
  sprache: {
    label:        "Sprache",
    de:           "Deutsch",
    en:           "English",
    tr:           "Türkçe",
    es:           "Español",
    fr:           "Français",
    it:           "Italiano",
    pl:           "Polski",
    ru:           "Русский",
    ar:           "العربية",
  },
  dashboard: {
    title:        "Übersicht",
    willkommen:   "Willkommen zurück",
    keineAngebote:"Noch keine Angebote",
    angebotErstellen: "Angebot anlegen",
  },
  angebote: {
    title:        "Meine Angebote",
    neu:          "Neues Angebot",
    bearbeiten:   "Bearbeiten",
    loeschen:     "Löschen",
    keineAngebote:"Du hast noch keine Angebote erstellt.",
    status: {
      aktiv:      "Aktiv",
      inaktiv:    "Inaktiv",
      ausstehend: "Ausstehend",
      abgelehnt:  "Abgelehnt",
    },
  },
  buchungen: {
    title:        "Buchungen",
    keineBuchungen: "Noch keine Buchungen vorhanden.",
    kunde:        "Kunde",
    datum:        "Datum",
    betrag:       "Betrag",
    status:       "Status",
  },
  scanner: {
    title:        "QR-Scanner",
    beschreibung: "Scanne den QR-Code auf dem Ticket deines Gastes.",
    scannen:      "Scannen",
    gueltig:      "✅ Ticket gültig",
    ungueltig:    "❌ Ticket ungültig",
    bereits:      "⚠️ Bereits eingelöst",
  },
  einnahmen: {
    title:        "Einnahmen",
    gesamt:       "Gesamt",
    dieserMonat:  "Dieser Monat",
    letzterMonat: "Letzter Monat",
    auszahlung:   "Nächste Auszahlung",
  },
  werbeplatz: {
    title:        "Werbeplatz buchen",
    beschreibung: "Erhöhe die Sichtbarkeit deiner Angebote auf dem Marktplatz.",
    paketWaehlen: "Paket wählen",
    laufzeit:     "Laufzeit",
    zielseite:    "Zielseite",
    zielort:      "Zielort",
    kategorie:    "Kategorie",
    region:       "Region / Land",
    bittWaehlen:  "Bitte wählen …",
    preisProMonat:"Preis / Monat",
    gesamtbetrag: "Gesamtbetrag",
    jetztBuchen:  "Jetzt buchen",
    weiterleitung:"Weiterleitung zu Stripe …",
    zahlungshinweis: "Sichere Zahlung via Stripe · Monatlich abgebucht · Läuft nach Laufzeit automatisch aus · Freischaltung nach Inhaltsprüfung (max. 24 h)",
  },
  profil: {
    title:        "Mein Profil",
    speichern:    "Speichern",
    gespeichert:  "Gespeichert",
    name:         "Name",
    beschreibung: "Beschreibung",
    webseite:     "Webseite",
    telefon:      "Telefon",
    adresse:      "Adresse",
    avatar:       "Profilbild",
    avatarAendern:"Bild ändern",
  },
  angebotForm: {
    titel:        "Titel",
    beschreibung: "Beschreibung",
    preis:        "Preis",
    kategorie:    "Kategorie",
    ort:          "Ort",
    dauer:        "Dauer",
    bilder:       "Bilder",
    speichern:    "Angebot speichern",
    veroeffentlichen: "Veröffentlichen",
    entwurf:      "Als Entwurf speichern",
    pflichtfeld:  "Pflichtfeld",
  },
  common: {
    laden:        "Laden …",
    fehler:       "Ein Fehler ist aufgetreten.",
    zurueck:      "Zurück",
    weiter:       "Weiter",
    abbrechen:    "Abbrechen",
    loeschen:     "Löschen",
    bestaetigen:  "Bestätigen",
    ja:           "Ja",
    nein:         "Nein",
    euro:         "€",
    monat:        "Monat",
    monate:       "Monate",
  },
};

export default de;
