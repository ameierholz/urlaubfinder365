import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sand-900">Impressum</h1>

      <div className="prose prose-sand max-w-none space-y-6 text-sand-700">
        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            Angaben gemäß § 5 TMG
          </h2>
          <p>
            {/* TODO: Echte Angaben eintragen */}
            [Vor- und Nachname / Firmenname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ und Ort]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">Kontakt</h2>
          <p>
            E-Mail: [E-Mail-Adresse]
            <br />
            Telefon: [Telefonnummer]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p>
            [Vor- und Nachname]
            <br />
            [Adresse]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            Haftungsausschluss
          </h2>
          <h3 className="font-semibold text-sand-800">Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
            können wir jedoch keine Gewähr übernehmen.
          </p>
          <h3 className="font-semibold text-sand-800">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
          </p>
        </section>
      </div>
    </div>
  );
}
