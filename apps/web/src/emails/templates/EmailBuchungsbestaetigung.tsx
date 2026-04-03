import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text, Link } from "@react-email/components";

interface Props {
  name: string;
  buchungsNummer: string;
  angebot: string;
  anbieter: string;
  datum: string;
  personen: number;
  gesamtpreis: string;
  treffpunkt?: string;
  ticketUrl: string;
}

const BASE = "https://urlaubfinder365.de";

export function EmailBuchungsbestaetigung({
  name, buchungsNummer, angebot, anbieter, datum,
  personen, gesamtpreis, treffpunkt, ticketUrl,
}: Props) {
  return (
    <EmailLayout preview={`Buchungsbestätigung ${buchungsNummer} – ${angebot}`}>

      {/* Hero */}
      <div style={{ backgroundColor: "#f0fdf9", borderRadius: 12, padding: "20px 24px", marginBottom: 24, borderLeft: "4px solid #1db682" }}>
        <Text style={{ margin: 0, fontSize: 13, color: "#1db682", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1 }}>
          Buchung bestätigt ✓
        </Text>
        <Text style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#111827" }}>
          {angebot}
        </Text>
      </div>

      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        deine Buchung wurde erfolgreich abgeschlossen und deine Zahlung ist eingegangen. Zeige dein Ticket vor Ort beim Anbieter vor — per QR-Code oder Buchungsnummer.
      </EmailBody>

      <EmailInfoBox rows={[
        { label: "Buchungsnummer", value: buchungsNummer },
        { label: "Aktivität", value: angebot },
        { label: "Anbieter", value: anbieter },
        { label: "Datum", value: datum },
        { label: "Personen", value: `${personen} Person${personen !== 1 ? "en" : ""}` },
        { label: "Bezahlt", value: gesamtpreis },
        ...(treffpunkt ? [{ label: "Treffpunkt", value: treffpunkt }] : []),
      ]} />

      <EmailButton href={ticketUrl}>Ticket anzeigen & herunterladen</EmailButton>

      <EmailDivider />

      <EmailBody>
        Im Anhang findest du außerdem deine Rechnung sowie die Allgemeinen Geschäftsbedingungen.
      </EmailBody>

      <Text style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px" }}>
        <strong>Wichtig:</strong> Bitte sei rechtzeitig am Treffpunkt. Bei Fragen wende dich direkt an deinen Anbieter oder an{" "}
        <Link href="mailto:support@urlaubfinder365.de" style={{ color: "#1db682" }}>support@urlaubfinder365.de</Link>.
      </Text>

      <Text style={{ fontSize: 12, color: "#9ca3af", margin: "16px 0 0" }}>
        Buchungsnummer: {buchungsNummer} · {BASE}
      </Text>
    </EmailLayout>
  );
}
