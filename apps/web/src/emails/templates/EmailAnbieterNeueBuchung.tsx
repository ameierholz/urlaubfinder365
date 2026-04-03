import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";
import { getLocale } from "../locales";

interface Props {
  anbieterName: string;
  sprache?: string;
  kunde: string;
  datum: string;
  personen: number;
  betrag: string;
  angebot: string;
  buchungsNummer: string;
  dashboardUrl: string;
}

const BASE = "https://urlaubfinder365.de";

export function EmailAnbieterNeueBuchung({ anbieterName, sprache, kunde, datum, personen, betrag, angebot, buchungsNummer, dashboardUrl }: Props) {
  const t = getLocale(sprache);
  return (
    <EmailLayout preview={`${t.newBooking.subject} – ${angebot}`}>
      <div style={{ backgroundColor: "#f0fdf9", borderRadius: 12, padding: "16px 20px", marginBottom: 24, borderLeft: "4px solid #1db682" }}>
        <Text style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🎯 {t.newBooking.title}</Text>
      </div>
      <EmailBody>{t.greeting(anbieterName)}</EmailBody>
      <EmailBody>{t.newBooking.body({ kunde, datum, personen, betrag, angebot })}</EmailBody>
      <EmailInfoBox rows={[
        { label: "Buchungsnr.", value: buchungsNummer },
        { label: "Aktivität", value: angebot },
        { label: "Kunde", value: kunde },
        { label: "Datum", value: datum },
        { label: "Personen", value: `${personen}` },
        { label: "Betrag", value: betrag },
      ]} />
      <EmailButton href={dashboardUrl}>{t.newBooking.cta}</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
        {t.footer.questions}
      </Text>
    </EmailLayout>
  );
}
