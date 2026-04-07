"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { appendIbeLang } from "@/lib/ibe-locale";

/**
 * Ypsilon.net / specials.de Pauschalreise-Suchbox
 * Embed-Code: <div id="ypsnet-ibe" data-src="..."></div>
 *             <script src="https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js"></script>
 */
export default function YpsnetSearchBox() {
  const locale = useLocale();
  const src = appendIbeLang(
    "https://api.specials.de/component/searchBoxMix.html?access=7bb55d1b6095e63fb7c09e46579c4120",
    locale,
  );

  return (
    <div className="w-full">
      <div id="ypsnet-ibe" data-src={src} />
      <Script
        src="https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
