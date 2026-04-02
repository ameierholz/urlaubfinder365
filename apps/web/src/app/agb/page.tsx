import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "📋 AGB – Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen (AGB) von Urlaubfinder365.de ✓ Nutzungsbedingungen ✓ Haftungshinweise ✓ Transparenz.",
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
        Stand: April 2026 · Urlaubfinder365.de
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
            Reiseveranstalter</strong> – sämtliche Buchungen über externe Reiseveranstalter werden
            direkt beim jeweiligen Veranstalter abgeschlossen. Für den Vertragsinhalt, Preisänderungen
            und die Durchführung der Reise ist ausschließlich der jeweilige Veranstalter verantwortlich.
          </p>
          <p className="mb-3">
            Die Reiseangebote für Pauschalreisen, Last Minute, All Inclusive und Frühbucher werden
            über <strong>specials.de (Ypsilon.Net AG)</strong> bereitgestellt. Kreuzfahrtenangebote
            und das zugehörige Buchungssystem stammen von der <strong>travianet GmbH</strong>.
            Buchungen über diese Systeme erfolgen direkt mit dem jeweiligen Anbieter – es gelten
            deren Allgemeine Geschäftsbedingungen und Reisebedingungen.
          </p>
          <p>
            Zusätzlich betreibt Urlaubfinder365.de einen eigenen <strong>Aktivitäten-Marktplatz</strong>{" "}
            (§ 3), über den lokale Touren, Stadtführungen und Erlebnisse direkt gebucht werden können.
            Für diesen Bereich gilt Urlaubfinder365.de als Vertragspartner des Kunden; die Leistung
            wird durch den jeweiligen lokalen Anbieter erbracht.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 3 Aktivitäten-Marktplatz</h2>

          <h3 className="font-semibold text-gray-800 mb-2">a) Buchungen durch Kunden</h3>
          <p className="mb-3">
            Über den Marktplatz unter urlaubfinder365.de/marktplatz/ können Nutzer Touren,
            Stadtführungen, Wassersport und weitere Aktivitäten bei verifizierten lokalen Anbietern
            buchen. Mit Absenden einer Buchungsanfrage kommt ein verbindlicher Vertrag zwischen dem
            Kunden und Urlaubfinder365.de zustande. Die Leistungserbringung erfolgt durch den
            jeweiligen lokalen Anbieter.
          </p>
          <p className="mb-2"><strong>Stornierung durch den Kunden:</strong></p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li>Bis 48 Stunden vor dem gebuchten Termin: kostenlose Stornierung</li>
            <li>Weniger als 48 Stunden vor dem Termin: 100 % des Buchungspreises werden fällig</li>
            <li>Stornierungen sind schriftlich per E-Mail an info@urlaubfinder365.de einzureichen</li>
          </ul>
          <p className="mb-3">
            <strong>Buchungsnachweis:</strong> Nach erfolgreicher Bezahlung erhält der Kunde einen
            Buchungs-Voucher mit individuellem QR-Code per E-Mail. Dieser Voucher ist vor Ort beim
            Anbieter vorzuzeigen und gilt als Leistungsnachweis.
          </p>
          <p className="mb-3">
            <strong>Zahlungsabwicklung:</strong> Die Zahlung erfolgt über unseren Zahlungsdienstleister
            Stripe. Alle Zahlungsdaten werden verschlüsselt übertragen und nicht auf unseren Servern
            gespeichert. Es gelten die AGB von Stripe, Inc.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">b) Bedingungen für Anbieter</h3>
          <p className="mb-3">
            Lokale Guides und Veranstalter können sich unter urlaubfinder365.de/marktplatz/anbieter-werden/
            kostenlos registrieren und nach Freischaltung durch Urlaubfinder365.de Angebote einstellen.
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li><strong>Provision:</strong> 15 % des Buchungspreises (inkl. MwSt.) je erfolgreicher Buchung</li>
            <li><strong>Auszahlung:</strong> 85 % des Buchungspreises werden nach Abschluss der Aktivität ausgezahlt</li>
            <li><strong>Freischaltung:</strong> Urlaubfinder365.de behält sich vor, Anbieterprofile abzulehnen oder zu sperren, insbesondere bei Verstößen gegen diese AGB oder bei Qualitätsmängeln</li>
            <li><strong>Anbieter-Pflichten:</strong> Anbieter sind für die ordnungsgemäße Durchführung der beworbenen Leistungen verantwortlich und stellen sicher, dass alle erforderlichen Genehmigungen, Versicherungen und behördlichen Zulassungen vorliegen</li>
            <li><strong>Haftung des Anbieters:</strong> Urlaubfinder365.de haftet nicht für Schäden, die durch die Leistungserbringung des lokalen Anbieters entstehen</li>
            <li><strong>Stornierung durch Anbieter:</strong> Bei vom Anbieter verursachten Stornierungen wird die volle Rückerstattung an den Kunden veranlasst; dem Anbieter wird eine Gebühr von 20 % des entgangenen Buchungsbetrags berechnet</li>
          </ul>
          <p>
            Mit der Registrierung als Anbieter erkennt dieser die vorliegenden AGB sowie die
            gesonderten Anbieter-Vereinbarungen an, die ihm bei der Registrierung zugehen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 4 Kostenloses Nutzerkonto</h2>
          <p>
            Die Erstellung eines kostenlosen Nutzerkontos ermöglicht das Speichern von
            Lieblingsangeboten. Es besteht keine Kaufverpflichtung. Du kannst dein Konto jederzeit
            löschen lassen (E-Mail an info@urlaubfinder365.de).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 5 Preisangaben & Verfügbarkeit</h2>
          <p>
            Alle angezeigten Preise sind tagesaktuell und stammen direkt von den Reiseveranstaltern.
            Preise verstehen sich pro Person, sofern nicht anders angegeben, inkl. Flug und
            Unterkunft. Da Verfügbarkeiten und Preise sich laufend ändern, kann zum Zeitpunkt der
            Buchung ein abweichender Preis gelten. Maßgeblich ist stets der Preis auf der
            Buchungsseite des Veranstalters.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 6 Affiliate-Hinweis</h2>
          <p>
            Einige Links auf diesem Portal sind Affiliate-Links. Bei einer Buchung über solche Links
            erhalten wir eine Provision vom Veranstalter. Für dich entstehen dadurch keine
            Mehrkosten. Die redaktionelle Auswahl und Darstellung von Angeboten erfolgt unabhängig
            von Provisionen nach Qualitäts- und Preiskriterien.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 7 Haftungsbeschränkung</h2>
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
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 8 Urheberrecht</h2>
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
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 9 Änderungen der AGB</h2>
          <p>
            Wir behalten uns vor, diese AGB jederzeit anzupassen. Die aktuelle Version ist stets
            unter urlaubfinder365.de/agb/ abrufbar. Bei wesentlichen Änderungen werden
            registrierte Nutzer per E-Mail informiert.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 10 Anwendbares Recht & Gerichtsstand</h2>
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
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 11 Salvatorische Klausel</h2>
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
