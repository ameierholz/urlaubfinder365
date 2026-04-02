import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zahlung abgebrochen | Urlaubfinder365", robots: { index: false, follow: false } };

export default function BuchungAbgebrochenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Zahlung abgebrochen</h1>
        <p className="text-gray-500 text-sm mb-8">
          Deine Buchung wurde nicht abgeschlossen. Du kannst es jederzeit erneut versuchen.
        </p>
        <Link href="/marktplatz/" className="bg-[#1db682] hover:bg-[#18a070] text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
          Zurück zum Marktplatz
        </Link>
      </div>
    </div>
  );
}
