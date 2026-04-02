import { createSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, PackageSearch } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meine Angebote | Anbieter-Portal" };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  entwurf:    { label: "Entwurf",   cls: "bg-gray-100 text-gray-600" },
  aktiv:      { label: "✅ Aktiv",  cls: "bg-emerald-100 text-emerald-700" },
  pausiert:   { label: "⏸ Pausiert", cls: "bg-amber-100 text-amber-700" },
  archiviert: { label: "Archiviert", cls: "bg-red-50 text-red-500" },
};

export default async function AnbieterAngebotePage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile").select("id").eq("user_id", user!.id).maybeSingle();
  const profil = profilRaw as { id: string } | null;

  const { data: angeboteRaw } = await supabase
    .from("angebote")
    .select("id, titel, slug, ziel, preis, status, created_at")
    .eq("anbieter_id", profil?.id ?? "")
    .order("created_at", { ascending: false });
  const angebote = angeboteRaw as Array<{ id: string; titel: string; slug: string; ziel: string; preis: number; status: string; created_at: string }> | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Meine Angebote</h1>
          <p className="text-gray-500 text-sm mt-1">{angebote?.length ?? 0} Angebot{(angebote?.length ?? 0) !== 1 ? "e" : ""} angelegt</p>
        </div>
        <Link href="/anbieter/angebote/neu/"
          className="flex items-center gap-2 bg-[#00838F] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#006d78] transition-colors text-sm">
          <Plus className="w-4 h-4" /> Neues Angebot
        </Link>
      </div>

      {!angebote || angebote.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <PackageSearch className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-gray-900 mb-2">Noch kein Angebot angelegt</h2>
          <p className="text-gray-500 text-sm mb-5">Erstelle dein erstes Angebot und erreiche tausende Reisende.</p>
          <Link href="/anbieter/angebote/neu/"
            className="inline-flex items-center gap-2 bg-[#00838F] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#006d78] transition-colors text-sm">
            <Plus className="w-4 h-4" /> Jetzt anlegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {angebote.map((a) => {
              const st = STATUS_LABEL[a.status] ?? STATUS_LABEL.entwurf;
              return (
                <div key={a.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{a.titel}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.ziel} · ab {Number(a.preis).toFixed(2)} €/Person</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/marktplatz/${a.slug}/`} target="_blank"
                      className="p-2 text-gray-400 hover:text-[#00838F] hover:bg-gray-50 rounded-lg transition-colors" title="Vorschau">
                      {a.status === "aktiv" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Link>
                    <Link href={`/anbieter/angebote/${a.id}/bearbeiten/`}
                      className="p-2 text-gray-400 hover:text-[#00838F] hover:bg-gray-50 rounded-lg transition-colors" title="Bearbeiten">
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
