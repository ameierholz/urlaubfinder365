"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

type Mode = "missing" | "upgrade" | "all";

interface BatchResult {
  total: number;
  batchSize: number;
  remaining: number;
  generated: string[];
  errors: string[];
}

export default function BulkSeoButton({ missingCount }: { missingCount: number }) {
  const [mode, setMode] = useState<Mode>("missing");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: "" });
  const [log, setLog] = useState<{ path: string; ok: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const abortRef = useRef(false);

  const BATCH_SIZE = 5;

  const runBulk = async () => {
    const label = mode === "missing" ? "fehlende Seiten" : mode === "upgrade" ? "Seiten ohne Textblöcke" : "ALLE Seiten (überschreibt bestehende!)";
    if (!confirm(`${label} per KI generieren?\n\nDas kann einige Minuten dauern. Du kannst jederzeit stoppen.`)) return;

    setRunning(true);
    setFinished(false);
    setLog([]);
    abortRef.current = false;

    let totalDone = 0;
    let totalRemaining = 1; // Start

    while (totalRemaining > 0 && !abortRef.current) {
      try {
        const res = await fetch("/api/admin/bulk-generate-seo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, batchSize: BATCH_SIZE }),
        });
        const data: BatchResult = await res.json();

        if (data.total === 0 && totalDone === 0) {
          // Nichts zu tun
          totalRemaining = 0;
          break;
        }

        // Beim ersten Batch: Total setzen
        if (totalDone === 0) {
          setProgress({ done: 0, total: data.total, current: "" });
        }

        // Log aktualisieren
        for (const path of data.generated) {
          setLog((l) => [...l, { path, ok: true }]);
        }
        for (const err of data.errors) {
          setLog((l) => [...l, { path: err, ok: false }]);
        }

        totalDone += data.generated.length + data.errors.length;
        totalRemaining = data.remaining;

        setProgress((p) => ({
          done: totalDone,
          total: data.total,
          current: data.generated[data.generated.length - 1] ?? "",
        }));

        // Kurze Pause zwischen Batches
        if (totalRemaining > 0) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (err) {
        setLog((l) => [...l, { path: `Netzwerkfehler: ${String(err)}`, ok: false }]);
        break;
      }
    }

    setRunning(false);
    setFinished(true);
  };

  const stop = () => { abortRef.current = true; };

  const successCount = log.filter((l) => l.ok).length;
  const errorCount = log.filter((l) => !l.ok).length;
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="mb-6 space-y-3">
      <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-300">Bulk SEO-Generierung</span>
            </div>
            <p className="text-xs text-purple-400/70 mb-3">
              Generiert Meta-Daten, Open Graph UND SEO-Textbl&ouml;cke (Intro, Mitte, Bottom) per KI f&uuml;r alle Seiten.
            </p>

            {/* Modus-Auswahl */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "missing" as Mode, label: `Fehlende (${missingCount})`, desc: "Nur Seiten ohne SEO-Daten" },
                { value: "upgrade" as Mode, label: "Upgrade", desc: "Meta vorhanden, Textblöcke fehlen" },
                { value: "all" as Mode, label: "Alle neu", desc: "Alles überschreiben" },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  disabled={running}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    mode === m.value
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  title={m.desc}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {running ? (
              <button onClick={stop}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
                Stoppen
              </button>
            ) : (
              <button onClick={runBulk}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Sparkles className="w-4 h-4" /> Starten
              </button>
            )}
          </div>
        </div>

        {/* Fortschrittsbalken */}
        {(running || finished) && progress.total > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-purple-300 font-semibold">
                {running ? (
                  <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> {progress.done}/{progress.total}</span>
                ) : (
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fertig</span>
                )}
              </span>
              <span className="text-xs text-purple-400">{pct}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            {progress.current && running && (
              <p className="text-[10px] text-gray-500 mt-1 truncate">Aktuell: {progress.current}</p>
            )}
          </div>
        )}
      </div>

      {/* Ergebnis-Log */}
      {log.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-h-60 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
            <span className="text-xs font-bold text-gray-400">
              {successCount} generiert {errorCount > 0 && `· ${errorCount} Fehler`}
            </span>
            {finished && (
              <button onClick={() => window.location.reload()} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold">
                <RefreshCw className="w-3 h-3" /> Seite neu laden
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-800">
            {log.map((entry, i) => (
              <div key={i} className="px-4 py-1.5 flex items-center gap-2 text-xs">
                {entry.ok
                  ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  : <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />}
                <span className={entry.ok ? "text-gray-300" : "text-red-400"}>{entry.path}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
