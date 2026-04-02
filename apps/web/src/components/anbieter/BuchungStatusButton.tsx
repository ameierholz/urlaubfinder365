"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BuchungStatusButton({ buchungId }: { buchungId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const update = async (status: string) => {
    setLoading(status);
    await sb.from("buchungen" as never).update({ status } as never).eq("id", buchungId);
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => update("bestaetigt")}
        disabled={!!loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
      >
        {loading === "bestaetigt" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
        Bestätigen
      </button>
      <button
        onClick={() => update("storniert")}
        disabled={!!loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-bold rounded-xl transition-colors border border-red-200"
      >
        {loading === "storniert" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
        Stornieren
      </button>
    </div>
  );
}
