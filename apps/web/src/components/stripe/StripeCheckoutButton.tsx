"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

type CheckoutType = "buchung" | "werbung";

export default function StripeCheckoutButton({
  id,
  typ,
  label = "Jetzt bezahlen",
  className,
}: {
  id: string;
  typ: CheckoutType;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = typ === "buchung"
        ? "/api/stripe/checkout-buchung"
        : "/api/stripe/checkout-werbung";
      const body = typ === "buchung"
        ? { buchung_id: id }
        : { werbung_id: id };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Fehler beim Checkout");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className ?? "flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"}
      >
        <CreditCard className="w-4 h-4" />
        {loading ? "Weiterleitung zu Stripe…" : label}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
