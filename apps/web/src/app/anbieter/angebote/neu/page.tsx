import { createSupabaseServer } from "@/lib/supabase-server";
import AngebotForm from "@/components/anbieter/AngebotForm";
import Link from "next/link";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Neues Angebot | Anbieter-Portal" };

export default async function NeuesAngebotPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profil } = await supabase
    .from("anbieter_profile").select("id").eq("user_id", user!.id).maybeSingle();

  const anbieter_id = (profil as { id: string } | null)?.id ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Neues Angebot anlegen</h1>
        <p className="text-gray-500 text-sm mt-1">Erstelle eine neue Tour oder Aktivität für den Marktplatz.</p>
      </div>
      <AngebotForm anbieter_id={anbieter_id} />

      {/* Werbeplatz-Teaser */}
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="font-black text-teal-900 text-sm">Mehr Sichtbarkeit für dein Angebot</p>
            <p className="text-xs text-teal-700 mt-0.5">
              Buche einen Werbeplatz und erscheine prominent auf der Startseite, Stadtseiten oder Themenseiten — ab 49 €/Monat.
            </p>
          </div>
        </div>
        <Link
          href="/anbieter/werbeplatz/"
          className="shrink-0 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          Werbeplatz buchen
        </Link>
      </div>
    </div>
  );
}
