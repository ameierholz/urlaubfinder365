import type { EmailLocale } from "./types";

export const de: EmailLocale = {
  greeting: (name) => `Hallo ${name},`,
  newBooking: {
    subject: "Neue Buchung eingegangen",
    title: "Du hast eine neue Buchung!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} hat soeben „${angebot}" für ${personen} Person${personen !== 1 ? "en" : ""} am ${datum} gebucht. Der Gesamtbetrag beträgt ${betrag}.`,
    cta: "Buchung ansehen",
  },
  bookingCancelled: {
    subject: "Buchung storniert",
    title: "Eine Buchung wurde storniert",
    body: ({ kunde, angebot, datum }) =>
      `Die Buchung von ${kunde} für „${angebot}" am ${datum} wurde storniert.`,
  },
  newReview: {
    subject: "Neue Bewertung erhalten",
    title: "Du hast eine neue Bewertung!",
    body: ({ sterne, kommentar, angebot }) =>
      `Dein Angebot „${angebot}" wurde mit ${sterne} von 5 Sternen bewertet: „${kommentar}"`,
  },
  payout: {
    subject: "Auszahlung veranlasst",
    title: "Deine Auszahlung ist unterwegs",
    body: ({ betrag, datum, iban }) =>
      `Wir haben eine Auszahlung von ${betrag} an dein Konto (IBAN: ${iban}) veranlasst. Der Betrag sollte bis ${datum} bei dir eingehen.`,
  },
  monthlyReport: {
    subject: (monat) => `Deine Monatsabrechnung – ${monat}`,
    title: "Monatliche Abrechnung",
    bookings: "Buchungen",
    revenue: "Einnahmen",
    commission: "Provision (15 %)",
    payout: "Auszahlung",
  },
  profileApproved: {
    subject: "Dein Profil wurde freigeschaltet",
    title: "Willkommen bei Urlaubfinder365!",
    body: "Dein Anbieter-Profil wurde erfolgreich geprüft und ist jetzt für Reisende sichtbar. Du kannst ab sofort Angebote anlegen und Buchungen entgegennehmen.",
    cta: "Zum Dashboard",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "Dokumente verifiziert" : "Dokumente: Nachbesserung erforderlich",
    title: (s) => s === "approved" ? "Deine Dokumente wurden akzeptiert ✓" : "Bitte Dokumente nachreichen",
    body: (s, hinweis) =>
      s === "approved"
        ? "Alle eingereichten Unterlagen wurden erfolgreich geprüft. Dein Profil ist vollständig verifiziert."
        : `Leider konnten wir deine Unterlagen nicht vollständig akzeptieren. Bitte reiche die fehlenden Dokumente nach.${hinweis ? ` Hinweis: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Fragen? Schreib uns an support@urlaubfinder365.de",
    unsubscribe: "Diese E-Mail wurde automatisch versandt.",
  },
};
