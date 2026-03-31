"use client";

import { useEffect } from "react";

interface IbeBoardingPassProps {
  city: string;   // e.g. "Antalya"
  code: string;   // IATA code, e.g. "AYT"
  region?: string; // "turkey" | "eu" | "uae" etc. (auto-detected if omitted)
}

/** Boarding-pass widget: flight cards per departure airport + airline info + destination bar.
 *  Initialized by ibe-engine.js on mount. */
export default function IbeBoardingPass({ city, code, region = "" }: IbeBoardingPassProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._ibeScan?.();
  }, []);

  return (
    <div
      id="ibe-main-engine-root"
      style={{ marginTop: "2rem" }}
      data-city={city}
      data-code={code}
      data-region={region}
    />
  );
}
