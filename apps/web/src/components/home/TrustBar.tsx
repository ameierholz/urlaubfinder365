import { ShieldCheck, RefreshCcw, BookOpen, HeartHandshake } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Günstigster Preis",
    text: "Täglich vergleichen wir Tausende Angebote – du bekommst immer den besten Preis.",
    color: "#6CC4BA",
  },
  {
    icon: RefreshCcw,
    title: "Täglich aktuell",
    text: "Alle Angebote werden stündlich von offiziellen Reiseveranstaltern aktualisiert.",
    color: "#c49038",
  },
  {
    icon: BookOpen,
    title: "Kostenlose Reiseführer",
    text: "Einreise, Klima, Tipps & mehr – unsere Guides begleiten dich durch deinen Urlaub.",
    color: "#a78bfa",
  },
  {
    icon: HeartHandshake,
    title: "Sicher & einfach",
    text: "Du buchst direkt beim Veranstalter – vertrauenswürdig, sicher und ohne Umwege.",
    color: "#34d399",
  },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {ITEMS.map(({ icon: Icon, title, text, color }) => (
        <div key={title} className="flex flex-col items-center text-center gap-3 group">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:-translate-y-1 duration-300"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <h3 className="font-bold text-gray-900 text-xl">{title}</h3>
          <p className="text-base text-gray-500 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  );
}
