import type { EmailLocale } from "./types";

export const it: EmailLocale = {
  greeting: (name) => `Ciao ${name},`,
  newBooking: {
    subject: "Nuova prenotazione ricevuta",
    title: "Hai una nuova prenotazione!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} ha appena prenotato « ${angebot} » per ${personen} person${personen !== 1 ? "e" : "a"} il ${datum}. L'importo totale è di ${betrag}.`,
    cta: "Visualizza la prenotazione",
  },
  bookingCancelled: {
    subject: "Prenotazione annullata",
    title: "Una prenotazione è stata annullata",
    body: ({ kunde, angebot, datum }) =>
      `La prenotazione di ${kunde} per « ${angebot} » del ${datum} è stata annullata.`,
  },
  newReview: {
    subject: "Nuova recensione ricevuta",
    title: "Hai ricevuto una nuova recensione!",
    body: ({ sterne, kommentar, angebot }) =>
      `La tua offerta « ${angebot} » ha ricevuto una valutazione di ${sterne} stelle su 5: « ${kommentar} »`,
  },
  payout: {
    subject: "Pagamento effettuato",
    title: "Il tuo pagamento è in arrivo",
    body: ({ betrag, datum, iban }) =>
      `Abbiamo effettuato un pagamento di ${betrag} sul tuo conto (IBAN: ${iban}). L'importo dovrebbe arrivare entro il ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Il tuo rendiconto mensile – ${monat}`,
    title: "Rendiconto mensile",
    bookings: "Prenotazioni",
    revenue: "Entrate",
    commission: "Commissione (15 %)",
    payout: "Pagamento",
  },
  profileApproved: {
    subject: "Il tuo profilo è stato attivato",
    title: "Benvenuto su Urlaubfinder365!",
    body: "Il tuo profilo fornitore è stato verificato con successo ed è ora visibile ai viaggiatori. Puoi subito creare offerte e ricevere prenotazioni.",
    cta: "Vai alla dashboard",
  },
  docStatus: {
    subject: (s) =>
      s === "approved" ? "Documenti verificati" : "Documenti: correzione richiesta",
    title: (s) =>
      s === "approved"
        ? "I tuoi documenti sono stati accettati ✓"
        : "Si prega di inviare nuovamente i documenti",
    body: (s, hinweis) =>
      s === "approved"
        ? "Tutti i documenti inviati sono stati verificati con successo. Il tuo profilo è completamente certificato."
        : `Purtroppo non siamo riusciti ad accettare tutti i tuoi documenti. Ti preghiamo di inviare i documenti mancanti.${hinweis ? ` Nota: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Domande? Scrivici a support@urlaubfinder365.de",
    unsubscribe: "Questa email è stata inviata automaticamente.",
  },
};
