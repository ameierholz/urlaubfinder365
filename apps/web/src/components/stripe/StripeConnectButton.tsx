"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

export default function StripeConnectButton({ complete }: { complete: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/connect-onboarding", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Fehler");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Netzwerkfehler");
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="flex items-center gap-2 bg-violet-900/30 border border-violet-700/50 text-violet-300 text-sm px-4 py-2.5 rounded-xl">
        <Zap className="w-4 h-4" />
        Stripe Connect aktiv ✓
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
      >
        <Zap className="w-4 h-4" />
        {loading ? "Weiterleitung zu Stripe…" : "Mit Stripe verbinden"}
      </button>
      <p className="text-[11px] text-gray-500">
        Einmaliges Onboarding bei Stripe — dauert ca. 5 Minuten.
      </p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
