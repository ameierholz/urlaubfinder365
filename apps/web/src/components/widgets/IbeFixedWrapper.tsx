"use client";

/**
 * IbeFixedWrapper
 *
 * Wraps IbeWidget and prevents it from growing beyond its natural settled
 * height. Fixes the specials.de bug where the IBE iframe expands after the
 * booking modal is closed.
 *
 * Strategy:
 *  1. Let the IBE initialise freely for SETTLE_MS milliseconds.
 *  2. Record the iframe's height at that point as the "natural height".
 *  3. Use a MutationObserver to watch for subsequent inline-style changes on
 *     the iframe. If the height grows beyond naturalHeight + THRESHOLD, force
 *     it back down.
 */

import { useEffect, useRef } from "react";
import IbeWidget from "./IbeWidget";

const SETTLE_MS = 4_000;   // time to let IBE fully initialise
const THRESHOLD = 80;      // px above natural height before we intervene

interface Props {
  dataSrc: string;
  minHeight?: number;
}

export default function IbeFixedWrapper({ dataSrc, minHeight = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let naturalHeight = 0;
    let locked = false;

    // ── Mutation observer on the iframe (once it exists) ─────────────────────
    const iframeMo = new MutationObserver(() => {
      if (!locked || naturalHeight === 0) return;

      const iframe = container.querySelector<HTMLIFrameElement>("iframe");
      if (!iframe) return;

      // Read both the style attribute and the height attribute
      const styleH =
        parseFloat(iframe.style.height) ||
        parseFloat(iframe.getAttribute("height") ?? "0");

      if (styleH > naturalHeight + THRESHOLD) {
        iframe.style.height = `${naturalHeight}px`;
        iframe.setAttribute("height", String(naturalHeight));
      }
    });

    // ── Child observer – start watching iframes once they appear ─────────────
    const childMo = new MutationObserver(() => {
      const iframes = container.querySelectorAll<HTMLIFrameElement>("iframe");
      iframes.forEach((f) => {
        iframeMo.observe(f, {
          attributes: true,
          attributeFilter: ["style", "height"],
        });
      });
    });

    childMo.observe(container, { childList: true, subtree: true });

    // Also observe any iframes already present (unlikely but safe)
    container
      .querySelectorAll<HTMLIFrameElement>("iframe")
      .forEach((f) =>
        iframeMo.observe(f, {
          attributes: true,
          attributeFilter: ["style", "height"],
        })
      );

    // ── After settle period, record the natural height ────────────────────────
    const settleTimer = setTimeout(() => {
      const iframe = container.querySelector<HTMLIFrameElement>("iframe");
      if (iframe) {
        naturalHeight = Math.max(
          parseFloat(iframe.style.height) || 0,
          iframe.offsetHeight,
          minHeight
        );
      } else {
        naturalHeight = minHeight;
      }
      locked = true;
    }, SETTLE_MS);

    return () => {
      clearTimeout(settleTimer);
      iframeMo.disconnect();
      childMo.disconnect();
    };
  }, [minHeight]);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      <IbeWidget dataSrc={dataSrc} />
    </div>
  );
}
