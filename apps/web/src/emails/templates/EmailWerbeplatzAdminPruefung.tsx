import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  firma: string;
  kontaktName: string;
  email: string;
  paket: string;
  angebotUrl?: string;
  werbeinhalt?: string;
  adminUrl: string;
}

export function EmailWerbeplatzAdminPruefung({ firma, kontaktName, email, paket, angebotUrl, werbeinhalt, adminUrl }: Props) {
  return (
    <EmailLayout preview={`Neuer Werbeplatz zur Prüfung: ${firma}`}>
      <EmailHeading>Neuer Werbeplatz – Prüfung erforderlich</EmailHeading>
      <EmailBody>Zahlung eingegangen. Bitte Inhalt prüfen und freigeben oder ablehnen.</EmailBody>
      <EmailInfoBox rows={[
        { label: "Firma",     value: firma },
        { label: "Kontakt",   value: kontaktName },
        { label: "E-Mail",    value: email },
        { label: "Paket",     value: paket },
        { label: "Angebot",   value: angebotUrl ?? "–" },
        { label: "Nachricht", value: werbeinhalt ?? "–" },
      ]} />
      <EmailButton href={adminUrl}>Jetzt prüfen &amp; freigeben</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
        Bitte innerhalb von 24 Stunden entscheiden. Bei Ablehnung wird die Subscription automatisch storniert und erstattet.
      </Text>
    </EmailLayout>
  );
}
