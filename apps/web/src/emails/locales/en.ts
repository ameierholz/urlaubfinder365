import type { EmailLocale } from "./types";

export const en: EmailLocale = {
  greeting: (name) => `Hello ${name},`,
  newBooking: {
    subject: "New booking received",
    title: "You have a new booking!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} just booked "${angebot}" for ${personen} person${personen !== 1 ? "s" : ""} on ${datum}. The total amount is ${betrag}.`,
    cta: "View booking",
  },
  bookingCancelled: {
    subject: "Booking cancelled",
    title: "A booking has been cancelled",
    body: ({ kunde, angebot, datum }) =>
      `The booking by ${kunde} for "${angebot}" on ${datum} has been cancelled.`,
  },
  newReview: {
    subject: "New review received",
    title: "You received a new review!",
    body: ({ sterne, kommentar, angebot }) =>
      `Your offer "${angebot}" was rated ${sterne} out of 5 stars: "${kommentar}"`,
  },
  payout: {
    subject: "Payout initiated",
    title: "Your payout is on its way",
    body: ({ betrag, datum, iban }) =>
      `We have initiated a payout of ${betrag} to your account (IBAN: ${iban}). The amount should arrive by ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Your monthly statement – ${monat}`,
    title: "Monthly Statement",
    bookings: "Bookings",
    revenue: "Revenue",
    commission: "Commission (15%)",
    payout: "Payout",
  },
  profileApproved: {
    subject: "Your profile has been approved",
    title: "Welcome to Urlaubfinder365!",
    body: "Your provider profile has been successfully reviewed and is now visible to travelers. You can now create offers and receive bookings.",
    cta: "Go to Dashboard",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "Documents verified" : "Documents: Action required",
    title: (s) => s === "approved" ? "Your documents have been accepted ✓" : "Please resubmit documents",
    body: (s, hinweis) =>
      s === "approved"
        ? "All submitted documents have been successfully reviewed. Your profile is fully verified."
        : `Unfortunately we could not fully accept your documents. Please resubmit the missing documents.${hinweis ? ` Note: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Questions? Contact us at support@urlaubfinder365.de",
    unsubscribe: "This email was sent automatically.",
  },
};
