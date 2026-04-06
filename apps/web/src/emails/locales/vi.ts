import type { EmailLocale } from "./types";

export const vi: EmailLocale = {
  greeting: (name) => `Xin chào ${name},`,
  newBooking: {
    subject: "Đặt chỗ mới đã được xác nhận",
    title: "Bạn có một đặt chỗ mới!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} vừa đặt chỗ ưu đãi „${angebot}" cho ${personen} người vào ngày ${datum}. Tổng số tiền là ${betrag}.`,
    cta: "Xem đặt chỗ",
  },
  bookingCancelled: {
    subject: "Đặt chỗ đã bị hủy",
    title: "Một đặt chỗ đã bị hủy",
    body: ({ kunde, angebot, datum }) =>
      `Đặt chỗ của ${kunde} cho ưu đãi „${angebot}" vào ngày ${datum} đã bị hủy.`,
  },
  newReview: {
    subject: "Bạn nhận được đánh giá mới",
    title: "Bạn có một đánh giá mới!",
    body: ({ sterne, kommentar, angebot }) =>
      `Ưu đãi „${angebot}" của bạn được đánh giá ${sterne} trên 5 sao: „${kommentar}"`,
  },
  payout: {
    subject: "Thanh toán đã được thực hiện",
    title: "Thanh toán của bạn đang trên đường",
    body: ({ betrag, datum, iban }) =>
      `Chúng tôi đã thực hiện thanh toán ${betrag} vào tài khoản của bạn (IBAN: ${iban}). Số tiền sẽ được chuyển đến bạn trước ngày ${datum}.`,
  },
  monthlyReport: {
    subject: (monat) => `Báo cáo hàng tháng của bạn – ${monat}`,
    title: "Báo cáo hàng tháng",
    bookings: "Đặt chỗ",
    revenue: "Doanh thu",
    commission: "Hoa hồng (15 %)",
    payout: "Thanh toán",
  },
  profileApproved: {
    subject: "Hồ sơ của bạn đã được duyệt",
    title: "Chào mừng bạn đến với Urlaubfinder365!",
    body: "Hồ sơ đối tác của bạn đã được xem xét thành công và hiện đang hiển thị với du khách. Bạn có thể tạo ưu đãi và nhận đặt chỗ ngay bây giờ.",
    cta: "Đến bảng điều khiển",
  },
  docStatus: {
    subject: (s) =>
      s === "approved"
        ? "Tài liệu đã được xác minh"
        : "Tài liệu cần bổ sung",
    title: (s) =>
      s === "approved"
        ? "Tài liệu của bạn đã được chấp nhận ✓"
        : "Vui lòng bổ sung tài liệu",
    body: (s, hinweis) =>
      s === "approved"
        ? "Tất cả tài liệu bạn gửi đã được xem xét thành công. Hồ sơ của bạn đã được xác minh đầy đủ."
        : `Rất tiếc, chúng tôi không thể chấp nhận đầy đủ tài liệu của bạn. Vui lòng bổ sung các tài liệu còn thiếu.${hinweis ? ` Lưu ý: ${hinweis}` : ""}`,
  },
  footer: {
    questions:
      "Có câu hỏi? Hãy viết cho chúng tôi tại support@urlaubfinder365.de",
    unsubscribe: "Email này được gửi tự động.",
  },
};
