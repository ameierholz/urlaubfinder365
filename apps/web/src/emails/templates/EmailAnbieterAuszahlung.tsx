import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";
import { getLocale } from "../locales";

interface Props {
  anbieterName: string;
  sprache?: string;
  betrag: string;
  datum: string;
  iban: string;
  buchungen: number;
  referenz?: string;
}

export function EmailAnbieterAuszahlung({ anbieterName, sprache, betrag, datum, iban, buchungen, referenz }: Props) {
  const t = getLocale(sprache);
  return (
    <EmailLayout preview={`${t.payout.subject} – ${betrag}`}>
      <div style={{ textAlign: "center" as const, fontSize: 40, marginBottom: 16 }}>💸</div>
      <EmailHeading>{t.payout.title}</EmailHeading>
      <EmailBody>{t.greeting(anbieterName)}</EmailBody>
      <EmailBody>{t.payout.body({ betrag, datum, iban })}</EmailBody>
      <EmailInfoBox rows={[
        { label: "Betrag", value: betrag },
        { label: "IBAN (Ende)", value: iban },
        { label: "Erwartetes Datum", value: datum },
        { label: "Enthaltene Buchungen", value: `${buchungen}` },
        ...(referenz ? [{ label: "Referenz", value: referenz }] : []),
      ]} />
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
        {t.footer.questions}
      </Text>
    </EmailLayout>
  );
}
