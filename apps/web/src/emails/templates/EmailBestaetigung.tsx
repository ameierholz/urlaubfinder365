import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  confirmUrl: string;
  typ: "kunde" | "anbieter";
}

export function EmailBestaetigung({ name, confirmUrl, typ }: Props) {
  return (
    <EmailLayout preview={`Bitte bestätige deine E-Mail-Adresse bei Urlaubfinder365`}>
      <EmailHeading>E-Mail-Adresse bestätigen</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        {typ === "anbieter"
          ? "vielen Dank für deine Registrierung als Anbieter bei Urlaubfinder365. Bitte bestätige jetzt deine E-Mail-Adresse, um dein Konto zu aktivieren."
          : "willkommen bei Urlaubfinder365! Bitte bestätige deine E-Mail-Adresse, um loszulegen."}
      </EmailBody>
      <EmailButton href={confirmUrl}>E-Mail-Adresse bestätigen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
        Dieser Link ist 24 Stunden gültig. Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.
      </Text>
    </EmailLayout>
  );
}
