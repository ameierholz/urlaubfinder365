import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_DEFAULT = "Urlaubfinder365 <noreply@urlaubfinder365.de>";
export const FROM_SUPPORT = "Urlaubfinder365 Support <support@urlaubfinder365.de>";
export const FROM_BUCHUNG = "Urlaubfinder365 Buchungen <buchungen@urlaubfinder365.de>";

/** Sendet eine E-Mail und loggt Fehler ohne zu werfen */
export async function sendMail(opts: {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  react: React.ReactElement;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const { error } = await resend.emails.send({
    from: opts.from ?? FROM_DEFAULT,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    react: opts.react,
    attachments: opts.attachments,
  });
  if (error) console.error("[email]", error);
  return !error;
}
