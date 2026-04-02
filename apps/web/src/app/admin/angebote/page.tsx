import { createSupabaseServer } from "@/lib/supabase-server";
import AngebotStatusToggle from "@/components/admin/AngebotStatusToggle";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Angebote | Admin" };

const STATUS_INFO: Record<string, { label: string; cls: string }> = {
  entwurf:    { label: "Entwurf",    cls: "bg-gray-800 text-gray-400" },
  aktiv:      { label: "✅ Aktiv",   cls: "bg-emerald-900/40 text-emerald-400" },
  pausiert:   { label: "⏸ Pausiert", cls: "bg-amber-900/40 text-amber-400" },
  archiviert: { label: "Archiviert", cls: "bg-red-900/40 text-red-400" },
};

export default async function AdminAngebotePage() {
  const supabase = await createSupabaseServer();
  const { data: angebote } = await supabase
    .from("angebote")
    .select("id, titel, ziel, preis, status, anbieter_id, created_at")
    .order("created_at", { ascending: false });

  const { data: anbieter } = await supabase.from("anbieter_profile").select("id, name");
  const anbieterMap = Object.fromEntries((anbieter ?? []).map((a: { id: string; name: string }) => [a.id, a.name]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Alle Angebote</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {(angebote ?? []).map((a: {
            id: string; titel: string; ziel: string; preis: number; status: string; anbieter_id?: string; created_at: string;
          }) => {
            const st = STATUS_INFO[a.status] ?? STATUS_INFO.entwurf;
            return (
              <div key={a.id} className="flex items-center gap-4 flex-wrap hover:bg-gray-800/50 transition-colors">
                <Link href={`/admin/angebote/${a.id}/`} className="flex-1 flex items-center gap-4 px-6 py-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{a.titel}</p>
                    <p className="text-xs text-gray-500">{a.ziel} · {Number(a.preis).toFixed(2)} € · {anbieterMap[a.anbieter_id ?? ""] ?? "–"}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </Link>
                <div className="pr-6 shrink-0">
                  <AngebotStatusToggle angebotId={a.id} currentStatus={a.status} />
                </div>
              </div>
            );
          })}
          {(angebote ?? []).length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500 text-sm">Noch keine Angebote vorhanden.</p>
          )}
        </div>
      </div>
    </div>
  );
}
