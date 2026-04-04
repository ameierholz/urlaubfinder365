import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "📋 AGB – Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen (AGB) von Urlaubfinder365.de ✓ Nutzungsbedingungen ✓ Haftungshinweise ✓ Transparenz.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.urlaubfinder365.de/agb/" },
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
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
            Urlaubfinder365.de ist ein Reisevergleichsportal. Wir stellen tagesaktuell Urlaubsangebote
            von Drittanbietern dar und verlinken auf deren Buchungsseiten. <strong>Wir sind kein
            Reiseveranstalter</strong> – sämtliche Buchungen über externe Reiseveranstalter werden
            direkt beim jeweiligen Veranstalter abgeschlossen. Für den Vertragsinhalt, Preisänderungen
            und die Durchführung der Reise ist ausschließlich der jeweilige Veranstalter verantwortlich.
          </p>
          <p className="mb-3">
            Die Urlaubsangebote für Pauschalreisen, Last Minute, All Inclusive und Frühbucher werden
            über <strong>specials.de (Ypsilon.Net AG)</strong> bereitgestellt. Kreuzfahrtenangebote
            und das zugehörige Buchungssystem stammen von der <strong>travianet GmbH</strong>.
            Buchungen über diese Systeme erfolgen direkt mit dem jeweiligen Anbieter – es gelten
            deren Allgemeine Geschäftsbedingungen und Reisebedingungen.
          </p>
          <p>
            Zusätzlich betreibt Urlaubfinder365.de einen eigenen <strong>Aktivitäten-Marktplatz</strong>{" "}
            (§ 3), über den lokale Touren, Stadtführungen und Erlebnisse gebucht werden können.
            Urlaubfinder365.de handelt dabei ausschließlich als <strong>Vermittler im Namen und auf
            Rechnung des jeweiligen lokalen Anbieters</strong> (offene Stellvertretung gem. § 3a).
            Urlaubfinder365.de ist <strong>kein Reiseveranstalter</strong> im Sinne des § 25 UStG.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">§ 3 Aktivitäten-Marktplatz</h2>

          {/* Stellvertretung — Highlight-Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-xs font-black text-blue-800 uppercase tracking-wide mb-1.5">
              ⚖️ Wichtiger Hinweis: Vermittlertätigkeit & offene Stellvertretung
            </p>
            <p className="text-xs text-blue-900 leading-relaxed">
              Urlaubfinder365.de handelt auf dem Aktivitäten-Marktplatz ausschließlich als{" "}
              <strong>offener Stellvertreter</strong> der jeweiligen Anbieter im Sinne des{" "}
              § 164 BGB. Dies wird dem Kunden bei jeder Buchung ausdrücklich angezeigt.
              Urlaubfinder365.de ist <strong>kein Reiseveranstalter</strong> nach § 25 UStG
              (Margenbesteuerung) und erwirbt die Leistungen nicht im eigenen Namen.
            </p>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">a) Vermittlertätigkeit und offene Stellvertretung</h3>
          <p className="mb-3">
            Urlaubfinder365.de vermittelt auf dem Marktplatz Buchungen von Touren, Stadtführungen,
            Wassersport und weiteren Aktivitäten lokaler Anbieter. Bei allen Buchungen über den
            Marktplatz gilt:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mb-4 text-gray-700">
            <li>
              <strong>Vertragspartner des Kunden</strong> für die gebuchte Aktivität ist
              ausschließlich der jeweilige lokale Anbieter. Der Vertrag kommt unmittelbar zwischen
              dem Kunden und dem Anbieter zustande (§ 164 Abs. 1 BGB).
            </li>
            <li>
              Urlaubfinder365.de ist <strong>nicht Vertragspartner</strong> des Kunden hinsichtlich
              der Leistungserbringung und kein Reiseveranstalter im Sinne des § 651a BGB.
            </li>
            <li>
              Urlaubfinder365.de zieht den Gesamtbetrag <strong>im Namen und auf Rechnung des
              Anbieters</strong> als dessen offener Stellvertreter ein (§ 164 Abs. 2 BGB). Der
              Anbieter ist auf der Buchungsbestätigung und dem Rechnungsbeleg namentlich ausgewiesen.
            </li>
            <li>
              Die Vermittlungsprovision von <strong>15 % des Buchungsbetrags</strong> verbleibt bei
              Urlaubfinder365.de als Entgelt für die Vermittlungsleistung. Diese
              Vermittlungsleistung unterliegt dem regulären Umsatzsteuersatz gemäß § 3a UStG.
            </li>
            <li>
              Die umsatzsteuerliche Behandlung der Aktivität selbst obliegt dem jeweiligen Anbieter
              nach den Steuergesetzen seines Wohnsitz- bzw. Niederlassungslandes.
              Urlaubfinder365.de unterliegt für diese Leistungen <strong>nicht der Margen­besteuerung
              nach § 25 UStG</strong>.
            </li>
          </ul>

          <h3 className="font-semibold text-gray-800 mb-2">b) Buchungen durch Kunden</h3>
          <p className="mb-3">
            Über den Marktplatz unter urlaubfinder365.de/marktplatz/ können Nutzer Aktivitäten bei
            verifizierten lokalen Anbietern buchen. Mit Absenden und Bestätigung einer Buchungsanfrage
            kommt ein verbindlicher Vertrag <strong>zwischen dem Kunden und dem jeweiligen Anbieter</strong>{" "}
            zustande. Urlaubfinder365.de handelt dabei als offener Stellvertreter des Anbieters (§ 3a).
          </p>
          <p className="mb-2"><strong>Stornierung durch den Kunden:</strong></p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li>Bis 48 Stunden vor dem gebuchten Termin: kostenlose Stornierung</li>
            <li>Weniger als 48 Stunden vor dem Termin: 100 % des Buchungspreises werden fällig</li>
            <li>Stornierungen sind schriftlich per E-Mail an info@urlaubfinder365.de einzureichen</li>
          </ul>
          <p className="mb-3">
            <strong>Buchungsnachweis:</strong> Nach erfolgreicher Zahlung erhält der Kunde einen
            Buchungs-Voucher mit individuellem QR-Code per E-Mail. Der Voucher weist den Anbieter
            als Leistungserbringer aus und ist vor Ort vorzuzeigen.
          </p>
          <p className="mb-3">
            <strong>Zahlungsabwicklung:</strong> Die Zahlung erfolgt über Stripe als offener
            Stellvertreter des Anbieters. Auf der Buchungsbestätigung und dem Zahlungsbeleg ist der
            Anbieter als Leistungserbringer ausgewiesen. Es gelten zudem die AGB von Stripe, Inc.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">c) Bedingungen für Anbieter</h3>
          <p className="mb-3">
            Lokale Guides und Veranstalter können sich unter urlaubfinder365.de/marktplatz/anbieter-werden/
            kostenlos registrieren und nach Freischaltung Angebote einstellen. Mit der Registrierung
            erkennt der Anbieter ausdrücklich an, dass Urlaubfinder365.de als sein offener
            Stellvertreter gegenüber Kunden auftritt und Zahlungen in seinem Namen einzieht.
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li><strong>Provision:</strong> 15 % des Buchungsbetrags je erfolgreicher Buchung als Vermittlungsentgelt</li>
            <li><strong>Auszahlung:</strong> 85 % des Buchungsbetrags werden nach Abschluss der Aktivität ausgezahlt</li>
            <li><strong>Rechnungsstellung:</strong> Urlaubfinder365.de stellt die Kundenrechnung im Namen des Anbieters aus (Gutschriftverfahren); der Anbieter ist auf allen Belegen als Leistungserbringer ausgewiesen</li>
            <li><strong>Steuerliche Pflichten:</strong> Der Anbieter ist für die korrekte Versteuerung der erhaltenen Leistungserlöse nach dem Recht seines Wohnsitz-/Niederlassungslandes eigenverantwortlich</li>
            <li><strong>Freischaltung:</strong> Urlaubfinder365.de behält sich vor, Anbieterprofile abzulehnen oder zu sperren, insbesondere bei Verstößen gegen diese AGB oder Qualitätsmängeln</li>
            <li><strong>Anbieter-Pflichten:</strong> Anbieter sind für die ordnungsgemäße Durchführung der Leistungen verantwortlich und stellen sicher, dass alle erforderlichen Genehmigungen, Versicherungen und behördlichen Zulassungen vorliegen</li>
            <li><strong>Haftung:</strong> Urlaubfinder365.de haftet nicht für Schäden durch die Leistungserbringung des lokalen Anbieters</li>
            <li><strong>Stornierung durch Anbieter:</strong> Bei anbieterseitiger Stornierung wird die volle Rückerstattung an den Kunden veranlasst; dem Anbieter wird eine Gebühr von 20 % des entgangenen Buchungsbetrags berechnet</li>
          </ul>
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
