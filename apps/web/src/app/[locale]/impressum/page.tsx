import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "📄 Impressum – Urlaubfinder365",
  description: "Impressum und Anbieterkennzeichnung von Urlaubfinder365.de gemäß § 5 TMG.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.urlaubfinder365.de/impressum/" },
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Impressum</h1>
      <p className="text-sm text-gray-500 mb-10">Angaben gemäß § 5 TMG</p>

      <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

        {/* ── Anbieter ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">Anbieter & Verantwortlicher</h2>
          <p className="font-semibold text-gray-900">Urlaubfinder365.de</p>
          <p>
            Andre Meier<br />
            Dieselstraße 18<br />
            74372 Sersheim<br />
            Deutschland
          </p>
        </section>

        {/* ── Kontakt ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:info@urlaubfinder365.de" className="text-sand-500 hover:underline">
              info@urlaubfinder365.de
            </a>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            (Anfragen werden i. d. R. innerhalb von 5 Werktagen beantwortet)
          </p>
        </section>

        {/* ── Umsatzsteuer ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Umsatzsteuer-Information (§ 5 Abs. 1 Nr. 6 TMG)
          </h2>
          <p>
            Gemäß <strong>§ 19 UStG</strong> (Kleinunternehmerregelung) wird keine
            Umsatzsteuer ausgewiesen. Eine Umsatzsteuer-Identifikationsnummer liegt daher
            nicht vor.
          </p>
        </section>

        {/* ── Inhaltlich Verantwortlicher ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV
          </h2>
          <p>
            Andre Meier<br />
            Dieselstraße 18, 74372 Sersheim
          </p>
        </section>

        {/* ── Haftungsausschluss ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">Haftungsausschluss</h2>
          <h3 className="font-semibold text-gray-800 mb-1">Haftung für Inhalte</h3>
          <p className="mb-4">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich.
          </p>
          <h3 className="font-semibold text-gray-800 mb-1">Haftung für Links</h3>
          <p className="mb-4">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich. Zum Zeitpunkt der Verlinkung waren keine
            Rechtsverstöße erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
            Links umgehend entfernen.
          </p>
          <h3 className="font-semibold text-gray-800 mb-1">Urheberrecht</h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        {/* ── Streitschlichtung ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Online-Streitbeilegung (OS-Plattform)
          </h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/main/?event=main.home.show"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand-500 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor
            einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        {/* ── Hinweis Affiliate ── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">Hinweis zu Affiliate-Links</h2>
          <p>
            Einige Links auf dieser Website sind Affiliate- oder Partnerlinks. Wenn du über diese
            Links buchst oder kaufst, erhalten wir eine Provision vom jeweiligen Anbieter – für dich
            entstehen dabei keine Mehrkosten. Diese Einnahmen helfen uns, das Portal kostenlos
            anzubieten.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-sm text-gray-500">
        <Link href="/datenschutz/" className="hover:text-sand-500">Datenschutzerklärung</Link>
        <Link href="/agb/" className="hover:text-sand-500">AGB</Link>
        <Link href="/" className="hover:text-sand-500">Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
