import { createSupabaseServer } from "@/lib/supabase-server";
import AnbieterStatusButton from "@/components/admin/AnbieterStatusButton";
import { BadgeCheck, ChevronRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Anbieter verwalten | Admin" };

const STATUS_INFO: Record<string, { label: string; cls: string }> = {
  ausstehend: { label: "⏳ Ausstehend", cls: "bg-amber-900/40 text-amber-400" },
  aktiv:      { label: "✅ Aktiv",      cls: "bg-emerald-900/40 text-emerald-400" },
  gesperrt:   { label: "🚫 Gesperrt",  cls: "bg-red-900/40 text-red-400" },
};

export default async function AdminAnbieterPage() {
  const supabase = await createSupabaseServer();
  const { data: anbieter } = await supabase
    .from("anbieter_profile")
    .select("id, name, email, standort, kategorie, status, verifiziert, created_at")
    .order("created_at", { ascending: false });

  const ausstehend = (anbieter ?? []).filter((a: { status: string }) => a.status === "ausstehend").length;
  const aktiv      = (anbieter ?? []).filter((a: { status: string }) => a.status === "aktiv").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-white">Anbieter verwalten</h1>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Users className="w-4 h-4" />
            <span className="font-bold">{aktiv}</span>
            <span className="text-gray-500">aktiv</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="font-bold">{ausstehend}</span>
            <span className="text-gray-500">ausstehend</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {(anbieter ?? []).map((a: {
            id: string; name: string; email: string; standort?: string;
            kategorie?: string; status: string; verifiziert: boolean; created_at: string;
          }) => {
            const st = STATUS_INFO[a.status] ?? STATUS_INFO.ausstehend;
            return (
              <div key={a.id} className="flex items-center gap-4 flex-wrap hover:bg-gray-800/50 transition-colors">
                <Link href={`/admin/anbieter/${a.id}/`} className="flex-1 flex items-center gap-4 px-6 py-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#00838F]/20 flex items-center justify-center text-[#00838F] font-black text-sm shrink-0">
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{a.name}</p>
                      {a.verifiziert && <BadgeCheck className="w-4 h-4 text-[#00838F] shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{a.email} · {a.standort} · {a.kategorie}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </Link>
                <div className="pr-6 shrink-0">
                  <AnbieterStatusButton anbieterId={a.id} currentStatus={a.status} currentVerifiziert={a.verifiziert} />
                </div>
              </div>
            );
          })}
          {(anbieter ?? []).length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500 text-sm">Noch keine Anbieter registriert.</p>
          )}
        </div>
      </div>
    </div>
  );
}
