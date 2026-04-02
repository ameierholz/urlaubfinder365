"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AngebotStatusToggle({ angebotId, currentStatus }: { angebotId: string; currentStatus: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const set = async (status: string) => {
    setLoading(status);
    await sb.from("angebote" as never).update({ status } as never).eq("id", angebotId);
    setLoading(null);
    router.refresh();
  };

  const BTN = "text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1";

  return (
    <div className="flex gap-1.5">
      {currentStatus !== "aktiv" && (
        <button onClick={() => set("aktiv")} disabled={!!loading} className={`${BTN} bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400`}>
          {loading === "aktiv" ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Aktivieren
        </button>
      )}
      {currentStatus === "aktiv" && (
        <button onClick={() => set("pausiert")} disabled={!!loading} className={`${BTN} bg-amber-900/40 hover:bg-amber-800 text-amber-400`}>
          {loading === "pausiert" ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Pausieren
        </button>
      )}
      {currentStatus !== "archiviert" && (
        <button onClick={() => set("archiviert")} disabled={!!loading} className={`${BTN} bg-red-900/30 hover:bg-red-900/60 text-red-400`}>
          {loading === "archiviert" ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Archivieren
        </button>
      )}
    </div>
  );
}
