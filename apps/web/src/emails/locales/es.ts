import type { EmailLocale } from "./types";

export const es: EmailLocale = {
  greeting: (name) => `Hola ${name},`,
  newBooking: {
    subject: "Nueva reserva recibida",
    title: "¡Tienes una nueva reserva!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} acaba de reservar "${angebot}" para ${personen} persona${personen !== 1 ? "s" : ""} el ${datum}. El importe total es ${betrag}.`,
    cta: "Ver reserva",
  },
  bookingCancelled: {
    subject: "Reserva cancelada",
    title: "Una reserva ha sido cancelada",
    body: ({ kunde, angebot, datum }) =>
      `La reserva de ${kunde} para "${angebot}" el ${datum} ha sido cancelada.`,
  },
  newReview: {
    subject: "Nueva valoración recibida",
    title: "¡Has recibido una nueva valoración!",
    body: ({ sterne, kommentar, angebot }) =>
      `Tu oferta "${angebot}" ha sido valorada con ${sterne} de 5 estrellas: "${kommentar}"`,
  },
  payout: {
    subject: "Pago iniciado",
    title: "Tu pago está en camino",
    body: ({ betrag, datum, iban }) =>
      `Hemos iniciado un pago de ${betrag} a tu cuenta (IBAN: ${iban}). El importe debería llegar antes del ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Tu resumen mensual – ${monat}`,
    title: "Resumen Mensual",
    bookings: "Reservas",
    revenue: "Ingresos",
    commission: "Comisión (15%)",
    payout: "Pago",
  },
  profileApproved: {
    subject: "Tu perfil ha sido aprobado",
    title: "¡Bienvenido a Urlaubfinder365!",
    body: "Tu perfil de proveedor ha sido revisado con éxito y ahora es visible para los viajeros. Ya puedes crear ofertas y recibir reservas.",
    cta: "Ir al panel",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "Documentos verificados" : "Documentos: Acción requerida",
    title: (s) => s === "approved" ? "Tus documentos han sido aceptados ✓" : "Por favor, envía los documentos de nuevo",
    body: (s, hinweis) =>
      s === "approved"
        ? "Todos los documentos enviados han sido revisados correctamente. Tu perfil está completamente verificado."
        : `Lamentablemente no pudimos aceptar todos tus documentos. Por favor, envía los documentos que faltan.${hinweis ? ` Nota: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "¿Preguntas? Escríbenos a support@urlaubfinder365.de",
    unsubscribe: "Este correo fue enviado automáticamente.",
  },
};
