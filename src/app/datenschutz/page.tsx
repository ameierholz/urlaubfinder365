import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Urlaubfinder365.de – Informationen zur Erhebung, Verarbeitung und Nutzung personenbezogener Daten gemäß DSGVO.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.urlaubfinder365.de/datenschutz/" },
};

export default function DatenschutzPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-gray-500 mb-10">
        Zuletzt aktualisiert: März 2026 (Cookie-Einwilligung & Barrierefreiheit ergänzt) · Gemäß DSGVO, BDSG und TTDSG
      </p>

      <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            <span className="font-semibold text-gray-900">Urlaubfinder365.de</span><br />
            Andre Meier<br />
            Dieselstraße 18, 74372 Sersheim, Deutschland<br />
            E-Mail:{" "}
            <a href="mailto:info@urlaubfinder365.de" className="text-sand-500 hover:underline">
              info@urlaubfinder365.de
            </a>
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. Erhobene Daten & Zweck</h2>
          <h3 className="font-semibold text-gray-800 mb-1">a) Server-Logfiles</h3>
          <p className="mb-3">
            Bei jedem Aufruf unserer Website erhebt unser Hosting-Anbieter (Vercel Inc., USA)
            automatisch Informationen, die dein Browser übermittelt: IP-Adresse, Datum/Uhrzeit,
            aufgerufene Seite, Browsertyp, Betriebssystem. Diese Daten dienen der technischen
            Bereitstellung und Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <h3 className="font-semibold text-gray-800 mb-1">b) Registrierung & Benutzerkonto</h3>
          <p className="mb-2">
            Wenn du ein Konto erstellst, verarbeiten wir E-Mail-Adresse und Passwort (verschlüsselt).
            Grundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </p>
          <p className="mb-2">
            Für Authentifizierung (<strong>Firebase Authentication</strong>) und Datenspeicherung
            (gespeicherte Wunschlisten, Preisalarme, Reisedokumente via <strong>Cloud Firestore</strong>)
            nutzen wir Firebase-Dienste der <strong>Google LLC, 1600 Amphitheatre Parkway,
            Mountain View, CA 94043, USA</strong>. Die Übertragung erfolgt auf Basis der
            EU-Standardvertragsklauseln (SCC). Daten werden gelöscht, sobald du dein Konto
            löschst (Anfrage an info@urlaubfinder365.de). Weitere Infos:{" "}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-sand-500 hover:underline">
              firebase.google.com/support/privacy
            </a>.
          </p>
          <p className="mb-3">
            <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, verschlüsseltes Passwort,
            Zeitstempel der Registrierung, gespeicherte Reisepräferenzen und Wunschlisten.
            <strong> Speicherdauer:</strong> Bis zur Kontolöschung auf Anfrage.
          </p>
          <h3 className="font-semibold text-gray-800 mb-1">c) Newsletter (Brevo)</h3>
          <p className="mb-3">
            Mit deiner ausdrücklichen Einwilligung kannst du unseren kostenlosen Newsletter mit
            Reiseangeboten, Preisalarmen und Reisetipps abonnieren. Für den Versand nutzen wir{" "}
            <strong>Brevo</strong> (ehemals Sendinblue), betrieben von der Sendinblue GmbH,
            Köpenicker Str. 126, 10179 Berlin.
          </p>
          <p className="mb-2">Verarbeitete Daten: E-Mail-Adresse, Name (freiwillig), Zeitstempel der
            Anmeldung und Bestätigung, IP-Adresse.</p>
          <p className="mb-2">
            <strong>Double-Opt-in:</strong> Nach Eingabe deiner Adresse erhältst du eine Bestätigungs-E-Mail.
            Erst nach Klick auf den Bestätigungslink wirst du eingetragen.
          </p>
          <p className="mb-2">
            <strong>Rechtsgrundlage:</strong> Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO. Du kannst
            diese jederzeit widerrufen – über den Abmelde-Link in jeder Newsletter-E-Mail oder per
            E-Mail an <a href="mailto:info@urlaubfinder365.de" className="text-sand-500 hover:underline">info@urlaubfinder365.de</a>.
          </p>
          <p className="mb-3">
            Mit Brevo besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Weitere Infos:{" "}
            <a href="https://www.brevo.com/de/legal/privacypolicy/" target="_blank" rel="noopener noreferrer"
              className="text-sand-500 hover:underline">brevo.com/de/legal/privacypolicy</a>.
            Unsere Newsletter enthalten Öffnungs- und Klick-Tracking zur Optimierung des Angebots
            (Art. 6 Abs. 1 lit. f DSGVO). Das Tracking kannst du durch Deaktivieren des
            Bildladens in deinem E-Mail-Programm verhindern.
          </p>

          <h3 className="font-semibold text-gray-800 mb-1">d) Cookies, localStorage & Einwilligung</h3>
          <p className="mb-3">
            Wir setzen keine Drittanbieter-Tracking-Cookies ohne Einwilligung. Beim ersten Besuch
            wird ein <strong>Cookie-Banner</strong> angezeigt, über den du deine Einwilligung erteilen,
            einschränken oder ablehnen kannst. Deine Wahl wird im <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code>{" "}
            deines Browsers unter dem Schlüssel <code className="bg-gray-100 px-1 rounded text-xs">uf365-consent</code> gespeichert.
            Die Einwilligung gilt für 12 Monate und kann jederzeit über das Cookie-Banner (erneuter Aufruf
            über den Link in der Fußzeile) oder durch Löschen des Browser-Speichers widerrufen werden.
          </p>
          <p className="mb-2 font-semibold text-gray-800">Verwendete Speichereinträge:</p>
          <div className="overflow-x-auto mb-3">
            <table className="text-xs w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left px-3 py-2 font-semibold border-b border-gray-200">Schlüssel</th>
                  <th className="text-left px-3 py-2 font-semibold border-b border-gray-200">Typ</th>
                  <th className="text-left px-3 py-2 font-semibold border-b border-gray-200">Zweck</th>
                  <th className="text-left px-3 py-2 font-semibold border-b border-gray-200">Laufzeit</th>
                  <th className="text-left px-3 py-2 font-semibold border-b border-gray-200">Rechtsgrundlage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-3 py-2 font-mono">uf365-consent</td>
                  <td className="px-3 py-2">localStorage</td>
                  <td className="px-3 py-2">Speichert deine Cookie-Einwilligung (notwendig / statistik / marketing)</td>
                  <td className="px-3 py-2">12 Monate</td>
                  <td className="px-3 py-2">Art. 6 Abs. 1 lit. c DSGVO, § 25 TTDSG</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-3 py-2 font-mono">uf365-a11y</td>
                  <td className="px-3 py-2">localStorage</td>
                  <td className="px-3 py-2">Barrierefreiheits-Einstellungen (Textgröße, Kontrast, Filter) – rein lokal, keine Übertragung</td>
                  <td className="px-3 py-2">Bis zur manuellen Löschung</td>
                  <td className="px-3 py-2">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-2 font-semibold text-gray-800">Cookie-Kategorien:</p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li><strong>Notwendig</strong> – technisch erforderlich für den Betrieb (immer aktiv, keine Einwilligung nötig)</li>
            <li><strong>Statistik</strong> – anonymisierte Nutzungsanalyse via Vercel Analytics (kein Cookie, kein personenbezogenes Tracking; Art. 6 Abs. 1 lit. f DSGVO). Nur bei Einwilligung aktiv.</li>
            <li><strong>Marketing</strong> – derzeit nicht im Einsatz. Wird nur mit ausdrücklicher Einwilligung aktiviert.</li>
          </ul>
          <p>
            Du kannst deine Einwilligung jederzeit widerrufen, indem du die Seite neu lädst und im erneut erscheinenden
            Cookie-Banner „Nur notwendige" wählst, oder indem du den localStorage-Eintrag <code className="bg-gray-100 px-1 rounded text-xs">uf365-consent</code>{" "}
            über die Browser-Entwicklertools (F12 → Anwendung → Lokaler Speicher) löschst.
          </p>
        </section>

        {/* 2e – Barrierefreiheits-Widget */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2e. Barrierefreiheits-Widget</h2>
          <p>
            Über das <strong>♿ Barrierefreiheits-Symbol</strong> (unten rechts auf jeder Seite) kannst du
            Anzeigeeinstellungen wie Textgröße, Kontrast oder Farbblindheitsfilter anpassen. Diese
            Einstellungen werden ausschließlich lokal im <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> deines
            Browsers gespeichert (Schlüssel: <code className="bg-gray-100 px-1 rounded text-xs">uf365-a11y</code>) und werden{" "}
            <strong>nicht an unsere Server oder Dritte übertragen</strong>. Es werden keinerlei
            personenbezogene Daten erhoben. Die Einstellungen kannst du jederzeit über
            „Alle Einstellungen zurücksetzen" im Widget löschen.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. Drittanbieter & Dienste</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-800">Vercel Analytics & Speed Insights</span>
              <p>Anonymisierte Performance-Daten; kein personenbezogenes Tracking. Anbieter: Vercel Inc., San Francisco, USA.</p>
            </div>
            <div>
              <span className="font-semibold text-gray-800">specials.de (Ypsilon.Net AG) – Pauschalreisen, Last Minute & All Inclusive</span>
              <p>
                Reiseangebote für Pauschalreisen, Last Minute, All Inclusive und Frühbucher werden
                über die API von specials.de, einer Marke der <strong>Ypsilon.Net AG</strong>,
                geladen. Dabei werden technische Anfragedaten (IP-Adresse, Anfrageparameter) an
                deren Server übertragen. Buchungen erfolgen direkt beim jeweiligen
                Reiseveranstalter. Es gelten die Datenschutzbestimmungen des jeweiligen
                Veranstalters und der Ypsilon.Net AG.
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-800">travianet GmbH – Kreuzfahrten</span>
              <p>
                Kreuzfahrtenangebote und das zugehörige Buchungssystem werden von der{" "}
                <strong>travianet GmbH</strong> (travianet.de) bereitgestellt. Beim Aufruf der
                Kreuzfahrten-Seite und beim Buchungsvorgang werden technische Daten
                (IP-Adresse, Buchungsparameter) an travianet übertragen. Für den
                Buchungsvorgang gelten die Datenschutzbestimmungen der travianet GmbH und des
                jeweiligen Kreuzfahrtveranstalters.
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Tiqets B.V. – Aktivitäten & Erlebnisse</span>
              <p>
                Auf Städtereise- und Aktivitäten-Seiten werden Touren, Tickets und Erlebnisse
                über die API der <strong>Tiqets B.V.</strong>, Singel 540, 1017 AZ Amsterdam,
                Niederlande, geladen. Beim Laden von Tiqets-Inhalten werden technische Anfragedaten
                (IP-Adresse, Seitenparameter) an Tiqets übertragen. Buchungen erfolgen direkt
                auf der Tiqets-Plattform und unterliegen deren{" "}
                <a href="https://www.tiqets.com/de/datenschutzrichtlinie/" target="_blank" rel="noopener noreferrer" className="text-sand-500 hover:underline">
                  Datenschutzrichtlinie
                </a>.
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Unsplash (Bilder)</span>
              <p>Einige Bilder werden von Unsplash-Servern geladen. Dabei kann deine IP an Unsplash (USA) übertragen werden.</p>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Google Fonts / Schriftarten</span>
              <p>Schriften werden lokal eingebettet (self-hosted) – keine Verbindung zu Google-Servern beim Seitenaufruf.</p>
            </div>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Datenübertragung in Drittländer</h2>
          <p>
            Einige der genannten Dienstleister sitzen in den USA. Die Übertragung erfolgt auf
            Grundlage der EU-Standardvertragsklauseln (SCC) sowie des EU-US Data Privacy Framework,
            soweit anwendbar.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. Deine Rechte</h2>
          <p className="mb-2">Du hast gemäß DSGVO folgende Rechte:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-3">
            Zur Ausübung deiner Rechte wende dich an:{" "}
            <a href="mailto:info@urlaubfinder365.de" className="text-sand-500 hover:underline">
              info@urlaubfinder365.de
            </a>
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Die für
            deinen Wohnort zuständige Behörde findest du unter:{" "}
            <a
              href="https://www.bfdi.bund.de/DE/Service/Anschriften/anschriften_table.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand-500 hover:underline"
            >
              bfdi.bund.de
            </a>
            .
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Datensicherheit</h2>
          <p>
            Unsere Website nutzt SSL/TLS-Verschlüsselung (HTTPS). Passwörter werden ausschließlich
            verschlüsselt gespeichert. Wir ergreifen technische und organisatorische Maßnahmen, um
            deine Daten vor unbefugtem Zugriff zu schützen.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Automatisierte Entscheidungsfindung</h2>
          <p>
            Wir treffen keine automatisierten Einzelentscheidungen gemäß Art. 22 DSGVO, die
            rechtliche oder ähnlich erhebliche Auswirkungen auf dich haben. Es findet kein
            automatisiertes Profiling statt.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">9. Änderungen dieser Erklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen – etwa bei
            neuen Diensten oder Gesetzesänderungen. Die jeweils aktuelle Version ist stets unter{" "}
            <Link href="/datenschutz/" className="text-sand-500 hover:underline">
              urlaubfinder365.de/datenschutz/
            </Link>{" "}
            abrufbar. Bei wesentlichen Änderungen informieren wir registrierte Nutzer per E-Mail.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-sm text-gray-500">
        <Link href="/impressum/" className="hover:text-sand-500">Impressum</Link>
        <Link href="/agb/" className="hover:text-sand-500">AGB</Link>
        <Link href="/" className="hover:text-sand-500">Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
