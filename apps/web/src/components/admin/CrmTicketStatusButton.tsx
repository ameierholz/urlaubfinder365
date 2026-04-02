"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function CrmTicketStatusButton({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cycle: Record<string, string> = { offen: "in_bearbeitung", in_bearbeitung: "erledigt", erledigt: "offen" };
  const next = cycle[currentStatus] ?? "offen";

  const labels: Record<string, { label: string; cls: string }> = {
    offen:           { label: "Offen",          cls: "bg-amber-900/40 text-amber-400 hover:bg-amber-900/60" },
    in_bearbeitung:  { label: "In Bearbeitung", cls: "bg-blue-900/40 text-blue-400 hover:bg-blue-900/60" },
    erledigt:        { label: "✓ Erledigt",     cls: "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60" },
  };
  const { label, cls } = labels[currentStatus] ?? labels.offen;

  const handleClick = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowser();
    await supabase.from("admin_crm_tickets").update({ status: next }).eq("id", ticketId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button onClick={handleClick} disabled={loading}
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${cls} flex items-center gap-1`}>
      {currentStatus === "erledigt" && <Check className="w-3 h-3" />}
      {loading ? "…" : label}
    </button>
  );
}
