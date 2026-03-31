import { FileText, CreditCard, Globe, Clock, Zap, Heart } from "lucide-react";
import type { ReactNode } from "react";
import type { EntryInfo } from "@/types";

const rows: { icon: ReactNode; label: string; key: keyof EntryInfo }[] = [
  { icon: <FileText className="w-5 h-5" />,    label: "Einreise / Visum",  key: "visa" },
  { icon: <CreditCard className="w-5 h-5" />,  label: "Währung",           key: "currency" },
  { icon: <Globe className="w-5 h-5" />,        label: "Sprache",           key: "language" },
  { icon: <Clock className="w-5 h-5" />,        label: "Zeitzone",          key: "timezone" },
  { icon: <Zap className="w-5 h-5" />,          label: "Strom / Stecker",   key: "voltage" },
  { icon: <Heart className="w-5 h-5" />,        label: "Gesundheit",        key: "health" },
];

interface Props {
  info: EntryInfo;
  destination: string;
}

export default function EntryInfoBox({ info, destination }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Einreise &amp; Reisetipps für {destination}
      </h2>
      <div className="bg-white rounded-3xl border border-sand-100 shadow-sm overflow-hidden">
        {rows.map(({ icon, label, key }, i) => (
          <div
            key={key}
            className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-sand-50/40" : "bg-white"}`}
          >
            <div className="flex-shrink-0 mt-0.5 text-sand-500">{icon}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                {label}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">{info[key]}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
