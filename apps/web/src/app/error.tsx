"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sun, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Fehler optional an Logging Service schicken
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
      {/* Branding */}
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-8">
        <Sun className="w-8 h-8 text-sand-400" />
        Urlaubfinder<span className="text-sand-400">365</span>
      </div>

      {/* Icon */}
      <div className="text-6xl mb-4">⚠️</div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Etwas ist schiefgelaufen
      </h1>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        Es tut uns leid – ein unerwarteter Fehler ist aufgetreten.
        Bitte versuche es erneut oder kehre zur Startseite zurück.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white font-semibold rounded-xl transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
