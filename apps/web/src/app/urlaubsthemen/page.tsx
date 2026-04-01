import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Urlaubsthemen – Alle Reiseideen auf einen Blick",
  description:
    "Alle Urlaubsthemen entdecken: Adults Only, Familienurlaub, Strandurlaub, Wellness, Städtereisen, Hochzeitsreise, Luxusurlaub und mehr ✓ Täglich aktuelle Pauschalreisen.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsthemen/" },
};

export const revalidate = 3600;

const THEMEN = [
  {
    href: "/urlaubsthemen/adults-only/",
    emoji: "💑",
    label: "Adults Only",
    desc: "Paare & Erwachsene – ruhig, romantisch, exklusiv",
    color: "from-rose-500/80 to-pink-700/80",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/familienurlaub/",
    emoji: "👨‍👩‍👧‍👦",
    label: "Familienurlaub",
    desc: "Kinderclub, Wasserpark & Animation für die ganze Familie",
    color: "from-sky-500/80 to-blue-700/80",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/strandurlaub/",
    emoji: "🏖️",
    label: "Strandurlaub",
    desc: "Traumhotels in bester Strandlage am Meer",
    color: "from-teal-500/80 to-cyan-700/80",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/wellnessurlaub/",
    emoji: "🧖",
    label: "Wellnessurlaub",
    desc: "Spa, Sauna & pure Entspannung für Körper und Geist",
    color: "from-emerald-500/80 to-green-700/80",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/staedtereisen/",
    emoji: "🏙️",
    label: "Städtereisen",
    desc: "Metropolen, Kultur und Gastronomie entdecken",
    color: "from-violet-500/80 to-purple-700/80",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/hochzeitsreise/",
    emoji: "💒",
    label: "Hochzeitsreise",
    desc: "Flitterwochen in 5-Sterne All-Inclusive Resorts",
    color: "from-pink-500/80 to-rose-700/80",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/abenteuerurlaub/",
    emoji: "🧗",
    label: "Abenteuerurlaub",
    desc: "Action, Sport & Outdoor – Tauchen, Wandern, Surfen",
    color: "from-orange-500/80 to-red-700/80",
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/luxusurlaub/",
    emoji: "👑",
    label: "Luxusurlaub",
    desc: "5-Sterne Hotels & Resorts – exklusiv und unvergesslich",
    color: "from-amber-500/80 to-yellow-700/80",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/singlereisen/",
    emoji: "🧳",
    label: "Singlereisen",
    desc: "Solo reisen – neue Menschen kennenlernen",
    color: "from-teal-500/80 to-cyan-700/80",
    img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/aktivurlaub/",
    emoji: "🏃",
    label: "Aktivurlaub",
    desc: "Golf, Tauchen, Surfen & Wandern – Sport pur",
    color: "from-lime-500/80 to-green-700/80",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/kurreisen/",
    emoji: "💧",
    label: "Kurreisen",
    desc: "Heilbäder, Thermalquellen & Naturheilkunde",
    color: "from-cyan-500/80 to-blue-700/80",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=70",
  },
  {
    href: "/urlaubsthemen/seniorenreisen/",
    emoji: "🌟",
    label: "Seniorenreisen",
    desc: "Entspannter Urlaub ab 60 – barrierefrei & komfortabel",
    color: "from-blue-500/80 to-indigo-700/80",
    img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=70",
  },
];

const BUDGET = [
  {
    href: "/urlaubsthemen/budget-bis-500/",
    badge: "🤑",
    label: "Bis 500 €",
    desc: "Günstige Pauschalreisen mit Flug & Hotel",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    textColor: "text-green-800",
  },
  {
    href: "/urlaubsthemen/budget-bis-1000/",
    badge: "💰",
    label: "Bis 1.000 €",
    desc: "Mehr Urlaub für dein Budget",
    color: "bg-sky-50 border-sky-200 hover:border-sky-400",
    textColor: "text-sky-800",
  },
  {
    href: "/urlaubsthemen/budget-bis-1500/",
    badge: "💳",
    label: "Bis 1.500 €",
    desc: "Premium Reisen mit Stil",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    textColor: "text-amber-800",
  },
  {
    href: "/urlaubsthemen/budget-bis-2000/",
    badge: "✨",
    label: "Bis 2.000 €",
    desc: "Luxus zum fairen Preis",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    textColor: "text-purple-800",
  },
];

