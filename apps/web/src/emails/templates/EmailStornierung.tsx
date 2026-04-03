import { EmailLayout, EmailHeading, EmailBody, EmailInfoBox, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text, Link } from "@react-email/components";

interface Props {
  name: string;
  buchungsNummer: string;
  angebot: string;
  datum: string;
  gesamtpreis: string;
  erstattungInfo?: string;
  alternativenUrl?: string;
}

export function EmailStornierung({ name, buchungsNummer, angebot, datum, gesamtpreis, erstattungInfo, alternativenUrl }: Props) {
  return (
    <EmailLayout preview={`Buchung ${buchungsNummer} wurde storniert`}>
      <EmailHeading>Buchung storniert</EmailHeading>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        deine Buchung wurde storniert. Wir sind sorry, dass es nicht geklappt hat!
      </EmailBody>
      <EmailInfoBox rows={[
        { label: "Buchungsnummer", value: buchungsNummer },
        { label: "Aktivität", value: angebot },
        { label: "Datum", value: datum },
        { label: "Betrag", value: gesamtpreis },
        { label: "Erstattung", value: erstattungInfo ?? "Wird gemäß Stornierungsbedingungen bearbeitet" },
      ]} />
      {alternativenUrl && (
        <>
          <EmailBody>Vielleicht findest du eine tolle Alternative:</EmailBody>
          <EmailButton href={alternativenUrl}>Ähnliche Angebote entdecken</EmailButton>
        </>
      )}
      <EmailDivider />
      <Text style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
        Fragen zur Erstattung?{" "}
        <Link href="mailto:support@urlaubfinder365.de" style={{ color: "#1db682" }}>
          Kontaktiere unseren Support
        </Link>
      </Text>
    </EmailLayout>
  );
}
