import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  firma: string;
  email: string;
  angebotUrl?: string;
  nachricht?: string;
}

export function EmailWerbeplatzAnfrage({ name, firma, email, angebotUrl, nachricht }: Props) {
  return (
    <EmailLayout preview={`Neue Werbeplatz-Anfrage von ${firma}`}>
      <EmailHeading>Neue Werbeplatz-Anfrage</EmailHeading>
      <EmailBody>
        Eine neue Anfrage für einen Featured Werbeplatz auf der Startseite ist eingegangen.
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Name", value: name },
        { label: "Firma / Unternehmen", value: firma },
        { label: "E-Mail", value: email },
        { label: "Angebot / URL", value: angebotUrl ?? "–" },
        { label: "Paket", value: "Featured Spot · 199 € / Monat" },
        ...(nachricht ? [{ label: "Nachricht", value: nachricht }] : []),
      ]} />
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
        Bitte innerhalb von 24 Stunden antworten und Zahlungsdetails sowie Startdatum bestätigen.
      </Text>
    </EmailLayout>
  );
}
