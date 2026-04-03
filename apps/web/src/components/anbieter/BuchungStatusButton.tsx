"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";

export default function BuchungStatusButton({ buchungId, status }: { buchungId: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const stornieren = async () => {
    setLoading(true);
    await sb.from("buchungen" as never).update({ status: "storniert" } as never).eq("id", buchungId);
    // Stornierung-Email via API
    await fetch("/api/email/stornierung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buchung_id: buchungId }),
    });
    setLoading(false);
    setConfirm(false);
    router.refresh();
  };

  if (status === "ausstehend") {
    return (
      <p className="text-xs text-amber-600 font-medium">
        Zahlung noch nicht eingegangen — Ticket wird automatisch nach Zahlung bestätigt.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors border border-red-200"
        >
          <XCircle className="w-3.5 h-3.5" /> Stornieren
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Wirklich stornieren?</span>
          <button
            onClick={stornieren}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ja, stornieren"}
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Abbrechen
          </button>
        </div>
      )}
    </div>
  );
}
