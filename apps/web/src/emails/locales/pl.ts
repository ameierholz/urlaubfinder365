import type { EmailLocale } from "./types";

export const pl: EmailLocale = {
  greeting: (name) => `Cześć ${name},`,
  newBooking: {
    subject: "Nowa rezerwacja",
    title: "Masz nową rezerwację!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} właśnie zarezerwował/-a „${angebot}" dla ${personen} osob${personen === 1 ? "y" : personen < 5 ? "y" : ""} na dzień ${datum}. Łączna kwota wynosi ${betrag}.`,
    cta: "Zobacz rezerwację",
  },
  bookingCancelled: {
    subject: "Rezerwacja anulowana",
    title: "Rezerwacja została anulowana",
    body: ({ kunde, angebot, datum }) =>
      `Rezerwacja klienta ${kunde} na „${angebot}" w dniu ${datum} została anulowana.`,
  },
  newReview: {
    subject: "Nowa opinia",
    title: "Otrzymałeś/-aś nową opinię!",
    body: ({ sterne, kommentar, angebot }) =>
      `Twoja oferta „${angebot}" otrzymała ocenę ${sterne} na 5 gwiazdek: „${kommentar}"`,
  },
  payout: {
    subject: "Wypłata zrealizowana",
    title: "Twoja wypłata jest w drodze",
    body: ({ betrag, datum, iban }) =>
      `Zrealizowaliśmy wypłatę w wysokości ${betrag} na Twoje konto (IBAN: ${iban}). Środki powinny dotrzeć do Ciebie do dnia ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Twoje miesięczne rozliczenie – ${monat}`,
    title: "Miesięczne rozliczenie",
    bookings: "Rezerwacje",
    revenue: "Przychody",
    commission: "Prowizja (15 %)",
    payout: "Wypłata",
  },
  profileApproved: {
    subject: "Twój profil został aktywowany",
    title: "Witaj w Urlaubfinder365!",
    body: "Twój profil dostawcy został pomyślnie zweryfikowany i jest teraz widoczny dla podróżujących. Możesz już teraz tworzyć oferty i przyjmować rezerwacje.",
    cta: "Przejdź do panelu",
  },
  docStatus: {
    subject: (s) =>
      s === "approved" ? "Dokumenty zweryfikowane" : "Dokumenty: wymagana korekta",
    title: (s) =>
      s === "approved"
        ? "Twoje dokumenty zostały zaakceptowane ✓"
        : "Prosimy o ponowne przesłanie dokumentów",
    body: (s, hinweis) =>
      s === "approved"
        ? "Wszystkie przesłane dokumenty zostały pomyślnie zweryfikowane. Twój profil jest w pełni certyfikowany."
        : `Niestety nie mogliśmy zaakceptować wszystkich Twoich dokumentów. Prosimy o przesłanie brakujących dokumentów.${hinweis ? ` Uwaga: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Pytania? Napisz do nas: support@urlaubfinder365.de",
    unsubscribe: "Ta wiadomość e-mail została wysłana automatycznie.",
  },
};
