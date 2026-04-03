import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  angebot: string;
  datum: string;
  uhrzeit?: string;
  treffpunkt?: string;
  anbieterTelefon?: string;
  ticketUrl: string;
}

export function EmailErinnerung48h({ name, angebot, datum, uhrzeit, treffpunkt, anbieterTelefon, ticketUrl }: Props) {
  return (
    <EmailLayout preview={`Morgen geht's los! – ${angebot}`}>
      <div style={{ backgroundColor: "#fefce8", borderRadius: 12, padding: "16px 20px", marginBottom: 24, borderLeft: "4px solid #f59e0b" }}>
        <Text style={{ margin: 0, fontSize: 20 }}>⏰ Nur noch 48 Stunden!</Text>
      </div>
      <EmailHeading>Deine Tour startet bald</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        in 48 Stunden startet dein Erlebnis <strong>{angebot}</strong>. Hier nochmal alle wichtigen Infos auf einen Blick:
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Aktivität", value: angebot },
        { label: "Datum", value: datum },
        ...(uhrzeit ? [{ label: "Uhrzeit", value: uhrzeit }] : []),
        ...(treffpunkt ? [{ label: "Treffpunkt", value: treffpunkt }] : []),
        ...(anbieterTelefon ? [{ label: "Anbieter Tel.", value: anbieterTelefon }] : []),
      ]} />
      <EmailButton href={ticketUrl}>Ticket öffnen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
        Checkliste vor der Abreise:
      </Text>
      <Text style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: "1.8" }}>
        ✓ Ticket auf dem Handy gespeichert oder ausgedruckt<br />
        ✓ Rechtzeitig am Treffpunkt (ca. 10–15 Minuten vorher)<br />
        ✓ Wetter geprüft & passend gekleidet<br />
        ✓ Personalausweis/Pass dabei
      </Text>
    </EmailLayout>
  );
}
