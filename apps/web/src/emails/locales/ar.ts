import type { EmailLocale } from "./types";

export const ar: EmailLocale = {
  greeting: (name) => `مرحباً ${name}،`,
  newBooking: {
    subject: "تم استلام حجز جديد",
    title: "لديك حجز جديد!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `قام ${kunde} للتو بحجز «${angebot}» لعدد ${personen} ${personen === 1 ? "شخص" : "أشخاص"} بتاريخ ${datum}. يبلغ المجموع الكلي ${betrag}.`,
    cta: "عرض الحجز",
  },
  bookingCancelled: {
    subject: "تم إلغاء الحجز",
    title: "تم إلغاء حجز",
    body: ({ kunde, angebot, datum }) =>
      `تم إلغاء حجز ${kunde} للعرض «${angebot}» بتاريخ ${datum}.`,
  },
  newReview: {
    subject: "تم استلام تقييم جديد",
    title: "لديك تقييم جديد!",
    body: ({ sterne, kommentar, angebot }) =>
      `حصل عرضك «${angebot}» على تقييم ${sterne} من أصل 5 نجوم: «${kommentar}»`,
  },
  payout: {
    subject: "تم تنفيذ الدفع",
    title: "دفعتك في الطريق إليك",
    body: ({ betrag, datum, iban }) =>
      `لقد قمنا بتحويل مبلغ ${betrag} إلى حسابك (IBAN: ${iban}). من المتوقع وصول المبلغ بحلول ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `تقريرك الشهري – ${monat}`,
    title: "التقرير الشهري",
    bookings: "الحجوزات",
    revenue: "الإيرادات",
    commission: "العمولة (15 %)",
    payout: "الدفع",
  },
  profileApproved: {
    subject: "تمت الموافقة على ملفك الشخصي",
    title: "مرحباً بك في Urlaubfinder365!",
    body: "تمت مراجعة ملفك الشخصي كمزود خدمة بنجاح وأصبح مرئياً للمسافرين. يمكنك الآن إضافة العروض واستقبال الحجوزات فوراً.",
    cta: "الذهاب إلى لوحة التحكم",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "تم التحقق من المستندات" : "المستندات: يلزم إجراء تعديلات",
    title: (s) => s === "approved" ? "تم قبول مستنداتك ✓" : "يرجى إعادة تقديم المستندات",
    body: (s, hinweis) =>
      s === "approved"
        ? "تمت مراجعة جميع المستندات المقدمة بنجاح. ملفك الشخصي موثق بالكامل."
        : `للأسف، لم نتمكن من قبول مستنداتك بالكامل. يرجى تقديم المستندات الناقصة.${hinweis ? ` ملاحظة: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "هل لديك أسئلة؟ راسلنا على support@urlaubfinder365.de",
    unsubscribe: "تم إرسال هذا البريد الإلكتروني تلقائياً.",
  },
};
