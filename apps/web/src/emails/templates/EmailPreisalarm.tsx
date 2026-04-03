import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  ziel: string;
  angebot: string;
  alterPreis: string;
  neuerPreis: string;
  ersparnis: string;
  angebotUrl: string;
}

export function EmailPreisalarm({ name, ziel, angebot, alterPreis, neuerPreis, ersparnis, angebotUrl }: Props) {
  return (
    <EmailLayout preview={`Preisalarm: ${ziel} jetzt ${ersparnis} günstiger!`}>
      <div style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: "16px 20px", marginBottom: 24, borderLeft: "4px solid #ef4444" }}>
        <Text style={{ margin: 0, fontSize: 13, color: "#ef4444", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1 }}>
          🔔 Preisalarm ausgelöst
        </Text>
        <Text style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#111827" }}>
          {ziel} — jetzt {ersparnis} günstiger!
        </Text>
      </div>
      <EmailBody>Hallo {name},</EmailBody>
      <EmailBody>
        der Preis für <strong>{angebot}</strong> ist gerade gefallen. Greif jetzt zu, bevor der Preis wieder steigt!
      </EmailBody>
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 24 }}>
        <tbody>
          <tr>
            <td style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px 0 0 8px", textAlign: "center" as const, border: "1px solid #e5e7eb" }}>
              <Text style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Vorher</Text>
              <Text style={{ margin: "4px 0 0", fontSize: 20, color: "#9ca3af", textDecoration: "line-through" }}>{alterPreis}</Text>
            </td>
            <td style={{ padding: "16px", backgroundColor: "#f0fdf9", borderRadius: "0 8px 8px 0", textAlign: "center" as const, border: "1px solid #1db682" }}>
              <Text style={{ margin: 0, fontSize: 12, color: "#1db682", fontWeight: 700 }}>Jetzt</Text>
              <Text style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: "#1db682" }}>{neuerPreis}</Text>
            </td>
          </tr>
        </tbody>
      </table>
      <EmailButton href={angebotUrl}>Angebot sichern →</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
        Du erhältst diese E-Mail, weil du einen Preisalarm für {ziel} eingerichtet hast.
      </Text>
    </EmailLayout>
  );
}
