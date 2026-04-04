import Link from "next/link";
import type { Metadata } from "next";
import { Sun, Home, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Seite nicht gefunden (404) | Urlaubfinder365",
  description: "Die gesuchte Seite existiert nicht mehr. Finde hier günstige Pauschalreisen, Last-Minute Angebote und Urlaubsinspirationen auf Urlaubfinder365.",
  robots: { index: false, follow: true },
};

const popularLinks = [
  { href: "/last-minute/", label: "Last-Minute Angebote" },
  { href: "/urlaubsziele/antalya/", label: "Türkei Urlaub" },
  { href: "/urlaubsziele/mallorca/", label: "Mallorca Urlaub" },
  { href: "/urlaubsziele/kreta/", label: "Griechenland Urlaub" },
  { href: "/urlaubsarten/pauschalreisen/", label: "Pauschalreisen" },
  { href: "/urlaubsguides/", label: "Urlaubsführer" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
      {/* Logo / Branding */}
      <div className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-8">
        <Sun className="w-8 h-8 text-sand-400" />
        Urlaubfinder<span className="text-sand-400">365</span>
      </div>

      {/* 404 */}
      <div className="text-8xl font-extrabold text-sand-400 leading-none mb-4">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Diese Seite gibt es leider nicht mehr
      </h1>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        Die gesuchte Seite wurde möglicherweise gelöscht, umbenannt oder verschoben.
        Aber keine Sorge – dein Traumurlaub wartet trotzdem!
      </p>

      {/* CTA */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white font-semibold rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" />
          Zur Startseite
        </Link>
        <Link
          href="/last-minute/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-sand-400 text-sand-600 font-semibold rounded-xl hover:bg-sand-50 transition-colors"
        >
          🔥 Last-Minute Deals
        </Link>
      </div>

      {/* Popular Links */}
      <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Beliebte Urlaubsziele & Themen
        </p>
        <ul className="space-y-2">
          {popularLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between text-gray-700 hover:text-sand-600 hover:bg-sand-50 px-3 py-2 rounded-lg transition-colors group"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sand-500 transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
