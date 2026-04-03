import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  firma: string;
  paket: string;
  portalUrl: string;
}

export function EmailWerbeplatzFreigabe({ name, firma, paket, portalUrl }: Props) {
  return (
    <EmailLayout preview={`Dein Werbeplatz ist live – ${firma}`}>
      <EmailHeading>🚀 Dein Werbeplatz ist live!</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        dein Werbeplatz wurde geprüft und ist ab sofort aktiv. Du bist jetzt für tausende Reisende täglich sichtbar.
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Firma",  value: firma },
        { label: "Paket",  value: paket },
        { label: "Status", value: "✅ Aktiv" },
      ]} />
      <EmailBody>
        Stripe stellt dir automatisch jeden Monat eine Rechnung aus. Du kannst dein Abo jederzeit selbst verwalten oder kündigen.
      </EmailBody>
      <EmailButton href={portalUrl}>Abo verwalten &amp; Rechnung</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
        Fragen? Schreib uns an info@urlaubfinder365.de
      </Text>
    </EmailLayout>
  );
}
