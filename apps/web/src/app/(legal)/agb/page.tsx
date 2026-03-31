import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  robots: { index: false, follow: false },
};

export default function AGBPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sand-900">
        Allgemeine Geschäftsbedingungen
      </h1>

      <div className="prose prose-sand max-w-none space-y-6 text-sand-700">
        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            § 1 Geltungsbereich
          </h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung
            der Website urlaubfinder365.de und der zugehörigen mobilen
            Anwendungen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            § 2 Leistungsbeschreibung
          </h2>
          <p>
            Urlaubfinder365 ist ein Vergleichsportal für Reiseangebote. Wir
            vermitteln keine Reisen direkt, sondern leiten Nutzer an
            Reiseveranstalter und Buchungsplattformen weiter. Der
            Reisevertrag kommt ausschließlich zwischen dem Nutzer und dem
            jeweiligen Anbieter zustande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            § 3 Nutzerkonto
          </h2>
          <p>
            Für bestimmte Funktionen (Favoriten, Preisalarme,
            Reiseberichte) ist eine kostenlose Registrierung erforderlich.
            Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten
            verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            § 4 Affiliate-Links
          </h2>
          <p>
            Diese Website enthält Affiliate-Links zu Reiseanbietern. Bei
            einer Buchung über diese Links erhalten wir eine Provision. Der
            Preis für den Nutzer ändert sich dadurch nicht.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sand-900">
            § 5 Haftung
          </h2>
          <p>
            Die auf urlaubfinder365.de angezeigten Preise und
            Verfügbarkeiten werden von Drittanbietern übermittelt. Wir
            übernehmen keine Gewähr für deren Richtigkeit und Aktualität.
          </p>
        </section>
      </div>
    </div>
  );
}
