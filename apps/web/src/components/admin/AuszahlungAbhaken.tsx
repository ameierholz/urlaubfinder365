"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export default function AuszahlungAbhaken({ auszahlungId }: { auszahlungId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const abhaken = async () => {
    setLoading(true);
    await sb.from("auszahlungen" as never)
      .update({ status: "ueberwiesen", ueberwiesen_at: new Date().toISOString() } as never)
      .eq("id", auszahlungId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button onClick={abhaken} disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 hover:bg-emerald-900/60 disabled:opacity-50 text-emerald-400 text-[10px] font-bold rounded-lg transition-colors border border-emerald-800">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
      Als überwiesen markieren
    </button>
  );
}
