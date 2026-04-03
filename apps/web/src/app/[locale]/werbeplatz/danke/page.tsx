import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = { title: "Werbeplatz gebucht | Urlaubfinder365", robots: { index: false } };

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-teal-600" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-3">Zahlung erfolgreich!</h1>
        <p className="text-gray-600 leading-relaxed mb-2">
          Dein Werbeplatz wurde gebucht. Wir prüfen deinen Inhalt und schalten ihn
          innerhalb von <strong>24 Stunden</strong> frei.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Du erhältst eine Bestätigungs-E-Mail sobald dein Spot live geht.
          Stripe schickt dir automatisch eine Rechnung.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 mb-8 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">Was passiert als nächstes?</p>
          <p>✅ Zahlung bei Stripe hinterlegt</p>
          <p>🔍 Unser Team prüft deinen Werbeinhalt</p>
          <p>📧 Du bekommst eine E-Mail bei Freigabe</p>
          <p>🚀 Dein Spot geht live — sichtbar für tausende Reisende</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
