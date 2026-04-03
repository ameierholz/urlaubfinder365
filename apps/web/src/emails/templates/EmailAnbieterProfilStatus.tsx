import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";
import { getLocale } from "../locales";

interface Props {
  anbieterName: string;
  sprache?: string;
  status: "approved" | "rejected";
  hinweis?: string;
  dashboardUrl: string;
}

export function EmailAnbieterProfilStatus({ anbieterName, sprache, status, hinweis, dashboardUrl }: Props) {
  const t = getLocale(sprache);
  const isApproved = status === "approved";
  return (
    <EmailLayout preview={t.profileApproved.subject}>
      <div style={{ backgroundColor: isApproved ? "#f0fdf9" : "#fef2f2", borderRadius: 12, padding: "16px 20px", marginBottom: 24, borderLeft: `4px solid ${isApproved ? "#1db682" : "#ef4444"}` }}>
        <Text style={{ margin: 0, fontSize: 20 }}>
          {isApproved ? "✅ " : "⚠️ "}{t.profileApproved.title}
        </Text>
      </div>
      <EmailBody>{t.greeting(anbieterName)}</EmailBody>
      <EmailBody>{t.profileApproved.body}</EmailBody>
      {!isApproved && hinweis && (
        <div style={{ backgroundColor: "#fef2f2", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <Text style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>
            <strong>Hinweis:</strong> {hinweis}
          </Text>
        </div>
      )}
      <EmailButton href={dashboardUrl}>{t.profileApproved.cta}</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{t.footer.questions}</Text>
    </EmailLayout>
  );
}
