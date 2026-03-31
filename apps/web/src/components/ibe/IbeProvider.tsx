"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveTrip, unsaveTrip } from "@/lib/firestore";

/** Renders the global IBE modal + loads FontAwesome + IBE engine script.
 *  Must be included once in the root layout. */
export default function IbeProvider() {
  const { user } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ibeSaveOffer = async (btn: HTMLButtonElement, e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) { window.location.href = "/login"; return; }
      const ok = btn.dataset.ok;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const offer = ok ? (window as any)._ibeOffers?.[ok] : null;
      if (!offer) return;
      const isSaved = btn.classList.contains("ibe-heart-saved");
      const docId = btn.dataset.docId;
      btn.style.pointerEvents = "none";
      try {
        if (isSaved && docId) {
          await unsaveTrip(user.uid, docId, offer.product_code);
          btn.classList.remove("ibe-heart-saved");
          btn.dataset.docId = "";
        } else {
          const id = await saveTrip(user.uid, offer);
          btn.classList.add("ibe-heart-saved");
          btn.dataset.docId = id;
        }
      } catch { /* ignore */ } finally {
        btn.style.pointerEvents = "";
      }
    };
  }, [user]);

  return (
    <>
      {/* Global booking modal – manipulated directly by ibe-engine.js */}
      {/* FontAwesome + Plus Jakarta Sans werden async über FontAwesomeLoader geladen */}
      <div
        id="ibe-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Buchungsansicht"
        style={{ display: "none" }}
      >
        <div id="ibe-modal-box">
          <div className="ibe-modal-header">
            <div className="ibe-modal-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6CC4BA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16 }}
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span id="ibe-modal-title-text">
                Sichere SSL-Verschlüsselung bei Urlaubfinder365
              </span>
            </div>
            {/* onclick handled by global ibeCloseModal from ibe-engine.js */}
            <button
              className="ibe-modal-close"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => (window as any).ibeCloseModal?.()}
              aria-label="Schließen"
            >
              &#x2715;
            </button>
          </div>

          <div style={{ position: "relative", flexGrow: 1, background: "#f8fafc" }}>
            <div id="ibe-modal-loader" className="ibe-modal-loader">
              <span style={{ marginLeft: 8 }}>Angebote werden geladen...</span>
            </div>
            <iframe
              id="ibe-modal-iframe"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Buchungsportal"
              onLoad={() => {
                const loader = document.getElementById("ibe-modal-loader");
                if (loader) loader.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* IBE Engine – vanilla JS from /public/scripts/ */}
      <Script
        src="/scripts/ibe-engine.js"
        strategy="afterInteractive"
        onLoad={() => {
          // After script loads, scan for any teaser elements already in DOM
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any)._ibeScan?.();
        }}
      />
    </>
  );
}
