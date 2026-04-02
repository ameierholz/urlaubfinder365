"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2, Banknote } from "lucide-react";

export default function AuszahlungErstellenButton({
  anbieterId, betrag, buchungsIds,
}: { anbieterId: string; betrag: number; buchungsIds: string[] }) {
  const [loading, setLoading] = useState(false);
  const [referenz, setReferenz] = useState("");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const erstellen = async () => {
    setLoading(true);
    await sb.from("auszahlungen" as never).insert({
      anbieter_id: anbieterId,
      betrag,
      buchungs_ids: buchungsIds,
      status: "offen",
      referenz: referenz || null,
    } as never);
    setLoading(false);
    setShowForm(false);
    router.refresh();
  };

  if (!showForm) return (
    <button onClick={() => setShowForm(true)}
      className="flex items-center gap-1.5 px-4 py-2 bg-[#00838F] hover:bg-[#006d78] text-white text-xs font-bold rounded-xl transition-colors">
      <Banknote className="w-3.5 h-3.5" /> Auszahlung erstellen
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={referenz}
        onChange={(e) => setReferenz(e.target.value)}
        placeholder="Referenz (optional)"
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#00838F] w-40"
      />
      <button onClick={erstellen} disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors">
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "✓ Bestätigen"}
      </button>
      <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-300">Abbrechen</button>
    </div>
  );
}
