import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  firma: string;
  paket: string;
  grund?: string;
}

export function EmailWerbeplatzAbgelehnt({ name, firma, paket, grund }: Props) {
  return (
    <EmailLayout preview={`Werbeplatz-Anfrage abgelehnt – ${firma}`}>
      <EmailHeading>Werbeplatz nicht freigegeben</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        leider konnten wir deinen Werbeplatz nicht freischalten. Deine Subscription wurde storniert und der Betrag wird innerhalb von 5–10 Werktagen erstattet.
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Firma",  value: firma },
        { label: "Paket",  value: paket },
        { label: "Grund",  value: grund ?? "Inhalt entspricht nicht unseren Richtlinien" },
      ]} />
      <EmailBody>
        Du kannst jederzeit eine neue Anfrage stellen – gerne mit angepassten Inhalten.
      </EmailBody>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
        Fragen zur Ablehnung? Schreib uns an info@urlaubfinder365.de
      </Text>
    </EmailLayout>
  );
}
