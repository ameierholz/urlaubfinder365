import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  angebot: string;
  bewertungsUrl: string;
}

export function EmailBewertungsanfrage({ name, angebot, bewertungsUrl }: Props) {
  return (
    <EmailLayout preview={`Wie war dein Erlebnis? – ${angebot}`}>
      <div style={{ textAlign: "center" as const, fontSize: 40, marginBottom: 16 }}>🌟</div>
      <EmailHeading>Wie war dein Erlebnis?</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        du hast kürzlich <strong>{angebot}</strong> erlebt. Wir hoffen, es war unvergesslich! Deine Bewertung hilft anderen Reisenden bei der Entscheidung und unterstützt deinen Anbieter.
      </EmailBody>
      <EmailBody>
        Es dauert nur 1 Minute.
      </EmailBody>
      <EmailButton href={bewertungsUrl}>Jetzt bewerten ⭐</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
        Du musst nicht — aber dein Feedback macht den Unterschied.
      </Text>
    </EmailLayout>
  );
}
