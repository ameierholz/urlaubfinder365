"use client";

import { useState } from "react";
import { Ticket, X, Loader2, ExternalLink, Printer } from "lucide-react";
import BuchungsTicket, { type TicketDaten } from "@/components/buchung/BuchungsTicket";

export default function AdminTicketModal({ buchungsNummer }: { buchungsNummer: string }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState<TicketDaten | null>(null);

  const oeffnen = async () => {
    setOpen(true);
    if (data) return;
    setLoading(true);
    const res = await fetch(`/api/admin/ticket?nummer=${encodeURIComponent(buchungsNummer)}`);
    if (res.ok) setData(await res.json() as TicketDaten);
    setLoading(false);
  };

  const drucken = () => {
    const ticketEl = document.getElementById("__ticket-print-root");
    if (!ticketEl) return;

    const origin = window.location.origin;

    // Stylesheet-Links mit absoluten URLs
    const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => {
        const href = l.getAttribute("href") ?? "";
        const abs = href.startsWith("/") ? `${origin}${href}` : href;
        return `<link rel="stylesheet" href="${abs}">`;
      })
      .join("");

    const inlineStyles = Array.from(document.querySelectorAll("style"))
      .map((s) => `<style>${s.innerHTML}</style>`)
      .join("");

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0;";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head>${styleLinks}${inlineStyles}</head><body class="bg-white p-0 m-0">${ticketEl.innerHTML}</body></html>`);
    doc.close();

    // Warten bis Styles geladen sind, dann drucken
    iframe.onload = () => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      iframe.contentWindow!.addEventListener("afterprint", () => {
        document.body.removeChild(iframe);
      }, { once: true });
    };
  };

  return (
    <>
      <button
        onClick={oeffnen}
        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
      >
        <Ticket className="w-3 h-3" /> Ticket
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-gray-900 px-4 py-3 rounded-t-3xl border-b border-gray-700">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-gray-400" /> {buchungsNummer}
              </p>
              <div className="flex items-center gap-2">
                {data && (
                  <>
                    <button
                      onClick={() => window.open(`/buchung/ticket/${buchungsNummer}/`, "_blank")}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Neuer Tab
                    </button>
                    <button
                      onClick={drucken}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
                    >
                      <Printer className="w-3.5 h-3.5" /> Drucken
                    </button>
                  </>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inhalt */}
            {loading && (
              <div className="bg-white flex items-center justify-center py-20 rounded-b-3xl">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
              </div>
            )}
            {!loading && data && (
              <div id="__ticket-print-root">
                <BuchungsTicket d={data} compact />
              </div>
            )}
            {!loading && !data && (
              <div className="bg-white py-16 text-center text-gray-400 rounded-b-3xl text-sm">
                Ticket konnte nicht geladen werden.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
