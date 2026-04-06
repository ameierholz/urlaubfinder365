import type { EmailLocale } from "./types";

export const zh: EmailLocale = {
  greeting: (name) => `您好，${name}，`,
  newBooking: {
    subject: "收到新预订",
    title: "您有一笔新预订！",
    body: ({ kunde, datum, personen, betrag, angebot }) =>
      `${kunde} 刚刚预订了「${angebot}」，共 ${personen} 人，日期为 ${datum}。总金额为 ${betrag}。`,
    cta: "查看预订",
  },
  bookingCancelled: {
    subject: "预订已取消",
    title: "一笔预订已被取消",
    body: ({ kunde, angebot, datum }) =>
      `${kunde} 在 ${datum} 对「${angebot}」的预订已被取消。`,
  },
  newReview: {
    subject: "收到新评价",
    title: "您有一条新评价！",
    body: ({ sterne, kommentar, angebot }) =>
      `您的优惠「${angebot}」获得了 ${sterne}/5 星的评分：「${kommentar}」`,
  },
  payout: {
    subject: "付款已发起",
    title: "您的付款正在路上",
    body: ({ betrag, datum, iban }) =>
      `我们已向您的账户（IBAN：${iban}）发起 ${betrag} 的付款。款项预计将于 ${datum} 前到账。`,
  },
  monthlyReport: {
    subject: (monat) => `您的月度报告 – ${monat}`,
    title: "月度报告",
    bookings: "预订数",
    revenue: "收入",
    commission: "佣金（15%）",
    payout: "付款",
  },
  profileApproved: {
    subject: "您的账户已通过审核",
    title: "欢迎加入 Urlaubfinder365！",
    body: "您的服务商资料已成功审核，旅行者现在可以看到您的信息。您可以立即添加优惠并开始接受预订。",
    cta: "前往控制台",
  },
  docStatus: {
    subject: (s) => s === "approved" ? "文件已验证" : "文件：需要补充材料",
    title: (s) => s === "approved" ? "您的文件已通过审核 ✓" : "请重新提交文件",
    body: (s, hinweis) =>
      s === "approved"
        ? "您提交的所有文件均已成功审核。您的账户已完全通过认证。"
        : `很遗憾，我们无法完全接受您的文件。请补充提交缺失的材料。${hinweis ? `备注：${hinweis}` : ""}`,
  },
  footer: {
    questions: "有问题？请发邮件至 support@urlaubfinder365.de",
    unsubscribe: "此邮件为自动发送。",
  },
};
