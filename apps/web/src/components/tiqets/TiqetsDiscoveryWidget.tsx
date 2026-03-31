"use client";

import { useEffect } from "react";

interface Props {
  cityId: string;
  /** "product" → Produktseite | "experience" → Erlebnisseite (alle Varianten einer Attraktion) */
  contentType?: "product" | "experience";
  itemCount?: number;
  campaignName?: string;
}

const PARTNER_ID = "urlaubfinder365-177622";

export default function TiqetsDiscoveryWidget({
  cityId,
  contentType = "product",
  itemCount = 4,
  campaignName,
}: Props) {
  useEffect(() => {
    const existing = document.querySelector('script[src*="widgets.tiqets.com"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://widgets.tiqets.com/loader.js";
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // Wenn Script bereits da: Widget neu initialisieren
      // @ts-ignore
      window.tiqetsWidgets?.reinit?.();
    }
  }, [cityId, contentType]);

  return (
    <div
      // @ts-ignore – custom data attributes
      data-tiqets-widget="discovery"
      data-cards-layout="responsive"
      data-content-type={contentType}
      data-item_count={itemCount}
      data-destination-type="city"
      data-destination-id={cityId}
      data-slug-ids=""
      data-partner={PARTNER_ID}
      {...(campaignName ? { "data-campaign": campaignName } : {})}
    />
  );
}
