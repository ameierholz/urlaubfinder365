import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Werbeplatz gebucht | Anbieter-Portal", robots: { index: false, follow: false } };

export default function WerbungErfolgPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="text-6xl mb-4">📢</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Werbeplatz gebucht!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Deine Zahlung war erfolgreich. Wir schalten deinen Werbeplatz innerhalb von 24 Stunden frei
          und melden uns per E-Mail.
        </p>
        <Link href="/anbieter/" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
          Zum Anbieter-Portal
        </Link>
      </div>
    </div>
  );
}
