"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function BulkSeoButton({ missingCount }: { missingCount: number }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ generated: number; errors: string[] } | null>(null);

  if (missingCount === 0) return null;

  const handleBulk = async () => {
    if (!confirm(`${missingCount} Seiten per KI befüllen? Das kann einige Minuten dauern.`)) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/bulk-generate-seo", { method: "POST" });
      const data = await res.json();
      setResult({ generated: data.generated ?? 0, errors: data.errors ?? [] });
    } catch (err) {
      setResult({ generated: 0, errors: [String(err)] });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">Bulk KI-Generierung</span>
          </div>
          <p className="text-xs text-purple-400/70">{missingCount} Seiten ohne SEO-Daten — alle automatisch per Claude befüllen.</p>
        </div>
        <button onClick={handleBulk} disabled={running}
          className="shrink-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Sparkles className="w-4 h-4" />
          {running ? "Generiert …" : `Alle ${missingCount} befüllen`}
        </button>
      </div>
      {result && (
        <div className={`mt-2 rounded-lg px-4 py-3 text-sm ${result.errors.length === 0 ? "bg-teal-900/40 text-teal-300 border border-teal-700" : "bg-yellow-900/40 text-yellow-300 border border-yellow-700"}`}>
          {result.generated} Seiten generiert. {result.errors.length > 0 && `${result.errors.length} Fehler.`}
          {result.generated > 0 && " Seite neu laden um Ergebnisse zu sehen."}
        </div>
      )}
    </div>
  );
}
