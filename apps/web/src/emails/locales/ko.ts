import type { EmailLocale } from "./types";

export const ko: EmailLocale = {
  greeting: (name) => `안녕하세요, ${name}님,`,
  newBooking: {
    subject: "새로운 예약이 접수되었습니다",
    title: "새로운 예약이 들어왔어요!",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde}님이 ${datum}에 ${personen}명으로 「${angebot}」 상품을 예약하셨습니다. 총 결제 금액은 ${betrag}입니다.`,
    cta: "예약 확인하기",
  },
  bookingCancelled: {
    subject: "예약이 취소되었습니다",
    title: "예약이 취소되었습니다",
    body: ({ kunde, angebot, datum }) =>
      `${kunde}님의 ${datum} 「${angebot}」 예약이 취소되었습니다.`,
  },
  newReview: {
    subject: "새로운 리뷰가 등록되었습니다",
    title: "새로운 리뷰가 도착했어요!",
    body: ({ sterne, kommentar, angebot }) =>
      `「${angebot}」 상품이 5점 만점에 ${sterne}점을 받았습니다: 「${kommentar}」`,
  },
  payout: {
    subject: "지급이 처리되었습니다",
    title: "지급이 진행 중입니다",
    body: ({ betrag, datum, iban }) =>
      `${betrag}의 지급이 회원님의 계좌(IBAN: ${iban})로 처리되었습니다. ${datum}까지 입금될 예정입니다.`,
  },
  monthlyReport: {
    subject: (monat) => `월간 정산 보고서 – ${monat}`,
    title: "월간 정산 보고서",
    bookings: "예약",
    revenue: "수익",
    commission: "수수료 (15 %)",
    payout: "지급",
  },
  profileApproved: {
    subject: "프로필이 승인되었습니다",
    title: "Urlaubfinder365에 오신 것을 환영합니다!",
    body: "파트너 프로필 검토가 완료되어 여행자들에게 공개되었습니다. 지금 바로 상품을 등록하고 예약을 받아보세요.",
    cta: "대시보드로 이동",
  },
  docStatus: {
    subject: (s) =>
      s === "approved" ? "서류가 인증되었습니다" : "서류 보완이 필요합니다",
    title: (s) =>
      s === "approved"
        ? "서류가 승인되었습니다 ✓"
        : "서류를 추가로 제출해 주세요",
    body: (s, hinweis) =>
      s === "approved"
        ? "제출하신 모든 서류가 성공적으로 검토되었습니다. 프로필이 완전히 인증되었습니다."
        : `제출하신 서류의 일부를 처리하지 못했습니다. 누락된 서류를 추가로 제출해 주세요.${hinweis ? ` 안내: ${hinweis}` : ""}`,
  },
  footer: {
    questions:
      "궁금한 점이 있으시면 support@urlaubfinder365.de로 문의하세요",
    unsubscribe: "이 이메일은 자동으로 발송되었습니다.",
  },
};
