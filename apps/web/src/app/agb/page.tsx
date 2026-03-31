import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGB – Allgemeine Nutzungsbedingungen",
  description:
    "Allgemeine Geschäftsbedingungen (AGB) für die Nutzung von Urlaubfinder365.de – Reisevergleich, Reiseführer und Buchungsempfehlungen.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.urlaubfinder365.de/agb/" },
};

export default function AgbPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-gray-900 mb-2">
        Allgemeine Nutzungsbedingungen (AGB)
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Stand: März 2026 · Urlaubfinder365.de
      </p>

      <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 1 Geltungsbereich & Anbieter</h2>
          <p>
            Diese Nutzungsbedingungen gelten für die Nutzung des Online-Portals{" "}
            <strong>urlaubfinder365.de</strong> (nachfolgend „Portal"), betrieben von dem unter{" "}
            <Link href="/impressum/" className="text-sand-500 hover:underline">Impressum</Link>{" "}
            genannten Anbieter. Mit der Nutzung des Portals erkennst du diese Bedingungen an.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 2 Leistungsbeschreibung</h2>
          <p className="mb-3">
            Urlaubfinder365.de ist ein Reisevergleichsportal. Wir stellen tagesaktuell Reiseangebote
            von Drittanbietern dar und verlinken auf deren Buchungsseiten. <strong>Wir sind kein
            Reiseveranstalter</strong> – sämtliche Buchungen werden direkt beim jeweiligen
            Reiseveranstalter abgeschlossen. Für den Vertragsinhalt, Preisänderungen und die
            Durchführung der Reise ist ausschließlich der jeweilige Veranstalter verantwortlich.
          </p>
          <p>
            Die Reiseangebote für Pauschalreisen, Last Minute, All Inclusive und Frühbucher werden
            über <strong>specials.de (Ypsilon.Net AG)</strong> bereitgestellt. Kreuzfahrtenangebote
            und das zugehörige Buchungssystem stammen von der <strong>travianet GmbH</strong>.
            Buchungen über diese Systeme erfolgen direkt mit dem jeweiligen Anbieter – es gelten
            deren Allgemeine Geschäftsbedingungen und Reisebedingungen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 3 Kostenloses Nutzerkonto</h2>
          <p>
            Die Erstellung eines kostenlosen Nutzerkontos ermöglicht das Speichern von
            Lieblingsangeboten. Es besteht keine Kaufverpflichtung. Du kannst dein Konto jederzeit
            löschen lassen (E-Mail an info@urlaubfinder365.de).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 4 Preisangaben & Verfügbarkeit</h2>
          <p>
            Alle angezeigten Preise sind tagesaktuell und stammen direkt von den Reiseveranstaltern.
            Preise verstehen sich pro Person, sofern nicht anders angegeben, inkl. Flug und
            Unterkunft. Da Verfügbarkeiten und Preise sich laufend ändern, kann zum Zeitpunkt der
            Buchung ein abweichender Preis gelten. Maßgeblich ist stets der Preis auf der
            Buchungsseite des Veranstalters.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 5 Affiliate-Hinweis</h2>
          <p>
            Einige Links auf diesem Portal sind Affiliate-Links. Bei einer Buchung über solche Links
            erhalten wir eine Provision vom Veranstalter. Für dich entstehen dadurch keine
            Mehrkosten. Die redaktionelle Auswahl und Darstellung von Angeboten erfolgt unabhängig
            von Provisionen nach Qualitäts- und Preiskriterien.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 6 Haftungsbeschränkung</h2>
          <p className="mb-3">
            Der Anbieter haftet nicht für Schäden, die durch die Nutzung der verlinkten
            Buchungsangebote entstehen. Die Informationen auf diesem Portal werden ohne Gewähr
            auf Richtigkeit und Vollständigkeit bereitgestellt.
          </p>
          <p className="mb-3">
            Die Haftung des Anbieters für leichte Fahrlässigkeit ist – soweit gesetzlich zulässig –
            ausgeschlossen. <strong>Hiervon ausgenommen</strong> ist die Haftung für Schäden aus
            der Verletzung des Lebens, des Körpers oder der Gesundheit, für Schäden aus der Verletzung
            wesentlicher Vertragspflichten (Kardinalpflichten) sowie die Haftung nach dem
            Produkthaftungsgesetz. Bei Verletzung wesentlicher Vertragspflichten durch leichte
            Fahrlässigkeit ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
          </p>
          <p>
            Für Schäden aus Vorsatz und grober Fahrlässigkeit haftet der Anbieter unbeschränkt.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 7 Urheberrecht</h2>
          <p>
            Alle Inhalte (Texte, Bilder, Grafiken, Logos) auf urlaubfinder365.de sind urheberrechtlich
            geschützt. Eine Vervielfältigung oder Nutzung ohne ausdrückliche Genehmigung ist nicht
            gestattet. Reisebilder von Unsplash unterliegen der{" "}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand-500 hover:underline"
            >
              Unsplash-Lizenz
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 8 Änderungen der AGB</h2>
          <p>
            Wir behalten uns vor, diese AGB jederzeit anzupassen. Die aktuelle Version ist stets
            unter urlaubfinder365.de/agb/ abrufbar. Bei wesentlichen Änderungen werden
            registrierte Nutzer per E-Mail informiert.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 9 Anwendbares Recht & Gerichtsstand</h2>
          <p className="mb-3">
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (CISG).
          </p>
          <p>
            Für <strong>Verbraucher</strong> (§ 13 BGB) gilt als Gerichtsstand das Gericht am
            jeweiligen Wohnsitz oder gewöhnlichen Aufenthaltsort des Verbrauchers. Für{" "}
            <strong>Unternehmer und Kaufleute</strong> ist ausschließlicher Gerichtsstand der
            Sitz des Anbieters (74372 Sersheim), soweit gesetzlich zulässig.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 10 Salvatorische Klausel</h2>
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden,
            bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt. Die unwirksame Bestimmung
            gilt als durch eine wirksame Regelung ersetzt, die dem wirtschaftlichen Zweck der
            unwirksamen Bestimmung am nächsten kommt.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-sm text-gray-500">
        <Link href="/impressum/" className="hover:text-sand-500">Impressum</Link>
        <Link href="/datenschutz/" className="hover:text-sand-500">Datenschutz</Link>
        <Link href="/" className="hover:text-sand-500">Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
