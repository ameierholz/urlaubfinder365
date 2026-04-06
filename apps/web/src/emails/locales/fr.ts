import type { EmailLocale } from "./types";

export const fr: EmailLocale = {
  greeting: (name) => `Bonjour ${name},`,
  newBooking: {
    subject: "Nouvelle réservation reçue",
    title: "Tu as une nouvelle réservation !",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} vient de réserver « ${angebot} » pour ${personen} personne${personen !== 1 ? "s" : ""} le ${datum}. Le montant total est de ${betrag}.`,
    cta: "Voir la réservation",
  },
  bookingCancelled: {
    subject: "Réservation annulée",
    title: "Une réservation a été annulée",
    body: ({ kunde, angebot, datum }) =>
      `La réservation de ${kunde} pour « ${angebot} » du ${datum} a été annulée.`,
  },
  newReview: {
    subject: "Nouvel avis reçu",
    title: "Tu as reçu un nouvel avis !",
    body: ({ sterne, kommentar, angebot }) =>
      `Ton offre « ${angebot} » a été évaluée ${sterne} étoiles sur 5 : « ${kommentar} »`,
  },
  payout: {
    subject: "Versement effectué",
    title: "Ton versement est en route",
    body: ({ betrag, datum, iban }) =>
      `Nous avons effectué un versement de ${betrag} sur ton compte (IBAN : ${iban}). Le montant devrait te parvenir d'ici le ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Votre bilan mensuel – ${monat}`,
    title: "Bilan mensuel",
    bookings: "Réservations",
    revenue: "Revenus",
    commission: "Commission (15 %)",
    payout: "Versement",
  },
  profileApproved: {
    subject: "Ton profil a été activé",
    title: "Bienvenue sur Urlaubfinder365 !",
    body: "Ton profil prestataire a été vérifié avec succès et est désormais visible par les voyageurs. Tu peux dès maintenant créer des offres et recevoir des réservations.",
    cta: "Accéder au tableau de bord",
  },
  docStatus: {
    subject: (s) =>
      s === "approved" ? "Documents vérifiés" : "Documents : correction requise",
    title: (s) =>
      s === "approved"
        ? "Tes documents ont été acceptés ✓"
        : "Merci de soumettre à nouveau tes documents",
    body: (s, hinweis) =>
      s === "approved"
        ? "Vos documents ont été vérifiés avec succès. Votre profil est entièrement certifié."
        : `Nous n'avons malheureusement pas pu accepter l'ensemble de vos documents. Veuillez envoyer les documents manquants.${hinweis ? ` Remarque : ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Des questions ? Écrivez-nous à support@urlaubfinder365.de",
    unsubscribe: "Cet e-mail a été envoyé automatiquement.",
  },
};
