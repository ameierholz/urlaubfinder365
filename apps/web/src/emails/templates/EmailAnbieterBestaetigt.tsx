import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  angebot: string;
  anbieter: string;
  datum: string;
  treffpunkt?: string;
  treffpunktHinweis?: string;
  ticketUrl: string;
}

export function EmailAnbieterBestaetigt({ name, angebot, anbieter, datum, treffpunkt, treffpunktHinweis, ticketUrl }: Props) {
  return (
    <EmailLayout preview={`Deine Tour wurde bestätigt – ${angebot}`}>
      <EmailHeading>Deine Tour ist bestätigt! 🎉</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        dein Anbieter <strong>{anbieter}</strong> hat deine Buchung für <strong>{angebot}</strong> bestätigt. Hier sind alle wichtigen Details für deinen Tag:
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Aktivität", value: angebot },
        { label: "Datum", value: datum },
        { label: "Anbieter", value: anbieter },
        ...(treffpunkt ? [{ label: "Treffpunkt", value: treffpunkt }] : []),
        ...(treffpunktHinweis ? [{ label: "Hinweis", value: treffpunktHinweis }] : []),
      ]} />
      <EmailButton href={ticketUrl}>Ticket anzeigen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
        Vergiss dein Ticket nicht! Zeige den QR-Code oder die Buchungsnummer beim Anbieter vor.
      </Text>
    </EmailLayout>
  );
}
