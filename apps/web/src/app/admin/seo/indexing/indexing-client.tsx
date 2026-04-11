"use client";

import { useState, useCallback } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle, Trash2, Package } from "lucide-react";

interface PresetGroup {
  label: string;
  emoji: string;
  description: string;
  urls: string[];
}

interface IndexResult {
  url: string;
  status: "success" | "error";
  message?: string;
  notifyTime?: string;
}

interface ApiResponse {
  total: number;
  success: number;
  error: number;
  type: "URL_UPDATED" | "URL_DELETED";
  results: IndexResult[];
}

interface Props {
  presets: PresetGroup[];
}

export default function IndexingClient({ presets }: Props) {
  const [urlInput, setUrlInput] = useState("");
  const [type, setType] = useState<"URL_UPDATED" | "URL_DELETED">("URL_UPDATED");
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (urls: string[]) => {
      if (urls.length === 0) {
        setError("Bitte mindestens eine URL eingeben.");
        return;
      }
      if (urls.length > 100) {
        setError("Maximal 100 URLs pro Anfrage.");
        return;
      }

      setSubmitting(true);
      setResponse(null);
      setError(null);

      try {
        const res = await fetch("/api/admin/indexing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls, type }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Fehler bei der API-Anfrage");
          return;
        }
        setResponse(data as ApiResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Netzwerk-Fehler");
      } finally {
        setSubmitting(false);
      }
    },
    [type]
  );

  const submitFromInput = () => {
    const urls = urlInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    submit(urls);
  };

  const submitPreset = (preset: PresetGroup) => {
    setUrlInput(preset.urls.join("\n"));
    submit(preset.urls);
  };

  const clearAll = () => {
    setUrlInput("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Manuelle URL-Eingabe */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">URLs zur Indexierung einreichen</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-semibold">Aktion:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "URL_UPDATED" | "URL_DELETED")}
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 focus:border-emerald-500 outline-none"
            >
              <option value="URL_UPDATED">Aktualisiert (neu indexieren)</option>
              <option value="URL_DELETED">Gelöscht (aus Index entfernen)</option>
            </select>
          </div>
        </div>

        <textarea
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Eine URL pro Zeile, max. 100&#10;https://www.urlaubfinder365.de/&#10;https://www.urlaubfinder365.de/urlaubsziele/mallorca/"
          rows={8}
          className="w-full bg-gray-800 border border-gray-700 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:border-emerald-500 outline-none resize-y"
        />

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {urlInput.split("\n").filter((l) => l.trim()).length} URL
            {urlInput.split("\n").filter((l) => l.trim()).length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Leeren
            </button>
            <button
              onClick={submitFromInput}
              disabled={submitting || !urlInput.trim()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              An Google senden
            </button>
          </div>
        </div>
      </div>

      {/* Preset-Gruppen */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Schnell-Pakete
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset) => (
            <div
              key={preset.label}
              className="bg-gray-900 border border-gray-800 hover:border-emerald-700 rounded-xl p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{preset.emoji}</span> {preset.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{preset.description}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {preset.urls.length} URLs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setUrlInput(preset.urls.join("\n"))}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  In Editor laden
                </button>
                <button
                  onClick={() => submitPreset(preset)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Sofort senden
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fehler-Anzeige */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-300">Fehler</p>
            <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Erfolgs-Anzeige */}
      {response && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Ergebnis</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-2xl font-black text-white">{response.total}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total</p>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg p-3">
              <p className="text-2xl font-black text-emerald-400">{response.success}</p>
              <p className="text-xs text-gray-500 mt-0.5">Erfolgreich</p>
            </div>
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-3">
              <p className="text-2xl font-black text-red-400">{response.error}</p>
              <p className="text-xs text-gray-500 mt-0.5">Fehler</p>
            </div>
          </div>

          {/* Detail-Liste */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-900 border-b border-gray-800">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-500 font-semibold uppercase tracking-wider">URL</th>
                  <th className="text-left px-3 py-2 text-gray-500 font-semibold uppercase tracking-wider w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {response.results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-900 hover:bg-gray-900/40">
                    <td className="px-3 py-2 font-mono text-gray-400 text-[11px] truncate max-w-md">
                      {r.url.replace("https://www.urlaubfinder365.de", "")}
                      {r.message && (
                        <span className="block text-red-400 mt-0.5 text-[10px]">{r.message}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {r.status === "success" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-900/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-900/40 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✗ FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
