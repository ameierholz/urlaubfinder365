import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  resetUrl: string;
}

export function EmailPasswortReset({ name, resetUrl }: Props) {
  return (
    <EmailLayout preview="Passwort zurücksetzen – Urlaubfinder365">
      <EmailHeading>Passwort zurücksetzen</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button, um ein neues Passwort zu vergeben.
      </EmailBody>
      <EmailButton href={resetUrl}>Passwort jetzt zurücksetzen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
        Dieser Link ist 1 Stunde gültig. Falls du keine Passwort-Zurücksetzung angefordert hast, kannst du diese E-Mail ignorieren — dein Konto ist sicher.
      </Text>
    </EmailLayout>
  );
}
