"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ExternalLink } from "lucide-react";

export default function StripeAuszahlungButton({
  auszahlungId,
  betrag,
  hatStripeKonto,
}: {
  auszahlungId: string;
  betrag: number;
  hatStripeKonto: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/auszahlung-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auszahlung_id: auszahlungId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fallback) {
          setError("Anbieter hat kein Stripe-Konto. Bitte manuell überweisen.");
        } else {
          setError(data.error ?? "Fehler beim Transfer");
        }
      } else {
        router.refresh();
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  if (!hatStripeKonto) {
    return (
      <span className="text-[11px] text-gray-500 italic">Kein Stripe-Konto</span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
      >
        <Zap className="w-3.5 h-3.5" />
        {loading ? "Wird überwiesen…" : `${betrag.toFixed(2)} € via Stripe`}
      </button>
      {error && <p className="text-[10px] text-red-400 max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
