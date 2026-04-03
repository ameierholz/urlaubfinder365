import {
  Html, Head, Body, Container, Section, Img, Text, Hr, Link, Font,
} from "@react-email/components";

interface Props {
  children: React.ReactNode;
  preview?: string;
}

const BASE_URL = "https://urlaubfinder365.de";
const LOGO_URL = `${BASE_URL}/logo.png`;

export function EmailLayout({ children, preview }: Props) {
  return (
    <Html lang="de">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{ url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2", format: "woff2" }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {preview && (
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
          {preview}
        </div>
      )}
      <Body style={{ backgroundColor: "#f4f4f5", margin: 0, padding: "40px 16px", fontFamily: "Inter, Arial, sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* Header */}
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "16px 16px 0 0", padding: "24px 32px", borderBottom: "3px solid #1db682" }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td>
                    <Img src={LOGO_URL} alt="Urlaubfinder365" width={40} height={40} style={{ borderRadius: 8 }} />
                  </td>
                  <td style={{ paddingLeft: 12 }}>
                    <Text style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Urlaubfinder365</Text>
                    <Text style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>urlaubfinder365.de</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Content */}
          <Section style={{ backgroundColor: "#ffffff", padding: "32px 32px 24px" }}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: "#f9fafb", borderRadius: "0 0 16px 16px", padding: "20px 32px", border: "1px solid #e5e7eb", borderTop: "none" }}>
            <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px" }} />
            <Text style={{ margin: 0, fontSize: 12, color: "#9ca3af", textAlign: "center" as const }}>
              <Link href={BASE_URL} style={{ color: "#1db682", textDecoration: "none" }}>urlaubfinder365.de</Link>
              {" · "}
              <Link href={`${BASE_URL}/datenschutz`} style={{ color: "#9ca3af" }}>Datenschutz</Link>
              {" · "}
              <Link href={`${BASE_URL}/impressum`} style={{ color: "#9ca3af" }}>Impressum</Link>
            </Text>
            <Text style={{ margin: "8px 0 0", fontSize: 11, color: "#d1d5db", textAlign: "center" as const }}>
              © {new Date().getFullYear()} Urlaubfinder365. Alle Rechte vorbehalten.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

/** Wiederverwendbare Elemente */
export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
      {children}
    </Text>
  );
}

export function EmailBody({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 15, color: "#374151", lineHeight: "1.6", margin: "0 0 20px" }}>
      {children}
    </Text>
  );
}

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: "#1db682",
        color: "#ffffff",
        fontWeight: 700,
        fontSize: 15,
        padding: "12px 28px",
        borderRadius: 8,
        textDecoration: "none",
        margin: "8px 0 20px",
      }}
    >
      {children}
    </Link>
  );
}

export function EmailInfoBox({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#f9fafb", borderRadius: 8, marginBottom: 20, border: "1px solid #e5e7eb" }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #e5e7eb" : "none" }}>
            <td style={{ padding: "10px 16px", fontSize: 13, color: "#6b7280", width: "40%", fontWeight: 600 }}>{row.label}</td>
            <td style={{ padding: "10px 16px", fontSize: 13, color: "#111827" }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EmailDivider() {
  return <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />;
}
