import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";
import { getLocale } from "../locales";

interface Buchung {
  datum: string;
  angebot: string;
  personen: number;
  betrag: string;
}

interface Props {
  anbieterName: string;
  sprache?: string;
  monat: string; // z.B. "März 2026"
  buchungen: Buchung[];
  gesamtEinnahmen: string;
  provision: string;
  auszahlung: string;
  dashboardUrl: string;
}

export function EmailAnbieterMonatsbericht({ anbieterName, sprache, monat, buchungen, gesamtEinnahmen, provision, auszahlung, dashboardUrl }: Props) {
  const t = getLocale(sprache);
  return (
    <EmailLayout preview={t.monthlyReport.subject(monat)}>
      <EmailHeading>{t.monthlyReport.title}</EmailHeading>
      <Text style={{ fontSize: 16, color: "#6b7280", margin: "0 0 20px" }}>{monat}</Text>
      <EmailBody>{t.greeting(anbieterName)}</EmailBody>

      {/* Kennzahlen */}
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 24 }}>
        <tbody>
          <tr>
            {[
              { label: t.monthlyReport.bookings, value: `${buchungen.length}` },
              { label: t.monthlyReport.revenue, value: gesamtEinnahmen },
              { label: t.monthlyReport.commission, value: provision },
              { label: t.monthlyReport.payout, value: auszahlung },
            ].map((item, i) => (
              <td key={i} style={{ padding: "16px 8px", textAlign: "center" as const, backgroundColor: i === 3 ? "#f0fdf9" : "#f9fafb", borderRadius: 8, border: `1px solid ${i === 3 ? "#1db682" : "#e5e7eb"}` }}>
                <Text style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" as const }}>{item.label}</Text>
                <Text style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: i === 3 ? "#1db682" : "#111827" }}>{item.value}</Text>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Buchungsliste */}
      {buchungen.length > 0 && (
        <>
          <Text style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            {t.monthlyReport.bookings}
          </Text>
          <table width="100%" cellPadding={0} cellSpacing={0} style={{ border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 20 }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {["Datum", "Aktivität", "Pers.", "Betrag"].map((h) => (
                  <td key={h} style={{ padding: "8px 12px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" as const }}>{h}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {buchungen.map((b, i) => (
                <tr key={i} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "#374151" }}>{b.datum}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "#374151" }}>{b.angebot}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "#374151" }}>{b.personen}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{b.betrag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <EmailButton href={dashboardUrl}>Dashboard öffnen</EmailButton>
      <EmailDivider />
      <Text style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
        {t.footer.questions}
      </Text>
    </EmailLayout>
  );
}
