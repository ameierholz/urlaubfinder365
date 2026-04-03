import type { EmailLocale } from "./types";

export const tr: EmailLocale = {
  greeting: (name) => `Merhaba ${name},`,
  newBooking: {
    subject: "Yeni rezervasyon alındı",
    title: "Yeni bir rezervasyonunuz var!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde}, "${angebot}" için ${datum} tarihinde ${personen} kişilik rezervasyon yaptı. Toplam tutar: ${betrag}.`,
    cta: "Rezervasyonu görüntüle",
  },
  bookingCancelled: {
    subject: "Rezervasyon iptal edildi",
    title: "Bir rezervasyon iptal edildi",
    body: ({ kunde, angebot, datum }) =>
      `${kunde}'nin ${datum} tarihinde "${angebot}" için yaptığı rezervasyon iptal edildi.`,
  },
  newReview: {
    subject: "Yeni değerlendirme alındı",
    title: "Yeni bir değerlendirme aldınız!",
    body: ({ sterne, kommentar, angebot }) =>
      `"${angebot}" teklifiniz 5 üzerinden ${sterne} yıldız aldı: "${kommentar}"`,
  },
  payout: {
    subject: "Ödeme başlatıldı",
    title: "Ödemeniz yolda",
    body: ({ betrag, datum, iban }) =>
      `${iban} IBAN numaralı hesabınıza ${betrag} tutarında ödeme başlattık. Tutar ${datum} tarihine kadar hesabınıza geçmeli.`,
  },
  monthlyReport: {
    subject: (monat) => `Aylık hesap özetiniz – ${monat}`,
    title: "Aylık Hesap Özeti",
    bookings: "Rezervasyonlar",
    revenue: "Gelir",
    commission: "Komisyon (%15)",
    payout: "Ödeme",
  },
  profileApproved: {
    subject: "Profiliniz onaylandı",
    title: "Urlaubfinder365'e hoş geldiniz!",
    body: "Tedarikçi profiliniz başarıyla incelendi ve artık gezginlere görünür durumda. Artık teklifler oluşturabilir ve rezervasyon alabilirsiniz.",
    cta: "Panele git",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "Belgeler doğrulandı" : "Belgeler: İşlem gerekiyor",
    title: (s) => s === "approved" ? "Belgeleriniz kabul edildi ✓" : "Lütfen belgeleri yeniden gönderin",
    body: (s, hinweis) =>
      s === "approved"
        ? "Gönderilen tüm belgeler başarıyla incelendi. Profiliniz tamamen doğrulandı."
        : `Maalesef belgelerinizi tam olarak kabul edemedik. Lütfen eksik belgeleri yeniden gönderin.${hinweis ? ` Not: ${hinweis}` : ""}`,
  },
  footer: {
    questions: "Sorularınız için: support@urlaubfinder365.de",
    unsubscribe: "Bu e-posta otomatik olarak gönderilmiştir.",
  },
};
