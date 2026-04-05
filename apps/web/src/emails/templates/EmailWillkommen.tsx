import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailDivider } from "../components/EmailLayout";
import { Text, Link } from "@react-email/components";

interface Props {
  name: string;
  typ: "kunde" | "anbieter";
}

const BASE = "https://www.urlaubfinder365.de";

// Feature-Box Hilfsfunktion
function FeatureRow({ emoji, title, desc, href }: { emoji: string; title: string; desc: string; href: string }) {
  return (
    <tr>
      <td style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6", verticalAlign: "top" }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={{ width: 40, verticalAlign: "top", paddingTop: 2 }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
              </td>
              <td style={{ verticalAlign: "top" }}>
                <Link href={href} style={{ fontSize: 14, fontWeight: 700, color: "#111827", textDecoration: "none", display: "block", marginBottom: 2 }}>
                  {title}
                </Link>
                <Text style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: "1.5" }}>{desc}</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

export function EmailWillkommen({ name, typ }: Props) {
  if (typ === "anbieter") {
    return (
      <EmailLayout preview={`Willkommen bei Urlaubfinder365 – dein Anbieter-Konto ist bereit`}>
        <EmailHeading>Willkommen an Bord, {name}! 🎉</EmailHeading>
        <EmailBody>
          Deine E-Mail-Adresse wurde erfolgreich bestätigt. Dein Anbieter-Konto ist jetzt aktiv —
          unser Team prüft dein Profil und deine Unterlagen und gibt dich schnellstmöglich frei.
        </EmailBody>
        <EmailBody>
          In der Zwischenzeit kannst du dein Profil vervollständigen und deine ersten Angebote anlegen,
          damit du sofort sichtbar bist, sobald die Freigabe erfolgt.
        </EmailBody>
        <EmailButton href={`${BASE}/anbieter/dashboard`}>Zum Anbieter-Dashboard</EmailButton>
        <EmailDivider />
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <FeatureRow
              emoji="📋"
              title="Profil & Dokumente einreichen"
              desc="Vervollständige dein Anbieter-Profil mit Beschreibung, Fotos und Unterlagen."
              href={`${BASE}/anbieter/dashboard`}
            />
            <FeatureRow
              emoji="🏷️"
              title="Angebote anlegen"
              desc="Erstelle Aktivitäten, Touren oder Pakete – mit Preisen, Verfügbarkeiten und Fotos."
              href={`${BASE}/anbieter/angebote`}
            />
            <FeatureRow
              emoji="📊"
              title="Einnahmen & Buchungen"
              desc="Behalte alle Buchungen und Auszahlungen in deinem Dashboard im Blick."
              href={`${BASE}/anbieter/buchungen`}
            />
          </tbody>
        </table>
        <EmailDivider />
        <Text style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Fragen? Schreib uns jederzeit:{" "}
          <Link href="mailto:support@urlaubfinder365.de" style={{ color: "#1db682" }}>
            support@urlaubfinder365.de
          </Link>
        </Text>
      </EmailLayout>
    );
  }

  return (
    <EmailLayout preview={`Willkommen bei Urlaubfinder365, ${name}! Dein Konto ist aktiv.`}>
      <EmailHeading>Willkommen bei Urlaubfinder365, {name}! 🌴</EmailHeading>
      <EmailBody>
        Deine E-Mail-Adresse wurde bestätigt — dein Konto ist jetzt vollständig aktiv.
        Wir freuen uns, dich in unserer Reise-Community begrüßen zu dürfen!
      </EmailBody>
      <EmailBody>
        Mit Urlaubfinder365 findest du die besten Reiseangebote, planst deinen Urlaub
        von A bis Z und bleibst mit tausenden Reisenden weltweit vernetzt.
        Hier ist, was dich erwartet:
      </EmailBody>

      <EmailButton href={`${BASE}/urlaubsziele/`}>Jetzt Urlaub entdecken →</EmailButton>

      <EmailDivider />

      {/* Urlaub finden */}
      <Text style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
        URLAUB FINDEN
      </Text>
      <table width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <FeatureRow
            emoji="✈️"
            title="Pauschalreisen & Last Minute"
            desc="Vergleiche Tausende Angebote für Pauschalreisen, All-Inclusive und Last-Minute-Deals in Echtzeit."
            href={`${BASE}/guenstig-urlaub-buchen/`}
          />
          <FeatureRow
            emoji="🔔"
            title="Preisalarm"
            desc="Leg einen Preisalarm für dein Wunschziel an – wir benachrichtigen dich, sobald der Preis fällt."
            href={`${BASE}/dashboard`}
          />
          <FeatureRow
            emoji="📈"
            title="Preistrends & Bestzeit-Empfehlungen"
            desc="Sieh historische Preisverläufe und erfahre, wann die beste Zeit zum Buchen ist."
            href={`${BASE}/urlaubsziele/`}
          />
          <FeatureRow
            emoji="🤖"
            title="KI-Reiseplaner"
            desc="Beschreibe deinen Traumurlaub – unsere KI erstellt in Sekunden einen personalisierten Reiseplan."
            href={`${BASE}/ki-reiseplaner/`}
          />
          <FeatureRow
            emoji="🎟️"
            title="Aktivitäten & Erlebnisse"
            desc="Buche Touren, Ausflüge und Erlebnisse an über 250 Reisezielen weltweit."
            href={`${BASE}/aktivitaeten/`}
          />
        </tbody>
      </table>

      <EmailDivider />

      {/* Community */}
      <Text style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
        COMMUNITY
      </Text>
      <table width="100%" cellPadding={0} cellSpacing={0}>
        <tbody>
          <FeatureRow
            emoji="🪙"
            title="Travel Coins täglich sammeln"
            desc="Öffne die App jeden Tag und sammle Travel Coins – einlösbar für Premium-Features und Rabatte."
            href={`${BASE}/community/`}
          />
          <FeatureRow
            emoji="🧩"
            title="Daily Travel Quiz"
            desc="Teste täglich dein Geografie-Wissen mit Länder-Rätseln, Flaggen-Quiz und Highscores."
            href={`${BASE}/community/`}
          />
          <FeatureRow
            emoji="📖"
            title="Reiseberichte teilen"
            desc="Teile deine Reiseerfahrungen mit der Community und entdecke Tipps anderer Reisender."
            href={`${BASE}/community/reiseberichte/`}
          />
          <FeatureRow
            emoji="🗺️"
            title="Reiserouten planen & klonen"
            desc="Erstelle deine persönliche Reiseroute oder übernimm mit einem Klick die Pläne anderer."
            href={`${BASE}/community/`}
          />
          <FeatureRow
            emoji="❤️"
            title="Favoriten & Wunschliste"
            desc="Speichere Traumziele und verfolge ihre Preisentwicklung – alles an einem Ort."
            href={`${BASE}/dashboard`}
          />
        </tbody>
      </table>

      <EmailDivider />

      <Text style={{ fontSize: 14, color: "#374151", lineHeight: "1.6", margin: "0 0 20px" }}>
        Wir wünschen dir viel Spaß beim Entdecken und freuen uns auf deine Berichte!<br />
        Gute Reise 🌍
      </Text>
      <Text style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
        Fragen? Schreib uns:{" "}
        <Link href="mailto:support@urlaubfinder365.de" style={{ color: "#1db682" }}>
          support@urlaubfinder365.de
        </Link>
      </Text>
    </EmailLayout>
  );
}
