"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AnbieterStatusButton({
  anbieterId, currentStatus, currentVerifiziert,
}: { anbieterId: string; currentStatus: string; currentVerifiziert: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const update = async (status: string, verifiziert?: boolean) => {
    setLoading(status);
    await sb.from("anbieter_profile" as never)
      .update({ status, ...(verifiziert !== undefined ? { verifiziert } : {}) } as never)
      .eq("id", anbieterId);
    setLoading(null);
    router.refresh();
  };

  const BTN = "text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40";

  return (
    <div className="flex gap-1.5 flex-wrap">
      {currentStatus !== "aktiv" && (
        <button onClick={() => update("aktiv", true)} disabled={!!loading}
          className={`${BTN} bg-emerald-600 hover:bg-emerald-700 text-white`}>
          {loading === "aktiv" ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "✅ Freischalten"}
        </button>
      )}
      {currentStatus !== "gesperrt" && (
        <button onClick={() => update("gesperrt", false)} disabled={!!loading}
          className={`${BTN} bg-red-900/50 hover:bg-red-900 text-red-400`}>
          {loading === "gesperrt" ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "🚫 Sperren"}
        </button>
      )}
      {!currentVerifiziert && currentStatus === "aktiv" && (
        <button onClick={() => update("aktiv", true)} disabled={!!loading}
          className={`${BTN} bg-[#00838F]/20 hover:bg-[#00838F]/40 text-[#00838F]`}>
          Verifizieren
        </button>
      )}
    </div>
  );
}