export default function UrlaubsthemenPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center -mt-24 pt-24 min-h-[320px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,131,143,0.85) 0%, rgba(0,109,120,0.65) 50%, rgba(15,23,42,0.75) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-5">
            🎯 Urlaubsthemen
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Alle Urlaubsthemen –<br />
            <span className="text-[#6CC4BA]">Finde deinen Traumurlaub</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Ob romantischer Adults Only Urlaub, Familienferien mit Kinderclub oder
            Luxusreise im 5-Sterne Resort – hier findest du täglich aktuelle Angebote
            für jedes Urlaubsthema.
          </p>
        </div>
      </div>

      {/* Themen Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Beliebteste <span className="text-[#00838F]">Urlaubsthemen</span>
        </h2>
        <p className="text-gray-500 mb-8">
          Täglich aktualisierte Pauschalreisen mit Flug, Hotel und Transfer – für jeden Urlaubstyp.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {THEMEN.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-44">
                <img
                  src={t.img}
                  alt={t.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-linear-to-t ${t.color}`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-white font-bold text-base leading-tight">{t.label}</span>
                </div>
                <p className="text-white/80 text-xs leading-snug">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            💶 Urlaub nach <span className="text-[#00838F]">Budget</span>
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Reisen nach deinem Preisrahmen – inklusive Flug und Hotel.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BUDGET.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all ${b.color}`}
              >
                <span className="text-3xl mb-2">{b.badge}</span>
                <span className={`font-bold text-base ${b.textColor}`}>{b.label}</span>
                <span className="text-xs text-gray-500 mt-1 leading-snug">{b.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Urlaubsthemen – Der richtige Urlaub für jeden Reisetyp
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Jeder Mensch reist anders – und genau das spiegeln unsere Urlaubsthemen wider.
          Ob du als Paar eine ruhige Auszeit in einem Adults Only Resort suchst, mit der
          Familie in ein Hotel mit Kinderclub fahren möchtest oder einfach den günstigsten
          Strandurlaub innerhalb deines Budgets planst: Bei Urlaubfinder365 findest du
          täglich aktualisierte Pauschalreiseangebote, die perfekt zu deinen Wünschen passen.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Alle angezeigten Hotels haben mindestens eine Mindest-Empfehlungsrate von
          50 % auf HolidayCheck und wurden nach Preis-Leistungs-Verhältnis kuratiert.
          Für Luxusreisen und Hochzeitsreisen liegt die Hürde noch höher – hier zeigen
          wir nur 5-Sterne Hotels mit mindestens 90 % Empfehlungsrate. So kannst du
          sicher sein, dass dein Traumurlaub auch wirklich unvergesslich wird.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Nutze unsere Budget-Filter, um sofort die günstigsten Reisen innerhalb deines
          Preisrahmens zu finden – von günstigen Pauschalreisen unter 500 € bis hin zu
          Premiumreisen bis 2.000 € pro Person inklusive Flug und Hotel. Alle Angebote
          können direkt beim Reiseveranstalter sicher gebucht werden.
        </p>
      </div>

      {/* Internal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-t border-gray-100 pt-8">
        <p className="text-sm font-semibold text-gray-500 mb-4">Mehr entdecken</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/urlaubsarten/pauschalreisen/", label: "✈️ Pauschalreisen" },
            { href: "/urlaubsarten/all-inclusive-urlaub/", label: "🍹 All-Inclusive" },
            { href: "/urlaubsarten/last-minute-urlaub/", label: "⚡ Last-Minute" },
            { href: "/urlaubsarten/fruhbucher-urlaub/", label: "🌅 Frühbucher" },
            { href: "/urlaubsziele/", label: "🌍 Alle Reiseziele" },
            { href: "/last-minute/", label: "🔥 Heutige Deals" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center bg-white border border-gray-200 hover:border-[#00838F] hover:bg-[#00838F]/5 text-gray-700 hover:text-[#00838F] text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
