"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { QrCode, Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

type Result = {
  valid: boolean;
  reason?: string;
  buchungs_nummer?: string;
  kunden_name?: string;
  personen?: number;
  datum?: string;
  angebot?: string;
};

export default function QrScannerClient() {
  const [token, setToken]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const sb = createSupabaseBrowser();

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setResult(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (sb.rpc as any)("verify_qr_token", { token: token.trim() });
    if (error) {
      setResult({ valid: false, reason: error.message });
    } else {
      setResult(data as Result);
    }
    setLoading(false);
  };

  const reset = () => { setToken(""); setResult(null); };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Info */}
      <div className="bg-[#00838F]/8 border border-[#00838F]/20 rounded-2xl p-5 text-sm text-gray-700">
        <p className="font-bold text-[#00838F] mb-2">💡 So funktioniert es</p>
        <ol className="space-y-1 text-gray-600 list-decimal list-inside">
          <li>Kunde zeigt den QR-Code aus seiner Buchungs-E-Mail</li>
          <li>Scanne den Code mit deinem Handy-Scanner (öffnet URL)</li>
          <li>Oder gib den Token manuell ein</li>
          <li>Grüner Haken = Buchung gültig ✅</li>
        </ol>
      </div>

      {/* Manuelle Eingabe */}
      {!result ? (
        <form onSubmit={verify} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-[#00838F]/10 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-[#00838F]" />
            </div>
            <p className="font-bold text-gray-900">Buchungs-Token eingeben</p>
          </div>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#00838F] text-center"
          />
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird geprüft …</> : "Buchung verifizieren →"}
          </button>
        </form>
      ) : (
        <div className={`bg-white rounded-2xl border shadow-sm p-8 text-center ${result.valid ? "border-emerald-200" : "border-red-200"}`}>
          {result.valid ? (
            <>
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-black text-emerald-700 mb-1">Buchung gültig! ✅</h2>
              <p className="text-sm text-gray-500 mb-6">Die Buchung wurde eingelöst.</p>
              <div className="bg-emerald-50 rounded-xl p-4 text-left space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Buchungsnr.</span>
                  <span className="font-bold text-gray-900">{result.buchungs_nummer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kunde</span>
                  <span className="font-bold text-gray-900">{result.kunden_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Personen</span>
                  <span className="font-bold text-gray-900">{result.personen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Datum</span>
                  <span className="font-bold text-gray-900">{result.datum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Angebot</span>
                  <span className="font-bold text-gray-900 text-right max-w-[60%]">{result.angebot}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-black text-red-600 mb-2">Ungültig!</h2>
              <p className="text-sm text-gray-600 bg-red-50 rounded-xl px-4 py-3 mb-6">{result.reason}</p>
            </>
          )}
          <button onClick={reset}
            className="flex items-center gap-2 mx-auto px-6 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
            <RefreshCw className="w-4 h-4" /> Neue Buchung scannen
          </button>
        </div>
      )}
    </div>
  );
}
