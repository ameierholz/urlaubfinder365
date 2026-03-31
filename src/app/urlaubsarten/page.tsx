import type { Metadata } from "next";
import Link from "next/link";
import LifestyleSection from "@/components/home/LifestyleSection";

export const metadata: Metadata = {
  title: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
  description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsarten/" },
  openGraph: {
    title: "Urlaubsarten – Pauschalreisen, All-Inclusive & mehr",
    description: "Alle Urlaubsarten im Überblick: Pauschalreisen, All-Inclusive, Last-Minute, Frühbucher und mehr.",
    url: "https://www.urlaubfinder365.de/urlaubsarten/",
    type: "website",
  },
};

const arten = [
  { title: "Pauschalreisen", href: "/urlaubsarten/pauschalreisen/", desc: "Flug + Hotel + Transfer – alles inklusive gebucht.", emoji: "✈️" },
  { title: "Frühbucher Urlaub", href: "/urlaubsarten/fruhbucher-urlaub/", desc: "Früh buchen und bis zu 40% sparen.", emoji: "🌅" },
  { title: "All-Inclusive Urlaub", href: "/urlaubsarten/all-inclusive-urlaub/", desc: "Essen, Trinken und mehr – alles inklusive.", emoji: "🍹" },
  { title: "Last-Minute Urlaub", href: "/urlaubsarten/last-minute-urlaub/", desc: "Spontan und günstig – kurzfristige Angebote.", emoji: "⚡" },
  { title: "Super-Last-Minute", href: "/urlaubsarten/super-last-minute-urlaub/", desc: "Innerhalb von 72 Stunden abreisen – maximale Ersparnis.", emoji: "🚀" },
];

export default function UrlaubsartenPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Urlaubsarten – Pauschalreisen, All-Inclusive & mehr</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Von Pauschalreisen über All-Inclusive bis Last-Minute – hier findest du die passende Reiseart.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {arten.map((art) => (
          <Link
            key={art.href}
            href={art.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-4xl mb-3">{art.emoji}</div>
            <h2 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{art.title}</h2>
            <p className="text-gray-500 text-sm">{art.desc}</p>
          </Link>
        ))}
      </div>

      {/* Lifestyle-Section */}
      <div className="mt-16">
        <div className="mb-8">
          <p className="text-sand-500 text-xs font-bold uppercase tracking-widest mb-2">Für jeden das Richtige</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Dein Lifestyle, deine Wahl!</h2>
        </div>
        <LifestyleSection />
      </div>
    </div>
  );
}
