import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Newsletter bestätigt | Urlaubfinder365",
  description: "Deine Newsletter-Anmeldung wurde erfolgreich bestätigt.",
  robots: { index: false, follow: false },
};

export default async function NewsletterBestaetigtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-teal-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Newsletter bestätigt!
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Vielen Dank! Deine E-Mail-Adresse wurde erfolgreich bestätigt.
          Du erhältst ab sofort unsere besten Reise-Deals, Geheimtipps und
          exklusive Angebote direkt in dein Postfach.
        </p>

        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-teal-700 font-semibold text-sm">
            <Mail className="w-4 h-4" />
            Dein erster Newsletter kommt bald!
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-[#00838F] text-white text-sm font-bold rounded-xl hover:bg-[#006d78] transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/urlaubsziele/"
            className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Urlaubsziele entdecken
          </Link>
        </div>
      </div>
    </div>
  );
}
