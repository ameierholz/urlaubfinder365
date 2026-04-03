export interface EmailLocale {
  greeting: (name: string) => string;
  newBooking: {
    subject: string;
    title: string;
    body: (data: { kunde: string; datum: string; personen: number; betrag: string; angebot: string }) => string;
    cta: string;
  };
  bookingCancelled: {
    subject: string;
    title: string;
    body: (data: { kunde: string; angebot: string; datum: string }) => string;
  };
  newReview: {
    subject: string;
    title: string;
    body: (data: { sterne: number; kommentar: string; angebot: string }) => string;
  };
  payout: {
    subject: string;
    title: string;
    body: (data: { betrag: string; datum: string; iban: string }) => string;
  };
  monthlyReport: {
    subject: (monat: string) => string;
    title: string;
    bookings: string;
    revenue: string;
    commission: string;
    payout: string;
  };
  profileApproved: {
    subject: string;
    title: string;
    body: string;
    cta: string;
  };
  docStatus: {
    subject: (status: "approved" | "rejected") => string;
    title: (status: "approved" | "rejected") => string;
    body: (status: "approved" | "rejected", hinweis?: string) => string;
  };
  footer: {
    questions: string;
    unsubscribe: string;
  };
}
