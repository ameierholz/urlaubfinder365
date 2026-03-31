import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sand-900">
        Datenschutzerklärung
      </h1>

      <div className="prose prose-sand max-w-none space-y-6 text-sand-700">
        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            1. Datenschutz auf einen Blick
          </h2>
          <h3 className="font-semibold text-sand-800">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber,
            was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
            Website besuchen. Personenbezogene Daten sind alle Daten, mit
            denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            2. Verantwortliche Stelle
          </h2>
          <p>
            {/* TODO: Echte Angaben eintragen */}
            [Vor- und Nachname / Firmenname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ und Ort]
            <br />
            E-Mail: [E-Mail-Adresse]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            3. Datenerfassung auf dieser Website
          </h2>
          <h3 className="font-semibold text-sand-800">Cookies</h3>
          <p>
            Unsere Website verwendet Cookies. Das sind kleine Textdateien,
            die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen
            uns dabei, unser Angebot nutzerfreundlicher und sicherer zu
            machen.
          </p>
          <h3 className="font-semibold text-sand-800">
            Kontaktformular / Registrierung
          </h3>
          <p>
            Wenn Sie sich bei uns registrieren, speichern wir die von Ihnen
            eingegebenen Daten (E-Mail-Adresse, Benutzername) zur
            Vertragsdurchführung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            4. Analyse-Tools und Werbung
          </h2>
          <h3 className="font-semibold text-sand-800">Vercel Analytics</h3>
          <p>
            Wir nutzen Vercel Analytics zur anonymen Auswertung des
            Nutzerverhaltens. Es werden keine personenbezogenen Daten
            erhoben und keine Cookies gesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            5. Ihre Rechte
          </h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung,
            Löschung und Einschränkung der Verarbeitung Ihrer
            personenbezogenen Daten (Art. 15–18 DSGVO), sowie das Recht auf
            Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch (Art. 21
            DSGVO).
          </p>
        </section>
      </div>
    </div>
  );
}
