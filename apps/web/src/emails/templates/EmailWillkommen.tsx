import { EmailLayout, EmailHeading, EmailBody, EmailButton, EmailInfoBox, EmailDivider } from "../components/EmailLayout";
import { Text } from "@react-email/components";

interface Props {
  name: string;
  typ: "kunde" | "anbieter";
}

const BASE = "https://urlaubfinder365.de";

export function EmailWillkommen({ name, typ }: Props) {
  if (typ === "anbieter") {
    return (
      <EmailLayout preview={`Willkommen bei Urlaubfinder365 – dein Anbieter-Konto ist bereit`}>
        <EmailHeading>Willkommen an Bord, {name}! 🎉</EmailHeading>
        <EmailBody>
          Deine E-Mail-Adresse wurde erfolgreich bestätigt. Dein Anbieter-Konto ist jetzt aktiv — unser Team prüft dein Profil und deine Unterlagen und gibt dich schnellstmöglich frei.
        </EmailBody>
        <EmailBody>
          In der Zwischenzeit kannst du schon dein Profil vervollständigen und deine ersten Angebote anlegen.
        </EmailBody>
        <EmailButton href={`${BASE}/anbieter/dashboard`}>Zum Dashboard</EmailButton>
        <EmailDivider />
        <EmailInfoBox rows={[
          { label: "Nächster Schritt", value: "Profil & Dokumente einreichen" },
          { label: "Support", value: "support@urlaubfinder365.de" },
        ]} />
        <Text style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Bei Fragen steht dir unser Support-Team jederzeit zur Verfügung.
        </Text>
      </EmailLayout>
    );
  }

  return (
    <EmailLayout preview={`Willkommen bei Urlaubfinder365 – dein Konto ist aktiv`}>
      <EmailHeading>Willkommen, {name}! 🌴</EmailHeading>
      <EmailBody>
        Deine E-Mail-Adresse wurde bestätigt — dein Urlaubfinder365-Konto ist jetzt vollständig aktiv.
      </EmailBody>
      <EmailBody>
        Entdecke Tausende von Aktivitäten, Touren und Erlebnissen weltweit. Starte noch heute deinen nächsten Urlaub!
      </EmailBody>
      <EmailButton href={`${BASE}/marktplatz`}>Angebote entdecken</EmailButton>
      <EmailDivider />
      <EmailInfoBox rows={[
        { label: "Preisalarm", value: "Verpasse nie wieder ein Top-Angebot" },
        { label: "Community", value: "Reisende aus aller Welt" },
        { label: "Travel Coins", value: "Täglich sammeln & einlösen" },
      ]} />
    </EmailLayout>
  );
}
