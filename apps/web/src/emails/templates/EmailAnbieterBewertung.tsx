import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";
import { getLocale } from "../locales";

interface Props {
  anbieterName: string;
  sprache?: string;
  sterne: number;
  kommentar: string;
  angebot: string;
  dashboardUrl: string;
}

export function EmailAnbieterBewertung({ anbieterName, sprache, sterne, kommentar, angebot, dashboardUrl }: Props) {
  const t = getLocale(sprache);
  const stars = "⭐".repeat(sterne) + "☆".repeat(5 - sterne);
  return (
    <EmailLayout preview={`${t.newReview.subject} – ${stars}`}>
      <EmailHeading>{t.newReview.title}</EmailHeading>
      <EmailBody>{t.greeting(anbieterName)}</EmailBody>
      <EmailBody>{t.newReview.body({ sterne, kommentar, angebot })}</EmailBody>
      <div style={{ backgroundColor: "#fffbeb", borderRadius: 12, padding: "20px 24px", marginBottom: 20, border: "1px solid #fde68a" }}>
        <Text style={{ margin: "0 0 8px", fontSize: 24 }}>{stars}</Text>
        <Text style={{ margin: 0, fontSize: 15, color: "#374151", fontStyle: "italic" }}>
          „{kommentar}"
        </Text>
      </div>
      <EmailButton href={dashboardUrl}>Bewertung ansehen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{t.footer.questions}</Text>
    </EmailLayout>
  );
}
