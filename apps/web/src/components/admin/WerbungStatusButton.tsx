"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function WerbungStatusButton({ id, newStatus, label, cls }: {
  id: string; newStatus: string; label: string; cls: string;
}) {
  const [loading, setLoading] = useState(false);
  const [grund, setGrund] = useState("");
  const [showGrund, setShowGrund] = useState(false);
  const router = useRouter();

  const isAblehnen = newStatus === "storniert";

  const execute = async (g?: string) => {
    setLoading(true);
    try {
      await fetch("/api/admin/werbeplatz-aktion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          aktion: isAblehnen ? "ablehnen" : "freigeben",
          grund: g ?? undefined,
        }),
      });
      router.refresh();
    } finally {
      setLoading(false);
      setShowGrund(false);
    }
  };

  // Ablehnen: erst Grund abfragen
  if (isAblehnen) {
    if (showGrund) {
      return (
        <div className="flex items-center gap-2">
          <input
            value={grund}
            onChange={(e) => setGrund(e.target.value)}
            placeholder="Ablehnungsgrund (optional)"
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 w-56"
          />
          <button
            onClick={() => execute(grund || undefined)}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-800 text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ablehnen & Stornieren"}
          </button>
          <button onClick={() => setShowGrund(false)} className="text-xs text-gray-500 hover:text-gray-300">
            Abbrechen
          </button>
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowGrund(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${cls}`}
      >
        {label}
      </button>
    );
  }

  // Freigeben: direkt ausführen
  return (
    <button
      onClick={() => execute()}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${cls}`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : label}
    </button>
  );
}
