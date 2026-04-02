"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";

export default function WerbungPlacementForm({ id, currentPlacement, currentNotiz }: {
  id: string; currentPlacement: string | null; currentNotiz: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [placement, setPlacement] = useState(currentPlacement ?? "");
  const [notiz, setNotiz]         = useState(currentNotiz ?? "");
  const [saving, setSaving]       = useState(false);
  const router = useRouter();

  const save = async () => {
    setSaving(true);
    const sb = createSupabaseBrowser();
    await (sb.from("werbeplaetze_buchungen" as never)
      .update({ placement_info: placement || null, admin_notiz: notiz || null } as never)
      .eq("id", id));
    setSaving(false);
    setEditing(false);
    router.refresh();
  };

  if (!editing) return (
    <button onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-xl">
      <Pencil className="w-3 h-3" />
      {currentPlacement ? `Platzierung: ${currentPlacement}` : "Platzierung zuweisen"}
    </button>
  );

  return (
    <div className="flex-1 space-y-2 min-w-0 border border-gray-600 rounded-xl p-3 bg-gray-900/50">
      <div>
        <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">Genaue Platzierung</label>
        <input
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          placeholder="z. B. /urlaubsziele/antalya/ — Position 1 oben"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F]"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">Interne Notiz</label>
        <input
          value={notiz}
          onChange={(e) => setNotiz(e.target.value)}
          placeholder="Interne Anmerkung …"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00838F]"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
          <Check className="w-3 h-3" /> Speichern
        </button>
        <button onClick={() => setEditing(false)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-bold transition-colors">
          <X className="w-3 h-3" /> Abbrechen
        </button>
      </div>
    </div>
  );
}
