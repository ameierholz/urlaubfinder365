import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Buchung erfolgreich | Urlaubfinder365", robots: { index: false, follow: false } };

interface Props { searchParams: Promise<{ buchung?: string }> }

export default async function BuchungErfolgPage({ searchParams }: Props) {
  const { buchung } = await searchParams;
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Buchung bestätigt!</h1>
        {buchung && (
          <p className="text-sm text-gray-500 mb-2">Buchungsnummer: <strong className="text-gray-800">{buchung}</strong></p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          Deine Zahlung war erfolgreich. Du erhältst in Kürze eine Bestätigungs-E-Mail.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/" className="bg-[#1db682] hover:bg-[#18a070] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            Zum Dashboard
          </Link>
          <Link href="/marktplatz/" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
            Weitere Aktivitäten entdecken
          </Link>
        </div>
      </div>
    </div>
  );
}
