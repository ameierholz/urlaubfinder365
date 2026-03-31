"use client";

import Script from "next/script";

/**
 * Ypsilon.net / specials.de Pauschalreise-Suchbox
 * Embed-Code: <div id="ypsnet-ibe" data-src="..."></div>
 *             <script src="https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js"></script>
 */
export default function YpsnetSearchBox() {
  return (
    <div className="w-full">
      <div
        id="ypsnet-ibe"
        data-src="https://api.specials.de/component/searchBoxPackage.html?access=7bb55d1b6095e63fb7c09e46579c4120"
      />
      <Script
        src="https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
