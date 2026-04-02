"use client";

import { useState } from "react";
import ReiseplanerForm from "./ReiseplanerForm";
import ReiseplanerErgebnis from "./ReiseplanerErgebnis";
import { Sparkles, Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReiseplanerClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plan, setPlan]       = useState<any | null>(null);
  const [ziel, setZiel]       = useState("");
  const [loading, setLoading] = useState(false);

  const handleNeu = () => {
    setPlan(null);
    setZiel("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-16 h-16 rounded-full bg-[#00838F]/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#00838F] animate-pulse" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900 text-lg">KI plant deine Reise …</p>
          <p className="text-gray-500 text-sm mt-1">Das dauert ca. 10–20 Sekunden</p>
        </div>
        <Loader2 className="w-6 h-6 text-[#00838F] animate-spin" />
      </div>
    );
  }

  if (plan) {
    return <ReiseplanerErgebnis plan={plan} ziel={ziel} onNeu={handleNeu} />;
  }

  return (
    <ReiseplanerForm
      onResult={(p, z) => { setPlan(p); setZiel(z); }}
      onLoading={setLoading}
      loading={loading}
    />
  );
}
