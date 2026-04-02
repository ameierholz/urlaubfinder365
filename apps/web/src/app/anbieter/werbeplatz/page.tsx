import WerbeplatzBuchungForm from "@/components/anbieter/WerbeplatzBuchungForm";
import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Werbeplatz buchen | Anbieter-Portal" };

export default async function AnbieterWerbeplatzPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/anbieter/werbeplatz/");

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center shrink-0">
          <Megaphone className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Werbeplatz buchen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Erhöhe deine Sichtbarkeit auf urlaubfinder365.de — wähle ein Paket und buche direkt online.
          </p>
        </div>
      </div>

      {/* Vorteile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "📈", titel: "Mehr Reichweite",    text: "Direkt sichtbar für tausende Reisende" },
          { icon: "⚡", titel: "Sofort buchbar",      text: "Nach Zahlung Freischaltung innerhalb von 24 h" },
          { icon: "🎯", titel: "Zielgenau",           text: "Wähle Regionen, Städte oder Themen" },
        ].map(({ icon, titel, text }) => (
          <div key={titel} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-bold text-gray-900 text-sm">{titel}</p>
            <p className="text-xs text-gray-500 mt-1">{text}</p>
          </div>
        ))}
      </div>

      {/* Buchungsformular */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <WerbeplatzBuchungForm />
      </div>
    </div>
  );
}
