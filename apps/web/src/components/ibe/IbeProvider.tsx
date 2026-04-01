"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveTrip, unsaveTrip } from "@/lib/supabase-db";

/** Renders the global IBE modal + loads FontAwesome + IBE engine script.
 *  Must be included once in the root layout. */
export default function IbeProvider() {
  const { user } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ibeSaveOffer = async (btn: HTMLButtonElement, e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        // Tooltip statt Redirect – zeigt Hinweis direkt am Button
        const existing = document.getElementById("ibe-login-tip");
        if (existing) existing.remove();
        const tip = document.createElement("div");
        tip.id = "ibe-login-tip";
        tip.textContent = "Zum Merken bitte anmelden oder registrieren";
        tip.style.cssText =
          "position:fixed;background:#1f2937;color:#fff;font-size:12px;line-height:1.4;" +
          "padding:8px 12px;border-radius:8px;z-index:99999;pointer-events:none;" +
          "max-width:210px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.35);" +
          "white-space:normal;";
        document.body.appendChild(tip);
        const rect = btn.getBoundingClientRect();
        const left = Math.max(8, Math.min(rect.left + rect.width / 2 - 105, window.innerWidth - 218));
        tip.style.left = left + "px";
        tip.style.top = Math.max(8, rect.top - tip.offsetHeight - 10) + "px";
        setTimeout(() => tip.remove(), 3000);
        return;
      }
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

          {/* Trust bar – always visible, independent of title text */}
          <div className="ibe-trust-bar">
            <span className="ibe-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              SSL-verschlüsselt
            </span>
            <span className="ibe-trust-sep">·</span>
            <span className="ibe-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              Sichere Buchung
            </span>
            <span className="ibe-trust-sep">·</span>
            <span className="ibe-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              24/7 Kundenservice
            </span>
            <span className="ibe-trust-sep">·</span>
            <span className="ibe-trust-item ibe-trust-brand">Urlaubfinder<strong>365</strong></span>
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
