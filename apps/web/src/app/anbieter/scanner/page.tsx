import QrScannerClient from "@/components/anbieter/QrScannerClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "QR-Scanner | Anbieter-Portal" };

export default function ScannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">QR-Code Scanner</h1>
        <p className="text-gray-500 text-sm mt-1">Scanne den Buchungs-QR-Code des Kunden vor Ort zur Verifizierung.</p>
      </div>
      <QrScannerClient />
    </div>
  );
}
