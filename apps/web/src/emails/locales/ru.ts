import type { EmailLocale } from "./types";

export const ru: EmailLocale = {
  greeting: (name) => `Привет, ${name},`,
  newBooking: {
    subject: "Новое бронирование получено",
    title: "У тебя новое бронирование!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} только что забронировал(а) «${angebot}» для ${personen} ${personen === 1 ? "человека" : personen < 5 ? "человек" : "человек"} на ${datum}. Общая сумма составляет ${betrag}.`,
    cta: "Посмотреть бронирование",
  },
  bookingCancelled: {
    subject: "Бронирование отменено",
    title: "Бронирование было отменено",
    body: ({ kunde, angebot, datum }) =>
      `Бронирование от ${kunde} для «${angebot}» на ${datum} было отменено.`,
  },
  newReview: {
    subject: "Получен новый отзыв",
    title: "У тебя новый отзыв!",
    body: ({ sterne, kommentar, angebot }) =>
      `Твоё предложение «${angebot}» получило оценку ${sterne} из 5 звёзд: «${kommentar}»`,
  },
  payout: {
    subject: "Выплата инициирована",
    title: "Твоя выплата уже в пути",
    body: ({ betrag, datum, iban }) =>
      `Мы инициировали выплату в размере ${betrag} на твой счёт (IBAN: ${iban}). Сумма должна поступить до ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Ваш ежемесячный отчёт – ${monat}`,
    title: "Ежемесячный отчёт",
    bookings: "Бронирования",
    revenue: "Доход",
    commission: "Комиссия (15 %)",
    payout: "Выплата",
  },
  profileApproved: {
    subject: "Твой профиль активирован",
    title: "Добро пожаловать в Urlaubfinder365!",
    body: "Твой профиль поставщика был успешно проверен и теперь виден путешественникам. Ты можешь сразу добавлять предложения и принимать бронирования.",
    cta: "В личный кабинет",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "Документы верифицированы" : "Документы: требуется доработка",
    title: (s) => s === "approved" ? "Твои документы приняты ✓" : "Пожалуйста, предоставь документы повторно",
    body: (s, hinweis) =>
      s === "approved"
        ? "Все предоставленные документы были успешно проверены. Твой профиль полностью верифицирован."
        : `К сожалению, мы не смогли полностью принять твои документы. Пожалуйста, предоставь недостающие документы.${hinweis ? ` Примечание: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Вопросы? Напишите нам: support@urlaubfinder365.de",
    unsubscribe: "Это письмо было отправлено автоматически.",
  },
};
