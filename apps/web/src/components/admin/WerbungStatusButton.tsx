"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function WerbungStatusButton({ id, newStatus, label, cls }: {
  id: string; newStatus: string; label: string; cls: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setLoading(true);
    const sb = createSupabaseBrowser();
    const extra: Record<string, string | null> = {};
    if (newStatus === "aktiv") {
      const now = new Date();
      extra.starts_at = now.toISOString().split("T")[0];
    }
    await (sb.from("werbeplaetze_buchungen" as never)
      .update({ status: newStatus, ...extra } as never)
      .eq("id", id));
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={handle} disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${cls}`}>
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : label}
    </button>
  );
}
